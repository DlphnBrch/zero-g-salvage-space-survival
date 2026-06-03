import * as CANNON from 'cannon-es';

export function createPhysicsWorld() {
  const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, 0, 0)
  });

  world.allowSleep = true;
  world.broadphase = new CANNON.SAPBroadphase(world);

  const defaultMaterial = new CANNON.Material('default');
  const contactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
    friction: 0.0,
    restitution: 0.25
  });

  world.defaultMaterial = defaultMaterial;
  world.addContactMaterial(contactMaterial);

  return world;
}
