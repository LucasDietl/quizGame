import { Game, SlidesToPlay } from "../create-game/create-game.state";

export interface GameState {
    game: Game | null;
    loading: boolean;
    slides: SlidesToPlay[];
    answers: [];
    disableAnswers: boolean;
}

export interface Answers {
    userId: string;
    gameId: string;
    totalPoints: number;
    previousTotalPoints: number;
}