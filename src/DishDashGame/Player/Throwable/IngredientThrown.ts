import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import ThrowableState from "./ThrowableState";

export default class IngredientThrown extends ThrowableState {
	
	onEnter(): void {
		(<AnimatedSprite>this.owner).animation.play(this.parent.item, true);
        this.owner.tweens.play("spin");
        this.parent.velocity.y = -50;
	}

	update(deltaT: number): void {
		if (this.parent.freeze) return;
		super.update(deltaT);
		this.parent.velocity.x = this.parent.directionX * this.parent.speed;
        this.parent.velocity.y += this.gravity*deltaT;
		this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}