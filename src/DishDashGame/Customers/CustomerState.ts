import State from "../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../Wolfie2D/DataTypes/State/StateMachine";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Timer from "../../Wolfie2D/Timing/Timer";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import { HW5_Color } from "../hw5_color";
import { WorldStatus } from "../WorldEnums/WorldStatus";
import CustomerController, { CustomerStates } from "./CustomerController";
import { Foods, getRandomFood } from "../WorldEnums/Foods";


export default abstract class CustomerState extends State {
	owner: GameNode;
	parent: CustomerController;
	waitTimer: Timer;
	expression: CustomerStates;
	wants: Foods;
	satisfied: boolean;

	constructor(parent: StateMachine, owner: GameNode) {
		super(parent);
		this.owner = owner;
		this.waitTimer = new Timer(15000); // 20 secs of waiting
		this.expression = CustomerStates.WAITING
		this.wants = getRandomFood()
		this.satisfied = false
	}

	handleInput(event: GameEvent): void {
		if (event.type == WorldStatus.PLAYER_GIVE) {
			let food_given = event.data.get("food");
			
			if (this.wants == food_given){
				this.satisfied = true;
			}
		}
	}

	// updateExpression() {
	// 	if (this.expression == CustomerStates.WAITING) {
	// 		this.aniSprite.animation.playIfNotAlready("WAITING", true);
	// 	} else if (this.expression == CustomerStates.CONCERN) {
	// 		this.aniSprite.animation.playIfNotAlready("CONCERED", true);
	// 	} else if (this.expression == CustomerStates.HAPPY) {
	// 		this.aniSprite.animation.playIfNotAlready("HAPPY", true);
	// 	} else if (this.expression == CustomerStates.ANGRY) {
	// 		this.aniSprite.animation.playIfNotAlready("ANGRY", true);
	// 	}
	// }

	update(deltaT: number): void {
		if (this.waitTimer.isStopped()) {
			if (this.satisfied) {
				this.expression = CustomerStates.HAPPY;
				this.finished(CustomerStates.HAPPY);
			} else if (this.expression == CustomerStates.WAITING) {
				this.expression = CustomerStates.CONCERN;
				this.finished(CustomerStates.CONCERN);
                this.waitTimer.start();
            } else if (this.expression == CustomerStates.CONCERN) {
				this.expression = CustomerStates.ANGRY;
                this.finished(CustomerStates.ANGRY);
            }
        }
	}
}
