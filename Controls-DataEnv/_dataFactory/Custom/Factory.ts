import { ICustomDataFactoryArguments } from './ICustomDataFactory';
//@ts-ignore;
import { wrapTimeout } from 'Core/PromiseLib/PromiseLib';
import { Slice } from 'Controls-DataEnv/slice';

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
            return wrapTimeout(customPromise, dataFactoryArguments.loadDataTimeout);
        } else {
            return customPromise;
        }
    }

    static slice = Slice;
}
