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

import BalloonController from "../Enemies/BalloonController";
import CustomerController from "../Customers/CustomerController";

import { HW5_Color } from "../hw5_color";
import { HW5_Events } from "../hw5_enums";
import { WorldStatus } from "../WorldEnums/WorldStatus";

import HW5_ParticleSystem from "../HW5_ParticleSystem";
import PlayerController from "../Player/PlayerController";
import MainScreen from "../../MainScreenScene/MainScreen";
import FlyingDishController from "../Player/Throwable/Dishes/FlyingDishController";
import CookingStationController, { CookingStationStates } from "../CookingStation/CookingStationController";
import { DishDashEvents } from "../DishDashEvents";
import { Foods, Ingredients } from "../WorldEnums/Foods";

// HOMEWORK 5 - TODO
/**
 * Add in some level music.
 * 
 * This can be done here in the base GameLevel class, or in Level1 and Level2,
 * it's up to you.
 */
export default class GameLevel extends Scene {
    // Every level will have a player, which will be an animated sprite
    protected playerSpawn: Vec2;
    protected player: AnimatedSprite;
    protected respawnTimer: Timer;

    // Labels for the UI
    protected static livesCount: number = 3;
    protected livesCountLabel: Label;

    // Stuff to end the level and go to the next level
    protected levelEndArea: Rect;
    protected nextLevel: new (...args: any) => GameLevel;
    protected levelEndTimer: Timer;
    protected levelEndLabel: Label;
    
    // Screen fade in/out for level start and end
    protected levelTransitionTimer: Timer;
    protected levelTransitionScreen: Rect;
    
    // Custom particle sysyem
    protected system: HW5_ParticleSystem;

    // Cooldown timer for changing suits
    protected suitChangeTimer: Timer;

    protected totalCustomers: number;
    protected customersSatisfiedLabel: Label;
    protected customersSatisfied: number;
    
    protected customersWants: string;
    protected customersWantsLabel: Label;
   
    protected playersHotbar: string;
    protected playersHotbarLabel: Label;

    protected testLabel: Label;
    // Total switches and amount currently pressed
    protected totalSwitches: number;
    protected switchLabel: Label;
    protected switchesPressed: number;

    protected oven: CookingStationController;
    protected ovens: CookingStationController[];
    protected ovenIdLabel: Label;

    startScene(): void {
        this.switchesPressed = 0;
        this.customersSatisfied = 0;

        this.customersWants = "???";
        this.playersHotbar = "Nothing";
        this.ovens = [];

        // Do the game level standard initializations
        this.initLayers();
        this.initViewport();
        this.initPlayer();
        this.subscribeToEvents();
        this.addUI();

        // Initialize the timers
        this.respawnTimer = new Timer(1000, () => {
            if (GameLevel.livesCount === 0){
                this.sceneManager.changeToScene(MainScreen);
            } else {
                this.respawnPlayer();
                this.player.enablePhysics();
                this.player.unfreeze();
            }
        });
        this.levelTransitionTimer = new Timer(500);
        this.levelEndTimer = new Timer(3000, () => {
            // After the level end timer ends, fade to black and then go to the next scene
            this.levelTransitionScreen.tweens.play("fadeIn");
        });

        // 3 second cooldown for changing suits
        this.suitChangeTimer = new Timer(3000);

        // Start the black screen fade out
        this.levelTransitionScreen.tweens.play("fadeOut");

        // Initially disable player movement
        Input.disableInput();
        // this.emitter.fireEvent(HW5_Events.SUIT_COLOR_CHANGE, {color: HW5_Color.RED});
    }


    updateScene(deltaT: number){
        // Handle events and update the UI if needed
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();
            
            switch(event.type){
                case WorldStatus.DISH_HIT_CUSTOMER:
                    {
                        console.log("Called Dish Customer")
                        let node = this.sceneGraph.getNode(event.data.get("node"));
                        let other = this.sceneGraph.getNode(event.data.get("other"));

                        if ((<FlyingDishController>node._ai).food){ 
                            // Node is dish, other is Customer
                            this.handleFlyingDishCustomerInteraction(<AnimatedSprite>node, <AnimatedSprite>other);
                        } else { 
                            // Other is dish, node is Customer
                            this.handleFlyingDishCustomerInteraction(<AnimatedSprite>other,<AnimatedSprite>node);
                        }
                    }
                    break;
                case DishDashEvents.NEXT_TO_COOKNGSTATION: 
                    {
                        let node = this.sceneGraph.getNode(event.data.get("node"));
                        let other = this.sceneGraph.getNode(event.data.get("other"));

                        //This is check if player is collding with oven
                        if (node === this.player){ 
                            // Node is player, other is oven
                            const isNextTo = this.handleIsPlayerCollidingWithSprite(<AnimatedSprite>node, <AnimatedSprite>other)
                        
                            if(isNextTo){
                                this.oven.nextToOven = true;
                                const currentOven = this.ovens.find(o => o.ovenId === other.id);
                                const foodInPlayerHand = (<PlayerController>this.player._ai).hotbar;

                                if (Input.isPressed("interact")){
                                    if(foodInPlayerHand === Ingredients.PATTY && currentOven.cookingState === CookingStationStates.NOTCOOKING){
                                        currentOven.foodInOven = Ingredients.PATTY;
                                        (<PlayerController>this.player._ai).hotbar = Ingredients.NONE;
                                        this.playersHotbar = (<PlayerController>this.player._ai).hotbar;
                                    }
                                    else if(currentOven.foodInOven !== Ingredients.NONE && currentOven.cookingState === CookingStationStates.COOKED){
                                        (<PlayerController>this.player._ai).hotbar = currentOven.foodInOven;
                                        this.playersHotbar = (<PlayerController>this.player._ai).hotbar;
                                        currentOven.foodInOven = Ingredients.NONE;
                                    }
                                    else if(currentOven.cookingState === CookingStationStates.OVERCOOKED){
                                        // console.log("");
                                        (<PlayerController>this.player._ai).hotbar = Ingredients.NONE;
                                        this.playersHotbar = (<PlayerController>this.player._ai).hotbar;
                                        currentOven.foodInOven = Ingredients.NONE;
                                    }
                                }
                            } else {
                                this.oven.nextToOven = false;
                            }
                        } 
                        else { 
                            // Other is player, node is oven
                            const isNextTo = this.handleIsPlayerCollidingWithSprite(<AnimatedSprite>other,<AnimatedSprite>node);
                        
                            if(isNextTo){
                                this.oven.nextToOven = true;

                                if (Input.isPressed("interact")){

                                }
                            } else {
                                this.oven.nextToOven = false;
                            }
                        }
                    }
                    break;
                case DishDashEvents.LEAVE_COOKINGSTATION: 
                    {
                        this.oven.nextToOven = false;
                    }
                    break;
                case WorldStatus.PLAYER_AT_CUSTOMER:
                    {
                        let node = this.sceneGraph.getNode(event.data.get("node"));
                        let other = this.sceneGraph.getNode(event.data.get("other"));

                        if (node === this.player){ 
                            // Node is player, other is Customer
                            
                            this.handlePlayerCustomerInteraction(<AnimatedSprite>node, <AnimatedSprite>other);
                            
                        } else { 
                            // Other is player, node is Customer
                            this.handlePlayerCustomerInteraction(<AnimatedSprite>other,<AnimatedSprite>node);
                        }
                    }
                    break;

                case WorldStatus.CUSTOMER_LEAVING:
                    {
                        let node = this.sceneGraph.getNode(event.data.get("sprite"));
                        node.destroy();
                    }
                    break;

                case WorldStatus.CUSTOMER_DELETE:
                    {
                        let node = this.sceneGraph.getNode(event.data.get("owner"));
                        // this.system.startSystem(2000, 1, node.position.clone());
                        node.destroy();
                    }
                    break;
                    
                case HW5_Events.PLAYER_HIT_SWITCH:
                    {
                        // Hit a switch block, so update the label and count
                        this.switchesPressed++;
                        this.switchLabel.text = "Switches Left: " + (this.totalSwitches - this.switchesPressed)
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "switch", loop: false, holdReference: false});
                    }
                    break;

                case HW5_Events.BALLOON_POPPED:
                    {
                        // An balloon collided with the player, destroy it and use the particle system
                        let node = this.sceneGraph.getNode(event.data.get("owner"));
                        
                        // Set mass based on color
                        let particleMass = 0;
                        if ((<BalloonController>node._ai).color == HW5_Color.RED) {
                            particleMass = 1;
                        }
                        else if ((<BalloonController>node._ai).color == HW5_Color.GREEN) {
                            particleMass = 2;
                        }
                        else {
                            particleMass = 3;
                        }
                        this.system.startSystem(2000, particleMass, node.position.clone());
                        node.destroy();
                    }
                    break;
                    
                case HW5_Events.PLAYER_ENTERED_LEVEL_END:
                    {
                        // //Check if the player has pressed all the switches and popped all of the balloons
                        // if (this.switchesPressed >= this.totalSwitches && this.balloonsPopped >= this.totalBalloons){
                        //     if(!this.levelEndTimer.hasRun() && this.levelEndTimer.isStopped()){
                        //         // The player has reached the end of the level
                        //         this.levelEndTimer.start();
                        //         this.levelEndLabel.tweens.play("slideIn");
                        //     }
                        // }
                    }
                    break;

                case HW5_Events.LEVEL_START:
                    {
                        // Re-enable controls
                        Input.enableInput();
                    }
                    break;
                
                case HW5_Events.LEVEL_END:
                    {
                        // Go to the next level
                        if(this.nextLevel){
                            let sceneOptions = {
                                physics: {
                                    groupNames: ["ground", "player", "balloon", "interactableObj"],
                                    collisions:
                                    [
                                        [0, 1, 1, 1],
                                        [1, 0, 0, 1],
                                        [1, 0, 0, 1],
                                        [1, 1, 1, 1]
                                    ]
                                }
                            }
                            this.sceneManager.changeToScene(this.nextLevel, {}, sceneOptions);
                        }
                    }
                    break;

                case HW5_Events.PLAYER_KILLED:
                    {
                        this.respawnPlayer();
                    }
            }
        }
        

        if ((<PlayerController>this.player._ai).hotbar == null) {
            this.playersHotbar = "Nothing";
        } else {
            this.playersHotbar = (<PlayerController>this.player._ai).hotbar;
            if (Input.isKeyPressed("enter")) {
                //console.log("Direction Postive X: " + (<PlayerController>this.player._ai).directPostiveX);
                let options: Record<string, any> = {
                    "postiveXDirection" : (<PlayerController>this.player._ai).directPostiveX,
                    "foodThrown" : (<PlayerController>this.player._ai).hotbar
                };

                this.addFlyingDish("flyingDish", this.player.position.clone(), options);
                (<PlayerController>this.player._ai).hotbar = null;
                this.playersHotbar = "Nothing";
            }
        }
        this.playersHotbarLabel.text = "Waiter's Holding: " + (this.playersHotbar);
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
            WorldStatus.PLAYER_AT_CUSTOMER,
            WorldStatus.DISH_HIT_CUSTOMER,
            WorldStatus.PLAYER_COLLECT,
            WorldStatus.PLAYER_SERVE,
            WorldStatus.CUSTOMER_LEAVING,
            WorldStatus.CUSTOMER_DELETE,
            WorldStatus.CUSTOMER_SPAWN,
            
            DishDashEvents.NEXT_TO_COOKNGSTATION,

            HW5_Events.PLAYER_HIT_SWITCH,
            HW5_Events.PLAYER_HIT_BALLOON,
            HW5_Events.BALLOON_POPPED,
            HW5_Events.PLAYER_ENTERED_LEVEL_END,
            HW5_Events.LEVEL_START,
            HW5_Events.LEVEL_END,
            HW5_Events.PLAYER_KILLED
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

        this.testLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(400, 30), text: "Go to Customer and Interact (Press Enter)"});
        this.testLabel.textColor = Color.BLACK;

        this.customersWantsLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(100, 330), text: "Customer Wants: " + (this.customersWants)});
        this.customersWantsLabel.textColor = Color.WHITE;
        // this.customersWantsLabel.font = "PixelSimple";
        
        this.playersHotbarLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(300, 330), text: "Waiter's Holding: " + (this.playersHotbar)});
        this.playersHotbarLabel.textColor = Color.WHITE;
        // this.playersHotbarLabel.font = "PixelSimple";
        
        // End of level label (start off screen)
        this.levelEndLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(-300, 200), text: "Level Complete"});
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
            onEnd: HW5_Events.LEVEL_END
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
            onEnd: HW5_Events.LEVEL_START
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

    /**
     * Initializes the level end area
     */
    protected addLevelEnd(startingTile: Vec2, size: Vec2): void {
        this.levelEndArea = <Rect>this.add.graphic(GraphicType.RECT, "primary", {position: startingTile.scale(32), size: size.scale(32)});
        this.levelEndArea.addPhysics(undefined, undefined, false, true);
        this.levelEndArea.setTrigger("player", HW5_Events.PLAYER_ENTERED_LEVEL_END, null);
        this.levelEndArea.color = new Color(0, 0, 0, 0);
    }

    protected addOven(spriteKey: string, tilePos: Vec2, aiOptions: Record<string, any>): void {
        let oven = this.add.animatedSprite(spriteKey, "secondary");
        oven.position.set(tilePos.x*32, tilePos.y*32);
        oven.scale.set(.2, .2);
        
        oven.addPhysics();
        oven.setTrigger("player", DishDashEvents.NEXT_TO_COOKNGSTATION, null);
        
        oven.addAI(CookingStationController, aiOptions);
        oven.setGroup("interactableObj");

        this.oven = <CookingStationController>oven.ai;
        if(this.ovens.length === 0){
            this.oven.ovenId = oven.id;
        } else {
            this.oven.ovenId = this.ovens[this.ovens.length-1].ovenId + 1;
        }
        this.ovens.push(this.oven);
    }

    protected addCustomer(spriteKey: string, tilePos: Vec2, aiOptions: Record<string, any>): void {
        let customer = this.add.animatedSprite(spriteKey, "secondary");
        customer.position.set(tilePos.x*32, tilePos.y*32);
        customer.scale.set(2, 2);
        
        customer.addPhysics();
        customer.setTrigger("player", WorldStatus.PLAYER_AT_CUSTOMER, WorldStatus.PLAYER_SERVE);
        customer.setTrigger("flyingDish", WorldStatus.DISH_HIT_CUSTOMER, WorldStatus.PLAYER_SERVE);
        
        let foodWantedSprite = this.addFoodIndicator(aiOptions.indicatorKey, tilePos, aiOptions);
        aiOptions["foodWantedSprite"] = foodWantedSprite;
        
        customer.addAI(CustomerController, aiOptions);
        customer.setGroup("customer");
    }
    protected addFoodIndicator(spriteKey: string, tilePos: Vec2, aiOptions: Record<string, any>): AnimatedSprite {
        let foodIndicator = this.add.animatedSprite(spriteKey, "secondary");
        foodIndicator.position.set(tilePos.x*32, (tilePos.y-1)*32-16);
        foodIndicator.scale.set(2, 2);
        foodIndicator.setGroup("foodIndicator");
        return foodIndicator;
    }

    protected addFlyingDish(spriteKey: string, tilePos: Vec2, aiOptions: Record<string, any>): void {
        let dish = this.add.animatedSprite(spriteKey, "primary");
        dish.position.set(tilePos.x, tilePos.y);
        dish.scale.set(2, 2);
        dish.addPhysics();
        // dish.setTrigger("customer", WorldStatus.DISH_HIT_CUSTOMER, WorldStatus.PLAYER_SERVE);
        dish.addAI(FlyingDishController, aiOptions);
        dish.setGroup("flyingDish");
    }

    protected handlePlayerCustomerInteraction(player: AnimatedSprite, customer: AnimatedSprite) {
        if (customer != null && player.collisionShape.overlaps(customer.collisionShape)) {
            this.customersWants = (<CustomerController>customer._ai).foodWanted;

            if (Input.isPressed("interact") && (<PlayerController>player._ai).hotbar === (<CustomerController>customer._ai).foodWanted 
            && (<CustomerController>customer._ai).foodWanted != null) {
                (<PlayerController>player._ai).hotbar = null;
                
                this.customersSatisfied++;
                this.customersSatisfiedLabel.text = "Customers Satisfied: " + (this.customersSatisfied);

                this.emitter.fireEvent(WorldStatus.PLAYER_SERVE, {owner: customer.id});
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "pop", loop: false, holdReference: false});
            }
        } else {
            this.customersWants = "???";
        }
        this.customersWantsLabel.text = "Customer Wants: " + (this.customersWants);
    }

    // protected handleIsPlayerCollidingWithOven(player: AnimatedSprite, otherSprite: AnimatedSprite){
    //     if(otherSprite !== null && player.collisionShape.overlaps(otherSprite.collisionShape)){
    //         this.oven.nextToOven = true;
    //         // console.log(this.oven.owner.id);

    //         if (Input.isPressed("interact")){
    //             // console.log(this.oven.ovenId);
    //             // console.log("all the ovenIds", this.ovens)
    //             // console.log("these two ovens have the same id", this.ovens.find(o => o.ovenId === this.oven.ovenId).ovenId, this.oven.ovenId)
                
    //             console.log("In the players hand is", <PlayerController>this,player._ai))
    //         }
    //     } else {
    //         this.oven.nextToOven = false;
    //     }
    // }

    protected handleIsPlayerCollidingWithSprite(player: AnimatedSprite, otherSprite: AnimatedSprite){
        if(otherSprite !== null && player.collisionShape.overlaps(otherSprite.collisionShape)){
            return true;
        } else {
            return false;
        }
    }

    protected handleFlyingDishCustomerInteraction(dish: AnimatedSprite, customer: AnimatedSprite) {
        if (customer != null && dish.collisionShape.overlaps(customer.collisionShape)) {
            if ((<FlyingDishController>dish._ai).food === (<CustomerController>customer._ai).foodWanted 
            && (<CustomerController>customer._ai).foodWanted != null) {
                
                this.customersSatisfied++;
                this.customersSatisfiedLabel.text = "Customers Satisfied: " + (this.customersSatisfied);

                this.emitter.fireEvent(WorldStatus.PLAYER_SERVE, {owner: customer.id});
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "pop", loop: false, holdReference: false});
            } else {
                (<CustomerController>customer._ai).changeState("angry");
            }
            dish.destroy();
        }
    }




    /**
     * Increments the amount of life the player has
     * @param amt The amount to add to the player life
     */
    protected incPlayerLife(amt: number): void {
        GameLevel.livesCount += amt;
        this.livesCountLabel.text = "Lives: " + GameLevel.livesCount;
        if (GameLevel.livesCount == 0){
            Input.disableInput();
            this.player.disablePhysics();
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "player_death", loop: false, holdReference: false});
            this.player.tweens.play("death");
        }
    }

    /**
     * Returns the player to spawn
     */
    protected respawnPlayer(): void {
        GameLevel.livesCount = 3;
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
        this.sceneManager.changeToScene(MainScreen, {});
        Input.enableInput();
        this.system.stopSystem();
    }
}