import { Game, SlidesToPlay } from "../create-game/create-game.state";

export interface GameState {
    game: Game;
    loading: boolean;
    slides: SlidesToPlay[];
    answers: Answers[];
    disableAnswers: boolean;
}

export interface Answers {
    id?: string; 
    userId: string;
    nickName: string;
    gameId: string;
    slideId: string;
    totalPoints: number;
    previousTotalPoints: number;
    joinedTimeStamp: number;
}