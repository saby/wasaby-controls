/**
 * @kaizen_zone 6c2c3a3e-9f32-4e3f-a2ed-d6042ebaaf7c
 */
/**
 * @library
 * @embedded
 */

import ErrorController from './Controller';
export {
    ErrorViewSize,
    IErrorRepeatConfig,
    IDefaultTemplateOptions,
    ErrorViewMode,
    ErrorViewConfig,
    ProcessedError,
    CanceledError,
    ErrorType,
    ErrorHandler,
    IErrorHandlerConfig,
} from 'ErrorHandling/interface';

/**
 * Интерфейс контролов, использующих источники данных и обрабатывающих ошибки от сервисов через {@link Controls/error:ErrorController error-controller}.
 * @public
 */
export interface IErrorControllerOptions {
    /**
     * @cfg
     * Компонент для обработки ошибки.
     * Данную опцию следует определять, если нужно изменить способ отображения ошибки (диалог, вместо контента или во всю страницу) или добавить свои обработчики ошибок.
     */
    errorController?: ErrorController;
}
