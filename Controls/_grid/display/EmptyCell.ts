/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import { mixin } from 'Types/util';
import EmptyRow from './EmptyRow';
import Cell, { IOptions as IBaseCellOptions } from './Cell';
import CellCompatibility from './compatibility/DataCell';

export type TContentAlign = 'center' | 'start' | 'end';
type TVerticalAlign = 'center' | 'start' | 'end';

/**
 * Ячейка строки пустого представления таблицы
 * @private
 */
class EmptyCell extends mixin<Cell<null, EmptyRow>, CellCompatibility<null>>(
    Cell,
    CellCompatibility
) {
    protected readonly _defaultCellTemplate: string =
        'Controls/grid:EmptyColumnTemplate';

    readonly listInstanceName: string = 'controls-Grid__empty';

    // region Аспект "Стилевое оформление"
    getWrapperClasses(
        tmplBackgroundColorStyle: string,
        highlightOnHover?: boolean
    ): string {
        let classes;
        const columnScrollClasses =
            this._$owner.hasColumnScroll() || this._$owner.hasNewColumnScroll()
                ? this._getColumnScrollWrapperClasses()
                : '';
        const backgroundColorStyle =
            tmplBackgroundColorStyle ||
            this.getOwner().getRowTemplateOptions()?.backgroundColorStyle ||
            'editing';

        // todo https://online.sbis.ru/opendoc.html?guid=024784a6-cc47-4d1a-9179-08c897edcf72
        const hasRowTemplate = this._$owner.getRowTemplate();

        if (this._$isSingleColspanedCell && hasRowTemplate) {
            classes = columnScrollClasses;
        } else if (this.isMultiSelectColumn()) {
            classes =
                'controls-GridView__emptyTemplate__checkBoxCell ' +
                'controls-Grid__row-cell-editing ' +
                `${columnScrollClasses}`;
            if (backgroundColorStyle === 'editing') {
                classes +=
                    ' controls-Grid__row-cell-background-editing_default';
            }
        } else {
            classes = super.getWrapperClasses(
                backgroundColorStyle,
                highlightOnHover
            );
            if (backgroundColorStyle === 'editing') {
                classes +=
                    ' controls-Grid__row-cell-background-editing_default';
            }
        }

        classes += ' ' + this._getColumnSeparatorClasses();

        return classes;
    }

    getContentClasses(
        topSpacing: string = 'default',
        bottomSpacing: string = 'default',
        align: TContentAlign = 'center'
    ): string {
        let classes: string = '';

        // todo https://online.sbis.ru/opendoc.html?guid=024784a6-cc47-4d1a-9179-08c897edcf72
        const hasRowTemplate = this._$owner.getRowTemplate();

        if (this._$isSingleColspanedCell && hasRowTemplate) {
            // Если пустое представление тянется (по умолчанию), то мы используем выравнивание контента флексом
            if (this._$column.templateOptions.height !== 'auto') {
                classes +=
                    ' controls-GridView__emptyTemplate_stretch' +
                    ` controls-GridView__emptyTemplate_stretch_align_${align}`;
            }
        } else if (this.isMultiSelectColumn()) {
            classes = '';
        } else {
            classes =
                this._getHorizontalPaddingClasses(this._$column.cellPadding) +
                this._getVerticalPaddingClasses() +
                ' controls-Grid__row-cell__content' +
                ' controls-GridView__emptyTemplate__cell' +
                ' controls-Grid__row-cell-editing' +
                ' controls-Grid__row-cell__content_baseline_default';
        }

        classes += this._getRoundBorderClasses();

        return classes;
    }

    getWrapperStyles(): string {
        let styles = super.getWrapperStyles();
        if (
            this._$isActsAsRowTemplate &&
            this.getOwner().hasNewColumnScroll()
        ) {
            styles += 'overflow-x: hidden;';
        }
        return styles;
    }

    getContentStyles(containerSize?: number): Record<string, string> {
        if (containerSize && this._$isActsAsRowTemplate) {
            return {
                width: `${containerSize}px`,
            };
        }
        return {};
    }

    /**
     * Задаёт CSS классы шаблона пустого представления аналогично плоскому списку.
     * topSpacing и bottomSpacing должны иметь те же значения, что и в плоском списке.
     * По умолчанию их размер = l.
     * @param topSpacing
     * @param bottomSpacing
     * @param align
     */
    getInnerContentWrapperClasses(
        topSpacing: string = 'l',
        bottomSpacing: string = 'l',
        align: TContentAlign = 'center'
    ): string {
        let classes: string = '';
        const hasRowTemplate = this._$owner.getRowTemplate();

        if (this._$isSingleColspanedCell && hasRowTemplate) {
            classes =
                'controls-ListView__empty' +
                ` controls-ListView__empty-textAlign_${align}` +
                ` controls-ListView__empty_topSpacing_${topSpacing}` +
                ` controls-ListView__empty_bottomSpacing_${bottomSpacing}`;

            if (align !== 'center') {
                classes += ` ${this._getHorizontalPaddingClasses({})}`;
            }
        } else {
            classes = ' controls-GridView__emptyTemplate';
        }

        return classes;
    }

    // endregion
}

Object.assign(EmptyCell.prototype, {
    '[Controls/_display/grid/EmptyCell]': true,
    _moduleName: 'Controls/grid:GridEmptyCell',
    _instancePrefix: 'grid-empty-cell-',
});

export default EmptyCell;
export { EmptyCell, IBaseCellOptions as IEmptyCellOptions };
