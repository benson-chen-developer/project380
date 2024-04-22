import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Timer from "../../Wolfie2D/Timing/Timer";
import { Foods, Ingredients, getRandomFood } from "../WorldEnums/Foods";
import GameLevel from "./GameLevel";
import Level5 from "./Level5";

export default class Level4 extends GameLevel {
    loadScene(): void {
        // Load resources
        this.load.tilemap("level4", "game_assets/tilemaps/level1.json");
        
        this.load.spritesheet("player", "game_assets/spritesheets/waiter.json");
        this.load.spritesheet("customer", "game_assets/spritesheets/customer.json");
        this.load.spritesheet("oven", "game_assets/spritesheets/oven.json");
        this.load.spritesheet("fridge", "game_assets/spritesheets/fridge.json");
        this.load.spritesheet("foodIndicator", "game_assets/spritesheets/foodIndicator.json");
        this.load.spritesheet("throwable", "game_assets/spritesheets/throwables.json");
        
        this.load.audio("jump", "game_assets/sounds/jump.wav");
        this.load.audio("pop", "game_assets/sounds/pop.wav");
        this.load.audio("level_music", "game_assets/music/level_music.mp3");
    }

    startScene(): void {
        // Add the level 2 tilemap
        this.add.tilemap("level4", new Vec2(2, 2));
        this.viewport.setBounds(0, 0, 64*32, 20*32);

        this.playerSpawn = new Vec2(5*32, 14*32);

        // Set the total switches and balloons in the level
        this.totalCustomers = 6;
        this.totalCustomersLeft = this.totalCustomers;
        this.totalSpawnsLeft = this.totalCustomers;

        // Do generic setup for a GameLevel
        super.startScene();

        this.nextLevel = Level5;

        // Customer Spawning Initialization
        let spawnCustomer = (pos: Vec2) => {
            return () => this.addCustomer("customer", pos, {indicatorKey: "foodIndicator", foodWanted: getRandomFood(4)});
        };
        this.customerSpawnPoints = [
            { position: new Vec2(5, 15), spaceOccupied: false, spawnTimer: new Timer(3000, spawnCustomer(new Vec2(5, 15))) },
            { position: new Vec2(10, 15), spaceOccupied: false, spawnTimer: new Timer(3000, spawnCustomer(new Vec2(10, 15))) },
        ];

        // Station Initialization
        this.addStation('oven', new Vec2(15,15), {indicatorKey: "foodIndicator", foodToCook: Foods.BURGER});
        this.addStation('oven', new Vec2(20,15), {indicatorKey: "foodIndicator", foodToCook: Foods.FRIES});
        
        // Storage Initialization
        this.addStorage('fridge', new Vec2(25,15), {indicatorKey: "foodIndicator", ingredient: Ingredients.PATTY});
        this.addStorage('fridge', new Vec2(27,15), {indicatorKey: "foodIndicator", ingredient: Ingredients.BUNS});
        this.addStorage('fridge', new Vec2(29,15), {indicatorKey: "foodIndicator", ingredient: Ingredients.LETTUCES});
        this.addStorage('fridge', new Vec2(31,15), {indicatorKey: "foodIndicator", ingredient: Ingredients.POTATOS});

        // this.spawnDelay.start();
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});
    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
    }
}