import { TOuterIconLabel, TOuterTextLabel } from 'Controls-Input/interface';
import { ObjectType, StringType } from 'Meta/types';
import { default as Combobox } from 'Controls/ComboBox';
import * as rk from 'i18n!Controls-Input';
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
    .attributes({
        label: ObjectType.attributes<TOuterIconLabel | TOuterTextLabel>({
            label: StringType,
            labelPosition: StringType.oneOf(['top', 'start']),
            icon: StringType,
        })
            .title(rk('Метка'))
            .editor(
                () => {
                    return import('Controls-Input-editors/LabelEditor').then(({ LabelEditor }) => {
                        return LabelEditor;
                    });
                },
                {
                    isJumping: false,
                    Control: ComboboxControl,
                    defaultValue: {
                        label: rk('Выберите вариант'),
                    },
                }
            )
            .optional()
            .defaultValue({}),
    })
    .defaultValue({});
