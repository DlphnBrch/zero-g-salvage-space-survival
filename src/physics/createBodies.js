import * as CANNON from 'cannon-es';

export function createSphereBody({ radius = 1, mass = 1, position }) {
  const body = new CANNON.Body({
    mass,
    shape: new CANNON.Sphere(radius),
    position: new CANNON.Vec3(position.x, position.y, position.z),
    linearDamping: 0,
    angularDamping: 0.01
  });
  return body;
}

export function createBoxBody({ size, mass = 1, position }) {
  const body = new CANNON.Body({
    mass,
    shape: new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2)),
    position: new CANNON.Vec3(position.x, position.y, position.z),
    linearDamping: 0,
    angularDamping: 0.01
  });
  return body;
}

export function createCylinderBody({ radiusTop = 0.45, radiusBottom = 0.45, height = 1.4, mass = 1, position }) {
  const body = new CANNON.Body({
    mass,
    shape: new CANNON.Cylinder(radiusTop, radiusBottom, height, 12),
    position: new CANNON.Vec3(position.x, position.y, position.z),
    linearDamping: 0,
    angularDamping: 0.01
  });
  return body;
}
