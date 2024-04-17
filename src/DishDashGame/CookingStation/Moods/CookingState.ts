import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { CookingStationStates, ItemInOvenState } from "../CookingStationController";
import CookingStationState from "../CookingStationState";

export default class CookingState extends CookingStationState {
	onEnter(): void {
		// this.foodInOven = ItemInOvenState.NONE;
		// (<AnimatedSprite>this.owner).animation.play("ANGRY", true);
		
		this.waitTimer.start();
	}

    update(deltaT: number) : void {
        super.update(deltaT);

        if(this.waitTimer.isStopped()){
			this.finished(CookingStationStates.COOKED);
        }

    }

	onExit(): Record<string, any> {
		// (<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}