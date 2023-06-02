/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import { Model } from 'Types/entity';
import { isEqual } from 'Types/object';
import { TKey } from 'Controls/interface';
import { Tree, TreeItem } from 'Controls/baseTree';
import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');

/**
 * Интерфейс, описывающий структуру объекта конфигурации {@link Controller FadeController}
 * @public
 */
export interface IOptions {
    /**
     * Модель с которой будет управлять контроллер
     */
    model?: Tree<Model, TreeItem<Model>>;
    /**
     * Массив с идентификаторами высвеченных записей
     */
    fadedKeys?: TKey[];
}

/**
 * Класс контроллера, который реализует логику высвечивания записей
 * @private
 */
export class FadeController {
    private _fadedKeys: TKey[];

    private _model: Tree<Model, TreeItem<Model>>;

    constructor(options: IOptions) {
        this._model = options.model;
        this._fadedKeys = options.fadedKeys ? [...options.fadedKeys] : [];
    }

    /**
     * Обновляет опции контроллера записывая новые опции поверх существующих.
     * Соответственно если какую-либо опцию обновлять не надо, то не нужно её
     * указывать в newOptions.
     */
    updateOptions(newOptions: IOptions): void {
        const modelRecreated = this._model !== newOptions.model;
        this._model = newOptions.model;

        if (
            newOptions.fadedKeys &&
            !isEqual(this._fadedKeys, newOptions.fadedKeys)
        ) {
            this._setFadedKeys(newOptions.fadedKeys);
        }

        if (modelRecreated) {
            this.applyStateToModel();
        }
    }

    private _getFadedKeys(): TKey[] {
        return this._fadedKeys || [];
    }

    applyStateToModel(): void {
        this._getFadedKeys().forEach((id) => {
            const item = this._model.getItemBySourceKey(id, false);
            if (item && item.Fadable) {
                item.setFaded(true);
            }
        });
    }

    private _setFadedKeys(fadedKeys: TKey[] = []): void {
        if (isEqual(this._getFadedKeys(), fadedKeys)) {
            return;
        }

        const diff = ArraySimpleValuesUtil.getArrayDifference(
            this._getFadedKeys(),
            fadedKeys
        );

        diff.added.forEach((id) => {
            const item = this._model.getItemBySourceKey(id, false);
            if (item && item.Fadable) {
                item.setFaded(true);
            }
        });

        diff.removed.forEach((id) => {
            const item = this._model.getItemBySourceKey(id, false);
            if (item && item.Fadable) {
                item.setFaded(false);
            }
        });
        this._model.setFadedKeys(fadedKeys);
        this._fadedKeys = [...fadedKeys];
    }
}
