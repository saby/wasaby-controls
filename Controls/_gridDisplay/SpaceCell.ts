/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import Cell from './Cell';
import SpaceRow from './SpaceRow';
import { SpaceCollectionItem } from 'Controls/display';
import { IRowComponentProps, ICellComponentProps, IColspanParams } from 'Controls/gridRender';

/**
 * Класс представляет ячейку строки-отступа.
 * Основная задача данного класса - реализовать отступ требуемого размера.
 * @private
 */
export default class SpaceCell extends Cell {
    readonly $GSC: boolean = true;
    protected _$owner: SpaceRow;

    getColspanParams(): IColspanParams {
        return {
            startColumn: 1,
            endColumn: -1,
        };
    }

    getDefaultDisplayValue(): string {
        return '';
    }

    getCellComponentProps(rowProps: IRowComponentProps): ICellComponentProps {
        const superProps = super.getCellComponentProps(rowProps);

        // При отображении групп блоками с заголовком на подложке
        // выводятся строки-отступы между залитыми блоками.
        // У них не должно быть в этом случае никакой заливки.
        if (
            this._$owner.getGroupViewMode() === 'titledBlocks' ||
            this._$owner.getGroupViewMode() === 'blocks'
        ) {
            superProps.backgroundStyle = 'none';
        }

        return {
            ...superProps,

            // row separators
            bottomSeparatorSize: 'null',
            topSeparatorSize: 'null',
            padding: {
                top: 'null',
                bottom: 'null',
                left: 'null',
                right: 'null',
            },
            minHeightClassName: SpaceCollectionItem.buildVerticalSpacingClass(
                this._$owner.getItemsSpacing()
            ),
            hoverBackgroundStyle: 'none',
            backgroundStyle: 'none',
            cursor: 'default',
            borderVisibility: 'hidden',
            leftSeparatorSize: 'null',
            rightSeparatorSize: 'null',
            valign: 'center',
        };
    }
}

Object.assign(SpaceCell.prototype, {
    $GSC: true, // GridSpaceCell
    _moduleName: 'Controls/grid:SpaceCell',
    _instancePrefix: 'grid-space-cell-',
    _$owner: null,
    _$columnsLength: null,
    _$contents: null,
});
