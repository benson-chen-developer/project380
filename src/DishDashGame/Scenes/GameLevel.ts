import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Point from "../../Wolfie2D/Nodes/Graphics/Point";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Timer from "../../Wolfie2D/Timing/Timer";
import Color from "../../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";

import CustomerController from "../Customers/CustomerController";
import { WorldStatus } from "../WorldEnums/WorldStatus";

import HW5_ParticleSystem from "../HW5_ParticleSystem";
import PlayerController from "../Player/PlayerController";
import MainScreen from "../../MainScreenScene/MainScreen";
import ThrowableController from "../Player/Throwable/ThrowableController";
import CookingStationController, { CookingStationStates } from "../CookingStation/CookingStationController";
import { Foods, Ingredients, isFoodsEnum, isIngredientsEnum } from "../WorldEnums/Foods";
import { getRandomFood } from "../WorldEnums/Foods";
import SplashScreen from "../../MainScreenScene/SplashScreen";
import StorageStationController from "../StorageStation/StorageStationController";

export default class GameLevel extends Scene {
    // Every level will have a player, which will be an animated sprite
    protected playerSpawn: Vec2;
    protected player: AnimatedSprite;
    protected respawnTimer: Timer;
    protected timePaused: boolean = false;
    protected timePauseDelay: Timer = new Timer(5000);

    // Stuff to end the level and go to the next level
    protected nextLevel: new (...args: any) => GameLevel;
    protected levelEndTimer: Timer;
    protected levelEndLabel: Label;
    
    protected levelFailTimer: Timer;
    protected levelFailLabel: Label;
    
    // Screen fade in/out for level start and end
    protected levelTransitionScreen: Rect;

    // Customer Fields
    protected totalCustomers: number;
    protected totalCustomersLeft: number;
    protected totalSpawnsLeft: number;
    protected customerSpawnPoints: { position: Vec2; spaceOccupied: boolean; spawnTimer: Timer;}[]
    // protected spawnDelay: Timer = new Timer(2000);

    // Global Labels
    protected customersSatisfied: number;
    protected customersSatisfiedLabel: Label;

    protected customersWants: string;
    protected customersWantsLabel: Label;
   
    protected playersHotbar: string;
    protected playersHotbarLabel: Label;

    protected testLabel: Label;

    loadScene(): void {
        // Load resources   
        this.load.spritesheet("player", "game_assets/spritesheets/waiter.json");
        this.load.spritesheet("customer", "game_assets/spritesheets/customer.json");
        this.load.spritesheet("oven", "game_assets/spritesheets/oven.json");
        this.load.spritesheet("fridge", "game_assets/spritesheets/fridge.json");
        this.load.spritesheet("foodIndicator", "game_assets/spritesheets/foodIndicator.json");
        this.load.spritesheet("throwable", "game_assets/spritesheets/throwables.json");
        
        this.load.audio("jump", "game_assets/sounds/jump.wav");
        this.load.audio("pop", "game_assets/sounds/pop.wav");
        this.load.audio("fridgeOpen", "game_assets/sounds/fridgeOpen.mp3");
        this.load.audio("frying", "game_assets/sounds/fryingSound.mp3");
        this.load.audio("level_music", "game_assets/music/level_music.mp3");
    }

    startScene(): void {
        this.customersSatisfied = 0;
        this.customersWants = "???";
        this.playersHotbar = "Nothing";

        // Do the game level standard initializations
        this.initLayers();
        this.initViewport();
        this.initPlayer();
        this.subscribeToEvents();
        this.addUI();

        // Initialize the timers
        this.respawnTimer = new Timer(10000, () => { this.respawnPlayer(); }); 

        // After the level end timer ends, fade to black and then go to the next scene
        this.levelEndTimer = new Timer(3000, () => { this.levelTransitionScreen.tweens.play("fadeIn"); });
        // After the level end timer ends, fade to black and then goes back to main menu
        this.levelFailTimer = new Timer(3000, () => { this.levelFailLabel.tweens.play("slideIn"); });

        // Start the black screen fade out
        this.levelTransitionScreen.tweens.play("fadeOut");

        // Initially disable player movement
        Input.disableInput();
    }


    updateScene(deltaT: number){
        // Handle events and update the UI if needed
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();
            
            switch(event.type) {
                case WorldStatus.PLAYER_AT_STATION:
                    {
                        let node = this.sceneGraph.getNode(event.data.get("node"));
                        let other = this.sceneGraph.getNode(event.data.get("other"));

                        if (node === this.player){ // Node is player, other is Station
                            this.handlePlayerStationInteraction(<AnimatedSprite>node, <AnimatedSprite>other);
                        } else { // Other is player, node is Station
                            this.handlePlayerStationInteraction(<AnimatedSprite>other,<AnimatedSprite>node);
                        }
                    }
                    break;
                case WorldStatus.PLAYER_AT_STORAGE:
                    {
                        let node = this.sceneGraph.getNode(event.data.get("node"));
                        let other = this.sceneGraph.getNode(event.data.get("other"));

                        if (node === this.player) { // Node is player, other is Storage
                            this.handlePlayerStorageInteraction(<AnimatedSprite>node, <AnimatedSprite>other);
                        } else { // Other is player, node is Storage
                            this.handlePlayerStorageInteraction(<AnimatedSprite>other,<AnimatedSprite>node);
                        }
                    }
                    break;
                case WorldStatus.PLAYER_AT_CUSTOMER:
                    {
                        let node = this.sceneGraph.getNode(event.data.get("node"));
                        let other = this.sceneGraph.getNode(event.data.get("other"));

                        if (node === this.player) { // Node is player, other is Customer
                            this.handlePlayerCustomerInteraction(<AnimatedSprite>node, <AnimatedSprite>other);
                        } else { // Other is player, node is Customer
                            this.handlePlayerCustomerInteraction(<AnimatedSprite>other,<AnimatedSprite>node);
                        }
                    }
                    break;

                case WorldStatus.ITEM_HIT_CUSTOMER:
                    {
                        let node = this.sceneGraph.getNode(event.data.get("node"));
                        let other = this.sceneGraph.getNode(event.data.get("other"));

                        if ((<ThrowableController>node._ai).item){ // Node is dish, other is Customer
                            this.handleThrowableCustomerInteraction(<AnimatedSprite>node, <AnimatedSprite>other);
                        } else { // Other is dish, node is Customer
                            this.handleThrowableCustomerInteraction(<AnimatedSprite>other,<AnimatedSprite>node);
                        }
                    }
                    break;
                case WorldStatus.ITEM_HIT_STATION:
                    {
                        let node = this.sceneGraph.getNode(event.data.get("node"));
                        let other = this.sceneGraph.getNode(event.data.get("other"));

                        if ((<ThrowableController>node._ai).item){ // Node is dish, other is Customer
                            this.handleThrowableStationInteraction(<AnimatedSprite>node, <AnimatedSprite>other);
                        } else { // Other is dish, node is Customer
                            this.handleThrowableStationInteraction(<AnimatedSprite>other,<AnimatedSprite>node);
                        }
                    }
                    break;
                case WorldStatus.CUSTOMER_LEAVING:
                    {
                        let foodIndicator = this.sceneGraph.getNode(event.data.get("sprite"));
                        if (foodIndicator) foodIndicator.destroy();
                    }
                    break;
                case WorldStatus.CUSTOMER_DELETE:
                    {
                        let customer = this.sceneGraph.getNode(event.data.get("owner"));
                        // this.system.startSystem(2000, 1, node.position.clone());
                        for (let i = 0; i < this.customerSpawnPoints.length; i++) {
                            if (this.customerSpawnPoints[i]["position"].x*32 == customer.position.x && 
                            this.customerSpawnPoints[i]["position"].y*32 == customer.position.y) {
                                this.customerSpawnPoints[i]["spaceOccupied"] = false;
                            }
                        }
                        customer.destroy();
                        this.totalCustomersLeft--;
                    }
                    break;
                   
                case WorldStatus.PLAYER_ENTERED_LEVEL_END:
                    {
                        if (this.customersSatisfied / this.totalCustomers > 0.5) {
                            if(!this.levelEndTimer.hasRun() && this.levelEndTimer.isStopped()){
                                // The player has reached the end of the level
                                this.levelEndTimer.start();
                                
                            }
                        } else {
                            this.levelFailTimer.start();
                            this.respawnTimer.start();
                        }
                    }
                    break;
                case WorldStatus.LEVEL_END:
                    {
                        // Go to the next level
                        if (this.nextLevel) {
                            let sceneOptions = {
                                physics: {
                                    groupNames: ["ground", "player", "customer", "throwable", "station"],
                                    collisions:
                                    [
                                        [0, 1, 1, 1, 1],
                                        [1, 0, 0, 1, 0],
                                        [1, 0, 0, 0, 0],
                                        [1, 1, 0, 0, 0],
                                        [1, 0, 0, 0, 0],
                                    ]
                                }
                            }
                            this.sceneManager.changeToScene(this.nextLevel, {}, sceneOptions);
                        }
                    }
                    break;
                case WorldStatus.LEVEL_START:
                    {
                        // Re-enable controls
                        Input.enableInput();
                    }
                    break;
            }
        }

        // Pausing Feature
        if (Input.isPressed("pause") && this.timePauseDelay.isStopped) {
            console.log("PAUSED");
            if (!this.timePaused) {
                this.emitter.fireEvent(WorldStatus.PAUSE_TIME);
                this.timePaused = true;
                this.timePauseDelay.start();

                for (let i = 0; i < this.customerSpawnPoints.length && this.totalSpawnsLeft > 0; i++) {
                    if (!this.customerSpawnPoints[i]["spawnTimer"].isStopped()) {
                        this.customerSpawnPoints[i]["spawnTimer"].pause();
                    }
                }

            } else {
                this.emitter.fireEvent(WorldStatus.RESUME_TIME);
                this.timePaused = false;
                this.timePauseDelay.start();

                for (let i = 0; i < this.customerSpawnPoints.length && this.totalSpawnsLeft > 0; i++) {
                    if (this.customerSpawnPoints[i]["spawnTimer"].isPaused()) {
                        this.customerSpawnPoints[i]["spawnTimer"].start();
                    }
                }
            }
        }
        if (this.timePaused) return;
        
        // UI Updates and Control features
        if ((<PlayerController>this.player._ai).hotbar == null) {
            this.playersHotbar = "Nothing";
        } else {
            this.playersHotbar = (<PlayerController>this.player._ai).hotbar;
            if (Input.isKeyPressed("enter")) {
                let options: Record<string, any> = {
                    "postiveXDirection" : (<PlayerController>this.player._ai).directPostiveX,
                    "itemThrown" : (<PlayerController>this.player._ai).hotbar
                };

                this.addThrowable("throwable", this.player.position.clone(), options);
                (<PlayerController>this.player._ai).hotbar = null;
                this.playersHotbar = "Nothing";
            }
        }
        this.playersHotbarLabel.text = "Waiter's Holding: " + (this.playersHotbar);

        // Customers Spawning Mecahanic
        if (this.totalCustomersLeft > 0) {
            for (let i = 0; i < this.customerSpawnPoints.length && this.totalSpawnsLeft > 0; i++) {
                if (!this.customerSpawnPoints[i]["spaceOccupied"]) {
                    this.customerSpawnPoints[i]["spawnTimer"].start();
                    this.customerSpawnPoints[i]["spaceOccupied"] = true;
                    this.totalSpawnsLeft--;
                }
            }
        } else if (this.totalCustomersLeft == 0) {
            this.emitter.fireEvent(WorldStatus.PLAYER_ENTERED_LEVEL_END);
            this.totalCustomersLeft--; // Puts totalCustomersLeft in the negatives so it doesn't fire this event again
        }
    }

    /**
     * Initialzes the layers
     */
    protected initLayers(): void {
        // Add a layer for UI
        this.addUILayer("UI");
        this.addLayer("secondary", 1);
        this.addLayer("primary", 2);
    }

    /**
     * Initializes the viewport
     */
    protected initViewport(): void {
        this.viewport.setZoomLevel(2);
    }

    /**
     * Handles all subscriptions to events
     */
    protected subscribeToEvents(){
        this.receiver.subscribe([
            WorldStatus.PLAYER_AT_STATION,
            WorldStatus.PLAYER_AT_STORAGE,
            WorldStatus.PLAYER_AT_CUSTOMER,
            WorldStatus.ITEM_HIT_CUSTOMER,
            WorldStatus.ITEM_HIT_STATION,
            WorldStatus.CUSTOMER_SPAWN,
            WorldStatus.CUSTOMER_LEAVING,
            WorldStatus.CUSTOMER_DELETE,
            WorldStatus.LEVEL_START,
            WorldStatus.LEVEL_END,
            WorldStatus.PLAYER_ENTERED_LEVEL_END,
            WorldStatus.PAUSE_TIME,
            WorldStatus.RESUME_TIME,
        ]);
    }

    /**
     * Adds in any necessary UI to the game
     */
    protected addUI(){
        // In-game labels
        this.customersSatisfiedLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(100, 30), text: "Customer Satisfied: " + (this.customersSatisfied)});
        this.customersSatisfiedLabel.textColor = Color.BLACK;
        // this.customersSatisfiedLabel.font = "PixelSimple";

        this.testLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(400, 30), text: "[E] to Interact, [Enter] to Throw"});
        this.testLabel.textColor = Color.BLACK;

        this.customersWantsLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(100, 330), text: "Customer Wants: " + (this.customersWants)});
        this.customersWantsLabel.textColor = Color.WHITE;
        
        this.playersHotbarLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(300, 330), text: "Waiter's Holding: " + (this.playersHotbar)});
        this.playersHotbarLabel.textColor = Color.WHITE;
        
        // End of level label (start off screen)
        this.levelEndLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(-300, 200), text: "Level Passed"});
        this.levelEndLabel.size.set(1200, 60);
        this.levelEndLabel.borderRadius = 0;
        this.levelEndLabel.backgroundColor = new Color(34, 32, 52);
        this.levelEndLabel.textColor = Color.WHITE;
        this.levelEndLabel.fontSize = 48;
        this.levelEndLabel.font = "PixelSimple";

        // Add a tween to move the label on screen
        this.levelEndLabel.tweens.add("slideIn", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.posX,
                    start: -300,
                    end: 300,
                    ease: EaseFunctionType.OUT_SINE
                }
            ]
        });

        this.levelFailLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(-300, 200), text: "Level Failed"});
        this.levelFailLabel.size.set(1200, 60);
        this.levelFailLabel.borderRadius = 0;
        this.levelFailLabel.backgroundColor = new Color(34, 32, 52);
        this.levelFailLabel.textColor = Color.RED;
        this.levelFailLabel.fontSize = 48;
        this.levelFailLabel.font = "PixelSimple";


        this.levelFailLabel.tweens.add("slideIn", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.posX,
                    start: -300,
                    end: 300,
                    ease: EaseFunctionType.OUT_SINE
                }
            ]
        });

        this.levelTransitionScreen = <Rect>this.add.graphic(GraphicType.RECT, "UI", {position: new Vec2(300, 200), size: new Vec2(600, 400)});
        this.levelTransitionScreen.color = new Color(34, 32, 52);
        this.levelTransitionScreen.alpha = 1;

        this.levelTransitionScreen.tweens.add("fadeIn", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 0,
                    end: 1,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
            onEnd: WorldStatus.LEVEL_END
        });

        this.levelTransitionScreen.tweens.add("fadeOut", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 1,
                    end: 0,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
            onEnd: WorldStatus.LEVEL_START
        });
    }

    /**
     * Initializes the player
     */
    protected initPlayer(): void {
        // Add the player
        this.player = this.add.animatedSprite("player", "primary");
        this.player.scale.set(2, 2);
        if (!this.playerSpawn) {
            console.warn("Player spawn was never set - setting spawn to (0, 0)");
            this.playerSpawn = Vec2.ZERO;
        }
        this.player.position.copy(this.playerSpawn);
        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(14, 30)));
        // this.player.colliderOffset.set(0, 2);
        this.player.addAI(PlayerController, {playerType: "platformer", tilemap: "Main"});

        this.player.setGroup("player");

        this.viewport.follow(this.player);
    }

    protected addStation(spriteKey: string, tilePos: Vec2, aiOptions: Record<string, any>): void {
        let station = this.add.animatedSprite(spriteKey, "secondary");
        station.position.set(tilePos.x*32, tilePos.y*32);
        station.scale.set(.2, .2);
        station.addPhysics();

        station.setTrigger("player", WorldStatus.PLAYER_AT_STATION, null);
        station.setTrigger("throwable", WorldStatus.ITEM_HIT_STATION, null);

        let foodWantedSprite = this.addFoodIndicator(aiOptions.indicatorKey, tilePos, aiOptions);
        aiOptions["foodWantedSprite"] = foodWantedSprite;

        station.addAI(CookingStationController, aiOptions);
        station.setGroup("station");
    }

    protected addStorage(spriteKey: string, tilePos: Vec2, aiOptions: Record<string, any>): void {
        let station = this.add.animatedSprite(spriteKey, "secondary");
        station.position.set(tilePos.x*32, tilePos.y*32);
        station.scale.set(2, 2);
        station.addPhysics();

        station.setTrigger("player", WorldStatus.PLAYER_AT_STORAGE, null);
        
        let ingredientIndicatorSprite = this.addFoodIndicator(aiOptions.indicatorKey, tilePos, aiOptions);
        aiOptions["ingredientIndicatorSprite"] = ingredientIndicatorSprite;

        station.addAI(StorageStationController, aiOptions);
        station.setGroup("storage");
    }

    protected addCustomer(spriteKey: string, tilePos: Vec2, aiOptions: Record<string, any>): void {
        let customer = this.add.animatedSprite(spriteKey, "secondary");
        customer.position.set(tilePos.x*32, tilePos.y*32);
        customer.scale.set(2, 2);
        
        customer.addPhysics();
        customer.setTrigger("player", WorldStatus.PLAYER_AT_CUSTOMER, null);
        customer.setTrigger("throwable", WorldStatus.ITEM_HIT_CUSTOMER, null);
        
        let foodWantedSprite = this.addFoodIndicator(aiOptions.indicatorKey, tilePos, aiOptions);
        aiOptions["foodWantedSprite"] = foodWantedSprite;
        
        customer.addAI(CustomerController, aiOptions);
        customer.setGroup("customer");
    }

    protected addFoodIndicator(spriteKey: string, tilePos: Vec2, aiOptions: Record<string, any>): AnimatedSprite {
        let foodIndicator = this.add.animatedSprite(spriteKey, "secondary");
        foodIndicator.position.set(tilePos.x*32, (tilePos.y-1.5)*32);
        foodIndicator.scale.set(2, 2);
        foodIndicator.setGroup("foodIndicator");
        return foodIndicator;
    }

    protected addThrowable(spriteKey: string, tilePos: Vec2, aiOptions: Record<string, any>): void {
        let dish = this.add.animatedSprite(spriteKey, "primary");
        dish.position.set(tilePos.x, tilePos.y);
        dish.scale.set(2.3, 2.3);
        dish.addPhysics();
        dish.addAI(ThrowableController, aiOptions);
        dish.setGroup("throwable");
    }

    protected handlePlayerCustomerInteraction(player: AnimatedSprite, customer: AnimatedSprite) {
        if (customer != null && player.collisionShape.overlaps(customer.collisionShape)) {
            this.customersWants = (<CustomerController>customer._ai).foodWanted;

            if (Input.isPressed("interact") && (<PlayerController>player._ai).hotbar === (<CustomerController>customer._ai).foodWanted 
            && (<CustomerController>customer._ai).foodWanted != null) {
                (<PlayerController>player._ai).hotbar = null;
                
                this.customersSatisfied++;
                this.customersSatisfiedLabel.text = "Customers Satisfied: " + (this.customersSatisfied);

                (<CustomerController>customer._ai).changeState("happy");
                // this.emitter.fireEvent(WorldStatus.PLAYER_SERVE, {owner: customer.id});
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "pop", loop: false, holdReference: false});
            }
        } else {
            this.customersWants = "???";
        }
        this.customersWantsLabel.text = "Customer Wants: " + (this.customersWants);
    }

    protected handlePlayerStationInteraction(player: AnimatedSprite, station: AnimatedSprite){
        if (station !== null && player.collisionShape.overlaps(station.collisionShape)) {
            let stationAI = (<CookingStationController>station._ai);
            if (Input.isPressed("interact") && stationAI.cookingState !== CookingStationStates.COOKING) {
                if ((<PlayerController>player._ai).hotbar && stationAI.cookingState == CookingStationStates.NOTCOOKING) {
                    const index = stationAI.IngredientsNeeded.findIndex(item => item === (<PlayerController>player._ai).hotbar);
                    if (index != -1) {          
                        stationAI.IngredientsNeeded.splice(index, 1);
                        (<PlayerController>player._ai).hotbar = null;
                    }
                } else {
                    if (stationAI.cookingState == CookingStationStates.COOKED) {
                        (<PlayerController>player._ai).hotbar =stationAI.foodInOven;
                        stationAI.foodInOven = null;
                    }
                }
            }
        }
    }

    protected handlePlayerStorageInteraction(player: AnimatedSprite, storage: AnimatedSprite){
        if (storage !== null && player.collisionShape.overlaps(storage.collisionShape) 
        && Input.isPressed("interact") && (<PlayerController>player._ai).hotbar == null) {
            (<PlayerController>player._ai).hotbar = (<StorageStationController>storage._ai).ingredients;
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "fridgeOpen", loop: false, holdReference: false});
        }
    }

    protected handleThrowableCustomerInteraction(dish: AnimatedSprite, customer: AnimatedSprite) {
        if (customer != null && dish.collisionShape.overlaps(customer.collisionShape)) {
            if ((<ThrowableController>dish._ai).item === (<CustomerController>customer._ai).foodWanted 
            && (<CustomerController>customer._ai).foodWanted != null) {
                
                this.customersSatisfied++;
                this.customersSatisfiedLabel.text = "Customers Satisfied: " + (this.customersSatisfied);

                (<CustomerController>customer._ai).changeState("happy");
                // this.emitter.fireEvent(WorldStatus.PLAYER_SERVE, {owner: customer.id});
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "pop", loop: false, holdReference: false});
            } else {
                (<CustomerController>customer._ai).changeState("angry");
            }
            dish.destroy();
        }
    }

    protected handleThrowableStationInteraction(dish: AnimatedSprite, station: AnimatedSprite) {
        if (isIngredientsEnum((<ThrowableController>dish._ai).item) && station != null 
        && dish.collisionShape.overlaps(station.collisionShape)) {
            let stationAI = (<CookingStationController>station._ai);
            const index = stationAI.IngredientsNeeded.findIndex(item => item === (<ThrowableController>dish._ai).item);
            if (index != -1) { stationAI.IngredientsNeeded.splice(index, 1); }
            // this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "pop", loop: false, holdReference: false});
            dish.destroy();
        }
    }

    /**
     * Returns the player to spawn
     */
    protected respawnPlayer(): void {
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
        this.sceneManager.changeToScene(MainScreen, {});
        Input.enableInput();
        // this.system.stopSystem();
    }
}