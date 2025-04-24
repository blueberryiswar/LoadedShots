export default class GuestController {
    constructor(scene) {
        this.scene = scene;
        this.queue = [];
        this.current = null;
        this.currentPosition = {
            x: 300, y: 400
        };
        this.queuePositions = [
            {x: 600, y: 700}
        ]
    }

    addGuest(guest) {
        if(this.queue.length > this.queuePositions.length) this.scene.gameOver();
        this.queue.push(guest);
        guest.setPosition(this.queue.length);
    }

    nextGuest() {
        this.current.leave();
        this.current = this.queue.shift();
        
    }

    
    destroy() {
        console.log("todo");
    }
}