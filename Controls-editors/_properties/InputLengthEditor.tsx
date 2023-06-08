import { Fragment, memo, useState } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { Checkbox as CheckboxControl } from 'Controls/checkbox';
import { Number as NumberInputControl } from 'Controls/input';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';
import * as rk from 'i18n!Controls';

interface IValue {
    maxLength?: number;
    minLength?: number;
}

interface IInputLengthEditorProps extends IPropertyEditorProps<IValue> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    value: IValue;
}

export const InputLengthEditor = memo((props: IInputLengthEditorProps) => {
    const {value, onChange, LayoutComponent = Fragment} = props;
    const [showInput, setShowInput] = useState(() => {
        return (typeof value?.minLength !== 'undefined' && typeof value?.maxLength !== 'undefined');
    });

    const onMinValueChanged = (value) => {
        return onChange({...value, minLength: Number(value) || 0});
    };
    const onMaxValueChanged = (value) => {
        return onChange({...value, maxLength: Number(value) || 0});
    };
    const onValueChanged = (value) => {
        setShowInput(value);
        if (!value) {
            onChange(undefined);
        } else {
            onChange({minLength: undefined, maxLength: undefined});
        }
    };

    return (
        <LayoutComponent>
            <CheckboxControl
                value={showInput}
                viewMode="outlined"
                onValueChanged={onValueChanged}
                customEvents={['onValueChanged']}
                caption={rk('Количество символов')}
                data-qa="controls-PropertyGrid__editor_limit-checkbox"
            />
            {showInput && (
                <>
                    {' ' + rk('от')}
                    <NumberInputControl
                        className="controls-Input__width-4ch controls-margin_left-xs controls-margin_right-xs"
                        value={value.minLength}
                        onValueChanged={onMinValueChanged}
                        customEvents={['onValueChanged']}
                        data-qa="controls-PropertyGrid__editor_length-input"
                    />
                    {rk('до')}
                    <NumberInputControl
                        className="controls-Input__width-4ch controls-margin_left-xs"
                        value={value.maxLength}
                        onValueChanged={onMaxValueChanged}
                        customEvents={['onValueChanged']}
                        data-qa="controls-PropertyGrid__editor_length-input"
                    />
                </>
            )}
        </LayoutComponent>
    );
});
