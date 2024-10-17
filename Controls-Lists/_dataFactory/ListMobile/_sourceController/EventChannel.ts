import { ObservableMixin } from 'Types/entity';
import { Server } from 'Browser/Event';
import { mixin } from 'Types/util';
import { IStompEventListener, StompEventName } from '../_interface/IExternalTypes';

const SUBSCRIBE_TIMEOUT = 1000;

export class EventChannel extends mixin<ObservableMixin>(ObservableMixin) {
    protected _connections: {
        eventType: typeof StompEventName;
        resource: { dispose(owner: unknown): void };
    }[];

    constructor() {
        super();
        this._connections = [];
    }

    async connect(): Promise<void> {
        const promises: Promise<void>[] = [];
        const eventType = StompEventName;
        const subscribe = () =>
            new Promise<void>((resolve) => {
                const channel = Server.serverChannel(eventType);
                channel.once(
                    'onready',
                    () => {
                        const handler: IStompEventListener = (_, event) => {
                            this._notify('event', event);
                        };
                        const resource = channel.getResource('onmessage', handler);
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
