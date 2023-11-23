import type { IStompEventListener } from '../_interface/IExternalTypes';

import { Server } from 'Browser/Event';
import { IStompEventType } from '../_interface/IExternalTypes';
import { parseEventArgs } from './utils/parseEventArgs';

const SUBSCRIBE_TIMEOUT = 1000;

export class EventChannel {
    protected _onEvent: IStompEventListener;
    protected _connections: {
        eventType: IStompEventType;
        resource: { dispose(owner: unknown): void };
    }[];

    constructor() {
        this._onEvent = () => {};
        this._connections = [];
    }

    onEvent(callback: IStompEventListener): void {
        this._onEvent = callback;
    }

    async connect(): Promise<void> {
        const promises: Promise<void>[] = [];
        for (const eventType of Object.values(IStompEventType)) {
            const subscribe = () =>
                new Promise<void>((resolve) => {
                    const channel = Server.serverChannel(eventType);
                    channel.once(
                        'onready',
                        () => {
                            const resource = channel.getResource(
                                'onmessage',
                                (_: unknown, rawArgs: unknown[]) => {
                                    this._onEvent(parseEventArgs(eventType, rawArgs));
                                }
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

    async disconnect(): Promise<void> {
        for (const { eventType, resource } of this._connections) {
            resource.dispose(this);
            Server.serverChannel.close(eventType);
        }
    }
}
