/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import * as React from 'react';
import { Model } from 'Types/entity';
import { TemplateFunction } from 'UI/Base';

import { IOptions as ICellOptions } from './Cell';
import DataRow from './DataRow';
import DataCell from './DataCell';

export interface IOptions<TContents extends Model = Model> extends ICellOptions<TContents> {
    wrapperStyle: string;
    contentStyle?: string;
    stickyProperty: string;
    stickyHeaderZIndex: number;
    isPointerEventsDisabled?: boolean;
}

/**
 * Ячейка застиканной лесенки
 * @private
 */
export default class StickyLadderCell<
    TContents extends Model = Model,
    TOwner extends DataRow<TContents> = DataRow<TContents>
> extends DataCell<TContents, TOwner> {
    get Markable(): boolean {
        return false;
    }

    get key(): string {
        return this._$instanceId;
    }

    protected _$wrapperStyle: string;
    protected _$contentStyle: React.CSSProperties;
    protected _$stickyProperty: string;
    protected _$stickyHeaderZIndex: number;
    protected _$isPointerEventsDisabled: boolean;

    getWrapperClasses(backgroundColorStyle?: string): string {
        let wrapperClasses = 'controls-Grid__row-ladder-cell';
        wrapperClasses += this._getWrapperSeparatorClasses();
        wrapperClasses += this._getColumnScrollWrapperClasses();
        return wrapperClasses;
    }

    getStickyContentClasses(): string {
        let contentClasses = 'controls-Grid__row-main_ladderWrapper';
        if (this._$isPointerEventsDisabled) {
            contentClasses += ' controls-Grid__ladder-cell__withoutPointerEvents';
        }
        return contentClasses;
    }

    getContentClasses(
        backgroundColorStyle: string,
        cursor: string = 'pointer',
        templateHighlightOnHover: boolean = true
    ): string {
        return '';
    }

    getOriginalContentClasses(
        backgroundColorStyle: string,
        cursor: string = 'pointer',
        templateHighlightOnHover: boolean = true
    ): string {
        const topPadding = this._$owner.getTopPadding();
        let contentClasses = super.getContentClasses(backgroundColorStyle, cursor, false);
        contentClasses += ' controls-Grid__row-ladder-cell__content';
        contentClasses += ` controls-Grid__row-ladder-cell__content_${topPadding}`;
        if (this._$isPointerEventsDisabled) {
            contentClasses += ' controls-Grid__ladder-cell__withoutPointerEvents';
        }
        return contentClasses;
    }

    getWrapperStyles(): string {
        return this._$wrapperStyle;
    }

    getStickyContentStyles(): React.CSSProperties {
        return this._$contentStyle;
    }

    getContentStyles(): string {
        return '';
    }

    getStickyProperty(): string {
        return this._$stickyProperty;
    }

    getStickyHeaderClasses(): string {
        let classes = '';
        const stickyLadder = this._$owner.getStickyLadder();
        const stickyProperties = this._$owner.getStickyLadderProperties(this._$column);
        const hasMainCell = !!stickyLadder[stickyProperties[0]].ladderLength;
        const hasHeader = this._$owner.hasHeader();
        const hasTopResults = this._$owner.getResultsPosition() === 'top';
        const hasGroup = this._$owner.hasStickyGroup();
        if (!hasMainCell) {
            const headerSuffix = hasHeader ? '_withHeader' : '';
            const resultsSuffix = hasTopResults ? '_withResults' : '';
            const groupSuffix = hasGroup ? '_withGroup' : '';
            classes += ` controls-Grid__row-cell__ladder-spacing${headerSuffix}${resultsSuffix}${groupSuffix}`;
        } else if (hasGroup) {
            classes += ' controls-Grid__row-cell__ladder-main_spacing_withGroup';
        } else {
            classes += ' controls-Grid__row-cell__ladder-main_spacing';
        }
        return classes;
    }

    getZIndex(): number {
        return this._$stickyHeaderZIndex + (this._$isFixed ? 2 : 0);
    }

    getOriginalTemplate(): TemplateFunction | string {
        return super.getTemplate();
    }

    shouldDisplayItemActions(): boolean {
        return false;
    }
}

Object.assign(StickyLadderCell.prototype, {
    '[Controls/_display/StickyLadderCell]': true,
    _moduleName: 'Controls/display:GridStickyLadderCell',
    _instancePrefix: 'grid-ladder-cell-',
    _$wrapperStyle: '',
    _$contentStyle: null,
    _$stickyProperty: '',
    _$isPointerEventsDisabled: false,
    _$stickyHeaderZIndex: 0,
});
