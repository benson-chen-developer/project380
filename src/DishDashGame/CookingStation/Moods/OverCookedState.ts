import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { Foods, Ingredients } from "../../WorldEnums/Foods";
import { CookingStationStates, ItemInOvenState } from "../CookingStationController";
import CookingStationState from "../CookingStationState";

export default class OverCookedState extends CookingStationState {
	onEnter(): void {
        console.log("We overcooked 22");
		(<AnimatedSprite>this.owner).animation.play("overcooked", true);
	}

    update(deltaT: number) : void {
        super.update(deltaT);

        // if(this.waitTimer.isStopped()){
		// 	this.finished(CookingStationStates.COOKED);
        // }

    }

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}