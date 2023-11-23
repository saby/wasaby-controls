/*
  @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-magic-numbers */

import { RecordSet } from 'Types/collection';
import { Collection } from 'Controls/display';
import { VirtualCollection } from 'Controls-Lists/dataFactory';
import { IListChangeName } from 'Controls/dataFactory';

describe('Controls-ListsUnit/Lists/Mobile/VirtualCollection', () => {
    const keyProperty = 'id';
    const virtualCollection = new VirtualCollection();
    beforeEach(() => {
        virtualCollection.sync(
            new Collection({
                collection: new RecordSet({
                    rawData: [
                        { id: '0' },
                        { id: '1' },
                        { id: '2' },
                        { id: '3' },
                        { id: '4' },
                        { id: '5' },
                    ],
                    keyProperty,
                }),
                keyProperty,
            })
        );
    });

    test('should return valid keys and changes on single updates', () => {
        expect(virtualCollection.getKeyByIndex(0)).toEqual('0');
        expect(virtualCollection.getKeyByIndex(1)).toEqual('1');
        expect(virtualCollection.getKeyByIndex(2)).toEqual('2');
        expect(virtualCollection.getKeyByIndex(3)).toEqual('3');
        expect(virtualCollection.getKeyByIndex(4)).toEqual('4');
        expect(virtualCollection.getKeyByIndex(5)).toEqual('5');

        virtualCollection.removeMany([2]);

        expect(virtualCollection.getKeyByIndex(0)).toEqual('0');
        expect(virtualCollection.getKeyByIndex(1)).toEqual('1');
        expect(virtualCollection.getKeyByIndex(2)).toEqual('3');
        expect(virtualCollection.getKeyByIndex(3)).toEqual('4');
        expect(virtualCollection.getKeyByIndex(4)).toEqual('5');
        expect(virtualCollection.getKeyByIndex(5)).toBeUndefined();

        virtualCollection.removeMany([2]);

        expect(virtualCollection.getKeyByIndex(0)).toEqual('0');
        expect(virtualCollection.getKeyByIndex(1)).toEqual('1');
        expect(virtualCollection.getKeyByIndex(2)).toEqual('4');
        expect(virtualCollection.getKeyByIndex(3)).toEqual('5');
        expect(virtualCollection.getKeyByIndex(4)).toBeUndefined();

        virtualCollection.removeMany([0]);

        expect(virtualCollection.getKeyByIndex(0)).toEqual('1');
        expect(virtualCollection.getKeyByIndex(1)).toEqual('4');
        expect(virtualCollection.getKeyByIndex(2)).toEqual('5');
        expect(virtualCollection.getKeyByIndex(3)).toBeUndefined();

        virtualCollection.removeMany([1]);

        expect(virtualCollection.getKeyByIndex(0)).toEqual('1');
        expect(virtualCollection.getKeyByIndex(1)).toEqual('5');
        expect(virtualCollection.getKeyByIndex(2)).toBeUndefined();

        virtualCollection.addMany([{ index: 0, item: { id: '6' } }]);

        expect(virtualCollection.getKeyByIndex(0)).toEqual('6');
        expect(virtualCollection.getKeyByIndex(1)).toEqual('1');
        expect(virtualCollection.getKeyByIndex(2)).toEqual('5');
        expect(virtualCollection.getKeyByIndex(3)).toBeUndefined();

        virtualCollection.addMany([{ index: 1, item: { id: '7' } }]);

        expect(virtualCollection.getKeyByIndex(0)).toEqual('6');
        expect(virtualCollection.getKeyByIndex(1)).toEqual('7');
        expect(virtualCollection.getKeyByIndex(2)).toEqual('1');
        expect(virtualCollection.getKeyByIndex(3)).toEqual('5');
        expect(virtualCollection.getKeyByIndex(4)).toBeUndefined();

        virtualCollection.addMany([{ index: 3, item: { id: '8' } }]);

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

        virtualCollection.removeMany([2, 2, 2]);

        expect(virtualCollection.getKeyByIndex(0)).toEqual('0');
        expect(virtualCollection.getKeyByIndex(1)).toEqual('1');
        expect(virtualCollection.getKeyByIndex(2)).toEqual('5');

        expect(virtualCollection.getChanges().length).toEqual(1);
        const [change] = virtualCollection.getChanges();
        expect(change.name).toEqual(IListChangeName.REMOVE_ITEMS);
        if (change.name !== IListChangeName.REMOVE_ITEMS) {
            throw TypeError();
        }
        expect(change.args.keys).toEqual(['2', '3', '4']);
        expect(change.args.isAlreadyApplied).toBeFalsy();
    });

    test('should return valid keys and changes on call "removeMany" [2, 1, 0]', () => {
        expect(virtualCollection.getKeyByIndex(0)).toEqual('0');
        expect(virtualCollection.getKeyByIndex(1)).toEqual('1');
        expect(virtualCollection.getKeyByIndex(2)).toEqual('2');
        expect(virtualCollection.getKeyByIndex(3)).toEqual('3');
        expect(virtualCollection.getKeyByIndex(4)).toEqual('4');
        expect(virtualCollection.getKeyByIndex(5)).toEqual('5');

        virtualCollection.removeMany([2, 1, 0]);

        expect(virtualCollection.getKeyByIndex(0)).toEqual('3');
        expect(virtualCollection.getKeyByIndex(1)).toEqual('4');
        expect(virtualCollection.getKeyByIndex(2)).toEqual('5');

        expect(virtualCollection.getChanges().length).toEqual(1);
        const [change] = virtualCollection.getChanges();
        expect(change.name).toEqual(IListChangeName.REMOVE_ITEMS);
        if (change.name !== IListChangeName.REMOVE_ITEMS) {
            throw TypeError();
        }
        expect(change.args.keys).toEqual(['2', '1', '0']);
        expect(change.args.isAlreadyApplied).toBeFalsy();
    });

    test('should return valid keys and changes on call "replaceMany"', () => {
        expect(virtualCollection.getKeyByIndex(0)).toEqual('0');
        expect(virtualCollection.getKeyByIndex(1)).toEqual('1');
        expect(virtualCollection.getKeyByIndex(2)).toEqual('2');
        expect(virtualCollection.getKeyByIndex(3)).toEqual('3');
        expect(virtualCollection.getKeyByIndex(4)).toEqual('4');
        expect(virtualCollection.getKeyByIndex(5)).toEqual('5');
        expect(virtualCollection.getKeyByIndex(6)).toEqual(undefined);

        virtualCollection.replaceMany([
            { index: 0, item: { id: '0_new' } },
            { index: 2, item: { id: '2_new' } },
            { index: 5, item: { id: '5_new' } },
        ]);

        expect(virtualCollection.getKeyByIndex(0)).toEqual('0_new');
        expect(virtualCollection.getKeyByIndex(1)).toEqual('1');
        expect(virtualCollection.getKeyByIndex(2)).toEqual('2_new');
        expect(virtualCollection.getKeyByIndex(3)).toEqual('3');
        expect(virtualCollection.getKeyByIndex(4)).toEqual('4');
        expect(virtualCollection.getKeyByIndex(5)).toEqual('5_new');
        expect(virtualCollection.getKeyByIndex(6)).toEqual(undefined);

        expect(virtualCollection.getChanges().length).toEqual(1);
        const [change] = virtualCollection.getChanges();
        expect(change.name).toEqual(IListChangeName.REPLACE_ITEMS);
        if (change.name !== IListChangeName.REPLACE_ITEMS) {
            throw TypeError();
        }
        expect(
            [...change.args.items.entries()].map(([key, model]) => [key, model.getRawData().id])
        ).toEqual([
            ['0', '0_new'],
            ['2', '2_new'],
            ['5', '5_new'],
        ]);
        expect(change.args.isAlreadyApplied).toBeFalsy();
    });

    test('should return valid keys and changes on call "addMany"', () => {
        expect(virtualCollection.getKeyByIndex(0)).toEqual('0');
        expect(virtualCollection.getKeyByIndex(1)).toEqual('1');
        expect(virtualCollection.getKeyByIndex(2)).toEqual('2');
        expect(virtualCollection.getKeyByIndex(3)).toEqual('3');
        expect(virtualCollection.getKeyByIndex(4)).toEqual('4');
        expect(virtualCollection.getKeyByIndex(5)).toEqual('5');

        virtualCollection.addMany([
            { index: 6, item: { id: '6' } },
            { index: 0, item: { id: '-2' } },
            { index: 1, item: { id: '-1' } },
            { index: 3, item: { id: '0.5' } },
            { index: 5, item: { id: '1.5' } },
        ]);

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

        expect(virtualCollection.getChanges().length).toEqual(2);
        const [appendChange, prependChange] = virtualCollection.getChanges();
        expect(appendChange.name).toEqual(IListChangeName.APPEND_ITEMS);
        expect(prependChange.name).toEqual(IListChangeName.PREPEND_ITEMS);
        if (appendChange.name !== IListChangeName.APPEND_ITEMS) {
            throw TypeError();
        }
        if (prependChange.name !== IListChangeName.PREPEND_ITEMS) {
            throw TypeError();
        }
        expect(
            [...appendChange.args.items.entries()].map(([key, model]) => [
                key,
                model.getRawData().id,
            ])
        ).toEqual([['5', '6']]);
        expect(appendChange.args.isAlreadyApplied).toBeFalsy();
        expect(
            [...prependChange.args.items.entries()].map(([key, model]) => [
                key,
                model.getRawData().id,
            ])
        ).toEqual([
            ['0', '-1'],
            ['1', '0.5'],
            ['2', '1.5'],
        ]);
        expect(appendChange.args.isAlreadyApplied).toBeFalsy();
    });
});
