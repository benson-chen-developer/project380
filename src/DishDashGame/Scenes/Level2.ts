import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import { HW5_Color } from "../hw5_color";
import GameLevel from "./GameLevel";

export default class Level2 extends GameLevel {
    // HOMEWORK 5 - TODO
    /**
     * Decide which resource to keep and which to cull.
     * 
     * Not all of these loads are needed. Decide which to remove and handle keeping resources in Level1
     */
    loadScene(): void {
        // Load resources
        this.load.tilemap("level2", "game_assets/tilemaps/level1.json");
        this.load.spritesheet("player", "game_assets/spritesheets/spike.json");
        this.load.spritesheet("green", "game_assets/spritesheets/greenBalloon.json");
        this.load.spritesheet("red", "game_assets/spritesheets/redBalloon.json");
        this.load.spritesheet("blue", "game_assets/spritesheets/blueBalloon.json");
        this.load.audio("jump", "game_assets/sounds/jump.wav");
        this.load.audio("switch", "game_assets/sounds/switch.wav");
        this.load.audio("player_death", "game_assets/sounds/player_death.wav");
        this.load.audio("level_music", "game_assets/music/menu.mp3");
    }

    startScene(): void {
        // Add the level 2 tilemap
        this.add.tilemap("level2", new Vec2(2, 2));
        this.viewport.setBounds(0, 0, 64*32, 20*32);

        this.playerSpawn = new Vec2(4*32, 15*32);
        this.totalSwitches = 7;

        // Do generic setup for a GameLevel
        super.startScene();

        this.addLevelEnd(new Vec2(60, 12), new Vec2(2, 2));

        // Add in our green balloons to the enemies
        // for(let pos of [new Vec2(18, 8), new Vec2(25, 3), new Vec2(52, 5)]){
        //     this.addBalloon("red", pos, {color: HW5_Color.RED});
        // }

        // for(let pos of [new Vec2(3, 4), new Vec2(33, 10)]){
        //     this.addBalloon("green", pos, {color: HW5_Color.GREEN});
        // }

        // for(let pos of [new Vec2(20, 3), new Vec2(41,4)]){
        //     this.addBalloon("blue", pos, {color: HW5_Color.BLUE});
        // }
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});
    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
    }
}