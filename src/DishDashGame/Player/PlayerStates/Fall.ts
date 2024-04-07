import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { isIngredientsEnum, isFoodsEnum } from "../../WorldEnums/Foods";
import InAir from "./InAir";

export default class Fall extends InAir {
    owner: AnimatedSprite;

	onEnter(options: Record<string, any>): void {
		if (this.parent.hotbar === null){ 
			this.owner.animation.playIfNotAlready("FALL", true);
		} else if (isIngredientsEnum(this.parent.hotbar)){
			this.owner.animation.playIfNotAlready("CARRY_FALL", true);
		} else if (isFoodsEnum(this.parent.hotbar)){
			this.owner.animation.playIfNotAlready("SERVE_FALL", true);
		}
	}

    onExit(): Record<string, any> {
		this.owner.animation.stop();
        return {};
    }
}