import { ControllerClass } from 'Controls/operations';

describe('Controls/operations:ControllerClass', () => {
    let controller;
    beforeEach(() => {
        controller = new ControllerClass({});
    });

    describe('setListMarkedKey', () => {
        it('setListMarkedKey, operations panel is hidden', () => {
            controller.setOperationsPanelVisible(false);
            expect(controller.setListMarkedKey('testKey')).toBeNull();
        });

        it('setListMarkedKey, operations panel is visible', () => {
            controller.setOperationsPanelVisible(true);
            expect(controller.setListMarkedKey('testKey')).toBe('testKey');
        });
    });

    describe('setOperationsPanelVisible', () => {
        it('setOperationsPanelVisible, panel is hidden', () => {
            controller.setOperationsPanelVisible(false);

            controller.setListMarkedKey('testKey');
            expect(controller.setOperationsPanelVisible(true)).toBe('testKey');
        });
    });

    describe('updateSelectedKeys', () => {
        it('updateSelectedKeys, two lists', () => {
            controller.updateSelectedKeys(['testKey1'], ['testKey1'], [], 'testListId1');
            expect(
                controller.updateSelectedKeys(['testKey2'], ['testKey2'], [], 'testListId2')
            ).toEqual(['testKey1', 'testKey2']);
            expect(controller.getSelectedKeysByLists()).toEqual({
                testListId1: ['testKey1'],
                testListId2: ['testKey2'],
            });
        });

        it('updateSelectedKeys', () => {
            const oldKeys = controller.updateSelectedKeys(
                ['testKey1'],
                ['testKey1'],
                [],
                'testListId1'
            );
            const newKeys = controller.updateSelectedKeys(
                ['testKey2'],
                ['testKey2'],
                [],
                'testListId1'
            );
            expect(newKeys).toEqual(['testKey1', 'testKey2']);
            expect(oldKeys).not.toBe(newKeys);

            const isAllSelected = controller.updateSelectedKeys(
                [null, 123, 1234],
                [null, 123],
                [],
                'testListId1'
            );
            expect(isAllSelected).toEqual([null]);
        });
    });

    describe('updateExcludedKeys', () => {
        it('updateExcludedKeys, two lists', () => {
            controller.updateExcludedKeys(['testKey1'], ['testKey1'], [], 'testListId1');
            expect(
                controller.updateExcludedKeys(['testKey2'], ['testKey2'], [], 'testListId2')
            ).toEqual(['testKey1', 'testKey2']);
            expect(controller.getExcludedKeysByLists()).toEqual({
                testListId1: ['testKey1'],
                testListId2: ['testKey2'],
            });
        });
    });

    describe('updateSelectedKeysCount', () => {
        it('updateSelectedKeysCount, two lists', () => {
            controller.updateSelectedKeysCount(10, false, 'testListId1');
            controller.updateSelectedKeysCount(5, true, 'testListId2');
            expect(controller.updateSelectedKeysCount(5, true, 'testListId2')).toEqual({
                count: 15,
                isAllSelected: false,
            });
        });
    });

    describe('update', () => {
        it('notify selection changed', () => {
            let resultSelection = [];
            controller._notify = (e, selection) => {
                resultSelection = selection;
            };
            const expectedSelection = {
                selected: [1],
                excluded: [2],
            };
            controller.update({
                selectedKeys: expectedSelection.selected,
                excludedKeys: expectedSelection.excluded,
            });
            expect(resultSelection).toEqual(expectedSelection);
        });
    });
});
