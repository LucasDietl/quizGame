import { Game, SlidesToPlay } from "../create-game/create-game.state";

export interface GameState {
    game: Game | null;
    loading: boolean;
    slides: SlidesToPlay[];
    answers: [];
}
