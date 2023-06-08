/**
 * @kaizen_zone 4efc1ffa-202d-406f-befe-efa4a5d4ee0c
 */
/**
 * Библиотека контролов, отвечающих за отображение разных вариантов кнопок. Также библиотека содержит публичные интерфейсы, необходимые для работы кнопок.
 * @library
 * @includes Button Controls/_buttons/Button
 * @includes IViewMode Controls/_buttons/interface/IViewMode
 * @includes TButtonStyle Controls/_buttons/interface/TButtonStyle
 * @public
 */

export { default as ButtonTemplate } from './_buttons/ButtonBase';
export {
    default as Button,
    simpleCssStyleGeneration,
    defaultHeight,
    defaultFontColorStyle,
    getDefaultOptions,
} from './_buttons/Button';
export {
    default as ArrowButton,
    IArrowButtonOptions,
} from './_buttons/ArrowButton';
export { default as MoreButton } from './_buttons/MoreButton';
export { default as CloseButton } from './_buttons/CloseButton';
export { default as ActualApi } from './_buttons/ActualApi';
export { IClick } from './_buttons/interface/IClick';
export {
    IButton,
    IButtonOptions,
    IViewMode,
    TButtonStyle,
    TextAlign,
} from './_buttons/interface/IButton';
