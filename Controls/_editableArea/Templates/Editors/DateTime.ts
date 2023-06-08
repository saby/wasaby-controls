/**
 * @kaizen_zone 32467cda-e824-424f-9d3b-3faead248ea2
 */
import Base from './Base';
import { Logger } from 'UI/Utils';
import { date as format } from 'Types/formatter';

/**
 * Шаблон редактирования даты и времени.
 * Используется при редактировании по месту в полях ввода, о чем подробнее читайте <a href="/doc/platform/developmentapl/interface-development/controls/input-elements/input/edit/">здесь</a>.
 * @class Controls/_editableArea/Templates/Editors/DateTime
 * @extends Controls/editableArea:Base
 * @public
 * @see @class Controls/_editableArea/Templates/Editors/Base
 * @demo Controls-demo/EditableArea/ViewContent/Index
 */

class DateTime extends Base {
    _prepareValueForEditor(value?: Date): string {
        let date = value;
        if (!date) {
            date = new Date();
            Logger.warn('DateTime: Option "value" cannot be empty');
        }
        // todo fixed by: https://online.sbis.ru/opendoc.html?guid=00a8daf1-c567-46bb-a40e-53c1eef5a26b
        return format(date, format.FULL_DATE);
    }
}

export default DateTime;
