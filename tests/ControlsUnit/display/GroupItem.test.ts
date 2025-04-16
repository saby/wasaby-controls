import { GroupItem } from 'Controls/display';

describe('Controls/_display/GroupItem', () => {
    const getOwnerMock = () => {
        return {
            lastChangedItem: undefined,
            lastChangedProperty: undefined,
            notifyItemChange(item: GroupItem<string>, property: string): void {
                this.lastChangedItem = item;
                this.lastChangedProperty = property;
            },
        };
    };

    describe('.isExpanded()', () => {
        it('should return true by default', () => {
            const item = new GroupItem();
            expect(item.isExpanded()).toBe(true);
        });

        it('should return value passed to the constructor', () => {
            const item = new GroupItem({ expanded: false });
            expect(item.isExpanded()).toBe(false);
        });
    });

    describe('.setExpanded()', () => {
        it('should set the new value', () => {
            const item = new GroupItem();

            item.setExpanded(false);
            expect(item.isExpanded()).toBe(false);

            item.setExpanded(true);
            expect(item.isExpanded()).toBe(true);
        });

        it('should notify owner if changed', () => {
            const owner = getOwnerMock();
            const item = new GroupItem({
                owner: owner as any,
            });

            item.setExpanded(false);

            expect(owner.lastChangedItem).toBe(item);
            expect(owner.lastChangedProperty).toBe('expanded');
        });

        it('should not notify owner if changed in silent mode', () => {
            const owner = getOwnerMock();
            const item = new GroupItem({
                owner: owner as any,
            });

            item.setExpanded(false, true);

            expect(owner.lastChangedItem).not.toBeDefined();
            expect(owner.lastChangedProperty).not.toBeDefined();
        });
    });

    describe('.toggleExpanded()', () => {
        it('should toggle the value', () => {
            const item = new GroupItem();

            item.toggleExpanded();
            expect(item.isExpanded()).toBe(false);

            item.toggleExpanded();
            expect(item.isExpanded()).toBe(true);
        });
    });

    describe('isSticked', () => {
        it('sticky enabled', () => {
            const owner = {
                isStickyGroup: () => {
                    return true;
                },
            };
            const item = new GroupItem({ owner });
            expect(item.isSticked()).toBe(true);
        });

        it('sticky disabled', () => {
            const owner = {
                isStickyGroup: () => {
                    return false;
                },
            };
            const item = new GroupItem({ owner });
            expect(item.isSticked()).toBe(false);
        });

        it('hidden group', () => {
            const owner = {
                isStickyGroup: () => {
                    return true;
                },
            };
            const item = new GroupItem({
                owner,
                contents: 'CONTROLS_HIDDEN_GROUP',
            });
            expect(item.isSticked()).toBe(false);
        });
    });

    describe('ActivatableItem', () => {
        it('group is activatable', () => {
            const owner = {
                isStickyGroup: () => {
                    return false;
                },
            };
            const item = new GroupItem({ owner, contents: 'group1' });
            expect(item.ActivatableItem).toBe(true);
        });

        it('hidden group is not activatable', () => {
            const owner = {
                isStickyGroup: () => {
                    return false;
                },
            };
            const item = new GroupItem({
                owner,
                contents: 'CONTROLS_HIDDEN_GROUP',
            });
            expect(item.ActivatableItem).toBe(false);
        });
    });
});
