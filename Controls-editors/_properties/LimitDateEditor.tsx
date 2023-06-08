import { Fragment,ReactElement, memo, useState } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { Checkbox as CheckboxControl } from 'Controls/checkbox';
import { Input as DateInputControl } from 'Controls/date';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';
import * as rk from 'i18n!Controls';

interface IValue {
    maxDate?: Date;
    minDate?: Date;
}

interface ILimitDateEditorProps extends IPropertyEditorProps<IValue> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    value: IValue;
    Control: ReactElement;
}

export const LimitDateEditor = memo((props: ILimitDateEditorProps) => {
    const {value, onChange, LayoutComponent = Fragment, Control = DateInputControl} = props;
    const [showInput, setShowInput] = useState(() => {
        return (typeof value?.minDate !== 'undefined' && typeof value?.maxDate !== 'undefined');
    });

    const onMinValueChanged = (event: Event, dateValue: Date) => {
        return onChange({...value, minDate: dateValue});
    };
    const onMaxValueChanged = (event: Event, dateValue: Date) => {
        return onChange({...value, maxDate: dateValue});
    };
    const onValueChanged = (value) => {
        setShowInput(value);
        if (!value) {
            onChange(undefined);
        } else {
            onChange({minDate: undefined, maxDate: undefined});
        }
    };

    return (
        <LayoutComponent>
            <CheckboxControl
                value={showInput}
                viewMode="outlined"
                onValueChanged={onValueChanged}
                customEvents={['onValueChanged']}
                caption={rk('Период выбора')}
                data-qa="controls-PropertyGrid__editor_limit-checkbox"
            />
            {showInput && (
                <>
                    {' ' + rk('от')}
                    <Control
                        className="controls-margin_left-xs controls-margin_right-xs"
                        value={value.minDate}
                        onValueChanged={onMinValueChanged}
                        customEvents={['onValueChanged']}
                    />
                    {rk('до')}
                    <Control
                        className="controls-margin_left-xs"
                        value={value.maxDate}
                        onValueChanged={onMaxValueChanged}
                        customEvents={['onValueChanged']}
                    />
                </>
            )}
        </LayoutComponent>
    );
});
