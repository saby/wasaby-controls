import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { View as GridView } from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';
import { IColumnConfig, IHeaderConfig } from 'Controls/gridRender';

import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { Model } from 'Types/entity';

function getData() {
    return Countries.getData().splice(0, 5);
}

const header: IHeaderConfig[] = [
    {
        startRow: 1,
        endRow: 3,
        startColumn: 1,
        endColumn: 2,
        caption: '#',
    },
    {
        startRow: 1,
        endRow: 3,
        startColumn: 2,
        endColumn: 3,
        caption: 'Страна',
    },
    {
        startRow: 1,
        endRow: 2,
        startColumn: 3,
        endColumn: 5,
        caption: 'Характеристики',
        getCellProps: () => {
            return {
                halign: 'center',
            };
        },
    },
    {
        startRow: 2,
        endRow: 3,
        startColumn: 3,
        endColumn: 4,
        caption: 'Население',
        getCellProps: () => {
            return {
                halign: 'center',
            };
        },
    },
    {
        startRow: 2,
        endRow: 3,
        startColumn: 4,
        endColumn: 5,
        caption: 'Площадь',
        getCellProps: () => {
            return {
                halign: 'center',
            };
        },
    },
    {
        startRow: 1,
        endRow: 3,
        startColumn: 5,
        endColumn: 6,
        caption: 'Плотность',
        getCellProps: () => {
            return {
                halign: 'center',
            };
        },
    },
];

const columns: IColumnConfig[] = [
    {
        displayProperty: 'number',
        width: '30px',
    },
    {
        displayProperty: 'country',
        width: '200px',
    },
    {
        displayProperty: 'population',
        width: '150px',
        getCellProps: (_model: Model) => {
            return {
                halign: 'center',
            };
        },
    },
    {
        displayProperty: 'square',
        width: '100px',
        getCellProps: (_model: Model) => {
            return {
                halign: 'center',
            };
        },
    },
    {
        displayProperty: 'populationDensity',
        width: '120px',
        getCellProps: (_model: Model) => {
            return {
                halign: 'center',
            };
        },
    },
];

/**
 * Конфигурация ширины в ячейках таблицы
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div ref={ref} className="controlsDemo__wrapper" style={{ minWidth: '1000px' }}>
            <ScrollContainer>
                <GridView
                    storeId="SeparatorsMultiHeader"
                    header={header}
                    columns={columns}
                    rowSeparatorSize="s"
                    columnSeparatorSize="s"
                />
            </ScrollContainer>
        </div>
    );
}

// Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
// используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
// https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            SeparatorsMultiHeader: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    multiSelectVisibility: 'visible',
                },
            },
        };
    },
});
