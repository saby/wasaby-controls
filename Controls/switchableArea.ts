/**
 * @kaizen_zone 6b2f7c09-87a5-4183-bd7c-59117d2711bc
 */
/**
 * Библиотека контролов, которые реализуют область с возможностью переключения контента.
 * @library
 * @includes View Controls/_switchableArea/View
 * @includes itemTemplate Controls/switchableArea:itemTemplate
 * @public
 */

/*
 * switchableArea library
 * @library
 * @includes View Controls/_switchableArea/View
 * @includes itemTemplate Controls/switchableArea:itemTemplate
 * @public
 * @author Мочалов М.А.
 */

import itemTemplate from 'Controls/_switchableArea/ItemTpl';

export {
    default as View,
    ISwitchableOptions,
    ISwitchableAreaItem,
    ISwitchableAreaItemProps,
} from './_switchableArea/View';
export { default as WrappedView, IWrappedViewOptions } from './_switchableArea/WrappedView';

export { itemTemplate };
