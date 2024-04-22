import State from "../../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../../Wolfie2D/DataTypes/State/StateMachine";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Input from "../../../Wolfie2D/Input/Input";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Timer from "../../../Wolfie2D/Timing/Timer";
import { WorldStatus } from "../../WorldEnums/WorldStatus";
import PlayerController from "../PlayerController";


export default abstract class PlayerState extends State {
	owner: GameNode;
	gravity: number = 1000;
	parent: PlayerController;
	positionTimer: Timer;

	constructor(parent: StateMachine, owner: GameNode){
		super(parent);
		this.owner = owner;
		this.positionTimer = new Timer(250);
		this.positionTimer.start();
	}

	// Change the suit color on receiving a suit color change event
	handleInput(event: GameEvent): void {
		if (event.type == WorldStatus.PAUSE_TIME) {
			this.parent.freeze = true;
			(<AnimatedSprite>this.owner).animation.pause();
		} else if (event.type == WorldStatus.RESUME_TIME) {
			this.parent.freeze = false;
			(<AnimatedSprite>this.owner).animation.resume();
		}
	}

	/** 
	 * Get the inputs from the keyboard, or Vec2.Zero if nothing is being pressed
	 */
	getInputDirection(): Vec2 {
		let direction = Vec2.ZERO;
		direction.x = (Input.isPressed("left") ? -1 : 0) + (Input.isPressed("right") ? 1 : 0);
		direction.y = (Input.isJustPressed("jump") ? -1 : 0);
		return direction;
	}

	/**This function is left to be overrided by any of the classes that extend this base class. That way, each
	 * class can swap their animations accordingly.
	*/
	updateSuit() {
		
	}

	update(deltaT: number): void {
		// Do gravity
		if (this.parent.freeze) return;
		
		this.updateSuit();
		if (this.positionTimer.isStopped()){
			this.emitter.fireEvent(WorldStatus.PLAYER_MOVE, {position: this.owner.position.clone()});
			this.positionTimer.start();
		}
		this.parent.velocity.y += this.gravity*deltaT;
	}
}