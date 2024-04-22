import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { Foods, Ingredients, foodIngredients } from "../../WorldEnums/Foods";
import { CookingStationStates } from "../CookingStationController";
import CookingStationState from "../CookingStationState";
import CookingState from "./CookingState";

export default class NotCooking extends CookingStationState {
	onEnter(): void {
		console.log("Food: " + this.parent.foodTheStationProduce);
		for (let ing of this.parent.IngrediantList) { this.parent.IngrediantsNeeded.push(ing); }
		this.parent.cookingState = CookingStationStates.NOTCOOKING; 
		(<AnimatedSprite>this.owner).animation.play("notCooking", true);
	}

	update(deltaT: number): void {
		// super.update(deltaT)
		if (this.parent.IngrediantsNeeded.length == 0) {
			this.finished(CookingStationStates.COOKING);
		}
		// if (this.parent.foodInOven != Ingredients.NONE) this.finished(CookingStationStates.COOKING);
	}

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}