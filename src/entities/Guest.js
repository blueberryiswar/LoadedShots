export default class Guest {
    constructor(scene, x, y, texture) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.target = {x: x, y: y}
        this.name = texture;
        this.queuePos = 0

        this.createImage(texture);
        this.scene.entities.push(this);
    }

    createImage(texture) {
        this.image = this.scene.add.image(this.x, this.y, texture);
        this.scene.layers.guests.add(this.image);
    }

    setQueuePos(pos) {
        this.queuePos = pos;
        this.image.setDepth(10 - pos);
        if(this.queuePos != 0) {
            this.setQueueState()
        } else {
            this.setActiveState()
        }
    }

    setQueueState() {
        this.image.setScale(0.8,0.8);
        this.image.setTint(0x000000);
    }

    setActiveState() {
        this.image.setScale(1,1);
        this.image.clearTint();
    }

    leave() {
        this.target.x = -400;
    }

    moveTo(position) {
        this.target = position
    }

    update(time, delta) {
        if(this.image && this.image.x != this.target.x) {
            console.log(`{this.name} move to`, this.target)
            this.image.x = this.target.x;
            this.image.y = this.target.y;
        }
    }
}