/**
 * @kaizen_zone 49e4d90e-38bb-4029-bdfb-9dd08e44fa83
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
