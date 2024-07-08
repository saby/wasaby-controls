import { IColumnWidth } from 'Controls-Lists-editors/_columnsEditor/utils/columnEditor';
import {
    MIN_COLUMN_WIDTH,
    DEFAULT_MAX_MAIN_COLUMN_WIDTH,
    MAX_COLUMN_AUTO,
    DEFAULT_MIN_MAIN_COLUMN_WIDTH,
} from 'Controls-Lists-editors/_columnsEditor/constants';
import * as React from 'react';

interface IInformationLineElementProps {
    width: IColumnWidth;
    containerWidth: number;
    rightCellPadding: string | null;
    leftCellPadding: string | null;
    style: object;
    isMainColumn?: boolean;
    onSpotMouseOver?: (event: MouseEvent) => void;
    onSpotMouseOut?: (event: MouseEvent) => void;
}

function getUserFriendlyFormat(width: IColumnWidth, isMainColumn?: boolean): string {
    if (width.mode === 'fixed') {
        if (width.units === 'px') {
            return String(width.amount);
        } else {
            return String(width.amount) + width.units;
        }
    } else {
        const defaultMin = isMainColumn ? DEFAULT_MIN_MAIN_COLUMN_WIDTH : MIN_COLUMN_WIDTH;
        const defaultMax = isMainColumn ? DEFAULT_MAX_MAIN_COLUMN_WIDTH : MAX_COLUMN_AUTO;
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
    const {
        width,
        rightCellPadding,
        leftCellPadding,
        style,
        isMainColumn,
        containerWidth,
        onSpotMouseOut,
        onSpotMouseOver,
    } = props;
    const content = getUserFriendlyFormat(width, isMainColumn);
    const containerStyle = React.useMemo(() => {
        return {
            width: `${containerWidth}px`,
        };
    }, [containerWidth]);
    const textWrapperStyle = React.useMemo(() => {
        return {
            maxWidth: `calc(${containerWidth}px - ((2 * var(--offset_2xs) + (2 * var(--offset_xs)))))`,
        };
    }, [containerWidth]);
    return (
        <div
            className={`ControlsListsEditors_info-line ControlsListsEditors_info-line-spacingRight_${rightCellPadding}
                     ControlsListsEditors_info-line-spacingLeft_${leftCellPadding}`}
            style={style}
        >
            <div style={containerStyle} className={'ControlsListsEditors_info-line-container'}>
                <div className={'ControlsListsEditors_info-line-separator'}></div>
                <div
                    style={textWrapperStyle}
                    className={'ControlsListsEditors_info-line-text-wrapper'}
                >
                    <wbr />
                    <div
                        className={
                            ' ControlsListsEditors_info-line-content ControlsListsEditors_info-line-text'
                        }
                    >
                        {content}
                    </div>
                    <div
                        className={
                            'ControlsListsEditors_info-line-spot-wrapper  ControlsListsEditors_info-line-text'
                        }
                        title={content}
                        onMouseOver={onSpotMouseOver}
                        onMouseOut={onSpotMouseOut}
                        onClick={(event: MouseEvent) => {
                            event.stopPropagation();
                        }}
                    >
                        <div className={'ControlsListsEditors_info-line-spot'}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
