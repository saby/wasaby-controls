/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
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

export function deleteLabel(instance: Slice): void {
    LABELS.delete(instance);
}

export function getLabel(instance: Slice): string {
    const info = LABELS.get(instance);
    if (info) {
        return info.name;
    }

    return '';
}
