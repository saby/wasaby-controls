import * as rk from 'i18n!Controls-Input';
import { ObjectType, StringType } from 'Types/meta';
import { IDirectionOptions } from 'Controls-Input/interface';
import { Control as RadioGroup } from 'Controls/RadioGroup';
import { RecordSet } from 'Types/collection';
import { useMemo } from 'react';

function RadioGroupControl(props): JSX.Element {
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

    return <RadioGroup items={items} {...props} />;
}

export const TOrientationType = ObjectType.id('Controls/meta:TOrientationType')
    .attributes<IDirectionOptions>({
        direction: StringType.oneOf(['horizontal', 'vertical'])
            .optional()
            .title(rk('Ориентация'))
            .order(1)
            .editor(
                () => {
                    return import('Controls-editors/properties').then(({ComboboxEditor}) => {
                        return ComboboxEditor;
                    });
                },
                {
                    items: [
                        {value: 'vertical', caption: rk('Вертикальная')},
                        {value: 'horizontal', caption: rk('Горизонтальная')},
                    ],
                    defaultValue: 'vertical',
                    Control: RadioGroupControl,
                }
            )
            .defaultValue('vertical'),
    })
    .defaultValue({});
