import { RecordSet } from 'Types/collection';
import { Record } from 'Types/entity';
import { SyntheticEvent } from 'Vdom/Vdom';

import {
    IItemAction,
    TItemActionShowType,
    IItemActionsCollection,
    IItemActionsItem,
    Controller as ItemActionsController,
} from 'Controls/itemActions';
import { IControllerOptions } from '../../../../Controls/_itemActions/Controller';
import { ICollectionOptions, Collection } from 'Controls/display';

function mockDocument(): object {
    return {
        createElement: () => {
            return {
                style: {},
                classList: {
                    add: () => {
                        /* FIXME: sinon mock */
                    },
                },
                setAttribute: () => {
                    /* FIXME: sinon mock */
                },
                appendChild: () => {
                    /* FIXME: sinon mock */
                },
                getBoundingClientRect: () => {
                    return { width: '' };
                },
                getElementsByClassName: () => {
                    return [];
                },
            };
        },
        body: {
            appendChild: () => {
                /* FIXME: sinon mock */
            },
            removeChild: () => {
                /* FIXME: sinon mock */
            },
        },
    };
}

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

// T3.7.2. Мега тест на _getMenuActions
describe('_getMenuActions cases', () => {
    let clickEvent: SyntheticEvent<MouseEvent>;
    let target: HTMLElement;
    let itemActionsController: ItemActionsController;
    let collection: IItemActionsCollection;

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
            actionCaptionPosition: options ? options.actionCaptionPosition : null,
            editingToolbarVisible: options ? options.editingToolbarVisible : false,
            editArrowAction: options ? options.editArrowAction : null,
            editArrowVisibilityCallback: options ? options.editArrowVisibilityCallback : null,
            contextMenuConfig: options ? options.contextMenuConfig : null,
            iconSize: options ? options.iconSize : 'm',
            editingItem: options ? options.editingItem : null,
            itemActionsVisibility: options ? options.itemActionsVisibility : 'onhover',
            actionMode: options ? options.actionMode : 'strict',
        };
    }

    before(() => {
        global.document = mockDocument();
    });

    after(() => {
        global.document = undefined;
    });

    beforeEach(() => {
        target = {
            getBoundingClientRect(): ClientRect {
                return {
                    bottom: 1,
                    height: 1,
                    left: 1,
                    right: 1,
                    x: 1,
                    y: 1,
                    top: 1,
                    width: 1,
                };
            },
        } as undefined as HTMLElement;
        const native = {
            target,
        };
        clickEvent = new SyntheticEvent<MouseEvent>(native);

        collection = makeCollection(data);
        itemActionsController = new ItemActionsController();
    });

    // T3.7.2.1. parentAction не задан
    // T3.7.2.1.1. Среди экшнов присутствуют дети какого-то парента
    // T3.7.2.1.3. Среди экшнов отстутсвуют любые айтемы, у которых showtype===TOOLBAR
    it('-parentAction, =collect only root children', () => {
        const localItemActions: IItemAction[] = [
            {
                id: 1,
                icon: 'icon-PhoneNull',
                title: 'phone',
                showType: TItemActionShowType.MENU,
            },
            {
                id: 6,
                title: 'Development',
                showType: TItemActionShowType.MENU_TOOLBAR,
                parent: 4,
            },
        ];
        // @ts-ignore
        itemActionsController.update(
            initializeControllerOptions({
                collection,
                itemActions: localItemActions,
                theme: 'default',
                actionAlignment: 'vertical',
            })
        );
        const item3 = collection.getItemBySourceKey(3);
        const config = itemActionsController.prepareActionsMenuConfig(
            item3,
            clickEvent,
            null,
            null,
            false
        );
        expect(config.templateOptions).toBeDefined();
        // @ts-ignore
        expect(config.templateOptions.source).toBeDefined();
        // @ts-ignore
        const expectedCount = config.templateOptions.source.data.filter((action) => {
            return action.showType !== TItemActionShowType.TOOLBAR;
        }).length;
        expect(expectedCount).toEqual(1);
    });

    // T3.7.2.1.2. Среди экшнов присутствуют айтемы, у которых showtype===TOOLBAR
    it('should collect only non-toolbar options when no parentAction passed', () => {
        const localItemActions: IItemAction[] = [
            {
                id: 1,
                icon: 'icon-PhoneNull',
                title: 'phone',
                showType: TItemActionShowType.MENU,
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
        ];
        // @ts-ignore
        itemActionsController.update(
            initializeControllerOptions({
                collection,
                itemActions: localItemActions,
                theme: 'default',
                actionAlignment: 'vertical',
            })
        );
        const item3 = collection.getItemBySourceKey(3);
        const config = itemActionsController.prepareActionsMenuConfig(
            item3,
            clickEvent,
            null,
            null,
            false
        );
        expect(config.templateOptions).toBeDefined();
        // @ts-ignore
        expect(config.templateOptions.source).toBeDefined();
        // @ts-ignore
        const expectedActions = config.templateOptions.source.data.filter((action) => {
            return action.showType !== TItemActionShowType.TOOLBAR;
        });
        expect(Object.keys(expectedActions)).not.toHaveLength(0);
        // @ts-ignore
        const unexpectedActions = config.templateOptions.source.data.filter((action) => {
            return action.showType === TItemActionShowType.TOOLBAR;
        });
        expect(Object.keys(unexpectedActions)).toHaveLength(0);
    });

    // T3.7.2.2. parentAction задан
    // T3.7.2.2.1. Среди экшнов присутствуют дети указанного парента
    // T3.7.2.2.2. Среди экшнов присутствуют айтемы, у которых showtype===TOOLBAR
    // T3.7.2.2.3. Среди экшнов присутствуют айтемы, у которых showtype===MENU
    // T3.7.2.2.3. Среди экшнов присутствуют айтемы, у которых showtype===MENU_TOOLBAR
    it('should collect item actions for passed parent', () => {
        const localItemActions: IItemAction[] = [
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
        ];
        const parentAction = {
            id: 4,
            icon: 'icon-Time',
            title: 'Time management',
            showType: TItemActionShowType.TOOLBAR,
            'parent@': true,
        };
        // @ts-ignore
        itemActionsController.update(
            initializeControllerOptions({
                collection,
                itemActions: localItemActions,
                theme: 'default',
                actionAlignment: 'vertical',
            })
        );
        const item3 = collection.getItemBySourceKey(3);
        const config = itemActionsController.prepareActionsMenuConfig(
            item3,
            clickEvent,
            parentAction,
            null,
            false
        );
        expect(config.templateOptions).toBeDefined();
        // @ts-ignore
        expect(config.templateOptions.source).toBeDefined();
        // @ts-ignore
        const expectedCount = config.templateOptions.source.data.filter((action) => {
            return action.parent === 4;
        }).length;
        expect(expectedCount).toEqual(3);
    });

    // T3.7.2.2.1. Среди экшнов присутствуют дети какого-то другого парента, но отсутствуют дети указанного парента
    it('should collect item actions only for passed parent', () => {
        const localItemActions: IItemAction[] = [
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
                id: 5,
                title: 'Documentation',
                showType: TItemActionShowType.TOOLBAR,
                parent: 3,
            },
            {
                id: 6,
                title: 'Development',
                showType: TItemActionShowType.MENU_TOOLBAR,
                parent: 3,
            },
            {
                id: 7,
                title: 'Exploitation',
                showType: TItemActionShowType.MENU,
                parent: 3,
                'parent@': true,
            },
        ];
        const parentAction = {
            id: 4,
            icon: 'icon-Time',
            title: 'Time management',
            showType: TItemActionShowType.TOOLBAR,
            'parent@': true,
        };
        // @ts-ignore
        itemActionsController.update(
            initializeControllerOptions({
                collection,
                itemActions: localItemActions,
                theme: 'default',
                actionAlignment: 'vertical',
            })
        );
        const item3 = collection.getItemBySourceKey(3);
        const config = itemActionsController.prepareActionsMenuConfig(
            item3,
            clickEvent,
            parentAction,
            null,
            false
        );
        expect(config).toBeUndefined();
    });

    // T3.7.2.2. parentAction задан и его isMenu===true
    // T3.7.2.1.3. Среди экшнов отстутсвуют любые айтемы, у которых showtype===TOOLBAR
    it('+parentAction, parentAction.isMenu===true, =collect root menu actions + children', () => {
        const localItemActions: IItemAction[] = [
            {
                id: 'documentation',
                title: 'Documentation',
                showType: TItemActionShowType.MENU_TOOLBAR,
            },
            {
                id: 'development',
                title: 'Development',
                showType: TItemActionShowType.MENU,
                parent: 'documentation',
            },
            {
                id: 'phone',
                title: 'phone',
                showType: TItemActionShowType.MENU,
                parent: 'ghost',
            },
            {
                id: 'button',
                title: 'button',
                showType: TItemActionShowType.MENU,
                parent: 'phone',
            },
        ];
        const parentAction = {
            id: null,
            icon: 'icon-ExpandDown',
            style: 'secondary',
            iconStyle: 'secondary',
            isMenu: true,
        };
        // @ts-ignore
        itemActionsController.update(
            initializeControllerOptions({
                collection,
                itemActions: localItemActions,
                theme: 'default',
                actionAlignment: 'vertical',
            })
        );
        const item3 = collection.getItemBySourceKey(3);
        // @ts-ignore
        const config = itemActionsController.prepareActionsMenuConfig(
            item3,
            clickEvent,
            parentAction,
            null,
            false
        );
        expect(config.templateOptions).toBeDefined();
        // @ts-ignore
        expect(config.templateOptions.source).toBeDefined();
        // @ts-ignore
        const expectedCount = config.templateOptions.source.data.filter((action) => {
            return action.showType !== TItemActionShowType.TOOLBAR;
        }).length;
        expect(expectedCount).toEqual(2);
    });

    // T3.7.2.1.2. Среди экшнов присутствуют айтемы, у которых showtype===TOOLBAR
    it('should collect only non-toolbar item actions when parentAction.isMenu===true', () => {
        const localItemActions: IItemAction[] = [
            {
                id: 1,
                icon: 'icon-PhoneNull',
                title: 'phone',
                showType: TItemActionShowType.MENU,
            },
            {
                id: 2,
                icon: 'icon-PhoneNull',
                title: 'This action should not appear in menu',
                showType: TItemActionShowType.TOOLBAR,
                parent: null,
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
        ];
        const parentAction = {
            id: null,
            icon: 'icon-ExpandDown',
            style: 'secondary',
            iconStyle: 'secondary',
            isMenu: true,
        };
        // @ts-ignore
        itemActionsController.update(
            initializeControllerOptions({
                collection,
                itemActions: localItemActions,
                theme: 'default',
                actionAlignment: 'vertical',
            })
        );
        const item3 = collection.getItemBySourceKey(3);
        const config = itemActionsController.prepareActionsMenuConfig(
            item3,
            clickEvent,
            // @ts-ignore
            parentAction,
            null,
            false
        );
        expect(config.templateOptions).toBeDefined();
        // @ts-ignore
        expect(config.templateOptions.source).toBeDefined();
        // @ts-ignore
        const expectedActions = config.templateOptions.source.data.filter((action) => {
            return action.showType !== TItemActionShowType.TOOLBAR;
        });
        expect(Object.keys(expectedActions)).not.toHaveLength(0);
        // @ts-ignore
        const unexpectedActions = config.templateOptions.source.data.filter((action) => {
            return action.showType === TItemActionShowType.TOOLBAR;
        });
        expect(Object.keys(unexpectedActions)).toHaveLength(0);
    });

    it('-itemActions, +nodeFooterTemplate, should show menu', () => {
        const localItemActions: IItemAction[] = [];
        const parentAction = {
            id: null,
            icon: 'icon-ExpandDown',
            style: 'secondary',
            iconStyle: 'secondary',
            isMenu: true,
        };
        // @ts-ignore
        itemActionsController.update(
            initializeControllerOptions({
                collection,
                itemActions: localItemActions,
                theme: 'default',
                contextMenuConfig: {
                    footerTemplate: 'footerTemplate',
                },
            })
        );
        const item3 = collection.getItemBySourceKey(3);
        const config = itemActionsController.prepareActionsMenuConfig(
            item3,
            clickEvent,
            // @ts-ignore
            parentAction,
            null,
            false
        );
        expect(config).toBeDefined();
        // @ts-ignore
        expect(Object.keys(config.templateOptions.source.data)).toHaveLength(0);
    });

    it('-itemActions, -nodeFooterTemplate, should not show menu', () => {
        const localItemActions: IItemAction[] = [];
        const parentAction = {
            id: null,
            icon: 'icon-ExpandDown',
            style: 'secondary',
            iconStyle: 'secondary',
            isMenu: true,
        };
        // @ts-ignore
        itemActionsController.update(
            initializeControllerOptions({
                collection,
                itemActions: localItemActions,
                theme: 'default',
            })
        );
        const item3 = collection.getItemBySourceKey(3);
        const config = itemActionsController.prepareActionsMenuConfig(
            item3,
            clickEvent,
            // @ts-ignore
            parentAction,
            null,
            false
        );
        expect(config).toBeUndefined();
    });

    // Swipe

    it('should collect non-"showed" or non-toolbar item actions when item is swiped', () => {
        const localItemActions: IItemAction[] = [
            {
                id: 1,
                icon: 'icon-PhoneNull',
                title: 'phone',
                showType: TItemActionShowType.TOOLBAR,
                iconStyle: 'secondary',
            },
            {
                id: 5,
                title: 'Documentation',
                showType: TItemActionShowType.MENU_TOOLBAR,
                parent: 4,
                iconStyle: 'secondary',
            },
            {
                id: 6,
                title: 'Development',
                showType: TItemActionShowType.TOOLBAR,
                parent: 4,
                iconStyle: 'secondary',
            },
            {
                id: 7,
                title: 'Sources',
                showType: TItemActionShowType.TOOLBAR,
                parent: 4,
                iconStyle: 'secondary',
            },
        ];
        const parentAction = {
            id: null,
            icon: 'icon-ExpandDown',
            style: 'secondary',
            iconStyle: 'secondary',
            isMenu: true,
        };
        // @ts-ignore
        itemActionsController.update(
            initializeControllerOptions({
                collection,
                itemActions: localItemActions,
                theme: 'default',
                actionAlignment: 'vertical',
            })
        );
        const item3 = collection.getItemBySourceKey(3);
        item3.setSwiped(true, true);
        item3.getActions().showed = item3.getActions().all.filter((item, i) => {
            return i !== 3;
        });
        const config = itemActionsController.prepareActionsMenuConfig(
            item3,
            clickEvent,
            // @ts-ignore
            parentAction,
            null,
            false
        );
        expect(config.templateOptions).toBeDefined();
        // @ts-ignore
        expect(config.templateOptions.source).toBeDefined();
        // @ts-ignore
        expect(config.templateOptions.source.data[0]).toEqual(localItemActions[1]);
        // @ts-ignore
        expect(config.templateOptions.source.data[1]).toEqual(localItemActions[3]);
    });

    it('+swiped, -parentAction, should get non-shown', () => {
        const localItemActions: IItemAction[] = [
            {
                id: 1,
                icon: 'icon-PhoneNull',
                title: 'phone',
                showType: TItemActionShowType.TOOLBAR,
                iconStyle: 'secondary',
            },
            {
                id: 5,
                title: 'Documentation',
                showType: TItemActionShowType.MENU_TOOLBAR,
                parent: 4,
                iconStyle: 'secondary',
            },
            {
                id: 6,
                title: 'Development',
                showType: TItemActionShowType.TOOLBAR,
                parent: 4,
                iconStyle: 'secondary',
            },
            {
                id: 7,
                title: 'Sources',
                showType: TItemActionShowType.TOOLBAR,
                parent: 4,
                iconStyle: 'secondary',
            },
        ];

        itemActionsController.update(
            initializeControllerOptions({
                collection,
                itemActions: localItemActions,
                theme: 'default',
                actionAlignment: 'vertical',
            })
        );

        itemActionsController.activateSwipe(3, 150, 24);
        const item3 = collection.getItemBySourceKey(3);

        // try to open context menu
        const config = itemActionsController.prepareActionsMenuConfig(
            item3,
            clickEvent,
            null,
            null,
            false
        );
        expect(config.templateOptions).toBeDefined();
        expect(config.templateOptions.source).toBeDefined();
        expect(config.templateOptions.source.data[0]).toEqual(localItemActions[1]);
        expect(config.templateOptions.source.data[1]).toEqual(localItemActions[2]);
    });

    it('actionMode=adaptive, should show non-toolbar actions', () => {
        const localItemActions: IItemAction[] = [
            {
                id: 1,
                icon: 'icon-PhoneNull',
                title: 'phone',
                showType: TItemActionShowType.TOOLBAR,
            },
            {
                id: 5,
                title: 'Documentation',
                showType: TItemActionShowType.MENU_TOOLBAR,
            },
            {
                id: 6,
                title: 'Development',
                showType: TItemActionShowType.FIXED,
            },
            {
                id: 7,
                title: 'Sources',
                showType: TItemActionShowType.MENU,
            },
        ];
        // @ts-ignore
        itemActionsController.update(
            initializeControllerOptions({
                collection,
                itemActions: localItemActions,
                theme: 'default',
                actionMode: 'adaptive',
            })
        );
        const item3 = collection.getItemBySourceKey(3);
        const parentAction = {
            id: null,
            icon: 'icon-ExpandDown',
            style: 'secondary',
            iconStyle: 'secondary',
            isMenu: true,
        };
        const config = itemActionsController.prepareActionsMenuConfig(
            item3,
            clickEvent,
            // @ts-ignore
            parentAction,
            null,
            false
        );
        // @ts-ignore
        expect(
            config.templateOptions?.source?.data.some((item: IItemAction) => {
                return item.showType === TItemActionShowType.TOOLBAR;
            })
        ).toBe(false);
    });
});
