/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { AbstractListActionCreators } from 'Controls-DataEnv/abstractList';

import * as rpcEvents from './creators/rpcEvents';
import * as rpcWorker from './creators/rpcWorker';
import * as root from './creators/root';

export const ListMobileActionCreators = {
    ...AbstractListActionCreators,

    root: {
        ...AbstractListActionCreators.root,
        ...root,
    },
    rpcEvents,
    rpcWorker,
};
