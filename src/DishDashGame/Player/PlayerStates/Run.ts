import Input from "../../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { isIngredientsEnum, isFoodsEnum } from "../../WorldEnums/Foods";
import { PlayerStates } from "../PlayerController";
import OnGround from "./OnGround";

export default class Run extends OnGround {
	owner: AnimatedSprite;

	onEnter(options: Record<string, any>): void {
		this.parent.speed = this.parent.MAX_SPEED;
	}

	updateSuit() {
		if (this.parent.hotbar === null){ 
			this.owner.animation.playIfNotAlready("WALK", true);
		} else if (isIngredientsEnum(this.parent.hotbar)){
			this.owner.animation.playIfNotAlready("CARRY_WALK", true);
		} else if (isFoodsEnum(this.parent.hotbar)){
			this.owner.animation.playIfNotAlready("SERVE_WALK", true);
		}
	}

	update(deltaT: number): void {
		if (this.parent.freeze) return;
		super.update(deltaT);

		let dir = this.getInputDirection();

		if(dir.isZero()){
			this.finished(PlayerStates.IDLE);
		} else {
			if(!Input.isPressed("run")){
				this.finished(PlayerStates.WALK);
			}
		}

		this.parent.velocity.x = dir.x * this.parent.speed

		this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}