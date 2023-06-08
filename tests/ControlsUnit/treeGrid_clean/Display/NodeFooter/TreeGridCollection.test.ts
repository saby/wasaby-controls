import { RecordSet } from 'Types/collection';
import TreeGridCollection from 'Controls/_treeGrid/display/TreeGridCollection';
/**
 * регистрация Controls/treeGrid:TreeGridDataRow находится именно в библиотеке,
 * и некоторые тесты этим пользуются
 */
import 'Controls/treeGrid';

describe('Controls/treeGrid_clean/Display/NodeFooter/Collection', () => {
    it('rebuild all node footers when pass flag', () => {
        const rs = new RecordSet({
            rawData: [
                { id: 1, node: true, pid: 0 },
                { id: 11, node: true, pid: 1 },
                { id: 2, node: true, pid: 0 },
            ],
            keyProperty: 'id',
        });
        const tree = new TreeGridCollection({
            collection: rs,
            root: {
                id: 0,
                title: 'Root',
            },
            keyProperty: 'id',
            parentProperty: 'pid',
            nodeProperty: 'node',
            columns: [],
            expandedItems: [1, 2],
        });

        let items = tree.getItems();
        const hasNodeFooter = !!items.find((it) => {
            return it['[Controls/treeGrid:TreeGridNodeFooterRow]'];
        });
        expect(hasNodeFooter).toBe(false);

        // футеры сразу пересчитываются, т.к. передали флаг
        tree.setHasMoreStorage(
            {
                1: {
                    forward: true,
                    backward: false,
                },
            },
            true
        );

        items = tree.getItems();
        // проверяем что создался узел
        const nodeFooters = items.filter((it) => {
            return it['[Controls/treeGrid:TreeGridNodeFooterRow]'];
        });
        expect(nodeFooters.length).toEqual(1);
        expect(nodeFooters[0].getNode()).toEqual(tree.getItemBySourceKey(1));
        expect(tree.getItemBySourceKey(1).getNodeFooter()).toEqual(nodeFooters[0]);
    });
});
