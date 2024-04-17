import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { ItemInOvenState } from "../CookingStationController";
import CookingStationState from "../CookingStationState";

export default class NotCooking extends CookingStationState {
	onEnter(): void {
		this.foodInOven = ItemInOvenState.NONE;
		// (<AnimatedSprite>this.owner).animation.play("ANGRY", true);
		
        console.log("Food in the oven is ", this.foodInOven)
		// this.deleteTimer.start();
	}

	onExit(): Record<string, any> {
		// (<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}