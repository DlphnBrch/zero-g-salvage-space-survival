import { SCANNER_COLORS } from '../utils/constants.js';

export class ScannerSystem {
  constructor(itemManager, gameState, settings, storageZone) {
    this.itemManager = itemManager;
    this.gameState = gameState;
    this.settings = settings;
    this.storageZone = storageZone;
    this.cooldown = 0;
    this.baseGlowTimer = 0;
  }

  reset() {
    this.cooldown = 0;
    this.baseGlowTimer = 0;
    this.storageZone.mesh.material.opacity = 0.16;
  }

  tryPing(playerPosition) {
    if (this.cooldown > 0 || this.gameState.gameOver) return false;

    this.cooldown = this.settings.scannerCooldown;
    const range = this.settings.scannerRange;

    this.itemManager.items.forEach((item) => {
      const distance = item.mesh.position.distanceTo(playerPosition);
      if (distance > range) return;

      item.scanTimer = this.settings.scannerGlowTime;
      this.itemManager.highlightItem(item, SCANNER_COLORS[item.type] ?? 0xffffff, 2.7);
    });

    this.baseGlowTimer = this.settings.scannerGlowTime;
    this.storageZone.mesh.material.opacity = 0.38;
    return true;
  }

  update(delta) {
    this.cooldown = Math.max(0, this.cooldown - delta);

    if (this.baseGlowTimer > 0) {
      this.baseGlowTimer -= delta;
      if (this.baseGlowTimer <= 0) {
        this.storageZone.mesh.material.opacity = 0.16;
      }
    }
  }
}
