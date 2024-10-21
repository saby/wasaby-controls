/**
 * @kaizen_zone a79f3050-faba-4501-aee5-b3a15a75dfdf
 */
import rk = require('i18n!Controls');
import { descriptor } from 'Types/entity';

/**
 * Интерфейс для визуального отображения контрола {@link Controls/dateRange:DateSelector}.
 * @interface Controls/_dateRange/interfaces/ILinkView
 * @public
 */
const EMPTY_CAPTIONS = {
    NOT_SPECIFIED: rk('Не указан'),
    NOT_SELECTED: rk('Не выбран'),
    WITHOUT_DUE_DATE: rk('Бессрочно', 'ShortForm'),
    ALL_TIME: rk('Весь период'),
};

export default {
    getDefaultOptions() {
        return {
            clickable: true,
            /**
             * @name Controls/_dateRange/interfaces/ILinkView#emptyCaption
             * @cfg {String} Отображаемый текст, когда в контроле не выбран период.
             */

            /*
             * @name Controls/_dateRange/interfaces/ILinkView#emptyCaption
             * @cfg {String} Text that is used if the period is not selected.
             */
        };
    },

    EMPTY_CAPTIONS,

    getOptionTypes() {
        return {
            emptyCaption: descriptor(String),
        };
    },
};
