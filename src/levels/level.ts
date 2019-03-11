export class Level {
  tilingSprites: TilingSprite[] = [];
  constructor(level: Level) {
    for (let i = 0; i < level.tilingSprites.length; i++) {
      const sprite = level.tilingSprites[i];
      this.tilingSprites.push(new TilingSprite(sprite));
    }
  }
}

export class TilingSprite {
  fileName: string = "";
  floortiles: Tile[] = [];
  interactObjects: Tile[] = [];

  constructor(tilingSprite: TilingSprite) {
    this.fileName = tilingSprite.fileName;
    for (let i = 0; i < tilingSprite.floortiles.length; i++) {
      const tile = tilingSprite.floortiles[i];
      this.floortiles.push(new Tile(tile));
    }
    for (let i = 0; i < tilingSprite.interactObjects.length; i++) {
      const tile = tilingSprite.interactObjects[i];
      this.interactObjects.push(new Tile(tile));
    }
  }
}

export class Interact {
  type: InteractTypes = InteractTypes.unknown;
  altSprite: string = "";
  name: string = "";
  prey: number[] = [];
  possibleTools: number[];

  constructor(interact: Interact) {
    this.type = interact.type;
    this.altSprite = interact.altSprite ? interact.altSprite : "";
    this.name = interact.name;
    this.prey = interact.prey ? interact.prey : [];
    this.possibleTools = interact.possibleTools ? interact.possibleTools : [];
  }
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
  zIndex: number;

  constructor(tile: Tile) {
    this.id = tile.id;
    this.tile = tile.tile;
    this.position_x = tile.position_x;
    this.position_y = tile.position_y;
    this.width = tile.width;
    this.height = tile.height;
    this.collision = tile.collision;
    this.interact = tile.interact ? new Interact(tile.interact) : null;
    this.scale = tile.scale ? tile.scale : 1;
    this.container = tile.container ? tile.container : null;
    this.parentFileName = tile.parentFileName ? tile.parentFileName : "";
  }
}
