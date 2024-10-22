import { TOuterIconLabel, TOuterTextLabel } from 'Controls-Input/interface';
import { ObjectType, StringType } from 'Meta/types';
import { Control as RadioGroup } from 'Controls/RadioGroup';
import { RecordSet } from 'Types/collection';
import * as translate from 'i18n!Controls-Input';
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
    return (
        <RadioGroup
            items={items}
            {...props}
            readOnly={false}
            className="controls-Input_negativeOffset"
        />
    );
}

export const ILabelOptionsType = ObjectType.id(
    'Controls-Input-meta/inputConnected:ILabelOptionsType'
)
    .properties({
        label: ObjectType.title(translate('Метка'))
            .properties<TOuterIconLabel | TOuterTextLabel>({
                label: StringType,
                labelPosition: StringType.oneOf(['top', 'start']),
                icon: StringType,
            })
            .editor('Controls-Input-editors/LabelEditor:LabelEditor', {
                isJumping: false,
                Control: RadioGroupControl,
                defaultValue: {
                    label: translate('Метка'),
                },
            })
            .optional()
            .defaultValue({}),
    })
    .defaultValue({ label: {} });
