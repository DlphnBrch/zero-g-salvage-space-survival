import * as THREE from 'three';

export function createStorageZone(scene) {
  const geometry = new THREE.BoxGeometry(8, 5, 5);
  const material = new THREE.MeshBasicMaterial({
    color: 0x4cdcff,
    transparent: true,
    opacity: 0.16,
    wireframe: false,
    depthWrite: false
  });

  const zone = new THREE.Mesh(geometry, material);
  zone.name = 'Glowing Storage Zone';
  zone.position.set(0, 0, 9.5);
  scene.add(zone);

  const edges = new THREE.EdgesGeometry(geometry);
  const line = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0x9df7ff, transparent: true, opacity: 0.85 })
  );
  zone.add(line);

  const label = new THREE.Mesh(
    new THREE.RingGeometry(2.1, 2.25, 48),
    new THREE.MeshBasicMaterial({ color: 0x8df7ff, transparent: true, opacity: 0.65 })
  );
  label.position.set(0, 0, 2.7);
  zone.add(label);

  return {
    mesh: zone,
    center: zone.position.clone(),
    size: new THREE.Vector3(8, 5, 5)
  };
}
