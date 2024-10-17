export class Lottie {
    loop: boolean;
    setDirection(direction: number): void;
    setSpeed(speed: number): void;
    play(): void;
    stop(): void;
    pause(): void;
    addEventListener(eventName: string, callback: () => any): void;
    removeEventListener(eventName: string, callback?: () => any): void;
    destroy(): void;
}
