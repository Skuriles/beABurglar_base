import Key from "./PixiKeyboard/Key";
import { GameLoader } from "../GameApp/GameLoader";
import { Collision } from "./Collision/collision";
import { Tile, TilingSprite, InteractTypes } from "../levels/level";

export default class MyKeyboard {
  sprite!: PIXI.AnimatedSprite;
  leftTextures: PIXI.Texture[] = [];
  rightTextures: PIXI.Texture[] = [];
  upTextures: PIXI.Texture[] = [];
  downTextures: PIXI.Texture[] = [];
  gameLoaderInstance: GameLoader;
  currentKey: number;
  keyPressed = false;
  direction: number = Key.DOWN;

  constructor(main: GameLoader) {
    this.gameLoaderInstance = main;
    this.currentKey = -1;
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
        this.gameLoaderInstance.mainTextRect.selectTextId();
    }
  }

  public press(key: number) {
    this.keyPressed = true;
    this.currentKey = key;
    switch (key) {
      case Key.LEFT:
        this.gameLoaderInstance.moveX = -4;
        this.gameLoaderInstance.moveY = 0;
        break;
      case Key.RIGHT:
        this.gameLoaderInstance.moveX = 4;
        this.gameLoaderInstance.moveY = 0;
        break;
      case Key.UP:
        this.gameLoaderInstance.moveX = 0;
        this.gameLoaderInstance.moveY = -4;
        break;
      case Key.DOWN:
        this.gameLoaderInstance.moveX = 0;
        this.gameLoaderInstance.moveY = 4;
        break;
      case Key.ENTER:
        this.checkInteractionContainers();
    }
  }
  private checkInteractionContainers(): any {
    for (let i = 0; i < this.gameLoaderInstance.interactObjects.length; i++) {
      const tile = this.gameLoaderInstance.interactObjects[i];

      if (Collision.hitTestInteraction(this.sprite, tile, this.direction)) {
        if (tile.container) {
          let mainInteract: Tile;
          if (tile.interact.name && tile.interact.prey && tile.interact.type) {
            mainInteract = tile;
          } else {
            mainInteract = this.getMainInteractTileFromContainer(tile);
          }
          if (mainInteract) {
            this.interactWithTile(mainInteract);
            this.gameLoaderInstance.mainTextRect.show();
            this.gameLoaderInstance.mainTextRect.setFirstRowText(
              mainInteract.interact.name
            );
            this.setContainerAfterInteract(mainInteract);
            // todo check more than one container
            return;
          }
        } else {
          this.interactWithTile(tile);
          this.gameLoaderInstance.mainTextRect.show();
          this.gameLoaderInstance.mainTextRect.setFirstRowText(
            tile.interact.name
          );
          // todo check more than one sprite
          return;
        }
      }
    }
  }

  private setContainerAfterInteract(containerTile: Tile) {
    this.gameLoaderInstance.level.tilingSprites.forEach(
      (tilingSprite: TilingSprite) => {
        if (tilingSprite.fileName == containerTile.parentFileName) {
          tilingSprite.tiles.forEach((tile: Tile) => {
            if (tile.container == containerTile.container) {
              this.interactWithTile(tile);
            }
          });
        }
      }
    );
  }

  private interactWithTile(tile: Tile) {
    let resource = this.gameLoaderInstance.pixiLoader.resources[
      tile.parentFileName
    ];
    if (resource && resource.textures) {
      tile.sprite.texture = resource.textures[tile.interact.altSprite];
      if (tile.interact.type === InteractTypes.door) {
        this.gameLoaderInstance.walls.forEach(
          (tilingSprite: PIXI.Sprite, index: number) => {
            if (tilingSprite == tile.sprite) {
              this.gameLoaderInstance.walls.splice(index, 1);
            }
          }
        );
      }
    }
  }

  public checkDownEvent(key: number): any {
    if (!this.keyPressed) {
      this.release();
      this.press(key);
      this.startAnimation();
    }
  }

  private getMainInteractTileFromContainer(containerTile: Tile): Tile {
    for (
      let i = 0;
      i < this.gameLoaderInstance.level.tilingSprites.length;
      i++
    ) {
      const tilingSprite = this.gameLoaderInstance.level.tilingSprites[i];
      if (tilingSprite.fileName == containerTile.parentFileName) {
        for (let j = 0; j < tilingSprite.tiles.length; j++) {
          const tile = tilingSprite.tiles[j];
          if (tile.container == containerTile.container) {
            if (
              tile.interact.name &&
              tile.interact.prey &&
              tile.interact.type
            ) {
              return tile;
            }
          }
        }
      }
      return null;
    }
  }
}
