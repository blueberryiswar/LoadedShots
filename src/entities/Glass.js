import PhysicsEntity from './PhysicsEntity.js';

export default class Glass extends PhysicsEntity {
    createPhysics(config) {
        const physicsConfig = {
            ...config,
            frictionAir: 0.05, // Higher for quicker stops
            friction: 0.01, // Lower for smoother sliding
            density: 10 // Ensure this matches your desired weight
        };

        this.sprite = this.scene.matter.add.sprite(
            this.x, this.y, this.texture, null, {
                ...physicsConfig,
                shape: config
            }
        );
        this.body = this.sprite.body;

        // Movement tracking
        this.lastMousePos = {
            x: 0,
            y: 0
        };
        this.currentMousePos = {
            x: 0,
            y: 0
        };
        this.mouseVelocity = {
            x: 0,
            y: 0
        };
        this.isDragging = false;
        this.rotationConstraint = {
            min: -0.1, // radians (-5.7 degrees)
            max: 0.1, // radians (5.7 degrees)
            stiffness: 0.05
        };

        this.setupMouseControls();
    }

    setupMouseControls() {
        // Track mouse position every frame
        this.scene.input.on('pointermove', (pointer) => {
            this.currentMousePos.x = pointer.worldX;

            if (pointer.isDown && pointer.leftButtonDown()) {
                if (!this.isDragging) {
                    // Just started dragging
                    this.isDragging = true;
                    this.lastMousePos.x = pointer.worldX;
                }
            } else {
                this.isDragging = false;
            }
        });

        // Parameters
        this.sensitivity = 0.8; // Adjust this to control responsiveness
        this.maxSpeed = 50; // Maximum velocity allowed
    }

    update() {
        super.update();

        // Apply constrained rotation
        if (this.rotationConstraint) {
            const currentAngle = this.body.angle;
            if (currentAngle < this.rotationConstraint.min) {
                this.scene.matter.body.setAngle(this.body, this.rotationConstraint.min);
                this.scene.matter.body.setAngularVelocity(this.body, 0);
            } else if (currentAngle > this.rotationConstraint.max) {
                this.scene.matter.body.setAngle(this.body, this.rotationConstraint.max);
                this.scene.matter.body.setAngularVelocity(this.body, 0);
            }

            // Apply slight stiffness to return to center
            if (Math.abs(currentAngle) > 0.01) {
                this.scene.matter.body.setAngularVelocity(
                    this.body,
                    -currentAngle * this.rotationConstraint.stiffness
                );
            }
        }

        if (this.isDragging) {
            // Calculate mouse movement velocity
            this.mouseVelocity.x = (this.currentMousePos.x - this.lastMousePos.x) * this.sensitivity;
            this.mouseVelocity.y = 0;

            // Clamp to max speed
            if (this.mouseVelocity.x > this.maxSpeed) {
                this.mouseVelocity.x = this.mouseVelocity.x * this.maxSpeed;
            }

            // Apply velocity to glass
            this.scene.matter.body.setVelocity(this.body, this.mouseVelocity);


            // Update last position for next frame
            this.lastMousePos.x = this.currentMousePos.x;
        }
    }
}