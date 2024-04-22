import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import ThrowableState from "./ThrowableState";

export default class FoodThrown extends ThrowableState {
	
	onEnter(): void {
		(<AnimatedSprite>this.owner).animation.play(this.parent.item, true);
		this.owner.tweens.play("spin");
	}

	update(deltaT: number): void {
		super.update(deltaT);
		this.parent.velocity.x = this.parent.directionX * this.parent.speed;
		this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}