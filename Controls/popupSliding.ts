/**
 * @kaizen_zone 5d04426f-0434-472a-b02c-eecab5eb3c36
 */
/**
 * Библиотека контролов, которые реализуют содержимое попапа-шторки.
 * @library
 * @public
 */
import 'css!Controls/popupSliding';
export { default as Controller } from 'Controls/_popupSliding/Controller';
export { default as StackController } from 'Controls/_popupSliding/SlidingStackController';
export { default as Template } from 'Controls/_popupSliding/Template';
export { default as _SlidingPanel } from 'Controls/_popupSliding/Template/SlidingPanel';
export { default as _SlidingStackPanel } from 'Controls/_popupSliding/Template/Stack/SlidingStackTemplate';
export {
    ISlidingPanelTemplate,
    ISlidingPanelTemplateOptions,
} from 'Controls/_popupSliding/interface/ISlidingPanelTemplate';
export { default as ScrollWrapper } from 'Controls/_popupSliding/ScrollWrapper';
