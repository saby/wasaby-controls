import {
    default as BaseControllerClass,
    ILookupBaseControllerOptions,
} from 'Controls/_lookup/BaseControllerClass';
import { Memory, SbisService } from 'Types/source';
import { RecordSet, List } from 'Types/collection';
import { Model } from 'Types/entity';
import * as error from 'Controls/error';
import { Service } from 'Controls/history';
import { isEqual } from 'Types/object';

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
        keyProperty: 'id',
        data: getData(),
        filter: (item, where) => {
            let result;

            if (!where.id) {
                result = true;
            } else {
                result = where.id.includes(item.get('id'));
            }

            return result;
        },
    });
}
const source = getSource();

const sourceWithError = getSource();
sourceWithError.query = () => {
    const error = new Error();
    error.processed = true;
    return Promise.reject(error);
};

function getRecordSet(): RecordSet {
    return new RecordSet({
        rawData: getData(),
        keyProperty: 'id',
    });
}

function getControllerOptions(): Partial<ILookupBaseControllerOptions> {
    return {
        selectedKeys: [],
        multiSelect: true,
        source,
        keyProperty: 'id',
        displayProperty: 'title',
    };
}

function getLookupControllerWithEmptySelectedKeys(
    additionalConfig?: Partial<ILookupBaseControllerOptions>
): BaseControllerClass {
    let options = getControllerOptions();
    options = { ...options, ...additionalConfig };
    return new BaseControllerClass(options as ILookupBaseControllerOptions);
}

function getLookupControllerWithSelectedKeys(additionalConfig?: object): BaseControllerClass {
    let options = getControllerOptions();
    options.selectedKeys = [0, 1, 2];
    options = { ...options, ...additionalConfig };
    return new BaseControllerClass(options as ILookupBaseControllerOptions);
}

function getLookupControllerWithoutSelectedKeys(additionalConfig?: object): BaseControllerClass {
    let options = getControllerOptions();
    delete options.selectedKeys;
    options = { ...options, ...additionalConfig };
    return new BaseControllerClass(options as ILookupBaseControllerOptions);
}

class CustomModel extends Model {
    protected _moduleName: string = 'customModel';
    protected _$properties = {
        isCustom: {
            get(): boolean {
                return true;
            },
        },
    };
}

describe('Controls/_lookup/BaseControllerClass', () => {
    describe('loadItems', () => {
        it('simple loadItems', () => {
            const controller = getLookupControllerWithSelectedKeys();

            return new Promise((resolve) => {
                controller.loadItems().then((items) => {
                    controller.setItems(items);
                    const resultItemsCount = 3;
                    expect(controller.getItems().getCount()).toBe(resultItemsCount);
                    resolve();
                });
            });
        });

        it('source returns error', () => {
            const controller = getLookupControllerWithSelectedKeys({
                source: sourceWithError,
            });

            return new Promise((resolve) => {
                const errorStub = jest.spyOn(error, 'process').mockClear().mockImplementation();
                controller.loadItems().then((result) => {
                    expect(errorStub).toHaveBeenCalledTimes(1);
                    expect(result).toBeInstanceOf(List);
                    errorStub.mockRestore();
                    resolve();
                });
            });
        });

        it('load with selectFields option', async () => {
            const controller = getLookupControllerWithSelectedKeys({
                selectFields: ['id'],
            });
            const items = (await controller.loadItems()) as RecordSet;
            expect(items.at(0).get('id') !== undefined).toBeTruthy();
            expect(items.at(0).get('title') === undefined).toBeTruthy();
        });
    });

    describe('update', () => {
        it('source is changed while loading', async () => {
            const controller = getLookupControllerWithSelectedKeys();
            controller.loadItems();
            const spyCancelLoading = jest
                .spyOn(controller._sourceController, 'cancelLoading')
                .mockClear();

            const options = getControllerOptions();
            options.source = getSource();
            await controller.update(options);
            expect(spyCancelLoading).toHaveBeenCalledTimes(1);
            spyCancelLoading.mockRestore();
        });

        it('keys not changed after removeItem', async () => {
            const options = getControllerOptions();
            const controller = getLookupControllerWithSelectedKeys();

            options.selectedKeys = [0, 1, 2];
            const item = new Model({
                rawData: getData()[0],
                keyProperty: 'id',
            });

            controller.setItems(getRecordSet());
            controller.removeItem(item);
            expect(controller.update(options)).toBeTruthy();
            const items = await controller.loadItems();
            expect(items.getCount()).toBe(3);
        });

        it('update without keys in options', async () => {
            const controller = getLookupControllerWithoutSelectedKeys();

            controller.setItemsAndSelectedKeys(getRecordSet());
            expect(controller.getSelectedKeys()).toEqual([0, 1, 2]);

            const options = getControllerOptions();
            delete options.selectedKeys;
            controller.update(options as ILookupBaseControllerOptions);
            expect(controller.getSelectedKeys()).toEqual([0, 1, 2]);
        });

        it('update selectedKeys', async () => {
            const controller = getLookupControllerWithSelectedKeys();
            let items;

            let newOptions = getControllerOptions();
            newOptions.selectedKeys = [0, 1];
            items = await controller.update(newOptions as ILookupBaseControllerOptions);
            expect(items.getCount()).toBe(2);
            expect(controller.getSelectedKeys()).toEqual([0, 1]);

            newOptions = getControllerOptions();
            newOptions.selectedKeys = [0, 1, 2];
            items = await controller.update(newOptions as ILookupBaseControllerOptions);
            expect(items.getCount()).toBe(3);
            expect(controller.getSelectedKeys()).toEqual([0, 1, 2]);

            newOptions = getControllerOptions();
            newOptions.selectedKeys = [];
            items = await controller.update(newOptions as ILookupBaseControllerOptions);
            expect(controller.getSelectedKeys()).toEqual([]);
        });

        it('update source', async () => {
            const controller = getLookupControllerWithSelectedKeys();
            controller.setItems(await controller.loadItems());

            const newOptions = getControllerOptions();
            // same keys
            newOptions.selectedKeys = [0, 1, 2];
            newOptions.source = getSource();
            expect(controller.update(newOptions as ILookupBaseControllerOptions)).toBeInstanceOf(
                Promise
            );
        });

        it('items and selectedKeys updated', async () => {
            const controller = getLookupControllerWithEmptySelectedKeys();
            const newOptions = getControllerOptions();

            newOptions.selectedKeys = [0, 1, 2];
            newOptions.items = new RecordSet({
                rawData: getData(),
                keyProperty: 'id',
            });

            expect(controller.update(newOptions as ILookupBaseControllerOptions)).toBe(true);
        });

        it('items are updated', async () => {
            const controller = getLookupControllerWithEmptySelectedKeys();
            const newOptions = getControllerOptions();

            newOptions.items = new RecordSet({ rawData: getData() });

            expect(controller.update(newOptions as ILookupBaseControllerOptions)).toBe(true);
            expect(controller.getSelectedKeys()).toEqual([0, 1, 2]);
        });

        it('items already updated', async () => {
            const controller = getLookupControllerWithEmptySelectedKeys();
            const newOptions = getControllerOptions();
            const items = new RecordSet({
                rawData: getData(),
                keyProperty: 'id',
            });

            newOptions.selectedKeys = [0, 1, 2];
            newOptions.items = items;
            controller._items = items;

            expect(controller.update(newOptions as ILookupBaseControllerOptions)).toBeUndefined();
        });
    });

    it('setItems', () => {
        const resultItemsCount = 3;
        const controller = getLookupControllerWithEmptySelectedKeys();
        controller.setItems(getRecordSet());
        expect(controller.getItems().getCount()).toBe(resultItemsCount);
    });

    it('setItemsAndSelectedKeys', () => {
        const controller = getLookupControllerWithEmptySelectedKeys();
        controller.setItemsAndSelectedKeys(getRecordSet());
        expect(controller.getSelectedKeys()).toEqual([0, 1, 2]);
    });

    it('getItems', () => {
        const resultItemsCount = 3;
        const controller = getLookupControllerWithEmptySelectedKeys();
        controller.setItems(getRecordSet());
        expect(controller.getItems().getCount()).toBe(resultItemsCount);
    });

    it('addItem', () => {
        const controller = getLookupControllerWithEmptySelectedKeys();
        const item = new Model({
            rawData: getData()[0],
            keyProperty: 'id',
        });
        controller.addItem(item);

        expect(controller.getItems().getCount()).toBe(1);
        expect(controller.getItems().at(0).get('title')).toBe('Sasha');
    });

    it('addItem source model is preparing', () => {
        const controller = getLookupControllerWithEmptySelectedKeys({
            source: new SbisService({
                model: CustomModel,
            }),
        });
        const item = new Model({
            rawData: getData()[0],
            keyProperty: 'id',
        });
        controller.addItem(item);

        expect(controller.getItems().at(0)).toBeInstanceOf(CustomModel);
    });

    describe('removeItem', () => {
        it('simple removeItem', () => {
            const controller = getLookupControllerWithSelectedKeys();
            const item = new Model({
                rawData: getData()[0],
                keyProperty: 'id',
            });
            const recordSet = getRecordSet();

            controller.setItems(recordSet);
            controller.removeItem(item);
            expect(controller.getSelectedKeys()).toEqual([1, 2]);
            expect(controller.getItems().getCount()).toBe(2);
            expect(
                !isEqual(recordSet.getRawData(), controller.getItems().getRawData())
            ).toBeTruthy();
        });

        it('update after removeItem', async () => {
            let options = getControllerOptions();
            options.selectedKeys = [1];
            const controller = new BaseControllerClass(options as ILookupBaseControllerOptions);
            controller.setItems(await controller.loadItems());

            expect(controller.getSelectedKeys()).toEqual([1]);
            expect(controller.getItems().getCount()).toBe(1);

            options = { ...options };
            options.selectedKeys = [];
            controller.removeItem(
                new Model({
                    rawData: getData()[1],
                    keyProperty: 'id',
                })
            );

            expect(controller.update(options as ILookupBaseControllerOptions)).toBeFalsy();
        });
    });

    it('getSelectedKeys', () => {
        const controller = getLookupControllerWithEmptySelectedKeys();
        controller.setItemsAndSelectedKeys(getRecordSet());
        expect(controller.getSelectedKeys()).toEqual([0, 1, 2]);
    });

    it('getTextValue', () => {
        const controller = getLookupControllerWithSelectedKeys();

        return new Promise((resolve) => {
            controller.loadItems().then((items) => {
                controller.setItems(items);
                expect(controller.getTextValue()).toBe('Sasha, Aleksey, Dmitry');
                resolve();
            });
        });
    });

    it('setItemsAndSaveToHistory', async () => {
        const controller = getLookupControllerWithEmptySelectedKeys({
            historyId: 'TEST_HISTORY_ID',
        });
        const historyService = await controller.setItemsAndSaveToHistory(getRecordSet());

        expect(historyService).toBeInstanceOf(Service);
        expect(controller.getSelectedKeys()).toEqual([0, 1, 2]);
    });
});
