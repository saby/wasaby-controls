import { RecordSet } from 'Types/collection';
import { Collection, ICollectionOptions } from 'Controls/display';
import { Model } from 'Types/entity';
import {
    Controller as ItemActionsController,
    IItemActionsItem,
    IItemActionsCollection,
    IItemAction,
    TItemActionShowType,
} from 'Controls/itemActions';
import { IControllerOptions } from 'Controls/_itemActions/Controller';

// 3 опции будут показаны в тулбаре, 6 в контекстном меню
const itemActions: IItemAction[] = [
    {
        id: 'phone',
        icon: 'icon-PhoneNull',
        title: 'phone',
        showType: TItemActionShowType.MENU,
    },
    {
        id: 'message',
        icon: 'icon-EmptyMessage',
        title: 'message',
        showType: TItemActionShowType.MENU_TOOLBAR,
    },
    {
        id: 'profile',
        icon: 'icon-Profile',
        title: 'Profile',
        tooltip: "This is awesome Profile you've never seen",
        showType: TItemActionShowType.TOOLBAR,
    },
    {
        id: 'timeManagement',
        icon: 'icon-Time',
        title: 'Time management',
        showType: TItemActionShowType.FIXED,
        'parent@': true,
    },
    {
        id: 'documentation',
        title: 'Documentation',
        showType: TItemActionShowType.TOOLBAR,
    },
    {
        id: 'development',
        title: 'Development',
        showType: TItemActionShowType.MENU_TOOLBAR,
    },
    {
        id: 'exploitation',
        title: 'Exploitation',
        showType: TItemActionShowType.MENU,
        'parent@': true,
    },
    {
        id: 'approval',
        title: 'Approval',
        showType: TItemActionShowType.MENU,
        parent: 'exploitation',
        'parent@': true,
    },
];

const data = [
    { id: 1, name: 'Philip J. Fry', gender: 'M' },
    { id: 2, name: 'Turanga Leela', gender: 'F' },
    { id: 3, name: 'Professor Farnsworth', gender: 'M' },
    { id: 4, name: 'Amy Wong', gender: 'F' },
    { id: 5, name: 'Bender Bending Rodriguez', gender: 'R' },
];

describe('Controls/itemActions/Controller/HoverActions', () => {
    let itemActionsController: ItemActionsController;
    let collection: IItemActionsCollection;

    function makeCollection(
        rawData: {
            id: number;
            name: string;
            gender: string;
        }[]
    ): IItemActionsCollection {
        const list = new RecordSet({
            keyProperty: 'id',
            rawData,
        });
        const collectionConfig: ICollectionOptions<Record, IItemActionsItem> = {
            collection: list,
            keyProperty: 'id',
            leftSpacing: null,
            rightSpacing: null,
            rowSpacing: null,
            searchValue: null,
            editingConfig: null,
        };
        // @ts-ignore
        return new Collection<Record>(collectionConfig);
    }

    function initializeControllerOptions(
        options?: Partial<IControllerOptions>
    ): IControllerOptions {
        return {
            collection: options ? options.collection : null,
            itemActions: options ? options.itemActions : null,
            itemActionsProperty: options ? options.itemActionsProperty : null,
            visibilityCallback: options ? options.visibilityCallback : null,
            itemActionsPosition: options ? options.itemActionsPosition : null,
            style: options ? options.style : null,
            theme: options ? options.theme : 'default',
            actionAlignment: options ? options.actionAlignment : null,
            actionCaptionPosition: options
                ? options.actionCaptionPosition
                : null,
            editingToolbarVisible: options
                ? options.editingToolbarVisible
                : false,
            editArrowAction: options ? options.editArrowAction : null,
            editArrowVisibilityCallback: options
                ? options.editArrowVisibilityCallback
                : null,
            contextMenuConfig: options ? options.contextMenuConfig : null,
            iconSize: options ? options.iconSize : 'm',
            editingItem: options ? options.editingItem : null,
            itemActionsVisibility: options
                ? options.itemActionsVisibility
                : 'onhover',
            editingStyle: 'default',
            itemActionsClass: '',
            menuIconSize: 'm',
            actionMode: options ? options.actionMode : 'strict',
        };
    }

    beforeEach(() => {
        collection = makeCollection(data);
        itemActionsController = new ItemActionsController();
    });

    describe('visibilityCallback', () => {
        let visibilityCallbackCallCount: number;
        let visibilityCallback = (action: IItemAction, item: Model) => {
            return true;
        };

        function updateControllerOptions(): void {
            itemActionsController.update(
                initializeControllerOptions({
                    collection,
                    itemActions,
                    theme: 'default',
                    visibilityCallback,
                })
            );
        }

        beforeEach(() => {
            visibilityCallbackCallCount = 0;
        });

        // T1.3. При установке набора операций вызывается VisibilityCallback.
        it('should call visibilityCallback on init', () => {
            visibilityCallback = (action: IItemAction, item: Model) => {
                visibilityCallbackCallCount++;
                return true;
            };
            updateControllerOptions();
            expect(visibilityCallbackCallCount > 0).toBe(true);
        });

        it('should show actions, shown by visibilityCallback', () => {
            visibilityCallback = (action: IItemAction, item: Model) => {
                return !(item.getKey() === 4 && action.id === 'message');
            };
            updateControllerOptions();
            const actionsOf5 = collection.getItemBySourceKey(5).getActions();

            expect(actionsOf5).not.toBeNull();
            expect(
                actionsOf5.showed.find((action) => {
                    return action.id === 'message';
                })
            ).toBeDefined();
        });

        it('should not show actions, hidden by visibilityCallback', () => {
            visibilityCallback = (action: IItemAction, item: Model) => {
                return !(item.getKey() === 4 && action.id === 'message');
            };
            updateControllerOptions();
            const actionsOf4 = collection.getItemBySourceKey(4).getActions();

            expect(actionsOf4).not.toBeNull();
            expect(
                actionsOf4.showed.find((action) => {
                    return action.id === 'message';
                })
            ).toBeUndefined();
        });

        it('should not calculate "showed" on hover actions in adaptive mode', () => {
            itemActionsController.update(
                initializeControllerOptions({
                    collection,
                    itemActions,
                    theme: 'default',
                    actionMode: 'adaptive',
                    visibilityCallback,
                })
            );
            const actionsOf4 = collection.getItemBySourceKey(4).getActions();

            expect(actionsOf4).not.toBeNull();
            expect(Object.keys(actionsOf4.showed)).toHaveLength(0);
        });

        it('should not call visibility callback more than two times for menu actions', () => {
            visibilityCallback = (action: IItemAction, item: Model) => {
                visibilityCallbackCallCount++;
                return true;
            };
            updateControllerOptions();
            // 30 = 5 записей * 6 вызовов (один для MENU, два для MENU_TOOLBAR, два для TOOLBAR и один для FIXED)
            // Остальные MENU и те, у которых есть parent не проверяются и не показываются,
            // т.к. для них рассчитывается видимость при открытии соответствующего меню.
            expect(visibilityCallbackCallCount).toEqual(30);
        });

        it('should work with breadcrumbs', () => {
            const itemAt0 = collection.at(0);
            const originalGetContents = itemAt0.getContents.bind(itemAt0);
            // @ts-ignore
            itemAt0.getContents = (): any[] => {
                return ['fake', 'fake', 'fake', originalGetContents()];
            };
            updateControllerOptions();
            expect(Array.isArray(itemAt0.getContents())).toBe(true);
            expect(Object.keys(itemAt0.getActions())).not.toHaveLength(0);
        });
    });
});
