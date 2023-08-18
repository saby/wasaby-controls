/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import { TemplateFunction } from 'UI/Base';
import { mixin } from 'Types/util';

import { CollectionItem, TMarkerSize } from 'Controls/display';

import Collection from './Collection';
import GridRowMixin, { IOptions as IGridRowMixinOptions } from './mixins/Row';
import { Model } from 'Types/entity';

export interface IOptions<TContents extends Model = Model> extends IGridRowMixinOptions<TContents> {
    owner: Collection<TContents>;
}

/**
 * Базовый класс строки в таблице
 * @private
 */
export default class Row<TContents extends Model = Model> extends mixin<
    CollectionItem<TContents>,
    GridRowMixin<TContents>
>(CollectionItem, GridRowMixin) {
    readonly '[Controls/_display/grid/Row]': boolean;

    // По умолчанию любая абстрактная строка таблицы не имеет возможности редактироваться.
    // Данная возможность доступна только строке с данными.
    readonly EditableItem: boolean;

    // TODO: Удалить имплементирование после выделения сущностей элементов списка
    //  (базовый элемент -> элемент данных / элемент группы /...)
    //  Интерфейс должен имплементироваться только у элементов, которые поддерживает отметку маркером.
    //  Сейчас, т.к. нет элемента данных, его имплементирует CollectionItem.
    get Markable(): boolean {
        return false;
    }
    readonly Fadable: boolean = false;
    readonly SelectableItem: boolean = false;
    readonly EnumerableItem: boolean = false;
    readonly EdgeRowSeparatorItem: boolean = false;
    readonly DraggableItem: boolean = false;
    readonly SupportItemActions: boolean = false;

    readonly listInstanceName: string = 'controls-Grid';

    readonly listElementName: string = 'row';

    constructor(options?: IOptions<TContents>) {
        super(options);
        GridRowMixin.initMixin(this, options);
    }

    // region overrides

    getTemplate(): TemplateFunction | string {
        return this.getDefaultTemplate();
    }

    setRowSeparatorSize(rowSeparatorSize: string): boolean {
        const changed = super.setRowSeparatorSize(rowSeparatorSize);
        if (changed && this._$columnItems) {
            this._updateSeparatorSizeInColumns('Row');
        }
        return changed;
    }

    _hasCheckBoxCell(): boolean {
        return (
            this.getMultiSelectVisibility() !== 'hidden' &&
            this.getMultiSelectPosition() !== 'custom'
        );
    }

    setMultiSelectVisibility(multiSelectVisibility: string): boolean {
        const hadCheckBoxCell = this._hasCheckBoxCell();
        const isChangedMultiSelectVisibility = super.setMultiSelectVisibility(
            multiSelectVisibility
        );
        if (isChangedMultiSelectVisibility) {
            this._reinitializeColumns();
        }

        if (this.isEditing() && this.getEditingConfig()?.mode === 'cell') {
            if (isChangedMultiSelectVisibility) {
                const hasCheckBoxCell = this._hasCheckBoxCell();
                if (hadCheckBoxCell !== hasCheckBoxCell) {
                    this._$editingColumnIndex += hasCheckBoxCell ? 1 : -1;
                }
            }
        }
        return isChangedMultiSelectVisibility;
    }

    setEditing(
        editing: boolean,
        editingContents?: TContents,
        silent?: boolean,
        columnIndex?: number
    ): void {
        // TODO: Убрать columnIndex.
        //  Подробнее можно прочитать в коментарии базового метода CollectionItem.setEditing
        //  https://online.sbis.ru/opendoc.html?guid=b13d5312-a8f5-4cea-b88f-8c4c043e4a77
        super.setEditing(editing, editingContents, silent, columnIndex);
        const colspanCallback = this._$colspanCallback;
        if (colspanCallback) {
            this._reinitializeColumns();
        }
    }

    setMarked(marked: boolean, silent?: boolean): void {
        const changed = marked !== this.isMarked();
        super.setMarked(marked, silent);
        if (changed) {
            this._redrawColumns('first');
        }
    }

    getMarkerClasses(
        markerSize: TMarkerSize = 'content-xs',
        addVerticalPaddings: boolean = true
    ): string {
        return super.getMarkerClasses(markerSize, addVerticalPaddings);
    }

    setSelected(selected: boolean | null, silent?: boolean): void {
        const changed = this._$selected !== selected;
        super.setSelected(selected, silent);
        if (changed) {
            this._redrawColumns('first');
        }
    }

    setActive(active: boolean, silent?: boolean): void {
        const changed = active !== this.isActive();
        super.setActive(active, silent);
        if (changed) {
            this._redrawColumns('all');
        }
    }

    // endregion

    getStickyHeaderPosition(): string {
        throw new Error(
            'Controls/_grid/display/Row:getStickyHeaderPosition() method should not be used!\n' +
                'Use the same method on cell!'
        );
    }
}

Object.assign(Row.prototype, {
    EditableItem: false,
    '[Controls/_display/grid/Row]': true,
    _moduleName: 'Controls/grid:GridRow',
    _instancePrefix: 'grid-row-',
});
