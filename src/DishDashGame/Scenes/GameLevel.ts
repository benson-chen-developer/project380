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
import Label, { HAlign } from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Timer from "../../Wolfie2D/Timing/Timer";
import Color from "../../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";

import CustomerController from "../Customers/CustomerController";
import { WorldStatus } from "../WorldEnums/WorldStatus";

import PlayerController from "../Player/PlayerController";
import MainScreen from "../../MainScreenScene/MainScreen";
import ThrowableController from "../Player/Throwable/ThrowableController";
import CookingStationController, { CookingStationStates } from "../CookingStation/CookingStationController";
import { Foods, Ingredients, isFoodsEnum, isIngredientsEnum } from "../WorldEnums/Foods";
import { getRandomFood } from "../WorldEnums/Foods";
import SplashScreen from "../../MainScreenScene/SplashScreen";
import StorageStationController from "../StorageStation/StorageStationController";
import CustomerAngryController from "../CustomerAngry/CustomerAngryController";

export default class GameLevel extends Scene {
    // Every level will have a player, which will be an animated sprite
    protected playerSpawn: Vec2;
    protected player: AnimatedSprite;
    protected respawnTimer: Timer;
    protected cheatTimer: Timer = new Timer(5000);

    protected gracePeriod: Timer = new Timer(5000);
    protected timePaused: boolean = false;
    protected timePauseDelay: Timer = new Timer(5000);
    protected fridgeGrabDelay: Timer = new Timer(300);

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
    

    // Global Labels
    protected customersSatisfied: number;
    protected customersSatisfiedLeft: number;
    protected customersSatisfiedLabel: Label;

    protected customersWants: string = "";
    protected playersHotbar: string;
    protected stationNeeds: string = "";

    protected interactiveLabel: Label;
    protected playersHotbarLabel: Label;
    protected mouseControlALabels: Label;
    protected mouseControlBLabels: Label;

    protected inventoryIsMove: boolean;

    loadScene(): void {
        // Load resources   
        this.load.spritesheet("player", "game_assets/spritesheets/waiter.json");
        this.load.spritesheet("customer", "game_assets/spritesheets/customer.json");
        this.load.spritesheet("oven", "game_assets/spritesheets/oven.json");
        this.load.spritesheet("fridge", "game_assets/spritesheets/fridge.json");
        this.load.spritesheet("angryCustomer", "game_assets/spritesheets/angryCustomer.json");
        this.load.spritesheet("foodIndicator", "game_assets/spritesheets/foodIndicator.json");
        this.load.spritesheet("throwable", "game_assets/spritesheets/throwables.json");
        
        this.load.audio("jump", "game_assets/sounds/jump.wav");
        this.load.audio("pop", "game_assets/sounds/pop.wav");
        this.load.audio("fridgeOpen", "game_assets/sounds/fridgeOpen.mp3");
        this.load.audio("frying", "game_assets/sounds/fryingSound.mp3");

        this.load.audio("angry", "game_assets/sounds/customerAngry.mp3");
        this.load.audio("entering", "game_assets/sounds/customerBell.mp3");
        this.load.audio("happy", "game_assets/sounds/customerHappy.mp3");
        this.load.audio("ding", "game_assets/sounds/doneCookingDing.mp3");

        this.load.audio("level_music", "game_assets/music/level_music.mp3");
    }

    startScene(): void {
        this.customersSatisfied = 0;
        this.playersHotbar = "Nothing";
        this.inventoryIsMove = true;

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

        this.gracePeriod.start();
        
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
                        if (this.customersSatisfied >= this.customersSatisfiedLeft) {
                            if (!this.levelEndTimer.hasRun() && this.levelEndTimer.isStopped()){
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
                        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
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
        // if (Input.isPressed("pause") && this.timePauseDelay.isStopped) {
        //     console.log("PAUSED");
        //     if (!this.timePaused) {
        //         this.emitter.fireEvent(WorldStatus.PAUSE_TIME);
        //         this.timePaused = true;
        //         this.timePauseDelay.start();

        //         for (let i = 0; i < this.customerSpawnPoints.length && this.totalSpawnsLeft > 0; i++) {
        //             if (!this.customerSpawnPoints[i]["spawnTimer"].isStopped()) {
        //                 this.customerSpawnPoints[i]["spawnTimer"].pause();
        //             }
        //         }

        //     } else {
        //         this.emitter.fireEvent(WorldStatus.RESUME_TIME);
        //         this.timePaused = false;
        //         this.timePauseDelay.start();

        //         for (let i = 0; i < this.customerSpawnPoints.length && this.totalSpawnsLeft > 0; i++) {
        //             if (this.customerSpawnPoints[i]["spawnTimer"].isPaused()) {
        //                 this.customerSpawnPoints[i]["spawnTimer"].start();
        //             }
        //         }
        //     }
        // }
        // if (this.timePaused) return;
        
        // UI Updates and Control features
        this.playersHotbar = (<PlayerController>this.player._ai).hotbar;
        let newPlayerHotbar = "Player is Holding ";
        if (Input.isMousePressed(2)) {
            let options: Record<string, any> = {
                "postiveXDirection" : (<PlayerController>this.player._ai).directPostiveX,
                "itemThrown" : (<PlayerController>this.player._ai).hotbar[(<PlayerController>this.player._ai).hotbarIndex]
            };

            if((<PlayerController>this.player._ai).hotbar[(<PlayerController>this.player._ai).hotbarIndex] !== "Empty"){
                this.addThrowable("throwable", this.player.position.clone(), options);
                (<PlayerController>this.player._ai).hotbar[(<PlayerController>this.player._ai).hotbarIndex] = "Empty";
            }
            
            (<PlayerController>this.player._ai).hotbar.forEach((item: any, index: number) => {
                if(index === (<PlayerController>this.player._ai).hotbarIndex)
                    newPlayerHotbar += ` [ ${index === 0 ? "1" : ""}${index === 1 ? "2" : ""}${index === 2 ? "3" : ""}: ${item} ] `;
                else 
                    newPlayerHotbar += ` ${index === 0 ? "1" : ""}${index === 1 ? "2" : ""}${index === 2 ? "3":""}: ${item} `;
            })
            this.playersHotbarLabel.text = newPlayerHotbar;
        } else {
            (<PlayerController>this.player._ai).hotbar.forEach((item: any, index: number) => {
                if(index === (<PlayerController>this.player._ai).hotbarIndex)
                    newPlayerHotbar += ` [ ${index === 0 ? "1" : ""}${index === 1 ? "2" : ""}${index === 2 ? "3":""}: ${item} ] `;
                else 
                    newPlayerHotbar += ` ${index === 0 ? "1" : ""}${index === 1 ? "2" : ""}${index === 2 ? "3":""}: ${item} `;
            })
            this.playersHotbarLabel.text = newPlayerHotbar;
        }

        if(Input.isKeyPressed("1")) (<PlayerController>this.player._ai).hotbarIndex = 0;
        if(Input.isKeyPressed("2")) (<PlayerController>this.player._ai).hotbarIndex = 1;
        if(Input.isKeyPressed("3")) (<PlayerController>this.player._ai).hotbarIndex = 2;

        (<PlayerController>this.player._ai).hotbarIndex = ((<PlayerController>this.player._ai).hotbarIndex - Input.getScrollDirection()) % 3;
        if ((<PlayerController>this.player._ai).hotbarIndex < 0) {
            (<PlayerController>this.player._ai).hotbarIndex = 2
        }

        // Customers Spawning Mecahanic
        if (this.totalCustomersLeft > 0 && this.gracePeriod.isStopped()) {
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
        this.customersSatisfiedLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(100, 30), text: "Customer Satisfied: " + (this.customersSatisfied) + "/" + this.customersSatisfiedLeft});
        this.customersSatisfiedLabel.textColor = new Color(148, 7, 0);
        this.customersSatisfiedLabel.size.set(350, 50);
        this.customersSatisfiedLabel.borderRadius = 0;
        this.customersSatisfiedLabel.backgroundColor = new Color(50, 50, 50, 0.7);
        this.customersSatisfiedLabel.setHAlign(HAlign.CENTER);

        this.mouseControlALabels = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(520, 30), text: "Interact : [LMB]"});
        this.mouseControlALabels.textColor = new Color(148, 7, 0);
        this.mouseControlALabels.size.set(250, 50);
        this.mouseControlALabels.borderRadius = 0;
        this.mouseControlALabels.backgroundColor = new Color(50, 50, 50, 0.8);
        this.mouseControlALabels.setHAlign(HAlign.CENTER);

        this.mouseControlBLabels = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(520, 55), text: "Enter : [RMB]"});
        this.mouseControlBLabels.textColor = new Color(148, 7, 0);
        this.mouseControlBLabels.size.set(250, 50);
        this.mouseControlBLabels.borderRadius = 0;
        this.mouseControlBLabels.backgroundColor = new Color(50, 50, 50, 0.8);

        this.interactiveLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(22, 350), text: ""});
        this.interactiveLabel.textColor = new Color (255, 0, 149);
        this.interactiveLabel.setHAlign(HAlign.LEFT);
        // this.interactiveLabel.font = "PixelNew";

        this.playersHotbarLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(190, 370), text: ""});
        this.playersHotbarLabel.textColor = new Color(1, 255, 0);
        this.playersHotbarLabel.setHAlign(HAlign.LEFT);
        // this.playersHotbarLabel.font = "PixelNew";
        

        // End of level label (start off screen)
        this.levelEndLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(-300, 200), text: "Level Passed"});
        this.levelEndLabel.size.set(1200, 80);
        this.levelEndLabel.borderRadius = 0;
        this.levelEndLabel.backgroundColor = new Color(34, 32, 52);
        this.levelEndLabel.textColor = Color.WHITE;
        this.levelEndLabel.fontSize = 48;
        // this.levelEndLabel.font = "PixelNew";

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
        this.levelFailLabel.size.set(1200, 80);
        this.levelFailLabel.borderRadius = 0;
        this.levelFailLabel.backgroundColor = new Color(34, 32, 52);
        this.levelFailLabel.textColor = Color.RED;
        this.levelFailLabel.fontSize = 48;
        // this.levelFailLabel.font = "PixelNew";


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

    protected addAngryCustomer(spriteKey: string, tilePos: Vec2, aiOptions: Record<string, any>): void {
        let angryCustomer = this.add.animatedSprite(spriteKey, "secondary");
        angryCustomer.position.set(tilePos.x*32, tilePos.y*32);
        angryCustomer.scale.set(.5, .5);
        angryCustomer.addPhysics();

        // angryCustomer.setTrigger("player", WorldStatus.PLAYER_AT_STATION, null);
        angryCustomer.addAI(CustomerAngryController, aiOptions);
    }

    protected addStation(spriteKey: string, tilePos: Vec2, aiOptions: Record<string, any>): void {
        let station = this.add.animatedSprite(spriteKey, "secondary");
        station.position.set(tilePos.x*32, tilePos.y*32);
        station.scale.set(2, 2);
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
            this.interactiveLabel.text = "Wants:" + (this.customersWants);

            if (Input.isMousePressed(0) && (<PlayerController>player._ai).hotbar[(<PlayerController>player._ai).hotbarIndex] === (<CustomerController>customer._ai).foodWanted 
            && (<CustomerController>customer._ai).foodWanted != null) {
                (<PlayerController>player._ai).hotbar[(<PlayerController>player._ai).hotbarIndex] = "Empty";
                
                this.customersSatisfied++;
                this.customersSatisfiedLabel.text = "Customers Satisfied: " + (this.customersSatisfied) + "/" + this.customersSatisfiedLeft;

                (<CustomerController>customer._ai).changeState("happy");
                // this.emitter.fireEvent(WorldStatus.PLAYER_SERVE, {owner: customer.id});
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "pop", loop: false, holdReference: false});
            }
        } else {
            this.interactiveLabel.text = "";
        }
        
    }

    protected handlePlayerStationInteraction(player: AnimatedSprite, station: AnimatedSprite){
        if (station !== null && player.collisionShape.overlaps(station.collisionShape)) {
            let stationAI = (<CookingStationController>station._ai);
            this.stationNeeds = String(stationAI.IngredientsNeeded);
            this.interactiveLabel.text = "Needs:" + this.stationNeeds;
            if (Input.isMousePressed(0) && stationAI.cookingState !== CookingStationStates.COOKING) {
                if ((<PlayerController>player._ai).hotbar[(<PlayerController>player._ai).hotbarIndex] !== "Empty" && stationAI.cookingState == CookingStationStates.NOTCOOKING) {
                    const index = stationAI.IngredientsNeeded.findIndex(item => item === (<PlayerController>player._ai).hotbar[(<PlayerController>player._ai).hotbarIndex]);
                    if (index != -1) {          
                        stationAI.IngredientsNeeded.splice(index, 1);
                        (<PlayerController>player._ai).hotbar[(<PlayerController>player._ai).hotbarIndex] = "Empty";
                    }
                } else {
                    if (stationAI.cookingState == CookingStationStates.COOKED && (<PlayerController>player._ai).hotbar[(<PlayerController>player._ai).hotbarIndex] === "Empty") {
                        (<PlayerController>player._ai).hotbar[(<PlayerController>player._ai).hotbarIndex] =stationAI.foodInOven;
                        stationAI.foodInOven = null;
                    }
                }
            } 
        } else {
            this.interactiveLabel.text = "";
        }
    }

    protected addToInventory(StorageArr: any [], newItem: any, hotbarIndex: number): any[]{
        let ret = [...StorageArr];
        ret[hotbarIndex] = newItem;
        return ret;
    }

    protected handlePlayerStorageInteraction(player: AnimatedSprite, storage: AnimatedSprite){
        if (storage !== null && player.collisionShape.overlaps(storage.collisionShape)) {
            this.interactiveLabel.text = "Has:" + (<StorageStationController>storage._ai).ingredients;
            if (Input.isMousePressed(0) && this.fridgeGrabDelay.isStopped() && (<PlayerController>player._ai).hotbar[(<PlayerController>player._ai).hotbarIndex] == "Empty") {
                (<PlayerController>player._ai).hotbar = this.addToInventory((<PlayerController>player._ai).hotbar, (<StorageStationController>storage._ai).ingredients, (<PlayerController>player._ai).hotbarIndex)
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "fridgeOpen", loop: false, holdReference: false});
                this.fridgeGrabDelay.start();
            }
        } else {
            this.interactiveLabel.text = "";
        }
    }

    protected handleThrowableCustomerInteraction(dish: AnimatedSprite, customer: AnimatedSprite) {
        if (customer != null && dish.collisionShape.overlaps(customer.collisionShape)) {
            if ((<ThrowableController>dish._ai).item === (<CustomerController>customer._ai).foodWanted 
            && (<CustomerController>customer._ai).foodWanted != null) {
                this.customersSatisfied++;
                this.customersSatisfiedLabel.text = "Customers Satisfied: " + (this.customersSatisfied) + "/" + this.customersSatisfiedLeft;

                (<CustomerController>customer._ai).changeState("happy");
                dish.destroy();
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "pop", loop: false, holdReference: false});
            } else if ((<CustomerController>customer._ai).foodWanted != null) {
                (<CustomerController>customer._ai).changeState("angry");
                dish.destroy();
            }
        }
    }

    protected handleThrowableStationInteraction(dish: AnimatedSprite, station: AnimatedSprite) {
        if (isIngredientsEnum((<ThrowableController>dish._ai).item) && station != null 
        && dish.collisionShape.overlaps(station.collisionShape)) {
            let stationAI = (<CookingStationController>station._ai);
            const index = stationAI.IngredientsNeeded.findIndex(item => item === (<ThrowableController>dish._ai).item);
            if (index != -1) { 
                stationAI.IngredientsNeeded.splice(index, 1); 
                dish.destroy();
            }
            // this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "pop", loop: false, holdReference: false});
        }
    }

    /**
     * Returns the player to spawn
     */
    protected respawnPlayer(): void {
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
        // let size = this.viewport.getHalfSize();
        // this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);
        this.sceneManager.changeToScene(SplashScreen, {});
        Input.enableInput();
        // this.system.stopSystem();
    }
}