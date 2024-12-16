import { Initializer } from 'Controls-DataEnv/newLists/_abstractList/Initializer';
import { RecordSet } from 'Types/collection';

describe('Controls-DataEnv/abstractList:Initializer', () => {
    const loadResult = { isLatestInteractorVersion: false };
    const config = {
        items: new RecordSet(),
        metaData: [],
        keyProperty: 'id',
    };

    describe('operationsPanel', () => {
        it('Счетчик выбранных записей в пмо должен инициализироваться со значением 0', () => {
            const initState = Initializer.getState(loadResult, config);
            expect(initState.count).toEqual(0);
        });
    });
});
