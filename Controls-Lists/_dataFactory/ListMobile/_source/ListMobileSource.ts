/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { adapter } from 'Types/entity';
import type { IListMobileSourceParams } from '../_interface/IListMobileSourceParams';

import { DataSet, Rpc } from 'Types/source';
import { ExternalCollectionItemKeys, RpcCommandMethod } from '../_interface/IExternalTypes';

class ObservableSource extends Rpc {}

const provider = 'Types/source:provider.SbisBusinessLogic';

export class ListMobileSource extends Rpc {
    protected _collectionStorage: Rpc;
    protected _observableSource: Rpc;

    constructor({
        collectionEndpoint,
        observerEndpoint,
        collectionStorageEndpoint,
    }: IListMobileSourceParams) {
        super({
            endpoint: {
                address: collectionEndpoint.address,
                contract: collectionEndpoint.contract,
            },
            keyProperty: ExternalCollectionItemKeys.ident,
            provider,
            adapter: new adapter.Sbis(),
        });
        this._collectionStorage = new ObservableSource({
            endpoint: {
                address: collectionStorageEndpoint.address,
                contract: collectionStorageEndpoint.contract,
            },
            keyProperty: ExternalCollectionItemKeys.ident,
            provider,
            adapter: new adapter.Sbis(),
        });

        this._observableSource = new ObservableSource({
            endpoint: {
                address: observerEndpoint.address,
                contract: observerEndpoint.contract,
            },
            keyProperty: ExternalCollectionItemKeys.ident,
            provider,
            adapter: new adapter.Sbis(),
        });
    }

    call(command: string, data?: object): Promise<DataSet> {
        switch (command) {
            case RpcCommandMethod.INSTANCE:
                return this._collectionStorage.call(command, data);
            case RpcCommandMethod.GET_STORAGE:
                return this._collectionStorage.call('Get', data);
            case RpcCommandMethod.PREV_DISPLAY:
                return super.call('Prev', data);
            case RpcCommandMethod.NEXT_DISPLAY:
                return super.call('Next', data);
            case RpcCommandMethod.MOVE:
            case RpcCommandMethod.GET:
                return super.call(command, data);
            default:
                return this._observableSource.call(command, data);
        }
    }

    async query(): Promise<DataSet> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new DataSet<any>({
            rawData: [],
            keyProperty: this.getKeyProperty(),
        });
    }
}
