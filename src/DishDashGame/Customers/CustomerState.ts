import State from "../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../Wolfie2D/DataTypes/State/StateMachine";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Timer from "../../Wolfie2D/Timing/Timer";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import { WorldStatus } from "../WorldEnums/WorldStatus";
import CustomerController, { CustomerStates } from "./CustomerController";


export default abstract class CustomerState extends State {
	owner: GameNode;
	parent: CustomerController;
	
	// enterTimer: Timer = new Timer(2000);	// 3 Seconds long
	waitTimer: Timer = new Timer(10000); 	// 10 Seconds long
	deleteTimer: Timer = new Timer(3000); 	// 3 Seconds long

	// entered: boolean = false;
	expression: CustomerStates = CustomerStates.WAITING;
	leaving: boolean = false;

	constructor(parent: StateMachine, owner: GameNode) {
		super(parent);
		this.owner = owner;
	}

	handleInput(event: GameEvent): void {

	}

	update(deltaT: number): void {
		// console.log("Expression " + this.expression + "\tLeaving: " + this.leaving);
		if (this.leaving) {
			if (this.deleteTimer.isStopped()) {
				// console.log("Delete State: " + this.expression);
				this.emitter.fireEvent(WorldStatus.CUSTOMER_DELETE, {owner: this.owner.id});
			} 
		} else {
			if (this.waitTimer.isStopped()) {
				if (this.expression == CustomerStates.WAITING) {
					this.finished(CustomerStates.CONCERN); // Changes animation texture to concern
				} else if (this.expression == CustomerStates.CONCERN) {
					this.finished(CustomerStates.ANGRY); // Changes animation texture to Angry
				}
			}
		}
	}
}
