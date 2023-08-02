/* eslint-disable no-empty,no-empty-function,@typescript-eslint/no-empty-function */
/* eslint-disable no-magic-numbers */

import { RecordSet } from 'Types/collection';
import { TreeStrategy } from 'Controls/listDragNDrop';
import { TreeGridCollection } from 'Controls/treeGrid';

function equalPosition(pos1, pos2): boolean {
    expect(pos1.index).toEqual(pos2.index);
    expect(pos1.position).toEqual(pos2.position);
    expect(pos1.dispItem === pos2.dispItem).toBe(true);
}

describe('Controls/_listDragNDrop/strategies/TreeStrategy', () => {
    /*
      1
         2
            4
         3
      5
      6
    */
    const items = new RecordSet({
        rawData: [
            {
                id: 1,
                parent: null,
                node: true,
                group: 111,
            },
            {
                id: 2,
                parent: 1,
                node: true,
                group: 111,
            },
            {
                id: 3,
                parent: 1,
                node: null,
                group: 111,
            },
            {
                id: 4,
                parent: 2,
                node: null,
                group: 111,
            },
            {
                id: 5,
                parent: null,
                node: true,
                group: 111,
            },
            {
                id: 6,
                parent: null,
                node: null,
                group: 222,
            },
        ],
        keyProperty: 'id',
    });
    const cfg = {
        root: null,
        collection: items,
        keyProperty: 'id',
        parentProperty: 'parent',
        nodeProperty: 'node',
        groupProperty: 'group',
        columns: [],
    };
    let model;
    let strategy;

    beforeEach(() => {
        model = new TreeGridCollection(cfg);
    });

    describe('calculatePosition', () => {
        it('hover on dragged item', () => {
            const item = model.getItemBySourceKey(5);

            strategy = new TreeStrategy(model, item);
            const newPosition = strategy.calculatePosition({
                targetItem: item,
            });
            expect(newPosition).toBeNull();
        });

        it('before node', () => {
            strategy = new TreeStrategy(model, model.getItemBySourceKey(1));

            const targetItem = model.getItemBySourceKey(5);
            const mouseOffsetInTargetItem = { top: 0.2, bottom: 25 };
            const currentPosition = {
                index: 1,
                position: 'on',
                dispItem: targetItem,
            };
            const position = strategy.calculatePosition({
                targetItem,
                currentPosition,
                mouseOffsetInTargetItem,
            });

            equalPosition(position, {
                index: 2,
                position: 'before',
                dispItem: targetItem,
            });
        });

        describe('drag on node', () => {
            it('drag node before node', () => {
                strategy = new TreeStrategy(model, model.getItemBySourceKey(1));

                const targetNode = model.getItemBySourceKey(5);
                const mouseOffsetInTargetItem = { top: 0.2, bottom: 0.8 };

                const newPosition = strategy.calculatePosition({
                    targetItem: targetNode,
                    mouseOffsetInTargetItem,
                });
                equalPosition(newPosition, {
                    index: 2,
                    position: 'before',
                    dispItem: targetNode,
                });
            });

            it('drag node after node', () => {
                strategy = new TreeStrategy(model, model.getItemBySourceKey(1));

                const targetNode = model.getItemBySourceKey(5);
                const mouseOffsetInTargetItem = { top: 0.8, bottom: 0.2 };

                const newPosition = strategy.calculatePosition({
                    targetItem: targetNode,
                    mouseOffsetInTargetItem,
                });
                equalPosition(newPosition, {
                    index: 2,
                    position: 'after',
                    dispItem: targetNode,
                });
            });

            it('drag node before leaf', () => {
                strategy = new TreeStrategy(model, model.getItemBySourceKey(1));

                const targetNode = model.getItemBySourceKey(6);
                const mouseOffsetInTargetItem = { top: 0.2, bottom: 0.8 };

                const newPosition = strategy.calculatePosition({
                    targetItem: targetNode,
                    mouseOffsetInTargetItem,
                });
                equalPosition(newPosition, {
                    index: 4,
                    position: 'before',
                    dispItem: targetNode,
                });
            });

            it('drag node after leaf', () => {
                strategy = new TreeStrategy(model, model.getItemBySourceKey(1));

                const targetNode = model.getItemBySourceKey(6);
                const mouseOffsetInTargetItem = { top: 0.8, bottom: 0.2 };

                const newPosition = strategy.calculatePosition({
                    targetItem: targetNode,
                    mouseOffsetInTargetItem,
                });
                equalPosition(newPosition, {
                    index: 4,
                    position: 'after',
                    dispItem: targetNode,
                });
            });

            it('drag node on node', () => {
                strategy = new TreeStrategy(model, model.getItemBySourceKey(1));

                const targetNode = model.getItemBySourceKey(5);
                const mouseOffsetInTargetItem = { top: 12, bottom: 12 };

                const newPosition = strategy.calculatePosition({
                    targetItem: targetNode,
                    mouseOffsetInTargetItem,
                });
                equalPosition(newPosition, {
                    index: 2,
                    position: 'on',
                    dispItem: targetNode,
                });
            });

            it('drag leaf on node', () => {
                strategy = new TreeStrategy(model, model.getItemBySourceKey(6));

                const targetNode = model.getItemBySourceKey(1);
                const mouseOffsetInTargetItem = { top: 12, bottom: 13 };

                const newPosition = strategy.calculatePosition({
                    targetItem: targetNode,
                    mouseOffsetInTargetItem,
                });
                equalPosition(newPosition, {
                    index: 1,
                    position: 'on',
                    dispItem: targetNode,
                });
            });

            it('drag leaf before node', () => {
                strategy = new TreeStrategy(model, model.getItemBySourceKey(6));

                const targetNode = model.getItemBySourceKey(1);
                const mouseOffsetInTargetItem = { top: 0.2, bottom: 0.8 };

                const newPosition = strategy.calculatePosition({
                    targetItem: targetNode,
                    mouseOffsetInTargetItem,
                });
                equalPosition(newPosition, {
                    index: 1,
                    position: 'before',
                    dispItem: targetNode,
                });
            });

            it('drag leaf after node', () => {
                strategy = new TreeStrategy(model, model.getItemBySourceKey(6));

                const targetNode = model.getItemBySourceKey(1);
                const mouseOffsetInTargetItem = { top: 0.8, bottom: 0.2 };

                const newPosition = strategy.calculatePosition({
                    targetItem: targetNode,
                    mouseOffsetInTargetItem,
                });
                equalPosition(newPosition, {
                    index: 1,
                    position: 'after',
                    dispItem: targetNode,
                });
            });

            it('drag leaf from bottom node to after this node', () => {
                model.setExpandedItems([null]);
                model.getItemBySourceKey(1).setExpanded(true);

                strategy = new TreeStrategy(model, model.getItemBySourceKey(3));

                const targetNode = model.getItemBySourceKey(1);
                const mouseOffsetInTargetItem = { top: 0.8, bottom: 0.2 };

                const newPosition = strategy.calculatePosition({
                    targetItem: targetNode,
                    mouseOffsetInTargetItem,
                });
                equalPosition(newPosition, {
                    index: 2,
                    position: 'before',
                    dispItem: model.getItemBySourceKey(2),
                });
            });

            it('drag first leaf from node and back to same place ', () => {
                model.setExpandedItems([null]);
                model.getItemBySourceKey(1).setExpanded(true);

                strategy = new TreeStrategy(model, model.getItemBySourceKey(4));

                const targetNode = model.getItemBySourceKey(2);
                const mouseOffsetInTargetItem = { top: 0.2, bottom: 0.8 };

                const newPosition = strategy.calculatePosition({
                    targetItem: targetNode,
                    mouseOffsetInTargetItem,
                });
                equalPosition(newPosition, {
                    index: 2,
                    position: 'before',
                    dispItem: targetNode,
                });
            });
        });

        describe('drag tiles', () => {
            beforeEach(() => {
                model['[Controls/_tile/Tile]'] = true;
            });

            it('drag node before node', () => {
                strategy = new TreeStrategy(model, model.getItemBySourceKey(1));

                const targetNode = model.getItemBySourceKey(5);
                const mouseOffsetInTargetItem = { top: 0.2, bottom: 0.8 };

                const newPosition = strategy.calculatePosition({
                    targetItem: targetNode,
                    mouseOffsetInTargetItem,
                });
                equalPosition(newPosition, {
                    index: 2,
                    position: 'before',
                    dispItem: targetNode,
                });
            });

            it('drag node after node', () => {
                strategy = new TreeStrategy(model, model.getItemBySourceKey(1));

                const targetNode = model.getItemBySourceKey(5);
                const mouseOffsetInTargetItem = { top: 0.8, bottom: 0.2 };

                const newPosition = strategy.calculatePosition({
                    targetItem: targetNode,
                    mouseOffsetInTargetItem,
                });
                equalPosition(newPosition, {
                    index: 2,
                    position: 'after',
                    dispItem: targetNode,
                });
            });

            it('drag node before leaf', () => {
                strategy = new TreeStrategy(model, model.getItemBySourceKey(1));

                const targetNode = model.getItemBySourceKey(6);
                const mouseOffsetInTargetItem = { top: 0.2, bottom: 0.8 };

                const newPosition = strategy.calculatePosition({
                    targetItem: targetNode,
                    mouseOffsetInTargetItem,
                });
                equalPosition(newPosition, {
                    index: 1,
                    dispItem: model.getItemBySourceKey(1),
                });
            });

            it('drag node after leaf', () => {
                strategy = new TreeStrategy(model, model.getItemBySourceKey(1));

                const targetNode = model.getItemBySourceKey(6);
                const mouseOffsetInTargetItem = { top: 0.8, bottom: 0.2 };

                const newPosition = strategy.calculatePosition({
                    targetItem: targetNode,
                    mouseOffsetInTargetItem,
                });
                equalPosition(newPosition, {
                    index: 1,
                    dispItem: model.getItemBySourceKey(1),
                });
            });

            it('drag node on node', () => {
                strategy = new TreeStrategy(model, model.getItemBySourceKey(1));

                const targetNode = model.getItemBySourceKey(5);
                const mouseOffsetInTargetItem = { top: 12, bottom: 12 };

                const newPosition = strategy.calculatePosition({
                    targetItem: targetNode,
                    mouseOffsetInTargetItem,
                });
                equalPosition(newPosition, {
                    index: 2,
                    position: 'on',
                    dispItem: targetNode,
                });
            });

            it('drag leaf on node', () => {
                strategy = new TreeStrategy(model, model.getItemBySourceKey(6));

                const targetNode = model.getItemBySourceKey(1);
                const mouseOffsetInTargetItem = { top: 12, bottom: 13 };

                const newPosition = strategy.calculatePosition({
                    targetItem: targetNode,
                    mouseOffsetInTargetItem,
                });
                equalPosition(newPosition, {
                    index: 1,
                    position: 'on',
                    dispItem: targetNode,
                });
            });

            it('drag leaf before node', () => {
                strategy = new TreeStrategy(model, model.getItemBySourceKey(6));

                const targetNode = model.getItemBySourceKey(1);
                const mouseOffsetInTargetItem = { top: 0.2, bottom: 0.8 };

                const newPosition = strategy.calculatePosition({
                    targetItem: targetNode,
                    mouseOffsetInTargetItem,
                });
                equalPosition(newPosition, {
                    index: 1,
                    position: 'on',
                    dispItem: targetNode,
                });
            });

            it('drag leaf after node', () => {
                strategy = new TreeStrategy(model, model.getItemBySourceKey(6));

                const targetNode = model.getItemBySourceKey(1);
                const mouseOffsetInTargetItem = { top: 0.8, bottom: 0.2 };

                const newPosition = strategy.calculatePosition({
                    targetItem: targetNode,
                    mouseOffsetInTargetItem,
                });
                equalPosition(newPosition, {
                    index: 1,
                    position: 'on',
                    dispItem: targetNode,
                });
            });
        });

        it('before group', () => {
            strategy = new TreeStrategy(model, model.getItemBySourceKey(6));

            const targetItem = model.getItemBySourceKey(222);
            const mouseOffsetInTargetItem = { top: 0.2, bottom: 25 };
            const currentPosition = {
                index: 7,
                position: 'on',
                dispItem: targetItem,
            };
            const position = strategy.calculatePosition({
                targetItem,
                currentPosition,
                mouseOffsetInTargetItem,
            });
            equalPosition(position, {
                index: 3,
                position: 'before',
                dispItem: model.getItemBySourceKey(222),
            });
        });
    });

    describe('getDraggableKeys', () => {
        it('should return all child keys', () => {
            model.setExpandedItems([null]);
            const item = model.getItemBySourceKey(2);
            strategy = new TreeStrategy(model, item);
            const result = strategy.getDraggableKeys([1, 2]);
            expect(result).toEqual([1, 2]);
        });
    });
});
