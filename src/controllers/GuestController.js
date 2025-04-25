import Guest from "../entities/Guest";

export default class GuestController {
    constructor(scene) {
        this.scene = scene;
        this.queue = [];
        this.current = null;
        this.currentPosition = {
            x: 300, y: 420
        };
        this.queuePositions = [
            {x: 550, y: 350},
            {x: 700, y: 360},
            {x: 850, y: 370},
            {x: 1000, y: 380},
            {x: 1150, y: 390},
            {x: 1300, y: 400}
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

    serveDrink(drink) {
        this.current.getDrink(drink);
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