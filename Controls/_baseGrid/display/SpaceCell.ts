/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import * as React from 'react';

import { TemplateFunction } from 'UICommon/Base';

import Cell from './Cell';
import SpaceRow from './SpaceRow';
import { SpaceCollectionItem } from 'Controls/display';
import type { IRowComponentProps, ICellComponentProps } from 'Controls/gridReact';

const DEFAULT_CELL_TEMPLATE = 'Controls/grid:ItemsSpacingCellComponent';

/**
 * Класс представляет ячейку строки-отступа.
 * Основная задача данного класса - реализовать отступ требуемого размера.
 * @private
 */
export default class SpaceCell extends Cell {
    protected _$owner: SpaceRow;
    protected _defaultCellTemplate: string = DEFAULT_CELL_TEMPLATE;

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
