import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { PLAYER_START } from '../utils/constants.js';
import { cameraForward, cameraRight } from '../utils/math.js';
import { applySelfFriction } from '../physics/syncPhysics.js';

export class PlayerController {
  constructor(camera, world, input, gameState, settings, particleSystem) {
    this.camera = camera;
    this.world = world;
    this.input = input;
    this.gameState = gameState;
    this.settings = settings;
    this.particleSystem = particleSystem;

    this.pitch = 0;
    this.yaw = Math.PI;
    this.mouseSensitivity = 0.0022;
    this.throwCharge = 0;
    this.throwCharging = false;
    this.heldItem = null;

    this.body = new CANNON.Body({
      mass: 4,
      shape: new CANNON.Sphere(0.8),
      position: new CANNON.Vec3(PLAYER_START.x, PLAYER_START.y, PLAYER_START.z),
      linearDamping: 0,
      angularDamping: 0
    });
    this.world.addBody(this.body);
  }

  reset() {
    this.body.position.set(PLAYER_START.x, PLAYER_START.y, PLAYER_START.z);
    this.body.velocity.set(0, 0, 0);
    this.body.angularVelocity.set(0, 0, 0);
    this.camera.position.set(PLAYER_START.x, PLAYER_START.y, PLAYER_START.z);
    this.pitch = 0;
    this.yaw = Math.PI;
    this.heldItem = null;
    this.throwCharge = 0;
    this.throwCharging = false;
  }

  setHeldItemShadows(item, enabled) {
    item?.mesh?.traverse((child) => {
      if (!child.isMesh) return;

      if (!child.userData.shadowState) {
        child.userData.shadowState = {
          castShadow: child.castShadow,
          receiveShadow: child.receiveShadow
        };
      }

      if (enabled) {
        child.castShadow = child.userData.shadowState.castShadow;
        child.receiveShadow = child.userData.shadowState.receiveShadow;
        return;
      }

      child.castShadow = false;
      child.receiveShadow = false;
    });
  }

  setHeldItem(item) {
    this.heldItem = item;
    if (!item) return;
    item.held = true;
    this.setHeldItemShadows(item, false);
    item.body.velocity.set(0, 0, 0);
    item.body.angularVelocity.set(0, 0, 0);
    item.body.collisionResponse = false;
    this.throwCharge = 0;
    this.throwCharging = false;
  }

  dropHeldItem() {
    if (!this.heldItem) return null;
    const item = this.heldItem;
    item.held = false;
    this.setHeldItemShadows(item, true);
    item.body.collisionResponse = true;
    this.heldItem = null;
    this.throwCharge = 0;
    this.throwCharging = false;
    return item;
  }

  throwHeldItem() {
    if (!this.heldItem) return null;

    const item = this.heldItem;
    const forward = cameraForward(this.camera);
    const holdPosition = this.getHeldItemPosition(item);
    const maxCharge = this.settings.maxThrowCharge;
    const charge = Math.min(maxCharge, Math.max(this.settings.minThrowCharge, this.throwCharge));
    const throwSpeed = this.settings.throwSpeedMultiplier * charge;

    item.held = false;
    this.setHeldItemShadows(item, true);
    item.body.collisionResponse = true;
    this.heldItem = null;

    item.body.position.set(holdPosition.x, holdPosition.y, holdPosition.z);

    item.body.velocity.set(
      this.body.velocity.x + forward.x * throwSpeed,
      this.body.velocity.y + forward.y * throwSpeed,
      this.body.velocity.z + forward.z * throwSpeed
    );
    item.body.angularVelocity.set(0, 0, 0);
    item.body.angularDamping = this.settings.itemAngularDamping;
    item.body.sleepState = CANNON.Body.AWAKE;
    item.body.wakeUp();

    this.throwCharge = 0;
    this.throwCharging = false;
    return item;
  }

  getHeldItemPosition(item) {
    const scale = item?.mesh?.userData?.definition?.scale ?? 1;
    const forward = cameraForward(this.camera);
    const right = cameraRight(this.camera);
    const down = new THREE.Vector3(0, -1, 0).applyQuaternion(this.camera.quaternion).normalize();
    const distance = this.settings.holdDistance + scale * 0.9;

    return this.camera.position
      .clone()
      .add(forward.multiplyScalar(distance))
      .add(right.multiplyScalar(0.65 * scale))
      .add(down.multiplyScalar(0.45 * scale));
  }

  applyThrust(direction, delta, multiplier = 1, fuelCost = this.settings.movementFuelCost) {
    if (this.gameState.fuel <= 0) return;

    const fuelAmount = fuelCost * multiplier * delta;
    if (!this.gameState.useFuel(fuelAmount)) return;

    const force = this.settings.playerThrustForce * multiplier;
    this.body.applyForce(
      new CANNON.Vec3(direction.x * force, direction.y * force, direction.z * force),
      this.body.position
    );

    this.particleSystem?.emitSpray(this.camera.position, direction.clone().multiplyScalar(-1));
  }

  updateLook() {
    this.yaw -= this.input.mouseDelta.x * this.mouseSensitivity;
    this.pitch -= this.input.mouseDelta.y * this.mouseSensitivity;
    this.pitch = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, this.pitch));

    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = this.yaw;
    this.camera.rotation.x = this.pitch;
  }

  updateMovement(delta) {
    if (this.gameState.gameOver) return;

    const forward = cameraForward(this.camera);
    const right = cameraRight(this.camera);
    const up = new THREE.Vector3(0, 1, 0);
    const thrust = new THREE.Vector3();

    if (this.input.isDown('KeyW')) thrust.add(forward);
    if (this.input.isDown('KeyS')) thrust.sub(forward);
    if (this.input.isDown('KeyD')) thrust.add(right);
    if (this.input.isDown('KeyA')) thrust.sub(right);

    if (this.input.isDown('KeyX')) thrust.add(up);
    if (this.input.isDown('KeyZ')) thrust.sub(up);

    if (thrust.lengthSq() > 0) {
      thrust.normalize();
      const boost = this.input.isDown('AltLeft') || this.input.isDown('AltRight')
        ? this.settings.boostMultiplier
        : 0.8;
      this.applyThrust(thrust, delta, boost, this.settings.movementFuelCost);
    }

    if (!this.heldItem && (this.input.mouseDown || this.input.isDown('Space'))) {
      this.applyThrust(
        forward.clone().multiplyScalar(-1),
        delta,
        1.15,
        this.settings.extinguisherFuelCost
      );
    }
  }

  updateHeldItem(delta) {
    if (!this.heldItem) return;

    const holdPosition = this.getHeldItemPosition(this.heldItem);

    this.heldItem.body.position.set(holdPosition.x, holdPosition.y, holdPosition.z);
    this.heldItem.body.velocity.set(0, 0, 0);
    this.heldItem.body.angularVelocity.set(0, 0, 0);
    this.heldItem.body.quaternion.copy(this.camera.quaternion);
    this.heldItem.mesh.position.copy(this.heldItem.body.position);
    this.heldItem.mesh.quaternion.copy(this.camera.quaternion);

    if (this.input.mouseJustDown) {
      this.throwCharging = true;
      this.throwCharge = 0;
    }

    if (this.throwCharging && this.input.mouseDown) {
      this.throwCharge = Math.min(this.settings.maxThrowCharge, this.throwCharge + delta);
    }

    if (this.throwCharging && !this.input.mouseDown) {
      this.throwHeldItem();
      return;
    }
  }

  updatePlayerSelfFriction(delta) {
    if (!this.settings.playerSelfFriction || this.gameState.gameOver) return;
    applySelfFriction(this.body, this.settings.playerSelfFrictionStrength, delta);
  }

  update(delta) {
    this.updateLook();
    this.updateMovement(delta);
    this.camera.position.copy(this.body.position);
    this.updateHeldItem(delta);
    this.updatePlayerSelfFriction(delta);
  }
}
