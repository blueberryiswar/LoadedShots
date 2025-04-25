import PhysicsEntity from './PhysicsEntity.js';

export default class Ingredient extends PhysicsEntity {


    createPhysics(config) {
        this.lastContactCheck = 0;
        this.contactCheckInterval = 10;
        // Generate random rotation (in radians)
        const randomRotation = Phaser.Math.FloatBetween(0, 360);
        // Single-line creation with physics
        this.sprite = this.scene.matter.add.sprite(
            this.x,
            this.y,
            this.texture,
            null, {
                ...config,
                shape: config
            }
        );

        this.body = this.sprite.body;
        this.sprite.setAngle(randomRotation)
        this.label = "Ingredient"

        //this.scene.matter.setAngularVelocity(this.body, Phaser.Math.FloatBetween(-0.02, 0.02));

        // Disappearance properties
        this.disappearDelay = 500; // 0.5 seconds before starting to fade
        this.fadeDuration = 1000; // 1 second fade out
        this.shouldDisappear = false;
        //console.log(this.texture, this.sprite.body.mass)
        // Weight distribution properties
        this.heavyPoint = { x: 0, y: 0 }; // Relative to body (0,0 = center)
        this.weightForce = 0.0001; // Strength of weight effect

        // Debug visualization
        this.weightMarker = this.scene.add.circle(0, 0, 3, 0xff0000)
            .setDepth(100)
            .setVisible(false);
            
    }

    setPrice(price) {
        this.price = price
    }

    getPrice() {
        return this.price
    }


    beginDisappear() {
        if (this.shouldDisappear || this.destroyed) return;
        this.shouldDisappear = true;
        this.timeStarted = this.scene.time.now;
    }

    update() {
        if(this.destroyed || this.physicsDisabled) return
        super.update();

        if (this.shouldDisappear) {
            const elapsed = this.scene.time.now - this.timeStarted;

            // Wait for delay before fading
            if (elapsed > this.disappearDelay) {
                const fadeProgress = (elapsed - this.disappearDelay) / this.fadeDuration;

                // Fade out and shrink
                this.sprite.setAlpha(1 - fadeProgress);
                this.sprite.setScale(1 - (fadeProgress * 0.5));

                // Destroy when complete
                if (fadeProgress >= 1) {
                    this.destroy();
                }
            }
        }

        // Calculate world position of heavy point
        const heavyPointWorld = this.getHeavyPointPosition();
        if(!heavyPointWorld) return;
        this.weightMarker.setPosition(heavyPointWorld.x, heavyPointWorld.y);
        
        // Apply continuous weight force
        this.applyWeightForce();

        // Additional stabilization when stacked
        if (this.isStacked()) {
            // Apply downward force to stabilize stack

            this.scene.matter.body.setVelocity(this.body, {
                x: this.body.velocity.x * 0.95,
                y: Math.min(this.body.velocity.y + 0.1, 0.5)
            });
        }
    }
    
    isStacked() {
        if (!this.scene || !this.scene.matter || !this.body || !this.body.bounds) {
            return false;
        }
        // Only check periodically for performance
        if (this.scene.time.frame < this.lastContactCheck + this.contactCheckInterval) {
            return this.wasStacked; // Return cached result
        }
        const supportArea = this.getSupportCheckArea();
        if(!supportArea) return false

        this.lastContactCheck = this.scene.time.frame;
        
        // Simplified check using position and velocity
        const supportingBodies = this.scene.entities.filter(entity => {
            return entity instanceof Ingredient && 
                   !entity.destroyed &&
                   supportArea.contains(entity.body.position.x, entity.body.position.y) &&
                   entity.body.position.y < this.body.position.y; // Must be below
        });
        
        this.wasStacked = supportingBodies.some(ingredient => {
            return ingredient
        });
        
        return this.wasStacked;
    }
    
    getSupportCheckArea() {
        if (!this.body || !this.body.bounds) return null;
        const bounds = this.body.bounds;
        return new Phaser.Geom.Rectangle(
            bounds.min.x, // Left boundary
            bounds.min.y, // Top boundary
            bounds.max.x - bounds.min.x, // Width
            10 // Height
        );
    }

    getHeavyPointPosition() {
        if(!this.body || !this.body.position) return
        // Convert relative heavy point to world coordinates
        const angle = this.body.angle;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        
        // Get dimensions (approximate)
        const bounds = this.body.bounds;
        const width = bounds.max.x - bounds.min.x;
        const height = bounds.max.y - bounds.min.y;
        
        // Local heavy point coordinates
        const localX = this.heavyPoint.x * width / 2;
        const localY = this.heavyPoint.y * height / 2;
        
        // Rotate and translate to world position
        return {
            x: this.body.position.x + (localX * cos - localY * sin),
            y: this.body.position.y + (localX * sin + localY * cos)
        };
    }

    applyWeightForce() {
        // Only apply when not moving too fast
        if (!this.body || !this.body.position || this.body.speed < 1) return;
        
        const heavyPoint = this.getHeavyPointPosition();
        if(!heavyPoint) return;
        const angleToHeavy = Phaser.Math.Angle.Between(
            this.body.position.x,
            this.body.position.y,
            heavyPoint.x,
            heavyPoint.y
        );
        
        // Apply torque to align heavy point downward
        const matterBody = this.scene.matter.body
        if(!matterBody) return;
        const angleDiff = Phaser.Math.Angle.Wrap(angleToHeavy - this.body.angle - Math.PI);
        matterBody.setAngularVelocity(
            this.body,
            this.body.angularVelocity * 0.95 + angleDiff * this.weightForce
        );
        
        // Apply slight downward force at heavy point
        matterBody.applyForce(this.body, heavyPoint, {
            x: 0,
            y: 0.001 * this.body.mass
        });
    }

    // Add to Ingredient.js
    setWeightDistribution(x, y, force) {
        this.heavyPoint = { x, y };
        if(force) this.weightForce = force;
    }

    destroy() {
        this.weightMarker.destroy();
        super.destroy();
    }

}