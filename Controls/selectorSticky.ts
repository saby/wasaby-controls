/**
 * @kaizen_zone f90b65ee-d3e2-41d5-9722-a2ea4200bc7e
 */
/**
 * Библиотека контролов, которые реализуют элемент интерфейса, позволяющий выбрать одну или несколько перечисленных опций.
 * Может отображаться в Sticky, Dialog или Stack окне.
 * @library
 * @public
 */
// TODO переедет в Controls-Layout, когда он будет добавлен в сборки
export { default as Template } from './_selectorSticky/Template';
export { default as HeaderTemplate } from './_selectorSticky/templates/HeaderTemplate';
export { default as DataFactory } from './_selectorSticky/Factory/SelectorFactory';
export { default as Slice } from './_selectorSticky/Factory/Slice';
