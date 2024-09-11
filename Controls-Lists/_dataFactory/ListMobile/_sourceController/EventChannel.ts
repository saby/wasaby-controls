import type { Record } from 'Types/entity';
import { ObservableMixin } from 'Types/entity';

import { Server } from 'Browser/Event';
import { mixin } from 'Types/util';
import { StompEventType } from '../_interface/IExternalTypes';

const SUBSCRIBE_TIMEOUT = 1000;

export class EventChannel extends mixin<ObservableMixin>(ObservableMixin) {
    protected _connections: {
        eventType: StompEventType;
        resource: { dispose(owner: unknown): void };
    }[];

    constructor() {
        super();
        this._connections = [];
    }

    async connect(): Promise<void> {
        const promises: Promise<void>[] = [];
        for (const eventType of Object.values(StompEventType)) {
            const subscribe = () =>
                new Promise<void>((resolve) => {
                    const channel = Server.serverChannel(eventType);
                    channel.once(
                        'onready',
                        () => {
                            const resource = channel.getResource(
                                'onmessage',
                                (_: unknown, event: Record) =>
                                    this._notify('event', {
                                        type: eventType,
                                        args: event.get('data'),
                                        observerId: event.get('id'),
                                        requestId: event.get('requestId'),
                                    })
                            );
                            resource.enter(this);

                            this._connections.push({ eventType, resource });
                            resolve();
                        },
                        undefined,
                        async () => {
                            await subscribe();
                            resolve();
                        },
                        SUBSCRIBE_TIMEOUT
                    );
                });

            promises.push(subscribe());
        }

        await Promise.all(promises);
    }

    destroy(): void {
        for (const { eventType, resource } of this._connections) {
            resource.dispose(this);
            Server.serverChannel.close(eventType);
        }
        super.destroy();
    }
}
