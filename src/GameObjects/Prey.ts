import { GameObject } from "./GameObject";

export class Prey implements GameObject {
  id: number;
  name: string;
  matchValue: number;
  defaultValue: number;
}
