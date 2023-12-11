import { getStore } from 'Application/Env';
import type { IStore } from 'Application/Request';
import { IInstantiable } from 'Types/entity';

const MAX_VALUE = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;
const STORE_ID = 'CollectionInstantiableStore';

type TStore = IStore<{ counter: number }>;

export class InstantiableMixin implements IInstantiable {
    readonly '[Types/_entity/InstantiableMixin]': true = true;
    readonly '[Types/_entity/IInstantiable]': true = true;

    private __store: TStore;

    private get _store(): TStore {
        // Первая инициализация стора в рамках жизни сущности, к которой примешен миксин
        if (!this.__store) {
            const store: TStore = getStore(STORE_ID);

            // Первая инициализация store в целом, в рамках всего приложения(запроса).
            if (typeof store.get('counter') !== 'number') {
                store.set('counter', 0);
            }

            this.__store = store;
        }

        return this.__store;
    }

    private get _counter(): number {
        return this._store.get('counter');
    }

    private set _counter(newValue: number) {
        this._store.set('counter', newValue);
    }

    /**
     * Префикс значений идентификатора
     */
    protected _instancePrefix: string;

    /**
     * Уникальный идентификатор
     */
    protected _instanceId: string;

    // region IInstantiable

    getInstanceId(): string {
        if (!this._instanceId) {
            if (this._counter >= MAX_VALUE) {
                this._counter = 0;
            }
            this._instanceId = this._instancePrefix + this._counter;
            this._counter += 1;
        }

        return this._instanceId;
    }

    // endregion
}

Object.assign(InstantiableMixin.prototype, {
    '[Types/_entity/InstantiableMixin]': true,
    '[Types/_entity/IInstantiable]': true,
    _instancePrefix: 'id-',
    _instanceId: '',
});
