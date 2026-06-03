import * as THREE from 'three';
import { randomBetween } from '../utils/random.js';

export class ParticleSystem {
  constructor(scene) {
    this.scene = scene;
    this.particles = [];
    this.geometry = new THREE.SphereGeometry(0.035, 8, 8);
    this.material = new THREE.MeshBasicMaterial({
      color: 0xe8f7ff,
      transparent: true,
      opacity: 0.65
    });
    this.emitAccumulator = 0;
  }

  emitSpray(origin, sprayDirection) {
    this.emitAccumulator += 1;
    if (this.emitAccumulator % 2 !== 0) return;

    for (let i = 0; i < 2; i += 1) {
      const particle = new THREE.Mesh(this.geometry, this.material.clone());
      particle.position.copy(origin).add(sprayDirection.clone().multiplyScalar(0.8));
      particle.velocity = sprayDirection.clone().multiplyScalar(randomBetween(3, 6));
      particle.velocity.x += randomBetween(-0.6, 0.6);
      particle.velocity.y += randomBetween(-0.6, 0.6);
      particle.velocity.z += randomBetween(-0.6, 0.6);
      particle.life = randomBetween(0.35, 0.75);
      this.scene.add(particle);
      this.particles.push(particle);
    }
  }

  update(delta) {
    this.particles.slice().forEach((particle) => {
      particle.life -= delta;
      particle.position.addScaledVector(particle.velocity, delta);
      particle.material.opacity = Math.max(0, particle.life);

      if (particle.life <= 0) {
        this.scene.remove(particle);
        particle.material.dispose();
        this.particles = this.particles.filter((candidate) => candidate !== particle);
      }
    });
  }
}
