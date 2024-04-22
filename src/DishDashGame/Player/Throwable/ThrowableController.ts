import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import { WorldStatus } from "../../WorldEnums/WorldStatus";
import FoodThrown from "./FoodThrown";
import { Foods, isFoodsEnum, isIngredientsEnum } from "../../WorldEnums/Foods";
import IngredientThrown from "./IngredientThrown";
import { EaseFunctionType } from "../../../Wolfie2D/Utils/EaseFunctions";

export enum ThrowableStates {
	FOOD_THROWN = "foodThrown",
	INGREDIENT_THROWN = "IngredientThrown",
}

export default class ThrowableController extends StateMachineAI {
	owner: GameNode;
	directionX: number;
	velocity: Vec2 = Vec2.ZERO;
    item: any;
	speed: number = 300;
	freeze: boolean = false;

	initializeAI(owner: GameNode, options: Record<string, any>){
		owner.tweens.add("spin", {
			startDelay: 0,
			duration: 999999,
			effects: [
				{
					property: "rotation",
					start: 0,
					end: 10*999999*Math.PI,
					ease: EaseFunctionType.IN_OUT_QUAD
				}
			]
		});

		this.owner = owner;

		this.receiver.subscribe(WorldStatus.PLAYER_MOVE);
		this.receiver.subscribe(WorldStatus.PAUSE_TIME);
		this.receiver.subscribe(WorldStatus.RESUME_TIME);

		let food = new FoodThrown(this, owner);
		this.addState(ThrowableStates.FOOD_THROWN, food);

		let ingredient = new IngredientThrown(this, owner);
		this.addState(ThrowableStates.INGREDIENT_THROWN, ingredient);

		this.directionX = options.postiveXDirection ? 1 : -1;
        this.item = options.itemThrown;

		// this.initialize(ThrowableStates.FOOD_THROWN);
		if (isFoodsEnum(this.item)) { this.initialize(ThrowableStates.FOOD_THROWN); }
		else if (isIngredientsEnum(this.item)) { this.initialize(ThrowableStates.INGREDIENT_THROWN); }
		else this.initialize(ThrowableStates.FOOD_THROWN);

		
	}

	changeState(stateName: string): void {
        super.changeState(stateName);
	}

	update(deltaT: number): void {
		super.update(deltaT);
	}
}
