import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Timer from "../../Wolfie2D/Timing/Timer";
import { Foods, Ingredients, getRandomFood } from "../WorldEnums/Foods";
import GameLevel from "./GameLevel";
import Level6 from "./Level6";

export default class Level5 extends GameLevel {
    loadScene(): void {
        super.loadScene();
        this.load.tilemap("level5", "game_assets/tilemaps/level1.json");
    }

    startScene(): void {
        // Add the level 2 tilemap
        this.add.tilemap("level5", new Vec2(2, 2));
        this.viewport.setBounds(0, 0, 64*32, 20*32);

        this.playerSpawn = new Vec2(5*32, 14*32);

        // Set the total switches and balloons in the level
        this.totalCustomers = 7;
        this.totalCustomersLeft = this.totalCustomers;
        this.totalSpawnsLeft = this.totalCustomers;

        // Do generic setup for a GameLevel
        super.startScene();

        this.nextLevel = Level6;

        // Customer Spawning Initialization
        let spawnCustomer = (pos: Vec2) => {
            return () => this.addCustomer("customer", pos, {indicatorKey: "foodIndicator", foodWanted: getRandomFood(5)});
        };
        this.customerSpawnPoints = [
            { position: new Vec2(5, 15), spaceOccupied: false, spawnTimer: new Timer(3000, spawnCustomer(new Vec2(5, 15))) },
            { position: new Vec2(10, 15), spaceOccupied: false, spawnTimer: new Timer(3000, spawnCustomer(new Vec2(10, 15))) },
        ];

        // Station Initialization
        this.addStation('oven', new Vec2(24,15), {indicatorKey: "foodIndicator", foodToCook: Foods.BURGER});
        this.addStation('oven', new Vec2(27,15), {indicatorKey: "foodIndicator", foodToCook: Foods.FRIES});
        
        // Storage Initialization
        this.addStorage('fridge', new Vec2(32,15), {indicatorKey: "foodIndicator", ingredient: Ingredients.PATTY});
        this.addStorage('fridge', new Vec2(36,15), {indicatorKey: "foodIndicator", ingredient: Ingredients.BUNS});
        this.addStorage('fridge', new Vec2(40,15), {indicatorKey: "foodIndicator", ingredient: Ingredients.LETTUCES});
        this.addStorage('fridge', new Vec2(44,15), {indicatorKey: "foodIndicator", ingredient: Ingredients.POTATOS});

        // this.spawnDelay.start();
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});
    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
    }
}