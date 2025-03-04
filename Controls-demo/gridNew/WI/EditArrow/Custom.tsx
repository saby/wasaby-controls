import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { useItemData, IColumnConfig, EditArrowComponent, View as GridView } from 'Controls/grid';

import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

function getData() {
    return Countries.getData().splice(0, 1);
}

function NumberCountry(): React.ReactElement {
    const {
        renderValues: { number, country },
    } = useItemData(['number', 'country']);
    return (
        <div className="tw-w-full tw-flex tw-items-baseline">
            <div className="tw-overflow-hidden tw-text-ellipsis tw-text-nowrap">
                <div className="controls-fontsize-2xl">{country}</div>
                <div className="controls-text-label controls-fontsize-2xs">#{number}</div>
            </div>
            <EditArrowComponent />
        </div>
    );
}

const columns: IColumnConfig[] = [
    {
        width: 'max-content',
        render: <NumberCountry />,
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
    },
];

/**
 * Конфигурация таблицы с размещением кнопки с шевроном редактирования в произвольном месте строки
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <GridView storeId="EditArrowCustomPosition" columns={columns} showEditArrow={true} />
        </div>
    );
}

// Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
// используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
// https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            EditArrowCustomPosition: {
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
