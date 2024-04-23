import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { CustomerStates } from "../CustomerController";
import CustomerState from "../CustomerState";

export default class Happy extends CustomerState {
	owner: AnimatedSprite;
	
	onEnter(): void {
		this.expression = CustomerStates.HAPPY;
		(<AnimatedSprite>this.owner).animation.play("HAPPY", true);
		this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "happy", loop: false, holdReference: true});
		
		this.leaving = true;
		this.deleteTimer.start();
		this.parent.foodWanted = null;
	}

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}