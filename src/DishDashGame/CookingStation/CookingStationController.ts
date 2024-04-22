import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import { WorldStatus } from "../WorldEnums/WorldStatus";

import { Foods, Ingredients, foodIngredients } from "../WorldEnums/Foods";
import Timer from "../../Wolfie2D/Timing/Timer";

import NotCooking from "./Moods/NotCooking";
import CookingState from "./Moods/CookingState";
import CookedState from "./Moods/CookedState";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

export enum CookingStationStates {
	NOTCOOKING = "notCooking",
	COOKING = "cooking",
	COOKED = "cooked",
	OVERCOOKED = "overcooked"
}

// export enum ItemInOvenState {
// 	PATTY = "patty",
//     BUNS = "buns",
//     POTATO = "potato",
//     COOKEDPATTY = "cookedPatty",
//     NONE= "none",
// 	BURGER = "burger",
//     FRIES = "fries",
// }

export default class CookingStationController extends StateMachineAI {
	owner: GameNode;
	foodTheStationProduce: Foods;
	IngrediantList: Ingredients[];
	IngrediantsNeeded: Ingredients[] = [];
	foodOutputSprite: AnimatedSprite;

	foodInOven: Foods;
	cookingState: string;

    // overCooked: boolean;
	// nextToOven: boolean;
	// ovenId: number;
	// speed: number = 100;

	initializeAI(owner: GameNode, options: Record<string, any>){
		this.owner = owner;

		this.receiver.subscribe(WorldStatus.PLAYER_MOVE);
		this.receiver.subscribe(WorldStatus.PLAYER_SERVE);

		this.foodTheStationProduce = options.foodToCook;
		this.IngrediantList = foodIngredients[this.foodTheStationProduce];
		this.foodInOven = null;
		// this.nextToOven = false;
		// this.ovenId = null;

		// let emptyOven = new EmptyOven(this, owner);
		// this.addState(ItemInOvenState.NONE, emptyOven);

		let notCooking = new NotCooking(this, owner);
		this.addState(CookingStationStates.NOTCOOKING, notCooking);

		let cooking = new CookingState(this, owner);
		this.addState(CookingStationStates.COOKING, cooking);

		let cooked = new CookedState(this, owner);
		this.addState(CookingStationStates.COOKED, cooked);

		// let overcooked = new CookedState(this, owner);
		// this.addState(CookingStationStates.OVERCOOKED, overcooked);

		this.initialize(CookingStationStates.NOTCOOKING);

		this.foodOutputSprite = options.foodWantedSprite;
		this.foodOutputSprite.animation.play(this.foodTheStationProduce, true);
		console.log("Indicator: " + this.foodOutputSprite)
	}

	changeState(stateName: string): void {
        super.changeState(stateName);
	}

	update(deltaT: number): void {
		super.update(deltaT);

		// if(this.nextToOven){
		// 	console.log("Im next to oven")
		// } else {
		// 	console.log("Im not next to oven")
		// }
	}
}