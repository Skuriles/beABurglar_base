export abstract class Keyboard {
  value: string;
  isDown: boolean;
  isUp: boolean;
  //Attach event listeners
  downListener: any;
  upListener: any;
  pressedListener: any;
  sprite: any;
  textures: any[] = [];
  counter = 0;

  constructor(value: string) {
    this.downListener = this.downHandler.bind(this);
    this.upListener = this.upHandler.bind(this);
    this.pressedListener = this.pressedHandler.bind(this);
    this.value = value;
    this.isDown = false;
    this.isUp = true;

    window.addEventListener(
      "keydown",
      event => this.downListener(event),
      false
    );
    window.addEventListener(
      "keypress",
      event => this.pressedListener(event),
      false
    );
    window.addEventListener("keyup", event => this.upListener(event), false);
  }

  //The `upHandler`
  private upHandler(event: any) {
    if (event.key === this.value) {
      if (this.isDown && this.release) {
        this.isDown = false;
        this.isUp = true;
        this.release();
      }
      event.preventDefault();
    }
  }

  private downHandler(event: any) {
    if (event.key === this.value) {
      if (this.isUp && this.press) {
        this.isDown = true;
        this.isUp = false;
        this.press();
      }
      event.preventDefault();
    }
  }

  private pressedHandler(event: any) {
    if (event.key === this.value) {
      this.isPressed();
    }
    event.preventDefault();
  }

  // Detach event listeners
  private unsubscribe() {
    window.removeEventListener("keypressed", event =>
      this.pressedListener(event)
    );
    window.removeEventListener("keydown", event => this.downListener(event));
    window.removeEventListener("keyup", event => this.upListener(event));
  }

  abstract press(): void;
  abstract release(): void;
  abstract isPressed(): void;
}
