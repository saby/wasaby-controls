import { IListState, ListSlice } from 'Controls/dataFactory';
import { RecordSet } from 'Types/collection';
import { Memory } from 'Types/source';
import 'Controls/search';
import 'Controls/operations';

describe('Controls/dataFactory:ListSlice тесты изменения стейта selectionViewMode при различных сценариях', () => {
    it('selectionViewMode сбрасывается при перезагрузке (вызов метода reload)', () => {
        return new Promise((resolve) => {
            const source = new Memory();
            const items = new RecordSet();
            const itemsVersion = items.getVersion();
            const onChange = (state) => {
                if (itemsVersion !== state.items.getVersion()) {
                    resolve(state);
                }
            };
            const slice = new ListSlice({
                onChange,
                config: {
                    source,
                    dataLoadedReturnPromise: false,
                    searchParam: 'testSearchParam',
                },
                loadResult: {
                    items,
                },
            });

            slice.setSelectionViewMode('selected');
            expect(slice.state.selectionViewMode).toEqual('selected');

            slice.reload();
        }).then((state: IListState) => {
            expect(state.selectionViewMode).toEqual('hidden');
        });
    });

    it('При установке selectionViewMode: selected счётчик отмеченных записей и выделение сохраняется', () => {
        const selectedKeys = [1, 2];
        const excludedKeys = [3, 4];
        const source = new Memory();
        const items = new RecordSet();
        const slice = new ListSlice({
            onChange: () => {},
            config: {
                source,
                dataLoadedReturnPromise: false,
                searchParam: 'testSearchParam',
                selectedKeys,
                excludedKeys,
            },
            loadResult: {
                items,
            },
        });
        const TEST_COUNT_VALUE = 10;

        slice.setSelectionCount(TEST_COUNT_VALUE, false);
        slice.executeCommand('selected');
        slice.setSelectionViewMode('selected');
        expect(slice.state.showSelectedCount).toEqual(TEST_COUNT_VALUE);
        expect(slice.state.listCommandsSelection).toEqual({
            selected: selectedKeys,
            excluded: excludedKeys,
        });
    });

    it('При отображении всех записей по команде "Показать все", ранее отмеченные записи не должны сбрасываться', () => {
        const TEST_COUNT_VALUE = 2;
        return new Promise((resolve) => {
            const source = new Memory();
            const items = new RecordSet();
            const itemsVersion = items.getVersion();
            const onChange = (state) => {
                if (itemsVersion !== state.items.getVersion()) {
                    resolve(state);
                }
            };
            const slice = new ListSlice({
                onChange,
                config: {
                    source,
                    dataLoadedReturnPromise: false,
                    searchParam: 'testSearchParam',
                },
                loadResult: {
                    items,
                },
            });

            slice.setSelectionViewMode('selected');

            slice.setSelectionCount(TEST_COUNT_VALUE, true);
            slice.setSelectedKeys([0, 1]);

            slice.setSelectionViewMode('all');
        }).then((state: IListState) => {
            expect(state.count).toEqual(TEST_COUNT_VALUE);
            expect(state.selectedKeys).toEqual([0, 1]);
            expect(state.isAllSelected).toBeFalsy();
        });
    });
});
