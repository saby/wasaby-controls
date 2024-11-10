import { CrudEntityKey } from 'Types/source';
import type * as React from 'react';
import type { default as TBaseControl, IBaseControlOptions } from '../BaseControl';
import 'Controls/marker';
import type { TMarkerController } from 'Controls/marker';
import { CollectionItem } from 'Controls/display';
import { Model } from 'Types/entity';
import { IObservable } from 'Types/collection';
import { marker as markerNotification } from './NotificationCompatibility';
import { OldBaseControlItemActions, TOldBaseControlItemActions } from './aspects/ItemActions';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';

export type TMarkerMoveDirection = 'Down' | 'Up' | 'Left' | 'Right' | 'Forward' | 'Backward';

// TODO:MARKER TO SLICE

export type TOldBaseControlLogic = {
    getMarkedKey: typeof getMarkedKey;
    changeMarkedKey: typeof changeMarkedKey;
    onActivated: typeof onActivated;
    setMarkerFromControllerIfExists: typeof setMarkerFromControllerIfExists;
} & TOldBaseControlItemActions;

export type TSlicelessBaseControlCompatibility = {
    slicelessGetMarkerController: typeof slicelessGetMarkerController;
    slicelessBeforeMountAsyncQueue: typeof slicelessBeforeMountAsyncQueue;
    slicelessAfterMount: typeof slicelessAfterMount;
    slicelessUpdateControllers: typeof slicelessUpdateControllers;
    slicelessUpdateMarkerControllerOnBeforeUpdate: typeof slicelessUpdateMarkerControllerOnBeforeUpdate;
    slicelessHandleCollectionChange: typeof slicelessHandleCollectionChange;
    slicelessHandleLoadToDirection: typeof slicelessHandleLoadToDirection;
};

function hasMarkerController(control: TBaseControl) {
    return !!control._markerController;
}

function slicelessGetMarkerController(
    control: TBaseControl,
    options: IBaseControlOptions = control._options
): TMarkerController {
    if (!hasMarkerController(control) && isLoaded('Controls/marker')) {
        const markerController =
            loadSync<typeof import('Controls/marker')>('Controls/marker').MarkerController;
        control._markerController = new markerController({
            model: control._listViewModel,
            markerVisibility: options.markerVisibility,
            markedKey: options.markedKey,
            markerStrategy: options.markerStrategy,
            moveMarkerOnScrollPaging: options.moveMarkerOnScrollPaging,
        });
    }
    return control._markerController;
}

function getMarkedKey(
    control: TBaseControl,
    options: IBaseControlOptions = control._options
): CrudEntityKey | null | undefined {
    if (!hasMarkerController(control, options)) {
        return undefined;
    }
    return slicelessGetMarkerController(control, options).getMarkedKey();
}

function changeMarkedKey(
    control: TBaseControl,
    options: IBaseControlOptions,
    newMarkedKey: CrudEntityKey,
    shouldFireEvent: boolean = false
): Promise<CrudEntityKey> | CrudEntityKey | undefined {
    if (options.markerVisibility === 'hidden') {
        return;
    }

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

    return markerNotification.beforeMarkedKeyChanged(newMarkedKey, control, options, (key) => {
        // Прикладники могут как передавать значения в markedKey, так и передавать undefined.
        // И при undefined нужно делать так, чтобы markedKey задавался по нашей логике.
        // Это для трюка от Бегунова когда делают bind на переменную, которая изначально undefined.
        // В таком случае, чтобы не было лишних синхронизаций - мы работаем по нашему внутреннему state.
        if (options.markedKey === undefined) {
            markerController.setMarkedKey(key);
        }

        markerNotification.markedKeyChanged(key, control, options);
    });
}

function slicelessAfterMount(control: TBaseControl, options: IBaseControlOptions): void {
    // TODO удалить после того как избавимся от onactivated
    if (hasMarkerController(control)) {
        const newMarkedKey = slicelessGetMarkerController(control).getMarkedKey();
        if (newMarkedKey !== options.markedKey) {
            changeMarkedKey(control, options, newMarkedKey, true);
        }
    }
}

function setMarkerFromControllerIfExists(
    control: TBaseControl,
    options: IBaseControlOptions
): void {
    if (hasMarkerController(control)) {
        const controller = slicelessGetMarkerController(control, options);
        controller.setMarkedKey(controller.getMarkedKey());
    }
}

function onActivated(
    eventOptions: {
        isTabPressed: boolean;
        isShiftKey: boolean;
        key?: React.KeyboardEvent['key'];
    },
    canMarkItemOnActivate: undefined | (() => boolean),
    control: TBaseControl,
    options: IBaseControlOptions
): void {
    const pressedKey = eventOptions.key;
    const model = control.getViewModel();

    if (
        (pressedKey === 'Tab' || pressedKey === 'Enter') &&
        options.markerVisibility === 'onactivated' &&
        (canMarkItemOnActivate ? canMarkItemOnActivate() : true) &&
        model.getIndexByKey(slicelessGetMarkerController(control).getMarkedKey()) === -1
    ) {
        const item = eventOptions?.isShiftKey
            ? control.getViewModel().getLast()
            : control.getViewModel().getFirst();
        changeMarkedKey(control, options, item.key);
    }
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

function slicelessUpdateControllers(control: TBaseControl, newOptions: IBaseControlOptions): void {
    if (hasMarkerController(control) && control._listViewModel) {
        slicelessGetMarkerController(control).updateOptions({
            model: control._listViewModel,
            markerVisibility: newOptions.markerVisibility,
            markerStrategy: newOptions.markerStrategy,
            moveMarkerOnScrollPaging: newOptions.moveMarkerOnScrollPaging,
        });
    }
}

function slicelessUpdateMarkerControllerOnBeforeUpdate(
    control: TBaseControl,
    oldOptions: IBaseControlOptions,
    newOptions: IBaseControlOptions,
    {
        modelRecreated,
        isPortionedLoad,
    }: {
        modelRecreated: boolean;
        isPortionedLoad: boolean;
    }
) {
    slicelessUpdateControllers(control, newOptions);

    const shouldProcessMarker =
        newOptions.markerVisibility === 'visible' ||
        (newOptions.markerVisibility === 'onactivated' && newOptions.markedKey !== undefined) ||
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
        if (!hasMarkerController(control) && newOptions.markerVisibility === 'visible') {
            // В этом случае маркер пытался проставиться, когда еще не было элементов.
            // Проставляем сейчас, когда уже точно есть
            needCalculateMarkedKey = true;
        }

        const markerController = slicelessGetMarkerController(control, newOptions);
        // могут скрыть маркер и занового показать,
        // тогда markedKey из опций нужно проставить даже если он не изменился
        // Нужно сравнивать новый ключ маркера с ключом маркера в состоянии контроллера, а не в старых опциях.
        // Т.к. может произойти несколько синхронизаций и маркер в старых опциях уже тоже будет изменен,
        // но в контроллер он не будет проставлен, т.к. в этот момент еще шла загрузка данных.
        if (
            (markerController.getMarkedKey() !== newOptions.markedKey ||
                (oldOptions.markerVisibility === 'hidden' &&
                    newOptions.markerVisibility === 'visible')) &&
            newOptions.markedKey !== undefined
        ) {
            markerController.setMarkedKey(newOptions.markedKey);
        }
        const markerVisibilityChangedToVisible =
            oldOptions.markerVisibility !== newOptions.markerVisibility &&
            newOptions.markerVisibility === 'visible';
        // Когда модель пересоздается, то возможен такой вариант:
        // Маркер указывает на папку, TreeModel -> SearchViewModel, после пересоздания markedKey
        // будет указывать на хлебную крошку, но маркер не должен ставиться на нее,
        // markerController.setMarkedKey не проверяет возможность установки маркера на элемент,
        // а при последующих синхронизациях modelRecreated уже будет false,
        // поэтому сразу высчитываем элемент, на который можно поставить маркер.
        if (markerVisibilityChangedToVisible || modelRecreated || needCalculateMarkedKey) {
            const newMarkedKey = markerController.calculateMarkedKeyForVisible();
            // Отправляем событие только, если маркер действительно поменяли.
            if (newMarkedKey !== newOptions.markedKey) {
                changeMarkedKey(control, newOptions, newMarkedKey);
            }
        }
    } else if (hasMarkerController(control) && newOptions.markerVisibility === 'hidden') {
        slicelessGetMarkerController(control).destroy();
        control._markerController = null;
    }
}

function slicelessHandleCollectionChange(
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

    if (hasMarkerController(control) || handleMarker) {
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
            changeMarkedKey(control, options, newMarkedKey);
        }
    }
}

function slicelessHandleLoadToDirection(
    control: TBaseControl,
    options: IBaseControlOptions,
    isPortionedLoad: boolean
) {
    const markedKey = getMarkedKey(control, options);
    const hasMarkedKey = markedKey !== null && markedKey !== undefined;

    // После выполнения поиска мы должны поставить маркер.
    // Если выполняется порционный поиск и первый запрос не вернул ни одной записи,
    // то на событие reset список будет пустой и нам некуда будет ставить маркер.
    if (hasMarkedKey && isPortionedLoad) {
        const newMarkedKey = slicelessGetMarkerController(control, options).onCollectionReset();
        changeMarkedKey(control, options, newMarkedKey);
    }
}

export const SlicelessBaseControlCompatibility: TSlicelessBaseControlCompatibility = {
    // Используется в TreeControl, надо думать.
    slicelessGetMarkerController,

    // В новой схеме не нужно ни в каком виде,
    // реакция изменения на коллекции прямо в слайсе
    slicelessHandleCollectionChange,

    // Аналог initState, не нужен в новой схеме
    slicelessBeforeMountAsyncQueue,

    // Пока вообще не понятно зачем это.
    slicelessAfterMount,

    // Сложный метод обновления состояния от всего и вся.
    // В новом такого, естественно, нет.
    // Распадается на разные места, в зависимости от смысловой нагрузки.
    slicelessUpdateMarkerControllerOnBeforeUpdate,

    slicelessUpdateControllers,
};

export const OldBaseControlLogic: TOldBaseControlLogic = {
    getMarkedKey,
    changeMarkedKey,

    onActivated,
    setMarkerFromControllerIfExists,
    ...OldBaseControlItemActions,
};
