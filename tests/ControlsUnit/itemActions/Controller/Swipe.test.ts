import {
    Controller as ItemActionsController,
    IControllerOptions,
} from 'Controls/_itemActions/Controller';
import { Collection } from 'Controls/display';
import { RecordSet } from 'Types/collection';
import { Record } from 'Types/entity';
import { IItemAction, TItemActionShowType } from 'Controls/interface';
import { IItemActionsCollection } from 'Controls/_itemActions/interface/IItemActionsCollection';
import { IOptions as ICollectionOptions } from 'Controls/_display/Collection';
import { IItemActionsItem } from 'Controls/_itemActions/interface/IItemActionsItem';

const itemActions: IItemAction[] = [
    {
        id: 1,
        icon: 'icon-PhoneNull',
        title: 'phone',
        showType: TItemActionShowType.MENU,
    },
    {
        id: 2,
        icon: 'icon-EmptyMessage',
        title: 'message',
        showType: TItemActionShowType.MENU_TOOLBAR,
    },
    {
        id: 3,
        icon: 'icon-Profile',
        title: 'Profile',
        tooltip: "This is awesome Profile you've never seen",
        showType: TItemActionShowType.TOOLBAR,
    },
    {
        id: 4,
        icon: 'icon-Time',
        title: 'Time management',
        showType: TItemActionShowType.TOOLBAR,
        'parent@': true,
    },
    {
        id: 5,
        title: 'Documentation',
        showType: TItemActionShowType.TOOLBAR,
        parent: 4,
    },
    {
        id: 6,
        title: 'Development',
        showType: TItemActionShowType.MENU_TOOLBAR,
        parent: 4,
    },
    {
        id: 7,
        title: 'Exploitation',
        showType: TItemActionShowType.MENU,
        parent: 4,
        'parent@': true,
    },
    {
        id: 8,
        title: 'Approval',
        showType: TItemActionShowType.MENU,
        parent: 7,
        'parent@': true,
    },
];

const data = [
    { id: 1, name: 'Philip J. Fry', gender: 'M', itemActions: [] },
    {
        id: 2,
        name: 'Turanga Leela',
        gender: 'F',
        itemActions: [
            {
                id: 1,
                icon: 'icon-Link',
                title: 'valar morghulis',
                showType: TItemActionShowType.TOOLBAR,
            },
            {
                id: 2,
                icon: 'icon-Print',
                title: 'print',
                showType: TItemActionShowType.MENU,
            },
        ],
    },
    { id: 3, name: 'Professor Farnsworth', gender: 'M', itemActions: [] },
    { id: 4, name: 'Amy Wong', gender: 'F', itemActions: [] },
    { id: 5, name: 'Bender Bending Rodriguez', gender: 'R', itemActions: [] },
];

function makeCollection(
    rawData: {
        id: number;
        name: string;
        gender: string;
        itemActions: IItemAction[];
    }[]
): IItemActionsCollection {
    const list = new RecordSet({
        keyProperty: 'id',
        rawData,
    });
    const collectionConfig: ICollectionOptions<Record, IItemActionsItem> = {
        collection: list,
        keyProperty: 'id',
        searchValue: null,
        editingConfig: null,
    };
    // @ts-ignore
    return new Collection<Record>(collectionConfig);
}

function mockDocument(): object {
    return {
        createElement: () => {
            return {
                style: {},
                classList: {
                    add: jest.fn(),
                },
                setAttribute: jest.fn(),
                appendChild: jest.fn(),
                getBoundingClientRect: () => {
                    return { width: '' };
                },
                getElementsByClassName: () => {
                    return [];
                },
            };
        },
        body: {
            appendChild: jest.fn(),
            removeChild: jest.fn(),
        },
    };
}

function initializeControllerOptions(options?: Partial<IControllerOptions>): IControllerOptions {
    return {
        collection: options ? options.collection : null,
        itemActions: options ? options.itemActions : null,
        itemActionsProperty: options ? options.itemActionsProperty : null,
        visibilityCallback: options ? options.visibilityCallback : null,
        itemActionsPosition: options ? options.itemActionsPosition : null,
        style: options ? options.style : null,
        theme: options ? options.theme : 'default',
        actionAlignment: options ? options.actionAlignment : null,
        actionCaptionPosition: options ? options.actionCaptionPosition : null,
        editingToolbarVisible: options ? options.editingToolbarVisible : false,
        editArrowAction: options ? options.editArrowAction : null,
        editArrowVisibilityCallback: options ? options.editArrowVisibilityCallback : null,
        contextMenuConfig: options ? options.contextMenuConfig : null,
        iconSize: options ? options.iconSize : 'm',
        editingItem: options ? options.editingItem : null,
        itemActionsVisibility: options ? options.itemActionsVisibility : 'onhover',
        actionMode: options.actionMode || 'strict',
    };
}

describe('Controls/itemActions/Controller/Swipe', () => {
    let collection: IItemActionsCollection;
    let itemActionsController: ItemActionsController;

    before(() => {
        global.document = mockDocument();
    });

    after(() => {
        global.document = undefined;
    });

    beforeEach(() => {
        collection = makeCollection(data);
        itemActionsController = new ItemActionsController();
        // @ts-ignore
        itemActionsController.update(
            initializeControllerOptions({
                collection,
                itemActions,
            })
        );
    });

    it('should reset ItemActions on swipe close', () => {
        itemActionsController.activateSwipe(1, 100, 50);
        const item = collection.at(0);
        const spySetActions = jest.spyOn(item, 'setActions').mockClear();
        itemActionsController.deactivateSwipe();
        expect(spySetActions).toHaveBeenCalled();
        spySetActions.mockRestore();
    });

    it('should reset ItemActions on swipe another record', () => {
        itemActionsController.activateSwipe(1, 100, 50);
        const item = collection.at(0);
        const spySetActions = jest.spyOn(item, 'setActions').mockClear();
        itemActionsController.activateSwipe(2, 100, 50);
        expect(spySetActions).toHaveBeenCalled();
        spySetActions.mockRestore();
    });

    // Должен правильно рассчитывать ширину для записей списка при отображении опций свайпа
    // Предполагаем, что контейнер содержит класс js-controls-ListView__measurableContainer
    it('should correctly calculate row size for list', () => {
        // fake HTMLElement
        const fakeElement = {
            classList: {
                contains: (selector) => {
                    return true;
                },
            },
            clientWidth: 500,
            clientHeight: 31,
        } as HTMLElement;
        const result = ItemActionsController.getSwipeContainerSize(fakeElement, 'foo');
        expect(result.width).toEqual(500);
        expect(result.height).toEqual(31);
    });

    // Должен правильно рассчитывать ширину для записей таблицы при отображении опций свайпа
    // Предполагаем, что сам контейнер не содержит класс js-controls-ListView__measurableContainer,
    // а его потомки содержат
    it('should correctly calculate row size for grid', () => {
        // fake HTMLElement
        const fakeElement = {
            classList: {
                contains: (selector) => {
                    return false;
                },
            },
            querySelectorAll: (selector) => {
                return new Array(5).fill({
                    clientWidth: 50,
                    clientHeight: 31,
                });
            },
        } as undefined as HTMLElement;
        const result = ItemActionsController.getSwipeContainerSize(fakeElement, 'foo');
        expect(result.width).toEqual(250);
        expect(result.height).toEqual(31);
    });

    it('should invalidate "showed" actions in adaptive mode', () => {
        itemActionsController.update(
            initializeControllerOptions({
                collection,
                itemActions: [
                    {
                        id: 'phone',
                        icon: 'icon-PhoneNull',
                        title: 'phone',
                        showType: TItemActionShowType.TOOLBAR,
                    },
                    {
                        id: 'message',
                        icon: 'icon-EmptyMessage',
                        title: 'message',
                        showType: TItemActionShowType.MENU,
                    },
                ],
                actionAlignment: 'vertical',
                actionMode: 'adaptive',
            })
        );

        // При адаптивных операциях над записью после инициализации showed будет пустой массив.
        let actionsOf4 = collection.getItemBySourceKey(4).getActions();
        expect(actionsOf4).not.toBeNull();
        expect(Object.keys(actionsOf4.showed)).toHaveLength(0);

        // активируем свайп, производим необходимые расчёты, showed будет не пустой.
        itemActionsController.activateSwipe(4, 100, 50);
        actionsOf4 = collection.getItemBySourceKey(4).getActions();
        expect(actionsOf4).not.toBeNull();
        expect(Object.keys(actionsOf4.showed)).toHaveLength(2);
    });
});
