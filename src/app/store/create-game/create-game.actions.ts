import { createAction, props } from '@ngrx/store';
import { Game, SlidesToPlay } from './create-game.state';

export const getCurrentGamesOwned = createAction('[Create Game] Get current games');
export const getCurrentGameOwnedSuccess = createAction('[Create Game] Get current games Success', props<{games: Game[]}>());

export const getSlidesByGameId = createAction('[Create Game] Get slides by game id', props<{id: string}>());
export const getSlidesByGameIdSuccess = createAction('[Create Game] Get slides by game id Success', props<{slides: SlidesToPlay[]}>());
