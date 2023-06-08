import * as rk from 'i18n!Controls';
import { BooleanType, ObjectType } from 'Types/meta';
import { ICalendarButtonVisibleOptions } from 'Controls/date';

const options = [{ value: false }, { value: true }];

export const ICalendarButtonVisibleOptionsType = ObjectType.id(
    'Controls/meta:ICalendarButtonVisibleOptionsType'
).attributes<ICalendarButtonVisibleOptions>({
    calendarButtonVisible: BooleanType.title(rk('Формат'))
        .description(rk('Определяет видимость иконки, открывающей попап выбора периода.'))
        .oneOf([false, true])
        .editor(
            () => {
                return import('Controls-editors/properties').then(({ EnumEditor }) => {
                    return EnumEditor;
                });
            },
            { options }
        )
        .hidden(),
});
