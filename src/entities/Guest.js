export default class Guest {
    constructor(scene, x, y, texture) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.target = {x: x, y: y}
        this.name = texture;
        this.queuePos = 0
        this.hand = null;

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
        console.log(`${this.name} is leaving`);
    }

    getDrink(drink) {
        this.hand = drink
        console.log(`${this.name} took a drink`,this.hand)
    }

    moveTo(position) {
        this.target = {x: position.x, y: position.y};
        console.log(`${this.name} wants to move towards`, this.target)
    }

    update(time, delta) {
        if(this.image && this.image.x != this.target.x) {
            this.image.x = this.target.x;
            this.image.y = this.target.y;
        }

        if(this.hand) {
            this.hand.container.x = this.image.x;
            this.hand.container.y = this.image.y;
        }
    }
}