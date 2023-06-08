import { Fragment, memo, useState } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { Checkbox as CheckboxControl } from 'Controls/checkbox';
import { Number as NumberInputControl } from 'Controls/input';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';
import * as rk from 'i18n!Controls';

interface IValue {
    minLines?: number;
    maxLines?: number;
}

interface IMultilineEditorProps extends IPropertyEditorProps<IValue> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    value: IValue;
}

export const MultilineEditor = memo((props: IMultilineEditorProps) => {
    const {value, onChange, LayoutComponent = Fragment} = props;
    const [showInput, setShowInput] = useState(() => {
        return value.minLines && value.maxLines;
    });

    const onMinValueChanged = (minValue) => {
        return onChange({...value, minLines: Number(minValue) || 0});
    };
    const onMaxValueChanged = (maxValue) => {
        return onChange({...value, maxLines: Number(maxValue) || 0});
    };
    const onValueChanged = (res) => {
        setShowInput(res);
        if (!res) {
            onChange(undefined);
        } else {
            onChange({minLines: 1, maxLines: null});
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
                    caption={rk('Многострочное')}
                    data-qa="controls-PropertyGrid__editor_limit-checkbox"
                />
                {showInput && (
                    <>
                        {' ' + rk('от')}
                        <NumberInputControl
                            className="controls-Input__width-4ch controls-margin_left-xs controls-margin_right-xs"
                            value={value.minLines}
                            onValueChanged={onMinValueChanged}
                            customEvents={['onValueChanged']}
                            data-qa="controls-PropertyGrid__editor_length-input"
                        />
                        {rk('до')}
                        <NumberInputControl
                            className="controls-Input__width-4ch controls-margin_left-xs controls-margin_right-xs"
                            value={value.maxLines}
                            placeholder={rk('авто')}
                            onValueChanged={onMaxValueChanged}
                            customEvents={['onValueChanged']}
                            data-qa="controls-PropertyGrid__editor_length-input"
                        />
                        {rk('строк')}
                    </>
                )}
            </div>
        </LayoutComponent>
    );
});
