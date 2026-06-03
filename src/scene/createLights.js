import * as THREE from 'three';

export function createLights(scene) {
  const ambient = new THREE.AmbientLight(0x1d2a4a, 0.5);
  scene.add(ambient);

  const sunLight = new THREE.PointLight(0xfff0c0, 10.5, 950, 0.85);
  sunLight.position.set(-80, 45, -90);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 1024;
  sunLight.shadow.mapSize.height = 1024;
  scene.add(sunLight);

  const sunDirection = new THREE.DirectionalLight(0xfff5d6, 2.1);
  sunDirection.position.set(-80, 45, -90);
  sunDirection.target.position.set(0, 0, 0);
  scene.add(sunDirection);
  scene.add(sunDirection.target);

  const weakFill = new THREE.DirectionalLight(0x6075ff, 0.18);
  weakFill.position.set(40, -20, 30);
  scene.add(weakFill);

  return { ambient, sunLight, sunDirection, weakFill };
}
