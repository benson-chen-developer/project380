import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import { WorldStatus } from "../WorldEnums/WorldStatus";
import { Foods } from "../WorldEnums/Foods";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import WalkLeft from "./States/WalkLeft";
import WalkRight from "./States/WalkRight";

export enum AngryCustomerStates {
	WALKLEFT = "WALKLEFT",
	WALKRIGHT = "WALKRIGHT",
}

export default class CustomerAngryController extends StateMachineAI {
	owner: GameNode;
	leftVec: Vec2
	rightVec: Vec2
	velocity: Vec2 = new Vec2(-100, 0);

	initializeAI(owner: GameNode, options: Record<string, any>){
		this.leftVec = options.leftVec;
		this.rightVec = options.rightVec;
		this.owner = owner;

		console.log("leftVec", this.leftVec)
		console.log("rightVec", this.rightVec)
		// console.log("curr pos", this.owner.position)

		// this.receiver.subscribe(WorldStatus.PLAYER_MOVE);
		// this.receiver.subscribe(WorldStatus.PAUSE_TIME);
		// this.receiver.subscribe(WorldStatus.RESUME_TIME);

		let walkLeft = new WalkLeft(this, owner);
		this.addState(AngryCustomerStates.WALKLEFT, walkLeft);

		let walkRight = new WalkRight(this, owner);
		this.addState(AngryCustomerStates.WALKRIGHT, walkRight);

		this.initialize(AngryCustomerStates.WALKLEFT);
	}

	changeState(stateName: string): void {

	}

	update(deltaT: number): void {
		super.update(deltaT);
	}
}