/* eslint-disable no-empty,no-empty-function,@typescript-eslint/no-empty-function */
/* eslint-disable no-magic-numbers */

import jsdom = require('jsdom');
import { DndController, FlatStrategy } from 'Controls/listDragNDrop';
import { RecordSet } from 'Types/collection';
import { ItemsEntity } from 'Controls/dragnDrop';
import { Collection } from 'Controls/display';
import { SyntheticEvent } from 'Vdom/Vdom';

describe('Controls/_listDragNDrop/Controller', () => {
    let model;

    const items = new RecordSet({
        rawData: [{ id: 1 }, { id: 2 }, { id: 3 }],
        keyProperty: 'id',
    });
    const cfg = {
        collection: items,
        keyProperty: 'id',
    };

    const dom = new jsdom.JSDOM('');

    beforeEach(() => {
        model = new Collection(cfg);

        global.Element = dom.window.Element;
    });

    afterEach(() => {
        global.Element = undefined;
    });

    describe('startDrag', () => {
        it('not pass draggedItem', () => {
            const modelSetDraggedItemsSpy = jest.spyOn(model, 'setDraggedItems').mockClear();
            let controller = new DndController(model, null, FlatStrategy);
            controller.startDrag(new ItemsEntity({ items: [1] }));
            expect(modelSetDraggedItemsSpy).toHaveBeenCalled();
            expect(controller.getDraggableItem()).toBeFalsy();

            const item = model.getItemBySourceKey(1);
            controller = new DndController(model, item, FlatStrategy);
            controller.startDrag(new ItemsEntity({ items: [1] }));
            expect(controller.getDraggableItem()).toEqual(item);
        });

        it('pass draggedItem', () => {
            const draggedItem = model.getItemBySourceKey(1);
            const entity = new ItemsEntity({ items: [1] });
            const controller = new DndController(model, draggedItem, FlatStrategy);

            let modelSetDraggedItemsCalled = false;
            model.setDraggedItems = (draggedItemKey, e) => {
                expect(draggedItemKey).toEqual(draggedItem);
                expect(e).toEqual([1]);
                modelSetDraggedItemsCalled = true;
            };

            controller.startDrag(entity);

            expect(modelSetDraggedItemsCalled).toBe(true);
            expect(controller.getDragEntity()).toEqual(entity);
        });

        it('new model', () => {
            const model = new Collection({
                collection: items,
            });
            const draggedItem = model.getItemBySourceKey(1);
            const controller = new DndController(model, draggedItem, FlatStrategy);
            const entity = new ItemsEntity({ items: [1] });

            let modelSetDraggedItemsCalled = false;
            model.setDraggedItems = (draggedItemKey, draggedItemsKeys) => {
                expect(draggedItemKey).toEqual(draggedItem);
                expect(draggedItemsKeys).toEqual([1]);
                modelSetDraggedItemsCalled = true;
            };

            controller.startDrag(entity);

            expect(modelSetDraggedItemsCalled).toBe(true);
        });
    });

    it('setDragPosition', () => {
        const dragPosition = {
            index: 0,
            position: 'before',
        };
        const controller = new DndController(model, null, FlatStrategy);

        const modelSetDragPositionSpy = jest.spyOn(model, 'setDragPosition').mockClear();

        const result = controller.setDragPosition(dragPosition);

        expect(result).toBe(true);
        expect(controller.getDragPosition()).toEqual(dragPosition);
        expect(modelSetDragPositionSpy).toHaveBeenCalledWith(dragPosition);
    });

    it('endDrag', () => {
        const modelResetDraggedItemsCalled = jest.spyOn(model, 'resetDraggedItems').mockClear();
        const controller = new DndController(model, null, FlatStrategy);

        controller.endDrag();

        expect(modelResetDraggedItemsCalled).toHaveBeenCalledTimes(1);
        expect(controller.getDragPosition()).toBeNull();
        expect(controller.getDragEntity()).toBeNull();
    });

    describe('calculateDragPosition', () => {
        let controller;
        beforeEach(() => {
            const entity = new ItemsEntity({ items: [1] });
            controller = new DndController(model, model.getItemBySourceKey(1), FlatStrategy);
            controller.startDrag(entity);
        });

        it('hover on no draggable item', () => {
            const item = {
                DraggableItem: false,
            };

            const dragPosition = controller.calculateDragPosition({
                targetItem: item,
            });
            expect(dragPosition).toBeFalsy();
        });

        it('hover on dragged item', () => {
            const dragPosition = controller.calculateDragPosition({
                targetItem: model.getItemBySourceKey(1),
            });
            expect(dragPosition).not.toBeDefined();
        });

        it('first calculate position', () => {
            let newPosition = controller.calculateDragPosition({
                targetItem: model.getItemBySourceKey(3),
            });
            expect(newPosition.index).toEqual(2);
            expect(newPosition.position).toEqual('after');

            newPosition = controller.calculateDragPosition({
                targetItem: model.getItemBySourceKey(2),
            });
            expect(newPosition.index).toEqual(1);
            expect(newPosition.position).toEqual('after');
        });

        it('position was set before it', () => {
            const setPosition = {
                index: 1,
                position: 'after',
            };
            controller.setDragPosition(setPosition);
            expect(controller.getDragPosition()).toEqual(setPosition);

            let newPosition = controller.calculateDragPosition({
                targetItem: model.getItemBySourceKey(3),
            });
            expect(newPosition.index).toEqual(2);
            expect(newPosition.position).toEqual('after');

            newPosition = controller.calculateDragPosition({
                targetItem: model.getItemBySourceKey(2),
            });
            expect(newPosition.index).toEqual(1);
            expect(newPosition.position).toEqual('after');

            newPosition = controller.calculateDragPosition({
                targetItem: model.getItemBySourceKey(1),
            });
            expect(newPosition.index).toEqual(1);
            expect(newPosition.position).toEqual('after');
        });
    });

    it('canStartDragNDrop', () => {
        const canStartDragNDrop = () => {
            return true;
        };
        const event: SyntheticEvent = {
            nativeEvent: {
                button: undefined,
            } as MouseEvent,
            target: dom.window.document.createElement('div'),
        };

        expect(DndController.canStartDragNDrop(false, true, canStartDragNDrop, event)).toBe(true);
        expect(DndController.canStartDragNDrop(true, true, canStartDragNDrop, event)).toBe(false);
        expect(DndController.canStartDragNDrop(true, false, canStartDragNDrop, event)).toBe(false);
        expect(DndController.canStartDragNDrop(false, true, false, event)).toBe(true);
        expect(DndController.canStartDragNDrop(false, true, true, event)).toBe(false);

        event.nativeEvent.button = {};
        expect(DndController.canStartDragNDrop(false, true, canStartDragNDrop, event)).toBe(false);
    });

    describe('getSelectionForDragNDrop', () => {
        it('selected all', () => {
            let result = DndController.getSelectionForDragNDrop(
                model,
                { selected: [null], excluded: [] },
                1
            );
            expect(result).toEqual({
                selected: [null],
                excluded: [],
                recursive: false,
            });

            result = DndController.getSelectionForDragNDrop(
                model,
                { selected: [null], excluded: [1] },
                1
            );
            expect(result).toEqual({
                selected: [null],
                excluded: [],
                recursive: false,
            });

            result = DndController.getSelectionForDragNDrop(
                model,
                { selected: [null], excluded: [1] },
                2
            );
            expect(result).toEqual({
                selected: [null],
                excluded: [1],
                recursive: false,
            });
        });

        it('not selected all', () => {
            let result = DndController.getSelectionForDragNDrop(
                model,
                { selected: [1], excluded: [] },
                1
            );
            expect(result).toEqual({
                selected: [1],
                excluded: [],
                recursive: false,
            });

            result = DndController.getSelectionForDragNDrop(
                model,
                { selected: [2], excluded: [] },
                1
            );
            expect(result).toEqual({
                selected: [1, 2],
                excluded: [],
                recursive: false,
            });

            result = DndController.getSelectionForDragNDrop(
                model,
                { selected: [3, 1], excluded: [] },
                2
            );
            expect(result).toEqual({
                selected: [1, 2, 3],
                excluded: [],
                recursive: false,
            });
        });
    });
});
