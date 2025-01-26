import type { TColumns } from 'Controls/grid';
import { DataSet, HierarchicalMemory, Query } from 'Types/source';

import * as FirstColumnTemplate from 'wml!Controls-demo/treeGridNew/LoadMore/ReverseLoad/FirstColumn';

export default class Data extends HierarchicalMemory {
    protected _moduleName: string = 'Controls-demo/treeGridNew/LoadMore/ReverseLoad/Data';

    query(query?: Query): Promise<DataSet> {
        const parentProperty = this._$parentProperty;
        const where = query.getWhere();
        const parents = where[parentProperty];
        const keyProperty = this._keyProperty;
        const limit = query.getLimit();
        const direction = where.hasOwnProperty(keyProperty + '~')
            ? 'bothways'
            : where.hasOwnProperty(keyProperty + '>=')
            ? 'forward'
            : 'backward';
        const position =
            direction === 'bothways'
                ? where[keyProperty + '~']
                : direction === 'forward'
                ? where[keyProperty + '>=']
                : where[keyProperty + '<='];
        const isRootLoad = parents === null || (parents.length === 1 && parents[0] === null);

        if (isRootLoad) {
            const rootItems = this.data.filter((item) => {
                return item[parentProperty] === null;
            });
            return Promise.resolve(
                new DataSet({
                    keyProperty,
                    itemsProperty: 'items',
                    rawData: {
                        items: rootItems.concat(rootItems),
                        meta: {
                            more: {
                                before: false,
                                after: false,
                            },
                        },
                    },
                })
            );
        }

        return Promise.resolve(
            this._selectItemsFromRoot(
                limit,
                parents,
                parentProperty,
                keyProperty,
                direction,
                position
            )
        );
    }

    _selectItemsFromRoot(
        limit: number,
        rootKey: number,
        parentProperty: string,
        keyProperty: string,
        direction: string,
        position: number
    ): DataSet {
        const items = [];
        const rootItems = this.data
            .filter((item) => {
                return item[parentProperty] === rootKey;
            })
            .reverse();
        let index = 0;
        if (position !== null) {
            index =
                rootItems.findIndex((item) => {
                    if (item[keyProperty] === position) {
                        return true;
                    }
                }) + 1;
        }
        while (items.length < limit && index < rootItems.length) {
            items.unshift(rootItems[index]);
            index += 1;
        }
        let more;
        if (direction === 'bothways') {
            more = {
                before: index < rootItems.length,
                after: false,
            };
        } else {
            more = index < rootItems.length;
        }
        return new DataSet({
            keyProperty,
            itemsProperty: 'items',
            metaProperty: 'meta',
            rawData: {
                items,
                meta: {
                    more,
                },
            },
        });
    }
}

export const getData = () => {
    return [
        {
            key: 1,
            parent: null,
            type: true,
            name: 'Жукова Ольга',
            text: 'Олег, весьма захватывающее зрелище, просто огонь)',
            date: '20 дек 21:17',
        },
        {
            key: 2,
            parent: null,
            type: true,
            name: 'Баева Татьяна',
            text: 'Комментарий удален администратором группы 3 мар в 11.30.',
            date: '20 дек 21:18',
        },
        {
            key: 3,
            parent: null,
            type: true,
            name: 'Иванов Петр',
            text: 'Захватывающее зрелище, просто огонь)',
            date: '20 дек 21:19',
        },
        {
            key: 4,
            parent: null,
            type: true,
            name: 'Новиков Дмитрий',
            text: 'В следующий раз идем все вместе',
            date: '20 дек 21:20',
        },

        {
            key: 11,
            parent: 1,
            type: null,
            name: 'Сидоров Иван',
            text: 'Ольга, отличный комментарий! огонь)',
            date: '20 дек 22:10',
        },
        {
            key: 12,
            parent: 1,
            type: null,
            name: 'Петров Валентин',
            text: 'Ольга, еще бы, мы с Иваном очень старались.',
            date: '21 дек 14:46',
        },
        {
            key: 13,
            parent: 1,
            type: null,
            name: 'Иванов Сергей',
            text: 'Ты не понял, зайди',
            date: '31 дек 23:00',
        },
        {
            key: 14,
            parent: 1,
            type: null,
            name: 'Смирнов Павел',
            text: 'А мангал установили?',
            date: '31 дек 23:30',
        },
        {
            key: 15,
            parent: 1,
            type: null,
            name: 'Сидоров Алексей',
            text: 'Это проблема дяди Андрея',
            date: '31 дек 23:59',
        },
    ];
};

export const getColumns = (): TColumns => {
    return [
        {
            template: FirstColumnTemplate,
            width: '425px',
        },
        {
            displayProperty: 'date',
            width: '75px',
        },
    ];
};
