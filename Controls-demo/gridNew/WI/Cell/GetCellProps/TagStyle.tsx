import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Model } from 'Types/entity';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { View as GridView } from 'Controls/grid';
import { ICellProps, IColumnConfig } from 'Controls/gridRender';

import { TagStyle } from 'Controls-demo/gridNew/DemoHelpers/Data/TagStyle';

const { getData } = TagStyle;

const columns: IColumnConfig[] = [
    {
        displayProperty: 'number',
        width: '40px',
    },
    {
        displayProperty: 'country',
        width: '200px',
    },
    {
        displayProperty: 'population',
        width: '150px',
        getCellProps(item: Model): ICellProps {
            return {
                halign: 'right',
                tagStyle: item.get('tagStyle'),
            };
        },
    },
];

/**
 * Конфигурация курсора в ячейках таблицы
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    const [log, setLog] = React.useState<string>('');
    // Эти хандлеры срабатывают при клике на Tag в списке
    const onTagClickCustomHandler = React.useCallback(
        (item: Model, columnIndex: number, _nativeEvent: Event): void => {
            setLog(
                `click на теге в колонке №' ${columnIndex} со значением + ${item.get('population')}`
            );
        },
        [setLog]
    );

    // Эти хандлеры срабатывают при наведении на Tag в списке
    const onTagHoverCustomHandler = React.useCallback(
        (item: Model, columnIndex: number, _nativeEvent: Event): void => {
            setLog(
                `hover на теге в колонке №' ${columnIndex} со значением + ${item.get('population')}`
            );
        },
        [setLog]
    );

    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <div className=" controlsDemo__grid-tagStyleProperty controlsDemo__maxWidth800">
                <GridView
                    storeId="TagStyleFromCellData0"
                    columns={columns}
                    onTagClick={onTagClickCustomHandler}
                    onTagHover={onTagHoverCustomHandler}
                />
                <div className="controlsDemo-toolbar-panel">{log}</div>
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
            TagStyleFromCellData0: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    multiSelectVisibility: 'hidden',
                },
            },
        };
    },
});
