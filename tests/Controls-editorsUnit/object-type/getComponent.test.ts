import { NumberType } from 'Meta/types';
import { getComponent } from 'Controls-editors/_object-type/utils/getComponent';

describe('Controls-editors/object-type:getComponent Получение редактора по метатипу', () => {
    it('Тип Test2 наследуется от number и Test1. Результат: Получили редактор от Test1', () => {
        const metaType = NumberType.id('Test1').id('Test2');

        const numberEditor = () => {};
        const test1Editor = () => {};

        const defaultEditors = {
            number: numberEditor,
            Test1: test1Editor,
        };
        const resolvedEditor = getComponent(metaType, defaultEditors);

        expect(resolvedEditor === test1Editor).toBeTruthy();
    });
});
