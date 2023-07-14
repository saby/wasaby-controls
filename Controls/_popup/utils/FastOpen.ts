/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import { SyntheticEvent } from 'Vdom/Vdom';
import { TouchDetect } from 'EnvTouch/EnvTouch';

const PRELOAD_DEPENDENCIES_HOVER_DELAY = 80;

export class DependencyTimer {
    protected _loadDependenciesTimer: number;

    start(callback: Function): void {
        this._loadDependenciesTimer = setTimeout(callback, PRELOAD_DEPENDENCIES_HOVER_DELAY) as any;
    }

    stop(): void {
        clearTimeout(this._loadDependenciesTimer);
    }
}

const CALM_DELAY: number = 80;

/**
 * Модуль, упрощающий открытие всплывающего окна через определенный промежуток времени
 * @public
 */
export class CalmTimer {
    protected _openId: number;
    protected _callback: Function;
    protected _closeId: number;

    constructor(callback?: Function) {
        this._callback = callback;
    }

    isStarted(): boolean {
        return !!this._openId;
    }

    /**
     * Выполнение callback, через опеределенный промежуток времени.
     */
    start(delay?: number): void {
        this.stop();
        if (!TouchDetect.getInstance().isTouch()) {
            const args = arguments;
            this._openId = setTimeout(() => {
                this._openId = null;
                this._callback(...args);
            }, delay || CALM_DELAY);
        } else {
            this._callback(...arguments);
        }
    }

    /**
     * Сброс timeout
     */
    stop(): void {
        if (this._openId) {
            clearTimeout(this._openId);
        }
        this._openId = null;
    }
}

export function isLeftMouseButton(event: SyntheticEvent<MouseEvent>): boolean {
    return event.nativeEvent.button === 0;
}
