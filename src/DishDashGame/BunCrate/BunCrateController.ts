import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import { WorldStatus } from "../WorldEnums/WorldStatus";

import { Foods, Ingredients } from "../WorldEnums/Foods";
import Timer from "../../Wolfie2D/Timing/Timer";
import { DishDashEvents } from "../DishDashEvents";
import DefaultState from "./DefaultState";

export default class BunCrateController extends StateMachineAI {
	owner: GameNode;
	nextTo: boolean;
	bunCrateId: number;

	initializeAI(owner: GameNode, options: Record<string, any>){
		this.owner = owner;

		this.receiver.subscribe(WorldStatus.PLAYER_MOVE);
		this.receiver.subscribe(WorldStatus.PLAYER_SERVE);

		this.nextTo = false;
		this.bunCrateId = null;


		let deafult = new DefaultState(this, owner);
		this.addState("default", deafult);

		this.initialize("default");
		// this.initialize(CookingStationStates.NOTCOOKING);
	}

	changeState(stateName: string): void {
        super.changeState(stateName);
	}

	update(deltaT: number): void {
		super.update(deltaT);
	}
}