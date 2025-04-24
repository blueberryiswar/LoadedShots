import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        // Load Spritesheet for Loading Screen
        this.load.spritesheet('drinkSheet', 'assets/LoadingDrink-Sheet.png', {
            frameWidth: 98,  // Width of each frame
            frameHeight: 96, // Height of each frame
            endFrame: 7      // Since you have 8 frames (0-7)
        });
        
        this.load.image('loading', 'assets/OliveSmall.png');
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
