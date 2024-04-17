import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { ItemInOvenState } from "../CookingStationController";
import CookingStationState from "../CookingStationState";

export default class Cooking extends CookingStationState {
	onEnter(): void {
		// this.foodInOven = ItemInOvenState.NONE;
		// (<AnimatedSprite>this.owner).animation.play("ANGRY", true);
		
		this.waitTimer.start();
        console.log("Food in the oven is (COOKING) ", this.foodInOven)
	}

    update(deltaT: number) : void {
        super.update(deltaT);

        if(this.waitTimer.isStopped()){
            console.log("finished cooking")
        }
    }

	onExit(): Record<string, any> {
		// (<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}