import PositionSourceMock from './PositionSourceMock';
import { getNavigation } from './getNavigation';
import { IDataConfig } from 'Controls-DataEnv/_dataFactory/interface/IDataConfig';
import { IListDataFactoryArguments } from 'Controls/_dataFactory/List/_interface/IListDataFactoryArguments';

export const virtualScrollConfig = { pageSize: 20 };

export const wasabyListSource = new PositionSourceMock({
    keyProperty: 'key',
});

export const wasabyInitNavigation = {
    source: 'position',
    view: 'infinity',
    sourceConfig: {
        field: 'key',
        position: 0,
        direction: 'bothways',
        limit: 20,
    },
};

export const LoadConfig: Record<string, IDataConfig<IListDataFactoryArguments>> = {
    VirtualScrollLoadToDirection: {
        dataFactoryName: 'Controls/dataFactory:List',
        dataFactoryArguments: {
            displayProperty: 'title',
            source: new PositionSourceMock({
                keyProperty: 'key',
            }),
            navigation: getNavigation(0),
        },
    },
};

export const listActions = [
    {
        actionName: 'Controls-ListEnv/actions:Invert',
        storeId: 'VirtualScrollLoadToDirection',
        propStorageId: 'invertMode',
    },
];
