import Input from "../../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { isIngredientsEnum, isFoodsEnum } from "../../WorldEnums/Foods";
import { PlayerStates } from "../PlayerController";
import OnGround from "./OnGround";

export default class Idle extends OnGround {
	owner: AnimatedSprite;

	onEnter(options: Record<string, any>): void {
		this.parent.speed = this.parent.MIN_SPEED;
	}

	
	updateSuit() {
		if (this.parent.hotbar === null){ 
			this.owner.animation.playIfNotAlready("IDLE", true);
		} else if (isIngredientsEnum(this.parent.hotbar)){
			this.owner.animation.playIfNotAlready("CARRY_IDLE", true);
		} else if (isFoodsEnum(this.parent.hotbar)){
			this.owner.animation.playIfNotAlready("SERVE_IDLE", true);
		}
	}

	update(deltaT: number): void {
		super.update(deltaT);

		let dir = this.getInputDirection();

		if(!dir.isZero() && dir.y === 0){
			if(Input.isPressed("run")){
				this.finished(PlayerStates.RUN);
			} else {
				this.finished(PlayerStates.WALK);
			}
		}
		
		this.parent.velocity.x = 0;

		this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}