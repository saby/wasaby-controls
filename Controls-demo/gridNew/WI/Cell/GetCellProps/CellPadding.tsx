import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { View as GridView } from 'Controls/grid';
import { ICellProps, IColumnConfig, IHeaderConfig } from 'Controls/gridRender';

import { CellPadding } from 'Controls-demo/gridNew/DemoHelpers/Data/CellPadding';

function getData() {
    return CellPadding.getData().slice(0, 5);
}

const columns: IColumnConfig[] = [
    {
        displayProperty: 'number',
        width: '100px',
        getCellProps(_item: Model): ICellProps {
            return {
                padding: {
                    right: 's',
                },
            };
        },
    },
    {
        displayProperty: 'country',
        width: '100px',
        getCellProps(_item: Model): ICellProps {
            return {
                padding: {
                    left: 's',
                    right: 'null',
                },
            };
        },
    },
    {
        displayProperty: 'capital',
        width: '100px',
        getCellProps(_item: Model): ICellProps {
            return {
                padding: {
                    right: 'm',
                },
            };
        },
    },
    {
        displayProperty: 'population',
        width: '100px',
        getCellProps(_item: Model): ICellProps {
            return {
                padding: {
                    left: 'l',
                    right: 'l',
                },
            };
        },
    },
    {
        displayProperty: 'square',
        width: '100px',
        getCellProps(_item: Model): ICellProps {
            return {
                padding: {
                    left: 'xl',
                },
            };
        },
    },
];

const header: IHeaderConfig[] = [
    {
        caption: 'right: S',
    },
    {
        caption: 'left: S and right: null',
    },
    {
        caption: 'left: default, right: m',
    },
    {
        caption: 'left: l, right: l',
    },
    {
        caption: 'left: xl',
    },
];

/**
 * Конфигурация горизонтальных отступов в ячейках таблицы
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <GridView
                storeId="CellPadding"
                header={header}
                rowSeparatorSize="s"
                columnSeparatorSize="s"
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
            CellPadding: {
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
