import * as rk from 'i18n!Controls';
import { StringType, ObjectType } from 'Types/meta';
import { IDatePopupTypeOptions } from 'Controls/date';

const options = [
    'datePicker',
    'compactDatePicker',
    'shortDatePicker'
] as const;

export const IDatePopupOptionsType = ObjectType.id(
    'Controls/meta:IDatePopupOptionsType'
).attributes<IDatePopupTypeOptions>({
    datePopupType: StringType
        .title(rk('Тип календаря'))
        .description(
            rk('Календарь, который откроется при нажатии на вызывающий элемент')
        )
        .oneOf(['datePicker', 'compactDatePicker', 'shortDatePicker'])
        .editor(
            () => {
                return import('Controls-editors/properties').then(
                    ({ SizeEditor }) => {
                        return SizeEditor;
                    }
                );
            },
            { options }
        )
        .hidden()
});
