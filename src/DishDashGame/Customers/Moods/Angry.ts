import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import CustomerState from "../CustomerState";

export default class Angry extends CustomerState {
	onEnter(): void {
		(<AnimatedSprite>this.owner).animation.play("ANGRY", true);
	}

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}