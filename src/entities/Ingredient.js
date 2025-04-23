import PhysicsEntity from './PhysicsEntity.js';

export default class Ingredient extends PhysicsEntity {


    createPhysics(config) {
        // Single-line creation with physics
        this.sprite = this.scene.matter.add.sprite(
            this.x,
            this.y,
            this.texture,
            null, {
                ...config,
                shape: config
            }
        );

        this.body = this.sprite.body;
        this.label = "Ingredient"

        // Disappearance properties
        this.disappearDelay = 2000; // 2 seconds before starting to fade
        this.fadeDuration = 1000; // 1 second fade out
        this.shouldDisappear = false;
        console.log(this)
    }


    beginDisappear() {
        if (this.shouldDisappear || this.destroyed) return;
        console.log("bye")
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

    destroy() {
        // Add particle effect on disappearance
        this.scene.add.particles(
            this.sprite.x,
            this.sprite.y,
            'sparkle', {
                speed: 100,
                scale: {
                    start: 0.5,
                    end: 0
                },
                lifespan: 600,
                quantity: 5
            }
        );
        super.destroy();
    }

}