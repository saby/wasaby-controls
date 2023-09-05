import { Fragment, memo, useState, useEffect } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { Checkbox as CheckboxControl } from 'Controls/checkbox';
import { Number as NumberInputControl } from 'Controls/input';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';
import * as rk from 'i18n!Controls-editors';

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
    const [showInput, setShowInput] = useState<boolean>(() => {
        return !!(value.minLines || value.maxLines);
    });

    useEffect(() => {
        if (typeof value.minLines === 'undefined' && typeof value.maxLines === 'undefined') {
            setShowInput(false);
        }
    }, [value]);

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
            onChange({minLines: 1, maxLines: undefined});
        }
    };

    const onInputCompleted = () => {
        if (value.maxLines && value.minLines > value.maxLines) {
            onChange({maxLines: value.minLines, minLines: value.maxLines});
        }
    };

    const maxLines = value?.maxLines ? value.maxLines : null;

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
                    className="controls-margin_right-xs controls-Input_negativeOffset"
                />
                {showInput && (
                    <>
                        {' ' + rk('от')}
                        <NumberInputControl
                            className="controls-Input__width-4ch tw-self-center controls-margin_left-xs controls-margin_right-xs"
                            value={value.minLines}
                            onlyPositive={true}
                            precision={0}
                            onValueChanged={onMinValueChanged}
                            onInputCompleted={onInputCompleted}
                            customEvents={['onValueChanged', 'onInputCompleted']}
                            data-qa="controls-PropertyGrid__editor_length-input"
                        />
                        {rk('до')}
                        <NumberInputControl
                            className="controls-Input__width-4ch tw-self-center controls-margin_left-xs controls-margin_right-xs"
                            value={maxLines}
                            onlyPositive={true}
                            precision={0}
                            placeholder={rk('авто')}
                            onValueChanged={onMaxValueChanged}
                            onInputCompleted={onInputCompleted}
                            customEvents={['onValueChanged', 'onInputCompleted']}
                            data-qa="controls-PropertyGrid__editor_length-input"
                        />
                        {rk('строк')}
                    </>
                )}
            </div>
        </LayoutComponent>
    );
});
