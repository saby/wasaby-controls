import { View, ItemTemplate } from 'Controls/tree';
import { Model } from 'Types/entity';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import ExpandedSource from 'Controls-demo/tree/data/ExpandedSource';
import 'css!DemoStand/Controls-demo';
import { useCallback, forwardRef } from 'react';

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

/**
 * Демка для статьи https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/tree/paddings/
 */
const Component = forwardRef(function (props, ref) {
    const getExpanderIcon = useCallback((item: Model) => {
        if (item.get('parent') === null) {
            return 'none';
        }
    }, []);
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo_fixedWidth300 controlsDemo_treeGrid-offset-withoutLevelPadding';
    return (
        <div className={rootClass} ref={ref}>
            <View
                storeId="listData"
                itemTemplate={(props) => {
                    return (
                        <ItemTemplate
                            expanderSize="s"
                            withoutLevelPadding={true}
                            expanderIcon={getExpanderIcon(props.item.contents)}
                            {...props}
                        />
                    );
                }}
            ></View>
        </div>
    );
});

export default Component;

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        listData: {
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
};
