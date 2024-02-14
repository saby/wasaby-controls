import { Fragment, memo, useCallback, useMemo } from 'react';
import { BaseInput as TimeInputControl } from 'Controls/date';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';

/**
 * @public
 */
export interface IDateEditorProps extends IPropertyGridPropertyEditorProps<number> {
    /**
     * Определяет маску, по которой будет отображаться поле ввода времени
     */
    mask?: string;
}

/**
 * Реакт компонент, редактор времени
 * @class Controls-editors/_properties/TimeEditor
 * @implements Controls-editors/properties:ILimitTimeEditorProps
 * @public
 */
export const TimeEditor = memo((props: IDateEditorProps) => {
    const { type, value, onChange, LayoutComponent = Fragment, mask = 'HH:mm' } = props;
    const dateValue = useMemo(() => {
        if (value) {
            return new Date(value);
        }
        return value;
    }, [value]);

    const readOnly = type.isDisabled();

    const onInput = useCallback((e, dateValue: Date) => {
        return onChange(dateValue?.getTime());
    }, []);

    return (
        <LayoutComponent>
            <TimeInputControl
                data-qa="controls-PropertyGrid__editor_time"
                className="tw-w-full"
                value={dateValue}
                readOnly={readOnly}
                onValueChanged={onInput}
                customEvents={['onValueChanged']}
                mask={mask}
            />
        </LayoutComponent>
    );
});
