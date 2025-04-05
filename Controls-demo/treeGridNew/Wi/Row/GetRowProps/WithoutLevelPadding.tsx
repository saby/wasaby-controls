import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Model } from 'Types/entity';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { View as TreeGridView, IRowProps } from 'Controls/treeGrid';
import { IColumnConfig, useItemData } from 'Controls/grid';

import { Money as MoneyDecorator } from 'Controls/baseDecorator';
import ExpandedSource from 'Controls-demo/treeGridNew/DemoHelpers/ExpandedSource';

function MoneyColumnTemplate() {
    const {
        renderValues: { sum },
    } = useItemData(['sum']);
    return <MoneyDecorator value={sum} useGrouping={true} />;
}

function getData() {
    return [
        {
            key: 1,
            title: 'Начисления',
            sum: 526850,
            type: true,
            parent: null,
        },
        {
            key: 11,
            title: 'Премия',
            sum: 185600,
            type: true,
            parent: 1,
        },
        {
            key: 12,
            title: 'Доплата',
            sum: 150850,
            type: true,
            parent: 1,
        },
        {
            key: 121,
            title: 'За ночное время',
            sum: 100850,
            type: null,
            parent: 12,
        },
        {
            key: 122,
            title: 'За работу в праздники',
            sum: 15870,
            type: null,
            parent: 12,
        },
        {
            key: 123,
            title: 'За работу в выходные',
            sum: 17850,
            type: null,
            parent: 12,
        },
        {
            key: 124,
            title: 'За сверхурочные',
            sum: 10850,
            type: null,
            parent: 12,
        },
        {
            key: 13,
            title: 'Прочее начисление',
            sum: 285200,
            type: true,
            parent: 1,
        },
        {
            key: 14,
            title: 'Оплата по среднему',
            sum: 105200,
            type: true,
            parent: 1,
        },
        {
            key: 15,
            title: 'Мат. помощь',
            sum: 285200,
            type: true,
            parent: 1,
        },
        {
            key: 16,
            title: 'Подарки',
            sum: 285200,
            type: true,
            parent: 1,
        },
        {
            key: 2,
            title: 'Удержания',
            sum: 95200,
            type: true,
            parent: null,
        },
        {
            key: 21,
            title: 'По исп. листу',
            sum: 17600,
            type: true,
            parent: 2,
        },
        {
            key: 22,
            title: 'Удержание займа',
            sum: 45200,
            type: true,
            parent: 2,
        },
        {
            key: 23,
            title: 'Прочее удержание',
            sum: 32400,
            type: true,
            parent: 2,
        },
        {
            key: 3,
            title: 'Прочее',
            sum: 75200,
            type: true,
            parent: null,
        },
        {
            key: 31,
            title: 'Аналитика НДФЛ',
            sum: 32400,
            type: true,
            parent: 3,
        },
        {
            key: 32,
            title: 'Аналитика',
            sum: 5200,
            type: true,
            parent: 3,
        },
        {
            key: 33,
            title: 'Аналитика НДФЛ обл...',
            sum: 25200,
            type: true,
            parent: 3,
        },
    ];
}

const columns: IColumnConfig[] = [
    {
        displayProperty: 'title',
        width: '215px',
    },
    {
        displayProperty: 'sum',
        render: <MoneyColumnTemplate />,
        width: '80px',
    },
];

function getRowProps(item: Model): IRowProps {
    // Принудительно скрываем иконку expander для узлов первого уровня
    return {
        withoutLevelPadding: true,
        expanderIcon: item.get('parent') === null ? 'none' : undefined,
    };
}

/**
 * Конфигурация строк иерархической таблицы
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo_fixedWidth300 controlsDemo_treeGrid-offset-withoutLevelPadding"
        >
            <TreeGridView
                storeId="OffsetsWithoutLevelPadding0"
                columns={columns}
                getRowProps={getRowProps}
            ></TreeGridView>
        </div>
    );
}

// Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
// используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
// https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            OffsetsWithoutLevelPadding0: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        keyProperty: 'key',
                        data: getData(),
                        parentProperty: 'parent',
                    }),
                    expandedItems: [1, 12, 2, 3],
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                },
            },
        };
    },
});
