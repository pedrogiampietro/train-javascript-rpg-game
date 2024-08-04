import Animation from "./Animation.js";

export default class Sprite {
  constructor(data) {
    this.image = new Image();
    this.image.src = data.src;
    this.image.onload = () => {
      console.log("Image loaded:", this.image.src);
    };
    this.image.onerror = () => {
      console.error("Failed to load image:", this.image.src);
    };
    this.width = data.width;
    this.height = data.height;
    this.offsetX = data.offsetX || 0;
    this.animations = {};
    for (let key in data.animations) {
      this.animations[key] = new Animation(
        key,
        data.animations[key].length,
        data.animations[key][0].y / this.height,
        this.width,
        this.height
      );
    }
    this.currentAnimation = "idle_down";
    this.frameIndex = 0;
    this.tickCount = 0;
    this.ticksPerFrame = data.ticksPerFrame || 0;
    this.x = 0;
    this.y = 0;
    this.speed = 2;
    this.layers = [];
  }

  update(time) {
    this.animations[this.currentAnimation].update(time);
    for (let layer of this.layers) {
      layer.setAnimation(this.currentAnimation);
      layer.update(time);
    }
  }

  render(ctx, x, y) {
    let frame = this.animations[this.currentAnimation].frame;
    // Render the main sprite
    ctx.drawImage(
      this.image,
      frame.x,
      frame.y,
      this.width,
      this.height,
      x + this.offsetX,
      y,
      this.width,
      this.height
    );
    // Render all layers on top of the main sprite
    for (let layer of this.layers) {
      layer.render(ctx, x + layer.offsetX, y);
    }
  }

  setAnimation(animation) {
    if (this.currentAnimation !== animation) {
      this.currentAnimation = animation;
      this.animations[animation].reset();
      for (let layer of this.layers) {
        layer.setAnimation(animation);
      }
    }
  }

  addLayer(sprite) {
    this.layers.push(sprite);
  }

  removeLayer(spriteKey) {
    this.layers = this.layers.filter((layer) => layer.key !== spriteKey);
  }
}
