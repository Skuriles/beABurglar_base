import * as PIXI from "pixi.js";
import { http } from "../FileTransfer/http/http";
import { Level, Tile, InteractTypes, TilingSprite } from "../levels/level";
import MyKeyboard from "../MyKeybord/myKeyboard";
import { Collision } from "../MyKeybord/Collision/collision";
import { BasicTextRect } from "../GuiElements/BasicTextRect";
import { GameStates } from "./GameState";
import { Tool } from "../GameObjects/Tool";
import { BaseChar } from "../Characters/BaseChar";
import { Skill } from "../Characters/Skill";
import { MenuTypes } from "../GuiElements/MenuTypes";
import { Prey } from "../GameObjects/Prey";
import { BasicText } from "../GuiElements/BasicText";

export class GameLoader {
  pixiLoader: PIXI.Loader;
  myKeyboard!: MyKeyboard;
  http: http;
  moveX: number = 0;
  moveY: number = 0;
  walls: PIXI.Sprite[] = [];
  private baseChar!: BaseChar;
  public app!: PIXI.Application;
  mainTextRect!: BasicTextRect;
  interactObjects: Tile[] = [];
  listOfAllSprites: PIXI.DisplayObject[] = [];
  level!: Level;
  gameMode: GameStates = GameStates.Unknown;
  tools: Tool[];
  chars: BaseChar[];
  skills: Skill[];
  currentInteract: Tile;
  preys: Prey[];
  menuMode: MenuTypes = MenuTypes.Unknown;

  constructor() {
    this.pixiLoader = PIXI.Loader.shared;
    this.http = new http();
    this.init();
  }

  private init() {
    this.currentInteract = null;
    this.myKeyboard = new MyKeyboard(this);
    this.createMainContainer();
    this.createBasicText();
    this.loadLevelDataFromServer();
    this.gameMode = GameStates.Walking;
  }

  private createBasicText(): any {
    this.mainTextRect = new BasicTextRect(this);
    this.app.stage.addChild(this.mainTextRect.rect);
    this.app.stage.addChild(this.mainTextRect.textContainer);
    this.mainTextRect.warningRect.visible = false;
    this.mainTextRect.warningTextContainer.visible = false;
    this.app.stage.addChild(this.mainTextRect.warningRect);
    this.app.stage.addChild(this.mainTextRect.warningTextContainer);
    this.mainTextRect.show(false);
    this.mainTextRect.hideWarn();
    setTimeout(() => {
      this.mainTextRect.hide();
    }, 1000);
  }

  private createMainContainer() {
    //Create a Pixi Application
    this.app = new PIXI.Application({
      width: 1200,
      height: 800,
      antialias: true,
      resolution: 1
    });
    this.app.stage.sortableChildren = true;
    this.app.renderer.view.style.position = "absolute";
    this.app.renderer.view.style.display = "block";
    this.app.renderer.autoDensity = true;
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.app.view);
  }

  private getLevelData(responseData: any) {
    this.pixiLoader.add(
      "baseCharJson",
      "assets/tiles/character/main_char.json"
    );
    let levelData: Level = new Level(JSON.parse(responseData));
    levelData.tilingSprites.forEach(tilesSprite => {
      let resource = this.pixiLoader.resources[tilesSprite.fileName];
      if (!resource) {
        this.pixiLoader.add(
          tilesSprite.fileName,
          "assets/tiles/tileset/" + tilesSprite.fileName
        );
      }
    });
    this.pixiLoader.load(() => this.loadLevel(levelData));
  }

  private getToolsData(responseData: any) {
    let toolData = JSON.parse(responseData);
    this.tools = [];
    for (let i = 0; i < toolData.Tools.length; i++) {
      const tool = toolData.Tools[i];
      this.tools.push(new Tool(tool));
    }
  }

  private loadLevel(level: Level) {
    this.loadSkills();
    let id: any;
    this.level = level;
    level.tilingSprites.forEach(tilesSprite => {
      let resource = this.pixiLoader.resources[tilesSprite.fileName];
      if (resource) {
        id = this.pixiLoader.resources[tilesSprite.fileName].textures;
        if (id) {
          tilesSprite.floortiles.forEach((tile: Tile) => {
            let floorTiles = new PIXI.TilingSprite(
              id[tile.tile],
              tile.width,
              tile.height
            );
            floorTiles.position.set(tile.position_x, tile.position_y);
            if (tile.collision) {
              this.walls.push(floorTiles);
            }
            if (tile.scale && tile.scale != 1) {
              floorTiles.scale.x = tile.scale;
              floorTiles.scale.y = tile.scale;
            }
            this.app.stage.addChild(floorTiles);
            this.listOfAllSprites.push(floorTiles);
            // sprites done!
          });
          tilesSprite.interactObjects.forEach((tile: Tile) => {
            let interactObjects = new PIXI.TilingSprite(
              id[tile.tile],
              tile.width,
              tile.height
            );
            interactObjects.position.set(tile.position_x, tile.position_y);
            if (tile.collision) {
              this.walls.push(interactObjects);
            }
            if (tile.scale && tile.scale != 1) {
              interactObjects.scale.x = tile.scale;
              interactObjects.scale.y = tile.scale;
            }
            tile.parentFileName = tilesSprite.fileName;
            tile.sprite = interactObjects;
            this.interactObjects.push(tile);
            this.app.stage.addChild(interactObjects);
            this.listOfAllSprites.push(interactObjects);
            // sprites done!
          });
        }
      }
    });
  }

  private createBaseChar(responseData: any) {
    this.chars = this.createBaseChars(JSON.parse(responseData).chars);
    this.baseChar = this.chars[0];
    let id = this.pixiLoader.resources.baseCharJson.textures;
    if (id) {
      this.baseChar.sprite = new PIXI.AnimatedSprite([id["char_0_0.png"]]);
      this.baseChar.sprite.position.set(320, 192);
      this.baseChar.sprite.hitArea = new PIXI.Rectangle(0, 0, 32, 32);
      this.myKeyboard.assignKeyboardToSprite(
        this.baseChar.sprite,
        this.pixiLoader
      );
      this.app.stage.addChild(this.baseChar.sprite);
      this.app.ticker.add((delta: number) => this.play(delta));
    }
  }

  private createBaseChars(chars: BaseChar[]): BaseChar[] {
    let newChars = [];
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      const newChar = new BaseChar(char);
      newChars.push(newChar);
    }
    return newChars;
  }

  public play(delta: number) {
    if (this.baseChar !== null) {
      let moveAllowed = true;
      for (let i = 0; i < this.walls.length; i++) {
        const wall = this.walls[i];
        if (
          Collision.hitTestRectangle(
            this.baseChar.sprite,
            wall,
            this.moveX,
            this.moveY
          )
        ) {
          this.moveX = 0;
          this.moveY = 0;
          moveAllowed = false;
          break;
        }
      }
      // do all the automized stuff here!!
      if (moveAllowed) {
        this.baseChar.sprite.x += this.moveX;
        this.baseChar.sprite.y += this.moveY;
        this.myKeyboard.pixiKeyboard.keyboardManager.update();
      }
      let collision = Collision.contain(
        this.baseChar.sprite,
        new PIXI.Rectangle(0, 0, 1600, 800)
      );
      switch (collision) {
        case "top":
        case "down":
        case "left":
        case "right":
          this.moveX = 0;
          this.moveY = 0;
          break;
        default:
          break;
      }
    }
  }

  public loadLevelDataFromServer() {
    this.http.requestJson("level1.json", (responseData: any) =>
      this.getLevelData(responseData)
    );
  }

  private loadTools() {
    this.http.requestJson("tools.json", (responseData: any) => {
      this.getToolsData(responseData);
      this.getPrey();
      this.loadChars();
    });
  }

  private getPrey() {
    this.http.requestJson("prey.json", (responseData: any) => {
      let preys = JSON.parse(responseData).prey;
      this.preys = [];
      for (let i = 0; i < preys.length; i++) {
        const prey = preys[i];
        this.preys.push(new Prey(prey));
      }
    });
  }

  private loadSkills() {
    this.http.requestJson("skill.json", (responseData: any) => {
      this.getSkillData(responseData);
      this.loadTools();
    });
  }

  private loadChars() {
    this.http.requestJson("chars.json", (responseData: any) => {
      this.createBaseChar(responseData);
    });
  }

  private getSkillData(responseData: any) {
    const skills = JSON.parse(responseData).skills;
    this.skills = [];
    for (let i = 0; i < skills.length; i++) {
      const skill = skills[i];
      this.skills.push(new Skill(skill));
    }
  }

  public checkInteractionContainers(direction: number): any {
    for (let i = 0; i < this.interactObjects.length; i++) {
      const tile = this.interactObjects[i];
      if (Collision.hitTestInteraction(this.baseChar.sprite, tile, direction)) {
        this.menuMode = MenuTypes.Interaction;
        if (tile.container) {
          let mainInteract: Tile;
          if (tile.interact.name && tile.interact.prey && tile.interact.type) {
            mainInteract = tile;
          } else {
            mainInteract = this.getMainInteractTileFromContainer(tile);
          }
          if (mainInteract) {
            this.currentInteract = mainInteract;
            this.gameMode = GameStates.Menu;
            // this.interactWithTile(mainInteract);
            this.mainTextRect.show(true);
            let texts: BasicText[] = [];
            const baseText = new BasicText();
            baseText.id = 0;
            baseText.text = mainInteract.interact.name;
            texts.push(baseText);
            this.mainTextRect.setListOfTexts(texts);
            this.setContainerAfterInteract(mainInteract);
            // todo check more than one container
            return;
          }
        } else {
          this.gameMode = GameStates.Menu;
          this.currentInteract = tile;
          this.mainTextRect.show(true);
          let texts: BasicText[] = [];
          const baseText = new BasicText();
          baseText.id = 0;
          baseText.text = this.currentInteract.interact.name;
          texts.push(baseText);
          this.menuMode = MenuTypes.Interaction;
          this.mainTextRect.setListOfTexts(texts);
          // todo check more than one sprite
          return;
        }
      }
    }
  }

  private setContainerAfterInteract(containerTile: Tile) {
    switch (containerTile.interact.type) {
      case InteractTypes.door:
        this.level.tilingSprites.forEach((tilingSprite: TilingSprite) => {
          if (tilingSprite.fileName == containerTile.parentFileName) {
            tilingSprite.floortiles.forEach((tile: Tile) => {
              if (tile.container == containerTile.container) {
                this.interactWithTile(tile);
              }
            });
          }
        });
        break;
      case InteractTypes.prey:
        this.level.tilingSprites.forEach((tilingSprite: TilingSprite) => {
          if (tilingSprite.fileName == containerTile.parentFileName) {
            tilingSprite.interactObjects.forEach((tile: Tile) => {
              if (tile.container == containerTile.container) {
                this.interactWithTile(tile);
              }
            });
          }
        });
        break;

      default:
        break;
    }
  }

  private interactWithTile(tile: Tile) {
    switch (tile.interact.type) {
      case InteractTypes.door:
        let resource = this.pixiLoader.resources[tile.parentFileName];
        if (resource && resource.textures) {
          tile.sprite.texture = resource.textures[tile.interact.altSprite];
          if (tile.interact.type === InteractTypes.door) {
            this.walls.forEach((tilingSprite: PIXI.Sprite, index: number) => {
              if (tilingSprite == tile.sprite) {
                this.walls.splice(index, 1);
              }
            });
          }
        }
        break;
      case InteractTypes.prey:
        const id = this.mainTextRect.getSelectedObjectId();
        this.baseChar.addPrey(this.getPreyFromIndex(id));
        this.removePrey(id);
        break;
    }
  }

  private removePrey(selectedText: number): any {
    for (let i = 0; i < this.currentInteract.interact.prey.length; i++) {
      const index = this.currentInteract.interact.prey[i];
      if (index == selectedText) {
        this.currentInteract.interact.prey.splice(i, 1);
      }
    }
  }

  private selectPrey(prey: Prey): any {
    let returnResult = false;
    returnResult = this.baseChar.checkPreySkill(prey);
    if (returnResult) {
      this.gameMode = GameStates.Walking;
      this.handleInteractResult();
      this.mainTextRect.hide();
    } else {
      this.mainTextRect.showWarn();
      this.mainTextRect.setWarnText("Skill too low");
    }
  }

  private getMainInteractTileFromContainer(containerTile: Tile): Tile {
    for (let i = 0; i < this.level.tilingSprites.length; i++) {
      const tilingSprite = this.level.tilingSprites[i];
      if (tilingSprite.fileName == containerTile.parentFileName) {
        for (let j = 0; j < tilingSprite.floortiles.length; j++) {
          const tile = tilingSprite.floortiles[j];
          if (tile.container == containerTile.container) {
            if (
              tile.interact.name &&
              tile.interact.prey &&
              tile.interact.type
            ) {
              return tile;
            }
          }
        }
      }
      return null;
    }
  }

  public handleTextSelection(): void {
    let textId = this.mainTextRect.getSelectedObjectId();
    let tile = this.currentInteract;
    switch (this.menuMode) {
      case MenuTypes.Interaction:
        if (
          tile.interact.possibleTools &&
          tile.interact.possibleTools.length > 0
        ) {
          this.showTools(tile);
        } else {
          this.showPrey(tile.interact.prey);
        }
        break;
      case MenuTypes.StaticText:
        this.mainTextRect.refreshText();
        this.mainTextRect.hide();
        break;
      case MenuTypes.Tools:
        this.selectTool(this.getToolFromId(textId));
        break;
      case MenuTypes.Prey:
        this.selectPrey(this.getPreyFromIndex(textId));
        break;
      default:
        break;
    }
  }

  private showTools(tile: Tile) {
    let texts: BasicText[] = [];
    this.menuMode = MenuTypes.Tools;
    for (let i = 0; i < tile.interact.possibleTools.length; i++) {
      const toolNo = tile.interact.possibleTools[i];
      for (let index = 0; index < this.tools.length; index++) {
        const tool = this.tools[index];
        if (tool.id == toolNo) {
          //this.availableTools.push(tool);
          const baseText = new BasicText();
          baseText.id = tool.id;
          baseText.text = tool.name;
          texts.push(baseText);
        }
      }
    }
    this.mainTextRect.setListOfTexts(texts);
  }

  private showPrey(preys: number[]) {
    let texts: BasicText[] = [];
    for (let i = 0; i < preys.length; i++) {
      const prey = this.getPreyFromIndex(preys[i]);
      const baseText = new BasicText();
      baseText.id = prey.id;
      baseText.text = prey.name;
      texts.push(baseText);
    }
    this.menuMode = MenuTypes.Prey;
    this.mainTextRect.setListOfTexts(texts);
  }

  public selectTool(selectedTool: Tool): void {
    let returnResult = false;
    let result = this.baseChar.tools.indexOf(selectedTool.id);
    if (result != -1) {
      returnResult = this.checkSkillsFromTool(
        this.baseChar.skills,
        selectedTool
      );
    }
    if (returnResult) {
      this.gameMode = GameStates.Walking;
      this.handleInteractResult();
      this.mainTextRect.hide();
    } else {
      this.mainTextRect.showWarn();
      this.mainTextRect.setWarnText("Skill too low");
    }
  }

  private checkSkillsFromTool(skills: Skill[], tool: Tool): boolean {
    for (let i = 0; i < skills.length; i++) {
      const skill = skills[i];
      for (let j = 0; j < tool.options.skills.length; j++) {
        const toolSkill = tool.options.skills[j];
        if (toolSkill.id == skill.id) {
          if (skill.value < toolSkill.value) {
            return false;
          }
        }
      }
    }
    return true;
  }

  private handleInteractResult() {
    if (this.currentInteract.container) {
      this.setContainerAfterInteract(this.currentInteract);
    } else {
      this.interactWithTile(this.currentInteract);
    }
  }

  public getPreyFromIndex(index: number): Prey {
    for (let i = 0; i < this.preys.length; i++) {
      const prey = this.preys[i];
      if (prey.id === index) {
        return prey;
      }
    }
    return null;
  }

  public getToolFromId(index: number): Tool {
    for (let i = 0; i < this.tools.length; i++) {
      const tool = this.tools[i];
      if (tool.id === index) {
        return tool;
      }
    }
    return null;
  }
}
