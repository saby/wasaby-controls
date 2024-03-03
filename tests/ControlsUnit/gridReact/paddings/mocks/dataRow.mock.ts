import DataRow from 'Controls/_grid/display/DataRow';
import {
    THorizontalItemPadding,
    TVerticalItemPadding,
} from 'Controls/_display/interface/ICollection';

export const dataRowDefaultPadding: Partial<DataRow> = {
    getTopPadding: () => 'default',
    getBottomPadding: () => 'default',
    getLeftPadding: () => 'default',
    getRightPadding: () => 'default',
};

export const dataRowLPadding: Partial<DataRow> = {
    getTopPadding: () => 'l' as TVerticalItemPadding,
    getBottomPadding: () => 'l' as TVerticalItemPadding,
    getLeftPadding: () => 'l' as THorizontalItemPadding,
    getRightPadding: () => 'l' as THorizontalItemPadding,
};
