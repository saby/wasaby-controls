import { Fragment, memo, useMemo } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { Input as DateInputControl } from 'Controls/dateRange';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';

interface IRangeValue {
    startDate: number;
    endDate: number;
}

interface IDateEditorProps extends IPropertyEditorProps<IRangeValue> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    value: IRangeValue;
    mask?: string;
}

/**
 * Реакт компонент, редактор даты
 * @class Controls-editors/_properties/DateEditor
 * @public
 */
export const DateRangeEditor = memo((props: IDateEditorProps) => {
    const {type, value, onChange, LayoutComponent = Fragment, mask = 'DD.MM.YY'} = props;
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
                onStartValueChanged={(startDate: Date) => onChange({...value, startDate: startDate?.getTime()})}
                onEndValueChanged={(endDate: Date) => onChange({...value, endDate: endDate?.getTime()})}
                readOnly={readOnly}
                customEvents={['onStartValueChanged', 'onEndValueChanged']}
                mask={mask}
            />
        </LayoutComponent>
    );
});
