import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { ICellProps, IHeaderConfig, IColumnConfig, View as GridView } from 'Controls/grid';

import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

const header: IHeaderConfig[] = [
    {
        caption: '#',
        key: 'header-num',
    },
    {
        caption: 'Страна',
        key: 'header-country',
    },
    {
        caption: 'Название столицы страны',
        sortingProperty: 'capital',
        getCellProps(): ICellProps {
            return {
                halign: 'left',
            };
        },
        key: 'header-capital',
    },
    {
        caption: 'Население',
        sortingProperty: 'population',
        getCellProps(): ICellProps {
            return {
                halign: 'left',
            };
        },
        key: 'header-population',
    },
    {
        caption: 'Площадь км2',
        sortingProperty: 'square',
        getCellProps(): ICellProps {
            return {
                halign: 'right',
            };
        },
        key: 'header-square',
    },
    {
        caption: 'Плотность населения чел/км2',
        sortingProperty: 'populationDensity',
        getCellProps(): ICellProps {
            return {
                halign: 'right',
            };
        },
        key: 'header-populationDensity',
    },
];

const columns: IColumnConfig[] = [
    {
        displayProperty: 'number',
        width: '40px',
    },
    {
        displayProperty: 'country',
        width: '280px',
    },
    {
        displayProperty: 'capital',
        width: '130px',
    },
    {
        displayProperty: 'population',
        width: '100px',
    },
    {
        displayProperty: 'square',
        width: '100px',
        getCellProps(): ICellProps {
            return {
                halign: 'right',
            };
        },
    },
    {
        displayProperty: 'populationDensity',
        width: '150px',
        getCellProps(): ICellProps {
            return {
                halign: 'right',
            };
        },
    },
];

/**
 * Конфигурация таблицы с кнопкой сортировки в шапке таблицы
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <GridView
                storeId="SortingButton"
                header={header}
                columns={columns}
                className="tw-inline-flex"
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
            SortingButton: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: Countries.getData(),
                    }),
                    sorting: [],
                },
            },
        };
    },
});
