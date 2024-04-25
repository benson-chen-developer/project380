import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import Timer from "../../Wolfie2D/Timing/Timer";
import { Foods, Ingredients, getRandomFood } from "../WorldEnums/Foods";
import { WorldStatus } from "../WorldEnums/WorldStatus";
import GameLevel from "./GameLevel";
import Level1 from "./Level1";
import Level2 from "./Level2";
import Level3 from "./Level3";
import Level4 from "./Level4";
import Level5 from "./Level5";

export default class Level6 extends GameLevel {
    loadScene(): void {
        super.loadScene();
        this.load.tilemap("level6", "game_assets/tilemaps/level6.json");
    }

    startScene(): void {
        // Add the level 2 tilemap
        this.add.tilemap("level6", new Vec2(2, 2));
        this.viewport.setBounds(0, 0, 64*32, 32*32);
        this.playerSpawn = new Vec2(30*32, 26*32);

        // Set the total switches and balloons in the level
        this.totalCustomers = 30;
        this.totalCustomersLeft = this.totalCustomers;
        this.totalSpawnsLeft = this.totalCustomers;

        // Do generic setup for a GameLevel
        super.startScene();

        // this.nextLevel = Level7;

        // Customer Spawning Initialization
        let spawnCustomer = (pos: Vec2) => {
            return () => this.addCustomer("customer", pos, {indicatorKey: "foodIndicator", foodWanted: getRandomFood(6)});
        };
        this.customerSpawnPoints = [
            { position: new Vec2(12, 27), spaceOccupied: false, spawnTimer: new Timer(5000, spawnCustomer(new Vec2(12, 27))) },
            { position: new Vec2(8, 27), spaceOccupied: false, spawnTimer: new Timer(9000, spawnCustomer(new Vec2(8, 27))) },
            { position: new Vec2(4, 27), spaceOccupied: false, spawnTimer: new Timer(12000, spawnCustomer(new Vec2(4, 27))) },
            
            { position: new Vec2(11, 21), spaceOccupied: false, spawnTimer: new Timer(6000, spawnCustomer(new Vec2(11, 21))) },
            { position: new Vec2(6, 21), spaceOccupied: false, spawnTimer: new Timer(11000, spawnCustomer(new Vec2(6, 21))) },

            { position: new Vec2(6, 15), spaceOccupied: false, spawnTimer: new Timer(7000, spawnCustomer(new Vec2(6, 15))) },

            { position: new Vec2(17, 9), spaceOccupied: false, spawnTimer: new Timer(8000, spawnCustomer(new Vec2(17, 9))) },
            { position: new Vec2(12, 9), spaceOccupied: false, spawnTimer: new Timer(15000, spawnCustomer(new Vec2(12, 9))) },
        ];

        // Station and Storage Initialization - 1st Floor
        this.addStation('oven', new Vec2(28.5,27.5), {indicatorKey: "foodIndicator", foodToCook: Foods.CHICKEN_NUGGETS});
        this.addStation('oven', new Vec2(30,27.5), {indicatorKey: "foodIndicator", foodToCook: Foods.FRIES});
        this.addStorage('fridge', new Vec2(31.3,27), {indicatorKey: "foodIndicator", ingredient: Ingredients.POTATOS});

        this.addStation('oven', new Vec2(41,27.5), {indicatorKey: "foodIndicator", foodToCook: Foods.BURGER});
        this.addStorage('fridge', new Vec2(42.2,27), {indicatorKey: "foodIndicator", ingredient: Ingredients.PATTY});
        this.addStorage('fridge', new Vec2(43.3,27), {indicatorKey: "foodIndicator", ingredient: Ingredients.BUNS});
        this.addStorage('fridge', new Vec2(44.4,27), {indicatorKey: "foodIndicator", ingredient: Ingredients.LETTUCES});
        
        // Station and Storage Initialization - 2nd Floor
        this.addStation('oven', new Vec2(28.5,21.5), {indicatorKey: "foodIndicator", foodToCook: Foods.SCRAMBLE_EGGS});
        this.addStation('oven', new Vec2(30,21.5), {indicatorKey: "foodIndicator", foodToCook: Foods.FRIES});
        this.addStorage('fridge', new Vec2(31.3,21), {indicatorKey: "foodIndicator", ingredient: Ingredients.EGGS});

        this.addStation('oven', new Vec2(41,21.5), {indicatorKey: "foodIndicator", foodToCook: Foods.CHICKEN_NUGGETS});
        this.addStorage('fridge', new Vec2(44,21), {indicatorKey: "foodIndicator", ingredient: Ingredients.RAW_NUGGET});

        // Station and Storage Initialization - 3rd Floor
        this.addStation('oven', new Vec2(23,15.5), {indicatorKey: "foodIndicator", foodToCook: Foods.APPLE_PIE});
        this.addStation('oven', new Vec2(24.5,15.5), {indicatorKey: "foodIndicator", foodToCook: Foods.APPLE_PIE});
        this.addStorage('fridge', new Vec2(26,15), {indicatorKey: "foodIndicator", ingredient: Ingredients.APPLE});
        this.addStorage('fridge', new Vec2(27.3,15), {indicatorKey: "foodIndicator", ingredient: Ingredients.FLOUR_MIX});

        this.addStorage('fridge', new Vec2(38,15), {indicatorKey: "foodIndicator", ingredient: Ingredients.EGGS});
        this.addStation('oven', new Vec2(41,15.5), {indicatorKey: "foodIndicator", foodToCook: Foods.SCRAMBLE_EGGS});
        this.addStation('oven', new Vec2(42.5,15.5), {indicatorKey: "foodIndicator", foodToCook: Foods.SCRAMBLE_EGGS});

        // Station and Storage Initialization - 4th Floor
        this.addStation('oven', new Vec2(31.5,9.5), {indicatorKey: "foodIndicator", foodToCook: Foods.PANCAKES});
        this.addStation('oven', new Vec2(32.8,9.5), {indicatorKey: "foodIndicator", foodToCook: Foods.FISH_AND_CHIPS});
        this.addStorage('fridge', new Vec2(34.3,9), {indicatorKey: "foodIndicator", ingredient: Ingredients.SYRUP});
        this.addStorage('fridge', new Vec2(35.6,9), {indicatorKey: "foodIndicator", ingredient: Ingredients.FISH});
        this.addStorage('fridge', new Vec2(36.9,9), {indicatorKey: "foodIndicator", ingredient: Ingredients.POTATOS});
        this.addStorage('fridge', new Vec2(38.2,9), {indicatorKey: "foodIndicator", ingredient: Ingredients.LETTUCES});


        // this.spawnDelay.start();
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});
    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);

        if (this.cheatTimer.isStopped()) {
            if (Input.isKeyPressed("1")) {
                this.nextLevel = Level1;
                this.emitter.fireEvent(WorldStatus.LEVEL_END, {});
                this.cheatTimer.start();
            }
            if (Input.isKeyPressed("2")) {
                this.nextLevel = Level2;
                this.emitter.fireEvent(WorldStatus.LEVEL_END, {});
                this.cheatTimer.start();
            }
            if (Input.isKeyPressed("3")) {
                this.nextLevel = Level3;
                this.emitter.fireEvent(WorldStatus.LEVEL_END, {});
                this.cheatTimer.start();
            }
            if (Input.isKeyPressed("4")) {
                this.nextLevel = Level4;
                this.emitter.fireEvent(WorldStatus.LEVEL_END, {});
                this.cheatTimer.start();
            }
            if (Input.isKeyPressed("5")) {
                this.nextLevel = Level5;
                this.emitter.fireEvent(WorldStatus.LEVEL_END, {});
                this.cheatTimer.start();
            }
            if (Input.isKeyPressed("6")) {
                this.nextLevel = Level6;
                this.emitter.fireEvent(WorldStatus.LEVEL_END, {});
                this.cheatTimer.start();
            }
        }
    }
}