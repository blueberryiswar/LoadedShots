export default class PhysicsEntity {
    constructor(scene, x, y, texture, physicsConfig) {
        this.scene = scene;
        this.texture = texture;
        this.x = x;
        this.y = y;
        
        // Create both graphics and physics body
        this.createGraphics();
        this.createPhysics(physicsConfig);
    }
    
    createGraphics() {
        this.sprite = this.scene.add.sprite(this.x, this.y, this.texture);
    }
    
    createPhysics(config) {
        // To be implemented by child classes
        throw new Error('createPhysics() must be implemented');
    }
    
    update() {
        // Sync graphics with physics body
        if (this.body) {
            this.sprite.x = this.body.position.x;
            this.sprite.y = this.body.position.y;
            this.sprite.rotation = this.body.angle;
        }
    }
    
    destroy() {
        this.sprite.destroy();
        this.scene.matter.world.remove(this.body);
    }
}