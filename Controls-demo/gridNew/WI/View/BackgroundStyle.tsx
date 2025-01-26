import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { IHeaderConfig, IColumnConfig, View as GridView } from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';

import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import 'css!Controls-demo/gridNew/WI/View/View';

const { getData } = Countries;

const header: IHeaderConfig[] = [
    { caption: '#', key: 'header-number' },
    { caption: 'Страна', key: 'header-country' },
    { caption: 'Столица', key: 'header-capital' },
    { caption: 'Население', key: 'header-population' },
    { caption: 'Площадь км2', key: 'header-square' },
    { caption: 'Плотность населения чел/км2', key: 'header-populationDensity' },
];

const columns: IColumnConfig[] = [
    {
        displayProperty: 'number',
        width: 'max-content',
    },
    {
        displayProperty: 'country',
        width: '300px',
    },
    {
        displayProperty: 'capital',
        width: '100px',
    },
    {
        displayProperty: 'population',
        width: '150px',
    },
    {
        displayProperty: 'square',
        width: '150px',
    },
    {
        displayProperty: 'populationDensity',
        width: 'max-content',
    },
];

/**
 * Конфигурация таблицы с настройкой фона залипающих элементов
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <ScrollContainer className="Controls-demo__gridNew_View_BackgroundStyle">
                <GridView
                    storeId="BackgroundStyle"
                    columns={columns}
                    header={header}
                    backgroundStyle="success"
                    className="tw-inline-flex"
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
            BackgroundStyle: {
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
