import GUI from 'lil-gui';

function brakePowerToStrength(power) {
  return 1 - power / 1000;
}

function rotationBrakeToDamping(power) {
  return power / 100;
}

export function createSettings() {
  const settings = {
    flashlightBrightness: 5,
    grabdistance: 6,
    holdDistance: 3,
    selfFriction: true,
    selfFrictionStrength: 0.986,
    itemBrakePower: 14,
    itemAngularDamping: 0.08,
    itemRotationBrakePower: 8,
    playerSelfFriction: true,
    playerSelfFrictionStrength: 0.992,
    playerBrakePower: 8,
    playerThrustForce: 22,
    boostMultiplier: 2,
    movementFuelCost: 4,
    extinguisherFuelCost: 5,
    throwSpeedMultiplier: 18,
    minThrowCharge: 0.3,
    tapThrowPower: 30,
    maxThrowCharge: 2,
    scannerRange: 40,
    scannerCooldown: 5,
    scannerGlowTime: 2,
    safeZoneRadius: 70,
    warningRadius: 50,
    hungerDrain: 2,
    thirstDrain: 2,
    oxygenDrain: 2,
    autoUseStoredItems: true,
    autoUseThreshold: 30
  };

  const gui = new GUI({ title: 'Zero-G Settings' });
  gui.domElement.classList.add('zero-g-settings');

  const survivalFolder = gui.addFolder('Survival');
  survivalFolder.add(settings, 'hungerDrain', 0, 8, 1).name('Hunger drain');
  survivalFolder.add(settings, 'thirstDrain', 0, 8, 1).name('Thirst drain');
  survivalFolder.add(settings, 'oxygenDrain', 0, 8, 1).name('Oxygen drain');
  survivalFolder.add(settings, 'autoUseStoredItems').name('Auto-use stored supplies');
  survivalFolder.add(settings, 'autoUseThreshold', 5, 80, 1).name('Auto-use below');

  const movementFolder = gui.addFolder('Movement & Fuel');
  movementFolder.add(settings, 'playerThrustForce', 5, 70, 1).name('Player thrust');
  movementFolder.add(settings, 'boostMultiplier', 1, 4, 1).name('Alt boost');
  movementFolder.add(settings, 'movementFuelCost', 1, 15, 1).name('Movement fuel cost');
  movementFolder.add(settings, 'extinguisherFuelCost', 1, 15, 1).name('Extinguisher fuel cost');
  movementFolder.add(settings, 'playerSelfFriction').name('Player drift brake');
  movementFolder
    .add(settings, 'playerBrakePower', 0, 60, 1)
    .name('Player brake power')
    .onChange((value) => {
      settings.playerSelfFrictionStrength = brakePowerToStrength(value);
    });

  const interactionFolder = gui.addFolder('Grab & Throw');
  interactionFolder.add(settings, 'grabdistance', 2, 12, 1).name('Grab range');
  interactionFolder.add(settings, 'holdDistance', 2, 5, 1).name('Held item distance');
  interactionFolder.add(settings, 'throwSpeedMultiplier', 5, 45, 1).name('Throw speed');
  interactionFolder
    .add(settings, 'tapThrowPower', 10, 120, 1)
    .name('Tap throw power')
    .onChange((value) => {
      settings.minThrowCharge = value / 100;
    });
  interactionFolder.add(settings, 'maxThrowCharge', 1, 4, 1).name('Max charge time');

  const itemFolder = gui.addFolder('Floating Items');
  itemFolder.add(settings, 'selfFriction').name('Item drift brake');
  itemFolder
    .add(settings, 'itemBrakePower', 0, 60, 1)
    .name('Item brake power')
    .onChange((value) => {
      settings.selfFrictionStrength = brakePowerToStrength(value);
    });
  itemFolder
    .add(settings, 'itemRotationBrakePower', 0, 40, 1)
    .name('Rotation brake')
    .onChange((value) => {
      settings.itemAngularDamping = rotationBrakeToDamping(value);
    });

  const worldFolder = gui.addFolder('Scanner & World');
  worldFolder.add(settings, 'scannerRange', 10, 100, 1).name('Scanner range');
  worldFolder.add(settings, 'scannerCooldown', 1, 15, 1).name('Scanner cooldown');
  worldFolder.add(settings, 'scannerGlowTime', 1, 8, 1).name('Scanner glow time');
  worldFolder.add(settings, 'safeZoneRadius', 35, 130, 1).name('Safe zone radius');
  worldFolder.add(settings, 'warningRadius', 15, 90, 1).name('Warning radius');
  worldFolder.add(settings, 'flashlightBrightness', 0, 10, 1).name('Flashlight');

  survivalFolder.open();
  movementFolder.open();
  interactionFolder.open();

  let visible = false;
  gui.hide();

  function toggleGui() {
    visible = !visible;
    if (visible) gui.show();
    else gui.hide();
    return visible;
  }

  return { settings, gui, toggleGui };
}
