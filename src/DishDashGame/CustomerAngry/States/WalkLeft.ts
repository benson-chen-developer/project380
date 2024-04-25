import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { AngryCustomerStates } from "../CustomerAngryController";
import CustomerAngryState from "../CustomerAngryState";

export default class WalkLeft extends CustomerAngryState {
	onEnter(): void {

		// (<AnimatedSprite>this.owner).animation.play("ANGRY", true);
	}

    update(deltaT: number): void {
        const currPosition = this.parent.owner.position;
        console.log("curr pos", this.parent.owner.position)

        if(currPosition.x < this.parent.leftVec.x){
            console.log("left is switch")
            this.parent.velocity.x = this.parent.velocity.x*-1;
            this.finished(AngryCustomerStates.WALKRIGHT)
        }
        this.owner.move(this.parent.velocity.scaled(deltaT));
    }

	onExit(): Record<string, any> {
		// (<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}