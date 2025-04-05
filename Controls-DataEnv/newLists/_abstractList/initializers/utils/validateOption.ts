import { type Interactor as TInteractor } from 'Controls-DataEnv/errorDescriptors';
import getError from 'Controls-DataEnv/newLists/_abstractList/utils/getError';

/**
 * Тип валидатора
 */
export type TValidator<T> = (v: unknown) => v is T;

/**
 * Валидирует значение, пропуская через защитника типов
 * - если переданное значение проходит валидацию, оно будет возвращено
 * - если переданное значение провалило валидацию, вернется undefined и асинхронно упадет ошибка, если она передана
 */
export default function validateOption<TValue, TErrorDescriptor extends keyof typeof TInteractor>(
    value: unknown,
    validator: TValidator<TValue>,
    descriptorName?: TErrorDescriptor,
    ...descriptorArgs: Parameters<(typeof TInteractor)[TErrorDescriptor]>
): TValue | undefined {
    if (validator(value)) {
        return value;
    } else {
        if (descriptorName) {
            // Ошибка упадет асинхронно
            getError(descriptorName, ...descriptorArgs);
        }
        return undefined;
    }
}
