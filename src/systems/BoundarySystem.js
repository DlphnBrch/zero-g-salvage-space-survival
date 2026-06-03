import * as THREE from 'three';

export class BoundarySystem {
  constructor(gameState, settings) {
    this.gameState = gameState;
    this.settings = settings;
    this.origin = new THREE.Vector3(0, 0, 0);
  }

  update(playerPosition) {
    if (this.gameState.gameOver) return;

    const distance = playerPosition.distanceTo(this.origin);
    const warningRadius = Math.min(this.settings.warningRadius, this.settings.safeZoneRadius - 8);

    if (distance >= this.settings.safeZoneRadius) {
      this.gameState.end('SIGNAL LOST — MISSION FAILED');
      return;
    }

    if (distance > warningRadius + 14) {
      this.gameState.warning = 'Return immediately';
    } else if (distance > warningRadius + 7) {
      this.gameState.warning = 'Communication with spaceship unstable';
    } else if (distance > warningRadius) {
      this.gameState.warning = 'WARNING: Signal weakening';
    } else if (this.gameState.oxygen < 25) {
      this.gameState.warning = 'LOW OXYGEN';
    } else {
      this.gameState.warning = '';
    }
  }
}
