import { GameObject } from "./GameObject";

export class Car implements GameObject {
  id: number;
  name: string;
  value: number;
  speed: number;
  space: number;
  persons: number;
}
