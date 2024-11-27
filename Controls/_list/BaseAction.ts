/**
 * @kaizen_zone fd2f64a5-d515-49d2-8fef-3e6af047ff0a
 */
import { Control } from 'UI/Base';
import rk = require('i18n!Controls');
import { Confirmation } from 'Controls/popup';
import { ISelectionObject } from 'Controls/interface';

/**
 * Базовый класс action'a, на основе которого создаются другие action'ы. Не подходит для самостоятельного использования.
 *
 * @class Controls/_list/BaseAction
 * @extends UI/Base:Control
 *
 * @public
 */

export default Control.extend({
    /**
     * Производит проверку переданных параметров. Если массив значений пуст, возвращает false и выводит окно с текстом, иначе возвращает true.
     * @name Controls/_list/BaseAction#validate
     * @remark
     * При необходимости метод нужно вызывать вручную из наследника.
     *
     * @function
     */
    validate(items: any[] | ISelectionObject): boolean {
        let resultValidate: boolean = true;

        if (
            (items instanceof Array && !items.length) ||
            (items.selected && !items.selected.length)
        ) {
            resultValidate = false;
            Confirmation.openPopup({
                type: 'ok',
                message: rk('Нет записей для обработки команды'),
            });
        }

        return resultValidate;
    },
});
