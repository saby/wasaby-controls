import { default as Controller } from 'Controls/_filterPopup/Panel/AdditionalParams/Controllers/AdditionalItems';
import { object } from 'Types/util';

let itemsController = null;
const defaultFilterItems = [
    {
        name: 'date',
        resetValue: null,
        group: 'firstGroup',
        value: null,
        type: 'dateRange',
        itemTemplate:
            'wml!Controls-demo/Filter_new/resources/Editors/DateRange',
        viewMode: 'basic',
    },
    {
        name: 'payment',
        value: [],
        resetValue: [],
        textValue: '',
        viewMode: 'extended',
        itemTemplate: 'wml!Controls-demo/Filter_new/resources/Editors/Dropdown',
        additionalTemplate:
            'Controls-demo/Filter_new/resources/Editors/Additional/Select',
        visibility: false,
    },
    {
        name: 'payment2',
        value: [],
        resetValue: [],
        textValue: '',
        viewMode: 'extended',
        itemTemplate: 'wml!Controls-demo/Filter_new/resources/Editors/Dropdown',
        additionalTemplate:
            'Controls-demo/Filter_new/resources/Editors/Additional/Select',
        visibility: false,
    },
    {
        name: 'NDS',
        value: [],
        resetValue: [],
        textValue: '',
        viewMode: 'extended',
        itemTemplate: 'wml!Controls-demo/Filter_new/resources/Editors/Dropdown',
        additionalTemplate:
            'Controls-demo/Filter_new/resources/Editors/Additional/Select',
        visibility: false,
    },
    {
        name: 'payment3',
        value: [],
        resetValue: [],
        textValue: '',
        viewMode: 'extended',
        itemTemplate: 'wml!Controls-demo/Filter_new/resources/Editors/Dropdown',
        additionalTemplate:
            'Controls-demo/Filter_new/resources/Editors/Additional/Select',
        visibility: false,
    },
    {
        name: 'payment4',
        value: [],
        resetValue: [],
        textValue: '',
        viewMode: 'extended',
        itemTemplate: 'wml!Controls-demo/Filter_new/resources/Editors/Dropdown',
        additionalTemplate:
            'Controls-demo/Filter_new/resources/Editors/Additional/Select',
        visibility: false,
    },
];

function getItemsWithExpander(): any[] {
    const moreItems = [
        {
            name: 'payment4',
            value: [],
            resetValue: [],
            textValue: '',
            viewMode: 'extended',
            itemTemplate:
                'wml!Controls-demo/Filter_new/resources/Editors/Dropdown',
            additionalTemplate:
                'Controls-demo/Filter_new/resources/Editors/Additional/Select',
            visibility: false,
        },
        {
            name: 'payment5',
            value: [],
            resetValue: [],
            textValue: '',
            viewMode: 'extended',
            itemTemplate:
                'wml!Controls-demo/Filter_new/resources/Editors/Dropdown',
            additionalTemplate:
                'Controls-demo/Filter_new/resources/Editors/Additional/Select',
            visibility: false,
        },
        {
            name: 'payment355',
            value: [],
            resetValue: [],
            textValue: '',
            viewMode: 'extended',
            itemTemplate:
                'wml!Controls-demo/Filter_new/resources/Editors/Dropdown',
            additionalTemplate:
                'Controls-demo/Filter_new/resources/Editors/Additional/Select',
            visibility: false,
        },
        {
            name: 'payment155',
            value: [],
            resetValue: [],
            textValue: '',
            viewMode: 'extended',
            itemTemplate:
                'wml!Controls-demo/Filter_new/resources/Editors/Dropdown',
            additionalTemplate:
                'Controls-demo/Filter_new/resources/Editors/Additional/Select',
            visibility: false,
        },
        {
            name: 'payment55',
            value: [],
            resetValue: [],
            textValue: '',
            viewMode: 'extended',
            itemTemplate:
                'wml!Controls-demo/Filter_new/resources/Editors/Dropdown',
            additionalTemplate:
                'Controls-demo/Filter_new/resources/Editors/Additional/Select',
            visibility: false,
        },
        {
            name: 'payment5123335',
            value: [],
            resetValue: [],
            textValue: '',
            viewMode: 'extended',
            itemTemplate:
                'wml!Controls-demo/Filter_new/resources/Editors/Dropdown',
            additionalTemplate:
                'Controls-demo/Filter_new/resources/Editors/Additional/Select',
            visibility: false,
        },
        {
            name: 'payment7775',
            value: [],
            resetValue: [],
            textValue: '',
            viewMode: 'extended',
            itemTemplate:
                'wml!Controls-demo/Filter_new/resources/Editors/Dropdown',
            additionalTemplate:
                'Controls-demo/Filter_new/resources/Editors/Additional/Select',
            visibility: false,
        },
        {
            name: 'payment9789',
            value: [],
            resetValue: [],
            textValue: '',
            viewMode: 'extended',
            itemTemplate:
                'wml!Controls-demo/Filter_new/resources/Editors/Dropdown',
            additionalTemplate:
                'Controls-demo/Filter_new/resources/Editors/Additional/Select',
            visibility: false,
        },
    ];
    return defaultFilterItems.concat(moreItems);
}

function getItemsWithOldKey(): unknown[] {
    const items = object.clone(defaultFilterItems);
    return items.map((item) => {
        item.id = item.name;
        delete item.name;
    });
}

describe('AdditionalItemsController', () => {
    beforeEach(() => {
        itemsController = new Controller({
            source: defaultFilterItems,
            keyProperty: 'name',
        });
    });

    describe('getResult', () => {
        it('returns only invisible items', () => {
            const controllerResult = itemsController.getResult();
            const returnsOnlyInvisibleItems =
                controllerResult.visibleItems.every((item): boolean => {
                    return item.visibility === false;
                });
            expect(returnsOnlyInvisibleItems).toBe(true);
        });

        it('expanderVisible', () => {
            const controllerResult = itemsController.getResult();
            expect(controllerResult.expanderVisible).toBe(false);

            let updateControllerResult = itemsController.update({
                source: getItemsWithExpander(),
                keyProperty: 'name',
            });
            expect(updateControllerResult.expanderVisible).toBe(true);
            updateControllerResult = itemsController.update({
                source: defaultFilterItems,
                keyProperty: 'name',
            });
            expect(updateControllerResult.expanderVisible).toBe(false);
        });

        it('columns calculating', () => {
            const controllerResult = itemsController.getResult();
            const correctColumns = {
                payment: 'left',
                payment2: 'left',
                NDS: 'left',
                payment3: 'right',
                payment4: 'right',
            };
            const groupsCorrectCalculated = controllerResult.visibleItems.every(
                (item) => {
                    return correctColumns[item.name] === item.column;
                }
            );
            const updateControllerResult = itemsController.update({
                source: defaultFilterItems.slice(),
                keyProperty: 'name',
                groupProperty: 'group',
            });
            const groupsNotCalculatedWhenHasGroupProperty =
                updateControllerResult.visibleItems.every((item) => {
                    return !item.column;
                });
            expect(groupsCorrectCalculated).toBe(true);
            expect(groupsNotCalculatedWhenHasGroupProperty).toBe(true);
        });

        it('handleUpdateItem', () => {
            const newSource = itemsController.handleUpdateItem(
                defaultFilterItems[0],
                'textValue',
                'newText'
            );
            expect(newSource[0].visibility).toBe(true);
            expect(newSource[0].textValue === 'newText').toBe(true);
        });
        it('old panel items', () => {
            const controllerWithOldKey = new Controller({
                keyProperty: 'id',
                source: getItemsWithOldKey(),
            });
            const result = controllerWithOldKey.getResult();
            const correctColumns = {
                payment: 'left',
                payment2: 'left',
                NDS: 'left',
                payment3: 'right',
                payment4: 'right',
            };
            const groupsCorrectCalculated = result.visibleItems.every(
                (item) => {
                    return correctColumns[item.id] === item.column;
                }
            );
            expect(groupsCorrectCalculated).toBe(true);
        });
    });
});
