import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import spaceshipUrl from '../../spaceship.glb?url';

export function createSpaceship(scene, world) {
  const group = new THREE.Group();
  const gltfLoader = new GLTFLoader();
  gltfLoader.load(spaceshipUrl, (gltf) => {
    group.add(gltf.scene);
  });
  scene.add(group);

  const physicsBody = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Box(new CANNON.Vec3(3.5, 1.5, 6.5)),
    position: new CANNON.Vec3(0, 0, 0)
  });
  world.addBody(physicsBody);
  return group;
}
