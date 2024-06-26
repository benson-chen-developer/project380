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
	waitTimer: Timer = new Timer(60000); 	// 1 min long
	deleteTimer: Timer = new Timer(3000); 	// 3 Seconds long

	// entered: boolean = false;
	expression: CustomerStates = CustomerStates.WAITING;
	leaving: boolean = false;

	constructor(parent: StateMachine, owner: GameNode) {
		super(parent);
		this.owner = owner;
	}

	handleInput(event: GameEvent): void {
		if (event.type == WorldStatus.PAUSE_TIME) {
			if (this.waitTimer.hasRun() && !this.waitTimer.isStopped()) this.waitTimer.isPaused();
			if (this.deleteTimer.hasRun() && !this.deleteTimer.isStopped()) this.deleteTimer.isPaused();
			(<AnimatedSprite>this.owner).animation.pause();
		}
		else if (event.type == WorldStatus.RESUME_TIME) {
			if (this.waitTimer.hasRun() && !this.waitTimer.isPaused()) this.waitTimer.start();
			if (this.deleteTimer.hasRun() && !this.deleteTimer.isPaused()) this.deleteTimer.start();
			(<AnimatedSprite>this.owner).animation.resume();
		}
	}

	update(deltaT: number): void {
		if (this.leaving) {
			if (this.deleteTimer.isStopped()) {
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
