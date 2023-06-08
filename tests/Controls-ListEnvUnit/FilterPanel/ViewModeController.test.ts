import { object } from 'Types/util';
import { IFilterItem } from 'Controls/filter';
import { ViewModeController, ViewModeType } from 'Controls-ListEnv/filterPanelConnected';

/* eslint-disable no-magic-numbers */
describe('Controls-ListEnv/_filterPanelConnected:ViewModeController', () => {
    const filterItems: IFilterItem[] = [
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

    const addFilterItem: IFilterItem = {
        name: 'country',
        caption: 'Страна',
        value: [],
        resetValue: [1],
        viewMode: 'basic',
        textValue: '',
        editorTemplateName: 'Controls/input:Text',
    };

    const getExtendedFilterItems = (): IFilterItem[] => {
        const items = object.clone(filterItems);
        items.push(addFilterItem);
        return items;
    };

    const filterNames = ['name', 'city'];

    const extendedFilterNames = [...filterNames, addFilterItem.name];

    let controller: ViewModeController = null;

    beforeEach(() => {
        controller = new ViewModeController(filterItems, 'default', filterNames);
    });

    afterEach(() => {
        controller = null;
    });

    describe('.getViewMode()', () => {
        it('should return default view mode', () => {
            expect(controller.getViewMode()).toEqual('default');
        });
    });

    describe('.setViewMode()', () => {
        it('should return set view mode', () => {
            const newViewMode = 'cloud';
            controller.setViewMode(newViewMode);
            expect(controller.getViewMode()).toEqual(newViewMode);
        });
    });

    describe('.getFilterPanelSource()', () => {
        it('should return filter items from constructor', () => {
            const innerFilterItems = controller.getFilterPanelSource();
            expect(innerFilterItems).toEqual(filterItems);
        });

        it('should return items filtered by name for /"default/"', () => {
            const filterName = 'name';
            controller = new ViewModeController(filterItems, 'default', [filterName]);
            const innerFilterItems = controller.getFilterPanelSource();
            expect(innerFilterItems.length === 1).toBe(true);
            expect(innerFilterItems[0].name).toEqual(filterName);
        });
    });

    describe('.setFilterPanelSource()', () => {
        it('should set correct view mode', () => {
            const modes = ['default', 'cloud'];
            const newFilterItems = getExtendedFilterItems();
            modes.forEach((mode) => {
                controller.setFilterPanelSource(newFilterItems, mode as ViewModeType, filterNames);
                expect(controller.getViewMode()).toEqual(mode);
            });
        });

        it('should set inner filter panel source for mode "default"', () => {
            // Когда задан 'default', элементы фильтруются по имени из filterNames
            const newFilterItems = getExtendedFilterItems();
            const result = controller.setFilterPanelSource(newFilterItems, 'default', filterNames);
            expect(result).toEqual(filterItems);
            expect(controller.getViewMode()).toEqual('default');
        });

        it('should set inner filter panel source for mode "cloud"', () => {
            // Когда задан 'default', элементы фильтруются по имени из filterNames
            const newFilterItems = getExtendedFilterItems();
            const result = controller.setFilterPanelSource(newFilterItems, 'cloud', filterNames);
            expect(result).toEqual(filterItems);
            expect(controller.getViewMode()).toEqual('cloud');
        });

        it('should set inner filter panel source for unsupported mode', () => {
            // Когда задан 'default', элементы фильтруются по имени из filterNames
            const newFilterItems = getExtendedFilterItems();
            const result = controller.setFilterPanelSource(
                newFilterItems,
                'testMode' as ViewModeType,
                filterNames
            );
            expect(result).toEqual(filterItems);
            expect(controller.getViewMode()).toEqual('testMode');
        });

        it('should return same items from both methods', () => {
            const newFilterItems = getExtendedFilterItems();
            const result1 = controller.setFilterPanelSource(newFilterItems, 'default', filterNames);
            const result2 = controller.getFilterPanelSource();
            expect(result1).toEqual(result2);
        });
    });

    describe('.updateFilterPanelSource()', () => {
        it('should change view mode to "cloud"', () => {
            const newFilterItems = getExtendedFilterItems();
            controller.updateFilterPanelSource(newFilterItems, extendedFilterNames);
            expect(controller.getViewMode()).toEqual('cloud');
        });

        it('should change view mode to "default"', () => {
            controller = new ViewModeController(
                filterItems,
                'testMode' as ViewModeType,
                filterNames
            );
            controller.updateFilterPanelSource(filterItems, extendedFilterNames);
            expect(controller.getViewMode()).toEqual('default');
        });

        it('shouldn\'t change view mode to "default"', () => {
            controller = new ViewModeController(filterItems, 'cloud' as ViewModeType, filterNames);
            const newFilterItems = getExtendedFilterItems();
            controller.updateFilterPanelSource(newFilterItems, extendedFilterNames);
            expect(controller.getViewMode()).not.toEqual('default');
        });

        it('should return same items from both methods', () => {
            const newFilterItems = getExtendedFilterItems();
            const result1 = controller.updateFilterPanelSource(newFilterItems, extendedFilterNames);
            const result2 = controller.getFilterPanelSource();
            expect(result1).toEqual(result2);
        });

        it('should return items filtered for view mode /"cloud/"', () => {
            const newFilterItems = getExtendedFilterItems();
            controller.updateFilterPanelSource(newFilterItems, ['country']);
            const innerFilterItems = controller.getFilterPanelSource();
            expect(controller.getViewMode()).toEqual('cloud');
            expect(innerFilterItems[0].name).toEqual(addFilterItem.name);
        });

        it('should return filtered items if they have been changed', () => {
            const newFilterItems = getExtendedFilterItems();
            const innerFilterItems = controller.updateFilterPanelSource(newFilterItems, [
                'country',
            ]);
            expect(innerFilterItems).toEqual([addFilterItem]);
        });

        it("should return items as is if they haven't been changed", () => {
            const innerFilterItems = controller.updateFilterPanelSource(
                filterItems,
                extendedFilterNames
            );
            expect(innerFilterItems).toEqual(filterItems);
        });
    });
});
