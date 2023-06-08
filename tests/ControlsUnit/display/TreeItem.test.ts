import { TreeItem } from 'Controls/baseTree';
import { CssClassesAssert } from 'ControlsUnit/CustomAsserts';
import { TreeChildren } from 'Controls/baseTree';

describe('Controls/_display/TreeItem', () => {
    const Owner = function (): void {
        this.lastChangedItem = undefined;
        this.lastChangedProperty = undefined;
        this.notifyItemChange = (item, property) => {
            this.lastChangedItem = item;
            this.lastChangedProperty = property;
        };
    };

    const getOwnerMock = () => {
        return new Owner();
    };

    describe('.getParent()', () => {
        it('should return undefined by default', () => {
            const item = new TreeItem();
            expect(item.getParent()).not.toBeDefined();
        });

        it('should return value passed to the constructor', () => {
            const parent = new TreeItem();
            const item = new TreeItem({ parent });

            expect(item.getParent()).toBe(parent);
        });
    });

    describe('.getRoot()', () => {
        it('should return itself by default', () => {
            const item = new TreeItem();
            expect(item.getRoot()).toBe(item);
        });

        it('should return root of the parent', () => {
            const parent = new TreeItem();
            const item = new TreeItem({ parent });

            expect(item.getRoot()).toBe(parent.getRoot());
        });
    });

    describe('.isRoot()', () => {
        it('should return true by default', () => {
            const item = new TreeItem();
            expect(item.isRoot()).toBe(true);
        });

        it('should return false if has parent', () => {
            const parent = new TreeItem();
            const item = new TreeItem({ parent });

            expect(item.isRoot()).toBe(false);
        });
    });

    describe('.getLevel()', () => {
        it('should return 0 by default', () => {
            const item = new TreeItem();
            expect(item.getLevel()).toBe(0);
        });

        it('should return value differs by +1 from the parent', () => {
            const root = new TreeItem();
            const level1 = new TreeItem({ parent: root });
            const level2 = new TreeItem({ parent: level1 });

            expect(root.getLevel()).toBe(0);
            expect(level1.getLevel()).toBe(root.getLevel() + 1);
            expect(level2.getLevel()).toBe(level1.getLevel() + 1);
        });

        it('should start counter with value given by getRootLevel() method', () => {
            const rootLevel = 3;
            const OwnerWithRoot = function (): void {
                this.getRoot = () => {
                    return root;
                };
                this.getRootLevel = () => {
                    return rootLevel;
                };
            };
            const owner = new OwnerWithRoot();
            const root = new TreeItem({ owner });
            const level1 = new TreeItem({
                parent: root,
                owner,
            });
            const level2 = new TreeItem({
                parent: level1,
                owner,
            });

            expect(root.getLevel()).toBe(rootLevel);
            expect(level1.getLevel()).toBe(root.getLevel() + 1);
            expect(level2.getLevel()).toBe(level1.getLevel() + 1);
        });
    });

    describe('.isNode()', () => {
        it('should return null by default', () => {
            const item = new TreeItem({ parent: new TreeItem({}) });
            expect(item.isNode()).toBeNull();
        });

        it('should return value passed to the constructor', () => {
            const item = new TreeItem({ node: true });
            expect(item.isNode()).toBe(true);
        });
    });

    describe('.isExpanded()', () => {
        it('should return true by default', () => {
            // мы всегда прокидываем значение, поэтому не важно какое оно по дефолту
            const item = new TreeItem();
            expect(item.isExpanded()).toBe(true);
        });

        it('should return value passed to the constructor', () => {
            const item = new TreeItem({ expanded: true });
            expect(item.isExpanded()).toBe(true);
        });
    });

    describe('.setExpanded()', () => {
        it('should set the new value', () => {
            const item = new TreeItem();

            item.setExpanded(true);
            expect(item.isExpanded()).toBe(true);

            item.setExpanded(false);
            expect(item.isExpanded()).toBe(false);
        });

        it('should notify owner if changed', () => {
            const owner = getOwnerMock();
            const item = new TreeItem({
                owner,
                expanded: false,
            });

            item.setExpanded(true);

            expect(owner.lastChangedItem).toBe(item);
            expect(owner.lastChangedProperty).toBe('expanded');
        });

        it('should not notify owner if changed in silent mode', () => {
            const owner = getOwnerMock();
            const item = new TreeItem({
                owner,
            });

            item.setExpanded(true, true);

            expect(owner.lastChangedItem).not.toBeDefined();
            expect(owner.lastChangedProperty).not.toBeDefined();
        });
    });

    describe('.toggleExpanded()', () => {
        it('should toggle the value', () => {
            const item = new TreeItem({ expanded: false });

            item.toggleExpanded();
            expect(item.isExpanded()).toBe(true);

            item.toggleExpanded();
            expect(item.isExpanded()).toBe(false);
        });
    });

    describe('.hasChildren()', () => {
        it('should return false by default', () => {
            const item = new TreeItem({
                expanded: false,
                parent: new TreeItem({}),
            });
            expect(item.hasChildren()).toBe(false);
        });

        it('should return false for expanded node without childrens', () => {
            const mockedOwner = {
                getChildren: () => {
                    return new TreeChildren({
                        owner: new TreeItem({}),
                        items: [],
                    });
                },
            };
            const item = new TreeItem({
                expanded: true,
                owner: mockedOwner,
                parent: new TreeItem({}),
            });
            expect(item.hasChildren()).toBe(false);
        });
    });

    describe('.getChildrenProperty()', () => {
        it('should return na empty string by default', () => {
            const item = new TreeItem();
            expect(item.getChildrenProperty()).toBe('');
        });

        it('should return value passed to the constructor', () => {
            const name = 'test';
            const item = new TreeItem({ childrenProperty: name });

            expect(item.getChildrenProperty()).toBe(name);
        });
    });

    // TODO используются методы _getOptions из миксина OptionsToProperty. Разкоментировать когда будет актуально
    /*
        describe('.toJSON()', () => {
            it('should serialize the tree item', () => {
                const item = new TreeItem();
                const json = item.toJSON();
                const options = (item as any)._getOptions();

                delete options.owner;

                expect(json.module).toBe('Controls/display:TreeItem');
                expect(json.state.$options).toEqual(options);
            });
        });
    */

    describe('.getWrapperClasses()', () => {
        it('should return classes for border if isDragTargetNode', () => {
            const owner = {
                getHoverBackgroundStyle: () => {
                    return null;
                },
                getEditingBackgroundStyle: () => {
                    return null;
                },
                isDragging: () => {
                    return true;
                },
                isFirstItem: () => {
                    return false;
                },
                isLastItem: () => {
                    return false;
                },
                getNavigation: () => {
                    return {};
                },
            };
            const item = new TreeItem({ owner });
            item.setDragTargetNode(true);

            const classes = item.getWrapperClasses();

            CssClassesAssert.include(
                classes,
                'controls-TreeGridView__dragTargetNode'
            );
            CssClassesAssert.include(
                classes,
                'controls-TreeGridView__dragTargetNode_first'
            );
            CssClassesAssert.include(
                classes,
                'controls-TreeGridView__dragTargetNode_last'
            );
        });
    });
});
