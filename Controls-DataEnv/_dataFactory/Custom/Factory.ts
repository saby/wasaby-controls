import { ICustomDataFactoryArguments } from './ICustomDataFactory';
import { wrapTimeout } from 'Core/PromiseLib/PromiseLib';
import CustomSLice from './Slice';
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
    return wrapTimeout(
        customPromise,
        dataFactoryArguments.loadDataTimeout
    ).catch((error: Error): Error => {
        Logger.error(error.message);
        return error;
    });
}

export default {
    loadData,
    slice: CustomSLice,
};
