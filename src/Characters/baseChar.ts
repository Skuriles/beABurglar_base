import { Tool } from "../GameObjects/Tool";
import { Skill } from "./Skill";
import { Prey } from "../GameObjects/Prey";
import { Car } from "../GameObjects/Car";

export class BaseChar {
  name: string;
  sprite: PIXI.AnimatedSprite;
  skills: Skill[];
  prey: number[];
  tools: number[];
  cars: number[];

  constructor(name: string) {
    this.name = name;
    this.addBaseToolsAndSkill();
  }

  private addBaseToolsAndSkill() {
    let skill = new Skill();
  }
}
