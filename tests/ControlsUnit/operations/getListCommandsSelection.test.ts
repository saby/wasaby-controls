import { getListCommandsSelection } from 'Controls/operations';

describe('Controls/operations:getListCommandsSelection', function () {
    it('Если selectedKeys/excludedKeys не пустые, selection формируется по ним', () => {
        const selectedKeys = ['testSelectedKey'];
        const excludedKeys = ['testExcludedKey'];
        const listCommandsSelection = getListCommandsSelection(
            { selectedKeys, excludedKeys },
            null,
            { selected: [0], excluded: [1] }
        );
        expect(listCommandsSelection).toEqual({ selected: selectedKeys, excluded: excludedKeys });
    });

    it('Если selectedKeys/excludedKeys пустые, в selection добавляется маркер', () => {
        const listCommandsSelection = getListCommandsSelection(
            { selectedKeys: [], excludedKeys: [] },
            'testMarkedKey'
        );
        expect(listCommandsSelection).toEqual({ selected: ['testMarkedKey'], excluded: [] });
    });

    it('Если есть отобранные записи (с помощью команды ПМО "Отобрать отмеченные", то отобранные записи попадают в selection', () => {
        const selectionForSelectedItems = { selected: [0], excluded: [1] };
        const listCommandsSelection = getListCommandsSelection(
            { selectedKeys: [], excludedKeys: [] },
            'testMarkedKey',
            selectionForSelectedItems
        );
        expect(listCommandsSelection).toEqual(selectionForSelectedItems);
    });
});
