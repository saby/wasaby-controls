import { View, showType } from 'Controls/toolbars';
import { Model, Record } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { PrefetchProxy, Memory } from 'Types/source';

describe('Controls/_toolbar/View', () => {
    let toolbar = null;
    const defaultItems = [
        {
            id: '1',
            title: 'Запись 1',
            parent: null,
            '@parent': null,
        },
        {
            id: '2',
            title: 'Запись 2',
            parent: null,
            '@parent': true,
            icon: 'icon-Ezy',
            iconStyle: 'super',
        },
        {
            id: '3',
            title: 'Запись 3',
            icon: 'icon-medium icon-Doge icon-primary',
            parent: null,
            '@parent': null,
            showType: showType.TOOLBAR,
        },
        {
            id: '4',
            title: 'Запись 4',
            buttonViewMode: 'link',
            parent: '2',
            '@parent': null,
            showType: showType.MENU,
        },
        {
            id: '5',
            title: 'Запись 4',
            buttonViewMode: 'link',
        },
    ];
    const records = new RecordSet({
        rawData: defaultItems,
        keyProperty: 'id',
    });
    const config = {
        items: records,
        parentProperty: 'parent',
        nodeProperty: '@parent',
    };
    let itemWithMenu = new Model({
        rawData: defaultItems[1],
    });
    const itemWithOutMenu = new Model({
        rawData: defaultItems[5],
    });
    describe('_isShowToolbar', function () {
        toolbar = new View(config);
        toolbar.componentDidMount();
        it('Test1', function () {
            const item = new Record({
                rawData: {
                    parent: null,
                    showType: showType.TOOLBAR,
                },
            });
            expect(toolbar._isShowToolbar(item, toolbar._parentProperty)).toBe(
                true
            );
        });
        it('Test2', function () {
            const item = new Record({
                rawData: {
                    parent: 0,
                    showType: showType.TOOLBAR,
                },
            });
            expect(toolbar._isShowToolbar(item, toolbar._parentProperty)).toBe(
                false
            );
        });
        it('Test3', function () {
            const item = new Record({
                rawData: {
                    parent: null,
                    showType: showType.MENU_TOOLBAR,
                },
            });
            expect(toolbar._isShowToolbar(item, toolbar._parentProperty)).toBe(
                true
            );
        });
        it('Test4', function () {
            const item = new Record({
                rawData: {
                    parent: 0,
                    showType: showType.MENU_TOOLBAR,
                },
            });
            expect(toolbar._isShowToolbar(item, toolbar._parentProperty)).toBe(
                true
            );
        });
        it('Test5', function () {
            const item = new Record({
                rawData: {
                    parent: null,
                    showType: showType.MENU,
                },
            });
            expect(toolbar._isShowToolbar(item, toolbar._parentProperty)).toBe(
                false
            );
        });
        it('Test6', function () {
            const item = new Record({
                rawData: {
                    parent: 0,
                    showType: showType.MENU,
                },
            });
            expect(toolbar._isShowToolbar(item, toolbar._parentProperty)).toBe(
                false
            );
        });
        toolbar = null;
    });

    describe('publicMethod', function () {
        toolbar = new View(config);
        toolbar.componentDidMount();
        it('click toolbar item', function () {
            let isNotify = false;
            let eventType = null;
            let nativeEvent = null;
            let itemId = null;
            toolbar.props.onItemclick = (e, data) => {
                eventType = e.type;
                nativeEvent = e.nativeEvent;
                itemId = data.id;
                isNotify = true;
            };
            toolbar._itemClickHandler(
                {
                    stopPropagation: jest.fn(),
                    nativeEvent: 'nativeEvent',
                    type: 'itemClick',
                },
                {
                    id: 'myTestItem',
                    get: jest.fn(),
                    handler: jest.fn(),
                }
            );
            expect(eventType).toEqual('itemClick');
            expect(nativeEvent).toEqual('nativeEvent');
            expect(itemId).toEqual('myTestItem');
            expect(isNotify).toEqual(true);
            toolbar = null;
        });
        it('click item with menu', async function () {
            let isNotify = false;
            let eventString = '';
            let isHeadConfigCorrect = false;
            const standart = {
                icon: 'icon-Ezy',
                caption: 'Запись 2',
                iconStyle: 'super',
                iconSize: 'm',
            };
            itemWithMenu = new Model({
                rawData: {
                    id: '2',
                    title: 'Запись 2',
                    parent: null,
                    '@parent': true,
                    icon: 'icon-Ezy',
                    iconStyle: 'super',
                    iconSize: 'm',
                },
            });
            toolbar = new View({});
            const itemConfig = toolbar._getMenuConfigByItem.call(
                toolbar,
                itemWithMenu
            );
            if (
                standart.caption ===
                    itemConfig.templateOptions.headConfig.caption &&
                standart.icon === itemConfig.templateOptions.headConfig.icon &&
                standart.iconStyle ===
                    itemConfig.templateOptions.headConfig.iconStyle &&
                standart.iconSize ===
                    itemConfig.templateOptions.headConfig.iconSize
            ) {
                isHeadConfigCorrect = true;
            }
            expect(isHeadConfigCorrect).toBe(true);
            toolbar.props.onItemclick = (e) => {
                eventString += e.type;
                isNotify = true;
            };
            toolbar._sticky = {
                open: () => {
                    return 0;
                },
            };
            toolbar._itemClickHandler(
                {
                    stopPropagation: jest.fn(),
                    type: 'itemClick',
                },
                itemWithMenu
            );
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve('');
                });
            });
            expect(eventString).toEqual('itemClick');
            expect(isNotify).toEqual(true);
            toolbar = null;
        });
        it('menu item click', () => {
            toolbar = new View({});
            toolbar._nodeProperty = '@parent';
            toolbar.props.onItemclick = (e) => {
                expect(e).toEqual('itemClick');
            };
            toolbar.closeMenu = jest.fn();
            toolbar._resultHandler({
                action: 'itemClick',
                event: {
                    name: 'event',
                    stopPropagation: jest.fn(),
                },
                data: [itemWithMenu],
            });
            toolbar = null;
        });
        it('menu not closed if item has child', function () {
            toolbar = new View({});
            let isMenuClosed = false;
            toolbar._nodeProperty = '@parent';
            toolbar.closeMenu = function () {
                isMenuClosed = true;
            };
            expect(isMenuClosed).toEqual(false);
            toolbar = null;
        });
        it('item popup config generation', () => {
            const testItem = new Model({
                rawData: {
                    buttonViewMode: 'buttonViewMode',
                    popupClassName: 'popupClassName',
                    keyProperty: 'itemKeyProperty',
                    showHeader: true,
                    icon: 'icon icon-size',
                    title: 'title',
                    iconStyle: 'iconStyle',
                },
            });
            const testSelf = {
                props: {
                    groupTemplate: 'groupTemplate',
                    groupingKeyCallback: 'groupingKeyCallback',
                    size: 'size',
                    theme: 'default',
                    keyProperty: 'keyProperty',
                    itemTemplateProperty: 'myTemplate',
                    iconSize: 'm',
                    nodeProperty: '@parent',
                    parentProperty: 'parent',
                    source: '_options.source',
                },
                _source: 'items',
                _items: { getIndexByValue: jest.fn() },
                _getSourceForMenu: () => {
                    return Promise.resolve(testSelf._source);
                },
                _getMenuOptions: () => {
                    return '';
                },
                _getMenuTemplateOptions: () => {
                    return toolbar._getMenuTemplateOptions.call(testSelf);
                },
            };
            const expectedConfig = {
                opener: testSelf,
                className:
                    'controls-Toolbar__popup__icon-m popupClassName controls_popupTemplate_theme-default controls_dropdownPopup_theme-default',
                templateOptions: {
                    groupTemplate: 'groupTemplate',
                    groupProperty: undefined,
                    groupingKeyCallback: 'groupingKeyCallback',
                    keyProperty: 'keyProperty',
                    parentProperty: 'parent',
                    nodeProperty: '@parent',
                    iconSize: 'm',
                    itemTemplateProperty: 'myTemplate',
                    showHeader: true,
                    closeButtonVisibility: true,
                    headConfig: {
                        icon: 'icon icon-size',
                        caption: 'title',
                        iconSize: undefined,
                        iconStyle: 'iconStyle',
                    },
                },
                targetPoint: {
                    vertical: 'top',
                    horizontal: 'left',
                },
                direction: {
                    horizontal: 'right',
                },
            };
            toolbar = new View({});
            expect(
                JSON.stringify(
                    toolbar._getMenuConfigByItem.call(testSelf, testItem)
                )
            ).toEqual(JSON.stringify(expectedConfig));
            toolbar = null;

            testSelf._items = {
                getIndexByValue: () => {
                    return -1;
                },
            }; // для элемента не найдены записи в списке
            toolbar = new View({});
            expect(
                JSON.stringify(
                    toolbar._getMenuConfigByItem.call(testSelf, testItem)
                )
            ).toEqual(JSON.stringify(expectedConfig));
            toolbar = null;

            testItem.set('showHeader', false);
            expectedConfig.templateOptions.showHeader = false;
            expectedConfig.templateOptions.closeButtonVisibility = true;
            toolbar = new View({});
            expect(
                JSON.stringify(
                    toolbar._getMenuConfigByItem.call(testSelf, testItem)
                )
            ).toEqual(JSON.stringify(expectedConfig));
            toolbar = null;
        });
        it('get button template options by item', function () {
            const item = new Record({
                rawData: {
                    id: '0',
                    icon: 'icon-Linked',
                    fontColorStyle: 'secondary',
                    viewMode: 'ghost',
                    iconStyle: 'secondary',
                    contrastBackground: true,
                    title: 'Связанные документы',
                    '@parent': false,
                    parent: null,
                    readOnly: true,
                },
            });
            const modifyItem = {
                _buttonStyle: 'readonly',
                _translucent: false,
                _caption: undefined,
                _captionPosition: 'end',
                _contrastBackground: true,
                _fontColorStyle: 'secondary',
                _fontSize: 'm',
                _hasIcon: true,
                _height: 'l',
                _hoverIcon: true,
                _icon: 'icon-Linked',
                _iconSize: 'm',
                _iconStyle: 'readonly',
                _isSVGIcon: false,
                _stringCaption: false,
                _viewMode: 'ghost',
                readOnly: true,
            };
            toolbar = new View({});
            expect(toolbar._getSimpleButtonTemplateOptionsByItem(item)).toEqual(
                modifyItem
            );
            toolbar = null;
        });
        it('get filled template options by item', function () {
            const item = new Record({
                rawData: {
                    id: '0',
                    icon: 'icon-RoundPlus',
                    fontColorStyle: 'secondary',
                    viewMode: 'filled',
                    iconStyle: 'contrast',
                    title: 'Добавить',
                    '@parent': false,
                    parent: null,
                },
            });
            toolbar = new View({});
            const modifyItem =
                toolbar._getSimpleButtonTemplateOptionsByItem(item);
            expect(modifyItem._iconSize).toBe('s');
            expect(modifyItem._height).toBe('default');
            expect(modifyItem._icon).toBe('icon-RoundPlus');
            toolbar = null;
        });
        it('menu popup config generation', function () {
            const itemsForMenu = [
                {
                    id: '1',
                    icon: 'myIcon',
                },
                {
                    id: '2',
                    iconStyle: 'secondary',
                },
            ];

            const recordForMenu = new RecordSet({
                rawData: itemsForMenu,
            });
            toolbar = new View({});
            const testSelf = {
                props: {
                    theme: 'default',
                    size: 'size',
                    additionalProperty: 'additional',
                    popupClassName: 'popupClassName',
                    itemTemplateProperty: 'itp',
                    groupTemplate: 'groupTemplate',
                    groupingKeyCallback: 'groupingKeyCallback',
                    menuHoverBackgroundStyle: 'secondary',
                    menuBackgroundStyle: 'secondary',
                    iconSize: 'm',
                    iconStyle: 'secondary',
                    keyProperty: 'id',
                    nodeProperty: '@parent',
                    parentProperty: 'parent',
                    direction: 'horizontal',
                },
                _menuSource: recordForMenu,
                _getMenuOptions: () => {
                    return toolbar._getMenuOptions(testSelf);
                },
                _getMenuTemplateOptions: () => {
                    return toolbar._getMenuTemplateOptions.call(testSelf);
                },
            };
            const templateOptions = {
                iconSize: 'm',
                iconStyle: 'secondary',
                keyProperty: 'id',
                nodeProperty: '@parent',
                parentProperty: 'parent',
                source: recordForMenu,
                additionalProperty: 'additional',
                hoverBackgroundStyle: 'secondary',
                backgroundStyle: 'secondary',
                itemTemplateProperty: 'itp',
                groupTemplate: 'groupTemplate',
                groupingKeyCallback: 'groupingKeyCallback',
                groupProperty: undefined,
                footerContentTemplate: undefined,
                itemActions: undefined,
                itemActionVisibilityCallback: undefined,
                dataLoadCallback: undefined,
                closeButtonVisibility: true,
                dropdownClassName: 'controls-Toolbar-horizontal__dropdown',
                draggable: undefined,
            };
            const config1 = toolbar._getMenuConfig.call(testSelf);
            expect(config1.templateOptions).toEqual(templateOptions);
            toolbar = null;
        });
        it('toolbar closed by his parent', () => {
            toolbar = new View({});
            let isMenuClosed = false;
            toolbar._nodeProperty = '@parent';
            toolbar._sticky = {
                close() {
                    isMenuClosed = true;
                },
            };
            toolbar._sticky.isOpened = () => {
                return true;
            };
            toolbar.props.onItemclick = jest.fn();
            toolbar._resultHandler('itemClick', itemWithOutMenu, {});
            expect(isMenuClosed).toEqual(true);

            isMenuClosed = false;
            toolbar._resultHandler('itemClick', itemWithOutMenu, {
                result: false,
            });
            expect(isMenuClosed).toEqual(false);

            isMenuClosed = false;
            const item = {
                id: '7',
                title: 'Запись 7',
                buttonViewMode: 'outlined',
                parent: null,
                '@parent': true,
                closeMenuOnClick: false,
                showType: 0,
            };

            let itemCloseMenu = new Model({
                rawData: item,
            });
            toolbar._resultHandler('itemClick', itemCloseMenu, {
                result: false,
            });
            expect(isMenuClosed).toEqual(false);

            isMenuClosed = false;
            itemCloseMenu = new Model({
                rawData: item,
            });
            toolbar._resultHandler('itemClick', itemCloseMenu, {
                result: true,
            });
            expect(isMenuClosed).toEqual(true);
            toolbar = null;
        });
        it('_setMenuSource', async () => {
            toolbar = new View(config);
            toolbar.componentDidMount();
            toolbar.props = config;
            toolbar._setMenuSource();
            expect(toolbar._menuSource instanceof PrefetchProxy).toBe(true);
            expect(toolbar._menuSource._$target instanceof Memory).toBe(true);
            expect(toolbar._menuSource._$data.query instanceof RecordSet).toBe(
                true
            );
            toolbar = null;
        });
        it('_setMenuSource without source', async () => {
            const cfg = {
                items: new RecordSet({
                    rawData: defaultItems,
                }),
                parentProperty: 'parent',
                nodeProperty: '@parent',
            };
            toolbar = new View(cfg);
            toolbar.componentDidMount();
            toolbar.props = cfg;
            toolbar._setMenuSource();
            expect(toolbar._menuSource instanceof PrefetchProxy).toBe(true);
            expect(toolbar._menuSource._$target instanceof Memory).toBe(true);
            expect(toolbar._menuSource._$data.query instanceof RecordSet).toBe(
                true
            );
            toolbar = null;
        });
        it('_getMenuOptions - fittingMode', () => {
            toolbar = new View(config);
            toolbar.componentDidMount();
            const fittingMode = {
                vertical: 'adaptive',
                horizontal: 'overflow',
            };
            expect(toolbar._getMenuOptions().fittingMode).toEqual(fittingMode);
        });
        it('update menuItems when items/source changed', () => {
            const props = {
                items: records,
            };
            const newProps = {
                items: new RecordSet({
                    rawData: [
                        {
                            id: '1',
                            title: 'Запись 1',
                            parent: null,
                            '@parent': null,
                        },
                        {
                            id: '2',
                            title: 'Запись 2',
                            parent: null,
                            '@parent': true,
                            icon: 'icon-Ezy',
                            iconStyle: 'super',
                        },
                        {
                            id: '3',
                            title: 'Запись 3',
                            icon: 'icon-medium icon-Doge icon-primary',
                            parent: null,
                            '@parent': null,
                            showType: 2,
                        },
                    ],
                }),
            };
            const event = {
                nativeEvent: {
                    button: 0,
                },
            };
            let isMenuItemsChanged = false;
            toolbar = new View(props);
            toolbar._openMenu = jest.fn();
            toolbar._setMenuSource = () => {
                isMenuItemsChanged = true;
                return {
                    then(func: Function) {
                        func();
                    },
                };
            };
            toolbar.componentDidMount();
            toolbar._mouseDownHandler(event);
            expect(isMenuItemsChanged).toBe(true);
            toolbar.props = { ...newProps };
            toolbar.componentDidUpdate(props);
            isMenuItemsChanged = false;
            expect(toolbar._isLoadMenuItems).toBe(false);
            toolbar._mouseDownHandler(event);
            expect(isMenuItemsChanged).toBe(true);
            expect(toolbar._isLoadMenuItems).toBe(true);
        });
    });
});
