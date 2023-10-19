export interface CreateGameState {
    games: Game[];
    slides: SlidesToPlay[];
}

export interface Game {
    id: string;
    title: string;
    slides: [];
    ownerId: string;
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