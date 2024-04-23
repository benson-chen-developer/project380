import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import Input from "../Wolfie2D/Input/Input";
import Sprite from "../Wolfie2D/Nodes/Sprites/Sprite";
import { UIElementType } from "../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../Wolfie2D/Scene/Layer";
import Scene from "../Wolfie2D/Scene/Scene";
import MainScreen from "./MainScreen";

const SplashScreenLayer = {
    SPLASH_SCREEN: "SPLASH_SCREEN"
} as const


export default class SplashScreen extends Scene {
    private logo: Sprite;
    private splashScreen: Layer;

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
        this.splashScreen = this.addUILayer(SplashScreenLayer.SPLASH_SCREEN);
        
        const center = this.viewport.getCenter();

        this.logo = this.add.sprite("Dish", SplashScreenLayer.SPLASH_SCREEN)
        this.logo.position = new Vec2(center.x*.75, center.y*.5)
        this.logo = this.add.sprite("Dash", SplashScreenLayer.SPLASH_SCREEN)
        this.logo.position = new Vec2(center.x*1.25, center.y*.75)
        
        this.logo = this.add.sprite("Ellipse1", SplashScreenLayer.SPLASH_SCREEN)
        this.logo.position = new Vec2(center.x*.5, center.y*1.5)
        this.logo = this.add.sprite("burger", SplashScreenLayer.SPLASH_SCREEN)
        this.logo.position = new Vec2(center.x*.4, center.y*1.3)

        this.logo = this.add.sprite("Vector1", SplashScreenLayer.SPLASH_SCREEN)
        this.logo.position = new Vec2(center.x*1.25, center.y*1.5)
        this.logo = this.add.sprite("Vector2", SplashScreenLayer.SPLASH_SCREEN)
        this.logo.position = new Vec2(center.x*1.25, center.y*1.4)
        this.logo = this.add.sprite("Vector3", SplashScreenLayer.SPLASH_SCREEN)
        this.logo.position = new Vec2(center.x*1.25, center.y*1.3)

        const textThing = this.add.uiElement(UIElementType.LABEL, SplashScreenLayer.SPLASH_SCREEN, {position: new Vec2(center.x * 1.4, center.y * 1.8), text: "Click To Start"});
    }

    public override updateScene(deltaT: number): void {
        if(Input.isMouseJustPressed()){
            this.sceneManager.changeToScene(MainScreen, {});
        }
        while(this.receiver.hasNextEvent()){
            this.receiver.getNextEvent();
        }
    }
}