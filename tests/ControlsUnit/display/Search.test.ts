import { BreadcrumbsItem, Search } from 'Controls/baseTree';

describe('Controls/_display/Search', () => {
    describe('.each()', () => {
        it('should group breadcumbs in one item', () => {
            const items = [
                {
                    id: 'A',
                    pid: '+',
                    node: true,
                },
                {
                    id: 'AA',
                    pid: 'A',
                    node: true,
                },
                {
                    id: 'AAa',
                    pid: 'AA',
                    node: false,
                },
                {
                    id: 'AB',
                    pid: 'A',
                    node: true,
                },
                {
                    id: 'ABa',
                    pid: 'AB',
                    node: false,
                },
                {
                    id: 'AC',
                    pid: 'A',
                    node: true,
                },
                {
                    id: 'B',
                    pid: '+',
                    node: true,
                },
                {
                    id: 'Ba',
                    pid: 'B',
                    node: false,
                },
                {
                    id: 'C',
                    pid: '+',
                    node: true,
                },
            ];
            const search = new Search({
                collection: items,
                root: { id: '+' },
                keyProperty: 'id',
                parentProperty: 'pid',
                nodeProperty: 'node',
            });
            const expected = [
                ['A', 'AA'],
                'AAa',
                ['A', 'AB'],
                'ABa',
                ['A', 'AC'],
                ['B'],
                'Ba',
                ['C'],
            ];

            expect(search.getCount()).toEqual(expected.length);

            search.each((item, index) => {
                if (item instanceof BreadcrumbsItem) {
                    expect(
                        (item.getContents() as any).map((i) => {
                            return i.id;
                        })
                    ).toEqual(expected[index]);
                } else {
                    expect(item.getContents().id).toEqual(expected[index]);
                }
            });
        });

        it('should build full path for breadcrumbs in unique mode', () => {
            const items = [
                {
                    id: 'A',
                    pid: '+',
                    node: true,
                },
                {
                    id: 'AA',
                    pid: 'A',
                    node: true,
                },
                {
                    id: 'AAA',
                    pid: 'AA',
                    node: true,
                },
                {
                    id: 'AAAa',
                    pid: 'AAA',
                },
                {
                    id: 'AA',
                    pid: 'A',
                    node: true,
                },
                {
                    id: 'AAB',
                    pid: 'AA',
                    node: true,
                },
                {
                    id: 'AABa',
                    pid: 'AAB',
                },
            ];
            const search = new Search({
                collection: items,
                root: { id: '+' },
                unique: true,
                keyProperty: 'id',
                parentProperty: 'pid',
                nodeProperty: 'node',
            });
            const expected = [
                ['A', 'AA', 'AAA'],
                'AAAa',
                ['A', 'AA', 'AAB'],
                'AABa',
            ];

            expect(search.getCount()).toEqual(expected.length);

            search.each((item, index) => {
                if (item instanceof BreadcrumbsItem) {
                    expect(
                        (item.getContents() as any).map((i) => {
                            return i.id;
                        })
                    ).toEqual(expected[index]);
                } else {
                    expect(item.getContents().id).toEqual(expected[index]);
                }
            });
        });
    });

    describe('.getNext()', () => {
        it('should skip RootSeparatorItem', () => {
            const items = [
                {
                    id: 'A',
                    pid: '+',
                    node: true,
                },
                {
                    id: 'AA',
                    pid: 'A',
                    node: true,
                },
                {
                    id: 'AAA',
                    pid: 'AA',
                    node: true,
                },
                {
                    id: 'AAAa',
                    pid: 'AAA',
                },
                {
                    id: 'AAAb',
                    pid: 'AAA',
                },
                {
                    id: 'AAB',
                    pid: 'AA',
                    node: true,
                },
                {
                    id: 'AAC',
                    pid: 'AA',
                    node: true,
                },
                {
                    id: 'AACa',
                    pid: 'AAC',
                },
                {
                    id: 'AAD',
                    pid: 'AA',
                    node: true,
                },
                {
                    id: 'B',
                    pid: '+',
                    node: true,
                },
                {
                    id: 'C',
                    pid: '+',
                    node: true,
                },
                {
                    id: 'd',
                    pid: '+',
                },
                {
                    id: 'e',
                    pid: '+',
                },
            ];

            const search = new Search({
                collection: items,
                root: { id: '+' },
                unique: true,
                keyProperty: 'id',
                parentProperty: 'pid',
                nodeProperty: 'node',
            });
            let item = search.at(1); // id = AAAa (first item after breadcrumb)
            expect(search.getNext(item).getContents().id).toBe('AAAb');

            item = search.at(8); // id = C
            expect(search.getNext(item).getContents().id).toBe('d');
        });
    });

    describe('.getPrevious()', () => {
        it('should skip RootSeparatorItem', () => {
            const items = [
                {
                    id: 'A',
                    pid: '+',
                    node: true,
                },
                {
                    id: 'AA',
                    pid: 'A',
                    node: true,
                },
                {
                    id: 'AAA',
                    pid: 'AA',
                    node: true,
                },
                {
                    id: 'AAAa',
                    pid: 'AAA',
                },
                {
                    id: 'AAAb',
                    pid: 'AAA',
                },
                {
                    id: 'AAB',
                    pid: 'AA',
                    node: true,
                },
                {
                    id: 'AAC',
                    pid: 'AA',
                    node: true,
                },
                {
                    id: 'AACa',
                    pid: 'AAC',
                },
                {
                    id: 'AAD',
                    pid: 'AA',
                    node: true,
                },
                {
                    id: 'B',
                    pid: '+',
                    node: true,
                },
                {
                    id: 'C',
                    pid: '+',
                    node: true,
                },
                {
                    id: 'd',
                    pid: '+',
                },
                {
                    id: 'e',
                    pid: '+',
                },
            ];

            const search = new Search({
                collection: items,
                root: { id: '+' },
                unique: true,
                keyProperty: 'id',
                parentProperty: 'pid',
                nodeProperty: 'node',
            });

            let item = search.at(5); // id = AACa
            // previous item is breadcrumb. parents are different, that's why search.getPrevious(item) is undefined
            expect(search.getPrevious(item)).toBeUndefined();

            item = search.at(10); // id = d
            expect(search.getPrevious(item).getContents().id).not.toBeDefined();
        });
    });
});
