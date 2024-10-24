/* eslint-disable no-empty,no-empty-function,@typescript-eslint/no-empty-function */
/* eslint-disable no-magic-numbers */

import { MarkerController } from 'Controls/marker';
import { Collection } from 'Controls/display';
import { RecordSet } from 'Types/collection';
import { SearchGridCollection } from 'Controls/searchBreadcrumbsGrid';
import { Tree } from 'Controls/baseTree';
import * as ListData from 'ControlsUnit/ListData';
import { Model } from 'Types/entity';

describe('Controls/marker/Controller', () => {
    let controller;
    let model;
    let items;

    beforeEach(() => {
        items = new RecordSet({
            rawData: [{ id: 1 }, { id: 2 }, { id: 3 }],
            keyProperty: 'id',
        });
        model = new Collection({
            collection: items,
        });
        controller = new MarkerController({
            model,
            markerVisibility: 'visible',
            markedKey: undefined,
        });
    });

    describe('constructor', () => {
        it('init marker in model', () => {
            controller = new MarkerController({
                model,
                markerVisibility: 'visible',
                markedKey: 1,
            });
            expect(model.getItemBySourceKey(1).isMarked()).toBe(true);
        });
    });

    describe('updateOptions', () => {
        it('change options', () => {
            controller.updateOptions({
                model,
                markerVisibility: 'onactivated',
            });

            expect(controller._model).toEqual(model);
            expect(controller._markerVisibility).toEqual('onactivated');
            model.each((item) => {
                return expect(item.isMarked()).toBe(false);
            });
        });

        it('model changed', () => {
            const newModel = new Collection({
                collection: items,
            });
            controller.setMarkedKey(1);
            controller.updateOptions({
                model: newModel,
                markerVisibility: 'onactivated',
            });

            expect(controller._model).toEqual(newModel);
            expect(controller._markerVisibility).toEqual('onactivated');
            expect(newModel.getItemBySourceKey(1).isMarked()).toBe(true);
            expect(newModel.getItemBySourceKey(2).isMarked()).toBe(false);
            expect(newModel.getItemBySourceKey(3).isMarked()).toBe(false);

            expect(newModel.getVersion()).toEqual(1);
            expect(newModel.getItemBySourceKey(1).getVersion()).toEqual(1);
            expect(newModel.getItemBySourceKey(2).getVersion()).toEqual(0);
            expect(newModel.getItemBySourceKey(3).getVersion()).toEqual(0);
        });

        it('change markerVisibility to hidden', () => {
            controller.setMarkedKey(1);

            controller.updateOptions({
                model,
                markerVisibility: 'hidden',
            });

            model.each((item) => {
                return expect(item.isMarked()).toBe(false);
            });
        });
    });

    describe('setMarkedKey', () => {
        it('same key', () => {
            controller = new MarkerController({
                model,
                markerVisibility: 'visible',
                markedKey: 1,
            });
            model.setCollection(
                new RecordSet({
                    rawData: [{ id: 1 }, { id: 2 }, { id: 3 }],
                    keyProperty: 'id',
                })
            );

            expect(model.getVersion()).toEqual(3);

            expect(model.getItemBySourceKey(1).getVersion()).toEqual(1);
            expect(model.getItemBySourceKey(3).getVersion()).toEqual(1);
            expect(model.getItemBySourceKey(1).isMarked()).toBe(true);

            controller.setMarkedKey(1);
            // Проверяем что маркер переставился на новый элемент
            expect(model.getItemBySourceKey(1).isMarked()).toBe(true);
            expect(model.getItemBySourceKey(2).isMarked()).toBe(false);
            expect(model.getItemBySourceKey(3).isMarked()).toBe(false);

            // Проверяем что версия изменилась один раз для маркера
            expect(model.getVersion()).toEqual(3);
            expect(model.getItemBySourceKey(1).getVersion()).toEqual(1);
            expect(model.getItemBySourceKey(2).getVersion()).toEqual(0);
            expect(model.getItemBySourceKey(3).getVersion()).toEqual(1);
        });

        it('another key', () => {
            expect(model.getVersion()).toEqual(0);
            expect(model.getItemBySourceKey(1).isMarked()).toBe(false);

            controller.setMarkedKey(1);
            expect(model.getItemBySourceKey(1).isMarked()).toBe(true);
            expect(model.getItemBySourceKey(2).isMarked()).toBe(false);
            expect(model.getItemBySourceKey(3).isMarked()).toBe(false);

            // Проверяем что версия изменилась один раз
            expect(model.getVersion()).toEqual(1);
            expect(model.getItemBySourceKey(1).getVersion()).toEqual(1);
            expect(model.getItemBySourceKey(2).getVersion()).toEqual(0);
            expect(model.getItemBySourceKey(3).getVersion()).toEqual(0);

            controller.setMarkedKey(2);
            expect(model.getItemBySourceKey(1).isMarked()).toBe(false);
            expect(model.getItemBySourceKey(2).isMarked()).toBe(true);

            // Проверяем что версия изменилась один раз
            expect(model.getVersion()).toEqual(3);
            expect(model.getItemBySourceKey(1).getVersion()).toEqual(2);
            expect(model.getItemBySourceKey(2).getVersion()).toEqual(1);
            expect(model.getItemBySourceKey(3).getVersion()).toEqual(0);
        });
    });

    describe('calculateMarkedKeyForVisible', () => {
        it('same key', () => {
            controller.setMarkedKey(2);
            const result = controller.calculateMarkedKeyForVisible();
            expect(result).toEqual(2);
        });

        it('same key which not exists in model', () => {
            controller.setMarkedKey(4);
            const result = controller.calculateMarkedKeyForVisible();
            expect(result).toEqual(1);
        });

        it('not exist item by key', () => {
            controller = new MarkerController({
                model,
                markerVisibility: 'visible',
                markedKey: 4,
            });

            const result = controller.calculateMarkedKeyForVisible();
            expect(result).toEqual(1);
        });

        it('markerVisibility = onactivated', () => {
            controller = new MarkerController({
                model,
                markerVisibility: 'onactivated',
                markedKey: 4,
            });
            const result = controller.calculateMarkedKeyForVisible();
            expect(result).toEqual(4);
        });

        it('markerVisibility = visible and not exists item with marked key', () => {
            controller = new MarkerController({
                model,
                markerVisibility: 'visible',
                markedKey: 1,
            });
            model.setCollection(
                new RecordSet({
                    rawData: [{ id: 2 }, { id: 3 }],
                    keyProperty: 'id',
                })
            );

            const result = controller.calculateMarkedKeyForVisible();
            expect(result).toEqual(2);
        });
    });

    it('getNextMarkedKey', () => {
        controller = new MarkerController({
            model,
            markerVisibility: 'visible',
            markedKey: 2,
        });

        const result = controller.getNextMarkedKey();
        expect(result).toEqual(3);
    });

    it('getPrevMarkedKey', () => {
        controller = new MarkerController({
            model,
            markerVisibility: 'visible',
            markedKey: 2,
        });

        const result = controller.getPrevMarkedKey();
        expect(result).toEqual(1);
    });

    it('getSuitableMarkedKey', () => {
        controller = new MarkerController({
            model,
            markerVisibility: 'visible',
            markedKey: 2,
        });
        const item = model.at(0);
        const result = controller.getSuitableMarkedKey(item);
        expect(result).toEqual(1);
    });

    describe('onCollectionRemove', () => {
        it('exists current marked item', () => {
            controller = new MarkerController({
                model,
                markerVisibility: 'visible',
                markedKey: 2,
            });

            const item = model.getItemBySourceKey(1);
            model.getSourceCollection().remove(item.getContents());

            const result = controller.onCollectionRemove(0, [item]);
            expect(result).toEqual(2);
            expect(item.isMarked()).toBe(false);
        });

        it('exists next item', () => {
            controller = new MarkerController({
                model,
                markerVisibility: 'visible',
                markedKey: 2,
            });

            const item = model.getItemBySourceKey(2);
            model.getSourceCollection().remove(item.getContents());

            const result = controller.onCollectionRemove(1, [item]);
            expect(result).toEqual(3);
            expect(item.isMarked()).toBe(false);
        });

        it('exists prev item, but not next', () => {
            controller = new MarkerController({
                model,
                markerVisibility: 'visible',
                markedKey: 2,
            });

            const item = model.getItemBySourceKey(3);
            model.getSourceCollection().remove(item.getContents());

            const result = controller.onCollectionRemove(2, [item]);
            expect(result).toEqual(2);
            expect(item.isMarked()).toBe(false);
        });

        it('not exists next and prev', () => {
            controller = new MarkerController({
                model,
                markerVisibility: 'visible',
                markedKey: 2,
            });

            const removedItems = [];
            for (let i = 0; i < 3; i++) {
                const item = model.getItemBySourceKey(i + 1);
                model.getSourceCollection().remove(item.getContents());
                removedItems.push(item);
            }

            const result = controller.onCollectionRemove(0, removedItems);
            expect(result).toEqual(null);
            removedItems.forEach((item) => {
                return expect(item.isMarked()).toBe(false);
            });
        });

        describe('collapse node', () => {
            beforeEach(() => {
                model = new Tree({
                    collection: new RecordSet({
                        keyProperty: ListData.KEY_PROPERTY,
                        rawData: ListData.getItems(),
                    }),
                    root: new Model({
                        rawData: { id: null },
                        keyProperty: ListData.KEY_PROPERTY,
                    }),
                    keyProperty: ListData.KEY_PROPERTY,
                    parentProperty: ListData.PARENT_PROPERTY,
                    nodeProperty: ListData.NODE_PROPERTY,
                    hasChildrenProperty: ListData.HAS_CHILDREN_PROPERTY,
                });

                controller = new MarkerController({
                    model,
                    markerVisibility: 'visible',
                    markedKey: undefined,
                });
            });

            it('was not set marker', () => {
                const newMarkedKey = controller.onCollectionRemove(0, [
                    model.getItemBySourceKey(1),
                ]);
                expect(newMarkedKey).toEqual(undefined);
            });

            it('collapse node with marker', () => {
                controller.setMarkedKey(2);
                const newMarkedKey = controller.onCollectionRemove(0, [
                    model.getItemBySourceKey(2),
                ]);
                expect(newMarkedKey).toEqual(1);
            });

            it('collapse node with marker at depth of several nodes', () => {
                controller.setMarkedKey(3);
                const newMarkedKey = controller.onCollectionRemove(0, [
                    model.getItemBySourceKey(2),
                    model.getItemBySourceKey(3),
                    model.getItemBySourceKey(4),
                    model.getItemBySourceKey(5),
                ]);
                expect(newMarkedKey).toEqual(1);
            });

            it('collapse node without marker', () => {
                controller.setMarkedKey(5);
                const newMarkedKey = controller.onCollectionRemove(0, [
                    model.getItemBySourceKey(3),
                    model.getItemBySourceKey(4),
                ]);
                expect(newMarkedKey).toEqual(5);
            });

            it('remove item with parent = root node', () => {
                controller.setMarkedKey(6);
                const removedItem = model.getItemBySourceKey(6);
                model.getSourceCollection().remove(removedItem.getContents());
                const newMarkedKey = controller.onCollectionRemove(0, [removedItem]);
                expect(newMarkedKey).toEqual(1);
            });
        });
    });

    describe('onCollectionAdd', () => {
        it('restore marker', () => {
            controller.setMarkedKey(1);
            expect(model.getItemBySourceKey(1).isMarked()).toBe(true);

            model.setCollection(
                new RecordSet({
                    rawData: [{ id: 1 }, { id: 2 }, { id: 3 }],
                    keyProperty: 'id',
                })
            );
            expect(model.getVersion()).toEqual(3);
            controller.onCollectionAdd([model.getItemBySourceKey(1)]);
            expect(model.getItemBySourceKey(1).isMarked()).toBe(true);
            expect(model.getItemBySourceKey(2).isMarked()).toBe(false);
            expect(model.getItemBySourceKey(3).isMarked()).toBe(false);
            expect(model.getVersion()).toEqual(3);
        });
    });

    describe('onCollectionReplace', () => {
        it('restore marker', () => {
            controller.setMarkedKey(1);
            expect(model.getItemBySourceKey(1).isMarked()).toBe(true);

            model.setCollection(
                new RecordSet({
                    rawData: [{ id: 1 }, { id: 2 }, { id: 3 }],
                    keyProperty: 'id',
                })
            );
            expect(model.getVersion()).toEqual(3);
            controller.onCollectionReplace([model.getItemBySourceKey(1)]);
            expect(model.getItemBySourceKey(1).isMarked()).toBe(true);
            expect(model.getItemBySourceKey(2).isMarked()).toBe(false);
            expect(model.getItemBySourceKey(3).isMarked()).toBe(false);
            expect(model.getVersion()).toEqual(3);
        });
    });

    describe('onCollectionReset', () => {
        it('exists marked item', () => {
            controller.setMarkedKey(1);
            expect(model.getItemBySourceKey(1).isMarked()).toBe(true);

            model.setCollection(
                new RecordSet({
                    rawData: [{ id: 1 }, { id: 2 }, { id: 3 }],
                    keyProperty: 'id',
                })
            );
            expect(model.getVersion()).toEqual(3);
            const newMarkedKey = controller.onCollectionReset();
            expect(newMarkedKey).toEqual(1);
            expect(model.getItemBySourceKey(1).isMarked()).toBe(true);
            expect(model.getItemBySourceKey(2).isMarked()).toBe(false);
            expect(model.getItemBySourceKey(3).isMarked()).toBe(false);
            expect(model.getVersion()).toEqual(3);
        });

        it('not exists marked item, visible', () => {
            controller.setMarkedKey(1);
            expect(model.getItemBySourceKey(1).isMarked()).toBe(true);

            model.setCollection(
                new RecordSet({
                    rawData: [{ id: 2 }, { id: 3 }],
                    keyProperty: 'id',
                })
            );

            expect(model.getVersion()).toEqual(3);
            const newMarkedKey = controller.onCollectionReset();
            expect(newMarkedKey).toEqual(2);
            expect(model.getItemBySourceKey(2).isMarked()).toBe(false);
            expect(model.getItemBySourceKey(3).isMarked()).toBe(false);
            expect(model.getVersion()).toEqual(3);
        });

        it('not exists marked item, onactivated and was set marker before reset', () => {
            const ctrl = new MarkerController({
                model,
                markerVisibility: 'onactivated',
                markedKey: undefined,
            });
            ctrl.setMarkedKey(1);
            expect(model.getItemBySourceKey(1).isMarked()).toBe(true);

            model.setCollection(
                new RecordSet({
                    rawData: [{ id: 2 }, { id: 3 }],
                    keyProperty: 'id',
                })
            );

            const newMarkedKey = ctrl.onCollectionReset();
            expect(newMarkedKey).toEqual(2);
            expect(model.getItemBySourceKey(2).isMarked()).toBe(false);
            expect(model.getItemBySourceKey(3).isMarked()).toBe(false);
        });

        it('not exists marked item, onactivated and was not set marker before reset', () => {
            const ctrl = new MarkerController({
                model,
                markerVisibility: 'onactivated',
                markedKey: null,
            });
            model.setCollection(
                new RecordSet({
                    rawData: [{ id: 2 }, { id: 3 }],
                    keyProperty: 'id',
                })
            );

            const newMarkedKey = ctrl.onCollectionReset();
            expect(newMarkedKey).toBeNull();
            expect(model.getItemBySourceKey(2).isMarked()).toBe(false);
            expect(model.getItemBySourceKey(3).isMarked()).toBe(false);
        });
    });

    it('destroy', () => {
        controller.setMarkedKey(1);
        expect(model.getItemBySourceKey(1).isMarked()).toBe(true);

        controller.destroy();
        expect(model.getItemBySourceKey(1).isMarked()).toBe(false);
        expect(model.getItemBySourceKey(2).isMarked()).toBe(false);
        expect(model.getItemBySourceKey(3).isMarked()).toBe(false);
    });

    it('should work with breadcrumbs', () => {
        const items = new RecordSet({
            rawData: [
                {
                    id: 1,
                    parent: null,
                    nodeType: true,
                    title: 'test_node',
                },
                {
                    id: 2,
                    parent: 1,
                    nodeType: null,
                    title: 'test_leaf',
                },
                {
                    id: 3,
                    parent: null,
                    nodeType: true,
                    title: 'test_node',
                },
                {
                    id: 4,
                    parent: 3,
                    nodeType: null,
                    title: 'test_leaf',
                },
            ],
            keyProperty: 'id',
        });

        const model = new SearchGridCollection({
            collection: items,
            root: null,
            keyProperty: 'id',
            parentProperty: 'parent',
            nodeProperty: 'nodeType',
            columns: [{}],
        });

        const controller = new MarkerController({
            model,
            markerVisibility: 'visible',
            markedKey: 1,
        });
        let result = controller.calculateMarkedKeyForVisible();
        controller.setMarkedKey(result);
        expect(controller.getMarkedKey()).toEqual(2);

        result = controller.getNextMarkedKey();
        expect(result).toEqual(4);

        result = controller.getPrevMarkedKey();
        expect(result).toEqual(2);

        controller.setMarkedKey(4);
        result = controller.calculateMarkedKeyForVisible();
        expect(result).toEqual(4);

        controller.setMarkedKey(3);

        const breadcrumbItem = model.getItemBySourceKey(3);
        items.remove(breadcrumbItem.getContents()[0]);

        result = controller.onCollectionRemove(2, [breadcrumbItem]);
        // markedKey не должен пересчитаться, т.к. хлебная крошка не может быть маркирована
        // и ее удаление в этом случае ничего не значит
        expect(result).toEqual(3);
        expect(breadcrumbItem.isMarked()).toBe(false);

        controller.setMarkedKey(2);
        result = controller.onCollectionRemove(2, [model.getItemBySourceKey(2)]);
        expect(result).toEqual(2);
    });

    describe('shouldMoveMarkerOnScrollPaging', () => {
        it('by default', () => {
            const controller = new MarkerController({});
            expect(controller.shouldMoveMarkerOnScrollPaging()).toBe(true);
        });

        it('pass option is false', () => {
            const controller = new MarkerController({
                moveMarkerOnScrollPaging: false,
            });
            expect(controller.shouldMoveMarkerOnScrollPaging()).toBe(false);
        });

        it('pass option is true', () => {
            const controller = new MarkerController({
                moveMarkerOnScrollPaging: true,
            });
            expect(controller.shouldMoveMarkerOnScrollPaging()).toBe(true);
        });
    });

    describe('getMarkedKeyByDirection', () => {
        it('should return first item key if was not marked item', () => {
            expect(controller.getMarkedKeyByDirection()).toEqual(1);
        });
    });
});
