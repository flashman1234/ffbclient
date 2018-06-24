import Network from "./network";
import CommandHandler from "./commandhandler";
import Game from "./model/game";

export default class Controller {
    private currentScene: string;
    public scene;
    private gameState: Game;

    public constructor() {

    }

    public setScene(scene: string, data: any = undefined) {
        console.log("Setting Scene: " + scene);
        if (this.currentScene) {
            this.scene.stop(this.currentScene);
        }
        this.scene.start(scene, data);
        this.currentScene = scene;
    }

    public updateGameState(game: Game) {
        console.log("updateGameState", game);
        this.gameState = game;
        this.setScene('bootScene', { game: game });
    }

    public movePlayer(id: string, x: integer, y: integer) {
        this.gameState.movePlayer(id, x, y);
    }

    public getGameState() {
        return this.gameState;
    }

    public connect(config: any) {
        let network = new Network();
        let commandHandler = new CommandHandler(network, this);
        network.connect(commandHandler, config);
    }
}