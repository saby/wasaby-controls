import FilterPanelPopupController from 'Controls/_filterPanelPopup/sticky/Controller';
import { IFilterItem } from 'Controls/filter';

function getOnlyExtendedItems(): IFilterItem[] {
    return [
        {
            name: 'filterName1',
            viewMode: 'extended',
            value: '',
            resetValue: '',
        },
        {
            name: 'filterName2',
            viewMode: 'extended',
            value: '',
            resetValue: '',
        },
    ];
}

function getBasicAndExtendedItems(): IFilterItem[] {
    return [
        {
            name: 'filterName1',
            viewMode: 'extended',
            value: '',
            resetValue: '',
        },
        {
            name: 'filterName2',
            viewMode: 'basic',
            value: '123',
            resetValue: '',
        },
    ];
}

function getFrequentItems(): IFilterItem[] {
    return [
        {
            name: 'filterName1',
            viewMode: 'frequent',
            value: '',
            resetValue: '',
        },
        {
            name: 'filterName2',
            viewMode: 'frequent',
            value: '123',
            resetValue: '',
        },
    ];
}

describe('Controls/_filterPanelPopup/sticky/Controller', () => {
    describe('hasBasicItems', () => {
        it('only extended items', () => {
            const controller = new FilterPanelPopupController({
                items: getOnlyExtendedItems(),
            });
            expect(controller.hasBasicItems()).toBe(false);
        });
        it('extended items with value !== resetValue', () => {
            const items = getOnlyExtendedItems();
            items[0].value = 'test';
            const controller = new FilterPanelPopupController({
                items,
            });
            expect(controller.hasBasicItems()).toBe(true);
        });
        it('with basic items', () => {
            const controller = new FilterPanelPopupController({
                items: getBasicAndExtendedItems(),
            });
            expect(controller.hasBasicItems()).toBe(true);
        });

        it('with frequent items', () => {
            const controller = new FilterPanelPopupController({
                items: getFrequentItems(),
            });
            expect(controller.hasBasicItems()).toBe(true);
        });
    });

    describe('getHeadingCaption', () => {
        it('only extended items', () => {
            const controller = new FilterPanelPopupController({
                items: getOnlyExtendedItems(),
            });
            expect(controller.getHeadingCaption(false).toString()).toBe(
                'Можно отобрать'
            );
        });
        it('with basic items', () => {
            const controller = new FilterPanelPopupController({
                items: getBasicAndExtendedItems(),
            });
            expect(controller.getHeadingCaption(true).toString()).toBe(
                'Отбираются'
            );
        });
    });

    describe('isFilterChanged', () => {
        it('only extended items', () => {
            const controller = new FilterPanelPopupController({
                items: getOnlyExtendedItems(),
            });
            expect(controller.isFilterChanged()).toBe(false);
        });
        it('with basic items', () => {
            const controller = new FilterPanelPopupController({
                items: getBasicAndExtendedItems(),
            });
            expect(controller.isFilterChanged()).toBe(true);
        });

        it('items without resetValue', () => {
            const controller = new FilterPanelPopupController({
                items: [
                    {
                        name: 'testName',
                        viewMode: 'basic',
                        value: 'testValue',
                    },
                ],
            });
            expect(controller.isFilterChanged()).toBe(false);
        });
    });

    describe('isInitialFilterChanged', () => {
        it('initial filter is not changed', () => {
            const controller = new FilterPanelPopupController({
                items: getOnlyExtendedItems(),
            });
            expect(controller.isInitialFilterChanged()).toBe(false);

            controller.setItems(getOnlyExtendedItems());
            expect(controller.isInitialFilterChanged()).toBe(false);
        });
        it('initial filter is changed', () => {
            const controller = new FilterPanelPopupController({
                items: getOnlyExtendedItems(),
            });
            controller.setItems(getBasicAndExtendedItems());
            expect(controller.isInitialFilterChanged()).toBe(true);
        });
    });
});
