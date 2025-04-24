export default class GuestController {
    constructor(scene) {
        this.scene = scene;
        this.queue = [];
        this.queueMaxLength = 6;
        this.current = null;
        this.currentPosition = {
            x: 300, y: 400
        };
        this.queuePositions = [
            {x: 600, y: 700}
        ]
    }

    addGuest(guest) {
        if(this.queue.length > 6) this.scene.gameOver();
        this.queue.push(guest);
        guest.setPosition(this.queue.length - 1);
    }

    
    destroy() {
        console.log("todo");
    }
}