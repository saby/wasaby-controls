import type { GridGroupRow as GroupRow } from 'Controls/gridDisplay';
import { IGroupRowComponentProps } from 'Controls/_gridRender/interface/Group';
import { IRowComponentProps } from 'Controls/_gridRender/row/interface/IRowComponent';

interface IGetGroupRowComponentProps {
    row: GroupRow;
    rowProps: IGroupRowComponentProps;
}

export function getGroupRowComponentClassName(
    row: IGetGroupRowComponentProps['row'],
    className?: string
): string {
    let resultClassName =
        (className ? `${className} ` : '') +
        `controls-ListView__group${row.isHiddenGroup() ? 'Hidden' : ''}`;
    if (!row.isExpanded()) {
        resultClassName += ' controls-ListView__group_collapsed';
    }
    return resultClassName;
}

/*
 * Возвращает пропсы, специфичные для строки группы
 */
export function getGroupRowComponentProps(props: IGetGroupRowComponentProps): IRowComponentProps {
    const { row, rowProps } = props;
    rowProps.className = getGroupRowComponentClassName(row, rowProps.className);
    rowProps.metaResults = row.getMetaResults();
    return rowProps;
}
