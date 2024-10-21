/**
 * @kaizen_zone fd2f64a5-d515-49d2-8fef-3e6af047ff0a
 */
import rk = require('i18n!Controls');
import { Logger } from 'UI/Utils';
import { getIcon, isSVGIcon } from 'Controls/Utils/Icon';
import { IAction, TItemActionsSize } from 'Controls/interface';
import {
    DEFAULT_ACTION_SIZE,
    DEFAULT_BUTTON_STYLE,
    DEFAULT_ICON_STYLE,
    MENU_BUTTON_KEY,
    TActionDisplayMode,
    TItemActionShowType,
} from '../constants';
import { ActionsStyleUtils } from './ActionsStyleUtils';
import {
    IShownItemAction,
    IItemActionsObject,
} from 'Controls/_itemActions/interface/IItemActionsObject';

interface IFilterActionsToShowOnHoverParams {
    // Список операций над записью.
    itemActions: IAction[];
    /**
     * Функция обратного вызова для определения видимости опций записи.
     */
    itemActionVisibilityCallback?: (action: IAction) => boolean;
    /*
     * @cfg {Controls/_interface/IAction/TItemActionsSize.typedef}
     * Размер иконок операций над записью
     * Поддерживаемые варианты: 's' | 'm'
     * Значение по умолчанию задаётся стандартами контрола, использующего ItemActionsController
     */
    menuIconSize?: TItemActionsSize;
    // Принудительно добавляет кнопку меню
    forceAddMenuButton?: boolean;
    // Временная опция для реверсного вывода операций над записью
    // https://online.sbis.ru/opendoc.html?guid=76408b97-fc91-46dc-81b0-0f375d07ab99
    feature1183020440?: boolean;
    // Временная опция, чтобы не выводить меню опций записи, если нет выводимых опций, но задан футер
    // Для устранения опции требуется переход на настоящие actions и footer по задаче:
    // https://online.sbis.ru/opendoc.html?guid=dca1ba93-ffe6-4f68-9f05-9d266a0bc28f
    task1183329228?: boolean;
}

/**
 * Возвращает экшн для меню.
 */
function getMenuButton(
    iconSize?: TItemActionsSize,
    isSwipeActions: boolean = false
): IShownItemAction {
    return {
        id: MENU_BUTTON_KEY,
        icon: isSwipeActions ? 'icon-SwipeMenu' : 'icon-SettingsNew',
        style: DEFAULT_BUTTON_STYLE,
        iconStyle: DEFAULT_ICON_STYLE,
        title: rk('Ещё'),
        showType: TItemActionShowType.TOOLBAR,
        iconSize,
        isMenu: true,
    };
}

/**
 * Отфильтровывает те операции над записью, которые надо показать по ховеру
 */
function filterActionsToShowOnHover({
    itemActions,
    itemActionVisibilityCallback,
    menuIconSize = DEFAULT_ACTION_SIZE,
    forceAddMenuButton = false,
    feature1183020440 = false,
    task1183329228 = false,
}: IFilterActionsToShowOnHoverParams) {
    let actionsToShowOnHover: IAction[] = [];
    const actionsToShowInMenu: IAction[] = [];
    for (let i = 0; i < itemActions.length; i++) {
        // В любом случае не учитываем те операции над записью, в которых есть parent.
        // Для них видимость определяется при открытии соответствующего их parent меню.
        if (itemActions[i].parent) {
            continue;
        }
        const isMenuAction =
            !itemActions[i].showType || itemActions[i].showType === TItemActionShowType.MENU;
        // На этом этапе нам важно понимать только, что надо показывать кнопку меню с тремя точками,
        // Поэтому двух операций из меню тут будет достаточно, а остальные из тех, что показываются только в меню,
        // пропускаем. Их видимость определяется при открытии меню.
        if (isMenuAction && actionsToShowInMenu.length > 1) {
            continue;
        }
        const isVisible =
            !itemActionVisibilityCallback || itemActionVisibilityCallback(itemActions[i]);
        if (!isVisible) {
            continue;
        }
        // Если операция должна быть видима по колбеку и показывается в меню
        // или в меню и по ховеру, записываем её в массив записей меню.
        if (isMenuAction || itemActions[i].showType === TItemActionShowType.MENU_TOOLBAR) {
            actionsToShowInMenu.push(itemActions[i]);
        }
        // Любые другие операции записываем в список для отображения по ховеру
        if (!isMenuAction || itemActions[i].showType === TItemActionShowType.MENU_TOOLBAR) {
            actionsToShowOnHover.push(itemActions[i]);
        }
    }

    // Добавляем кнопку меню только если прикладник вернул
    // в ItemActionsVisibilityCallback true для MENU_BUTTON_KEY
    const menuItemAction = getMenuButton(menuIconSize, false);

    if (actionsToShowOnHover.length > 0) {
        // Если единственная видимая операция для показа в меню отсутствует в показанных по ховеру,
        // Или есть более одной видимой операции для показа в меню, или в конфигурации
        // меню указано, что надо показать подвал или шапку меню, то показываем кнопку с тремя точками.
        if (
            menuItemAction &&
            ((actionsToShowInMenu.length === 1 &&
                actionsToShowOnHover.indexOf(actionsToShowInMenu[0]) === -1) ||
                actionsToShowInMenu.length > 1 ||
                forceAddMenuButton)
        ) {
            actionsToShowOnHover.push(menuItemAction);
        }
        if (feature1183020440) {
            actionsToShowOnHover.reverse();
        }
    } else if (menuItemAction && actionsToShowInMenu.length > 1) {
        // Если записей в меню больше одной то точно показываем кнопку с тремя точками
        actionsToShowOnHover.push(menuItemAction);
    } else {
        // Тут кейс, когда actionsToShowOnHover пуст, а в actionsToShowInMenu.length <= 1
        actionsToShowOnHover = actionsToShowInMenu;
        // По умолчанию, если actionsToShowInMenu.length <= 1, нужно показывать
        // все кнопки на тулбаре, и не добавлять кнопку с тремя точками.
        // Но, если в конфигурации contextMenuConfig указано, что надо показать подвал или шапку меню,
        // нужно показывать кнопку даже тогда, когда вообще ни одной операции не было показано.
        // Некоторым это, наоборот, не нужно. Под опцией task1183329228 принудительный показ кнопки отключен.
        if (menuItemAction && !task1183329228 && forceAddMenuButton) {
            actionsToShowOnHover.push(menuItemAction);
        }
    }
    return actionsToShowOnHover;
}

/**
 * Возвращает размер иконок операций над записью по ховеру.
 * В приоритете размер, настроенный индивидуально для кнопки
 * Если он не задан, то берётся текущий размер из опций контроллера или размер по умолчанию.
 * @private
 */
function getHoverActionIconSize(
    action: IAction,
    defaultIconSize: TItemActionsSize = DEFAULT_ACTION_SIZE
): TItemActionsSize {
    let iconSize = action.iconSize || defaultIconSize;

    // Конвертируем размеры s и xs иконки, чтобы общий размер filled соответствовал itemActions.
    // m => s; s => xs
    if (action.viewMode === 'filled') {
        iconSize = iconSize === 's' ? 'xs' : 's';
    }
    return iconSize;
}

/**
 * Рассчитывает значение для флага hasIcon операции над записью
 * @param action
 * @private
 */
function needShowIcon(action: IAction): boolean {
    return !!action.icon && action.displayMode !== TActionDisplayMode.TITLE;
}

/**
 * Рассчитывает значение для значения caption операции над записью
 * @param action
 * @private
 */
function needShowTitle(action: IAction): boolean {
    return (
        !!action.title &&
        (action.displayMode === TActionDisplayMode.TITLE ||
            action.displayMode === TActionDisplayMode.BOTH ||
            ((action.displayMode === TActionDisplayMode.AUTO || !action.displayMode) &&
                !action.icon))
    );
}

/**
 * Возвращает значение для tooltip операции с записью
 * @param action
 * @private
 */
function getTooltip(action: IAction): string | undefined {
    return action.tooltip || action.title;
}

function cloneAction(action: IAction, options?: Partial<IShownItemAction>): IShownItemAction {
    return Object.assign(Object.create(Object.getPrototypeOf(action)), action, options);
}

/**
 * Настройка параметров отображения для кнопки, которая показывается
 * при наведении на запись или при свайпе и itemActionsPosition === 'outside'.
 * ItemAction  с этими опциями передаётся в шаблон без дальнейших изменений.
 * @param action
 * @param defaultIconSize
 */
function prepareHoverAction(
    action: IShownItemAction,
    defaultIconSize: TItemActionsSize = DEFAULT_ACTION_SIZE
): IShownItemAction {
    const hasIcon = needShowIcon(action);
    const shownAction: IShownItemAction = cloneAction(action, {
        hasIcon,
        viewMode: action.viewMode || 'link',
        style: ActionsStyleUtils.getButtonStyle(action),
        iconStyle: ActionsStyleUtils.getIconStyle(action),
        iconSize: getHoverActionIconSize(action, defaultIconSize),
        fontSize: 'm',
        icon: hasIcon ? getIcon(action.icon) : null,
        caption: needShowTitle(action) ? action.title : null,
        isSVGIcon: isSVGIcon(action.icon),
        tooltip: getTooltip(action),
    });

    if (
        shownAction.viewMode &&
        shownAction.viewMode !== 'link' &&
        shownAction.viewMode !== 'filled'
    ) {
        Logger.error(
            'Неподдерживаемый вид кнопки. Используйте viewMode, ' +
                'описанные в интерфейсе IItemAction',
            this
        );
    }

    // ItemActions настраиваются одним размером iconSize, а filled - двумя iconSize + inlineHeight.
    if (shownAction.viewMode === 'filled') {
        if (shownAction.iconSize === 'xs') {
            shownAction.inlineHeight = 'xs';
            shownAction.fontSize = '2xs';
        } else if (action.iconSize === 'l') {
            shownAction.inlineHeight = 'xl';
            shownAction.fontSize = 'l';
        } else {
            shownAction.inlineHeight = 'm';
        }
    }
    return shownAction;
}

/**
 * Обновляет параметры отображения операций с записью
 * @param actionsObject
 * @param defaultIconSize
 * @private
 */
function fixActionsDisplayOptions(
    actionsObject: IItemActionsObject,
    defaultIconSize?: TItemActionsSize
): IItemActionsObject {
    if (actionsObject.all && actionsObject.all.length) {
        actionsObject.all = actionsObject.all.map((action) => {
            return cloneAction(action, { tooltip: getTooltip(action) });
        });
    }
    if (actionsObject.showed && actionsObject.showed.length) {
        actionsObject.showed = actionsObject.showed.map((action: IShownItemAction) => {
            return prepareHoverAction(action, defaultIconSize);
        });
    }
    return actionsObject;
}

export const ActionsMapUtils = {
    filterActionsToShowOnHover,
    getMenuButton,
    prepareHoverAction,
    fixActionsDisplayOptions,
    cloneAction,
};
