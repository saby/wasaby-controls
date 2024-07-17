import { adapter } from 'Types/entity';
import type { IListMobileSourceParams } from '../_interface/IListMobileSourceParams';

import { DataSet, Rpc } from 'Types/source';
import { ExternalCollectionItemKeys, RpcCommandMethod } from '../_interface/IExternalTypes';

class ObservableSource extends Rpc {}

const provider = 'Types/source:provider.SbisBusinessLogic';

export class ListMobileSource extends Rpc {
    protected _observableSource: Rpc;

    constructor({ collectionEndpoint, observerEndpoint }: IListMobileSourceParams) {
        super({
            endpoint: {
                address: collectionEndpoint.address,
                contract: collectionEndpoint.contract,
            },
            keyProperty: ExternalCollectionItemKeys.ident,
            provider,
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
