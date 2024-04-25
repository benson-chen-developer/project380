import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Timer from "../../Wolfie2D/Timing/Timer";
import { Foods, Ingredients, getRandomFood } from "../WorldEnums/Foods";
import GameLevel from "./GameLevel";
import Level2 from "./Level2";

export default class Level1 extends GameLevel {
    
    loadScene(): void {
        super.loadScene();
        this.load.tilemap("level1", "game_assets/tilemaps/level1.json");
    }

    unloadScene() {
        // Keep resources - this is up to you
    }

    startScene(): void {
        // Add the level 1 tilemap
        this.add.tilemap("level1", new Vec2(2, 2));
        this.viewport.setBounds(0, 0, 64*32, 32*32);
        this.playerSpawn = new Vec2(30*32, 26*32);

        // Set the total number customers in the level
        this.totalCustomers = 5;
        this.totalCustomersLeft = this.totalCustomers;
        this.totalSpawnsLeft = this.totalCustomers;

        // Do generic setup for a GameLevel
        super.startScene();

        this.nextLevel = Level2;

        // Customer Spawning Initialization
        let spawnCustomer = (pos: Vec2) => {
            return () => {
                this.addCustomer("customer", pos, {indicatorKey: "foodIndicator", foodWanted: getRandomFood(1)});
                // this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "entering", loop: false, holdReference: false});
            }
        };
        this.customerSpawnPoints = [
            { position: new Vec2(12, 27), spaceOccupied: false, spawnTimer: new Timer(5000, spawnCustomer(new Vec2(12, 27))) },
            { position: new Vec2(8, 27), spaceOccupied: false, spawnTimer: new Timer(9000, spawnCustomer(new Vec2(8, 27))) },
            { position: new Vec2(4, 27), spaceOccupied: false, spawnTimer: new Timer(12000, spawnCustomer(new Vec2(4, 27))) },
        ];

        // Storage and Station Initialization - 1st Floor
        this.addStation('oven', new Vec2(30,27.5), {indicatorKey: "foodIndicator", foodToCook: Foods.FRIES});
        this.addStorage('fridge', new Vec2(31.3,27), {indicatorKey: "foodIndicator", ingredient: Ingredients.POTATOS});

        this.addStation('oven', new Vec2(41,27.5), {indicatorKey: "foodIndicator", foodToCook: Foods.BURGER});
        this.addStorage('fridge', new Vec2(42.2,27), {indicatorKey: "foodIndicator", ingredient: Ingredients.PATTY});
        this.addStorage('fridge', new Vec2(43.3,27), {indicatorKey: "foodIndicator", ingredient: Ingredients.BUNS});
        this.addStorage('fridge', new Vec2(44.4,27), {indicatorKey: "foodIndicator", ingredient: Ingredients.LETTUCES});
        
        // Storage Initialization
        
        // this.spawnDelay.start();
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});
    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
    }
}