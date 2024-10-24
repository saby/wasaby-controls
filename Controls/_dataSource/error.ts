/**
 * @kaizen_zone 0804ab53-4f1a-422d-8854-d9021b1bfd63
 */
/**
 * Компоненты для обработки и отображения ошибок.
 * {@link /doc/platform/developmentapl/interface-development/application-architecture/error-handling/}
 * @library Controls/dataSource:error
 * @public
 */

export {
    ErrorController as Controller,
    ErrorHandler as Handler,
    IErrorHandlerConfig as HandlerConfig,
    IProcessOptions,
    ErrorViewMode as Mode,
    Popup,
    process,
    ErrorViewConfig as ViewConfig,
} from 'Controls/error';
export { default as Container, IErrorContainerOptions } from './_error/Container';
export { default as DataLoader } from './_error/DataLoader';
export { ErrorBoundary, ErrorBoundaryContext } from './_error/ErrorBoundary';
