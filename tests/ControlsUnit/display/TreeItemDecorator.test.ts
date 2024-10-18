import { TreeItem, TreeItemDecorator } from 'Controls/baseTree';

describe('Controls/baseTree:TreeItemDecorator', () => {
    describe('.getSource()', () => {
        it('should return undefined by default', () => {
            const item = new TreeItemDecorator();
            expect(item.getSource()).not.toBeDefined();
        });

        it('should return injected source', () => {
            const source = new TreeItem();
            const item = new TreeItemDecorator({ source });
            expect(item.getSource()).toBe(source);
        });
    });

    describe('.getOwner()', () => {
        it("should return source's owner", () => {
            const owner: any = {};
            const source = new TreeItem({ owner });
            const item = new TreeItemDecorator({ source });
            expect(item.getOwner()).toBe(owner);
        });
    });

    describe('.setOwner()', () => {
        it("should set source's owner", () => {
            const owner: any = {};
            const source = new TreeItem();
            const item = new TreeItemDecorator({ source });
            item.setOwner(owner);
            expect(source.getOwner()).toBe(owner);
        });
    });

    describe('.getContents()', () => {
        it("should return source's contents", () => {
            const contents: any = {};
            const source = new TreeItem({ contents });
            const item = new TreeItemDecorator({ source });
            expect(item.getContents()).toBe(contents);
        });
    });

    describe('.setContents()', () => {
        it("should set source's contents", () => {
            const contents: any = {};
            const source = new TreeItem();
            const item = new TreeItemDecorator({ source });
            item.setContents(contents);
            expect(source.getContents()).toBe(contents);
        });
    });

    describe('.getUid()', () => {
        it("should return source's uid", () => {
            const source = new TreeItem();
            const item = new TreeItemDecorator({ source });
            expect(item.getUid()).toBe(source.getUid());
        });
    });

    describe('.isSelected()', () => {
        it('should return source is selected', () => {
            const selected = true;
            const source = new TreeItem({ selected });
            const item = new TreeItemDecorator({ source });
            expect(item.isSelected()).toBe(selected);
        });
    });

    describe('.setSelected()', () => {
        it('should set source is selected', () => {
            const selected = true;
            const source = new TreeItem();
            const item = new TreeItemDecorator({ source });
            item.setSelected(selected);
            expect(source.isSelected()).toBe(selected);
        });
    });

    describe('.getRoot()', () => {
        it("should return source's root", () => {
            const source = new TreeItem();
            const item = new TreeItemDecorator({ source });
            expect(item.getRoot()).toBe(source.getRoot());
        });
    });

    describe('.isRoot()', () => {
        it('should return source is root', () => {
            const source = new TreeItem();
            const item = new TreeItemDecorator({ source });
            expect(item.isRoot()).toBe(source.isRoot());
        });
    });

    describe('.isNode()', () => {
        it('should return source is node', () => {
            const node = true;
            const source = new TreeItem({ node });
            const item = new TreeItemDecorator({ source });
            expect(item.isNode()).toBe(node);
        });
    });

    describe('.isExpanded()', () => {
        it('should return source is expanded', () => {
            const expanded = true;
            const source = new TreeItem({ expanded });
            const item = new TreeItemDecorator({ source });
            expect(item.isExpanded()).toBe(expanded);
        });
    });

    describe('.setExpanded()', () => {
        it('should set source is expanded', () => {
            const expanded = true;
            const source = new TreeItem();
            const item = new TreeItemDecorator({ source });
            item.setExpanded(expanded);
            expect(source.isExpanded()).toBe(expanded);
        });
    });

    describe('.toggleExpanded()', () => {
        it("should toggles source's expanded", () => {
            const source = new TreeItem();
            const item = new TreeItemDecorator({ source });
            item.toggleExpanded();
            expect(source.isExpanded()).toBe(item.isExpanded());
            item.toggleExpanded();
            expect(source.isExpanded()).toBe(item.isExpanded());
        });
    });

    describe('.hasChildren()', () => {
        it('should return source has children', () => {
            const hasChildren = true;
            const contents = { hasChildren };
            const source = new TreeItem({
                contents,
                hasChildrenProperty: 'hasChildren',
            });
            const item = new TreeItemDecorator({ source });
            expect(item.hasChildren()).toBe(hasChildren);
        });
    });

    describe('.getChildrenProperty()', () => {
        it("should return source's children property", () => {
            const childrenProperty = 'foo';
            const source = new TreeItem({ childrenProperty });
            const item = new TreeItemDecorator({ source });
            expect(item.getChildrenProperty()).toBe(childrenProperty);
        });
    });
});
