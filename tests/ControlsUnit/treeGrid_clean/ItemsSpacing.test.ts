/* eslint-disable no-magic-numbers */
import { RecordSet } from 'Types/collection';
import TreeGridCollection from 'Controls/_baseTreeGrid/display/TreeGridCollection';
import { ITreeGridOptions } from 'Controls/_treeGrid/TreeGridView';
import { TemplateFunction } from 'UI/Base';
/**
 * регистрация Controls/treeGrid:TreeGridDataRow находится именно в библиотеке,
 * и некоторые тесты этим пользуются
 */
import 'Controls/treeGrid';

describe('Controls/treeGrid/Display/ItemsSpacing', () => {
    function createTreeGridCollection(
        rawData: {
            id: number;
            pid: number;
            node: boolean;
            [k: string]: unknown;
        }[],
        options: Partial<ITreeGridOptions> = {}
    ): TreeGridCollection {
        return new TreeGridCollection({
            ...options,
            columns: [{ width: '1px' }],
            // @ts-ignore - не правильно объявлен тип опций. Сейчас используются опции контрола
            collection: new RecordSet({
                rawData,
                keyProperty: 'id',
            }),
            root: null,
            keyProperty: 'id',
            parentProperty: 'pid',
            nodeProperty: 'node',
            itemsSpacing: 's',
        });
    }

    // Проверяем базовый сценарий: создали коллекцию, проверили кол-во итемов,
    // раскрыли один из узлов и снова проверили кол-во итемов
    it('base', () => {
        const data = [
            {
                id: 1,
                pid: null,
                node: true,
            },
            {
                id: 11,
                pid: 1,
                node: null,
            },
            {
                id: 2,
                pid: null,
                node: true,
            },
        ];
        const collection = createTreeGridCollection(data);
        // 2 узла + 1 отступ между ними
        expect(collection.getCount()).toEqual(3);

        collection.setExpandedItems([1]);
        // узел + отступ + дочерний + отступ + узел
        expect(collection.getCount()).toEqual(5);
    });

    // Проверяем что вокруг футеров узлов так же создаются записи отступы
    it('items spacing with node footer', () => {
        const data = [
            {
                id: 1,
                pid: null,
                node: true,
            },
            {
                id: 11,
                pid: 1,
                node: null,
            },
            {
                id: 2,
                pid: null,
                node: true,
            },
        ];
        const collection = createTreeGridCollection(data, {
            nodeFooterTemplate: (() => {
                return '';
            }) as unknown as TemplateFunction,
        });
        // 2 узла + 1 отступ между ними
        expect(collection.getCount()).toEqual(3);

        collection.setExpandedItems([1]);
        // узел + отступ + дочерний + отступ + футер узла + отступ + узел
        expect(collection.getCount()).toEqual(7);

        collection.setExpandedItems([1, 2]);
        // узел + отступ + дочерний + отступ + футер узла + отступ + узел + отступ + футер
        expect(collection.getCount()).toEqual(9);
    });
});
