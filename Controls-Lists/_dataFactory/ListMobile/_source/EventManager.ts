import type {
    IAbstractStompEvent,
    IRequestId,
    IStompEvent,
    IStompEventGroupListenerCallback,
} from '../_interface/IExternalTypes';

import { IStompEventType } from '../_interface/IExternalTypes';

export class EventManager {
    protected _queues: Map<IRequestId, IStompEvent[]>;
    protected _errors: Map<IRequestId, Error[]>;

    protected _flushListeners: Map<
        IRequestId | null,
        (params: { events: IStompEvent[]; errors: Error[]; requestId: IRequestId }) => void
    >;

    constructor() {
        this._queues = new Map();
        this._errors = new Map();
        this._flushListeners = new Map();
    }

    protected _addError(error: Error, requestId: IRequestId): void {
        if (!this._errors.has(requestId)) {
            this._errors.set(requestId, []);
        }
        const errors = this._errors.get(requestId);
        errors.push(error);
    }

    protected _createQueue(requestId: IRequestId): void {
        if (this._queues.has(requestId)) {
            this._addError(
                new Error(`The queue ${JSON.stringify(requestId)} already exists`),
                requestId
            );
        }
        this._queues.set(requestId, []);
    }

    protected _flushQueue(requestId: IRequestId): void {
        const events = this._queues.get(requestId);
        const errors = this._errors.get(requestId) ?? [];
        if (!events) {
            this._addError(
                new Error(`The queue ${JSON.stringify(requestId)} doesn't exist`),
                requestId
            );
        } else if (events.length === 0) {
            this._addError(new Error(`The queue ${JSON.stringify(requestId)} is empty`), requestId);
        } else {
            this._flushListeners.forEach((callback, listenerRequestId) => {
                if (listenerRequestId === null || listenerRequestId === requestId) {
                    callback({
                        events,
                        errors,
                        requestId,
                    });
                }
            });
        }
    }

    protected _addToQueue(event: IStompEvent): void {
        if (!this._queues.has(event.requestId)) {
            this._createQueue(event.requestId);
        }
        const events = this._queues.get(event.requestId);
        events.push(event);
    }

    process(event: IAbstractStompEvent): void {
        const strictEvent = event as IStompEvent;
        switch (strictEvent.type) {
            case IStompEventType.Begin: {
                return this._createQueue(strictEvent.requestId);
            }
            case IStompEventType.End: {
                return this._flushQueue(strictEvent.requestId);
            }
            default: {
                return this._addToQueue(strictEvent);
            }
        }
    }

    onFlush(callback: IStompEventGroupListenerCallback): void {
        this._flushListeners.set(null, ({ requestId, ...other }) => {
            this._queues.delete(requestId);
            this._errors.delete(requestId);
            return callback({ requestId, ...other });
        });
    }

    destroy(): void {
        this._flushListeners.clear();
    }
}
