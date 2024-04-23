import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { CookingStationStates } from "../CookingStationController";
import CookingStationState from "../CookingStationState";

export default class CookingState extends CookingStationState {
	onEnter(): void {
		this.parent.cookingState = CookingStationStates.COOKING; 
		(<AnimatedSprite>this.owner).animation.play("cooking", true);
		this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "frying", loop: true, holdReference: true});
		this.waitTimer.start();
	}

    update(deltaT: number) : void {
        super.update(deltaT);
        if (this.waitTimer.isStopped()) this.finished(CookingStationStates.COOKED);
    }

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "frying"});
		return {};
	}
}