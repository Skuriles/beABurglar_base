import { Tool } from "../GameObjects/Tool";
import { Skill } from "./Skill";
import { Prey } from "../GameObjects/Prey";
import { Car } from "../GameObjects/Car";

export class BaseChar {
  name: string;
  sprite: PIXI.AnimatedSprite;
  skills: Skill[];
  prey: Prey[];
  tools: Tool[];
  cars: Car[];

  constructor(name: string) {
    this.name = name;
    this.addBaseToolsAndSkill();
  }

  private addBaseToolsAndSkill() {
      let skill = new Skill();
      "electricty": 0,
      "agility": 20,
      "power": 5,
      "lockpicking": 35,
      "explosives": 0,
      "loudness": 5
  }
}
