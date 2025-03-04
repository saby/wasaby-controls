/**
 * Библиотека контролов горизонтального мастера.
 *
 * Горизонтальный мастер представляет собой ленту из блоков(шагов), для каждого из которых определена своя контентная область.
 *
 * <a href="/doc/platform/developmentapl/interface-development/controls/navigation/master/#horizontal-master">Руководство разработчика</a>
 * @demo Controls-Wizard-demo/horizontal/horizontalBase/Index
 * @library Controls-Wizard/horizontal
 * @public
 * @includes StepBar Controls-Wizard/_horizontal/StepBar
 * @includes Layout Controls-Wizard/_horizontal/Layout
 * @includes IStepBar Controls-Wizard/_horizontal/IStepBar
 * @includes ILayout Controls-Wizard/_horizontal/ILayout
 */

export { default as StepBar } from './_horizontal/StepBar';
export { default as WrappedLayout } from './_horizontal/WrappedLayout';
export { default as Layout } from './_horizontal/Layout';
export { default as IStepBar } from './_horizontal/IStepBar';
export { default as ILayout, ILayoutItem, ILayoutOptions } from './_horizontal/ILayout';
