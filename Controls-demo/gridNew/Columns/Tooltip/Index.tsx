import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { IColumnConfig, IHeaderConfig, View as GridView } from 'Controls/grid';

import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

function getData() {
    return Countries.getData().splice(0, 5);
}

const columns: IColumnConfig[] = [
    {
        displayProperty: 'country',
        width: '100px',
        textOverflow: 'ellipsis',
    },
    {
        displayProperty: 'capital',
        width: '100px',
        tooltipProperty: 'capital',
    },
    {
        displayProperty: 'population',
        width: '100px',
        textOverflow: 'ellipsis',
        displayType: 'number',
    },
    {
        displayProperty: 'populationDensity',
        width: '100px',
        tooltipProperty: 'populationDensity',
        displayType: 'money',
    },
];

const header: IHeaderConfig[] = [
    {
        caption: '',
    },
    {
        caption: 'Столица',
    },
    {
        caption: 'Население (человек)',
    },
    {
        caption: 'Плотность (человек/км²)',
    },
];

/**
 * Конфигурация всплывающей подсказки в ячейках таблицы
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <GridView
                className="controlsDemo__inline-flex"
                storeId="ColumnsTooltip"
                header={header}
                columns={columns}
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
            ColumnsTooltip: {
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
