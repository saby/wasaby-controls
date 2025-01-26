import { GridGroupRow as GroupItem } from 'Controls/grid';
import { getGridCollectionMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/_display/grid/GroupItem', () => {
    describe('isSticked', () => {
        it('sticky enabled', () => {
            const item = new GroupItem({
                owner: getGridCollectionMock({
                    gridColumnsConfig: [],
                    isStickyGroup: true,
                }),
            });
            expect(item.isSticked()).toBe(true);
        });

        it('sticky disabled', () => {
            const item = new GroupItem({
                owner: getGridCollectionMock({
                    gridColumnsConfig: [],
                    isStickyGroup: false,
                }),
            });
            expect(item.isSticked()).toBe(false);
        });

        it('hidden group', () => {
            const item = new GroupItem({
                owner: getGridCollectionMock({
                    gridColumnsConfig: [],
                    isStickyGroup: true,
                }),
                contents: 'CONTROLS_HIDDEN_GROUP',
            });
            expect(item.isSticked()).toBe(false);
        });
    });
});
