import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Shape from "../../../Wolfie2D/DataTypes/Shapes/Shape";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import { EaseFunctionType } from "../../../Wolfie2D/Utils/EaseFunctions";
import { isIngredientsEnum, isFoodsEnum } from "../../WorldEnums/Foods";
import PlayerController, { PlayerStates } from "../PlayerController";
import InAir from "./InAir";

export default class Jump extends InAir {
	owner: AnimatedSprite;

	onEnter(options: Record<string, any>): void {
		this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "jump", loop: false, holdReference: false});
	}

	updateSuit() {
		if (this.parent.hotbar === null){ 
			this.owner.animation.playIfNotAlready("JUMP", true);
		} else if (isIngredientsEnum(this.parent.hotbar)){
			this.owner.animation.playIfNotAlready("CARRY_JUMP", true);
		} else if (isFoodsEnum(this.parent.hotbar)){
			this.owner.animation.playIfNotAlready("SERVE_JUMP", true);
		}
	}

	update(deltaT: number): void {
		if (this.parent.freeze) return;
		super.update(deltaT);
		
		if (this.owner.onCeiling){
			this.parent.velocity.y = 0;
		}

		// If we're falling, go to the fall state
		if(this.parent.velocity.y >= 0){
			this.finished(PlayerStates.FALL);
		}
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}