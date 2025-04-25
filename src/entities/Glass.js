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
    addLiquidBackground(texture){
        this.liquidbg = this.scene.add.image(this.x,this.y, texture);
    }

    preUpdate() {
        // Safety checks
        if (!this.body || !this.scene || !this.scene.matter) return;
    
        // Get all bodies that could potentially overlap
        const allBodies = this.scene.matter.world.getAllBodies().filter(body => {
            return body && 
                body.position && 
                body.position.x !== undefined && 
                body !== this.body &&
                !body.isStatic;
        });
        
        // Check each nearby body
        allBodies.forEach(body => {
            try {
                const dx = body.position.x - this.body.position.x;
                const dy = body.position.y - this.body.position.y;
                const distanceSquared = dx * dx + dy * dy;
                
                // Apply stickiness within 40px radius (1600 squared)
                if (distanceSquared < 1600) {
                    const distance = Math.sqrt(distanceSquared);
                    const direction = {
                        x: dx / distance,
                        y: dy / distance
                    };
                    
                    // Dampen velocities (bring closer together)
                    const dampening = 0.30; // 70% velocity reduction
                    this.scene.matter.body.setVelocity(body, {
                        x: body.velocity.x * dampening + direction.x * 0.2,
                        y: body.velocity.y * dampening + direction.y * 0.2
                    });
                    
                }
            } catch (e) {
                console.warn("Stickiness error with body:", body, e);
            }
        });
    }

    turnIn() {
        this.scene.scoreGlass(this);
    }

    update() {
        this.preUpdate();
        super.update();

        if(this.liquid) {
            this.liquid.x = this.body.position.x + 2;
            this.liquid.y = this.body.position.y - 18;
        }
        if(this.liquidbg) {
            this.liquidbg.x = this.body.position.x + 2;
            this.liquidbg.y = this.body.position.y - 15.76;
        }

        if(this.body.position.x <= 589) {
            this.turnIn()
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