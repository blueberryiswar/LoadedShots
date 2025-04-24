import PhysicsEntity from './PhysicsEntity.js';

export default class Glass extends PhysicsEntity {
    createPhysics(config) {
        const physicsConfig = {
            ...config
        };

        this.sprite = this.scene.matter.add.sprite(
            this.x, this.y, this.texture, null, {
                ...physicsConfig,
                shape: config
            }
        );
        this.body = this.sprite.body;
        this.sprite.setAlpha(0.9)

        this.rotationConstraint = {
            min: -0.1, // radians (-5.7 degrees)
            max: 0.1, // radians (5.7 degrees)
            stiffness: 0.05
        };
    }

    addLiquid(texture){
        this.liquid = this.scene.add.image(this.x,this.y, texture);
    }

    update() {
        super.update();

        if(this.liquid) {
            this.liquid.x = this.body.position.x;
            this.liquid.y = this.body.position.y;
        }

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

    }
}