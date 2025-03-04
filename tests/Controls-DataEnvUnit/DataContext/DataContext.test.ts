import { DataContextAPI } from 'Controls-DataEnv/context';
import { testCases } from './DataContext';
import 'Types/collection';
import { Model } from 'Types/entity';

describe('Controls-DataEnv/context', () => {
    describe('getObject', () => {
        test('Поиск объекта по типу или имени', () => {
            const dataContext = new DataContextAPI({
                data: testCases.findObjectByName,
            }).getAPI(['root', 'frame']);

            expect(dataContext.getObject('User')?.get('ФИО')).toEqual('Другой пользователь');
            expect(dataContext.getObject('CurrentUser')?.get('ФИО')).toEqual(
                'Текущий пользователь'
            );
        });
        test('Поиск объекта по типу во вложенном объекте', () => {
            const dataContext = new DataContextAPI({
                data: testCases.findObjectInNestedModels,
            }).getAPI(['root', 'frame']);

            expect(dataContext.getObject('User')?.get('ФИО')).toBe('Пользователь из фильтра');
            expect(dataContext.getObject('CurrentUser')?.get('ФИО')).toEqual(
                'Текущий пользователь'
            );
        });

        describe('getValue', () => {
            test('получение значения по имени', () => {
                const dataContext = new DataContextAPI({
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

        describe('serialize', () => {
            test('Контекст данных должен сериализоваться в массив объектов с учетом порядка вложенности', () => {
                const dataContext = new DataContextAPI({
                    data: testCases.findObjectByName,
                }).getAPI(['root', 'frame']);

                const serializeResult = dataContext.serialize();

                expect(serializeResult[0].name).toBe('AnotherUser');
                expect(serializeResult[1].name).toBe('CurrentUser');
                expect(serializeResult[0].value).toBeInstanceOf(Model);
                expect(serializeResult[1].value).toBeInstanceOf(Model);
            });
        });
    });
});
