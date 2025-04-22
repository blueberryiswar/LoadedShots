import PhysicsEntity from './PhysicsEntity.js';

export default class Ingredient extends PhysicsEntity {
    createPhysics(config) {
        // Merge default config with custom config
        const physicsConfig = {
            restitution: 0.8,
            friction: 0.1,
            ...config
        };
        
        this.body = this.scene.matter.add.circle(
            this.x, 
            this.y, 
            this.sprite.width/2, 
            physicsConfig
        );
    }
}