/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import * as React from 'react';
import type { IAbstractListAPI, IAbstractListState } from 'Controls-DataEnv/abstractList';
import type { IDragPosition, TTargetPosition } from 'Controls/display';
import type {
    IComponentPropsWithReadonly,
    ISelectionObject,
    TKey,
    TKeysSelection,
    TSelectionType,
} from 'Controls/interface';

import DndController from './Controller';
import FlatStrategy from './strategies/Flat';
import TreeStrategy from './strategies/Tree';
import { IDraggableCollection, IDraggableItem } from './interface';

import { IDragObject, ItemsEntity } from 'Controls/dragnDrop';
import { CrudEntityKey } from 'Types/source';
import { ISourceControllerOptions } from 'Controls/dataSource';
import { DimensionsMeasurer, IMouseCoords } from 'Controls/sizeUtils';
import { logger } from 'Application/Env';
import { default as selectionToRecordUtil } from 'Controls/Utils/selectionToRecord';
import { Model } from 'Types/entity';
import { isEqual } from 'Types/object';
import cClone = require('Core/core-clone');
import cInstance = require('Core/core-instance');
import { detection } from 'Env/Env';

const LIMIT_DRAG_SELECTION = 100;
const DRAGGING_OFFSET = 10;
const DRAG_SHIFT_LIMIT = 4;
const IE_MOUSEMOVE_FIX_DELAY = 50;

export type TEvent = MouseEvent | TouchEvent;

interface IDndEntity extends ItemsEntity {
    dragControlId?: string;
}

export type TDragObject = IDragObject<IDndEntity>;

export type TState = {
    controller?: DndController<IDragPosition<IDraggableItem>>;
    startTimeoutId?: number;
    endDragNDropTimeout?: number; // для IE
    startEvent?: TEvent;
    draggedKey?: CrudEntityKey;
    dragEntity?: IDndEntity;
    insideDragging: boolean;
    isDocumentDragging: boolean;
};

export interface IDragNDropProps extends Pick<IComponentPropsWithReadonly, 'readOnly'> {
    viewModelState: IAbstractListState;
    viewModelAPI: IAbstractListAPI;
    itemsDragNDrop?: boolean;
    dragStartDelay?: number;
    dragControlId: string;
    canStartDragNDrop?: boolean | (() => boolean);
    /*
     * let hasDragScrolling = false;
     *     if (this._options.columnScroll) {
     *         // Не должно быть завязки на горизонтальный скролл.
     *         // https://online.sbis.ru/opendoc.html?guid=347fe9ca-69af-4fd6-8470-e5a58cda4d95
     *         hasDragScrolling =
     *             (this._options.isColumnScrollVisible ||
     *                 this._isColumnScrollVisible ||
     *                 this._options.canHorizontalScroll) &&
     *             (typeof this._options.dragScrolling === 'boolean'
     *                 ? this._options.dragScrolling
     *                 : !this._options.itemsDragNDrop);
     *     }
     */
    hasDragScrolling: boolean;

    // Оверрайд опции onViewDragStartCompatible из BaseControl
    onViewDragStartCompatible?: (draggedKey?: TKey) => void;

    // Старое событие - 'customdragStart'
    onDragStart?: (items: TKeysSelection, draggableKey: TKey) => IDndEntity | undefined | void;

    // Старое событие - 'dragMove'
    onDragMove?: (dragObject: TDragObject) => void;

    // Старое событие - 'customdragEnd'
    onDragEnd?: (
        dragEntity: IDndEntity,
        item: Model,
        targetPosition: TTargetPosition
    ) => Promise<void> | void;

    // Старое событие - '_documentDragStart'
    onDocumentDragStart: (dragObject: TDragObject) => void;

    // Старое событие - '_documentDragEnd'
    onDocumentDragEnd: (dragObject: TDragObject) => void;

    // Старое событие - 'changeDragTarget'
    onChangeDragTarget?: (
        dragEntity: IDndEntity,
        item: Model,
        targetPosition: TTargetPosition
    ) => boolean | undefined;

    onDragEnter?: (dragEntity: IDndEntity) => unknown;

    // Старое событие - _removeDraggingTemplate
    onDraggingRenderRemove?: () => void;

    // Старое событие - '_updateDraggingTemplate'
    updateDraggingRenderCallback: (dragObject: TDragObject, draggingRender: unknown) => void;

    draggingRender?: React.ReactElement;

    listContainerRef: React.MutableRefObject<HTMLDivElement | null>;

    register?: (eventName: string, handler: Function) => void;
    unregister?: (eventName: string) => void;
}

export interface IDragNDropAPI {
    tryStart(domEvent: TEvent, draggableKey: CrudEntityKey): void;

    move(event: TEvent): void;

    end(event: TEvent): void;
}

export function tryStart(
    dndState: TState,
    props: IDragNDropProps,
    event: TEvent,
    draggableKey: CrudEntityKey,
    api: IDragNDropAPI
) {
    if (!props.register || !props.unregister) {
        throw Error('Missing register!');
    }
    if (!props.hasDragScrolling) {
        if (typeof dndState.startTimeoutId === 'number') {
            clearTimeout(dndState.startTimeoutId);
            dndState.startTimeoutId = undefined;
        }
        // dragStartDelay нужен, чтобы была возможность выше отменить днд. То есть, за заданное время, контрол
        // выше может выполнить свои действия и уже на событие dragStart дать однозначный ответ.
        // Нужно например, чтобы начать dragScroll в канбане, но если прошло dragStartDelay, то должен быть DnD.
        if (props.dragStartDelay) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            dndState.startTimeoutId = setTimeout(() => {
                startDragNDrop(dndState, props, event, draggableKey, api);
                dndState.startTimeoutId = undefined;
            }, props.dragStartDelay);
        } else {
            startDragNDrop(dndState, props, event, draggableKey, api);
        }
    }
}

export function move(dndState: TState, props: IDragNDropProps, event: TEvent) {
    // В яндекс браузере каким то образом пришел nativeEvent === null, после чего
    // упала ошибка в коде ниже и страница стала некликабельной. Повторить ошибку не получилось
    // добавляем защиту на всякий случай.
    if (event) {
        if (event instanceof MouseEvent) {
            if (detection.isIE) {
                onMouseMoveIEFix(dndState, props, event);
            } else {
                // Check if the button is pressed while moving.
                if (!event.buttons) {
                    dragNDropEnded(dndState, props, event);
                }
            }

            // Не надо вызывать onMoveDnd если не нажата кнопка мыши.
            // Кнопка мыши может быть не нажата в 2 случаях:
            // 1) Мышь увели за пределы браузера, там отпустили и вернули в браузер
            // 2) Баг IE, который подробнее описан в методе _onMouseMoveIEFix
            if (event.buttons) {
                onMoveDnd(dndState, props, event);
            }
        }
    }
}

export function moveOnItem(
    dndState: TState,
    props: IDragNDropProps,
    event: TEvent,
    targetKey: CrudEntityKey
): boolean {
    const baseList = (): boolean => {
        const { controller } = dndState;
        const {
            viewModelState: { collection },
        } = props;
        if (!controller || !controller.isDragging() || !collection) {
            return false;
        }

        const targetItem = collection.getItemBySourceKey(targetKey, false) as IDraggableItem;
        const targetIsDraggableItem =
            controller.getDraggableItem()?.getContents() === targetItem.getContents();

        if (targetIsDraggableItem) {
            return false;
        }

        const mouseOffsetInTargetItem = calculateMouseOffsetInItem(event, collection);
        const dragPosition = controller.calculateDragPosition({
            targetItem,
            mouseOffsetInTargetItem,
        });
        if (dragPosition && !isEqual(controller.getDragPosition(), dragPosition)) {
            const changeDragTarget = props.onChangeDragTarget?.(
                controller.getDragEntity() as unknown as IDndEntity,
                dragPosition.dispItem.getContents(),
                dragPosition.position
            );
            controller.setChangeDragTargetResult(changeDragTarget);
            if (changeDragTarget !== false) {
                return controller.setDragPosition(dragPosition);
            }
        }
        return false;
    };
    return baseList();
}

export function end(dndState: TState, props: IDragNDropProps, event: TEvent) {
    if (dndState.startEvent) {
        dragNDropEnded(dndState, props, event);
    }
}

export function onDocumentDragStart(
    dndState: TState,
    props: IDragNDropProps,
    dragObject: TDragObject
): void {
    if (props.readOnly || !props.itemsDragNDrop || !(dragObject && dragObject.entity)) {
        return;
    }
    dndState.isDocumentDragging = true;

    // dragStart должен вызываться в том списке, в котором он начался.
    // draggedKey запоминается имеено на таком списке.
    // Возможна ситуация: событие _documentDragStart бросается из стартового списка, а после того как
    // событие долетает до всех списков мышка находится уже в другом списке.
    // (1-ый список insideDragging=false, 2-ой список insideDragging=true)
    // Из-за этого пытаемся начать днд не в том списке.
    if (dndState.draggedKey !== null && dndState.draggedKey !== undefined) {
        startDragByDocumentDragStart(dndState, props, dragObject, dndState.draggedKey);
    } else {
        dndState.dragEntity = dragObject.entity;

        // Возможна такая ситуация:
        // Потащили резко записи, так что мышка сразу оказалось на соседнем списке.
        // Из-за этого _documentDragStart сработает после mouseEnter на соседнем списке.
        // Поэтому если в _documentDragStart мы уже наведены на другой список,
        // то нужно инициализировать в нем днд по необходимости
        if (dndState.insideDragging) {
            dragEnter(dndState, props, dragObject);
        }
    }
}

export function onDocumentDragEnd(
    dndState: TState,
    {
        viewModelState: { collection, markerVisibility, parentProperty },
        viewModelAPI,
        onDragEnd,
    }: IDragNDropProps,
    dragObject: TDragObject,
    handleDragEnd?: (endDrag: () => void) => void,
    removeShowActionsClass?: () => void
): void {
    const { controller } = dndState;
    // Флаг _documentDragging проставляется во всех списках, он говорит что где-то началось перетаскивание записи
    // и при mouseEnter возможно придется начать днд. Поэтому сбрасываем флаг не зависимо от isDragging
    dndState.isDocumentDragging = false;

    // событие documentDragEnd может долететь до списка, в котором нет модели
    if (!collection || !controller || !controller.isDragging()) {
        return;
    }

    if (dndState.insideDragging) {
        const targetPosition = controller.getDragPosition();
        const changeDragTarget = controller.getChangeDragTargetResult();
        if (
            targetPosition &&
            targetPosition.dispItem &&
            targetPosition.position &&
            changeDragTarget !== false
        ) {
            const result = onDragEnd?.(
                dragObject.entity,
                targetPosition.dispItem.getContents(),
                targetPosition.position
            );

            if (result instanceof Promise) {
                controller.setDragEndPromise(result);
            } else {
                controller.setDragEndPromise(undefined);
            }
        }

        // После окончания DnD, не нужно показывать операции, до тех пор, пока не пошевелим мышкой.
        // Задача: https://online.sbis.ru/opendoc.html?guid=9877eb93-2c15-4188-8a2d-bab173a76eb0
        // TODO:!!!!
        // _private.removeShowActionsClass(this);
        // TODO этот вызов нужен до тех пор пока не перенесен _private.removeShowActionsClass
        removeShowActionsClass?.();
    }

    const endDrag = (): void => {
        const targetPosition = controller.getDragPosition();
        const draggableItem = controller.getDraggableItem();
        controller.endDrag();

        // перемещаем маркер только если dragEnd сработал в списке в который перетаскивают
        if (
            markerVisibility !== 'hidden' &&
            targetPosition &&
            draggableItem &&
            dndState.insideDragging
        ) {
            const moveToCollapsedNode =
                targetPosition.position === 'on' &&
                targetPosition.dispItem[
                    '[Controls/_display/TreeItem]' as keyof typeof targetPosition.dispItem
                ] &&
                !targetPosition.dispItem.isExpanded();
            let draggedKey: TKey;
            if (moveToCollapsedNode) {
                draggedKey = targetPosition.dispItem.key;
            } else {
                draggedKey = draggableItem.getContents().getKey();
            }
            viewModelAPI.mark(draggedKey);
        }

        // данное поведение сейчас актуально только для дерева или когда перетаскиваем в другой список
        if (parentProperty || !dndState.insideDragging) {
            viewModelAPI.resetSelection();
        }

        dndState.controller = undefined;
        dndState.insideDragging = false;
    };

    // TODO этот вызов нужен до тех пор пока не перенесены _displayGlobalIndicator и hideGlobalIndicator
    if (handleDragEnd) {
        handleDragEnd(endDrag);
    } else if (controller) {
        // Это функция срабатывает при перетаскивании скролла, поэтому проверяем controller
        // endDrag нужно вызывать только после события dragEnd,
        // чтобы не было прыжков в списке, если асинхронно меняют порядок элементов
        const promise = controller.getDragEndPromise();
        if (promise instanceof Promise) {
            // TODO !!!
            // this._displayGlobalIndicator();
            promise.finally(() => {
                endDrag();
                // TODO !!!
                // if (this._indicatorsController.shouldHideGlobalIndicator()) {
                //     this._indicatorsController.hideGlobalIndicator();
                // }
            });
        } else {
            endDrag();
        }
    }

    collection.setDragOutsideList(false);
}

export async function startDragNDrop(
    dndState: TState,
    props: IDragNDropProps,
    event: TEvent,
    draggableKey: CrudEntityKey,
    api: IDragNDropAPI
): Promise<void> {
    const {
        viewModelState: { collection, parentProperty },
    } = props;

    if (
        dndState.controller?.isDragging() ||
        !DndController.canStartDragNDrop(
            !!props.readOnly,
            !!props.itemsDragNDrop,
            typeof props.canStartDragNDrop === 'undefined' ? false : props.canStartDragNDrop,
            event
        )
    ) {
        return;
    }

    if (!collection) {
        throw Error('Missing collection!');
    }

    const draggableItem = collection.getItemBySourceKey(draggableKey, false) as IDraggableItem;

    dndState.controller = createDndController(
        collection as unknown as IDraggableCollection,
        parentProperty,
        draggableItem
    );

    const items = await resolveDraggableKeys(props, draggableKey, dndState.controller);
    // TODO: Тут проверку на destroy!.

    let dragStartResult = props.onDragStart?.(items, draggableKey);

    if (
        dragStartResult instanceof ItemsEntity &&
        !isValidDndItemsEntity(dragStartResult, draggableKey)
    ) {
        // ничего не делаем, чтобы не блочилась страница.
        return;
    }

    if (dragStartResult === undefined) {
        // Чтобы для работы dnd было достаточно опции itemsDragNDrop=true
        dragStartResult = new ItemsEntity({ items });
    }

    if (dragStartResult) {
        if (props.dragControlId) {
            dragStartResult.dragControlId = props.dragControlId;
        }

        dndState.dragEntity = dragStartResult;
        dndState.draggedKey = draggableKey;
        dndState.startEvent = event;

        clearSelectedText(event);
        if (event.target instanceof Element) {
            event.target.classList.add('controls-DragNDrop__dragTarget');
        }

        registerHandlers(props, api);
    }
}

export function dragEnter(
    dndState: TState,
    props: IDragNDropProps,
    dragObject?: IDragObject<IDndEntity>
): void {
    const { collection, parentProperty } = props.viewModelState;

    if (!collection) {
        throw Error('Missing collection!');
    }

    dndState.insideDragging = true;
    const hasSorting = props.viewModelState.sorting?.length;
    if (!hasSorting) {
        collection.setDragOutsideList(false);
        if (dndState.isDocumentDragging && !shouldDisplayDraggingRender(props)) {
            props.onDraggingRenderRemove?.();
        }
    }

    // Не нужно начинать dnd, если и так идет процесс dnd
    if (dndState.controller?.isDragging()) {
        return;
    }

    if (!dndState.isDocumentDragging || !dragObject || !isDndItemsEntity(dragObject.entity)) {
        return;
    }

    const dragEnterResult = props.onDragEnter?.(dragObject.entity);

    if (isModel(dragEnterResult)) {
        // Создаем перетаскиваемый элемент, т.к. в другом списке его нет.
        const draggableItem = collection.createItem({
            contents: dragEnterResult,
        }) as IDraggableItem;
        // Считаем изначальную позицию записи. Нужно считать обязательно до ::startDrag,
        // т.к. после перетаскиваемая запись уже будет в коллекции
        let startPosition: IDragPosition<IDraggableItem>;
        if (collection.getCount()) {
            startPosition = {
                index: collection.getCount(),
                dispItem: collection.getLast() as IDraggableItem,
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
        dndState.controller = createDndController(
            collection as unknown as IDraggableCollection,
            parentProperty,
            draggableItem
        );
        dndState.controller.startDrag(dragObject.entity, true);

        // задаем изначальную позицию в другом списке
        dndState.controller.setDragPosition(startPosition);
    } else if (dragEnterResult === true) {
        dndState.controller = createDndController(
            collection as unknown as IDraggableCollection,
            parentProperty,
            // FIXME: DndController принимает не nullable значение, но само значение может быть undefined
            // @ts-expect-error ошибка типов в DndController
            null
        );
        dndState.controller.startDrag(dragObject.entity, true);
    }
}

export function dragLeave(dndState: TState, { viewModelState }: IDragNDropProps): void {
    dndState.insideDragging = false;
    // Эта функция срабатывает при перетаскивании скролла, поэтому проверяем _dndListController
    if (dndState.controller && dndState.controller.isDragging() && dndState.isDocumentDragging) {
        // Если днд начали в другом списке, то после перевода мышки с этого списка нужно завершить днд
        // В списке, в котором начали днд, нужно сбросить позицию записи на изначальную
        if (dndState.controller.isDragStartedFromAnotherList()) {
            dndState.controller.endDrag();
        } else {
            const newPosition = dndState.controller.calculateDragPosition({
                targetItem: null,
            });
            dndState.controller.setDragPosition(newPosition);
        }
    }
    const hasSorting = viewModelState.sorting?.length;
    if (!hasSorting) {
        viewModelState.collection?.setDragOutsideList(true);
    }
}

function onMoveDnd(dndState: TState, props: IDragNDropProps, nativeEvent: TEvent): void {
    if (!dndState.startEvent) {
        return;
    }
    const { controller, startEvent } = dndState;
    const {
        viewModelState: { collection },
    } = props;

    if (!collection) {
        throw Error('Missing collection!');
    }
    if (!props.listContainerRef.current) {
        throw Error('Missing container ref!');
    }

    const dragObject = getDragObject(dndState, nativeEvent);
    if ((!controller || !controller.isDragging()) && isDragStarted(startEvent, nativeEvent)) {
        dndState.insideDragging = true;
        props.onDocumentDragStart?.(dragObject);
    }
    if (controller) {
        if (controller.isDragging()) {
            // Проставляем правильное значение флага. Если в начале днд резко утащить за пределы списка,
            // то может не отработать mouseLeave и флаг не проставится.
            const moveOutsideList =
                !nativeEvent.target ||
                !(nativeEvent.target instanceof Node) ||
                !props.listContainerRef.current.contains(nativeEvent.target);

            if (moveOutsideList !== collection.isDragOutsideList()) {
                collection.setDragOutsideList(moveOutsideList);
            }

            props.onDragMove?.(dragObject);
            updateDraggingRender(props, dragObject);
        } else {
            const key = controller.getDraggableItem()?.key;
            if (typeof key !== 'undefined') {
                props.onViewDragStartCompatible?.(key);
            }
        }
    }
}

function onMouseMoveIEFix(dndState: TState, props: IDragNDropProps, event: MouseEvent): void {
    // In IE strange bug, the cause of which could not be found. During redrawing of the table the MouseMove
    // event at which buttons = 0 shoots. In 10 milliseconds we will check that the button is not pressed.
    if (!event.buttons && !dndState.endDragNDropTimeout) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        dndState.endDragNDropTimeout = setTimeout(() => {
            dragNDropEnded(dndState, props, event);
        }, IE_MOUSEMOVE_FIX_DELAY);
    } else if (dndState.endDragNDropTimeout) {
        clearTimeout(dndState.endDragNDropTimeout);
        dndState.endDragNDropTimeout = undefined;
    }
}

function createDndController(
    collection: IDraggableCollection,
    parentProperty: IAbstractListState['parentProperty'],
    draggableItem: IDraggableItem
): DndController<IDragPosition<IDraggableItem>> {
    const strategy = parentProperty ? TreeStrategy : FlatStrategy;

    return new DndController(
        collection,
        draggableItem,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        strategy,
        true
    );
}

function clearSelectedText(event: TEvent): void {
    if (event.type === 'mousedown') {
        // снимаем выделение с текста иначе не будут работать клики,
        // а выделение не будет сниматься по клику из за preventDefault
        const selection = window.getSelection();
        if (selection) {
            if (selection.removeAllRanges) {
                selection.removeAllRanges();
            } else if (selection.empty) {
                selection.empty();
            }
        }
    }
}

function isValidDndItemsEntity(dragStartResult: ItemsEntity, dragItemKey: CrudEntityKey): boolean {
    let isValid = true;
    if (
        !dragStartResult.getItems().every((item) => {
            return typeof item === 'string' || typeof item === 'number';
        })
    ) {
        logger.error('ItemsEntity в поле items должен содержать только ключи записей.');
        isValid = false;
    }
    if (!dragStartResult.getItems().includes(dragItemKey)) {
        logger.error('ItemsEntity должен содержать ключ записи, за которую начали перетаскивание.');
        isValid = false;
    }
    return isValid;
}

function isDndItemsEntity(entity: unknown): entity is ItemsEntity {
    return cInstance.instanceOfModule(entity, 'Controls/dragnDrop:ItemsEntity');
}

function isModel(item: unknown): item is Model {
    return cInstance.instanceOfModule(item, 'Types/entity:Model');
}

async function resolveDraggableKeys(
    { viewModelState, viewModelAPI }: IDragNDropProps,
    draggableKey: CrudEntityKey,
    controller: DndController<IDragPosition<IDraggableItem>>
): Promise<TKeysSelection> {
    const { marked: selected, ...sliceSelection } = await viewModelAPI.getSelection();
    const selection = DndController.getSelectionForDragNDrop(
        viewModelState.collection as unknown as IDraggableCollection,
        {
            ...sliceSelection,
            selected,
        },
        draggableKey
    );

    // При клике по элементу (не драганье) срабатывает onMouseDown и каждый раз уходит запрос из getDraggableKeys,
    // с фильтром selected: null. Чтобы это предотвратить, нужна проверка.
    // См. ошибку: https://online.sbis.ru/opendoc.html?guid=3ade1d72-089a-43c1-95a4-c2de25de1236&client=3
    if (selection.selected[0] === null && selection.excluded[0] === null) {
        return Promise.resolve([]);
    }

    const options = getSourceControllerOptionsForGetDraggedItems(viewModelState, selection);
    return controller.getDraggableKeys(selection, options);
}

function getSourceControllerOptionsForGetDraggedItems(
    viewModelState: IAbstractListState,
    selection: ISelectionObject
): ISourceControllerOptions {
    const options: ISourceControllerOptions = { ...viewModelState };
    options.dataLoadCallback = undefined;
    options.dataLoadErrback = undefined;
    options.navigationParamsChangedCallback = undefined;

    const newFilter = cClone(options.filter) || {};
    newFilter.selection = selectionToRecordUtil(
        {
            selected: selection.selected,
            excluded: selection.excluded,
        },
        'adapter.sbis',
        // TODO !!!!!
        (viewModelState as unknown as { selectionType: TSelectionType }).selectionType,
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

    if (options.parentProperty) {
        options.deepReload = true;

        // Нам не нужен multiNavigation, т.к. мы хотим получить записи именно по selection, независимо от развернутости.
        // @ts-ignore
        delete options.multiNavigation;
    }

    return options;
}

function isDragStarted(startEvent: TEvent, moveEvent: TEvent): boolean {
    const offset = getDragOffset(moveEvent, startEvent);
    return Math.abs(offset.x) > DRAG_SHIFT_LIMIT || Math.abs(offset.y) > DRAG_SHIFT_LIMIT;
}

function startDragByDocumentDragStart(
    dndState: TState,
    props: IDragNDropProps,
    dragObject: TDragObject,
    draggedKey: CrudEntityKey
): void {
    if (!dndState.controller) {
        return;
    }
    props.viewModelAPI.collapse(draggedKey);

    // TODO
    // if (_private.hasHoverFreezeController(this)) {
    //     this._hoverFreezeController.unfreezeHover();
    // }

    dndState.controller.startDrag(dragObject.entity);

    // Показываем плашку, если утащили мышь за пределы списка, до
    // того как выполнился запрос за перетаскиваемыми записями
    updateDraggingRender(props, dragObject);
}

function dragNDropEnded(dndState: TState, props: IDragNDropProps, event: TEvent): void {
    if (!dndState.controller) {
        throw Error(
            'Внутренняя ошибка платформы!\n' +
                'Контроллера DND не существует.\n' +
                'Произошла какая то непредвиденная ошибка.\n' +
                'Возможно пропущена отписка от события mouseMove/mouseUp.'
        );
    }

    if (dndState.controller.isDragging()) {
        const dragObject = getDragObject(dndState, event);
        props.onDocumentDragEnd?.(dragObject);
    }
    if (dndState.startEvent?.target && dndState.startEvent.target instanceof Element) {
        dndState.startEvent.target.classList.remove('controls-DragNDrop__dragTarget');
    }

    unregisterHandlers(props);

    dndState.dragEntity = undefined;
    dndState.startEvent = undefined;
    // Ключ перетаскиваемой записи мы запоминаем на mouseDown, но днд начнется только после смещения
    // на 4px и не факт, что он вообще начнется
    // Если сработал mouseUp, то днд точно не сработает и draggedKey нам уже не нужен
    dndState.draggedKey = undefined;
    // контроллер создается на mouseDown, но драг может и не начаться, поэтому контроллер уже не нужен
    if (
        dndState.controller &&
        !dndState.controller.isDragging() &&
        !dndState.controller.getDragEndPromise()
    ) {
        dndState.controller = undefined;
    }
}

function getDragObject(dndState: TState, mouseOrEndDndEvent: TEvent): TDragObject {
    if (!dndState.dragEntity) {
        throw Error('Missing dragEntity!');
    }
    if (!dndState.startEvent) {
        throw Error('Missing startEvent!');
    }

    return {
        entity: dndState.dragEntity,
        domEvent: mouseOrEndDndEvent,
        position: getPageXY(mouseOrEndDndEvent),
        offset: getDragOffset(mouseOrEndDndEvent, dndState.startEvent),
        draggingTemplateOffset: DRAGGING_OFFSET,
    };
}

function getDragOffset(moveEvent: TEvent, startEvent: TEvent): IMouseCoords {
    const moveEventXY = getPageXY(moveEvent);
    const startEventXY = getPageXY(startEvent);

    return {
        y: moveEventXY.y - startEventXY.y,
        x: moveEventXY.x - startEventXY.x,
    };
}

function getPageXY(event: TEvent): IMouseCoords {
    return DimensionsMeasurer.getMouseCoordsByMouseEvent(event);
}

function updateDraggingRender(props: IDragNDropProps, dragObject: TDragObject): void {
    const { updateDraggingRenderCallback } = props;
    if (updateDraggingRenderCallback && shouldDisplayDraggingRender(props)) {
        updateDraggingRenderCallback(dragObject, props.draggingRender);
    }
}

function shouldDisplayDraggingRender({
    viewModelState: { collection, sorting },
    draggingRender,
}: IDragNDropProps): boolean {
    if (!collection || !draggingRender) {
        return false;
    }

    return (
        collection.isDragOutsideList() ||
        (!!sorting && !!(sorting instanceof Array ? sorting.length : Object.keys(sorting).length))
    );
}

function calculateMouseOffsetInItem(
    event: TEvent,
    collection: Required<IDragNDropProps['viewModelState']>['collection']
):
    | {
          top: number;
          bottom: number;
          left: 0;
          right: 0;
      }
    | undefined {
    let result;

    const targetElement = getDndTargetRow(event, collection);

    if (targetElement) {
        const dragTargetRect = DimensionsMeasurer.getBoundingClientRect(
            targetElement as HTMLElement
        );

        result = { top: 0, bottom: 0, left: 0 as const, right: 0 as const };

        const mouseCoords = DimensionsMeasurer.getMouseCoordsByMouseEvent(event);

        // В плитке порядок записей слева направо, а не сверху вниз, поэтому считаем отступы слева и справа
        if (collection['[Controls/_tile/Tile]' as keyof typeof collection]) {
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

function getDndTargetRow(
    event: TEvent,
    collection: Required<IDragNDropProps['viewModelState']>['collection']
): Element {
    if (
        !event.target ||
        !(event.target as Element).classList ||
        !(event.target as Element).parentNode ||
        !((event.target as Element).parentNode as Element).classList
    ) {
        return event.target as Element;
    }

    const startTarget = event.target;
    let target = startTarget;

    const condition = () => {
        // В плитках элемент с классом controls-ListView__itemV имеет нормальные размеры,
        // а в обычном списке данный элемент будет иметь размер 0x0
        if (collection['[Controls/_tile/Tile]' as keyof typeof collection]) {
            return !(target as Element).classList.contains('controls-ListView__itemV');
        } else {
            return !((target as Element).parentNode as Element).classList.contains(
                'controls-ListView__itemV'
            );
        }
    };

    while (condition()) {
        target = (target as Element).parentNode as Element;

        // Условие выхода из цикла, когда controls-ListView__itemV не нашелся в родительских блоках
        if (
            !(target as Element).classList ||
            !(target as Element).parentNode ||
            !((target as Element).parentNode as Element).classList ||
            (target as Element).classList.contains('controls-BaseControl')
        ) {
            target = startTarget;
            break;
        }
    }

    return target as Element;
}

function registerHandlers(props: IDragNDropProps, api: IDragNDropAPI): void {
    props.register?.('mousemove', api.move);
    props.register?.('mouseup', api.end);
}

function unregisterHandlers(props: IDragNDropProps): void {
    props.unregister?.('mousemove');
    props.unregister?.('mouseup');
}
