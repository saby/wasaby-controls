import { CrudEntityKey } from 'Types/source';
import type { default as TBaseControl, IBaseControlOptions } from '../BaseControl';
import { MarkerController } from 'Controls/marker';
import { checkWasabyEvent } from 'UI/Events';
import { CollectionItem, IEditableCollectionItem } from 'Controls/display';
import { SyntheticEvent } from 'UICommon/Events';
import { Model } from 'Types/entity';
import { getKey } from 'Controls/_baseList/resources/utils/helpers';
import { IObservable } from 'Types/collection';

type TMarkerMoveDirection = 'Down' | 'Up' | 'Left' | 'Right' | 'Forward' | 'Backward';

// TODO:MARKER TO SLICE

export type TMarkerCompatibility = {
    slicelessHasMarkerController(control: TBaseControl): boolean;
    slicelessGetMarkerController(
        control: TBaseControl,
        options?: IBaseControlOptions
    ): MarkerController;
    slicelessSetMarkedKeyAfterPaging(
        control: TBaseControl,
        options: IBaseControlOptions,
        key: CrudEntityKey
    ): void;
    slicelessChangeMarkedKey(
        control: TBaseControl,
        options: IBaseControlOptions,
        newMarkedKey: CrudEntityKey,
        shouldFireEvent?: boolean
    ): Promise<CrudEntityKey> | CrudEntityKey;

    slicelessBeforeMountAsyncQueue(control: TBaseControl, options: IBaseControlOptions): void;
    slicelessAfterMount(control: TBaseControl, options: IBaseControlOptions): void;
    slicelessSetMarkerAfterEndEditCallback(
        control: TBaseControl,
        options: IBaseControlOptions,
        item: IEditableCollectionItem,
        isAdd: boolean,
        willSave: boolean
    ): void;

    slicelessOnActivated(
        control: TBaseControl,
        options: IBaseControlOptions,
        eventOptions?: {
            isTabPressed: boolean;
            isShiftKey: boolean;
            keyPressedData?: {
                key: string;
            };
        }
    ): void;

    slicelessMoveMarkerToDirection(
        control: TBaseControl,
        options: IBaseControlOptions,
        event: SyntheticEvent,
        direction: TMarkerMoveDirection
    ): void;

    slicelessSpaceHandler(
        control: TBaseControl,
        options: IBaseControlOptions,
        event: SyntheticEvent,
        doBeforeMoveMarker: (key: CrudEntityKey) => void
    ): void;

    slicelessOnKeyDownLeft(
        control: TBaseControl,
        options: IBaseControlOptions,
        event: SyntheticEvent,
        canMoveMarker?: boolean
    ): void;

    slicelessOnKeyDownRight(
        control: TBaseControl,
        options: IBaseControlOptions,
        event: SyntheticEvent,
        canMoveMarker?: boolean
    ): void;

    slicelessGetBeforeUpdateSteps(
        control: TBaseControl,
        options: IBaseControlOptions,
        params: {}
    ): {
        stepOne: () => void;
        stepTwo: () => void;
        stepThree: (
            oldOptions: IBaseControlOptions,
            params: {
                modelRecreated: boolean;
                isPortionedLoad: boolean;
            }
        ) => void;
    };
    slicelessSetMarkerOnItemClick(
        control: TBaseControl,
        options: IBaseControlOptions,
        contents: Model | Model[],
        originalEvent: MouseEvent
    ): void;

    slicelessHandleCollectionChange(
        control: TBaseControl,
        options: IBaseControlOptions,
        action: string,
        newItems: CollectionItem<Model>[],
        newItemsIndex: number,
        removedItems: CollectionItem<Model>[],
        removedItemsIndex: number
    ): void;
};

function slicelessHasMarkerController(control: TBaseControl) {
    return !!control._markerController;
}

function slicelessGetMarkerController(
    control: TBaseControl,
    options: IBaseControlOptions = control._options
): MarkerController {
    if (!slicelessHasMarkerController(control)) {
        control._markerController = new MarkerController({
            model: control._listViewModel,
            markerVisibility: options.markerVisibility,
            markedKey: options.markedKey,
            markerStrategy: options.markerStrategy,
            moveMarkerOnScrollPaging: options.moveMarkerOnScrollPaging,
        });
    }
    return control._markerController;
}

function slicelessChangeMarkedKey(
    control: TBaseControl,
    options: IBaseControlOptions,
    newMarkedKey: CrudEntityKey,
    shouldFireEvent: boolean = false
): Promise<CrudEntityKey> | CrudEntityKey {
    const item = control.getViewModel().getItemBySourceKey(newMarkedKey);
    // Не нужно ставить маркер, если провалились в папку
    // Но markedKey нужно изменить, если маркер сбросили
    if (
        (options.markerMoveMode === 'leaves' && item && item.isNode() !== null) ||
        ((options.canMoveMarker ? !options.canMoveMarker() : false) &&
            options.markerVisibility !== 'visible' &&
            newMarkedKey !== null &&
            newMarkedKey !== undefined)
    ) {
        return;
    }

    const markerController = slicelessGetMarkerController(control);
    if (
        (newMarkedKey === undefined || newMarkedKey === markerController.getMarkedKey()) &&
        !shouldFireEvent
    ) {
        return newMarkedKey;
    }

    // если список не замаунчен, то не нужно кидать события, события кинем после маунта
    const eventResult: Promise<CrudEntityKey> | CrudEntityKey = control._isMounted
        ? options.notifyCallback('beforeMarkedKeyChanged', [newMarkedKey])
        : undefined;

    const handleResult = (key) => {
        // Прикладники могут как передавать значения в markedKey, так и передавать undefined.
        // И при undefined нужно делать так, чтобы markedKey задавался по нашей логике.
        // Это для трюка от Бегунова когда делают bind на переменную, которая изначально undefined.
        // В таком случае, чтобы не было лишних синхронизаций - мы работаем по нашему внутреннему state.
        if (options.markedKey === undefined) {
            markerController.setMarkedKey(key);
        }

        // если список не замаунчен, то не нужно кидать события, события кинем после маунта
        if (control._isMounted) {
            checkWasabyEvent(options.onMarkedKeyChanged)?.(key);
            options.notifyCallback('markedKeyChanged', [key]);
        }
    };

    let result = eventResult;
    if (eventResult instanceof Promise) {
        eventResult.then((key) => {
            handleResult(key);
            return key;
        });
    } else if (eventResult !== undefined && (control._environment || control.UNSAFE_isReact)) {
        // Если не был инициализирован environment, то _notify будет возвращать null,
        // но это значение используется, чтобы сбросить маркер. Актуально для юнитов
        handleResult(eventResult);
    } else {
        result = newMarkedKey;
        handleResult(newMarkedKey);
    }

    return result;
}

/**
 * Определяет, следует ли ставить маркер на первую запись при активации списка.
 * Работает в контексте работы с клавиатуры (WorkByKeyboardContext).
 * @private
 */
function canMarkItemOnActivate(control: TBaseControl, options: IBaseControlOptions): boolean {
    const model = control.getViewModel();
    return (
        control.context?.workByKeyboard &&
        options.markerVisibility === 'onactivated' &&
        !!model?.getCount() &&
        !control.isEditing() &&
        model.getIndexByKey(slicelessGetMarkerController(control).getMarkedKey()) === -1
    );
}

function slicelessMoveMarkerToDirection(
    control: TBaseControl,
    options: IBaseControlOptions,
    event: SyntheticEvent,
    direction: TMarkerMoveDirection
): void {
    if (
        options.markerVisibility !== 'hidden' &&
        control._listViewModel &&
        control._listViewModel.getCount()
    ) {
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

        const controller = slicelessGetMarkerController(control);
        let newMarkedKey;
        if (direction === 'Backward') {
            newMarkedKey = controller.getPrevMarkedKey();
        } else if (direction === 'Forward') {
            newMarkedKey = controller.getNextMarkedKey();
        } else {
            newMarkedKey = controller.getMarkedKeyByDirection(direction);
        }

        if (newMarkedKey === controller.getMarkedKey()) {
            // это значит что мы дошли до последней записи, нужно проскроллить в самый конец, чтобы сработал триггер
            const loadDirection = isMovingForward ? 'down' : 'up';
            const edgeDirection = loadDirection === 'down' ? 'forward' : 'backward';
            const shouldScrollToEdge =
                (control._hasMoreData(loadDirection) || control._hasItemsOutRange[edgeDirection]) &&
                control._isInfinityNavigation();
            if (shouldScrollToEdge) {
                control._listVirtualScrollController.scrollToEdge(edgeDirection);
                control._doAfterDrawItems = () => {
                    slicelessMoveMarkerToDirection(control, options, event, direction);
                };
            }
        } else {
            const scrollToItem = (key) => {
                const index = control._listViewModel.getIndexByKey(key);
                // У первой записи может быть марджин, поэтому нужно скроллить к началу списка, чтобы тень скрылась.
                if (index === 0 && !control._hasMoreData('up')) {
                    return control._scrollToElement(control._container, 'top', false);
                }

                const position = isMovingForward ? 'bottom' : 'top';
                return control.scrollToItem(key, position, false);
            };

            const result = slicelessChangeMarkedKey(control, options, newMarkedKey);
            if (result instanceof Promise) {
                result.then((key) => {
                    return scrollToItem(key);
                });
            } else if (result !== undefined) {
                scrollToItem(result);
            }
        }
    }
}

function slicelessSetMarkedKeyAfterPaging(
    control: TBaseControl,
    options: IBaseControlOptions,
    key: CrudEntityKey
): void {
    const markerController = slicelessGetMarkerController(control);
    if (markerController.shouldMoveMarkerOnScrollPaging()) {
        const record = control._listViewModel.getSourceItemByKey(key);
        const item = control._listViewModel.getItemBySourceKey(key);
        const suitableKey = record ? key : item && markerController.getSuitableMarkedKey(item);
        slicelessChangeMarkedKey(control, options, suitableKey || key);
    }
}

function slicelessAfterMount(control: TBaseControl, options: IBaseControlOptions): void {
    // TODO удалить после того как избавимся от onactivated
    if (slicelessHasMarkerController(control)) {
        const newMarkedKey = slicelessGetMarkerController(control).getMarkedKey();
        if (newMarkedKey !== options.markedKey) {
            slicelessChangeMarkedKey(control, options, newMarkedKey, true);
        }
    }
}

function slicelessSetMarkerAfterEndEditCallback(
    control: TBaseControl,
    options: IBaseControlOptions,
    item: IEditableCollectionItem,
    isAdd: boolean,
    willSave: boolean
): void {
    if (control._listViewModel.getCount() > 1) {
        if (control._markedKeyAfterEditing) {
            // если закрыли добавление записи кликом по другой записи, то маркер должен встать на 'другую' запись
            control.setMarkedKey(control._markedKeyAfterEditing);
            control._markedKeyAfterEditing = null;
        } else if (isAdd && willSave) {
            control.setMarkedKey(item.contents.getKey());
        } else if (slicelessHasMarkerController(control)) {
            const controller = slicelessGetMarkerController(control, options);
            controller.setMarkedKey(controller.getMarkedKey());
        }
    }
}

function slicelessOnActivated(
    control: TBaseControl,
    options: IBaseControlOptions,
    eventOptions?: {
        isTabPressed: boolean;
        isShiftKey: boolean;
        keyPressedData?: {
            key: string;
        };
    }
): void {
    const pressedKey = eventOptions?.keyPressedData?.key;
    if (
        (pressedKey === 'Tab' || pressedKey === 'Enter') &&
        canMarkItemOnActivate(control, options)
    ) {
        const item = eventOptions?.isShiftKey
            ? control.getViewModel().getLast()
            : control.getViewModel().getFirst();
        control.setMarkedKey(item.key);
    }
}

function slicelessSpaceHandler(
    control: TBaseControl,
    options: IBaseControlOptions,
    event: SyntheticEvent,
    doBeforeMoveMarker: (key: CrudEntityKey) => void
): void {
    if (
        options.multiSelectVisibility === 'hidden' ||
        options.markerVisibility === 'hidden' ||
        control._spaceBlocked
    ) {
        return;
    }

    const markerController = slicelessGetMarkerController(control);
    let key = markerController.getMarkedKey();
    if (key === null || key === undefined) {
        key = markerController.getNextMarkedKey();
    }

    if (key) {
        doBeforeMoveMarker(key);
    }

    slicelessMoveMarkerToDirection(control, options, event, 'Forward');
}

function slicelessBeforeMountAsyncQueue(control: TBaseControl, options: IBaseControlOptions): void {
    if (
        options.markerVisibility === 'visible' ||
        (options.markerVisibility === 'onactivated' && options.markedKey !== undefined)
    ) {
        const controller = slicelessGetMarkerController(control, options);
        const markedKey = controller.calculateMarkedKeyForVisible();
        controller.setMarkedKey(markedKey);
    }
}

function slicelessOnKeyDownLeft(
    control: TBaseControl,
    options: IBaseControlOptions,
    event: SyntheticEvent,
    canMoveMarker?: boolean
) {
    if (canMoveMarker && !options.disableHorizontalMarkerDirection) {
        slicelessMoveMarkerToDirection(control, options, event, 'Left');
    }
}

function slicelessOnKeyDownRight(
    control: TBaseControl,
    options: IBaseControlOptions,
    event: SyntheticEvent,
    canMoveMarker?: boolean
) {
    if (canMoveMarker && !options.disableHorizontalMarkerDirection) {
        slicelessMoveMarkerToDirection(control, options, event, 'Right');
    }
}

function slicelessGetBeforeUpdateSteps(
    control: TBaseControl,
    options: IBaseControlOptions
): {
    stepOne: () => void;
    stepTwo: () => void;
    stepThree: () => void;
} {
    return {
        stepOne: () => {
            if (slicelessHasMarkerController(control) && control._listViewModel) {
                slicelessGetMarkerController(control).updateOptions({
                    model: control._listViewModel,
                    markerVisibility: options.markerVisibility,
                    markerStrategy: options.markerStrategy,
                    moveMarkerOnScrollPaging: options.moveMarkerOnScrollPaging,
                });
            }
        },
        stepTwo: () => {
            if (slicelessHasMarkerController(control)) {
                slicelessGetMarkerController(control).updateOptions({
                    model: control._listViewModel,
                    markerVisibility: options.markerVisibility,
                });
            }
        },
        stepThree: (
            oldOptions: IBaseControlOptions,
            {
                modelRecreated,
                isPortionedLoad,
            }: {
                modelRecreated: boolean;
                isPortionedLoad: boolean;
            }
        ) => {
            const shouldProcessMarker =
                options.markerVisibility === 'visible' ||
                (options.markerVisibility === 'onactivated' && options.markedKey !== undefined) ||
                modelRecreated;

            // Если будет выполнена перезагрузка, то мы на событие reset применим новый ключ.
            // Но во время итеративной загрузки нужно применять маркер сразу, т.к. в событии reset может еще не быть записей
            // Возможен сценарий, когда до загрузки элементов нажимают развернуть
            // ПМО и мы пытаемся посчитать маркер, но модели еще нет
            if (
                shouldProcessMarker &&
                isPortionedLoad &&
                control._listViewModel &&
                control._listViewModel.getCount()
            ) {
                let needCalculateMarkedKey = false;
                if (
                    !slicelessHasMarkerController(control) &&
                    options.markerVisibility === 'visible'
                ) {
                    // В этом случае маркер пытался проставиться, когда еще не было элементов.
                    // Проставляем сейчас, когда уже точно есть
                    needCalculateMarkedKey = true;
                }

                const markerController = slicelessGetMarkerController(control, options);
                // могут скрыть маркер и занового показать,
                // тогда markedKey из опций нужно проставить даже если он не изменился
                // Нужно сравнивать новый ключ маркера с ключом маркера в состоянии контроллера, а не в старых опциях.
                // Т.к. может произойти несколько синхронизаций и маркер в старых опциях уже тоже будет изменен,
                // но в контроллер он не будет проставлен, т.к. в этот момент еще шла загрузка данных.
                if (
                    (markerController.getMarkedKey() !== options.markedKey ||
                        (oldOptions.markerVisibility === 'hidden' &&
                            options.markerVisibility === 'visible')) &&
                    options.markedKey !== undefined
                ) {
                    markerController.setMarkedKey(options.markedKey);
                }
                const markerVisibilityChangedToVisible =
                    oldOptions.markerVisibility !== options.markerVisibility &&
                    options.markerVisibility === 'visible';
                // Когда модель пересоздается, то возможен такой вариант:
                // Маркер указывает на папку, TreeModel -> SearchViewModel, после пересоздания markedKey
                // будет указывать на хлебную крошку, но маркер не должен ставиться на нее,
                // markerController.setMarkedKey не проверяет возможность установки маркера на элемент,
                // а при последующих синхронизациях modelRecreated уже будет false,
                // поэтому сразу высчитываем элемент, на который можно поставить маркер.
                if (markerVisibilityChangedToVisible || modelRecreated || needCalculateMarkedKey) {
                    const newMarkedKey = markerController.calculateMarkedKeyForVisible();
                    // Отправляем событие только, если маркер действительно поменяли.
                    if (newMarkedKey !== options.markedKey) {
                        slicelessChangeMarkedKey(control, options, newMarkedKey);
                    }
                }
            } else if (
                slicelessHasMarkerController(control) &&
                options.markerVisibility === 'hidden'
            ) {
                slicelessGetMarkerController(control).destroy();
                control._markerController = null;
            }
        },
    };
}

function slicelessSetMarkerOnItemClick(
    control: TBaseControl,
    options: IBaseControlOptions,
    contents: Model | Model[],
    originalEvent: MouseEvent
): void {
    if (originalEvent?.target?.closest?.('.js-controls-Tree__row-expander')) {
        return;
    }
    const key = getKey(contents);
    // При клике в хлебную крошку её id может отсутствовать в текущей поисковой модели,
    // Отдадим в  _needSetMarkerCallback оригинальную запись, по которой кликнули.
    const itemContents = control._listViewModel.getItemBySourceKey(key)?.getContents() || contents;

    // Проставляем маркер по клику, т.к. если поставить маркер на mousedown или mouseup,
    // то маркер успеет отрисоваться до клика.
    // В кейсе, когда маркированная запись стикается, клика не произойдет, т.к. изменится ДОМ дерево.
    // https://online.sbis.ru/opendoc.html?guid=8f7389a3-5048-4475-9f4d-3005db119738&client=3
    let canBeMarked = true;

    // TODO изабвиться по задаче https://online.sbis.ru/opendoc.html?guid=f7029014-33b3-4cd6-aefb-8572e42123a2
    // Колбэк передается из explorer.View, чтобы не проставлять маркер перед проваливанием в узел
    if (options._needSetMarkerCallback) {
        canBeMarked = canBeMarked && options._needSetMarkerCallback(itemContents, originalEvent);
    }
    if (canBeMarked) {
        // маркер устанавливается после завершения редактирования
        if (control._editInPlaceController?.isEditing()) {
            // TODO нужно перенести установку маркера на клик, т.к. там выполняется проверка для редактирования
            control._markedKeyAfterEditing = key;
        } else {
            control.setMarkedKey(key);
        }
    }
}

export function slicelessHandleCollectionChange(
    control: TBaseControl,
    options: IBaseControlOptions,
    action: string,
    newItems: CollectionItem<Model>[],
    _newItemsIndex: number,
    removedItems: CollectionItem<Model>[],
    removedItemsIndex: number
): void {
    const handleMarker =
        action === IObservable.ACTION_RESET &&
        (options.markerVisibility === 'visible' || options.markedKey !== undefined);

    if (slicelessHasMarkerController(control) || handleMarker) {
        const markerController = slicelessGetMarkerController(control);

        let newMarkedKey;
        let markedKeyChanged = false;
        switch (action) {
            case IObservable.ACTION_REMOVE:
                newMarkedKey = markerController.onCollectionRemove(removedItemsIndex, removedItems);
                markedKeyChanged = true;
                break;
            case IObservable.ACTION_RESET:
                // В случае когда прислали новый ключ и в beforeUpdate вызвался reload,
                // новый ключ нужно применить после изменения коллекции, чтобы не было лишней перерисовки.
                // При этом маркер менять не надо если загрузка всё ещё не завершилась.
                if (
                    !control._isSourceControllerLoadingNow(options) &&
                    options.markedKey !== undefined &&
                    options.markedKey !== markerController.getMarkedKey()
                ) {
                    markerController.setMarkedKey(options.markedKey);
                }
                newMarkedKey = markerController.onCollectionReset();
                markedKeyChanged = true;
                break;
            case IObservable.ACTION_ADD:
                markerController.onCollectionAdd(newItems);
                break;
            case IObservable.ACTION_REPLACE:
                markerController.onCollectionReplace(newItems);
                break;
            case IObservable.ACTION_CHANGE:
                // Не обрабатываем данное событие, есил у нас заканчивается редактирование,
                // т.к. в этот момент коллекция может быть не в консистентном состоянии:
                // AddStrategy еще не сбросилось, но добавленная запись уже в в рекордсете
                // TODO есть предположение что не правильно используем стратегии,
                //  из-за этого неконсистентное состояние(аналогичная проблема с днд)
                //  https://online.sbis.ru/opendoc.html?guid=2c97bbbf-65fb-4228-8b20-8292b41d5422
                const isEndEditProcessing =
                    control._editInPlaceController &&
                    control._editInPlaceController.isEndEditProcessing();
                if (!isEndEditProcessing) {
                    markerController.onCollectionChange(newItems);
                }
                break;
        }

        if (markedKeyChanged) {
            slicelessChangeMarkedKey(control, options, newMarkedKey);
        }
    }
}

export const SlicelessBaseControlCompatibility: TMarkerCompatibility = {
    slicelessHasMarkerController,
    slicelessGetMarkerController,
    slicelessChangeMarkedKey,
    slicelessMoveMarkerToDirection,
    slicelessSetMarkedKeyAfterPaging,
    slicelessAfterMount,
    slicelessSetMarkerAfterEndEditCallback,
    slicelessOnActivated,
    slicelessSpaceHandler,
    slicelessBeforeMountAsyncQueue,
    slicelessOnKeyDownLeft,
    slicelessOnKeyDownRight,
    slicelessGetBeforeUpdateSteps,
    slicelessSetMarkerOnItemClick,
    slicelessHandleCollectionChange,
};
