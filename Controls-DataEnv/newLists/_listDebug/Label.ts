import type { Slice } from 'Controls-DataEnv/slice';

const SYNTHETIC_NAME = '_dataSyntheticStoreId';

let LABELS_COUNT: number;
let LABELS: WeakMap<
    Slice,
    {
        name: string;
        isSynthetic: boolean;
    }
>;
(() => {
    LABELS_COUNT = 0;
    LABELS = new WeakMap();
})();

/**
 * Привязать новое отладочное имя к интерактору.
 *
 * @param instance Интерактор
 * @param name Новое имя
 */
export function initLabel(instance: Slice, name: string): string {
    let resultName: string;

    if (name === SYNTHETIC_NAME) {
        LABELS_COUNT++;
        resultName = `SYNTHETIC #${LABELS_COUNT}`;
        LABELS.set(instance, {
            name: resultName,
            isSynthetic: true,
        });
    } else {
        resultName = name;
        LABELS.set(instance, { name, isSynthetic: false });
    }

    return resultName;
}

/**
 * Отвязать отладочное имя от интерактора.
 *
 * @param instance Интерактор
 */
export function deleteLabel(instance: Slice): void {
    LABELS.delete(instance);
}

/**
 * Получить привязанное отладочное имя интерактора.
 *
 * @param instance Интерактор
 */
export function getLabel(instance: Slice): string {
    const info = LABELS.get(instance);
    if (info) {
        return info.name;
    }

    return '';
}
