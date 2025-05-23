class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        this.load.image("tilemap_tiles", "tilemap_packed.png");
        this.load.image("bg_tiles", "tilemap-backgrounds_packed.png");
        this.load.tilemapTiledJSON("platformer-level-1", "platformer_draft_2.tmj");

        this.load.spritesheet("tilemap_sheet", "tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });
        this.load.spritesheet("tilemap_spikes", "tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 9
        });

        this.load.multiatlas("kenny-particles", "kenny-particles.json");

        this.load.audio("defeat", "pepSound5.ogg");
        this.load.audio("jump", "phaseJump2.ogg");
        this.load.audio("coin", "phaseJump4.ogg");
        this.load.audio("win", "powerUp3.ogg");
        this.load.audio("flag", "threeTone2.ogg");
    }

    create() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 0,
                end: 1,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0000.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0001.png" }
            ],
        });        

        this.anims.create({
            key: 'collect',
            defaultTextureKey: "kenny-particles",
            frames: [
                { frame: "magic_05.png" },
                { frame: "magic_03.png" },
                { frame: "magic_04.png" }
            ],
            frameRate: 30
        });

        this.anims.create({
            key: 'flag',
            defaultTextureKey: "kenny-particles",
            frames: [
                { frame: "star_06.png" },
                { frame: "star_07.png" },
                { frame: "star_08.png" },
                { frame: "star_09.png" }
            ],
            frameRate: 30
        });

        this.scene.start("platformerScene");
    }

    update() {
    }
}