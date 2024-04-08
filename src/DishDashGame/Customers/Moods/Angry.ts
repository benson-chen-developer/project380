import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { CustomerStates } from "../CustomerController";
import CustomerState from "../CustomerState";

export default class Angry extends CustomerState {
	onEnter(): void {
		this.expression = CustomerStates.ANGRY;
		(<AnimatedSprite>this.owner).animation.play("ANGRY", true);
		
		this.leaving = true;
		this.deleteTimer.start();
	}

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}