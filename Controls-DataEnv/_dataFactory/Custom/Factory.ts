import { ICustomDataFactoryArguments } from './ICustomDataFactory';
//@ts-ignore;
import { wrapTimeout } from 'Core/PromiseLib/PromiseLib';
import { Slice } from 'Controls-DataEnv/slice';
import { logger } from 'Application/Env';
import { RPC } from 'Browser/Transport';

function resolveLogger(error: Error): typeof logger.error | typeof logger.warn {
    let resultLogger = logger.error;

    if (error instanceof RPC.Error) {
        resultLogger = error.errType === 'warning' ? logger.warn : logger.error;
    }

    return resultLogger;
}

/**
 * Не использовать. Создавайте свою фабрику данных по {@link /doc/platform/developmentapl/interface-development/context-data/new-data-store/create-context/ документации}
 * @deprecated при использовании фабрики вам будет выписана ошибка. Фабрика оставлена для временной совместимости.
 * @public
 */
export default class CustomFactory {
    static loadData(
        dataFactoryArguments: ICustomDataFactoryArguments,
        dependenciesResults: Record<string, unknown>,
        Router: object
    ): Promise<unknown> {
        const customPromise = dataFactoryArguments.loadDataMethod(
            dataFactoryArguments.loadDataMethodArguments,
            dependenciesResults,
            Router
        );

        if (dataFactoryArguments.loadDataTimeout) {
            return wrapTimeout(customPromise, dataFactoryArguments.loadDataTimeout).catch(
                (error: Error): Error => {
                    const logger = resolveLogger(error);
                    logger(error);
                    return error;
                }
            );
        } else {
            return customPromise;
        }
    }
    static slice = Slice;
}
