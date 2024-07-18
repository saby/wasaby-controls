/**
 * Библиотека вертикального мастера.
 *
 * Вертикальный мастер представляет собой набор заголовков (шагов), для каждого из которых определена контентная область.
 *
 * * {@link /doc/platform/developmentapl/interface-development/controls/navigation/master/#vertical-master Руководство разработчика}
 * @library
 * @includes ILayout Controls-Wizard/_vertical/ILayout
 * @demo Controls-Wizard-demo/demoVertical2/VerticalWithStack
 * @public
 */

export { default as Layout } from './_vertical/Layout';
export { default as WrappedLayout } from './_vertical/WrappedLayout';
export { IVerticalItem, ILayoutOptions, IAdditionalButtonsConfig } from './_vertical/ILayout';
export { default as Container } from './_vertical/Container';
import * as ItemTemplate from 'wml!Controls-Wizard/_vertical/Layout/ItemTemplate';

export { ItemTemplate };
