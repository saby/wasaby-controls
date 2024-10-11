import * as React from 'react';
import type {
    INewListSchemeHandlers,
    INewListSchemeProps,
    TOnToggleExpansionParams,
} from '../Data/INewListScheme';
import type { Collection, CollectionItem, IEditableCollectionItem } from 'Controls/display';
// Можно перенести статический импорт в место вставки старого
// data контейнера, вместе со старым кодом.
import type {
    TMarkerMoveDirection,
    TSlicelessBaseControlCompatibility,
} from 'Controls/listDataOld';
import type { IViewOptions as IOptionFromSlice } from '../Data/connector/interface/IViewOptions';
import type { TAlaListConnectedHandlers } from './types/TAlaListConnectedHandlers';
import type { TCompatibilityForUndoneAspects as TBaseControlCompatibilityForUndoneAspects } from './types/TCompatibilityForUndoneAspects';
import type { BaseControl as TBaseControl, IBaseControlOptions } from 'Controls/baseList';
import type { CrudEntityKey } from 'Types/source';
import type { Model } from 'Types/entity';
import type {
    BaseTreeControl as TBaseTreeControl,
    IBaseTreeControlOptions,
} from 'Controls/baseTree';
import { BaseTreeControl } from 'Controls/baseTree';
import { TKey } from 'Controls/_interface/IItems';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import type { INavigationSourceConfig } from 'Controls/interface';
import type { RecordSet } from 'Types/collection';
import type { TKey, IItemAction } from 'Controls/interface';
import {
    CompatibleSingleColumnMarkerStrategy as SingleColumnStrategy,
    MarkerUILogic,
} from 'Controls/listAspects';
import { helpers, type ScrollControllerLib } from 'Controls/listsCommonLogic';
import { getKey } from '../resources/utils/helpers';
import { marker as markerNotification } from './NotificationCompatibility';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';

export type TBaseControlComponentProps = INewListSchemeProps &
    INewListSchemeHandlers &
    Pick<IOptionFromSlice, 'markedKey' | 'markerVisibility'> & {
        children: JSX.Element;
    };

export type TOldBaseControlCompatibility<
    //eslint-disable-next-line max-len
    TCompatibilityForUndoneAspects extends
        TBaseControlCompatibilityForUndoneAspects = TBaseControlCompatibilityForUndoneAspects,
    TSlicelessCompatibility extends
        TSlicelessBaseControlCompatibility = TSlicelessBaseControlCompatibility,
> =
    // 1. AlaListConnectedHandlers -> ListConnected | OldLogic
    // API, симметричное ListConnected'у, названия те же, но в параметрах
    // передается еще старый BaseControl.
    // Внутри метода определяется, может ли идти работа по слайсовой схеме.
    // Если да, то проксируется вызов в ListConnected, если нет, то вызывается
    // код старого BaseControl, вынесенный в отдельный загружаемый модуль.
    // Модуль должны затягивать к себе гаранты построения в безслайсовой схеме,
    // например, старый DataContainer.
    // После отказа от браузера будет достаточно удалить параметры при вызове функции
    // и подгружаемый модуль со старым кодом.
    // Данная же обертка может быть удалена только ПОСЛЕ:
    //  a) полного перевода пользователей на честные слайсы (storeId)
    //  b) отказе от событий.
    //  это не точно, есть еще вариант, обсуждаемо.
    TAlaListConnectedHandlers &
        // 2. AlaListConnectedState -> ListConnected | OldLogic
        // ?????? Аналогично первому пункту ????????
        //
        // 3. SlicelessHandlers (то что нужно старым спискам без слайса, например ХЖЦ).
        // РАСПИСАТЬ
        Partial<TSlicelessCompatibility> &
        // 4. Методы с постфиксом Compatible.
        //  Во-первых, это методы, которые возвращают опцию в слйсовой
        //  и результат метода в безслайсовой схеме.
        //  Так сделано, т.к. не было времени разбираться как динамически ссгенерить
        //  типобезопасный геттер. Например список читает _options.markedKey.
        //  Появляется _options.getMarkedKeyCompatible, который либо берет стейт слайса,
        //  либо идет в методы старого BaseControl.
        //  Во-вторых, тут методы, которые нужны старому списку для корректной работы, но
        //  еще не реализованы в полной мере.
        //  Также тут спорные методы, которые просто непонятно где будут находиться.
        //  например onViewDragStart.
        //  Может, оно распадется на два, одно будет во вьюхе, другое
        //  в слайсе.
        //  А может это будет обертка над вьюхой, позволяющая драгать и
        //  регистрирующая все события.
        TCompatibilityForUndoneAspects;

export const NEW_BASE_CONTROL_DEFAULT_OPTIONS = {
    markerVisibility: 'onactivated',
    markerStrategy: SingleColumnStrategy,
};

// Класс для очистки BaseControl от всего кода.
// Обеспечивает отстрел событий, которых нет в Controls-Lists (никаких там нет, только _bAS);
// обеспечивает работу в безслайсовой схеме.
export class BaseControlComponent<
    TProps extends TBaseControlComponentProps,
    //eslint-disable-next-line max-len
    TCompatibilityForUndoneAspects extends
        TBaseControlCompatibilityForUndoneAspects = TBaseControlCompatibilityForUndoneAspects,
    TSlicelessCompatibility extends
        TSlicelessBaseControlCompatibility = TSlicelessBaseControlCompatibility,
> extends React.Component<TProps, any> {
    private _alaListConnectedHandlers: TAlaListConnectedHandlers;
    private _compatibilityForUndoneAspects: TCompatibilityForUndoneAspects;
    private _slicelessHandlers: Partial<TSlicelessCompatibility>;
    private _isControlDividedWithSliceRef: { current: boolean } = { current: false };
    private _contextConsumerModule: React.Component | undefined;

    protected get isControlDividedWithSlice(): boolean {
        return this._isControlDividedWithSliceRef.current;
    }

    constructor(props: TProps) {
        super(props);
        this._alaListConnectedHandlers = this._getAlaListConnectedHandlers();
        this._compatibilityForUndoneAspects = this._getCompatibilityForUndoneAspects();
        this._slicelessHandlers = this._getWrappedSlicelessHandlers();
        this._contextConsumerModule = this._getContextConsumerModule();
    }

    //#region TAlaListConnectedHandlers
    private _setCollection(collection: Collection, isOnInit?: boolean): boolean {
        // Слой совместимости создается во всех списках с BaseControl,
        // но не все списки рождаются в слайсе пока
        let hasCollection: boolean;

        // Устанавливает коллекцию в слайс.
        // Вызывает переданный в параметрах callback, если коллекция устанавливается впервые.
        // Актуально в табах и SPA переходах, когда список обновляется, а слайс ремаунтится
        const setCollectionInSlice = (doOnFirstSetCallback: () => void) => {
            const isEmptyCollectionBeforeSet = this.props?.slice?._collection === undefined;
            hasCollection = !!this.props.setCollection(collection, isOnInit);
            if (isOnInit === false && hasCollection && isEmptyCollectionBeforeSet) {
                doOnFirstSetCallback();
            }
        };

        // Установка в коллекцию актуального состояния.
        // В некоторых сценариях, коллекция и отображение обновляются,
        // а не пересоздаются, в отличие от контроллера списка (Slice).
        // В таких случаях, коллекция может находиться в неактуальном состоянии.
        const doOnFirstSet = () => {
            // https://online.sbis.ru/doc/75d7472f-53d2-406a-b6ed-014207a5b375?client=3
            const isExpandedItemsEmpty = !this.props?.slice?.state?.expandedItems?.length;
            if (isExpandedItemsEmpty) {
                collection?.setExpandedItems?.([]);
            }

            // https://online.sbis.ru/opendoc.html?guid=dcc8982e-1840-4895-9c6a-6369ab8bb244&client=3
            const sliceMarkedKey = this.props?.slice?.state?.markedKey;
            if (sliceMarkedKey !== collection.getMarkedKey()) {
                collection.setMarkedKey(sliceMarkedKey);
            }

            // https://online.sbis.ru/opendoc.html?guid=23b2d197-3a88-49f3-b44b-25d9d085057b&client=3
            const sliceRoot = this.props?.slice?.state?.root;
            if (collection?.getRoot && sliceRoot !== collection?.getRoot?.()) {
                collection?.setRoot?.(sliceRoot);
            }
        };

        if (this.props.hasSlice) {
            setCollectionInSlice(doOnFirstSet);
        } else {
            hasCollection = false;
        }

        // НЕ ВЫЗЫВАЕТ СИНХРОНИЗАЦИЮ.
        // В теории, это и не требуется.
        // Метод setCollection должен вызываться списком до всех методов.
        // Сами методы внутри себя проверяют, могут ли они работать по слайсу.
        this._isControlDividedWithSliceRef.current = helpers.isControlDividedWithSlice({
            useCollection: this.props.useCollection,
            hasCollection,
            hasSlice: this.props.hasSlice,
            isFromBaseControl: true,
        });
        return hasCollection;
    }

    protected _mark(
        newMarkedKey: CrudEntityKey,
        control: TBaseControl,
        options: IBaseControlOptions
    ) {
        if (options.markerVisibility === 'hidden') {
            return;
        }

        if (this.isControlDividedWithSlice) {
            const item = control.getViewModel().getItemBySourceKey(newMarkedKey);
            // Не нужно ставить маркер, если провалились в папку
            // Но markedKey нужно изменить, если маркер сбросили
            if (
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                (options.markerMoveMode === 'leaves' && item && item.isNode() !== null) ||
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                ((options.canMoveMarker ? !options.canMoveMarker() : false) &&
                    options.markerVisibility !== 'visible' &&
                    newMarkedKey !== null &&
                    newMarkedKey !== undefined)
            ) {
                return;
            }

            if (newMarkedKey === undefined || newMarkedKey === this.props.markedKey) {
                return;
            }

            return markerNotification.beforeMarkedKeyChanged(
                newMarkedKey,
                control,
                options,
                (key) => {
                    // Прикладники могут как передавать значения в markedKey, так и передавать undefined.
                    // И при undefined нужно делать так, чтобы markedKey задавался по нашей логике.
                    // Это для трюка от Бегунова когда делают bind на переменную, которая изначально undefined.
                    // В таком случае, чтобы не было лишних синхронизаций - мы работаем по нашему внутреннему state.
                    if (options.markedKey === undefined) {
                        // TODO: Большой вопрос, надо ли тут устанавливать!!!
                        this.props.mark(newMarkedKey);
                    }

                    markerNotification.markedKeyChanged(key, control, options);
                }
            );
        } else {
            return getDeprecatedCode().OldBaseControlLogic.changeMarkedKey(
                control,
                options,
                newMarkedKey
            );
        }
    }

    private _onItemClickNew(
        e: React.MouseEvent,
        item: Model | Model[],
        control: TBaseControl,
        options: IBaseControlOptions
    ): void {
        compatibilityWithEditInPlaceOnClick(control, options, item, e, (key: CrudEntityKey) => {
            // FIXME: Расхождение, тут нужно звать props.onItemClickNew!
            //  Как подцепить туда отстрел событиями?
            //  Вероятно, передавать туда параметрами методы mark, setRoot и другие.
            //  this.props.onItemClickNew(key, {
            //      mark: (key) => this._mark(key, control, options),
            //      setRoot: (key) => this._setRoot(key, control, options),
            //  })
            //  Так сделано в _onActivated
            this._mark(key, control, options);
        });
    }

    // FIXME: Переименовать в connect. Сам данный код должен быть в коннекторе/слайсе.
    private _onListMounted(control: TBaseControl, options: IBaseControlOptions): void {
        if (this.isControlDividedWithSlice) {
            const collection = control.getViewModel();
            const markedItem =
                collection.getCount() && collection.getItems().find((i) => i.isMarked());

            if (markedItem && markedItem.key !== options.getMarkedKeyCompatible(control, options)) {
                this._mark(markedItem.key, control, options);
            }
        }
    }

    private _onActivatedNew(
        params: {
            isTabPressed: boolean;
            isShiftKey: boolean;
            key?: React.KeyboardEvent['key'];
        },
        control: TBaseControl,
        options: IBaseControlOptions
    ) {
        const canMarkItemOnActivate = () => {
            // Тут передаются дополнительные проверки, которые затрагивают еще непереведенные аспекты,
            // например редактирование и старые васаби контексты.
            const model = control.getViewModel();
            return control.context?.workByKeyboard && !!model?.getCount() && !control.isEditing();
        };
        if (this.isControlDividedWithSlice) {
            this.props.onActivated(params, canMarkItemOnActivate, (key) => {
                this._mark(key, control, options);
            });
        } else {
            getDeprecatedCode().OldBaseControlLogic.onActivated(
                params,
                canMarkItemOnActivate,
                control,
                options
            );
        }
    }

    private _onViewKeyDownArrowUpNew(
        e: React.KeyboardEvent,
        control: TBaseControl,
        options: IBaseControlOptions
    ): void {
        moveMarkerToDirection(
            e,
            'Up',
            this.isControlDividedWithSlice ? this.props : options,
            control,
            this.isControlDividedWithSlice
        );
    }

    private _onViewKeyDownArrowDownNew(
        e: React.KeyboardEvent,
        control: TBaseControl,
        options: IBaseControlOptions
    ) {
        moveMarkerToDirection(
            e,
            'Down',
            this.isControlDividedWithSlice ? this.props : options,
            control,
            this.isControlDividedWithSlice
        );
    }

    private _onViewKeyDownArrowLeftNew(
        e: React.KeyboardEvent,
        control: TBaseControl,
        options: IBaseControlOptions
    ) {
        if (!options.disableHorizontalMarkerDirection) {
            moveMarkerToDirection(
                e,
                'Left',
                this.isControlDividedWithSlice ? this.props : options,
                control,
                this.isControlDividedWithSlice
            );
        }
    }

    private _onViewKeyDownArrowRightNew(
        e: React.KeyboardEvent,
        control: TBaseControl,
        options: IBaseControlOptions
    ) {
        if (!options.disableHorizontalMarkerDirection) {
            moveMarkerToDirection(
                e,
                'Right',
                this.isControlDividedWithSlice ? this.props : options,
                control,
                this.isControlDividedWithSlice
            );
        }
    }

    private _onViewKeyDownSpaceNew(
        e: React.KeyboardEvent,
        control: TBaseControl,
        options: IBaseControlOptions,
        cb: (key: CrudEntityKey) => void
    ) {
        if (
            // TODO: Это унести на аспект, когда будут мидлвары уже.
            options.multiSelectVisibility === 'hidden' ||
            options.markerVisibility === 'hidden' ||
            control._spaceBlocked
        ) {
            return;
        }

        // TODO: Это унести на ListContainerConnected.
        let key = options.getMarkedKeyCompatible(control, options);
        if (key === null || key === undefined) {
            const collection = control.getViewModel();
            const strategy = MarkerUILogic.getMarkerStrategy(collection);
            key = strategy.oldGetNextMarkedKey(collection, 0);
        }

        if (key) {
            cb(key);
        }

        moveMarkerToDirection(
            e,
            'Forward',
            this.isControlDividedWithSlice ? this.props : options,
            control,
            this.isControlDividedWithSlice
        );
    }

    protected _onViewKeyDownDelNew(
        e: React.KeyboardEvent,
        control: TBaseControl,
        options: IBaseControlOptions
    ) {
        // Пока список без BaseControl не умеет в ItemActions.
        // Поэтому код, который ищет action=delete и пытается его выполнить - общий.
        const markedKey = this._getMarkedKeyCompatible(control, options);
        const itemIsCheckedForMultiSelect =
            options.selectedKeys?.length && options.multiSelectVisibility === 'visible';
        if (!itemIsCheckedForMultiSelect) {
            callDeleteItemAction(e, control, options, markedKey);
        } else {
            // Если есть выделение в multiSelect, нужно вызвать действие ПМО.
            if (this.isControlDividedWithSlice) {
                this.props.onViewKeyDownDelNew(e);
            } else {
                getDeprecatedCode().OldBaseControlLogic.callDeleteToolbarAction(options);
            }
            // Стопаем событие, чтобы оно не летело выше списка.
            // Иначе при обёртке в HotkeysContainer получим две обработки события.
            e.stopPropagation();
        }
    }

    protected _resetExpansion(_control: TBaseTreeControl, _options: IBaseTreeControlOptions): void {
        // see #remark1
    }

    protected _isExpanded(
        _keys: CrudEntityKey,
        _treeControl: TBaseTreeControl,
        _options: IBaseTreeControlOptions
    ): boolean {
        // see #remark1
        return false;
    }

    protected _isExpandAll(
        _keys: TKey[] | undefined,
        _treeControl: TBaseTreeControl,
        _options: IBaseTreeControlOptions
    ): boolean {
        // see #remark1
        return false;
    }

    protected _toggleExpansion(
        _key: CrudEntityKey,
        _props: TOnToggleExpansionParams | undefined,
        _treeControl: TBaseTreeControl,
        _options: IBaseTreeControlOptions
    ): Promise<void> {
        // see #remark1
        return Promise.resolve();
    }

    protected _onExpanderClick(
        _key: CrudEntityKey,
        _props: TOnToggleExpansionParams | undefined,
        _treeControl: TBaseTreeControl,
        _options: IBaseTreeControlOptions
    ): void {
        // see #remark1
    }

    protected _expand(
        _key: CrudEntityKey,
        _props: TOnToggleExpansionParams | undefined,
        _treeControl: TBaseTreeControl,
        _options: IBaseTreeControlOptions
    ): Promise<void> {
        // see #remark1
        return Promise.resolve();
    }

    protected _collapse(
        _key: CrudEntityKey,
        _props: TOnToggleExpansionParams | undefined,
        _treeControl: TBaseTreeControl,
        _options: IBaseTreeControlOptions
    ): Promise<void> {
        // see #remark1
        return Promise.resolve();
    }

    //#endregion TAlaListConnectedHandlers

    //#region TCompatibilityForUndoneAspects

    private _isSourceControllerLoadingNow(
        _control: TBaseControl,
        options: IBaseControlOptions
    ): boolean {
        if (this.isControlDividedWithSlice && typeof this.props.loading !== 'undefined') {
            return this.props.loading;
        }

        return !!options.sourceController && options.sourceController.isLoading();
    }

    // FIXME: Переделать на геттер markedKey,
    //  должно синхронизироваться в каждой схеме одинаково.
    private _getMarkedKeyCompatible(
        control: TBaseControl,
        options: IBaseControlOptions
    ): CrudEntityKey | undefined | null {
        return this.isControlDividedWithSlice
            ? this.props.markedKey
            : getDeprecatedCode().OldBaseControlLogic.getMarkedKey(control, options);
    }

    private _onViewDragStartCompatible(
        key: CrudEntityKey,
        control: TBaseControl,
        options: IBaseControlOptions
    ): void {
        this._mark(key, control, options);
    }

    private _onAfterPagingCompatible(
        key: CrudEntityKey,
        control: TBaseControl,
        options: IBaseControlOptions
    ): void {
        // TODO: Это в ListContainerConnected
        const collection = control.getViewModel();
        const strategy = MarkerUILogic.getMarkerStrategy(collection, {
            moveMarkerOnScrollPaging: options.moveMarkerOnScrollPaging,
        });

        if (strategy.shouldMoveMarkerOnScrollPaging()) {
            const record = collection.getSourceItemByKey(key);
            const item = collection.getItemBySourceKey(key);

            const getSuitableMarkedKey = () => {
                const index = collection.getIndex(item);
                const nextMarkedKey = strategy.oldGetNextMarkedKey(collection, index);
                return nextMarkedKey === null
                    ? options.getMarkedKeyCompatible(control, options)
                    : nextMarkedKey;
            };
            const suitableKey = record ? key : item && getSuitableMarkedKey();
            this._mark(suitableKey || key, control, options);
        }
    }

    private _onAfterEndEditCallbackCompatible(
        item: IEditableCollectionItem,
        isAdd: boolean,
        willSave: boolean,
        control: TBaseControl,
        options: IBaseControlOptions
    ): void {
        const collection = control.getViewModel();
        if (collection.getCount() > 1) {
            if (control._markedKeyAfterEditing) {
                // если закрыли добавление записи кликом по другой записи, то маркер должен встать на 'другую' запись
                this._mark(control._markedKeyAfterEditing, control, options);
                control._markedKeyAfterEditing = undefined;
            } else if (isAdd && willSave) {
                this._mark(item.contents.getKey(), control, options);
            } else {
                if (this.isControlDividedWithSlice) {
                    this._mark(
                        // @ts-ignore
                        this._getMarkedKeyCompatible(control, options),
                        control,
                        options
                    );
                } else {
                    getDeprecatedCode().OldBaseControlLogic.setMarkerFromControllerIfExists(
                        control,
                        options
                    );
                }
            }
        }
    }

    //#endregion TCompatibilityForUndoneAspects

    protected _getContextConsumerModule(): React.Component | undefined {
        if (isLoaded('Controls/gridColumnScroll')) {
            return loadSync<typeof import('Controls/gridColumnScroll')>('Controls/gridColumnScroll')
                .WasabyGridContextCompatibilityConsumer;
        }
    }

    protected reload(
        sourceConfigOption?: INavigationSourceConfig,
        keepNavigation: boolean = false,
        cancelEditPromise: Promise<[boolean, boolean]>,
        control: TBaseControl,
        options: IBaseTreeControlOptions
    ): Promise<unknown> {
        return cancelEditPromise.then(([isDestroyed, isEndEditingProcessing]) => {
            if (!isDestroyed) {
                if (this.isControlDividedWithSlice) {
                    return this.props.reload(sourceConfigOption, keepNavigation);
                } else {
                    return control._reload(
                        options,
                        sourceConfigOption,
                        isEndEditingProcessing,
                        keepNavigation
                    );
                }
            }
        });
    }

    protected _loadItemsToDirection(
        direction: ScrollControllerLib.IDirection,
        addItemsAfterLoad?: boolean,
        useServicePool?: boolean,
        control: TBaseControl
    ) {
        if (this.isControlDividedWithSlice) {
            const isInverted = control._itemsOrder && control._itemsOrder !== 'default';
            const mapDirection: Record<
                ScrollControllerLib.IDirection,
                ScrollControllerLib.IDirection
            > = {
                up: isInverted ? 'down' : 'up',
                down: isInverted ? 'up' : 'down',
            };

            return this.props._loadItemsToDirection(
                mapDirection[direction],
                addItemsAfterLoad,
                useServicePool
            );
        } else {
            return control._loadItemsToDirectionInner(direction, addItemsAfterLoad, useServicePool);
        }
    }

    protected _setPreloadedItems(
        items: RecordSet,
        direction: ScrollControllerLib.IDirection,
        control: TBaseControl
    ): Promise<void> {
        if (this.isControlDividedWithSlice) {
            return this.props._setPreloadedItems(items, direction);
        } else {
            control._options.dataLoadCallback?.(items, direction);
            control._sourceController.prependItems(items);
            return Promise.resolve();
        }
    }

    render() {
        const compatibility: TOldBaseControlCompatibility<
            TBaseControlCompatibilityForUndoneAspects,
            TSlicelessBaseControlCompatibility
        > = {
            ...this._alaListConnectedHandlers,
            ...this._compatibilityForUndoneAspects,
            ...this._slicelessHandlers,
        };
        const WasabyGridContextCompatibilityConsumer = this._contextConsumerModule;
        if (WasabyGridContextCompatibilityConsumer && this.props._useReactScrollContexts) {
            return (
                <WasabyGridContextCompatibilityConsumer>
                    {React.cloneElement(this.props.children, {
                        ...this.props,
                        ...compatibility,
                    })}
                </WasabyGridContextCompatibilityConsumer>
            );
        } else {
            return React.cloneElement(this.props.children, {
                ...this.props,
                ...compatibility,
            });
        }
    }

    protected _getAlaListConnectedHandlers(): TAlaListConnectedHandlers {
        return {
            setCollection: this._setCollection.bind(this),
            mark: this._mark.bind(this),
            isExpanded: this._isExpanded.bind(this),
            isExpandAll: this._isExpandAll.bind(this),
            expand: this._expand.bind(this),
            collapse: this._collapse.bind(this),
            toggleExpansion: this._toggleExpansion.bind(this),
            resetExpansion: this._resetExpansion.bind(this),
            reload: this.reload.bind(this),
            _loadItemsToDirection: this._loadItemsToDirection.bind(this),
            _setPreloadedItems: this._setPreloadedItems.bind(this),
            onExpanderClick: this._onExpanderClick.bind(this),
            onItemClickNew: this._onItemClickNew.bind(this),
            onListMounted: this._onListMounted.bind(this),
            onActivatedNew: this._onActivatedNew.bind(this),
            onViewKeyDownArrowUpNew: this._onViewKeyDownArrowUpNew.bind(this),
            onViewKeyDownArrowDownNew: this._onViewKeyDownArrowDownNew.bind(this),
            onViewKeyDownArrowLeftNew: this._onViewKeyDownArrowLeftNew.bind(this),
            onViewKeyDownArrowRightNew: this._onViewKeyDownArrowRightNew.bind(this),
            onViewKeyDownSpaceNew: this._onViewKeyDownSpaceNew.bind(this),
            onViewKeyDownDelNew: this._onViewKeyDownDelNew.bind(this),

            // В текущих списка с BaseControl скролл пока продолжает работать как раньше.
            // Колбек не прокидываем.
            // Нужно занулять, т.к. View затачивается на наличие этого колбека (по-разному строит триггеры).
            onViewTriggerVisibilityChanged: undefined,
        };
    }

    protected _getCompatibilityForUndoneAspects(): TCompatibilityForUndoneAspects {
        return {
            getMarkedKeyCompatible: this._getMarkedKeyCompatible.bind(this),
            isSourceControllerLoadingNow: this._isSourceControllerLoadingNow.bind(this),
            onViewDragStartCompatible: this._onViewDragStartCompatible.bind(this),
            onAfterPagingCompatible: this._onAfterPagingCompatible.bind(this),
            onAfterEndEditCallbackCompatible: this._onAfterEndEditCallbackCompatible.bind(this),
        } as TCompatibilityForUndoneAspects;
    }

    private _getWrappedSlicelessHandlers(): Partial<TSlicelessCompatibility> {
        const handlers = this._getSlicelessHandlers();
        // Мы НЕ проверям, можем ли работать по слайсу, т.к. одна из частей условия,
        // когда работа по слайсу возможна - это наличие коллекции в слайсе.
        // В старых списках(считай всех списках), коллекция устанавливается при маунте BaseControl.
        // Данный компонент - обертка над baseControl.
        // При построении компонента this.isControlDividedWithSlice всегда вернет false.
        // Поэтому мы смотрим на загруженность библиотеки со старым кодом.
        if (!handlers) {
            // Загрузить старый код - это ответственность OldDataContainer.
            return {};
        }
        return Object.keys(handlers).reduce((proxy, currentKey) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            proxy[currentKey] = (...args) => {
                if (!this.isControlDividedWithSlice) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    return handlers[currentKey](...args);
                }
            };
            return proxy;
        }, {} as TSlicelessCompatibility);
    }

    protected _getSlicelessHandlers(): Partial<TSlicelessCompatibility> | undefined {
        if (!isLoaded('Controls/listDataOld')) {
            return {};
        }
        return getDeprecatedCode()
            .SlicelessBaseControlCompatibility as Partial<TSlicelessCompatibility>;
    }
}

function moveMarkerToDirection(
    event: React.KeyboardEvent,
    direction: TMarkerMoveDirection,
    props: TBaseControlComponentProps | IBaseControlOptions,
    control: TBaseControl,
    isControlDividedWithSlice: boolean
): void {
    const collection = control.getViewModel();
    if (props.markerVisibility !== 'hidden' && !!collection?.getCount()) {
        const isMovingForward =
            direction === 'Forward' || direction === 'Right' || direction === 'Down';
        // activate list when marker is moving. It let us press enter and open current row
        // must check mounted to avoid fails on unit tests
        if (control._mounted) {
            control.activate();
        }

        // чтобы предотвратить нативный подскролл
        // https://online.sbis.ru/opendoc.html?guid=c470de5c-4586-49b4-94d6-83fe71bb6ec0
        event.preventDefault();

        // TODO: Вкорячить новую стратегию, там какая то ошибка, в марте.
        //  Этот код уезжает в ListContainerConnected.
        const strategy = MarkerUILogic.getMarkerStrategy(control.getViewModel());
        const collection = control.getViewModel();
        let newMarkedKey;
        const currentMarkedKey = isControlDividedWithSlice
            ? props.markedKey
            : getDeprecatedCode()
                  .SlicelessBaseControlCompatibility.slicelessGetMarkerController(
                      control,
                      props as IBaseControlOptions
                  )
                  .getMarkedKey();
        const index =
            typeof currentMarkedKey === 'undefined'
                ? -1
                : collection.getIndex(collection.getItemBySourceKey(currentMarkedKey));
        if (direction === 'Backward') {
            newMarkedKey = strategy.oldGetPrevMarkedKey(collection, index - 1);
        } else if (direction === 'Forward') {
            newMarkedKey = strategy.oldGetNextMarkedKey(collection, index + 1);
        } else {
            newMarkedKey = strategy.oldGetMarkedKeyByDirection(collection, index, direction);
        }

        if (newMarkedKey === null) {
            newMarkedKey = currentMarkedKey;
        }

        control._onBeforeMoveMarkerToDirection(
            newMarkedKey,
            {
                isChanged: newMarkedKey !== currentMarkedKey,
                isMovingForward,
            },
            () => {
                moveMarkerToDirection(event, direction, props, control, isControlDividedWithSlice);
            }
        );
    }
}

function compatibilityWithEditInPlaceOnClick(
    control: TBaseControl,
    options: IBaseControlOptions,
    contents: Model | Model[],
    originalEvent: React.MouseEvent,
    cb: (key: CrudEntityKey) => void
) {
    const key = getKey(contents);
    // При клике в хлебную крошку её id может отсутствовать в текущей поисковой модели,
    // Отдадим в  _needSetMarkerCallback оригинальную запись, по которой кликнули.
    const itemContents = control.getViewModel().getItemBySourceKey(key)?.getContents() || contents;

    // Проставляем маркер по клику, т.к. если поставить маркер на mousedown или mouseup,
    // то маркер успеет отрисоваться до клика.
    // В кейсе, когда маркированная запись стикается, клика не произойдет, т.к. изменится ДОМ дерево.
    // https://online.sbis.ru/opendoc.html?guid=8f7389a3-5048-4475-9f4d-3005db119738&client=3
    let canBeMarked = true;

    // TODO изабвиться по задаче https://online.sbis.ru/opendoc.html?guid=f7029014-33b3-4cd6-aefb-8572e42123a2
    // Колбэк передается из explorer.View, чтобы не проставлять маркер перед проваливанием в узел
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (options._needSetMarkerCallback) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        canBeMarked = canBeMarked && options._needSetMarkerCallback(itemContents, originalEvent);
    }
    if (canBeMarked) {
        // маркер устанавливается после завершения редактирования
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (control._editInPlaceController?.isEditing()) {
            // TODO нужно перенести установку маркера на клик, т.к. там выполняется проверка для редактирования
            control._markedKeyAfterEditing = key;
        } else {
            cb(key);
        }
    }
}

type TListDataOld = typeof import('Controls/listDataOld');

function getDeprecatedCode(): Pick<
    TListDataOld,
    'SlicelessBaseControlCompatibility' | 'OldBaseControlLogic'
> {
    return loadSync<TListDataOld>('Controls/listDataOld');
}

/*
 * Вызывает обработчик действия удаления записи, на которой стоит маркер.
 * (Используется при обработске нажатия клавиши Del)
 */
export function callDeleteItemAction(
    event: React.KeyboardEvent,
    control: TBaseControl,
    options: IBaseControlOptions,
    markedKey?: CrudEntityKey | null
): boolean {
    // Пока оставляем для совместимости delete (его используют),
    // но правильно будет использовать remove, чтобы в тулбаре и в itemActions
    // идентификаторы совпадали.
    const REMOVE_ACTION_KEYS = ['delete', 'remove'];
    const model = control.getViewModel();
    let item: CollectionItem<Model>;
    let deleteAction;

    // For single marked item we should call ItemAction handler.
    if (markedKey !== null && markedKey !== undefined) {
        item = model.getItemBySourceKey(markedKey);
        let itemActions = item.getActions();
        // Если itemActions были не проинициализированы, то пытаемся их проинициализировать
        if (!itemActions) {
            if (options.itemActionsVisibility !== 'visible') {
                // Пока делаем вызов приватного метода из BaseControl,
                // иначе необходимо тащить за собой половину кода.
                // Поменять, когда в BaseControl не останется ItemActions.
                control._updateItemActions(options);
            }
            itemActions = item.getActions();
        }
        if (itemActions) {
            deleteAction = itemActions.all.find((itemAction: IItemAction) => {
                return (
                    itemAction.id === REMOVE_ACTION_KEYS[0] ||
                    itemAction.id === REMOVE_ACTION_KEYS[1]
                );
            });
            // Имитируем клик по действию 'delete'
            if (deleteAction) {
                // Пока делаем вызов приватного метода из BaseControl,
                // иначе необходимо тащить за собой половину кода.
                // Поменять, когда в BaseControl не останется ItemActions.
                control._handleItemActionClick(deleteAction, event, item, false);
                event.stopPropagation();
                return true;
            }
        }
    }
    return false;
}

// #remark1
// Совместимость делится по типу списка, в плоском рождается эта,
// а в дереве - наследник этой для дерева.
// Коннектор же один на все списки.
// Поэтому TAlaListConnectedHandlers будет содержать методы
// как для дерева, так и для плоского списка.

export default BaseControlComponent;
