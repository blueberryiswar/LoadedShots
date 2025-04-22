import PhysicsEntity from './PhysicsEntity.js';

export default class Glass extends PhysicsEntity {
    createPhysics(config) {
        const physicsConfig = {
            isStatic: true,
            restitution: 0.5,
            ...config
        };
        
        this.body = this.scene.matter.add.rectangle(
            this.x,
            this.y,
            this.sprite.width,
            this.sprite.height,
            physicsConfig
        );
    }
}