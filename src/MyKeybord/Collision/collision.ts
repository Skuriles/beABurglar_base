import { HitTestPosition } from "./hitTestPosition";
import { Tile } from "../../levels/level";

export class Collision {
  public static hitTestRectangle(
    r1: PIXI.AnimatedSprite,
    r2: PIXI.Sprite,
    offsetX: number,
    offsetY: number
  ) {
    //Define the variables we'll need to calculate
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
    let rec = r1.hitArea as PIXI.Rectangle;
    //hit will determine whether there's a collision
    hit = false;
    let direction = "";
    let positionsR1 = new HitTestPosition();
    let positionsR2 = new HitTestPosition();
    //Find the center points of each sprite
    positionsR1.centerX = r1.x + offsetX + r1.width / 2;
    positionsR1.centerY = r1.y + offsetY + r1.height / 2;
    positionsR2.centerX = r2.x + r2.width / 2;
    positionsR2.centerY = r2.y + r2.height / 2;

    //Find the half-widths and half-heights of each sprite
    positionsR1.halfWidth = rec.width / 2;
    positionsR1.halfHeight = rec.height / 2;
    positionsR2.halfWidth = r2.width / 2;
    positionsR2.halfHeight = r2.height / 2;

    //Calculate the distance vector between the sprites
    vx = positionsR1.centerX - positionsR2.centerX;
    vy = positionsR1.centerY - positionsR2.centerY;

    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = positionsR1.halfWidth + positionsR2.halfWidth;
    combinedHalfHeights = positionsR1.halfHeight + positionsR2.halfHeight;

    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {
      direction = "left";
      //A collision might be occurring. Check for a collision on the y axis
      if (Math.abs(vy) < combinedHalfHeights) {
        direction = "right";
        //There's definitely a collision happening
        hit = true;
      } else {
        //There's no collision on the y axis
        hit = false;
      }
    } else {
      //There's no collision on the x axis
      hit = false;
    }
    //`hit` will be either `true` or `false`
    return hit;
  }

  public static hitTestInteraction(
    r1: PIXI.AnimatedSprite,
    r2: Tile,
    offsetX: number,
    offsetY: number
  ) {
    //Define the variables we'll need to calculate
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
    let rec = r1.hitArea as PIXI.Rectangle;
    //hit will determine whether there's a collision
    hit = false;
    let direction = "";
    let positionsR1 = new HitTestPosition();
    let positionsR2 = new HitTestPosition();
    //Find the center points of each sprite
    positionsR1.centerX = r1.x + offsetX + r1.width / 2;
    positionsR1.centerY = r1.y + offsetY + r1.height / 2;
    positionsR2.centerX = r2.position_x + r2.width / 2;
    positionsR2.centerY = r2.position_y + r2.height / 2;

    //Find the half-widths and half-heights of each sprite
    positionsR1.halfWidth = rec.width / 2;
    positionsR1.halfHeight = rec.height / 2;
    positionsR2.halfWidth = r2.width / 2;
    positionsR2.halfHeight = r2.height / 2;

    //Calculate the distance vector between the sprites
    vx = positionsR1.centerX - positionsR2.centerX;
    vy = positionsR1.centerY - positionsR2.centerY;

    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = positionsR1.halfWidth + positionsR2.halfWidth;
    combinedHalfHeights = positionsR1.halfHeight + positionsR2.halfHeight;

    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {
      direction = "left";
      //A collision might be occurring. Check for a collision on the y axis
      if (Math.abs(vy) < combinedHalfHeights) {
        direction = "right";
        //There's definitely a collision happening
        hit = true;
      } else {
        //There's no collision on the y axis
        hit = false;
      }
    } else {
      //There's no collision on the x axis
      hit = false;
    }
    //`hit` will be either `true` or `false`
    return hit;
  }
}
