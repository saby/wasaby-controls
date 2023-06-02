import { default as Lookup } from 'Controls/_lookup/Lookup';
import { ILookupOptions } from 'Controls/_lookup/BaseLookup';
import { Memory, PrefetchProxy } from 'Types/source';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';

function getLookupOptions(): Partial<ILookupOptions> {
    return {
        source: getSource(),
        selectedKeys: [],
        keyProperty: 'id',
    };
}

async function getBaseLookup(
    options?: Partial<ILookupOptions>,
    receivedState?: RecordSet
): Promise<Lookup> {
    const lookupOptions = {
        ...getLookupOptions(),
        ...options,
    };
    const lookup = new Lookup();
    // это сделано для того, чтобы ручные вызовы _forceUpdate не заваливали консоль ошибками
    jest.spyOn(lookup, '_forceUpdate').mockClear().mockImplementation();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await lookup._beforeMount(lookupOptions, undefined, receivedState);
    lookup.saveOptions(lookupOptions);
    lookup._children = {
        layout: {
            closeSuggest: () => {
                return void 0;
            },
        },
    };
    return lookup;
}

function getData(): object[] {
    return [
        {
            id: 0,
            title: 'Sasha',
        },
        {
            id: 1,
            title: 'Aleksey',
        },
        {
            id: 2,
            title: 'Dmitry',
        },
    ];
}

function getSource(): Memory {
    return new Memory({
        data: getData(),
        keyProperty: 'id',
        filter: (item, filter) => {
            if (filter.id) {
                return (
                    item.get('id') === filter.id ||
                    filter.id?.includes(item.get('id'))
                );
            }
            return true;
        },
    });
}

describe('Controls/lookup:Input', () => {
    it('paste method', async () => {
        const lookup = await getBaseLookup();
        const pasteStub = jest.fn();
        lookup._children.inputRender = {
            paste: pasteStub,
        };

        lookup.paste('test123');

        expect(pasteStub).toHaveBeenCalledWith('test123');
    });

    describe('_beforeMount', () => {
        it('with source and without selectedKeys', async () => {
            const lookup = await getBaseLookup();
            expect(lookup._items.getCount()).toEqual(0);
        });

        it('without source and without selectedKeys', async () => {
            const options = {
                source: null,
                selectedKeys: [],
            };
            const lookup = await getBaseLookup(
                options as unknown as ILookupOptions
            );
            expect(lookup._items.getCount()).toEqual(0);
        });

        it('without source and selectedKeys but with items option', async () => {
            const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
            const options = {
                source: null,
                selectedKeys: [],
                multiSelect: true,
                keyProperty: 'id',
                items: new RecordSet({
                    rawData: data,
                    keyProperty: 'id',
                }),
            };

            const lookup = await getBaseLookup(
                options as unknown as ILookupOptions
            );
            expect(lookup._items.getCount()).toEqual(data.length);
        });

        it('with source and items but without selectedKeys option', async () => {
            const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
            const options = {
                source: getSource(),
                selectedKeys: undefined,
                multiSelect: true,
                items: new RecordSet({
                    rawData: data,
                    keyProperty: 'id',
                }),
            };

            const lookup = await getBaseLookup(
                options as unknown as ILookupOptions
            );

            expect(lookup._items.getCount()).toEqual(data.length);
            expect(lookup._lookupController.getSelectedKeys()).toHaveLength(
                data.length
            );
        });

        it('with source and items and selectedKeys option', async () => {
            const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
            const options = {
                source: getSource(),
                selectedKeys: [1, 2, 3],
                multiSelect: true,
                items: new RecordSet({
                    rawData: data,
                    keyProperty: 'id',
                }),
            };

            const lookup = await getBaseLookup(
                options as unknown as ILookupOptions
            );

            expect(lookup._items.getCount()).toEqual(data.length);
            expect(lookup._lookupController.getSelectedKeys()).toHaveLength(
                data.length
            );
        });

        it('with dataLoadCallback', async () => {
            let isDataLoadCallbackCalled = false;
            const items = new RecordSet({
                keyProperty: 'id',
            });
            const dataLoadCallback = () => {
                isDataLoadCallbackCalled = true;
            };

            await getBaseLookup(
                { dataLoadCallback } as unknown as ILookupOptions,
                items
            );
            expect(isDataLoadCallbackCalled).toBeTruthy();
        });
    });

    describe('_beforeUpdate', () => {
        it('selectedKeys changed in new options', async () => {
            let lookupOptions = {
                ...getLookupOptions(),
                selectedKeys: [1],
            };
            const lookup = await getBaseLookup(lookupOptions);
            const spy = jest.spyOn(lookup, '_notify').mockClear();

            lookupOptions = { ...lookupOptions };
            lookupOptions.selectedKeys = [2];
            await lookup._beforeUpdate(lookupOptions);
            expect(spy).toHaveBeenCalledWith('itemsChanged', expect.anything());

            lookupOptions = { ...lookupOptions };
            lookupOptions.selectedKeys = [];
            spy.mockClear();
            await lookup._beforeUpdate(lookupOptions);
            expect(spy).toHaveBeenCalledWith('itemsChanged', expect.anything());
        });

        it('mount with receivedState then update with new selectedKeys', async () => {
            const items = new RecordSet({
                rawData: [getData()[0]],
                keyProperty: 'id',
            });
            const source = getSource();
            const prefetchSource = new PrefetchProxy({
                target: source,
                data: {
                    query: items,
                },
            });
            let lookupOptions = {
                ...getLookupOptions(),
                selectedKeys: [1],
                source: prefetchSource,
            };
            let itemsFromEvent;
            const lookup = await getBaseLookup(lookupOptions, items);

            lookup._notify = function mockNotify(
                eventName: string,
                res: unknown[]
            ): void {
                if (eventName === 'itemsChanged') {
                    itemsFromEvent = res[0];
                }
            };

            lookupOptions = { ...lookupOptions };
            lookupOptions.selectedKeys = [2];
            await lookup._beforeUpdate(lookupOptions);
            expect(itemsFromEvent).toBeTruthy();
            expect(itemsFromEvent !== items).toBeTruthy();
        });
    });

    describe('handlers', () => {
        it('addItem', async () => {
            const lookup = await getBaseLookup();
            lookup._addItem(new Model());
            expect(lookup._items.getCount()).toEqual(1);
        });
    });

    describe('_notifyChanges', () => {
        it('item added', async () => {
            const lookup = await getBaseLookup();
            let added;
            let deleted;
            lookup._options.selectedKeys = [1];
            lookup._lookupController.getSelectedKeys = () => {
                return [1, 3];
            };
            lookup._notify = (action, data) => {
                if (action === 'selectedKeysChanged') {
                    added = data[1];
                    deleted = data[2];
                }
            };
            lookup._notifyChanges();
            expect(added).toEqual([3]);
            expect(deleted).toEqual([]);
        });

        it('item deleted and added', async () => {
            const lookup = await getBaseLookup();
            let added;
            let deleted;
            lookup._options.selectedKeys = [1, 4, 5];
            lookup._lookupController.getSelectedKeys = () => {
                return [1, 4, 6];
            };
            lookup._notify = (action, data) => {
                if (action === 'selectedKeysChanged') {
                    added = data[1];
                    deleted = data[2];
                }
            };
            lookup._notifyChanges();
            expect(added).toEqual([6]);
            expect(deleted).toEqual([5]);
        });
    });

    describe('_selectCallback', () => {
        it('_selectCallback with items', async () => {
            const lookup = await getBaseLookup({
                multiSelect: true,
            });
            jest.spyOn(lookup, '_itemsChanged')
                .mockClear()
                .mockImplementation();
            const items = new RecordSet({
                rawData: getData(),
                keyProperty: 'id',
            });
            lookup._selectCallback(null, items);
            expect(lookup._items === items).toBeTruthy();
        });

        it('_selectCallback with promise', async () => {
            const lookup = await getBaseLookup({
                multiSelect: true,
            });
            jest.spyOn(lookup, '_itemsChanged')
                .mockClear()
                .mockImplementation();
            const items = new RecordSet({
                rawData: getData(),
                keyProperty: 'id',
            });
            const promise = Promise.resolve(items);
            lookup._selectCallback(null, promise);
            await promise;
            expect(lookup._items === items).toBeTruthy();
        });
    });
});
