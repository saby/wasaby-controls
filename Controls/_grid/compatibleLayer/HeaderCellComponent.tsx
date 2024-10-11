/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import * as React from 'react';
import { ICompatibleCellComponentProps as ICellProps } from 'Controls/_grid/compatibleLayer/cell/interface';
import HeaderCellComponent from 'Controls/_grid/cleanRender/cell/HeaderCellComponent';
import { CompatibleCellComponentPropsConverter } from 'Controls/_grid/compatibleLayer/CellComponent';
import { getHeaderCellComponentProps } from 'Controls/_grid/cleanRender/cell/utils/Header';

/*
 * Функция возвращает пропсы, с которыми создаётся wasaby-совместимый компонент ячейки шапки таблицы.
 * Часть этих пропсов может быть прокинута в рендер внутри компонента ячейки.
 * @private
 * @param props
 */
function getCompatibleHeaderCellComponentProps(props: ICellProps) {
    const column = props.column || props.gridColumn || props.colData;

    const cellProps = getHeaderCellComponentProps({ cell: column, row: column.getOwner() });
    const compatibleProps: ICellProps = {
        ...cellProps,
        ...props,
        ...props.attrs,
        valign: cellProps.valign,
        halign: cellProps.halign,
        gridColumn: column,
        itemData: column,
        colData: column,
        cursor: props.cursor || cellProps.cursor,
    };

    delete compatibleProps.contentTemplate;
    delete compatibleProps.contentTemplateOptions;
    delete compatibleProps.contentRender;
    delete compatibleProps.children;
    delete compatibleProps.content;
    delete compatibleProps.attrs;
    delete compatibleProps.style;

    return compatibleProps;
}

/*
 * Wasaby-совместимый компонент ячейки шапки таблицы.
 * Вставляется прикладником в опцию headerTemplate.
 * @param props
 */
export const CompatibleHeaderCellComponent = React.memo(
    React.forwardRef((props: ICellProps, ref: React.ForwardedRef<HTMLElement>) => {
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
            <CompatibleCellComponentPropsConverter
                {...props}
                ref={ref}
                beforeContentRender={preparedBeforeContentRender}
                getCompatibleCellComponentProps={getCompatibleHeaderCellComponentProps}
                _$FunctionalCellComponent={HeaderCellComponent as React.FunctionComponent}
            />
        );
    })
);
