import { Controller as ItemActionsController } from 'Controls/itemActions';
import { IObservable } from 'Types/collection';
import { CollectionItem } from 'Controls/display';
import { Model } from 'Types/entity';

describe('Controls/itemActions/Controller/ShouldUpdateOnCollectionChange', () => {
    let itemActionsController: ItemActionsController;
    let newItems: CollectionItem<Model>[] & { properties: string };
    let removedItems: CollectionItem<Model>[] & { properties: string };

    beforeEach(() => {
        itemActionsController = new ItemActionsController();
        newItems = undefined;
        removedItems = undefined;
    });

    // CHANGE, newItems и removedItems не заданы. => TRUE
    it('ch, -newItems, -removedItems, =true', () => {
        const result = itemActionsController.shouldUpdateOnCollectionChange(
            IObservable.ACTION_CHANGE,
            newItems,
            removedItems
        );
        expect(result).toBe(true);
    });

    // ADD, newItems заданы, но без properties. removedItems не заданы. => TRUE
    it('a, +newItems, -newItems.properties, -removedItems, =true', () => {
        newItems = [{ SupportItemActions: true }] as undefined as CollectionItem<Model>[] & {
            properties: string;
        };
        const result = itemActionsController.shouldUpdateOnCollectionChange(
            IObservable.ACTION_ADD,
            newItems,
            removedItems
        );
        expect(result).toBe(true);
    });

    // REMOVE, newItems не заданы. removedItems заданы с IItemActionItem. => TRUE
    it('rm, -newItems, +removedItems +IItemActionItem, =true', () => {
        removedItems = [{ SupportItemActions: true }] as undefined as CollectionItem<Model>[] & {
            properties: string;
        };
        const result = itemActionsController.shouldUpdateOnCollectionChange(
            IObservable.ACTION_REMOVE,
            newItems,
            removedItems
        );
        expect(result).toBe(true);
    });

    // REMOVE, newItems не заданы. removedItems заданы без IItemActionItem. => FALSE
    it('rm, -newItems, +removedItems -IItemActionItem, =false', () => {
        removedItems = [{ SupportItemActions: false }] as undefined as CollectionItem<Model>[] & {
            properties: string;
        };
        const result = itemActionsController.shouldUpdateOnCollectionChange(
            IObservable.ACTION_REMOVE,
            newItems,
            removedItems
        );
        expect(result).toBe(false);
    });

    // ADD, newItems заданы без IItemActionItem. removedItems не заданы. => FALSE
    it('a, +newItems -IItemActionItem, -removedItems, =false', () => {
        newItems = [{ SupportItemActions: false }] as undefined as CollectionItem<Model>[] & {
            properties: string;
        };
        const result = itemActionsController.shouldUpdateOnCollectionChange(
            IObservable.ACTION_ADD,
            newItems,
            removedItems
        );
        expect(result).toBe(false);
    });

    // ADD, newItems заданы и без IItemActionItem и с IItemActionItem. removedItems не заданы. => TRUE
    it('a, +newItems -IItemActionItem & +IItemActionItem, -removedItems, =true', () => {
        newItems = [
            { SupportItemActions: false },
            { SupportItemActions: true },
        ] as undefined as CollectionItem<Model>[] & { properties: string };
        const result = itemActionsController.shouldUpdateOnCollectionChange(
            IObservable.ACTION_ADD,
            newItems,
            removedItems
        );
        expect(result).toBe(true);
    });

    // CHANGE, newItems заданы, валидные properties. removedItems не заданы. => TRUE
    it('ch, +newItems, +newItems.properties, -removedItems, =true', () => {
        newItems = [{ SupportItemActions: true }] as undefined as CollectionItem<Model>[] & {
            properties: string;
        };
        newItems.properties = 'actions';
        const result = itemActionsController.shouldUpdateOnCollectionChange(
            IObservable.ACTION_CHANGE,
            newItems,
            removedItems
        );
        expect(result).toBe(true);
    });

    // CHANGE, newItems заданы, невалидные properties. removedItems не заданы. => FALSE
    it('ch, +newItems, +newItems.properties invalid, -removedItems, =true', () => {
        newItems = [{ SupportItemActions: true }] as undefined as CollectionItem<Model>[] & {
            properties: string;
        };
        const propertyVariants = [
            'selected',
            'marked',
            'swiped',
            'hovered',
            'active',
            'dragged',
            'editingContents',
        ];
        propertyVariants.forEach((properties) => {
            newItems.properties = properties;
            const result = itemActionsController.shouldUpdateOnCollectionChange(
                IObservable.ACTION_CHANGE,
                newItems,
                removedItems
            );
            expect(result).toBe(false);
        });
    });
});
