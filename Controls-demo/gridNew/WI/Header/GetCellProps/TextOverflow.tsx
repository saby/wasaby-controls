import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { IColumnConfig, IHeaderConfig, ICellProps, View as GridView } from 'Controls/grid';
import { Container as Scrollcontainer } from 'Controls/scroll';

import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

const MAXITEM = 10;

function getData() {
    return Countries.getData().slice(0, MAXITEM);
}

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
        caption: 'Столица страны из рейтинга',
        getCellProps(): ICellProps {
            return {
                textOverflow: 'ellipsis',
            };
        },
        key: 'header-capital',
    },
    {
        caption: 'Население страны по данным на 2018г.',
        getCellProps(): ICellProps {
            return {
                textOverflow: 'ellipsis',
            };
        },
        key: 'header-population',
    },
    {
        caption: 'Площадь территории км2',
        getCellProps(): ICellProps {
            return {
                textOverflow: 'ellipsis',
            };
        },
        key: 'header-square',
    },
    {
        caption: 'Плотность населения чел/км2',
        getCellProps(): ICellProps {
            return {
                textOverflow: 'ellipsis',
            };
        },
        key: 'header-populationDensity',
    },
];
const columns: IColumnConfig[] = Countries.getColumnsWithFixedWidths();

/**
 * Конфигурация таблицы с переполнением текста в шапке
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <Scrollcontainer className="controlsDemo__inline-flex">
                <GridView
                    storeId="HeaderTextOverflow"
                    columns={columns}
                    header={header}
                    className="tw-inline-flex"
                />
            </Scrollcontainer>
        </div>
    );
}

// Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
// используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
// https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            HeaderTextOverflow: {
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
