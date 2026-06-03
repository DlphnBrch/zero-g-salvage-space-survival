import * as THREE from 'three';

export function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

export function randomSign() {
  return Math.random() > 0.5 ? 1 : -1;
}

export function randomVectorInShell(minRadius, maxRadius) {
  const dir = new THREE.Vector3(
    randomBetween(-1, 1),
    randomBetween(-0.7, 0.7),
    randomBetween(-1, 1)
  ).normalize();

  return dir.multiplyScalar(randomBetween(minRadius, maxRadius));
}
