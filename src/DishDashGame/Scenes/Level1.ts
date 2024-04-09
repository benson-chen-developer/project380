import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import { HW5_Color } from "../hw5_color";
import GameLevel from "./GameLevel";
import Level2 from "./Level2";

export default class Level1 extends GameLevel {
    
    // HOMEWORK 5 - TODO
    /**
     * Add your balloon pop sound here and use it throughout the code
     */
    loadScene(): void {
        // Load resources
        this.load.tilemap("level1", "game_assets/tilemaps/level1.json");
        this.load.spritesheet("player", "game_assets/spritesheets/waiter.json");
        this.load.spritesheet("red", "game_assets/spritesheets/redBalloon.json");
        // this.load.spritesheet("blue", "game_assets/spritesheets/blueBalloon.json");
        this.load.spritesheet("customer", "game_assets/spritesheets/customer.json");


        this.load.audio("jump", "game_assets/sounds/jump.wav");
        this.load.audio("switch", "game_assets/sounds/switch.wav");
        this.load.audio("player_death", "game_assets/sounds/player_death.wav");
        this.load.audio("pop", "game_assets/sounds/pop.wav");

        this.load.spritesheet("bun", "game_assets/spritesheets/Bun.json");
        // HOMEWORK 5 - TODO
        // You'll want to change this to your level music
        this.load.audio("level_music", "game_assets/music/level_music.mp3");
    }

    // HOMEWORK 5 - TODO
    /**
     * Decide which resource to keep and which to cull.
     * 
     * Check out the resource manager class.
     * 
     * Figure out how to save resources from being unloaded, and save the ones that are needed
     * for level 2.
     * 
     * This will let us cut down on load time for the game (although there is admittedly
     * not a lot of load time for such a small project).
     */
    unloadScene(){
        // Keep resources - this is up to you
    }

    startScene(): void {
        // Add the level 1 tilemap
        this.add.tilemap("level1", new Vec2(2, 2));
        this.viewport.setBounds(0, 0, 64*32, 20*32);

        this.playerSpawn = new Vec2(5*32, 14*32);

        // Set the total switches and balloons in the level
        this.totalSwitches = 4;
        this.totalBalloons = 6;
        this.totalCustomers = 1;

        // Do generic setup for a GameLevel
        super.startScene();

        this.addLevelEnd(new Vec2(60, 13), new Vec2(5, 5));

        this.nextLevel = Level2;

        // Add balloons of various types, just red and blue for the first level
        // for(let pos of [new Vec2(18, 8), new Vec2(25, 3), new Vec2(52, 5)]){
        //     this.addBalloon("red", pos, {color: HW5_Color.RED});
        // }

        for (let pos of [new Vec2(2, 15)]){
            console.log("customer has been added");
            this.addCustomer("customer", pos, null);
        }

        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});
    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
    }
}