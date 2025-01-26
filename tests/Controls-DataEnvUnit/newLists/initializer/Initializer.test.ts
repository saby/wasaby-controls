import { Initializer } from 'Controls-DataEnv/newLists/_abstractList/Initializer';
import * as ErrorDescriptors from 'Controls-DataEnv/newLists/_abstractList/ErrorDescriptors';
import { RecordSet } from 'Types/collection';

describe('Controls-DataEnv/abstractList:Initializer', () => {
    const loadResult = { isLatestInteractorVersion: false };
    const config = {
        items: new RecordSet(),
        metaData: [],
        keyProperty: 'id',
    };
    let mockedErrorCallback: jest.SpyInstance;
    beforeEach(() => {
        mockedErrorCallback = jest.spyOn(ErrorDescriptors, 'DUPLICATES_IN_ARRAY');
    });
    afterEach(() => {
        mockedErrorCallback.mockRestore();
    });
    describe('operationsPanel', () => {
        it('Счетчик выбранных записей в пмо должен инициализироваться со значением 0', () => {
            const initState = Initializer.getState(loadResult, config);
            expect(initState.count).toEqual(0);
        });
    });

    describe('hierarchy', () => {
        it('Если передан массив ключей с дублями, выбрасывается ошибка и дубли удаляются', () => {
            const customConfig = {
                ...config,
                expandedItems: [1, 2, 2, 3],
                collapsedItems: [4, 5, 5, 6],
            };
            const initState = Initializer.getState(loadResult, customConfig);

            expect(initState.expandedItems).toEqual([1, 2, 3]);
            expect(initState.collapsedItems).toEqual([4, 5, 6]);
            expect(mockedErrorCallback.mock.calls.length).toBe(2);
        });
    });
    describe('selection.', () => {
        it('Если передан массив ключей с дублями, выбрасывается ошибка и дубли удаляются', () => {
            const customConfig = {
                ...config,
                selectedKeys: [1, 2, 2, 3],
                excludedKeys: [4, 5, 5, 6],
            };
            const initState = Initializer.getState(loadResult, customConfig);

            expect(initState.selectedKeys).toEqual([1, 2, 3]);
            expect(initState.excludedKeys).toEqual([4, 5, 6]);
            expect(mockedErrorCallback.mock.calls.length).toBe(2);
        });
    });
});
