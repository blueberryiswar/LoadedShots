export default class GlassController {
    constructor(scene) {
        this.scene = scene;
        this.glass = false;
        this.isDragging = false;
        this.dragStartPos = { x: 0, y: 0 };
        this.sensitivity = 0.5;
        this.maxSpeed = 10;
        
        this.setupControls();
    }
    
    setupControls() {
        // Clear old listeners
        this.scene.input.off('pointerdown');
        this.scene.input.off('pointerup');
        this.scene.input.off('pointermove');
        
        // New listeners
        this.scene.input.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown() && this.glass?.body) {
                this.startDrag(pointer);
            }
        });
        
        this.scene.input.on('pointerup', () => {
            if (this.isDragging) {
                this.endDrag();
            }
        });
        
        this.scene.input.on('pointermove', (pointer) => {
            if (this.isDragging && this.glass?.body) {
                this.updateDrag(pointer);
            }
        });
    }
    
    startDrag(pointer) {
        this.isDragging = true;
        this.dragStartPos.x = pointer.worldX;
        this.dragStartPos.y = pointer.worldY;
    }
    
    updateDrag(pointer) {
        const dx = pointer.worldX - this.dragStartPos.x;
        
        // Apply velocity based on mouse movement
        this.scene.matter.body.setVelocity(this.glass.body, {
            x: Phaser.Math.Clamp(dx * this.sensitivity * this.maxSpeed, - this.maxSpeed, this.maxSpeed),
            y: 0 // Lock vertical movement
        });
        
        //this.glass.body.thrustRight(dx * this.sensitivity)
        
        // Update start position for next frame
        this.dragStartPos.x = pointer.worldX;
        this.dragStartPos.y = pointer.worldY;
    }
    
    endDrag() {
        this.isDragging = false;
        // Apply slight damping
        this.scene.matter.body.setVelocity(this.glass.body, {
            x: this.glass.body.velocity.x * 0.5,
            y: 0
        });
        console.log(this.glass.body.gameObject.x, this.glass.body.gameObject.y)
    }

    removeGlass() {
        this.isDragging = false;
        this.glass = null;
    }

    addGlass(glass) {
        this.glass = glass;
        console.log("New order!");
    }
    
    destroy() {
        this.scene.input.off('pointerdown');
        this.scene.input.off('pointerup');
        this.scene.input.off('pointermove');
    }
}