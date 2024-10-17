/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { IRequestId, IStompEvent } from '../_interface/IExternalTypes';
import { StompEventType } from '../_interface/IExternalTypes';
import { ObservableMixin } from 'Types/entity';
import { mixin } from 'Types/util';

export class EventManager extends mixin<ObservableMixin>(ObservableMixin) {
    protected _observerId: string;
    protected _queues: Map<IRequestId, IStompEvent[]>;
    protected _errors: Map<IRequestId, Error[]>;

    constructor({ observerId }: { observerId: string }) {
        super();
        this._observerId = observerId;
        this._queues = new Map();
        this._errors = new Map();
    }

    protected _addError(error: Error, requestId: IRequestId): void {
        if (!this._errors.has(requestId)) {
            this._errors.set(requestId, []);
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const errors = this._errors.get(requestId)!;
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

    protected _flushQueue(event: IStompEvent): void {
        this._addToQueue(event);
        const { requestId } = event;
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
            this._notify('eventGroup', {
                events,
                errors,
                requestId,
            });
            this._queues.delete(requestId);
            this._errors.delete(requestId);
        }
    }

    protected _addToQueue(event: IStompEvent): void {
        if (!this._queues.has(event.requestId)) {
            this._createQueue(event.requestId);
        }
        const events = this._queues.get(event.requestId);
        if (events) {
            events.push(event);
        }
    }

    process(event: IStompEvent): void {
        if (event.observerId !== this._observerId) {
            return;
        }
        switch (event.type) {
            case StompEventType.Begin: {
                return this._createQueue(event.requestId);
            }
            case StompEventType.End: {
                return this._flushQueue(event);
            }
            default: {
                return this._addToQueue(event);
            }
        }
    }
}
