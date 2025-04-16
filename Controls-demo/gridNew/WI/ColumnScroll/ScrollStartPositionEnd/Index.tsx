import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Memory } from 'Types/source';
import { useSlice } from 'Controls-DataEnv/context';
import { IDataConfig, IListDataFactoryArguments, ListSlice } from 'Controls/dataFactory';
import { IHeaderConfig, IColumnConfig, View as GridView } from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';
import { Button } from 'Controls/buttons';

import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import 'css!Controls-demo/gridNew/WI/ColumnScroll/ScrollStartPositionEnd/ScrollStartPositionEnd';

const { getData } = Countries;

const columns: IColumnConfig[] = [
    {
        displayProperty: 'number',
        width: '40px',
    },
    {
        displayProperty: 'country',
        width: '300px',
    },
    {
        displayProperty: 'capital',
        width: 'max-content',
    },
    {
        displayProperty: 'population',
        width: 'max-content',
    },
    {
        displayProperty: 'square',
        width: 'max-content',
    },
    {
        displayProperty: 'populationDensity',
        width: 'max-content',
    },
];

const header: IHeaderConfig[] = Countries.getHeader();

/**
 * Конфигурация таблицы с горизонтальным скроллом, проскролленой к последней колонке
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    const slice = useSlice('ColumnScrollScrollStartPositionEnd') as ListSlice;
    const items = slice.state.items;
    const onClickAdd = React.useCallback(() => {
        const newItem = items.at(0).clone();
        newItem.set({
            key: 999,
            number: 999,
            country: 'Южная Африканская Республика',
            capital: 'Претория, Кейптаун, Блумфонтейн',
            population: 54956900,
            square: 1219912,
            populationDensity: 41,
        });
        items.add(newItem);
    }, [items]);

    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <Button onClick={onClickAdd} caption="Добавить длинную запись" />
            <ScrollContainer className="Controls-demo__gridNew_ColumnScroll_Base" shadowMode="js">
                <GridView
                    storeId="ColumnScrollScrollStartPositionEnd"
                    columns={columns}
                    columnScroll={true}
                    backgroundStyle="default"
                    header={header}
                    stickyColumnsCount={2}
                    columnScrollStartPosition="end"
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
            ColumnScrollScrollStartPositionEnd: {
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
