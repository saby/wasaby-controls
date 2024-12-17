/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import * as React from 'react';
import { ICompatibleCellComponentProps as ICellProps } from 'Controls/_grid/compatibleLayer/cell/interface';
import { EmptyContentRenderForwardRef } from 'Controls/_grid/dirtyRender/emptyView/EmptyCellComponent';
import { CompatibleCellComponentPropsConverter } from 'Controls/_grid/compatibleLayer/CellComponent';

/*
 * Функция возвращает пропсы, с которыми создаётся wasaby-совместимый компонент ячейки пустого представления.
 * Часть этих пропсов может быть прокинута в рендер внутри компонента ячейки.
 * @private
 * @param props
 */
function getCompatibleEmptyCellComponentProps(props: ICellProps) {
    const { column } = props;

    const compatibleProps: ICellProps = {
        ...props,
        ...props.attrs,
        gridColumn: column,
        itemData: column,
        colData: column,
    };

    delete compatibleProps.contentTemplate;
    // TODO: className, вроде, не нужно удалять, падают юниты.
    //delete compatibleProps.className;
    delete compatibleProps.attrs;
    delete compatibleProps.style;

    return compatibleProps;
}

/*
 * Wasaby-совместимый компонент ячейки пустого представления.
 * Вставляется прикладником в опцию emptyTemplate.
 * @param props
 */
export const CompatibleEmptyCellComponent = React.memo(
    React.forwardRef((props: ICellProps, ref: React.ForwardedRef<HTMLElement>) => {
        return (
            <CompatibleCellComponentPropsConverter
                {...props}
                ref={ref}
                getCompatibleCellComponentProps={getCompatibleEmptyCellComponentProps}
                _$FunctionalCellComponent={EmptyContentRenderForwardRef as React.FunctionComponent}
            />
        );
    })
);
