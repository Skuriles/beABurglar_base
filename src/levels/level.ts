export class Level {
  tilingSprites: TilingSprite[] = [];
  constructor(level: Level) {
    this.tilingSprites = level.tilingSprites;
  }
}

export class TilingSprite {
  fileName: string = "";
  tiles: Tile[] = [];
}

export class Interact {
  type: InteractTypes = InteractTypes.unknown;
  altSprites: string[] = [];
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

  constructor() {
    this.interact = new Interact();
  }
}
