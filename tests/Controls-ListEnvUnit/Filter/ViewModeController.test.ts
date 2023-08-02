import ViewModeController from 'Controls-ListEnv/_filterPanel/ViewModeController';
import { IFilterItem } from 'Controls/filter';

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
const filterNames = ['name', 'city'];

describe('Controls-ListEnv/_filterPanel/ViewModeController', () => {
    describe('updateFilterPanelSource', () => {
        it('опция editorsViewMode не передана', () => {
            const filterDescription = getFilterButtonItems();
            const viewModeController = new ViewModeController(
                filterDescription,
                undefined,
                filterNames,
                false
            );

            let newFilterDescription = getFilterButtonItems();
            newFilterDescription[0].editorOptions = {
                expandedItems: [1, 2],
            };

            expect(
                viewModeController.updateFilterPanelSource(newFilterDescription, filterNames)[0]
                    .editorOptions
            ).toEqual({
                expandedItems: [1, 2],
            });

            newFilterDescription = getFilterButtonItems();
            newFilterDescription[0].value = 'testNewValue';
            expect(
                viewModeController.updateFilterPanelSource(newFilterDescription, filterNames)[0]
                    .value
            ).toEqual('testNewValue');
        });
    });
});
