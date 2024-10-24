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
import { DRAG_SCROLL_JS_SELECTORS } from 'Controls/columnScroll';
import { Model } from 'Types/entity';
import { TBackgroundStyle } from 'Controls/interface';
import type { ICellComponentProps, IRowComponentProps } from 'Controls/gridReact';
import * as React from 'react';

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

    getWrapperClasses(
        backgroundColorStyle: TBackgroundStyle,
        templateHighlightOnHover?: boolean,
        templateHoverBackgroundStyle?: TBackgroundStyle,
        shadowVisibility: TShadowVisibility = 'hidden',
        borderVisibility: TBorderVisibility = 'hidden',
        borderStyle: TBorderStyle = 'default'
    ): string {
        const hoverBackgroundStyle =
            templateHoverBackgroundStyle || this._$owner.getHoverBackgroundStyle();

        let wrapperClasses = '';

        wrapperClasses += this._getWrapperBaseClasses(templateHighlightOnHover);
        wrapperClasses += this._getWrapperSeparatorClasses();
        wrapperClasses +=
            ' js-controls-ListView__notEditable' +
            ` ${DRAG_SCROLL_JS_SELECTORS.NOT_DRAG_SCROLLABLE}` +
            ' controls-GridView__checkbox' +
            ' controls-GridView__checkbox_position-default' +
            ' controls-Grid__row-cell-checkbox' +
            ` controls-Grid__row-cell-checkbox-${this.getStyle()}`;

        if (!this.isStickied()) {
            wrapperClasses += ' controls-GridView__checkbox_relative';
        }

        if (this.isFirstColumn()) {
            wrapperClasses += ` controls-Grid__row-cell__first-${this.getStyle()}`;
        }

        if (this.isLastColumn()) {
            wrapperClasses += ` controls-Grid__row-cell__last-${this.getStyle()}`;
        }

        if (this.getOwner().shouldDisplayMarker()) {
            wrapperClasses += ` controls-Grid__row-cell_selected controls-Grid__row-cell_selected-${this.getStyle()}`;
        }

        if (this.isEditing()) {
            wrapperClasses += ' controls-Grid__row-cell-editing';
        }

        wrapperClasses += getBorderClassName(
            borderVisibility,
            borderStyle,
            this.isFirstColumn(),
            this.isLastColumn()
        );
        wrapperClasses += this._getShadowClasses(shadowVisibility);

        const backgroundColorWrapperClasses = this._getBackgroundColorWrapperClasses(
            backgroundColorStyle,
            templateHighlightOnHover,
            hoverBackgroundStyle
        );
        wrapperClasses += ` ${backgroundColorWrapperClasses}`;

        if (this._$owner.hasColumnScroll()) {
            wrapperClasses += ` ${this._getColumnScrollWrapperClasses()}`;
        }

        return wrapperClasses;
    }

    protected _getBackgroundColorWrapperClasses(
        backgroundColorStyle?: TBackgroundStyle,
        templateHighlightOnHover?: boolean,
        hoverBackgroundStyle?: TBackgroundStyle
    ): string {
        let wrapperClasses = super._getBackgroundColorWrapperClasses(
            backgroundColorStyle,
            templateHighlightOnHover,
            hoverBackgroundStyle
        );
        if (this._$owner.getGroupViewMode() === 'blocks' || this._$owner.getGroupViewMode() === 'titledBlocks') {
            wrapperClasses += ` controls-background-${backgroundColorStyle}`;
        }
        return wrapperClasses;
    }

    getMinHeightClasses(): string {
        const minHeight = this._$owner?.getMinHeightClasses?.();
        return minHeight ? minHeight : super.getMinHeightClasses();
    }

    getContentClasses(
        backgroundColorStyle: TBackgroundStyle,
        cursor: string = 'pointer',
        templateHighlightOnHover: boolean = true
    ): string {
        // Навешиваем классы в Row::getMultiSelectClasses, т.к. если позиция custom, то мы не создадим CheckboxCell
        return '';
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

    getCellComponentProps(
        rowProps: IRowComponentProps,
        render: React.ReactElement
    ): ICellComponentProps {
        const superResult = super.getCellComponentProps(rowProps, render);

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
