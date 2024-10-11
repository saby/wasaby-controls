/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
const optionPrefix = '_$';

/**
 * Миксин позволяет иницилазировать состояние с помощью опций переданных в конструктор.
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
