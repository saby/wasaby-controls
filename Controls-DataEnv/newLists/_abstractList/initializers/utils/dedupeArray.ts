import * as ErrorDescriptors from '../../ErrorDescriptors';

/**
 * Функция удаления дубликатов из массива
 * */
export default function dedupeArray<Type>(array?: Type[], targetName?: string): Type[] | undefined {
    if (!array) {
        return;
    }
    const uniqueKeys = [...new Set(array)];
    if (uniqueKeys.length !== array.length) {
        ErrorDescriptors.DUPLICATES_IN_ARRAY(targetName);
    }
    return uniqueKeys;
}
