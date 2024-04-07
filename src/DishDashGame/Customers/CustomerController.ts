import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import { WorldStatus } from "../WorldEnums/WorldStatus";
import { HW5_Color } from "../hw5_color";

import Waiting from "./Moods/Waiting";
import Happy from "./Moods/Happy";
import Angry from "./Moods/Angry";
import Concern from "./Moods/Concern";
import { Foods } from "../WorldEnums/Foods";

export enum CustomerStates {
	WAITING = "waiting",
	CONCERN = "concern",
	HAPPY = "happy",
	ANGRY = "angry"
}

export default class CustomerController extends StateMachineAI {
	owner: GameNode;
	direction: Vec2 = Vec2.ZERO;
	velocity: Vec2 = Vec2.ZERO;
	foodWanted: Foods;
	speed: number = 100;

	initializeAI(owner: GameNode, options: Record<string, any>){
		this.owner = owner;

		this.receiver.subscribe(WorldStatus.PLAYER_MOVE);
		this.receiver.subscribe(WorldStatus.PLAYER_SERVE);

		let angry = new Angry(this, owner);
		this.addState(CustomerStates.ANGRY, angry);

		let concern = new Concern(this, owner);
		this.addState(CustomerStates.CONCERN, concern);

		let happy = new Happy(this, owner);
		this.addState(CustomerStates.HAPPY, happy);

		let waiting = new Waiting(this, owner);
		this.addState(CustomerStates.WAITING, waiting);

		// this.foodWanted = getRandomFood();
		this.foodWanted = Foods.FRIES;
		// this.direction = new Vec2(-1, 0);
		this.initialize(CustomerStates.WAITING);
	}

	changeState(stateName: string): void {
        super.changeState(stateName);
	}

	update(deltaT: number): void {
		super.update(deltaT);
	}
}