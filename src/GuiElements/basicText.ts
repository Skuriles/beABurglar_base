import { Tile } from "../levels/level";
import { Tool } from "../Levels/tools";

export class BasicTextRect {
  rect: PIXI.Graphics;
  textContainer: PIXI.Container;
  texts: PIXI.Text[] = [];
  tiles: Tile[] = [];
  textMarker: PIXI.Graphics;
  selectedText: number = 0;
  rowSize = 50;
  tools: Tool[] = [];
  availableTools: any[];

  constructor() {
    this.initTextRect();
    this.textContainer = new PIXI.Container();
    this.textContainer.zIndex = 9995;
    this.initTextMarker();
    this.textMarker.visible = false;
    this.setInitalText();
  }

  public hide() {
    let i = 20;
    let cancel = setInterval(() => {
      this.rect.alpha = 1 - 1 / i;
      this.textContainer.alpha = 1 - 1 / i;
      if (this.textMarker) {
        this.textMarker.alpha = 1 - 1 / i;
      }
      i--;
      if (i == 0) {
        clearInterval(cancel);
        this.rect.visible = false;
        this.textContainer.visible = false;
        if (this.textMarker) {
          this.textMarker.visible = false;
        }
      }
    }, 20);
  }

  public show(showTextMarker: boolean) {
    this.rect.alpha = 1;
    this.textContainer.alpha = 1;
    this.rect.visible = true;
    this.textContainer.visible = true;
    if (showTextMarker) {
      this.textMarker.visible = true;
      this.textMarker.alpha = 1;
    }
  }

  public updateMainTextBox(tiles: Tile[]) {
    this.texts = [];
    this.textContainer.removeChildren();
    this.initTextMarker();
    for (let i = 0; i < tiles.length; i++) {
      this.addText(tiles[i].interact.name, i);
      this.tiles.push(tiles[i]);
    }
    this.setTextMarker();
    this.resizeRect();
  }

  private addText(text: string, index: number) {
    let newText = new PIXI.Text(text);
    newText.y = index * this.rowSize + 15;
    newText.x = 65;
    newText.zIndex = 9999;
    this.texts.push(newText);
    this.textContainer.addChild(newText);
  }

  private setInitalText() {
    this.texts = [];
    this.texts[0] = new PIXI.Text("Hello to be a Burglar");
    this.texts[0].zIndex = 9999;
    this.texts[0].x = 65;
    this.texts[0].y = 15;
    this.textContainer.sortableChildren = true;
    this.textContainer.addChild(this.texts[0]);
  }

  private resizeRect() {
    this.rect.clear();
    let height: number;
    if (this.texts.length <= 5) {
      height = this.rowSize * this.texts.length;
    } else {
      height = 5 * this.rowSize;
    }
    this.rect.beginFill(0xffffff, 1);
    this.rect.drawRoundedRect(this.rowSize, 5, 800, height, 5);
    this.rect.endFill();
  }

  initTextMarker(): any {
    this.textMarker = new PIXI.Graphics();
    this.textMarker.zIndex = 9998;
    this.textMarker.beginFill(0x000000, 1);
    this.textMarker.drawRect(55, 10, 790, this.rowSize - 8);
    this.textMarker.endFill();
    this.textContainer.addChild(this.textMarker);
  }

  initTextRect(): any {
    this.rect = new PIXI.Graphics();
    this.rect.zIndex = 9990;
    this.rect.lineStyle(2, 0x000000, 1);
    this.rect.beginFill(0xffffff, 1);
    this.rect.drawRoundedRect(50, 5, 800, this.rowSize, 15);
    this.rect.endFill();
  }

  private setTextMarker(): any {
    this.resetText();
    this.texts[this.selectedText].style = new PIXI.TextStyle({
      fill: 0xffffff
    });
  }

  private resetText() {
    this.textMarker.y = this.selectedText * this.rowSize;
    for (let i = 0; i < this.texts.length; i++) {
      const text = this.texts[i];
      text.style = new PIXI.TextStyle({
        fill: 0x00000
      });
    }
  }

  public selectTextId() {
    let tile = this.tiles[this.selectedText];
    this.setToolTexts(tile.interact.possibleTools);
    //this.resetText();
    //this.hide();
  }

  setToolTexts(possibleTools: number[]): any {
    this.texts = [];
    this.textContainer.removeChildren();
    this.initTextMarker();
    this.availableTools = [];
    for (let i = 0; i < possibleTools.length; i++) {
      const toolNo = possibleTools[i];
      for (let index = 0; index < this.tools.length; index++) {
        const tool = this.tools[index];
        if (tool.id == toolNo) {
          this.availableTools.push(tool);
          this.addText(tool.name, this.availableTools.length - 1);
        }
      }
    }
    this.setTextMarker();
    this.resizeRect();
  }

  public moveTextMarker(down: number): any {
    if (down == 1) {
      if (this.texts.length - 1 == this.selectedText) {
        this.selectedText = 0;
      } else {
        this.selectedText++;
      }
    }
    if (down == 0) {
      if (0 == this.selectedText) {
        this.selectedText = this.texts.length - 1;
      } else {
        this.selectedText--;
      }
    }
    this.setTextMarker();
  }
}
