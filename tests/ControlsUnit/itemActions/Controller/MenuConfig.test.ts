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
        parent: 'timeManagement',
    },
    {
        id: 'development',
        title: 'Development',
        showType: TItemActionShowType.MENU_TOOLBAR,
        parent: 'timeManagement',
    },
    {
        id: 'exploitation',
        title: 'Exploitation',
        showType: TItemActionShowType.MENU,
        parent: 'timeManagement',
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

    function initializeControllerOptions(options?: IControllerOptions): IControllerOptions {
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
        itemActionsController.update(
            initializeControllerOptions({
                collection,
                itemActions,
                theme: 'default',
            })
        );
    });

    // T3.1. Если в метод передан parentAction и это не кнопка открытия меню, то config.templateOptions.showHeader
    // будет true
    it("+parentAction, parentAction.isMenu=false, =config.templateOptions.showHeader='true'", () => {
        const item3 = collection.getItemBySourceKey(3);
        const config = itemActionsController.prepareActionsMenuConfig(
            item3,
            clickEvent,
            itemActions[3],
            null,
            false
        );
        expect(config.templateOptions).toBeDefined();
        // @ts-ignore
        expect(config.templateOptions.showHeader).toBe(true);
    });

    describe('prepareActionsMenuConfig()', () => {
        // T3.2. Если в метод не передан parentAction, то config.templateOptions.showHeader будет false
        it("should set config.templateOptions.showHeader 'false' when parentAction isn't set", () => {
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
            expect(config.templateOptions.showHeader).toBe(false);
        });

        // T3.2. Если parentAction - это кнопка открытия меню, то config.templateOptions.showHeader будет false
        it("should set config.templateOptions.showHeader 'false' when parentAction is isMenu", () => {
            const item3 = collection.getItemBySourceKey(3);
            const actionsOf3 = item3.getActions();
            const config = itemActionsController.prepareActionsMenuConfig(
                item3,
                clickEvent,
                actionsOf3.showed[actionsOf3.showed.length - 1],
                null,
                false
            );
            expect(config.templateOptions).toBeDefined();
            // @ts-ignore
            expect(config.templateOptions.showHeader).toBe(false);
        });

        // T3.6. Result.templateOptions.source содержит меню из ItemActions, соответствующих текущему parentAction
        it('should set result.templateOptions.source responsible to current parentActions', () => {
            const item3 = collection.getItemBySourceKey(3);
            const config = itemActionsController.prepareActionsMenuConfig(
                item3,
                clickEvent,
                itemActions[3],
                null,
                false
            );
            expect(config.templateOptions).toBeDefined();
            // @ts-ignore
            expect(config.templateOptions.source).toBeDefined();
            // @ts-ignore
            const calculatedChildren = JSON.stringify(
                config.templateOptions.source.data.map((item) => {
                    return item.id;
                })
            );
            const children = JSON.stringify([
                'documentation',
                'development',
                'exploitation',
                'approval',
            ]);
            expect(config.templateOptions).toBeDefined();
            expect(calculatedChildren).toEqual(children);
        });

        // T3.7. Если parentAction - кнопка открытия доп. меню, то result.templateOptions.source содержит меню
        // ItemActions с showType != TItemActionShowType.TOOLBAR
        it('should collect only non-TOOLBAR item actions when parentAction.isMenu="true"', () => {
            const item3 = collection.getItemBySourceKey(3);
            const actionsOf3 = item3.getActions();
            const config = itemActionsController.prepareActionsMenuConfig(
                item3,
                clickEvent,
                actionsOf3.showed[actionsOf3.showed.length - 1],
                null,
                false
            );
            expect(config.templateOptions).toBeDefined();
            // @ts-ignore
            expect(config.templateOptions.source).toBeDefined();
            // @ts-ignore
            const calculatedChildren = JSON.stringify(
                config.templateOptions.source.data.map((item) => {
                    return item.id;
                })
            );
            const children = JSON.stringify([
                'phone',
                'message',
                'timeManagement',
                'documentation',
                'development',
                'exploitation',
                'approval',
            ]);
            expect(calculatedChildren).toBeDefined();
            expect(calculatedChildren).toEqual(children);
        });

        // T3.7.1 Если parentAction - не задан, то result.templateOptions.source содержит меню ItemActions
        // с showType != TItemActionShowType.TOOLBAR
        it('should collect only non-TOOLBAR item actions when parentAction is not set', () => {
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
            const calculatedChildren = JSON.stringify(
                config.templateOptions.source.data.map((item) => {
                    return item.id;
                })
            );
            const children = JSON.stringify([
                'phone',
                'message',
                'timeManagement',
                'documentation',
                'development',
                'exploitation',
                'approval',
            ]);
            expect(calculatedChildren).toBeDefined();
            expect(calculatedChildren).toEqual(children);
        });

        // Надо добавлять кнопку закрытия для случая контекстного меню (когда parentAction не задан)
        it("should add close button for template config when parentAction isn't set", () => {
            const item3 = collection.getItemBySourceKey(3);
            const config = itemActionsController.prepareActionsMenuConfig(
                item3,
                clickEvent,
                null,
                null,
                false
            );
            // @ts-ignore
            expect(config.templateOptions.closeButtonVisibility).toBe(true);
        });

        // Надо добавлять кнопку закрытия для случая дополнительного меню parentAction.isMenu===true
        it('should add close button for template config when parentAction.isMenu===true', () => {
            const item3 = collection.getItemBySourceKey(3);
            const actionsOf3 = item3.getActions();
            const config = itemActionsController.prepareActionsMenuConfig(
                item3,
                clickEvent,
                actionsOf3.showed[actionsOf3.showed.length - 1],
                null,
                false
            );
            // @ts-ignore
            expect(config.templateOptions.closeButtonVisibility).toBe(true);
        });

        // Не надо добавлять кнопку закрытия меню, если передан обычный parentAction
        it('should add close button for template config when parentAction.isMenu!==true', () => {
            const item3 = collection.getItemBySourceKey(3);
            const config = itemActionsController.prepareActionsMenuConfig(
                item3,
                clickEvent,
                itemActions[3],
                null,
                false
            );
            // @ts-ignore
            expect(config.templateOptions.closeButtonVisibility).toBe(false);
        });

        // T3.3. Если в метод передан contextMenu=true, то в config.direction.horizontal будет right
        it("should set config.direction.horizontal as 'right' when contextMenu=true", () => {
            const item3 = collection.getItemBySourceKey(3);
            const config = itemActionsController.prepareActionsMenuConfig(
                item3,
                clickEvent,
                null,
                null,
                true
            );
            expect(config.direction).toBeDefined();
            expect(config.direction.horizontal).toEqual('right');
        });

        // T3.3.1 Если в метод передан parentAction.isMenu===true, то в config.direction.horizontal будет left
        it("should set result.direction.horizontal as 'left' when parentAction.isMenu===true", () => {
            const item3 = collection.getItemBySourceKey(3);
            const actionsOf3 = item3.getActions();
            const config = itemActionsController.prepareActionsMenuConfig(
                item3,
                clickEvent,
                actionsOf3.showed[actionsOf3.showed.length - 1],
                null,
                false
            );
            expect(config.direction).toBeDefined();
            expect(config.direction.horizontal).toEqual('left');
        });

        // T3.3.2 Не надо добавлять direction в menuConfig, если передан обычный parentAction
        it('should not set direction when parentAction.isMenu!==true', () => {
            const item3 = collection.getItemBySourceKey(3);
            const config = itemActionsController.prepareActionsMenuConfig(
                item3,
                clickEvent,
                itemActions[3],
                null,
                false
            );
            expect(config.direction).toBeUndefined();
        });

        // T3.4. Если в метод передан contextMenu=false, то в config.target будет объект с копией
        // clickEvent.target.getBoundingClientRect()
        it('should set config.target as copy of clickEvent.target.getBoundingClientRect()', () => {
            const item3 = collection.getItemBySourceKey(3);
            const config = itemActionsController.prepareActionsMenuConfig(
                item3,
                clickEvent,
                itemActions[3],
                null,
                false
            );
            // @ts-ignore
            expect(config.target.x).toEqual(target.getBoundingClientRect().x);
            // @ts-ignore
            expect(config.target.y).toEqual(target.getBoundingClientRect().y);
        });

        // T3.5. Если был установлен iconSize он должен примениться к templateOptions
        it('should apply iconSize to templateOptions', () => {
            const item3 = collection.getItemBySourceKey(3);
            const actionsOf3 = item3.getActions();
            const config = itemActionsController.prepareActionsMenuConfig(
                item3,
                clickEvent,
                actionsOf3.showed[actionsOf3.showed.length - 1],
                null,
                false
            );
            expect(config.templateOptions).toBeDefined();
            // @ts-ignore
            expect(config.templateOptions.iconSize).toEqual('m');
        });

        // T3.6. Если в контрол был передан contextMenuConfig, его нужно объединять
        // с templateOptions для Sticky.openPopup(menuConfig)
        it('should merge contextMenuConfig with templateOptions for popup config', () => {
            // @ts-ignore
            itemActionsController.update(
                initializeControllerOptions({
                    collection,
                    itemActions,
                    theme: 'default',
                    contextMenuConfig: {
                        iconSize: 's',
                        groupProperty: 'title',
                    },
                })
            );
            const item3 = collection.getItemBySourceKey(3);
            const config = itemActionsController.prepareActionsMenuConfig(
                item3,
                clickEvent,
                itemActions[3],
                null,
                false
            );
            // @ts-ignore
            expect(config.templateOptions.groupProperty).toEqual('title');
            // @ts-ignore
            expect(config.templateOptions.headConfig.iconSize).toEqual('s');
        });

        // T3.6.1. Если в контрол был передан contextMenuConfig без IconSize, нужно применять размер иконки по умолчанию
        it('should use default IconSize when contextMenuConfig does not contain iconSize property', () => {
            // @ts-ignore
            itemActionsController.update(
                initializeControllerOptions({
                    collection,
                    itemActions,
                    theme: 'default',
                    iconSize: 's',
                    contextMenuConfig: {
                        groupProperty: 'title',
                    },
                })
            );
            const item3 = collection.getItemBySourceKey(3);
            const config = itemActionsController.prepareActionsMenuConfig(
                item3,
                clickEvent,
                itemActions[3],
                null,
                false
            );
            // @ts-ignore
            expect(config.templateOptions.iconSize).toEqual('m');
        });

        // T3.7. Для меню не нужно считать controls-itemActionsV__action_icon
        it('should not set "controls-itemActionsV__action_icon" CSS class for menu item actions icons', () => {
            const item3 = collection.getItemBySourceKey(3);
            const actionsOf3 = item3.getActions();
            const config = itemActionsController.prepareActionsMenuConfig(
                item3,
                clickEvent,
                actionsOf3.showed[actionsOf3.showed.length - 1],
                null,
                false
            );
            // @ts-ignore
            const calculatedChildren = config.templateOptions.source;
            expect(calculatedChildren).toBeDefined();
            expect(calculatedChildren.data[0].icon).not.toMatch(
                /controls-itemActionsV__action_icon/
            );
        });

        // T3.8. В любом случае нужно посчитать fittingMode
        it("should set config.fittingMode.vertical as 'overflow'", () => {
            const item3 = collection.getItemBySourceKey(3);
            const config = itemActionsController.prepareActionsMenuConfig(
                item3,
                clickEvent,
                itemActions[3],
                null,
                false
            );
            expect(config.fittingMode).toBeDefined();
            // @ts-ignore
            expect(config.fittingMode.vertical).toEqual('overflow');
            // @ts-ignore
            expect(config.fittingMode.horizontal).toEqual('adaptive');
        });

        // T3.9. Для Контекстного меню нужно обязательно добавлять CSS класс controls-ItemActions__popup__list
        // eslint-disable-next-line max-len
        it('-parentAction, =config.className=controls-ItemActions__popup__list', () => {
            const item3 = collection.getItemBySourceKey(3);
            const config = itemActionsController.prepareActionsMenuConfig(
                item3,
                clickEvent,
                null,
                null,
                true
            );
            expect(config.className).toEqual(
                'controls-ItemActions__popup__list controls_popupTemplate_theme-default'
            );
        });

        // T3.10. Для Дополнительного меню нужно обязательно добавлять CSS класс controls-ItemActions__popup__list
        // eslint-disable-next-line max-len
        it('+parentAction.isMenu===true, =config.className=controls-ItemActions__popup__list', () => {
            const item3 = collection.getItemBySourceKey(3);
            const actionsOf3 = item3.getActions();
            const config = itemActionsController.prepareActionsMenuConfig(
                item3,
                clickEvent,
                actionsOf3.showed[actionsOf3.showed.length - 1],
                null,
                false
            );
            expect(config.className).toEqual(
                'controls-ItemActions__popup__list controls_popupTemplate_theme-default'
            );
        });

        // T3.11. Для Обычного Меню нужно обязательно добавлять CSS класс controls-MenuButton_link_iconSize-medium_popup
        it('+parentAction.isMenu!==true, =config.className=controls-MenuButton_link_iconSize-medium_popup', () => {
            const item3 = collection.getItemBySourceKey(3);
            const config = itemActionsController.prepareActionsMenuConfig(
                item3,
                clickEvent,
                itemActions[3],
                null,
                false
            );
            expect(config.className).toEqual(
                'controls-MenuButton_link_iconSize-medium_popup ' +
                    'controls_popupTemplate_theme-default controls_dropdownPopup_theme-default'
            );
        });

        // T3.12. Если в метод передан contextMenu=true, то будет расчитан config.targetPoint
        it('should set config.targetPoint when contextMenu=true', () => {
            const item3 = collection.getItemBySourceKey(3);
            const config = itemActionsController.prepareActionsMenuConfig(
                item3,
                clickEvent,
                null,
                null,
                true
            );
            expect(config.targetPoint).toBeDefined();
            expect(config.targetPoint.vertical).toEqual('top');
            expect(config.targetPoint.horizontal).toEqual('right');
        });

        // T3.13 Если в метод передан parentAction.isMenu===true, то будет расчитан config.targetPoint
        it('should set config.targetPoint when parentAction.isMenu===true', () => {
            const item3 = collection.getItemBySourceKey(3);
            const actionsOf3 = item3.getActions();
            const config = itemActionsController.prepareActionsMenuConfig(
                item3,
                clickEvent,
                actionsOf3.showed[actionsOf3.showed.length - 1],
                null,
                false
            );
            expect(config.targetPoint).toBeDefined();
            expect(config.targetPoint.vertical).toEqual('top');
            expect(config.targetPoint.horizontal).toEqual('right');
        });

        // T3.14 Не надо добавлять config.targetPoint, если передан обычный parentAction
        it('should not set config.targetPoint when parentAction.isMenu!==true', () => {
            const item3 = collection.getItemBySourceKey(3);
            const config = itemActionsController.prepareActionsMenuConfig(
                item3,
                clickEvent,
                itemActions[3],
                null,
                false
            );
            expect(config.targetPoint).toBeUndefined();
        });

        // T3.15. Если в метод передан contextMenu=true, то будет расчитан config.nativeEvent
        it('should set config.targetPoint when contextMenu=true', () => {
            const item3 = collection.getItemBySourceKey(3);
            const config = itemActionsController.prepareActionsMenuConfig(
                item3,
                clickEvent,
                null,
                null,
                true
            );
            // @ts-ignore
            expect(config.nativeEvent).toBeDefined();
        });

        // T3.16 Если в метод передан parentAction.isMenu===true, то будет расчитан config.nativeEvent
        it('should not set config.nativeEvent when parentAction.isMenu===true', () => {
            const item3 = collection.getItemBySourceKey(3);
            const actionsOf3 = item3.getActions();
            const config = itemActionsController.prepareActionsMenuConfig(
                item3,
                clickEvent,
                actionsOf3.showed[actionsOf3.showed.length - 1],
                null,
                false
            );
            // @ts-ignore
            expect(config.nativeEvent).toBeNull();
        });

        // T3.17 Не надо добавлять config.nativeEvent, если передан обычный parentAction
        it('should not set config.nativeEvent when parentAction.isMenu!==true', () => {
            const item3 = collection.getItemBySourceKey(3);
            const config = itemActionsController.prepareActionsMenuConfig(
                item3,
                clickEvent,
                itemActions[3],
                null,
                false
            );
            // @ts-ignore
            expect(config.nativeEvent).toBeUndefined();
        });

        // T3.18 нужно пробрасывать footerItemData в конфиг шаблона
        it('should set config.footerItemData', () => {
            const item3 = collection.getItemBySourceKey(3);
            const config = itemActionsController.prepareActionsMenuConfig(
                item3,
                clickEvent,
                itemActions[3],
                null,
                false
            );
            expect(config.templateOptions).toBeDefined();
            expect(config.templateOptions.footerItemData).toBeDefined();
            expect(config.templateOptions.footerItemData.item).toEqual(item3.getContents());
        });
    });
});
