import { DataContext } from 'Controls-DataEnv/dataContext';
import { testCases } from './DataContext';
import 'Types/collection';

describe('Controls-DataEnv/dataContext', () => {
    describe('getObject', () => {
        test('Поиск объекта по типу или имени', () => {
            const dataContext = new DataContext({
                data: testCases.findObjectByName,
            }).getAPI(['root', 'frame']);

            expect(dataContext.getObject('User')?.get('ФИО')).toEqual('Другой пользователь');
            expect(dataContext.getObject('CurrentUser')?.get('ФИО')).toEqual(
                'Текущий пользователь'
            );
        });
        test('Поиск объекта по типу во вложенном объекте', () => {
            const dataContext = new DataContext({
                data: testCases.findObjectInNestedModels,
            }).getAPI(['root', 'frame']);

            expect(dataContext.getObject('User')?.get('ФИО')).toBe('Пользователь из фильтра');
            expect(dataContext.getObject('CurrentUser')?.get('ФИО')).toEqual(
                'Текущий пользователь'
            );
        });

        describe('getValue', () => {
            test('получение значения по имени', () => {
                const dataContext = new DataContext({
                    data: testCases.getValueByName,
                }).getAPI(['root', 'frame']);

                expect(dataContext.getValue('ФИО')).toBe('Другой пользователь');
                expect(dataContext.getValue('ФИО', ['CurrentUser'])).toBe('Текущий пользователь');
                expect(dataContext.getValue('ФИО', ['User'])).toBe('Другой пользователь');
                expect(dataContext.getValue('ФИО', ['UserWithContractor', 'Контрагент'])).toBe(
                    'ФИО Контрагента'
                );
                expect(dataContext.getValue('ФИО', ['ContractorUser', 'Контрагент'])).toBe(
                    'ФИО Контрагента'
                );
            });
        });
    });
});
