class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    preload() {
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    init() {
        this.ACCELERATION = 400;
        this.DRAG = 1000;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -425;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;
        this.startX = 36;
        this.startY = 13*18;
        this.finish = false;
    }

    
    create() {
        
        this.map = this.add.tilemap("platformer-level-1", 18, 18, 120, 20);
        this.animatedTiles.init(this.map);
        this.physics.world.setBounds(0, 0, 120*18, 20*18);
        this.tileset = this.map.addTilesetImage("tilemap_packed", "tilemap_tiles");
        this.bgtileset = this.map.addTilesetImage("tilemap-backgrounds_packed", "bg_tiles");
        this.spikeset = this.map.addTilesetImage("tilemap_spikes", "tilemap_tiles");

        

        this.layer4 = this.map.createLayer("Tile Layer 4", this.bgtileset, 0, 0);
        this.layer3 = this.map.createLayer("Tile Layer 3", this.bgtileset, 0, 0);
        this.layer5 = this.map.createLayer("Tile Layer 5", this.tileset, 0, 0);
        this.layer1 = this.map.createLayer("Tile Layer 1", this.tileset, 0, 0);
        this.layer1.setCollisionByProperty({
            collides: true
        });



        this.coins = this.map.createFromObjects("coins", {
            name: "coin",
            key: "tilemap_sheet",
            frame: 151
        });
        this.anims.create({
            key: 'coinAnim',
            frames: this.anims.generateFrameNumbers('tilemap_sheet', 
                {start: 151, end: 152}
            ),
            frameRate: 10,
            repeat: -1
        });
        this.anims.play('coinAnim', this.coins);
        
        



        this.spikes = this.map.createFromObjects("spikes", {
            name: "spike",
            key: "tilemap_spikes",
            frame: 148
        });
        



        this.flags = this.map.createFromObjects("checkpoints", {
            name: "cp",
            key: "tilemap_sheet",
            frame: 148
        });

        for(const obj of this.flags){
            obj.used = false;
        }


        this.anims.create({
            key: 'cpAnim',
            frames: this.anims.generateFrameNumbers('tilemap_sheet', 
                {start: 111, end: 112}
            ),
            frameRate: 10,
            repeat: -1
        });
        this.anims.play('cpAnim', this.flags);
        



        this.semi = this.map.createFromObjects("semi-solid", {
            name: "semi",
            key: "tilemap_sheet",
            frame: 146
        });



        this.goal = this.map.createFromObjects("goal", {
            name: "exit",
            key: "tilemap_sheet",
            frame: 130
        });
        

        

        my.sprite.player = this.physics.add.sprite(this.startX, this.startY, "platformer_characters", "tile_0000.png");
        this.physics.add.collider(my.sprite.player, this.layer1);
        my.sprite.player.setCollideWorldBounds(true);
        my.sprite.player.setMaxVelocity(250,9999);


        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
        this.coinGroup = this.add.group(this.coins);
        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            my.vfx.coin.startFollow(obj2, 0, 0, false);
            my.vfx.coin.start();
            obj2.destroy();
            this.sound.play('coin');
        });


        
        this.physics.world.enable(this.spikes, Phaser.Physics.Arcade.STATIC_BODY);
        this.spikeGroup = this.add.group(this.spikes);
        this.physics.add.overlap(my.sprite.player, this.spikeGroup, (obj1, obj2) => {
            obj1.x = this.startX;
            obj1.y = this.startY;
            obj1.setVelocity(0,0);
            this.sound.play('defeat');
        });


        



        this.physics.world.enable(this.flags, Phaser.Physics.Arcade.STATIC_BODY);
        this.flagGroup = this.add.group(this.flags);
        this.physics.add.overlap(my.sprite.player, this.flagGroup, (obj1, obj2) => {
            
            this.startX = obj2.x;
            this.startY = obj2.y-12;
            if(obj2.used == false){
                obj2.used = true;
                my.vfx.flag.x = obj2.x;
                my.vfx.flag.y = obj2.y;
                my.vfx.flag.start();
                this.sound.play('flag');
            }

            
        });




        this.physics.world.enable(this.semi, Phaser.Physics.Arcade.STATIC_BODY);
        this.semiGroup = this.add.group(this.semi);
        for(const obj of this.semiGroup.getChildren()){
            obj.collides = this.physics.add.collider(my.sprite.player, obj);
        }

        this.physics.world.enable(this.goal, Phaser.Physics.Arcade.STATIC_BODY);
        this.goalGroup = this.add.group(this.goal);
        this.physics.add.overlap(my.sprite.player, this.goalGroup, (obj1, obj2) => {
            my.sprite.player.visible = false;
            if(this.finish == false){
                this.finish = true;
                this.sound.play('win');
            }
        });



        
        this.layer2 = this.map.createLayer("Tile Layer 2", this.tileset, 0, 0);
        
        

        



        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');

        /*
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);
        */
        this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
        this.physics.world.debugGraphic.clear();

        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['circle_05.png'],
            scale: {start: 0.01, end: 0.04, random: true},
            lifespan: 100,
            maxAliveParticles: 3,
            gravityY: -200,
            alpha: {start: 1, end: 0.1}, 
        });
        my.vfx.walking.stop();
        
        my.vfx.jump = this.add.particles(0, 0, "kenny-particles", {
            frame: ['muzzle_04.png'],
            scaleY: {start: 0.02, end: 0.1},
            scaleX: 0.1,
            gravityY: -800,
            lifespan: 150,
            stopAfter: 1,
            alpha: {start: 1, end: 0.1}, 
        });
        my.vfx.jump.stop();

        my.vfx.coin = this.add.particles(0, 0, "kenny-particles", {
            anim: ['collect'],
            scale: 0.1,
            lifespan: 200,
            stopAfter: 1,
            alpha: {start: 1, end: 0.1}
        });
        my.vfx.coin.stop();

        my.vfx.splash = this.add.particles(20, 20, "kenny-particles", {
            frame: ['muzzle_01.png'],
            scaleX: {start: 0.03, end: 0.4},
            scaleY: 0.1,
            lifespan: 200,
            stopAfter: 1,
            alpha: {start: 1, end: 0.1}
        });
        my.vfx.splash.stop();

        my.vfx.flag = this.add.particles(0, 0, "kenny-particles", {
            anim: ['flag'],
            scale: {start: 0.1, end: 0.3},
            lifespan: 300,
            stopAfter: 2,
            alpha: {start: 1, end: 0.1}
        });
        my.vfx.flag.stop();



        

        
        

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25);
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);



        
        this.wintext = this.add.text(1950, 30, "You Win!\nPress R to Try Again", {
            fontFamily: "Arial",
            fontSize: "20px",
            color: "#000000"
        });
        this.wintext.visible = false;

        
        

    }

    update() {

        if(this.drown > 0){
            this.drown--;
        }else{
            this.drown = 0;
            my.vfx.splash.stop();
        }

        if(this.finish){
            my.sprite.player.setVelocity(0,0);
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            my.vfx.walking.stop();
            this.wintext.visible = true;
        }else{
        if(cursors.left.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            my.vfx.walking.startFollow(my.sprite.player, 2, my.sprite.player.displayHeight/2-2, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();

            }

        } else if(cursors.right.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            my.vfx.walking.startFollow(my.sprite.player, -2, my.sprite.player.displayHeight/2-2, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();

            }


        } else {
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            my.vfx.walking.stop();
        }

        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
            my.vfx.walking.stop();
        }
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            my.vfx.jump.x = my.sprite.player.x;
            my.vfx.jump.y = my.sprite.player.y+5;
            my.vfx.jump.start();
            
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            my.vfx.walking.stop();

            this.sound.play('jump');

            

        }
        }

        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }

        
        for(const obj of this.semiGroup.getChildren()){
            obj.collides.active = false;
            if(obj.y-my.sprite.player.y > 20){
                obj.collides.active = true;
            }
        }

        if(my.sprite.player.y > 310){
            
            my.vfx.splash.x = my.sprite.player.x;
            my.vfx.splash.y = 310;
            my.vfx.splash.start();

            my.sprite.player.x = this.startX;
            my.sprite.player.y = this.startY;
            my.sprite.player.setVelocity(0,0);

            this.sound.play('defeat');
        }
        

    }
}