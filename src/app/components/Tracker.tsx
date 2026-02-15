'use client';

/**
 * Activity Timeline Tracker Component
 * 
 * Records user interactions as a chronological timeline:
 * - Session start/end
 * - Tab visibility changes
 * - Button/element clicks (with data-track attribute)
 * - Form field focus and submit
 * - API calls (calendar, booking, lead creation)
 * - Section views (via Intersection Observer)
 * 
 * Usage:
 * Add <Tracker /> to your layout
 * Add data-track="action_code" to interactive elements
 * Add data-track-view="view_hero" to sections for scroll tracking
 * 
 * Action codes are defined in the action_types database table.
 * Common codes: mic_start, mic_stop, mode_demo, mode_web, hero_trial, etc.
 * Section view codes: view_hero, view_problem, view_solution, view_pricing, view_faq, etc.
 */

import { useEffect, useRef, useCallback } from 'react';

// Configuration
const TRACKING_ENDPOINT = '/api/tracking/event';
const BATCH_INTERVAL = 3000;  // Send batched actions every 3 seconds
const DEBUG = process.env.NODE_ENV === 'development';
const MAX_QUEUE_SIZE = 500;
const MAX_RETRY_ATTEMPTS = 3;
const MAX_RETRY_DELAY_MS = 30000;

// Action queue for batching
interface QueuedAction {
    action: string;      // Action code (e.g., 'mic_start')
    t_ms: number;        // Milliseconds since session start
    extra?: string;      // Optional extra data
    retryCount?: number; // Retry attempts for failed sends
}

// Global session start time - set once per module load, persists across Strict Mode re-renders
// This is intentional: we want a single session start time even in Strict Mode
const globalSessionStartTime = Date.now();
let globalSessionStartSent = false;

// Shared queue for external trackAction() calls outside the Tracker component tree
const externalActionQueue: QueuedAction[] = [];
let externalFlushTimeout: ReturnType<typeof setTimeout> | null = null;
let isExternalFlushing = false;
let externalPagehideListenerAttached = false;
let externalRetryDelayMs = BATCH_INTERVAL;

function toTransportActions(actions: QueuedAction[]) {
    return actions.map(({ action, t_ms, extra }) => ({ action, t_ms, extra }));
}

function trimQueue(queue: QueuedAction[], queueName: string): void {
    if (queue.length <= MAX_QUEUE_SIZE) return;

    const droppedCount = queue.length - MAX_QUEUE_SIZE;
    queue.splice(0, droppedCount);

    if (DEBUG) {
        console.warn(`[Tracker] Dropped ${droppedCount} oldest ${queueName} actions (queue limit ${MAX_QUEUE_SIZE})`);
    }
}

function enqueueWithLimit(queue: QueuedAction[], action: QueuedAction, queueName: string): void {
    queue.push(action);
    trimQueue(queue, queueName);
}

function requeueFailedWithLimit(queue: QueuedAction[], failedActions: QueuedAction[], queueName: string): void {
    const retryable = failedActions
        .map((action) => ({ ...action, retryCount: (action.retryCount ?? 0) + 1 }))
        .filter((action) => action.retryCount <= MAX_RETRY_ATTEMPTS);

    const droppedForRetries = failedActions.length - retryable.length;
    if (droppedForRetries > 0 && DEBUG) {
        console.warn(`[Tracker] Dropped ${droppedForRetries} ${queueName} actions after max retries`);
    }

    queue.unshift(...retryable);
    trimQueue(queue, queueName);
}

async function flushExternalQueue(): Promise<void> {
    if (isExternalFlushing) return;
    if (externalActionQueue.length === 0) return;

    isExternalFlushing = true;
    const actionsToSend = externalActionQueue.splice(0, externalActionQueue.length);

    try {
        const success = await sendActionsWithFetch(actionsToSend);
        if (!success) {
            requeueFailedWithLimit(externalActionQueue, actionsToSend, 'external');
            externalRetryDelayMs = Math.min(externalRetryDelayMs * 2, MAX_RETRY_DELAY_MS);
            scheduleExternalFlush(externalRetryDelayMs);
            return;
        }

        externalRetryDelayMs = BATCH_INTERVAL;
        if (externalActionQueue.length > 0) {
            scheduleExternalFlush(BATCH_INTERVAL);
        }
    } finally {
        isExternalFlushing = false;
    }
}

function scheduleExternalFlush(delayMs = BATCH_INTERVAL): void {
    if (externalFlushTimeout) return;
    externalFlushTimeout = setTimeout(async () => {
        externalFlushTimeout = null;
        await flushExternalQueue();
    }, delayMs);
}

function attachExternalPagehideFlush(): void {
    if (externalPagehideListenerAttached || typeof window === 'undefined') return;

    window.addEventListener('pagehide', () => {
        if (externalActionQueue.length > 0) {
            sendActionsWithBeacon(externalActionQueue);
            externalActionQueue.length = 0;
        }
    });

    externalPagehideListenerAttached = true;
}

/**
 * Format milliseconds to MM:SS.mmm
 */
function formatTime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const millis = ms % 1000;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`;
}

/**
 * Send actions to tracking API using fetch (for regular batch sends)
 */
async function sendActionsWithFetch(actions: QueuedAction[]): Promise<boolean> {
    if (actions.length === 0) return true;

    try {
        const response = await fetch(TRACKING_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ actions: toTransportActions(actions) }),
            credentials: 'include'  // Include session cookies
        });

        if (!response.ok) {
            if (DEBUG) console.warn('[Tracker] API error:', response.status);
            return false;
        }

        if (DEBUG) {
            console.log('[Tracker] Sent actions:', actions.map(a =>
                `${formatTime(a.t_ms)} ${a.action}${a.extra ? ` (${a.extra})` : ''}`
            ));
        }
        return true;
    } catch (error) {
        if (DEBUG) console.warn('[Tracker] Send failed:', error);
        return false;
    }
}

/**
 * Send actions using sendBeacon with proper Content-Type header
 * Used for page unload and cleanup scenarios where fetch might be cancelled
 */
function sendActionsWithBeacon(actions: QueuedAction[]): boolean {
    if (actions.length === 0) return true;
    
    if (!navigator.sendBeacon) {
        if (DEBUG) console.warn('[Tracker] sendBeacon not available');
        return false;
    }

    // Use Blob with explicit Content-Type for proper server parsing
    const blob = new Blob(
        [JSON.stringify({ actions: toTransportActions(actions) })],
        { type: 'application/json' }
    );
    
    const sent = navigator.sendBeacon(TRACKING_ENDPOINT, blob);
    
    if (DEBUG && sent) {
        console.log('[Tracker] Sent via beacon:', actions.map(a =>
            `${formatTime(a.t_ms)} ${a.action}${a.extra ? ` (${a.extra})` : ''}`
        ));
    }
    
    return sent;
}

/**
 * Tracker Component
 */
export function Tracker() {
    // All state moved to refs to survive Strict Mode re-renders
    const actionQueueRef = useRef<QueuedAction[]>([]);
    const isFlushingRef = useRef(false);
    const batchIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
    
    // Persistent ref for this mounted instance
    const sessionStartSentRef = useRef(false);

    /**
     * Get current timestamp in milliseconds since session start
     */
    const getTimestamp = useCallback((): number => {
        return Date.now() - globalSessionStartTime;
    }, []);

    /**
     * Queue an action for sending
     */
    const queueAction = useCallback((action: string, extra?: string) => {
        const t_ms = getTimestamp();
        
        enqueueWithLimit(actionQueueRef.current, {
            action,
            t_ms,
            extra
        }, 'internal');

        if (DEBUG) {
            console.log(`[Tracker] ${formatTime(t_ms)} ${action}${extra ? ` (${extra})` : ''}`);
        }
    }, [getTimestamp]);

    /**
     * Flush action queue with race condition guard
     */
    const flushActions = useCallback(async () => {
        // Guard against concurrent flush operations
        if (isFlushingRef.current) return;
        if (actionQueueRef.current.length === 0) return;
        
        isFlushingRef.current = true;
        
        // Swap out the queue atomically
        const actionsToSend = [...actionQueueRef.current];
        actionQueueRef.current = [];
        
        try {
            const success = await sendActionsWithFetch(actionsToSend);
            if (!success) {
                requeueFailedWithLimit(actionQueueRef.current, actionsToSend, 'internal');
            }
        } finally {
            isFlushingRef.current = false;
        }
    }, []);

    useEffect(() => {
        // Record session start once per page lifecycle (including Strict Mode remounts)
        if (!sessionStartSentRef.current && !globalSessionStartSent) {
            queueAction('session_start');
            sessionStartSentRef.current = true;
            globalSessionStartSent = true;
        }

        // ========================================
        // Tab Visibility Tracking
        // ========================================
        const handleVisibilityChange = () => {
            if (document.hidden) {
                queueAction('tab_hidden');
            } else {
                queueAction('tab_visible');
            }
        };

        // ========================================
        // Click Tracking (elements with data-track)
        // ========================================
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const trackElement = target.closest('[data-track]') as HTMLElement;
            
            if (trackElement) {
                const actionCode = trackElement.getAttribute('data-track');
                if (actionCode) {
                    // Check for extra data attribute
                    const extraData = trackElement.getAttribute('data-track-extra');
                    queueAction(actionCode, extraData || undefined);
                }
            }
        };

        // ========================================
        // Form Field Focus Tracking
        // ========================================
        const handleFocusIn = (e: FocusEvent) => {
            const target = e.target as HTMLElement;
            
            // Check if the element itself has data-track
            const trackAttr = target.getAttribute('data-track');
            if (trackAttr) {
                queueAction(trackAttr);
                return;
            }
            
            // Check for input/textarea/select with name or id
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
                const inputEl = target as HTMLInputElement;
                const fieldName = inputEl.name || inputEl.id || inputEl.type;
                
                // Map common field names to action codes
                const fieldActionMap: Record<string, string> = {
                    'name': 'form_name_focus',
                    'fullName': 'form_name_focus',
                    'full_name': 'form_name_focus',
                    'email': 'form_email_focus',
                    'workEmail': 'form_email_focus',
                    'work_email': 'form_email_focus',
                    'company': 'form_company_focus',
                    'companyName': 'form_company_focus',
                    'phone': 'form_phone_focus',
                    'phoneNumber': 'form_phone_focus',
                    'date': 'form_date_focus',
                    'preferredDate': 'form_date_focus',
                    'time': 'form_time_focus',
                    'preferredTime': 'form_time_focus',
                };
                
                const actionCode = fieldActionMap[fieldName];
                if (actionCode) {
                    queueAction(actionCode);
                }
            }
        };

        // ========================================
        // Form Submit Tracking - Use sendBeacon for reliability
        // ========================================
        const handleSubmit = (e: Event) => {
            const form = e.target as HTMLFormElement;
            const trackAttr = form.getAttribute('data-track');
            const action = trackAttr || 'form_submit';
            
            const t_ms = getTimestamp();
            
            if (DEBUG) {
                console.log(`[Tracker] ${formatTime(t_ms)} ${action} [beacon - form submit]`);
            }
            
            // Use sendBeacon for reliable delivery during form navigation
            sendActionsWithBeacon([{ action, t_ms }]);
        };

        // ========================================
        // Section View Tracking (Intersection Observer)
        // Tracks sections with data-track-view attribute
        // Only fires once per section per session
        // ========================================
        const viewedSections = new Set<string>();
        let sectionObserver: IntersectionObserver | null = null;

        const setupSectionObserver = () => {
            // Get all elements with data-track-view attribute
            const sections = document.querySelectorAll('[data-track-view]');
            
            if (sections.length === 0) {
                if (DEBUG) console.log('[Tracker] No sections with data-track-view found');
                return;
            }

            sectionObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const element = entry.target as HTMLElement;
                            const viewAction = element.getAttribute('data-track-view');
                            
                            if (viewAction && !viewedSections.has(viewAction)) {
                                viewedSections.add(viewAction);
                                queueAction(viewAction);
                                
                                // Stop observing this element since we only track once
                                sectionObserver?.unobserve(element);
                            }
                        }
                    });
                },
                {
                    threshold: 0.5,  // 50% of section must be visible
                    rootMargin: '0px'
                }
            );

            // Observe all sections
            sections.forEach((section) => {
                sectionObserver?.observe(section);
            });

            if (DEBUG) {
                console.log(`[Tracker] Section observer setup for ${sections.length} sections`);
            }
        };

        // Setup observer after a short delay to ensure DOM is ready
        const observerTimeout = setTimeout(setupSectionObserver, 100);

        // ========================================
        // Batch Action Sending
        // ========================================
        batchIntervalRef.current = setInterval(flushActions, BATCH_INTERVAL);

        // ========================================
        // Page Unload - Send remaining actions + session_end
        // ========================================
        const handleBeforeUnload = () => {
            // Add session_end to queue
            const t_ms = getTimestamp();
            enqueueWithLimit(actionQueueRef.current, { action: 'session_end', t_ms }, 'internal');
            
            // Use sendBeacon with proper Content-Type for reliable delivery on page exit
            if (actionQueueRef.current.length > 0) {
                sendActionsWithBeacon(actionQueueRef.current);
                actionQueueRef.current = [];
            }
        };

        // ========================================
        // Attach Event Listeners
        // ========================================
        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('click', handleClick, true);  // Capture phase
        document.addEventListener('focusin', handleFocusIn);
        document.addEventListener('submit', handleSubmit);
        window.addEventListener('beforeunload', handleBeforeUnload);

        // ========================================
        // Cleanup - Use synchronous sendBeacon
        // ========================================
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('click', handleClick, true);
            document.removeEventListener('focusin', handleFocusIn);
            document.removeEventListener('submit', handleSubmit);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            
            if (batchIntervalRef.current) {
                clearInterval(batchIntervalRef.current);
            }

            // Cleanup section observer
            clearTimeout(observerTimeout);
            if (sectionObserver) {
                sectionObserver.disconnect();
            }

            // Use synchronous sendBeacon for cleanup - async flush won't complete
            if (actionQueueRef.current.length > 0) {
                sendActionsWithBeacon(actionQueueRef.current);
                actionQueueRef.current = [];
            }
        };
    }, [queueAction, getTimestamp, flushActions]);

    // This component renders nothing
    return null;
}

/**
 * Manual tracking function - can be imported and used anywhere
 * 
 * Usage:
 * import { trackAction } from '@/app/components/Tracker';
 * trackAction('mic_start');
 * trackAction('api_calendar', 'booking_request');
 */
export function trackAction(action: string, extra?: string) {
    attachExternalPagehideFlush();

    const t_ms = Date.now() - globalSessionStartTime;
    
    if (DEBUG) {
        console.log(`[Tracker] ${formatTime(t_ms)} ${action}${extra ? ` (${extra})` : ''} [external]`);
    }
    
    enqueueWithLimit(externalActionQueue, { action, t_ms, extra }, 'external');
    scheduleExternalFlush();
}

/**
 * Track action immediately (doesn't wait for batch)
 * Use for critical actions like form submissions
 */
export function trackActionNow(action: string, extra?: string) {
    const t_ms = Date.now() - globalSessionStartTime;
    
    if (DEBUG) {
        console.log(`[Tracker] ${formatTime(t_ms)} ${action}${extra ? ` (${extra})` : ''} [immediate/beacon]`);
    }
    
    sendActionsWithBeacon([{ action, t_ms, extra }]);
}

// Legacy exports for backward compatibility
export const trackEvent = trackAction;
export const trackEventNow = trackActionNow;

export default Tracker;
