import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import {
    IItemActionsItem,
    IItemActionsCollection,
    Controller as ItemActionsController,
    IItemAction,
    TActionDisplayMode,
    TItemActionShowType,
} from 'Controls/itemActions';
import { IControllerOptions } from 'Controls/_itemActions/Controller';
import { Collection, ICollectionOptions } from 'Controls/display';
import { DOMUtil } from 'Controls/sizeUtils';

describe('Controls/itemActions/Controller/MenuButton', () => {
    let itemActionsController: ItemActionsController;
    let collection: IItemActionsCollection;

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
        {
            id: 5,
            name: 'Bender Bending Rodriguez',
            gender: 'R',
            itemActions: [],
        },
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
        const collectionConfig: ICollectionOptions<Model, IItemActionsItem> = {
            collection: list,
            keyProperty: 'id',
            leftSpacing: null,
            rightSpacing: null,
            rowSpacing: null,
            searchValue: null,
            editingConfig: null,
        };
        // @ts-ignore
        return new Collection<Model>(collectionConfig);
    }

    function initializeControllerOptions(options?: IControllerOptions): IControllerOptions {
        return {
            collection: options ? options.collection : null,
            itemActions: options ? options.itemActions : null,
            itemActionsProperty: options ? options.itemActionsProperty : null,
            visibilityCallback: options ? options.visibilityCallback : null,
            itemActionsPosition: options ? options.itemActionsPosition : null,
            style: options ? options.style : null,
            theme: 'default',
            actionAlignment: options ? options.actionAlignment : null,
            actionCaptionPosition: options ? options.actionCaptionPosition : null,
            editingToolbarVisible: options ? options.editingToolbarVisible : false,
            editArrowAction: options ? options.editArrowAction : null,
            editArrowVisibilityCallback: options ? options.editArrowVisibilityCallback : null,
            contextMenuConfig: options ? options.contextMenuConfig : null,
            iconSize: options ? options.iconSize : 'm',
            editingItem: options ? options.editingItem : null,
            itemActionsVisibility: options ? options.itemActionsVisibility : 'onhover',
            actionMode: 'strict',
        };
    }

    beforeEach(() => {
        collection = makeCollection(data);
        itemActionsController = new ItemActionsController();
    });

    describe('itemActions', () => {
        // 3 опции будут показаны в тулбаре, 6 в контекстном меню
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

        // Отображение операций над записью  только в тулбаре
        const toolbarOnlyActions: IItemAction[] = [
            {
                id: 3,
                icon: 'icon-Profile',
                title: 'Profile',
                showType: TItemActionShowType.TOOLBAR,
                displayMode: TActionDisplayMode.BOTH,
            },
            {
                id: 4,
                icon: 'icon-Time',
                title: 'Time management',
                showType: TItemActionShowType.TOOLBAR,
                displayMode: TActionDisplayMode.AUTO,
            },
        ];

        // Только одна операция над записью
        const onlyOneItemActions: IItemAction[] = [
            {
                id: 1,
                icon: 'icon-PhoneNull',
                title: 'phone',
                showType: TItemActionShowType.MENU,
            },
        ];

        // Только одна операция над записью с типом MENU_TOOLBAR
        const onlyOneItemActionMenuToolbar: IItemAction[] = [
            {
                id: 1,
                icon: 'icon-PhoneNull',
                title: 'phone',
                showType: TItemActionShowType.MENU_TOOLBAR,
            },
        ];

        // T1.7. Если требуется добавить кнопку меню, то она добавляется в список showed операций
        it('+actions with different showTypes, =display menu button', () => {
            // @ts-ignore
            itemActionsController.update(
                initializeControllerOptions({
                    collection,
                    itemActions,
                    theme: 'default',
                })
            );
            const actionsOf1 = collection.getItemBySourceKey(1).getActions();
            expect(actionsOf1).not.toBeNull();
            expect(actionsOf1.showed[actionsOf1.showed.length - 1].isMenu).toBe(true);
        });

        // T1.7. Если не требуется добавить кнопку меню, то она не добавляется в список showed операций
        it('+only toolbar actions, =hide menu button', () => {
            // @ts-ignore
            itemActionsController.update(
                initializeControllerOptions({
                    collection,
                    itemActions: toolbarOnlyActions,
                    theme: 'default',
                })
            );
            const actionsOf1 = collection.getItemBySourceKey(1).getActions();
            expect(actionsOf1).not.toBeNull();
            expect(actionsOf1.showed[actionsOf1.showed.length - 1].isMenu).not.toBe(true);
        });

        // T1.8.1 При установке только одной опции нужно игнорировать showType и всё показывать как TOOLBAR
        it('+only one action in menu, =hide menu button', () => {
            // @ts-ignore
            itemActionsController.update(
                initializeControllerOptions({
                    collection,
                    itemActions: onlyOneItemActions,
                    theme: 'default',
                })
            );
            const actionsOf1 = collection.getItemBySourceKey(1).getActions();
            expect(actionsOf1).not.toBeNull();
            expect(actionsOf1.showed[actionsOf1.showed.length - 1].isMenu).not.toBe(true);
            expect(actionsOf1.showed[actionsOf1.showed.length - 1].showType).toEqual(
                TItemActionShowType.MENU
            );
        });

        it('+only one menu_toolbar action, =hide menu button', () => {
            // @ts-ignore
            itemActionsController.update(
                initializeControllerOptions({
                    collection,
                    itemActions: onlyOneItemActionMenuToolbar,
                    theme: 'default',
                })
            );
            const actionsOf1 = collection.getItemBySourceKey(1).getActions();
            expect(actionsOf1).not.toBeNull();
            expect(actionsOf1.showed[actionsOf1.showed.length - 1].isMenu).not.toBe(true);
            expect(actionsOf1.showed[actionsOf1.showed.length - 1].showType).toEqual(
                TItemActionShowType.MENU_TOOLBAR
            );
        });

        // При наличии contextMenuConfig.headerTemplate надо принудительно
        // показывать кнопку с многоточием. Если запись одна
        it('+only toolbar actions, +contextMenuConfig.headerTemplate, +only one action, =display menu button', () => {
            // @ts-ignore
            itemActionsController.update(
                initializeControllerOptions({
                    collection,
                    itemActions: onlyOneItemActions,
                    theme: 'default',
                    contextMenuConfig: {
                        headerTemplate: 'template',
                    },
                })
            );
            const actionsOf1 = collection.getItemBySourceKey(1).getActions();
            expect(actionsOf1.showed[actionsOf1.showed.length - 1].isMenu).toBe(true);
        });

        // При наличии contextMenuConfig.footerTemplate надо принудительно
        // показывать кнопку с многоточием. Если запись одна
        it('+only toolbar actions, +contextMenuConfig.footerTemplate, +only one action, =display menu button', () => {
            // @ts-ignore
            itemActionsController.update(
                initializeControllerOptions({
                    collection,
                    itemActions: onlyOneItemActions,
                    theme: 'default',
                    contextMenuConfig: {
                        footerTemplate: 'template',
                    },
                })
            );
            const actionsOf1 = collection.getItemBySourceKey(1).getActions();
            expect(actionsOf1.showed[actionsOf1.showed.length - 1].isMenu).toBe(true);
        });

        // При наличии contextMenuConfig.headerTemplate надо принудительно
        // показывать кнопку с многоточием. Если записей несколько
        it('+only toolbar actions, +contextMenuConfig.headerTemplate, =display menu button', () => {
            // @ts-ignore
            itemActionsController.update(
                initializeControllerOptions({
                    collection,
                    itemActions: toolbarOnlyActions,
                    theme: 'default',
                    contextMenuConfig: {
                        headerTemplate: 'template',
                    },
                })
            );
            const actionsOf1 = collection.getItemBySourceKey(1).getActions();
            expect(actionsOf1.showed[actionsOf1.showed.length - 1].isMenu).toBe(true);
        });

        // При наличии contextMenuConfig.footerTemplate надо принудительно
        // показывать кнопку с многоточием. Если записей несколько
        it('+only toolbar actions, +contextMenuConfig.footerTemplate, =display menu button', () => {
            // @ts-ignore
            itemActionsController.update(
                initializeControllerOptions({
                    collection,
                    itemActions: toolbarOnlyActions,
                    theme: 'default',
                    contextMenuConfig: {
                        footerTemplate: 'template',
                    },
                })
            );
            const actionsOf1 = collection.getItemBySourceKey(1).getActions();
            expect(actionsOf1.showed[actionsOf1.showed.length - 1].isMenu).toBe(true);
        });
    });

    describe('SwipeActions', () => {
        beforeEach(() => {
            jest.spyOn(DOMUtil, 'getElementsWidth')
                .mockClear()
                .mockImplementation(
                    (itemsHtml: string[], itemClass: string, considerMargins?: boolean) => {
                        return itemsHtml.map((item) => {
                            return 25;
                        });
                    }
                );
            jest.spyOn(DOMUtil, 'getWidthForCssClass').mockClear().mockReturnValue(0);
        });

        // Только одна опция в тулбаре, одна - в контекстном меню
        const horizontalOnlyItemActions: IItemAction[] = [
            {
                id: 1,
                icon: 'icon-PhoneNull',
                title: 'phone',
                showType: TItemActionShowType.TOOLBAR,
            },
            {
                id: 2,
                icon: 'icon-EmptyMessage',
                title: 'message',
                showType: TItemActionShowType.MENU,
            },
        ];

        // T2.3.1. Если при инициализации в конфиге контекстного меню передан footerTemplate нужно принудительно
        // показывать кнопку "ещё"
        it('+contextMenuConfig.footerTemplate, =display menu button', () => {
            // @ts-ignore
            itemActionsController.update(
                initializeControllerOptions({
                    collection,
                    itemActions: horizontalOnlyItemActions,
                    theme: 'default',
                    actionAlignment: 'horizontal',
                    contextMenuConfig: {
                        footerTemplate: 'template',
                    },
                })
            );
            itemActionsController.activateSwipe(3, 100, 50);
            const config = collection.getSwipeConfig();
            expect(config).toBeDefined();
            expect(config.itemActions.showed[config.itemActions.showed.length - 1].isMenu).toBe(
                true
            );
        });

        // T2.3.2. Если при инициализации в конфиге контекстного меню передан headerTemplate нужно принудительно
        // показывать кнопку "ещё"
        it('+contextMenuConfig.headerTemplate, =display menu button', () => {
            // @ts-ignore
            itemActionsController.update(
                initializeControllerOptions({
                    collection,
                    itemActions: horizontalOnlyItemActions,
                    theme: 'default',
                    actionAlignment: 'horizontal',
                    contextMenuConfig: {
                        headerTemplate: 'template',
                    },
                })
            );
            itemActionsController.activateSwipe(3, 100, 50);
            const config = collection.getSwipeConfig();
            expect(config).toBeDefined();
            expect(config.itemActions.showed[config.itemActions.showed.length - 1].isMenu).toBe(
                true
            );
        });
    });
});
