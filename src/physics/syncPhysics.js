export function syncMeshToBody(mesh, body) {
  mesh.position.copy(body.position);
  mesh.quaternion.copy(body.quaternion);
}

export function applySelfFriction(body, strength, delta = 1 / 60) {
  const factor = Math.pow(strength, delta * 60);
  body.velocity.scale(factor, body.velocity);
  body.angularVelocity.scale(factor, body.angularVelocity);

  if (body.velocity.lengthSquared() < 0.00001) body.velocity.set(0, 0, 0);
  if (body.angularVelocity.lengthSquared() < 0.00001) body.angularVelocity.set(0, 0, 0);
}
