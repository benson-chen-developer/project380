import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Shape from "../../Wolfie2D/DataTypes/Shapes/Shape";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import GameNode, { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import { Foods, Ingredients } from "../WorldEnums/Foods";
import { WorldStatus } from "../WorldEnums/WorldStatus";
import Fall from "./PlayerStates/Fall";
import Idle from "./PlayerStates/Idle";
import InAir from "./PlayerStates/InAir";
import Jump from "./PlayerStates/Jump";
import Run from "./PlayerStates/Run";
import Walk from "./PlayerStates/Walk";

export enum PlayerType {
    PLATFORMER = "platformer",
    TOPDOWN = "topdown"
}

export enum PlayerStates {
    IDLE = "idle",
    WALK = "walk",
	RUN = "run",
	JUMP = "jump",
    FALL = "fall",
	PREVIOUS = "previous"
}

export default class PlayerController extends StateMachineAI {
    protected owner: GameNode;
    velocity: Vec2 = Vec2.ZERO;
    directPostiveX: boolean = true;
	speed: number = 200;
	MIN_SPEED: number = 200;
    MAX_SPEED: number = 300;
    tilemap: OrthogonalTilemap;
    
    hotbar: any = [];
    hotbarIndex : number;
    ownerShape: Shape;

    freeze: boolean = false;

    initializeAI(owner: GameNode, options: Record<string, any>){
        this.owner = owner;
        this.initializePlatformer();
        this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;
        this.hotbar = ["Empty", "Empty", "Empty"];
        this.hotbarIndex = 0;

        this.ownerShape = this.owner.collisionShape;
		
        this.receiver.subscribe(WorldStatus.PAUSE_TIME);
		this.receiver.subscribe(WorldStatus.RESUME_TIME);

        owner.tweens.add("flip", {
            startDelay: 0,
            duration: 500,
            effects: [
                {
                    property: "rotation",
                    start: 0,
                    end: 2*Math.PI,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ]
        });
    }

    initializePlatformer(): void {
        this.speed = 400;

        let idle = new Idle(this, this.owner);
		this.addState(PlayerStates.IDLE, idle);
		let walk = new Walk(this, this.owner);
		this.addState(PlayerStates.WALK, walk);
		let run = new Run(this, this.owner);
		this.addState(PlayerStates.RUN, run);
		let jump = new Jump(this, this.owner);
        this.addState(PlayerStates.JUMP, jump);
        let fall = new Fall(this, this.owner);
        this.addState(PlayerStates.FALL, fall);
        
        this.initialize(PlayerStates.IDLE);
    }

    changeState(stateName: string): void {
        // If we jump or fall, push the state so we can go back to our current state later
        // unless we're going from jump to fall or something
        if((stateName === PlayerStates.JUMP || stateName === PlayerStates.FALL) && !(this.stack.peek() instanceof InAir)){
            this.stack.push(this.stateMap.get(stateName));
        }

        super.changeState(stateName);
    }

    update(deltaT: number): void {
		super.update(deltaT);
        let tileIndexA = this.tilemap.getColRowAt(new Vec2(this.owner.position.x-32, this.owner.position.y-64));
        let tileIndexB = this.tilemap.getColRowAt(new Vec2(this.owner.position.x+32, this.owner.position.y-64));
        let tileIndexC = this.tilemap.getColRowAt(new Vec2(this.owner.position.x, this.owner.position.y-64));

        let tileDataA = this.tilemap.getTileAtRowCol(tileIndexA);
        let tileDataB = this.tilemap.getTileAtRowCol(tileIndexB);
        let tileDataC = this.tilemap.getTileAtRowCol(tileIndexC);

        if (this.currentState === this.stateMap.get(PlayerStates.JUMP)) {
            if ((tileDataA >= 13 && tileDataA <= 15) || (tileDataB >= 13 && tileDataB <= 15) || (tileDataC >= 13 && tileDataC <= 15)) {
                this.owner.collisionShape = new AABB(this.ownerShape.center, new Vec2(0,0));
            }
        }

        if ((tileDataA < 13 || tileDataA <= 15) && (tileDataB < 13 || tileDataB > 15) && (tileDataC < 13 || tileDataC > 15)) {
            this.owner.collisionShape = this.ownerShape;
        }

        if (this.velocity.x != 0) {
            this.directPostiveX = this.velocity.x > 0 ? true : false;
        }
	}
}