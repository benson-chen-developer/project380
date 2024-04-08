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

    // Total ballons and amount currently popped
    protected totalBalloons: number;
    protected balloonLabel: Label;
    protected balloonsPopped: number;

    protected totalCustomers: number;
    protected customersSatisfiedLabel: Label;
    protected customersSatisfied: number;

    // Total switches and amount currently pressed
    protected totalSwitches: number;
    protected switchLabel: Label;
    protected switchesPressed: number;

    startScene(): void {
        this.balloonsPopped = 0;
        this.switchesPressed = 0;

        this.customersSatisfied = 0;

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
                case WorldStatus.PLAYER_AT_CUSTOMER:
                    {
                        let node = this.sceneGraph.getNode(event.data.get("node"));
                        let other = this.sceneGraph.getNode(event.data.get("other"));

                        if(node === this.player){ // Node is player, other is balloon
                            this.handlePlayerCustomerInteraction(<AnimatedSprite>node, <AnimatedSprite>other);
                        } else { // Other is player, node is balloon
                            this.handlePlayerCustomerInteraction(<AnimatedSprite>other,<AnimatedSprite>node);
                        }
                    }
                    break;
                case WorldStatus.PLAYER_SERVE:
                    {
                        
                    }
                    break;
                case WorldStatus.CUSTOMER_DELETE:
                    {
                        this.customersSatisfied++;
                        this.customersSatisfiedLabel.text = "Customers Satisfied: " + (this.customersSatisfied);
                        
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
                        //Check if the player has pressed all the switches and popped all of the balloons
                        if (this.switchesPressed >= this.totalSwitches && this.balloonsPopped >= this.totalBalloons){
                            if(!this.levelEndTimer.hasRun() && this.levelEndTimer.isStopped()){
                                // The player has reached the end of the level
                                this.levelEndTimer.start();
                                this.levelEndLabel.tweens.play("slideIn");
                            }
                        }
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
                                    groupNames: ["ground", "player", "balloon"],
                                    collisions:
                                    [
                                        [0, 1, 1],
                                        [1, 0, 0],
                                        [1, 0, 0]
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

        // if (this.suitChangeTimer.isStopped()) {
        //     if (Input.isKeyJustPressed("1")) {
        //         this.emitter.fireEvent(HW5_Events.SUIT_COLOR_CHANGE, {color: HW5_Color.RED});
        //         this.suitChangeTimer.start();
        //     }
        //     if (Input.isKeyJustPressed("2")) {
        //         this.emitter.fireEvent(HW5_Events.SUIT_COLOR_CHANGE, {color: HW5_Color.BLUE});
        //         this.suitChangeTimer.start();
        //     }
        //     if (Input.isKeyJustPressed("3")) {
        //         this.emitter.fireEvent(HW5_Events.SUIT_COLOR_CHANGE, {color: HW5_Color.GREEN});
        //         this.suitChangeTimer.start();
        //     }
        // }
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
            WorldStatus.PLAYER_COLLECT,
            WorldStatus.PLAYER_SERVE,
            WorldStatus.CUSTOMER_DELETE,
            WorldStatus.CUSTOMER_SPAWN,

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
        this.customersSatisfiedLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(80, 30), text: "Customer Satisfied: " + (this.customersSatisfied)});
        this.customersSatisfiedLabel.textColor = Color.BLACK
        this.customersSatisfiedLabel.font = "PixelSimple";

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

    /**
     * Adds an balloon into the game
     * @param spriteKey The key of the balloon sprite
     * @param tilePos The tilemap position to add the balloon to
     * @param aiOptions The options for the balloon AI
     */
    protected addBalloon(spriteKey: string, tilePos: Vec2, aiOptions: Record<string, any>): void {
        let balloon = this.add.animatedSprite(spriteKey, "primary");
        balloon.position.set(tilePos.x*32, tilePos.y*32);
        balloon.scale.set(2, 2);
        balloon.addPhysics();

        balloon.setTrigger("player", HW5_Events.PLAYER_HIT_BALLOON, HW5_Events.BALLOON_POPPED);

        balloon.addAI(BalloonController, aiOptions);
        balloon.setGroup("balloon");

    }

    protected addCustomer(spriteKey: string, tilePos: Vec2, aiOptions: Record<string, any>): void {
        let customer = this.add.animatedSprite(spriteKey, "secondary");
        customer.position.set(tilePos.x*32, tilePos.y*32);
        customer.scale.set(2, 2);
        
        customer.addPhysics();
        customer.setTrigger("player", WorldStatus.PLAYER_AT_CUSTOMER, WorldStatus.PLAYER_SERVE);
        
        customer.addAI(CustomerController, aiOptions);
        customer.setGroup("customer");

    }

    protected handlePlayerCustomerInteraction(player: AnimatedSprite, customer: AnimatedSprite) {
        if (Input.isKeyPressed("enter") && customer != null && player.collisionShape.overlaps(customer.collisionShape) 
        && (<PlayerController>player._ai).hotbar === (<CustomerController>customer._ai).foodWanted) {
            (<PlayerController>player._ai).hotbar = null;
            
            this.emitter.fireEvent(WorldStatus.PLAYER_SERVE, {owner: customer.id});
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "pop", loop: false, holdReference: false});
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