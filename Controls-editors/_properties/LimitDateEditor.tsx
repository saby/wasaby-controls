import { Fragment, ReactElement, memo, useMemo, useState, useEffect } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { Checkbox as CheckboxControl } from 'Controls/checkbox';
import { Input as DateInputControl } from 'Controls/date';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';
import * as rk from 'i18n!Controls-editors';

interface IValue {
    maxDate?: number;
    minDate?: number;
}

interface ILimitDateEditorProps extends IPropertyEditorProps<IValue> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    value: IValue;
    Control: ReactElement;
    mask: string;
}

export const LimitDateEditor = memo((props: ILimitDateEditorProps) => {
    const {value, onChange, mask = 'DD.MM.YY', LayoutComponent = Fragment, Control = DateInputControl} = props;
    const [showInput, setShowInput] = useState(() => {
        return (typeof value?.minDate !== 'undefined' && typeof value?.maxDate !== 'undefined');
    });
    const maxDate = useMemo(() => {
        if (value?.maxDate) {
            return new Date(value.maxDate);
        }
        return undefined;
    }, [value.maxDate]);
    const minDate = useMemo(() => {
        if (value?.minDate) {
            return new Date(value.minDate);
        }
        return undefined;
    }, [value.minDate]);

    useEffect(() => {
        setShowInput((typeof value?.minDate !== 'undefined' || typeof value?.maxDate !== 'undefined'));
    }, [value.maxDate, value.minDate]);

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

    const onInputCompletedStart = (_, date: Date) => {
        const dateValue = date?.getTime();
        if (value.maxDate && dateValue && dateValue > value.maxDate) {
            onChange({maxDate: dateValue, minDate: value.maxDate});
        }
    };

    const onInputCompletedEnd = (_, date: Date) => {
        const dateValue = date?.getTime();
        if (dateValue && value.minDate && value.minDate > dateValue) {
            onChange({maxDate: value.minDate, minDate: dateValue});
        }
    };

    return (
        <LayoutComponent>
            <CheckboxControl
                value={showInput}
                viewMode="outlined"
                onValueChanged={onValueChanged}
                customEvents={['onValueChanged']}
                caption={
                    <div className="tw-flex tw-items-baseline tw-flex-wrap">
                        <span className='controls-margin_right-xs'>{rk('Период выбора')}</span> {showInput && (
                        <div className="tw-flex tw-items-baseline">
                            {rk('от')}
                            <Control
                                className="controls-margin_left-xs controls-margin_right-xs"
                                mask={mask}
                                value={minDate}
                                onClick={onClickHandler}
                                onValueChanged={onMinValueChanged}
                                onInputCompleted={onInputCompletedStart}
                                customEvents={['onValueChanged', 'onInputCompleted']}
                            />
                            {rk('до')}
                            <Control
                                className="controls-margin_left-xs"
                                mask={mask}
                                value={maxDate}
                                onClick={onClickHandler}
                                onValueChanged={onMaxValueChanged}
                                onInputCompleted={onInputCompletedEnd}
                                customEvents={['onValueChanged', 'onInputCompleted']}
                            />
                        </div>
                    )}</div>
                }
                className="controls-Input_negativeOffset"
                data-qa="controls-PropertyGrid__editor_limit-checkbox"
            />
        </LayoutComponent>
    );
});
