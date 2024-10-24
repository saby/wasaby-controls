import { Fragment, memo, useCallback, useMemo } from 'react';
import { Input as DateInputControl } from 'Controls/date';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';

const CUSTOM_EVENTS = ['onValueChanged'];

/**
 * @public
 */
export interface IDateEditorProps extends IPropertyGridPropertyEditorProps<number> {
    /**
     * Значение даты в unix формате
     */
    value: number | null;
    /**
     * Маска, по которой отобразится дата
     */
    mask?: string;
}

/**
 * Реакт компонент, редактор даты
 * @class Controls-editors/_date/DateEditor
 * @implements Controls-editors/date:IDateEditorProps
 * @public
 */
export const DateEditor = memo((props: IDateEditorProps) => {
    const { type, value, onChange, LayoutComponent = Fragment, mask = 'DD.MM.YY' } = props;
    const dateValue = useMemo(() => {
        if (value) {
            return new Date(value);
        }
        return null;
    }, [value]);

    const readOnly = type.isDisabled();

    const onInput = useCallback((dateValue: Date) => {
        return onChange(dateValue?.getTime());
    }, []);

    return (
        <LayoutComponent>
            <DateInputControl
                data-qa="controls-PropertyGrid__editor_date"
                value={dateValue}
                readOnly={readOnly}
                onValueChanged={onInput}
                customEvents={CUSTOM_EVENTS}
                mask={mask}
            />
        </LayoutComponent>
    );
});
