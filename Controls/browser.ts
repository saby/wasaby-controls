/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
/**
 * Библиотека контролов, которые обеспечивают связывание контролов и реализуют функционал фильтрации, поиска и выделения.
 * @library
 * @includes Browser Controls/browser:Browser
 * @includes IBrowser Controls/_browser/interface/IBrowser
 * @public
 */
export { IBrowserOptions, IListConfiguration } from './_browser/Browser';
export { default as Browser } from 'Controls/_browser/BrowserWrapper';
