import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import { WorldStatus } from "../WorldEnums/WorldStatus";

import { Foods, Ingredients, foodIngredients } from "../WorldEnums/Foods";
import Timer from "../../Wolfie2D/Timing/Timer";

import StorageStationState from "./StorageStationState";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

export enum CookingStationStates {
	IDLE = "idle"
}

export default class StorageStationController extends StateMachineAI {
	owner: GameNode;
	ingredients: Ingredients;
	ingredientIndicatorSprite: AnimatedSprite;

	initializeAI(owner: GameNode, options: Record<string, any>){
		this.owner = owner;

		this.receiver.subscribe(WorldStatus.PLAYER_MOVE);
		this.receiver.subscribe(WorldStatus.PLAYER_SERVE);

		let storage = new StorageStationState(this, owner);
		this.addState(CookingStationStates.IDLE, storage);

		this.initialize(CookingStationStates.IDLE);

        this.ingredients = options.ingredient;
		this.ingredientIndicatorSprite = options.ingredientIndicatorSprite;
		this.ingredientIndicatorSprite.animation.play(this.ingredients, true);
		// console.log("Indicator: " + this.ingredients);
	}

	changeState(stateName: string): void {
        super.changeState(stateName);
	}

	update(deltaT: number): void {
		super.update(deltaT);
	}
}