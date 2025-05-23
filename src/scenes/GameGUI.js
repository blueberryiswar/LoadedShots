export default class GameGUI {
    constructor(scene) {
        this.scene = scene;
        this.score = 0;
        this.createGUI();
    }

    createGUI() {
        // Main container for all GUI elements
        this.guiContainer = this.scene.add.container(0, 0).setDepth(1000);

        // Background panel
        this.bgPanel = this.scene.add.rectangle(
            20, 20, 300, 120, 0x000000, 0.7
        ).setOrigin(0).setStrokeStyle(2, 0xFFFFFF, 0.8);
        this.guiContainer.add(this.bgPanel);

        // Score display
        this.scoreTextShadow = this.scene.add.text(
            44, 44, 'Earnings: $0', 
            { font: '24px Arial Black', fill: '#000000', stroke: "#000000", strokeThickness: 2 }
        ).setOrigin(0).setAlpha(0.5);
        this.scoreText = this.scene.add.text(
            40, 40, 'Earnings: $0', 
            { font: '24px Arial Black', fill: '#FFFFFF', stroke: "#000000", strokeThickness: 2 }
        ).setOrigin(0);
        this.guiContainer.add(this.scoreText);

        // Current objective
        this.objectiveText = this.scene.add.text(
            40, 80, 'Catch ingredients!', 
            { font: '18px Arial', fill: '#88FF88', wordWrap: { width: 250 } }
        ).setOrigin(0);
        this.guiContainer.add(this.objectiveText);

        // Timer (optional)
        this.timeTextShadow = this.scene.add.text(
            this.scene.cameras.main.width - 96, 44, '0:15',
            { font: '28px Arial Black', fill: '#000000', stroke: '#000000', strokeThickness: 3 }
        ).setOrigin(0.5, 0).setAlpha(0.5);
        this.timeText = this.scene.add.text(
            this.scene.cameras.main.width - 100, 40, '0:15',
            { font: '28px Arial Black', fill: '#FF5555', stroke: '#000000', strokeThickness: 3 }
        ).setOrigin(0.5, 0);
        this.guiContainer.add(this.timeText);

        // Floating messages container
        this.floatingMessages = this.scene.add.container(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.height - 100
        );
        this.guiContainer.add(this.floatingMessages);
    }

    updateScore(points) {
        this.score += points;
        this.score = Phaser.Math.CeilTo(this.score, -2);
        const text = `Earnings: $${this.score}`;
        this.scoreText.setText(text);
        this.scoreTextShadow.setText(text)
        
        // Score animation
        this.scene.tweens.add({
            targets: this.scoreText,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 200,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });
    }

    setObjective(text) {
        this.objectiveText.setText(text);
        
        // Blink animation to draw attention
        this.scene.tweens.add({
            targets: this.objectiveText,
            alpha: 0.5,
            duration: 200,
            yoyo: true,
            repeat: 2
        });
    }

    showFloatingMessage(text, color = '#FFFFFF', x = 0, y = 0, font = '26px Arial') {
        const message = this.scene.add.text(
            x, y, text, 
            { fontFamily: 'Arial Black', fontSize: 28, fill: color
                , stroke: '#000000', strokeThickness: 6 
            }
        ).setOrigin(0.5).setScale(1.5,1.5);
        
        this.floatingMessages.add(message);
        
        // Animate message
        this.scene.tweens.add({
            targets: message,
            y: message.y - 90,
            duration: 1500
        });
        this.scene.tweens.add({
            targets: message,
            scaleX: 1,
            scaleY: 1,
            duration: 1000
        });
        this.scene.tweens.add({
            targets: message,
            alpha: 0,
            duration: 2000,
            ease: 'Sine.easeIn',
            onComplete: () => message.destroy()
        });
    }

    updateTimer(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const text = `${mins}:${secs < 10 ? '0' + secs : secs}`;
        this.timeText.setText(text);
        this.timeTextShadow.setText(text);
        
        // Flash when time is running low
        if (seconds <= 30 && seconds % 2 === 0) {
            this.timeText.setColor('#FF0000');
        } else {
            this.timeText.setColor('#FF5555');
        }
    }
}