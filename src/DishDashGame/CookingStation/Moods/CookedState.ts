import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { Ingredients, foodIngredients } from "../../WorldEnums/Foods";
import { CookingStationStates } from "../CookingStationController";
import CookingStationState from "../CookingStationState";
import CookingState from "./CookingState";

export default class CookedState extends CookingStationState {
	onEnter(): void {
		this.parent.foodInOven = this.parent.foodTheStationProduce;
        this.parent.cookingState = CookingStationStates.COOKED; 
		(<AnimatedSprite>this.owner).animation.play("cooked", true);
		// this.waitTimer.start();
	}

	update(deltaT: number): void {
		super.update(deltaT)

        if (this.parent.foodInOven == null) {
			// this.parent.IngrediantsNeeded = foodIngredients[this.parent.foodTheStationProduce];
			// this.parent.cookingState = CookingStationStates.NOTCOOKING; 
            this.finished(CookingStationStates.NOTCOOKING);
        }

		// else if (this.waitTimer.isStopped() && this.parent.foodInOven !== Ingredients.NONE){
		// 	console.log("We overcooked 11");
		// 	this.finished(CookingStationStates.OVERCOOKED);
        // }
	}

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}