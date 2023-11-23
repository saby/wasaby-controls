import type { IStompEventGroupListenerCallback } from '../_interface/IExternalTypes';
import type { IListMobileSourceParams } from '../_interface/IListMobileSourceParams';

import { Rpc, DataSet } from 'Types/source';
import { IRpcCommandMethod } from '../_interface/IExternalTypes';
import { EventManager } from './EventManager';
import { EventChannel } from './EventChannel';

class ObservableSource extends Rpc {}

const provider = 'Types/source:provider.SbisBusinessLogic';

export class ListMobileSource extends Rpc {
    protected _observableSource: Rpc;
    protected _eventManager: EventManager;
    protected _eventChannel: EventChannel;

    constructor({ collectionEndpoint, observerEndpoint, keyProperty }: IListMobileSourceParams) {
        super({
            endpoint: {
                address: collectionEndpoint.address,
                contract: collectionEndpoint.contract,
            },
            keyProperty,
            provider,
        });
        this._observableSource = new ObservableSource({
            endpoint: {
                address: observerEndpoint.address,
                contract: observerEndpoint.contract,
            },
            keyProperty,
            provider,
        });

        this._eventManager = new EventManager();
        this._eventChannel = new EventChannel();
        this._eventChannel.onEvent((event) => {
            this._eventManager.process(event);
        });
    }

    call(command: string, data?: object): Promise<DataSet> {
        switch (command) {
            case IRpcCommandMethod.NEXT:
            case IRpcCommandMethod.PREV:
            case IRpcCommandMethod.DISPOSE:
            case IRpcCommandMethod.SET_OBSERVER:
            case IRpcCommandMethod.CHANGE_ROOT:
            case IRpcCommandMethod.REFRESH:
                return this._observableSource.call(command, data);
            default:
                return super.call(command, data);
        }
    }

    async connect(): Promise<void> {
        await this._eventChannel.connect();
    }

    async disconnect(): Promise<void> {
        await this._eventChannel.disconnect();
    }

    onReceiveEventGroup(callback: IStompEventGroupListenerCallback): void {
        this._eventManager.onFlush(callback);
    }

    async query(): Promise<DataSet> {
        return new DataSet({
            rawData: [],
            keyProperty: this.getKeyProperty(),
        });
    }
}
