import Key from "./Key";

export default class HotKey {
  key: any;
  manager: any;
  isPressed: boolean;
  isDown: boolean;
  isReleased: boolean;
  crtl: boolean;
  shift: boolean;
  alt: boolean;

  constructor(key: any, manager: any) {
    this.key = key;
    this.manager = manager;
    this.isPressed = false;
    this.isDown = false;
    this.isReleased = false;

    this.crtl = false;
    this.shift = false;
    this.alt = false;
  }

  update() {
    this.isDown = this.manager.isDown(this.key);
    this.isPressed = this.manager.isPressed(this.key);
    this.isReleased = this.manager.isReleased(this.key);
    this.crtl = this.manager.isDown(Key.CTRL);
    this.shift = this.manager.isDown(Key.SHIFT);
    this.alt = this.manager.isDown(Key.ALT);
  }

  remove() {
    this.manager.removeHotKey(this.key);
  }
}
