/* eslint-disable */
import { Tree } from 'Controls/baseTree';
import { RecordSet } from 'Types/collection';
import { SearchGridCollection } from 'Controls/searchBreadcrumbsGrid';
import {
    getItemHierarchy,
    getReloadItemsHierarchy,
} from 'Controls/_baseTree/utils';

const data = [
    {
        id: 1,
        node: true,
        parent: null,
    },
    {
        id: 11,
        node: true,
        parent: 1,
    },
    {
        id: 111,
        node: true,
        parent: 11,
    },
    {
        id: 1111,
        node: null,
        parent: 111,
    },
    {
        id: 1112,
        node: null,
        parent: 111,
    },
    {
        id: 112,
        node: null,
        parent: 11,
    },
    {
        id: 2,
        node: true,
        parent: null,
    },
    {
        id: 21,
        node: true,
        parent: 2,
    },
];

describe('Controls/_baseTree/utils', () => {
    // Инстанс тестовой коллекции, который создается для каждого теста
    let collection: Tree;

    beforeEach(() => {
        collection = new Tree({
            root: null,
            keyProperty: 'id',
            nodeProperty: 'node',
            parentProperty: 'parent',
            collection: new RecordSet({ keyProperty: 'id', rawData: data }),
        });
    });

    describe('getItemHierarchy', () => {
        // Для записи из глубины дерева должен вернуть полную иерархию от корня до записи
        it('deep item', function () {
            const result = getItemHierarchy(collection, 1111);
            expect(result.length).toEqual(5);
            expect(result).toEqual([null, 1, 11, 111, 1111]);
        });

        // Для записи из корня дерева должен вернуть массив из 2-х элементов (корень и сам итем)
        it('root item', function () {
            const result = getItemHierarchy(collection, 2);
            expect(result.length).toEqual(2);
            expect(result).toEqual([null, 2]);
        });

        // Проверяем работоспособность getItemHierarchy для итема SearchGridCollection, т.к.
        // там могут быть строки с хлебными крошками, которые и так уже содержат в себе необходимую иерархию
        it('search collection', function () {
            const searchGridCollection = new SearchGridCollection({
                // @ts-ignore
                root: null,
                columns: [{}],
                keyProperty: 'id',
                nodeProperty: 'node',
                parentProperty: 'parent',
                collection: new RecordSet({ keyProperty: 'id', rawData: data }),
            }) as unknown as Tree;

            const result = getItemHierarchy(searchGridCollection, 1111);
            expect(result.length).toEqual(5);
            expect(result).toEqual([null, 1, 11, 111, 1111]);
        });
    });

    describe('getReloadItemsHierarchy', () => {
        // Проверяем что для одной id метод возвращает полную иерархию этого итема
        it('should return leaf hierarchy for one id', () => {
            const result = getReloadItemsHierarchy(collection, [1111]);
            expect(result).toEqual([null, 1, 11, 111]);
        });

        // Проверяем что метод возвращает в результирующем массиве только уникальные значения иерархии
        it('should return unique hierarchy ids', () => {
            // Получаем результат для записей из одной папки
            let result = getReloadItemsHierarchy(collection, [1111, 1112]);
            expect(result.length).toEqual(4);
            expect(result).toEqual([null, 1, 11, 111]);

            // Получаем результат для записей из разных папой
            result = getReloadItemsHierarchy(collection, [1111, 21]);
            expect(result.length).toEqual(5);
            expect(result).toEqual([null, 1, 11, 111, 2]);
        });
    });
});
