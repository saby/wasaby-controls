import * as React from 'react';

interface IGetCellInlineStyleProps {
    // Объект стилей, переданный как props в чистый компонент
    style: React.CSSProperties;

    // Параметры объединения ячеек
    startRow?: number;
    endRow?: number;
    startColumn?: number;
    endColumn?: number;

    // z-index без "залипания"
    zIndex?: number;
}

export function getStyle(props: IGetCellInlineStyleProps): React.CSSProperties | undefined {
    const { startRow, endRow, startColumn, endColumn, zIndex } = props;
    const resultStyles = { ...props.style };
    if (startRow || startColumn) {
        if (startRow) {
            resultStyles.gridRow = `${startRow} / ${endRow}`;
        }

        if (startColumn) {
            resultStyles.gridColumn = `${startColumn} / ${endColumn}`;
        }
    }
    if (zIndex !== undefined) {
        resultStyles.zIndex = zIndex;
    }
    return resultStyles;
}
