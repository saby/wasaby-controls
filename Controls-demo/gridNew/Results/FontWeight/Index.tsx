import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import {
    IResultConfig,
    IHeaderConfig,
    IColumnConfig,
    ICellProps,
    View as GridView,
} from 'Controls/grid';

import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

function getData() {
    return Countries.getData().splice(0, 5);
}

const header: IHeaderConfig[] = [
    { caption: '#', key: 'header-number' },
    { caption: 'Страна', key: 'header-country' },
    { caption: 'Население', key: 'header-population' },
    { caption: 'Площадь км2', key: 'header-square' },
];

const results: IResultConfig[] = [
    { key: 'results-number' },
    { key: 'results-country' },
    { key: 'results-population' },
    {
        key: 'results-square',
        displayProperty: 'square',
        getCellProps(): ICellProps {
            return {
                fontWeight: 'default',
            };
        },
    },
];

const columns: IColumnConfig[] = [
    {
        displayProperty: 'number',
        width: '40px',
    },
    {
        displayProperty: 'country',
        width: '300px',
    },
    {
        displayProperty: 'population',
        width: 'max-content',
        compatibleWidth: '118px',
    },
    {
        displayProperty: 'square',
        width: 'max-content',
    },
];

/**
 * Конфигурация таблицы различной насыщенностью текста строки итогов.
 * Данные итогов получаются из мета-данных ответа источника данных.
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo__maxWidth800">
            <GridView
                storeId="ResultsFontWeight"
                header={header}
                columns={columns}
                results={results}
                resultsPosition="top"
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
            ResultsFontWeight: {
                dataFactoryName: 'Controls-demo/gridNew/Results/FontWeight/CustomFactory',
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
