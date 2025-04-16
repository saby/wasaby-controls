import { Control, TemplateFunction } from 'UI/Base';
import { Model } from 'Types/entity';
import { IColumn } from 'Controls/grid';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import ExpandedSource from 'Controls-demo/treeGridNew/DemoHelpers/ExpandedSource';

import * as Template from 'wml!Controls-demo/treeGridNew/Offsets/WithoutLevelPadding/WithoutLevelPadding';
import * as MoneyColumnTemplate from 'wml!Controls-demo/treeGridNew/Offsets/WithoutLevelPadding/MoneyColumnTemplate';

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

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
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
    }

    protected _beforeMount(): void {
        this._columns = [
            {
                displayProperty: 'title',
                width: '215px',
            },
            {
                displayProperty: 'sum',
                template: MoneyColumnTemplate,
                width: '80px',
            },
        ];
    }

    /**
     * Принудительно скрываем иконку expander для узлов первого уровня
     * @param item
     * @private
     */
    protected _getExpanderIcon(item: Model): string {
        if (item.get('parent') === null) {
            return 'none';
        }
        return;
    }
}
