export class SurvivalSystem {
  constructor(gameState, settings) {
    this.gameState = gameState;
    this.settings = settings;
  }

  update(delta) {
    this.gameState.updateTimer(delta);
    this.gameState.drain(delta, this.settings);
    const autoUseMessage = this.gameState.autoUseCriticalResources(this.settings);
    this.gameState.checkFailure();
    return autoUseMessage;
  }
}
