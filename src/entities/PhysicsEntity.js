export default class PhysicsEntity {
    constructor(scene, x, y, texture, physicsConfig) {
        this.scene = scene;
        this.texture = texture;
        this.name = texture;
        this.destroyed = false
        this.x = x;
        this.y = y;
        
        // Create both graphics and physics body
        this.createPhysics(physicsConfig);
    }
    
    createPhysics(config) {
        // To be implemented by child classes
        throw new Error('createPhysics() must be implemented');
    }
    
    update() {
        if(this.destroyed) return
        // Sync graphics with physics body
        if (this.body) {
            this.sprite.x = this.body.position.x;
            this.sprite.y = this.body.position.y;
            this.sprite.rotation = this.body.angle;
        }
        
    }
    
    destroy() {
        try {
            this.sprite.destroy();
            this.scene.matter.world.remove(this.body);
            this.scene.removeEntity(this);
        } catch(e) {
            console.log(e)
        }
        this.body = false;
        this.destroyed = true;
    }
}