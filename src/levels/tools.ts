export interface Tools {
  name: string;
  options: ToolOptions;
}

export interface ToolOptions {
  image: string;
  electricty: number;
  skill: number;
  power: number;
  locakpicking: number;
  explosives: number;
}
