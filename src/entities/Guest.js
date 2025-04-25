export default class Guest {
    constructor(scene, x, y, texture) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.target = {x: x, y: y}
        this.name = texture;
        this.queuePos = 0
        this.hand = null;
        this.speed = {x: 0.1, y:0.05};

        this.movementQueue = [];

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
        this.moveTo({x: -500, y: this.image.y});
        console.log(`${this.name} is leaving`);
    }

    getDrink(drink) {
        this.hand = drink
        console.log(`${this.name} took a drink`,this.hand)
    }

    moveTo(position) {
        this.target = {x: position.x, y: position.y};
        if(!this.movement) {
            this.startWobblyMovement(this.target);
        } else {
            this.movementQueue.push({x: position.x, y:position.y});
        }
        console.log(`${this.name} wants to move towards`, this.target)
    }

    onMovementComplete() {
        if(this.movementQueue.length > 0) {
            this.startWobblyMovement(this.movementQueue.shift());
        } else {
            this.movement = null
        }
    }

    startWobblyMovement(target) {
        const startX = this.image.x;
        const startY = this.image.y;
        const targetY = target.y;
        const targetX = target.x;
        const distance = Phaser.Math.Distance.Between(startX, startY, target.x, target.y);
        const duration = distance * 2; // Adjust speed (pixels per ms)

        // Store movement properties
        this.movement = {
            startX,
            startY,
            targetX,
            targetY,
            progress: 0,
            amplitude: 15, // How high the wobble goes
            frequency: 0.02, // How fast it wobbles
            duration: duration
        };

        // Start update loop for custom movement
        this.scene.events.on('update', this.updateWobblyMovement, this);
    }

    updateWobblyMovement() {
        if (!this.movement) return;

        // Calculate progress (0 to 1)
        this.movement.progress = Phaser.Math.Clamp(
            this.movement.progress + (1 / this.movement.duration) * this.scene.game.loop.delta,
            0,
            1
        );

        // Linear progress along X
        const x = Phaser.Math.Linear(
            this.movement.startX,
            this.movement.targetX,
            this.movement.progress
        );

        // Base Y position (straight line)
        const baseY = Phaser.Math.Linear(
            this.movement.startY,
            this.movement.targetY,
            this.movement.progress
        );

        // Add sine wave wobble to Y
        const wobble = Math.sin(this.movement.progress * Math.PI * 2 * this.movement.frequency) * 
                    this.movement.amplitude * 
                    (1 - this.movement.progress); // Reduce wobble near end

        this.image.x = x;
        this.image.y = baseY + wobble;

        // Complete when reached target
        if (this.movement.progress >= 1) {
            this.scene.events.off('update', this.updateWobblyMovement, this);
            this.movement = null;
            this.onMovementComplete(); // Call your completion handler
        }
    }

    update(time, delta) {

        if(this.hand) {
            this.hand.container.x = this.image.x;
            this.hand.container.y = this.image.y;
        }
    }
}