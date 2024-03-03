/*
  @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-magic-numbers */

import { RecordSet } from 'Types/collection';
import { Record } from 'Types/entity';
import { TreeGridCollection } from 'Controls/treeGrid';
import { VirtualCollection, ExternalCollectionItemKeys } from 'Controls-Lists/dataFactory';
import { ListChangeNameEnum } from 'Controls/abstractListAspect';
import { ListChangeSourceEnum } from 'Controls/itemsListAspect';

const {
    parent: parentProperty,
    ident: keyProperty,
    is_expanded: expandProperty,
    node_type: nodeProperty,
} = ExternalCollectionItemKeys;

describe('Controls-ListsUnit/Lists/Mobile/VirtualCollection', () => {
    const virtualCollection = new VirtualCollection();
    beforeEach(() => {
        virtualCollection.sync({
            collection: new TreeGridCollection({
                collection: new RecordSet({
                    rawData: [
                        {
                            [keyProperty]: '0',
                            [expandProperty]: false,
                            [nodeProperty]: null,
                            [parentProperty]: null,
                        },
                        {
                            [keyProperty]: '1',
                            [expandProperty]: false,
                            [nodeProperty]: null,
                            [parentProperty]: null,
                        },
                        {
                            [keyProperty]: '2',
                            [expandProperty]: false,
                            [nodeProperty]: null,
                            [parentProperty]: null,
                        },
                        {
                            [keyProperty]: '3',
                            [expandProperty]: false,
                            [nodeProperty]: true,
                            [parentProperty]: null,
                        },
                        {
                            [keyProperty]: '4',
                            [expandProperty]: false,
                            [nodeProperty]: true,
                            [parentProperty]: null,
                        },
                        {
                            [keyProperty]: '5',
                            [expandProperty]: true,
                            [nodeProperty]: true,
                            [parentProperty]: null,
                        },
                    ],
                    format: [
                        { name: keyProperty, type: 'string' },
                        { name: expandProperty, type: 'boolean' },
                        { name: nodeProperty, type: 'boolean' },
                    ],
                    keyProperty,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                }) as any,
                keyProperty,
                parentProperty,
                nodeTypeProperty: nodeProperty,
                root: null,
                columns: [],
            }),
            hasMoreStorage: undefined,
        });
    });

    test('should return valid keys and changes on single updates', () => {
        expect(virtualCollection.getKeyByIndex(0)).toEqual('0');
        expect(virtualCollection.getKeyByIndex(1)).toEqual('1');
        expect(virtualCollection.getKeyByIndex(2)).toEqual('2');
        expect(virtualCollection.getKeyByIndex(3)).toEqual('3');
        expect(virtualCollection.getKeyByIndex(4)).toEqual('4');
        expect(virtualCollection.getKeyByIndex(5)).toEqual('5');

        virtualCollection.removeMany(
            new RecordSet({
                rawData: [{ index: 2 }],
            })
        );

        expect(virtualCollection.getKeyByIndex(0)).toEqual('0');
        expect(virtualCollection.getKeyByIndex(1)).toEqual('1');
        expect(virtualCollection.getKeyByIndex(2)).toEqual('3');
        expect(virtualCollection.getKeyByIndex(3)).toEqual('4');
        expect(virtualCollection.getKeyByIndex(4)).toEqual('5');
        expect(virtualCollection.getKeyByIndex(5)).toBeUndefined();

        virtualCollection.removeMany(
            new RecordSet({
                rawData: [{ index: 2 }],
            })
        );

        expect(virtualCollection.getKeyByIndex(0)).toEqual('0');
        expect(virtualCollection.getKeyByIndex(1)).toEqual('1');
        expect(virtualCollection.getKeyByIndex(2)).toEqual('4');
        expect(virtualCollection.getKeyByIndex(3)).toEqual('5');
        expect(virtualCollection.getKeyByIndex(4)).toBeUndefined();

        virtualCollection.removeMany(
            new RecordSet({
                rawData: [{ index: 0 }],
            })
        );

        expect(virtualCollection.getKeyByIndex(0)).toEqual('1');
        expect(virtualCollection.getKeyByIndex(1)).toEqual('4');
        expect(virtualCollection.getKeyByIndex(2)).toEqual('5');
        expect(virtualCollection.getKeyByIndex(3)).toBeUndefined();

        virtualCollection.removeMany(
            new RecordSet({
                rawData: [{ index: 1 }],
            })
        );

        expect(virtualCollection.getKeyByIndex(0)).toEqual('1');
        expect(virtualCollection.getKeyByIndex(1)).toEqual('5');
        expect(virtualCollection.getKeyByIndex(2)).toBeUndefined();

        virtualCollection.addMany(
            new RecordSet({
                rawData: [
                    {
                        index: 0,
                        item: new Record({
                            rawData: { [keyProperty]: '6' },
                        }),
                    },
                ],
            })
        );

        expect(virtualCollection.getKeyByIndex(0)).toEqual('6');
        expect(virtualCollection.getKeyByIndex(1)).toEqual('1');
        expect(virtualCollection.getKeyByIndex(2)).toEqual('5');
        expect(virtualCollection.getKeyByIndex(3)).toBeUndefined();

        virtualCollection.addMany(
            new RecordSet({
                rawData: [
                    {
                        index: 1,
                        item: new Record({
                            rawData: { [keyProperty]: '7' },
                        }),
                    },
                ],
            })
        );

        expect(virtualCollection.getKeyByIndex(0)).toEqual('6');
        expect(virtualCollection.getKeyByIndex(1)).toEqual('7');
        expect(virtualCollection.getKeyByIndex(2)).toEqual('1');
        expect(virtualCollection.getKeyByIndex(3)).toEqual('5');
        expect(virtualCollection.getKeyByIndex(4)).toBeUndefined();

        virtualCollection.addMany(
            new RecordSet({
                rawData: [
                    {
                        index: 3,
                        item: new Record({
                            rawData: { [keyProperty]: '8' },
                        }),
                    },
                ],
            })
        );

        expect(virtualCollection.getKeyByIndex(0)).toEqual('6');
        expect(virtualCollection.getKeyByIndex(1)).toEqual('7');
        expect(virtualCollection.getKeyByIndex(2)).toEqual('1');
        expect(virtualCollection.getKeyByIndex(3)).toEqual('8');
        expect(virtualCollection.getKeyByIndex(4)).toEqual('5');
        expect(virtualCollection.getKeyByIndex(5)).toBeUndefined();
    });

    test('should return valid keys and changes on call "removeMany" [2, 2, 2]', () => {
        expect(virtualCollection.getKeyByIndex(0)).toEqual('0');
        expect(virtualCollection.getKeyByIndex(1)).toEqual('1');
        expect(virtualCollection.getKeyByIndex(2)).toEqual('2');
        expect(virtualCollection.getKeyByIndex(3)).toEqual('3');
        expect(virtualCollection.getKeyByIndex(4)).toEqual('4');
        expect(virtualCollection.getKeyByIndex(5)).toEqual('5');

        virtualCollection.removeMany(
            new RecordSet({
                rawData: [{ index: 2 }, { index: 2 }, { index: 2 }],
            })
        );

        expect(virtualCollection.getKeyByIndex(0)).toEqual('0');
        expect(virtualCollection.getKeyByIndex(1)).toEqual('1');
        expect(virtualCollection.getKeyByIndex(2)).toEqual('5');

        const change = virtualCollection
            .getChanges()
            .find(({ name }) => name === ListChangeNameEnum.REMOVE_ITEMS);

        expect(change.name).toEqual(ListChangeNameEnum.REMOVE_ITEMS);
        if (change.name !== ListChangeNameEnum.REMOVE_ITEMS) {
            throw TypeError();
        }
        expect(change.args.keys).toEqual(['2', '3', '4']);
        expect(change.args.changeSource).toEqual(ListChangeSourceEnum.EXTERNAL);
    });

    test('should return valid keys and changes on call "removeMany" [2, 1, 0]', () => {
        expect(virtualCollection.getKeyByIndex(0)).toEqual('0');
        expect(virtualCollection.getKeyByIndex(1)).toEqual('1');
        expect(virtualCollection.getKeyByIndex(2)).toEqual('2');
        expect(virtualCollection.getKeyByIndex(3)).toEqual('3');
        expect(virtualCollection.getKeyByIndex(4)).toEqual('4');
        expect(virtualCollection.getKeyByIndex(5)).toEqual('5');

        virtualCollection.removeMany(
            new RecordSet({
                rawData: [{ index: 2 }, { index: 1 }, { index: 0 }],
            })
        );

        expect(virtualCollection.getKeyByIndex(0)).toEqual('3');
        expect(virtualCollection.getKeyByIndex(1)).toEqual('4');
        expect(virtualCollection.getKeyByIndex(2)).toEqual('5');

        const change = virtualCollection
            .getChanges()
            .find(({ name }) => name === ListChangeNameEnum.REMOVE_ITEMS);

        expect(change.name).toEqual(ListChangeNameEnum.REMOVE_ITEMS);
        if (change.name !== ListChangeNameEnum.REMOVE_ITEMS) {
            throw TypeError();
        }
        expect(change.args.keys).toEqual(['2', '1', '0']);
        expect(change.args.changeSource).toEqual(ListChangeSourceEnum.EXTERNAL);
    });

    test('should return valid keys and changes on call "replaceMany"', () => {
        expect(virtualCollection.getKeyByIndex(0)).toEqual('0');
        expect(virtualCollection.getKeyByIndex(1)).toEqual('1');
        expect(virtualCollection.getKeyByIndex(2)).toEqual('2');
        expect(virtualCollection.getKeyByIndex(3)).toEqual('3');
        expect(virtualCollection.getKeyByIndex(4)).toEqual('4');
        expect(virtualCollection.getKeyByIndex(5)).toEqual('5');
        expect(virtualCollection.getKeyByIndex(6)).toEqual(undefined);

        virtualCollection.replaceMany(
            new RecordSet({
                rawData: [
                    { index: 0, item: new Record({ rawData: { [keyProperty]: '0_new' } }) },
                    { index: 2, item: new Record({ rawData: { [keyProperty]: '2_new' } }) },
                    { index: 5, item: new Record({ rawData: { [keyProperty]: '5_new' } }) },
                ],
            })
        );

        expect(virtualCollection.getKeyByIndex(0)).toEqual('0_new');
        expect(virtualCollection.getKeyByIndex(1)).toEqual('1');
        expect(virtualCollection.getKeyByIndex(2)).toEqual('2_new');
        expect(virtualCollection.getKeyByIndex(3)).toEqual('3');
        expect(virtualCollection.getKeyByIndex(4)).toEqual('4');
        expect(virtualCollection.getKeyByIndex(5)).toEqual('5_new');
        expect(virtualCollection.getKeyByIndex(6)).toEqual(undefined);

        const change = virtualCollection
            .getChanges()
            .find(({ name }) => name === ListChangeNameEnum.REPLACE_ITEMS);

        expect(change.name).toEqual(ListChangeNameEnum.REPLACE_ITEMS);
        if (change.name !== ListChangeNameEnum.REPLACE_ITEMS) {
            throw TypeError();
        }
        expect(
            [...change.args.items.entries()].map(([key, model]) => [key, model.getKey()])
        ).toEqual([
            ['0', '0_new'],
            ['2', '2_new'],
            ['5', '5_new'],
        ]);
        expect(change.args.changeSource).toEqual(ListChangeSourceEnum.EXTERNAL);
    });

    test('should return valid keys and changes on call "addMany"', () => {
        expect(virtualCollection.getKeyByIndex(0)).toEqual('0');
        expect(virtualCollection.getKeyByIndex(1)).toEqual('1');
        expect(virtualCollection.getKeyByIndex(2)).toEqual('2');
        expect(virtualCollection.getKeyByIndex(3)).toEqual('3');
        expect(virtualCollection.getKeyByIndex(4)).toEqual('4');
        expect(virtualCollection.getKeyByIndex(5)).toEqual('5');

        virtualCollection.addMany(
            new RecordSet({
                rawData: [
                    {
                        index: 6,
                        item: new Record({
                            rawData: { [keyProperty]: '6' },
                        }),
                    },
                    {
                        index: 0,
                        item: new Record({
                            rawData: { [keyProperty]: '-2' },
                        }),
                    },
                    {
                        index: 1,
                        item: new Record({
                            rawData: { [keyProperty]: '-1' },
                        }),
                    },
                    {
                        index: 3,
                        item: new Record({
                            rawData: { [keyProperty]: '0.5' },
                        }),
                    },
                    {
                        index: 5,
                        item: new Record({
                            rawData: { [keyProperty]: '1.5' },
                        }),
                    },
                ],
            })
        );

        expect(virtualCollection.getKeyByIndex(0)).toEqual('-2');
        expect(virtualCollection.getKeyByIndex(1)).toEqual('-1');
        expect(virtualCollection.getKeyByIndex(2)).toEqual('0');
        expect(virtualCollection.getKeyByIndex(3)).toEqual('0.5');
        expect(virtualCollection.getKeyByIndex(4)).toEqual('1');
        expect(virtualCollection.getKeyByIndex(5)).toEqual('1.5');
        expect(virtualCollection.getKeyByIndex(6)).toEqual('2');
        expect(virtualCollection.getKeyByIndex(7)).toEqual('3');
        expect(virtualCollection.getKeyByIndex(8)).toEqual('4');
        expect(virtualCollection.getKeyByIndex(9)).toEqual('5');
        expect(virtualCollection.getKeyByIndex(10)).toEqual('6');
    });

    test('should return valid expanded keys and changes', () => {
        const sort = (keys: Set<unknown>) =>
            Array.from(keys).sort((a, b) => (+a > +b ? 1 : +a < +b ? -1 : 0));

        expect(sort(virtualCollection.getExpandedKeys())).toEqual(['5']);

        virtualCollection.addMany(
            new RecordSet({
                rawData: [
                    {
                        index: 0,
                        item: new Record({
                            rawData: {
                                [keyProperty]: '100',
                                [expandProperty]: true,
                                [nodeProperty]: true,
                                [parentProperty]: null,
                            },
                        }),
                    },
                ],
            })
        );

        expect(sort(virtualCollection.getExpandedKeys())).toEqual(['5', '100']);

        virtualCollection.addMany(
            new RecordSet({
                rawData: [
                    {
                        index: 0,
                        item: new Record({
                            rawData: {
                                [keyProperty]: '101',
                                [expandProperty]: true,
                                [nodeProperty]: true,
                                [parentProperty]: null,
                            },
                        }),
                    },
                ],
            })
        );

        expect(sort(virtualCollection.getExpandedKeys())).toEqual(['5', '100', '101']);

        virtualCollection.removeMany(
            new RecordSet({
                rawData: [{ index: 1 }],
            })
        );

        expect(sort(virtualCollection.getExpandedKeys())).toEqual(['5', '101']);

        virtualCollection.removeMany(
            new RecordSet({
                rawData: [
                    {
                        index: 0,
                        item: new Record({
                            rawData: {
                                [keyProperty]: '101',
                                [expandProperty]: false,
                                [nodeProperty]: true,
                                [parentProperty]: null,
                            },
                        }),
                    },
                ],
            })
        );

        expect(sort(virtualCollection.getExpandedKeys())).toEqual(['5']);

        virtualCollection.replaceAll(
            new RecordSet({
                rawData: [
                    {
                        [keyProperty]: '1',
                        [expandProperty]: true,
                        [nodeProperty]: true,
                        [parentProperty]: null,
                    },
                    {
                        [keyProperty]: '1.1',
                        [expandProperty]: null,
                        [nodeProperty]: null,
                        [parentProperty]: '1',
                    },
                    {
                        [keyProperty]: '1.2',
                        [expandProperty]: true,
                        [nodeProperty]: true,
                        [parentProperty]: '1',
                    },
                    {
                        [keyProperty]: '1.2.1',
                        [expandProperty]: null,
                        [nodeProperty]: null,
                        [parentProperty]: '1.2',
                    },
                    {
                        [keyProperty]: '1.2.2',
                        [expandProperty]: null,
                        [nodeProperty]: null,
                        [parentProperty]: '1.2',
                    },
                    {
                        [keyProperty]: '2',
                        [expandProperty]: false,
                        [nodeProperty]: true,
                        [parentProperty]: null,
                    },
                ],
                format: [
                    { name: keyProperty, type: 'string' },
                    { name: parentProperty, type: 'string' },
                    { name: expandProperty, type: 'boolean' },
                    { name: nodeProperty, type: 'boolean' },
                ],
                keyProperty,
            })
        );

        expect(sort(virtualCollection.getExpandedKeys())).toEqual(['1', '1.2']);

        expect(
            virtualCollection
                .getChanges()
                .filter(
                    ({ name }) =>
                        name === ListChangeNameEnum.COLLAPSE || name === ListChangeNameEnum.EXPAND
                ).length
        ).toBeGreaterThan(0);
    });
});
