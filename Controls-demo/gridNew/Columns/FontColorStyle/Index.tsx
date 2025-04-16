import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { ICellProps, IColumnConfig, View as GridView } from 'Controls/grid';

import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

function getData() {
    return Countries.getData().splice(0, 5);
}

/**
 * Конфигурация таблицы с различными цветами шрифта
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    const columns: IColumnConfig[] = React.useMemo(() => {
        return [
            {
                displayProperty: 'country',
                getCellProps(_item: Model): ICellProps {
                    return {
                        fontColorStyle: 'primary',
                    };
                },
            },
            {
                displayProperty: 'population',
                displayType: 'number',
                getCellProps(_item: Model): ICellProps {
                    return {
                        fontColorStyle: 'secondary',
                    };
                },
            },
            {
                displayProperty: 'populationDensity',
                displayType: 'money',
                getCellProps(_item: Model): ICellProps {
                    return {
                        fontColorStyle: 'warning',
                    };
                },
            },
            {
                displayProperty: 'date',
                displayType: 'date',
                displayTypeOptions: {
                    format: "DD MMM'YY HH:mm",
                },
                getCellProps(_item: Model): ICellProps {
                    return {
                        fontColorStyle: 'warning',
                    };
                },
            },
        ] as IColumnConfig[];
    }, []);

    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo__flexRow">
            <div className="controlsDemo__cell">
                <GridView
                    storeId="ColumnsFontColorStyle"
                    columns={columns}
                    className="tw-inline-flex"
                />
            </div>
        </div>
    );
}

// Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
// используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
// https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ColumnsFontColorStyle: {
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
