/**
 * Библиотека вертикального мастера.
 *
 * Вертикальный мастер представляет собой набор заголовков (шагов), для каждого из которых определена контентная область.
 *
 * * {@link /doc/platform/developmentapl/interface-development/controls/navigation/master/#vertical-master Руководство разработчика}
 * @library
 * @includes ILayout Controls-Wizard/_vertical/ILayout
 * @includes IAdditionalButtonsConfig Controls-Wizard/_vertical/IAdditionalButtonsConfig
 * @includes ISingleAdditionalButtonConfig Controls-Wizard/_vertical/ISingleAdditionalButtonConfig
 * @includes INextButtonCaption Controls-Wizard/_vertical/INextButtonCaption
 * @demo Controls-Wizard-demo/demoVertical2/VerticalWithStack
 * @public
 */

export { default as Layout, LayoutForTest } from './_vertical/Layout';
export { default as WrappedLayout } from './_vertical/WrappedLayout';
export { IVerticalItem, ILayoutOptions } from './_vertical/ILayout';
export { IAdditionalButtonsConfig } from 'Controls-Wizard/_vertical/IAdditionalButtonsConfig';
export { ISingleAdditionalButtonConfig } from 'Controls-Wizard/_vertical/ISingleAdditionalButtonConfig';
export { default as Container } from './_vertical/Container';
import * as ItemTemplate from 'wml!Controls-Wizard/_vertical/Layout/ItemTemplate';

export { ItemTemplate };
