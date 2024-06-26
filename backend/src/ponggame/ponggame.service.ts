import {Injectable, Logger} from "@nestjs/common";
import { GameLogic } from "./gamelogic";
import { GameState } from "./dto/game-state.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/user/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class PonggameService {
  constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>
	) {}
  private readonly logger = new Logger(PonggameService.name);

  private _currentMatches: Map<string, GameState> = new Map(); //string represent the matchId
  private _userMatch: Map<string, string> = new Map(); //keeps track of which match the current user is currently part of.
  private _queueDefaultMatchId: string = "";
  private _queueReversiMatchId: string = "";
  private _queueShimmerMatchId: string = "";
  private _gameLogic: GameLogic = new GameLogic();

  getCurrentMatches(): Map<string, GameState> {
    return this._currentMatches;
  }

  playerConnected(userId: string){
    const matchId = this.getMatchId(userId);
    const match =this._currentMatches.get(matchId);
    if(match.currentState == 'PrivateQueue')
        match.currentState = 'WaitingForInvited';
    else if (match.currentState == 'WaitingForInvited')
        match.currentState = 'Playing';
  }

  playerDisconnected(userId: string) {
    const matchId = this._userMatch.get(userId);
    if (matchId == undefined) return;
    const match = this._currentMatches.get(matchId);

    if (match == undefined) return;
    if (match.currentState == "Playing") {
      match.currentState = "End";
      match.stateMessage = "Opponent disconnected. You win be default";
      if(match.player1loginname === userId)
      {
        match.winner = 2;
      } else {
        match.winner = 1;
      }
    } 
    else if (match.currentState == "Queue") {
      match.currentState = "Reset";
      match.stateMessage = "";
      if (match.gameType == "Default") this._queueDefaultMatchId = "";
      else if (match.gameType == "Reversi") this._queueReversiMatchId = "";
      else if (match.gameType == "Shimmer") this._queueShimmerMatchId = "";
    }
    else if (match.currentState == 'WaitingForInvited' && match.player1loginname == userId){
        match.currentState = 'Disconnection';
        match.stateMessage = 'Opponent left before the game started';
    }
    else if (match.currentState =="PrivateQueue" || (match.currentState == 'WaitingForInvited' && match.player2loginname == userId))
        return;
    this._userMatch.delete(userId);
  }

  playerLeavesQueue(userId: string) : boolean{
    const matchId = this._userMatch.get(userId);
    if (matchId == undefined) return true;
    const match = this._currentMatches.get(matchId);
    if (match.currentState == "Queue" || match.currentState == "WaitingForInvited")
    { 
        match.currentState = "Reset";
        match.stateMessage = "";
        if (match.gameType == "Default") this._queueDefaultMatchId = "";
        else if (match.gameType == "Reversi") this._queueReversiMatchId = "";
        else if (match.gameType == "Shimmer") this._queueShimmerMatchId = "";
        this._userMatch.delete(userId);
        return true;
    }
    return false;
  }

  cleanUpMatches() {
    this._currentMatches.forEach((gameState: GameState, matchId: string) => {
      if (gameState.currentState == "End" || gameState.currentState == "Disconnection" || gameState.currentState == "Reset") {
        this._currentMatches.delete(matchId);
      }
    });
  }
  updateCurrentMatches() {
    this._currentMatches.forEach((gameState, matchId) => {
      if ( gameState.currentState == "Playing")
        this._currentMatches[matchId] = this._gameLogic.updateState(gameState);
      
    });
  }

  updateUserInput(matchId: string, userId: string, input: number) {
    if (!this._currentMatches.has(matchId)) return;
    const currentMatch = this._currentMatches.get(matchId);
    if (currentMatch.gameType == "Reversi") input *= -1;
    if (currentMatch.player1loginname == userId) {
      currentMatch.player1input = input;
    } else if (currentMatch.player2loginname == userId) {
      currentMatch.player2input = input;
    }
  }

  //get matchId if the user is already in a match else return emptystring
  getMatchId(userId: string): string {
    if (this._userMatch.has(userId)) {
      return this._userMatch.get(userId);
    }
    return "";
  }

  joinGame(userId: string, profilename: string, matchType: string) : string {
    if (matchType == "Default" && this._queueDefaultMatchId == "") {
      return this.createNewMatch(userId, profilename, "Default");
    } else if (matchType == "Reversi" && this._queueReversiMatchId == "") {
      return this.createNewMatch(userId, profilename, "Reversi");
    } else if (matchType == "Shimmer" && this._queueShimmerMatchId == "") {
      return this.createNewMatch(userId, profilename, "Shimmer");
    } else {

      let currentMatchId = "";
      if (matchType == "Default") {
         currentMatchId = this._queueDefaultMatchId;
         this._queueDefaultMatchId = "";
      } else if (matchType == "Reversi") {
         currentMatchId = this._queueReversiMatchId;
         this._queueReversiMatchId = "";
      } else if (matchType == "Shimmer") {
         currentMatchId = this._queueShimmerMatchId;
         this._queueShimmerMatchId = "";
      }
      const currentGamestate = this._currentMatches.get(currentMatchId);
      currentGamestate.player2loginname = userId;
      currentGamestate.player2profilename = profilename;
      currentGamestate.currentState = "Playing";
      this._userMatch.set(userId, currentMatchId);
      return currentMatchId;
    }
  }

  //will create a new gamestate and register it to currentMatches
  //will register the user to userMatch
  //Add the matchId to the relevant queue
  createNewMatch(userId: string, profilename: string, matchType: string): string {
    const newMatch = this.getInitMatch(matchType);
    const currentMatchId = "match" + userId;
    newMatch.roomName = currentMatchId;
    newMatch.currentState = "Queue";
    newMatch.stateMessage = "Waiting for opponent...";
    newMatch.stateMessage2= "Press r to go back to selection screen";
    newMatch.player1profilename = profilename;
    newMatch.player1loginname = userId;
    this._currentMatches.set(currentMatchId, newMatch);
    this._userMatch.set(userId, currentMatchId);
    if (matchType == "Default") this._queueDefaultMatchId = currentMatchId;
    else if (matchType == "Reversi") this._queueReversiMatchId = currentMatchId;
    else if (matchType == "Shimmer") this._queueShimmerMatchId = currentMatchId;
    return currentMatchId;
  }

  createPrivateMatch(userId: string, userId2: string, user1profile: string, user2profile: string, matchType: string){
    const newMatch = this.getInitMatch(matchType);
    const currentMatchId= "match" + userId;
    newMatch.roomName = currentMatchId;
    newMatch.currentState = "PrivateQueue";
    newMatch.stateMessage = "Waiting for user to accept the invite";
    newMatch.player1loginname = userId;
    newMatch.player2loginname = userId2;
    newMatch.player1profilename = user1profile;
    newMatch.player2profilename = user2profile;
    this._currentMatches.set(currentMatchId, newMatch);
    this._userMatch.set(userId, currentMatchId);
    this._userMatch.set(userId2, currentMatchId);
  }

  // provide initial gamestate template
  getInitMatch(matchType: string): GameState {
    const starting_angle = 180;
    const starting_angle_radians = (starting_angle * Math.PI) / 180;
    const ball_speed = 0.009;
    let invisibletimer = 0;
    let paddleHeight = 0.2;

    if (matchType == "Reversi") {
      paddleHeight = 0.1;
    }
    else if(matchType == "Shimmer"){
        invisibletimer = 100;
    }
    const state: GameState = {
      roomName: "default",
      gameType: matchType,
      currentState: "Selection",
      stateMessage: "Waiting for opponent...",
      stateMessage2: "Press r to go back to selection screen",
      timer: 100,
      invisibletimer: invisibletimer,
      invisibletoggle: false,
      winner: 0,
      ball_speed: ball_speed,
      ball_x_speed: 0,
      ball_y_speed: 0,
      ball_x: 0.5,
      ball_y: 0.5,
      ball_size: 0.01,
      player1pos: 0.5,
      player1height: paddleHeight,
      player1width: 0.01,
      player1speed: 0.01,
      player2pos: 0.5,
      player2height: paddleHeight,
      player2width: 0.01,
      player2speed: 0.01,
      player1loginname: "",
      player2loginname: "",
      player1profilename:"",
      player2profilename:"",
      player1input: 0,
      player2input: 0,
      player1score: 0,
      player2score: 0,
    };
    state.ball_x_speed = state.ball_speed * Math.cos(starting_angle_radians);
    state.ball_y_speed = state.ball_speed * Math.sin(starting_angle_radians);
    return state;
  }

  removeUserIdMatch(userId: string)
  {
    this._userMatch.delete(userId);
  }

  declineInvite(userId: string){
    if (this._userMatch.has(userId)) {
        const matchId = this._userMatch.get(userId);
        const currentGamestate = this._currentMatches.get(matchId);
        currentGamestate.currentState= 'End';
        currentGamestate.stateMessage= 'User declined your invite';
        this.removeUserIdMatch(userId);
    }
  }

  // ADDED JAKA //////////////////////////////////////////////
  // I'm not sure exactly which match can be fetched like this ?? 
  isUserPlaying(loginName: string): boolean {
    const matchId = this._userMatch.get(loginName); // ???
    if (matchId)
      return true;
    return false;
  }


}
