import { Fragment, memo, useMemo } from 'react';
import { Input as DateInputControl } from 'Controls/dateRange';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';

interface IRangeValue {
    startDate: number;
    endDate: number;
}

/**
 * @public
 */
export interface IDateRangeEditorProps extends IPropertyGridPropertyEditorProps<IRangeValue> {
    /**
     * Маска, по которой отобразится поле вводы даты
     */
    mask?: string;
}

/**
 * Реакт компонент, редактор промежутка дат
 * @class Controls-editors/_properties/DateRangeEditor
 * @implements Controls-editors/properties:IDateRangeEditorProps
 * @public
 */
export const DateRangeEditor = memo((props: IDateRangeEditorProps) => {
    const { type, value, onChange, LayoutComponent = Fragment, mask = 'DD.MM.YY' } = props;
    const readOnly = type.isDisabled();
    const startDate = useMemo(() => {
        if (value?.startDate) {
            return new Date(value.startDate);
        }
        return undefined;
    }, [value.startDate]);
    const endDate = useMemo(() => {
        if (value?.endDate) {
            return new Date(value.endDate);
        }
        return undefined;
    }, [value.endDate]);
    return (
        <LayoutComponent>
            <DateInputControl
                data-qa="controls-PropertyGrid__editor_date"
                startValue={startDate}
                endValue={endDate}
                onStartValueChanged={(_, startDate: Date) =>
                    onChange({ ...value, startDate: startDate?.getTime() })
                }
                onEndValueChanged={(_, endDate: Date) =>
                    onChange({ ...value, endDate: endDate?.getTime() })
                }
                readOnly={readOnly}
                customEvents={['onStartValueChanged', 'onEndValueChanged']}
                mask={mask}
            />
        </LayoutComponent>
    );
});
