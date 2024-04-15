import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import FlyingDishState from "./FlyingDishState";

export default class Thrown extends FlyingDishState {
	
	onEnter(): void {
		(<AnimatedSprite>this.owner).animation.play("FLYING", true);
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