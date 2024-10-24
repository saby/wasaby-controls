import { Fragment, memo, ReactElement, useEffect, useMemo, useState } from 'react';
import { Checkbox as CheckboxControl } from 'Controls/checkbox';
import { BaseInput as TimeInputControl } from 'Controls/date';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import * as rk from 'i18n!Controls-editors';

interface IValue {
    maxDate?: Date;
    minDate?: Date;
}

const INPUT_STYLE = {
    marginTop: 'calc(var(--border-thickness) * -1)',
};

/**
 * @public
 */
export interface ILimitTimeEditorProps extends IPropertyGridPropertyEditorProps<IValue> {
    /**
     * Определяет контрол, в котором будет задаваться ограничение
     */
    Control: ReactElement;
    /**
     * Определяет расположение подсказки
     */
    titlePosition?: string;
}

/**
 * Реакт компонент, редактор лимитов, для контролов времени
 * @class Controls-editors/_properties/LimitTimeEditor
 * @implements Controls-editors/properties:ILimitTimeEditorProps
 * @public
 */
export const LimitTimeEditor = memo((props: ILimitTimeEditorProps) => {
    const {
        value,
        onChange,
        mask = 'HH:mm',
        LayoutComponent = Fragment,
        Control = TimeInputControl,
    } = props;
    const [showInput, setShowInput] = useState(() => {
        return typeof value?.minDate !== 'undefined' && typeof value?.maxDate !== 'undefined';
    });

    const maxDate = useMemo(() => {
        return new Date(value.maxDate);
    }, [value?.maxDate]);

    const minDate = useMemo(() => {
        return new Date(value.minDate);
    }, [value?.minDate]);

    useEffect(() => {
        setShowInput(
            typeof value?.minDate !== 'undefined' || typeof value?.maxDate !== 'undefined'
        );
    }, [value?.maxDate, value?.minDate]);

    const onMinValueChanged = (dateValue: Date) => {
        return onChange({ ...value, minDate: dateValue?.getTime() });
    };
    const onMaxValueChanged = (dateValue: Date) => {
        return onChange({ ...value, maxDate: dateValue?.getTime() });
    };
    const onValueChanged = (res) => {
        setShowInput(res);
        if (!res) {
            onChange(undefined);
        } else {
            onChange({ minDate: undefined, maxDate: undefined });
        }
    };

    const onClickHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const onInputCompleted = () => {
        if (value.maxDate && value.minDate && value.minDate > value.maxDate) {
            onChange({ maxDate: value.minDate, minDate: value.maxDate });
        }
    };

    return (
        <LayoutComponent titlePosition={props.titlePosition}>
            <div className="tw-flex tw-items-baseline">
                <CheckboxControl
                    value={showInput}
                    viewMode="outlined"
                    onValueChanged={onValueChanged}
                    customEvents={['onValueChanged']}
                    caption={rk('Период выбора')}
                    className="controls-Input_negativeOffset controls-margin_top-3xs"
                    data-qa="controls-PropertyGrid__editor_limit-checkbox"
                />
                {showInput && (
                    <div
                        className="tw-flex tw-items-baseline controls-margin_left-xs"
                        style={INPUT_STYLE}
                    >
                        {rk('от')}
                        <Control
                            className="controls-margin_left-xs controls-margin_right-xs"
                            mask={mask}
                            value={minDate}
                            onClick={onClickHandler}
                            onValueChanged={onMinValueChanged}
                            onInputCompleted={onInputCompleted}
                            customEvents={['onValueChanged', 'onInputCompleted']}
                        />
                        {rk('до')}
                        <Control
                            className="controls-margin_left-xs"
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
