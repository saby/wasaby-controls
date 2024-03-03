/**
 * @kaizen_zone 6ccf0789-a238-4656-86f6-d0eff65e12f9
 */

interface IComponentConfig {
    /**
     * @cfg {String} Тип компонента, например, 'button' или 'list'.
     */
    type: string;

    /**
     * @cfg {String} Корневой css-класс контрола.
     */
    root: string;

    /**
     * @cfg {Boolean} Необходимость использования текста внутри контрола для привязки подсказки.
     */
    bindText?: boolean;

    /**
     * @cfg {Boolean} Необходимость использования контента внутри контрола для привязки подсказки.
     */
    bindContent?: boolean;
}

export type TComponentsCssClassMap = IComponentConfig[];

// Префикс, который включают в себя targetId элементов, находящихся внутри произвольных всплывающих окон.
export const POPUP_TYPE_PREFIX = 'popup';

export const POPUP_CLASS = 'controls-Popup';
export const POPUP_TEMPLATE_CLASS = 'controls-Popup__template';

export const STACK_TEMPLATE_CAPTION_TEXT_CLASS = 'controls-StackTemplate__caption_text';

// Список классов элементов внутри popup-окон, для которых запрещена разметка для подсказок в рамках текущей сущности.
export const EXCEPTION_POPUP_LIST = [
    'controls-Stack__content-wrapper',
    'controls-ConfirmationTemplate',
];

export const ITEM_ACTIONS_CONTAINER_CLASS = 'controls-itemActionsV';

/*
 * Мапа корневых классов контролов и их обозначений в идентификаторе таргета подсказки, хранящемся в модели подсказки.
 * Испльзуется в маршрутах подсказок.
 */
export const COMPONENTS_CSS_CLASS_MAP: TComponentsCssClassMap = [
    {
        type: 'button',
        root: 'controls-BaseButton',
        bindText: true,
    },
    {
        type: 'doubleButton',
        root: 'extControls-doubleButton',
        bindText: true,
    },
    {
        type: 'menuButton',
        root: 'controls-MenuButton',
        bindText: true,
    },
    {
        type: 'dropdown',
        root: 'controls-Dropdown',
    },
    {
        type: 'comboBox',
        root: 'controls-ComboBox',
    },
    {
        type: 'bigSeparator',
        root: 'controls-BigSeparator',
    },
    {
        type: 'toolbar',
        root: 'controls-Toolbar',
    },
    {
        type: 'switch',
        root: 'controls-Switch',
    },
    {
        type: 'groupRadio',
        root: 'controls-GroupRadio',
    },
    {
        type: 'checkbox',
        root: 'controls-Checkbox',
        bindText: true,
    },
    {
        type: 'checkboxGroup',
        root: 'controls-CheckboxGroup',
    },
    {
        type: 'tumbler',
        root: 'controls-Tumbler',
    },
    {
        type: 'chips',
        root: 'controls-ButtonGroup',
    },
    {
        type: 'inputNumber',
        root: 'controls-Number',
    },
    {
        type: 'inputText',
        root: 'controls-Text',
    },
    {
        type: 'inputArea',
        root: 'controls-Area',
    },
    {
        type: 'inputMask',
        root: 'controls-Mask',
    },
    {
        type: 'inputPhone',
        root: 'controls-Phone',
    },
    {
        type: 'inputSuggest',
        root: 'controls-SuggestV',
    },
    {
        type: 'inputTimeInterval',
        root: 'controls-TimeInterval',
    },
    {
        type: 'inputMoney',
        root: 'controls-Money',
    },
    {
        type: 'inputPassword',
        root: 'controls-Password',
    },
    {
        type: 'inputDate',
        root: 'controls-Input-DatePicker',
    },
    {
        type: 'inputDateRange',
        root: 'controls-Input-DateRange',
    },
    {
        type: 'textEditorViewer',
        root: 'TextEditor_Viewer__View',
    },
    {
        type: 'richEditorEditor',
        root: 'richEditor_Base_scrollingContainer',
    },
    {
        type: 'dateLinkView',
        root: 'controls-DateLinkView',
    },
    {
        type: 'monthSlider',
        root: 'controls-MonthSlider',
    },
    {
        type: 'search',
        root: 'controls-search',
    },
    {
        type: 'lookup',
        root: 'controls-Lookup',
    },
    {
        type: 'selectorButton',
        root: 'controls-Selectorbutton',
        bindContent: false,
    },
    {
        type: 'list',
        root: 'controls-ListViewV',
    },
    {
        type: 'grid',
        root: 'controls-Grid',
    },
    {
        type: 'tile',
        root: 'controls-TileView_new',
    },
    {
        type: 'layoutBrowser',
        root: 'layout-Browser',
    },
    {
        type: 'masterDetailMaster',
        root: 'controls-MasterDetail_master',
        bindText: true,
    },
    {
        type: 'masterDetailDetails',
        root: 'controls-MasterDetail_details',
    },
    {
        type: 'menu',
        root: 'controls-menu',
        bindText: true,
    },
    {
        type: 'menuRow',
        root: 'controls-Menu__row',
        bindText: true,
    },
    {
        type: 'highChartsLight',
        root: 'Graphs-HighChartsLight',
    },
    {
        type: 'calculator',
        root: 'Calculator-View',
    },
    {
        type: 'keyboard',
        root: 'Keyboard-View',
    },
    {
        type: 'filterView',
        root: 'controls-FilterView',
    },
    {
        type: 'popupDialogTemplate',
        root: 'controls-DialogTemplate',
    },
    {
        type: 'popupStickyTemplate',
        root: 'controls-StickyTemplate',
    },
    {
        type: 'popupMenu',
        root: 'controls-Menu__popup',
    },
    {
        type: 'popupTemplate',
        root: POPUP_TEMPLATE_CLASS,
    },
];

// Классы списочных элементов, для которых разрешена привязка подсказок к первому элементу списка.
export const FIRST_ITEM_BINDING_COMPONENTS = [
    'controls-ListViewV',
    'controls-Grid',
    'controls-TileView_new',
];
