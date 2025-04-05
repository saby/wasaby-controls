/**
 * @kaizen_zone fd2f64a5-d515-49d2-8fef-3e6af047ff0a
 */
import * as React from 'react';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { IAction, TIconSize } from 'Controls/interface';
import { DimensionsMeasurer } from 'Controls/sizeUtils';
import { TItemActionShowType, DEFAULT_ACTION_SIZE, MENU_BUTTON_KEY } from '../constants';

import type { Control } from 'UICore/Base';
import type { IStickyPopupOptions, StickyOpener } from 'Controls/popup';
import type { IMenuPopupOptions } from 'Controls/menu';
import type { IAction as IShownItemAction, IContextMenuConfig } from 'Controls/itemActions';
import { ActionsStyleUtils } from './ActionsStyleUtils';
import type { MenuSource } from 'Controls/actions';
import { SyntheticEvent } from 'UICommon/Events';

function getAvailableActionsKeys(
    visibleActions: IAction[],
    parentAction: IAction
): (string | number)[] {
    const availableActionsKeys: (string | number)[] = visibleActions.map((action) => {
        return action.id;
    });
    if (parentAction !== undefined) {
        availableActionsKeys.push(
            parentAction && parentAction.id !== MENU_BUTTON_KEY ? parentAction.id : null
        );
    }
    return availableActionsKeys;
}

// Меню не поддерживает отображение детей без родителя. Это приводит к ошибкам.
// Например, показывается пустое меню без элементов. Тут рекурсивно отрезаем всех сироток.
// Рекурсия нужна, т.к. иногда передают очень глубокую иерархию и нельзя отрезать только верхний слой.
function cutOrphans(visibleActions: IAction[], parentAction: IAction): IAction[] {
    let availableActionsKeys: (string | number)[] = getAvailableActionsKeys(
        visibleActions,
        parentAction
    );
    while (
        visibleActions.some((action) => {
            return (
                action.parent !== undefined && availableActionsKeys.indexOf(action.parent) === -1
            );
        })
    ) {
        visibleActions = visibleActions.filter((action) => {
            return action.parent === undefined || availableActionsKeys.indexOf(action.parent) > -1;
        });
        availableActionsKeys = getAvailableActionsKeys(visibleActions, parentAction);
    }
    return visibleActions;
}

/**
 * Набирает элементы для иерархического меню по указанному родителю
 * @param visibleActions
 * @param parent
 * @private
 */
function getActionsByParentRecursive(visibleActions: IAction[], parent: IAction): IAction[] {
    let result: IAction[] = [];
    const parentId = parent.id === MENU_BUTTON_KEY ? null : parent.id;
    visibleActions.forEach((action) => {
        const actionParent = action.parent === undefined ? null : action.parent;
        if (parentId === actionParent) {
            result.push(action);
            if (action['parent@']) {
                result = result.concat(getActionsByParentRecursive(visibleActions, action));
            }
        }
    });
    return result;
}

/**
 * Набирает элементы для иерархического меню, применяя к родительским элементам указанный фильтр.
 * Дочерние элементы иерархически включаются по родителю.
 * @param visibleActions
 * @param filter
 * @private
 */
function getItemsWithFilterRecursive(
    visibleActions: IAction[],
    filter: (action: IAction) => boolean
): IAction[] {
    const result: IAction[] = [];
    visibleActions.filter(filter).forEach((action) => {
        if (result.indexOf(action) === -1) {
            result.push(action);
        }
        if (action['parent@']) {
            getActionsByParentRecursive(visibleActions, action).forEach((childAction) => {
                if (result.indexOf(childAction) === -1) {
                    result.push(childAction);
                }
            });
        }
    });
    return result;
}

function hasActionInArray(action: IAction, actions: IAction[]): boolean {
    return actions.some((item) => {
        return item.id === action.id;
    });
}

/**
 * Получает для указанного элемента коллекции набор опций записи для меню, отфильтрованный по parentAction
 * Если parentAction - кнопка вызова меню или parentAction не указан, то элементы фильтруются по showType.
 * Если parentAction содержит id, то элементы фильтруются по parent===id.
 * Если был сделан свайп по элементу, то возвращаются все опции записи.
 * @see http://axure.tensor.ru/standarts/v7/%D1%81%D0%B2%D0%B0%D0%B9%D0%BF__version_04_.html
 * @param actions
 * @param excludedActions
 * @param parentAction
 * @param isMenuForSwipedItem
 * @private
 */
function getMenuActions(
    actions: IAction[],
    excludedActions: IAction[],
    parentAction: IShownItemAction,
    isMenuForSwipedItem: boolean
): IAction[] {
    let visibleActions = actions;
    // Кроме как intersection all vs excludedActions мы не можем знать, какие опции Measurer скрыл под кнопку "Ещё",
    // Поэтому для свайпнутой записи имеет смысл показывать в меню те опции, которые отсутствуют в showed
    // массиве или у которых showType MENU_TOOLBAR или MENU
    // см. https://online.sbis.ru/opendoc.html?guid=f43a6f8e-84a5-4f22-b67f-4545bf586adc
    // см. https://online.sbis.ru/opendoc.html?guid=91e7bea1-fa6c-483f-a5dc-860b084ab17a
    // см. https://online.sbis.ru/opendoc.html?guid=b5751217-3833-441f-9eb6-53526625bc0c
    if (isMenuForSwipedItem && (!parentAction || parentAction.isMenu)) {
        return visibleActions.filter((action) => {
            return (
                !hasActionInArray(action, excludedActions) ||
                action.showType !== TItemActionShowType.TOOLBAR
            );
        });
    }
    // По стандарту при адаптивном способе отображения операций кнопки с подменю не показываются в
    // быстром доступе, а в меню надо показывать весь набор операций.
    // Это приводит к "дублированию" кнопок, когда есть кнопка с подменю и такая же,
    // без подменю - для быстрого доступа. Напр:
    // см. https://online.sbis.ru/opendoc.html?guid=85014e84-fc7a-4d0c-9d9d-bddc8cd124fa.
    // Пока в этом случае показываем операции в меню по обычным правилам.
    // Если прикладник хочет полную адаптивность, он может всем операциям поставить
    // action.showType === TItemActionShowType.MENU.
    if (!!parentAction && !parentAction.isMenu) {
        visibleActions = getActionsByParentRecursive(visibleActions, parentAction);
    } else {
        visibleActions = getItemsWithFilterRecursive(visibleActions, (action) => {
            return action.showType !== TItemActionShowType.TOOLBAR;
        });
    }
    return cutOrphans(visibleActions, parentAction);
}

/**
 * В процессе открытия меню, запись может пререрисоваться, и таргета не будет в DOM.
 * Поэтому необходимо передавать координаты таргета для popup
 * @param realTarget
 */
function calculateTargetPoint(realTarget: HTMLElement): {
    x: number;
    y: number;
    width: number;
    height: number;
} {
    const rect = DimensionsMeasurer.getBoundingClientRect(realTarget);
    return {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
    };
}

function prepareMenuAction(action: IAction): IAction {
    const shownAction: IAction = action.getState ? action.getState() : { ...action };
    shownAction.iconStyle = ActionsStyleUtils.getIconStyleForStaticBackground(
        action as unknown as IAction
    );
    return shownAction;
}

interface IGetMenuSourceProps {
    actions?: IAction[];
    excludedActions?: IAction[];
    menuSource?: Memory;
    parentAction?: IAction;
    isMenuForSwipedItem?: boolean;
    allowConfigWithoutActions?: boolean;
}

function getMenuSource({
    menuSource,
    actions,
    excludedActions,
    parentAction,
    isMenuForSwipedItem,
    allowConfigWithoutActions,
}: IGetMenuSourceProps): Memory | undefined {
    if (menuSource) {
        return menuSource;
    }
    const menuActions = getMenuActions(actions, excludedActions, parentAction, isMenuForSwipedItem);
    if ((!menuActions || menuActions.length === 0) && !allowConfigWithoutActions) {
        return;
    }
    // TODO когда все itemActions будут работать как экшны тулбара, то
    //  правильно будет всегда использовать MenuSource (Controls/actions:MenuSource)
    return new Memory({
        data: menuActions.map(prepareMenuAction),
        keyProperty: 'id',
    });
}

/**
 * Возвращает конфиг для шаблона меню опций
 * @param isActionMenu
 * @param parentAction
 * @param menuSource
 * @param menuLayoutContext
 * @param contextMenuConfig
 * @private
 */
function getActionsMenuTemplateConfig(
    isActionMenu: boolean,
    parentAction: IAction,
    menuSource: Memory,
    menuLayoutContext: { item: Model } & Record<string, unknown>,
    contextMenuConfig?: IContextMenuConfig
): IMenuPopupOptions {
    const iconSize = contextMenuConfig?.iconSize || DEFAULT_ACTION_SIZE;
    const headConfig = isActionMenu
        ? {
              caption: parentAction.title,
              icon: parentAction.icon,
              iconSize,
          }
        : null;
    const root = parentAction && (parentAction.id !== MENU_BUTTON_KEY ? parentAction.id : null);
    return {
        source: menuSource,
        keyProperty: 'id',
        parentProperty: 'parent',
        nodeProperty: 'parent@',
        // Позволяем настроить closeButtonVisibility
        closeButtonVisibility: !isActionMenu && !root,
        ...contextMenuConfig,
        // Опции, которые будут переданы в шаблон подвала
        footerItemData: {
            ...contextMenuConfig?.footerItemData,
            item: menuLayoutContext.item,
        },
        // Опции, которые будут переданы в подменю.
        subMenuTemplateOptions: {
            ...contextMenuConfig?.subMenuTemplateOptions,
            listItem: menuLayoutContext.item,
        },
        root,
        // @ts-ignore
        showHeader: isActionMenu,
        headConfig,
        iconSize,
    };
}

export enum MENUTYPE {
    ADDITIONAL,
    CONTEXT,
    SWIPE,
}

interface IPrepareActionsMenuConfig {
    actions: IAction[];
    excludedActions: IAction[];
    menuSource?: Memory;
    clickEvent: React.MouseEvent;
    parentAction: IShownItemAction | null;
    opener: Element | Control<object, unknown>;
    actionsMenuConfig?: IContextMenuConfig;
    iconSize?: TIconSize;
    theme?: string;
    allowConfigWithoutActions?: boolean;
    menuType: MENUTYPE;
    menuLayoutContext?: { item: Model } & Record<string, unknown>;
}

function prepareActionsMenuConfig({
    actions,
    excludedActions,
    menuSource: externalMenuSource,
    clickEvent,
    parentAction,
    opener,
    actionsMenuConfig,
    theme = 'default',
    allowConfigWithoutActions,
    menuType,
    menuLayoutContext,
}: IPrepareActionsMenuConfig): IStickyPopupOptions | undefined {
    const menuSource = getMenuSource({
        actions,
        excludedActions,
        parentAction,
        isMenuForSwipedItem: menuType === MENUTYPE.SWIPE,
        menuSource: externalMenuSource,
        allowConfigWithoutActions,
    });
    if (!menuSource) {
        return;
    }
    const isContextMenu = menuType === MENUTYPE.CONTEXT;

    const target = isContextMenu ? null : calculateTargetPoint(clickEvent.target);
    const isActionMenu = !!parentAction && !parentAction.isMenu;
    const templateOptions = getActionsMenuTemplateConfig(
        isActionMenu,
        parentAction,
        menuSource,
        menuLayoutContext,
        actionsMenuConfig
    );

    let menuConfig: IStickyPopupOptions = {
        // @ts-ignore
        opener,
        target,
        template: 'Controls/menu:Popup',
        actionOnScroll: 'close',
        templateOptions,
        // Этот класс задаёт смещение для popup при расчёте его top/left так,
        // чтобы иконка в заголовке меню совпадала с иконкой кнопки, по которой это меню открыли
        className:
            `controls-MenuButton_link_popup controls-MenuButton_withIcon_popup controls-MenuButton_iconSize-m controls_popupTemplate_theme-${theme}` +
            ` controls_dropdownPopup_theme-${theme}`,
        closeOnOutsideClick: true,
        fittingMode: {
            vertical: 'overflow',
            horizontal: 'adaptive',
        },
        readOnly: false,
        // Опции, которые передаются только для шторки в адаптиве
        slidingPanelOptions: {
            modal: true,
        },
    };
    if (!isActionMenu) {
        menuConfig = {
            ...menuConfig,
            direction: {
                horizontal: isContextMenu ? 'right' : 'left',
            },
            targetPoint: {
                vertical: 'top',
                horizontal: 'right',
            },
            // Этот класс задаёт смещение для popup при расчёте его top/left так,
            // чтобы кнопка закрытия меню совпадала с иконкой кнопки открытия меню
            className: `controls-ItemActions__popup__list controls_popupTemplate_theme-${theme}`,
            // @ts-ignore
            nativeEvent: isContextMenu ? clickEvent.nativeEvent : null,
        };
    }
    return menuConfig;
}

/*
 * Интерфейс свойст для вызова метода openItemActionsMenu
 */
interface IOpenItemActionsMenu {
    // Источник данных для формирования меню. Должен наследоваться от Controls/actions:MenuSource.
    menuSource: MenuSource;
    // Запись списка, для которой открвается меню
    item: Model;
    // HTML контейнер записи списка, для которой открывается меню
    itemContainer: HTMLDivElement;
    // Родительский экшн, от которого можно построить меню
    parentAction: IAction | null;
    // Событие клика, вызвавшее меню
    clickEvent: React.MouseEvent;
    // Контрол, который открыл окно
    popupOpener: StickyOpener;
    // Обработчик клика по экшну в меню
    onActionClickHandler: Function;
    // Тип меню - контестном меню, меню по кнопке "...", меню по кнопке "..." при свайпе.
    menuType: MENUTYPE;
}

/*
 * Открывает меню в стики-попапе.
 * Используется как для меню из экшна, так и для контекстного меню (по правой кнопке).
 */
function openItemActionsMenu({
    menuSource,
    popupOpener,
    item,
    itemContainer,
    onActionClickHandler,
    menuType,
    parentAction,
    clickEvent,
}: IOpenItemActionsMenu): void {
    const menuConfig = ActionsMenuUtils.prepareActionsMenuConfig({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        menuSource,
        excludedActions: [],
        clickEvent,
        parentAction,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        opener: clickEvent.target,
        // TODO некоторым прикладникам надо будет разрешать показать меню, даже если нет ни одного экшна.
        allowConfigWithoutActions: false,
        menuType,
        menuLayoutContext: {
            item,
        },
    });
    if (menuConfig) {
        menuConfig.eventHandlers = {
            onResult(
                eventName: string,
                actionModel: Model,
                clickEvent: SyntheticEvent<MouseEvent>
            ): void {
                if (eventName === 'itemClick') {
                    if (actionModel && onActionClickHandler) {
                        onActionClickHandler(actionModel, item, itemContainer, clickEvent);
                    }
                }
                popupOpener.close();
            },
            onClose(): void {
                popupOpener.close();
            },
        };
        popupOpener.open(menuConfig);
    }
}

/**
 * Утилиты, позволяющие набрать конфигурацию для попап-меню с экшнами,
 * содержащую записи меню и конфиг с настройками позиционирования.
 */
export const ActionsMenuUtils = {
    prepareActionsMenuConfig,
    openItemActionsMenu,
};
