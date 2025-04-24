export default class Guest {
    constructor(scene, x, y, texture) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.name = texture;

        this.createImage(texture);
    }

    createImage(texture) {
        this.image = this.scene.add.image(this.x, this.y, texture)
    }
}