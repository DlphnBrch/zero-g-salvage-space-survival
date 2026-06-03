import * as THREE from 'three';

export function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

export function formatTime(seconds) {
  const total = Math.floor(seconds);
  const mins = Math.floor(total / 60).toString().padStart(2, '0');
  const secs = (total % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

export function cameraForward(camera) {
  const forward = new THREE.Vector3();
  camera.getWorldDirection(forward);
  return forward.normalize();
}

export function cameraRight(camera) {
  const right = new THREE.Vector3(1, 0, 0);
  right.applyQuaternion(camera.quaternion);
  return right.normalize();
}
