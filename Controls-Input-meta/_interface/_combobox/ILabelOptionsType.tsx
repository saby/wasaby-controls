import { TInnerLabel, TOuterIconLabel, TOuterTextLabel } from 'Controls-Input/interface';
import { ObjectType, StringType } from 'Types/meta';
import * as translate from 'i18n!Controls';
import { Combobox } from 'Controls/dropdown';
import * as rk from 'i18n!Controls';
import { Memory } from 'Types/source';
import { useMemo } from 'react';

function ComboboxControl(props): JSX.Element {
    const source = useMemo(() => {
        return new Memory({
            keyProperty: 'id',
            data: [
                {
                    id: 1,
                    title: rk('Список'),
                },
            ],
        });
    }, []);
    return (
        <Combobox
            {...props}
            className={`tw-w-full ${props.className}`}
            selectedKey={1}
            displayProperty="title"
            keyProperty="id"
            source={source}
            readOnly={false}
        />
    );
}

export const ILabelOptionsType = ObjectType.id(
    'Controls-Input-meta/inputConnected:ILabelOptionsType'
)
    .attributes<TOuterIconLabel | TOuterTextLabel | TInnerLabel>({
        label: StringType,
        labelPosition: StringType.oneOf(['top', 'start']),
        icon: StringType,
    })
    .title(translate('Метка'))
    .editor(
        () => {
            return import('Controls-editors/properties').then(({ LabelEditor }) => {
                return LabelEditor;
            });
        },
        {
            isJumping: false,
            Control: ComboboxControl,
            defaultValue: {
                label: translate('Выберите вариант'),
            },
        }
    )
    .optional();
