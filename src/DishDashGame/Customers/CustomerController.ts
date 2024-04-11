import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import { WorldStatus } from "../WorldEnums/WorldStatus";
import { HW5_Color } from "../hw5_color";

import Waiting from "./Moods/Waiting";
import Happy from "./Moods/Happy";
import Angry from "./Moods/Angry";
import Concern from "./Moods/Concern";
import { Foods } from "../WorldEnums/Foods";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

export enum CustomerStates {
	WAITING = "waiting",
	CONCERN = "concern",
	HAPPY = "happy",
	ANGRY = "angry"
}

export default class CustomerController extends StateMachineAI {
	owner: GameNode;
	foodWanted: Foods
	foodWantedSprite: AnimatedSprite;
	// direction: Vec2 = Vec2.ZERO;
	// velocity: Vec2 = Vec2.ZERO;
	// speed: number = 100;

	initializeAI(owner: GameNode, options: Record<string, any>){
		this.owner = owner;

		this.receiver.subscribe(WorldStatus.PLAYER_MOVE);
		this.receiver.subscribe(WorldStatus.PLAYER_SERVE);

		let angry = new Angry(this, owner);
		this.addState(CustomerStates.ANGRY, angry);

		let concern = new Concern(this, owner);
		this.addState(CustomerStates.CONCERN, concern);

		let happy = new Happy(this, owner);
		this.addState(CustomerStates.HAPPY, happy);

		let waiting = new Waiting(this, owner);
		this.addState(CustomerStates.WAITING, waiting);

		this.foodWanted = options.foodWanted;
		this.foodWantedSprite = options.foodWantedSprite;
		this.foodWantedSprite.animation.play(this.foodWanted, true);
		this.initialize(CustomerStates.WAITING);
	}

	changeState(stateName: string): void {
		if ((stateName === CustomerStates.HAPPY || stateName === CustomerStates.ANGRY)){
            this.emitter.fireEvent(WorldStatus.CUSTOMER_LEAVING, {sprite: this.foodWantedSprite.id});
        }

        super.changeState(stateName);
	}

	update(deltaT: number): void {
		super.update(deltaT);
	}
}