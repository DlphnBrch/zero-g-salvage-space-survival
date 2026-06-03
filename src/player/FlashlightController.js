import * as THREE from 'three';

export class FlashlightController {
  constructor(scene, camera, settings) {
    this.camera = camera;
    this.settings = settings;
    this.enabled = true;

    this.light = new THREE.SpotLight(0xddeeff, settings.flashlightBrightness, 55, Math.PI / 7, 0.35, 1.2);
    this.light.castShadow = true;
    this.light.shadow.mapSize.width = 1024;
    this.light.shadow.mapSize.height = 1024;

    this.target = new THREE.Object3D();
    scene.add(this.light);
    scene.add(this.target);
    this.light.target = this.target;
  }

  toggle() {
    this.enabled = !this.enabled;
    this.light.visible = this.enabled;
  }

  update() {
    this.light.intensity = this.enabled ? this.settings.flashlightBrightness : 0;
    this.light.position.copy(this.camera.position);

    const forward = new THREE.Vector3();
    this.camera.getWorldDirection(forward);
    this.target.position.copy(this.camera.position).add(forward.multiplyScalar(10));
  }
}
