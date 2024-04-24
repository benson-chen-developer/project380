import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Timer from "../../Wolfie2D/Timing/Timer";
import { Foods, Ingredients, getRandomFood } from "../WorldEnums/Foods";
import GameLevel from "./GameLevel";
import Level4 from "./Level4";

export default class Level3 extends GameLevel {
    loadScene(): void {
        super.loadScene();
        this.load.tilemap("level3", "game_assets/tilemaps/level3.json");
    }

    startScene(): void {
        // Add the level 2 tilemap
        this.add.tilemap("level3", new Vec2(2, 2));
        this.viewport.setBounds(0, 0, 64*32, 32*32);
        this.playerSpawn = new Vec2(30*32, 26*32);

        // Set the total switches and balloons in the level
        this.totalCustomers = 8;
        this.totalCustomersLeft = this.totalCustomers;
        this.totalSpawnsLeft = this.totalCustomers;

        // Do generic setup for a GameLevel
        super.startScene();
        this.nextLevel = Level4;

        // Customer Spawning Initialization
        let spawnCustomer = (pos: Vec2) => {
            return () => this.addCustomer("customer", pos, {indicatorKey: "foodIndicator", foodWanted: getRandomFood(6)});
        };
        this.customerSpawnPoints = [
            { position: new Vec2(5, 27), spaceOccupied: false, spawnTimer: new Timer(3000, spawnCustomer(new Vec2(5, 27))) },
            { position: new Vec2(10, 27), spaceOccupied: false, spawnTimer: new Timer(3000, spawnCustomer(new Vec2(10, 27))) },
        ];

        // Station Initialization
        this.addStation('oven', new Vec2(41,27.5), {indicatorKey: "foodIndicator", foodToCook: Foods.BURGER});
        this.addStorage('fridge', new Vec2(42.2,27), {indicatorKey: "foodIndicator", ingredient: Ingredients.PATTY});
        this.addStorage('fridge', new Vec2(43.3,27), {indicatorKey: "foodIndicator", ingredient: Ingredients.BUNS});
        this.addStorage('fridge', new Vec2(44.4,27), {indicatorKey: "foodIndicator", ingredient: Ingredients.LETTUCES});
        
        // Storage Initialization
        this.addStation('oven', new Vec2(30,27.5), {indicatorKey: "foodIndicator", foodToCook: Foods.FRIES});
        this.addStorage('fridge', new Vec2(31.3,27), {indicatorKey: "foodIndicator", ingredient: Ingredients.POTATOS});

        // this.spawnDelay.start();
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});
    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
    }
}