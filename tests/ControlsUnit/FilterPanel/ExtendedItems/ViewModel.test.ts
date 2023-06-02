import ViewModel, {IExtendedViewModelOptions} from 'Controls/_filterPanel/ExtendedItems/ViewModel';
import { IFilterItem } from 'Controls/filter';

function getViewModel(
    viewModelOptions: Partial<IExtendedViewModelOptions>
): ViewModel {
    return new ViewModel({
        ...viewModelOptions,
        typeDescription: viewModelOptions.typeDescription || []
    });
}

describe('Controls/filterPanel:ViewModel', () => {
    describe('getExtendedFilterItems', () => {
        it('returns only extended items', () => {
            const typeDescription = [
                {
                    name: 'employee',
                    viewMode: 'basic',
                    value: '',
                },
                {
                    name: 'employee1',
                    viewMode: 'extended',
                    value: '',
                },
            ] as IFilterItem[];
            const viewModel = getViewModel({ typeDescription });
            expect(
                viewModel.getExtendedFilterItems()[0].viewMode === 'extended'
            ).toBeTruthy();
            expect(
                viewModel.getExtendedFilterItems().length === 1
            ).toBeTruthy();
        });

        it('returns basic and changed frequent items', () => {
            const typeDescription = [
                {
                    name: 'employee',
                    viewMode: 'frequent',
                    value: '123',
                    resetValue: '',
                },
                {
                    name: 'employee1',
                    viewMode: 'frequent',
                    value: '',
                    resetValue: '',
                    extendedCaption: 'employee1',
                },
                {
                    name: 'employee2',
                    viewMode: 'extended',
                    value: '',
                },
            ] as IFilterItem[];
            const viewModel = getViewModel({ typeDescription, viewMode: 'popup' });
            expect(
                viewModel.getExtendedFilterItems()[0].viewMode === 'frequent'
            ).toBeTruthy();
            expect(
                viewModel.getExtendedFilterItems()[1].viewMode === 'extended'
            ).toBeTruthy();
            expect(
                viewModel.getExtendedFilterItems().length === 2
            ).toBeTruthy();
        });
    });

    describe('getVisibleAdditionalColumns', () => {
        it('additional list expanded', () => {
            const typeDescription = [
                {
                    name: 'left',
                    viewMode: 'basic',
                    editorOptions: {
                        extendedCaption: 'left',
                    },
                },
                {
                    name: 'right',
                    viewMode: 'extended',
                },
            ];
            const viewModel = getViewModel({ typeDescription });
            const columns = viewModel.getVisibleAdditionalColumns();
            expect(columns.left.length).toEqual(0);
            expect(columns.right[0].name).toEqual('right');
        });

        it('additional list expanded, check order', () => {
            const typeDescription = [];
            const filtersCount = 10;
            for (let i = 0; i <= filtersCount; i++) {
                typeDescription.push({
                    name: '' + i,
                    viewMode: 'extended',
                    order: filtersCount - i,
                });
            }
            const viewModel = getViewModel({ typeDescription });
            viewModel.toggleListExpanded();
            const columns = viewModel.getVisibleAdditionalColumns();
            const names = columns.left.map((column) => {
                return column.name;
            });
            expect(names).toEqual(['0', '1', '2', '3', '4', '5']);
            expect(columns.left.length).toEqual(6);
            expect(columns.right.length).toEqual(5);
        });

        it('additional list collapsed, all items are visible', () => {
            const typeDescription = []; // 11 элементов
            for (let i = 0; i <= 10; i++) {
                typeDescription.push({
                    name: '' + i,
                    viewMode: 'extended',
                });
            }
            const viewModel = getViewModel({ typeDescription });
            const columns = viewModel.getVisibleAdditionalColumns();
            expect(columns.left.length + columns.right.length).toEqual(11);
            expect(typeDescription.length).toEqual(11);
        });

        it('additional list collapsed, 10 items are visible', () => {
            const typeDescription = []; // 15 элементов
            for (let i = 0; i <= 14; i++) {
                typeDescription.push({
                    name: '' + i,
                    viewMode: 'extended',
                });
            }
            const viewModel = getViewModel({ typeDescription });
            const columns = viewModel.getVisibleAdditionalColumns();
            expect(columns.left.length + columns.right.length).toEqual(10);
            expect(typeDescription.length).toEqual(15);
        });

        it('additional list collapsed basic item', () => {
            const typeDescription = []; // 12 элементов
            for (let i = 0; i <= 10; i++) {
                typeDescription.push({
                    name: '' + i,
                    viewMode: 'extended',
                });
            }
            typeDescription.unshift({
                name: 'bas',
                viewMode: 'basic',
            });
            const viewModel = getViewModel({ typeDescription });
            const columns = viewModel.getVisibleAdditionalColumns();
            expect(columns.left.length + columns.right.length).toEqual(11);
            expect(typeDescription.length).toEqual(12);
        });
    });

    describe('needToCutColumnItems', () => {
        it('1 extended item, cut is invisible', () => {
            const typeDescription = [
                {
                    name: 'right',
                    viewMode: 'extended',
                },
            ];
            const viewModel = getViewModel({ typeDescription });
            expect(viewModel.needToCutColumnItems()).toBeFalsy();
        });

        it('10 extended items in columns, cut is visible', () => {
            const typeDescription = []; // 20 элементов
            for (let i = 0; i < 20; i++) {
                typeDescription.push({
                    name: '' + i,
                    viewMode: 'extended',
                });
            }
            const viewModel = getViewModel({ typeDescription });
            expect(viewModel.needToCutColumnItems()).toBeTruthy();
        });

        it('5 extended items in columns, cut is invisible', () => {
            const typeDescription = [];
            for (let i = 0; i < 10; i++) {
                typeDescription.push({
                    name: '' + i,
                    viewMode: 'extended',
                });
            }
            const viewModel = getViewModel({ typeDescription });
            expect(viewModel.needToCutColumnItems()).toBeFalsy();
        });

        it('6 extended items in columns, cut is invisible', () => {
            const typeDescription = [];
            for (let i = 0; i < 12; i++) {
                typeDescription.push({
                    name: '' + i,
                    viewMode: 'extended',
                });
            }
            const viewModel = getViewModel({ typeDescription });
            expect(viewModel.needToCutColumnItems()).toBeFalsy();
        });

        it('7 extended items in columns, cut is visible', () => {
            const typeDescription = [];
            for (let i = 0; i < 14; i++) {
                typeDescription.push({
                    name: '' + i,
                    viewMode: 'extended',
                });
            }
            const viewModel = getViewModel({ typeDescription });
            expect(viewModel.needToCutColumnItems()).toBeTruthy();
        });
    });
});
