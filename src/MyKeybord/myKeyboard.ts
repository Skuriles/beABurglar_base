import Key from "./PixiKeyboard/Key";
import { GameLoader } from "../GameApp/GameLoader";
import { GameStates } from "../GameApp/GameState";
import { PixiKeyboard } from "./PixiKeyboard/PixiKeyboard";

export default class MyKeyboard {
  sprite!: PIXI.AnimatedSprite;
  pixiKeyboard!: PixiKeyboard;
  leftTextures: PIXI.Texture[] = [];
  rightTextures: PIXI.Texture[] = [];
  upTextures: PIXI.Texture[] = [];
  downTextures: PIXI.Texture[] = [];
  gameLoaderInstance: GameLoader;
  currentKey: number;
  keyPressed = false;
  direction: number = Key.DOWN;
  counter!: number;

  constructor(main: GameLoader) {
    this.gameLoaderInstance = main;
    this.currentKey = -1;
    this.createKeyboard();
  }

  setSprite(sprite: any) {
    this.sprite = sprite;
  }

  startAnimation() {
    switch (this.currentKey) {
      case Key.DOWN:
        this.direction = Key.DOWN;
        this.sprite.textures = this.downTextures;
        break;
      case Key.UP:
        this.direction = Key.UP;
        this.sprite.textures = this.upTextures;
        break;
      case Key.LEFT:
        this.direction = Key.LEFT;
        this.sprite.textures = this.leftTextures;
        break;
      case Key.RIGHT:
        this.direction = Key.RIGHT;
        this.sprite.textures = this.rightTextures;
        break;
      default:
        break;
    }
    this.sprite.animationSpeed = 0.2;
    this.sprite.play();
  }

  stopAnimation() {
    this.sprite.stop();
  }

  release() {
    this.keyPressed = false;
    this.currentKey = -1;
    this.gameLoaderInstance.moveY = 0;
    this.gameLoaderInstance.moveX = 0;
  }

  public handleMenu(key: number): any {
    this.keyPressed = true;
    this.currentKey = key;
    switch (key) {
      case Key.UP:
        this.gameLoaderInstance.mainTextRect.moveTextMarker(0);
        break;
      case Key.DOWN:
        this.gameLoaderInstance.mainTextRect.moveTextMarker(1);
        break;
      case Key.ENTER:
        this.gameLoaderInstance.handleTextSelection();
      // this.gameLoaderInstance.gameMode = GameStates.Walking;
    }
  }

  public press(key: number) {
    this.keyPressed = true;
    this.currentKey = key;
    switch (key) {
      case Key.LEFT:
        this.gameLoaderInstance.moveX = -3;
        this.gameLoaderInstance.moveY = 0;
        break;
      case Key.RIGHT:
        this.gameLoaderInstance.moveX = 3;
        this.gameLoaderInstance.moveY = 0;
        break;
      case Key.UP:
        this.gameLoaderInstance.moveX = 0;
        this.gameLoaderInstance.moveY = -3;
        break;
      case Key.DOWN:
        this.gameLoaderInstance.moveX = 0;
        this.gameLoaderInstance.moveY = 3;
        break;
      case Key.ENTER:
        this.checkInteractionContainers();
    }
  }
  private checkInteractionContainers() {
    this.gameLoaderInstance.checkInteractionContainers(this.direction);
  }

  public checkDownEvent(key: number): any {
    if (!this.keyPressed) {
      this.release();
      this.press(key);
      this.startAnimation();
    }
  }

  public assignKeyboardToSprite(
    sprite: PIXI.AnimatedSprite,
    pixiLoader: PIXI.Loader
  ) {
    this.setSprite(sprite);
    this.leftTextures = this.addSpritesToDirection(3, pixiLoader);
    this.rightTextures = this.addSpritesToDirection(1, pixiLoader);
    this.upTextures = this.addSpritesToDirection(0, pixiLoader);
    this.downTextures = this.addSpritesToDirection(2, pixiLoader);
  }

  private addSpritesToDirection(
    direction: number,
    pixiLoader: PIXI.Loader
  ): any[] {
    var textures = [];
    for (let i = 0; i < 3; i++) {
      var key = "char_" + direction + "_" + i + ".png";
      let id = pixiLoader.resources.baseCharJson.textures;
      if (id != null) {
        textures.push(id[key]);
      }
    }
    return textures;
  }

  private createKeyboard() {
    this.pixiKeyboard = new PixiKeyboard();
    this.counter = 0;
    this.initEvents();
  }

  private initEvents(): any {
    this.initOnEvent();
    this.initReleaseEvent();
    this.initDownEvent();
  }

  private initDownEvent() {
    this.pixiKeyboard.keyboardManager.on("down", (key: number) => {
      if (key == Key.ESCAPE) {
        return;
      }
      switch (this.gameLoaderInstance.gameMode) {
        case GameStates.Unknown:
          return;
        case GameStates.Walking:
          this.checkDownEvent(key);
          break;
        case GameStates.Menu:
          break;
      }
    });
  }

  private initReleaseEvent() {
    this.pixiKeyboard.keyboardManager.on("released", (key: number) => {
      switch (this.gameLoaderInstance.gameMode) {
        case GameStates.Unknown:
          return;
        case GameStates.Walking:
          if (this.isDirectionKey(key)) {
            this.release();
            this.stopAnimation();
          }
          break;
        case GameStates.Menu:
          this.release();
          break;
      }
    });
  }

  private initOnEvent() {
    this.pixiKeyboard.keyboardManager.on("pressed", (key: number) => {
      switch (this.gameLoaderInstance.gameMode) {
        case GameStates.Unknown:
          return;
        case GameStates.Walking:
          this.press(key);
          if (this.isDirectionKey(key)) {
            this.startAnimation();
          }
          break;
        case GameStates.Menu:
          if (key == Key.ESCAPE) {
            this.gameLoaderInstance.mainTextRect.hideAll();
            this.gameLoaderInstance.gameMode = GameStates.Walking;
            return;
          }
          this.handleMenu(key);
          break;
      }
    });
  }

  private isDirectionKey(key: number) {
    return (
      key === Key.LEFT ||
      key === Key.UP ||
      key === Key.DOWN ||
      key === Key.RIGHT
    );
  }
}
