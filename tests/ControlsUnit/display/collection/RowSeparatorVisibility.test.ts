import { Collection } from 'Controls/display';
import { RecordSet } from 'Types/collection';

describe('Controls/_display/collection/RowSeparatorVisibility', () => {
    let collection = Collection;

    describe('setRowSeparatorVisibility', () => {
        beforeEach(() => {
            const recordSet = new RecordSet({
                rawData: [{ key: 0 }, { key: 1 }, { key: 2 }],
                keyProperty: 'key',
            });
            collection = new Collection({
                keyProperty: 'key',
                collection: recordSet,
                rowSeparatorSize: 's',
            });
        });

        describe('edges', () => {
            beforeEach(() => {
                collection.setRowSeparatorVisibility('edges');
            });

            it('set top separator', () => {
                expect(collection.at(0).isTopSeparatorEnabled()).toBe(true);
                expect(collection.at(1).isTopSeparatorEnabled()).toBe(false);
                expect(collection.at(2).isTopSeparatorEnabled()).toBe(false);
            });

            it('set bottom separator', () => {
                expect(collection.at(0).isBottomSeparatorEnabled()).toBe(false);
                expect(collection.at(1).isBottomSeparatorEnabled()).toBe(false);
                expect(collection.at(2).isBottomSeparatorEnabled()).toBe(true);
            });
        });

        describe('items', () => {
            beforeEach(() => {
                collection.setRowSeparatorVisibility('items');
            });

            it('set top separator', () => {
                expect(collection.at(0).isTopSeparatorEnabled()).toBe(false);
                expect(collection.at(1).isTopSeparatorEnabled()).toBe(true);
                expect(collection.at(2).isTopSeparatorEnabled()).toBe(true);
            });

            it('set bottom separator', () => {
                expect(collection.at(0).isBottomSeparatorEnabled()).toBe(false);
                expect(collection.at(1).isBottomSeparatorEnabled()).toBe(false);
                expect(collection.at(2).isBottomSeparatorEnabled()).toBe(false);
            });
        });

        describe('all (default)', () => {
            beforeEach(() => {
                collection.setRowSeparatorVisibility('all');
            });

            it('set top separator', () => {
                expect(collection.at(0).isTopSeparatorEnabled()).toBe(true);
                expect(collection.at(1).isTopSeparatorEnabled()).toBe(true);
                expect(collection.at(2).isTopSeparatorEnabled()).toBe(true);
            });

            it('set bottom separator', () => {
                expect(collection.at(0).isBottomSeparatorEnabled()).toBe(false);
                expect(collection.at(1).isBottomSeparatorEnabled()).toBe(false);
                expect(collection.at(2).isBottomSeparatorEnabled()).toBe(true);
            });
        });
    });

    describe('setRowSeparatorVisibility with the only record', () => {
        beforeEach(() => {
            const recordSet = new RecordSet({
                rawData: [{ key: 0 }],
                keyProperty: 'key',
            });
            collection = new Collection({
                keyProperty: 'key',
                collection: recordSet,
                rowSeparatorSize: 's',
            });
        });

        it('edges', () => {
            collection.setRowSeparatorVisibility('edges');
            expect(collection.at(0).isTopSeparatorEnabled()).toBe(true);
            expect(collection.at(0).isBottomSeparatorEnabled()).toBe(true);
        });

        it('items', () => {
            collection.setRowSeparatorVisibility('items');
            expect(collection.at(0).isTopSeparatorEnabled()).toBe(false);
            expect(collection.at(0).isBottomSeparatorEnabled()).toBe(false);
        });

        it('all (default)', () => {
            collection.setRowSeparatorVisibility('all');
            expect(collection.at(0).isTopSeparatorEnabled()).toBe(true);
            expect(collection.at(0).isBottomSeparatorEnabled()).toBe(true);
        });
    });
});
