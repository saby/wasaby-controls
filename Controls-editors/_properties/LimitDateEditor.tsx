import { Fragment, memo, ReactElement, useEffect, useMemo, useState } from 'react';
import { Checkbox as CheckboxControl } from 'Controls/checkbox';
import { Input as DateInputControl } from 'Controls/date';
import {
    IPropertyGridEditorLayout,
    IPropertyGridPropertyEditorProps,
} from 'Controls-editors/propertyGrid';
import * as rk from 'i18n!Controls-editors';

interface IValue {
    maxDate?: number;
    minDate?: number;
}

/**
 * @public
 */
export interface ILimitDateEditorProps extends IPropertyGridPropertyEditorProps<IValue> {
    /**
     * Определяет контрол, в котором будет задаваться ограничение
     */
    Control: ReactElement;
    /**
     * Определяет маску, по которой будет отображаться поле ввода даты
     */
    mask: string;
    /**
     * Определяет расположение подсказки
     */
    titlePosition?: IPropertyGridEditorLayout['titlePosition'];
}

/**
 * Реакт компонент, редактор лимитов, для контролов дат
 * @class Controls-editors/_properties/LimitDateEditor
 * @implements Controls-editors/properties:ILimitDateEditorProps
 * @public
 */
export const LimitDateEditor = memo((props: ILimitDateEditorProps) => {
    const {
        value,
        onChange,
        mask = 'DD.MM.YY',
        LayoutComponent = Fragment,
        Control = DateInputControl,
    } = props;
    const [showInput, setShowInput] = useState(() => {
        return typeof value?.minDate !== 'undefined' && typeof value?.maxDate !== 'undefined';
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
        setShowInput(
            typeof value?.minDate !== 'undefined' || typeof value?.maxDate !== 'undefined'
        );
    }, [value.maxDate, value.minDate]);

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

    const onInputCompletedStart = (date: Date) => {
        const dateValue = date?.getTime();
        if (value.maxDate && dateValue && dateValue > value.maxDate) {
            onChange({ maxDate: dateValue, minDate: value.maxDate });
        }
    };

    const onInputCompletedEnd = (date: Date) => {
        const dateValue = date?.getTime();
        if (dateValue && value.minDate && value.minDate > dateValue) {
            onChange({ maxDate: value.minDate, minDate: dateValue });
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
                    className="controls-Input_negativeOffset"
                    data-qa="controls-PropertyGrid__editor_limit-checkbox"
                />
                {showInput && (
                    <div className="tw-flex tw-items-baseline controls-margin_left-xs">
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
                )}
            </div>
        </LayoutComponent>
    );
});
