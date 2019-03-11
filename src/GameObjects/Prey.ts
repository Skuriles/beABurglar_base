import { GameObject } from "./GameObject";
import { Skill } from "../Characters/Skill";

export class Prey implements GameObject {
  id: number;
  name: string;
  matchValue: number;
  defaultValue: number;
  skills: Skill[];
  constructor(prey: Prey) {
    this.id = prey.id;
    this.name = prey.name ? prey.name : "";
    this.matchValue = prey.matchValue;
    this.defaultValue = prey.defaultValue;
    this.skills = [];
    if (prey.skills) {
      for (let i = 0; i < prey.skills.length; i++) {
        const skill = prey.skills[i];
        this.skills.push(new Skill(skill));
      }
    }
  }
}
