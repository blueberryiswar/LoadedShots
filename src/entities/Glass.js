import PhysicsEntity from './PhysicsEntity.js';

export default class Glass extends PhysicsEntity {
    createPhysics(config) {
        const physicsConfig = {
            ...config,
            frictionAir: 0.05,  // Add some air resistance for smoother movement
            friction: 0.1       // Surface friction
        };
        
        // Create physics sprite
        this.sprite = this.scene.matter.add.sprite(
            this.x, 
            this.y, 
            this.texture, 
            null, 
            {
                ...physicsConfig,
                shape: config
            }
        );
        
        this.body = this.sprite.body;
        
        // Enable controls
        this.setupControls();
    }
    
    setupControls() {
        // Keyboard controls
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        
        // Mouse controls
        this.scene.input.on('pointermove', (pointer) => {
            if (pointer.isDown) {
                this.moveTo(pointer.worldX, pointer.worldY);
            }
        });
        
        // Movement parameters
        this.moveSpeed = 5;
        this.rotateSpeed = 0.05;
    }
    
    update() {
        super.update(); // Call parent update for position sync
        
        // Keyboard movement
        if (this.cursors.left.isDown) {
            this.setVelocityX(-this.moveSpeed);
        } 
        else if (this.cursors.right.isDown) {
            this.setVelocityX(this.moveSpeed);
        }
        
    }
    
    moveTo(x, y) {
        // Calculate direction vector
        const dx = x - this.body.position.x;
        const dy = y - this.body.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Normalize and apply force
        if (distance > 10) { // Deadzone to prevent jitter
            const force = {
                x: (dx / distance) * this.moveSpeed * this.body.mass,
                y: (dy / distance) * this.moveSpeed * this.body.mass
            };
            this.scene.matter.body.applyForce(this.body, force);
        }
    }
    
    setVelocityX(velocity) {
        this.scene.matter.body.setVelocity(this.body, {
            x: velocity,
            y: this.body.velocity.y
        });
    }
    
}