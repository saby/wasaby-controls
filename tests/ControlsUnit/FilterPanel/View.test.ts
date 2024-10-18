import { View } from 'Controls/filterPanel';

describe('Controls/filterPanel:View', () => {
    describe('resetFilterItem', () => {
        const config = {
            source: [
                {
                    name: 'owners',
                    value: 'Test owner',
                    textValue: 'Test owner',
                    resetValue: null,
                },
            ],
            collapsedGroups: [],
            viewMode: 'default',
        };

        const displayItem = {
            getContents: () => {
                return 'owners';
            },
        };

        it('viewMode is default', () => {
            const viewControl = new View({});
            viewControl._beforeMount(config);
            viewControl.saveOptions(config);

            viewControl._resetFilterItem(displayItem);
            expect(viewControl._options.viewMode).toEqual('default');
        });
    });
});
