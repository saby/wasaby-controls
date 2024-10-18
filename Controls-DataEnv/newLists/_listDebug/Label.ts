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

export function initLabel(instance: Slice, name: string): void {
    if (name === SYNTHETIC_NAME) {
        LABELS_COUNT++;
        LABELS.set(instance, {
            name: `SYNTHETIC #${LABELS_COUNT}`,
            isSynthetic: true,
        });
    } else {
        LABELS.set(instance, { name, isSynthetic: false });
    }
}

export function deleteLabel(instance: Slice): void {
    LABELS.delete(instance);
}
