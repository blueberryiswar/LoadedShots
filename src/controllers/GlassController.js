export default class GlassController {
    constructor(scene, glass) {
        this.scene = scene;
        this.glass = glass;
        this.isDragging = false;
        this.dragStartPos = { x: 0, y: 0 };
        this.sensitivity = 0.5
        this.maxSpeed = 20
        
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
            x: dx * this.sensitivity * this.maxSpeed,
            y: 0 // Lock vertical movement
        });
        
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
    }
    
    destroy() {
        this.scene.input.off('pointerdown');
        this.scene.input.off('pointerup');
        this.scene.input.off('pointermove');
    }
}