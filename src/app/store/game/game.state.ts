import { Game, GameStatus, SlidesToPlay } from "../create-game/create-game.state";

export interface GameState {
    game: Game;
    loading: boolean;
    slides: SlidesToPlay[];
    answers: Answers[];
    disableAnswers: boolean;
    currentSlideId: string;
    status: GameStatus | null;
    timeStamp: number;
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