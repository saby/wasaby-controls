/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';

/**
 * Хелпер для добавления на страницу зависимости от загруженного модуля
 * @private
 */
export default function <TLib, TComponentCtorName extends keyof TLib>(
    libPath: string,
    componentName: TComponentCtorName
): TLib[TComponentCtorName] | undefined {
    if (!isLoaded(libPath)) {
        return undefined;
    }

    return loadSync<TLib>(libPath)[componentName];
}
