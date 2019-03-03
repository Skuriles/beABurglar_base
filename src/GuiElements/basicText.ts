import { Tile } from "../levels/level";
import { Tool } from "../GameObjects/Tool";
import { MenuTypes } from "./MenuTypes";
import { GameLoader } from "../GameApp/GameLoader";
import { Prey } from "../GameObjects/Prey";

export class BasicTextRect {
  rect: PIXI.Graphics;
  textContainer: PIXI.Container;
  texts: PIXI.Text[] = [];
  warningRect: PIXI.Graphics;
  warningTextContainer: PIXI.Container;
  warningTexts: PIXI.Text[] = [];
  tiles: Tile[] = [];
  textMarker: PIXI.Graphics;
  selectedText: number = 0;
  rowSize = 50;
  tools: Tool[] = [];
  availableTools: Tool[];
  menuMode: MenuTypes = MenuTypes.Unknown;
  gameLoaderIntance: GameLoader;

  constructor(gameloaderInstance: GameLoader) {
    this.gameLoaderIntance = gameloaderInstance;
    this.initTextRect();
    this.textContainer = new PIXI.Container();
    this.textContainer.zIndex = 9995;
    this.initWarningTextRect();
    this.warningTextContainer = new PIXI.Container();
    this.warningTextContainer.zIndex = 9995;
    this.initTextMarker();
    this.textMarker.visible = false;
    this.setStaticText("Hello to be a Burglar");
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

  public showWarn() {
    this.warningRect.alpha = 1;
    this.warningTextContainer.alpha = 1;
    this.warningRect.visible = true;
    this.warningTextContainer.visible = true;
  }

  public hideWarn() {
    let i = 20;
    let cancel = setInterval(() => {
      this.warningRect.alpha = 1 - 1 / i;
      this.warningTextContainer.alpha = 1 - 1 / i;
      i--;
      if (i == 0) {
        clearInterval(cancel);
        this.warningRect.visible = false;
        this.warningTextContainer.visible = false;
      }
    }, 20);
  }

  public updateMainTextBox(tiles: Tile[], menuMode: MenuTypes) {
    this.menuMode = menuMode;
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

  public setStaticText(text: string) {
    this.textContainer.removeChildren();
    this.texts = [];
    this.texts[0] = new PIXI.Text(text);
    this.texts[0].zIndex = 9999;
    this.texts[0].x = 65;
    this.texts[0].y = 15;
    this.textContainer.sortableChildren = true;
    this.textContainer.addChild(this.texts[0]);
  }

  public setWarnText(text: string) {
    this.warningTextContainer.removeChildren();
    this.warningTexts = [];
    this.warningTexts[0] = new PIXI.Text(text);
    this.warningTexts[0].zIndex = 9999;
    this.warningTexts[0].x = 65;
    this.warningTexts[0].y = 15;
    this.warningTextContainer.sortableChildren = true;
    this.warningTextContainer.addChild(this.warningTexts[0]);
    this.warningTextContainer.visible = true;
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

  initWarningTextRect(): any {
    this.warningRect = new PIXI.Graphics();
    this.warningRect.zIndex = 9990;
    this.warningRect.lineStyle(2, 0x000000, 1);
    this.warningRect.beginFill(0xffffff, 1);
    this.warningRect.drawRoundedRect(200, 400, 600, this.rowSize, 15);
    this.warningRect.endFill();
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
    switch (this.menuMode) {
      case MenuTypes.Interaction:
        if (
          tile.interact.possibleTools &&
          tile.interact.possibleTools.length > 0
        ) {
          this.setToolTexts(tile.interact.possibleTools);
        } else {
          this.showPrey(tile);
        }
        break;
      case MenuTypes.StaticText:
        this.resetText();
        this.hide();
        break;
      case MenuTypes.Tools:
        this.selectCurrentTool();
        break;
      case MenuTypes.Prey:
        this.setPreyText(tile.interact.prey);
        break;
      default:
        break;
    }
  }

  private selectCurrentTool() {
    let tool = this.availableTools[this.selectedText];
    this.gameLoaderIntance.selectTool(tool);
  }

  public setToolTexts(possibleTools: number[]): any {
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
    this.menuMode = MenuTypes.Tools;
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

  private showPrey(tile: Tile) {
    let prey = tile.interact.prey;
    if (prey) {
      this.setPreyText(prey);
    }
  }

  private setPreyText(preys: Prey[]): void {
    for (let i = 0; i < preys.length; i++) {
      const prey = preys[i];
      this.addText(prey.name, i);
    }
  }
}
