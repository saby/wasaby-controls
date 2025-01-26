import { Memory } from 'Types/source';
import { Model } from 'Types/entity';

const TIMEOUT3500 = 3500;

export default class SlowMemory extends Memory {
    protected _moduleName: string = 'Controls-demo/list_new/EditInPlace/SlowAdding/SlowMemory';
    private _lastItemId: number = 1;

    create(): Promise<Model> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(undefined);
            }, TIMEOUT3500);
        }).then(() => {
            return new Model({
                keyProperty: 'key',
                rawData: {
                    key: ++this._lastItemId,
                    beforeBeginEditTitle:
                        'Редактирование завершится после задержки в 3 сек. Например, долгая валидация на сервере, появится индикатор. При этом, не был возвращен Promise.',
                },
            });
        });
    }

    update(item: unknown) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(item);
            }, TIMEOUT3500);
        }).then(() => {
            super.update(item);
        });
    }
}
