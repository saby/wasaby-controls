/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import getComponent from './getComponent';

const LIB = 'Controls/listVisualAspects' as const;

/**
 * Утилита добавляющая на страницу зависимости от загруженного модуля из Controls/listVisualAspects
 * @private
 */
export default function <T extends keyof typeof import('Controls/listVisualAspects')>(
    componentName: T
) {
    return getComponent<typeof import('Controls/listVisualAspects'), T>(LIB, componentName);
}
