import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import Input from "../Wolfie2D/Input/Input";
import Sprite from "../Wolfie2D/Nodes/Sprites/Sprite";
import Label from "../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../Wolfie2D/Scene/Layer";
import GameEvent from "../Wolfie2D/Events/GameEvent";
import Scene from "../Wolfie2D/Scene/Scene";

const MainScreenLayer = {
    MENU: "MENU",
    LEVELS: "LEVELS",
    CONTROLS: "CONTROLS",
    HELP: "HELP"
} as const

const MainScreenEvent = {
    MENU: "MENU",
    LEVELS: "LEVELS",
    CONTROLS: "CONTROLS",
    HELP: "HELP"
} as const

export default class MainScreen extends Scene {
    private logo: Sprite;
    private mainScreen: Layer;
    private levelScreen: Layer;
    private currentLayer: Layer;

    public override loadScene(){
        this.load.image("Dash", "assets/Splash/Dash.png")
        this.load.image("Dish", "assets/Splash/Dish.png")
        this.load.image("Ellipse1", "assets/Splash/Ellipse1.png")
        this.load.image("Ellipse1", "assets/Splash/Ellipse1.png")
        this.load.image("burger", "assets/Splash/burger.png")
        this.load.image("Vector1", "assets/Splash/Vector1.png")
        this.load.image("Vector2", "assets/Splash/Vector2.png")
        this.load.image("Vector3", "assets/Splash/Vector3.png")
    }


    public override startScene(): void {
        
        this.mainScreen = this.addUILayer(MainScreenLayer.MENU);
        this.currentLayer = this.mainScreen;

        this.levelScreen = this.addUILayer(MainScreenLayer.LEVELS);
        const center = this.viewport.getCenter();
        
        // this.logo = this.add.sprite("Dash", MainScreenLayer.MENU)
        // this.logo.position = new Vec2(center.x, center.y)


        const levelsBtn = this.add.uiElement(UIElementType.BUTTON, MainScreenLayer.MENU, {position: new Vec2(center.x, center.y), text: "Levels"});
        levelsBtn.size.set(100, 50);
        levelsBtn.borderWidth = 2;
        levelsBtn.onClickEventId = MainScreenEvent.LEVELS;

        // const helpBtn = <Label>this.add.uiElement(UIElementType.BUTTON, MainScreenLayer.MENU, {position: new Vec2(center.x, center.y), text: "Help"});
        // helpBtn.size.set(200, 50);
        // helpBtn.borderWidth = 2;
        // helpBtn.onClickEventId = MainScreenEvent.HELP;

        this.receiver.subscribe(MainScreenEvent.LEVELS);
    }

    public override updateScene(deltaT: number): void {
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent())
        }
    }

    protected handleEvent(event: GameEvent): void {
        switch(event.type){
            case MainScreenEvent.LEVELS: {
                this.currentLayer.setHidden(true)
                this.levelScreen.setHidden(false);
                this.currentLayer = this.levelScreen;

                break;
            }
            default: {
                throw new Error(`Unhandled event in main menu ${event.type}`)
            }
        }
    }

}