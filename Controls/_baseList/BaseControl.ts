/**
 * @kaizen_zone 9667df49-f81c-47b7-8671-9b43a1025495
 */
//# region Imports
import { controller as localeController } from 'I18n/i18n';
import * as rk from 'i18n!Controls';
import cClone = require('Core/core-clone');
import cInstance = require('Core/core-instance');

import BaseControlTpl = require('wml!Controls/_baseList/BaseControl/BaseControl');
import 'css!Controls/baseList';
import 'css!Controls/itemActions';
import 'css!Controls/CommonClasses';

// Core imports
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';

import { constants, detection } from 'Env/Env';

import { IObservable, RecordSet } from 'Types/collection';
import { factory } from 'Types/chain';
import { isEqual } from 'Types/object';
import { CrudEntityKey, DataSet, LOCAL_MOVE_POSITION } from 'Types/source';
import { throttle } from 'Types/function';
import { create as diCreate } from 'Types/di';
import { Guid, Model as EntityModel, Model } from 'Types/entity';
import { IHashMap } from 'Types/declarations';

import { SyntheticEvent } from 'Vdom/Vdom';
import type { Container as ValidateContainer, ControllerClass } from 'Controls/validate';
import { Logger } from 'UI/Utils';
import { Object as EventObject } from 'Env/Event';
import { loadAsync, isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';

import { TouchDetect } from 'EnvTouch/EnvTouch';
import {
    groupUtil,
    isEqualItems,
    ISourceControllerOptions,
    NewSourceController as SourceController,
} from 'Controls/dataSource';
import type { ListSlice } from 'Controls/dataFactory';
import {
    Direction,
    IBasePositionSourceConfig,
    IBaseSourceConfig,
    IFilterOptions,
    INavigationOptionValue,
    INavigationSourceConfig,
    INavigationButtonConfig,
    ISelectionObject,
    ISourceOptions,
    TKey,
    TNavigationButtonView,
    TOffsetSize,
    IStoreIdOptions,
} from 'Controls/interface';
import { isLeftMouseButton, Sticky, StickyOpener } from 'Controls/popup';
import { process } from 'Controls/error';

// Utils imports
import { EventUtils, checkWasabyEvent } from 'UI/Events';
import { DimensionsMeasurer, getDimensions as uDimension } from 'Controls/sizeUtils';
import {
    Collection,
    CollectionItem,
    ICollectionOptions,
    IDragPosition,
    IEditableCollectionItem,
    MoreButtonVisibility,
    TItemKey,
    IndicatorSelector,
    TItemActionsPosition,
} from 'Controls/display';

import {
    Controller as ItemActionsController,
    IControllerOptions as IItemActionsControllerOptions,
    IItemAction,
    IItemActionsOptions,
    IAction as IShownItemAction,
    TItemActionShowType,
    EDITING_CLOSE_BUTTON_KEY,
    EDITING_APPLY_BUTTON_KEY,
} from 'Controls/itemActions';
import { RegisterUtil, UnregisterUtil } from 'Controls/event';
import { saveConfig } from 'Controls/Application/SettingsController';

import ScrollPagingController, { IPagingCfg } from 'Controls/_baseList/Controllers/ScrollPaging';
import * as GroupingController from 'Controls/_baseList/Controllers/Grouping';
import HoverFreeze from 'Controls/_baseList/Controllers/HoverFreeze';

import { INewListSchemeHandlers, INewListSchemeProps } from './Data/INewListScheme';

import type {
    InputHelper as EditInPlaceInputHelper,
    Controller as EditInPlaceController,
    TCancelConstant,
    TNextColumnConstant,
    TPrevColumnConstant,
    TGoToNextConstant,
    TGoToPrevConstant,
    TNotEditableJsSelector,
    IBeforeBeginEditCallbackParams,
    IBeforeEndEditCallbackParams,
    TAsyncOperationResult,
    IEditInPlaceLibPublicExports,
} from 'Controls/editInPlace';

import type {
    IEditableList,
    IEditableListOptions,
    IEditingConfig,
    IItemAddOptions,
    IItemEditOptions,
} from './interface/IEditableList';

import {
    FlatSelectionStrategy,
    IFlatSelectionStrategyOptions,
    ISelectionControllerOptions,
    ISelectionStrategy,
    SelectionController,
} from 'Controls/multiselection';
import {
    DndController,
    FlatStrategy,
    IDragStrategyParams,
    TreeStrategy,
} from 'Controls/listDragNDrop';
import MoreButtonTemplate from 'Controls/_baseList/BaseControl/NavigationButton';

import { IList, IReloadItemOptions } from './interface/IList';
import { IAnimationContainerContextValue, ANIMATION_DURATION } from 'Controls/animation';
import { _IListScrollContextOptions as IListScrollContextOptions } from 'Controls/scroll';
import { getStickyHeadersHeight } from 'Controls/stickyBlock';
import { IDragObject, ItemsEntity } from 'Controls/dragnDrop';
import { ISiblingStrategy } from './interface/ISiblingStrategy';
import { FlatSiblingStrategy } from './Strategies/FlatSiblingStrategy';
import type { IAction, IActionOptions, IMoveDialogOptions } from 'Controls/listCommands';
import { IMovableList, IListActionAdditionalConfig } from './interface/IMovableList';
import IndicatorsController, {
    DIRECTION_COMPATIBILITY,
    IIndicatorsControllerOptions,
    INDICATOR_HEIGHT,
} from './Controllers/IndicatorsController';
import { default as selectionToRecordUtil } from 'Controls/Utils/selectionToRecord';
import { getPlainItemContents, getKey } from 'Controls/_baseList/resources/utils/helpers';
import {
    getColumnsWidths,
    extractWidthsForColumns,
} from 'Controls/_baseList/resources/utils/resizer';
import { FadeController } from 'Controls/_baseList/Controllers/FadeController';
import BeforeMountAsyncQueueHelper from 'Controls/_baseList/BaseControl/BeforeMountAsyncQueueHelper';
import { activate, IFocusChangedConfig } from 'UICore/Focus';
import * as React from 'react';
import { TrackedPropertiesComponent } from 'Controls/_baseList/TrackedPropertiesTemplate';
import { IItemEventHandlers } from './ItemTemplate';
import { IItemActionsHandler } from './Render/ItemActions';
import { TNotifyCallback } from './List';
import {
    getBottomPaddingClass,
    TBottomPaddingClass,
} from 'Controls/_baseList/resources/utils/bottomPadding';
import {
    TOldBaseControlCompatibility,
    NEW_BASE_CONTROL_DEFAULT_OPTIONS,
} from './compatibility/BaseControlComponent';

import { ScrollControllerLib } from 'Controls/listsCommonLogic';

//# endregion

//# region Const

const NOT_EDITABLE_JS_SELECTOR: TNotEditableJsSelector = 'js-controls-ListView__notEditable';

const ERROR_MSG = {
    CANT_USE_IN_READ_ONLY: (methodName: string): string => {
        return `List is in readOnly mode. Cant use ${methodName}() in readOnly!`;
    },
};

// = 28 + 6 + 6 см controls-BaseControl_paging-Padding_theme TODO не должно такого быть, он в разных темах разный
const PAGING_PADDING = 40;

const PAGE_SIZE_ARRAY = [
    { id: 1, title: '5', pageSize: 5 },
    { id: 2, title: '10', pageSize: 10 },
    { id: 3, title: '25', pageSize: 25 },
    { id: 4, title: '50', pageSize: 50 },
    { id: 5, title: '100', pageSize: 100 },
    { id: 6, title: '200', pageSize: 200 },
    { id: 7, title: '500', pageSize: 500 },
];

enum PAGE_SIZES {
    SIZE_10 = 10,
    SIZE_25 = 25,
    SIZE_50 = 50,
    SIZE_100 = 100,
    SIZE_500 = 500,
    SIZE_1000 = 1000,
}

const HOT_KEYS = {
    keyDownDown: constants.key.down,
    keyDownUp: constants.key.up,
    keyDownLeft: constants.key.left,
    keyDownRight: constants.key.right,
    spaceHandler: constants.key.space,
    enterHandler: constants.key.enter,
    keyDownHome: constants.key.home,
    keyDownEnd: constants.key.end,
    keyDownPageUp: constants.key.pageUp,
    keyDownPageDown: constants.key.pageDown,
    keyDownDel: constants.key.del,
};

const INITIAL_PAGES_COUNT = 1;
const LIMIT_DRAG_SELECTION = 100;
const PORTIONED_LOAD_META_FIELD = 'iterative';
const MIN_SCROLL_PAGING_SHOW_PROPORTION = 2;
const MAX_SCROLL_PAGING_HIDE_PROPORTION = 1;
const DRAG_SHIFT_LIMIT = 4;
const IE_MOUSEMOVE_FIX_DELAY = 50;
const DRAGGING_OFFSET = 10;
const SCROLLMOVE_DELAY = 150;
/**
 * Минимальное количество элементов, при которых должен отобразиться пэйджинг
 */
const PAGING_MIN_ELEMENTS_COUNT = 5;
const LIST_MEASURABLE_CONTAINER_SELECTOR = 'js-controls-ListView__measurableContainer';
const ITEM_ACTION_SELECTOR = '.js-controls-ItemActions__ItemAction';

export type TLoadingTriggerSelector = '.controls-BaseControl__loadingTrigger';
const LOADING_TRIGGER_SELECTOR: TLoadingTriggerSelector = '.controls-BaseControl__loadingTrigger';

const SHOW_ACTIONS_CLASS = 'controls-BaseControl_showActions';
const HOVER_ENABLED_CLASS = 'controls-BaseControl_hover_enabled';

// sorting button
const SORTING_BUTTON_SELECTOR = '.js-controls-SortingButton';

// tag
const TAG_SELECTOR = '.js-controls-tag';

// mover/remover commands
enum COMMAND {
    MOVE = 'Controls/listCommands:Move',
    MOVE_WITH_DIALOG = 'Controls/listCommands:MoveWithDialog',
    REMOVE = 'Controls/listCommands:Remove',
    REMOVE_WITH_CONFIRM = 'Controls/listCommands:RemoveWithConfirmation',
}

enum VIEW_COMMAND {
    MOVE = 'Controls/viewCommands:Move',
    REMOVE = 'Controls/viewCommands:AtomicRemove',
    PARTIAL_RELOAD = 'Controls/viewCommands:PartialReload',
}

//# endregion

//# region Types

/**
 * Набор констант, используемых при работе с {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактированием по месту}.
 * @class Controls/list:editing
 * @public
 */

/**
 * Константа для отмены редактирования.
 * С помощью этой константы можно отменить или пропустить запуск {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирования по месту}.
 * Для этого константу следует вернуть из обработчика события {@link Controls/list:IEditableList#beforeBeginEdit beforeBeginEdit}.
 * При последовательном редактировании записей (при переходе через Tab, Enter, Arrow Down и Up) возврат константы CANCEL приведет к отмене запуска
 * редактирования по месту и попытке старта редактирования следующей записи в направлении перехода.
 * В остальных случаях возврат константы CANCEL приведет к отмене запуска редактирования в списке.
 * @name Controls/list:editing#CANCEL
 * @cfg {String}
 */

export const LIST_EDITING_CONSTANTS: Record<string, TCancelConstant> = {
    CANCEL: 'Cancel',
};

interface IAnimationEvent extends Event {
    animationName: string;
}

type CancelableError = Error & { canceled?: boolean; isCanceled?: boolean };

interface IScrollToItemAfterReloadParams {
    key: TItemKey;
    force: boolean;
    position: string;
    resolveScroll: Function;
}

interface IBeginEditOptions {
    shouldActivateInput?: boolean;
    columnIndex?: number;
}

interface IBeginAddOptions {
    shouldActivateInput?: boolean;
    addPosition?: 'top' | 'bottom';
    targetItem?: Model;
    columnIndex?: number;
}

export interface IScrollParams {
    clientHeight: number;
    clientWidth: number;
    scrollTop: number;
    scrollLeft: number;
    scrollHeight: number;
    scrollWidth: number;
    rect?: DOMRect;
}

export interface IContentSizesParams {
    width: number;
    height: number;
}

export interface IViewPortSizesParams {
    width: number;
    height: number;
    scrollTop: number;
    scrollLeft: number;
}

export type TBottomPaddingMode = 'placeholder' | 'none' | 'actions' | 'separate';

//# endregion

const _private = {
    getItemActionsMenuConfig(
        self: BaseControl,
        item,
        event,
        action,
        isContextMenu: boolean
    ): Record<string, unknown> {
        const itemActionsController = self._getItemActionsController();
        const defaultMenuConfig = itemActionsController.prepareActionsMenuConfig(
            item,
            event,
            action,
            self,
            isContextMenu
        );
        const menuConfig = self._children?.listView?.getActionsMenuConfig?.(
            item,
            event,
            action,
            isContextMenu,
            defaultMenuConfig,
            self._listViewModel?.getItemDataByItem
                ? self._listViewModel.getItemDataByItem(item)
                : item
        );
        return menuConfig || defaultMenuConfig;
    },

    isNewModelItemsChange: (action, newItems) => {
        return action && (action !== 'ch' || (newItems && !newItems.properties));
    },
    checkDeprecated(cfg: IBaseControlOptions): void {
        if (cfg.historyIdCollapsedGroups) {
            Logger.warn(
                'IGrouped: Option "historyIdCollapsedGroups" is deprecated and removed in 19.200. Use option "groupHistoryId".'
            );
        }
        if (
            cfg.navigation &&
            cfg.navigation.viewConfig &&
            cfg.navigation.viewConfig.pagingMode === 'direct'
        ) {
            Logger.warn(
                'INavigation: The "direct" value in "pagingMode" was deprecated and removed in 21.1000. Use the value "basic".'
            );
        }
    },

    doAfterRender(self: BaseControl, callback: Function): void {
        if (self.callbackAfterRender) {
            self.callbackAfterRender.push(callback);
        } else {
            self.callbackAfterRender = [callback];
        }
    },

    // Attention! Вызывать эту функцию запрещено! Исключение - методы reload, onScrollHide, onScrollShow.
    // Функция предназначена для выполнения каллбека после завершения цикла обновления.
    // Цикл обновления - это последовательный вызов beforeUpdate -> afterUpdate.
    // И вот посреди этого цикла нельзя менять модель, иначе beforeUpdate отработает по одному состоянию, а
    // afterUpdate уже совсем по другому!
    // Как сделать правильно: нужно переписать BaseControl таким образом, чтобы items спускались в него из HOC.
    // Примеры возникающих ошибок при обновлении items между beforeUpdate и afterUpdate:
    // https://online.sbis.ru/opendoc.html?guid=487d70ed-ba64-48b4-ad14-138b576cb9c4
    // https://online.sbis.ru/opendoc.html?guid=21fe75c0-62b8-4caf-9442-826827f73cd0
    // https://online.sbis.ru/opendoc.html?guid=8a839900-ebc0-4dad-9b53-225f0c337580
    // https://online.sbis.ru/opendoc.html?guid=dbaaabae-fcca-4c79-9c92-0f7fa2e70184
    // https://online.sbis.ru/opendoc.html?guid=b6715c2a-704a-414b-b764-ea2aa4b9776b
    // p.s. в первой ошибке также прикреплены скрины консоли.
    doAfterUpdate(self: BaseControl, callback: Function, beforePaint: boolean = true): void {
        if (self._updateInProgress) {
            if (!beforePaint) {
                if (self._callbackAfterUpdate) {
                    self._callbackAfterUpdate.push(callback);
                } else {
                    self._callbackAfterUpdate = [callback];
                }
            } else {
                _private.doAfterRender(self, callback);
            }
        } else {
            callback();
        }
    },

    setReloadingState(self: BaseControl, state: boolean): void {
        self._isReloading = state;

        // Этот код нужно уносить из вьюхи, для грид-реакт уже не актуален.
        const view = self._children && self._children.listView;
        if (view && view.setReloadingState) {
            view.setReloadingState(state);
        }
    },

    assignItemsToModel(self: BaseControl, items: RecordSet, newOptions: IBaseControlOptions): void {
        const listModel = self._listViewModel;
        const oldCollection = listModel.getSourceCollection();

        // TODO restore marker + maybe should recreate the model completely
        if (!isEqualItems(oldCollection, items) || oldCollection !== items) {
            self._onItemsReady(newOptions, items);
            oldCollection.unsubscribe('onPropertyChange', self._onCollectionPropertyChange);
            listModel.setCollection(items);
            items.subscribe('onPropertyChange', self._onCollectionPropertyChange);
            if (self._options.itemsSetCallback) {
                self._options.itemsSetCallback(items);
            }

            self._afterItemsSet(newOptions);
        }

        // При старой модели зовется из модели. Нужен чтобы в explorer поменять модель только уже при наличии данных
        if (self._options.itemsSetCallback) {
            self._options.itemsSetCallback(items);
        }

        self._items = listModel.getSourceCollection();
        self._initialPosition = self._listViewModel?.getSourceItemBySourceIndex(0)?.getKey();
    },

    executeAfterReloadCallbacks(self: BaseControl, loadedList: RecordSet, options): void {
        self._afterReloadCallback(options, loadedList);
    },

    callDataLoadCallbackCompatibility(
        self: BaseControl,
        items: RecordSet,
        direction: ScrollControllerLib.IDirection,
        { dataLoadCallback }: IBaseControlOptions,
        navigationSourceConfig: INavigationSourceConfig
    ): void {
        const sourceController = self._sourceController;
        if (sourceController && dataLoadCallback) {
            const sourceControllerDataLoadCallback = sourceController.getState().dataLoadCallback;

            if (
                sourceControllerDataLoadCallback !== dataLoadCallback &&
                sourceController.getDataLoadCallback() !== dataLoadCallback
            ) {
                dataLoadCallback(items, direction, undefined, navigationSourceConfig);
            }
        }
    },

    initializeModel(self: BaseControl, options: IBaseControlOptions, data: RecordSet): void {
        // Модели могло изначально не создаться (не передали receivedState и source)
        // https://online.sbis.ru/opendoc.html?guid=79e62139-de7a-43f1-9a2c-290317d848d0
        if (!self._destroyed) {
            let items = data;
            const hasItems = !!items;

            // Если нет items, то мы все равно должны создать модель. Для модели опция collection обязательная.
            // Поэтому инициализируем ее пустым рекордсетом. Модель нужна всегда, т.к. через нее отображаются:
            // хедеры, футеры, индикаторы.
            if (!hasItems) {
                items = new RecordSet();
            }

            self._items = items;
            self._initialPosition = self._listViewModel?.getSourceItemBySourceIndex(0)?.getKey();

            if (hasItems) {
                self._onItemsReady(options, items);
            }

            if (options.collection) {
                self._listViewModel = options.collection;
            } else {
                self._itemActionsController?.destroy();
                self._itemActionsController = null;
                self._listViewModel?.destroy();

                self._listViewModel = self._createNewModel(
                    items,
                    options,
                    options.viewModelConstructor,
                    extractWidthsForColumns(options, self._storedColumnsWidths)
                );
            }

            if (options.collectionRef) {
                options.collectionRef.current = self._listViewModel;
            }

            if (hasItems) {
                self._afterItemsSet(options);
            }

            if (!options.useCollection) {
                self._initListViewModelHandler(self._listViewModel);
                options.setCollection(self._listViewModel, true);
            }

            _private.prepareFooter(self, options, self._sourceController);

            self._shouldNotifyOnDrawItems = true;
        }
    },

    hasDataBeforeLoad(self: BaseControl): boolean {
        return self._isMounted && self._listViewModel && self._listViewModel.getCount();
    },

    hasMoreDataInAnyDirection(self: BaseControl): boolean {
        return self._hasMoreData('up') || self._hasMoreData('down');
    },

    getHasMoreData(self: BaseControl): { up: boolean; down: boolean } {
        return {
            up: self._hasMoreData('up'),
            down: self._hasMoreData('down'),
        };
    },

    validateSourceControllerOptions(self: BaseControl, options: IBaseControlOptions): void {
        const sourceControllerState = self._sourceController.getState();
        const validateIfOptionsIsSetOnBothControls = (optionName: string): void => {
            if (
                sourceControllerState[optionName] &&
                options[optionName] &&
                sourceControllerState[optionName] !== options[optionName]
            ) {
                Logger.warn(
                    `BaseControl: для корректной работы опцию ${optionName} необходимо задавать на Layout/browser:Browser (Controls/listDataOld:DataContainer)`,
                    self
                );
            }
        };
        const validateIfOptionsIsSetOnlyOnList = (optionName: string): void => {
            if (options[optionName] && !sourceControllerState[optionName]) {
                Logger.warn(
                    `BaseControl: для корректной работы опцию ${optionName} необходимо задавать на Layout/browser:Browser (Controls/listDataOld:DataContainer)`,
                    self
                );
            }
        };
        const optionsToValidateOnBoth = ['source', 'navigation', 'sorting', 'root'];
        const optionsToValidateOnlyOnList = ['source', 'navigation', 'sorting', 'dataLoadCallback'];

        optionsToValidateOnBoth.forEach(validateIfOptionsIsSetOnBothControls);
        optionsToValidateOnlyOnList.forEach(validateIfOptionsIsSetOnlyOnList);
    },

    validateSortingOptions(self: BaseControl, options: IBaseControlOptions): void {
        if (!options.sorting && options.canResetSorting === false) {
            Logger.error(
                'BaseControl: для корректной работы опции canResetSorting в опции sorting необходимо задать сортировку по одной из колонок',
                self
            );
        }
    },

    getAllDataCount(self: BaseControl): number | undefined {
        return self._listViewModel?.getMetaData()?.more;
    },

    scrollToItem(
        self: BaseControl,
        key: TItemKey,
        position?: string,
        force?: boolean,
        allowLoad?: boolean,
        waitInertialScroll?: boolean
    ): Promise<void> {
        // если разрешена загрузка целевой записи в случае отсутствия её в рекордсете (через курсорную навигацию)
        if (allowLoad) {
            const hasItemInRecordset = self._listViewModel.getSourceItemByKey(key);

            // то проверяем наличие записи. если запись есть, то выполняем к ней скроллирование
            if (hasItemInRecordset) {
                return self._listVirtualScrollController.scrollToItem(key, position, force);
            }

            // иначе - вызываем перезагрузку списка, указав в качестве курсора целевую запись
            return new Promise((resolveScroll) => {
                const currentSourceConfig = self._sourceController.getNavigation()
                    .sourceConfig as IBasePositionSourceConfig;

                self.reload(false, {
                    position: key,
                    limit: currentSourceConfig.limit,
                    multiNavigation: currentSourceConfig.multiNavigation,
                    direction: 'bothways',
                });

                self._scrollToItemAfterReloadParams = {
                    key,
                    position,
                    force,
                    resolveScroll,
                };
            });
        }

        return self._listVirtualScrollController.scrollToItem(
            key,
            position,
            force,
            undefined,
            waitInertialScroll
        );
    },

    // region key handlers

    keyDownHome(self: BaseControl, event: Event): void {
        event.stopPropagation();
        _private.scrollToEdge(self, 'up');
    },

    keyDownRight(self: BaseControl, event: Event): void {
        self._keyDownRight(event, true);
    },

    keyDownLeft(self: BaseControl, event: Event): void {
        self._keyDownLeft(event, true);
    },

    keyDownEnd(self: BaseControl): void {
        if (self._options.navigation?.viewConfig?.showEndButton) {
            _private.scrollToEdge(self, 'down');
        } else {
            self._listVirtualScrollController.scrollToEdge('forward').then((key) => {
                self._options.onAfterPagingCompatible(key, self, self._options);
            });
        }
    },
    keyDownPageUp(self: BaseControl, event: Event): void {
        // отлючаем нативное поведение и всплытие событие, чтобы нам повторно не пришло событие от Application
        event.stopPropagation();
        event.preventDefault();
        self._userScroll = true;
        self._listVirtualScrollController.scrollToPage('backward').then((key) => {
            self._options.onAfterPagingCompatible(key, self, self._options);
        });
    },
    keyDownPageDown(self: BaseControl, event: SyntheticEvent): void {
        // отлючаем нативное поведение и всплытие событие, чтобы нам повторно не пришло событие от Application
        event.stopPropagation();
        event.preventDefault();
        self._userScroll = true;
        self._listVirtualScrollController.scrollToPage('forward').then((key) => {
            self._options.onAfterPagingCompatible(key, self, self._options);
        });
    },

    enterHandler(self: BaseControl, event: SyntheticEvent<KeyboardEvent>): void {
        if (
            event.nativeEvent.ctrlKey ||
            self.isEditing() ||
            !self.getViewModel() ||
            !self.getViewModel().getCount()
        ) {
            return;
        }

        // При обработке Enter текущий target === fakeFocusElement.
        // Прикладникам нужен реальный target, по которому произошло событие, и который позволяет
        // определить координаты записи, например, для того, чтобы отобразить в нужном месте popup.
        // Пытаемся найти отмеченную маркером запись:
        const markedKey = self._options.getMarkedKeyCompatible(self, self._options);
        const hasMarkedKey = markedKey !== null && markedKey !== undefined;
        if (hasMarkedKey) {
            const markedItem = self._listViewModel.getItemBySourceKey(markedKey);
            const contents = markedItem.getContents();
            const markedItemIndex = self._listViewModel.getIndex(markedItem);
            // Невозможно кликнуть по записи, если она не отображается
            const markedItemIsDisplayed =
                markedItemIndex >= self._listViewModel.getStartIndex() &&
                markedItemIndex < self._listViewModel.getStopIndex();

            // Ищем HTML-контейнер отмеченной записи по селектору
            const target = self._getItemContainerByKey(markedKey);

            // Создаём событие, в которое будем отдавать указанный target.
            const customEvent = new SyntheticEvent(null, {
                type: 'click',
                target,
                _bubbling: false,
            });

            // Enter на списке с отмеченной записью и возможностью редактирования по месту запускает ее
            // редактирование, при условии, что опция editingConfig.editOnEnter задана в true.
            if (
                self._getEditingConfig().editOnEnter &&
                !_private.isEditing(self) &&
                !self._options.readOnly
            ) {
                const checkboxOffset = +self._hasMultiSelect();
                self._savedItemClickArgs = [customEvent, contents, customEvent, checkboxOffset];
                self._beginEdit({ item: contents }, { columnIndex: checkboxOffset });
            } else if (markedItemIsDisplayed) {
                self._onItemClick(customEvent, contents, customEvent, null);
            }
        }
        event.stopPropagation();
    },

    keyDownDown(self: BaseControl, event: React.KeyboardEvent): void {
        const options = self._options as IBaseControlOptions;
        options.onViewKeyDownArrowDownNew(event, self, options);
    },

    keyDownUp(self: BaseControl, event: React.KeyboardEvent): void {
        const options = self._options as IBaseControlOptions;
        options.onViewKeyDownArrowUpNew(event, self, options);
    },

    spaceHandler(self: typeof BaseControl, event: SyntheticEvent): void {
        self._options.onViewKeyDownSpaceNew(event, self, self._options, (key) => {
            const item = self._listViewModel.getItemBySourceKey(key);
            if (item.SelectableItem && !item.isReadonlyCheckbox()) {
                const result = self._getSelectionController().toggleItem(key);
                self._changeSelection(result);
                // Пробел блокируется, пока не применем новое состояние, то есть пока не произойдет _beforeUpdate,
                // чтобы адекватно отрабатывать при зажатом пробеле
                self._spaceBlocked = true;
            }
        });
    },

    /**
     * Метод обработки нажатия клавиши del.
     * Работает по принципу "Если в itemActions есть кнопка удаления, то имитируем её нажатие"
     * @param self
     * @param event
     */
    keyDownDel(self: BaseControl, event: SyntheticEvent<MouseEvent>): void {
        self._keyDownDel(event, true);
    },

    // endregion key handlers

    shouldDrawCut(
        navigation: INavigationOptionValue<INavigationSourceConfig>,
        items: RecordSet,
        hasMoreData: boolean
    ): boolean {
        /*
         * Кат нужен, если есть еще данные
         * или данных больше, чем размер страницы
         */
        return (
            _private.isCutNavigation(navigation) &&
            (hasMoreData || (items && items.getCount() > navigation.sourceConfig.pageSize))
        );
    },

    prepareFooter(
        self: BaseControl,
        options: IBaseControlOptions,
        sourceController: SourceController
    ): void {
        // Если подгрузка данных осуществляется кликом по кнопке "Еще..." и есть что загружать, то рисуем эту кнопку
        // всегда кроме случая когда задана группировка и все группы свернуты
        if (_private.isDemandNavigation(options.navigation) && self._hasMoreData('down')) {
            self._shouldDrawNavigationButton =
                options.groupingKeyCallback || options.groupProperty
                    ? !self._listViewModel.isAllGroupsCollapsed()
                    : true;
        } else if (
            _private.shouldDrawCut(options.navigation, self._items, self._hasMoreData('down'))
        ) {
            self._shouldDrawNavigationButton = true;
        } else {
            self._shouldDrawNavigationButton = false;
        }

        if (self._shouldDrawNavigationButton && _private.isDemandNavigation(options.navigation)) {
            let loadedDataCount = 0;

            if (self._listViewModel) {
                // Единственный способ однозначно понять, что выводится дерево - проверить что список строится
                // по проекци для дерева.
                // TODO: должно быть убрано после того, как TreeControl будет наследоваться от BaseControl
                const display = self._listViewModel;
                loadedDataCount =
                    display && display['[Controls/_display/Tree]']
                        ? display.getChildren(display.getRoot()).getCount()
                        : display.getSourceCollectionCount();
            }

            const allDataCount = _private.getAllDataCount(self);
            if (typeof loadedDataCount === 'number' && typeof allDataCount === 'number') {
                self._loadMoreCaption = allDataCount - loadedDataCount;
                if (self._loadMoreCaption === 0) {
                    self._shouldDrawNavigationButton = false;
                }
            } else {
                self._loadMoreCaption = '...';
            }
        }

        self._onFooterPrepared(options);
    },

    loadToDirection(
        self: BaseControl,
        direction: ScrollControllerLib.IDirection,
        addItemsAfterLoad?: boolean,
        useServicePool?: boolean
    ): Promise<RecordSet | void> | void {
        if (self._sourceController) {
            const filter: IHashMap<unknown> = cClone(self._options.filter);
            if (_private.isPortionedLoad(self)) {
                const portionedSearchDirection =
                    self._indicatorsController.getPortionedSearchDirection();
                if (!self._indicatorsController.isDisplayedPortionedSearch()) {
                    if (direction === 'up') {
                        // Если включен порицонный поиск в обе стороны, то мы в первую очередь грузим данные вниз.
                        // Когда поиск вниз приостановится показываем индикатор и триггер сверху.
                        // По триггеру продолжаем поиск в другую сторону
                        if (portionedSearchDirection === 'down') {
                            // если у нас сейчас есть направление порционного поиска,
                            // то мы должны просто продолжить поиск в другую сторону
                            self._indicatorsController.continueDisplayPortionedSearch('top');
                        } else {
                            self._indicatorsController.startDisplayPortionedSearch('top');
                        }
                    } else if (self._indicatorsController.shouldContinueDisplayPortionedSearch()) {
                        self._indicatorsController.startDisplayPortionedSearch(
                            DIRECTION_COMPATIBILITY[portionedSearchDirection]
                        );
                    }
                }
            }

            if (self._options.groupProperty) {
                GroupingController.prepareFilterCollapsedGroups(
                    self._listViewModel.getCollapsedGroups(),
                    filter
                );
            }

            self._addItemsByLoadToDirection = true;

            return self
                ._loadItemsToDirection(direction, addItemsAfterLoad, useServicePool)
                .addCallback((addedItems: RecordSet) => {
                    if (self._destroyed) {
                        return;
                    }

                    _private.prepareFooter(self, self._options, self._sourceController);

                    self._options.slicelessHandleLoadToDirection?.(
                        self,
                        self._options,
                        _private.isPortionedLoad(self)
                    );

                    if (!self._hasMoreData(direction)) {
                        self._updateShadowModeHandler(self._shadowVisibility);
                    }

                    self._updateVirtualNavigation(self._hasItemsOutRange);

                    return addedItems;
                })
                .addErrback((error: CancelableError) => {
                    if (self._destroyed) {
                        return;
                    }

                    self._addItemsByLoadToDirection = false;

                    const hideIndicatorOnCancelQuery =
                        (error.isCanceled || error.canceled) &&
                        !self._sourceController?.isLoading() &&
                        !_private.isPortionedLoad(self);

                    if (hideIndicatorOnCancelQuery) {
                        // при пересчете скроем все ненужые индикаторы
                        self._indicatorsController.recountIndicators(direction);
                    }
                    // скроллим в край списка, чтобы при ошибке загрузки данных шаблон ошибки сразу был виден
                    if (!error.canceled && !error.isCanceled) {
                        // скрываем индикатор в заданном направлении, чтобы он не перекрывал ошибку
                        self._indicatorsController.hideIndicator(
                            DIRECTION_COMPATIBILITY[direction]
                        );
                        _private.scrollToEdge(self, direction);
                    }
                });
        }
        Logger.error("BaseControl: Source option is undefined. Can't load data", self);
    },

    getUpdatedMetaData(
        oldMetaData,
        loadedMetaData,
        navigation: INavigationOptionValue<INavigationSourceConfig>,
        direction: 'up' | 'down'
    ) {
        if (navigation.source !== 'position' || navigation.sourceConfig.direction !== 'both') {
            return loadedMetaData;
        }
        const resultMeta = { ...loadedMetaData, more: oldMetaData.more };
        const directionMeta = direction === 'up' ? 'before' : 'after';

        resultMeta.more[directionMeta] =
            typeof loadedMetaData.more === 'object'
                ? loadedMetaData.more[directionMeta]
                : loadedMetaData.more;

        return resultMeta;
    },

    needLoadNextPageAfterLoad(
        self: BaseControl,
        loadedList: RecordSet,
        listViewModel: Collection,
        navigation: INavigationOptionValue<INavigationSourceConfig>
    ): boolean {
        let result = false;
        const allowByPortionedSearch =
            _private.isPortionedLoad(self, loadedList) &&
            self._indicatorsController.shouldContinueDisplayPortionedSearch();
        const allowByLoadedItems = self._shouldLoadByLoadedItems(loadedList);

        if (navigation) {
            switch (navigation.view) {
                case 'infinity':
                    // todo remove loadedList.getCount() === 0 by task
                    // https://online.sbis.ru/opendoc.html?guid=909926f2-f62a-4de8-a44b-3c10006f530f
                    result = allowByLoadedItems || allowByPortionedSearch;
                    break;
                case 'maxCount':
                    result =
                        (allowByLoadedItems || allowByPortionedSearch) &&
                        _private.needLoadByMaxCountNavigation(listViewModel, navigation);
                    break;
            }
        }

        return result;
    },

    needLoadByMaxCountNavigation(
        listViewModel,
        navigation: INavigationOptionValue<INavigationSourceConfig>
    ): boolean {
        let result = false;

        if (
            _private.isMaxCountNavigation(navigation) &&
            _private.isMaxCountNavigationConfiguredCorrect(navigation)
        ) {
            result = _private.isItemsCountLessThenMaxCount(
                listViewModel.getCount(),
                _private.getMaxCountFromNavigation(navigation)
            );
        }
        return result;
    },

    getMaxCountFromNavigation(navigation: INavigationOptionValue<INavigationSourceConfig>): number {
        return navigation.viewConfig.maxCountValue;
    },

    isMaxCountNavigation(navigation: INavigationOptionValue<INavigationSourceConfig>): boolean {
        return navigation && navigation.view === 'maxCount';
    },

    isMaxCountNavigationConfiguredCorrect(
        navigation: INavigationOptionValue<INavigationSourceConfig>
    ): boolean {
        return navigation.viewConfig && typeof navigation.viewConfig.maxCountValue === 'number';
    },

    isItemsCountLessThenMaxCount(itemsCount: number, navigationMaxCount: number): boolean {
        return navigationMaxCount > itemsCount;
    },

    isDemandNavigation(navigation: INavigationOptionValue<INavigationSourceConfig>): boolean {
        return navigation && navigation.view === 'demand';
    },

    isPagesNavigation(navigation: INavigationOptionValue<INavigationSourceConfig>): boolean {
        return navigation && navigation.view === 'pages';
    },

    isInfinityNavigation(navigation: INavigationOptionValue<INavigationSourceConfig>): boolean {
        return navigation && navigation.view === 'infinity';
    },

    isCutNavigation(navigation: INavigationOptionValue<INavigationSourceConfig>): boolean {
        return navigation && navigation.view === 'cut';
    },

    needShowShadowByNavigation(
        navigation: INavigationOptionValue<INavigationSourceConfig>,
        itemsCount: number
    ): boolean {
        const isDemand = _private.isDemandNavigation(navigation);
        const isMaxCount = _private.isMaxCountNavigation(navigation);
        const isPages = _private.isPagesNavigation(navigation);
        const isCut = _private.isCutNavigation(navigation);
        let result = true;

        if (isDemand || isPages || isCut) {
            result = false;
        } else if (isMaxCount) {
            result = _private.isItemsCountLessThenMaxCount(
                itemsCount,
                _private.getMaxCountFromNavigation(navigation)
            );
        }

        return result;
    },

    loadToDirectionIfNeed(
        self: BaseControl,
        direction: ScrollControllerLib.IDirection,
        addItemsAfterLoad?: boolean,
        useServicePool?: boolean
    ): Promise<RecordSet | void> | void {
        if (self._shouldLoadItemsToDirection(direction)) {
            _private.setHasMoreData(self._listViewModel, _private.getHasMoreData(self));

            return _private.loadToDirection(self, direction, addItemsAfterLoad, useServicePool);
        }
    },

    scrollToEdgeOnAdd(self: BaseControl, direction: ScrollControllerLib.IDirection): Promise<void> {
        let scrollToEdgePromiseResolver;
        const scrollToEdgePromise = new Promise((res) => {
            scrollToEdgePromiseResolver = res;
        });
        const scrollToItem = () => {
            if (!self._listViewModel.getCount()) {
                scrollToEdgePromiseResolver();
            } else if (direction === 'up') {
                const firstItem = self._listViewModel.at(0).key;
                self.scrollToItem(firstItem, 'center').then(() => {
                    scrollToEdgePromiseResolver();
                });
            } else {
                const lastItem = self._listViewModel.at(self._listViewModel.getCount() - 1).key;
                self.scrollToItem(lastItem, 'center').then(() => {
                    scrollToEdgePromiseResolver();
                });
            }
        };
        if (self._hasMoreData(direction)) {
            _private
                .reloadToEdge(self, direction)
                .then(() => {
                    self._shouldNotResetPagingCache = false;

                    /*
                     * Если есть ошибка, то не нужно скроллить, иначе неоднозначное поведение:
                     * иногда скролл происходит раньше, чем показана ошибка, тогда показывается ошибка внутри списка;
                     * иногда ошибка показывается раньше скролла, тогда ошибка во весь список.
                     * https://online.sbis.ru/opendoc.html?guid=ab2c30cd-895d-4b1f-8f71-cd0063e581d2
                     */
                    if (!self._sourceController?.getLoadError()) {
                        scrollToItem();
                    } else {
                        scrollToEdgePromiseResolver();
                    }
                })
                .catch((error) => {
                    return error;
                });
        } else {
            scrollToItem();
        }
        return scrollToEdgePromise;
    },

    reloadToEdge(self: BaseControl, direction: ScrollControllerLib.IDirection): Promise<void> {
        if (self._hasMoreData(direction)) {
            self._resetPagingOnResetItems = false;
            let pagingMode = '';
            if (self._options.navigation && self._options.navigation.viewConfig) {
                pagingMode = self._options.navigation.viewConfig.pagingMode;
            }

            let navigationQueryConfig = self._sourceController.shiftToEdge(
                direction,
                self._options.root,
                pagingMode
            );

            // Решение проблемы загрузки достаточного количества данных для перехода в конец/начало списка
            // в зависимости от размеров экрана.
            // Из размера вьюпорта и записи мы знаем, сколько данных нам хватит.
            // Не совсем понятно, где должен быть этот код. SourceController не должен знать про
            // размеры окна, записей, и т.д. Но и список не должен сам вычислять параметры для загрузки.
            // https://online.sbis.ru/opendoc.html?guid=608aa44e-8aa5-4b79-ac90-d06ed77183a3
            const itemsOnPage = self._scrollPagingCtr?.getItemsCountOnPage();
            const metaMore = self._listViewModel.getMetaData().more;
            if (
                typeof metaMore === 'number' &&
                itemsOnPage &&
                self._options.navigation.source === 'page'
            ) {
                const pageSize = self._options.navigation.sourceConfig.pageSize;
                const pageConfig =
                    direction === 'down'
                        ? self._scrollPagingCtr.calcPageConfigToEnd(pageSize, itemsOnPage, metaMore)
                        : self._scrollPagingCtr.calcPageConfigToStart(pageSize, itemsOnPage);

                navigationQueryConfig = {
                    ...navigationQueryConfig,
                    ...pageConfig,
                };
            }

            // Запоминаем, если был переход в начало/конец,
            // чтобы использовать соответстующее значение position при перезагрузке с сохранением позиции
            if (self._options.navigation.source === 'position') {
                self._lastSourceConfig = navigationQueryConfig;
            }

            // Если пейджинг уже показан, не нужно сбрасывать его при прыжке
            // к началу или концу, от этого прыжка его состояние не может
            // измениться, поэтому пейджинг не должен прятаться в любом случае
            self._shouldNotResetPagingCache = true;
            return self._reload(self._options, navigationQueryConfig).catch((error) => {
                return error;
            });
        } else {
            return Promise.resolve();
        }
    },

    scrollToEdge(self: BaseControl, direction: ScrollControllerLib.IDirection): Promise<void> {
        let scrollToEdgePromiseResolver;
        const scrollToEdgePromise = new Promise<void>((res) => {
            scrollToEdgePromiseResolver = res;
        });
        const hasMoreData = {
            up: self._hasMoreData('up'),
            down: self._hasMoreData('down'),
        };
        if (self._hasMoreData(direction) && !self._sourceController?.getLoadError()) {
            self._listVirtualScrollController.setScrollBehaviourOnReset('keep');
            _private
                .reloadToEdge(self, direction)
                .then(() => {
                    self._shouldNotResetPagingCache = false;

                    /*
                     * Если есть ошибка, то не нужно скроллить, иначе неоднозначное поведение:
                     * иногда скролл происходит раньше, чем показана ошибка, тогда показывается ошибка внутри списка;
                     * иногда ошибка показывается раньше скролла, тогда ошибка во весь список.
                     * https://online.sbis.ru/opendoc.html?guid=ab2c30cd-895d-4b1f-8f71-cd0063e581d2
                     */
                    if (!self._sourceController?.getLoadError()) {
                        self._userScroll = true;
                        if (direction === 'up') {
                            // Чтобы отрисовалась кнопка RESET в пэйджинге
                            self._scrolledToEdge = true;
                            self._listViewModel.setTrackedValuesVisible(false);
                            self._listVirtualScrollController
                                .scrollToEdge('backward')
                                .then((key) => {
                                    self._options.onAfterPagingCompatible(key, self, self._options);

                                    if (_private.isPagingNavigation(self._options.navigation)) {
                                        self._currentPage = 1;
                                    }
                                    scrollToEdgePromiseResolver();
                                });
                            self._scrollPagingCtr.shiftToEdge(direction, hasMoreData);
                        } else {
                            // TODO SCROLL тоже нужно рисовать кнопку, но надо будет тест поправить.
                            // Чтобы отрисовалась кнопка RESET в пэйджинге
                            self._scrolledToEdge = true;
                            self._listViewModel.setTrackedValuesVisible(true);
                            self._listVirtualScrollController
                                .scrollToEdge('forward')
                                .then((key) => {
                                    self._options.onAfterPagingCompatible(key, self, self._options);
                                    if (_private.isPagingNavigation(self._options.navigation)) {
                                        self._currentPage = self._knownPagesCount;
                                    }
                                    scrollToEdgePromiseResolver();
                                });
                            self._scrollPagingCtr.shiftToEdge(direction, hasMoreData);
                        }
                    } else {
                        scrollToEdgePromiseResolver();
                    }
                })
                .catch((error) => {
                    return error;
                });
        } else if (direction === 'up') {
            self._userScroll = true;
            self._scrolledToEdge = true;
            self._listViewModel.setTrackedValuesVisible(false);
            self._listVirtualScrollController.scrollToEdge('backward').then((key) => {
                self._scrolled = true;
                _private.updateScrollPagingButtons(self, {
                    ...self._getScrollParams(),
                    initial: !self._scrolled,
                });

                self._options.onAfterPagingCompatible(key, self, self._options);
                scrollToEdgePromiseResolver();
            });
            if (self._scrollPagingCtr) {
                self._currentPage = 1;
                self._scrollPagingCtr.shiftToEdge(direction, hasMoreData);
            }
        } else {
            self._scrolledToEdge = true;
            self._listViewModel.setTrackedValuesVisible(true);
            _private.jumpToEnd(self).then(() => {
                if (self._scrollPagingCtr) {
                    self._currentPage = self._pagingCfg.pagesCount;
                    self._scrollPagingCtr.shiftToEdge(direction, hasMoreData);
                }
                scrollToEdgePromiseResolver();
            });
        }
        return scrollToEdgePromise;
    },
    scrollPage(self: BaseControl, direction: ScrollControllerLib.IDirection): void {
        const directionCompatibility = direction === 'Up' ? 'backward' : 'forward';
        self._userScroll = true;
        self._listVirtualScrollController.scrollToPage(directionCompatibility).then((key) => {
            self._options.onAfterPagingCompatible(key, self, self._options);
        });
    },

    calcViewSize(viewSize: number, pagingVisible: boolean, pagingPadding: number): number {
        return viewSize - (pagingVisible ? pagingPadding : 0);
    },
    needShowPagingByScrollSize(self: BaseControl, viewSize: number, viewportSize: number): boolean {
        const hasScroll = viewSize > viewportSize;
        let result = self._pagingVisible;

        // если есть Еще данные, мы не знаем сколько их всего, превышают два вьюпорта или нет и покажем пэйдджинг
        const hasMoreData = {
            up: self._hasMoreData('up'),
            down: self._hasMoreData('down'),
        };

        // если мы для списка раз вычислили, что нужен пэйджинг, то возвращаем этот статус
        // это нужно для ситуации, если первая пачка данных вернула естьЕще (в этом случае пэйджинг нужен)
        // а вторая вернула мало записей и суммарный объем менее двух вьюпортов, пэйджинг не должен исчезнуть
        if (self._sourceController) {
            // если естьЕще данные, мы не знаем сколько их всего, превышают два вьюпорта или нет и покажем пэйдджинг
            // но если загрузка все еще идет не будем показывать пэджинг
            // далее может быть два варианта. След запрос вернет данные, тогда произойдет ресайз и мы проверим еще раз
            // след. запрос не вернет данные, а скажет ЕстьЕще: false тогда решать будет условие ниже, по высоте
            if ((hasMoreData.up || hasMoreData.down) && hasScroll) {
                if (self._sourceController.isLoading()) {
                    self._recalcPagingVisible = true;
                } else {
                    result = true;
                    // Если пэйджинг был показан из-за hasMore, то запоминаем это,
                    // чтобы не скрыть после полной загрузки, даже если не набралось на две страницы.
                    self._cachedPagingState = true;
                }
            }
        }

        /*
         * Правильнее будет проверять что размер viewport не равен 0.
         * Это нужно для того, чтобы пэйджинг в таком случае не отобразился.
         * viewport может быть равен 0 в том случае, когда блок скрыт через display:none, а после становится видим.
         */
        if (viewportSize !== 0) {
            let pagingPadding = self._pagingPadding;
            if (pagingPadding === null) {
                pagingPadding = self._isPagingPadding() ? PAGING_PADDING : 0;
            }
            const scrollHeight = Math.max(
                _private.calcViewSize(viewSize, result, pagingPadding),
                0
            );
            const proportion = scrollHeight / viewportSize;

            if (proportion > 0) {
                // начиличе пэйджинга зависит от того превышают данные два вьюпорта или нет
                if (!result) {
                    result = proportion >= MIN_SCROLL_PAGING_SHOW_PROPORTION;
                }

                // если все данные поместились на один экран, то скрываем пэйджинг
                if (result) {
                    result = proportion > MAX_SCROLL_PAGING_HIDE_PROPORTION;
                }
            } else {
                self._cachedPagingState = false;
                result = false;
            }
        } else {
            result = false;
        }

        if (self._cachedPagingState === true) {
            result = true;
        }

        if (
            !self._scrollPagingCtr &&
            result &&
            _private.needScrollPaging(self._options.navigation, self._options.isAdaptive)
        ) {
            _private.createScrollPagingController(self, hasMoreData);
        }
        return result;
    },

    onScrollShow(self: BaseControl): void {
        _private.doAfterUpdate(self, () => {
            if (_private.needScrollPaging(self._options.navigation, self._options.isAdaptive)) {
                _private.getScrollPagingControllerWithCallback(self, (scrollPagingCtr) => {
                    self._scrollPagingCtr = scrollPagingCtr;
                });
            }
        });
        self._isScrollShown = true;
    },

    onScrollHide(self: BaseControl): void {
        _private.doAfterUpdate(self, () => {
            if (self._pagingVisible) {
                self._pagingVisible = false;
                if (self._cachedPagingState) {
                    self._recalcPagingVisible = true;
                }
            }
            self._cachedPagingState = false;
        });
        self._isScrollShown = false;
    },

    getScrollPagingControllerWithCallback(self: BaseControl, callback: Function): void {
        if (self._scrollPagingCtr) {
            callback(self._scrollPagingCtr);
        } else {
            if (self._pagingVisible) {
                const hasMoreData = {
                    up: self._hasMoreData('up'),
                    down: self._hasMoreData('down'),
                };
                _private.createScrollPagingController(self, hasMoreData).then((scrollPaging) => {
                    self._scrollPagingCtr = scrollPaging;
                    callback(scrollPaging);
                });
            }
        }
    },

    prepareScrollPagingControllerOptions(self: BaseControl, options: IBaseControlOptions): object {
        let elementsCount;
        const scrollParams = self._getScrollParams();
        if (self._sourceController) {
            elementsCount = _private.getAllDataCount(self);
            if (typeof elementsCount !== 'number') {
                elementsCount = undefined;
            }
        }
        return {
            pagingMode: options.navigation.viewConfig?.pagingMode,
            digitRenderCallback: options.navigation.viewConfig?.digitRenderCallback,
            scrollParams: { ...scrollParams, initial: true },
            showEndButton: options.navigation.viewConfig?.showEndButton,
            resetButtonMode: options.navigation.viewConfig?.resetButtonMode,
            totalElementsCount: elementsCount,
            loadedElementsCount:
                self._listViewModel.getStopIndex() - self._listViewModel.getStartIndex(),
            pagingCfgTrigger: (cfg) => {
                if (cfg?.selectedPage !== self._currentPage && !self._selectedPageHasChanged) {
                    self._currentPage = cfg.selectedPage;
                } else {
                    self._selectedPageHasChanged = false;
                }
                if (!isEqual(self._pagingCfg, cfg)) {
                    self._pagingCfg = cfg;
                    self._forceUpdate();
                }
            },
        };
    },

    createScrollPagingController(
        self: BaseControl,
        hasMoreData: boolean
    ): Promise<ScrollPagingController> {
        const scrollPagingConfig = _private.prepareScrollPagingControllerOptions(
            self,
            self._options
        );
        self._scrollPagingCtr = new ScrollPagingController(scrollPagingConfig, hasMoreData);
        return Promise.resolve(self._scrollPagingCtr);
    },

    updateScrollPagingController(self: BaseControl, options: IBaseControlOptions): void {
        const hasMoreData = _private.getHasMoreData(self);
        const scrollPagingConfig = _private.prepareScrollPagingControllerOptions(self, options);
        self._scrollPagingCtr.updateOptions(scrollPagingConfig, hasMoreData);
        if (self._pagingNavigation) {
            _private.updatePagingData(self, self._listViewModel.getMetaData().more, options);
        }
    },

    updateScrollPagingButtons(self: BaseControl, scrollParams: IScrollParams): void {
        _private.getScrollPagingControllerWithCallback(self, (scrollPaging) => {
            const hasMoreData = {
                up: self._hasMoreData('up'),
                down: self._hasMoreData('down'),
            };
            scrollPaging.updateScrollParams(scrollParams, hasMoreData);
        });
    },

    /**
     * Обработать прокрутку списка виртуальным скроллом
     */
    handleListScroll(self: BaseControl): void {
        if (_private.hasHoverFreezeController(self) && _private.isAllowedHoverFreeze(self)) {
            self._hoverFreezeController.unfreezeHover();
        }
    },

    getTopOffsetForItemsContainer(self: BaseControl, itemsContainer: HTMLElement): number {
        let offsetTop = uDimension(itemsContainer.children[0], true).top;
        const container = self._container[0] || self._container;
        offsetTop += container.offsetTop - uDimension(container).top;
        return offsetTop;
    },

    // throttle нужен, чтобы при потоке одинаковых событий не пересчитывать состояние на каждое из них
    throttledVirtualScrollPositionChanged: throttle(
        (self, params) => {
            if (!self._destroyed) {
                self._listVirtualScrollController.virtualScrollPositionChange(
                    params.scrollTop,
                    params.applyScrollTopCallback
                );
            }
        },
        SCROLLMOVE_DELAY,
        true
    ),

    /**
     * Инициализируем paging если он не создан
     * @private
     */
    initPaging(self: BaseControl): void {
        if (
            !(self._editInPlaceController && self._editInPlaceController.isEditing()) &&
            _private.needScrollPaging(self._options.navigation, self._options.isAdaptive)
        ) {
            if (self._viewportHeight) {
                self._recalcPagingVisible = false;

                // Для вычислений берем полную высоту списка, включая отсеченные виртуальным скроллом части.
                // Размер виртуальной страницы может быть меньше, чем два вьюпорта, тогда мы не покажем пейджинг,
                // если будем смотреть на размер из dom
                const placeholdersSize =
                    self._placeholders?.backward + self._placeholders?.forward || 0;
                const fullSize = self._contentHeight + placeholdersSize;
                const isPagingVisible = _private.needShowPagingByScrollSize(
                    self,
                    fullSize,
                    self._viewportHeight
                );
                const callback = () => {
                    if (self._isMounted) {
                        const placeholdersSize =
                            self._placeholders?.backward + self._placeholders?.forward || 0;
                        const fullSize = self._contentHeight + placeholdersSize;

                        // Пока загружался модуль, размеры могли измениться, и пейджинг уже может быть не нужен.
                        self._pagingVisible =
                            isPagingVisible &&
                            _private.needShowPagingByScrollSize(
                                self,
                                fullSize,
                                self._viewportHeight
                            );
                        self._pagingVisibilityChanged = self._pagingVisible;
                        if (detection.isMobilePlatform) {
                            self._recalcPagingVisible = !self._pagingVisible;
                        }
                    }
                };
                if (isPagingVisible) {
                    self._doAfterPagingModuleLoaded(callback, self._options);
                } else {
                    callback();
                }
            } else {
                self._recalcPagingVisible = true;
            }
        } else {
            self._pagingVisible = false;
        }
    },

    handleListScrollSync(self: BaseControl, scrollTop: number): void {
        if (
            !self._pagingVisible &&
            (!self._wasPreloadedDataToBackward || !self._scrollControllerInitializeChangeScroll)
        ) {
            _private.initPaging(self);
        }

        if (!self._scrollControllerInitializeChangeScroll || self._scrolledToEdge) {
            self._scrolled = true;
        }
        // TODO SCROLL избавиться от scrollTop в BaseControl
        // на мобильных устройствах с overflow scrolling, scrollTop может быть отрицательным
        self._scrollTop = scrollTop > 0 ? scrollTop : 0;
        if (_private.needScrollPaging(self._options.navigation, self._options.isAdaptive)) {
            _private.updateScrollPagingButtons(self, {
                ...self._getScrollParams(),
                initial: !self._scrolled,
            });
        }
        const isRealScroll = !self._scrollControllerInitializeChangeScroll || self._userScroll;
        if (self._options.trackedProperties?.length && isRealScroll && !self._scrolledToEdge) {
            const trackedValuesVisible =
                self._scrollTop + self._placeholders?.backward > 0 ||
                (self._isScrollShown && self._hasMoreData('up'));
            const changed = self._listViewModel.setTrackedValuesVisible(trackedValuesVisible);
            if (changed || trackedValuesVisible) {
                self._updateTrackedValues();
            }
        }
        self._scrollControllerInitializeChangeScroll = false;
        self._userScroll = false;
        self._scrolledToEdge = false;
    },

    isPortionedLoad(self: BaseControl, items: RecordSet = self._items): boolean {
        const metaData = items?.getMetaData();
        return !!(metaData && metaData[PORTIONED_LOAD_META_FIELD]);
    },

    allowLoadMoreByPortionedSearch(self: BaseControl, direction: 'up' | 'down'): boolean {
        const portionedSearchDirection = self._indicatorsController.getPortionedSearchDirection();
        return (
            (!portionedSearchDirection || portionedSearchDirection !== direction) &&
            self._indicatorsController.shouldContinueDisplayPortionedSearch()
        );
    },

    updateShadowMode(self: BaseControl, shadowVisibility: { up: boolean; down: boolean }): void {
        const itemsCount = self._listViewModel && self._listViewModel.getCount();
        const hasMoreData = (direction: ScrollControllerLib.IDirection) => {
            return self._hasMoreData(direction);
        };
        const showShadowByNavigation = _private.needShowShadowByNavigation(
            self._options.navigation,
            itemsCount
        );
        const showShadowUpByPortionedSearch = _private.allowLoadMoreByPortionedSearch(self, 'up');
        const showShadowDownByPortionedSearch = _private.allowLoadMoreByPortionedSearch(
            self,
            'down'
        );

        self._options.notifyCallback(
            'updateShadowMode',
            [
                {
                    top:
                        shadowVisibility?.up ||
                        (showShadowByNavigation &&
                            showShadowUpByPortionedSearch &&
                            itemsCount &&
                            hasMoreData('up'))
                            ? 'visible'
                            : 'auto',
                    bottom:
                        shadowVisibility?.down ||
                        (showShadowByNavigation &&
                            showShadowDownByPortionedSearch &&
                            itemsCount &&
                            hasMoreData('down'))
                            ? 'visible'
                            : 'auto',
                },
            ],
            { bubbling: true }
        );
    },

    needScrollCalculation(
        navigationOpt: INavigationOptionValue<INavigationSourceConfig>,
        virtualScrollConfig: object
    ): boolean {
        // Виртуальный скролл должен работать, даже если у списка не настроена навигация.
        // https://online.sbis.ru/opendoc.html?guid=a83180cf-3e02-4d5d-b632-3d03442ceaa9
        return (
            !navigationOpt ||
            (navigationOpt && navigationOpt.view === 'infinity') ||
            !!virtualScrollConfig?.pageSize
        );
    },

    needScrollPaging(
        navigationOpt: INavigationOptionValue<INavigationSourceConfig>,
        isAdaptive: boolean
    ): boolean {
        return (
            !isAdaptive &&
            navigationOpt &&
            navigationOpt.view === 'infinity' &&
            navigationOpt.viewConfig &&
            navigationOpt.viewConfig.pagingMode &&
            navigationOpt.viewConfig.pagingMode !== 'hidden'
        );
    },

    getItemsCount(self: BaseControl): number {
        return self._listViewModel ? self._listViewModel.getCount() : 0;
    },

    /**
     * Закрывает меню опций записи у активной записи, если она есть в списке изменённых или удалённых
     * @param self
     * @param items список изменённых или удалённых из модели записей
     */
    closeItemActionsMenuForActiveItem(self: BaseControl, items: CollectionItem<Model>[]): void {
        const activeItem = self._itemActionsController.getActiveItem();
        let activeItemContents;
        if (activeItem) {
            activeItemContents = getPlainItemContents(activeItem);
        }
        if (
            activeItemContents &&
            items &&
            items.find((item) => {
                if (!item.SupportItemActions) {
                    return false;
                }
                const itemContents = getPlainItemContents(item);
                return itemContents?.getKey() === activeItemContents.getKey();
            })
        ) {
            _private.closeActionsMenu(self);
        }
    },

    onCollectionChanged(
        self: BaseControl,
        event: SyntheticEvent,
        changesType: string,
        action: string,
        newItems: CollectionItem<Model>[],
        newItemsIndex: number,
        removedItems: CollectionItem<Model>[],
        removedItemsIndex: number,
        reason: string
    ): void {
        const options = self._newOptions || self._options;

        // TODO Понять, какое ускорение мы получим, если будем лучше фильтровать
        // изменения по changesType в новой модели
        const newModelChanged = _private.isNewModelItemsChange(action, newItems);

        if (self._pagingNavigation) {
            if (action === IObservable.ACTION_REMOVE || action === IObservable.ACTION_ADD) {
                _private.updatePagingData(self, self._listViewModel.getMetaData().more, options);
            }
            if (action === IObservable.ACTION_RESET) {
                if (self._updatePagingOnResetItems) {
                    self._knownPagesCount = INITIAL_PAGES_COUNT;
                    _private.updatePagingData(
                        self,
                        self._listViewModel.getMetaData().more,
                        options
                    );
                }
                self._updatePagingOnResetItems = true;
            }
        }

        // Обработка удаления должна происходить на afterCollectionChanged.
        // Это позволяет при удалении записей в цикле по одной
        // учитывать актуальные индексы диапазона виртуального скролла,
        // и выполнять обработку selection для всех удалённых записей.
        if (action === IObservable.ACTION_REMOVE) {
            self._removedItemsByOneSession.push(removedItems);
        }
        if (action === IObservable.ACTION_ADD) {
            self._addedItemsByOneSession.push(newItems);
        }

        self._onCollectionChangedScroll(
            action,
            newItems,
            newItemsIndex,
            removedItems,
            removedItemsIndex
        );

        if (changesType === 'collectionChanged' || newModelChanged) {
            if (options.navigation && options.navigation.source) {
                const itemsCount = self._listViewModel.getCount();
                const moreMetaCount = _private.getAllDataCount(self);

                if (typeof moreMetaCount === 'number') {
                    if (itemsCount !== moreMetaCount) {
                        _private.prepareFooter(self, options, self._sourceController);
                    } else {
                        self._shouldDrawNavigationButton = _private.isCutNavigation(
                            options.navigation
                        )
                            ? self._cutExpanded
                            : false;
                    }
                } else if (moreMetaCount) {
                    _private.prepareFooter(self, options, self._sourceController);
                } else {
                    self._shouldDrawNavigationButton = _private.isCutNavigation(options.navigation)
                        ? self._cutExpanded
                        : false;
                }
            }

            if (self._scrollPagingCtr && action === IObservable.ACTION_RESET) {
                if (self._resetPagingOnResetItems) {
                    self._scrollPagingCtr = null;

                    // Если после перезагрузки осталось 0 записей, то скрываем пейджинг сразу,
                    // чтобы он изчез вместе с появлением пустого представления, а не потом по ресайзу
                    if (newItems.length === 0) {
                        self._pagingVisible = false;
                    }
                }
                self._resetPagingOnResetItems = true;
            }

            // Тут вызывается nextVersion на коллекции, и это приводит к вызову итератора.
            // Поэтому это должно быть после обработки изменений коллекции scrollController'ом, чтобы итератор
            // вызывался с актуальными индексами
            if (
                action === IObservable.ACTION_REMOVE ||
                action === IObservable.ACTION_REPLACE ||
                action === IObservable.ACTION_RESET
            ) {
                if (self._isActionsMenuOpened) {
                    _private.closeItemActionsMenuForActiveItem(self, removedItems);
                }
            }

            // Сбрасывать hoverFreezer стоит при любых действиях с моделью, будь то добавление,
            // удаление или reset коллекции
            if (action && _private.hasHoverFreezeController(self)) {
                self._hoverFreezeController.unfreezeHover();
            }

            // Изначально могло не создаться selectionController (не был задан source), но в целом работа с выделением
            // нужна и когда items появляются (событие reset) - обрабатываем это.
            // https://online.sbis.ru/opendoc.html?guid=454ba08b-758a-4a39-86cb-7a6d0cd30c44
            const handleSelection =
                action === IObservable.ACTION_RESET &&
                options.selectedKeys &&
                options.selectedKeys.length &&
                options.multiSelectVisibility !== 'hidden';
            if (self._hasSelectionController() || handleSelection) {
                const selectionController = self._getSelectionController();

                let newSelection;
                switch (action) {
                    case IObservable.ACTION_ADD:
                        newSelection = selectionController.onCollectionAdd(newItems, newItemsIndex);
                        checkWasabyEvent(self._options.listSelectedKeysCountChangedCallback)?.(
                            selectionController.getCountOfSelected(),
                            selectionController.isAllSelected()
                        );
                        self._options.notifyCallback('listSelectedKeysCountChanged', [
                            selectionController.getCountOfSelected(),
                            selectionController.isAllSelected(),
                        ]);
                        break;
                    case IObservable.ACTION_RESET:
                        const entryPath = self._listViewModel.getMetaData().ENTRY_PATH;
                        const filter = self._sourceController?.getFilter();
                        const sorting = self._sourceController?.getSorting();
                        newSelection = selectionController.onCollectionReset(
                            entryPath,
                            filter,
                            sorting
                        );
                        // Могут сделать перезагрузку и вернуть другое кол-во записей.
                        // selection не поменялся, но кол-во нужно обновить.
                        if (selectionController.isAllSelected(false)) {
                            checkWasabyEvent(self._options.listSelectedKeysCountChangedCallback)?.(
                                selectionController.getCountOfSelected(),
                                selectionController.isAllSelected()
                            );
                            self._options.notifyCallback('listSelectedKeysCountChanged', [
                                selectionController.getCountOfSelected(),
                                selectionController.isAllSelected(),
                            ]);
                        }
                        break;
                    case IObservable.ACTION_REPLACE:
                        selectionController.onCollectionReplace(newItems);
                        break;
                    case IObservable.ACTION_MOVE:
                        selectionController.onCollectionMove();
                        break;
                }

                if (newSelection) {
                    self._changeSelection(newSelection);
                }
            }

            self._options.slicelessHandleCollectionChange?.(
                self,
                self._options,
                action,
                newItems,
                newItemsIndex,
                removedItems,
                removedItemsIndex
            );
        }

        if (action === IObservable.ACTION_RESET && self._itemActionsController?.isSwiped()) {
            _private.closeSwipe(self);
        }

        const contentsChanged =
            action === IObservable.ACTION_CHANGE && newItems.properties === 'contents';
        if (changesType === 'collectionChanged' || newModelChanged || contentsChanged) {
            self._itemsChanged = true;
            if (!!self._itemActionsController && !self._shouldUpdateActionsAfterRender) {
                self._shouldUpdateActionsAfterRender =
                    self._itemActionsController.shouldUpdateOnCollectionChange(
                        action,
                        newItems,
                        removedItems
                    );
            }
        }

        if (reason === 'assign' && options.itemsSetCallback) {
            options.itemsSetCallback();
        }
    },

    /**
     * Получает контейнер для
     * @param self
     * @param item
     * @param clickEvent
     * @param isMenuClick
     */
    resolveItemContainer(
        self: BaseControl,
        item: CollectionItem,
        clickEvent: SyntheticEvent,
        isMenuClick: boolean
    ): HTMLElement | undefined {
        let container: HTMLElement | undefined;
        if (item) {
            // Контейнер при клике в меню нужно резолвить по ключу, потому что из события его не достанешь: текущий
            // таргет - элемент из меню. Единственное, что мы знаем - ключ записи.
            if (isMenuClick) {
                container = self._getItemContainerByKey(item.key);
            }
            // Если ничего не нашли, то ищем по уникальному селектору
            if (!container) {
                const itemSelector = `.${self._getItemsContainerUniqueClass()} .controls-ListView__itemV[item-key='${
                    item.key
                }']`;
                container = self._container.querySelector(itemSelector) as HTMLElement;
            }
        }
        return container;
    },

    /**
     * Обрабатывает клик по записи и отправляет событие actionClick наверх
     * @param self
     * @param action
     * @param clickEvent
     * @param item
     * @param isMenuClick
     */
    handleItemActionClick(
        self: BaseControl,
        action: IShownItemAction,
        clickEvent: SyntheticEvent<MouseEvent>,
        item: CollectionItem<Model>,
        isMenuClick: boolean
    ): void {
        if (action.id === EDITING_APPLY_BUTTON_KEY) {
            self._commitEditActionHandler(item);
            return;
        }

        if (action.id === EDITING_CLOSE_BUTTON_KEY) {
            self._cancelEditActionHandler();
            return;
        }

        self._addCoordinatesToActionMenuEvent(clickEvent?.nativeEvent?.target);

        // TODO нужно заменить на item.getContents() при переписывании моделей.
        //  item.getContents() должен возвращать Record
        //  https://online.sbis.ru/opendoc.html?guid=acd18e5d-3250-4e5d-87ba-96b937d8df13
        const contents = getPlainItemContents(item);
        // Контейнер нужен прикладнику. От него выстраивают, например, координаты попапа с уведомлением.
        const itemContainer = _private.resolveItemContainer(self, item, clickEvent, isMenuClick);
        const result = self._options.notifyCallback('actionClick', [
            action,
            contents,
            itemContainer,
            clickEvent.nativeEvent,
        ]);
        if (action.handler) {
            action.handler(contents, itemContainer, clickEvent.nativeEvent);
        }
        if (result !== false) {
            _private.closeActionsMenu(self);
        }
        if (self._itemActionsController?.isSwiped()) {
            self._itemActionsController.deactivateSwipe(true);
        }
    },

    /**
     * Открывает меню операций
     * @param self
     * @param clickEvent
     * @param item
     * @param menuConfig
     */
    openItemActionsMenu(
        self: BaseControl,
        clickEvent: SyntheticEvent<MouseEvent>,
        item: CollectionItem<Model>,
        menuConfig: Record<string, unknown>
    ): Promise<void> {
        menuConfig.eventHandlers = {
            onResult: self._onItemActionsMenuResult,
            onOpen: () => {
                return self._onItemActionsMenuResult('onOpen');
            },
            onClose(): void {
                _private.closeActionsMenu(self);
            },
        };
        return self._stickyOpener.open(menuConfig).then(() => {
            // Устанавливаем состояние "меню открыто"
            self._isActionsMenuOpened = self._stickyOpener.isOpened();
            // Нельзя устанавливать activeItem раньше, иначе при автокликах
            // робот будет открывать меню раньше, чем оно закрылось.
            self._getItemActionsController().setActiveItem(item);
        });
    },

    /**
     * Метод, который закрывает меню
     * @param self
     * @private
     */
    closeActionsMenu(self: BaseControl): void {
        // При разрушении список сам закрывает меню.
        // Пока меню закроется и отстрелит колбек, список полностью разрушится.
        if (!self._destroyed && self._isActionsMenuOpened) {
            _private.closePopup(self);
            // При быстром клике правой кнопкой обработчик закрытия меню и setActiveItem(null)
            // вызывается позже, чем устанавливается новый activeItem. в результате, при попытке
            // взаимодействия с опциями записи, может возникать ошибка, т.к. activeItem уже null.
            // Для обхода проблемы ставим условие, что занулять active item нужно только тогда, когда
            // закрываем самое последнее открытое меню.
            const itemActionsController = self._getItemActionsController();
            if (self._allowResetActiveItem !== false) {
                itemActionsController.setActiveItem(null);
            }
            itemActionsController.deactivateSwipe();
            // Если ховер заморожен для редактирования по месту, не надо сбрасывать заморозку.
            if (!self._editInPlaceController || !self._editInPlaceController.isEditing()) {
                _private.addShowActionsClass(self, self._options);
            }
        }
    },

    openContextMenu(
        self: typeof BaseControl,
        event: SyntheticEvent<MouseEvent>,
        itemData: CollectionItem<Model>
    ): void {
        if (
            !(itemData.dispItem
                ? itemData.dispItem.SupportItemActions
                : itemData.SupportItemActions)
        ) {
            return;
        }

        event.stopPropagation();
        // TODO нужно заменить на item.getContents() при переписывании моделей.
        //  item.getContents() должен возвращать Record
        //  https://online.sbis.ru/opendoc.html?guid=acd18e5d-3250-4e5d-87ba-96b937d8df13
        const contents = getPlainItemContents(itemData);
        const key = contents ? contents.getKey() : itemData.key;
        self._options.mark(key, self, self._options);

        // Этот метод вызывается также и в реестрах, где не инициализируется this._itemActionsController
        if (!!self._itemActionsController) {
            const item = self._listViewModel.getItemBySourceKey(key) || itemData;
            const menuConfig = _private.getItemActionsMenuConfig(self, item, event, null, true);
            if (menuConfig) {
                event.nativeEvent.preventDefault();
                _private.openItemActionsMenu(self, event, item, menuConfig);
            }
        }
    },

    /**
     * Закрывает popup меню
     * @param self
     * @param isActionsMenuOpened id popup, который надо закрыть. Если не указано - берём текущий self._isActionsMenuOpened
     * иногла можно не дождавшимь показа меню случайно вызвать второе менню поверх превого.
     * Это случается от того, что поуказ меню асинхронный и возвращает Promise, который мы не можем отменить.
     * При этом закрытие меню внутри самого Promise повлечёт за собой асинхронный вызов "_onItemActionsMenuClose()",
     * что приведёт к закрытию всех текущих popup на странице.
     * Зато мы можем получить объект Popup, который мы пытаемся закрыть, и, соответственно, его id. Таким образом, мы можем
     * указать, какой именно popup мы закрываем.
     */
    closePopup(self: BaseControl, isActionsMenuOpened: boolean = self._isActionsMenuOpened): void {
        if (!isActionsMenuOpened) {
            return;
        }
        self._stickyOpener.close();
        self._isActionsMenuOpened = false;
    },

    groupsExpandChangeHandler(
        self: BaseControl,
        changes: {
            collapsedGroups: (string | number)[];
            changeType: string;
            group: string;
        }
    ): void {
        self._options.notifyCallback(
            changes.changeType === 'expand' ? 'groupExpanded' : 'groupCollapsed',
            [changes.group],
            { bubbling: true }
        );
        self._options.notifyCallback('collapsedGroupsChanged', [changes.collapsedGroups]);
        _private.prepareFooter(self, self._options, self._sourceController);
        if (self._options.historyIdCollapsedGroups || self._options.groupHistoryId) {
            groupUtil.storeCollapsedGroups(
                changes.collapsedGroups,
                self._options.historyIdCollapsedGroups || self._options.groupHistoryId
            );
        }
    },

    getSortingOnChange(currentSorting, propName: string, canResetSorting: boolean = true) {
        let sorting = cClone(currentSorting || []);
        let sortElem;
        const newSortElem = {};

        if (sorting.length === 1 && sorting[0][propName]) {
            const elem = sorting[0];
            if (elem.hasOwnProperty(propName)) {
                sortElem = elem;
            }
        } else {
            sorting = [];
        }

        // change sorting direction by rules:
        // 'DESC' -> 'ASC'
        // 'ASC' -> empty
        // empty -> 'DESC'
        if (sortElem) {
            if (sortElem[propName] === 'DESC') {
                sortElem[propName] = 'ASC';
            } else if (canResetSorting) {
                sorting = [];
            } else {
                sortElem[propName] = 'DESC';
            }
        } else {
            newSortElem[propName] = 'DESC';
            sorting.push(newSortElem);
        }

        return sorting;
    },

    calcPaging(self: BaseControl, hasMore: number | boolean, pageSize: number): number {
        let newKnownPagesCount = self._knownPagesCount;

        if (typeof hasMore === 'number') {
            newKnownPagesCount = Math.ceil(hasMore / pageSize);
        } else if (
            typeof hasMore === 'boolean' &&
            hasMore &&
            self._currentPage === self._knownPagesCount
        ) {
            newKnownPagesCount++;
        }

        return newKnownPagesCount;
    },

    getPagingLabelData(totalItemsCount: number, pageSize: number, currentPage: number) {
        let pagingLabelData;
        if (typeof totalItemsCount === 'number') {
            pagingLabelData = {
                totalItemsCount,
                pageSize: pageSize.toString(),
                firstItemNumber: (currentPage - 1) * pageSize + 1,
                lastItemNumber: Math.min(currentPage * pageSize, totalItemsCount),
            };
        } else {
            pagingLabelData = null;
        }
        return pagingLabelData;
    },

    checkRequiredOptions(self: BaseControl): void {
        if (!self._keyProperty) {
            Logger.error('IList: Option "keyProperty" is required.');
        }
    },

    isPagingNavigation(navigation: INavigationOptionValue<INavigationSourceConfig>): boolean {
        return navigation && navigation.view === 'pages';
    },

    isPagingNavigationVisible(self: BaseControl, hasMoreData: boolean, options): boolean {
        const navigation = options.navigation;
        if (navigation?.viewConfig?.pagingMode === 'hidden') {
            return false;
        }

        /*
         * Не получится получать количество элементов через _private.getItemsCount,
         * так как функция возвращает количество отображаемых элементов
         */
        if (navigation && navigation.viewConfig && navigation.viewConfig.totalInfo === 'extended') {
            return hasMoreData > PAGING_MIN_ELEMENTS_COUNT || hasMoreData === true;
        }

        return hasMoreData === true || self._knownPagesCount > 1;
    },

    updatePagingData(self: BaseControl, hasMoreData: boolean, options): void {
        self._pagingCfg = {
            arrowState: {
                begin: 'visible',
                prev: 'visible',
                next: 'visible',
                end: options.navigation?.viewConfig?.showEndButton ? 'visible' : 'hidden',
            },
        };
        self._knownPagesCount = _private.calcPaging(self, hasMoreData, self._currentPageSize);
        const pagingNavigationVisible = _private.isPagingNavigationVisible(
            self,
            hasMoreData,
            options
        );

        const doAfterPagingModuleLoaded = () => {
            self._pagingNavigationVisible = pagingNavigationVisible;
            self._pagingLabelData = _private.getPagingLabelData(
                hasMoreData,
                self._currentPageSize,
                self._currentPage
            );
            self._selectedPageSizeKey = PAGE_SIZE_ARRAY.find((item) => {
                return item.pageSize === self._currentPageSize;
            });
            self._selectedPageSizeKey = self._selectedPageSizeKey
                ? [self._selectedPageSizeKey.id]
                : [1];
        };

        // Если постраничная навигация будет видна и модуль Controls/paging не загружен - загружаем.
        if (pagingNavigationVisible) {
            self._doAfterPagingModuleLoaded(doAfterPagingModuleLoaded, options);
        } else {
            doAfterPagingModuleLoaded();
        }
    },

    resetPagingNavigation(
        self: BaseControl,
        navigation: INavigationOptionValue<INavigationSourceConfig>
    ): void {
        self._currentPageSize =
            (navigation && navigation.sourceConfig && navigation.sourceConfig.pageSize) || 1;

        self._knownPagesCount = self._items
            ? _private.calcPaging(
                  self,
                  self._listViewModel.getMetaData().more,
                  self._currentPageSize
              )
            : INITIAL_PAGES_COUNT;

        _private.resetPagingNavigationPage(self, navigation);
    },

    resetPagingNavigationPage(
        self: BaseControl,
        navigation: INavigationOptionValue<INavigationSourceConfig>
    ): void {
        // нумерация страниц пейджинга начинается с 1, а не с 0,
        // поэтому текущая страница пейджига это страница навигации + 1
        self._currentPage =
            (navigation && navigation.sourceConfig && navigation.sourceConfig.page + 1) ||
            INITIAL_PAGES_COUNT;
    },

    initializeNavigation(self: BaseControl, cfg: IBaseControlOptions): void {
        self._pagingNavigation = _private.isPagingNavigation(cfg.navigation);
        self._lastSourceConfig = null;
        if (
            !_private.isDemandNavigation(cfg.navigation) &&
            !_private.isCutNavigation(cfg.navigation)
        ) {
            self._shouldDrawNavigationButton = false;
        }
        if (!_private.needScrollCalculation(cfg.navigation, cfg.virtualScrollConfig)) {
            if (self._scrollPagingCtr) {
                self._scrollPagingCtr.destroy();
                self._scrollPagingCtr = null;
            }
            self._pagingCfg = null;
            if (self._pagingVisible) {
                self._pagingVisible = false;
            }
        } else {
            if (self._scrollPagingCtr) {
                if (_private.needScrollPaging(cfg.navigation, cfg.isAdaptive)) {
                    _private.updateScrollPagingController(self, cfg);
                } else {
                    self._scrollPagingCtr.destroy();
                    self._scrollPagingCtr = null;
                }
            }
        }
        if (self._pagingNavigation) {
            _private.resetPagingNavigation(self, cfg.navigation);
            self._pageSizeItems = new RecordSet({
                keyProperty: 'id',
                rawData: PAGE_SIZE_ARRAY,
            });
        } else {
            self._pagingNavigationVisible = false;
            _private.resetPagingNavigation(self, cfg.navigation);
        }
    },
    closeEditingIfPageChanged(
        self: BaseControl,
        oldNavigation: INavigationOptionValue<INavigationSourceConfig>,
        newNavigation: INavigationOptionValue<INavigationSourceConfig>
    ): void {
        const oldSourceCfg =
            oldNavigation && oldNavigation.sourceConfig ? oldNavigation.sourceConfig : {};
        const newSourceCfg =
            newNavigation && newNavigation.sourceConfig ? newNavigation.sourceConfig : {};
        if (oldSourceCfg.page !== newSourceCfg.page) {
            if (_private.isEditing(self)) {
                self._cancelEdit();
            }
        }
    },
    setHasMoreData(model, hasMoreData: object, silent: boolean = false): void {
        if (model) {
            model.setHasMoreData(hasMoreData, silent);
        }
    },
    jumpToEnd(self: BaseControl): Promise<void> {
        // Если в списке нет записей, то мы уже в конце списка
        if (self._listViewModel.getCount() === 0) {
            return Promise.resolve();
        }

        const hasMoreData = {
            up: self._hasMoreData('up'),
            down: self._hasMoreData('down'),
        };
        if (self._scrollPagingCtr) {
            self._currentPage = self._pagingCfg.pagesCount;
            self._scrollPagingCtr.shiftToEdge('down', hasMoreData);
        }

        self._userScroll = true;
        return self._listVirtualScrollController.scrollToEdge('forward').then((key) => {
            self._scrolled = true;
            _private.updateScrollPagingButtons(self, {
                ...self._getScrollParams(),
                initial: false,
            });
            self._options.onAfterPagingCompatible(key, self, self._options);
            _private.updateScrollPagingButtons(self, self._getScrollParams());
        });
    },

    getFadeController(self: BaseControl, options: IList = self._options): FadeController {
        if (!self._fadeController) {
            self._fadeController = new FadeController({
                model: self._listViewModel,
                fadedKeys: options.fadedKeys,
            });
        }
        return self._fadeController;
    },

    updateFadeController(self: BaseControl, options: IList): void {
        _private.getFadeController(self, options).updateOptions({
            model: self._listViewModel,
            fadedKeys: options.fadedKeys,
        });
    },

    resolveItemActionsOptions(self: BaseControl, options: IList): IItemActionsControllerOptions {
        const editingConfig = self._listViewModel.getEditingConfig();
        let editArrowAction: IItemAction;
        if (options.showEditArrow) {
            editArrowAction = {
                id: 'view',
                icon: 'icon-Forward',
                title: rk('Просмотреть'),
                showType: TItemActionShowType.TOOLBAR,
                handler: (item) => {
                    self._options.notifyCallback('editArrowClick', [item]);
                },
            };
        }
        // @TODO task1185486106 до https://online.sbis.ru/opendoc.html?guid=899cef4b-27d9-4568-811e-29d1020a3856
        const iconSize =
            editingConfig && (options.task1185486106 || options.itemActionsPosition === 'outside')
                ? 's'
                : 'm';
        return {
            collection: self._listViewModel,
            itemActions: options.itemActions,
            itemActionsProperty: options.itemActionsProperty,
            visibilityCallback: options.itemActionVisibilityCallback,
            itemActionsPosition: options.itemActionsPosition,
            theme: options.theme,
            actionMode: options.actionMode,
            actionAlignment: options.actionAlignment,
            actionCaptionPosition: options.actionCaptionPosition,
            itemActionsClass: options.itemActionsClass,
            iconSize,
            menuIconSize: options.menuIconSize || 'm',
            editingToolbarVisible: editingConfig?.toolbarVisibility,
            editingStyle: editingConfig?.backgroundStyle,
            applyButtonStyle: editingConfig?.applyButtonStyle,
            editArrowAction,
            editArrowVisibilityCallback: options.editArrowVisibilityCallback,
            contextMenuConfig: options.contextMenuConfig,
            itemActionsVisibility: this.getItemActionsVisibilityByStyle(options),
            feature1183020440: options.feature1183020440,
            task1183329228: options.task1183329228,
        };
    },

    /**
     * Необходимо передавать опции для случая, когда в результате изменения модели меняются параметры
     * для показа ItemActions и их нужно поменять до отрисовки.
     * @param self
     * @param options
     * @param itemToUpdateActions Запись, на которой будут обновлены операции над записью
     * @private
     */
    updateItemActions(
        self: BaseControl,
        options: IList,
        itemToUpdateActions?: CollectionItem<Model>
    ): void {
        let itemActionsController: ItemActionsController;
        if (self._itemActionsController) {
            itemActionsController = self._itemActionsController;
            itemActionsController.updateOptions(_private.resolveItemActionsOptions(self, options));
        } else {
            itemActionsController = self._getItemActionsController(options);
            if (!itemActionsController) {
                return;
            }
        }

        const isActionsAssigned = itemActionsController.isActionsAssigned();

        const itemActionsChangeResult = itemActionsController.updateActions(itemToUpdateActions);
        if (itemActionsChangeResult.length > 0 && self._listViewModel.resetCachedItemData) {
            itemActionsChangeResult.forEach((recordKey: number | string) => {
                self._listViewModel.resetCachedItemData(recordKey);
            });
            self._listViewModel.nextModelVersion(!isActionsAssigned, 'itemActionsUpdated');
        }
    },

    /**
     * Вызывает расчёт itemActions, только в том случае, если это происходит впервые
     * @private
     */
    updateItemActionsOnce(self: BaseControl, options: IBaseControlOptions): void {
        if (
            self._listViewModel &&
            self._options.itemActionsVisibility !== 'visible' &&
            !self._itemActionsController?.isActionsAssigned()
        ) {
            _private.updateItemActions(self, options);
        }
    },

    /**
     * Обновляет ItemActions только в случае, если они были ранее проинициализированы
     * @param self
     * @param options
     * @param itemToUpdateActions
     * @private
     */
    updateInitializedItemActions(
        self: BaseControl,
        options: IBaseControlOptions,
        itemToUpdateActions?: CollectionItem<Model>
    ): void {
        if (self._listViewModel && self._itemActionsController?.isActionsAssigned()) {
            _private.updateItemActions(self, options, itemToUpdateActions);
        }
    },

    /**
     * Деактивирует свайп, если контроллер ItemActions проинициализирован
     * @param self
     */
    closeSwipe(self: BaseControl): void {
        if (!self._listViewModel?.destroyed && self._itemActionsController?.isActionsAssigned()) {
            self._getItemActionsController().deactivateSwipe();
        }
    },

    /**
     * инициализирует опции записи при загрузке контрола
     * @param self
     * @param options
     * @private
     */
    initVisibleItemActions(self: BaseControl, options: IList): void {
        if (options.itemActionsVisibility === 'visible') {
            _private.addShowActionsClass(self, options);
            _private.updateItemActions(self, options);
        }
    },

    // region Drag-N-Drop

    isValidDndItemsEntity(dragStartResult: ItemsEntity, dragItemKey: CrudEntityKey): boolean {
        let isValid = true;
        if (
            !dragStartResult.getItems().every((item) => {
                return typeof item === 'string' || typeof item === 'number';
            })
        ) {
            Logger.error('ItemsEntity в поле items должен содержать только ключи записей.', this);
            isValid = false;
        }
        if (!dragStartResult.getItems().includes(dragItemKey)) {
            Logger.error(
                'ItemsEntity должен содержать ключ записи, за которую начали перетаскивание.',
                this
            );
            isValid = false;
        }
        return isValid;
    },

    // возвращаем промис для юнитов
    startDragNDrop(
        self: BaseControl,
        domEvent: SyntheticEvent,
        draggableItem: CollectionItem
    ): Promise<void> {
        const isDragging = self._dndListController && self._dndListController.isDragging();
        if (
            DndController.canStartDragNDrop(
                self._options.readOnly,
                self._options.itemsDragNDrop,
                self._options.canStartDragNDrop,
                domEvent
            ) &&
            !isDragging
        ) {
            const draggableKey = draggableItem.getContents().getKey();

            // Перемещать с помощью массового выбора
            // https://online.sbis.ru/opendoc.html?guid=080d3dd9-36ac-4210-8dfa-3f1ef33439aa
            let selection = {
                selected: self._options.selectedKeys || [],
                excluded: self._options.excludedKeys || [],
            };
            selection = DndController.getSelectionForDragNDrop(
                self._listViewModel,
                selection,
                draggableKey
            );

            self._dndListController = self._createDndListController(
                self._listViewModel,
                draggableItem
            );
            const options = self._getSourceControllerOptionsForGetDraggedItems(selection);
            return self._dndListController.getDraggableKeys(selection, options).then((items) => {
                let dragStartResult = self._options.notifyCallback('customdragStart', [
                    items,
                    draggableKey,
                ]);

                if (
                    dragStartResult instanceof ItemsEntity &&
                    !_private.isValidDndItemsEntity(dragStartResult, draggableKey)
                ) {
                    // ничего не делаем, чтобы не блочилась страница.
                    return;
                }

                if (dragStartResult === undefined) {
                    // Чтобы для работы dnd было достаточно опции itemsDragNDrop=true
                    dragStartResult = new ItemsEntity({ items });
                }

                if (dragStartResult) {
                    if (self._options.dragControlId) {
                        dragStartResult.dragControlId = self._options.dragControlId;
                    }

                    self._dragEntity = dragStartResult;
                    self._draggedKey = draggableKey;
                    self._startEvent = domEvent.nativeEvent;

                    _private.clearSelectedText(self._startEvent);
                    if (self._startEvent && self._startEvent.target) {
                        self._startEvent.target.classList.add('controls-DragNDrop__dragTarget');
                    }

                    self._registerMouseMove();
                    self._registerMouseUp();
                }
            });
        }
        return Promise.resolve();
    },

    getPageXY(event: SyntheticEvent): object {
        return DimensionsMeasurer.getMouseCoordsByMouseEvent(
            event.nativeEvent ? event.nativeEvent : event
        );
    },
    isDragStarted(
        startEvent: SyntheticEvent<MouseEvent>,
        moveEvent: SyntheticEvent<MouseEvent>
    ): boolean {
        const offset = _private.getDragOffset(moveEvent, startEvent);
        return Math.abs(offset.x) > DRAG_SHIFT_LIMIT || Math.abs(offset.y) > DRAG_SHIFT_LIMIT;
    },
    clearSelectedText(event: SyntheticEvent): void {
        if (event.type === 'mousedown') {
            // снимаем выделение с текста иначе не будут работать клики,
            // а выделение не будет сниматься по клику из за preventDefault
            const selection = window.getSelection();
            if (selection.removeAllRanges) {
                selection.removeAllRanges();
            } else if (selection.empty) {
                selection.empty();
            }
        }
    },
    getDragOffset(
        moveEvent: SyntheticEvent<MouseEvent>,
        startEvent: SyntheticEvent<MouseEvent>
    ): object {
        const moveEventXY = _private.getPageXY(moveEvent);
        const startEventXY = _private.getPageXY(startEvent);

        return {
            y: moveEventXY.y - startEventXY.y,
            x: moveEventXY.x - startEventXY.x,
        };
    },
    onMove(self: BaseControl, nativeEvent: Event): void {
        if (self._startEvent) {
            const dragObject = self._getDragObject(nativeEvent, self._startEvent);
            if (
                (!self._dndListController || !self._dndListController.isDragging()) &&
                _private.isDragStarted(self._startEvent, nativeEvent)
            ) {
                self._insideDragging = true;
                self._options.notifyCallback('_documentDragStart', [dragObject], {
                    bubbling: true,
                });
            }
            if (self._dndListController) {
                if (self._dndListController.isDragging()) {
                    // Проставляем правильное значение флага. Если в начале днд резко утащить за пределы списка,
                    // то может не отработать mouseLeave и флаг не проставится
                    const moveOutsideList = !(self._container[0] || self._container).contains(
                        nativeEvent.target
                    );
                    if (moveOutsideList !== self._listViewModel.isDragOutsideList()) {
                        self._listViewModel.setDragOutsideList(moveOutsideList);
                    }

                    self._options.notifyCallback('dragMove', [dragObject]);
                    if (self._shouldDisplayDraggingTemplate()) {
                        self._options.notifyCallback(
                            '_updateDraggingTemplate',
                            [dragObject, self._options.draggingTemplate],
                            { bubbling: true }
                        );
                    }
                } else if (self._dndListController.getDraggableItem()) {
                    self._options.onViewDragStartCompatible(
                        self._dndListController.getDraggableItem().key,
                        self,
                        self._options
                    );
                }
            }
        }
    },

    // endregion

    registerFormOperation(self: BaseControl): void {
        self._options.notifyCallback(
            'registerFormOperation',
            [
                {
                    save: self._commitEdit.bind(self, 'hasChanges'),
                    cancel: self._cancelEdit.bind(self),
                    isDestroyed: () => {
                        return self._destroyed;
                    },
                },
            ],
            { bubbling: true }
        );
    },

    isEditing(self: BaseControl): boolean {
        return !!self._editInPlaceController && self._editInPlaceController.isEditing();
    },

    activateEditingRow(
        self: BaseControl,
        enableScrollToElementParam: boolean | 'vertical' = self._options.task1184306971
            ? 'vertical'
            : true
    ): void {
        let enableScrollToElement = enableScrollToElementParam;

        // todo Нативный scrollIntoView приводит к прокрутке в том числе и по горизонтали и запретить её никак.
        // Решением стало отключить прокрутку при видимом горизонтальном скролле.
        // https://online.sbis.ru/opendoc.html?guid=d07d149e-7eaf-491f-a69a-c87a50596dfe
        const hasColumnScroll = self._isColumnScrollVisible || self._options.isColumnScrollVisible;

        const activator = () => {
            if (hasColumnScroll && !self._options.task1184306971) {
                enableScrollToElement = false;
            }
            const editingItem = self._editInPlaceController.getEditableItem();
            const editingItemContainer = self._listVirtualScrollController.getElement(
                editingItem.key
            );
            return editingItemContainer
                ? activate(editingItemContainer, { enableScrollToElement })
                : null;
        };

        self._editInPlaceInputHelper.activateInput(
            activator,
            self._children.listView?.beforeRowActivated ||
                // Уедет в Grid после распила на контролы.
                (self._beforeRowActivated
                    ? (target) => {
                          self._beforeRowActivated(target);
                      }
                    : undefined)
        );
    },

    addShowActionsClass(self: BaseControl, options: IList): void {
        // На мобильных устройствах не нужен класс, задающий видимость itemActions. Это провоцирует лишнюю синхронизацию.
        // Если ItemActions видимы всегда, они не должны исчезать свайп устройствах, они присутствуют всегда.
        // На multiTouch проверять нельзя, т.к. есть такие устройства, в которых присутствует и тач и мышка,
        // на таких устройствах сломается показ опций по ховеру и возникнет проблема гидрации.
        // на isTouch() проверять тоже нельзя, т.к. пока не начали touch, невозможно определить,
        // какой именно вариант был использован. Это тоже приводит к ошибкам гидрации.
        if (
            !self._destroyed &&
            (options.itemActions || options.itemActionsProperty || options.showEditArrow) &&
            (!detection.isMobilePlatform || options.itemActionsVisibility === 'visible')
        ) {
            self._addShowActionsClass = true;
            const classes = [
                SHOW_ACTIONS_CLASS,
                `${SHOW_ACTIONS_CLASS}_${_private.getItemActionsVisibility(self, options)}`,
            ];
            _private.changeItemsContainerClasses(self, classes);
        }
    },

    removeShowActionsClass(self: BaseControl): void {
        // В тач-интерфейсе не нужен класс, задающий видимость itemActions. Это провоцирует лишнюю синхронизацию.
        // Если ItemActions видимы всегда, они не должны исчезать свайп устройствах, они присутствуют всегда.
        if (
            !self._destroyed &&
            !TouchDetect.getInstance().isTouch() &&
            self._options.itemActionsVisibility !== 'visible'
        ) {
            self._addShowActionsClass = false;
            const classes = [
                SHOW_ACTIONS_CLASS,
                `${SHOW_ACTIONS_CLASS}_${_private.getItemActionsVisibility(self, self._options)}`,
            ];
            _private.changeItemsContainerClasses(self, null, classes);
        }
    },

    addHoverEnabledClass(self: BaseControl): void {
        if (!self._destroyed) {
            self._addHoverEnabledClass = true;
            _private.changeItemsContainerClasses(self, [HOVER_ENABLED_CLASS]);
        }
    },

    removeHoverEnabledClass(self: BaseControl): void {
        if (!self._destroyed) {
            self._addHoverEnabledClass = false;
            _private.changeItemsContainerClasses(self, null, [HOVER_ENABLED_CLASS]);
        }
    },

    getItemActionsVisibilityByStyle(options: IBaseControlOptions): string {
        // TODO надо сделать отдельный компонент - список в мастере, обертку над list:View
        return options.style === 'master' ? 'delayed' : options.itemActionsVisibility;
    },

    /**
     * Видимость операций над записью может зависеть от настроек редактирования по месту.
     * Для поячеечного режима редактирования в таблицах операции над записью показываются по ховеру на ячейку,
     * а не на всю запись.
     * @param self
     * @param options
     */
    getItemActionsVisibility(self: BaseControl, options: IList): string {
        if (self._getEditingConfig(options)?.mode === 'cell') {
            return 'onhovercell';
        } else {
            return this.getItemActionsVisibilityByStyle(options);
        }
    },

    /**
     * Изменяет напрямую CSS классы контейнера с записями.
     * Это необходимо для избавления от перерисовок контрола.
     * @param self Экземпляр контрола списка
     * @param classesToAdd Массив классов для добавления
     * @param classesToRemove Массив классов для удаления
     */
    changeItemsContainerClasses(
        self: BaseControl,
        classesToAdd?: string[],
        classesToRemove?: string[]
    ): void {
        const containerClasses = self.getItemsContainer()?.classList;
        if (containerClasses) {
            if (classesToAdd) {
                classesToAdd.forEach((cls) => {
                    containerClasses.add(cls);
                });
            }
            if (classesToRemove) {
                containerClasses.remove(...classesToRemove);
            }
        }
    },

    /**
     * Контроллер "заморозки" записей не нужен, если:
     * или есть ошибки или не инициализирована коллекция
     * или операции над записью показаны внутри записи
     * или itemActions не установлены.
     * Также, нельзя запускать "заморозку" во время редактирования или DnD записей.
     * @param self
     */
    needHoverFreezeController(self: BaseControl): boolean {
        return (
            !self._sourceController?.getLoadError() &&
            self._listViewModel &&
            self._options.itemActionsPosition === 'outside' &&
            ((self._options.itemActions && self._options.itemActions.length > 0) ||
                self._options.itemActionsProperty) &&
            _private.isAllowedHoverFreeze(self)
        );
    },

    freezeHoveredItem(
        self: BaseControl,
        item: CollectionItem<Model> & { dispItem: CollectionItem<Model> }
    ): void {
        const listContainer = self.getItemsContainer();
        // TODO HoverFreeze для ItemActions работает с виртуальным скроллом благодаря тому, что там всегда предаётся
        //  событие mouseEnter. Надо перевести его на item-key, тогда вот это всё уйдёт туда.
        //   https://online.sbis.ru/opendoc.html?guid=2b8e4422-4185-4ad8-834d-d1283375b385
        const itemKey = item.getContents().getKey();
        const itemSelector = `.${self._getItemsContainerUniqueClass()} .controls-ListView__itemV[item-key='${itemKey}']`;
        const itemNode = self._container.querySelector(itemSelector);

        if (!itemNode) {
            return;
        }

        const htmlNodeIndex = [].indexOf.call(listContainer.children, itemNode) + 1;
        const hoveredContainers = HoverFreeze.getHoveredItemContainers(
            self._container,
            htmlNodeIndex,
            self._getItemsContainerUniqueClass(),
            LIST_MEASURABLE_CONTAINER_SELECTOR
        );

        if (!hoveredContainers.length) {
            return;
        }

        // zero element in grid will be row itself; it doesn't have any background color, then lets take the last one
        const lastContainer = hoveredContainers[hoveredContainers.length - 1];
        const hoverBackgroundColor = getComputedStyle(lastContainer).backgroundColor;

        self._children.itemActionsOutsideStyle.innerHTML = HoverFreeze.getItemHoverFreezeStyles(
            self._getItemsContainerUniqueClass(),
            htmlNodeIndex,
            hoverBackgroundColor
        );
    },

    unfreezeHoveredItems(self: BaseControl): void {
        self._children.itemActionsOutsideStyle.innerHTML = '';
    },

    initHoverFreezeController(self: BaseControl): void {
        self._hoverFreezeController = new HoverFreeze({
            uniqueClass: self._getItemsContainerUniqueClass(),
            stylesContainer: self._children.itemActionsOutsideStyle as HTMLElement,
            viewContainer: self._container,
            measurableContainerSelector: LIST_MEASURABLE_CONTAINER_SELECTOR,
            isReactView: self._options._isReactView,
            freezeHoverCallback: () => {
                _private.removeHoverEnabledClass(self);
                _private.removeShowActionsClass(self);
            },
            unFreezeHoverCallback: () => {
                if (!self._isActionsMenuOpened) {
                    _private.addHoverEnabledClass(self);
                    _private.addShowActionsClass(self, self._options);
                }
            },
        });
    },

    hasHoverFreezeController(self: BaseControl): boolean {
        return !!self._hoverFreezeController;
    },

    /**
     * Возвращает true если использовать "заморозку" разрешено
     * @param self
     */
    isAllowedHoverFreeze(self: BaseControl): boolean {
        return (
            !detection.isIE &&
            (!self._dndListController || !self._dndListController.isDragging()) &&
            (!self._editInPlaceController || !self._editInPlaceController.isEditing()) &&
            !self._context?.isTouch?.isTouch
        );
    },

    updateWorkByKeyboardStatus(self: BaseControl, contexts?: { workByKeyboard?: unknown }): void {
        // Временное решение чтобы не рефакторить beforeUpdate
        // Удалить после перехода на реакт
        self._workByKeyboard = self.context.workByKeyboard;
    },
};

/**
 * Компонент плоского списка, с произвольным шаблоном отображения каждого элемента. Обладает возможностью загрузки/подгрузки данных из источника.
 * @class Controls/_list/BaseControl
 * @extends UI/Base:Control
 * @implements Controls/interface:ISource
 * @implements Controls/interface/IItemTemplate
 * @implements Controls/interface/ITrackedProperties
 * @implements Controls/interface/IPromisedSelectable
 * @implements Controls/interface/IGroupedList
 * @implements Controls/interface:INavigation
 * @implements Controls/interface:IFilterChanged
 * @implements Controls/list:IEditableList
 * @mixes Controls/_list/BaseControl/Styles
 * @implements Controls/list:IList
 * @implements Controls/interface:IItemPadding
 * @implements Controls/itemActions:IItemActions
 * @implements Controls/interface:ISorting
 * @implements Controls/list:IMovableList
 * @implements Controls/marker:IMarkerList
 * @implements Controls/list:IMovableList
 * @implements Controls/list:IListNavigation
 *
 * @private
 */

export interface IBaseControlOptions
    extends IControlOptions,
        ISourceOptions,
        IItemActionsOptions,
        IFilterOptions,
        IList,
        IEditableListOptions,
        IStoreIdOptions,
        TOldBaseControlCompatibility {
    keyProperty?: string;
    viewModelConstructor?: string;
    collection?: Collection;
    navigation?: INavigationOptionValue<INavigationSourceConfig>;
    sourceController?: SourceController;
    items?: RecordSet;
    searchValue?: string;
    animationId?: string;
    hasItemWithImage?: boolean;
    itemsSpacing?: TOffsetSize;
    hoverBackgroundStyle?: string;
    selectedKeys?: CrudEntityKey[];
    excludedKeys?: CrudEntityKey[];
    activeElement?: CrudEntityKey;
    itemsDragNDrop?: boolean;
    virtualScrollConfig?: ScrollControllerLib.IVirtualScrollConfig;
    slice?: ListSlice;

    notifyCallback?: TNotifyCallback;
    onItemClick?: Function;
    onItemMouseDown?: Function;
    renderPreloadedDataRightAway?: boolean;
    // Предзагрузка (preload) - механизм, позволяющий после оживления загружать данные в направлении "backward", что
    // обеспечивает отзывчивый скролл списка вверх.
    // Для react-списков предзагруженные данные рендерятся сразу после выполнения запроса.
    // Для wasaby-списков предзагруженные данные рендерятся при скролле, по верхнему триггеру загрузки.

    // Данный флаг позволяет рендерить предзагруженные данные сразу после выполнения запроса и вне зависимости от того,
    // react или wasaby список используется.
    // Реализовано по задаче: https://online.sbis.ru/opendoc.html?guid=fe8082f3-133d-4482-baa1-0f83da90a091
    renderPreloadedDataIgnoringViewType?: boolean;
    bottomPaddingMode?: TBottomPaddingMode;
    _isReactView?: boolean;
    disableHorizontalMarkerDirection?: boolean;
    moveMarkerOnScrollPaging?: boolean;
}

export default class BaseControl<TOptions extends IBaseControlOptions = IBaseControlOptions>
    extends Control<TOptions, {}>
    implements IMovableList, IEditableList
{
    //# region States
    _updateShadowModeBeforePaint: Function | null = null;
    _updateShadowModeAfterMount: Function | null = null;

    _updateInProgress: boolean = false;

    _needRestoreScroll: boolean = false;
    _isMounted: boolean = false;

    protected _shadowVisibility: {
        down: boolean;
        up: boolean;
    } = null;

    protected _template: TemplateFunction = BaseControlTpl;
    iWantVDOM: boolean = true;

    protected _indicatorsController: IndicatorsController;
    private _drawingIndicatorDirection: 'top' | 'bottom';

    protected _listViewModel: Collection = null;
    protected _items: RecordSet;
    protected _getItemsContainer: () => HTMLElement;

    _storedColumnsWidths: string[] = [];

    /**
     * Новые опции.
     * Нужны для того, чтобы во время onCollectionChanged иметь доступ к актуальным опциям,
     * если метод вызывается синхронно из _beforeUpdate.
     * Запоминаем новые опции в начале _beforeUpdate и удаляем в конце хука.
     * @protected
     */
    protected _newOptions: IBaseControlOptions;

    // region Стейты навигации.
    // TODO: Большая часть должна уйти в контроллер навигации при его разработке
    // Изначальная позиция. Для того, чтобы не перезагружать список каждый раз при нажатии кнопки возврата в пейджинге.
    _initialPosition: TKey;
    _loadMoreCaption: string = null;
    _shouldDrawNavigationButton: boolean = false;
    _pagingCfg: IPagingCfg = null;
    _pagingVisible: boolean = false;
    _pagingVisibilityChanged: boolean = false;
    _actualPagingVisible: boolean = false;
    _pagingPadding: number = null;
    _resetPagingOnResetItems: boolean = true;
    _lastSourceConfig: INavigationSourceConfig = null;

    // если пэйджинг в скролле показался то запоним это состояние и не будем проверять до след перезагрузки списка
    _cachedPagingState: boolean = false;
    _shouldNotResetPagingCache: boolean = false;
    _recalcPagingVisible: boolean = false;
    _isPagingArrowClick: boolean = false;
    _cutExpanded: boolean = false;

    // Variables for paging navigation
    _knownPagesCount: number = INITIAL_PAGES_COUNT;
    _currentPage: number = INITIAL_PAGES_COUNT;
    _pagingNavigation: boolean = false;
    _pagingNavigationVisible: boolean = false;
    _pagingLabelData: object = null;
    _applySelectedPage: Function = null;
    _updatePagingOnResetItems: boolean = true;

    // endregion Стейты навигации.

    _itemTemplate: TemplateFunction = null;

    _isScrollShown: boolean = false;

    protected _getLocation: Function = null;
    protected _animatedAction: string = null;
    protected _disableAnimationTimeout: number = null;

    protected _contentHeight: number = 0;
    protected _contentWidth: number = 0;
    protected _viewportHeight: number = 0;
    protected _viewportWidth: number = 0;
    protected _scrollTop: number = 0;
    protected _scrollLeft: number = 0;
    protected _placeholders: ScrollControllerLib.IPlaceholders = { backward: 0, forward: 0 };

    protected _listVirtualScrollController: ScrollControllerLib.ListVirtualScrollController;
    private _shouldHandleResize: boolean = false;
    protected _addItemsByLoadToDirection: boolean;
    private _scrollToItemAfterReloadParams: IScrollToItemAfterReloadParams;
    private _scrollToFirstItemAfterDisplayTopIndicatorAfterRender: Function;

    _bottomPaddingClass: string = null;
    _noDataBeforeReload: boolean = false;

    _bottomVisible: boolean = true;

    private _onLastMouseUpWasDrag: boolean = false;

    _itemActionsController: ItemActionsController = null;
    protected _sourceController: SourceController = null;
    private _sourceControllerLoadingResolver?: () => void;
    protected _wasReload: boolean = false;
    protected _isKeepNavigationReload: boolean = false;
    private _isReloading: boolean = false;
    private _doAfterReloadCallbacks: Function[] = [];

    private _preloadedItemsToBackward: Promise<RecordSet | void> | void = null;
    private _wasPreloadedDataToBackward: boolean = false;

    _notifyHandler: Function = EventUtils.tmplNotify;

    // По умолчанию считаем, что показывать экшны не надо, пока не будет установлено true
    _addShowActionsClass: boolean = false;

    // По умолчанию считаем, что необходимо разрешить hover на списке
    _addHoverEnabledClass: boolean = true;

    // Идентификатор текущего открытого popup
    _isActionsMenuOpened: boolean = false;

    protected _selectionController: SelectionController = null;
    protected _selectedItemsShown: boolean = false;

    protected _dndListController: DndController<IDragPosition<CollectionItem>> = null;
    private _dragEntity: ItemsEntity = undefined;
    private _startEvent: SyntheticEvent = undefined;
    private _documentDragging: boolean = false;
    private _insideDragging: boolean = false;
    private _endDragNDropTimer: number = null; // для IE
    private _draggedKey: CrudEntityKey = null;
    private _validateController?: ControllerClass = null;
    private _validators: ValidateContainer[] = [];

    private _removedItemsByOneSession: CollectionItem[][] = [];
    private _addedItemsByOneSession: CollectionItem[][] = [];

    private _itemsChanged: boolean;

    // Флаг, устанавливающий, что после рендера надо обновить ItemActions
    private _shouldUpdateActionsAfterRender: boolean;

    _keyProperty: string = null;

    _useServerSideColumnScroll: boolean = false;
    _isColumnScrollVisible: boolean = false;

    /**
     * Уникальный идентификатор списка. Генерируется единожды в BaseControl.
     */
    private _uniqueId: string = null;

    _markedKeyAfterEditing?: CrudEntityKey | null;
    _spaceBlocked: boolean;

    protected _editInPlaceController: EditInPlaceController = null;
    protected _editInPlaceInputHelper: EditInPlaceInputHelper = null;
    protected _editInPlaceInputHelperPreloadCallParams: [keyof EditInPlaceInputHelper, unknown[]];
    private _editInPlaceLib?: IEditInPlaceLibPublicExports;
    private _continuationEditingDirection:
        | TNextColumnConstant
        | TPrevColumnConstant
        | TGoToNextConstant
        | TGoToPrevConstant;
    private _arrowsBlockedForEditInPlace: boolean = false;

    _hoverFreezeController: HoverFreeze;

    _keepHorizontalScroll: boolean = false;

    _fadeController: FadeController = null;

    _beforeMountAsyncQueueHelper: BeforeMountAsyncQueueHelper = null;

    private _workByKeyboard: boolean = false;
    private _animationContext: IAnimationContainerContextValue;
    protected _getListScrollContextValueCallback: Function;
    protected _getAnimationContextValueCallback: Function;

    private _savedItemClickArgs: [SyntheticEvent, Model, SyntheticEvent, number];

    protected readonly _itemHandlers: IItemEventHandlers;
    protected _actionHandlers: IItemActionsHandler;

    private _stickyOpener: StickyOpener;

    //# endregion

    constructor(options: IBaseControlOptions, context: object) {
        super(options || {}, context);
        this._bindSourceControllerHandlers();

        this._itemsContainerReadyHandler = this._itemsContainerReadyHandler.bind(this);
        this._viewResize = this._viewResize.bind(this);
        this._arrowButtonClickCallback = this._arrowButtonClickCallback.bind(this);
        this._startDragNDropCallback = this._startDragNDropCallback.bind(this);
        this._nativeDragStart = this._nativeDragStart.bind(this);
        this._resetValidation = this._resetValidation.bind(this);
        this._onWindowResize = this._onWindowResize.bind(this);
        this._scrollToFirstItemAfterDisplayTopIndicator =
            this._scrollToFirstItemAfterDisplayTopIndicator.bind(this);
        this._hasHiddenItemsByVirtualScroll = this._hasHiddenItemsByVirtualScroll.bind(this);
        this._onCollectionChanged = this._onCollectionChanged.bind(this);
        this._onCollectionPropertyChange = this._onCollectionPropertyChange.bind(this);
        this._onAfterCollectionChanged = this._onAfterCollectionChanged.bind(this);
        this._onIndexesChanged = this._onIndexesChanged.bind(this);
        this._onNextIndexesChanged = this._onNextIndexesChanged.bind(this);
        this._onItemDeactivated = this._onItemDeactivated.bind(this);
        this._onItemActionsMenuResult = this._onItemActionsMenuResult.bind(this);

        this._onItemActionsMouseEnter = this._onItemActionsMouseEnter.bind(this);
        this._onItemActionMouseDown = this._onItemActionMouseDown.bind(this);
        this._onItemActionMouseUp = this._onItemActionMouseUp.bind(this);
        this._onItemActionClick = this._onItemActionClick.bind(this);
        this._onItemActionMouseEnter = this._onItemActionMouseEnter.bind(this);
        this._onItemActionMouseLeave = this._onItemActionMouseLeave.bind(this);
        this._onActionsSwipeAnimationEnd = this._onActionsSwipeAnimationEnd.bind(this);
        this._onNavigationButtonClick = this._onNavigationButtonClick.bind(this);

        this._onTagHoverHandler = this._onTagHoverHandler.bind(this);
        this._onTagClickHandler = this._onTagClickHandler.bind(this);
        this._commitEditActionHandler = this._commitEditActionHandler.bind(this);
        this._cancelEditActionHandler = this._cancelEditActionHandler.bind(this);

        this._logCollectionError = this._logCollectionError.bind(this);

        // здесь item - это рекорд, т.к. в новых компонентах на CollectionItem не получается забиндить
        const getCollectionItem = (item: Model) => {
            const key = getKey(item);
            return this._listViewModel.getItemBySourceKey(key, false);
        };
        this._itemHandlers = {
            onMouseOverCallback: (event, item) => {
                return this._itemMouseOver(event, getCollectionItem(item), event);
            },
            onMouseEnterCallback: (event, item) => {
                return this._itemMouseEnter(event, getCollectionItem(item), event);
            },
            onMouseLeaveCallback: (event, item) => {
                return this._itemMouseLeave(event, getCollectionItem(item), event);
            },
            onMouseMoveCallback: (event, item) => {
                return this._itemMouseMove(event, getCollectionItem(item), event);
            },
            onMouseDownCallback: (event, item) => {
                return this._itemMouseDown(event, getCollectionItem(item), event);
            },
            onMouseUpCallback: (event, item) => {
                return this._itemMouseUp(event, getCollectionItem(item), event);
            },
            onClickCallback: (event, item) => {
                return this._onItemClick(event, item, event);
            },
            onContextMenuCallback: (event, item) => {
                return this._onItemContextMenu(event, getCollectionItem(item), event);
            },
            onSwipeCallback: (event, item) => {
                return this._onItemSwipe(event, getCollectionItem(item), event);
            },
            onLongTapCallback: (event, item) => {
                return this._onItemLongTap(event, getCollectionItem(item), event);
            },
            onDeactivatedCallback: (item, params) => {
                return this._onItemDeactivated(getCollectionItem(item), params);
            },
        };

        this._actionHandlers = {
            onActionClick: this._onItemActionClick,
            onActionMouseDown: this._onItemActionMouseDown,
            onActionMouseUp: this._onItemActionMouseUp,
            onActionMouseEnter: this._onItemActionMouseEnter,
            onActionMouseLeave: this._onItemActionMouseLeave,
            onItemActionSwipeAnimationEnd: this._onActionsSwipeAnimationEnd,
            onActionsMouseEnter: this._onItemActionsMouseEnter,
            itemActionsTemplateMountedCallback: null,
            itemActionsTemplateUnmountedCallback: null,
        };
    }

    /**
     * @param {Object} newOptions
     * @param {Object} contexts
     * @param receivedState
     * @return {Promise}
     * @protected
     */
    protected _beforeMount(
        newOptions: TOptions,
        contexts: object,
        receivedState?: { uniqueId: string }
    ): void | Promise<unknown> {
        this._uniqueId = receivedState?.uniqueId || Guid.create();

        this._getListScrollContextValueCallback = this._getListScrollContextValue.bind(this);
        this._getAnimationContextValueCallback = this._getAnimationContextValue.bind(this);

        this._beforeMountAsyncQueueHelper = new BeforeMountAsyncQueueHelper();

        _private.updateWorkByKeyboardStatus(this, contexts);

        this._updateSourceController(undefined, newOptions.sourceController);
        if (this._sourceController) {
            _private.validateSourceControllerOptions(this, newOptions);
        }

        _private.validateSortingOptions(this, newOptions);

        _private.checkDeprecated(newOptions);
        this._initKeyProperty(newOptions);
        _private.checkRequiredOptions(this, newOptions);

        _private.initializeNavigation(this, newOptions);

        // TODO: Не переношу в грид контрол, т.к. этот код удалится в 22.1000.
        if (
            newOptions.columnScroll &&
            (newOptions.columnScrollStartPosition === 'end' ||
                typeof newOptions.columnScrollStartPosition === 'number')
        ) {
            const shouldPrevent = newOptions.preventServerSideColumnScroll;
            this._useServerSideColumnScroll =
                typeof shouldPrevent === 'boolean' ? !shouldPrevent : true;
        }

        _private.addShowActionsClass(this, newOptions);

        this._stickyOpener = new StickyOpener();

        return this._prepareBeforeMountAsyncQueue(newOptions)
            .addOperation(() => {
                return { uniqueId: this._uniqueId };
            })
            .getResult();
    }

    protected _processAnimationContext(options: TOptions): void {
        if (options.animationId) {
            const animationContext = this._animationContext;
            this._getLocation = (position: number): ClientRect => {
                const container = (this._getItemsContainer().children[position] ||
                    this._getItemsContainer()) as HTMLElement;
                return uDimension(container);
            };
            if (animationContext?.register) {
                animationContext.register({
                    id: options.animationId,
                    getLocation: this._getLocation,
                    abortAnimation: this._disableAnimation.bind(this),
                });
            }
        }
    }

    animateMoving(): void {
        this._enableAnimation(IObservable.ACTION_MOVE);
    }

    animateRemoving(): void {
        this._enableAnimation(IObservable.ACTION_REMOVE);
    }

    animateAdding(): void {
        this._enableAnimation(IObservable.ACTION_ADD);
    }

    protected _enableAnimation(action: string): void {
        this._disableAnimation();
        this._animatedAction = action;
        this._listViewModel.enableAnimation();
        this._disableAnimationTimeout = setTimeout(() => {
            this._listViewModel.disableAnimation();
            this._disableAnimationTimeout = null;
        }, ANIMATION_DURATION);
    }

    protected _disableAnimation(): void {
        if (this._disableAnimationTimeout) {
            this._listViewModel.disableAnimation();
            clearTimeout(this._disableAnimationTimeout);
            this._disableAnimationTimeout = null;
        }
    }

    protected _getBottomPaddingClass(
        self: BaseControl,
        options: IBaseControlOptions
    ): TBottomPaddingClass {
        let bottomPaddingMode = options.bottomPaddingMode;
        if (options.placeholderAfterContent) {
            bottomPaddingMode = 'placeholder';
        } else if (options._needBottomPadding === false) {
            bottomPaddingMode = 'none';
        } else if (!bottomPaddingMode) {
            // Костыль с detection.safari
            // правим по ошибке https://online.sbis.ru/opendoc.html?guid=b4e44451-364d-45d0-80aa-8f0667432db8&client=3
            if (options.style === 'master' && !options.isAdaptive && !detection.safari) {
                bottomPaddingMode = 'separate';
            }
        }
        return getBottomPaddingClass({
            hasItems: self._items && self._listViewModel.getCount() > 0,
            hasModel: !!self._listViewModel,
            hasFooter: !!self._listViewModel.getFooter(),
            hasResults:
                typeof self._listViewModel.getResults === 'function'
                    ? !!self._listViewModel.getResults()
                    : false,
            hasPaging: self._pagingVisible,
            itemActionsPosition: options.itemActionsPosition,
            resultsPosition: self._listViewModel.getResultsPosition?.(),
            bottomPaddingMode,
            hasMoreDown: self._hasMoreData('down'),
            hasInfinityNavigation: _private.isInfinityNavigation(options.navigation),
            hasHiddenItemsDown: self._listViewModel.getStopIndex() < self._listViewModel.getCount(),
            hasDemandNavigation: _private.isDemandNavigation(options.navigation),
            hasCutNavigation: _private.isCutNavigation(options.navigation),
            shouldDrawNavigationButton: self._shouldDrawNavigationButton,
            isTouch: TouchDetect.getInstance().isTouch(),
            isEditing: self.isEditing(),
        });
    }

    private _getListScrollContextValue(context: IListScrollContextOptions): void {
        this._scrollContext = context;
        if (context?.setArrowButtonClickCallback) {
            context.setArrowButtonClickCallback(this._arrowButtonClickCallback);
        }
    }

    private _getAnimationContextValue(context: IAnimationContainerContextValue): void {
        this._animationContext = context;
        if (this._animationContext) {
            this._processAnimationContext(this._options);
        }
    }

    // region LoadData

    private _dataLoadStartedCallback(event: SyntheticEvent, direction: Direction): void {
        const isReload = !direction;
        if (isReload) {
            _private.setReloadingState(this, true);
            if (this.isEditing()) {
                this._cancelEdit(true);
            }
        }
        if (
            isReload ||
            (!this._indicatorsController.hasDisplayedIndicator() &&
                !this._wasPreloadedDataToBackward)
        ) {
            this._displayGlobalIndicator();
        }

        // Если сейчас сразу же отрисуем предзагруженные записи, то не нужно сперва пытаться рисовать индикатор
        const shouldRenderIndicatorOnLoad =
            direction !== 'up' ||
            !this._wasPreloadedDataToBackward ||
            !this._shouldRenderPreloadedDataRightAway();
        if (shouldRenderIndicatorOnLoad) {
            this._indicatorsController.onDataLoadStarted(direction);
        }
    }

    private _dataLoadCancelCallback(event: SyntheticEvent): void {
        this._addItemsByLoadToDirection = false;
        if (this._indicatorsController.shouldHideGlobalIndicator()) {
            this._indicatorsController.hideGlobalIndicator();
        }
    }

    private _dataLoadCallback(
        event: EventObject,
        items: RecordSet,
        direction: ScrollControllerLib.IDirection,
        navigationSourceConfig: INavigationSourceConfig
    ): Promise<void> | void {
        const isReload = !direction;

        this._beforeDataLoadCallback(items, direction);

        if (items.getCount()) {
            this._loadedItems = items;
        }

        _private.setHasMoreData(this._listViewModel, _private.getHasMoreData(this));
        this._listViewModel?.setSearchValue(this._options.searchValue);

        // Нужно обновить hasMoreData. Когда произойдет _beforeUpdate уже будет поздно,
        // т.к. успеет сработать intersectionObserver и произойдет лишняя подгрузка
        // Обновлять нужно именноо в dataLoadCallback, а не в itemsChangedCallback,
        // т.к. itemsChanged произойдет после indexesChanged и на indexesChanged мы неправильно пересчитаем индикаторы
        const hasMoreData = _private.getHasMoreData(this);
        this._indicatorsController.setHasMoreData(hasMoreData.up, hasMoreData.down);

        _private.setReloadingState(this, false);
        this._executeAfterReloadCallbacks();

        if (isReload) {
            // флаг iterative можно сбросить только при перезагрузке, при подгрузках этого нельзя делать
            // и мы это должны игнорировать.
            const isIterativeLoading = _private.isPortionedLoad(this, items);
            this._indicatorsController.setIterativeLoading(isIterativeLoading);

            // Необходимо сразу обновить состояние пустого представления,
            // чтобы сразу же могли отрисовать индикатор и триггер вверх в случае когда вьюпорт не заполнится
            const shouldDisplayEmptyTemplate = this.__needShowEmptyTemplate();
            this._indicatorsController.setEmptyTemplateDisplayed(shouldDisplayEmptyTemplate);

            // При смене корня нужно сбрасывать скролл
            const rootChanged = this._options.root !== this._sourceController.getRoot();
            const shouldResetScroll =
                this._isMounted && (rootChanged || !this._options.keepScrollAfterReload);
            this._listVirtualScrollController.setScrollBehaviourOnReset(
                shouldResetScroll ? 'reset' : 'keep'
            );

            if (this._cutExpanded && !this._isKeepNavigationReload) {
                this._cutExpanded = false;
            }

            if (this._selectedItemsShown) {
                this._resetSelectedItemsShownMode();
            }

            // Если после перезагрузки скролл будет сброшен, то можно сразу прятать trackedValues
            if (this._options.trackedProperties?.length && shouldResetScroll) {
                this._listViewModel.setTrackedValuesVisible(false);
            }
            this._isKeepNavigationReload = false;
            this._wasReload = true;
            this._preloadedItemsToBackward = null;
            if (this._isMounted && this._children.listView?.reset && !this._keepHorizontalScroll) {
                this._children.listView.reset({});
            }
            this._keepHorizontalScroll = false;
            const isEndEditProcessing =
                this._editInPlaceController &&
                this._editInPlaceController.isEndEditProcessing &&
                this._editInPlaceController.isEndEditProcessing();
            _private.callDataLoadCallbackCompatibility(
                this,
                items,
                direction,
                this._options,
                navigationSourceConfig
            );
            _private.executeAfterReloadCallbacks(this, items, this._options);

            // Принудительно прекращаем заморозку ховера
            if (_private.hasHoverFreezeController(this)) {
                this._hoverFreezeController.unfreezeHover();
            }

            if (this.isEditing() && !isEndEditProcessing) {
                event.setResult(this._cancelEdit(true));
            }

            return;
        }

        _private.callDataLoadCallbackCompatibility(
            this,
            items,
            direction,
            this._options,
            navigationSourceConfig
        );
    }

    private _itemsChangedOnDataLoad(
        event: EventObject,
        items: RecordSet,
        rootKey: CrudEntityKey,
        direction?: ScrollControllerLib.IDirection
    ): void {
        this._addItemsByLoadToDirection = false;

        // Перезагрузку списков индикаторами нужно обрабатывать именно тут,
        // после изменения рекордсета и обработки этих событий
        // т.к. для начала должен отработать virtualScrollController
        this._indicatorsController.onDataLoad(items, direction);

        this._indicatorsController.setUnconditionallyDisplayTopIndicator(false);

        const loadedInRoot = rootKey === this._sourceController.getRoot();
        const isIterativeLoading = _private.isPortionedLoad(this, items);
        const isIterativeLoadingInProgress =
            this._indicatorsController.isDisplayedPortionedSearch();
        if (loadedInRoot && (!isIterativeLoading || isIterativeLoadingInProgress)) {
            // Пытаемся грузить тут, т.к. isLoading=true в dataLoadCallback
            this._tryLoadToDirectionAgain(items, rootKey, direction);
        }
    }

    protected _tryLoadToDirectionAgain(
        loadedItems: RecordSet,
        root?: TKey,
        direction?: ScrollControllerLib.IDirection
    ): void {
        if (this._destroyed) {
            return;
        }
        if (!this._sourceController) {
            return;
        }
        const needLoad = _private.needLoadNextPageAfterLoad(
            this,
            loadedItems,
            this._listViewModel,
            this._options.navigation
        );
        if (needLoad) {
            let resolvedDirection;
            if (
                _private.isPortionedLoad(this, loadedItems) &&
                this._indicatorsController.getPortionedSearchDirection() &&
                this._hasMoreData(this._indicatorsController.getPortionedSearchDirection())
            ) {
                resolvedDirection = this._indicatorsController.getPortionedSearchDirection();
            } else if (this._hasMoreData('down')) {
                resolvedDirection = 'down';
            } else if (this._hasMoreData('up')) {
                resolvedDirection = 'up';
            }

            if (resolvedDirection) {
                _private.loadToDirectionIfNeed(this, resolvedDirection);
            }
        } else {
            // Если при итеративной загрузке не нужно загружать следующую пачку,
            // например, если достигли maxCount, то заканчиваем поиск
            if (
                _private.isPortionedLoad(this, loadedItems) &&
                this._indicatorsController.getPortionedSearchDirection()
            ) {
                this._abortPortionedLoading();
            }
        }
    }

    protected _beforeDataLoadCallback(
        items: RecordSet,
        direction: ScrollControllerLib.IDirection
    ): void {
        // для переопределения
    }

    private _preloadDataToBackward(): void {
        // Сразу после маунта может сработать триггер, т.к. данных мало и уже может идти загрузка
        // Если нет данных вниз, то не нужно предзагружать записи вверх, т.к. их и так уже будет достаточно
        if (
            this.props.disablePreloadDataToBackward ||
            !this._sourceController?.hasMoreData('up') ||
            !this._sourceController?.hasMoreData('down') ||
            this._sourceController?.isLoading() ||
            !_private.isInfinityNavigation(this.props.navigation)
        ) {
            return;
        }

        // Если есть данные вниз и вьюпорт не заполнен, то нужно сперва загрузить данные вниз,
        // а только потом уже выполнять предзагрузку.
        // Иначе предзагруженные записи выместят текущие записи вниз - прыжок.
        const viewportFilled = this._contentHeight > this._viewportHeight;
        if (this._sourceController?.hasMoreData('down') && !viewportFilled) {
            _private.doAfterRender(this, () => this._preloadDataToBackward());
            return;
        }

        const renderPreloadedDataRightAway = this._shouldRenderPreloadedDataRightAway();
        this._indicatorsController.setUnconditionallyDisplayTopIndicator(
            !renderPreloadedDataRightAway
        );
        this._wasPreloadedDataToBackward = true;
        this._preloadedItemsToBackward = _private.loadToDirectionIfNeed(
            this,
            'up',
            renderPreloadedDataRightAway,
            true
        );

        if (!this._preloadedItemsToBackward) {
            this._wasPreloadedDataToBackward = false;
            this._indicatorsController.setUnconditionallyDisplayTopIndicator(false);
        }

        if (this._preloadedItemsToBackward) {
            // Для react-реализации списка показываем пейджинг после загрузки
            if (this.props._isReactView) {
                this._preloadedItemsToBackward.then((result) => {
                    // и только если он не был показан ранее
                    if (!this._pagingVisible) {
                        _private.initPaging(this);
                    }

                    return result;
                });
            }

            if (!renderPreloadedDataRightAway) {
                this._preloadedItemsToBackward.then((result) => {
                    // onDataLoad вызывается в itemsChangedHandler,
                    // если мы не будем мерджить записи, то обработчик не сработает
                    this._indicatorsController.onDataLoad(result, 'up');
                    this._indicatorsController.setUnconditionallyDisplayTopIndicator(false);

                    // Во время подгрузки можно успеть проскроллить в конец списка
                    // и т.к. предзагруженные записи не будут сразу же отрисованы,
                    // то нужно проверить видимость триггера
                    this._listVirtualScrollController.checkTriggersVisibility();

                    return result;
                });
            }
        }

        if (renderPreloadedDataRightAway) {
            this._preloadedItemsToBackward = null;
        }
    }

    protected _shouldRenderPreloadedDataRightAway(): boolean {
        return !!this.props.renderPreloadedDataIgnoringViewType;
    }

    protected _doAfterReload(callback: Function): void {
        if (this._isReloading) {
            this._doAfterReloadCallbacks.push(callback);
        } else {
            callback();
        }
    }

    private _executeAfterReloadCallbacks(): void {
        this._doAfterReloadCallbacks.forEach((callback) => callback());
        this._doAfterReloadCallbacks = [];
    }

    // endregion LoadData

    protected _prepareBeforeMountAsyncQueue(newOptions: TOptions): BeforeMountAsyncQueueHelper {
        this._beforeMountAsyncQueueHelper
            // Prepare items on mount
            .addOperation(() => {
                return this._prepareItemsOnMount(this, newOptions);
            })

            // Try to start initial editing
            .addOperation(() => {
                if (this._listViewModel) {
                    return this._tryStartInitialEditing(newOptions);
                }
            })

            // Init model state if need
            .addOperation(() => {
                const needInitModelState =
                    this._listViewModel && this._listViewModel.getSourceCollectionCount();

                if (needInitModelState) {
                    newOptions.slicelessBeforeMountAsyncQueue?.(this, newOptions);

                    if (newOptions.fadedKeys) {
                        const fadeController = _private.getFadeController(this, newOptions);
                        fadeController.applyStateToModel();
                    }
                    if (
                        newOptions.multiSelectVisibility !== 'hidden' &&
                        newOptions.selectedKeys &&
                        newOptions.selectedKeys.length > 0
                    ) {
                        const selectionController = this._createSelectionController(newOptions);
                        const selection = {
                            selected: newOptions.selectedKeys,
                            excluded: newOptions.excludedKeys,
                        };
                        selectionController.setSelection(selection);
                        const multiSelectVisibility = this._resolveMultiSelectVisibility(
                            newOptions.multiSelectVisibility
                        );
                        this._listViewModel.setMultiSelectVisibility(multiSelectVisibility);
                    }
                }
            })
            .addOperation(() => {
                return this._listVirtualScrollController.endBeforeMountListControl();
            });

        return this._beforeMountAsyncQueueHelper;
    }

    protected _onItemsReady(options: IBaseControlOptions, items: RecordSet): void {
        if (options.itemsReadyCallback) {
            options.itemsReadyCallback(items);
        }
    }

    _onCollectionPropertyChange(
        event: EventObject,
        values: { metaData: { results?: EntityModel } }
    ): void {
        if (values && values.metaData) {
            _private.prepareFooter(this, this._options, this._sourceController);
        }
    }

    protected _afterItemsSet(options: IBaseControlOptions): void {
        // для переопределения
    }

    private _onCollectionChanged(
        event: SyntheticEvent,
        action: string,
        newItems: CollectionItem<Model>[],
        newItemsIndex: number,
        removedItems: CollectionItem<Model>[],
        removedItemsIndex: number,
        reason: string
    ): void {
        _private.onCollectionChanged(
            this,
            event,
            null,
            action,
            newItems,
            newItemsIndex,
            removedItems,
            removedItemsIndex,
            reason
        );
        if (action === IObservable.ACTION_RESET) {
            this._afterCollectionReset();
        }
        if (action === IObservable.ACTION_REMOVE) {
            this._afterCollectionRemove(removedItems, removedItemsIndex);
        }
    }

    protected _afterCollectionReset(): void {
        // для переопределения
    }

    protected _afterCollectionRemove(
        removedItems: CollectionItem<Model>[],
        removedItemsIndex: number
    ): void {
        // для переопределения
    }

    private _onAfterCollectionChanged(): void {
        if (this._hasSelectionController() && this._removedItemsByOneSession.length) {
            const removedItems = [].concat.apply([], this._removedItemsByOneSession);
            const newSelection = this._getSelectionController().onCollectionRemove(removedItems);
            this._changeSelection(newSelection);
        }
        this._removedItemsByOneSession = [];
        this._addedItemsByOneSession = [];
    }

    private _callVirtualRangeChangedCallback(
        virtualRangeChangedCallback: Function,
        startIndex: number,
        endIndex: number
    ): void {
        if (startIndex !== undefined) {
            virtualRangeChangedCallback(this._getItemsFromRange(startIndex, endIndex));
        }
    }

    private _getItemsFromRange(startIndex: number, endIndex: number): TKey[] {
        // Страховка на случай последовательных измений коллекции,
        // когда индексы могут быть не актуальными из-за ожидания предзагрузки
        const maxIndex = Math.min(endIndex, this._listViewModel.getCount());
        const itemsFromRange: TKey[] = [];
        for (let i = startIndex; i < maxIndex; i++) {
            itemsFromRange.push(this._listViewModel.at(i).key);
        }
        return itemsFromRange;
    }

    private _onNextIndexesChanged(
        event: SyntheticEvent,
        startIndex: number,
        endIndex: number,
        shiftDirection: ScrollControllerLib.IDirectionNew
    ): void {
        if (
            this._isMounted &&
            this._options.feature1184208466 &&
            this._options.virtualRangeChangedCallback
        ) {
            this._callVirtualRangeChangedCallback(
                this._options.virtualRangeChangedCallback,
                startIndex,
                endIndex
            );
            if (shiftDirection === 'backward') {
                // При наличии ожидания асинхронного построения элементов выше, мы рабоаем с ними как с незагруженными,
                // поэтому тут показываем настоящий индикатор, как при загрузке. А после отрисовки, спрячем.
                this._indicatorsController.onDataLoadStarted('up');
            } else {
                if (this._drawingIndicatorDirection) {
                    this._indicatorsController.hideDrawingIndicator(
                        this._getIndicatorDomElement(this._drawingIndicatorDirection),
                        this._drawingIndicatorDirection
                    );
                }
                this._drawingIndicatorDirection = 'bottom';
                this._indicatorsController.displayDrawingIndicator(
                    this._getIndicatorDomElement(this._drawingIndicatorDirection),
                    this._drawingIndicatorDirection
                );
            }
        }
    }

    private _onIndexesChanged(
        _event: SyntheticEvent,
        startIndex: number,
        endIndex: number,
        shiftDirection: ScrollControllerLib.IDirectionNew
    ): void {
        if (
            this._isMounted &&
            this._options.feature1184208466 &&
            this._options.virtualRangeChangedCallback
        ) {
            this._callVirtualRangeChangedCallback(
                this._options.virtualRangeChangedCallback,
                startIndex,
                endIndex
            );
            if (shiftDirection === 'backward') {
                // При наличии ожидания асинхронного построения элементов выше, мы рабоаем с ними как с незагруженными,
                // После отрисовки элементов, прячем индикатор как после загрузки
                this._indicatorsController.onDataLoad(null, 'up');
            }
        }

        this._itemsChanged = true;

        if (this._isMounted) {
            // Пересчитываем индикаторы, чтобы при смещении диапазона не мелькал индикатор.
            // Контроллер может быть не создан только при маунте, в этом случае и не нужно пересчитывать индикаторы
            this._indicatorsController.recountIndicators('up');
            this._indicatorsController.recountIndicators('down');

            if (this._isMounted && shiftDirection) {
                // Индикаторы отрисовки нужно отображать только, когда у нас сместился диапазон.
                // При подгрузке или перезагрузке мы отображает индикаторы загрузки.
                // Если у нас долго отрисовываются записи(дольше 2с), то мы показываем индикатор отрисовки.
                // Эта ситуация в частности актуальна для ScrollViewer.
                // Если индикатор и так уже есть, то скрываем его. Показываться может только один индикатор отрисовки.
                if (this._drawingIndicatorDirection) {
                    this._indicatorsController.hideDrawingIndicator(
                        this._getIndicatorDomElement(this._drawingIndicatorDirection),
                        this._drawingIndicatorDirection
                    );
                }
                this._drawingIndicatorDirection = shiftDirection === 'forward' ? 'bottom' : 'top';
                this._indicatorsController.displayDrawingIndicator(
                    this._getIndicatorDomElement(this._drawingIndicatorDirection),
                    this._drawingIndicatorDirection
                );
            }
        }
        // При смене индексов нужно всегда обновлять itemActions, т.к.
        // они обновляются только в видимом диапазоне виртуального скролла независимо от режима.
        // Если этот метод сработал при инициализации виртуального скролла на beforeMount,
        // то в this._options ничего нет, поэтому проверяем на this._mounted.
        if (this._isMounted && !!this._itemActionsController && shiftDirection) {
            _private.updateInitializedItemActions(this, this._options);
        }
    }

    protected _prepareItemsOnMount(self: BaseControl, newOptions: IBaseControlOptions): void {
        let items;
        let collapsedGroups;

        if (self._sourceController) {
            items = self._sourceController.getItems();
            collapsedGroups = self._sourceController.getCollapsedGroups();
        } else if (newOptions.items) {
            items = newOptions.items;
        }

        if (items) {
            _private.callDataLoadCallbackCompatibility(self, items, undefined, newOptions);
        }

        const viewModelConfig = {
            ...newOptions,
            keyProperty: self._keyProperty,
            items,
            // Сейчас при условии newDesign предполагается, что разделителей по краям нет.
            // Прежде чем убирать это условие, стоит поправить прикладные репозитории.
            rowSeparatorVisibility:
                newOptions._dataOptionsValue?.newDesign || newOptions.newDesign
                    ? 'items'
                    : newOptions.rowSeparatorVisibility,
            collapsedGroups: collapsedGroups || newOptions.collapsedGroups,
        };

        _private.initializeModel(self, viewModelConfig, items);

        if (items) {
            items.subscribe('onPropertyChange', self._onCollectionPropertyChange);
            _private.setHasMoreData(self._listViewModel, _private.getHasMoreData(self), true);

            self._items = self._listViewModel.getSourceCollection();
            self._initialPosition = self._listViewModel?.getSourceItemBySourceIndex(0)?.getKey();

            self._bottomPaddingClass = self._getBottomPaddingClass(self, newOptions);
            if (self._pagingNavigation) {
                const hasMoreData = self._listViewModel.getMetaData().more;
                _private.updatePagingData(self, hasMoreData, newOptions);
            }

            self._afterReloadCallback(newOptions, self._items, self._listViewModel);
            _private.prepareFooter(self, newOptions, self._sourceController);
            _private.initVisibleItemActions(self, newOptions);
        }

        self._createListVirtualScrollController(newOptions);
        self._createIndicatorsController(newOptions);
    }

    _initKeyProperty(options: TOptions): void {
        const sourceController = options.sourceController || this._sourceController;
        this._keyProperty =
            options.keyProperty ||
            (sourceController && sourceController.getKeyProperty()) ||
            options.items?.getKeyProperty();
    }

    /**
     * Замораживает hover подсветку строки для указанной записи
     */
    freezeHoveredItem(item: Model): void {
        const collectionItem = this._listViewModel.getItemBySourceItem(item);
        if (!collectionItem) {
            Logger.error('freezeHoveredItem(). Указанный item отсутствует в коллекции.', this);
        } else {
            _private.freezeHoveredItem(this, collectionItem);
        }
    }

    /**
     * Размораживает все ранее замороженные итемы
     */
    unfreezeHoveredItems(): void {
        _private.unfreezeHoveredItems(this);
    }

    _updateShadowModeHandler(shadowVisibility: { down: boolean; up: boolean }): void {
        this._shadowVisibility = shadowVisibility;

        if (this._isMounted) {
            // scrollTop пересчитывается в beforePaint поэтому и тень должны изменять тоже в beforePaint,
            // чтобы не было моргания тени
            this._updateShadowModeBeforePaint = () => {
                _private.updateShadowMode(this, shadowVisibility);
            };
        } else {
            this._updateShadowModeAfterMount = () => {
                _private.updateShadowMode(this, shadowVisibility);
            };
        }
    }

    // TODO Необходимо провести рефакторинг механизма подгрузки данных по задаче
    //  https://online.sbis.ru/opendoc.html?guid=8a5f7598-c7c2-4f3e-905f-9b2430c0b996
    protected _loadMore(
        direction: ScrollControllerLib.IDirection
    ): Promise<RecordSet | void> | void {
        if (
            _private.isInfinityNavigation(this._options?.navigation) ||
            _private.isDemandNavigation(this._options?.navigation) ||
            _private.isMaxCountNavigation(this._options?.navigation)
        ) {
            return _private.loadToDirectionIfNeed(this, direction);
        }
        return Promise.resolve();
    }

    // region Resizes

    protected _viewResize(): void {
        const container =
            (this._children.hasOwnProperty('viewContainer') && this._children.viewContainer) ||
            (this._container && this._container[0]) ||
            this._container;
        if (!container) {
            return;
        }

        const newSizes = {
            width: container.scrollWidth,
            height: container.clientHeight,
        };

        if (this._contentHeight !== newSizes.height || this._contentWidth !== newSizes.width) {
            const oldSizes = {
                width: this._contentWidth,
                height: this._contentHeight,
            };
            this._contentHeight = newSizes.height;
            this._contentWidth = newSizes.width;
            this._onContentResized(oldSizes, newSizes);
        }

        /*
         * Заново определяем должен ли отображаться пэйджинг или нет.
         * Скрывать нельзя, так как при подгрузке данных пэйджинг будет моргать.
         */
        if (this._pagingVisible) {
            this._cachedPagingState = false;
            _private.initPaging(this);
        } else if (detection.isMobilePlatform) {
            this._recalcPagingVisible = true;
        }

        if (_private.needScrollPaging(this._options.navigation, this._options.isAdaptive)) {
            _private.doAfterUpdate(this, () => {
                _private.updateScrollPagingButtons(this, {
                    ...this._getScrollParams(),
                    initial: !this._scrolled,
                });
            });
        }
    }

    protected _onContentResized(
        oldSizes: IContentSizesParams,
        newSizes: IContentSizesParams
    ): void {
        this._options.notifyCallback('controlResize', [], { bubbling: true });

        // FIXME: У плитки нет TileControl, а базовый не знает какой ориентации
        //  его скролл-контроллер, разным ориентациям нужны разные параметры контента (высота/ширина).
        //  Данная опция подсказывает BaseControl, что обновить нужно ширину. будет поправлено по задаче.
        //  https://online.sbis.ru/opendoc.html?guid=a8fd8847-744d-41d4-82a2-802a0bb15395&client=3
        if (oldSizes.height !== newSizes.height) {
            if (!this._options.task1187242805) {
                this._listVirtualScrollController.contentResized(newSizes.height);
            }
        }
        if (this._options.task1187242805) {
            this._listVirtualScrollController.contentResized(newSizes.width);
        }
    }

    protected _onWindowResize(): void {
        // Если изменили размеры окна, то нужно скрыть меню для itemActions. Иначе меню уезжает куда-то в сторону.
        _private.closeActionsMenu(this);
    }

    protected _scrollResizeHandler(scrollHeight: number): void {
        this._listVirtualScrollController.scrollResized(scrollHeight);
    }

    protected _viewportResizeHandler(params: IScrollParams): void {
        this._onViewPortResized(
            {
                width: this._viewportWidth,
                height: this._viewportHeight,
                scrollTop: this._scrollTop,
                scrollLeft: this._scrollLeft,
            },
            {
                width: params.clientWidth,
                height: params.clientHeight,
                scrollTop: params.scrollTop,
                scrollLeft: params.scrollLeft,
            }
        );

        this._viewportHeight = params.clientHeight;
        this._viewportWidth = params.clientWidth;
        this._scrollTop = params.scrollTop;
        this._scrollLeft = params.scrollLeft;
    }

    protected _onViewPortResized(
        oldSizes: IViewPortSizesParams,
        newSizes: IViewPortSizesParams
    ): void {
        if (oldSizes.scrollTop !== newSizes.scrollTop || oldSizes.height !== newSizes.height) {
            this._listVirtualScrollController.viewportResized(newSizes.height);
            if (newSizes.height >= this._contentHeight) {
                this._pagingVisible = false;
            }
            if (this._pagingVisible && this._scrollPagingCtr) {
                this._scrollPagingCtr.viewportResize(newSizes.height);
                _private.updateScrollPagingButtons(
                    this,
                    this._getScrollParams(undefined, newSizes)
                );
            }
            if (this._recalcPagingVisible) {
                if (!this._pagingVisible) {
                    _private.initPaging(this);
                }
            }
        }
    }

    // endregion Resizes

    _getScrollParams(
        clear: boolean = false,
        viewPortParams: IViewPortSizesParams = {
            width: this._viewportWidth,
            height: this._viewportHeight,
            scrollTop: this._scrollTop,
            scrollLeft: this._scrollLeft,
        }
    ): IScrollParams {
        if (clear) {
            return {
                clientHeight: viewPortParams.height,
                scrollHeight: this._contentHeight,
                scrollTop: viewPortParams.scrollTop,
            };
        }
        let stickyElementsHeight = 0;
        if (detection.isBrowserEnv) {
            stickyElementsHeight = getStickyHeadersHeight(this._container, 'top', 'allFixed') || 0;
            stickyElementsHeight +=
                getStickyHeadersHeight(this._container, 'bottom', 'allFixed') || 0;
        }
        const pagingPadding = this._isPagingPadding() ? PAGING_PADDING : 0;
        const scrollParams = {
            scrollTop: viewPortParams.scrollTop,
            scrollHeight: this._contentHeight + pagingPadding - stickyElementsHeight,
            clientHeight: viewPortParams.height - stickyElementsHeight,
        };
        /*
         * Для pagingMode numbers нужно знать реальную высоту списка и scrollTop (включая то, что отсечено виртуальным скроллом)
         * Это нужно чтобы правильно посчитать номер страницы.
         * Также, это нужно для других пэджингов, но только в том случае, если мы скроллим не через нажатие кнопок.
         * Иначе пэджинг может исчезать и сразу появляться.
         * https://online.sbis.ru/opendoc.html?guid=8d830d87-be3f-4522-b453-0df337147d42
         */
        if (
            this._options.navigation?.viewConfig?.pagingMode === 'numbers' ||
            !this._isPagingArrowClick
        ) {
            scrollParams.scrollTop += this._placeholders?.backward || 0;
            scrollParams.scrollHeight +=
                this._placeholders?.backward + this._placeholders?.forward || 0;
        }
        this._isPagingArrowClick = false;
        return scrollParams;
    }

    getViewModel(): Collection {
        return this._listViewModel;
    }

    getSourceController(): SourceController {
        return this._sourceController;
    }

    // region Scroll

    protected _arrowButtonClickCallback(direction: 'prev' | 'next'): boolean {
        this._listVirtualScrollController.scrollToPage(
            direction === 'prev' ? 'backward' : 'forward'
        );
        return false;
    }

    protected _getListVirtualScrollControllerOptions(
        options: IBaseControlOptions
    ): ScrollControllerLib.IAbstractListVirtualScrollControllerOptions {
        const hasMoreDataToBackward =
            this._sourceController && this._sourceController.hasMoreData('up');
        const hasMoreDataToForward =
            this._sourceController && this._sourceController.hasMoreData('down');
        return {
            collection: this._listViewModel,
            listControl: this,
            virtualScrollConfig: options.virtualScrollConfig || {},
            minVirtualScrollIndex: options.minVirtualScrollIndex,
            maxVirtualScrollIndex: options.maxVirtualScrollIndex,
            multiColumns: options.multiColumns,
            activeElementKey: options.activeElement,
            initialScrollPosition: options.initialScrollPosition?.vertical,
            disableVirtualScroll: options.disableVirtualScroll,
            placeholderAfterContent: options.placeholderAfterContent,

            viewportSize: this._viewportHeight || 0,
            contentSize: this._contentHeight || 0,
            scrollPosition: this._scrollPosition || 0,
            listContainer: this._container,

            triggersQuerySelector: LOADING_TRIGGER_SELECTOR,
            itemsQuerySelector: options.itemsSelector,
            itemsContainerUniqueSelector: `.${this._getItemsContainerUniqueClass()}`,

            triggersVisibility: {
                backward:
                    !this._hasMoreData('up') ||
                    (!this._listViewModel.getCount() && !_private.isPortionedLoad(this)) ||
                    !options.attachLoadTopTriggerToNull,
                forward: true,
            },
            triggersOffsetCoefficients: {
                backward: options.topTriggerOffsetCoefficient,
                forward: options.bottomTriggerOffsetCoefficient,
            },
            triggersPositions: {
                backward:
                    hasMoreDataToBackward &&
                    options.topTriggerOffsetCoefficient ===
                        ScrollControllerLib.DEFAULT_TRIGGER_OFFSET
                        ? 'null'
                        : 'offset',
                forward:
                    hasMoreDataToForward &&
                    options.bottomTriggerOffsetCoefficient ===
                        ScrollControllerLib.DEFAULT_TRIGGER_OFFSET
                        ? 'null'
                        : 'offset',
            },
            additionalTriggersOffsets: this._getAdditionalTriggersOffsets(),
            totalCount: this._listViewModel.getCount(),

            feature1183225611: options.virtualScrollConfig?.feature1183225611,
            feature1184208466: options.feature1184208466,
            isReact: this.UNSAFE_isReact,
            renderedItems: options._renderedItems,

            scrollToElementUtil: (container, position, force): Promise<void> => {
                this._scrollControllerInitializeChangeScroll = true;
                return this._scrollToElement(container, position, force);
            },

            doScrollUtil: (position) => {
                // TODO: Нужно создать TileControl, который будет знать про ориентацию плитки и выбирать,
                // какой скроллконтроллер создать и с какими опциями.
                // https://online.sbis.ru/opendoc.html?guid=4ceef343-abd3-4cba-9a90-a55c387195f2&client=3
                if (this._options.orientation === 'horizontal') {
                    if (position === 'top') {
                        position = 0;
                    }
                    this._options.notifyCallback('doHorizontalScroll', [position, true], {
                        bubbling: true,
                    });
                } else {
                    this._scrollControllerInitializeChangeScroll = true;
                    const currentScroll = this._scrollTop;
                    this._options.notifyCallback('doScroll', [position, true], {
                        bubbling: true,
                    });
                    return currentScroll === position;
                }
            },

            updatePlaceholdersUtil: (placeholders) => {
                if (!this._isMounted) {
                    return;
                }
                const isChanged = !isEqual(this._placeholders, placeholders);
                // TODO нужно будет сетать в пэйджинг и он на своем уровне это обработает
                // Пэйджингу нужны плэйсхолдеры, чтобы правильно работать с отображением страниц
                this._placeholders = placeholders;

                // Изменение плейсхолдеров эквивалентно ресайзу и нужно пересчитать видимость пейджинга.
                if (!this._pagingVisible && isChanged) {
                    _private.initPaging(this);
                }

                const convertedPlaceholders = {
                    top: placeholders.backward,
                    bottom: placeholders.forward,
                };
                this._options.notifyCallback('updatePlaceholdersSize', [convertedPlaceholders], {
                    bubbling: true,
                });
            },

            beforeVirtualRangeChangeCallback: (range) => {
                if (this._options.beforeVirtualRangeChangeCallback) {
                    const itemsFromRange = this._getItemsFromRange(
                        range.startIndex,
                        range.endIndex
                    );
                    return this._options.beforeVirtualRangeChangeCallback(itemsFromRange);
                }
                return;
            },
            hasItemsOutRangeChangedCallback: (hasItemsOutsideOfRange) => {
                // для ромашек и для обновления virtualNavigation после загрузки данных
                this._hasItemsOutRange = hasItemsOutsideOfRange;
            },

            updateShadowsUtil: (hasItemsOutsideOfRange) => {
                const collection = this._listViewModel;
                const navigation = this._options.navigation;
                const itemsCount = collection?.getCount();
                const shadowVisibleByNavigation = _private.needShowShadowByNavigation(
                    navigation,
                    itemsCount
                );
                const topShadowVisibleByPortionedSearch = _private.allowLoadMoreByPortionedSearch(
                    this,
                    'up'
                );
                const bottomShadowVisibleByPortionedSearch =
                    _private.allowLoadMoreByPortionedSearch(this, 'down');

                const topShadowVisible =
                    hasItemsOutsideOfRange.backward ||
                    (shadowVisibleByNavigation &&
                        topShadowVisibleByPortionedSearch &&
                        itemsCount &&
                        this._hasMoreData('up'));
                const bottomShadowVisible =
                    hasItemsOutsideOfRange.forward ||
                    (shadowVisibleByNavigation &&
                        bottomShadowVisibleByPortionedSearch &&
                        itemsCount &&
                        this._hasMoreData('down'));

                this._options.notifyCallback(
                    'updateShadowMode',
                    [
                        {
                            top: topShadowVisible ? 'visible' : 'auto',
                            bottom: bottomShadowVisible ? 'visible' : 'auto',
                        },
                    ],
                    { bubbling: true }
                );
            },

            updateVirtualNavigationUtil: (hasItemsOutsideOfRange, forceUseHasItems) => {
                this._updateVirtualNavigation(hasItemsOutsideOfRange, forceUseHasItems);
            },

            activeElementChangedCallback: (activeElementIndex) => {
                let itemIndex = activeElementIndex;
                let activeItem;
                do {
                    activeItem = this._listViewModel.at(itemIndex);
                    itemIndex--;
                } while (itemIndex >= 0 && !activeItem.ActivatableItem);
                if (
                    activeItem &&
                    activeItem.ActivatableItem &&
                    this._options.activeElement !== activeItem.key
                ) {
                    const onActiveElementChanged = checkWasabyEvent(
                        this._options.onActiveElementChanged
                    );
                    if (onActiveElementChanged) {
                        onActiveElementChanged(activeItem.key);
                    } else {
                        this._options.notifyCallback('activeElementChanged', [activeItem.key]);
                    }
                }
            },

            itemsEndedCallback: (direction): void => {
                const compatibleDirection = direction === 'forward' ? 'down' : 'up';
                if (this._shouldLoadOnScroll()) {
                    if (this._preloadedItemsToBackward && direction === 'backward') {
                        this._preloadedItemsToBackward.then((items) => {
                            this._preloadedItemsToBackward = null;

                            if (!items) {
                                return;
                            }

                            const preloadedItemsAreAlreadyMerged = this._items.getRecordById(
                                items.at(0).getKey()
                            );
                            if (preloadedItemsAreAlreadyMerged) {
                                return;
                            }

                            this._options.dataLoadCallback?.(items, compatibleDirection);
                            this._sourceController.prependItems(items);
                            if (!this._hasMoreData('up')) {
                                this._updateShadowModeHandler(this._shadowVisibility);
                            }
                            this._updateVirtualNavigation(this._hasItemsOutRange);
                        });
                    } else {
                        this._loadMore(compatibleDirection);
                    }
                }
            },
        };
    }

    private _createListVirtualScrollController(
        options: IBaseControlOptions,
        shouldInitItemsContainer: boolean = true
    ): void {
        const VirtualScrollController =
            options.listVirtualScrollControllerConstructor ||
            ScrollControllerLib.ListVirtualScrollController;
        const controllerOptions = this._getListVirtualScrollControllerOptions(options);
        controllerOptions.itemsContainer = shouldInitItemsContainer
            ? this._getItemsContainer?.()
            : null;
        controllerOptions.collection = shouldInitItemsContainer
            ? controllerOptions.collection
            : null;
        this._listVirtualScrollController = new VirtualScrollController(controllerOptions);
    }

    private _getAdditionalTriggersOffsets(): ScrollControllerLib.IAdditionalTriggersOffsets {
        return {
            backward: this._listViewModel.getTopIndicator().isDisplayed()
                ? INDICATOR_HEIGHT - 1
                : 0,
            forward: this._listViewModel.getBottomIndicator().isDisplayed()
                ? INDICATOR_HEIGHT - 1
                : 0,
        };
    }

    private _updateVirtualNavigation(
        hasItemsOutsideOfRange: ScrollControllerLib.IHasItemsOutsideOfRange,
        forceUseHasItems: boolean = false
    ): void {
        // Горизонтальная плитка и карусель не должны стрелять событиями enable/disable VirtualNavigation
        if (this._options.orientation === 'horizontal') {
            return;
        }
        let hasHiddenItemsBackward;
        // TODO: Убрать когда построение будет только синхронным
        if (this._options.feature1184208466 && !forceUseHasItems) {
            hasHiddenItemsBackward = !!this._listViewModel.getStartIndex();
        } else {
            hasHiddenItemsBackward = hasItemsOutsideOfRange?.backward;
        }
        const topEnabled = forceUseHasItems
            ? hasHiddenItemsBackward
            : hasHiddenItemsBackward || this._hasMoreData('up');
        const bottomEnabled = forceUseHasItems
            ? hasItemsOutsideOfRange?.forward
            : hasItemsOutsideOfRange?.forward || this._hasMoreData('down');

        if (this._isMounted) {
            if (topEnabled) {
                this._options.notifyCallback('enableVirtualNavigation', ['top'], {
                    bubbling: true,
                });
            } else {
                this._options.notifyCallback('disableVirtualNavigation', ['top'], {
                    bubbling: true,
                });
            }

            if (bottomEnabled) {
                this._options.notifyCallback('enableVirtualNavigation', ['bottom'], {
                    bubbling: true,
                });
                // чтобы скрыть отступ под пэйджинг
            } else {
                this._options.notifyCallback('disableVirtualNavigation', ['bottom'], {
                    bubbling: true,
                });
                // чтобы нарисовать отступ под пэйджинг
            }
        }

        this._bottomVisible = !bottomEnabled;
    }

    private _scrollToElement(
        container: HTMLElement,
        position: string,
        force: boolean
    ): Promise<void> {
        // TODO: Нужно создать TileControl, который будет знать про ориентацию плитки и выбирать,
        // какой скроллконтроллер создать и с какими опциями.
        // https://online.sbis.ru/opendoc.html?guid=4ceef343-abd3-4cba-9a90-a55c387195f2&client=3
        return this._options.notifyCallback(
            this._options.orientation === 'horizontal'
                ? 'horizontalScrollToElement'
                : 'scrollToElement',
            [
                {
                    itemContainer: container,
                    position,
                    force,
                    onlyFirstScrollableParent: true,
                },
            ],
            { bubbling: true }
        ) as Promise<void>;
    }

    _initListViewModelHandler(model: Collection<Model>): void {
        if (model) {
            model.subscribe('onCollectionChange', this._onCollectionChanged);
            model.subscribe('onAfterCollectionChange', this._onAfterCollectionChanged);
            model.subscribe('indexesChanged', this._onIndexesChanged);
            model.subscribe('nextIndexesChanged', this._onNextIndexesChanged);
        }
    }

    _deleteListViewModelHandler(model: Collection<Model>): void {
        if (model) {
            model.unsubscribe('onCollectionChange', this._onCollectionChanged);
            model.unsubscribe('onAfterCollectionChange', this._onAfterCollectionChanged);
            model.unsubscribe('indexesChanged', this._onIndexesChanged);
            model.unsubscribe('nextIndexesChanged', this._onNextIndexesChanged);
        }
    }

    protected _onCollectionChangedScroll(
        action: string,
        newItems: CollectionItem<Model>[],
        newItemsIndex: number,
        removedItems: CollectionItem<Model>[],
        removedItemsIndex: number
    ): void {
        // TODO SCROLL self._listVirtualScrollController нужно юниты чинить, чтобы убрать
        if (!this._listVirtualScrollController) {
            return;
        }

        const params = {
            range: {
                startIndex: this._listViewModel.getStartIndex(),
                endIndex: this._listViewModel.getStopIndex(),
            },
            virtualPageSize: this._options.virtualScrollConfig?.pageSize,
            scrolledToBackwardEdge: this._scrollTop === 0,
            scrolledToForwardEdge: this._viewportHeight + this._scrollTop >= this._contentHeight,
            newItemsIndex,
            itemsLoadedByTrigger: this._addItemsByLoadToDirection,
            portionedLoading: _private.isPortionedLoad(this),
        };

        switch (action) {
            case IObservable.ACTION_RESET:
                // если есть данные и вниз и вверх, то скрываем триггер вверх,
                // т.к. в первую очередь грузим вниз
                const backwardTriggerVisible =
                    !this._hasMoreData('up') ||
                    (!this._listViewModel.getCount() && !_private.isPortionedLoad(this)) ||
                    !this._options.attachLoadTopTriggerToNull;
                this._listVirtualScrollController.setBackwardTriggerVisibility(
                    backwardTriggerVisible
                );
                this._listVirtualScrollController.setForwardTriggerVisibility(true);
                this._listVirtualScrollController.resetItems();
                break;
            case IObservable.ACTION_ADD:
                const calcMode = ScrollControllerLib.getCalcMode({
                    ...params,
                    changedItems: this._addedItemsByOneSession,
                    preloadItems: this._wasPreloadedDataToBackward,
                    renderPreloadedItems: this._shouldRenderPreloadedDataRightAway(),
                });
                this._listVirtualScrollController.addItems(
                    newItemsIndex,
                    newItems.length,
                    ScrollControllerLib.getScrollMode({
                        ...params,
                        changedItems: this._addedItemsByOneSession,
                    }),
                    calcMode
                );

                // Если calcMode === 'nothing', то индексы коллекци не поменяются.
                // Поэтому, нужно сообщить об изменении сейчас.
                if (calcMode === 'nothing') {
                    if (this._isMounted && this._options.virtualRangeChangedCallback) {
                        this._listVirtualScrollController.callBeforeRangeChangeCallback({
                            startIndex: this._listViewModel.getStartIndex(),
                            endIndex: this._listViewModel.getStopIndex(),
                        });
                    }
                }
                break;
            case IObservable.ACTION_REMOVE:
                this._listVirtualScrollController.removeItems(
                    removedItemsIndex,
                    removedItems.length,
                    ScrollControllerLib.getScrollMode({
                        ...params,
                        changedItems: this._removedItemsByOneSession,
                    })
                );
                break;
            case IObservable.ACTION_MOVE:
                this._listVirtualScrollController.moveItems(
                    newItemsIndex,
                    newItems.length,
                    removedItemsIndex,
                    removedItems.length
                );
                break;
            case IObservable.ACTION_CHANGE:
                if (newItems.properties === 'contents') {
                    this._listVirtualScrollController.changeItems();
                }
                break;
        }
    }

    // endregion Scroll

    protected _$react_componentDidMount(): void {
        this._options.drawItemsCallback?.();
    }

    protected _afterMount(): void {
        this._isMounted = true;
        this._options.onListMounted(this, this._options);
        this._options.notifyCallback('beginListAfterRender', [], {
            bubbling: true,
        });

        if (!this._sourceController?.getLoadError()) {
            this._registerObserver();
        }
        // вьюха кинет событие на свой маунт. В этот момент BaseControl еще не замаунчен и не сможет посчитать размеры.
        this._viewResize();
        this._listVirtualScrollController.setListContainer(this._container);
        this._listVirtualScrollController.afterMountListControl();

        if (constants.isBrowserPlatform) {
            window.addEventListener('resize', this._onWindowResize);
        }

        // TODO: Не переношу в грид контрол, т.к. этот код удалится в 22.1000.
        if (this._useServerSideColumnScroll) {
            this._useServerSideColumnScroll = false;
        }

        if (this._options.itemsDragNDrop && this._container) {
            const container = this._container[0] || this._container;
            container.addEventListener('dragstart', this._nativeDragStart);
        }
        this._loadedItems = null;

        if (this._editInPlaceController) {
            _private.registerFormOperation(this);
            if (this._editInPlaceController.isEditing()) {
                _private.activateEditingRow(this, false);
            }
        }

        // для связи с контроллером ПМО
        this._options.notifyCallback(
            'register',
            ['selectedTypeChanged', this, this._onSelectedTypeChanged],
            { bubbling: true }
        );
        this._notifyOnDrawItems();
        if (this._updateShadowModeAfterMount) {
            this._updateShadowModeAfterMount();
            this._updateShadowModeAfterMount = null;
        }

        // Список может замаунтится уже во время ДнД. Чтобы узнать о ДнД получаем dragObject из события.
        const dragObject = this._options.notifyCallback(
            'register',
            ['documentDragStart', this, this._documentDragStart],
            { bubbling: true }
        ) as IDragObject;
        if (dragObject && dragObject.entity && dragObject.entity instanceof ItemsEntity) {
            this._documentDragging = true;
            this._dragEntity = dragObject.entity;
        }
        this._options.notifyCallback('register', ['documentDragEnd', this, this._documentDragEnd], {
            bubbling: true,
        });

        RegisterUtil(this, 'loadToDirection', _private.loadToDirection.bind(this, this));

        this._options.slicelessAfterMount?.(this, this._options);

        if (this._hasSelectionController()) {
            const controller = this._getSelectionController();
            this._changeSelection(controller.getSelection());
        }

        this._updateViewportFilledInIndicatorsController();
        this._indicatorsController.afterMountCallback();
        if (detection.isMobilePlatform) {
            // на мобильных устройствах не сработает mouseEnter, поэтому инициализируем индикаторы сразу после маунта
            this._indicatorsController.initializeIndicators();
        }
        // если элементов не хватает на всю страницу, то сразу же показываем ромашки и триггеры, чтобы догрузить данные
        if (this._contentHeight <= this._viewportHeight) {
            // В первую очередь показываем нижний индикатор(он покажется в _beforeMount), но если данных вниз нет,
            // то показываем верхний индикатор с триггером при наличии еще данных.
            // Сделано так, чтобы не было сразу загрузки в обе стороны.
            // Верхний индикатор нельзя показать в _beforeMount, т.к. мы не знаем хватит ли элементов на всю страницу
            // и при показе верхнего индикатора нужно добавить отступ от триггера.
            if (
                !this._indicatorsController.shouldDisplayBottomIndicator() &&
                this._indicatorsController.shouldDisplayTopIndicator()
            ) {
                // скроллить не нужно, т.к. не куда, ведь элементы не занимают весь вьюПорт
                this._indicatorsController.displayTopIndicator(false);
                this._listVirtualScrollController.setBackwardTriggerVisibility(true);
            }
        }

        this._listVirtualScrollController.setAdditionalTriggersOffsets(
            this._getAdditionalTriggersOffsets()
        );

        // TODO SCROLL по идее это не нужно с новым скроллом, т.к. мы в новом контроллере проверим видимость триггера
        //  и спровоцируем подгрузку по нему
        // UPD: подгрузка не будет вызвана, если у нас не infinity навигация. Нужно править проверку shouldLoadByScroll
        this._tryLoadToDirectionAgain(this._items, this._options.root);

        this._preloadDataToBackward();

        // в тач интерфейсе инициализировать пейджер необходимо при загрузке страницы
        // В beforeMount инициализировать пейджер нельзя, т.к. не корректно посчитаются его размеры.
        // isMobilePlatform использовать для проверки не целесообразно, т.к. на интерфейсах с
        // touch режимом isMobilePlatform может быть false
        if (!this._pagingVisible) {
            if (
                TouchDetect.getInstance().isTouch() ||
                // Для react-списка показываем пейджинг сразу после оживления
                // https://online.sbis.ru/opendoc.html?guid=414b6a21-d902-4e93-b4e6-54c9c4c980c2&client=3
                this.props._isReactView
            ) {
                if (this._preloadedItemsToBackward) {
                    // Если запустилась предзагрузка вверх, то покажем пейджинг в коде предзагрузки и по её завершению,
                    // а здесь запустим предварительный импорт модулей пейджинга
                    import('Controls/paging');
                } else {
                    // Если не запусказась предзагрузка вверх, то запускаем показ пейджинга сразу
                    _private.initPaging(this);
                }
            }
        }

        if (this._options.virtualRangeChangedCallback) {
            this._callVirtualRangeChangedCallback(
                this._options.virtualRangeChangedCallback,
                this._listViewModel.getStartIndex(),
                this._listViewModel.getStopIndex()
            );
        }
    }

    protected _updateBaseControlModel(newOptions: IBaseControlOptions): void {
        const emptyTemplateChanged = this._options.emptyTemplate !== newOptions.emptyTemplate;

        if (emptyTemplateChanged) {
            this._listViewModel.setEmptyTemplate(newOptions.emptyTemplate);
        }
        this._listViewModel.setEmptyTemplateOptions({
            ...newOptions.emptyTemplateOptions,
            items: this._items,
            filter: newOptions.filter,
        });

        this._listViewModel.setRowSeparatorSize(newOptions.rowSeparatorSize);
        this._listViewModel.setRowSeparatorVisibility(newOptions.rowSeparatorVisibility);
        this._listViewModel.setDisplayProperty(newOptions.displayProperty);

        if (newOptions.collapsedGroups !== this._options.collapsedGroups) {
            GroupingController.setCollapsedGroups(this._listViewModel, newOptions.collapsedGroups);
        }

        this._listViewModel.setTheme(newOptions.theme);

        if (newOptions.editingConfig !== this._options.editingConfig) {
            this._listViewModel.setEditingConfig(this._getEditingConfig(newOptions));
        }

        this._listViewModel.setMultiSelectVisibility(
            this._resolveMultiSelectVisibility(newOptions.multiSelectVisibility)
        );
        this._listViewModel.setMultiSelectPosition(newOptions.multiSelectPosition);
        this._listViewModel.setMultiSelectAccessibilityProperty(
            newOptions.multiSelectAccessibilityProperty
        );
        this._listViewModel.setItemActionsPosition(newOptions.itemActionsPosition);
        this._listViewModel.setStickyCallback(newOptions.stickyCallback);

        if (!isEqual(this._options.itemPadding, newOptions.itemPadding)) {
            this._listViewModel.setItemPadding(newOptions.itemPadding || {});
        }

        if (!isEqual(this._options.trackedProperties, newOptions.trackedProperties)) {
            this._listViewModel.setTrackedProperties(newOptions.trackedProperties);
            this._updateTrackedValues();
        }

        this._listViewModel.setBackgroundStyle(newOptions.backgroundStyle);
        this._listViewModel.setHoverBackgroundStyle(newOptions.hoverBackgroundStyle);

        this._listViewModel.setItemsSpacing(newOptions.itemsSpacing);

        this._listViewModel.setGroupProperty(newOptions.groupProperty);
        this._listViewModel.setStickyHeader(newOptions.stickyHeader);
        this._listViewModel.setStickyFooter(newOptions.stickyFooter);
        this._listViewModel.setStickyResults(newOptions.stickyResults);
        this._listViewModel?.setLadderProperties?.(newOptions?.ladderProperties);
    }

    protected _getTrackedValueOffset() {
        return 15 + getStickyHeadersHeight(this._container, 'top', 'allFixed');
    }

    protected _updateTrackedValues(): void {
        const trackedValuesVisible =
            this._scrollTop + this._placeholders?.backward > 0 ||
            (this._isScrollShown && this._hasMoreData('up'));
        this._listViewModel.setTrackedValuesVisible(trackedValuesVisible);
        if (trackedValuesVisible) {
            const offset = this._getTrackedValueOffset();
            const edgeItemKey = this._listVirtualScrollController.getEdgeVisibleItem(
                'backward',
                offset
            )?.key;
            this._listViewModel.updateTrackedValues(
                this._listViewModel.getItemBySourceKey(edgeItemKey)
            );
        }
    }

    protected _throttledUpdateTrackedValue = throttle(
        () => {
            this._updateTrackedValues();
        },
        SCROLLMOVE_DELAY,
        true
    );

    protected _keyDownLeft(event: SyntheticEvent<KeyboardEvent>, canMoveMarker: boolean): void {
        // TODO: Не переношу в грид контрол, т.к. этот код удалится в 22.1000.
        // Сначала обрабатываем скролл колонок, если не было проскролено, то двигаем маркер
        if (
            this._options.columnScroll &&
            event.nativeEvent.shiftKey &&
            this._children.listView?.keyDownLeft?.()
        ) {
            return;
        }
        if (canMoveMarker) {
            this._options.onViewKeyDownArrowLeftNew(event, this, this._options);
        }
    }

    protected _keyDownRight(event: SyntheticEvent<KeyboardEvent>, canMoveMarker: boolean): void {
        // TODO: Не переношу в грид контрол, т.к. этот код удалится в 22.1000.
        // Сначала обрабатываем скролл колонок, если не было проскролено, то двигаем маркер
        if (
            this._options.columnScroll &&
            event.nativeEvent.shiftKey &&
            this._children.listView?.keyDownRight?.()
        ) {
            return;
        }
        if (canMoveMarker) {
            this._options.onViewKeyDownArrowRightNew(event, this, this._options);
        }
    }

    protected _keyDownDel(event: SyntheticEvent<KeyboardEvent>): void {
        this._options.onViewKeyDownDelNew(event, this, this._options);
    }

    // TODO compatibility. Удалить, когда тут не останется ItemActions.
    _updateItemActions(options): void {
        _private.updateItemActions(this, options);
    }

    // TODO compatibility. Удалить, когда тут не останется ItemActions.
    _handleItemActionClick(
        action: IShownItemAction,
        clickEvent: SyntheticEvent<MouseEvent>,
        item: CollectionItem<Model>,
        isMenuClick: boolean
    ): void {
        _private.handleItemActionClick(this, action, clickEvent, item, isMenuClick);
    }

    protected _beforeUpdate(
        newOptions: TOptions,
        contexts?: { workByKeyboard?: WorkByKeyboardContext }
    ): void {
        // Запоминаем новые опции, чтобы в onCollectionChanged иметь к ним доступ,
        // если метод вызывается синхронно внутри _beforeUpdate
        this._newOptions = { ...newOptions };
        // Локальная переменная, т.к. может оказаться, что синхронизация вызвана синхронно
        // и afterUpdate не вызывался. Модель на этот момент уже пересоздана,
        // такие манипуляции как смена маркера уже случились и не должны выполняться снова.
        let modelRecreated = false;

        this._startBeforeUpdate(newOptions);
        _private.updateWorkByKeyboardStatus(this, contexts);
        this._updateInProgress = true;
        const navigationChanged = !isEqual(newOptions.navigation, this._options.navigation);
        const filterChanged = !isEqual(newOptions.filter, this._options.filter);
        const sourceChanged = !isEqual(newOptions.source, this._options.source);
        const rootChanged = newOptions.root !== this._options.root;
        const loadedBySourceController = this._wasReload;
        let isItemsResetFromSourceController = false;

        // При изменении отрисованных записей, не нужно восстановливать скролл вручную. Это берет на себя
        // AsyncListVirtualScrollController если нужно
        if (!isEqual(newOptions._renderedItems, this._options._renderedItems)) {
            this._shouldHandleResize = true;
            this._listVirtualScrollController.setRenderedItems(newOptions._renderedItems);
        }
        if (
            newOptions.minVirtualScrollIndex !== this._options.minVirtualScrollIndex ||
            newOptions.maxVirtualScrollIndex !== this._options.maxVirtualScrollIndex
        ) {
            this._listVirtualScrollController.updateMinMaxIndexes(
                newOptions.minVirtualScrollIndex,
                newOptions.maxVirtualScrollIndex
            );
        }
        const isSourceControllerLoadingNow = this._isSourceControllerLoadingNow(newOptions);

        const sourceControllerChanged =
            this._options.sourceController !== newOptions.sourceController;
        const items = newOptions.sourceController?.getItems() || newOptions.items;
        const itemsChanged = items && this._items !== items;

        if (filterChanged || rootChanged) {
            if (this._hasSelectionController() && this._wasReload) {
                this._getSelectionController().setMassSelect(true);
            }
            this._listViewModel.setResultsVisibility?.(newOptions.resultsVisibility);
        }
        if (
            (navigationChanged || filterChanged || sourceChanged) &&
            loadedBySourceController &&
            !itemsChanged
        ) {
            this._initialPosition = this._listViewModel.getSourceItemBySourceIndex(0)?.getKey();
        }

        if (this._options.activeElement !== newOptions.activeElement) {
            this._listVirtualScrollController.setActiveElementKey(newOptions.activeElement);
        }

        if (navigationChanged) {
            // При смене страницы, должно закрыться редактирование записи.
            _private.closeEditingIfPageChanged(
                this,
                this._options.navigation,
                newOptions.navigation
            );
            _private.initializeNavigation(this, newOptions);
            _private.prepareFooter(this, newOptions, this._sourceController);
            if (this._pagingVisible) {
                this._pagingVisible = false;
            }
        }

        if (
            newOptions.keyProperty !== this._options.keyProperty ||
            (this._sourceController &&
                this._keyProperty !== this._sourceController.getKeyProperty())
        ) {
            this._initKeyProperty(newOptions);
            _private.checkRequiredOptions(this, newOptions);
        }

        if (newOptions.sourceController && sourceControllerChanged) {
            this._updateSourceController(this._sourceController, newOptions.sourceController);

            // Возможна ситуация, что наверху пересоздался контроллер и загрузил новые данные.
            // У нас не сработает dataLoadCallback, т.к. мы не успели подписаться.
            // Поэтому сами вызываем колбэк в этом кейсе.
            if (itemsChanged && !isSourceControllerLoadingNow) {
                this._dataLoadCallback(new EventObject('dataLoad', this), items, null);
                this._itemsChangedOnDataLoad(
                    new EventObject('itemsChanged', this),
                    items,
                    null,
                    null
                );
            }
        }

        const shouldReInitCollection =
            !newOptions.useCollection &&
            (!!newOptions._recreateCollection ||
                (newOptions.viewModelConstructor &&
                    newOptions.viewModelConstructor !== this._options.viewModelConstructor) ||
                newOptions.collection !== this._options.collection ||
                (this._listViewModel &&
                    this._keyProperty !== this._listViewModel.getKeyProperty()));

        if (this._editInPlaceController) {
            const isEditingModeChanged =
                (this._options.editingConfig && !newOptions.editingConfig) ||
                (this._options.editingConfig !== newOptions.editingConfig &&
                    this._getEditingConfig().mode !== this._getEditingConfig(newOptions).mode);

            if (isEditingModeChanged) {
                this._editInPlaceController.updateOptions({
                    mode: this._getEditingConfig(newOptions).mode,
                });
            }
            if (shouldReInitCollection || isEditingModeChanged) {
                if (this.isEditing()) {
                    // При перезагрузке или при смене модели(например, при поиске), редактирование должно завершаться
                    // без возможности отменить закрытие из вне.
                    this._cancelEdit(true).then(() => {
                        if (shouldReInitCollection) {
                            this._destroyEditInPlaceController();
                        }
                    });
                } else {
                    if (shouldReInitCollection) {
                        this._destroyEditInPlaceController();
                    }
                }
            }
        }

        // Пересоздаем контроллер перед пересозданием коллекции,
        // чтобы контроллер мог честно задестроиться с еще живой коллекцией
        if (
            this._options.disableVirtualScroll !== newOptions.disableVirtualScroll ||
            this._options.multiColumns !== newOptions.multiColumns ||
            this._options.listVirtualScrollControllerConstructor !==
                newOptions.listVirtualScrollControllerConstructor
        ) {
            this._listVirtualScrollController?.destroy();
            // Не нужно сразу задавать itemsContainer, если модель была пересоздана.
            // Т.к. он уже может быть не актуальным.
            this._createListVirtualScrollController(newOptions, !shouldReInitCollection);
        }

        if (newOptions.sourceController || newOptions.items) {
            if (isSourceControllerLoadingNow) {
                this._noDataBeforeReload = !_private.hasDataBeforeLoad(this);
            }
        }

        if (shouldReInitCollection && this._listViewModel) {
            // Если поменялся sourceController, то и данные тоже поменялись
            const newItems =
                this._wasReload || sourceControllerChanged
                    ? newOptions.sourceController.getItems()
                    : this._listViewModel.getSourceCollection();
            this._deleteListViewModelHandler(this._listViewModel);

            this._noDataBeforeReload = !(newItems && newItems.getCount());
            this._reinitializeModel({ ...newOptions, keyProperty: this._keyProperty }, newItems);

            // Важно обновить коллекцию в scrollContainer перед сбросом скролла, т.к. scrollContainer реагирует на
            // scroll и произведет неправильные расчёты, т.к. у него старая collection.
            // https://online.sbis.ru/opendoc.html?guid=caa331de-c7df-4a58-b035-e4310a1896df
            this._updateIndicatorsController(newOptions, isSourceControllerLoadingNow);

            // При пересоздании коллекции будет скрыт верхний триггер и индикатор,
            // чтобы не было лишней подгрузки при отрисовке нового списка.
            // Показываем по необходимости верхний индикатор и триггер
            if (this._indicatorsController.shouldDisplayTopIndicator()) {
                this._indicatorsController.displayTopIndicator(true);
            } else {
                this._listVirtualScrollController.setBackwardTriggerVisibility(true);
            }

            modelRecreated = true;

            _private.setHasMoreData(this._listViewModel, _private.getHasMoreData(this));
        }

        this._updateIndicatorsController(newOptions, isSourceControllerLoadingNow);

        if (newOptions.sourceController || newOptions.items) {
            if (
                items &&
                ((this._listViewModel && !this._listViewModel.getSourceCollection()) ||
                    itemsChanged)
            ) {
                if (!this._listViewModel || !this._listViewModel.getCount()) {
                    this._deleteListViewModelHandler(this._listViewModel);
                    this._reinitializeModel(newOptions, items);
                    this._updateIndicatorsController(newOptions, isSourceControllerLoadingNow);

                    // TODO после выполнения код будет в одном месте
                    //  https://online.sbis.ru/opendoc.html?guid=59d99675-6bc4-436e-967a-34b448e8f3a4
                    // При пересоздании коллекции будет скрыт верхний триггер и индикатор,
                    // чтобы не было лишней подгрузки при отрисовке нового списка.
                    // Показываем по необходимости верхний индикатор и триггер
                    if (this._indicatorsController.shouldDisplayTopIndicator()) {
                        this._indicatorsController.displayTopIndicator(true);
                    } else {
                        this._listVirtualScrollController.setBackwardTriggerVisibility(true);
                    }
                }

                // Если прислали новый рекордсет, то сохраняем позицию скролла.
                // Пока что от прикладников в ItemsView было желание только сохранять скролл.
                // Видимо придется добавить опцию, когда потребуется другое поведение.
                if (newOptions.items && newOptions.items !== this._items && !newOptions.source) {
                    const scrollBehaviourOnReset = newOptions.keepScrollAfterReload
                        ? 'keep'
                        : 'reset';
                    this._listVirtualScrollController.setScrollBehaviourOnReset(
                        scrollBehaviourOnReset
                    );
                }

                _private.assignItemsToModel(this, items, newOptions);
                isItemsResetFromSourceController = true;

                // TODO удалить когда полностью откажемся от старой модели
                if (
                    !this._hasSelectionController() &&
                    newOptions.multiSelectVisibility !== 'hidden' &&
                    newOptions.selectedKeys &&
                    newOptions.selectedKeys.length
                ) {
                    const controller = this._createSelectionController(newOptions);
                    controller.setSelection({
                        selected: newOptions.selectedKeys,
                        excluded: newOptions.excludedKeys,
                    });
                }

                _private.initVisibleItemActions(this, newOptions);
            }

            if (newOptions.sourceController) {
                if (sourceControllerChanged) {
                    _private.executeAfterReloadCallbacks(this, this._items, newOptions);
                }

                if (loadedBySourceController && !this._sourceController.getLoadError()) {
                    if (this._listViewModel) {
                        this._listViewModel.setHasMoreData(_private.getHasMoreData(this));
                    }
                    if (!this._shouldNotResetPagingCache) {
                        this._cachedPagingState = false;
                    }
                    _private.prepareFooter(this, newOptions, this._sourceController);
                }
            }
        }

        if (this._hasSelectionController()) {
            this._updateSelectionController(newOptions);
        }

        this._options.slicelessUpdateMarkerControllerOnBeforeUpdate?.(
            this,
            this._options,
            newOptions,
            {
                modelRecreated,
                isPortionedLoad: !isSourceControllerLoadingNow || _private.isPortionedLoad(this),
            }
        );

        this._bottomPaddingClass = this._getBottomPaddingClass(this, newOptions);

        // Когда удаляют все записи, мы сбрасываем selection, поэтому мы его должны применить даже когда список пуст
        if (this._items) {
            const selectionChanged =
                !isEqual(this._options.selectedKeys, newOptions.selectedKeys) ||
                !isEqual(this._options.excludedKeys, newOptions.excludedKeys);

            const visibilityChangedFromHidden =
                this._options.multiSelectVisibility === 'hidden' &&
                newOptions.multiSelectVisibility !== 'hidden';

            // В browser когда скрывают видимость чекбоксов, еще и сбрасывают selection
            if (
                (selectionChanged &&
                    (newOptions.multiSelectVisibility !== 'hidden' ||
                        this._hasSelectionController())) ||
                (visibilityChangedFromHidden && newOptions.selectedKeys?.length) ||
                this._options.selectionType !== newOptions.selectionType
            ) {
                const controller = this._getSelectionController(newOptions);
                const newSelection =
                    newOptions.selectedKeys === undefined
                        ? controller.getSelection()
                        : {
                              selected: newOptions.selectedKeys,
                              excluded: newOptions.excludedKeys || [],
                          };

                checkWasabyEvent(this._options.listSelectedKeysCountChangedCallback)?.(
                    controller.getCountOfSelected(newSelection),
                    controller.isAllSelected(true, newSelection)
                );
                this._options.notifyCallback('listSelectedKeysCountChanged', [
                    controller.getCountOfSelected(newSelection),
                    controller.isAllSelected(true, newSelection),
                ]);

                controller.setSelection(newSelection);
                this._listViewModel.setMultiSelectVisibility(
                    this._resolveMultiSelectVisibility(this._options.multiSelectVisibility)
                );
            }
        }
        if (newOptions.multiSelectVisibility === 'hidden') {
            if (this._hasSelectionController()) {
                this._getSelectionController().destroy();
                this._selectionController = null;
            }
            if (this._selectedItemsShown) {
                this._resetSelectedItemsShownMode();
            }
        }

        // При смене наввигации мы прячем пейджинг, а обновление скролла может привести к его показу,
        // основываясь на старых опциях. Поэтому навигацию нужно обновлять после обновления скролла.
        if (navigationChanged) {
            // При смене страницы, должно закрыться редактирование записи.
            _private.closeEditingIfPageChanged(
                this,
                this._options.navigation,
                newOptions.navigation
            );
            _private.initializeNavigation(this, newOptions);
            _private.prepareFooter(this, newOptions, this._sourceController);
            if (this._pagingVisible) {
                this._pagingVisible = false;
            }
        }
        if (this._editInPlaceController) {
            this._editInPlaceController.updateOptions({
                collection: this._listViewModel,
            });
        }

        if (!isSourceControllerLoadingNow) {
            _private.doAfterUpdate(this, () => {
                if (this._listViewModel) {
                    this._listViewModel.setSearchValue(newOptions.searchValue);
                }
                if (this._sourceController) {
                    _private.setHasMoreData(this._listViewModel, _private.getHasMoreData(this));

                    if (this._pagingNavigation && this._items && loadedBySourceController) {
                        _private.updatePagingData(
                            this,
                            this._listViewModel.getMetaData().more,
                            this._options
                        );

                        if (filterChanged) {
                            _private.resetPagingNavigationPage(this, newOptions.navigation);
                        }
                    }
                }
            });
            if (!isEqual(newOptions.groupHistoryId, this._options.groupHistoryId)) {
                if (this._listViewModel) {
                    this._listViewModel.setCollapsedGroups(
                        this._sourceController.getCollapsedGroups() ||
                            newOptions.collapsedGroups ||
                            []
                    );
                }
            }
        }
        // Если поменялись ItemActions, то закрываем свайп
        if (
            !ItemActionsController.isMatchingActionLists(
                newOptions.itemActions,
                this._options.itemActions
            )
        ) {
            _private.closeSwipe(this);
        }

        // При смене позиции операций над записью необходимо убирать hoverFreezeController,
        // если он не нужен.
        if (
            newOptions.itemActionsPosition !== this._options.itemActionsPosition &&
            newOptions.itemActionsPosition !== 'outside' &&
            this._hoverFreezeController
        ) {
            this._hoverFreezeController.unfreezeHover();
            this._hoverFreezeController = null;
        }

        if (newOptions.hasItemWithImage !== this._options.hasItemWithImage) {
            this._needRestoreScroll = true;
            this._shouldHandleResize = true;
        }

        _private.updateFadeController(this, newOptions);

        if (this._itemsChanged) {
            this._shouldNotifyOnDrawItems = true;
        }

        this._spaceBlocked = false;

        // Не нужно обновлять модель, если она была пересоздана или не создана вообще
        if (!modelRecreated && !!this._listViewModel) {
            this._updateBaseControlModel(newOptions);
        }

        if (this._options.itemsSelector !== newOptions.itemsSelector) {
            this._listVirtualScrollController.setItemsQuerySelector(newOptions.itemsSelector);
        }

        // После пересоздания модели нужно проинициализировать операции записей.
        // Старая модель в контроллере операций уже не актуальна.
        // Инициализация происходить после инициализации контроллера виртуального скролла,
        // Чтобы в конфиг операций над записью попали актуальные опции.
        if (
            shouldReInitCollection &&
            this._listViewModel &&
            (newOptions.itemActions || newOptions.itemActionsProperty)
        ) {
            _private.updateItemActions(this, newOptions);

            // Переинициализация ранее проинициализированных опций записи нужна при:
            // 1. Изменились опции записи
            // 3. Изменился коллбек видимости опции
            // 4. Записи в модели были пересозданы из sourceController
            // 5. обновилась опция readOnly (относится к TreeControl)
            // 6. обновилась опция itemActionsPosition
            // * Обновление не должно происходить если новые данные ещё не загружены.
            // * Обновление должно происходить после инициализации контроллера виртуального скролла,
            // Чтобы в конфиг операций над записью попали актуальные опции.
        } else if (
            !isSourceControllerLoadingNow &&
            (newOptions.itemActions !== this._options.itemActions ||
                newOptions.itemActionVisibilityCallback !==
                    this._options.itemActionVisibilityCallback ||
                isItemsResetFromSourceController ||
                newOptions.readOnly !== this._options.readOnly ||
                newOptions.itemActionsPosition !== this._options.itemActionsPosition)
        ) {
            let itemToUpdateActions: CollectionItem;
            if (this._editInPlaceController?.isEditing()) {
                itemToUpdateActions = this._editInPlaceController._getEditingItem();
            }
            _private.updateInitializedItemActions(this, newOptions, itemToUpdateActions);
        } else if (newOptions.itemActionsVisibility !== this._options.itemActionsVisibility) {
            _private.initVisibleItemActions(this, newOptions);
        }

        // Нужен TileControl
        if (this._options.beforeItemsTemplate !== newOptions.beforeItemsTemplate) {
            this._listViewModel.setBeforeItemsTemplate?.(newOptions.beforeItemsTemplate);
        }
        if (this._options.afterItemsTemplate !== newOptions.afterItemsTemplate) {
            this._listViewModel.setAfterItemsTemplate?.(newOptions.afterItemsTemplate);
        }

        // Обновлять additionalTriggersOffsets нужно только после отрисовки, когда индикаторы точно отображаюатся.
        // Обязательно в конце beforeUpdate. Т.к. это место гарантирует, что индикатор на этот рендер отрисуется.
        this._listVirtualScrollController.setAdditionalTriggersOffsets(
            this._getAdditionalTriggersOffsets()
        );

        // Актуализируем модель в слайсе.
        // При некоторых действиях на странице, слайс пересоздается, а список нет, он обновляется.
        // Список не знает как отследить пересоздание слайса и знать не должен.
        // Просто актуализируем коллекцию.
        // В слайсе есть проверка, которая предотвратит обновление, если коллекция актуальна.
        // По ошибке https://online.sbis.ru/opendoc.html?guid=78cd4cb6-ed7b-44c5-8cba-46b16af4a91d&client=3
        // Удалено будет вместе с полным выносом коллекции из списка, срок неизвестен.
        if (!newOptions.useCollection) {
            newOptions.setCollection(this._listViewModel);
        }

        this._endBeforeUpdate(newOptions);
        this._listVirtualScrollController.endBeforeUpdateListControl();
        this._newOptions = null;
    }

    protected _startBeforeUpdate(newOptions: TOptions): void {
        // for override
    }

    protected _endBeforeUpdate(newOptions: TOptions): void {
        // for override
    }

    protected _reinitializeModel(options: TOptions, newItems: RecordSet): void {
        _private.initializeModel(this, options, newItems);
        this._listVirtualScrollController.setCollection(this._listViewModel);
        this._listVirtualScrollController.setItemsContainer(null);
    }

    reloadItem(key: TKey, options: IReloadItemOptions = {}): Promise<Model | RecordSet> {
        return this._sourceController.reloadItem(key, options);
    }

    getItems(): RecordSet {
        return this._items;
    }

    scrollToItem(
        key: TItemKey,
        position?: string,
        force?: boolean,
        allowLoad?: boolean
    ): Promise<void> {
        return _private.scrollToItem(this, key, position, force, allowLoad);
    }

    _onValidateCreated(e: Event, control: ValidateContainer): void {
        this._validators.push(control);
        this._validateController?.addValidator(control);
    }

    _onValidateDestroyed(e: Event, control: ValidateContainer): void {
        this._validators = this._validators.filter((validate) => {
            return validate !== control;
        });
        this._validateController?.removeValidator(control);
    }

    protected _afterReloadCallback(options: IBaseControlOptions, loadedList: RecordSet): void {
        /* FIXME: empty */
    }

    protected _getColumnsCount(): number {
        return 0;
    }

    protected _getSpacing(): number {
        return 0;
    }

    // TODO https://online.sbis.ru/opendoc.html?guid=5f388a43-e529-464a-8e81-3e441ebcbb83&client=3
    protected _$react_componentWillUnmount(): void {
        this._unmount();
    }

    protected _beforeUnmount(): void {
        this._unmount();
        super._beforeUnmount();
    }

    protected _unmount(): void {
        // Делаем обработку один раз.
        if (this._wasUnmount) {
            return;
        }
        this._wasUnmount = true;

        if (this._listVirtualScrollController) {
            this._listVirtualScrollController.destroy();
            this._listVirtualScrollController = null;
        }
        if (this._scrollContext) {
            this._scrollContext.removeArrowButtonClickCallback(this._arrowButtonClickCallback);
        }
        this._destroyIndicatorsController();
        if (this._itemActionsController) {
            this._itemActionsController.destroy();
            this._itemActionsController = null;
        }
        if (this._options.itemsDragNDrop) {
            const container = this._container[0] || this._container;
            container.removeEventListener('dragstart', this._nativeDragStart);
            this._options.notifyCallback('_removeDraggingTemplate', [], {
                bubbling: true,
            });
        }
        if (this._items) {
            this._items.unsubscribe('onPropertyChange', this._onCollectionPropertyChange);
        }
        this._updateSourceController(this._sourceController, undefined);

        if (this._scrollPagingCtr) {
            this._scrollPagingCtr.destroy();
        }

        if (this._editInPlaceController) {
            this._destroyEditInPlaceController();
        }

        if (this._listViewModel) {
            this._deleteListViewModelHandler(this._listViewModel);
            // коллекцию дестроим только, если она была создана в BaseControl(не передана в опциях)
            if (!this._options.collection) {
                this._listViewModel.destroy();
            }
        }

        if (this._validateController) {
            this._validateController.destroy();
            this._validateController = null;
        }

        // для связи с контроллером ПМО
        this._options.notifyCallback('unregister', ['selectedTypeChanged', this], {
            bubbling: true,
        });

        this._options.notifyCallback('unregister', ['documentDragStart', this], { bubbling: true });
        this._options.notifyCallback('unregister', ['documentDragEnd', this], {
            bubbling: true,
        });
        UnregisterUtil(this, 'loadToDirection');

        this._unregisterMouseMove();
        this._unregisterMouseUp();

        _private.closePopup(this);

        // При разрушении списка нужно в ПМО сбросить счетчик выбранных записей
        if (this._hasSelectionController()) {
            checkWasabyEvent(this._options.listSelectedKeysCountChangedCallback)?.(0, false);
            this._options.notifyCallback('listSelectedKeysCountChanged', [0, false]);
        }

        if (constants.isBrowserPlatform) {
            window.removeEventListener('resize', this._onWindowResize);
        }
        this._isMounted = false;
    }

    _destroyEditInPlaceController() {
        this._editInPlaceController.destroy();
        this._editInPlaceController = null;
        this._editInPlaceInputHelper = null;
    }

    protected _beforeRender(): void {
        this._listVirtualScrollController.beforeRenderListControl();
        // При наличии неотрисованной ромашки прояем что список проскроллен.
        // Скролл будет восстанавливать только в этом случае.
        // Если список не проскроллен мы должны обязательно вызвать scrollToElement.
        // Т.к. scrollToElement учтет контент, который будет застикан сразу же после скролла
        // и благодаря этому триггер сверху гарантированно не сработает.
        const hasNotRenderedChanges =
            this._needRestoreScroll ||
            (this._indicatorsController.hasNotRenderedChanges() && this._scrollTop);
        if (hasNotRenderedChanges && !this._wasReload) {
            this._listVirtualScrollController.saveScrollPosition();
        }
    }

    protected _afterRender(oldOptions: IBaseControlOptions): void {
        this._needRestoreScroll = false;

        if (
            this._options.disableVirtualScroll !== oldOptions.disableVirtualScroll ||
            this._options.multiColumns !== oldOptions.multiColumns ||
            this._options.listVirtualScrollControllerConstructor !==
                oldOptions.listVirtualScrollControllerConstructor
        ) {
            this._listVirtualScrollController?.setListContainer(this._container);
        }

        if (this._updateShadowModeBeforePaint) {
            this._updateShadowModeBeforePaint();
            this._updateShadowModeBeforePaint = null;
        }

        if (this._drawingIndicatorDirection) {
            this._indicatorsController.hideDrawingIndicator(
                this._getIndicatorDomElement(this._drawingIndicatorDirection),
                this._drawingIndicatorDirection
            );
            this._drawingIndicatorDirection = null;
        }

        this._actualPagingVisible = this._pagingVisible;

        if (this._resolveAfterBeginEdit) {
            this._resolveAfterBeginEdit();
        }

        if (
            this._editInPlaceController &&
            this._editInPlaceController.isEditing() &&
            !this._editInPlaceController.isEndEditProcessing()
        ) {
            _private.activateEditingRow(this);
        }

        // При изменении коллекции на beforeUpdate индексы раставляются отложенно.
        // Поэтому вызывать обновление itemActions можно только на _afterRender.
        if (this._itemActionsController && this._shouldUpdateActionsAfterRender) {
            _private.updateInitializedItemActions(this, this._options);
            this._shouldUpdateActionsAfterRender = false;
        }

        if (this._applySelectedPage && this._shouldNotifyOnDrawItems) {
            this._applySelectedPage();
        }
        this._dndListController?.afterRenderListControl();
        this._updateInProgress = false;
        this._notifyOnDrawItems();
        if (this._wasReload) {
            if (this._options.trackedProperties?.length) {
                this._updateTrackedValues();
            }
            this._preloadDataToBackward();
            this._wasReload = false;
        }

        if (this.callbackAfterRender) {
            this.callbackAfterRender.forEach((callback) => {
                callback();
            });
            this.callbackAfterRender = null;
        }

        this._indicatorsController.afterRenderCallback();
        this._updateViewportFilledInIndicatorsController();
    }

    // фикс прыжков при скролле.
    // Если в итемах будут асинхронные контролы, то afterRender отстрельнет слишком поздно.
    // Поэтому при восстановлении скролла будет заметен прыжок.
    // Ядро для нас сделало новый хук, который срабатывает синхронно, не дожидаясь асинхрнонных детей.
    protected _$react_componentDidUpdate(): void {
        this._options.notifyCallback('beginListAfterRender', [], {
            bubbling: true,
        });

        if (this._recalcPagingVisible) {
            if (!this._pagingVisible) {
                _private.initPaging(this);
            }
        }

        if (this._pagingVisible && this._isPagingPadding()) {
            this._updatePagingPadding();
        }
        if (this._pagingVisibilityChanged) {
            this._notify('controlResize', [], { bubbling: true });
            this._pagingVisibilityChanged = false;
        }

        // При асинхронном построении записей, подскролл к записи после перезагрузки отрабатывает с задержкой,
        // так как ожидается окончание построения всех записей. Из-за этого есть скачок на высоту ромашки.
        // Пример ошибки https://online.sbis.ru/doc/111485fc-03e4-4c11-9ed9-65608cbc890d?client=3
        // TODO: Убрать когда построение будет только синхронным
        const shouldFixScrollByIndicatorHeight =
            this._wasReload &&
            this._options.feature1184208466 &&
            this._indicatorsController.hasNotRenderedChanges() &&
            !this._listViewModel.getTopIndicator().isDisplayed();
        if (shouldFixScrollByIndicatorHeight) {
            this._options.notifyCallback('doScroll', [this._scrollTop - INDICATOR_HEIGHT], {
                bubbling: true,
            });
        }

        if (this._loadedItems) {
            this._loadedItems = null;
        }

        if (this._shouldHandleResize) {
            this._viewResize();
            this._shouldHandleResize = false;
        }

        this._listVirtualScrollController.afterRenderListControl();

        if (this._scrollToFirstItemAfterDisplayTopIndicatorAfterRender) {
            this._scrollToFirstItemAfterDisplayTopIndicatorAfterRender();
            this._scrollToFirstItemAfterDisplayTopIndicatorAfterRender = null;
        }
    }

    /**
     * На основании настроек навигации определяет нужна ли подгрузка данных при скроле
     */
    protected _shouldLoadOnScroll(): boolean {
        return (
            !this._destroyed &&
            !this._selectedItemsShown &&
            (_private.isInfinityNavigation(this._options.navigation) ||
                _private.needLoadByMaxCountNavigation(
                    this._listViewModel,
                    this._options.navigation
                ))
        );
    }

    private _isInfinityNavigation(): boolean {
        return _private.isInfinityNavigation(this._options.navigation);
    }

    private _notifyOnDrawItems(): void {
        if (this._shouldNotifyOnDrawItems) {
            this._options.notifyCallback('drawItems');
            this._options.drawItemsCallback?.();
            this._shouldNotifyOnDrawItems = false;
            this._itemsChanged = false;
            // Нужно тут сбрасывать стейт, чтобы гарантированно не показывать пэйджинг из-за предзагрузки записей
            this._wasPreloadedDataToBackward = false;
            this._onDrawItems();
        }
    }

    protected _onDrawItems(): void {
        if (this._doAfterDrawItems) {
            this._doAfterDrawItems();
            this._doAfterDrawItems = null;
        }
        if (this._scrollToItemAfterReloadParams) {
            this._scrollToItemAfterReloadParams.resolveScroll();
            this._scrollToItemAfterReloadParams = null;
        }
    }

    protected _afterUpdate(oldOptions: TOptions): void {
        if (!this._sourceController?.getLoadError()) {
            if (!this._observerRegistered) {
                this._registerObserver();
            }
        }

        // Запустить валидацию, которая была заказана методом commit у редактирования по месту, после
        // применения всех обновлений реактивных состояний.
        // validateController - асинхронно подгружаемый контроллер при создании валидаторов и старте редактирования.
        // В данном месте, после старта редактирования контроллер гарантировано создан.
        if (this._isPendingDeferSubmit) {
            this._validateController.resolveSubmit();
            this._isPendingDeferSubmit = false;
        }

        if (this._sourceControllerLoadingResolver) {
            this._sourceControllerLoadingResolver();
        }
        // Перестраиваем свайп на afterUpdate, когда точно уже известен новый размер записи
        // Перестроение должно произойти только в том случае, когда изменился размер записи
        if (this._itemActionsController && this._itemActionsController.isSwiped()) {
            this._itemActionsController.updateSwipeConfigIfNeed(
                this._container,
                this._getViewUniqueClass(),
                LIST_MEASURABLE_CONTAINER_SELECTOR
            );
        }
        if (this._callbackAfterUpdate) {
            this._callbackAfterUpdate.forEach((callback) => {
                callback();
            });
            this._callbackAfterUpdate = null;
        }
    }

    __onPagingArrowClick(e: Event, arrow: 'Next' | 'Prev' | 'Begin' | 'End' | 'Reset'): void {
        this._isPagingArrowClick = true;
        switch (arrow) {
            case 'Next':
                _private.scrollPage(this, 'Down');
                break;
            case 'Prev':
                _private.scrollPage(this, 'Up');
                break;
            case 'Begin':
                const resultEventBegin = this._options.notifyCallback(
                    'pagingArrowClick',
                    ['Begin'],
                    { bubbling: true }
                );
                if (resultEventBegin !== false) {
                    _private.scrollToEdge(this, 'up');
                }
                break;
            case 'End':
                const resultEventEnd = this._options.notifyCallback('pagingArrowClick', ['End'], {
                    bubbling: true,
                });
                if (resultEventEnd !== false) {
                    _private.scrollToEdge(this, 'down');
                }
                break;
            case 'Reset':
                this._scrollToInitialPosition().then(() => {
                    this._scrolled = false;
                    _private.updateScrollPagingButtons(this, {
                        ...this._getScrollParams(),
                        initial: true,
                    });
                });
                break;
        }
    }

    // Возврат к изначальной позиции.
    protected _scrollToInitialPosition(): Promise<unknown> {
        const hasInitialItem = this._listViewModel.getSourceItemByKey(this._initialPosition);
        const canScrollToItem =
            hasInitialItem &&
            this._listVirtualScrollController.shouldShiftRangeBeforeScrollToItem(
                this._listViewModel.getIndexByKey(this._initialPosition),
                'top',
                true
            );
        if (canScrollToItem) {
            // Если запись, к которой нужно вернуться есть в коллекции, то просто скроллим к ней.
            return this.scrollToItem(this._initialPosition, 'top', true).then(() => {
                this._updateTrackedValues();
            });
        } else {
            // Иначе, делаем перезагрузку, возвращаясь к начальному положению.
            return this.reload();
        }
    }

    saveScrollPosition() {
        return this._listVirtualScrollController.saveScrollPosition();
    }

    restoreScrollPosition() {
        return this._listVirtualScrollController.restoreScrollPosition();
    }

    scrollTo(where: string, params?: object): void {
        switch (where) {
            case 'begin':
                _private.scrollToEdge(this, 'up');
                break;
            case 'end':
                _private.scrollToEdge(this, 'down');
                break;
            case 'top':
            case 'bottom':
                if (this._viewportHeight < this._contentHeight) {
                    this._options.notifyCallback('doScroll', [where], {
                        bubbling: true,
                    });
                }
                break;
            case 'item':
                if (params && params.key !== undefined) {
                    this.scrollToItem(params.key, params.position, params.force);
                }
                break;
            case 'nextPage':
                _private.scrollPage(this, 'Down');
                break;
            case 'prevPage':
                _private.scrollPage(this, 'Up');
                break;
        }
    }

    _canScroll(scrollTop: number, direction: string): boolean {
        const placeholder = this._placeholders?.backward;
        return !(
            (direction === 'down' &&
                scrollTop - placeholder + this._viewportHeight > this._contentHeight) ||
            (direction === 'up' && scrollTop - placeholder < 0)
        );
    }

    _hasEnoughData(page: number): boolean {
        const neededItemsCount = this._scrollPagingCtr.getNeededItemsCountForPage(page);
        const itemsCount = this._listViewModel.getCount();
        return neededItemsCount <= itemsCount;
    }

    __selectedPageChanged(e: Event, pageOption: number): void {
        let page = pageOption;
        let scrollTop = this._scrollPagingCtr.getScrollTopByPage(page, this._getScrollParams());
        const direction = this._currentPage < page ? 'down' : 'up';
        const canScroll = this._canScroll(scrollTop, direction);
        const itemsCount = this._listViewModel.getSourceCollectionCount();
        const allDataLoaded = _private.getAllDataCount(this) === itemsCount;
        const startIndex = this._listViewModel.getStartIndex();
        const stopIndex = this._listViewModel.getStopIndex();
        if (!canScroll && allDataLoaded && direction === 'up' && startIndex === 0) {
            scrollTop = 0;
            page = 1;
        }
        if (
            !canScroll &&
            allDataLoaded &&
            direction === 'down' &&
            stopIndex === this._listViewModel.getCount()
        ) {
            page = this._pagingCfg.pagesCount;
        }
        this._applySelectedPage = () => {
            this._currentPage = page;
            scrollTop = this._scrollPagingCtr.getScrollTopByPage(page, this._getScrollParams());
            if (this._canScroll(scrollTop, direction)) {
                this._applySelectedPage = null;

                this._options.notifyCallback('doScroll', [scrollTop], {
                    bubbling: true,
                });
            }
        };
        if (this._currentPage === page) {
            this._applySelectedPage();
            return;
        } else {
            this._selectedPageHasChanged = true;
        }

        // При выборе первой или последней страницы крутим в край.
        if (page === 1) {
            this._currentPage = page;
            _private.scrollToEdge(this, 'up');
        } else if (page === this._pagingCfg.pagesCount) {
            this._currentPage = page;
            _private.scrollToEdge(this, 'down');
        } else {
            // При выборе некрайней страницы, проверяем,
            // можно ли проскроллить к ней, по отрисованным записям
            if (canScroll) {
                this._applySelectedPage();
            } else {
                // если нельзя проскроллить, проверяем, хватает ли загруженных данных для сдвига диапазона
                // или нужно подгружать еще.
                if (this._hasEnoughData(page)) {
                    this._applySelectedPage = null;
                    this._listVirtualScrollController.scrollToPage(
                        direction === 'up' ? 'backward' : 'forward'
                    );
                } else {
                    this._loadMore(direction);
                }
            }
        }
    }

    __needShowEmptyTemplate(newOptions?: IBaseControlOptions): boolean {
        // Described in this document:
        // https://docs.google.com/spreadsheets/d/1fuX3e__eRHulaUxU-9bXHcmY9zgBWQiXTmwsY32UcsE
        const options = newOptions || this._options;
        const listViewModel = this._listViewModel;
        const emptyTemplate = options.emptyTemplate;
        const emptyTemplateColumns = options.emptyTemplateColumns || options.emptyView;

        const noData = !listViewModel || !listViewModel.getCount();
        const noEdit = !listViewModel || !_private.isEditing(this);
        let isLoading;
        if (options.storeId) {
            isLoading = options.loading;
        } else {
            isLoading = this._sourceController && this._sourceController.isLoading();
        }
        const notHasMore = !_private.hasMoreDataInAnyDirection(this);
        const noDataBeforeReload = this._noDataBeforeReload;

        // Кейс: при итеративной загрузке за отведенное время записи не загружены и отобразилась кнопка "Продолжить".
        // Проблема: при последующем запуске поиска - отображается emptyTemplate, которая пропадает после загрузки.
        // Решение: при перезагрузке отображаем emptyTemplate только если он отображался ранее.
        // https://online.sbis.ru/opendoc.html?guid=da04ed2e-2b80-4239-8614-212b26bb788b&client=3
        const isEmptyTemplateBeforeReload =
            this._indicatorsController && this._indicatorsController.isEmptyTemplateDisplayed();
        return (
            (emptyTemplate || emptyTemplateColumns) &&
            noEdit &&
            notHasMore &&
            (isLoading ? noData && noDataBeforeReload && isEmptyTemplateBeforeReload : noData)
        );
    }

    _onCheckBoxClick(
        e: SyntheticEvent,
        item: CollectionItem<Model>,
        originalEvent: SyntheticEvent<MouseEvent>
    ): void {
        e.stopPropagation();

        const contents = getPlainItemContents(item);
        const key = contents.getKey();
        const readOnly = item.isReadonlyCheckbox();

        this._onLastMouseUpWasDrag = false;

        if (!readOnly) {
            const selectionController = this._getSelectionController();

            let newSelection;

            if (originalEvent.nativeEvent && originalEvent.nativeEvent.shiftKey) {
                newSelection = this._getSelectionController().selectRange(key);
            } else {
                newSelection = this._getSelectionController().toggleItem(key);
            }

            this._options.notifyCallback('checkBoxClick', [key, item.isSelected()]);
            this._options.notifyCallback('selectedLimitChanged', [selectionController.getLimit()]);
            this._changeSelection(newSelection);
        }

        // если чекбокс readonly, то мы все равно должны проставить маркер
        this._options.mark(key, this, this._options);
    }

    reload(
        keepNavigation: boolean = false,
        sourceConfigOption?: IBaseSourceConfig
    ): Promise<unknown> {
        let sourceConfig = sourceConfigOption;

        if (keepNavigation) {
            this._isKeepNavigationReload = true;
            this._listVirtualScrollController.setScrollBehaviourOnReset('keep');
            // Если isMultiNavigation, о параметры рассчитываются в sourceController
            const isMultiNavigation = !!this._options.navigation?.sourceConfig?.multiNavigation;
            if (!sourceConfig) {
                if (this._options.navigation?.source === 'position') {
                    const maxLimit = Math.max(
                        this._options.navigation.sourceConfig.limit,
                        this._listViewModel.getSourceCollectionCount()
                    );
                    sourceConfig = {
                        ...(this._lastSourceConfig || this._options.navigation.sourceConfig),
                        limit: maxLimit,
                    };
                }
                if (!isMultiNavigation && this._options.navigation?.source === 'page') {
                    const navPageSize = this._options.navigation.sourceConfig.pageSize;
                    const pageSize = Math.max(
                        Math.ceil(this._listViewModel.getSourceCollectionCount() / navPageSize) *
                            navPageSize,
                        navPageSize
                    );
                    sourceConfig = {
                        ...this._options.navigation.sourceConfig,
                        page: 0,
                        pageSize,
                    };
                }
            } else {
                // Если перезагружают на конкретной позиции, это значит, что нужно будет восстановить скролл.
                if (
                    this._options.navigation.source === 'position' &&
                    this._options.navigation.sourceConfig.position !== sourceConfig.position
                ) {
                    this._listVirtualScrollController.setScrollBehaviourOnReset('restore');
                }
            }
        } else {
            // При перезагрузке через public-метод полностью сбрасываем состояние cut-навигации
            // https://online.sbis.ru/opendoc.html?guid=73d5765b-598a-4e2c-a867-91a54150ae9e
            if (this._cutExpanded) {
                this._cutExpanded = false;
                this._sourceController.setNavigation(this._options.navigation);
            }
        }

        // Вызов перезагрузки из публичного API должен завершать имеющееся редактирование по месту.
        // Во время редактирования перезагрузка допустима только в момент завершения редактирования,
        // точка - beforeEndEdit. При этом возвращение промиса перезагрузки обязательно.
        const cancelEditPromise =
            this.isEditing() && !this._editInPlaceController.isEndEditProcessing()
                ? this._cancelEdit(true).catch(() => {
                      // Перезагрузку не остановит даже ошибка во время завершения редактирования.
                      // При отмене редактирования с флагом force ошибка может упасть только в прикладном коде.
                      // Уведомлением об упавших ошибках занимается контроллер редактирования.
                  })
                : Promise.resolve();

        return cancelEditPromise.then(() => {
            if (!this._destroyed) {
                // Не дожидаемся применения изменений в модель после обновления списка,
                // если перезагрузка вызвана в момент завершения редактирования.
                const isEndEditingProcessing =
                    this.isEditing() && this._editInPlaceController.isEndEditProcessing();
                return this._reload(
                    this._options,
                    sourceConfig,
                    isEndEditingProcessing,
                    keepNavigation
                );
            }
        });
    }

    protected _reload(
        cfg: IList,
        sourceConfig?: INavigationSourceConfig,
        immediateResolve: boolean = true,
        keepNavigation?: boolean
    ): Promise<RecordSet | null | void> {
        return new Promise((resolve, reject) => {
            const loader = cfg.slice || this._sourceController;
            if (loader) {
                const loadPromise =
                    cfg.reloadFromContext && cfg.slice
                        ? loader.reload(sourceConfig, keepNavigation)
                        : loader.reload(sourceConfig, undefined, undefined, keepNavigation);
                loadPromise
                    .then((list) => {
                        if (this._destroyed) {
                            resolve(null);
                            return;
                        }

                        if (immediateResolve) {
                            resolve(list as RecordSet);
                        } else {
                            this._resolveSourceLoadPromise(() => {
                                return resolve(list as RecordSet);
                            });
                        }
                    })
                    .catch((error) => {
                        if (!this._destroyed) {
                            this._updateShadowModeHandler(this._shadowVisibility);
                        }

                        // Для cancel - не нужно порождать ошибку
                        // https://online.sbis.ru/opendoc.html?guid=c40b0368-70ca-4d5a-9b17-8744f3f203df
                        if (error.isCanceled) {
                            resolve(null);
                        } else {
                            reject(error);
                        }
                        return error;
                    });
            } else {
                resolve(void 0);
                Logger.error("BaseControl: Source option is undefined. Can't load data", this);
            }
        });
    }

    private _isSourceControllerLoadingNow(options: IList): boolean {
        return options.sourceController && options.sourceController.isLoading();
    }

    private _resolveSourceLoadPromise(nativeResolver: Function): void {
        this._sourceControllerLoadingResolver = () => {
            nativeResolver();
            this._sourceControllerLoadingResolver = null;
        };
        this._forceUpdate();
    }

    // TODO удалить, когда будет удален эксплорер и заменено у прикладников
    setMarkedKey(key: CrudEntityKey): void {
        this._options.mark(key, this, this._options);
    }

    protected _hasMoreData(direction: Direction): boolean {
        return !!(this._sourceController && this._sourceController.hasMoreData(direction));
    }

    protected _loadItemsToDirection(
        direction: ScrollControllerLib.IDirection,
        addItemsAfterLoad?: boolean,
        useServicePool?: boolean
    ): Promise<RecordSet | Error> {
        return this._sourceController.load(
            direction,
            undefined,
            undefined,
            addItemsAfterLoad,
            undefined,
            undefined,
            useServicePool
        );
    }

    protected _shouldLoadItemsToDirection(direction: ScrollControllerLib.IDirection): boolean {
        const sourceController = this._sourceController;
        const hasMoreData = this._hasMoreData(direction);

        const allowLoadByLoadedItems =
            _private.needScrollCalculation(
                this._options.navigation,
                this._options.virtualScrollConfig
            ) && !this._options.disableVirtualScroll
                ? this._shouldLoadByLoadedItems(this._loadedItems) ||
                  _private.isPortionedLoad(this, this._loadedItems)
                : true;
        const allowLoadBySource = sourceController && hasMoreData && !sourceController.isLoading();
        const allowLoadBySearch =
            !_private.isPortionedLoad(this) ||
            this._indicatorsController.shouldContinueDisplayPortionedSearch(direction);
        // Если перетаскиваю все записи, то не нужно подгружать данные, но если тащат несколько записей,
        // то данные подгружаем. Т.к. во время днд можно скроллить и пользователь может захотеть утащить записи
        // далеко вниз, где список еще не прогружен
        const allowLoadByDrag = !(
            this._dndListController?.isDragging() && this._selectionController?.isAllSelected()
        );
        const allowBySelectionViewMode = !this._selectedItemsShown;

        return (
            allowLoadBySource &&
            allowLoadByLoadedItems &&
            allowLoadBySearch &&
            allowLoadByDrag &&
            allowBySelectionViewMode
        );
    }

    private _shouldLoadByLoadedItems(items?: RecordSet): boolean {
        if (
            this._sourceController?.getItems() &&
            this._listViewModel?.getSourceCollection() &&
            this._listViewModel.getSourceCollection() !== this._sourceController.getItems()
        ) {
            return false;
        }
        // Возможна ситуация, что подгружают записи, но они сразу же скрыты.
        // Например, свернули узел(группу), инициализировалась подгрузка вниз, подгрузили данные из узла,
        // нужно еще запросить, пока не загрузят в корне
        return !items || items.getCount() === 0 || this._loadedItemsIsHidden(items);
    }

    protected _loadedItemsIsHidden(loadedItems: RecordSet): boolean {
        return (
            loadedItems &&
            factory(loadedItems)
                .filter((it) => {
                    return this._listViewModel.isVisibleItem(it.getKey());
                })
                .count() === 0
        );
    }

    private _commitEditInGroupBeforeCollapse(groupItem): TAsyncOperationResult {
        if (!this.isEditing() || !groupItem.isExpanded()) {
            return Promise.resolve();
        }

        const editingItem = this.getViewModel()
            .getItems()
            .find((item) => {
                return item.isEditing();
            });
        const groupId = this.getViewModel().getGroup()(editingItem.getContents());

        if (groupId !== groupItem.getContents()) {
            return Promise.resolve();
        }

        return this._commitEdit();
    }

    _onGroupClick(e: Event, groupId: string, baseEvent: MouseEvent, dispItem): void {
        if (baseEvent.target.closest('.controls-ListView__groupExpander')) {
            const collection = this._listViewModel;
            const needExpandGroup = !dispItem.isExpanded();

            this._commitEditInGroupBeforeCollapse(dispItem).then((result) => {
                if (result && result.canceled) {
                    return result;
                }
                dispItem.setExpanded(needExpandGroup);

                // TODO https://online.sbis.ru/opendoc.html?guid=e20934c7-95fa-44f3-a7c2-c2a3ec32e8a3
                // По задаче предлагается объединить collapsedGroups и collapsedItems.
                // Сейчас collapsedGroups необходим стратегии группировки в модели при создании и перерисовке групп.
                // Стратегия группировки всегда заново пересоздаёт группы и опирается на это свойство для получения
                // информации о свёрнутости групп.
                const collapsedGroups = collection.getCollapsedGroups() || [];
                const groupIndex = collapsedGroups.indexOf(groupId);
                if (groupIndex === -1) {
                    if (!needExpandGroup) {
                        collapsedGroups.push(groupId);
                    }
                } else if (needExpandGroup) {
                    collapsedGroups.splice(groupIndex, 1);
                }
                const changes = {
                    changeType: needExpandGroup ? 'expand' : 'collapse',
                    group: groupId,
                    collapsedGroups,
                };
                // При setExpanded() не обновляется collection.collapsedGroups, на основе которого стратегия
                // определяет, какие группы надо создавать свёрнутыми. Поэтому обновляем его тут.
                collection.setCollapsedGroups(collapsedGroups);
                _private.groupsExpandChangeHandler(this, changes);
            });
            this._options.notifyCallback('groupClick', [
                dispItem.getContents(),
                baseEvent,
                dispItem,
            ]);
        }
    }

    isLoading(): boolean {
        return this._sourceController && this._sourceController.isLoading();
    }

    protected _onItemClickNew(originalEvent: SyntheticEvent<MouseEvent>, contents: Model) {
        this._options.onItemClickNew(originalEvent, contents, this, this._options);
    }

    protected _onItemClick(
        event: SyntheticEvent,
        contents: Model,
        originalEvent: SyntheticEvent<MouseEvent>,
        columnIndex: number = null
    ): boolean | void {
        const clickOnCheckbox = event.target?.closest?.('.js-controls-ListView__checkbox');
        if (clickOnCheckbox) {
            this._onCheckBoxClick(
                event,
                this._listViewModel.getItemBySourceItem(contents),
                originalEvent
            );
            event.stopPropagation();
            return;
        }

        // Обработчик клика по тегу
        const tag = event.target.closest(TAG_SELECTOR);
        if (tag) {
            this._onTagClickHandler(event, this._listViewModel.getItemBySourceItem(contents));
            event.stopPropagation();
            return;
        }

        _private.closeSwipe(this);

        // Можем поймать клик из внутреннего списка, его нам обрабатывать не нужно.
        // Раньше он тормозился на ListView, но после переписывания на реакт нужно обрабатывать тут
        if (!this._items || !this._listViewModel.getSourceItemByKey(getKey(contents))) {
            event.stopPropagation();
            // false значит, что не нужно кидать событие itemActivate.
            // Но в этом кейсе внутренний список должен его кинуть.
            return;
        }

        if (originalEvent?.nativeEvent?.button === 1) {
            // на MacOS нажатие средней кнопкой мыши порождает событие click, но обычно кликом считается только ЛКМ
            event.stopPropagation();
            return false;
        }

        if (this._itemActionMouseDown) {
            // Не нужно кликать по Item, если MouseDown был сделан по ItemAction
            this._itemActionMouseDown = null;
            event.stopPropagation();
            return false;
        }

        if (this._onLastMouseUpWasDrag) {
            // Если на mouseUp, предшествующий этому клику, еще работало перетаскивание,
            // то мы не должны нотифаить itemClick
            this._onLastMouseUpWasDrag = false;
            event.stopPropagation();
            return false;
        }

        this._onItemClickNew(originalEvent, contents);

        if (this._onLastMouseUpWasOpenUrl) {
            // Если на mouseUp, предшествующий этому клику, сработало открытие ссылки,
            // то события клика быть не должно.
            this._onLastMouseUpWasOpenUrl = false;
            event.stopPropagation();
            return false;
        }

        const canEditByClick = this._canEditByClick(originalEvent.target);

        // В процессе перехода на новые коллекции был неспециально изменен способ навешивания классов
        // для разделителей строки и колонок. Классы должны вешаться в шаблоне колонки, т.к. на этом
        // шаблоне есть несколько опций, регулирующих внешний вид ячейки (cursor и editable).
        // при применении классов "выше" шаблона колонки, визуальные изменения не применяются к разделителям.
        // Это приводит к ошибкам:
        // 1) курсор в ячейке "стрелка", а над разделителями - "указатель-лапка"
        // 2) в ячейке запрещено редактирование, но клик по разделителю запускает редактирование.
        // TODO: Убрать по задаче проверку ну '.js-controls-ListView__editingTarget' по задаче
        //  https://online.sbis.ru/opendoc.html?guid=deef0d24-dd6a-4e24-8782-5092e949a3d9
        const editingTarget = originalEvent.target.closest('.js-controls-ListView__editingTarget');

        if (canEditByClick && editingTarget) {
            event.stopPropagation();
            this._savedItemClickArgs = [event, contents, originalEvent, columnIndex];
            const checkboxOffset = +this._hasMultiSelect();

            // EditInPlace может быть еще не загружен, тогда контроллера и хелпера не будет.
            // Вызов метода хелпера запоминается и вызывается после его создания.
            this._editInPlaceInputHelperPreloadCallParams = [
                'setEditingTarget',
                [contents, editingTarget],
            ];
            this._beginEdit({ item: contents }, { columnIndex: columnIndex + checkboxOffset }).then(
                (result) => {
                    if (!(result && result.canceled) && originalEvent.nativeEvent) {
                        this._editInPlaceInputHelper.setClickInfo(
                            originalEvent.nativeEvent,
                            contents
                        );
                    }
                    return result;
                }
            );
            return false;
        } else {
            // Если кликнули в не редактируемую часть внутри редактирующейся в данный момент
            // строки/ячейки(зависит от режима), то клик по нему не должен приводить к закрытию редактирования.
            if (
                this.isEditing() &&
                !this._editInPlaceController.isTargetEditing(contents, columnIndex)
            ) {
                this._commitEdit();
            }

            // При клике по элементу может случиться 2 события: itemClick и itemActivate.
            // itemClick происходит в любом случае, но если список поддерживает редактирование по месту, то
            // порядок событий будет beforeBeginEdit -> itemClick
            // itemActivate происходит в случае активации записи.
            // Если в списке не поддерживается редактирование, то это любой клик.
            // Если поддерживается, то событие не произойдет если успешно запустилось редактирование записи.
            if (event.isBubbling?.()) {
                event.stopPropagation();
            }
            const eventResult = this._notifyItemClick(event, contents, originalEvent, columnIndex);
            if (eventResult !== false) {
                this._notifyItemActivate(event, contents, originalEvent, columnIndex);
            }
            return eventResult;
        }
    }

    private _canEditByClick(target) {
        return (
            !this._options.readOnly &&
            this._getEditingConfig().editOnClick &&
            !target.closest(`.${NOT_EDITABLE_JS_SELECTOR}`)
        );
    }

    _onBeforeMoveMarkerToDirection(
        newMarkedKey,
        params: {
            isMovingForward: boolean;
            isChanged: boolean;
        },
        doMoveCallback: () => void
    ) {
        if (!params.isChanged) {
            // это значит что мы дошли до последней записи, нужно проскроллить в самый конец, чтобы сработал триггер
            const loadDirection = params.isMovingForward ? 'down' : 'up';
            const edgeDirection = loadDirection === 'down' ? 'forward' : 'backward';
            const shouldScrollToEdge =
                (this._hasMoreData(loadDirection) || this._hasItemsOutRange[edgeDirection]) &&
                this._isInfinityNavigation();
            if (shouldScrollToEdge) {
                this._listVirtualScrollController.scrollToEdge(edgeDirection);
                this._doAfterDrawItems = () => {
                    doMoveCallback();
                };
            }
        } else {
            const scrollToItem = (key) => {
                const index = this._listViewModel.getIndexByKey(key);
                // У первой записи может быть марджин, поэтому нужно скроллить к началу списка, чтобы тень скрылась.
                if (index === 0 && !this._hasMoreData('up')) {
                    return this._scrollToElement(this._container, 'top', false);
                }

                const position = params.isMovingForward ? 'bottom' : 'top';
                return this.scrollToItem(key, position, false);
            };

            const result = this._options.mark(newMarkedKey, this, this._options);
            if (result instanceof Promise) {
                result.then((key) => {
                    return scrollToItem(key);
                });
            } else if (result !== undefined) {
                scrollToItem(result);
            }
        }
    }

    /**
     * Останавливает всплытие события updateShadowMode от внутренних списков. Иначе они могут испортить видимость
     * тени у ScrollContainer.
     */
    protected _stopInnerUpdateShadowMode(event: SyntheticEvent): void {
        event.stopPropagation();
    }

    protected _notifyItemClick(
        event: SyntheticEvent,
        contents: Model,
        originalEvent: SyntheticEvent<MouseEvent>,
        columnIndex: number
    ): boolean {
        return checkWasabyEvent(this._options.onItemClick)
            ? this._options.onItemClick(contents, originalEvent, columnIndex)
            : this._options.notifyCallback('itemClick', [contents, originalEvent, columnIndex], {
                  bubbling: true,
              });
    }

    protected _notifyItemActivate(
        event: SyntheticEvent,
        contents: Model,
        originalEvent: SyntheticEvent<MouseEvent>,
        columnIndex: number
    ): void {
        this._options.notifyCallback('itemActivate', [contents, originalEvent, columnIndex], {
            bubbling: true,
        });
    }

    // region ItemActions

    private _getItemActionsController(options: IList = this._options): ItemActionsController {
        // При существующем контроллере нам не нужны дополнительные проверки как при инициализации.
        // Например, может потребоваться продолжение работы с контроллером после показа ошибки в Popup окне,
        // когда _error не зануляется.
        if (this._itemActionsController) {
            return this._itemActionsController;
        }
        // Проверки на __error не хватает, так как реактивность работает не мгновенно, и это состояние может не
        // соответствовать опциям error.Container. Нужно смотреть по текущей ситуации на наличие ItemActions
        if (this._sourceController?.getLoadError() || !this._listViewModel) {
            return;
        }
        const editingConfig = this._listViewModel.getEditingConfig();
        // Если нет опций записи, проперти, стрелка редактирования скрыта,
        // и тулбар для редактируемой записи выставлен в false,
        // то не надо инициализировать контроллер
        if (
            options &&
            !options.itemActions &&
            !options.itemActionsProperty &&
            !editingConfig?.toolbarVisibility &&
            !(options.showEditArrow && TouchDetect.getInstance().isTouch())
        ) {
            return;
        }

        this._itemActionsController = new ItemActionsController(
            _private.resolveItemActionsOptions(this, options)
        );

        this._actionHandlers = {
            ...this._actionHandlers,
            itemActionsTemplateMountedCallback:
                this._itemActionsController.getItemActionsTemplateMountedCallback(),
            itemActionsTemplateUnmountedCallback:
                this._itemActionsController.getItemActionsTemplateUnmountedCallback(),
        };

        return this._itemActionsController;
    }

    /**
     * Обработчик клика по операции
     * @param event
     * @param action
     * @param itemData
     * @private
     */
    protected _onItemActionMouseDown(
        event: React.MouseEvent<HTMLDivElement>,
        action: IShownItemAction,
        itemData: CollectionItem
    ): void {
        if (!isLeftMouseButton(event)) {
            return;
        }
        // TODO нужно заменить на item.getContents() при переписывании моделей. item.getContents() должен возвращать
        //  Record https://online.sbis.ru/opendoc.html?guid=acd18e5d-3250-4e5d-87ba-96b937d8df13
        const contents = getPlainItemContents(itemData);
        const key = contents ? contents.getKey() : itemData.key;
        const item = this._listViewModel.getItemBySourceKey(key) || itemData;

        if (action.id !== EDITING_APPLY_BUTTON_KEY && action.id !== EDITING_CLOSE_BUTTON_KEY) {
            this._options.mark(key, this, this._options);
        }

        if (action && !action.isMenu && !action['parent@']) {
            _private.handleItemActionClick(this, action, event, item, false);
        } else {
            const menuConfig = _private.getItemActionsMenuConfig(this, item, event, action, false);
            if (menuConfig) {
                _private.openItemActionsMenu(this, event, item, menuConfig);
            }
        }
    }

    protected _onItemActionsMouseEnter(
        event: React.MouseEvent<HTMLDivElement>,
        item: CollectionItem
    ): void {
        if (
            _private.hasHoverFreezeController(this) &&
            _private.isAllowedHoverFreeze(this) &&
            item.SupportItemActions &&
            !this._isActionsMenuOpened
        ) {
            const itemKey = getPlainItemContents(item).getKey();
            const itemIndex = this._listViewModel.getIndex(item);
            this._hoverFreezeController.startFreezeHoverTimeout(
                itemKey,
                event,
                itemIndex,
                this._listViewModel.getStartIndex()
            );
        }
    }

    /**
     * Обработчик клика по операции, необходимый для предотвращения срабатывания клика на записи в списке
     * @param event
     * @private
     */
    protected _onItemActionClick(event: React.MouseEvent<HTMLDivElement>): void {
        event.stopPropagation();
    }

    /**
     * Обработчик mouseUp по операции, необходимый для предотвращения срабатывания mouseUp на записи в списке
     * @param event
     * @private
     */
    protected _onItemActionMouseUp(event: React.MouseEvent<HTMLDivElement>): void {
        event.stopPropagation();
    }

    /**
     * Обработчик событий, брошенных через onResult в выпадающем/контекстном меню
     * @param eventName название события, брошенного из Controls/menu:Popup.
     * Варианты значений itemClick, applyClick, selectorDialogOpened, pinClick, menuOpened
     * @param actionModel
     * @param clickEvent
     * @private
     */
    protected _onItemActionsMenuResult(
        eventName: string,
        actionModel: Model,
        clickEvent: SyntheticEvent<MouseEvent>
    ): void {
        if (eventName === 'click') {
            const item = this._getItemActionsController().getActiveItem();
            if (item) {
                this._notifyItemClick(clickEvent, item.contents, clickEvent, null);
                _private.closeActionsMenu(this);
            }
        } else if (eventName === 'itemClick') {
            const action = actionModel && actionModel.getRawData();
            if (action) {
                const item = this._getItemActionsController().getActiveItem();
                _private.handleItemActionClick(this, action, clickEvent, item, true);
            }
        } else if (eventName === 'menuOpened' || eventName === 'onOpen') {
            if (_private.hasHoverFreezeController(this) && _private.isAllowedHoverFreeze(this)) {
                this._hoverFreezeController.unfreezeHover();
            }
            _private.removeShowActionsClass(this);
            _private.addHoverEnabledClass(this);
            this._getItemActionsController().deactivateSwipe(false);
        }
    }

    protected _onItemActionMouseEnter(): void {
        this._getItemActionsController().startMenuDependenciesTimer();
    }

    protected _onItemActionMouseLeave(): void {
        this._getItemActionsController().stopMenuDependenciesTimer();
    }

    // endregion ItemActions

    // region EditInPlace

    _createEditInPlaceControllerAsync(options: IBaseControlOptions = this._options): Promise<void> {
        return loadAsync('Controls/editInPlace').then(() => {
            this._createEditInPlaceController(options);
        });
    }

    _createEditInPlaceController(options: IBaseControlOptions = this._options): void {
        const lib = loadSync<typeof import('Controls/editInPlace')>('Controls/editInPlace');
        if (!this._editInPlaceInputHelper) {
            this._editInPlaceInputHelper = new lib.InputHelper({
                itemsContainerClass: this._getItemsContainerUniqueClass(),
                isReact: options._isReactView,
            });

            if (this._editInPlaceInputHelperPreloadCallParams) {
                const methodName = this._editInPlaceInputHelperPreloadCallParams[0];
                const methodArgs = this._editInPlaceInputHelperPreloadCallParams[1];

                this._editInPlaceInputHelper[methodName].apply(
                    this._editInPlaceInputHelper,
                    methodArgs
                );
                this._editInPlaceInputHelperPreloadCallParams = null;
            }
        }

        if (!this._editInPlaceController) {
            // При создании редактирования по мсесту до маунта, регистрация в formController
            // произойдет после маунта, т.к. она реализована через события. В любом другом случае,
            // регистрация произойдет при создании контроллера редактирования.
            if (this._isMounted) {
                _private.registerFormOperation(this);
            }

            this._editInPlaceController = new lib.Controller({
                mode: this._getEditingConfig(options).mode,
                collection: this._listViewModel,
                onBeforeBeginEdit: this._beforeBeginEditCallback.bind(this),
                onAfterBeginEdit: this._afterBeginEditCallback.bind(this),
                onBeforeEndEdit: this._beforeEndEditCallback.bind(this),
                onAfterEndEdit: this._afterEndEditCallback.bind(this),
            });
        }
    }

    _beforeBeginEditCallback(params: IBeforeBeginEditCallbackParams) {
        return new Promise((resolve) => {
            // Редактирование может запуститься при построении.
            const eventResult = this._isMounted
                ? this._options.notifyCallback('beforeBeginEdit', params.toArray())
                : undefined;
            if (this._savedItemClickArgs && this._isMounted) {
                // itemClick стреляет, даже если после клика начался старт редактирования, но itemClick
                // обязательно должен случиться после события beforeBeginEdit.
                this._notifyItemClick.apply(this, this._savedItemClickArgs);
            }

            resolve(eventResult);
        })
            .then((result) => {
                if (result === LIST_EDITING_CONSTANTS.CANCEL) {
                    if (this._continuationEditingDirection) {
                        return this._continuationEditingDirection;
                    } else {
                        if (this._savedItemClickArgs && this._isMounted) {
                            // Запись становится активной по клику, если не началось редактирование.
                            // Аргументы itemClick сохранены в состояние и используются для нотификации об активации
                            // элемента.
                            this._notifyItemActivate.apply(this, this._savedItemClickArgs);
                        }
                        return result;
                    }
                }

                // Если запускается редактирование существующей записи,
                // то сразу переходим к следующему блоку
                if (!params.isAdd) {
                    return result;
                }

                // region Обработка добавления записи
                const sourceController = this.getSourceController();
                // Добавляемы итем берем либо из результата beforeBeginEdit
                // либо из параметров запуска редактирования
                const addedItem = result?.item || params.options?.item;

                // Если нет источника и к нам не пришел новый добавляемый итем, то ругаемся
                if (!sourceController && !addedItem) {
                    throw new Error(
                        'You use list without source. So you need to manually create new item when processing an event beforeBeginEdit'
                    );
                }

                // Если есть источник и сверху не пришел добавляемый итем, то выполним запрос на создание новой записи
                if (sourceController && !(addedItem instanceof Model)) {
                    const listMeta = !this._isMounted ? params.options.filter : {};
                    const userMeta = params.options?.meta || {};
                    return sourceController
                        .create({
                            ...listMeta,
                            ...userMeta,
                        })
                        .then((item) => {
                            if (item instanceof Model) {
                                return { item };
                            }

                            throw Error(
                                'BaseControl::create before add error! Source returned non Model.'
                            );
                        })
                        .catch((error: Error) => {
                            return process({ error });
                        });
                }
                // endregion

                return result;
            })
            .then((result) => {
                const editingConfig = this._getEditingConfig();

                // Скролим к началу/концу списка. Данная операция может и скорее всего потребует перезагрузки списка.
                // Не вся бизнес логика поддерживает загрузку первой/последней страницы при курсорной навигации.
                // TODO: Поддержать везде по задаче
                //  https://online.sbis.ru/opendoc.html?guid=000ff88b-f37e-4aa6-9bd3-3705bb721014
                if (editingConfig.task1181625554 && params.isAdd) {
                    return _private
                        .scrollToEdgeOnAdd(
                            this,
                            editingConfig.addPosition === 'top' ? 'up' : 'down'
                        )
                        .then(() => {
                            return result;
                        });
                } else {
                    return result;
                }
            })
            .finally(() => {
                this._savedItemClickArgs = null;
            });
    }

    _afterBeginEditCallback(item: IEditableCollectionItem, isAdd: boolean): Promise<void> {
        // Завершение запуска редактирования по месту проиходит после построения редактора.
        // Исключение - запуск редактирования при построении списка. В таком случае,
        // уведомлений о запуске редактирования происходить не должно, а дождаться построение
        // редактора невозможно(построение списка не будет завершено до выполнения данного промиса).
        return new Promise((resolve) => {
            // Принудительно прекращаем заморозку ховера
            if (_private.hasHoverFreezeController(this)) {
                this._hoverFreezeController.unfreezeHover();
            }
            // Операции над записью должны быть обновлены до отрисовки строки редактирования,
            // иначе будет "моргание" операций.
            _private.removeShowActionsClass(this);
            _private.updateItemActions(this, this._options, item);
            this._continuationEditingDirection = null;

            if (this._isMounted) {
                this._resolveAfterBeginEdit = resolve;
            } else {
                resolve();
            }
        })
            .then(() => {
                // Редактирование может запуститься при построении.
                if (this._isMounted) {
                    this._options.notifyCallback('afterBeginEdit', [item.contents, isAdd]);

                    if (!isAdd) {
                        this._options.mark(item.contents.getKey(), this, this._options);
                    }
                }

                if (
                    this._pagingVisible &&
                    this._options.navigation.viewConfig.pagingMode === 'edge'
                ) {
                    this._pagingVisible = false;
                }

                item.contents.subscribe('onPropertyChange', this._resetValidation);
            })
            .then(() => {
                // Подскролл к редактору
                if (this._isMounted) {
                    let position = 'top';
                    // Если редактируемая запись находится внизу списка, то не нужно ее скроллить к верху.
                    // Т.к. в большинстве кейсов это вызовет срабатывание триггера и лишние перерисовки.
                    const forwardEdgeItem =
                        this._listVirtualScrollController.getEdgeVisibleItem('forward');
                    if (forwardEdgeItem) {
                        const forwardEdgeItemKey =
                            forwardEdgeItem.key === 'null'
                                ? null
                                : isNaN(forwardEdgeItem.key)
                                ? forwardEdgeItem.key
                                : Number(forwardEdgeItem.key);
                        const forwardEdgeItemIndex =
                            this._listViewModel.getIndexByKey(forwardEdgeItemKey);
                        const itemIndex = this._listViewModel.getIndexByKey(item.key);
                        if (itemIndex >= forwardEdgeItemIndex && forwardEdgeItemIndex !== -1) {
                            position = 'center';
                        }
                    }
                    return _private.scrollToItem(this, item.key, position, false);
                }
            });
    }

    _beforeEndEditCallback(params: IBeforeEndEditCallbackParams): Promise<void> {
        if (params.force) {
            this._options.notifyCallback('beforeEndEdit', params.toArray());
            return;
        }

        return (params.willSave ? this._validateEditing() : Promise.resolve())
            .then((result) => {
                if (result === LIST_EDITING_CONSTANTS.CANCEL) {
                    return result;
                }

                const eventResult = this._options.notifyCallback('beforeEndEdit', params.toArray());

                // Если пользователь не сохранил добавляемый элемент, используется платформенное сохранение.
                // Пользовательское сохранение потенциально может начаться только если вернули Promise
                const shouldUseDefaultSaving =
                    params.willSave &&
                    (params.isAdd || params.item.isChanged()) &&
                    (!eventResult ||
                        (eventResult !== LIST_EDITING_CONSTANTS.CANCEL &&
                            !(eventResult instanceof Promise)));

                return shouldUseDefaultSaving
                    ? this._saveEditingInSource(params.item, params.isAdd, params.sourceIndex)
                    : Promise.resolve(eventResult);
            })
            .catch((error) => {
                this._notify('dataError', [{ error }]);
                return LIST_EDITING_CONSTANTS.CANCEL;
            });
    }

    _afterEndEditCallback(item: IEditableCollectionItem, isAdd: boolean, willSave: boolean): void {
        this._options.notifyCallback('afterEndEdit', [item.contents, isAdd]);

        this._options.onAfterEndEditCallbackCompatible(item, isAdd, willSave, this, this._options);

        item.contents.unsubscribe('onPropertyChange', this._resetValidation);
        _private.removeShowActionsClass(this);
        // Этот код страбатывает асинхронно. Может оказаться, что индексы ещё не расставлены.
        // Гарантированно можно обновить itemActions только на afterRender
        this._shouldUpdateActionsAfterRender = true;
    }

    private _initValidationContrillerAsync(): Promise<void> {
        if (!this._validateController) {
            return import('Controls/validate').then((lib) => {
                this._validateController = new lib.ControllerClass();
                this._validators.forEach((validator) => {
                    this._validateController.addValidator(validator);
                });
            });
        }
        return Promise.resolve();
    }

    private _validateEditing(): Promise<typeof LIST_EDITING_CONSTANTS.CANCEL | void> {
        return !this._validators.length
            ? Promise.resolve()
            : this._initValidationContrillerAsync().then(() => {
                  // Валидация запускается не моментально, а после заказанного для нее цикла синхронизации.
                  // Такая логика необходима, если синхронно поменяли реактивное состояние, которое будет валидироваться
                  // и позвали валидацию. В таком случае, первый цикл применит все
                  // состояния и только после него произойдет валидация.
                  // _forceUpdate гарантирует, что цикл синхронизации будет, т.к. невозможно понять поменялось ли какое-то
                  // реактивное состояние.
                  const submitPromise = this._validateController.deferSubmit();
                  this._isPendingDeferSubmit = true;
                  this._forceUpdate();
                  return submitPromise.then((validationResult) => {
                      for (const key in validationResult) {
                          if (validationResult.hasOwnProperty(key) && validationResult[key]) {
                              return LIST_EDITING_CONSTANTS.CANCEL;
                          }
                      }
                  });
              });
    }

    _resetValidation(): void {
        this._validateController?.setValidationResult(null);
    }

    isEditing(): boolean {
        return _private.isEditing(this);
    }

    beginEdit(userOptions?: IItemEditOptions): TAsyncOperationResult {
        if (this._options.readOnly) {
            return BaseControl._rejectEditInPlacePromise('beginEdit');
        }
        // В публичном API пользователь указывает индекс колонки из конфигурации, не зная про множественный выбор.
        // Модель строки работает по индексам своих внутренних колонок (Cell), к которых есть колонка-чекбокс.
        // FIXME: Не должно быть в BaseControl, унести в GridControl.
        const checkboxOffset = +this._hasMultiSelect();
        return this._beginEdit(userOptions, {
            shouldActivateInput: userOptions?.shouldActivateInput,
            // FIXME: Знание про колонки должно быть только в Grid и IEditableGrid
            columnIndex: (userOptions?.columnIndex || 0) + checkboxOffset,
        });
    }

    beginAdd(userOptions?: IItemAddOptions): TAsyncOperationResult {
        if (this._options.readOnly) {
            return BaseControl._rejectEditInPlacePromise('beginAdd');
        }
        // В публичном API поьзователь указывает индекс колонки из конфигурации, не зная про множественный выбор.
        // Модель строки работает по индексам своих внутренних колонок (Cell), к которых есть колонка-чекбокс.
        // FIXME: Не должно быть в BaseControl, унести в GridControl.
        const checkboxOffset = +this._hasMultiSelect();
        return this._beginAdd(userOptions, {
            addPosition: userOptions?.addPosition || this._getEditingConfig().addPosition,
            targetItem: userOptions?.targetItem,
            shouldActivateInput: userOptions?.shouldActivateInput,
            // FIXME: Знание про колонки должно быть только в Grid и IEditableGrid
            columnIndex: (userOptions?.columnIndex || 0) + checkboxOffset,
        });
    }

    cancelEdit(): TAsyncOperationResult {
        if (this._options.readOnly) {
            return BaseControl._rejectEditInPlacePromise('cancelEdit');
        }
        return this._cancelEdit();
    }

    commitEdit(): TAsyncOperationResult {
        if (this._options.readOnly) {
            return BaseControl._rejectEditInPlacePromise('commitEdit');
        }
        return this._commitEdit();
    }

    _tryStartInitialEditing(options: IBaseControlOptions): TAsyncOperationResult {
        const editingConfig: Required<IEditingConfig> = this._getEditingConfig(options);
        const hasItems = !!(
            (this._loadedItems && this._loadedItems.getCount()) ||
            (this._listViewModel && this._listViewModel.getSourceCollectionCount())
        );

        const getCreateControllerPromise = () => {
            return this._createEditInPlaceControllerAsync(options);
        };

        if (editingConfig.autoAddOnInit && !!this._sourceController && !hasItems) {
            return getCreateControllerPromise().then(() => {
                return this._beginAdd(
                    { filter: options.filter },
                    { addPosition: editingConfig.addPosition }
                );
            });
        } else if (editingConfig.item) {
            return getCreateControllerPromise().then(() => {
                if (
                    this._listViewModel &&
                    this._listViewModel.getSourceItemByKey(editingConfig.item.getKey())
                ) {
                    return this._beginEdit({ item: editingConfig.item });
                } else {
                    return this._beginAdd(
                        { item: editingConfig.item },
                        { addPosition: editingConfig.addPosition }
                    );
                }
            });
        }
    }

    _beginEdit(
        userOptions: object,
        { shouldActivateInput = true, columnIndex }: IBeginEditOptions = {}
    ): Promise<void | { canceled: true }> {
        _private.closeSwipe(this);
        if (_private.hasHoverFreezeController(this)) {
            this._hoverFreezeController.unfreezeHover();
        }
        this._displayGlobalIndicator();
        return this._createEditInPlaceControllerAsync().then(() => {
            return this._editInPlaceController
                .edit(userOptions, { columnIndex })
                .then((result) => {
                    if (shouldActivateInput && !(result && result.canceled)) {
                        this._editInPlaceInputHelper.shouldActivate();
                        // раньше индикаторы вызывали ненужную перерисовку изменением стейта, теперь нужно в ручную вызвать
                        // перерисовку, чтобы поставить фокус на инпут, который уже точно отрисовался
                        this._forceUpdate();
                    }
                    return result;
                })
                .finally(() => {
                    if (this._indicatorsController.shouldHideGlobalIndicator()) {
                        this._indicatorsController.hideGlobalIndicator();
                    }
                });
        });
    }

    _beginAdd(
        userOptions: object,
        {
            shouldActivateInput = true,
            addPosition = 'bottom',
            targetItem,
            columnIndex,
        }: IBeginAddOptions = {}
    ) {
        _private.closeSwipe(this);
        this._displayGlobalIndicator();
        return this._createEditInPlaceControllerAsync().then(() => {
            return this._editInPlaceController
                .add(userOptions, { addPosition, targetItem, columnIndex })
                .then((addResult) => {
                    if (addResult && addResult.canceled) {
                        return addResult;
                    }
                    if (shouldActivateInput) {
                        this._editInPlaceInputHelper.shouldActivate();
                        // раньше индикаторы вызывали ненужную перерисовку изменением стейта, теперь нужно в ручную вызвать
                        // перерисовку, чтобы поставить фокус на инпут, который уже точно отрисовался
                        this._forceUpdate();
                    }
                    if (!this._isMounted) {
                        return addResult;
                    }

                    if (this._hasSelectionController()) {
                        const controller = this._getSelectionController();
                        controller.setSelection(controller.getSelection());
                    }
                })
                .finally(() => {
                    if (this._indicatorsController.shouldHideGlobalIndicator()) {
                        this._indicatorsController.hideGlobalIndicator();
                    }
                });
        });
    }

    _cancelEdit(force: boolean = false): TAsyncOperationResult {
        if (!this._editInPlaceController) {
            return Promise.resolve();
        }
        this._displayGlobalIndicator();
        return this._editInPlaceController.cancel(force).finally(() => {
            if (this._hasSelectionController()) {
                const controller = this._getSelectionController();
                controller.setSelection(controller.getSelection());
            }
            if (this._indicatorsController.shouldHideGlobalIndicator()) {
                this._indicatorsController.hideGlobalIndicator();
            }
        });
    }

    _commitEdit(commitStrategy?: 'hasChanges' | 'all'): Promise<void | { canceled: true }> {
        if (!this._editInPlaceController) {
            return Promise.resolve();
        }
        this._displayGlobalIndicator();
        return this._editInPlaceController.commit(commitStrategy).finally(() => {
            // Контроллера может не быть, т.к. в этот момент список уже может заанмаунтиться.
            if (
                this._indicatorsController &&
                this._indicatorsController.shouldHideGlobalIndicator()
            ) {
                this._indicatorsController.hideGlobalIndicator();
            }
        });
    }

    private _commitEditActionHandler(collectionItem: CollectionItem): void {
        this.commitEdit().then((result) => {
            if (result && result.canceled) {
                return result;
            }
            const editingConfig = this._getEditingConfig();
            if (editingConfig.autoAddByApplyButton && collectionItem.isAdd) {
                return this._beginAdd({}, { addPosition: editingConfig.addPosition });
            } else {
                return result;
            }
        });
    }

    private _cancelEditActionHandler(): void {
        this.cancelEdit();
    }

    private _onEditingRowKeyDown(event: SyntheticEvent<KeyboardEvent>): TAsyncOperationResult {
        if (
            !this._editInPlaceController ||
            this._editInPlaceController.isBeginEditProcessing() ||
            this._editInPlaceController.isEndEditProcessing()
        ) {
            return Promise.resolve();
        }

        const editNext = (
            item: Model | undefined,
            direction: TGoToPrevConstant | TGoToNextConstant
        ) => {
            if (!item || this._arrowsBlockedForEditInPlace) {
                return Promise.resolve();
            }
            this._continuationEditingDirection = direction;
            const collection = this._listViewModel;
            const columnIndex =
                this._getEditingConfig()?.mode === 'cell'
                    ? collection
                          .find((cItem) => {
                              return cItem.isEditing();
                          })
                          .getEditingColumnIndex()
                    : undefined;
            let shouldActivateInput = true;
            if (this._listViewModel['[Controls/_display/grid/mixins/Grid]']) {
                shouldActivateInput = false;
                this._editInPlaceInputHelper.setInputForFastEdit(
                    event.nativeEvent.target,
                    direction
                );
            }

            this._arrowsBlockedForEditInPlace = true;
            return this._beginEdit({ item }, { shouldActivateInput, columnIndex }).then(
                (result) => {
                    this._arrowsBlockedForEditInPlace = false;
                    return result;
                }
            );
        };

        // Так как наша система событий ловит события на стадии capture,
        // а подписки в БТРе на стадии bubbling, то не нужно звать stopPropagation
        // так как обработчики БТРа в таком случае не отработают, потому что
        // у события не будет bubbling фазы
        // TODO: Нужно поправить после исправления
        //  https://online.sbis.ru/opendoc.html?guid=cefa8cd9-6a81-47cf-b642-068f9b3898b7
        // Don't stop propagation event with tab-key, it breaks the moving focus by tab/shift+tab.
        // Stop propagation on escape, because it should only be used to cancel edit in place
        const editingItem =
            this._editInPlaceController &&
            (this._editInPlaceController.getEditableItem() as unknown as CollectionItem);
        const keepEnter =
            editingItem &&
            editingItem.getEditingConfig() &&
            editingItem.getEditingConfig().sequentialEditingMode === 'cell';
        if (
            !(event.nativeEvent.keyCode === constants.key.enter && keepEnter) &&
            (event.nativeEvent.keyCode === constants.key.esc ||
                (!event.target.closest('.ws-dont-stop-native-event') &&
                    event.nativeEvent.keyCode !== constants.key.tab))
        ) {
            event.stopPropagation();
        }

        switch (event.nativeEvent.keyCode) {
            case constants.key.enter:
                if (this._getEditingConfig().sequentialEditingMode === 'cell') {
                    return Promise.resolve();
                } else {
                    return this._editingRowEnterHandler(event);
                }
            case constants.key.esc:
                return this._cancelEdit();
            case constants.key.up:
                const prev = this._editInPlaceController.getPrevEditableItem();
                return editNext(prev?.contents, 'GoToPrev');
            case constants.key.down: // ArrowDown
                const next = this._editInPlaceController.getNextEditableItem();
                return editNext(next?.contents, 'GoToNext');
            default:
                return Promise.resolve();
        }
    }

    private _editingRowEnterHandler(): Promise<void | { canceled: true }> {
        const editingConfig = this._getEditingConfig();
        const columnIndex = this._editInPlaceController._getEditingItem()._$editingColumnIndex;
        const next = this._editInPlaceController.getNextEditableItem();
        const shouldEdit = editingConfig.sequentialEditingMode !== 'none' && !!next;
        const shouldAdd =
            !next &&
            !shouldEdit &&
            !!editingConfig.autoAdd &&
            editingConfig.addPosition === 'bottom';

        if (editingConfig.mode === 'cell' && (shouldEdit || shouldAdd)) {
            this._continuationEditingDirection = 'GoToNext';
        }

        return this._tryContinueEditing(shouldEdit, shouldAdd, next && next.contents, columnIndex);
    }

    protected _onItemDeactivated(item: CollectionItem, eventOptions: IFocusChangedConfig): void {
        if (!_private.isEditing(this)) {
            return;
        }

        const pressedKey = eventOptions?.keyPressedData?.key;
        const shouldEditNextRow =
            pressedKey &&
            (pressedKey === 'Tab' ||
                (pressedKey === 'Enter' &&
                    this._getEditingConfig().sequentialEditingMode === 'cell'));

        if (shouldEditNextRow) {
            if (this._getEditingConfig()?.mode === 'cell') {
                this._onEditingCellTabHandler(eventOptions);
            } else {
                this._onEditingRowTabHandler(eventOptions);
            }
        }
    }

    private _onEditingCellTabHandler(
        eventOptions: IFocusChangedConfig
    ): Promise<{ canceled: true } | void> {
        const editingConfig = this._getEditingConfig();
        const editingItem = this._editInPlaceController.getEditableItem();
        let columnIndex;
        let next = editingItem;
        let shouldAdd;
        const checkboxOffset = +this._hasMultiSelect();

        if (eventOptions.isShiftKey) {
            this._continuationEditingDirection = 'PrevColumn';
            columnIndex = editingItem._$editingColumnIndex - 1;
            if (columnIndex < 0) {
                next = this._editInPlaceController.getPrevEditableItem();
                columnIndex = this._options.columns.length - 1 + checkboxOffset;
            }
            shouldAdd = editingConfig.autoAdd && !next && editingConfig.addPosition === 'top';
        } else {
            this._continuationEditingDirection = 'NextColumn';
            columnIndex = editingItem._$editingColumnIndex + 1;
            if (columnIndex > this._options.columns.length - 1 + checkboxOffset) {
                next = this._editInPlaceController.getNextEditableItem();
                columnIndex = checkboxOffset;
            }
            shouldAdd = editingConfig.autoAdd && !next && editingConfig.addPosition === 'bottom';
        }
        return this._tryContinueEditing(!!next, shouldAdd, next && next.contents, columnIndex);
    }

    private _onEditingRowTabHandler(
        eventOptions: IFocusChangedConfig
    ): Promise<{ canceled: true } | void> {
        const editingConfig = this._getEditingConfig();
        let next;
        let shouldEdit;
        let shouldAdd;

        if (eventOptions.isShiftKey) {
            this._continuationEditingDirection = 'GoToPrev';
            next = this._editInPlaceController.getPrevEditableItem();
            shouldEdit = !!next;
            shouldAdd =
                editingConfig.autoAdd &&
                !next &&
                !shouldEdit &&
                editingConfig.addPosition === 'top';
        } else {
            this._continuationEditingDirection = 'GoToNext';
            next = this._editInPlaceController.getNextEditableItem();
            shouldEdit = !!next;
            shouldAdd =
                editingConfig.autoAdd &&
                !next &&
                !shouldEdit &&
                editingConfig.addPosition === 'bottom';
        }
        return this._tryContinueEditing(shouldEdit, shouldAdd, next && next.contents);
    }

    _tryContinueEditing(
        shouldEdit: boolean,
        shouldAdd: boolean,
        item?: Model,
        columnIndex?: number
    ): Promise<void | { canceled: true }> {
        return this._commitEdit().then((result) => {
            if (result && result.canceled) {
                return result;
            }
            if (shouldEdit) {
                return this._beginEdit({ item }, { columnIndex });
            } else if (shouldAdd) {
                return this._beginAdd(
                    {},
                    {
                        addPosition: this._getEditingConfig().addPosition,
                        columnIndex,
                    }
                );
            } else {
                this._continuationEditingDirection = null;
            }
        });
    }

    _saveEditingInSource(item: Model, isAdd: boolean, sourceIndex?: number): Promise<void> {
        const updateResult = this._options.source
            ? this.getSourceController().update(item)
            : Promise.resolve();

        return updateResult.then(() => {
            // После выделения слоя логики работы с источником данных в отдельный контроллер,
            // код ниже должен переехать в него.
            if (isAdd) {
                if (typeof sourceIndex === 'number') {
                    this._items.add(item, sourceIndex);
                } else {
                    this._items.append([item]);
                }
            }
        });
    }

    _getEditingConfig(options: IBaseControlOptions = this._options): Required<IEditingConfig> {
        const editingConfig = options.editingConfig || {};
        const addPosition = editingConfig.addPosition === 'top' ? 'top' : 'bottom';

        // Режим последовательного редактирования (действие по Enter).
        const getSequentialEditingMode = () => {
            // sequentialEditingMode[row | cell | none] - новая опция, sequentialEditing[boolean?] - старая опция
            if (typeof editingConfig.sequentialEditingMode === 'string') {
                return editingConfig.sequentialEditingMode;
            } else {
                return editingConfig.sequentialEditing !== false ? 'row' : 'none';
            }
        };

        return {
            mode: editingConfig.mode || 'row',
            editOnClick: !!editingConfig.editOnClick,
            editOnEnter: !!editingConfig.editOnEnter,
            sequentialEditingMode: getSequentialEditingMode(),
            addPosition,
            item: editingConfig.item,
            autoAdd: !!editingConfig.autoAdd,
            autoAddOnInit: !!editingConfig.autoAddOnInit,
            backgroundStyle: editingConfig.backgroundStyle || 'default',
            autoAddByApplyButton:
                editingConfig.autoAddByApplyButton === false
                    ? false
                    : !!(editingConfig.autoAddByApplyButton || editingConfig.autoAdd),
            applyButtonStyle:
                editingConfig.applyButtonStyle !== undefined
                    ? editingConfig.applyButtonStyle
                    : 'accent',
            toolbarVisibility: !!editingConfig.toolbarVisibility,
            inputBackgroundVisibility: editingConfig.inputBackgroundVisibility,
            inputBorderVisibility: editingConfig.inputBorderVisibility,

            task1181625554: !!editingConfig.task1181625554,
        };
    }

    // endregion

    onactivated(
        e: Event,
        eventOptions?: {
            isTabPressed: boolean;
            isShiftKey: boolean;
            keyPressedData?: {
                key: string;
            };
        }
    ): void {
        if (eventOptions?.isTabPressed && this.__needShowEmptyTemplate(this._options)) {
            if (!!this._container.querySelector('.js-controls-List__editingTemplate')) {
                this.beginAdd();
            }
        } else {
            this._options.onActivatedNew(
                {
                    isShiftKey: !!eventOptions?.isShiftKey,
                    isTabPressed: !!eventOptions?.isTabPressed,
                    key:
                        typeof eventOptions?.keyPressedData?.key !== 'undefined'
                            ? eventOptions.keyPressedData.key
                            : undefined,
                },
                this,
                this._options
            );
        }
    }

    /**
     * Обработчик показа контекстного меню
     * @param e
     * @param itemData
     * @param clickEvent
     * @private
     */
    _onItemContextMenu(
        e: SyntheticEvent<Event>,
        itemData: CollectionItem<Model>,
        clickEvent: SyntheticEvent<MouseEvent>
    ): void {
        _private.openContextMenu(this, clickEvent, itemData);
    }

    /**
     * Обработчик долгого тапа
     * @param e
     * @param itemData
     * @param tapEvent
     * @private
     */
    _onItemLongTap(
        e: SyntheticEvent<Event>,
        itemData: CollectionItem<Model>,
        tapEvent: SyntheticEvent<MouseEvent>
    ): void {
        _private.updateItemActionsOnce(this, this._options);
        _private.openContextMenu(this, tapEvent, itemData);
        this._options.notifyCallback('itemLongTap', [itemData.item, tapEvent]);
    }

    protected _getViewClasses(): string {
        return (
            'controls-BaseControl__viewContainer ' +
            this._getViewUniqueClass() +
            (this.__needShowEmptyTemplate() ? ' controls-BaseControl__viewContainer_empty' : '')
        );
    }

    protected _getSystemFooterClasses(): string {
        return 'controls__BaseControl__footer';
    }

    protected _getSystemFooterStyles(): string {
        return '';
    }

    protected _itemMouseDown(event: SyntheticEvent, itemData, domEvent: MouseEvent) {
        // При клике в операцию записи не нужно посылать событие itemMouseDown. Останавливать mouseDown в
        // методе _onItemActionMouseDown нельзя, т.к. тогда оно не добросится до Application
        this._itemActionMouseDown = null;
        if (!!domEvent.target.closest(ITEM_ACTION_SELECTOR)) {
            this._itemActionMouseDown = true;
            event.stopPropagation();
            return;
        }

        // Если есть ссылка для открытия, то не должен срабоать авто-скролл по нажатию на колесико.
        // Так же работают нативные сслыки.
        if (domEvent.nativeEvent.button === 1) {
            const url = itemData.item.get(this._options.urlProperty);
            if (url) {
                domEvent.preventDefault();
            }
        }

        let hasDragScrolling = false;
        const contents = getPlainItemContents(itemData);
        this._mouseDownItemKey = getKey(contents);
        if (this._options.columnScroll) {
            // Не должно быть завязки на горизонтальный скролл.
            // https://online.sbis.ru/opendoc.html?guid=347fe9ca-69af-4fd6-8470-e5a58cda4d95
            hasDragScrolling =
                (this._options.isColumnScrollVisible ||
                    this._isColumnScrollVisible ||
                    this._options.canHorizontalScroll) &&
                (typeof this._options.dragScrolling === 'boolean'
                    ? this._options.dragScrolling
                    : !this._options.itemsDragNDrop);
        }
        if (!hasDragScrolling) {
            // dragStartDelay нужен, чтобы была возможность выше отменить днд. То есть, за заданное время, контрол
            // выше может выполнить свои действия и уже на событие dragStart дать однозначный ответ.
            // Нужно например, чтобы начать dragScroll в канбане, но если прошло dragStartDelay, то должен быть DnD.
            if (this._options.dragStartDelay) {
                setTimeout(() => {
                    _private.startDragNDrop(this, domEvent, itemData);
                }, this._options.dragStartDelay);
            } else {
                _private.startDragNDrop(this, domEvent, itemData);
            }
        } else {
            this._savedItemMouseDownEventArgs = { event, itemData, domEvent };
        }

        if (checkWasabyEvent(this._options.onItemMouseDown)) {
            this._options.onItemMouseDown(itemData.item, domEvent.nativeEvent);
        } else {
            this._options.notifyCallback('itemMouseDown', [itemData.item, domEvent.nativeEvent]);
        }
    }

    protected _itemMouseUp(e: SyntheticEvent, itemData, domEvent: MouseEvent): void {
        if (itemData.isEditing()) {
            return;
        }
        const contents = getPlainItemContents(itemData);
        const key = getKey(contents);
        // Маркер должен ставиться именно по событию mouseUp, т.к. есть сценарии при которых блок над которым произошло
        // событие mouseDown и блок над которым произошло событие mouseUp - это разные блоки.
        // Например, записи в мастере или запись в списке с dragScrolling'ом.
        // При таких сценариях нельзя устанавливать маркер по событию itemClick,
        // т.к. оно не произойдет (itemClick = mouseDown + mouseUp на одном блоке).
        // Также, нельзя устанавливать маркер по mouseDown, блок сменится раньше и клик по записи не выстрелет.

        if (this._mouseDownItemKey === key) {
            if (
                domEvent.nativeEvent.button === 1 ||
                (domEvent.nativeEvent.button === 0 &&
                    ((detection.isMac && domEvent.nativeEvent.metaKey) ||
                        (!detection.isMac && domEvent.nativeEvent.ctrlKey)))
            ) {
                const url = itemData.item.get(this._options.urlProperty);
                const isLinkClick = domEvent.target.closest('a')?.getAttribute('href');
                if (url && !isLinkClick) {
                    window.open(url);
                    this._onLastMouseUpWasOpenUrl = domEvent.nativeEvent.button === 0;
                }
            }
        }

        this._mouseDownItemKey = undefined;
        // По контроллеру проверять нельзя, т.к. состояние изменится раньше. Но перерисоваться item не успеет
        this._onLastMouseUpWasDrag =
            itemData.isDragged() || !!domEvent.target.closest('.controls-ListView__item_dragging');
        this._options.notifyCallback('itemMouseUp', [itemData.item, domEvent.nativeEvent]);
    }

    protected _startDragNDropCallback(): void {
        _private.startDragNDrop(
            this,
            this._savedItemMouseDownEventArgs.domEvent,
            this._savedItemMouseDownEventArgs.itemData
        );
    }

    protected _onloadMore(e: SyntheticEvent, dispItem?: CollectionItem): void {
        _private.loadToDirectionIfNeed(this, 'down');
    }

    protected _resolveNavigationButtonView(): TNavigationButtonView {
        const navigation = this._options.navigation;
        const view = navigation?.view;
        const buttonView = navigation?.viewConfig?.buttonView;
        return buttonView || (view === 'cut' ? 'separator' : 'link');
    }

    /**
     * Обработчик клика на кнопку подгрузки данных при навигации по запросу
     * @private
     */
    protected _onNavigationButtonClick(): void {
        const view = this._options.navigation?.view;
        if (view === 'demand') {
            _private.loadToDirectionIfNeed(this, 'down');
        } else if (view === 'cut') {
            this._toggleCutClick();
        }
    }

    // region Cut

    private _toggleCutClick(): void {
        const result = this._options.notifyCallback('cutClick', [this._cutExpanded], {
            bubbling: true,
        });
        if (result !== false) {
            const newExpanded = !this._cutExpanded;
            this._reCountCut(newExpanded).then(() => {
                return (this._cutExpanded = newExpanded);
            });
        }
    }

    private _reCountCut(newExpanded: boolean): Promise<void> {
        if (newExpanded) {
            this._listVirtualScrollController.setScrollBehaviourOnReset('keep');
            return this._reload(this._options, { ignoreNavigation: true }).then(() => {
                _private.prepareFooter(this, this._options, this._sourceController);
            });
        } else {
            this._listVirtualScrollController.setScrollBehaviourOnReset('keep');
            return this._reload(this._options).then(() => {
                _private.prepareFooter(this, this._options, this._sourceController);
            });
        }
    }

    // endregion Cut

    private _nativeDragStart(event: SyntheticEvent): void {
        // preventDefault нужно делать именно на нативный dragStart:
        // 1. getItemsBySelection может отрабатывать асинхронно (например при массовом выборе всех записей), тогда
        //    preventDefault в startDragNDrop сработает слишком поздно, браузер уже включит нативное перетаскивание
        // 2. На mouseDown ставится фокус, если на нём сделать preventDefault - фокус не будет устанавливаться
        // Наш drag может начаться раньше нативного, поэтому проверять здесь на isDragging нельзя
        if (
            DndController.canStartDragNDrop(
                this._options.readOnly,
                this._options.itemsDragNDrop,
                this._options.canStartDragNDrop,
                event
            )
        ) {
            event.preventDefault();
        }
    }

    handleKeyDown(event: SyntheticEvent<KeyboardEvent>): void {
        this._onViewKeyDown(event);
    }

    // TODO удалить после выполнения наследования Explorer <- TreeControl <- BaseControl
    clearSelection(): void {
        this._changeSelection({ selected: [], excluded: [] });
    }

    isAllSelected(): boolean {
        return this._getSelectionController()?.isAllSelected();
    }

    // region move / remove

    moveItems(
        selection: ISelectionObject,
        targetKey: CrudEntityKey,
        position: LOCAL_MOVE_POSITION,
        viewCommandName: string = VIEW_COMMAND.MOVE
    ): Promise<DataSet> {
        const target = this._listViewModel.getSourceCollection().getRecordById(targetKey);
        return this._callAction<DataSet>(
            COMMAND.MOVE,
            viewCommandName,
            {
                selection,
                filter: this._options.filter,
                targetKey,
                position,
            },
            {
                selection,
                target,
                position,
            }
        );
    }

    moveItemUp(selectedKey: CrudEntityKey, viewCommandName?: string): Promise<void> {
        return this._moveItemToDirection(selectedKey, LOCAL_MOVE_POSITION.Before, viewCommandName);
    }

    moveItemDown(selectedKey: CrudEntityKey, viewCommandName?: string): Promise<void> {
        return this._moveItemToDirection(selectedKey, LOCAL_MOVE_POSITION.After, viewCommandName);
    }

    moveItemsWithDialog(
        selection: ISelectionObject,
        config?: IListActionAdditionalConfig
    ): Promise<DataSet> {
        const moveDialogOptions = this._options.moveDialogTemplate;
        if (moveDialogOptions && !moveDialogOptions.templateName) {
            Logger.error('BaseControl: Wrong type of moveDialogTemplate option', this);
            return;
        }
        const viewCommandName = typeof config === 'string' ? config : config?.viewCommandName;
        this._addCoordinatesToActionMenuEvent(config?.target);

        // Чтобы выполнить перемещение в RecordSet нам нужно получить target
        const popupOptions: Partial<IMoveDialogOptions> = {
            opener: this,
            template: moveDialogOptions.templateName,
            templateOptions: {
                ...moveDialogOptions.templateOptions,
                keyProperty:
                    moveDialogOptions.templateOptions.keyProperty ?? this._options.keyProperty,
            },
            beforeMoveCallback: moveDialogOptions.beforeMoveCallback,
        };
        return this._callAction<DataSet>(
            COMMAND.MOVE_WITH_DIALOG,
            viewCommandName === undefined ? VIEW_COMMAND.PARTIAL_RELOAD : viewCommandName,
            {
                theme: this._options.theme,
                target: config?.target,
                popupOptions,
                selection,
                filter: this._options.filter,
            },
            {
                selection,
                position: LOCAL_MOVE_POSITION.On,
            }
        );
    }

    removeItems(
        selection: ISelectionObject,
        viewCommandName: string = VIEW_COMMAND.REMOVE
    ): Promise<string | void> {
        return this._callAction<string | void>(
            COMMAND.REMOVE,
            viewCommandName,
            { selection, rootHistoryId: this._options.rootHistoryId },
            { selection }
        );
    }

    removeItemsWithConfirmation(
        selection: ISelectionObject,
        config?: IListActionAdditionalConfig | string
    ): Promise<string | void> {
        const viewCommandName = typeof config === 'string' ? config : config?.viewCommandName;
        this._addCoordinatesToActionMenuEvent(config?.target);
        return this._callAction<string | void>(
            COMMAND.REMOVE_WITH_CONFIRM,
            viewCommandName === undefined ? VIEW_COMMAND.REMOVE : viewCommandName,
            {
                selection,
                rootHistoryId: this._options.rootHistoryId,
                target: config?.target,
                opener: this,
            },
            { selection }
        );
    }

    protected _getSiblingStrategy(): ISiblingStrategy {
        return new FlatSiblingStrategy({
            collection: this._listViewModel,
        });
    }

    // Добавляет координаты кнопки к таргету события клика по кнопке операций над записью,
    // если кликнули внутри меню.
    private _addCoordinatesToActionMenuEvent(target: EventTarget | null): void {
        if (!target?.closest) {
            return;
        }
        // Если открыли из меню, выравниваем окно по верхнему краю пункта меню.
        const menuRow = target.closest('.controls-Menu__row');
        // Пока MoverDialog асинхронно открывается, само меню уже закроется,
        // Поэтому запоминаем координаты окошка меню в target.
        // При этом, прикладникам требуется именно HTML элемент,
        // поэтому добавляем свойства, а не подменяем target на координаты.
        if (menuRow) {
            const rect = menuRow.getBoundingClientRect();
            target.left = rect.left;
            target.top = rect.top;
            target.width = rect.width;
            target.height = rect.height;
        }
    }

    private _moveItemToDirection(
        selectedKey: CrudEntityKey,
        position: LOCAL_MOVE_POSITION,
        viewCommandName: string = VIEW_COMMAND.MOVE
    ): Promise<void> {
        const selection: ISelectionObject = {
            selected: [selectedKey],
            excluded: [],
        };
        const target =
            position === LOCAL_MOVE_POSITION.Before
                ? this._getSiblingStrategy().getPrevByKey(selectedKey)
                : this._getSiblingStrategy().getNextByKey(selectedKey);
        return this._callAction<void>(
            COMMAND.MOVE,
            viewCommandName,
            {
                selection,
                position,
                targetKey: target?.getKey(),
                siblingStrategy: this._getSiblingStrategy(),
            },
            {
                selection,
                target,
                position,
            },
            false
        );
    }

    /**
     * Последовательно выполняет list-комманду, а затем view-команду
     * @param commandName
     * @param viewCommandName
     * @param commandConfig
     * @param viewCommandConfig
     * @param resetSelectionOnSuccess
     * @private
     */
    private _callAction<T>(
        commandName: string | COMMAND,
        viewCommandName: null | string | VIEW_COMMAND,
        commandConfig: Partial<IActionOptions> = {},
        viewCommandConfig: Partial<IActionOptions> = {},
        resetSelectionOnSuccess: boolean = true
    ): Promise<T> {
        return this._getListAction(commandName)
            .then((action) => {
                return action.execute(commandConfig);
            })
            .then((result: string | void) => {
                return viewCommandName
                    ? this._getViewAction(viewCommandName, viewCommandConfig)
                          .then((viewCommand) => {
                              return viewCommand.execute({});
                          })
                          .then(() => {
                              return result;
                          })
                    : result;
            })
            .then((result: string | void) => {
                if (resetSelectionOnSuccess && this._hasSelectionController()) {
                    this._changeSelection({ selected: [], excluded: [] });
                }
                return result;
            })
            .catch((error) => {
                if (error && error !== 'Cancel') {
                    return process({ error });
                }
                return;
            }) as undefined as Promise<T>;
    }

    /**
     * Асинхронно загружает указанную list-команду для работы с БЛ и возвращает Promise с её экземпляром.
     * @param commandName
     * @private
     */
    private _getListAction(commandName: string): Promise<IAction> {
        return loadAsync(commandName).then((commandCtor) => {
            return new commandCtor({
                source: this._options.source,
                filter: this._options.filter,
                parentProperty: this._options.parentProperty,
                nodeProperty: this._options.nodeProperty,
                keyProperty: this._keyProperty,
                sorting: this._options.sorting,
            });
        });
    }

    /**
     * Асинхронно загружает и инициализирует указанную view-команду и возвращает Promise с её экземпляром.
     * @param viewCommandName Путь к команде
     * @param config Доп. параметры для передачи в конструктор команды
     * @private
     */
    private _getViewAction(
        viewCommandName: string,
        config?: Partial<IActionOptions>
    ): Promise<IAction> {
        return loadAsync(viewCommandName).then((commandCtor) => {
            const collection = this._listViewModel.getSourceCollection();
            return new commandCtor({
                parentProperty: this._options.parentProperty,
                nodeProperty: this._options.nodeProperty,
                root: this._options.root,
                source: this._options.source,
                sorting: this._options.sorting,
                keyProperty: collection.getKeyProperty(),
                items: collection,
                sourceController: this._sourceController,
                ...config,
            });
        });
    }

    // endregion move / remove

    protected _onViewKeyDown(event: SyntheticEvent<KeyboardEvent>): void {
        if (event.nativeEvent.altKey) {
            return;
        }

        const itemContainer = event.target.closest('.controls-ListView__itemV');
        if (itemContainer) {
            const editingItem =
                this._editInPlaceController && this._editInPlaceController.getEditableItem();
            if (editingItem) {
                this._onEditingRowKeyDown(event);
                return;
            }
        }

        const key = event.nativeEvent.keyCode;
        const isLoading = this._sourceController && this._sourceController.isLoading();
        // Во время порционного поиска можно пользоваться клавишами
        const allowByLoading = !isLoading || _private.isPortionedLoad(this);
        if (allowByLoading) {
            const dontStop =
                key === constants.key.ctrl ||
                key === constants.key.pageUp ||
                key === constants.key.pageDown ||
                key === constants.key.end ||
                key === constants.key.home ||
                key === constants.key.del ||
                key === constants.key.enter ||
                key === constants.key.left ||
                key === constants.key.right;
            EventUtils.keysHandler(event, HOT_KEYS, _private, this, dontStop);
        } else {
            // Во время загрузки стопаем события, которые могут вызвать скролл.
            // Тем самым не даем скроллить ScrollContainer-у.
            if (
                key === constants.key.pageUp ||
                key === constants.key.pageDown ||
                key === constants.key.end ||
                key === constants.key.home
            ) {
                event.stopPropagation();
            }
        }
    }

    protected _keyDownHandler(event: SyntheticEvent<KeyboardEvent>): boolean | void {
        /* For override  */
    }

    protected _getItemsContainerClasses(): string {
        const classes: string[] = [];
        if (this._addShowActionsClass) {
            classes.push(SHOW_ACTIONS_CLASS);
            classes.push(
                `${SHOW_ACTIONS_CLASS}_${_private.getItemActionsVisibility(this, this._options)}`
            );
        }
        if (this._addHoverEnabledClass) {
            classes.push(HOVER_ENABLED_CLASS);
        }
        classes.push(this._getItemsContainerUniqueClass());
        return classes.join(' ');
    }

    private _getViewUniqueClass(): string {
        return `controls-BaseControl__View_${this._uniqueId}`;
    }

    private _getItemsContainerUniqueClass(): string {
        return `controls-BaseControl__itemsContainer_${this._uniqueId}`;
    }

    /**
     * Получает контейнер текущей записи по ключу в уникальном HTML контейнере записей.
     * @param itemKey
     */
    protected _getItemContainerByKey(itemKey: CrudEntityKey): HTMLElement {
        return this._listVirtualScrollController?.getElement(itemKey);
    }

    protected _itemMouseOver(
        event: SyntheticEvent<MouseEvent>,
        itemData: CollectionItem<Model>,
        nativeEvent: Event
    ): void {
        // Обработчик ховера по тегу.
        // На itemMouseEnter не сработает вообще,
        // а на itemMouseMove событие будет стрелять слишком часто,
        // поэтому отлавливаем тут.
        const tag = event.target.closest(TAG_SELECTOR);
        if (tag) {
            this._onTagHoverHandler(event, itemData);
            event.stopPropagation();
            return;
        }
    }

    protected _itemMouseEnter(
        event: SyntheticEvent<MouseEvent>,
        itemData: CollectionItem<Model>,
        nativeEvent: Event
    ): void {
        if (itemData.SupportItemActions) {
            const itemKey = getPlainItemContents(itemData).getKey();
            const itemIndex = this._listViewModel.getIndex(itemData.dispItem || itemData);
            const actions = itemData.getActions();
            // Не надо делать фриз, если ItemActions пустые (например, их отрезали по visibilityCallback)
            if (
                actions?.showed?.length &&
                _private.needHoverFreezeController(this) &&
                !this._isActionsMenuOpened
            ) {
                if (!_private.hasHoverFreezeController(this)) {
                    _private.initHoverFreezeController(this);
                }
                this._hoverFreezeController.startFreezeHoverTimeout(
                    itemKey,
                    nativeEvent,
                    itemIndex,
                    this._listViewModel.getStartIndex()
                );
            }
        }
        if (this._canEditByClick(nativeEvent.target) && !isLoaded('Controls/editInPlace')) {
            // Предзагружаем библиотеку редактирования при наведении на редактируемую строку
            loadAsync('Controls/editInPlace');
        }
        this._options.notifyCallback('itemMouseEnter', [itemData.item, nativeEvent]);
    }

    protected _itemMouseMove(
        event: SyntheticEvent<MouseEvent>,
        item: CollectionItem,
        nativeEvent: MouseEvent
    ): void {
        this._options.notifyCallback('itemMouseMove', [item.item, nativeEvent]);
        const hoverFreezeController = this._hoverFreezeController;
        if (
            !this._addShowActionsClass &&
            (!this._dndListController || !this._dndListController.isDragging()) &&
            (!this._editInPlaceController || !this._editInPlaceController.isEditing()) &&
            !this._isActionsMenuOpened &&
            (!hoverFreezeController || hoverFreezeController.getCurrentItemKey() === null)
        ) {
            _private.addShowActionsClass(this, this._options);
        }

        if (this._dndListController && this._dndListController.isDragging()) {
            this._draggingItemMouseMove(item, nativeEvent);
        }
        if (hoverFreezeController && item.SupportItemActions) {
            const itemKey = getPlainItemContents(item).getKey();
            const itemIndex = this._listViewModel.getIndex(item.dispItem || item);
            hoverFreezeController.setDelayedHoverItem(
                itemKey,
                nativeEvent,
                itemIndex,
                this._listViewModel.getStartIndex()
            );
        }
    }

    protected _draggingItemMouseMove(targetItem: CollectionItem, event: MouseEvent): boolean {
        const targetIsDraggableItem =
            this._dndListController.getDraggableItem()?.getContents() === targetItem.getContents();
        if (targetIsDraggableItem) {
            return false;
        }

        const mouseOffsetInTargetItem = this._calculateMouseOffsetInItem(event);
        const dragPosition = this._dndListController.calculateDragPosition({
            targetItem,
            mouseOffsetInTargetItem,
        });
        if (dragPosition && !isEqual(this._dndListController.getDragPosition(), dragPosition)) {
            const changeDragTarget = this._options.notifyCallback('changeDragTarget', [
                this._dndListController.getDragEntity(),
                dragPosition.dispItem.getContents(),
                dragPosition.position,
            ]);
            this._dndListController.setChangeDragTargetResult(
                changeDragTarget as boolean | undefined
            );
            if (changeDragTarget !== false) {
                return this._dndListController.setDragPosition(dragPosition);
            }
        }
        return false;
    }

    protected _itemMouseLeave(
        e: SyntheticEvent,
        item: CollectionItem,
        nativeEvent: SyntheticEvent<MouseEvent>
    ): void {
        this._options.notifyCallback('itemMouseLeave', [item.item, nativeEvent]);
        if (_private.hasHoverFreezeController(this) && _private.isAllowedHoverFreeze(this)) {
            this._hoverFreezeController.startUnfreezeHoverTimeout(nativeEvent);
        }
    }

    _onSortingChanged(sortingButton: HTMLElement): void {
        const propName = sortingButton.getAttribute('data-property');
        const newSorting = _private.getSortingOnChange(
            this._options.sorting,
            propName,
            this._options.canResetSorting
        );
        event.stopPropagation();

        // При смене сортировки позиция горизонтального скролла не должна изменяться.
        // FIXME: Временное решение, до перехода на нативный горизонтальный скролл.
        //  https://online.sbis.ru/opendoc.html?guid=bc40e794-c5d4-4381-800f-a98f2746750a
        this._keepHorizontalScroll = true;
        checkWasabyEvent(this._options.onSortingChanged)?.(newSorting);
        this._options.notifyCallback('sortingChanged', [newSorting]);
    }

    _updatePagingPadding(): void {
        // Сюда может попасть из beforePaint, когда pagingVisible уже поменялся на true (стрельнуло событие от скролла),
        // но вот сам pagingPaddingContainer отрисуется лишь в следующем цикле синхронизации
        // https://online.sbis.ru/opendoc.html?guid=b6939810-b640-41eb-8139-b523a8df16df
        // Поэтому дополнительно проверяем на this._children.pagingPaddingContainer
        if (!this._pagingPadding && this._children.pagingPaddingContainer) {
            this._pagingPadding = this._children.pagingPaddingContainer.offsetHeight;
        }
    }

    // region BaseControlContainerEvents

    protected _mouseEnter(event: SyntheticEvent<MouseEvent>): void {
        if (this._listViewModel) {
            this._dragEnter(this._getDragObject());
        }

        if (!this._pagingVisible) {
            _private.initPaging(this);
        }
    }

    protected _mouseOver(event): void {
        // mouseenter не срабатывает на списке, если мышка была расположена над списком до его маунта
        // mouseover срабатывает. mouseenter починили в React 18
        this._indicatorsController?.initializeIndicators();
    }

    protected _mouseLeave(): void {
        if (this._listViewModel) {
            this._dragLeave();
        }
    }

    /**
     * Подписка на событие mouseMove внутри всего списка, а не только внутри item
     * @param event
     * @private
     */
    protected _onListMouseMove(event: SyntheticEvent): void {
        // Стопаем событие. Всё, что ниже актуально только для desktop платформ.
        if (detection.isMobilePlatform) {
            event.stopPropagation();
            return;
        }
        // Активируем операции над записью по ховеру.
        // isMobilePlatform использовать для проверки не целесообразно, т.к. на интерфейсах с
        // touch режимом isMobilePlatform может быть false
        // В тач режиме itemActions создаются непосредственно при свайпе
        if (!TouchDetect.getInstance().isTouch() && !_private.isEditing(this)) {
            _private.updateItemActionsOnce(this, this._options);
        }
        // Использовать itemMouseMove тут нельзя, т.к. отслеживать перемещение мышки надо вне itemsContainer
        if (_private.hasHoverFreezeController(this) && _private.isAllowedHoverFreeze(this)) {
            this._hoverFreezeController.restartUnfreezeHoverTimeout(event);
        }
        // Для случая, когда на ZinFrame посвайпали а потом взяли мышь
        if (this._itemActionsController?.isSwiped()) {
            this._itemActionsController.deactivateSwipe();
        }
    }

    // endregion BaseControlContainerEvents

    __pagingChangePage(event: Event, page: number): void {
        this._currentPage = page;
        this._applyPagingNavigationState({ page: this._currentPage });
    }

    _changePageSize(e: Event, key: number): void {
        this._currentPageSize = PAGE_SIZE_ARRAY[key - 1].pageSize;
        this._currentPage = 1;
        this._applyPagingNavigationState({ pageSize: this._currentPageSize });
    }

    /**
     * Хандлер клика на Tag в BaseControl.wml
     * @private
     */
    protected _onTagClickHandler(
        event: Event,
        item: CollectionItem<Model>,
        columnIndex: number = 0
    ): void {
        // Индекс колонки считается тут с учётом множественного выбора. Но прикладникам нужен реальный номер колонки.
        const checkboxShift = +this._hasMultiSelect();
        this._options.notifyCallback('tagClick', [
            item?.getContents(),
            columnIndex - checkboxShift,
            event,
        ]);
    }

    /**
     * Хандлер наведения на Tag в BaseControl.wml
     * @private
     */
    protected _onTagHoverHandler(
        event: Event,
        item: CollectionItem<Model>,
        columnIndex: number = 0
    ): void {
        // Индекс колонки считается тут с учётом множественного выбора. Но прикладникам нужен реальный номер колонки.
        const checkboxShift = +this._hasMultiSelect();
        this._options.notifyCallback('tagHover', [
            item?.getContents(),
            columnIndex - checkboxShift,
            event,
        ]);
    }

    _applyPagingNavigationState(params): void {
        const newNavigation = cClone(this._options.navigation);
        if (params.pageSize) {
            newNavigation.sourceConfig.pageSize = params.pageSize;
            newNavigation.sourceConfig.page = this._currentPage - 1;
        }
        if (params.page) {
            newNavigation.sourceConfig.page = params.page - 1;
            newNavigation.sourceConfig.pageSize = this._currentPageSize;
        }

        const updateData = () => {
            this._sourceController.setNavigation(newNavigation);
            this._updatePagingOnResetItems = false;
            return this._reload(this._options);
        };

        if (_private.isEditing(this)) {
            this._cancelEdit().then((result) => {
                return !(result && result.canceled) ? updateData() : result;
            });
        } else {
            return updateData();
        }
    }

    protected _getSourceControllerOptionsForGetDraggedItems(
        selection: ISelectionObject
    ): ISourceControllerOptions {
        const options: ISourceControllerOptions = { ...this._options };
        options.dataLoadCallback = null;
        options.dataLoadErrback = null;
        options.navigationParamsChangedCallback = null;

        const newFilter = cClone(options.filter) || {};
        newFilter.selection = selectionToRecordUtil(
            {
                selected: selection.selected,
                excluded: selection.excluded,
            },
            'adapter.sbis',
            this._options.selectionType,
            selection.recursive !== false
        );
        options.filter = newFilter;

        if (options.navigation) {
            const newNavigation = cClone(options.navigation);
            // Ограничиваем получение перемещаемых записей до 100 (максимум в D&D пишется "99+ записей"), в дальнейшем
            // количество записей будет отдавать selectionController
            // https://online.sbis.ru/opendoc.html?guid=b93db75c-6101-4eed-8625-5ec86657080e
            if (newNavigation.source === 'position') {
                newNavigation.sourceConfig.limit = LIMIT_DRAG_SELECTION;
            } else if (newNavigation.source === 'page') {
                newNavigation.sourceConfig.pageSize = LIMIT_DRAG_SELECTION;
            }
            options.navigation = newNavigation;
        }

        // Удалим текущие items иначе SourceController их запомнит и будет модифицировать
        delete options.items;
        // Не нужно отдавать selection, т.к. он нужен только для подсчета ENTRY_PATH - для днд это лишнее
        // И фильтр selection+entries может вызывать ошибки на сервере
        delete options.selectedKeys;
        delete options.excludedKeys;

        return options;
    }

    /**
     * Обработчик скролла, вызываемый при помощи регистратора событий по событию в ScrollContainer
     * @param event
     * @param scrollEvent
     * @param initiator
     * @private
     */
    _scrollHandler(event: Event, scrollEvent: Event, initiator: string): void {
        // Код ниже взят из Controls\_popup\Opener\Sticky.ts
        // Из-за флага listenAll на listener'e, подписка доходит до application'a всегда.
        // На ios при показе клавиатуры стреляет событие скролла, что приводит к вызову текущего обработчика
        // и закрытию окна. Для ios отключаю реакцию на скролл, событие скролла стрельнуло на body.
        if (
            detection.isMobileIOS &&
            (scrollEvent.target === document.body || scrollEvent.target === document)
        ) {
            return;
        }
        if (_private.hasHoverFreezeController(this) && _private.isAllowedHoverFreeze(this)) {
            this._hoverFreezeController.unfreezeHover();
        }
        _private.closeActionsMenu(this);
    }

    /**
     * Обработчик свайпа по записи. Показывает операции по свайпу
     * @param e
     * @param item
     * @param swipeEvent
     * @private
     */

    _onItemSwipe(e: SyntheticEvent<Event>, item: CollectionItem<Model>, swipeEvent): void {
        if (!item.SupportItemActions || item['[Controls/_display/GroupItem]'] || this.isEditing()) {
            return;
        }
        let direction = swipeEvent.nativeEvent.direction;
        const directionSwitchMap = {
            left: 'right',
            right: 'left',
        };
        if (
            directionSwitchMap[direction] &&
            localeController.currentLocaleConfig.directionality === 'rtl'
        ) {
            direction = directionSwitchMap[direction];
        }
        const key = getPlainItemContents(item).getKey();
        const itemContainer = (swipeEvent.target as HTMLElement).closest(
            '.controls-ListView__itemV'
        );
        const swipeContainer = ItemActionsController.getSwipeContainerSize(
            itemContainer as HTMLElement,
            LIST_MEASURABLE_CONTAINER_SELECTOR
        );
        let itemActionsController: ItemActionsController;
        if (this._isActionsMenuOpened) {
            _private.closeActionsMenu(this);
        }
        const eventResult = this._options.notifyCallback('itemSwipe', [
            getPlainItemContents(item),
            swipeEvent,
            swipeContainer?.clientHeight,
        ]);
        if (eventResult === false) {
            return;
        }
        if (direction === 'left') {
            this._options.mark(key, this, this._options);
            _private.updateItemActionsOnce(this, this._options);
            itemActionsController = this._getItemActionsController();
            if (itemActionsController) {
                swipeEvent.stopPropagation();
                itemActionsController.activateSwipe(
                    key,
                    swipeContainer?.width,
                    swipeContainer?.height
                );
            }
        }
        if (direction === 'right') {
            // Тут не надо инициализировать контроллер, если он не проинициализирован
            const swipedItem = this._itemActionsController?.getSwipeItem();
            if (swipedItem) {
                swipeEvent.stopPropagation();
                this._itemActionsController.startSwipeCloseAnimation();
                this._listViewModel.nextVersion();

                // Для сценария, когда свайпнули одну запись и потом свайпнули вправо другую запись
                if (swipedItem !== item) {
                    this._options.mark(key, this, this._options);
                }
            } else {
                // After the right swipe the item should get selected.
                if (this._options.multiSelectVisibility !== 'hidden') {
                    swipeEvent.stopPropagation();
                    this._options.notifyCallback('checkBoxClick', [key, item.isSelected()]);
                    const selectionController = this._getSelectionController();
                    const newSelection = selectionController.toggleItem(key);
                    this._changeSelection(newSelection);
                    selectionController.startItemAnimation(key);
                }
                this._options.mark(key, this, this._options);
            }
        }
    }

    _updateItemActionsOnItem(
        event: SyntheticEvent<Event>,
        itemKey: string | number,
        itemWidth: number
    ): void {
        event.stopPropagation();
        // Если в модели поменялся набор записей до перерисовки контрола, не нужно обрабатывать событие
        if (this._itemActionsController?.isActionsAssigned() && !this._itemsChanged) {
            const itemActionsController = this._getItemActionsController();
            itemActionsController.updateItemActions(itemKey, itemWidth);
        }
    }

    /**
     * Обработчик, выполняемый после окончания анимации свайпа по опциям записи
     * @param e
     * @private
     */
    _onActionsSwipeAnimationEnd(e: SyntheticEvent<IAnimationEvent>): void {
        if (e.nativeEvent.animationName === 'itemActionsSwipeClose') {
            const itemActionsController = this._getItemActionsController();
            const item = itemActionsController.getSwipeItem();
            if (item) {
                if (!this._options.itemActions) {
                    this._options.notifyCallback('itemSwipe', [item, e]);
                }
                itemActionsController.deactivateSwipe();
            }
        }
    }

    /**
     * Обработчик, выполняемый после окончания анимации свайпа вправо по записи
     * @param e
     * @private
     */
    _onItemSwipeAnimationEnd(e: SyntheticEvent<IAnimationEvent>): void {
        if (this._hasSelectionController() && e.nativeEvent.animationName === 'rightSwipe') {
            this._getSelectionController().stopItemAnimation();
        }
    }

    protected _createNewModel(
        items: RecordSet,
        modelConfig: ICollectionOptions,
        modelName: string,
        columnsWidths: string[]
    ): Collection {
        const clearModelOptions = this._getModelOptions(modelConfig as unknown as TOptions);

        // TODO: Тут должно быть только { ...clearModelOptions, collection: items },
        //  никаких скоупов быть не должно, опции должны формироваться чисто.
        const modelComposedConfig = {
            ...modelConfig,
            ...clearModelOptions,
            markedKey:
                modelConfig.markerVisibility !== 'hidden' ? modelConfig.markedKey : undefined,
            collection: items,
            emptyTemplateOptions: {
                ...clearModelOptions.emptyTemplateOptions,
                items,
            },
            columnsWidths,
        };

        return diCreate(modelName, modelComposedConfig);
    }

    protected _logCollectionError(errorText: string): void {
        let logText = `Controls/list: корректная работа списка не возможна. ${errorText}`;

        if (this._sourceController) {
            const source = this._sourceController.getSource();

            // В source может быть prefetch, который в getOriginal вернет тоже prefetch или вообще memory,
            // до endpoint добраться сложно и не всегда можно.
            if (source && source.getEndpoint && source.getBinding) {
                logText += ` listMethod="${source.getEndpoint().contract}.${
                    source.getBinding().query
                }";`;
            }
        }

        if (this._keyProperty) {
            logText += ` keyProperty="${this._keyProperty}";`;
        }

        Logger.error(logText, this);
    }

    protected _getModelOptions(baseControlOptions: TOptions): ICollectionOptions {
        return {
            keyProperty: this._keyProperty,
            unique: true,
            // Валидируем ключи только для курсорной навигации. Для постраничной не обеспечить уникальность ключа в
            // принципе, остается надеяться на чудо, если появляется ошибка связанная с ключами - будем переводить на
            // курсорную навигацию
            // сделано по https://online.sbis.ru/opendoc.html?guid=064a6f39-fce7-4e3c-8ee5-63ee5659b01c&client=3
            validateUnique: baseControlOptions.navigation?.source === 'position',
            logError: this._logCollectionError,
            directionality: localeController.currentLocaleConfig.directionality,
            emptyTemplateOptions: {
                ...baseControlOptions.emptyTemplateOptions,
                filter: baseControlOptions.filter,
            },
            hasMoreData: _private.getHasMoreData(this),
            // Если навигация по скролу то для дерева нужно скрывать кнопку "Ещё" для узла являющегося
            // последней записью коллекции. Т.к. в этом случае подгрузка осуществляется по скролу.
            // На самом деле условие показа кнопки более сложное, но здесь нам нужно на преобразовать
            // информацию о навигации в информацию о режиме отображения кнопки, т.к. коллекция про навигацию
            // знать не должна
            moreButtonVisibility: _private.isInfinityNavigation(baseControlOptions.navigation)
                ? MoreButtonVisibility.exceptLastNode
                : MoreButtonVisibility.visible,
            portionedSearchTemplate: baseControlOptions.iterativeLoadingTemplate,
            resizerOffsetCallback: this._onResizerOffsetChanged.bind(this),
            multiSelectVisibility: this._resolveMultiSelectVisibility(
                baseControlOptions.multiSelectVisibility
            ),
        };
    }

    private _updateSourceController(
        oldController?: SourceController,
        newController?: SourceController
    ): void {
        if (oldController === newController && newController === this._sourceController) {
            return;
        }
        if (oldController) {
            this._unsubscribeFromSourceController(oldController);
        }
        if (newController) {
            this._subscribeOnSourceController(newController);
        }
        this._sourceController = newController;
    }

    private _bindSourceControllerHandlers(): void {
        this._dataLoadCallback = this._dataLoadCallback.bind(this);
        this._dataLoadStartedCallback = this._dataLoadStartedCallback.bind(this);
        this._dataLoadCancelCallback = this._dataLoadCancelCallback.bind(this);
        this._itemsChangedOnDataLoad = this._itemsChangedOnDataLoad.bind(this);
    }

    private _subscribeOnSourceController(controller: SourceController): void {
        controller.subscribe('dataLoad', this._dataLoadCallback);
        controller.subscribe('itemsChanged', this._itemsChangedOnDataLoad);
        controller.subscribe('dataLoadStarted', this._dataLoadStartedCallback);
        controller.subscribe('dataLoadCancel', this._dataLoadCancelCallback);
    }

    private _unsubscribeFromSourceController(controller: SourceController): void {
        controller.unsubscribe('dataLoad', this._dataLoadCallback);
        controller.unsubscribe('itemsChanged', this._itemsChangedOnDataLoad);
        controller.unsubscribe('dataLoadStarted', this._dataLoadStartedCallback);
        controller.unsubscribe('dataLoadCancel', this._dataLoadCancelCallback);
    }

    /**
     * Для мобильных устройств при multiSelectVisibility=onhover
     * нужно скрывать MultiSelect и место под него до первого свайпа.
     * При наличии выделенных записей место под чекбокс определяется значением multiSelectVisibility.
     * @param multiSelectVisibility
     * @private
     */
    private _resolveMultiSelectVisibility(multiSelectVisibility: string): string {
        let result = multiSelectVisibility;
        const hasSelected = this._selectionController?.getSelection()?.selected?.length;
        if (!hasSelected && detection.isMobilePlatform && multiSelectVisibility === 'onhover') {
            result = 'hidden';
        } else if (hasSelected && detection.isMobilePlatform) {
            result = 'visible';
        }
        return result;
    }

    private _hasMultiSelect(): boolean {
        return (
            this._listViewModel.getMultiSelectVisibility() !== 'hidden' &&
            this._listViewModel.getMultiSelectPosition() !== 'custom'
        );
    }

    _stopBubblingEvent(event: SyntheticEvent<Event>): void {
        // В некоторых кейсах (например ScrollViewer) внутри списков могут находиться
        // другие списки, которые также будут нотифицировать события управления скроллом и тенью
        // Необходимо их останавливать, чтобы скроллом управлял только самый верхний список

        // Можно избавиться от этой опции, если не использовать в scrollViewer BaseControl,
        // а создать для этого самостоятельный контрол.
        // Задача: https://online.sbis.ru/opendoc.html?guid=5bafceb4-b19b-4e72-ace0-c42d713ed083
        if (!this._options.passBubblingEvents) {
            event.stopPropagation();
        }
    }

    // Уйдет когда будем наследоваться от baseControl
    getItemsContainer(): HTMLElement {
        return this._getItemsContainer?.();
    }

    protected _itemsContainerReadyHandler(itemsContainerGetter: () => HTMLElement): void {
        this._getItemsContainer = itemsContainerGetter;
        // Нельзя до маунта сетать listContainer, т.к. это спровоцирует вызов триггера до маунта.
        // Нужно обновлять listContainer, т.к. вместе с items могут перерисоваться и триггеры.
        // TODO SCROLL если доработать обсерверы, чтобы они работали по циклам синхронизаци. То можно оставить
        //  одну точку входа для setListContainer и убрать здесь проверку
        if (this._isMounted) {
            this._listVirtualScrollController.setListContainer(this._container);
        }
        this._listVirtualScrollController.setItemsContainer(this._getItemsContainer());
    }

    /**
     * Вызывает деактивацию свайпа когда список теряет фокус
     * @private
     */
    protected _onListDeactivated(): void {
        if (!this._isActionsMenuOpened) {
            _private.closeSwipe(this);
        }
    }

    _onCloseSwipe(): void {
        if (!this._isActionsMenuOpened) {
            _private.closeSwipe(this);
        }
    }

    _registerObserver(): void {
        if (this._children.scrollObserver && !this._observerRegistered && this._listViewModel) {
            this._children.scrollObserver.startRegister([this._children.scrollObserver]);
            this._observerRegistered = true;
        }
    }

    _observeScrollHandler(
        _: SyntheticEvent<Event>,
        eventName: string,
        params: IScrollParams
    ): void {
        if (
            _private.needScrollCalculation(
                this._options.navigation,
                this._options.virtualScrollConfig
            )
        ) {
            switch (eventName) {
                case 'virtualScrollMove':
                    // Если размер списка меньше вьюпорта, то он точно не может иметь виртуальный скролл.
                    // Так как либо скролла нет, либо маленький список - не основной контент в этом скролле.
                    if (this._viewportHeight < this._contentHeight) {
                        _private.throttledVirtualScrollPositionChanged(this, params);
                    }
                    break;
                case 'canScroll':
                    _private.onScrollShow(this, params);
                    break;
                case 'cantScroll':
                    _private.onScrollHide(this);
                    break;
            }
        }
        switch (eventName) {
            case 'scrollMove':
                _private.handleListScroll(this, params);
                if (
                    this._options.trackedProperties?.length &&
                    this._scrollTop !== params.scrollTop
                ) {
                    this._throttledUpdateTrackedValue();
                }
                break;
            case 'scrollMoveSync':
                this._listVirtualScrollController.scrollPositionChange(params.scrollTop);
                _private.handleListScrollSync(this, params.scrollTop);
                break;
            case 'horizontalScrollMoveSync':
                if (this._options.orientation === 'horizontal') {
                    this._listVirtualScrollController.scrollPositionChange(params.scrollLeft);
                    _private.handleListScrollSync(this, params.scrollLeft);
                }
                break;
            case 'horizontalViewportResize':
            case 'viewportResize':
                // размеры вью порта нужно знать всегда, независимо от navigation,
                // т.к. по ним рисуется глобальная ромашка
                this._viewportResizeHandler(params);
                break;
            case 'scrollResize':
                this._scrollResizeHandler(params.scrollHeight);
                break;
            case 'stickyFixed':
                this._listVirtualScrollController.stickyFixedChanged();
                break;
        }
    }

    // region Indicators

    private _createIndicatorsController(options: IBaseControlOptions): void {
        this._indicatorsController = new IndicatorsController(
            this._getIndicatorsControllerOptions(options)
        );
    }

    private _updateIndicatorsController(
        newOptions?: IBaseControlOptions,
        isLoading: boolean = false
    ): void {
        const options = newOptions || this._options;
        const controllerOptions = this._getIndicatorsControllerOptions(options);
        this._indicatorsController.updateOptions(controllerOptions, isLoading);
    }

    private _getIndicatorsControllerOptions(
        options: IBaseControlOptions
    ): IIndicatorsControllerOptions {
        const stopDisplayPortionedSearchCallback = () => {
            if (typeof this._sourceController.cancelLoading !== 'undefined') {
                this._sourceController.cancelLoading();
            }

            if (this._indicatorsController.shouldDisplayTopIndicator()) {
                this._indicatorsController.displayTopIndicator(true);
            }

            if (this._isScrollShown) {
                _private.updateShadowMode(this, this._shadowVisibility);
            }
        };

        let pageSize = options.iterativeLoadPageSize;
        if (
            !options.iterativeLoadPageSize &&
            options.navigation?.sourceConfig &&
            (options.navigation.source === 'position' || options.navigation.source === 'page')
        ) {
            pageSize =
                options.navigation.source === 'position'
                    ? options.navigation.sourceConfig.limit
                    : options.navigation.sourceConfig.pageSize;
        }

        return {
            model: this._listViewModel,
            items: this._items,
            isInfinityNavigation: _private.isInfinityNavigation(options.navigation),
            isMaxCountNavigation: _private.isMaxCountNavigation(options.navigation),
            hasMoreDataToTop: this._hasMoreData('up'),
            hasMoreDataToBottom: this._hasMoreData('down'),
            shouldShowEmptyTemplate: this.__needShowEmptyTemplate(options),
            scrollToFirstItem: this._scrollToFirstItemAfterDisplayTopIndicator,
            displayBackwardTrigger: () =>
                this._listVirtualScrollController.setBackwardTriggerVisibility(true),
            hasHiddenItemsByVirtualScroll: this._hasHiddenItemsByVirtualScroll,
            hasError: () => {
                return !!this._sourceController?.getLoadError();
            },
            attachLoadTopTriggerToNull: !!options.attachLoadTopTriggerToNull,
            attachLoadDownTriggerToNull: !!options.attachLoadDownTriggerToNull,
            supportIterativeLoading: options.iterativeLoading,
            iterativeLoadTimeout: options.iterativeLoadTimeout,
            isIterativeLoading: _private.isPortionedLoad(this),
            stopDisplayPortionedSearchCallback,
            feature1184208466: this._options.feature1184208466,
            iterativeLoadPageSize: pageSize,
        };
    }

    private _updateViewportFilledInIndicatorsController(): void {
        let viewportFilled;

        // viewportSize и viewSize обновляются не одновременно. Чтобы корректно посчитать viewportFilled,
        // дожидаемся когда оба значения есть.
        if (!this._viewportHeight || !this._contentHeight) {
            viewportFilled = false;
        } else {
            const container =
                this._children?.viewContainer || this._container[0] || this._container;
            // Не учитываем высоту индикаторов порционного поиска по viewSize.
            // Т.к. они стикаются и при остановке поиска скрываются.
            // То есть если эти индикаторы учитывается во viewSize,
            // то после остановки поиска останется свободное место во вьюпорте.
            const portionedSearchIndicators =
                (container.querySelectorAll &&
                    container.querySelectorAll('.controls-BaseControl__portionedSearch')) ||
                [];
            let portionedSearchIndicatorsHeight = 0;
            Array.from(portionedSearchIndicators).forEach((it) => {
                portionedSearchIndicatorsHeight += it.clientHeight;
            });

            viewportFilled =
                this._contentHeight - portionedSearchIndicatorsHeight > this._viewportHeight;
        }

        this._indicatorsController?.setViewportFilled(viewportFilled);
    }

    private _destroyIndicatorsController(): void {
        this._indicatorsController.destroy();
        this._indicatorsController = null;
    }

    private _getIndicatorDomElement(direction: 'top' | 'bottom'): HTMLElement {
        return direction === 'top'
            ? this._children.listView?.getTopIndicator?.()
            : this._children.listView?.getBottomIndicator?.();
    }

    private _countGlobalIndicatorPosition(): number {
        const stickyHeadersSize =
            this._container && this._scrollTop !== 0
                ? getStickyHeadersHeight(this._container, 'top', 'allFixed') || 0
                : 0;
        const viewportSize =
            !!this._viewportHeight && this._viewportHeight < this._contentHeight
                ? this._viewportHeight - stickyHeadersSize
                : this._contentHeight;
        return Math.max(this._scrollTop + viewportSize / 2 - INDICATOR_HEIGHT / 2, 0);
    }

    protected _displayGlobalIndicator(): void {
        if (this._indicatorsController.shouldDisplayGlobalIndicator()) {
            this._indicatorsController.displayGlobalIndicator(this._countGlobalIndicatorPosition());
        }
    }

    private _hasHiddenItemsByVirtualScroll(direction: 'up' | 'down'): boolean {
        const compatibleDirection = direction === 'up' ? 'backward' : 'forward';
        return this._hasItemsOutRange && this._hasItemsOutRange[compatibleDirection];
    }

    private _scrollToFirstItemAfterDisplayTopIndicator(onDrawItems: boolean = false): void {
        const scrollAndShowTrigger = () => {
            if (this._scrollToItemAfterReloadParams) {
                const { key, position, force, resolveScroll } = this._scrollToItemAfterReloadParams;
                this._scrollToItemAfterReloadParams = null;
                this._listVirtualScrollController.scrollToItem(key, position, force).then(() => {
                    this._listVirtualScrollController.setBackwardTriggerVisibility(true);
                    resolveScroll();
                });
            } else {
                if (this._scrollTop) {
                    // если уже список проскроллен, то не нужно скроллить к первому элементу
                    this._listVirtualScrollController.setBackwardTriggerVisibility(true);
                } else {
                    // На айпаде за время таймера инерционного скролла индикатор может успеть отрисоваться,
                    // а скролл к нему отработает с задержкой и от этого будет прыжок.
                    const scrollResult = this._scrollToFirstItem(false);
                    scrollResult.then(() => {
                        this._listVirtualScrollController.setBackwardTriggerVisibility(true);
                    });
                }
            }
        };

        // Скроллить нужно после того как ромашка отрисуется, то есть на _afterRender
        // Можем индикатор показать после подгрузки, которая вернула 0 записей и _doAfterDrawItems не сработает
        if (onDrawItems && this._itemsChanged) {
            this._doAfterDrawItems = () => {
                scrollAndShowTrigger();
            };
        } else {
            this._scrollToFirstItemAfterDisplayTopIndicatorAfterRender = scrollAndShowTrigger;
        }
    }

    private _scrollToFirstItem(waitInertialScroll?: boolean): Promise<void> {
        // При наличии асинхронных записей, ромашка может появляться не только перед самой первой записью,
        // но и перед первой в диапазоне
        const firstItem = this._options.feature1184208466
            ? this._listViewModel.at(this._listViewModel.getStartIndex())
            : this._listViewModel.getFirst();
        const firstItemKey = firstItem && firstItem.key !== undefined ? firstItem.key : null;
        if (
            firstItemKey !== null &&
            !this._listVirtualScrollController.isScrollToItemInProgress()
        ) {
            return _private.scrollToItem(
                this,
                firstItemKey,
                'top',
                true,
                false,
                waitInertialScroll
            );
        }
        return Promise.resolve();
    }

    protected _onContinueSearchClick(): void {
        const direction = this._indicatorsController.getPortionedSearchDirection();
        this._indicatorsController.startDisplayPortionedSearch(
            DIRECTION_COMPATIBILITY[direction] as 'top' | 'bottom'
        );
        _private.loadToDirectionIfNeed(this, direction);
    }

    protected _onAbortSearchClick(): void {
        this._abortPortionedLoading();
    }

    // endregion Indicators

    private _abortPortionedLoading(): void {
        this._indicatorsController.abortDisplayPortionedSearch();
        if (typeof this._sourceController.cancelLoading !== 'undefined') {
            this._sourceController.cancelLoading();
        }

        if (this._isScrollShown) {
            _private.updateShadowMode(this, this._shadowVisibility);
        }
        this._options.notifyCallback('iterativeSearchAborted');
    }

    _isPagingPaddingFromOptions(): boolean {
        return (
            this._options.navigation &&
            this._options.navigation.viewConfig &&
            !(
                this._options.navigation.viewConfig.pagingMode === 'end' ||
                this._options.navigation.viewConfig.pagingPadding === 'null' ||
                this._options.navigation.viewConfig.pagingPadding === null
            )
        );
    }

    /**
     * Говорим контролу сверху, что тач уже обработан этим контролом,
     * помечая событие тача как обработанное
     * @param event
     */
    _touchStartHandler(event: SyntheticEvent): void {
        event.nativeEvent.processed = true;
    }

    _isPagingPadding(): boolean {
        return (
            this._isPagingPaddingFromOptions() &&
            (this._bottomVisible || !!this._indicatorsController.getPortionedSearchDirection())
        );
    }

    _doAfterPagingModuleLoaded(cb: () => void, options): void {
        const pagingDeps = [];

        if (!isLoaded('Controls/paging')) {
            pagingDeps.push(import('Controls/paging'));
        }

        if (options.navigation?.viewConfig?.totalInfo && !isLoaded('Controls/dropdown')) {
            pagingDeps.push(import('Controls/dropdown'));
        }

        Promise.all(pagingDeps).then(() => {
            return cb();
        });
    }

    // region Drag-N-Drop

    protected _createDndListController(
        model: Collection,
        draggableItem: CollectionItem
    ): DndController<IDragStrategyParams> {
        let strategy;
        if (this._options.parentProperty) {
            strategy = TreeStrategy;
        } else {
            strategy = FlatStrategy;
        }
        return new DndController(this._listViewModel, draggableItem, strategy);
    }

    protected _getDndListController(): DndController {
        return this._dndListController;
    }

    private _documentDragStart(dragObject: IDragObject): void {
        if (
            this._options.readOnly ||
            !this._options.itemsDragNDrop ||
            !(dragObject && dragObject.entity)
        ) {
            return;
        }
        this._documentDragging = true;

        // dragStart должен вызываться в том списке, в котором он начался.
        // draggedKey запоминается имеено на таком списке.
        // Возможна ситуация: событие _documentDragStart бросается из стартового списка, а после того как
        // событие долетает до всех списков мышка находится уже в другом списке.
        // (1-ый список insideDragging=false, 2-ой список insideDragging=true)
        // Из-за этого пытаемся начать днд не в том списке.
        if (this._draggedKey !== null) {
            this._dragStart(dragObject, this._draggedKey);
        } else {
            this._dragEntity = dragObject.entity;

            // Возможна такая ситуация:
            // Потащили резко записи, так что мышка сразу оказалось на соседнем списке.
            // Из-за этого _documentDragStart сработает после mouseEnter на соседнем списке.
            // Поэтому если в _documentDragStart мы уже наведены на другой список,
            // то нужно инициализировать в нем днд по необходимости
            if (this._insideDragging) {
                this._dragEnter(dragObject);
            }
        }
    }

    private _dragStart(dragObject: IDragObject, draggedKey: CrudEntityKey): void {
        this._beforeStartDrag(draggedKey);

        if (_private.hasHoverFreezeController(this)) {
            this._hoverFreezeController.unfreezeHover();
        }

        this._dndListController.startDrag(dragObject.entity);

        // Показываем плашку, если утащили мышь за пределы списка, до
        // того как выполнился запрос за перетаскиваемыми записями
        if (this._shouldDisplayDraggingTemplate()) {
            this._options.notifyCallback(
                '_updateDraggingTemplate',
                [dragObject, this._options.draggingTemplate],
                { bubbling: true }
            );
        }
    }

    protected _beforeStartDrag(draggedKey: CrudEntityKey): void {
        // переопределяем в TreeControl
    }

    private _dragLeave(): void {
        this._insideDragging = false;
        // Это функция срабатывает при перетаскивании скролла, поэтому проверяем _dndListController
        if (
            this._dndListController &&
            this._dndListController.isDragging() &&
            this._documentDragging
        ) {
            // Если днд начали в другом списком, то после уведения мышки с этого списка нужно завершить днд
            // В списке, в котором начали днд, нужно сбросить позицию записи на изначальную
            if (this._dndListController.isDragStartedFromAnotherList()) {
                this._dndListController.endDrag();
            } else {
                const newPosition = this._dndListController.calculateDragPosition({
                    targetItem: null,
                    mouseOffsetInTargetItem: null,
                });
                this._dndListController.setDragPosition(newPosition);
            }
        }
        const hasSorting = this._options.sorting && this._options.sorting.length;
        if (!hasSorting) {
            this._listViewModel.setDragOutsideList(true);
        }
    }

    private _dragEnter(dragObject: IDragObject): void {
        this._insideDragging = true;
        const hasSorting = this._options.sorting && this._options.sorting.length;
        if (!hasSorting) {
            this._listViewModel.setDragOutsideList(false);
            if (this._documentDragging && !this._shouldDisplayDraggingTemplate()) {
                this._options.notifyCallback('_removeDraggingTemplate', [], {
                    bubbling: true,
                });
            }
        }

        // Не нужно начинать dnd, если и так идет процесс dnd
        if (this._dndListController?.isDragging()) {
            return;
        }

        if (this._documentDragging) {
            if (
                dragObject &&
                cInstance.instanceOfModule(dragObject.entity, 'Controls/dragnDrop:ItemsEntity')
            ) {
                const dragEnterResult = this._options.notifyCallback('customdragEnter', [
                    dragObject.entity,
                ]);

                if (cInstance.instanceOfModule(dragEnterResult, 'Types/entity:Record')) {
                    // Создаем перетаскиваемый элемент, т.к. в другом списке его нет.
                    const draggableItem = this._listViewModel.createItem({
                        contents: dragEnterResult,
                    });
                    // Считаем изначальную позицию записи. Нужно считать обязательно до ::startDrag,
                    // т.к. после перетаскиваемая запись уже будет в коллекции
                    let startPosition;
                    if (this._listViewModel.getCount()) {
                        startPosition = {
                            index: this._listViewModel.getCount(),
                            dispItem: this._listViewModel.getLast(),
                            position: 'after',
                        };
                    } else {
                        startPosition = {
                            index: 0,
                            dispItem: draggableItem,
                            position: 'before',
                        };
                    }

                    // если мы утащим в другой список, то в нем нужно создать контроллер
                    this._dndListController = this._createDndListController(
                        this._listViewModel,
                        draggableItem
                    );
                    this._dndListController.startDrag(dragObject.entity, true);

                    // задаем изначальную позицию в другом списке
                    this._dndListController.setDragPosition(startPosition);
                } else if (dragEnterResult === true) {
                    this._dndListController = this._createDndListController(
                        this._listViewModel,
                        null
                    );
                    this._dndListController.startDrag(dragObject.entity, true);
                }
            }
        }
    }

    protected _notifyDragEnd(
        dragObject: IDragObject,
        targetPosition: IDragPosition<CollectionItem>
    ): Promise<void> | void {
        return this._options.notifyCallback('customdragEnd', [
            dragObject.entity,
            targetPosition.dispItem.getContents(),
            targetPosition.position,
        ]) as Promise<void> | void;
    }

    private _documentDragEnd(dragObject: IDragObject): void {
        // Флаг _documentDragging проставляется во всех списках, он говорит что где-то началось перетаскивание записи
        // и при mouseEnter возможно придется начать днд. Поэтому сбрасываем флаг не зависимо от isDragging
        this._documentDragging = false;

        // событие documentDragEnd может долететь до списка, в котором нет модели
        if (
            !this._listViewModel ||
            !this._dndListController ||
            !this._dndListController.isDragging()
        ) {
            return;
        }

        if (this._insideDragging && this._dndListController) {
            const targetPosition = this._dndListController.getDragPosition();
            const changeDragTarget = this._dndListController.getChangeDragTargetResult();
            if (
                targetPosition &&
                targetPosition.dispItem &&
                targetPosition.position &&
                changeDragTarget !== false
            ) {
                const result = this._notifyDragEnd(dragObject, targetPosition);
                this._dndListController.setDragEndPromise(result);
            }

            // После окончания DnD, не нужно показывать операции, до тех пор, пока не пошевелим мышкой.
            // Задача: https://online.sbis.ru/opendoc.html?guid=9877eb93-2c15-4188-8a2d-bab173a76eb0
            _private.removeShowActionsClass(this);
        }

        const endDrag = (): void => {
            const targetPosition = this._dndListController.getDragPosition();
            const draggableItem = this._dndListController.getDraggableItem();
            this._dndListController.endDrag();

            // перемещаем маркер только если dragEnd сработал в списке в который перетаскивают
            if (
                this._options.markerVisibility !== 'hidden' &&
                targetPosition &&
                draggableItem &&
                this._insideDragging
            ) {
                const moveToCollapsedNode =
                    targetPosition.position === 'on' &&
                    targetPosition.dispItem['[Controls/_display/TreeItem]'] &&
                    !targetPosition.dispItem.isExpanded();
                // Ставим маркер на перетаксиваемый элемент всегда, за исключением ситуации
                // когда перетаскиваем запись в свернутый узел
                if (!moveToCollapsedNode) {
                    const draggedKey = draggableItem.getContents().getKey();
                    this._options.mark(draggedKey, this, this._options);
                }
            }

            // данное поведение сейчас актуально только для дерева или когда перетаскиваем в другой список
            if (
                this._hasSelectionController() &&
                (this._options.parentProperty || !this._insideDragging)
            ) {
                this._changeSelection({ selected: [], excluded: [] });
            }

            this._dndListController = null;
            this._insideDragging = false;
        };

        // Это функция срабатывает при перетаскивании скролла, поэтому проверяем _dndListController
        // endDrag нужно вызывать только после события dragEnd,
        // чтобы не было прыжков в списке, если асинхронно меняют порядок элементов
        if (this._dndListController) {
            if (this._dndListController.getDragEndPromise() instanceof Promise) {
                this._displayGlobalIndicator();
                this._dndListController.getDragEndPromise().finally(() => {
                    endDrag();
                    if (this._indicatorsController.shouldHideGlobalIndicator()) {
                        this._indicatorsController.hideGlobalIndicator();
                    }
                });
            } else {
                endDrag();
            }
        }

        this._listViewModel.setDragOutsideList(false);
    }

    private _getDragObject(mouseEvent?: MouseEvent, startEvent?): IDragObject {
        const result: IDragObject = {
            entity: this._dragEntity,
        };
        if (mouseEvent && startEvent) {
            result.domEvent = mouseEvent;
            result.position = _private.getPageXY(mouseEvent);
            result.offset = _private.getDragOffset(mouseEvent, startEvent);
            result.draggingTemplateOffset = DRAGGING_OFFSET;
        }
        return result;
    }

    private _dragNDropEnded(event: SyntheticEvent): void {
        // https://online.sbis.ru/opendoc.html?guid=81679655-1bde-4817-a7d6-b177242c00e8
        if (this._destroyed) {
            return;
        }

        if (this._dndListController && this._dndListController.isDragging()) {
            const dragObject = this._getDragObject(event.nativeEvent, this._startEvent);
            this._options.notifyCallback('_documentDragEnd', [dragObject], {
                bubbling: true,
            });
        }
        if (this._startEvent && this._startEvent.target) {
            this._startEvent.target.classList.remove('controls-DragNDrop__dragTarget');
        }
        this._unregisterMouseMove();
        this._unregisterMouseUp();
        this._dragEntity = null;
        this._startEvent = null;
        // Ключ перетаскиваемой записи мы запоминаем на mouseDown, но днд начнется только после смещения
        // на 4px и не факт, что он вообще начнется
        // Если сработал mouseUp, то днд точно не сработает и draggedKey нам уже не нужен
        this._draggedKey = null;
        // контроллер создается на mouseDown, но драг может и не начаться, поэтому контроллер уже не нужен
        if (
            this._dndListController &&
            !this._dndListController.isDragging() &&
            !this._dndListController.getDragEndPromise()
        ) {
            this._dndListController = null;
        }
    }

    private _calculateMouseOffsetInItem(event: MouseEvent): {
        top: number;
        bottom: number;
    } {
        let result = null;

        const targetElement = this._getDndTargetRow(event);

        if (targetElement) {
            const dragTargetRect = targetElement.getBoundingClientRect();

            result = { top: null, bottom: null };

            const mouseCoords = DimensionsMeasurer.getMouseCoordsByMouseEvent(event.nativeEvent);

            // В плитке порядок записей слева направо, а не сверху вниз, поэтому считаем отступы слева и справа
            if (this._listViewModel['[Controls/_tile/Tile]']) {
                result.top = (mouseCoords.x - dragTargetRect.left) / dragTargetRect.width;
                result.bottom = (dragTargetRect.right - mouseCoords.x) / dragTargetRect.width;
            } else {
                result.top = (mouseCoords.y - dragTargetRect.top) / dragTargetRect.height;
                result.bottom =
                    (dragTargetRect.top + dragTargetRect.height - mouseCoords.y) /
                    dragTargetRect.height;
            }
        }

        return result;
    }

    /**
     * Получаем по event.target строку списка
     * @param event
     * @private
     */
    private _getDndTargetRow(event: MouseEvent): Element {
        if (
            !event.target ||
            !event.target.classList ||
            !event.target.parentNode ||
            !event.target.parentNode.classList
        ) {
            return event.target as Element;
        }

        const startTarget = event.target;
        let target = startTarget;

        const condition = () => {
            // В плитках элемент с классом controls-ListView__itemV имеет нормальные размеры,
            // а в обычном списке данный элемент будет иметь размер 0x0
            if (this._listViewModel['[Controls/_tile/Tile]']) {
                return !target.classList.contains('controls-ListView__itemV');
            } else {
                return !target.parentNode.classList.contains('controls-ListView__itemV');
            }
        };

        while (condition()) {
            target = target.parentNode;

            // Условие выхода из цикла, когда controls-ListView__itemV не нашелся в родительских блоках
            if (
                !target.classList ||
                !target.parentNode ||
                !target.parentNode.classList ||
                target.classList.contains('controls-BaseControl')
            ) {
                target = startTarget;
                break;
            }
        }

        return target as Element;
    }

    private _shouldDisplayDraggingTemplate(): boolean {
        const hasSorting = !!this._options.sorting && !!this._options.sorting.length;
        return (
            !!this._options.draggingTemplate &&
            (this._listViewModel.isDragOutsideList() || hasSorting)
        );
    }

    private _registerMouseMove(): void {
        this._options.notifyCallback('register', ['mousemove', this, this._onMouseMove], {
            bubbling: true,
        });
        this._options.notifyCallback('register', ['touchmove', this, this._onTouchMove], {
            bubbling: true,
        });
    }

    private _unregisterMouseMove(): void {
        this._options.notifyCallback('unregister', ['mousemove', this], {
            bubbling: true,
        });
        this._options.notifyCallback('unregister', ['touchmove', this], {
            bubbling: true,
        });
    }

    private _registerMouseUp(): void {
        this._options.notifyCallback('register', ['mouseup', this, this._onMouseUp], {
            bubbling: true,
        });
        this._options.notifyCallback('register', ['touchend', this, this._onMouseUp], {
            bubbling: true,
        });
    }

    private _unregisterMouseUp(): void {
        this._options.notifyCallback('unregister', ['mouseup', this], {
            bubbling: true,
        });
        this._options.notifyCallback('unregister', ['touchend', this], {
            bubbling: true,
        });
    }

    private _onMouseMove(event: SyntheticEvent<MouseEvent>): void {
        // В яндекс браузере каким то образом пришел nativeEvent === null, после чего
        // упала ошибка в коде ниже и страница стала некликабельной. Повторить ошибку не получилось
        // добавляем защиту на всякий случай.
        if (event.nativeEvent) {
            if (detection.isIE) {
                this._onMouseMoveIEFix(event);
            } else {
                // Check if the button is pressed while moving.
                if (!event.nativeEvent.buttons) {
                    this._dragNDropEnded(event);
                }
            }

            // Не надо вызывать onMove если не нажата кнопка мыши.
            // Кнопка мыши может быть не нажата в 2 случаях:
            // 1) Мышь увели за пределы браузера, там отпустили и вернули в браузер
            // 2) Баг IE, который подробнее описан в методе _onMouseMoveIEFix
            if (event.nativeEvent.buttons) {
                _private.onMove(this, event.nativeEvent);
            }
        }
    }

    private _onMouseMoveIEFix(event: SyntheticEvent<MouseEvent>): void {
        // In IE strange bug, the cause of which could not be found. During redrawing of the table the MouseMove
        // event at which buttons = 0 shoots. In 10 milliseconds we will check that the button is not pressed.
        if (!event.nativeEvent.buttons && !this._endDragNDropTimer) {
            this._endDragNDropTimer = setTimeout(() => {
                this._dragNDropEnded(event);
            }, IE_MOUSEMOVE_FIX_DELAY);
        } else if (this._endDragNDropTimer) {
            clearTimeout(this._endDragNDropTimer);
            this._endDragNDropTimer = null;
        }
    }

    private _onTouchMove(event: SyntheticEvent<MouseEvent>): void {
        _private.onMove(this, event.nativeEvent);
    }

    private _onMouseUp(event: SyntheticEvent<MouseEvent>): void {
        if (this._startEvent) {
            this._dragNDropEnded(event);
        }
    }

    // endregion Drag-N-Drop

    // region Multiselection

    private _hasSelectionController(): boolean {
        return !!this._selectionController;
    }

    private _createSelectionController(
        options: IBaseControlOptions = this._options
    ): SelectionController {
        const strategy = this._createSelectionStrategy(options);
        const controllerOptions = this._getSelectionControllerOptions(options);
        this._selectionController = new SelectionController({
            ...controllerOptions,
            strategy,
        });

        return this._selectionController;
    }

    private _getSelectionController(options?: IBaseControlOptions): SelectionController {
        if (!this._selectionController) {
            this._createSelectionController(options);
        }
        return this._selectionController;
    }

    private _updateSelectionController(newOptions: IBaseControlOptions): void {
        const selectionController = this._getSelectionController();
        const result = selectionController.updateOptions(
            this._getSelectionControllerOptions(newOptions)
        );

        if (result) {
            this._changeSelection(result);
        }
    }

    protected _createSelectionStrategy(options: IBaseControlOptions): ISelectionStrategy {
        const strategyOptions = this._getSelectionStrategyOptions(options);
        return new FlatSelectionStrategy(strategyOptions);
    }

    protected _getSelectionStrategyOptions(
        options: IBaseControlOptions
    ): IFlatSelectionStrategyOptions {
        return { model: this._listViewModel };
    }

    protected _getSelectionControllerOptions(
        options: IBaseControlOptions
    ): ISelectionControllerOptions {
        return {
            model: this._listViewModel,
            searchMode: !!options.searchValue,
            filter: this._sourceController?.getFilter(),
            sorting: options.sorting,
            rootKey: null,
            hasMoreUtil: (key) => {
                return (
                    this._sourceController &&
                    (this._sourceController.hasMoreData('up', key) ||
                        this._sourceController.hasMoreData('down', key))
                );
            },
            isLoadedUtil: (key) => {
                return !this._sourceController || this._sourceController.hasLoaded(key);
            },
            strategyOptions: this._getSelectionStrategyOptions(options),
            keyProperty: this._keyProperty,
            multiSelectAccessibilityProperty: options.multiSelectAccessibilityProperty,
            selectedKeys: options.selectedKeys,
            excludedKeys: options.excludedKeys,
        };
    }

    private _onSelectedTypeChanged(typeName: string, limit: number | undefined): void {
        // Если записи удаляют при закрытия диалога, то к нам может долететь событие, уже когда список задестроился
        if (this._destroyed || this._options.multiSelectVisibility === 'hidden') {
            return;
        }

        const selectionController = this._getSelectionController();
        let result;
        selectionController.setLimit(limit);

        switch (typeName) {
            case 'selectAll':
                selectionController.setLimit(0);
                result = selectionController.selectAll();
                break;
            case 'unselectAll':
                selectionController.setLimit(0);
                result = selectionController.unselectAll();
                break;
            case 'toggleAll':
                selectionController.setLimit(0);
                result = selectionController.toggleAll();
                break;
            case 'count-10':
                result = selectionController.selectAll(PAGE_SIZES.SIZE_10);
                break;
            case 'count-25':
                result = selectionController.selectAll(PAGE_SIZES.SIZE_25);
                break;
            case 'count-50':
                result = selectionController.selectAll(PAGE_SIZES.SIZE_50);
                break;
            case 'count-100':
                result = selectionController.selectAll(PAGE_SIZES.SIZE_100);
                break;
            case 'count-500':
                result = selectionController.selectAll(PAGE_SIZES.SIZE_500);
                break;
            case 'count-1000':
                result = selectionController.selectAll(PAGE_SIZES.SIZE_1000);
                break;
            case 'all':
                this._resetSelectedItemsShownMode();
                break;
            case 'selected':
                loadAsync<typeof import('Controls/listCommands')>('Controls/listCommands').then(
                    ({ ShowOnlySelected }) => {
                        const listViewModel = this._listViewModel;
                        const updateAfterSelect = () => {
                            result = selectionController.unselectAll();
                            selectionController.setMassSelect(false);
                            if (_private.isPortionedLoad(this)) {
                                this._abortPortionedLoading();
                            }
                            this._sourceController.resetNavigation(this._options.root);
                            this._recalcPagingVisible = true;
                            this._changeSelection(result);
                            _private.prepareFooter(this, this._options, this._sourceController);
                        };
                        const command = new ShowOnlySelected({
                            items: this._items,
                            selectedItems: selectionController.getSessionSelectedItems(),
                            parentProperty: this._options.parentProperty,
                            nodeProperty: this._options.nodeProperty,
                            root: this._options.root,
                            selection: selectionController.getSelection(),
                            selectionType: this._options.selectionType,
                            supportSelection: this._options.supportSelection,
                            sourceController: this._sourceController,
                        });
                        this._selectedItemsShown = true;
                        listViewModel.setResultsVisibility?.('hidden');
                        const selectResult = command.execute();
                        if (selectResult instanceof Promise) {
                            selectResult.then(() => {
                                updateAfterSelect();
                            });
                        } else {
                            updateAfterSelect();
                        }
                    }
                );
                break;
        }

        this._options.notifyCallback('selectedLimitChanged', [selectionController.getLimit()]);

        if (result) {
            this._changeSelection(result);
        }
    }

    private _resetSelectedItemsShownMode(): void {
        this._selectedItemsShown = false;
        this._listViewModel.setResultsVisibility?.(this._options.resultsVisibility);
        if (this._hasSelectionController()) {
            const controller = this._getSelectionController();
            const selection = {
                selected: this._options.selectedKeys || [],
                excluded: this._options.excludedKeys || [],
            };
            controller.setMassSelect(true);
            checkWasabyEvent(this._options.listSelectedKeysCountChangedCallback)?.(
                controller.getCountOfSelected(selection),
                false
            );
            this._options.notifyCallback('listSelectedKeysCountChanged', [
                controller.getCountOfSelected(selection),
                false,
            ]);
        }
    }

    private _notifySelection(selection: ISelectionObject): void {
        const controller = this._getSelectionController();
        const selectionDifference = controller.getSelectionDifference(selection);

        const selectedDiff = selectionDifference.selectedKeysDifference;
        if (selectedDiff.added.length || selectedDiff.removed.length) {
            this._options.notifyCallback('selectedKeysChanged', [
                selectedDiff.keys,
                selectedDiff.added,
                selectedDiff.removed,
            ]);
        }

        const excludedDiff = selectionDifference.excludedKeysDifference;
        if (excludedDiff.added.length || excludedDiff.removed.length) {
            this._options.notifyCallback('excludedKeysChanged', [
                excludedDiff.keys,
                excludedDiff.added,
                excludedDiff.removed,
            ]);
        }

        // для связи с контроллером ПМО
        let selectionType = 'all';
        if (controller.isAllSelected() && this._options.nodeProperty && this._options.searchValue) {
            let onlyCrumbsInItems = true;
            this._listViewModel.each((item) => {
                if (onlyCrumbsInItems) {
                    onlyCrumbsInItems = item['[Controls/_baseTree/BreadcrumbsItem]'];
                }
            });

            if (!onlyCrumbsInItems) {
                selectionType = 'leaf';
            }
        }
        this._options.notifyCallback('listSelectionTypeForAllSelectedChanged', [selectionType], {
            bubbling: true,
        });
    }

    private _changeSelection(
        newSelection: ISelectionObject
    ): Promise<ISelectionObject> | ISelectionObject {
        const controller = this._getSelectionController();
        const selectionDifference = controller.getSelectionDifference(newSelection);
        const result = this._options.notifyCallback('beforeSelectionChanged', [
            selectionDifference,
        ]) as Promise<ISelectionObject> | ISelectionObject;

        const handleResult = (selection) => {
            this._notifySelection(selection);
            const shouldUpdateModel = result && isEqual(controller.getSelection(), selection);
            if (this._options.selectedKeys === undefined || shouldUpdateModel) {
                controller.setSelection(selection);
            }
            checkWasabyEvent(this._options.listSelectedKeysCountChangedCallback)?.(
                controller.getCountOfSelected(selection),
                controller.isAllSelected(true, selection)
            );
            this._options.notifyCallback('listSelectedKeysCountChanged', [
                controller.getCountOfSelected(selection),
                controller.isAllSelected(true, selection),
            ]);
        };

        if (result instanceof Promise) {
            result.then((selection: ISelectionObject) => {
                return handleResult(selection);
            });
        } else if (result !== undefined) {
            handleResult(result);
        } else {
            handleResult(newSelection);
        }

        return result || newSelection;
    }

    // endregion

    _getFooterSpacingClasses(options: IBaseControlOptions): string {
        const shouldAddMultiSelectSpace = this._hasMultiSelect();

        let paddingClassName = `controls__BaseControl__footer-${options.style}__paddingLeft_`;
        if (shouldAddMultiSelectSpace) {
            paddingClassName += 'withCheckboxes';
        } else {
            paddingClassName += options.itemPadding?.left?.toLowerCase() || 'default';
        }

        return `${paddingClassName}`;
    }

    _getNavigationButtonClasses(
        options: IBaseControlOptions,
        buttonConfig: INavigationButtonConfig
    ): string {
        const isSeparatorButton = this._resolveNavigationButtonView() === 'separator';
        let classes = '';
        let buttonPosition = buttonConfig?.buttonPosition;
        if (!buttonPosition) {
            buttonPosition = isSeparatorButton ? 'center' : 'left';
        }
        if (buttonPosition !== 'center') {
            classes += this._getFooterSpacingClasses(options);
        }
        if (options.itemActionsPosition === 'outside') {
            classes += ' controls-itemActionsV_outside-navigation_button-spacing';
        }
        return classes;
    }

    _getMoreButtonTemplate(): string | TemplateFunction {
        return this._options.moreButtonTemplate || MoreButtonTemplate;
    }

    /**
     * Ф-ия вызывается после того как были обновлены значения флагов, идентифицирующих
     * нужно или нет показывать кнопку "Еще..." или "•••" (cut)
     */
    _onFooterPrepared(options: IBaseControlOptions): void {
        // После обновления данных футера нужно обновить _bottomPaddingClass,
        // который прокидывается во view
        this._bottomPaddingClass = this._getBottomPaddingClass(this, options);
    }

    _onToggleHorizontalScroll(e: Event, visibility: boolean): void {
        // TODO: Не переношу в грид контрол, т.к. этот код удалится в 22.1000.
        this._isColumnScrollVisible = visibility;
    }

    setStoredColumnsWidths(columnsWidths: string[]): void {
        if (!isEqual(columnsWidths, this._storedColumnsWidths)) {
            this._storedColumnsWidths = columnsWidths;
            this._listViewModel.setColumnsWidths(
                extractWidthsForColumns(this._options, columnsWidths, this._listViewModel)
            );
            const { propStorageId } = this._options;

            if (propStorageId) {
                saveConfig(propStorageId, ['storedColumnsWidths'], {
                    storedColumnsWidths: columnsWidths,
                });
            }
            this._options.notifyCallback('storedColumnsWidthsChanged', columnsWidths);
        }
    }

    protected _onResizerOffsetChanged(offset: number): void {
        const columnsWidths = getColumnsWidths(
            this._options,
            offset,
            this._storedColumnsWidths,
            this._listViewModel
        );
        this.setStoredColumnsWidths(columnsWidths);
    }

    isColumnScrollVisible(): boolean {
        // TODO: Не переношу в грид контрол, т.к. этот код удалится в 22.1000.
        return this._isColumnScrollVisible;
    }

    _getBaseControlClasses(options): string {
        const theme = options.theme;
        let classes = `controls-BaseControl controls_list_theme-${theme} controls_toggle_theme-${theme}`;

        if (options.className) {
            classes = `${options.className} ${classes}`;
        }

        if (this.__needShowEmptyTemplate() && !this._options.emptyTemplateColumns) {
            classes += ' controls-BaseControl__emptyTemplate__wrapper';
        }

        return classes;
    }

    _onBaseControlClick(e: SyntheticEvent<MouseEvent>): void {
        // Клик по item. Item тут - это ЛЮБОЙ элемент фора.
        // if (
        //     e.target.closest('.js-controls-list__item') ||
        //     (e.target.className && e.target.className.indexOf('js-controls-list__item') !== -1)
        // ) {
        // } else
        if (e.target.closest(`.${IndicatorSelector}`)) {
            if (e.target.closest('.js-controls-BaseControl__continueSearch')) {
                this._onContinueSearchClick();
            }
            if (e.target.closest('.js-controls-BaseControl__abortSearch')) {
                this._onAbortSearchClick();
            }
        }
        // Обработчик клика по кнопке сортировки
        const sortingButton = e.target.closest(SORTING_BUTTON_SELECTOR);
        if (sortingButton) {
            this._onSortingChanged(sortingButton);
        }
    }

    static _private: typeof _private = _private;

    private static _rejectEditInPlacePromise(fromWhatMethod: string): Promise<void> {
        const msg = ERROR_MSG.CANT_USE_IN_READ_ONLY(fromWhatMethod);
        Logger.warn(msg);
        return Promise.reject(msg);
    }

    static getDefaultOptions(): Partial<IBaseControlOptions> {
        return {
            ...NEW_BASE_CONTROL_DEFAULT_OPTIONS,
            attachLoadTopTriggerToNull: true,
            attachLoadDownTriggerToNull: true,
            iterativeLoading: true,
            uniqueKeys: true,
            multiSelectVisibility: 'hidden',
            multiSelectPosition: 'default',
            multiSelectAccessibilityProperty: '',
            style: 'default',
            loadingIndicatorTemplate: 'Controls/baseList:LoadingIndicatorTemplate',
            iterativeLoadingTemplate: 'Controls/baseList:IterativeLoadingTemplate',
            continueSearchTemplate: 'Controls/baseList:ContinueSearchTemplate',
            virtualScrollConfig: {},
            multiColumns: false,
            filter: {},
            itemActionsVisibility: 'onhover',
            searchValue: '',
            moreFontColorStyle: 'listMore',
            urlProperty: 'url',
            itemsSpacing: null,
            trackedPropertiesTemplate: TrackedPropertiesComponent,
            renderPreloadedDataIgnoringViewType: false,

            // FIXME: https://online.sbis.ru/opendoc.html?guid=12b8b9b1-b9d2-4fda-85d6-f871ecc5474c
            stickyHeader: true,
            stickyResults: true,
            stickyColumnsCount: 1,
            notifyKeyOnRender: false,
            topTriggerOffsetCoefficient: ScrollControllerLib.DEFAULT_TRIGGER_OFFSET,
            bottomTriggerOffsetCoefficient: ScrollControllerLib.DEFAULT_TRIGGER_OFFSET,
            keepScrollAfterReload: false,
        };
    }
}
