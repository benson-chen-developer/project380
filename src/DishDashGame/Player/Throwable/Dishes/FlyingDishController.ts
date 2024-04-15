import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import StateMachineAI from "../../../../Wolfie2D/AI/StateMachineAI";
import { WorldStatus } from "../../../WorldEnums/WorldStatus";
import Thrown from "./Thrown";
import { Foods } from "../../../WorldEnums/Foods";


export enum FlyingDishStates {
	THROWN = "thrown",
}

export default class FlyingDishController extends StateMachineAI {
	owner: GameNode;
	directionX: number;
	velocity: Vec2 = Vec2.ZERO;
    food: Foods;
	speed: number = 200;
	// ySpeed: number = 700;
	// gravity: number = 1000;

	initializeAI(owner: GameNode, options: Record<string, any>){
		this.owner = owner;

		this.receiver.subscribe(WorldStatus.PLAYER_MOVE);

		let thrown = new Thrown(this, owner);
		this.addState(FlyingDishStates.THROWN, thrown);

		this.directionX = options.postiveXDirection ? 1 : -1;
        this.food = options.foodThrown;

		this.initialize(FlyingDishStates.THROWN);
	}

	changeState(stateName: string): void {
        super.changeState(stateName);
	}

	update(deltaT: number): void {
		super.update(deltaT);
	}
}