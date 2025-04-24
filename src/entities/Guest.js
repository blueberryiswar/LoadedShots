export default class Guest {
    constructor(scene, x, y, texture) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.target = {x: x, y: y}
        this.name = texture;
        this.pos = 0

        this.createImage(texture);
    }

    createImage(texture) {
        this.image = this.scene.add.image(this.x, this.y, texture)
    }

    setPosition(pos) {
        this.pos = pos;
    }

    leave() {
        this.target.x = -400;
    }

    update(time, delta) {
        
    }
}