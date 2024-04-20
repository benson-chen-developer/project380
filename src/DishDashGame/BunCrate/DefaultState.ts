import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import BunCrateController from "./BunCrateController";
import BunCrateState from "./BunCrateState";

export default class DefaultState extends BunCrateState {
	onEnter(): void {
		(<AnimatedSprite>this.owner).animation.play("default", true);
		
	}

	update(deltaT: number): void {
		// super.update(deltaT)
	}

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}