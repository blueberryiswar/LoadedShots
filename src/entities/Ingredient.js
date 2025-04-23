import PhysicsEntity from './PhysicsEntity.js';

export default class Ingredient extends PhysicsEntity {
    

    createPhysics(config) {
        // Single-line creation with physics
        this.sprite = this.scene.matter.add.sprite(
            this.x, 
            this.y, 
            this.texture, 
            null, 
            {
                ...config,
                shape: config
            }
        );
        
        this.body = this.sprite.body;
        
    }
}