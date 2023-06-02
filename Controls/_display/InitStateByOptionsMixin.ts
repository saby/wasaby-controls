/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
const optionPrefix = '_$';

/**
 * Миксин позволяет иницилазировать состояние с помощью опций переданных в конструктор.
 * @class Controls/display:InitStateByOptionsMixin
 * @remark
 * Каждой опции соответстует свойство вида `_${optionName}`.
 * Чтобы свойство было инициализировано значением из опции, оно должно быть заранее объявлено используя Object.assign
 * @private
 */
export default abstract class InitStateByOptionsMixin {
    protected constructor(options?: Record<string, unknown>) {
        InitStateByOptionsMixin.initMixin(this, options);
    }

    static initMixin(instance, options?: Record<string, unknown>) {
        if (options && typeof options === 'object') {
            const keys = Object.keys(options);

            for (let i = 0, count = keys.length; i < count; i++) {
                const option = keys[i];
                const property = optionPrefix + option;

                if (property in instance) {
                    instance[property] = options[option];
                }
            }
        }
    }
}
