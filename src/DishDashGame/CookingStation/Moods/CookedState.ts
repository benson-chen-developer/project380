import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { Ingredients } from "../../WorldEnums/Foods";
import { CookingStationStates, ItemInOvenState } from "../CookingStationController";
import CookingStationState from "../CookingStationState";
import CookingState from "./CookingState";

export default class CookedState extends CookingStationState {
	onEnter(): void {
        if(this.parent.foodInOven === Ingredients.PATTY){
            this.parent.foodInOven = Ingredients.COOKEDPATTY;
            this.parent.cookingState = CookingStationStates.COOKED; 
        }
		(<AnimatedSprite>this.owner).animation.play("cooked", true);
		
		this.waitTimer.start();
	}

	update(deltaT: number): void {
		// super.update(deltaT)
        if(this.parent.foodInOven === Ingredients.NONE){
            this.finished(CookingStationStates.NOTCOOKING)
        }

		else if(this.waitTimer.isStopped() && this.parent.foodInOven !== Ingredients.NONE){
			console.log("We overcooked 11");
			this.finished(CookingStationStates.OVERCOOKED);
        }
	}

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}