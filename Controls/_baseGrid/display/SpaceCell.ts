/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import Cell from './Cell';
import SpaceRow from './SpaceRow';
import { SpaceCollectionItem } from 'Controls/display';
import type { IRowComponentProps, ICellComponentProps } from 'Controls/gridReact';

/**
 * Класс представляет ячейку строки-отступа.
 * Основная задача данного класса - реализовать отступ требуемого размера.
 * @private
 */
export default class SpaceCell extends Cell {
    readonly '[Controls/_display/grid/SpaceCell]': boolean = true;
    protected _$owner: SpaceRow;

    hasCellContentRender(): boolean {
        return false;
    }

    getDefaultDisplayValue(): string {
        return '';
    }

    protected _getWrapperBaseClasses(): string {
        let classes = ` controls-Grid__row-cell controls-Grid__cell_${this.getStyle()}`;
        classes += ' js-controls-Grid__row-cell';
        classes += ' controls-ListView__item_contentWrapper';
        return classes;
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

    getCellComponentProps(rowProps: IRowComponentProps): ICellComponentProps {
        const superProps = super.getCellComponentProps(rowProps);

        // При отображении групп блоками с заголовком на подложке
        // выводятся строки-отступы между залитыми блоками.
        // У них не должно быть в этом случае никакой заливки.
        if (this._$owner.getGroupViewMode() === 'titledBlocks') {
            superProps.backgroundStyle = 'none';
        }

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
            valign: 'center',
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
