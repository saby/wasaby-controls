import { TreeItem } from 'Controls/baseTree';
import { BreadcrumbsItem } from 'Controls/baseTree';

describe('Controls/baseTree:BreadcrumbsItem', () => {
    describe('.getContents()', () => {
        it('should return tree branch', () => {
            const items = [];
            items[0] = new TreeItem({
                contents: 'a',
            });
            items[1] = new TreeItem({
                parent: items[0],
                contents: 'b',
            });
            items[2] = new TreeItem({
                parent: items[1],
                contents: 'c',
            });
            const expected = [['a'], ['a', 'b'], ['a', 'b', 'c']];

            items.forEach((item, index) => {
                const bcItem = new BreadcrumbsItem({
                    last: item,
                });
                expect(bcItem.getContents()).toEqual(expected[index]);
            });
        });

        it('should return tree branch with root', () => {
            const root = new TreeItem({
                contents: 'root',
            });
            const owner = {
                getRoot: () => {
                    return null;
                },
            };
            const item = new TreeItem({
                parent: root,
                contents: 'a',
            });
            const bcItem = new BreadcrumbsItem<string[] | string>({
                owner: owner as any,
                last: item,
            });
            expect(bcItem.getContents()).toEqual(['root', 'a']);
        });

        it('should return tree branch without root', () => {
            const root = new TreeItem({
                contents: 'root',
            });
            const owner = {
                getRoot: () => {
                    return root;
                },
            };
            const item = new TreeItem({
                parent: root,
                contents: 'a',
            });
            const bcItem = new BreadcrumbsItem<string[] | string>({
                owner: owner as any,
                last: item,
            });
            expect(bcItem.getContents()).toEqual(['a']);
        });
    });

    describe('.getLevel()', () => {
        it('should return 0 by default', () => {
            const item = new BreadcrumbsItem();
            expect(item.getLevel()).toBe(0);
        });

        it('should start counter with value given by getRootLevel() method', () => {
            const owner: any = {
                getRoot: () => {
                    return root;
                },
                getRootLevel: () => {
                    return 3;
                },
            };
            const root = new TreeItem({
                contents: 'root',
                owner,
            });
            const last = new TreeItem({
                owner,
                parent: root,
                contents: 'last',
            });
            const item = new BreadcrumbsItem({
                owner,
                last,
            });
            expect(root.getLevel()).toBe(3);
            expect(item.getLevel()).toBe(4);
        });
    });

    describe('.isRoot()', () => {
        it('be default false', () => {
            const item = new BreadcrumbsItem();
            expect(item.isRoot()).toBe(false);
        });
    });
});
