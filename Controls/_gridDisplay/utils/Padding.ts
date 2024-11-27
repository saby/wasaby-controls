import type { IRowComponentProps, IRowProps } from 'Controls/gridReact';
import DataRow from '../DataRow';
import type {
    IGridPaddingProps,
    TGridHPaddingSize,
    TGridVPaddingSize,
} from 'Controls/_interface/GridInterfaces';

const DEFAULT_PROPS: Partial<IRowComponentProps> = {
    paddingTop: 'grid_s',
    paddingBottom: 'grid_s',
    paddingLeft: 'list_default',
    paddingRight: 'list_default',
};

export function calcRowPadding(rowProps: IRowProps, item: DataRow): IGridPaddingProps {
    const itemPaddingTop =
        item.getTopPadding() === 'default'
            ? DEFAULT_PROPS.paddingTop
            : (('grid_' + item.getTopPadding().toLowerCase()) as TGridVPaddingSize);
    const itemPaddingBottom =
        item.getBottomPadding() === 'default'
            ? DEFAULT_PROPS.paddingBottom
            : (('grid_' + item.getBottomPadding().toLowerCase()) as TGridVPaddingSize);
    const itemPaddingLeft =
        item.getLeftPadding() === 'default'
            ? DEFAULT_PROPS.paddingLeft
            : (('list_' + item.getLeftPadding().toLowerCase()) as TGridHPaddingSize);
    const itemPaddingRight =
        item.getRightPadding() === 'default'
            ? DEFAULT_PROPS.paddingRight
            : (('list_' + item.getRightPadding().toLowerCase()) as TGridHPaddingSize);

    return {
        paddingTop: rowProps.padding?.top ?? (itemPaddingTop || DEFAULT_PROPS.paddingTop),
        paddingBottom:
            rowProps.padding?.bottom ?? (itemPaddingBottom || DEFAULT_PROPS.paddingBottom),
        paddingLeft: itemPaddingLeft || DEFAULT_PROPS.paddingLeft,
        paddingRight: itemPaddingRight || DEFAULT_PROPS.paddingRight,
    };
}
