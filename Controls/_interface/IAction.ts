/**
 * @kaizen_zone 47124c7e-27dc-43e5-a39f-fcc418c550f0
 */
import * as React from 'react';
import { Model } from 'Types/entity';
import { TButtonStyle, IViewMode } from 'Controls/buttons';
import { IItemAction, TIconStyle, TKey, TVisibility } from 'Controls/interface';

/**
 * @description Допустимые значения для опции {@link itemActionsVisibility}.
 * @typedef {String} Controls/_itemActions/interface/IItemActions/TItemActionsVisibility
 * @variant onhover Опции записи отображаются при наведении на запись.
 * @variant visible Опции записи отображены изначально.
 * @variant delayed Опции записи отображаются при наведении на запись и удержании над ней курсора мыши в течение 500 мс.
 */
/*
 * @typedef {String} Controls/_itemActions/interface/IItemActions/TItemActionsVisibility
 * @variant onhover ItemActions will be Initialized and displayed right after mouseenter over Item
 * @variant visible ItemActions will be Initialized and displayed on control mount
 * @variant delayed ItemActions will be Initialized and displayed after mouseenter with 500ms delay over Item
 */
export type TItemActionsVisibility = TVisibility | 'delayed';

/**
 * @typedef {String} Controls/_interface/IAction/TItemActionViewMode
 * @description
 * Допустимые значения для опции {@link viewMode}
 * @variant link В виде гиперссылки с возможностью отображения иконки.
 * @variant filled В виде кнопки с круглой подложкой. Цвет подложки фиксирован и имеет значение "pale".
 */
export type TItemActionViewMode = Extract<IViewMode, 'link' | 'filled'>;

/**
 * @typedef {Function} Controls/_interface/IAction/TItemActionHandler
 * @description
 * Обработчик опции записи. См. {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/event/ пример обработчика}.
 * @param {Types/entity:Model} item Запись, для которой обрабатывается действие.
 */
export type TItemActionHandler = (item: Model) => void;

/**
 * @typedef {String} TItemActionShowType
 * @description
 * Позволяет настроить, какие кнопки операций над записью
 * будут показаны в панели быстрого доступа по ховеру, а какие - в доп.меню.
 * При адаптивном режиме кнопки операций выстраиваются в следующем порядке:
 *     TOOLBAR, MENU_TOOLBAR, MENU
 * Кнопки, которые не уместились в панель быстрого доступа, отрезаются и должны
 * отобразиться в дополнительном меню.
 * FIXED всегда дожен быть показан перед кнопкой меню, но не дальше своей позиции
 * по порядку. Для зафиксированной таким образом операций над записью iconStyle, указанный в её настройках всегда имеет наибольший приоритет.
 * @variant MENU показывать кнопку операции только в дополнительном меню
 * @variant MENU_TOOLBAR показывать кнопку операции в дополнительном меню и в панели быстрого доступа по ховеру
 * @variant TOOLBAR показывать кнопку операции только в панели быстрого доступа по ховеру.
 * @variant FIXED Показывать кнопку операции в фиксированном положении или перед кнопкой меню.
 */
export enum TItemActionShowType {
    // show only in Menu
    MENU,
    // show in Menu and Toolbar
    MENU_TOOLBAR,
    // show only in Toolbar
    TOOLBAR,
    // fixed position
    FIXED,
}

/**
 * @typedef {String} Controls/_interface/IAction/TActionDisplayMode
 * @description
 * Допустимые значения для опции {@link displayMode}.
 * Экспортируемый enum: Controls/itemActions:TActionDisplayMode
 * @variant TITLE показывать только заголовок
 * @variant ICON показывать только иконку
 * @variant BOTH показывать иконку и заголовок
 * @variant AUTO если есть иконка, то показывать иконку, иначе заголовок
 */
export enum TActionDisplayMode {
    TITLE = 'title',
    ICON = 'icon',
    BOTH = 'both',
    AUTO = 'auto',
}

/**
 * @typedef {String} Controls/_interface/IAction/TActionCaptionPosition
 * @variant right Справа от иконки опции записи.
 * @variant bottom Под иконкой опции записи.
 * @variant none Не будет отображаться.
 */
export type TActionCaptionPosition = 'right' | 'bottom' | 'none';

// Возможно, в будущем стоит расширить actionsPosition до outside/custom/topRight/bottomRight
/**
 * @typedef {String} Controls/_interface/IAction/TItemActionsPosition
 * @variant inside Внутри элемента.
 * @variant outside Под элементом.
 * @variant custom Произвольная позиция отображения. Задаётся через шаблон {@link Controls/interface/IItemTemplate itemTemplate}.
 */
export type TItemActionsPosition = 'inside' | 'outside' | 'custom';

/**
 * Размер иконок опций записи
 * @typedef {String} Controls/_interface/IAction/TItemActionsSize
 * @variant s Маленькая.
 * @variant m Средняя.
 */
export type TItemActionsSize = 's' | 'm';

/**
 * Размер иконок опций записи
 * @typedef {String} Controls/_interface/IAction/TSwipeItemActionsSize
 * @variant m Средняя.
 * @variant l Большая.
 */
export type TSwipeItemActionsSize = 'l' | 'm';

/**
 * Видимость кнопки "Ещё" в свайпе
 * @typedef {String} Controls/_interface/IAction/TMenuButtonVisibility
 * @variant visible - кнопка видима в любом случае
 * @variant adaptive - Расчёт происходит от количесива элементов в свайпе
 */
export type TMenuButtonVisibility = 'visible' | 'adaptive';

/**
 * Интерфейс {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ опций записи}.
 * @remark
 * Опции записи могут быть использованы в следующих вариантах:
 *
 * 1. Панель опций записи, отображаемая в desktop браузерах.
 * 2. Панель опций записи, появляющаяся при свайпе по записи влево.
 * 3. Всплывающее меню, появляющееся при нажатии на кнопку дополнительных опций записи.
 * 4. Всплывающее (контекстное) меню, появляющееся при нажатии правой кнопкой мыши.
 *
 * {@link http://axure.tensor.ru/StandardsV8/%D0%BE%D0%BF%D1%86%D0%B8%D0%B8_%D0%B7%D0%B0%D0%BF%D0%B8%D1%81%D0%B8.html Спецификация Axure}
 * @public
 */
export interface IAction {
    /**
     * @cfg {String|Number} Идентификатор {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ опции записи}.
     * @remark
     * Подробнее об использовании свойства читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/basic/ здесь}.
     * @demo Controls-demo/list_new/ItemActions/Base/Index
     */
    /*
     * @name Controls/_interface/IAction#id
     * @cfg {String|Number} Identifier of the action.
     */
    id: string | number;

    /**
     * @cfg {String} Название {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ опции записи}.
     * @remark
     * Подробнее об использовании свойства читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/basic/ здесь}.
     * @demo Controls-demo/list_new/ItemActions/Base/Index
     */
    /*
     * @name Controls/_interface/IAction#title
     * @cfg {String} Action name.
     */
    title?: string;

    /**
     * @cfg {String} Имя иконки или путь SVG-иконки для {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ опции записи}.
     * @demo Controls-demo/list_new/ItemActions/Base/Index
     * @see iconStyle
     */
    /*
     * @name Controls/_interface/IAction#icon
     * @cfg {String} Action's icon.
     */
    icon?: string;

    /**
     * @default MENU
     * @cfg {Controls/_interface/IAction/TItemActionShowType.typedef} Определяет, где будет отображаться {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ опция записи}.
     * @remark
     * Подробнее об использовании свойства читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/show-type/ здесь}.
     */
    /*
     * @name Controls/_interface/IAction#showType
     * @default MENU
     * @cfg {TItemActionShowType} Determines where item is displayed.
     */
    showType?: TItemActionShowType;

    /**
     * @cfg {Controls/buttons/TButtonStyle.typedef} Стиль кнопки {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ операции}.
     * @remark
     * Задаёт цвет кнопки операции над записью. когда {@link Controls/_interface/IAction#viewMode режим отображения} имеет значение filled.
     * Не влияет на {@link Controls/_interface/IAction#iconStyle стиль иконки внутри кнопки}.
     * В следующем примере кнопка forward будет показана в виде кнопки с круглой подложкой цвета success
     * <pre class="brush: js">
     * // JavaScript
     * [
     *  {
     *      id: 'forward',
     *      icon: 'icon-DayForward',
     *      title: 'Старт',
     *      showType: TItemActionShowType.MENU_TOOLBAR,
     *      viewMode: 'filled',
     *      style: 'success',
     *      iconStyle: 'contrast'
     *  }
     * ]
     * </pre>
     * @see viewMode
     * @see iconStyle
     */
    style?: TButtonStyle;

    /**
     * @cfg {Controls/interface/TIconStyle.typedef} Стиль иконки {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ операции}. Задаёт цвет иконки внутри кнопки операции над записью.
     * @remark
     * Каждому значению свойства соответствует стиль, который определяется {@link /doc/platform/developmentapl/interface-development/themes/ темой оформления} приложения.
     * * Опция может быть проигнорирована, если из контрола, в который встроены операции над запись в шаблон операций была передана опция iconStyle,
     *   которая имеет больший приоритет. При этом, опция не игнорируется, если у операции над записью установить {@link Controls/_interface/IAction#showType тип отображения} в значение {@link Controls/itemActions/IItemAction/TItemActionShowType.typedef} TItemActionShowType}.FIXED.
     * * Опция может быть проигнорирована в меню, когда {@link Controls/_interface/IAction#viewMode режим отображения} имеет значение filled. В этом случае в меню всегда ставится стиль иконки по умолчанию (secondary).
     * @example
     * В следующем примере кнопка delete будет показана с красной иконкой в меню и по ховеру, если в шаблон не передан iconStyle
     * <pre class="brush: js">
     * // JavaScript
     * [
     *  {
     *      id: 'delete',
     *      icon: 'icon-Erase',
     *      iconStyle: 'danger'
     *  }
     * ]
     * </pre>
     * @example
     * В следующем примере кнопка delete будет показана с красной иконкой в меню и по ховеру, даже если в шаблон передан iconStyle
     * <pre class="brush: js">
     * // JavaScript
     * [
     *  {
     *      id: 'delete',
     *      icon: 'icon-Erase',
     *      iconStyle: 'danger',
     *      showType: TItemActionShowType.FIXED
     *  }
     * ]
     * </pre>
     * @example
     * В следующем примере кнопка forward будет показана в виде кнопки с круглой подложкой. Цвет иконки в меню будет принудительно установлен в secondary.
     * <pre class="brush: js">
     * // JavaScript
     * [
     *  {
     *      id: 'forward',
     *      icon: 'icon-DayForward',
     *      title: 'Старт',
     *      showType: TItemActionShowType.MENU_TOOLBAR,
     *      viewMode: 'filled',
     *      style: 'success',
     *      iconStyle: 'contrast'
     *  }
     * ]
     * </pre>
     * @default secondary
     * @see icon
     * @see showType
     * @see viewMode
     * @see style
     */
    iconStyle?: TIconStyle;

    /**
     * @cfg {Controls/_interface/IAction/TItemActionsSize.typedef} Размер иконки.
     * @variant s малый (16px)
     * @variant m средний (24px)
     * @default m
     * @remark
     * * Размер иконок по умолчанию может зависеть от внешних условий и задаваться контролом, в который встраиваются операции над записью.
     *   Актуальную информацию о размере иконок по умолчанию необходимо уточнять в стандарте по отдельно взятому контролу.
     * * Размер l намеренно не поддерживается. Стандартный контейнер операций по ховеру не может вместить по высоте иконки размера l.
     * * При использовании круглых кнопок (viewMode="functionalbutton") в указанный размер умещается вся кнопка, а не только иконка на ней,
     *   Это сделано для того, чтобы края круглых кнопок не обрезались при помещении в стандартный контейнер операций по ховеру.
     * @see viewMode
     */
    iconSize?: TItemActionsSize;

    /**
     * @cfg {Controls/_interface/IAction/TItemActionViewMode.typedef} Режим отображения кнопки операции над записью.
     * @variant link В виде гиперссылки с возможностью отображения иконки.
     * @variant filled В виде кнопки с круглой подложкой.
     * @default link
     * @example
     * В следующем примере кнопка forward будет показана в виде кнопки с круглой подложкой.
     * <pre class="brush: js">
     * // JavaScript
     * [
     *  {
     *      id: 'forward',
     *      icon: 'icon-DayForward',
     *      title: 'Старт',
     *      showType: TItemActionShowType.MENU_TOOLBAR,
     *      viewMode: 'filled',
     *      style: 'success',
     *      iconStyle: 'contrast'
     *  }
     * ]
     * </pre>
     */
    viewMode?: TItemActionViewMode;

    /**
     * @cfg {Controls/_interface/IAction/TItemActionHandler.typedef} Обработчик клика по {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ опции записи}.
     * @remark
     * Подробнее об использовании свойства читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/event/#handler здесь}.
     * @demo Controls-demo/list_new/ItemActions/ItemActionClickHandler/Index
     */
    /*
     * @name Controls/_interface/IAction#handler
     * @cfg {TItemActionHandler} item action handler callback
     */
    handler?: TItemActionHandler;

    /**
     * @name Controls/_interface/IAction#parent@
     * @cfg {Boolean} Поле, описывающее тип узла (список, узел, скрытый узел).
     * @remark
     * Подробнее о поддержке иерархии в опциях записи читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/show-type/#hierarchy-support здесь}.
     * Подробнее о различиях между типами узлов можно прочитать {@link /doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy здесь}.
     */
    /*
     * @name Controls/_interface/IAction#parent@
     * @cfg {Boolean} Field that describes the type of the node (list, node, hidden node).
     */
    'parent@'?: boolean | null;

    /**
     * @cfg {Controls/_interface/IAction/TActionDisplayMode.typedef} Режим отображения {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ опции записи}.
     */
    /*
     * @name Controls/_interface/IAction#displayMode
     * @cfg {TActionDisplayMode} item action display mode
     */
    displayMode?: TActionDisplayMode;

    /**
     * @cfg {String} Текст всплывающей подсказки, отображаемой при наведении на {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ опцию записи}.
     */
    /*
     * @name Controls/_interface/IAction#tooltip
     * @cfg {String} tooltip showing on mouse hover
     */
    tooltip?: string;

    /**
     * @cfg {String|Number} Идентификатор родительской {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ опции записи}.
     * @remark
     * Подробнее о поддержке иерархии в опциях записи читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/show-type/#hierarchy-support здесь}.
     */
    /*
     * @name Controls/_interface/IAction#parent
     * @cfg {String|Number} Key of the action's parent.
     */
    parent?: TKey;

    /*
     * Путь до конфигурации исполняемого действия с записью. Если задано, то выполняется в приоритете. Событие onActionClick и handler() не будут вызываться.
     * @name Controls/_interface/IAction#actionName
     * @cfg {Object}
     */
    actionName?: string;

    /*
     * Имя команды, выполняемой при клике на кнопку действия. Список стандартных команд вы можете посмотреть в библиотеке {@link Controls/listCommands}.
     * Если задано, то передаётся в конфигурацию {@link actionName исполняемого действия}.
     * @name Controls/_interface/IAction#commandName
     * @cfg {String}
     */
    commandName?: string;

    /*
     * Опции команды, выполняемой при клике на кнопку действия.
     * Если задано, то передаётся в конфигурацию {@link actionName исполняемого действия}.
     * @name Controls/_interface/IAction#commandOptions
     * @cfg {Object}
     */
    commandOptions?: object;
    viewCommandName?: string;
    viewCommandOptions?: object;
}

/**
 * @typedef {Function} Controls/_interface/IAction/TItemActionVisibilityCallback
 * @description
 * Функция обратного вызова для определения видимости {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ опций записи}.
 * Чтобы опция записи отображалась, из функции следует вернуть true.
 * @param {IItemAction} action Объект операция для которой вычисляется возможность отображения.
 * @param {Types/entity:Model} item Запись, для которой вычисляется видимость операций.
 * @param {Boolean} isEditing - Флаг, указывающий редактируется ли запись в данный момент.
 */
export type TItemActionVisibilityCallback = (
    action: IAction,
    item: Model,
    isEditing: boolean
) => boolean;

/**
 * @typedef {Function} Controls/_interface/IAction/TEditArrowVisibilityCallback
 * @description
 * Функция обратного вызова для определения видимости кнопки редактирования.
 * @param {Types/entity:Model} item запись, для которой проверяется видимость
 */
export type TEditArrowVisibilityCallback = (item: Model) => boolean;

/**
 * @typedef {Function} Controls/_interface/IAction/TItemActionClickHandler
 * @description
 * Обработчик события клика по {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ опции записи}.
 * @param {IItemAction} action Объект с конфигурацией опции записи, по которой выполнили клик.
 * @param {Types/entity:Model} item Экземпляр записи, для которой была отображена опция записи.
 * @param {HTMLElement} itemContainer Контейнер записи, по которой был выполнен клик.
 * @remark
 * Подробнее о работе с событиями опций записи читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/event/ здесь}.
 */
export type TItemActionClickHandler<TItem extends Model = Model> = (
    action: IItemAction,
    item: TItem,
    itemContainer: HTMLElement
) => void;
