import { ICustomDataFactoryArguments } from './ICustomDataFactory';
import { wrapTimeout } from 'Core/PromiseLib/PromiseLib';
import CustomSLice from './Slice';
import { Logger } from 'UI/Utils';

function loadData(
    dataFactoryArguments: ICustomDataFactoryArguments,
    dependenciesResults: Record<string, unknown>,
    Router: object
): Promise<unknown> {
    try {
        const customPromise = dataFactoryArguments.loadDataMethod(
            dataFactoryArguments.loadDataMethodArguments,
            dependenciesResults,
            Router
        );

        return wrapTimeout(
            customPromise,
            dataFactoryArguments.loadDataTimeout
        ).catch((error: Error): Error => {
            Logger.error(error.message);
            return error;
        });
    } catch (err) {
        return Promise.reject(err);
    }
}

/**
 * Не использовать. Создавайте свою фабрику данных по {@link /doc/platform/developmentapl/interface-development/controls/data-store/load-data/ документации}
 * @class Controls-DataEnv/_dataFactory/Custom/Factory
 * @deprecated при использовании фабрики вам будет выписана ошибка. Фабрика оставлена для временной совместимости.
 * @public
 */
export default {
    loadData,
    slice: CustomSLice,
};
