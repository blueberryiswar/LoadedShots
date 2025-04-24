import PhysicsEntity from './PhysicsEntity.js';

export default class Ingredient extends PhysicsEntity {


    createPhysics(config) {
        // Generate random rotation (in radians)
        const randomRotation = Phaser.Math.FloatBetween(0, 360);
        // Single-line creation with physics
        this.sprite = this.scene.matter.add.sprite(
            this.x,
            this.y,
            this.texture,
            null, {
                ...config,
                shape: config,
                density: 5
            }
        );

        this.body = this.sprite.body;
        this.sprite.setAngle(randomRotation)
        this.label = "Ingredient"

        this.body.angularVelocity = Phaser.Math.FloatBetween(-0.02, 0.02);

        // Disappearance properties
        this.disappearDelay = 500; // 0.5 seconds before starting to fade
        this.fadeDuration = 1000; // 1 second fade out
        this.shouldDisappear = false;
    }


    beginDisappear() {
        if (this.shouldDisappear || this.destroyed) return;
        this.shouldDisappear = true;
        this.timeStarted = this.scene.time.now;
    }

    update() {
        if(this.destroyed) return
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
    }

}