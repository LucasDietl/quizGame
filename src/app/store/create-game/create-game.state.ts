export interface CreateGameState {
    games: Game[];
    slides: SlidesToPlay[];
}

export interface Game {
    id: string;
    title: string;
    slides: string[];
    ownerId: string;
    status: GameStatus;
    answers: string[];
    currentSlide: string;
}
export enum GameStatus {
    standBy = 'standBy',
    finished = 'finished',
    inProgress = 'inProgress',
}
export enum SlideType {
    quiz = 'quiz',
    aOrB = 'aOrB',
    results = 'results',
}
export interface SlidesToCreate  {
    gameId: string;
    type: SlideType;
    title: string;
    points?: number;
    seconds?: number;
    order: number;
    imageUrl?: string;
    options?: SlideOptions[]
}

export interface SlidesToPlay extends SlidesToCreate {
    id: string;
}

export interface SlideOptions {
    title: string;
    isCorrect: boolean;
}