/**
 * @kaizen_zone 5bf318b9-a50e-48ab-9648-97a640e41f94
 */
import { Control } from 'UI/Base';
import template = require('wml!Controls/_suggestPopup/List/List');
import clone = require('Core/core-clone');
import { EventUtils } from 'UI/Events';
import { constants } from 'Env/Env';
import { RecordSet } from 'Types/collection';
import 'css!Controls/suggestPopup';
import 'css!Controls/suggest';
import { NewSourceController } from 'Controls/dataSource';

const DIALOG_PAGE_SIZE = 25;

const _private = {
    checkContext(self, options) {
        if (options && options._suggestListOptions) {
            self._suggestListOptions = options._suggestListOptions;

            if (!self._layerName && self._suggestListOptions.layerName) {
                self._layerName = self._suggestListOptions.layerName
                    .split('_')
                    .pop();
            }

            if (self._suggestListOptions.dialogMode) {
                if (self._suggestListOptions.navigation) {
                    const navigation = clone(
                        self._suggestListOptions.navigation
                    );

                    /* to turn on infinityScroll */
                    navigation.view = 'infinity';
                    if (!navigation.viewConfig) {
                        navigation.viewConfig = {};
                    }

                    /* to show paging */
                    navigation.viewConfig.pagingMode = true;
                    navigation.sourceConfig.pageSize = DIALOG_PAGE_SIZE;
                    self._navigation = navigation;
                }
            } else {
                self._navigation = self._suggestListOptions.navigation;
                self._reverseList = self._suggestListOptions.reverseList;
            }
        }
    },

    isTabChanged(options, tabKey) {
        const currentTabSelectedKey = options.tabsSelectedKey;
        return currentTabSelectedKey !== tabKey;
    },

    getTabKeyFromContext(options) {
        const tabKey = options._suggestListOptions?.tabsSelectedKey;
        return tabKey !== undefined ? tabKey : null;
    },

    dispatchEvent(container, nativeEvent, customEvent) {
        customEvent.keyCode = nativeEvent.keyCode;
        container.dispatchEvent(customEvent);
    },

    // Список и input находят в разных контейнерах, поэтому мы просто проксируем нажатие клавиш up, down, enter с input'a
    // на контейнер списка, используя при этом API нативного Event'a. Будет переделано в 600 на HOC'и для горячих клавишь
    // https://online.sbis.ru/opendoc.html?guid=eb58d82c-014f-4608-8c61-b9127730a637
    getEvent(eventName): Event {
        let event;

        // ie does not support Event constructor
        if (typeof Event === 'function') {
            event = new Event(eventName, { bubbles: true });
        } else {
            event = document.createEvent('Event');
            event.initEvent(eventName, true, true);
        }
        return event;
    },
};

/**
 * Контрол-контейнер, который используется для работы <a href="/doc/platform/developmentapl/interface-development/controls/input-elements/input/suggest/">автодополнения</a> в поле ввода.
 * Он обеспечивает связь поля ввода и списка внутри выпадающего блока.
 * @remark
 *
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/input-elements/input/suggest/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_suggestPopup.less переменные тем оформления}
 * @example
 * <pre class="brush: js">
 * // JavaScript
 * define('myControl/SuggestList',
 *    [
 *       'UI/Base',
 *       'wml!myControl/SuggestList'
 *    ], function(Base, template) {
 *       return class MyControl extends Control<IControlOptions> {
 *          _template: template
 *       });
 *    }
 * );
 * </pre>
 *
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.suggestPopup:ListContainer>
 *    <Controls.list:View
 *       displayProperty="title"
 *       keyProperty="id"
 *       attr:class="demo-SuggestList"/>
 * </Controls.suggestPopup:ListContainer>
 * </pre>
 * @class Controls/suggestPopup:ListContainer
 * @extends UI/Base:Control
 * @public
 * @demo Controls-demo/LookupNew/Input/SuggestPopupOptions/Index
 */

/*
 * Container for list inside Suggest.
 * The detailed description and instructions on how to configure the control you can read <a href='/doc/platform/developmentapl/interface-development/controls/input-elements/input/suggest/'>here</a>.
 *
 * @class Controls/_suggestPopup/List
 * @extends UI/Base:Control
 * @author Герасимов Александр
 *
 * @public
 */

/**
 * @name Controls/suggestPopup:ListContainer#tabsOptions
 * @cfg {Controls/tabs:ITabsButtons} Опции для настройки вкладок в окне автодополнения.
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.suggestPopup:ListContainer
 *    tabsOptions="{{_tabsOptions}}"
 *    on:tabsSelectedKeyChanged="_tabChanged()">
 *    <Controls.list:View
 *        displayProperty="title"
 *        keyProperty="id"/>
 * </Controls.suggestPopup:ListContainer>
 * </pre>
 * <pre class="brush: js">
 * // JavaScript
 * import {Memory} from 'Types/source';
 * protected _beforeMount(): void {
 *    this._tabsOptions = {
 *       source: new Memory({
 *          keyProperty: 'id',
 *          data: [
 *             {id: 1, title: 'Контрагенты', align: 'left'},
 *             {id: 2, title: 'Компании', align: 'left'}
 *          ]
 *       }),
 *       keyProperty: 'id',
 *       displayProperty: 'title'
 *    };
 * }
 * </pre>
 */

/**
 * @event tabsSelectedKeyChanged Происходит при смене текущей активной вкладки.
 * @name Controls/suggestPopup:ListContainer#tabsSelectedKeyChanged
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Number|String} key Ключ выбранного элемента коллекции.
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.suggestPopup:ListContainer
 *    tabsOptions="{{_tabsOptions}}"
 *    on:tabsSelectedKeyChanged="_tabChanged()">
 *    <Controls.list:View
 *        displayProperty="title"
 *        keyProperty="id"
 *        itemTemplate="{{_itemTemplate}}"/>
 * </Controls.suggestPopup:ListContainer>
 * </pre>
 * <pre class="brush: js">
 * // JavaScript
 * protected _tabChanged(event, tabId): void {
 *    let itemTemplate;
 *    switch (tabId) {
 *       case 'Employees':
 *          itemTemplate = templateEmployees;
 *       case 'Company':
 *          itemTemplate = templateCompany;
 *    }
 *    this._itemTemplate = itemTemplate;
 * }
 * </pre>
 */

const List = Control.extend({
    _template: template,
    _notifyHandler: EventUtils.tmplNotify,
    _markedKey: null,
    _items: null,
    _layerName: null,
    _isSuggestListEmpty: false,
    _tabsChangedPromise: null,

    _beforeMount(options) {
        this._collectionChange = this._collectionChange.bind(this);
        this._itemsReadyCallback = this._itemsReadyCallback.bind(this);

        const currentReverseList = this._reverseList;
        _private.checkContext(this, options);

        if (this._reverseList !== currentReverseList) {
            if (this._reverseList) {
                this._suggestListOptions.suggestDirectionChangedCallback('up');
            } else {
                this._suggestListOptions.suggestDirectionChangedCallback(
                    'down'
                );
            }
        }

        if (options.tabsOptions) {
            this._tabsItems = options.tabsOptions.items;
        } else if (options._dataOptionsValue) {
            const tabs = [];
            this._sortDataByOrder(
                options._suggestListOptions.loadResult
            ).forEach((listOption) => {
                tabs.push({
                    id: listOption.id,
                    caption: listOption.caption,
                    align: 'left',
                });
            });

            this._tabsItems = new RecordSet({
                rawData: tabs,
            });
        }

        const items = this._getSourceController(options)?.getItems();
        if (items) {
            this._itemsReadyCallback(items);
        }

        this._setSourceController(options);
    },

    _beforeUpdate(newOptions) {
        const tabKey = _private.getTabKeyFromContext(newOptions);

        /* Need notify after getting tab from query */
        if (_private.isTabChanged(this._suggestListOptions, tabKey)) {
            this._tabsChanged(tabKey);
        }

        const currentReverseList = this._reverseList;
        _private.checkContext(this, newOptions);

        if (this._reverseList !== currentReverseList) {
            if (this._reverseList) {
                this._suggestListOptions.suggestDirectionChangedCallback('up');
            } else {
                this._suggestListOptions.suggestDirectionChangedCallback(
                    'down'
                );
            }
        }

        this._setSourceController(newOptions);
    },

    _needRenderTabs(options) {
        const dataOptionsCount =
            options._dataOptionsValue &&
            Object.keys(options._dataOptionsValue).length;
        const dialogMode = options._suggestListOptions?.dialogMode;
        const tabsOptionsItems = options.tabsOptions?.items;
        const tabsOptionsCount = tabsOptionsItems?.getCount();

        return (
            !dialogMode &&
            ((options.tabsOptions &&
                (!tabsOptionsItems || tabsOptionsCount > 1)) ||
                dataOptionsCount > 1)
        );
    },

    _tabsSelectedKeyChanged(event, key) {
        /* It is necessary to separate the processing of the tab change by suggest layout and
       a user of a control.
       To do this, using the callback-option that only suggest layout can pass.
       Event should fired only once and after list was loading,
       because in this event user can change template of a List control. */
        this._suggestListOptions.tabsSelectedKeyChangedCallback(key);

        // FIXME remove after https://online.sbis.ru/opendoc.html?guid=5c91cf92-f61e-4851-be28-3f196945884c
        if (this._options.task1176635657) {
            this._tabsChanged(key);
        }
    },

    _itemsReadyCallback(items: RecordSet): void {
        this._unsubscribeFromItemsEvents();
        this._items = items;
        this._items.subscribe('onCollectionChange', this._collectionChange);
    },

    _collectionChange(): void {
        const isMaxCountNavigation =
            this._suggestListOptions &&
            this._suggestListOptions.navigation &&
            this._suggestListOptions.navigation.view === 'maxCount';
        if (isMaxCountNavigation) {
            this._isSuggestListEmpty = !this._items.getCount();
        }

        const results = this._items.getMetaData().results;
        const currentTabMetaKey = results && results.get('tabsSelectedKey');

        if (
            currentTabMetaKey &&
            currentTabMetaKey !== this._suggestListOptions.tabsSelectedKey
        ) {
            this._suggestListOptions.tabsSelectedKey = currentTabMetaKey;
            this._tabsChanged(currentTabMetaKey);
        }
    },

    _unsubscribeFromItemsEvents(): void {
        if (this._items) {
            this._items.unsubscribe(
                'onCollectionChange',
                this._collectionChange
            );
        }
    },

    _tabsChanged(key: string | number): void {
        const eventResult = this._notify('tabsSelectedKeyChanged', [key]);

        if (eventResult instanceof Promise) {
            this._tabsChangedPromise = eventResult;
            eventResult.finally(() => {
                this._tabsChangedPromise = null;
            });
        }
    },

    _sortDataByOrder(data) {
        if (!data) {
            return [];
        }

        return Object.values(data).sort((a, b) => {
            return a.order - b.order;
        });
    },

    _getDataTabKey(prefetchData) {
        const tabId = this._sortDataByOrder(prefetchData)[0].id;
        let tabKey;
        Object.entries(prefetchData).find(([key, value]) => {
            if (value.id === tabId) {
                tabKey = key;
            }
        });
        return tabKey;
    },

    _getSourceController(options): NewSourceController {
        // options._dataOptionsValue нет, когда список открывается в диалоге
        if (options._dataOptionsValue === undefined) {
            return;
        }

        const prefetchData = options._dataOptionsValue;
        const currentTabData =
            prefetchData[this._suggestListOptions.tabsSelectedKey] ||
            prefetchData[this._getDataTabKey(prefetchData)];

        return currentTabData.sourceController;
    },

    _setSourceController(options): void {
        const sourceController = this._getSourceController(options);
        if (this._tabsChangedPromise) {
            this._tabsChangedPromise.finally(() => {
                this._sourceController = sourceController;
            });
        } else if (!sourceController?.isLoading()) {
            this._sourceController = sourceController;
        }
    },

    _beforeUnmount(): void {
        this._unsubscribeFromItemsEvents();
        this._items = null;
    },

    _inputKeydown(event, domEvent) {
        const items = this._items;
        const itemsCount = items && items.getCount();

        if (
            this._markedKey === null &&
            itemsCount &&
            domEvent.nativeEvent.keyCode === constants.key.up
        ) {
            this._markedKey = items.at(itemsCount - 1).getId();
        } else {
            /* TODO will refactor on the project
             https://online.sbis.ru/opendoc.html?guid=a2e1122b-ce07-4a61-9c04-dc9b6402af5d
          remove list._container[0] after
          https://online.sbis.ru/opendoc.html?guid=d7b89438-00b0-404f-b3d9-cc7e02e61bb3 */
            const list = this._children.list;
            const listContainer = list._container[0] || list._container;
            const customEvent = _private.getEvent('keydown');

            _private.dispatchEvent(
                listContainer,
                domEvent.nativeEvent,
                customEvent
            );
        }
    },

    _markedKeyChanged(event, key) {
        this._markedKey = key;
        return this._notify('markedKeyChanged', [key]);
    },
});

List._private = _private;

export = List;
