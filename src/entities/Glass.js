import PhysicsEntity from './PhysicsEntity.js';

export default class Glass extends PhysicsEntity {
    createPhysics(config) {
        const physicsConfig = {
            ...config
        };
        
        // Single-line creation with physics
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
    }
}