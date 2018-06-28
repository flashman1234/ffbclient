import Network from "./network";
import CommandHandler from "./commandhandler";
import Game from "./model/game";
import Coordinate from "./types/coordinate";
import { AbstractCommand } from "./model/clientcommands";
import CommandManager from "./model/commandmanager";
import { EventListener, EventType } from "./types/eventlistener";

export default class Controller {
    private currentScene: string;
    public scene;
    private game: Game;
    private commandManager: CommandManager;
    private eventListeners: EventListener[];
    private network: Network;
    /**
     * Core message passing class. Used to interface between the network and
     * the core model.
     */
    public constructor(game: Game, commandManager: CommandManager) {
        this.commandManager = commandManager;
        this.game = game;
        this.eventListeners = [];
        this.network = new Network();
    }

    public addEventListener(listener: EventListener) {
        this.eventListeners.push(listener);
    }

    public setScene(scene: string, data: any = undefined) {
        console.log("Setting Scene: " + scene);
        if (this.currentScene) {
            this.scene.stop(this.currentScene);
        }
        this.scene.start(scene, data);
        this.currentScene = scene;
    }

    public enqueueCommand(command: AbstractCommand) {
        this.commandManager.enqueueCommand(command);

        console.log('Command enqueued', command);

        if (command.triggerModelChanged == true) {
            this.eventListeners.forEach((listener) => listener.handleEvent(EventType.ModelChanged));
        }
    }

    public getGameState() {
        return this.game;
    }

    public connect(config: any) {
        let commandHandler = new CommandHandler(this.network, this);
        this.network.connect(commandHandler, config);
    }

    public disconnect() {
        this.network.leave();
    }
}
