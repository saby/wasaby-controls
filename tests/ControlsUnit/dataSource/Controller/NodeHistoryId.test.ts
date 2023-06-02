import {
    ISourceControllerOptions,
    NewSourceController,
    nodeHistoryUtil,
} from 'Controls/dataSource';
import { CrudEntityKey, Memory } from 'Types/source';

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

describe('Controls/dataSource/Controller/NodeHistoryId', () => {
    // 1. Если !expandedItems && options.nodeHistoryId то дёргаем History При загрузке
    it('should call restore from history method', async () => {
        const controller = getController({
            expandedItems: undefined,
            nodeHistoryId: 'NODE_HISTORY_ID',
        });

        const stubRestore = jest
            .spyOn(nodeHistoryUtil, 'restore')
            .mockClear()
            .mockImplementation((id) => {
                expect(id).toEqual('NODE_HISTORY_ID');
                return Promise.resolve(['group_0']);
            });

        await controller.reload(null, true);

        expect(stubRestore).toHaveBeenCalledTimes(1);
    });

    // 2. Если expandedItems && options.nodeHistoryId то всё равно дёргаем History При загрузке
    it('should call restore from history method when expandedItems', async () => {
        const controller = getController({
            expandedItems: ['group_0'],
            nodeHistoryId: 'NODE_HISTORY_ID',
        });
        const spyRestore = jest.spyOn(nodeHistoryUtil, 'restore').mockClear();
        await controller.reload(null, true);

        expect(spyRestore).toHaveBeenCalled();
    });

    // 3. Если !options.nodeHistoryId то не дёргаем History При загрузке
    it('should not call restore from history method when no nodeHistoryId', async () => {
        const controller = getController({
            nodeHistoryId: undefined,
        });
        const stubRestore = jest.spyOn(nodeHistoryUtil, 'restore').mockClear();
        await controller.reload(null, true);

        expect(stubRestore).not.toHaveBeenCalled();
    });

    // 4. Не дёргаем History если isFirstLoad !== true
    it('should not call restore from history method when no nodeHistoryId', async () => {
        const controller = getController({
            nodeHistoryId: 'NODE_HISTORY_ID',
        });
        const stubRestore = jest.spyOn(nodeHistoryUtil, 'restore').mockClear();
        await controller.reload(null, false);

        expect(stubRestore).not.toHaveBeenCalled();
    });

    it('should consider nodeHistoryType=group', async () => {
        const controller = getController({
            nodeHistoryId: 'GROUP_NODE_HISTORY_ID',
            nodeTypeProperty: 'nodeType',
            nodeHistoryType: 'group',
        });

        jest.spyOn(nodeHistoryUtil, 'restore')
            .mockClear()
            .mockImplementation((key: any) => {
                return Promise.resolve(undefined);
            });
        const stubStore = jest
            .spyOn(nodeHistoryUtil, 'store')
            .mockClear()
            .mockImplementation((items: CrudEntityKey[], key: string) => {
                return Promise.resolve(true);
            });

        await controller.reload(null, true);

        controller.setExpandedItems(['group_0', 'node_3']);
        controller.updateExpandedItemsInUserStorage();

        expect(stubStore).toHaveBeenCalledWith(
            ['group_0'],
            'GROUP_NODE_HISTORY_ID'
        );
    });

    it('should consider nodeHistoryType=node', async () => {
        const controller = getController({
            nodeHistoryId: 'ONLY_NODE_HISTORY_ID',
            nodeTypeProperty: 'nodeType',
            nodeHistoryType: 'node',
        });

        jest.spyOn(nodeHistoryUtil, 'restore')
            .mockClear()
            .mockImplementation((key: any) => {
                return Promise.resolve(undefined);
            });
        const stubStore = jest
            .spyOn(nodeHistoryUtil, 'store')
            .mockClear()
            .mockImplementation((items: CrudEntityKey[], key: string) => {
                return Promise.resolve(true);
            });

        await controller.reload(null, true);

        controller.setExpandedItems(['group_0', 'node_3']);
        controller.updateExpandedItemsInUserStorage();

        expect(stubStore).toHaveBeenCalledWith(
            ['node_3'],
            'ONLY_NODE_HISTORY_ID'
        );
    });

    it('should consider nodeHistoryType=all', async () => {
        const controller = getController({
            nodeHistoryId: 'ONLY_NODE_HISTORY_ID',
            nodeTypeProperty: 'nodeType',
            nodeHistoryType: 'all',
        });

        jest.spyOn(nodeHistoryUtil, 'restore')
            .mockClear()
            .mockImplementation((key: any) => {
                return Promise.resolve(undefined);
            });
        const stubStore = jest
            .spyOn(nodeHistoryUtil, 'store')
            .mockClear()
            .mockImplementation((items: CrudEntityKey[], key: string) => {
                return Promise.resolve(true);
            });

        await controller.reload(null, true);

        controller.setExpandedItems(['group_0', 'node_3']);
        controller.updateExpandedItemsInUserStorage();

        expect(stubStore).toHaveBeenCalledWith(
            ['group_0', 'node_3'],
            'ONLY_NODE_HISTORY_ID'
        );
    });

    it('should store groups without an error if data was changed', async () => {
        const controller = getController({
            nodeHistoryId: 'CHANGE_DATA_HISTORY_ID',
            nodeTypeProperty: 'nodeType',
        });

        jest.spyOn(nodeHistoryUtil, 'restore')
            .mockClear()
            .mockImplementation((key: any) => {
                return Promise.resolve(undefined);
            });
        // Возвращаем id групп, которых нет в текущем списке.
        jest.spyOn(nodeHistoryUtil, 'getCached')
            .mockClear()
            .mockImplementation((key: any) => {
                return ['group_0', 'node_3', 'inexisting_node_6'];
            });
        const stubStore = jest
            .spyOn(nodeHistoryUtil, 'store')
            .mockClear()
            .mockImplementation((items: CrudEntityKey[], key: string) => {
                return Promise.resolve(true);
            });

        await controller.reload(null, true);

        controller.setExpandedItems([
            'group_0',
            'node_3',
            'inexisting_node_6',
            'inexisting_node_7',
        ]);
        controller.updateExpandedItemsInUserStorage();

        expect(stubStore).toHaveBeenCalledWith(
            ['group_0', 'inexisting_node_6'],
            'CHANGE_DATA_HISTORY_ID'
        );
    });
});
