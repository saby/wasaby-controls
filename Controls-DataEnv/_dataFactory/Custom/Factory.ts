import { ICustomDataFactoryArguments } from './ICustomDataFactory';
//@ts-ignore;
import { wrapTimeout } from 'Core/PromiseLib/PromiseLib';
import { Slice } from 'Controls-DataEnv/slice';
import { Logger } from 'UI/Utils';

function loadData(
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
                Logger.error(error.message);
                return error;
            }
        );
    } else {
        return customPromise;
    }
}

/**
 * Не использовать. Создавайте свою фабрику данных по {@link /doc/platform/developmentapl/interface-development/controls/new-data-store/create-context/ документации}
 * @class Controls-DataEnv/_dataFactory/Custom/Factory
 * @deprecated при использовании фабрики вам будет выписана ошибка. Фабрика оставлена для временной совместимости.
 * @public
 */
export default {
    loadData,
    slice: Slice,
};
