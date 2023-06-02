import { Memory, Query } from 'Types/source';
import {
    ISourceControllerOptions,
    NewSourceController,
} from 'Controls/dataSource';
import DataSet from 'Types/_source/DataSet';

const hierarchyItems = [
    {
        key: 'group_0',
        title: 'Интерфейсный фреймворк',
        parent: null,
        type: true,
        nodeType: 'group',
    },
    {
        key: 'leaf_1',
        title: 'Sasha',
        type: null,
        parent: 'group_0',
    },
    {
        key: 'leaf_2',
        title: 'Dmitry',
        type: null,
        parent: 'group_0',
    },
    {
        key: 'node_3',
        title: 'Списки',
        type: true,
        parent: 'group_0',
    },
    {
        key: 'leaf_31',
        title: 'Alex',
        type: null,
        parent: 3,
    },
    {
        key: 'group_4',
        title: 'Склад',
        parent: null,
        type: true,
        nodeType: 'group',
    },
    {
        key: 'leaf_5',
        title: 'Michail',
        type: null,
        parent: 'group_4',
    },
];

const filterByEntries = (item, filter): boolean => {
    return filter.entries
        ? filter.entries.get('marked').includes(String(item.get('key')))
        : true;
};

function getMemoryWithHierarchyItems(): Memory {
    return new Memory({
        data: hierarchyItems,
        keyProperty: 'key',
        filter: filterByEntries,
    });
}

function getControllerWithHierarchyOptions(): ISourceControllerOptions {
    return {
        source: getMemoryWithHierarchyItems(),
        parentProperty: 'parent',
        nodeProperty: 'type',
        filter: {},
        keyProperty: 'key',
    };
}

function getController(additionalOptions: object = {}): NewSourceController {
    return new NewSourceController({
        ...getControllerWithHierarchyOptions(),
        ...additionalOptions,
    });
}

describe('Controls/dataSource/Controller/DeepReload', () => {
    it('deepReload to direction when deepScrollLoad is set', async () => {
        const source = getMemoryWithHierarchyItems();
        const controller = getController({
            nodeTypeProperty: 'nodeType',
            expandedItems: ['group_0', 'group_4'],
            deepScrollLoad: true,
            source,
        });

        const spyQuery = jest
            .spyOn(source, 'query')
            .mockClear()
            .mockImplementation((query?: Query) => {
                expect(query.getWhere().parent).toEqual([
                    null,
                    'group_0',
                    'group_4',
                ]);
                return Promise.resolve(new DataSet());
            });
        await controller.load('down', null);

        expect(spyQuery).toHaveBeenCalled();
    });

    it('no deepReload to direction when deepScrollLoad is not set', async () => {
        const source = getMemoryWithHierarchyItems();
        const controller = getController({
            nodeTypeProperty: 'nodeType',
            expandedItems: ['group_0', 'group_4'],
            source,
        });

        const spyQuery = jest
            .spyOn(source, 'query')
            .mockClear()
            .mockImplementation((query?: Query) => {
                // assertion here
                expect(query.getWhere().parent).toEqual(null);

                return Promise.resolve(new DataSet());
            });
        await controller.load('down', null);

        // assertion is above
        expect(spyQuery).toHaveBeenCalled();
    });

    it('deepReload to direction when deepScrollLoad + filter, should not duplicate filter', async () => {
        const source = getMemoryWithHierarchyItems();
        const controller = getController({
            nodeTypeProperty: 'nodeType',
            expandedItems: ['group_0', 'group_4'],
            deepScrollLoad: true,
            filter: {
                parent: ['group_0', 'group_4'],
            },
            source,
        });

        const spyQuery = jest
            .spyOn(source, 'query')
            .mockClear()
            .mockImplementation((query?: Query) => {
                // assertion here
                expect(query.getWhere().parent.length).toEqual(3);

                return Promise.resolve(new DataSet());
            });
        await controller.load('down', null);

        // assertion is above
        expect(spyQuery).toHaveBeenCalled();
    });
});
