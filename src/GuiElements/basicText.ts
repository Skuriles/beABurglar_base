export enum TextElementTypes {
  Unknown,
  BasicText,
  ProgressBar
}

abstract class TextElements {
  type: TextElementTypes;
  row: number;
  column: number;
}

export class BasicText extends TextElements {
  id: number;
  text: string;
  constructor() {
    super();
  }
}

export class ProgressBar extends TextElements {
  id: number;
  min: number;
  max: number;
  value: number;
  color: number;

  constructor() {
    super();
    this.color = 0x96a32b;
  }
}

export class DetailText {
  id: number;
  colmuns: number;
  rows: number;
  elements: TextElements[];
}
