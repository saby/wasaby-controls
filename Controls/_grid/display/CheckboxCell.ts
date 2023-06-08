/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
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
import type {
    ICellComponentProps,
    IRowComponentProps,
} from 'Controls/gridReact';
import * as React from 'react';

/**
 * Ячейка строки в таблице, которая отображает чекбокс для множественного выбора
 * @private
 */
export default class CheckboxCell<
        T extends Model = Model,
        TOwner extends DataRow<T> = DataRow<T>
    >
    extends Cell<T, TOwner>
    implements IMarkable
{
    readonly Markable: boolean = true;
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
            templateHoverBackgroundStyle ||
            this._$owner.getHoverBackgroundStyle();

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

        const backgroundColorWrapperClasses =
            this._getBackgroundColorWrapperClasses(
                backgroundColorStyle,
                templateHighlightOnHover,
                hoverBackgroundStyle
            );
        wrapperClasses += ` ${backgroundColorWrapperClasses}`;

        if (
            this._$owner.hasColumnScroll() ||
            this._$owner.hasNewColumnScroll()
        ) {
            wrapperClasses += ` ${this._getColumnScrollWrapperClasses()}`;
        }

        return wrapperClasses;
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
        return {
            ...super.getCellComponentProps(rowProps, render),
            paddingLeft: 'null',
            paddingRight: 'null',
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
