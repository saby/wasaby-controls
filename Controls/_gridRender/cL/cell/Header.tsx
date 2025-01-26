/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import * as React from 'react';
import { ICompatibleCellComponentProps as ICellProps } from 'Controls/_gridRender/cL/cell/interface';
import HeaderCellComponent from 'Controls/_gridRender/cell/Header';
import { CCCPC } from 'Controls/_gridRender/cL/cell/Data';
import { getHeaderCellProps } from 'Controls/_gridRender/cell/utils/Header';
import { prepareCommonCompatibleProps, filterCommonCompatibleProps } from '../utils/common';

/*
 * Функция возвращает пропсы, с которыми создаётся wasaby-совместимый компонент ячейки шапки таблицы.
 * Часть этих пропсов может быть прокинута в рендер внутри компонента ячейки.
 * @private
 * @param props
 */
function getCompatibleHeaderCellComponentProps(props: ICellProps) {
    const column = props.column || props.gridColumn || props.colData;

    const cellProps = getHeaderCellProps({
        cell: column,
        row: column.getOwner(),
    });
    const compatibleProps = prepareCommonCompatibleProps({
        ...cellProps,
        ...props,
        // Некоторые props имеют значение undefined, но не должны перебивать аналогичное значение из cellProps.
        // Но они не должны перебивать корректно расчитанные опции из cellProps.
        backgroundColorStyle: props.backgroundColorStyle || cellProps.backgroundColorStyle,
        fixedBackgroundStyle: props.fixedBackgroundStyle || cellProps.fixedBackgroundStyle,
        valign: cellProps.valign,
        halign: cellProps.halign,
        cursor: props.cursor || cellProps.cursor,
    });

    filterCommonCompatibleProps(compatibleProps, false);

    return compatibleProps;
}

/*
 * Wasaby-совместимый компонент ячейки шапки таблицы.
 * Вставляется прикладником в опцию headerTemplate.
 * @param props
 */
export const CompatibleHeaderCellComponent = React.forwardRef(
    (props: ICellProps, ref: React.ForwardedRef<HTMLElement>) => {
        const cell = props.column || props.gridColumn || props.colData;

        const cellProps = cell.getColumnConfig().getCellProps
            ? cell.getColumnConfig().getCellProps()
            : {};

        const BeforeContentRender =
            cellProps.beforeContentRender !== undefined
                ? cellProps.beforeContentRender
                : props.beforeContentRender;

        const preparedBeforeContentRender = (
            BeforeContentRender ? <BeforeContentRender cell={cell} /> : null
        ) as React.ReactElement;

        return (
            <CCCPC
                {...props}
                ref={ref}
                beforeContentRender={preparedBeforeContentRender}
                getCCCP={getCompatibleHeaderCellComponentProps}
                _$FCC={HeaderCellComponent as React.FunctionComponent}
            />
        );
    }
);
