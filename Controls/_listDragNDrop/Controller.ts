/**
 * @kaizen_zone 1ae44c37-18d9-4109-b22c-bd35470364aa
 */
import {
    IDraggableCollection,
    IDraggableItem,
    IDragStrategy,
    IDragStrategyParams,
} from './interface';
import { SyntheticEvent } from 'UI/Vdom';
import { ItemsEntity } from 'Controls/dragnDrop';
import { ISelectionObject } from 'Controls/interface';
import { CrudEntityKey } from 'Types/source';
import { isEqual } from 'Types/object';
import { ISourceControllerOptions, NewSourceController } from 'Controls/dataSource';
import { process } from 'Controls/error';
import { factory } from 'Types/chain';
import { Model } from 'Types/entity';
import { TouchDetect } from 'EnvTouch/EnvTouch';

type StrategyConstructor<P> = new (
    model: IDraggableCollection<P>,
    draggableItem: IDraggableItem
) => IDragStrategy<P>;
const LIMIT_DRAG_SELECTION = 100;

/**
 * Контроллер, управляющий состоянием отображения драг'н'дропа
 * @class Controls/_listDragNDrop/Controller
 * @template P Тип объекта, обозначающего позицию
 * @public
 */

export default class Controller<P> {
    private _model: IDraggableCollection<P>;
    private _strategy: IDragStrategy<P>;
    private _strategyConstructor: StrategyConstructor<P>;
    private _renderInProgress: boolean = false;
    private _dragEndPromise: Promise<unknown> = null;
    private _dragStartedFromAnotherList: boolean = false;

    private _draggableItem: IDraggableItem;
    private _dragPosition: P;
    private _entity: ItemsEntity;
    private _changeDragTargetResult: boolean | undefined;

    constructor(
        model: IDraggableCollection<P>,
        draggableItem: IDraggableItem,
        strategyConstructor: StrategyConstructor<P>
    ) {
        this._model = model;
        this._strategyConstructor = strategyConstructor;
        this._draggableItem = draggableItem;
        this._strategy = new this._strategyConstructor(this._model, this._draggableItem);
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
        this._entity = entity;
        this._dragStartedFromAnotherList = dragStartedFromAnotherList;
        this._model.setDraggedItems(this._draggableItem, entity.getItems());
    }

    /**
     * Отображает перетаскиваемые сущности в указанной позиции списка
     * @param position Позиция в которой надо отобразить перемещаемые записи
     * @return {boolean} Изменилась ли позиция
     */
    setDragPosition(position: P): boolean {
        if (this._renderInProgress || isEqual(this._dragPosition, position)) {
            return false;
        }

        if (position === null) {
            this._dragPosition = this._strategy.getStartPosition();
            this._model.setDragPosition(this._strategy.getStartPosition());
        } else {
            this._dragPosition = position;
            this._model.setDragPosition(position);
        }

        // После изменения позиции должна произойти перерисовка по новому состоянию.
        // Пока она не произойдет, нельзя считать новую позицию.
        // Запоминаем это, чтобы игнорировать попытки обновиться до окончания перерисовки.
        this._renderInProgress = true;
        return true;
    }

    setDragEndPromise(promise: Promise<unknown>): void {
        this._dragEndPromise = promise;
    }

    getDragEndPromise(): Promise<unknown> {
        return this._dragEndPromise;
    }

    isDragStartedFromAnotherList(): boolean {
        return this._dragStartedFromAnotherList;
    }

    /**
     * Возвращает перетаскиваемый элемент
     */
    getDraggableItem(): IDraggableItem {
        return this._draggableItem;
    }

    /**
     * Заканчивает драг'н'дроп в списке. Все записи отображаются обычным образом
     */
    endDrag(): void {
        this._draggableItem = null;
        this._dragPosition = null;
        this._entity = null;
        this._strategy = null;
        this.setDragEndPromise(null);
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
    getDragPosition(): P {
        return this._dragPosition;
    }

    /**
     * Возвращает сущность перемещаемых записей
     */
    getDragEntity(): ItemsEntity {
        return this._entity;
    }

    /**
     * Рассчитывает итоговую позицию для перемещения
     * @param params
     */
    calculateDragPosition(params: IDragStrategyParams<P>): P {
        if (!this._strategy) {
            throw new Error('Strategy was not created. Should be called Controller::startDrag');
        }

        return this._strategy.calculatePosition({
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
    ): Promise<CrudEntityKey[]> {
        const draggedKeys = this._strategy.getDraggableKeys(selection.selected);
        // Не выполянем запрос, если все выбранные записи уже есть в рекордсете
        if (draggedKeys.length >= selection.selected.length && !selection.excluded.length) {
            return Promise.resolve(draggedKeys);
        }

        const controller = new NewSourceController({
            ...options,
            selectedKeys: selection.selected,
            excludedKeys: selection.excluded,
        });
        return controller
            .reload()
            .then((list) => {
                const draggableItemKeys = factory(list)
                    .toArray()
                    .map((it: Model) => {
                        return it.getKey();
                    });
                const startDraggableItemKey = this._draggableItem.getContents().getKey();
                const hasStartDraggableItem =
                    draggableItemKeys.indexOf(startDraggableItemKey) !== -1;
                // Запись, за которую начали перетаскивание, может не попасть в массив из-за лимита в 100 записей.
                // Поэтому добавим эту запись в массив сами.
                if (draggableItemKeys.length === LIMIT_DRAG_SELECTION && !hasStartDraggableItem) {
                    draggableItemKeys.push(startDraggableItemKey);
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
        event: SyntheticEvent<MouseEvent>
    ): boolean {
        const target = event.target;
        const allowByTarget =
            target instanceof Element && !target.closest('.controls-List_DragNDrop__notDraggable');
        return (
            !readOnly &&
            itemsDragNDrop &&
            (!canStartDragNDropOption ||
                (typeof canStartDragNDropOption === 'function' && canStartDragNDropOption())) &&
            allowByTarget &&
            (!event.nativeEvent || !event.nativeEvent.button) &&
            !TouchDetect.getInstance().isTouch()
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
    private static _sortKeys(model: IDraggableCollection, keys: (number | string)[]): void {
        keys.sort((a, b) => {
            const indexA = model.getIndexByKey(a);
            const indexB = model.getIndexByKey(b);
            return indexA > indexB ? 1 : -1;
        });
    }
}
