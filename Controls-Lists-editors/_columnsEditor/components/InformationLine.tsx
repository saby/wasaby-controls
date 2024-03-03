import { IColumnWidth } from 'Controls-Lists-editors/_columnsEditor/utils/columnEditor';
import {
    MIN_MAIN_COLUMN_WIDTH,
    MIN_COLUMN_WIDTH,
    MAX_MAIN_COLUMN_WIDTH,
    MAX_COLUMN_WIDTH,
} from 'Controls-Lists-editors/_columnsEditor/constants';

interface IInformationLineElementProps {
    width: IColumnWidth;
    rightCellPadding: string | null;
    leftCellPadding: string | null;
    style: object;
    isMainColumn?: boolean;
}

function getUserFriendlyFormat(width: IColumnWidth, isMainColumn?: boolean): string {
    if (width.mode === 'fixed') {
        if (width.units === 'px') {
            return String(width.amount);
        } else {
            return String(width.amount) + width.units;
        }
    } else {
        const defaultMin = isMainColumn ? MIN_MAIN_COLUMN_WIDTH : MIN_COLUMN_WIDTH;
        const defaultMax = isMainColumn ? MAX_MAIN_COLUMN_WIDTH : MAX_COLUMN_WIDTH;
        if (
            !width.minLimit ||
            !width.maxLimit ||
            (width.minLimit === defaultMin && width.maxLimit === defaultMax)
        ) {
            return 'авто';
        } else {
            const maxLimit = width.maxLimit !== defaultMax ? width.maxLimit : 'авто';
            const minLimit = width.minLimit !== defaultMin ? width.minLimit : 'авто';
            return `(${minLimit}; ${maxLimit})`;
        }
    }
}

export function InformationLineElement(props: IInformationLineElementProps) {
    const { width, rightCellPadding, leftCellPadding, style, isMainColumn } = props;
    const content = getUserFriendlyFormat(width, isMainColumn);
    return (
        <div
            style={style}
            className={`ControlsListsEditors_info-line ControlsListsEditors_info-line-spacingLeft_${leftCellPadding} ControlsListsEditors_info-line-spacingRight_${rightCellPadding} `}
        >
            <div className={'ControlsListsEditors_info-line-separator'} />
            <div className={'ControlsListsEditors_info-line-value'}>{content}</div>
            <div className={'ControlsListsEditors_info-line-separator'}></div>
        </div>
    );
}
