import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import { WorldStatus } from "../WorldEnums/WorldStatus";

import { Foods, Ingredients } from "../WorldEnums/Foods";
import Timer from "../../Wolfie2D/Timing/Timer";
import { DishDashEvents } from "../DishDashEvents";
import noFoodState from "./states/noFoodState";
import CookedPattyState from "./states/CookedPattyState";
import BurgerState from "./states/BurgerState";
import BunState from "./states/BunState";

export enum StationStates {
	noFood = "noFood",
	cookedPatty= "cookedPatty",
	bun = "bun",
	burger = "burger"
}

export default class StationController extends StateMachineAI {
	owner: GameNode;
	isBurger: boolean;
    isCookedPatty: boolean;
    isBun: boolean;
	stationId: number;
    nextToStation: boolean;

	initializeAI(owner: GameNode, options: Record<string, any>){
		this.owner = owner;

		this.receiver.subscribe(WorldStatus.PLAYER_MOVE);
		this.receiver.subscribe(WorldStatus.PLAYER_SERVE);

		this.stationId = null;
        this.isCookedPatty = false;
        this.isBun = false;
        this.nextToStation = false;

		let noFood = new noFoodState(this, owner);
		this.addState(StationStates.noFood, noFood);

		let cookedPatty = new CookedPattyState(this, owner);
		this.addState(StationStates.cookedPatty, cookedPatty);

		let burgerState = new BurgerState(this, owner);
		this.addState(StationStates.burger, burgerState);

		let bunState = new BunState(this, owner);
		this.addState(StationStates.bun, bunState);

		this.initialize(StationStates.noFood);
	}

	changeState(stateName: string): void {
        super.changeState(stateName);
	}

	update(deltaT: number): void {
		super.update(deltaT);
	}
}