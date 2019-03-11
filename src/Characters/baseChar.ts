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

  constructor(char: BaseChar) {
    this.name = char.name;
    this.skills = char.skills ? char.skills : [];
    this.prey = char.prey ? char.prey : [];
    this.tools = char.tools ? char.tools : [];
    this.cars = char.cars ? char.cars : [];
  }

  public checkPreySkill(prey: Prey): boolean {
    if (prey.skills == null) {
      return true;
    }
    for (let i = 0; i < prey.skills.length; i++) {
      const skill = prey.skills[i];
      for (let j = 0; j < this.skills.length; j++) {
        const charSkill = this.skills[j];
        if (charSkill.id === skill.id && charSkill.value < skill.value) {
          return false;
        }
      }
    }
    return true;
  }

  public addPrey(prey: Prey): any {
    if (!this.prey) {
      this.prey = [];
    }
    this.prey.push(prey.id);
  }
}
