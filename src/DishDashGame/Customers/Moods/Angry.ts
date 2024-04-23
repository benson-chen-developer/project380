import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { CustomerStates } from "../CustomerController";
import CustomerState from "../CustomerState";

export default class Angry extends CustomerState {
	onEnter(): void {
		this.expression = CustomerStates.ANGRY;
		(<AnimatedSprite>this.owner).animation.play("ANGRY", true);
		this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "angry", loop: false, holdReference: true});
		
		this.leaving = true;
		this.deleteTimer.start();
		this.parent.foodWanted = null;
	}

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}