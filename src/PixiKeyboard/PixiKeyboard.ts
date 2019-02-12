import KeyboardManager from "./KeyboardManager";
import HotKey from "./HotKey";
import Key from "./Key";

export class PixiKeyboard {
  public keyboardManager: any;
  public keyboard: any;

  constructor() {
    this.keyboardManager = new KeyboardManager();
    this.keyboardManager.enable();
    this.keyboard = {
      KeyboardManager: KeyboardManager,
      Key: Key,
      HotKey: HotKey
    };
  }
}
