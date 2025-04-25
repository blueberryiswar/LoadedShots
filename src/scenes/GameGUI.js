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
            20, 20, 300, 150, 0x000000, 0.7
        ).setOrigin(0).setStrokeStyle(2, 0xFFFFFF, 0.8);
        this.guiContainer.add(this.bgPanel);

        // Score display
        this.scoreText = this.scene.add.text(
            40, 40, 'Score: 0', 
            { font: '24px Arial', fill: '#FFFFFF' }
        ).setOrigin(0);
        this.guiContainer.add(this.scoreText);

        // Combo multiplier
        this.comboText = this.scene.add.text(
            40, 70, 'Combo: 1x', 
            { font: '20px Arial', fill: '#FFD700' }
        ).setOrigin(0);
        this.guiContainer.add(this.comboText);

        // Current objective
        this.objectiveText = this.scene.add.text(
            40, 100, 'Catch ingredients!', 
            { font: '18px Arial', fill: '#88FF88', wordWrap: { width: 250 } }
        ).setOrigin(0);
        this.guiContainer.add(this.objectiveText);

        // Timer (optional)
        this.timeText = this.scene.add.text(
            this.scene.cameras.main.width - 150, 40, '2:00',
            { font: '28px Arial', fill: '#FF5555' }
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
        this.score = Math.floor(this.score * 100) * 0.01;
        this.scoreText.setText(`Earnings: ${this.score}$`);
        
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

    updateCombo(multiplier) {
        this.comboText.setText(`Combo: ${multiplier}x`);
        
        // Combo color changes
        const colors = ['#FFD700', '#FFAA00', '#FF5500', '#FF0000'];
        const colorIndex = Math.min(multiplier - 1, colors.length - 1);
        this.comboText.setColor(colors[colorIndex]);
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

    showFloatingMessage(text, color = '#FFFFFF') {
        const message = this.scene.add.text(
            0, 0, text, 
            { font: '22px Arial', fill: color }
        ).setOrigin(0.5);
        
        this.floatingMessages.add(message);
        
        // Animate message
        this.scene.tweens.add({
            targets: message,
            y: message.y - 50,
            alpha: 0,
            duration: 1500,
            onComplete: () => message.destroy()
        });
    }

    updateTimer(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        this.timeText.setText(`${mins}:${secs < 10 ? '0' + secs : secs}`);
        
        // Flash when time is running low
        if (seconds <= 30 && seconds % 2 === 0) {
            this.timeText.setColor('#FF0000');
        } else {
            this.timeText.setColor('#FF5555');
        }
    }
}