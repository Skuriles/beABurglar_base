import { Skill } from "../Characters/Skill";
import { GameObject } from "./GameObject";

export class Tool implements GameObject {
  name: string;
  id: number;
  options: ToolOptions;
  constructor(tool: Tool) {
    this.name = tool.name;
    this.id = tool.id;
    this.options = new ToolOptions(tool.options);
  }
}

export class ToolOptions {
  image: string;
  skills: Skill[] = [];

  constructor(toolOption: ToolOptions) {
    this.image = toolOption.image ? toolOption.image : "";
    for (let i = 0; i < toolOption.skills.length; i++) {
      const skill = toolOption.skills[i];
      this.skills.push(new Skill(skill));
    }
  }
}
