import PageGuidSingleton from './PageGuidSingleton';
import { Logger } from 'UI/Utils';

type TKeepAliveControllerProps = {
    dispatchCallback: (pageId: string) => void;
    intervalDurationMs?: number;
};

// TODO: Прописать ошибки
const ERRORS = {
    ALREADY_STARTED: '"KeepAlive" dispatching already started!',
};

const DEFAULT_INTERVAL_MS = 10 * 1000;

export class KeepAliveController {
    private readonly props: TKeepAliveControllerProps;
    private _dispatchingIntervalId?: number;

    constructor({
        dispatchCallback,
        intervalDurationMs = DEFAULT_INTERVAL_MS,
    }: TKeepAliveControllerProps) {
        this.props = {
            intervalDurationMs,
            dispatchCallback,
        };
    }

    start() {
        if (this._hasInterval()) {
            Logger.error(ERRORS.ALREADY_STARTED);
            return;
        }

        this._dispatchingIntervalId = setInterval(() => {
            const id = PageGuidSingleton.getInstance().getGUID();
            this.props.dispatchCallback(id);
        }, this.props.intervalDurationMs);
    }

    stop() {
        if (!this._hasInterval()) {
            return;
        }

        clearInterval(this._dispatchingIntervalId);
        PageGuidSingleton.getInstance().refreshGUID()
        this._dispatchingIntervalId = undefined;
    }

    destroy() {
        this.stop();
    }

    private _hasInterval(): boolean {
        return typeof this._dispatchingIntervalId === 'number';
    }
}
