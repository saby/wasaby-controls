import { TBackgroundStyle } from 'Controls/interface';
import { ICellProps } from 'Controls/_grid/dirtyRender/cell/interface';

/*
 * Определяет фон ячейки
 */

export interface IGetBackgroundColorStyleProps {
    getCellPropsResult: ICellProps;
    cellConfig: ICellProps;
    isFixedCell: boolean;
    listBackgroundStyle?: TBackgroundStyle;
}

/*
 * Логика background в wasaby списках:
 * 1. По умолчанию фон прозрачный.
 * 2. Если задали backgroundStyle на списке, он попадает сюда как listBackgroundStyle,
 *     то фон ТОЖЕ прозрачный, но те элементы, у которых есть z-index и они должны перекрывать контент.
 *     В том числе STICKY (гориз.) и FIXED (верт.) элементы примут указанный фон.
 * 3. (wasaby-СОВМЕСТИМОСТЬ) Если задали backgroundColorStyle на строке в itemTemplate,
 *     то backgroundColorStyle со строки имеет приоритет, и
 *     влияет НЕ ТОЛЬКО на элементы, у которых есть z-index, но и на любые ячейки в строке.
 * 4. (wasaby-СОВМЕСТИМОСТЬ) Если задали backgroundColorStyle на ячейке в cellConfig,
 *     то backgroundColorStyle с cellConfig имеет приоритет, и
 *     влияет НЕ ТОЛЬКО на элементы, у которых есть z-index, но и на саму ячейку.
 * 5. (wasaby-СОВМЕСТИМОСТЬ) Если задали backgroundColorStyle в wasaby-совместимости на ячейке в template,
 *     то backgroundColorStyle с template имеет приоритет, и
 *     влияет НЕ ТОЛЬКО на элементы, у которых есть z-index, но и на саму ячейку.
 * 6. Если задали getCellPropsResult.backgroundColorStyle,
 *     то стики-шапок из getCellProps имеет приоритет, и
 *     влияет НЕ ТОЛЬКО на элементы, у которых есть z-index, но и на саму ячейку.
 * ########################################
 * 7. getCellPropsResult.backgroundStyle невалидная опция. Надо сводить с getCellPropsResult.backgroundColorStyle
 * 8. cellConfig.backgroundStyle невалидная опция. Надо сводить с getCellPropsResult.backgroundColorStyle
 * ########################################
 * Ещё в списках есть fixedBackgroundStyle и stickiedBackgroundStyle
 * * stickiedBackgroundStyle - это фон стики-шапок
 * * fixedBackgroundStyle - это фон стики-шапок, которые перешли в залипшее состояние.
 * Обе этих опции внутренние и принимают значения от backgroundColorStyle
 * @param props
 */
export function getBackgroundColorStyle(
    props: IGetBackgroundColorStyleProps
): TBackgroundStyle | undefined {
    const { getCellPropsResult, cellConfig, isFixedCell, listBackgroundStyle = 'default' } = props;
    return (
        getCellPropsResult.backgroundColorStyle ||
        getCellPropsResult.backgroundStyle ||
        cellConfig.backgroundColorStyle ||
        cellConfig.backgroundStyle ||
        (isFixedCell ? listBackgroundStyle : undefined)
    );
}
