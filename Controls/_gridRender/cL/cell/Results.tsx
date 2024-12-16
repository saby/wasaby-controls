/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import * as React from 'react';
import { ICompatibleCellComponentProps as ICellProps } from 'Controls/_gridRender/cL/cell/interface';
import ResultsCellComponent from 'Controls/_gridRender/cell/Results';
import { CCCPC } from 'Controls/_gridRender/cL/cell/Data';
import { getResultsCellProps } from 'Controls/_gridRender/cell/utils/Results';
import { GridResultsCell } from 'Controls/gridDisplay';
import { filterCommonCompatibleProps, prepareCommonCompatibleProps } from '../utils/common';

/*
 * Функция возвращает пропсы, с которыми создаётся wasaby-совместимый компонент ячейки итогов таблицы.
 * Часть этих пропсов может быть прокинута в рендер внутри компонента ячейки.
 * @private
 * @param props
 */
function getCompatibleResultsCellComponentProps(props: ICellProps) {
    const { column } = props;

    //TODO: Нужно разобраться с приоритетом наложения стилей + handlers
    const compatibleProps: ICellProps = prepareCommonCompatibleProps({
        ...getResultsCellProps({
            cell: column as unknown as GridResultsCell,
        }),
        ...column.config.templateOptions,
        ...props,
    });

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

    filterCommonCompatibleProps(compatibleProps);
    return compatibleProps;
}

/*
 * Wasaby-совместимый компонент ячейки итогов таблицы.
 * Вставляется прикладником в опцию resultsTemplate.
 * @param props
 */
export const CompatibleResultsCellComponent = React.forwardRef(
    (props: ICellProps, ref: React.ForwardedRef<HTMLElement>) => {
        return (
            <CCCPC
                {...props}
                ref={ref}
                getCCCP={getCompatibleResultsCellComponentProps}
                _$FCC={ResultsCellComponent as React.FunctionComponent}
            />
        );
    }
);
