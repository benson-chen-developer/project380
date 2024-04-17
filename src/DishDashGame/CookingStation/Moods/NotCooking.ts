import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { Ingredients } from "../../WorldEnums/Foods";
import { CookingStationStates, ItemInOvenState } from "../CookingStationController";
import CookingStationState from "../CookingStationState";
import CookingState from "./CookingState";

export default class NotCooking extends CookingStationState {
	onEnter(): void {
		this.parent.foodInOven = Ingredients.NONE;
		// (<AnimatedSprite>this.owner).animation.play("ANGRY", true);

		console.log("In not cooking state benon")
	}

	update(deltaT: number): void {
		// super.update(deltaT)

		if(this.parent.foodInOven != Ingredients.NONE)
			this.finished(CookingStationStates.COOKING);
	}

	onExit(): Record<string, any> {
		// (<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}