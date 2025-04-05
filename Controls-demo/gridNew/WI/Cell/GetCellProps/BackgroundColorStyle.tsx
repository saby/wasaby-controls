import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { View as GridView } from 'Controls/grid';
import { ICellProps, IColumnConfig } from 'Controls/gridRender';

import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

function getData() {
    return Countries.getData().slice(0, 5);
}

const columns: IColumnConfig[] = [
    { displayProperty: 'number' },
    { displayProperty: 'country' },
    { displayProperty: 'capital' },
    { displayProperty: 'population' },
    { displayProperty: 'square' },
    {
        displayProperty: 'populationDensity',
        getCellProps(item: Model): ICellProps {
            const populationDensity = item.get('populationDensity');
            return {
                backgroundColorStyle:
                    populationDensity > 100
                        ? 'danger'
                        : populationDensity < 10
                        ? 'warning'
                        : 'success',
            };
        },
    },
];

/**
 * Конфигурация фона в ячейках таблицы
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <GridView storeId="BackgroundColorStyle" columns={columns} />
        </div>
    );
}

// Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
// используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
// https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            BackgroundColorStyle: {
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
