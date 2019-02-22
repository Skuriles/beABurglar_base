export class BasicTextRect {
  rect: PIXI.Graphics;
  text: PIXI.Text;
  /**
   *
   */
  constructor() {
    this.rect = new PIXI.Graphics();
    this.rect.zIndex = 9997;
    this.rect.lineStyle(2, 0x000000, 1);
    this.rect.beginFill(0xffffff, 1);
    this.rect.drawRoundedRect(50, 5, 800, 50, 15);
    this.rect.endFill();
    this.text = new PIXI.Text("Hello to be a Burglar");
    this.text.zIndex = 9998;
    this.text.x = 65;
    this.text.y = 15;
  }

  public hide() {
    let i = 20;
    let cancel = setInterval(() => {
      this.rect.alpha = 1 - 1 / i;
      this.text.alpha = 1 - 1 / i;
      i--;
      if (i == 0) {
        clearInterval(cancel);
        this.rect.visible = false;
        this.text.visible = false;
      }
    }, 20);
  }

  public show() {
    this.rect.alpha = 1;
    this.text.alpha = 1;
    this.rect.visible = true;
    this.text.visible = true;
  }

  public setText(text: string): any {
    this.text.text = text;
  }
}
