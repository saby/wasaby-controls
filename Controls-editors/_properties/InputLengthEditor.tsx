import { Fragment, memo, useState, useEffect } from 'react';
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
        return !!(value?.minLength || value?.maxLength);
    });

    useEffect(() => {
        if (typeof value.minLength === 'undefined' && typeof value.maxLength === 'undefined') {
            setShowInput(false);
        }
    }, [value.maxLength, value.minLength]);

    const onMinValueChanged = (res) => {
        return onChange({...value, minLength: Number(res) || 0});
    };
    const onMaxValueChanged = (res) => {
        return onChange({...value, maxLength: Number(res) || 0});
    };
    const onValueChanged = (res) => {
        setShowInput(res);
        if (!res) {
            onChange(undefined);
        } else {
            onChange({minLength: undefined, maxLength: undefined});
        }
    };

    return (
        <LayoutComponent>
            <div className="tw-flex tw-w-full tw-items-baseline">
                <CheckboxControl
                    value={showInput}
                    viewMode="outlined"
                    onValueChanged={onValueChanged}
                    customEvents={['onValueChanged']}
                    caption={rk('Количество символов')}
                    className="controls-Input_negativeOffset controls-margin_right-xs"
                    data-qa="controls-PropertyGrid__editor_limit-checkbox"
                />
                {showInput && (
                    <>
                        {' ' + rk('от')}
                        <NumberInputControl
                            className="controls-Input__width-4ch tw-self-center controls-margin_left-xs controls-margin_right-xs"
                            value={value.minLength}
                            onlyPositive={true}
                            precision={0}
                            onValueChanged={onMinValueChanged}
                            customEvents={['onValueChanged']}
                            data-qa="controls-PropertyGrid__editor_length-input"
                        />
                        {rk('до')}
                        <NumberInputControl
                            className="controls-Input__width-4ch tw-self-center controls-margin_left-xs"
                            value={value.maxLength}
                            onlyPositive={true}
                            precision={0}
                            onValueChanged={onMaxValueChanged}
                            customEvents={['onValueChanged']}
                            data-qa="controls-PropertyGrid__editor_length-input"
                        />
                    </>
                )}
            </div>
        </LayoutComponent>
    );
});
