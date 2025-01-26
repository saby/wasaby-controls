import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import {
    ICellProps,
    IResultConfig,
    IHeaderConfig,
    IColumnConfig,
    View as GridView,
} from 'Controls/grid';
import { TBackgroundStyle } from 'Controls/interface';

function getData(): Record<string, string | number>[] {
    return [
        {
            key: 0,
            success: '10.1',
            link: '10.1',
            primary: '10.1',
            secondary: '10.0',
            readonly: '10',
            unaccented: '10.1',
            warning: '100000',
            danger: '1000000',
        },
        {
            key: 1,
            success: '20.5',
            link: '20',
            primary: '20.5',
            secondary: '20.5',
            readonly: '20',
            unaccented: '20',
            warning: '200000',
            danger: '2000000',
        },
    ];
}

const colors: TBackgroundStyle[] = [
    'success',
    'link',
    'primary',
    'secondary',
    'readonly',
    'unaccented',
    'warning',
    'danger',
];

const header: IHeaderConfig[] = colors.map((color: TBackgroundStyle) => {
    return {
        caption: color === 'secondary' ? 'secondary (default)' : color,
        key: `header-${color}`,
    };
});

const results: IResultConfig[] = colors.map((color: TBackgroundStyle) => {
    return {
        key: `results-${color}`,
        displayProperty: color,
        getCellProps(): ICellProps {
            return {
                fontColorStyle: color,
            };
        },
    };
});

const columns: IColumnConfig[] = colors.map((color: TBackgroundStyle) => {
    return {
        displayProperty: color,
        width: '80px',
    };
});

/**
 * Конфигурация таблицы различными цветами текста строки итогов.
 * Данные итогов получаются из мета-данных ответа источника данных.
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo__maxWidth800">
            <GridView
                storeId="ResultsFontColorStyle"
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
            ResultsFontColorStyle: {
                dataFactoryName: 'Controls-demo/gridNew/Results/FontColorStyle/CustomFactory',
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
