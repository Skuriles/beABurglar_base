import { Keyboard } from "./keyboard";

export class Left extends Keyboard {
  public press() {
    this.sprite.texture = this.textures[this.counter];
    //Change the cat's velocity when the key is pressed
    this.sprite.vx = -5;
    this.sprite.vy = 0;
    let cancel = setInterval(() => {
      if (this.isDown) {
        if (this.counter == 7) {
          this.counter = 0;
        }
        this.sprite.texture = this.textures[this.counter++];
      } else {
        clearInterval(cancel);
      }
    }, 100);
    this.sprite.texture = this.textures[this.counter++];
  }
  //Left arrow key `release` method
  public release() {
    //If the left arrow has been released, and the right arrow isn't down,
    //and the cat isn't moving vertically:
    //Stop the cat
    if (!this.isDown && this.sprite.vy === 0) {
      this.sprite.vx = 0;
      this.counter = 0;
      this.sprite.texture = this.textures[this.counter];
    }
  }
  public isPressed() {
    this.sprite.texture = this.textures[this.counter++];
  }
}

export class Up extends Keyboard {
  public press() {
    this.sprite.texture = this.textures[this.counter];
    this.sprite.vx = 0;
    this.sprite.vy = -5;
  }
  //Left arrow key `release` method
  public release() {
    //If the left arrow has been released, and the right arrow isn't down,
    //and the cat isn't moving vertically:
    //Stop the cat
    if (!this.isDown && this.sprite.vx === 0) {
      this.sprite.vy = 0;
      this.counter = 0;
      this.sprite.texture = this.textures[this.counter];
    }
  }
  public isPressed() {
    this.sprite.texture = this.textures[this.counter++];
  }
}

export class Right extends Keyboard {
  public press() {
    this.sprite.texture = this.textures[this.counter];
    //Change the cat's velocity when the key is pressed
    this.sprite.vx = 5;
    this.sprite.vy = 0;
  }
  //Left arrow key `release` method
  public release() {
    //If the left arrow has been released, and the right arrow isn't down,
    //and the cat isn't moving vertically:
    //Stop the cat
    if (!this.isDown && this.sprite.vy === 0) {
      this.sprite.vx = 0;
      this.counter = 0;
      this.sprite.texture = this.textures[this.counter];
    }
  }
  public isPressed() {
    console.log("is pressed");
    this.sprite.texture = this.textures[this.counter++];
  }
}

export class Down extends Keyboard {
  public press() {
    this.sprite.texture = this.textures[this.counter];
    //Change the cat's velocity when the key is pressed
    this.sprite.vx = 0;
    this.sprite.vy = 5;
  }
  //Left arrow key `release` method
  public release() {
    //If the left arrow has been released, and the right arrow isn't down,
    //and the cat isn't moving vertically:
    //Stop the cat
    if (!this.isDown && this.sprite.vx === 0) {
      this.sprite.vy = 0;
      this.counter = 0;
      this.sprite.texture = this.textures[this.counter];
    }
  }

  public isPressed() {
    this.sprite.texture = this.textures[this.counter++];
  }
}
