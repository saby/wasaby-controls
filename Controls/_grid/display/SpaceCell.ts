/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import * as React from 'react';

import { TemplateFunction } from 'UICommon/Base';

import Cell from 'Controls/_grid/display/Cell';
import SpaceRow from 'Controls/_grid/display/SpaceRow';
import { SpaceCollectionItem } from 'Controls/display';
import type { IRowComponentProps, ICellComponentProps } from 'Controls/gridReact';

/**
 * Класс представляет ячейку строки-отступа.
 * Основная задача данного класса - реализовать отступ требуемого размера.
 * @private
 */
export default class SpaceCell extends Cell {
    protected _$owner: SpaceRow;

    getTemplate(): TemplateFunction | string | React.Component {
        return this._defaultCellTemplate;
    }

    hasCellContentRender(): boolean {
        return false;
    }

    getDefaultDisplayValue(): string {
        return '';
    }

    protected _getWrapperBaseClasses(templateHighlightOnHover: boolean): string {
        return '';
    }

    protected _getBackgroundColorWrapperClasses(
        backgroundColorStyle?: string,
        templateHighlightOnHover?: boolean,
        hoverBackgroundStyle?: string
    ): string {
        return super._getBackgroundColorWrapperClasses(
            backgroundColorStyle,
            templateHighlightOnHover,
            'transparent'
        );
    }

    getContentClasses(): string {
        return SpaceCollectionItem.buildVerticalSpacingClass(this._$owner.getItemsSpacing());
    }

    getCellComponentProps(
        rowProps: IRowComponentProps,
        render: React.ReactElement
    ): ICellComponentProps {
        const superProps = super.getCellComponentProps(rowProps, render);

        return {
            ...superProps,
            paddingTop: 'null',
            paddingBottom: 'null',
            paddingLeft: 'null',
            paddingRight: 'null',
            minHeightClassName: SpaceCollectionItem.buildVerticalSpacingClass(
                this._$owner.getItemsSpacing()
            ),
            hoverBackgroundStyle: 'none',
            cursor: 'default',
            borderVisibility: 'hidden',
            leftSeparatorSize: 'null',
            rightSeparatorSize: 'null',
        };
    }
}

Object.assign(SpaceCell.prototype, {
    '[Controls/_display/grid/SpaceCell]': true,
    _moduleName: 'Controls/grid:SpaceCell',
    _instancePrefix: 'grid-space-cell-',
    _$owner: null,
    _$columnsLength: null,
    _$contents: null,
});
