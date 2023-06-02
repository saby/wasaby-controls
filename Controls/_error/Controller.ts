/**
 * @kaizen_zone 6c2c3a3e-9f32-4e3f-a2ed-d6042ebaaf7c
 */
import { Logger } from 'UI/Utils';
import { PromiseCanceledError } from 'Types/entity';
import { fetch } from 'Browser/Transport';
import { HandlerIterator } from './HandlerIterator';
import { getHandlers } from 'ErrorHandling/ErrorHandling';
import {
    ErrorHandler,
    IErrorHandlerConfig,
    ProcessedError,
    ErrorViewConfig,
    ErrorViewMode,
    CanceledError,
} from 'ErrorHandling/interface';

/**
 * Параметры конструктора контроллера ошибок.
 * @public
 */
export interface IControllerOptions {
    /**
     * Пользовательские обработчики ошибок.
     */
    handlers?: ErrorHandler[];

    /**
     * Пользовательские постобработчики ошибок.
     */
    postHandlers?: ErrorHandler[];

    /**
     * @cfg {Controls/error:ErrorViewConfig} Эта функция будет вызвана во время обработки ошибки.
     * Она возвращает конфигурацию для отображения ошибки.
     * Эта конфигурация объединится с той, которую вернёт обработчик ошибки.
     */
    onProcess?: OnProcessCallback;
}

export type OnProcessCallback = (
    viewConfig: ErrorViewConfig
) => ErrorViewConfig;

/**
 * @public
 */
export interface IProcessConfig<
    TError extends ProcessedError = ProcessedError
> {
    /**
     * Обрабатываемая ошибка.
     */
    error: TError;

    /**
     * Способ отображения ошибки (на всё окно / диалог / внутри компонента)
     */
    mode?: ErrorViewMode;

    /**
     * Тема для окон уведомлений, которые контроллер показывает, если не удалось распознать ошибку
     */
    theme?: string;
}

/**
 * Класс для выбора обработчика ошибки и формирования объекта с данными для шаблона ошибки.
 * Передаёт ошибку по цепочке функций-обработчиков.
 * Обработчики предоставляются пользователем или берутся из настроек приложения.
 * @public
 * @example
 * <pre class="brush: js">
 * // TypeScript
 *     let handler = ({ error, mode }) => {
 *         if (error.code == 423) {
 *             return {
 *                 template: LockedErrorTemplate,
 *                 options: {
 *                     // ...
 *                 }
 *             }
 *         }
 *     };
 *     let errorController = new ErrorController({
 *         handlers: [handler]
 *     });
 *
 *     this.load().catch((error) => {
 *         return errorController.process(error).then((parking) => {
 *             if (!parking) {
 *                 return;
 *             }
 *             return this.__showError(parking);
 *         });
 *     })
 * </pre>
 */
export default class ErrorController {
    private handlers: ErrorHandler[];
    private postHandlers: ErrorHandler[];
    private handlerIterator: HandlerIterator = new HandlerIterator();
    private onProcess: OnProcessCallback;

    /**
     * Конструктор контроллера
     */
    constructor(options?: IControllerOptions) {
        this.handlers = options?.handlers?.slice() || [];
        this.postHandlers = options?.postHandlers?.slice() || [];
        this.onProcess = options?.onProcess;
    }

    /**
     * Добавить обработчик ошибки.
     * @param handler Обработчик ошибки.
     * @param isPostHandler Выполнять ли обработчик после обработчиков уровня приложения.
     */
    addHandler(handler: ErrorHandler, isPostHandler?: boolean): void {
        const handlers = isPostHandler ? this.postHandlers : this.handlers;

        if (!handlers.includes(handler)) {
            handlers.push(handler);
        }
    }

    /**
     * Убрать обработчик ошибки.
     * @param handler Обработчик ошибки.
     * @param isPostHandler Был ли обработчик добавлен для выполнения после обработчиков уровня приложения.
     */
    removeHandler(handler: ErrorHandler, isPostHandler?: boolean): void {
        const deleteHandler = (hs: ErrorHandler[]) => {
            return hs.filter((h) => {
                return handler !== h;
            });
        };

        if (isPostHandler) {
            this.postHandlers = deleteHandler(this.postHandlers);
        } else {
            this.handlers = deleteHandler(this.handlers);
        }
    }

    /**
     * Установить функцию onProcess
     * @param {Controls/error:IControllerOptions#onProcess} onProcess
     */
    setOnProcess(onProcess?: OnProcessCallback): void {
        this.onProcess = onProcess;
    }

    /**
     * Если в контроллере уже есть некая функция onProcess, то она не будет заменена.
     * Сначала будет вызвана переданная в аргумент функция, а затем существующая.
     * Результаты вызовов объединяются, но существующая функция будет в приоритете.
     * @see {Controls/error:IControllerOptions#onProcess}
     */
    updateOnProcess(newOnProcess: OnProcessCallback): void {
        if (typeof this.onProcess !== 'function') {
            this.setOnProcess(newOnProcess);
            return;
        }

        const onProcess = this.onProcess;

        this.setOnProcess((viewConfig) => {
            const result = newOnProcess(viewConfig);
            return onProcess(result);
        });
    }

    private createViewConfig<TError extends ProcessedError>(
        handlerResult: ErrorViewConfig | void,
        error: TError,
        config: IProcessConfig<TError> | TError
    ): ErrorViewConfig | void {
        /*
          Ошибка может быть уже обработана, если в соседние контролы прилетела одна ошибка от родителя.
          Проверяем, обработана ли ошибка каким-то из контроллеров.
         */
        if (!ErrorController.isNeedHandle(error)) {
            return;
        }

        const viewConfig =
            handlerResult || ErrorController.getDefaultViewConfig(error);

        /*
          Обработчик может вернуть флаг processed === false в том случае,
          когда он точно знает, что его ошибку нужно обработать всегда,
          даже если она была обработана ранее
         */
        error.processed = viewConfig.processed !== false;

        if (!(config instanceof Error) && config.mode) {
            viewConfig.mode = config.mode;
        } else {
            viewConfig.mode = viewConfig.mode || ErrorViewMode.dialog;
        }

        if (typeof this.onProcess === 'function') {
            return this.onProcess(viewConfig);
        }

        return viewConfig;
    }

    /**
     * Асинхронно обработать ошибку и получить данные для шаблона ошибки.
     * Передаёт ошибку по цепочке функций-обработчиков, пока какой-нибудь обработчик не вернёт результат.
     * @remark
     * Если ни один обработчик не вернёт результат, будет показан диалог с сообщением об ошибке.
     * @param config Обрабатываемая ошибка или объект, содержащий обрабатываемую ошибку и предпочитаемый режим отображения.
     * @return Данные для отображения сообщения об ошибке или undefined, если ошибка не распознана.
     */
    process<TError extends ProcessedError = ProcessedError>(
        config: IProcessConfig<TError> | TError
    ): Promise<ErrorViewConfig | void> {
        const handlerConfig = ErrorController.getHandlerConfig<TError>(config);
        const { error } = handlerConfig;

        if (!ErrorController.isNeedHandle(error)) {
            return Promise.resolve();
        }

        const handlers = [
            ...this.handlers,
            ...getHandlers(),
            ...this.postHandlers,
        ];

        const handlerResult = this.handlerIterator.getViewConfigAsync(
            handlers,
            handlerConfig
        );

        return handlerResult
            .then((viewConfig) => {
                return this.createViewConfig(viewConfig, error, config);
            })
            .catch((err: PromiseCanceledError) => {
                if (!err.isCanceled) {
                    Logger.error('ErrorHandler error', null, err);
                }
            });
    }

    /**
     * Синхронно обработать ошибку и получить данные для шаблона ошибки.
     * Передаёт ошибку по цепочке функций-обработчиков, пока какой-нибудь обработчик не вернёт результат.
     * @remark
     * Если ни один обработчик не вернёт результат, будет показан диалог с сообщением об ошибке.
     * @param config Обрабатываемая ошибка или объект, содержащий обрабатываемую ошибку и предпочитаемый режим отображения.
     * @return Данные для отображения сообщения об ошибке или undefined, если ошибка не распознана.
     */
    processSync<TError extends ProcessedError = ProcessedError>(
        config: IProcessConfig<TError> | TError
    ): ErrorViewConfig | void {
        const handlerConfig = ErrorController.getHandlerConfig<TError>(config);
        const { error } = handlerConfig;

        if (!ErrorController.isNeedHandle(error)) {
            return;
        }

        const handlers = [
            ...this.handlers,
            ...getHandlers(),
            ...this.postHandlers,
        ];

        const handlerResult = this.handlerIterator.getViewConfigSync(
            handlers,
            handlerConfig
        );

        if (handlerResult === false) {
            // Если итератор вернул false, значит была PromiseCanceledError и ошибку не нужно обрабатывать.
            return;
        }

        return this.createViewConfig(handlerResult, error, config);
    }

    private static getDefaultViewConfig({ message }: Error): ErrorViewConfig {
        return {
            mode: ErrorViewMode.dialog,
            options: {
                message,
            },
        };
    }

    private static getHandlerConfig<TError extends ProcessedError = Error>(
        config: IProcessConfig<TError> | TError
    ): IErrorHandlerConfig<TError> {
        if (config instanceof Error) {
            return {
                error: config,
                mode: ErrorViewMode.dialog,
            };
        }

        return {
            mode: ErrorViewMode.dialog,
            ...config,
        };
    }

    private static isNeedHandle(
        error: ProcessedError & CanceledError
    ): boolean {
        return !(
            (
                error instanceof fetch.Errors.Abort ||
                error.processed ||
                error.canceled ||
                error.isCanceled
            ) // from PromiseCanceledError
        );
    }
}
