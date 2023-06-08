import {
    Controller as ItemActionsController,
    IControllerOptions,
} from 'Controls/_itemActions/Controller';
import { Collection } from 'Controls/display';
import { RecordSet } from 'Types/collection';

describe('Controls/itemActions/Controller/EditInPlace', () => {
    let collection: Collection;

    const defaultControllerOptions = {
        editingItem: null,
        collection: null,
        itemActions: [{ id: 'action1' }, { id: 'action2' }],
        itemActionsProperty: null,
        visibilityCallback: null,
        itemActionsPosition: null,
        style: null,
        theme: 'default',
        actionAlignment: null,
        actionCaptionPosition: null,
        editingToolbarVisible: false,
        editArrowAction: null,
        editArrowVisibilityCallback: null,
        contextMenuConfig: null,
        iconSize: 'm',
        editingItem: null,
        itemActionsVisibility: 'onhover',
        actionMode: 'strict',
    };

    function initController(options: IControllerOptions): ItemActionsController {
        const controller = new ItemActionsController();
        // @ts-ignore
        controller.update({
            ...defaultControllerOptions,
            ...options,
        });
        return controller;
    }

    beforeEach(() => {
        collection = new Collection({
            collection: new RecordSet({
                rawData: [{ key: 1 }, { key: 2 }, { key: 3 }, { key: 4 }],
                keyProperty: 'key',
            }),
        });
    });

    it('set EIP, should update version only for editing item', () => {
        const controller = initController({ collection });

        collection.at(1).setEditing(true);
        controller.update({
            ...defaultControllerOptions,
            collection,
            editingItem: collection.at(1),
        });

        expect(collection.at(0).getVersion()).toEqual(1);
        expect(collection.at(1).getVersion()).toEqual(2);
        expect(collection.at(2).getVersion()).toEqual(1);
        expect(collection.at(3).getVersion()).toEqual(1);
    });

    it('unset EIP, should update version only for editing item', () => {
        // start editing
        collection.at(1).setEditing(true);
        const controller = initController({
            collection,
            editingItem: collection.at(1),
        });

        // stop editing
        collection.at(1).setEditing(false);
        controller.update({
            ...defaultControllerOptions,
            collection,
        });

        expect(collection.at(0).getVersion()).toEqual(1);
        expect(collection.at(1).getVersion()).toEqual(3);
        expect(collection.at(2).getVersion()).toEqual(1);
        expect(collection.at(3).getVersion()).toEqual(1);
    });

    it('set EIP, + change visibility, should update version only for editing item', () => {
        const controller = initController({ collection });

        collection.at(1).setEditing(true);
        controller.update({
            ...defaultControllerOptions,
            visibilityCallback: (action, item, isEditing) => {
                return !isEditing;
            },
            collection,
        });

        expect(collection.at(0).getVersion()).toEqual(1);
        expect(collection.at(1).getVersion()).toEqual(3);
        expect(collection.at(2).getVersion()).toEqual(1);
        expect(collection.at(3).getVersion()).toEqual(1);
    });

    it('change EIP record, should update version only for editing items', () => {
        const controller = initController({ collection });

        collection.at(1).setEditing(true);
        controller.update({
            ...defaultControllerOptions,
            collection,
            editingItem: collection.at(1),
        });
        collection.at(1).setEditing(false);

        collection.at(2).setEditing(true);
        controller.update({
            ...defaultControllerOptions,
            collection,
            editingItem: collection.at(2),
        });

        expect(collection.at(0).getVersion()).toEqual(1);
        expect(collection.at(1).getVersion()).toEqual(3);
        expect(collection.at(2).getVersion()).toEqual(2);
        expect(collection.at(3).getVersion()).toEqual(1);
    });

    it('set EIP + editingItem changed, should not update actionsTemplateConfig on model', () => {
        const spySetActionsTemplateConfig = jest
            .spyOn(collection, 'setActionsTemplateConfig')
            .mockClear();

        expect(collection.getVersion()).toEqual(0);
        const controller = initController({ collection });

        expect(collection.getVersion()).toEqual(1);
        const actionsTemplateConfig = {
            ...collection.getActionsTemplateConfig(undefined),
        };

        collection.at(1).setEditing(true);
        controller.update({
            ...defaultControllerOptions,
            collection,
            editingItem: collection.at(1),
        });

        expect(spySetActionsTemplateConfig).toHaveBeenCalledTimes(2);

        // сам setActionsTemplateConfig не меняет версию, раньше тут было бы 4
        expect(collection.getVersion()).toEqual(2);
        expect(actionsTemplateConfig).toEqual(collection.getActionsTemplateConfig(undefined));
    });
});
