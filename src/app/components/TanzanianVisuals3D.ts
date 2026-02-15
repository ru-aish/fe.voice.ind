import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

@customElement('tanzanian-visuals-3d')
export class TanzanianVisuals3D extends LitElement {
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  private composer!: EffectComposer;
  private stick!: THREE.Group;
  private animationFrameId: number | null = null;
  private canvas!: HTMLCanvasElement;
  private onWindowResize: (() => void) | null = null;

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      inset: 0;
      background: #000;
      overflow: hidden;
    }
    canvas {
      width: 100% !important;
      height: 100% !important;
      display: block;
    }
  `;

  protected firstUpdated() {
    this.canvas = this.shadowRoot!.querySelector('canvas') as HTMLCanvasElement;
    this.init();
  }

  private init() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x050505);

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 2, 8);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create the "Animal Stick"
    this.stick = new THREE.Group();
    this.createStick();
    this.scene.add(this.stick);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffccaa, 1.2);
    pointLight.position.set(5, 5, 5);
    this.scene.add(pointLight);

    // Post-processing
    const renderPass = new RenderPass(this.scene, this.camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.5,
      0.4,
      0.85
    );

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderPass);
    this.composer.addPass(bloomPass);

    this.onWindowResize = () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.composer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', this.onWindowResize);
    this.runAnimation();
  }

  private createStick() {
    // Stick base
    const stickGeometry = new THREE.CylinderGeometry(0.15, 0.15, 6, 12);
    const stickMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x111111, // Black
      roughness: 0.9,
      metalness: 0.1
    });
    const stickBase = new THREE.Mesh(stickGeometry, stickMaterial);
    this.stick.add(stickBase);

    // Add animal-like carvings (abstract shapes)
    const animalColor = new THREE.Color(0xfff5f0); // "Orange shade of white"
    const animalMaterial = new THREE.MeshStandardMaterial({ 
      color: animalColor,
      emissive: animalColor,
      emissiveIntensity: 0.2
    });

    for (let i = 0; i < 5; i++) {
      const y = -2 + i * 1.2;
      const carving = new THREE.Group();
      
      // Abstract head
      const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.4, 0.4),
        animalMaterial
      );
      head.position.set(0, 0, 0.15);
      carving.add(head);

      // Abstract ears/horns
      const earGeom = new THREE.ConeGeometry(0.1, 0.3, 4);
      const earL = new THREE.Mesh(earGeom, animalMaterial);
      earL.position.set(-0.15, 0.2, 0.15);
      carving.add(earL);

      const earR = new THREE.Mesh(earGeom, animalMaterial);
      earR.position.set(0.15, 0.2, 0.15);
      carving.add(earR);

      carving.position.y = y;
      carving.rotation.y = (i * Math.PI) / 2.5;
      this.stick.add(carving);
    }

    // Top ornament
    const topGeom = new THREE.SphereGeometry(0.3, 16, 16);
    const top = new THREE.Mesh(topGeom, animalMaterial);
    top.position.y = 3.2;
    this.stick.add(top);
  }

  private runAnimation() {
    this.animationFrameId = requestAnimationFrame(() => this.runAnimation());
    
    if (this.stick) {
      this.stick.rotation.y += 0.01;
      this.stick.position.y = Math.sin(Date.now() * 0.001) * 0.1;
    }

    this.composer.render();
  }

  disconnectedCallback() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.onWindowResize) {
      window.removeEventListener('resize', this.onWindowResize);
    }
    this.renderer.dispose();
    super.disconnectedCallback();
  }

  render() {
    return html`<canvas></canvas>`;
  }
}
