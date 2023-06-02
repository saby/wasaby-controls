/**
 * @kaizen_zone 6c2c3a3e-9f32-4e3f-a2ed-d6042ebaaf7c
 */
import {
    ErrorHandler,
    IErrorHandlerConfig,
    ErrorViewConfig,
} from 'ErrorHandling/interface';
import { Logger } from 'UICommon/Utils';
import { PromiseCanceledError } from 'Types/entity';

export class HandlerIterator {
    /**
     * Синхронно выполнять по очереди обработчики ошибок, пока какой-нибудь из них не вернёт результат.
     */
    getViewConfigSync(
        [handler, ...restHandlers]: ErrorHandler[],
        config: IErrorHandlerConfig
    ): ErrorViewConfig | false | void {
        if (!handler) {
            return;
        }

        let viewConfig;

        try {
            viewConfig = handler(config);
        } catch (error) {
            // Логируем ошибку и продолжаем выполнение обработчиков.
            Logger.error('ErrorHandler error', null, error);

            if (error.isCanceled) {
                // Прерываем всю цепочку обработчиков.
                return false;
            }
        }

        if (viewConfig instanceof Promise) {
            // Если результат промис, значит прикладник где-то ошибся (все платформенные обработчики синхронны).
            Logger.error(
                'Во время синхронной обработки обработчик вернул промис!',
                this,
                new Error()
            );
            viewConfig = undefined;
        }

        return viewConfig || this.getViewConfigSync(restHandlers, config);
    }

    /**
     * Асинхронно выполнять по очереди обработчики ошибок, пока какой-нибудь из них не вернёт результат.
     */
    getViewConfigAsync(
        [handler, ...restHandlers]: ErrorHandler[],
        config: IErrorHandlerConfig
    ): Promise<ErrorViewConfig | void> {
        if (!handler) {
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            const result = handler(config);

            resolve(
                result && result.promise instanceof Promise
                    ? result.promise
                    : result
            );
        })
            .catch((error: PromiseCanceledError) => {
                if (error.isCanceled) {
                    // Выкидываем ошибку отмены наверх, чтоб прервать всю цепочку обработчиков.
                    // eslint-disable-next-line @typescript-eslint/no-throw-literal
                    throw error;
                }

                // Если это не отмена, то логируем ошибку и продолжаем выполнение обработчиков.
                Logger.error('ErrorHandler error', null, error);
            })
            .then((viewConfig: ErrorViewConfig | void) => {
                return (
                    viewConfig || this.getViewConfigAsync(restHandlers, config)
                );
            });
    }
}
