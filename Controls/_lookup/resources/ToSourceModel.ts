/**
 * @kaizen_zone 1194f522-9bc3-40d6-a1ca-71248cb8fbea
 */
import { create } from 'Types/di';
import { PrefetchProxy, IData, ICrud } from 'Types/source';
import { instanceOfMixin, instanceOfModule } from 'Core/core-instance';
import { factory } from 'Types/chain';
import { List, RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';

function getModel(
    sourceModel: string | typeof Model | Model,
    config: unknown
): Model {
    return typeof sourceModel === 'string'
        ? create(sourceModel, config)
        : new (sourceModel as typeof Model)(config);
}

function getSourceModel(source: IData | PrefetchProxy): Model | string {
    let model;

    if (source instanceof PrefetchProxy) {
        model = (source.getOriginal() as IData).getModel();
    } else {
        model = source.getModel();
    }

    return model;
}

type ToSourceModelResult = RecordSet | List<Model> | List<void>;

/**
 * Приводит записи к модели источника данных
 * @param {Types/collection:IList|Array} items массив записей
 * @param {Types/source:ISource} dataSource Источник
 * @param {String} keyProperty поле элемента коллекции, которое является идентификатором записи.
 * @returns {Types/collection:IList|undefined|Array}
 */
export function ToSourceModel<T extends ToSourceModelResult>(
    items: T,
    dataSource: IData & ICrud,
    keyProperty: string
): T {
    let result;
    let dataSourceModel;
    let dataSourceModelInstance;
    let newRec;

    if (items) {
        if (dataSource && instanceOfMixin(dataSource, 'Types/_source/ICrud')) {
            dataSourceModel = getSourceModel(dataSource);

            /* Создадим инстанс модели, который указан в dataSource,
             чтобы по нему проверять модели которые выбраны в поле связи */
            dataSourceModelInstance = getModel(dataSourceModel, {});

            if (items instanceof RecordSet) {
                const itemsModel = getModel(
                    items.getModel() as unknown as Model,
                    {}
                );

                if (
                    itemsModel._moduleName !==
                    dataSourceModelInstance._moduleName
                ) {
                    result = new RecordSet({
                        rawData: items.getRawData(),
                        format: items.getFormat(),
                        adapter: items.getAdapter(),
                        keyProperty: items.getKeyProperty(),
                        model: dataSourceModel,
                    });
                }
            }

            if (!result) {
                result = items;
                factory(items).each((rec: Model, index: number): void => {
                    /* Создадим модель указанную в сорсе, и перенесём адаптер и формат из добавляемой записи,
                     чтобы не было конфликтов при мерже полей этих записей */
                    if (
                        dataSourceModelInstance._moduleName !== rec._moduleName
                    ) {
                        (newRec = getModel(dataSourceModel, {
                            adapter: rec.getAdapter(),
                            format: rec.getFormat(),
                        })).merge(rec);
                        if (instanceOfModule(items, 'Types/collection:List')) {
                            items.replace(newRec, index);
                        } else {
                            items[index] = newRec;
                        }
                    }
                });
            }
        } else {
            result = items;
        }

        /* Элементы, установленные из дилогов выбора / автодополнения могут иметь другой первичный ключ,
           отличный от поля с ключём, установленного в поле связи.
           Это связно с тем, что "связь" устанавливается по опеределённому полю,
           и не обязательному по первичному ключу у записей в списке. */
        factory(result).each((rec: Model) => {
            if (
                instanceOfModule(rec, 'Types/entity:Model') &&
                rec.getKeyProperty() !== keyProperty &&
                rec.get(keyProperty) !== undefined
            ) {
                rec.setKeyProperty(keyProperty);
            }
        });
    }

    return result;
}
