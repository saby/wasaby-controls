/**
 * @kaizen_zone 4f556a12-3d12-4c5d-bfd8-53e193344358
 */
/**
 * Библиотека контролов, отвечающих за отображение контента с возможностью переключения состояния развернутости.
 * @library
 * @includes ICut Controls/_spoiler/interface/ICut
 * @includes ILines Controls/_spoiler/interface/ILines
 * @public
 */

export { ICutOptions } from 'Controls/_spoiler/interface/ICut';
export { default as Cut } from 'Controls/_spoiler/Cut';
export { default as TextCut } from 'Controls/_spoiler/TextCut';
export { default as View, IView, IViewOptions } from 'Controls/_spoiler/View';
export {
    default as Heading,
    IHeading,
    IHeadingOptions,
} from 'Controls/_spoiler/Heading';
export { default as AreaCut } from 'Controls/_spoiler/AreaCut';
