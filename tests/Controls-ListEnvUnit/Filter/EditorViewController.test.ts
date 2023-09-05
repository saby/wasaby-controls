import { fake, replace } from 'sinon';
import { IFilterItem } from 'Controls/filter';
import { EditorViewController } from 'Controls-ListEnv/filterConnected';

/* eslint-disable no-magic-numbers */
function getFilterButtonItems(): IFilterItem[] {
    return [
        {
            name: 'name',
            caption: 'Имя',
            value: [],
            resetValue: [],
            viewMode: 'basic',
            textValue: '',
        },
        {
            name: 'city',
            caption: 'Город проживания',
            value: [],
            resetValue: [],
            viewMode: 'basic',
            textValue: '',
        },
    ];
}

describe('Controls-ListEnv/_filter:EditorViewController', () => {
    let controller: EditorViewController = null;

    beforeEach(() => {
        controller = new EditorViewController({
            displayProperty: 'caption',
            filterNames: [],
        });
    });

    afterEach(() => {
        controller = null;
    });

    describe('.getFilterName()', () => {
        it('should return empty filter name by default', () => {
            const source = controller.getFilterName();
            expect(source).not.toBeDefined();
        });
    });

    describe('.setFilterName()', () => {
        it('should set first name from array"', () => {
            const names = ['test1', 'test2', 'test3'];
            controller.setFilterName(names);
            expect(controller.getFilterName(names)).toEqual(names[0]);
        });

        it('should set and return first name from array"', () => {
            const names = ['test1', 'test2', 'test3'];
            const result = controller.setFilterName(names);
            expect(result).toEqual(names[0]);
        });
    });

    describe('.getEditorOptions()', () => {
        it('should return empty options by default', () => {
            const source = controller.getEditorOptions();
            expect(source).not.toBeDefined();
        });
    });

    describe('.setEditorOptions()', () => {
        it('should set editorOptions', () => {
            const options = {
                foo: 'bar',
            };

            controller.setEditorsOptions(options);
            expect(controller.getEditorOptions()).toEqual(options);
        });

        it('should return editorOptions', () => {
            const options = {
                foo: 'bar',
            };

            const result = controller.setEditorsOptions(options);
            expect(result).toEqual(options);
        });
    });

    describe('.getEditorItem()', () => {
        it('should return nothing for empty items', () => {
            const result = controller.getEditorItem([]);
            expect(result).not.toBeDefined();
        });

        it('should return editor item by name', () => {
            controller.setFilterName(['name', 'city']);
            const result = controller.getEditorItem(getFilterButtonItems());
            expect(result.name).toEqual('name');
        });
    });

    describe('.getFilterSourceByValue()', () => {
        it('should return result for simple selected key', () => {
            const selectedKey = 'name';
            const textValue = 'test';

            replace(controller, '_getTextValue', fake.returns(textValue));

            controller.setFilterName(['name', 'city']);
            const items = getFilterButtonItems();
            const result = controller.getFilterSourceByValue(selectedKey, items);

            expect(result[0].value).toEqual(selectedKey);
            expect(result[0].textValue).toEqual(textValue);
        });

        it('should return result for multiple selected keys', () => {
            const selectedKey = ['name', 'city'];
            const expected = 'test, test';

            replace(controller, '_getTextValue', fake.returns('test'));

            controller.setFilterName(['name', 'city']);
            const items = getFilterButtonItems();
            const result = controller.getFilterSourceByValue(selectedKey, items);

            expect(result[0].value).toEqual(selectedKey);
            expect(result[0].textValue).toEqual(expected);
        });
    });
});
