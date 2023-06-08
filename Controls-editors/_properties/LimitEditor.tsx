import { Fragment, memo, useState } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { Checkbox as CheckboxControl } from 'Controls/checkbox';
import { Number as NumberInputControl } from 'Controls/input';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';
import * as rk from 'i18n!Controls';

interface IValue {
    maxValue?: number;
    minValue?: number;
}

interface ILimitEditorProps extends IPropertyEditorProps<IValue> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    value: IValue;
}

export const LimitEditor = memo((props: ILimitEditorProps) => {
    const {value, onChange, LayoutComponent = Fragment} = props;
    const [showInput, setShowInput] = useState(() => {
        return (typeof value?.minValue !== 'undefined' && typeof value?.maxValue !== 'undefined');
    });

    const onMinValueChanged = (value) => {
        return onChange({...value, minValue: Number(value) || 0});
    };
    const onMaxValueChanged = (value) => {
        return onChange({...value, maxValue: Number(value) || 0});
    };
    const onValueChanged = (value) => {
        setShowInput(value);
        if (!value) {
            onChange(undefined);
        } else {
            onChange({minValue: 0, maxValue: 99999.99});
        }
    };

    return (
        <LayoutComponent>
            <CheckboxControl
                value={showInput}
                viewMode="outlined"
                onValueChanged={onValueChanged}
                customEvents={['onValueChanged']}
                caption={<div>{rk('Диапазон значений')} {showInput && (
                    <div className="tw-flex tw-items-baseline">
                        {' ' + rk('от')}
                        <NumberInputControl
                            className="controls-margin_left-xs controls-margin_right-xs controls-Input__width-9ch"
                            value={value.minValue}
                            onValueChanged={onMinValueChanged}
                            customEvents={['onValueChanged']}
                        />
                        {rk('до')}
                        <NumberInputControl
                            className="controls-margin_left-xs controls-Input__width-9ch"
                            value={value.maxValue}
                            onValueChanged={onMaxValueChanged}
                            customEvents={['onValueChanged']}
                        />
                    </div>
                )}</div>}
                data-qa="controls-PropertyGrid__editor_limit-checkbox"
            />
        </LayoutComponent>
    );
});
