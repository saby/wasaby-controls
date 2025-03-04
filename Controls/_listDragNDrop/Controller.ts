/**
 * @kaizen_zone 26b9ed5c-cfb5-41e7-8539-2b5dfaf4a5e0
 */
import {
    IDraggableCollection,
    IDraggableItem,
    IDragStrategy,
    IDragStrategyParams,
} from './interface';
import { SyntheticEvent } from 'UI/Vdom';
import { ItemsEntity } from 'Controls/dragnDrop';
import { ISelectionObject, TKeysSelection } from 'Controls/interface';
import { CrudEntityKey } from 'Types/source';
import { isEqual } from 'Types/object';
import { ISourceControllerOptions, NewSourceController } from 'Controls/dataSource';
import { process } from 'Controls/error';
import { factory } from 'Types/chain';
import { TouchDetect } from 'EnvTouch/EnvTouch';
import { IDragPosition } from 'Controls/display';
import * as React from 'react';
import { constants } from 'Env/Env';

type StrategyConstructor<TPositionDescription extends IDragPosition<IDraggableItem>> = new (
    model: IDraggableCollection<TPositionDescription>,
    draggableItem: IDraggableItem
) => IDragStrategy<TPositionDescription>;
const LIMIT_DRAG_SELECTION = 100;

type TDragEndPromise = Promise<unknown>;

/**
 * Контроллер, управляющий состоянием отображения драг'н'дропа
 * @template TPositionDescription Тип объекта, обозначающего позицию
 * @public
 */

export default class Controller<TPositionDescription extends IDragPosition<IDraggableItem>> {
    private _model: IDraggableCollection<TPositionDescription>;
    private _strategy?: IDragStrategy<TPositionDescription>;
    private _strategyConstructor: StrategyConstructor<TPositionDescription>;
    private _renderInProgress: boolean = false;
    private _dragEndPromise?: TDragEndPromise;
    private _dragStartedFromAnotherList: boolean = false;

    private _draggableItem?: IDraggableItem;
    private _dragPosition?: TPositionDescription;
    private _entity?: ItemsEntity;
    private _changeDragTargetResult: boolean | undefined;

    private _isNewList: boolean = false;

    constructor(
        model: IDraggableCollection<TPositionDescription>,
        draggableItem: IDraggableItem,
        strategyConstructor: StrategyConstructor<TPositionDescription>,
        isNewList: boolean = false
    ) {
        this._model = model;
        this._strategyConstructor = strategyConstructor;
        this._draggableItem = draggableItem;
        this._strategy = new this._strategyConstructor(this._model, this._draggableItem);
        this._isNewList = isNewList;
    }

    afterRenderListControl(): void {
        this._renderInProgress = false;
    }

    /**
     * Запускает отображение в списке начала драг н дропа.
     * Позволяет отобразить перетаскиеваемый элемент особым образом, отличным от остальных элементов.
     * @param {ItemsEntity} entity - сущность перемещения, содержит весь список перемещаемых записей
     * @param {boolean} dragStartedFromAnotherList - флаг, который означает что изначально днд начался в другом списке
     */
    startDrag(entity: ItemsEntity, dragStartedFromAnotherList: boolean = false): void {
        if (this._draggableItem === undefined) {
            throw Error(
                'Внутренняя ошибка платформы!\n' +
                    'Ошибка перемещения записи. ' +
                    'Отсутсвует перемещаемый элемент коллекции.'
            );
        }

        this._entity = entity;
        this._dragStartedFromAnotherList = dragStartedFromAnotherList;
        this._model.setDraggedItems(this._draggableItem, entity.getItems());
    }

    /**
     * Отображает перетаскиваемые сущности в указанной позиции списка
     * @param position Позиция в которой надо отобразить перемещаемые записи
     * @return {boolean} Изменилась ли позиция
     */
    setDragPosition(position: TPositionDescription): boolean {
        if (this._renderInProgress || isEqual(this._dragPosition, position)) {
            return false;
        }

        if (position === null) {
            this._dragPosition = this._getStrategy().getStartPosition();
            this._model.setDragPosition(this._getStrategy().getStartPosition());
        } else {
            this._dragPosition = position;
            this._model.setDragPosition(position);
        }

        if (!this._isNewList) {
            // После изменения позиции должна произойти перерисовка по новому состоянию.
            // Пока она не произойдет, нельзя считать новую позицию.
            // Запоминаем это, чтобы игнорировать попытки обновиться до окончания перерисовки.
            this._renderInProgress = true;
        }
        return true;
    }

    setDragEndPromise(promise: TDragEndPromise | undefined): void {
        this._dragEndPromise = promise;
    }

    getDragEndPromise(): TDragEndPromise | undefined {
        return this._dragEndPromise;
    }

    isDragStartedFromAnotherList(): boolean {
        return this._dragStartedFromAnotherList;
    }

    /**
     * Возвращает перетаскиваемый элемент
     */
    getDraggableItem(): IDraggableItem | undefined {
        return this._draggableItem;
    }

    /**
     * Заканчивает драг'н'дроп в списке. Все записи отображаются обычным образом
     */
    endDrag(): void {
        this._draggableItem = undefined;
        this._dragPosition = undefined;
        this._entity = undefined;
        this._strategy = undefined;
        this.setDragEndPromise(undefined);
        this._model.resetDraggedItems();
    }

    /**
     * Возвращает true если в данный момент происходит перемещение
     */
    isDragging(): boolean {
        return !!this._entity && !this._dragEndPromise;
    }

    /**
     * Возвращает текущую позицию
     */
    getDragPosition(): TPositionDescription | undefined {
        return this._dragPosition;
    }

    /**
     * Возвращает сущность перемещаемых записей
     */
    getDragEntity(): ItemsEntity | undefined {
        return this._entity;
    }

    /**
     * Рассчитывает итоговую позицию для перемещения
     * @param params
     */
    calculateDragPosition(params: IDragStrategyParams<TPositionDescription>): TPositionDescription {
        return this._getStrategy().calculatePosition({
            ...params,
            currentPosition: this._dragPosition,
        });
    }

    /**
     * Возвращает ключи всех перетаскиваемых записей.
     * @remark
     * Если в selection лежат записи, которых нет в RecordSet, то за ними выполняется запрос на БЛ.
     * @param selection
     * @param items
     * @param options
     */
    getDraggableKeys(
        selection: ISelectionObject,
        options: ISourceControllerOptions
    ): Promise<TKeysSelection> {
        const draggedKeys = this._getStrategy().getDraggableKeys(selection.selected);
        // Не выполянем запрос, если все выбранные записи уже есть в рекордсете
        if (draggedKeys.length >= selection.selected.length && !selection.excluded.length) {
            return Promise.resolve(draggedKeys);
        }

        const controller = new NewSourceController(options);
        return controller
            .reload()
            .then((list) => {
                if (list instanceof Error) {
                    throw list;
                }
                const draggableItemKeys = factory(list)
                    .toArray()
                    .map((it) => {
                        return it.getKey();
                    });
                if (this._draggableItem) {
                    const startDraggableItemKey = this._draggableItem.getContents().getKey();
                    const hasStartDraggableItem =
                        draggableItemKeys.indexOf(startDraggableItemKey) !== -1;
                    // Запись, за которую начали перетаскивание, может не попасть в массив из-за лимита в 100 записей.
                    // Поэтому добавим эту запись в массив сами.
                    if (
                        draggableItemKeys.length === LIMIT_DRAG_SELECTION &&
                        !hasStartDraggableItem
                    ) {
                        draggableItemKeys.push(startDraggableItemKey);
                    }
                }
                return draggableItemKeys;
            })
            .catch((error) => {
                return process({ error }).then(() => {
                    return [];
                });
            });
    }

    setChangeDragTargetResult(result: boolean | undefined): void {
        this._changeDragTargetResult = result;
    }

    getChangeDragTargetResult(): boolean | undefined {
        return this._changeDragTargetResult;
    }

    private _getStrategy(): IDragStrategy<TPositionDescription> | never;
    private _getStrategy(strict: false): IDragStrategy<TPositionDescription> | undefined;
    private _getStrategy(strict?: false): IDragStrategy<TPositionDescription> | undefined | never {
        if (strict === false && !this._strategy) {
            throw Error(
                'Внутренняя ошибк платформы!\n' +
                    'Ошибка перемещения записи. ' +
                    'Стратегия перемещения не была создана.'
            );
        }

        return this._strategy;
    }

    /**
     * Проверяет можно ли начать перетаскивание
     * @param readOnly
     * @param itemsDragNDrop
     * @param canStartDragNDropOption
     * @param event
     */
    static canStartDragNDrop(
        readOnly: boolean,
        itemsDragNDrop: boolean,
        canStartDragNDropOption: boolean | Function,
        event: SyntheticEvent<MouseEvent> | React.MouseEvent | MouseEvent | TouchEvent
    ): boolean {
        // Поддержка переход на нативные события.
        // Для тестов, т.к. в Node нет событий
        const nativeEvent = Controller.getNativeEvent(event);

        const target = event.target;
        const allowByTarget =
            target instanceof Element && !target.closest('.controls-List_DragNDrop__notDraggable');
        return (
            !readOnly &&
            itemsDragNDrop &&
            (!canStartDragNDropOption ||
                (typeof canStartDragNDropOption === 'function' && canStartDragNDropOption())) &&
            allowByTarget &&
            (!nativeEvent || !(nativeEvent as MouseEvent).button) &&
            !TouchDetect.getInstance().isTouch()
        );
    }

    /**
     * Возвращает нативное событие MouseEvent или TouchEvent для браузерного окружения
     * и нативное событие любого типа для сервера
     */
    static getNativeEvent(
        event?: SyntheticEvent<MouseEvent> | React.MouseEvent | MouseEvent | TouchEvent
    ): MouseEvent | TouchEvent | undefined {
        if (!event) {
            return;
        }

        if (!constants.isBrowserPlatform) {
            const nativeEvent = event as Event & {
                nativeEvent?: MouseEvent | TouchEvent;
            };
            return nativeEvent.nativeEvent ?? (event as MouseEvent | TouchEvent | undefined);
        }

        if (
            (typeof window.MouseEvent !== 'undefined' && event instanceof MouseEvent) ||
            (typeof window.TouchEvent !== 'undefined' && event instanceof TouchEvent)
        ) {
            return event;
        }

        if ((event as { touches?: Touch[] }).touches?.length) {
            return event as TouchEvent;
        }

        return Controller.getNativeEvent(
            (
                event as {
                    nativeEvent?: MouseEvent | TouchEvent;
                }
            ).nativeEvent
        );
    }

    /**
     * Возвращает выбранные элементы, где
     * в выбранные добавлен элемент, за который начали drag-n-drop, если он отсутствовал,
     * выбранные элементы отсортированы по порядку их следования в модели(по индексам перед началом drag-n-drop),
     * из исключенных элементов удален элемент, за который начали drag-n-drop, если он присутствовал
     *
     * @param model
     * @param selection
     * @param dragKey
     */
    static getSelectionForDragNDrop(
        model: IDraggableCollection,
        selection: ISelectionObject,
        dragKey: CrudEntityKey
    ): ISelectionObject {
        const allSelected = selection.selected.indexOf(null) !== -1;

        const selected = [...selection.selected];
        if (selected.indexOf(dragKey) === -1 && !allSelected) {
            selected.push(dragKey);
        }

        this._sortKeys(model, selected);

        const excluded = [...selection.excluded];
        const dragItemIndex = excluded.indexOf(dragKey);
        if (dragItemIndex !== -1) {
            excluded.splice(dragItemIndex, 1);
        }

        return {
            selected,
            excluded,
            recursive: false,
        };
    }

    /**
     * Сортировать список ключей элементов
     * Ключи сортируются по порядку, в котором они идут в списке
     * @param model
     * @param keys
     * @private
     */
    private static _sortKeys(model: IDraggableCollection, keys: TKeysSelection): void {
        keys.sort((a, b) => {
            const indexA = model.getIndexByKey(a);
            const indexB = model.getIndexByKey(b);
            return indexA > indexB ? 1 : -1;
        });
    }
}
