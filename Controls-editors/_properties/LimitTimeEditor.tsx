import { Fragment, ReactElement, memo, useState, useMemo, useEffect } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { Checkbox as CheckboxControl } from 'Controls/checkbox';
import { BaseInput as TimeInputControl } from 'Controls/date';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';
import * as rk from 'i18n!Controls';

interface IValue {
    maxDate?: Date;
    minDate?: Date;
}

interface ILimitTimeEditorProps extends IPropertyEditorProps<IValue> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    value: IValue;
    Control: ReactElement;
}

export const LimitTimeEditor = memo((props: ILimitTimeEditorProps) => {
    const {value, onChange, mask = 'HH:mm', LayoutComponent = Fragment, Control = TimeInputControl} = props;
    const [showInput, setShowInput] = useState(() => {
        return (typeof value?.minDate !== 'undefined' && typeof value?.maxDate !== 'undefined');
    });

    const maxDate = useMemo(() => {
        return new Date(value.maxDate);
    }, [value?.maxDate]);

    const minDate = useMemo(() => {
        return new Date(value.minDate);
    }, [value?.minDate]);

    useEffect(() => {
        setShowInput((typeof value?.minDate !== 'undefined' || typeof value?.maxDate !== 'undefined'));
    }, [value?.maxDate, value?.minDate]);

    const onMinValueChanged = (event: Event, dateValue: Date) => {
        return onChange({...value, minDate: dateValue?.getTime()});
    };
    const onMaxValueChanged = (event: Event, dateValue: Date) => {
        return onChange({...value, maxDate: dateValue?.getTime()});
    };
    const onValueChanged = (res) => {
        setShowInput(res);
        if (!res) {
            onChange(undefined);
        } else {
            onChange({minDate: undefined, maxDate: undefined});
        }
    };

    const onClickHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const onInputCompleted = () => {
        if (value.maxDate && value.minDate && value.minDate > value.maxDate) {
            onChange({maxDate: value.minDate, minDate: value.maxDate});
        }
    };

    return (
        <LayoutComponent>
            <div className="tw-flex tw-items-baseline">
                <CheckboxControl
                    value={showInput}
                    viewMode="outlined"
                    onValueChanged={onValueChanged}
                    customEvents={['onValueChanged']}
                    caption={rk('Период выбора')}
                    className="controls-Input_negativeOffset"
                    data-qa="controls-PropertyGrid__editor_limit-checkbox"
                />
                {showInput && (
                    <div className="tw-flex tw-items-baseline controls-margin_left-xs">
                        {rk('от')}
                        <Control
                            className="controls-margin_left-xs tw-self-center controls-margin_right-xs"
                            mask={mask}
                            value={minDate}
                            onClick={onClickHandler}
                            onValueChanged={onMinValueChanged}
                            onInputCompleted={onInputCompleted}
                            customEvents={['onValueChanged', 'onInputCompleted']}
                        />
                        {rk('до')}
                        <Control
                            className="controls-margin_left-xs tw-self-center"
                            mask={mask}
                            value={maxDate}
                            onClick={onClickHandler}
                            onValueChanged={onMaxValueChanged}
                            onInputCompleted={onInputCompleted}
                            customEvents={['onValueChanged', 'onInputCompleted']}
                        />
                    </div>
                )}
            </div>
        </LayoutComponent>
    );
});
