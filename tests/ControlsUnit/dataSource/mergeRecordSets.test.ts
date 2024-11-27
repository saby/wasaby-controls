import type { Direction, TKey } from 'Controls/interface';

import { RecordSetDiffer, calculateAddItemsChanges } from 'Controls/dataSource';
import { RecordSet } from 'Types/collection';

let skipRemoveDuplicates = false;

describe('Controls/dataSource:ItemsChangesResolver', () => {
    for (const [_skipRemoveDuplicates, description] of [
        [false, 'with collision resolution'],
        [false, 'without collision resolution'],
    ] as const) {
        describe(description, () => {
            beforeEach(() => {
                skipRemoveDuplicates = _skipRemoveDuplicates;
            });

            test('should correctly merge RecordSet-s without collisions with the "down" direction [append]', () => {
                const items = mergeRecordSets(
                    'id',
                    [
                        { id: 1, value: 'first' },
                        { id: 2, value: 'second' },
                        { id: 3, value: 'third' },
                    ],
                    [
                        { id: 4, value: 'fourth' },
                        { id: 5, value: 'fifth' },
                    ],
                    'down'
                );

                expect(items.getRawData(true)).toEqual([
                    { id: 1, value: 'first' },
                    { id: 2, value: 'second' },
                    { id: 3, value: 'third' },
                    { id: 4, value: 'fourth' },
                    { id: 5, value: 'fifth' },
                ]);
            });

            test('should correctly merge RecordSet-s without collisions with the "up" direction [prepend]', () => {
                const items = mergeRecordSets(
                    'id',
                    [
                        { id: 1, value: 'first' },
                        { id: 2, value: 'second' },
                        { id: 3, value: 'third' },
                    ],
                    [
                        { id: -1, value: 'minus first' },
                        { id: 0, value: 'zero' },
                    ],
                    'up'
                );

                expect(items.getRawData(true)).toEqual([
                    { id: -1, value: 'minus first' },
                    { id: 0, value: 'zero' },
                    { id: 1, value: 'first' },
                    { id: 2, value: 'second' },
                    { id: 3, value: 'third' },
                ]);
            });

            test('should correctly merge the nested RecordSet [merge]', () => {
                const items = mergeRecordSets(
                    'id',
                    [
                        { id: 10, value: 'first' },
                        { id: 20, value: 'second', children: new RecordSet() },
                        { id: 30, value: 'third' },
                    ],
                    [
                        { id: 21, value: 'second.first' },
                        { id: 22, value: 'second.second' },
                    ],
                    undefined,
                    20,
                    null,
                    'children'
                );

                expect(items.getRawData(true)).toEqual([
                    { id: 10, value: 'first' },
                    {
                        id: 20,
                        value: 'second',
                        children: [
                            { id: 21, value: 'second.first' },
                            { id: 22, value: 'second.second' },
                        ],
                    },
                    { id: 30, value: 'third' },
                ]);
            });

            test('should correctly one RecordSet to another [assign]', () => {
                const items = mergeRecordSets(
                    'id',
                    [
                        { id: 10, value: 'first' },
                        { id: 20, value: 'second' },
                        { id: 30, value: 'third' },
                    ],
                    [
                        { id: 11, value: 'new first' },
                        { id: 21, value: 'new second' },
                        { id: 31, value: 'new third' },
                    ]
                );

                expect(items.getRawData(true)).toEqual([
                    { id: 11, value: 'new first' },
                    { id: 21, value: 'new second' },
                    { id: 31, value: 'new third' },
                ]);
            });
        });
    }
});

/* Simple merges */
describe('Controls/dataSource:ItemsChangesResolver', () => {
    describe('with collision resolution', () => {
        beforeEach(() => {
            skipRemoveDuplicates = false;
        });

        test('should correctly merge RecordSet-s with simple collisions with the "down" direction [append, remove]', () => {
            const items = mergeRecordSets(
                'id',
                [
                    { id: 1, value: 'first' },
                    { id: 2, value: 'second' },
                    { id: 3, value: 'third' },
                ],
                [
                    { id: 3, value: 'third(new)' },
                    { id: 4, value: 'fourth' },
                    { id: 5, value: 'fifth' },
                ],
                'down'
            );

            expect(items.getRawData(true)).toEqual([
                { id: 1, value: 'first' },
                { id: 2, value: 'second' },
                { id: 3, value: 'third(new)' },
                { id: 4, value: 'fourth' },
                { id: 5, value: 'fifth' },
            ]);
        });

        test('should correctly merge RecordSet-s with simple collisions with the "up" direction [prepend, remove]', () => {
            const items = mergeRecordSets(
                'id',
                [
                    { id: 1, value: 'first' },
                    { id: 2, value: 'second' },
                    { id: 3, value: 'third' },
                ],
                [
                    { id: -1, value: 'minus first' },
                    { id: 0, value: 'zero' },
                    { id: 1, value: 'first(new)' },
                ],
                'up'
            );

            expect(items.getRawData(true)).toEqual([
                { id: -1, value: 'minus first' },
                { id: 0, value: 'zero' },
                { id: 1, value: 'first(new)' },
                { id: 2, value: 'second' },
                { id: 3, value: 'third' },
            ]);
        });
    });
});

/* Advanced merges */
describe('Controls/dataSource:ItemsChangesResolver', () => {
    describe('with collision resolution', () => {
        beforeEach(() => {
            skipRemoveDuplicates = false;
        });

        test('should correctly merge RecordSet-s with advanced collisions with the "up" direction [prepend, remove]', () => {
            const items = mergeRecordSets(
                'id',
                [
                    { id: 1, value: 'first' },
                    { id: 2, value: 'second' },
                    { id: 3, value: 'third' },
                    { id: 4, value: 'fourth' },
                    { id: 5, value: 'fifth' },
                ],
                [
                    { id: -1, value: 'minus first' },
                    { id: 0, value: 'zero' },
                    { id: 1, value: 'first(new)' },
                    { id: 11, value: '---' },
                    { id: 3, value: 'third(new)' },
                    { id: 12, value: '---' },
                ],
                'up'
            );

            expect(items.getRawData(true)).toEqual([
                { id: -1, value: 'minus first' },
                { id: 0, value: 'zero' },
                { id: 1, value: 'first(new)' },
                { id: 11, value: '---' },
                { id: 3, value: 'third(new)' },
                { id: 12, value: '---' },
                { id: 2, value: 'second' },
                { id: 4, value: 'fourth' },
                { id: 5, value: 'fifth' },
            ]);
        });

        test('should correctly merge RecordSet-s with advanced collisions with the "down" direction [append, remove]', () => {
            const items = mergeRecordSets(
                'id',
                [
                    { id: 1, value: 'first' },
                    { id: 2, value: 'second' },
                    { id: 3, value: 'third' },
                    { id: 4, value: 'fourth' },
                    { id: 5, value: 'fifth' },
                ],
                [
                    { id: 6, value: 'sixth' },
                    { id: 2, value: 'second(new)' },
                    { id: 7, value: 'seventh' },
                    { id: 4, value: 'fourth(new)' },
                    { id: 8, value: 'eighth' },
                ],
                'down'
            );

            expect(items.getRawData(true)).toEqual([
                { id: 1, value: 'first' },
                { id: 3, value: 'third' },
                { id: 5, value: 'fifth' },
                { id: 6, value: 'sixth' },
                { id: 2, value: 'second(new)' },
                { id: 7, value: 'seventh' },
                { id: 4, value: 'fourth(new)' },
                { id: 8, value: 'eighth' },
            ]);
        });
    });
});

describe('Controls/dataSource:ItemsChangesResolver', () => {
    describe('without collision resolution', () => {
        beforeEach(() => {
            skipRemoveDuplicates = true;
        });

        test('should correctly merge RecordSet-s with simple collisions with the "down" direction [append, remove]', () => {
            const items = mergeRecordSets(
                'id',
                [
                    { id: 1, value: 'first' },
                    { id: 2, value: 'second' },
                    { id: 3, value: 'third' },
                ],
                [
                    { id: 3, value: 'third(new)' },
                    { id: 4, value: 'fourth' },
                    { id: 5, value: 'fifth' },
                ],
                'down'
            );

            expect(items.getRawData(true)).toEqual([
                { id: 1, value: 'first' },
                { id: 2, value: 'second' },
                { id: 3, value: 'third' },
                { id: 3, value: 'third(new)' },
                { id: 4, value: 'fourth' },
                { id: 5, value: 'fifth' },
            ]);
        });

        test('should correctly merge RecordSet-s with simple collisions with the "up" direction [prepend, remove]', () => {
            const items = mergeRecordSets(
                'id',
                [
                    { id: 1, value: 'first' },
                    { id: 2, value: 'second' },
                    { id: 3, value: 'third' },
                ],
                [
                    { id: -1, value: 'minus first' },
                    { id: 0, value: 'zero' },
                    { id: 1, value: 'first(new)' },
                ],
                'up'
            );

            expect(items.getRawData(true)).toEqual([
                { id: -1, value: 'minus first' },
                { id: 0, value: 'zero' },
                { id: 1, value: 'first(new)' },
                { id: 1, value: 'first' },
                { id: 2, value: 'second' },
                { id: 3, value: 'third' },
            ]);
        });
    });
});

function mergeRecordSets<K extends string, T extends Record<K, unknown> & Record<string, unknown>>(
    keyProperty: K,
    first: T[],
    second: T[],
    direction?: Direction,
    parent?: TKey,
    root?: TKey,
    childrenProperty?: string
): RecordSet<T> {
    const items = new RecordSet<T>({
        keyProperty,
        rawData: first,
    });
    const newItems = new RecordSet<T>({
        keyProperty,
        rawData: second,
    });
    const changes = calculateAddItemsChanges(
        items,
        newItems,
        direction,
        parent,
        root,
        childrenProperty,
        skipRemoveDuplicates
    );
    const resolver = new RecordSetDiffer();
    resolver.applyChanges(changes);

    return items;
}
