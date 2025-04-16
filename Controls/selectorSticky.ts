/**
 * @kaizen_zone f90b65ee-d3e2-41d5-9722-a2ea4200bc7e
 */
/**
 * Библиотека контролов, которые реализуют элемент интерфейса, позволяющий выбрать одну или несколько перечисленных опций.
 * Отображается в Sticky окне.
 * @library
 * @includes Template Controls/selectorSticky:Template
 * @public
 */
// TODO переедет в Controls-Layout, когда он будет добавлен в сборки
export { default as Template, SELECTOR_STORE_ID } from './_selectorSticky/Template';
export { default as HeaderTemplate } from './_selectorSticky/templates/HeaderTemplate';
export { default as DataFactory } from './_selectorSticky/Factory/SelectorFactory';
export { default as Slice } from './_selectorSticky/Factory/Slice';
export { default as MultiSelectPlusTemplate } from './_selectorSticky/templates/MultiSelectPlusTemplate';
export { ISelectorStickyTemplateProps } from './_selectorSticky/interface/ISelectorSticky';
export { ISelectorBaseOptions } from './_selectorSticky/interface/ISelectorBase';
