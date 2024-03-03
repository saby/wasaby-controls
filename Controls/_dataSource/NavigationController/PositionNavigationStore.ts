/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import INavigationStore from './interface/INavigationStore';
import { TNavigationDirection } from 'Controls/interface';

interface IPositionHasMore {
    backward: boolean;
    forward: boolean;
}

interface IPositionHasMoreCompatible {
    backward?: boolean;
    forward?: boolean;
    before?: boolean;
    after?: boolean;
}

type TPositionHasMore = IPositionHasMore;

// TODO Общие типы
type TPosition = unknown;
/**
 * Позиция, от которой нужно начинать скролл
 * Является массивом из любых типов (number, date, string и тд)
 */
type TPositionValue = unknown[];
type TField = string | string[];
type TFieldValue = string[];

export interface IPositionNavigationStoreOptions {
    field: TField;
    position: TPosition;
    direction: TNavigationDirection;
    limit: number;
}
export interface IPositionNavigationState {
    field: TField;
    position: TPosition;
    direction: TNavigationDirection;
    limit: number;
    backwardPosition: TPosition;
    forwardPosition: TPosition;
    iterative: boolean;
}
class PositionNavigationStore implements INavigationStore {
    private _field: TFieldValue;
    private _position: TPositionValue;
    private _direction: TNavigationDirection;
    private _limit: number;
    private _iterative: boolean = undefined;

    protected _backwardPosition: TPositionValue = [null];
    protected _forwardPosition: TPositionValue = [null];
    private _more: TPositionHasMore;

    constructor(cfg: IPositionNavigationStoreOptions) {
        if (cfg.field !== undefined) {
            this._field =
                cfg.field instanceof Array
                    ? (cfg.field as TFieldValue)
                    : ([cfg.field] as TFieldValue);
        } else {
            throw new Error('Option field is undefined in PositionNavigation');
        }
        if (cfg.position !== undefined) {
            this._position = cfg.position instanceof Array ? cfg.position : [cfg.position];
        } else {
            // Default value of position
            this._position = [null];
        }
        if (cfg.direction !== undefined) {
            this._direction = PositionNavigationStore.convertDirection(cfg.direction);
        } else {
            throw new Error('Option direction is undefined in PositionNavigation');
        }
        this._limit = cfg.limit;

        this._more = PositionNavigationStore._getDefaultMoreMeta();
    }

    clone(): INavigationStore {
        const cfg: IPositionNavigationStoreOptions = {
            field: this._field,
            position: this._position,
            direction: this._direction,
            limit: this._limit,
        };
        const instance = new PositionNavigationStore(cfg);
        instance._iterative = this._iterative;
        instance._backwardPosition = [...this._backwardPosition];
        instance._forwardPosition = [...this._forwardPosition];
        instance._more = { ...this._more };
        return instance;
    }

    getState(): IPositionNavigationState {
        return {
            field: this._field,
            position: this._position,
            direction: this._direction,
            limit: this._limit,
            backwardPosition: this._backwardPosition,
            forwardPosition: this._forwardPosition,
            iterative: this._iterative,
        };
    }

    setForwardPosition(value: TPosition): void {
        this._forwardPosition = value;
    }

    setBackwardPosition(value: TPosition): void {
        this._backwardPosition = value;
    }

    setLimit(limit: number): void {
        this._limit = limit;
    }

    setPosition(value: TPositionValue): void {
        this._position = value;
    }

    setIterative(iterative: boolean): void {
        this._iterative = iterative;
    }

    setMetaMore(more: IPositionHasMoreCompatible): void {
        if (more.before !== undefined) {
            this._more.backward = more.before;
        }
        if (more.backward !== undefined) {
            this._more.backward = more.backward;
        }
        if (more.after !== undefined) {
            this._more.forward = more.after;
        }
        if (more.forward !== undefined) {
            this._more.forward = more.forward;
        }
    }

    getMetaMore(): IPositionHasMore {
        return this._more;
    }

    updateMetaMoreToDirection(direction: 'forward' | 'backward', value: boolean): void {
        this._more[direction] = value;
    }

    destroy(): void {
        this._field = null;
        this._position = null;
        this._direction = null;
        this._limit = null;

        this._backwardPosition = null;
        this._forwardPosition = null;
        this._more = null;
    }

    private static _getDefaultMoreMeta(): IPositionHasMore {
        return {
            backward: false,
            forward: false,
        };
    }

    /**
     * Конвертор старых и новых названий направления.
     * TODO Необходимо убрать этот метод, когда своместимость более не понадобится
     * @param position
     */
    static convertDirection(
        position: TNavigationDirection | 'before' | 'after' | 'both'
    ): TNavigationDirection {
        const map = {
            before: 'backward',
            after: 'forward',
            both: 'bothways',
        };
        return map[position] ? map[position] : position;
    }
}

export default PositionNavigationStore;
