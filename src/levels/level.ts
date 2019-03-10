import { Prey } from "../GameObjects/Prey";

export class Level {
  tilingSprites: TilingSprite[] = [];
  constructor(level: Level) {
    this.tilingSprites = level.tilingSprites;
  }
}

export class TilingSprite {
  fileName: string = "";
  floortiles: Tile[] = [];
  interactObjects: Tile[] = [];
}

export class Interact {
  type: InteractTypes = InteractTypes.unknown;
  altSprite: string = "";
  name: string = "";
  prey: number[] = [];
  possibleTools: number[];
}

export enum InteractTypes {
  unknown = 0,
  door = 1,
  prey = 2,
  car = 3
}

export class Tile {
  id: string = "";
  tile: string = "";
  position_x: number = 0;
  position_y: number = 0;
  width: number = 0;
  height: number = 0;
  collision = false;
  interact: Interact;
  scale: number = 1;
  container: string;
  sprite!: PIXI.TilingSprite;
  parentFileName: string = "";

  constructor() {
    this.interact = new Interact();
    this.container = "";
  }
}
