import { Tile } from "../levels/level";
import { MenuTypes } from "./MenuTypes";
import { GameLoader } from "../GameApp/GameLoader";
import { BasicText, DetailText } from "./BasicText";

export class BasicTextRect {
  rect: PIXI.Graphics;
  textContainer: PIXI.Container;
  texts: PIXI.Text[] = [];
  warningRect: PIXI.Graphics;
  warningTextContainer: PIXI.Container;
  warningTexts: PIXI.Text[] = [];
  textMarker: PIXI.Graphics;
  selectedText: number = 0;
  selectedObjectIds: number[] = [];
  rowSize = 50;
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

  public hideAll(): any {
    this.hide();
    this.hideWarn();
  }

  public getSelectedObjectId(): number {
    return this.selectedObjectIds[this.selectedText];
  }

  private addText(text: string, index: number, textId: number) {
    let newText = new PIXI.Text(text);
    newText.style;
    newText.y = index * this.rowSize + 15;
    newText.x = 65;
    newText.zIndex = 9999;
    this.texts.push(newText);
    this.textContainer.addChild(newText);
    this.selectedObjectIds.push(textId);
  }

  public setStaticText(text: string) {
    this.selectedObjectIds = [];
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
    this.warningTexts[0].x = 315;
    this.warningTexts[0].y = 410;
    this.warningTextContainer.sortableChildren = true;
    this.warningTextContainer.addChild(this.warningTexts[0]);
    this.warningTextContainer.visible = true;
    setTimeout(() => {
      this.hideWarn();
    }, 2000);
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
    this.warningRect.drawRoundedRect(300, 400, 600, this.rowSize, 15);
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
    this.refreshText();
    this.texts[this.selectedText].style = new PIXI.TextStyle({
      fill: 0xffffff
    });
  }

  public refreshText() {
    this.textMarker.y = this.selectedText * this.rowSize;
    for (let i = 0; i < this.texts.length; i++) {
      const text = this.texts[i];
      text.style = new PIXI.TextStyle({
        fill: 0x00000
      });
    }
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

  public setListOfTexts(texts: BasicText[]): any {
    this.texts = [];
    this.selectedObjectIds = [];
    this.selectedText = 0;
    this.textContainer.removeChildren();
    this.initTextMarker();
    for (let i = 0; i < texts.length; i++) {
      const text = texts[i];
      this.addText(text.text, i, text.id);
    }
    this.setTextMarker();
    this.resizeRect();
  }

  public setDetailsText(detailText: DetailText) {}
}
