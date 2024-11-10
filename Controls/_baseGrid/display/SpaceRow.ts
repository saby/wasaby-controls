/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { Model } from 'Types/entity';
import Row, { IOptions } from './Row';
import { TColspanCallbackResult } from './mixins/Grid';
import { IColumn, TColumns } from './interface/IColumn';
import { IInitializeColumnsOptions } from './mixins/Row';
import { TOffsetSize } from 'Controls/interface';
import type { IRowComponentProps } from 'Controls/gridReact';
import { SpaceCollectionItem } from 'Controls/display';

export interface ISpaceRowOptions<TContents extends Model = Model> extends IOptions<TContents> {
    itemsSpacing?: TOffsetSize;
}

/**
 * Класс реализующий строку-отступ в таблицах.
 * Основная задача данного класса - реализовать отступ требуемого размера между записями с данными.
 * Инстансы данного класса встраиваются в коллекцию при помощи стратегии ItemsSpacingStrategy.
 * @private
 */
export default class SpaceRow<T extends Model = Model> extends Row<T> {
    readonly '[Controls/_itemActions/interface/IItemActionsItem]': boolean = false;

    readonly EditableItem: boolean = false;

    get Markable(): boolean {
        return false;
    }

    readonly Fadable: boolean = false;
    readonly SupportItemActions: boolean = false;
    readonly SelectableItem: boolean = false;
    readonly EdgeRowSeparatorItem: boolean = false;
    readonly LadderSupport: boolean = false;
    readonly DraggableItem: boolean = false;

    readonly listElementName: string = 'space-item';

    protected _$itemsSpacing: TOffsetSize;

    constructor(option: ISpaceRowOptions<T>) {
        super(option);
    }

    getTemplate(): string {
        return 'Controls/baseList:SpaceItemTemplate';
    }

    isEditing(): boolean {
        return false;
    }

    isActive(): boolean {
        return false;
    }

    isMarked(): boolean {
        return false;
    }

    isSelected(): boolean {
        return false;
    }

    isSwiped(): boolean {
        return false;
    }

    getLevel(): number {
        return 0;
    }

    isVisibleCheckbox(): boolean {
        return false;
    }

    isLastItem(): boolean {
        return false;
    }

    setGridColumnsConfig(columns: TColumns): void {
        this.setColumnsConfig(columns);
    }

    /**
     * Возвращает текущую высоту записи-отступа
     */
    getItemsSpacing(): TOffsetSize {
        return this._$itemsSpacing;
    }

    /**
     * Задает высоту записи-отступа
     */
    setItemsSpacing(itemsSpacing: TOffsetSize): void {
        this._$itemsSpacing = itemsSpacing;
        this._nextVersion();
    }

    protected _getColspan(column: IColumn, columnIndex: number): TColspanCallbackResult {
        if (this.hasColumnScrollReact()) {
            if (columnIndex < this.getStickyColumnsCount()) {
                return this.getStickyColumnsCount();
            } else {
                return 'end';
            }
        }
        return 'end';
    }

    protected _initializeColumns(
        options: IInitializeColumnsOptions = {
            prepareStickyLadderCellsStrategy: 'add',
            shouldAddMultiSelectCell: true,
        }
    ): void {
        super._initializeColumns({
            ...options,
            shouldAddMultiSelectCell: false,
        });
    }

    getWrapperClasses(): string {
        let result =
            'controls-ListView__itemV controls-ListView__item_contentWrapper' +
            ' controls-List__SpaceItem controls-Grid__SpaceRow';

        if (this._$className) {
            result += ' ' + this._$className;
        }

        if (this._$itemsSpacing) {
            result += ` ${SpaceCollectionItem.buildVerticalSpacingClass(this._$itemsSpacing)}`;
        }

        return result;
    }

    getRowComponentProps(): IRowComponentProps {
        // Строка SpacingRow не должна обрабатывать никаких событий.
        // Вызывается базовый метод с зануленными обработчиками событий.
        return {
            ...super.getRowComponentProps(),
            borderVisibility: 'hidden',
        };
    }
}

Object.assign(SpaceRow.prototype, {
    '[Controls/_display/SpaceCollectionItem]': true,
    '[Controls/_baseGrid/display/SpaceRow]': true,
    _moduleName: 'Controls/grid:SpaceRow',
    _instancePrefix: 'grid-space-row',
    _cellModule: 'Controls/grid:SpaceCell',
    _$itemsSpacing: null,
});
