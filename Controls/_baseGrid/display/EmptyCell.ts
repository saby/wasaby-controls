/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { mixin } from 'Types/util';
import EmptyRow from './EmptyRow';
import Cell, { IOptions as IBaseCellOptions } from './Cell';
import CellCompatibility from './compatibility/DataCell';
import type { IRowComponentProps, ICellComponentProps } from 'Controls/gridReact';

export type TContentAlign = 'center' | 'start' | 'end';

/**
 * Ячейка строки пустого представления таблицы
 * @private
 */
class EmptyCell extends mixin<Cell<null, EmptyRow>, CellCompatibility<null>>(
    Cell,
    CellCompatibility
) {
    protected readonly _defaultCellTemplate: string = 'Controls/grid:EmptyColumnTemplate';

    readonly listInstanceName: string = 'controls-Grid__empty';

    getHasEmptyView() {
        return this.getOwner().getHasEmptyView();
    }

    getCellComponentProps(rowProps: IRowComponentProps): ICellComponentProps {
        const superProps = super.getCellComponentProps(rowProps);

        //TODO: Ломает шаблон с редактированием (Демка: Controls-demo/gridNew/EmptyGrid/Index)
        //superProps.className += ' controls-ListView__empty tw-w-full tw-h-full';

        const halign = superProps.halign || 'center';
        const paddingLeft = halign === 'center' ? 'null' : superProps.paddingLeft;
        const paddingRight = halign === 'center' ? 'null' : superProps.paddingRight;

        return {
            ...superProps,
            paddingTop: superProps.paddingTop || 'l',
            paddingBottom: superProps.paddingBottom || 'l',
            paddingLeft,
            paddingRight,
            hoverBackgroundStyle: 'none',
            cursor: 'default',
            gridColumn: this,
            halign,
        };
    }
}

Object.assign(EmptyCell.prototype, {
    '[Controls/_display/grid/EmptyCell]': true,
    _moduleName: 'Controls/grid:GridEmptyCell',
    _instancePrefix: 'grid-empty-cell-',
});

export default EmptyCell;
export { EmptyCell, IBaseCellOptions as IOptions };