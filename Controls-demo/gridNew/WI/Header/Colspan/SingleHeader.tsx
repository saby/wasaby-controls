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
        caption: '#',
        startColumn: 1,
        endColumn: 2,
        key: 'header-num',
    },
    {
        caption: 'Географические данные',
        startColumn: 2,
        endColumn: 4,
        getCellProps(): ICellProps {
            return {
                halign: 'center',
            };
        },
        key: 'header-geo',
    },
    {
        caption: 'Цифры',
        startColumn: 4,
        endColumn: 7,
        getCellProps(): ICellProps {
            return {
                halign: 'center',
            };
        },
        key: 'header-numbers',
    },
];

/**
 * Конфигурация таблицы с объединением ячеек шапки
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <GridView storeId="HeaderUnion" columns={columns} header={header} />
        </div>
    );
}

// Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
// используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
// https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            HeaderUnion: {
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
