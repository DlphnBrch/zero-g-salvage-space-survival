export class Input {
  constructor(domElement) {
    this.domElement = domElement;
    this.keys = new Set();
    this.justPressed = new Set();
    this.mouseDelta = { x: 0, y: 0 };
    this.mouseDown = false;
    this.mouseJustDown = false;
    this.mouseJustUp = false;
    this.pointerLocked = false;
    this.pointerUnlockedThisFrame = false;

    const preventGameplayDefaults = new Set([
        'Space',
        'AltLeft',
        'AltRight',
        'KeyW',
        'KeyA',
        'KeyS',
        'KeyD',
        'KeyQ',
        'KeyE',
        'Escape'
    ]);

    window.addEventListener('keydown', (event) => {
      if (preventGameplayDefaults.has(event.code)) event.preventDefault();
      if (!this.keys.has(event.code)) this.justPressed.add(event.code);
      this.keys.add(event.code);
    });

    window.addEventListener('keyup', (event) => {
      if (preventGameplayDefaults.has(event.code)) event.preventDefault();
      this.keys.delete(event.code);
    });

    domElement.addEventListener('mousedown', () => {
      if (!this.pointerLocked) domElement.requestPointerLock();
      this.mouseDown = true;
      this.mouseJustDown = true;
    });

    window.addEventListener('mouseup', () => {
      this.mouseDown = false;
      this.mouseJustUp = true;
    });

    window.addEventListener('mousemove', (event) => {
      if (!this.pointerLocked) return;
      this.mouseDelta.x += event.movementX;
      this.mouseDelta.y += event.movementY;
    });

    document.addEventListener('pointerlockchange', () => {
      const wasPointerLocked = this.pointerLocked;
      this.pointerLocked = document.pointerLockElement === domElement;
      if (wasPointerLocked && !this.pointerLocked) {
        this.pointerUnlockedThisFrame = true;
        this.mouseDown = false;
      }
    });
  }

  isDown(code) {
    return this.keys.has(code);
  }

  wasPressed(code) {
    return this.justPressed.has(code);
  }

  unlockPointer() {
    if (document.pointerLockElement === this.domElement) {
      document.exitPointerLock();
    }
  }

  endFrame() {
    this.justPressed.clear();
    this.mouseDelta.x = 0;
    this.mouseDelta.y = 0;
    this.mouseJustDown = false;
    this.mouseJustUp = false;
    this.pointerUnlockedThisFrame = false;
  }
}
