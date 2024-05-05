import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import Timer from "../../Wolfie2D/Timing/Timer";
import { Foods, Ingredients, getRandomFood } from "../WorldEnums/Foods";
import { WorldStatus } from "../WorldEnums/WorldStatus";
import GameLevel from "./GameLevel";
import Level1 from "./Level1";
import Level3 from "./Level3";
import Level4 from "./Level4";
import Level5 from "./Level5";
import Level6 from "./Level6";

export default class Level2 extends GameLevel {
    
    loadScene(): void {
        super.loadScene();
        this.load.tilemap("level2", "game_assets/tilemaps/level2.json");
    }

    startScene(): void {
        // Add the level 2 tilemap
        this.add.tilemap("level2", new Vec2(2, 2));
        this.viewport.setBounds(0, 0, 64*32, 32*32);
        this.playerSpawn = new Vec2(30*32, 26*32);

        // Set the total switches and balloons in the level
        this.totalCustomers = 10;
        this.totalCustomersLeft = this.totalCustomers;
        this.totalSpawnsLeft = this.totalCustomers;
        this.customersSatisfiedLeft = Math.floor(this.totalCustomers * 0.6);

        // Do generic setup for a GameLevel
        super.startScene();
        this.nextLevel = Level3;

        // Customer Spawning Initialization
        let spawnCustomer = (pos: Vec2) => {
            return () => this.addCustomer("customer", pos, {indicatorKey: "foodIndicator", foodWanted: getRandomFood(2)});
        };
        this.customerSpawnPoints = [
            { position: new Vec2(12, 27), spaceOccupied: false, spawnTimer: new Timer(5000, spawnCustomer(new Vec2(12, 27))) },
            { position: new Vec2(8, 27), spaceOccupied: false, spawnTimer: new Timer(9000, spawnCustomer(new Vec2(8, 27))) },
            { position: new Vec2(4, 27), spaceOccupied: false, spawnTimer: new Timer(12000, spawnCustomer(new Vec2(4, 27))) },
        ];

        // Storage and Station Initialization - 1st Floor
        this.addStation('oven', new Vec2(28.5,27.5), {indicatorKey: "foodIndicator", foodToCook: Foods.CHICKEN_NUGGETS});
        this.addStation('oven', new Vec2(30,27.5), {indicatorKey: "foodIndicator", foodToCook: Foods.FRIES});
        this.addStorage('fridge', new Vec2(31.3,27), {indicatorKey: "foodIndicator", ingredient: Ingredients.POTATOS});

        this.addStorage('fridge', new Vec2(36,27), {indicatorKey: "foodIndicator", ingredient: Ingredients.RAW_NUGGET});
        
        this.addStation('oven', new Vec2(41,27.5), {indicatorKey: "foodIndicator", foodToCook: Foods.BURGER});
        this.addStorage('fridge', new Vec2(42.2,27), {indicatorKey: "foodIndicator", ingredient: Ingredients.PATTY});
        this.addStorage('fridge', new Vec2(43.3,27), {indicatorKey: "foodIndicator", ingredient: Ingredients.BUNS});
        this.addStorage('fridge', new Vec2(44.4,27), {indicatorKey: "foodIndicator", ingredient: Ingredients.LETTUCES});
        
        


        // this.spawnDelay.start();
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});
    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);

        if (this.cheatTimer.isStopped()) {
            if (Input.isKeyPressed("o")) {
                this.nextLevel = Level1;
                this.emitter.fireEvent(WorldStatus.LEVEL_END, {});
                this.cheatTimer.start();
            }
            if (Input.isKeyPressed("p")) {
                this.emitter.fireEvent(WorldStatus.LEVEL_END, {});
                this.cheatTimer.start();
            }
        }
    }
}