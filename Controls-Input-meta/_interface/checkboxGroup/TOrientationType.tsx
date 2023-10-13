import * as rk from 'i18n!Controls-Input';
import { StringType, ObjectType } from 'Types/meta';
import { IDirectionOptions } from 'Controls-Input/interface';
import { Control } from 'Controls/CheckboxGroup';
import { RecordSet } from 'Types/collection';
import { useMemo } from 'react';

function CheckboxGroupControl(props): JSX.Element {
    const items = useMemo(() => {
        return new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: 1,
                    title: 'Вариант 1',
                },
                {
                    id: 2,
                    title: 'Вариант 2',
                },
            ],
        });
    }, []);
    return <Control items={items} {...props} />;
}

export const TOrientationType = ObjectType.id(
    'Controls/meta:TOrientationType'
).attributes<IDirectionOptions>({
    direction: StringType.oneOf(['horizontal', 'vertical'])
        .optional()
        .title(rk('Ориентация'))
        .order(1)
        .editor(
            () => {
                return import('Controls-editors/properties').then(({ ComboboxEditor }) => {
                    return ComboboxEditor;
                });
            },
            {
                items: [
                    { value: 'vertical', caption: rk('Вертикальная') },
                    { value: 'horizontal', caption: rk('Горизонтальная') },
                ],
                defaultValue: 'vertical',
                Control: CheckboxGroupControl,
            }
        )
        .defaultValue('vertical'),
});
