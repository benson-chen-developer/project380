import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { Ingredients } from "../../WorldEnums/Foods";
import { StationStates } from "../StationController";
import StationState from "../StationState";

export default class BunState extends StationState {
	onEnter(): void {
        // if(this.parent.foodInOven === Ingredients.PATTY){
        //     this.parent.foodInOven = Ingredients.COOKEDPATTY;
        //     this.parent.cookingState = CookingStationStates.COOKED; 
        // }
		(<AnimatedSprite>this.owner).animation.play("bun", true);
	}

	update(deltaT: number): void {
		if(this.parent.isBun && this.parent.isCookedPatty){
			// this.parent.isBurger = true;
			this.finished(StationStates.burger)
		}
	}

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}