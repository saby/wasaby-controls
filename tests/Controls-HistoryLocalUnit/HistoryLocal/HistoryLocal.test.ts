import { Store } from 'Controls-HistoryLocal/HistoryStore';
import { LocalStorage } from 'BrowserAPI/Storage';
import { RecordSet } from 'Types/collection';

describe('Controls/history:Store', (): void => {
    const localStorage = new LocalStorage();
    const historyId = 'myHistoryTest';

    const recentItemsRaw = [
        {
            ObjectId: 1,
            ObjectData: 'value1',
            Counter: 1,
            HistoryId: historyId,
        },
    ];

    const pinnedItemsRaw = [
        {
            ObjectId: 2,
            ObjectData: 'value2',
            Counter: 5,
            HistoryId: historyId,
        },
    ];

    const recentItems: RecordSet<any> = new RecordSet({
        keyProperty: 'ObjectId',
        rawData: recentItemsRaw,
    });

    const pinnedItems: RecordSet<any> = new RecordSet({
        keyProperty: 'ObjectId',
        rawData: pinnedItemsRaw,
    });

    const getLocalStorageRecentItems = (): RecordSet<any> | null => {
        return Store.getLocal(historyId).recent;
    };

    const getLocalStoragePinnedItems = (): RecordSet<any> | null => {
        return Store.getLocal(historyId).pinned;
    };

    beforeEach(() => {
        localStorage.setItem(historyId, {
            recent: recentItems,
            pinned: pinnedItems,
        });
    });

    afterEach(() => {
        localStorage.clear();
    });

    describe('load', (): void => {
        it('load exist items', async () => {
            await Store.push(historyId, 1);
            await Store.load(historyId).then((data) => {
                expect(data.recent?.isEqual(recentItems));
                expect(
                    data.pinned?.isEqual(
                        new RecordSet({
                            keyProperty: 'ObjectId',
                        })
                    )
                );
            });
        });

        it('load by not existed history id', async () => {
            await Store.load('notExistedHistoryId').then((data) => {
                expect(data.recent?.getCount()).toEqual(0);
                expect(data.pinned?.getCount()).toEqual(0);
            });
        });
    });

    describe('getLocal', (): void => {
        it('get exist local items', () => {
            expect(Store.getLocal(historyId).recent?.isEqual(recentItems)).toBeTruthy();
            expect(Store.getLocal(historyId).pinned?.isEqual(pinnedItems)).toBeTruthy();
        });

        it('get not exist local items', (): void => {
            localStorage.clear();
            expect(Store.getLocal('notExistedHistoryId').recent?.getCount()).toEqual(0);
            expect(Store.getLocal('notExistedHistoryId').pinned?.getCount()).toEqual(0);
        });
    });

    describe('togglePin', (): void => {
        it('pin not existed item', async () => {
            localStorage.clear();
            await Store.togglePin(historyId, 1);
            expect(getLocalStorageRecentItems()?.getCount()).toEqual(0);
            expect(getLocalStoragePinnedItems()?.getCount()).toEqual(1);
        });

        it('pin item', async () => {
            await Store.togglePin(historyId, 1);
            expect(getLocalStorageRecentItems()?.getCount()).toEqual(1);
            expect(getLocalStoragePinnedItems()?.getCount()).toEqual(2);
        });

        it('unpin item', async () => {
            await Store.togglePin(historyId, 2);
            expect(getLocalStorageRecentItems()?.getCount()).toEqual(1);
        });
    });

    describe('push', () => {
        it('push in not empty history', async () => {
            await Store.push(historyId, 'pushedValue');
            expect(getLocalStorageRecentItems()?.getCount()).toEqual(2);
            expect(getLocalStorageRecentItems()?.at(0).get('ObjectData')).toEqual('pushedValue');
        });

        it('push in empty history', async () => {
            localStorage.clear();
            await Store.push(historyId, 'pushedValue');
            expect(getLocalStorageRecentItems()?.getCount()).toEqual(1);
            expect(getLocalStorageRecentItems()?.at(0).get('ObjectData')).toEqual('pushedValue');
        });

        it('push exist value', async () => {
            await Store.push(historyId, 1);
            expect(getLocalStorageRecentItems()?.getCount()).toEqual(1);
            expect(getLocalStorageRecentItems()?.at(0).get('Counter')).toEqual(2);
        });
    });

    describe('update', () => {
        it('update exist value', async () => {
            await Store.update(historyId, 1, 'updatedValue1');
            expect(getLocalStorageRecentItems()?.at(0).get('ObjectData')).toEqual('updatedValue1');
        });

        it('update by not exist historyId', async () => {
            await expect(Store.update('notExistedHistoryId', 1, 'updatedValue1')).rejects.toThrow(
                'Элемента с id: 1 не существует в истории с historyId: notExistedHistoryId'
            );
        });

        it('update by not exist item id', async () => {
            await expect(Store.update(historyId, 999, 'updatedValue1')).rejects.toThrow(
                'Элемента с id: 999 не существует в истории с historyId: myHistoryTest'
            );
        });
    });

    describe('delete', (): void => {
        it('delete exist item', async () => {
            await Store.delete(historyId, 1);
            expect(getLocalStorageRecentItems()?.getCount()).toEqual(0);
        });

        it('delete by not exist historyId', async () => {
            await expect(Store.delete('notExistedHistoryId', 1)).rejects.toThrow(
                'Элемента с id: 1 не существует в истории с historyId: notExistedHistoryId'
            );
        });

        it('delete by not exist item id', async () => {
            await expect(Store.delete(historyId, 999)).rejects.toThrow(
                'Элемента с id: 999 не существует в истории с historyId: myHistoryTest'
            );
        });
    });
});
