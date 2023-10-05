/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
/**
 * Набор полей контекста, используемых в платформенных контролах.
 * @library
 * @deprecated Библиотека устарела.
 * @private
 */

export { default as ContextOptionsConsumer } from 'Controls/_context/ContextOptionsConsumer';
export { CompatibleContextProvider as ContextOptionsProvider } from 'Controls/_context/ContextOptionsProvider';
export { IContextOptionsValue, IContextValue } from 'Controls/_context/ContextOptions';
export { default as connectToDataContext } from 'Controls/_context/DataContextWrapper';
export { default as DataFormatConverter } from './_context/DataFormatConverter';

export { default as DataContextCompatible } from './_context/DataContextCompatible';
export { default as DataContextCompatibleConsumer } from './_context/DataContextCompatibleConsumer';
export { default as DataContextCompatibleProvider } from './_context/DataContextCompatibleProvider';
