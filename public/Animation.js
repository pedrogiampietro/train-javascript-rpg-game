export default class Animation {
  constructor(name, length, row, width, height, withStop = false) {
    this.name = name;
    this.length = length;
    this.row = row;
    this.width = width;
    this.height = height;
    this.withStop = withStop;

    this.frame = { index: 0, x: 0, y: 0 };
    this.count = 1;
    this.bopIndex = 0;
    this.bopCount = 4;
    this.decreaseBop = false;
    this.stopped = false;

    this.lastTime = Date.now();
    this.speed = 100;

    this.reset();
  }

  update(time) {
    if (!this.canAnimate()) return;

    this.lastTime = time;

    if (this.length === 1) {
      if (this.decreaseBop) this.bopIndex--;
      else this.bopIndex++;

      if (this.bopIndex >= this.bopCount) this.decreaseBop = true;
      else if (this.bopIndex <= 0) this.decreaseBop = false;

      return this.bopCallback?.(this.bopIndex);
    }

    if (this.frame.index >= this.length - 1) {
      if (this.count > 0) this.count--;

      if (this.count <= 0) this.endCallback?.();

      if (this.withStop) {
        this.stopped = true;
        return;
      }

      return this.reset();
    }

    this.frame.index++;
    this.frame.x = this.frame.index * this.width;
    this.frame.y = this.row * this.height;
  }

  setCount(count, onEnd) {
    this.count = count;
    this.endCallback = onEnd;
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  setRow(row) {
    this.row = row;
  }

  canAnimate() {
    return Date.now() - this.lastTime > this.speed && !this.stopped;
  }

  getSecondFrame() {
    return {
      index: 1,
      x: this.width,
      y: this.row * this.height,
    };
  }

  reset() {
    this.lastTime = Date.now();
    this.frame = {
      index: 0,
      x: 0,
      y: this.row * this.height,
    };
  }

  onBop(callback) {
    this.bopCallback = callback;
  }
}
