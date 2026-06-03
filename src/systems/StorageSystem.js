export class StorageSystem {
  constructor(itemManager, gameState, storageZone) {
    this.itemManager = itemManager;
    this.gameState = gameState;
    this.storageZone = storageZone;
  }

  isInsideStorageZone(item) {
    const center = this.storageZone.center;
    const size = this.storageZone.size;
    const pos = item.mesh.position;

    return Math.abs(pos.x - center.x) <= size.x / 2 &&
      Math.abs(pos.y - center.y) <= size.y / 2 &&
      Math.abs(pos.z - center.z) <= size.z / 2;
  }

  update() {
    this.itemManager.items.slice().forEach((item) => {
      if (item.held || item.stored || item.consumed || !item.useful) return;
      if (!this.isInsideStorageZone(item)) return;

      item.stored = true;
      this.gameState.storeItem(item);
      this.itemManager.removeItem(item);
    });
  }
}
