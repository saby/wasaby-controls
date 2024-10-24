import { GridGroupRow as GroupRow } from 'Controls/baseGrid';
import { IGroupRowComponentProps } from 'Controls/_grid/gridReact/group/interface';
import { IRowComponentProps } from 'Controls/_grid/gridReact/row/interface';

interface IGetGroupRowComponentProps {
    row: GroupRow;
    rowProps: IGroupRowComponentProps;
}

/*
 * Возвращает пропсы, специфичные для строки группы
 */
export function getGroupRowComponentProps(props: IGetGroupRowComponentProps): IRowComponentProps {
    const { row, rowProps } = props;
    rowProps.className =
        (rowProps.className ? `${rowProps.className} ` : '') +
        `controls-ListView__group${row.isHiddenGroup() ? 'Hidden' : ''}`;
    if (!row.isExpanded()) {
        rowProps.className += ' controls-ListView__group_collapsed';
    }
    rowProps.metaResults = row.getMetaResults();
    return rowProps;
}
