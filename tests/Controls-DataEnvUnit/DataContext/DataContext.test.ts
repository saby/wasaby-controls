import { DataContextAPI } from 'Controls-DataEnv/context';
import { testCases } from './DataContext';
import 'Types/collection';
import { Model } from 'Types/entity';

describe('Controls-DataEnv/context:DataContext', () => {
    describe('getByName', () => {
        test('Поиск объекта по имени в корне контекста', () => {
            const dataContext = new DataContextAPI(testCases.findObjectByName);
            expect(dataContext.getByName('CurrentUser')).toBeInstanceOf(Model);
            expect(dataContext.getByName('CurrentUser').get('ФИО')).toEqual('Текущий пользователь');
        });
        test('Поиск поля по имени внутри объекта. Должно вернуться ФИО из ближайшего сотрудника', () => {
            const dataContext = new DataContextAPI(testCases.findObjectByName);
            expect(dataContext.getByName('ФИО')).toEqual('Другой пользователь');
        });
    });

    describe('getByType', () => {
        test('Должен вернуться пользователь из фильтра, т.к фильтр самый близкий по вложенности', () => {
            const dataContext = new DataContextAPI(testCases.findObjectInNestedModels);
            expect(dataContext.getByType('User')).toBeInstanceOf(Model);
            expect(dataContext.getByType('User').get('ФИО')).toEqual('Пользователь из фильтра');
        });

        test('Должен вернуться объект согласно типу', () => {
            const dataContext = new DataContextAPI(testCases.findObjectInNestedModels);
            expect(dataContext.getByType('Filter')).toBeInstanceOf(Model);
            expect(dataContext.getByType('Filter').getTypeName()).toEqual('Filter');
        });
    });

    describe('getByPath', () => {
        test('Поиск по пути', () => {
            const dataContext = new DataContextAPI(testCases.getValueByName);
            expect(dataContext.getByPath('UserWithContractor.Контрагент.ФИО')).toEqual(
                'ФИО Контрагента'
            );
        });
    });
});
