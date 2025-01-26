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

/**
 * Конфигурация горизонтального выравнивания контента в ячейках таблицы
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    const columns: IColumnConfig[] = React.useMemo(() => {
        return [
            {
                displayProperty: 'number',
                width: '40px',
                getCellProps(_item: Model): ICellProps {
                    return {
                        halign: 'right',
                    };
                },
            },
            {
                displayProperty: 'country',
                width: '300px',
                getCellProps(_item: Model): ICellProps {
                    return {
                        halign: 'center',
                    };
                },
            },
            {
                displayProperty: 'capital',
                width: '1fr',
                getCellProps(_item: Model): ICellProps {
                    return {
                        halign: 'left',
                    };
                },
            },
            {
                displayProperty: 'population',
                width: '150px',
                getCellProps(_item: Model): ICellProps {
                    return {
                        halign: 'right',
                    };
                },
            },
            {
                displayProperty: 'square',
                width: '150px',
                getCellProps(_item: Model): ICellProps {
                    return {
                        halign: 'left',
                    };
                },
            },
            {
                displayProperty: 'populationDensity',
                width: 'max-content',
                compatibleWidth: '60px',
            },
        ] as IColumnConfig[];
    }, []);

    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <GridView
                storeId="ColumnsAlign"
                columns={columns}
                rowSeparatorSize="s"
                columnSeparatorSize="s"
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
            ColumnsAlign: {
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
