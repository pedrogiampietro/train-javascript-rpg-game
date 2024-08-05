import Animation from "./Animation.js";

export default class Sprite {
  constructor(data) {
    this.image = new Image();
    this.image.src = data.src;
    this.width = data.width;
    this.height = data.height;
    this.animations = {};
    this.currentAnimation = null;
    this.x = 0;
    this.y = 0;
    this.speed = 2;
    this.offsetX = data.offsetX || 0;
    this.offsetY = data.offsetY || 0;
    this.layers = [];

    for (let [key, animData] of Object.entries(data.animations)) {
      if (Array.isArray(animData)) {
        this.animations[key] = animData.map(
          (frame) =>
            new Animation(
              key,
              1,
              frame.y / this.height,
              this.width,
              this.height
            )
        );
      } else {
        this.animations[key] = new Animation(
          key,
          animData.length,
          animData.row,
          this.width,
          this.height
        );
      }
    }

    this.image.onload = () => {
      console.log("Image loaded:", this.image.src);
      this.setAnimation("idle_down"); // Iniciar com a animação idle_down
    };
  }

  setAnimation(name) {
    if (this.currentAnimation === name || !this.animations[name]) return;
    this.currentAnimation = name;
    if (Array.isArray(this.animations[name])) {
      this.animations[name].forEach((anim) => anim.reset());
    } else {
      this.animations[name].reset();
    }
  }

  update(time) {
    if (this.currentAnimation && this.animations[this.currentAnimation]) {
      if (Array.isArray(this.animations[this.currentAnimation])) {
        this.animations[this.currentAnimation].forEach((animation) =>
          animation.update(time)
        );
      } else {
        this.animations[this.currentAnimation].update(time);
      }
    }

    this.layers.forEach((layer) => {
      layer.setAnimation(this.currentAnimation);
      layer.update(time);
    });
  }

  render(ctx, x, y) {
    if (this.currentAnimation && this.animations[this.currentAnimation]) {
      if (Array.isArray(this.animations[this.currentAnimation])) {
        this.animations[this.currentAnimation].forEach((animation) => {
          const frame = animation.frame;
          ctx.drawImage(
            this.image,
            frame.x,
            frame.y,
            this.width,
            this.height,
            x + this.offsetX,
            y + this.offsetY,
            this.width,
            this.height
          );
        });
      } else {
        const frame = this.animations[this.currentAnimation].frame;
        ctx.drawImage(
          this.image,
          frame.x,
          frame.y,
          this.width,
          this.height,
          x + this.offsetX,
          y + this.offsetY,
          this.width,
          this.height
        );
      }
    }

    this.layers.forEach((layer) => {
      layer.render(ctx, x, y);
    });
  }

  addLayer(layer) {
    this.layers.push(layer);
  }

  removeLayer(layerKey) {
    this.layers = this.layers.filter((layer) => layer.key !== layerKey);
  }
}
