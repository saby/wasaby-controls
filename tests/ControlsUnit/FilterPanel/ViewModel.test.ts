import { ViewModel, IFilterViewModelOptions } from 'Controls/filterPanel';
import { IFilterItem } from 'Controls/filter';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { NewSourceController } from 'Controls/dataSource';

function getSource(): IFilterItem[] {
    return [
        {
            name: 'owners',
            value: 'Test owner',
            textValue: 'Test owner',
            resetValue: null,
        },
    ];
}

function getViewModel(viewModelOptions: Partial<IFilterViewModelOptions>): ViewModel {
    return new ViewModel({
        ...viewModelOptions,
        source: viewModelOptions.source || [],
        collapsedGroups: viewModelOptions.collapsedGroups || [],
    });
}

describe('Controls/filterPanel:ViewModel', () => {
    describe('resetFilterItem', () => {
        it('editingObject is updated', () => {
            const viewModel = getViewModel({ source: getSource() });
            viewModel.resetFilterItem('owners');
            expect(viewModel.getEditingObject().owners).toBeNull();
        });

        it('filterItem textValue is updated', () => {
            const viewModel = getViewModel({ source: getSource() });
            viewModel.resetFilterItem('owners');
            expect(viewModel.getSource()[0].textValue).toEqual('');
        });

        it('viewMode reset', () => {
            const source = getSource();
            source[0].viewMode = 'basic';
            source[0].editorOptions = {
                extendedCaption: 'testExtendedCaption',
            };
            const viewModel = getViewModel({ source, filterViewMode: 'popup' });
            viewModel.resetFilterItem('owners');
            expect(viewModel.getSource()[0].viewMode).toEqual('extended');
        });

        it('cached data reset', () => {
            const source = getSource();
            const editorOptions = {
                extendedCaption: 'testExtendedCaption',
            };
            source[0].viewMode = 'basic';
            source[0].editorOptions = editorOptions;
            const viewModel = getViewModel({ source, filterViewMode: 'popup' });
            viewModel.getSource()[0].editorOptions = {
                ...editorOptions,
                items: new RecordSet(),
            };
            viewModel.resetFilterItem('owners');
            expect(!viewModel.getSource()[0].editorOptions.items).toBeTruthy();
        });
    });

    describe('resetFilter', () => {
        const source = getSource();
        source[0].viewMode = 'basic';
        source[0].editorOptions = {
            extendedCaption: 'Owner',
        };
        const viewModel = getViewModel({ source });

        it('view mode changed', () => {
            viewModel.resetFilter();
            expect(viewModel.getSource()[0].viewMode).toEqual('extended');
        });
    });

    describe('getSource', () => {
        it('items (Types/collection:RecordSet) in editorOptions', () => {
            const source = getSource();
            source[0].editorOptions = {
                source: new Memory(),
                items: new RecordSet(),
            };
            const viewModel = getViewModel({ source });
            expect(
                viewModel.getSource()[0].editorOptions.sourceController instanceof
                    NewSourceController
            ).toBeTruthy();
        });

        it('items (Types/collection:RecordSet) in editorOptions', () => {
            const source = getSource();
            const memorySource = new Memory();
            const sourceController = new NewSourceController({
                source: memorySource,
            });
            sourceController.setItems(new RecordSet());
            source[0].editorOptions = {
                source: memorySource,
                sourceController,
            };
            const viewModel = getViewModel({ source });
            expect(
                viewModel.getSource()[0].editorOptions.sourceController instanceof
                    NewSourceController
            ).toBeTruthy();
            expect(viewModel.getSource()[0].editorOptions.items instanceof RecordSet).toBeTruthy();
        });

        it('value removed from collapsed groups', () => {
            const source = getSource();
            source[0].editorOptions = {
                items: ['test'],
            };
            const viewModel = getViewModel({ source });
            expect(!viewModel.getSource()[0].editorOptions.sourceController).toBeTruthy();
        });

        it('items with visibility: false is filtered from source', () => {
            const source = [
                {
                    name: 'employee',
                    viewMode: 'basic',
                    value: '',
                    visibility: false,
                },
                {
                    name: 'employee1',
                    viewMode: 'extended',
                    value: '',
                },
            ] as IFilterItem[];
            const viewModel = getViewModel({ source });
            expect(viewModel.getSource().length === 1).toBeTruthy();
        });
    });

    describe('updateOptions', () => {
        it('viewMode extended changed to basic if value equals resetValue', () => {
            let source = getSource();
            source[0].value = null;
            source[0].editorOptions = {
                extendedCaption: 'testExtendedCaption',
            };
            source[0].viewMode = 'extended';
            let viewModel = getViewModel({ source, filterViewMode: 'popup' });
            expect(viewModel.getSource()[0].viewMode === 'extended').toBeTruthy();

            const filterItemClone = { ...source[0] };
            filterItemClone.value = 'testChangedValue';
            source = [filterItemClone];
            viewModel = getViewModel({ source, filterViewMode: 'popup' });
            expect(viewModel.getSource()[0].viewMode === 'basic').toBeTruthy();
        });

        it('sourceController from editorOptions is used for editor', () => {
            let source = getSource();
            const sourceController = new NewSourceController({
                source: new Memory(),
            });
            source[0].value = null;
            source[0].editorOptions = {
                extendedCaption: 'testExtendedCaption',
                sourceController,
            };
            const viewModel = getViewModel({ source });
            expect(
                viewModel.getSource()[0].editorOptions.sourceController === sourceController
            ).toBeTruthy();

            const filterItemClone = { ...source[0] };
            filterItemClone.editorOptions = {
                ...filterItemClone.editorOptions,
            };
            filterItemClone.editorOptions.sourceController = new NewSourceController({
                source: new Memory(),
            });
            source = [filterItemClone];
            viewModel.update({ source });
            expect(
                viewModel.getSource()[0].editorOptions.sourceController !== sourceController
            ).toBeTruthy();
        });

        it('source is changed in editorOptions', () => {
            let source = getSource();
            source[0].value = null;
            source[0].editorOptions = {
                source: new Memory(),
                items: new RecordSet(),
            };
            const viewModel = getViewModel({ source });
            expect(viewModel.getSource()[0].editorOptions.sourceController).toBeTruthy();

            const sourceController = viewModel.getSource()[0].editorOptions.sourceController;
            const filterItemsClone = [
                {
                    ...source[0],
                    editorOptions: {
                        ...source[0].editorOptions,
                        source: new Memory(),
                    },
                },
            ];
            source = filterItemsClone;
            viewModel.update({ source });
            expect(
                viewModel.getSource()[0].editorOptions.sourceController !== sourceController
            ).toBeTruthy();
        });
    });

    describe('getBasicFilterItems', () => {
        it('returns only basic items', () => {
            const source = [
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
                {
                    name: 'employee2',
                    value: '',
                },
            ] as IFilterItem[];
            const viewModel = getViewModel({ source });
            expect(viewModel.getBasicFilterItems()[0].viewMode === 'basic').toBeTruthy();
            expect(viewModel.getBasicFilterItems()[1].viewMode === 'basic').toBeTruthy();
            expect(viewModel.getBasicFilterItems().length === 2).toBeTruthy();
        });

        it('returns basic and not changed frequent items', () => {
            const source = [
                {
                    name: 'employee',
                    viewMode: 'basic',
                    value: '',
                },
                {
                    name: 'employee1',
                    viewMode: 'frequent',
                    value: '123',
                    resetValue: '',
                },
            ] as IFilterItem[];
            const viewModel = getViewModel({ source, filterViewMode: 'popup' });
            expect(viewModel.getBasicFilterItems().length === 2).toBeTruthy();
        });

        it('returns basic filters with userVisbility', () => {
            const source = [
                {
                    name: 'employee',
                    viewMode: 'basic',
                    value: '',
                },
                {
                    name: 'employee1',
                    value: '123',
                    resetValue: '',
                    userVisibility: false,
                },
            ] as IFilterItem[];
            let viewModel = getViewModel({ source, filterViewMode: 'default' });
            expect(viewModel.getBasicFilterItems().length).toEqual(1);

            viewModel = getViewModel({ source, filterViewMode: 'popup' });
            expect(viewModel.getBasicFilterItems().length).toEqual(2);
        });
    });

    describe('getExtendedFilterItems', () => {
        it('returns only extended items', () => {
            const source = [
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
            const viewModel = getViewModel({ source });
            expect(viewModel.getExtendedFilterItems()[0].viewMode === 'extended').toBeTruthy();
            expect(viewModel.getExtendedFilterItems().length === 1).toBeTruthy();
        });

        it('returns basic and changed frequent items', () => {
            const source = [
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
            const viewModel = getViewModel({ source, filterViewMode: 'popup' });
            expect(viewModel.getExtendedFilterItems()[0].viewMode === 'frequent').toBeTruthy();
            expect(viewModel.getExtendedFilterItems()[1].viewMode === 'extended').toBeTruthy();
            expect(viewModel.getExtendedFilterItems().length === 2).toBeTruthy();
        });
    });

    describe('getGroupItems', () => {
        it('groupVisible is false for filterItem without caption', () => {
            const source = getSource();
            const viewModel = getViewModel({ source });
            expect(!viewModel.getGroupItems().owners.groupVisible).toBeTruthy();
        });

        it('groupVisible is true for filterItem with caption', () => {
            const source = getSource();
            source[0].caption = 'testCaption';
            const viewModel = getViewModel({ source });
            expect(viewModel.getGroupItems().owners.groupVisible).toBeTruthy();
        });

        it('groupVisible is false for filterItem with markerStyle="primary"', () => {
            const source = getSource();
            source[0].caption = 'testCaption';
            source[0].editorOptions = {
                markerStyle: 'primary',
            };
            const viewModel = getViewModel({ source });
            expect(!viewModel.getGroupItems().owners.groupVisible).toBeTruthy();
        });

        it('groupVisible is false for filterItem with emptyCaption', () => {
            const source = getSource();
            source[0].caption = '';
            const viewModel = getViewModel({
                source,
                editorsViewMode: 'cloud',
            });
            expect(!viewModel.getGroupItems().owners.groupVisible).toBeTruthy();
        });

        it('expander is hidden with editorsViewMode: "cloud"', () => {
            const source = getSource();
            source[0].expanderVisible = true;
            const viewModel = getViewModel({
                source,
                editorsViewMode: 'cloud',
            });
            expect(!viewModel.getGroupItems().owners.expanderVisible).toBeTruthy();
        });
    });

    describe('needShowSeparator', () => {
        it('separator should be visible with editorsViewMode: "cloud"', () => {
            const source = [
                {
                    name: 'test',
                    value: '',
                    resetValue: '',
                    viewMode: 'extended',
                    extendedCaption: 'Test',
                },
                {
                    name: 'test2',
                    value: 'testValue',
                    resetValue: '',
                    viewMode: 'basic',
                    extendedCaption: 'Test',
                },
            ] as IFilterItem[];
            let viewModel = getViewModel({ source, editorsViewMode: 'cloud' });
            expect(viewModel.needShowSeparator()).toBeTruthy();

            viewModel = getViewModel({ source, editorsViewMode: 'default' });
            expect(viewModel.needShowSeparator()).toBeFalsy();
        });

        it('separator should be hidden, if filters items are reset', () => {
            const source = [
                {
                    name: 'test',
                    value: '',
                    resetValue: '',
                    viewMode: 'extended',
                    extendedCaption: 'Test',
                },
            ] as IFilterItem[];
            const viewModel = getViewModel({
                source,
                editorsViewMode: 'cloud',
            });
            expect(viewModel.needShowSeparator()).toBeFalsy();
        });
    });

    describe('editors font size', () => {
        it('filter with viewMode: basic should have a "l" font size', () => {
            const source = [
                {
                    name: 'test',
                    value: '',
                    resetValue: '',
                    viewMode: 'basic',
                    editorOptions: {},
                },
            ] as IFilterItem[];
            const viewModel = getViewModel({
                source,
                editorsViewMode: 'cloud',
            });
            expect(viewModel.getSource()[0].editorOptions.fontSize).toEqual('m');
        });

        it('filter with viewMode: frequent should have a "l" font size', () => {
            const source = [
                {
                    name: 'test',
                    value: '',
                    resetValue: '',
                    viewMode: 'frequent',
                    editorOptions: {},
                },
            ] as IFilterItem[];
            const viewModel = getViewModel({
                source,
                editorsViewMode: 'cloud',
            });
            expect(viewModel.getSource()[0].editorOptions.fontSize).toEqual('m');
        });

        it('filter with viewMode: extended should have a "m" font size', () => {
            const source = [
                {
                    name: 'test',
                    value: '',
                    resetValue: '',
                    viewMode: 'extended',
                    editorOptions: {},
                },
            ] as IFilterItem[];
            const viewModel = getViewModel({
                source,
                editorsViewMode: 'cloud',
            });
            expect(viewModel.getSource()[0].editorOptions.fontSize).toEqual('m');
        });

        it('filter with viewMode: extended and changed value should have a "l" font size', () => {
            const source = [
                {
                    name: 'test',
                    value: 'testValue',
                    resetValue: '',
                    viewMode: 'extended',
                    extendedCaption: 'testExtendedCaption',
                    editorOptions: {},
                },
            ] as IFilterItem[];
            const viewModel = getViewModel({
                source,
                editorsViewMode: 'cloud',
                filterViewMode: 'popup',
            });
            expect(viewModel.getSource()[0].editorOptions.fontSize).toEqual('m');
        });

        it('filterViewMode: "default" should be without fontSize', () => {
            const source = [
                {
                    name: 'test',
                    value: '',
                    resetValue: '',
                    editorOptions: {},
                },
            ] as IFilterItem[];
            const viewModel = getViewModel({
                source,
                filterViewMode: 'default',
            });
            expect(viewModel.getSource()[0].editorOptions.fontSize).toBeUndefined();
        });
    });

    describe('contrastBackground в editorOptions', () => {
        it('contrastBackground не передано, панель отображается горизонтально', () => {
            const source = [
                {
                    name: 'test',
                    value: '',
                    resetValue: '',
                    editorOptions: {},
                },
            ] as IFilterItem[];
            const viewModel = getViewModel({
                source,
                orientation: 'horizontal',
            });
            expect(viewModel.getSource()[0].editorOptions.contrastBackground).toBeTruthy();
        });
        it('contrastBackground передано, панель отображается вертикально', () => {
            const source = [
                {
                    name: 'test',
                    value: '',
                    resetValue: '',
                    editorOptions: {
                        contrastBackground: true,
                    },
                },
            ] as IFilterItem[];
            const viewModel = getViewModel({
                source,
                orientation: 'vertical',
            });
            expect(viewModel.getSource()[0].editorOptions.contrastBackground).toBeFalsy();
        });
    });

    describe('adaptive filter', () => {
        it('В адаптивном режиме в панели должны выводиться только basic фильтры', () => {
            const source = [
                {
                    name: 'test',
                    value: '',
                    resetValue: '',
                    editorOptions: {},
                    viewMode: 'basic',
                },
                {
                    name: 'test',
                    value: '',
                    resetValue: '',
                    editorOptions: {},
                    viewMode: 'extended',
                    extendedCaption: 'testExtendedCaption',
                },
            ] as IFilterItem[];
            const viewModel = getViewModel({
                source,
                filterViewMode: 'default',
                isAdaptive: true,
            });
            expect(viewModel.getSource().length).toEqual(1);
        });
    });
});
