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

export class Tile {
  id: string = "";
  tile: string = "";
  position_x: number = 0;
  position_y: number = 0;
  width: number = 0;
  height: number = 0;
  collision = false;
}
