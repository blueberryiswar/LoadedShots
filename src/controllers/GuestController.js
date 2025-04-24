import Guest from "../entities/Guest";

export default class GuestController {
    constructor(scene) {
        this.scene = scene;
        this.queue = [];
        this.current = null;
        this.currentPosition = {
            x: 300, y: 400
        };
        this.queuePositions = [
            {x: 600, y: 300},
            {x: 700, y: 300},
            {x: 800, y: 300},
            {x: 900, y: 300},
            {x: 1000, y: 300},
            {x: 1100, y: 300}
        ]
    }

    addGuest(guest) {

        if(!this.current) {
            this.setCurrent(guest);
            return
        }

        if(this.queue.length > this.queuePositions.length - 1) {
            this.scene.gameOver();
            return
        }
        this.queue.push(guest);
        guest.setQueuePos(this.queue.length);
        guest.moveTo(this.queuePositions[this.queue.length - 1]);
    }

    updatePosition(guest) {
        let position = this.queue.indexOf(guest);
        guest.setQueuePos(position + 1);
        guest.moveTo(this.queuePositions[position]);
    }

    updateQueue() {
        this.queue.forEach((guest) => {
            this.updatePosition(guest);
        });
    }

    nextGuest() {
        this.current.leave();
        this.setCurrent(this.queue.shift());
        
        this.updateQueue();
    }

    setCurrent(guest) {
        this.current = guest;
        guest.setQueuePos(0);
        guest.moveTo(this.currentPosition);
    }

    
    destroy() {
        console.log("todo");
    }
}