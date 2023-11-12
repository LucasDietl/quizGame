export interface CreateGameState {
    games: Game[];
    slides: SlidesToPlay[];
}

export interface Game {
    id: string;
    title: string;
    slides: string[];
    ownerId: string;
    answers: string[];
}
export enum GameStatus {
    standBy = 'standBy',
    finished = 'finished',
    inProgress = 'inProgress',
}
export enum SlideType {
    quiz = 'quiz',
    aOrB = 'aOrB',
    answer = 'answer',
    results = 'results',
}
export interface SlidesToCreate  {
    gameId: string;
    type: SlideType;
    title: string;
    order: number;
    description?: string;
    points?: number;
    seconds?: number;
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

export interface GameTimeAndStatus {
    timeStamp: number;
    status: GameStatus | null;
    currentSlideId: string;
}