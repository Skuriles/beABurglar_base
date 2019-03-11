import { GameObject } from "../GameObjects/GameObject";

export class Skill implements GameObject {
  id: number;
  name: string;
  value: number;

  constructor(skill: Skill) {
    this.id = skill.id;
    this.name = skill.name ? skill.name : "";
    this.value = skill.value;
  }
}
