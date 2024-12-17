import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_baseList/Data/compatible/ListContainerConnectedCompatible';
import { connectToDataContext, IContextValue } from 'Controls/context';
import { IListSliceErrorConfig, IListState, ListSlice } from 'Controls/dataFactory';
import type { IBrowserOptions } from 'Controls/_browser/Browser';
import { isEmpty, isEqual } from 'Types/object';
import { RecordSet } from 'Types/collection';
import { SyntheticEvent } from 'UICommon/Events';
import {
    INavigationSourceConfig,
    ISelectionObject,
    TFilter,
    TKey,
    TSelectionViewMode,
} from 'Controls/interface';
import { Logger } from 'UI/Utils';
import { RegisterClass } from 'Controls/event';
import { ICrud, ICrudPlus, IData, PrefetchProxy } from 'Types/source';
import { process } from 'Controls/error';
import { TViewMode } from 'Controls-DataEnv/interface';
import { INewListSchemeHandlers } from '../INewListScheme';
import { getHandlersNew } from '../connector/useHandlersNew';

interface IConnectedCompatibleContainerOptions extends IControlOptions, IBrowserOptions {
    storeId: string;
    searchValueForHighlight?: string;
    _dataOptionsValue: IContextValue;
    fix1193059929?: boolean;
}

const OPTIONS_CHECK_ON_MOUNT = [
    'filter',
    'sorting',
    'navigation',
    'parentProperty',
    'nodeProperty',
    'root',
    'keyProperty',
    'deepReload',
];

const LIST_OF_DATA_OPTIONS = OPTIONS_CHECK_ON_MOUNT.concat([
    'source',
    'searchValue',
    'sourceController',
    'expandedItems',
    'viewMode',
    'selectedKeys',
    'excludedKeys',
    'markedKey',
    'markerVisibility',
    'expandedItems',
    'collapsedItems',
]);

const STATES_FOR_CONTENT = [
    'filter',
    'searchValue',
    'searchMisspellValue',
    'viewMode',
    'markedKey',
    'count',
    'root',
    'items',
    'isAllSelected',
    'loading',
    'selectionViewMode',
    'selectedKeys',
    'excludedKeys',
    'expandedItems',
    'collapsedItems',
    'showSelectedCount',
    'listCommandsSelection',
];
// ниже расположены имена полей слайса, куда сохраняю перебитые в initSlice, оригинальные, методы слайса.
const ORIGINAL_BEFORE_APPLY_STATE_METHOD_NAME = Symbol('_$beforeApplyState');
const ORIGINAL_NEED_REJECT_METHOD_NAME = Symbol('_$needRejectBeforeApply');
const ORIGINAL_SET_STATE_INNER_METHOD_NAME = Symbol('_$setState');
const ORIGINAL_APPLY_STATE_METHOD_NAME = Symbol('_$applyState');
// имя поля слайса для флага, который указывает на наличие перебитых методов
const LCCC_INITED_FLAG = Symbol('$lcccInited');

const EXCLUDED_FOR_NOTIFY = ['loading'];
const STATES_FOR_NOTIFY = STATES_FOR_CONTENT.filter(
    (stateName) => !EXCLUDED_FOR_NOTIFY.includes(stateName)
);

const ASPECTS_OPTIONS = ['markedKey'];

function getSlice({ _dataOptionsValue, storeId }: IConnectedCompatibleContainerOptions): ListSlice {
    const slice = _dataOptionsValue[storeId];
    validateSlice(slice, storeId);
    return slice as ListSlice;
}

function validateSlice(slice: ListSlice | unknown, storeId: string): void {
    if (!slice) {
        throw new Error(
            `Controls/baseList:CompatibleContainerConnected в контексте не найден слайс по ключу ${storeId}`
        );
    }

    if (!slice['[IListSlice]']) {
        throw new Error(
            `Controls/baseList:CompatibleContainerConnected Слайс ${storeId} должен быть наследником cлайса списка`
        );
    }
}

function getOriginalSource(source: unknown): ICrudPlus | (ICrud & ICrudPlus & IData) | unknown {
    if (source instanceof PrefetchProxy) {
        return source.getOriginal();
    } else {
        return source;
    }
}

function getNamesOfChangedOptions(
    currentOptions: object,
    newOptions: IBrowserOptions | IListState,
    optionsList = LIST_OF_DATA_OPTIONS,
    equalCallback?: Function
): string[] {
    const result = optionsList.filter((optionName) => {
        const optionValue = currentOptions[optionName];
        const newOptionValue = newOptions[optionName];
        return equalCallback
            ? equalCallback(optionValue, newOptionValue)
            : !isEqual(optionValue, newOptionValue);
    }) as string[];

    const isItemsChanged = () => {
        const stayNull = !currentOptions.items && !!currentOptions.items === !!newOptions.items;
        return currentOptions.items !== newOptions.items && !stayNull;
    };

    if (currentOptions.disableSource && isItemsChanged()) {
        result.push('items');
    }

    return result;
}

export function checkOptionsOnMount(
    options: IConnectedCompatibleContainerOptions,
    sliceState: IListState
): string[] {
    const equalFunc = (optionValue, sliceStateValue) => {
        return optionValue !== undefined && !isEqual(optionValue, sliceStateValue);
    };
    const changedOptions = getNamesOfChangedOptions(
        options,
        sliceState,
        OPTIONS_CHECK_ON_MOUNT,
        equalFunc
    );
    // source в опции передают из prefetchResult и он там PrefetchProxy
    // при этом в контексте это уже обычный источник, поэтому пока приходится костылить проверку
    if (getOriginalSource(options.source) !== getOriginalSource(sliceState.source)) {
        changedOptions.push('source');
    }

    // Фильтр на слайсе и в опциях при передаче опции searchValue будет отличаться,
    // и это не ошибка, так было и раньше. В слайсе для фильтра сразу устанавливается searchValue
    if (changedOptions.includes('filter') && options.searchValue) {
        changedOptions.splice(changedOptions.indexOf('filter'), 1);
    }

    return changedOptions;
}

function isEqualWithoutOrder(a?: unknown[], b?: unknown[]): boolean {
    const aCopy = a ? [...a].sort() : undefined;
    const bCopy = b ? [...b].sort() : undefined;

    return isEqual(aCopy, bCopy);
}

// Экспорт для типов
export class CompatibleContainer
    extends Control<IConnectedCompatibleContainerOptions, void>
    implements INewListSchemeHandlers
{
    protected _template: TemplateFunction = template;
    protected _slice: ListSlice;
    protected _selectedTypeRegister: RegisterClass;

    protected _searchValue: string;
    protected _searchMisspellValue: string;
    protected _items: RecordSet;
    protected _filter: TFilter;
    protected _markedKey: TKey;
    protected _count: number | void;
    protected _root: TKey;
    protected _isAllSelected: boolean;
    protected _loading: boolean;
    protected _errorConfig: IListSliceErrorConfig;
    protected _viewMode: TViewMode;
    protected _selectionViewMode: TSelectionViewMode;
    protected _showSelectedCount: number;
    protected _listCommandsSelection: ISelectionObject;
    private _sliceCommandExecuting: boolean;

    protected _beforeMount(options: IConnectedCompatibleContainerOptions): void {
        this._sliceCommandExecuting = false;
        this._initSlice(options);
        this._bindHandlersForListNewScheme();

        if (options.searchValueForHighlight && options.storeId === '_dataSyntheticStoreId') {
            this._searchValue = options.searchValueForHighlight;
        }

        const invalidOptions = checkOptionsOnMount(options, this._slice.state);

        if (invalidOptions.length) {
            let errorMsg = `Отличается значение опций ${invalidOptions.join(
                ', '
            )} у контрола и sourceController'a.
        Как поправить ошибку: `;

            // _dataSyntheticStoreId задаём мы сами для списка или DataContainer'a,
            // а иначе это Browser
            if (options.storeId === '_dataSyntheticStoreId') {
                errorMsg += `проверьте что опции контрола (список или Controls/listDataOld:DataContainer) совпадают с опциями sourceController'a.
        Опции sourceController'a берутся из конфигурации загрузчика sabyPage.`;
            } else {
                errorMsg +=
                    'проверьте, что опции Controls/browser совпадают с опциями, которые задаются в конфигурации загрузчика sabyPage.';
            }

            errorMsg +=
                ' (подробнее тут: https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/).';
            Logger.error(errorMsg, this);
        }
    }

    protected _beforeUpdate(options: IConnectedCompatibleContainerOptions): void {
        const slice = getSlice(options);
        const sliceChanged = this._slice !== slice;

        if (sliceChanged) {
            this._initSlice(options);
        } else {
            if (getNamesOfChangedOptions(this._options, options).length) {
                this._syncBrowserOptionsAndSliceState(options);
            }

            // Если контейнер строится в списке, то опция searchValue не должна проставляться в слайс,
            // но списку в опции для подсветки должна передаваться
            // _dataSyntheticStoreId проставляется только если контейнер совместимости строится внутри списочного контрола
            if (options.storeId === '_dataSyntheticStoreId') {
                this._searchValue = options.searchValueForHighlight || '';
            }

            if (slice.state.errorConfig && !this._errorConfig) {
                this._errorConfig = slice.state.errorConfig;

                if (options.dataLoadErrback) {
                    options.dataLoadErrback(this._errorConfig.error);
                }

                if (!this._errorConfig.error.processed) {
                    process({ error: this._errorConfig.error });
                }
            } else {
                this._errorConfig = null;
            }

            // Если команда еще не выполняется, выполняем.
            // Флаг _sliceCommandExecuting необходим, поскольку в рамках одного setState происходит множество ререндеров
            if (slice.state.command && !this._sliceCommandExecuting) {
                this._getSelectionTypeRegister().start(slice.state.command);
                slice.onExecutedCommand();
                this._sliceCommandExecuting = true;
                // если выполнение закончилось, возвращаем флаг обратно
            } else if (this._sliceCommandExecuting && slice.state.command === null) {
                this._sliceCommandExecuting = false;
            }
        }
    }

    protected _beforeUnmount(): void {
        this._selectedTypeRegister?.destroy();
    }

    protected _misspellCaptionClick(event: SyntheticEvent, caption: string): void {
        this._slice.setState({
            searchValue: caption,
            searchInputValue: caption,
        });
    }

    private _notifyAboutNewSliceState(
        state: IListState,
        options: IConnectedCompatibleContainerOptions
    ): boolean {
        let needRerender = false;
        STATES_FOR_NOTIFY.forEach((stateName) => {
            // текущие опции LCCC
            const optionValue = options[stateName];
            // новое состояние слайса, которое устанавливается
            const sliceValue = state[stateName];
            // состояние слайса до setState, которое хранится в слое совместимости
            const internalSliceValue = this['_' + stateName];
            // опции LCCC, которые запустили обновление слайса
            const internalOptionValue = state?._syncedWithOptions?.[stateName];

            // прикладника уведомляем в следующей ситуации:
            // - значение в новом стейте отлично от имеющегося в LCCC
            // - новое значение не совпадает с тем, что это обновление вызвало (если инициатор прикладник через опции)
            // - у прикладника оно не задано
            if (
                !isEqual(internalSliceValue, sliceValue) &&
                (!state?._syncedWithOptions || !isEqual(sliceValue, internalOptionValue)) &&
                ((optionValue === undefined) === undefined || !isEqual(optionValue, sliceValue)) &&
                !(
                    options.fix1193059929 &&
                    stateName === 'searchValue' &&
                    options.storeId === '_dataSyntheticStoreId'
                )
            ) {
                this._notify(stateName + 'Changed', [sliceValue]);
                needRerender = true;
            }
        });
        return needRerender;
    }

    private _getNewStateByOptions(
        state: IListState,
        options: IConnectedCompatibleContainerOptions
    ) {
        return STATES_FOR_CONTENT.reduce(
            (state, propName) => {
                if (
                    typeof options[propName] !== 'undefined' &&
                    // searchValue не должна проставляться в слайс
                    !(propName === 'searchValue' && options.storeId === '_dataSyntheticStoreId')
                ) {
                    // поскольку используется подход, при котором прикладник уведомляется
                    // обо всех рассчетах в фазах установки setState,
                    // считается, что опции прикладника в приоритете над вычислениями слайса.
                    state[propName] = options[propName];
                }
                return state;
            },
            { ...state }
        );
    }

    private _waitRender(): Promise<unknown> {
        let promiseResolver: Function;
        const promise = new Promise((resolver) => {
            promiseResolver = resolver;
        });
        // используется, чтобы подождать прохождение всех рендеров и рассчетов со стороны прикладника
        // notify приводит к рендеру и всем рассчетам в рамках макроочереди
        // setTimeout откладывает разрешения промиса до исполнения всех задач в микроочереди
        setTimeout(() => {
            promiseResolver();
        });
        return promise;
    }

    protected _initSlice(options: IConnectedCompatibleContainerOptions): void {
        const localSlice = getSlice(options);
        this._slice = localSlice;

        // Один и тот же слайс может быть передан для инициализации разным LCCC
        // текущий подход создает прямую связь между переопределенными методами и контекстом LCCC
        // поэтому для корректной работы необходимо каждый раз переопределять методы
        // Считаем, что слайс может работать одновременно только в одном LCCC
        // (но по специфике окружения, новый LCCC может создаться раньше, чем разрушится второй)
        if (!localSlice[LCCC_INITED_FLAG]) {
            localSlice[ORIGINAL_NEED_REJECT_METHOD_NAME] =
                this._slice._needRejectBeforeApply.bind(localSlice);
            localSlice[ORIGINAL_BEFORE_APPLY_STATE_METHOD_NAME] =
                this._slice._beforeApplyState.bind(localSlice);
            localSlice[ORIGINAL_SET_STATE_INNER_METHOD_NAME] =
                this._slice._setState.bind(localSlice);
            localSlice[ORIGINAL_APPLY_STATE_METHOD_NAME] = this._slice._applyState.bind(localSlice);
            localSlice[LCCC_INITED_FLAG] = true;
        }
        let needRejectBeforeApplyState = {
            rejected: false,
        };
        let needApplySyncState = {
            partialState: undefined,
        };
        this._slice._needRejectBeforeApply = (partialState, currentAppliedState) => {
            const originalResult = localSlice[ORIGINAL_NEED_REJECT_METHOD_NAME](
                partialState,
                currentAppliedState
            );
            if (originalResult) {
                needRejectBeforeApplyState.rejected = true;
            }
            return originalResult;
        };
        this._slice._beforeApplyState = (initialState) => {
            if (localSlice.isDestroyed()) {
                // при разрушенном слайсе ничего делать не надо
                return;
            }
            if (this._unmounted) {
                // если LCCC не отображается на странице, тогда необходимо выполнять чистую логику слайса
                return localSlice[ORIGINAL_BEFORE_APPLY_STATE_METHOD_NAME](initialState);
            }
            // началось исполнение setState, уведомляем прикладника о грядущих обновлениях
            const _needRejectBeforeApplyState = {
                rejected: false,
            };
            const _needApplySyncState: { partialState?: Partial<IListState> } = {
                partialState: undefined,
            };
            const applySyncState = (state: IListState): IListState => {
                let returnState = state;
                if (_needApplySyncState.partialState) {
                    // loading обновляться не должен
                    if (_needApplySyncState.partialState.loading !== undefined) {
                        delete _needApplySyncState.partialState.loading;
                    }
                    returnState = {
                        ...state,
                        ..._needApplySyncState.partialState,
                    };
                    _needApplySyncState.partialState = undefined;
                }
                return returnState;
            };
            needRejectBeforeApplyState = _needRejectBeforeApplyState;
            needApplySyncState = _needApplySyncState;

            const needRerender = this._notifyAboutNewSliceState(initialState, this._options);
            const promise =
                this._options.fix1193059929 && !needRerender
                    ? Promise.resolve()
                    : this._waitRender();

            return promise.then(() => {
                if (localSlice.isDestroyed()) {
                    return;
                }
                if (this._unmounted) {
                    return localSlice[ORIGINAL_BEFORE_APPLY_STATE_METHOD_NAME](initialState);
                }
                // проецируем на стейт опции, считая, что прикладник подправил необходимое в рамках ререндера
                // и запускаем оригинальный beforeApplyState
                let stateFromOptions = this._getNewStateByOptions(initialState, this._options);

                if (_needRejectBeforeApplyState.rejected) {
                    // если reject, был вызван до начала выполнения bas, то возвращаем стейт как есть
                    return this._slice.state;
                }
                stateFromOptions = applySyncState(stateFromOptions);
                return localSlice[ORIGINAL_BEFORE_APPLY_STATE_METHOD_NAME](stateFromOptions);
            });
        };
        this._slice._setState = (newState) => {
            // удаляем опцию, использующуюся для нотификации прикладника
            // и запускаем синхронное обновление состояния слайса
            if (newState._syncedWithOptions) {
                delete newState._syncedWithOptions;
            }
            if (!this._unmounted) {
                this._notifyAboutNewSliceState(newState, this._options);
                this._updateBrowserStateBySliceState(newState);
            }
            if (localSlice.isDestroyed()) {
                return;
            }
            localSlice[ORIGINAL_SET_STATE_INNER_METHOD_NAME](newState);
        };

        // Синхронное обновление состояния слайса может произойти в любой момент
        // пример: ListSlice.setSearchInputValue реагирующий на действия пользователей
        // original beforeApplyState следит за изменениями, которые запускает. А обертка, что написана выше - состояние никак не обновит
        // если обновление произошло после originalBeforeApplyState, но до _setState, тогда будет установлено неактуальное состояние.
        // Чтобы избежать этого сценария, обертка ниже запоминает любое изменение, добавленное синхронно
        // и это состояние будет применено до originalBas и перед отправкой в _setState после всей асинхронности
        this._slice._applyState = (partialState) => {
            needApplySyncState.partialState = {
                ...(needApplySyncState.partialState || {}),
                ...partialState,
            };
            localSlice[ORIGINAL_APPLY_STATE_METHOD_NAME](partialState);
        };

        const sliceState = this._slice.state;
        this._updateBrowserStateBySliceState(sliceState);
        if (sliceState.items) {
            options.dataLoadCallback?.(sliceState.items);
        }
        sliceState.sourceController.setDataLoadCallback(options.dataLoadCallback);
        sliceState.sourceController.setNodeLoadCallback(options.nodeLoadCallback);
    }

    private _updateBrowserStateBySliceState(state: IListState): void {
        // обновление опций слоя совместимости в соответствии с новым состоянием
        // обновляются только те, что хранятся в state и STATES_FOR_CONTENT
        [...Object.keys(state), ...STATES_FOR_CONTENT]
            .reduce(
                (acc, stateName) => {
                    let count = 0;
                    if (acc.map.has(stateName)) {
                        count = acc.map.get(stateName) + 1;

                        acc.map.set(stateName, count);
                    } else {
                        acc.map.set(stateName, 0);
                    }

                    if (count === 1) {
                        acc.result.push(stateName);
                    }

                    return acc;
                },
                {
                    map: new Map(),
                    result: [],
                }
            )
            .result.forEach((stateName) => {
                this['_' + stateName] = state[stateName];
            });
    }

    private _isStateInSliceAndInBrowserChanged(stateName: string, sliceState: IListState): boolean {
        const nameOfStateOnBrowser = '_' + stateName;
        const sliceStateValue = sliceState[stateName];
        return !isEqual(this[nameOfStateOnBrowser], sliceStateValue);
    }

    private _isSliceStateChanged(sliceState: IListState): boolean {
        return STATES_FOR_CONTENT.some((stateName) => {
            return this._isStateInSliceAndInBrowserChanged(stateName, sliceState);
        });
    }

    private _sliceStateChanged(
        newState: IListState,
        newOptions: IConnectedCompatibleContainerOptions
    ): void {
        let hasChanges = false;
        STATES_FOR_CONTENT.forEach((stateName) => {
            if (this._isStateInSliceAndInBrowserChanged(stateName, newState)) {
                const optionValue = newOptions[stateName];
                const sliceValue = newState[stateName];
                hasChanges = true;

                // Если одновременно поменялась опция и состояние слайса,
                // то на изменение состояния слайса не надо реагировать
                // в слое совместимости опции всегда главнее
                const isAspectOptionChanged =
                    ASPECTS_OPTIONS.includes(stateName) &&
                    !isEqual(newOptions[stateName], this._options[stateName]);

                if (
                    !isAspectOptionChanged &&
                    (optionValue === undefined || !isEqual(optionValue, sliceValue))
                ) {
                    this._notify(stateName + 'Changed', [sliceValue]);
                }
            }
        });

        if (hasChanges) {
            this._updateBrowserStateBySliceState(newState);
        }
    }

    protected _syncBrowserOptionsAndSliceState(options): void {
        // вызывается, когда инициатором обновления выступает прикладник
        // новые данные в опциях, запускают setState
        const stateForSlice = {};

        LIST_OF_DATA_OPTIONS.forEach((optName) => {
            const optionValue = options[optName];
            if (
                optionValue !== undefined &&
                !isEqual(optionValue, this._options[optName]) &&
                !isEqual(optionValue, this._slice.state[optName])
            ) {
                stateForSlice[optName] = optionValue;
            }
        });

        if (
            options.disableSource &&
            options.items !== undefined &&
            options.items !== this._options.items &&
            options.items !== this._slice.state.items
        ) {
            stateForSlice.items = options.items;
        }

        if (!isEmpty(stateForSlice)) {
            // если есть значения, которые необходимо установить в слайс, то необходимы и опции, чтобы не уведомлять
            // прикладника о том, что он уже знает
            // удаляется прямо перед установкой в слайс и в финальный стейт не попадает
            stateForSlice._syncedWithOptions = options;
            this._slice.setState(stateForSlice);
        }
    }

    protected _setOptionToSliceAndNotify(
        event: SyntheticEvent,
        optionName: string,
        ...args: unknown[]
    ): void {
        if (
            this._options[optionName] === undefined &&
            !isEqual(this._slice.state[optionName], args[0])
        ) {
            this._slice.setState({ [optionName]: args[0] });
        }
        this._notify(optionName + 'Changed', args);
    }

    protected _selectedCountChanged(
        event: SyntheticEvent,
        count: number,
        isAllSelected: boolean
    ): void {
        if (this._options.isBrowser) {
            this._slice.setSelectionCount(count, isAllSelected);
        }
    }

    protected _registerHandler(
        event: Event,
        registerType: string,
        component: Control,
        callback: Function
    ): void {
        this._getSelectionTypeRegister().register(event, registerType, component, callback);
    }

    protected _unregisterHandler(
        event: Event,
        registerType: string,
        component: Control,
        callback: Function
    ): void {
        this._getSelectionTypeRegister().register(event, registerType, component, callback);
    }

    protected _getSelectionTypeRegister(): RegisterClass {
        if (!this._selectedTypeRegister) {
            this._selectedTypeRegister = new RegisterClass({
                register: 'selectedTypeChanged',
            });
        }
        return this._selectedTypeRegister;
    }

    protected _selectedTypeChangedHandler(event: Event, type: TSelectionViewMode): void {
        if (type === 'all' || type === 'selected') {
            this._slice.setSelectionViewMode(type);
        }
        this._slice.executeCommand(type);
    }

    protected _loadExpandedItem(event: Event, key: TKey): Promise<RecordSet | Error> | void {
        if (!this._slice.hasLoaded(key)) {
            event.stopPropagation();
            return this._slice.load(void 0, key);
        }
    }

    protected _onDataError(event, errorCfg): void {
        if (errorCfg.error && !errorCfg.error.processed) {
            process(errorCfg);
        }
    }

    reload(config: INavigationSourceConfig): Promise<RecordSet | Error> {
        return this._slice.reload(config);
    }

    //# region INewListSchemeHandlers
    protected _onMarkedKeyChanged(e, newMarkedKey): void {
        e.stopPropagation();
        if (
            this._options.markedKey === undefined &&
            !isEqual(this._slice.state.markedKey, newMarkedKey)
        ) {
            this._slice.mark(newMarkedKey);
        }
        this._notify('markedKeyChanged', [newMarkedKey]);
    }

    protected _bindHandlersForListNewScheme() {
        const h = getHandlersNew({
            storeId: '_dataSyntheticStoreId',
            slice: this._slice,
            changeRootByItemClick: this._options.changeRootByItemClick,
            context: this._options._dataOptionsValue,
        });
        Object.keys(h).forEach((hName) => {
            this[hName] = h[hName as keyof typeof h].bind(this);
        });
    }

    //# endregion INewListSchemeHandlers
}

export default connectToDataContext<CompatibleContainer>(CompatibleContainer);
