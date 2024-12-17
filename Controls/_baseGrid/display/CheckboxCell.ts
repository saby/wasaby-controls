/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { TemplateFunction } from 'UI/Base';
import {
    getBorderClassName,
    IMarkable,
    TBorderStyle,
    TBorderVisibility,
    TMarkerSize,
    TShadowVisibility,
} from 'Controls/display';
import Cell from './Cell';
import DataRow from './DataRow';
import { Model } from 'Types/entity';
import { TBackgroundStyle } from 'Controls/interface';
import type { ICellComponentProps, IRowComponentProps } from 'Controls/gridReact';
import { COLUMN_SCROLL_SELECTORS } from 'Controls/_baseGrid/display/constants';

/**
 * Ячейка строки в таблице, которая отображает чекбокс для множественного выбора
 * @private
 */
export default class CheckboxCell<T extends Model = Model, TOwner extends DataRow<T> = DataRow<T>>
    extends Cell<T, TOwner>
    implements IMarkable
{
    get Markable(): boolean {
        return true;
    }

    get CheckBoxCell(): boolean {
        return true;
    }

    get key(): string {
        return 'grid-checkbox-cell';
    }

    isEditing(): boolean {
        return this._$owner.isEditing();
    }

    getMinHeightClasses(): string {
        const minHeight = this._$owner?.getMinHeightClasses?.();
        return minHeight ? minHeight : super.getMinHeightClasses();
    }

    getTemplate(): TemplateFunction | string {
        return this.getOwner().getMultiSelectTemplate();
    }

    shouldDisplayMarker(marker: boolean): boolean {
        return this._$owner.shouldDisplayMarker(marker);
    }

    getMarkerClasses(markerSize: TMarkerSize = 'content-xs'): string {
        let classes = super.getMarkerClasses(markerSize);

        if (markerSize === 'content-xs') {
            classes += ' controls-GridView__itemV_marker_inCheckboxCell';
        }

        return classes;
    }

    shouldDisplayItemActions(): boolean {
        return false;
    }

    // region CellProps

    getCellComponentProps(rowProps: IRowComponentProps): ICellComponentProps {
        const superResult = super.getCellComponentProps(rowProps);

        if (rowProps.paddingTop && rowProps.paddingTop !== 'null') {
            // Чекбокс позиционируется абсолютно на всю ячейку, ему не нужны паддинги,
            // но маркер позиционируется от паддинга, поэтому вешаем на маркер отступ сверху
            superResult.markerClassName += ` controls-padding_top-${rowProps.paddingTop}`;
        }
        if (!superResult.markerSize || superResult.markerSize === 'content-xs') {
            superResult.markerClassName += ' controls-GridView__itemV_marker_inCheckboxCell';
        }

        // TODO: Перенести чекбокс в первую ячейку.
        // https://online.sbis.ru/opendoc.html?guid=ec0a0a95-66e7-4b5b-ad43-e7836d445c45&client=3
        // Дублирование настройки фона ячейки чекбокса в редактируемой строке.
        // Должно быть только в DataCell, т.к. только она редактируется.
        if (this.isEditing() && this.getEditingConfig().mode !== 'cell') {
            superResult.backgroundStyle = `editing_${this._$owner.getEditingBackgroundStyle()}`;
            superResult.hoverBackgroundStyle = 'none';
        }

        return {
            ...superResult,
            paddingLeft: 'null',
            paddingRight: 'null',
            paddingTop: 'null',
            paddingBottom: 'null',
            rightSeparatorSize: 'null',
        };
    }

    // endregion CellProps
}

Object.assign(CheckboxCell.prototype, {
    '[Controls/_display/grid/CheckboxCell]': true,
    _moduleName: 'Controls/display:GridCheckboxCell',
    _instancePrefix: 'grid-checkbox-cell-',
    _$style: null,
});
