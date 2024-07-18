import type { IListMobileSourceParams } from '../_interface/IListMobileSourceParams';

import { Rpc, DataSet } from 'Types/source';
import { IRpcCommandMethod, ExternalCollectionItemKeys } from '../_interface/IExternalTypes';

class ObservableSource extends Rpc {}

const provider = 'Types/source:provider.SbisBusinessLogic';

const DJINNI_ENDPOINT = {
    address: '/MainService/service/',
    contract: 'DjinniRpcSupport',
};

export class ListMobileSource extends Rpc {
    protected _observableSource: Rpc;
    protected _djinniSource: Rpc;

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
        });
        this._djinniSource = new ObservableSource({
            endpoint: DJINNI_ENDPOINT,
            provider,
        });
    }

    call(command: string, data?: object): Promise<DataSet> {
        switch (command) {
            case IRpcCommandMethod.GET:
                return super.call(command, data);
            case IRpcCommandMethod.KEEP_ALIVE:
                return this._djinniSource.call(command, data);
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
