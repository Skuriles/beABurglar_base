export class Tool {
  name: string;
  id: number;
  options: ToolOptions;
}

export class ToolOptions {
  image: string;
  electricty: number;
  agility: number;
  power: number;
  lockpicking: number;
  explosives: number;
  loudness: number;
}
