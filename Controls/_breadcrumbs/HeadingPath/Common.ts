/**
 * @kaizen_zone 5027e156-2300-4ab3-8a3a-d927588bb443
 */
import { Model } from 'Types/entity';
import { CrudEntityKey } from 'Types/source';
import { Control, IControlOptions } from 'UI/Base';
import { dataConversion } from '../resources/dataConversion';

/**
 * На основании переданного значения root и keyProperty собирает Model хлебной крошки
 */
function getRootModel(root: CrudEntityKey, keyProperty: string): Model {
    const rawData = {};

    rawData[keyProperty] = root;
    return new Model({
        keyProperty,
        rawData,
    });
}

interface IBreadcrumbsControlOptions extends IControlOptions {
    keyProperty?: string;
    parentProperty?: string;
}

/**
 * Обработчик клика по кнопке "Назад". Предназначен для запуска в контексте контрола, поддерживающего опции
 * keyProperty, parentProperty и опцию в которой лежит массив хлебных крошек.
 * Название опции с хлебными крошками кастомизируется по средствам параметра itemsProperty.
 */
function onBackButtonClick(
    this: Control<IBreadcrumbsControlOptions>,
    e: Event,
    itemsProperty: string = 'items'
): void {
    let item;
    const items = dataConversion(this._options[itemsProperty]);

    if (items.length > 1) {
        item = items[items.length - 2];
    } else {
        item = getRootModel(
            items[0].get(this._options.parentProperty),
            this._options.keyProperty
        );
    }

    this._notify('itemClick', [item]);
    e.stopPropagation();
}

export default {
    getRootModel,
    onBackButtonClick,
};
