import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { CustomerStates } from "../CustomerController";
import CustomerState from "../CustomerState";

export default class Waiting extends CustomerState {
	owner: AnimatedSprite;
	
	onEnter(): void {
		this.expression = CustomerStates.WAITING;
		(<AnimatedSprite>this.owner).animation.play("WAITING", true);
		
		this.waitTimer.start();
	}

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}