/**
 * @kaizen_zone 4caa6c7f-c139-49cb-876d-d68aca67db9f
 */
/**
 * Библиотека контролов-оберток, устанавливающих значения css-переменных на вложенный контент.
 * @library
 * @includes Wrapper Controls/_themesExt/Wrapper
 * @includes ZenWrapper Controls/_themesExt/ZenWrapper
 * @public
 */

export {
    IHSLColor,
    IColorDescriptor,
} from 'Controls/_themesExt/interface/IColor';
export {
    default as ZenWrapper,
    IZenWrapperOptions,
    calculateRGB,
    calculateVariables,
} from 'Controls/_themesExt/ZenWrapper';
export { default as ContrastWrapper } from 'Controls/_themesExt/ContrastWrapper';
