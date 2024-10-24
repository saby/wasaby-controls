/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import * as React from 'react';
import { ICompatibleCellComponentProps as ICellProps } from 'Controls/_grid/compatibleLayer/cell/interface';
import ResultsCellComponent from 'Controls/_grid/cleanRender/cell/ResultsCellComponent';
import { CompatibleCellComponentPropsConverter } from 'Controls/_grid/compatibleLayer/CellComponent';
import { getResultsCellComponentProps } from 'Controls/_grid/cleanRender/cell/utils/Results';
import { GridResultsCell } from 'Controls/gridDisplay';

/*
 * Функция возвращает пропсы, с которыми создаётся wasaby-совместимый компонент ячейки итогов таблицы.
 * Часть этих пропсов может быть прокинута в рендер внутри компонента ячейки.
 * @private
 * @param props
 */
function getCompatibleResultsCellComponentProps(props: ICellProps) {
    const { column } = props;

    //TODO: Нужно разобраться с приоритетом наложения стилей + handlers
    const compatibleProps: ICellProps = {
        ...getResultsCellComponentProps({
            cell: column as unknown as GridResultsCell,
        }),
        ...column.config.templateOptions,
        ...props,
        gridColumn: column,
        colData: column,
        itemData: column,
    };

    // backgroundColorStyle могут задать как через опции шаблона, так и прямо через опции ячйки.
    const backgroundStyle =
        compatibleProps.backgroundColorStyle || column.config.backgroundColorStyle;

    // Стиль незастиканной ячейки
    compatibleProps.backgroundStyle = backgroundStyle;
    // Стиль стики-шапки в стики-состоянии
    compatibleProps.fixedBackgroundStyle = backgroundStyle || compatibleProps.fixedBackgroundStyle;
    // Стиль стики-шапки в спокойном-состоянии
    compatibleProps.stickiedBackgroundStyle =
        backgroundStyle || compatibleProps.stickiedBackgroundStyle;

    delete compatibleProps.contentRender;

    return compatibleProps;
}

/*
 * Wasaby-совместимый компонент ячейки итогов таблицы.
 * Вставляется прикладником в опцию resultsTemplate.
 * @param props
 */
export const CompatibleResultsCellComponent = React.memo(
    React.forwardRef((props: ICellProps, ref: React.ForwardedRef<HTMLElement>) => {
        return (
            <CompatibleCellComponentPropsConverter
                {...props}
                ref={ref}
                getCompatibleCellComponentProps={getCompatibleResultsCellComponentProps}
                _$FunctionalCellComponent={ResultsCellComponent as React.FunctionComponent}
            />
        );
    })
);
