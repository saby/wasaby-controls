import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { IHeaderConfig, IColumnConfig, ICellProps, View as GridView } from 'Controls/grid';

import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

function getData() {
    return Countries.getData().splice(0, 5);
}

const columns: IColumnConfig[] = [
    { displayProperty: 'number', width: '40px' },
    { displayProperty: 'country', width: '300px' },
    { displayProperty: 'capital', width: 'max-content' },
    { displayProperty: 'population', width: 'max-content' },
    { displayProperty: 'square', width: 'max-content' },
    { displayProperty: 'populationDensity', width: 'max-content' },
];

const header: IHeaderConfig[] = [
    {
        caption: 'Географические характеристики стран',
        startRow: 1,
        endRow: 3,
        startColumn: 1,
        endColumn: 2,
        key: 'header-geo',
    },
    {
        caption: 'Столица',
        startRow: 1,
        endRow: 3,
        startColumn: 2,
        endColumn: 3,
        key: 'header-capital',
    },
    {
        caption: 'Цифры',
        startRow: 1,
        endRow: 2,
        startColumn: 3,
        endColumn: 6,
        getCellProps(): ICellProps {
            return {
                halign: 'center',
            };
        },
        key: 'header-numbers',
    },
    {
        caption: 'Население',
        startRow: 2,
        endRow: 3,
        startColumn: 3,
        endColumn: 4,
        key: 'header-population',
    },
    {
        caption: 'Площадь км2',
        startRow: 2,
        endRow: 3,
        startColumn: 4,
        endColumn: 5,
        key: 'header-square',
    },
    {
        caption: 'Плотность населения чел/км2',
        startRow: 2,
        endRow: 3,
        startColumn: 5,
        endColumn: 6,
        key: 'header-populationDensity',
    },
];

/**
 * Конфигурация таблицы с объединением ячеек многострочной шапки
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <GridView storeId="MultiheaderBase" columns={columns} header={header} />
        </div>
    );
}

// Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
// используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
// https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            MultiheaderBase: {
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
