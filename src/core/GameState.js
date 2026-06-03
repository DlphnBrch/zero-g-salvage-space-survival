import { clamp } from '../utils/math.js';
import { ITEM_TYPES, RESOURCE_BARS } from '../utils/constants.js';

function createInventory() {
  return {
    [ITEM_TYPES.FOOD]: { small: 0, medium: 0, large: 0 },
    [ITEM_TYPES.WATER]: { small: 0, medium: 0, large: 0 },
    [ITEM_TYPES.OXYGEN]: { small: 0, medium: 0, large: 0 },
    [ITEM_TYPES.EXTINGUISHER]: { small: 0, medium: 0, large: 0 },
    [ITEM_TYPES.CRATE]: { small: 0, medium: 0, large: 0 }
  };
}

function getInventoryTotalForType(inventory, type) {
  const bucket = inventory[type];
  if (!bucket) return 0;
  return Object.values(bucket).reduce((sum, value) => sum + value, 0);
}

export class GameState {
  constructor() {
    this.restart();
  }

  updateTimer(delta) {
    if (!this.gameOver) this.time += delta;
  }

  drain(delta, settings) {
    if (this.gameOver) return;

    this.hunger = clamp(this.hunger - settings.hungerDrain * delta);
    this.thirst = clamp(this.thirst - settings.thirstDrain * delta);
    this.oxygen = clamp(this.oxygen - settings.oxygenDrain * delta);
  }

  checkFailure() {
    if (this.gameOver) return;
    if (this.hunger <= 0) this.end('STARVATION — MISSION FAILED');
    if (this.thirst <= 0) this.end('DEHYDRATION — MISSION FAILED');
    if (this.oxygen <= 0) this.end('OXYGEN DEPLETED — MISSION FAILED');
  }

  useFuel(amount) {
    if (this.gameOver || this.fuel <= 0) return false;
    this.fuel = clamp(this.fuel - amount);
    return true;
  }

  restore(values = {}) {
    if (values.hunger) this.hunger = clamp(this.hunger + values.hunger);
    if (values.thirst) this.thirst = clamp(this.thirst + values.thirst);
    if (values.oxygen) this.oxygen = clamp(this.oxygen + values.oxygen);
    if (values.fuel) this.fuel = clamp(this.fuel + values.fuel);
  }

  storeItem(item) {
    this.stored += 1;
    this.score += item.scoreValue ?? 10;

    if (this.inventory[item.type]?.[item.variantKey] != null) {
      this.inventory[item.type][item.variantKey] += 1;
    }

    if (item.values) {
      this.storedResources.push({
        type: item.type,
        variantKey: item.variantKey,
        label: item.label,
        values: { ...item.values }
      });
    }
  }

  removeStoredResource(resource) {
    const index = this.storedResources.indexOf(resource);
    if (index >= 0) this.storedResources.splice(index, 1);

    if (this.inventory[resource.type]?.[resource.variantKey] > 0) {
      this.inventory[resource.type][resource.variantKey] -= 1;
    }
  }

  findBestStoredResourceForBar(bar) {
    const options = this.storedResources
      .filter((resource) => resource.values?.[bar] > 0)
      .sort((a, b) => a.values[bar] - b.values[bar]);

    return options[0] ?? null;
  }

  autoUseCriticalResources(settings) {
    if (this.gameOver || !settings.autoUseStoredItems) return '';

    const messages = [];
    const threshold = settings.autoUseThreshold;

    for (const bar of RESOURCE_BARS) {
      if (this[bar] > threshold) continue;

      const resource = this.findBestStoredResourceForBar(bar);
      if (!resource) continue;

      this.restore(resource.values);
      this.removeStoredResource(resource);
      messages.push(`Auto-used ${resource.label}`);
    }

    if (messages.length > 0) {
      this.lastAutoUseMessage = messages.join(' · ');
      this.lastAutoUseId += 1;
      return this.lastAutoUseMessage;
    }

    return '';
  }

  getInventoryText() {
    const food = getInventoryTotalForType(this.inventory, ITEM_TYPES.FOOD);
    const water = getInventoryTotalForType(this.inventory, ITEM_TYPES.WATER);
    const oxygen = getInventoryTotalForType(this.inventory, ITEM_TYPES.OXYGEN);
    const fuel = getInventoryTotalForType(this.inventory, ITEM_TYPES.EXTINGUISHER);
    const crates = getInventoryTotalForType(this.inventory, ITEM_TYPES.CRATE);
    return `F:${food} W:${water} O₂:${oxygen} Ext:${fuel} Cr:${crates}`;
  }

  end(reason) {
    if (this.gameOver) return;
    this.gameOver = true;
    this.gameOverReason = reason;
    this.warning = reason;
  }

  restart() {
    this.hunger = 100;
    this.thirst = 100;
    this.oxygen = 100;
    this.fuel = 100;
    this.score = 0;
    this.stored = 0;
    this.time = 0;
    this.warning = '';
    this.gameOver = false;
    this.gameOverReason = '';
    this.nearestSupplyDistance = null;
    this.inventory = createInventory();
    this.storedResources = [];
    this.lastAutoUseMessage = '';
    this.lastAutoUseId = 0;
  }
}
