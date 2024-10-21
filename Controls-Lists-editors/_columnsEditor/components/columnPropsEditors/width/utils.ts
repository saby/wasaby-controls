import {
    DEFAULT_MAX_MAIN_COLUMN_WIDTH,
    MAX_COLUMN_AUTO,
} from 'Controls-Lists-editors/_columnsEditor/constants';
import {
    percentsToPixels,
    validateColumnWidth,
    pixelsToPercents,
    IColumnWidth,
} from 'Controls-Lists-editors/_columnsEditor/utils/columnEditor';

export function updateWidth(
    prevWidth: IColumnWidth,
    updatedConfig: IColumnWidth,
    isMainColumn: boolean,
    containerWidth: number,
    actualWidthAmount: number
): IColumnWidth {
    const nextWidth = {
        ...prevWidth,
        ...updatedConfig,
    };
    const maxColumnWidth = isMainColumn ? DEFAULT_MAX_MAIN_COLUMN_WIDTH : MAX_COLUMN_AUTO;
    // Если переключили % на px. Или если ввели величину в %. Переведем все в пиксели
    if ((!updatedConfig.units && prevWidth.units === '%') || updatedConfig.units === 'px') {
        if ((prevWidth.mode === 'fixed' && !updatedConfig.mode) || updatedConfig.mode === 'fixed') {
            nextWidth.amount = updatedConfig.amount
                ? percentsToPixels(updatedConfig.amount, containerWidth)
                : actualWidthAmount;
        } else if (
            (prevWidth.mode === 'auto' && !updatedConfig.mode) ||
            updatedConfig.mode === 'auto'
        ) {
            if (updatedConfig.minLimit) {
                nextWidth.minLimit = percentsToPixels(updatedConfig.minLimit, containerWidth);
            } else if (prevWidth.minLimit) {
                nextWidth.minLimit = percentsToPixels(prevWidth.minLimit, containerWidth);
            }
            if (prevWidth.maxLimit !== maxColumnWidth) {
                if (updatedConfig.maxLimit) {
                    nextWidth.maxLimit = percentsToPixels(updatedConfig.maxLimit, containerWidth);
                } else if (prevWidth.maxLimit) {
                    nextWidth.maxLimit = percentsToPixels(prevWidth.maxLimit, containerWidth);
                }
            }
        }
    }
    nextWidth.units = 'px';
    const acceptableWidth = validateColumnWidth(nextWidth, isMainColumn);
    // Если сменили px на % или ввели величину в %. Сначала проверим правильность введенных значений в px, потом переведем в %
    if ((!updatedConfig.units && prevWidth.units === '%') || updatedConfig.units === '%') {
        if ((prevWidth.mode === 'fixed' && !updatedConfig.mode) || updatedConfig.mode === 'fixed') {
            acceptableWidth.amount = pixelsToPercents(acceptableWidth.amount, containerWidth);
        } else if (
            (prevWidth.mode === 'auto' && !updatedConfig.mode) ||
            updatedConfig.mode === 'auto'
        ) {
            if (acceptableWidth.minLimit) {
                acceptableWidth.minLimit = pixelsToPercents(
                    acceptableWidth.minLimit,
                    containerWidth
                );
            }
            if (acceptableWidth.maxLimit && prevWidth.maxLimit !== maxColumnWidth) {
                acceptableWidth.maxLimit =
                    acceptableWidth.maxLimit !== maxColumnWidth
                        ? pixelsToPercents(acceptableWidth.maxLimit, containerWidth)
                        : maxColumnWidth;
            }
        }
        acceptableWidth.units = '%';
    }
    return acceptableWidth;
}
