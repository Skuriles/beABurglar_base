import { Skill } from "../Characters/Skill";
import { GameObject } from "./GameObject";

export class Tool implements GameObject {
  name: string;
  id: number;
  options: ToolOptions;
}

export class ToolOptions {
  image: string;
  skills: Skill[] = [];
}
