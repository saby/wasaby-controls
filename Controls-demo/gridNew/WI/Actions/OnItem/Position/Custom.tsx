import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { useItemData, IColumnConfig, View as GridView } from 'Controls/grid';
import { IItemAction } from 'Controls/interface';

import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { getActionsForContacts as getItemActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';
import { ActionsConnectedComponent } from 'Controls/baseList';

function getData() {
    return Countries.getData().splice(0, 1);
}

function Country(): React.ReactElement {
    const {
        renderValues: { country },
    } = useItemData(['country']);
    return (
        <div>
            <span style={{ color: '#f60' }}>{country}</span>
            <ActionsConnectedComponent />
        </div>
    );
}

const columns: IColumnConfig[] = [
    {
        displayProperty: 'number',
        width: 'max-content',
        compatibleWidth: '44px',
    },
    {
        width: '300px',
        render: <Country />,
    },
    {
        displayProperty: 'capital',
        width: '100px',
    },
    {
        displayProperty: 'population',
        width: '150px',
    },
    {
        displayProperty: 'square',
        width: '150px',
    },
    {
        displayProperty: 'populationDensity',
        width: 'max-content',
        compatibleWidth: '60px',
    },
];

const itemActions: IItemAction[] = getItemActions();

/**
 * Конфигурация таблицы с размещением операций над записью в произвольном месте строки
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <GridView
                storeId="ItemActionsCustomPosition"
                columns={columns}
                itemActions={itemActions}
                itemActionsPosition="custom"
            />
        </div>
    );
}

// Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
// используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
// https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ItemActionsCustomPosition: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
        };
    },
});
