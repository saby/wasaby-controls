import { type Interactor as TInteractor } from 'Controls-DataEnv/errorDescriptors';
import { loadAsync } from 'WasabyLoader/ModulesLoader';

/**
 * Асинхронно возвращает дескриптор ошибки интерактора по указанному имени ошибки.
 * @param descriptorName Имя ошибки.
 * @param args Аргументы дескриптора ошибки.
 * @private
 */
export default async function getError<T extends keyof typeof TInteractor>(
    descriptorName: T,
    ...args: Parameters<(typeof TInteractor)[T]>
) {
    const { Interactor } = await loadAsync<typeof import('Controls-DataEnv/errorDescriptors')>(
        'Controls-DataEnv/errorDescriptors'
    );
    const descriptor = Interactor[descriptorName];

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return descriptor(...args);
}
