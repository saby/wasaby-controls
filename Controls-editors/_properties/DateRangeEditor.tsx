import { Fragment, memo } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { Input as DateInputControl } from 'Controls/dateRange';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';

interface IRangeValue {
    startDate: Date;
    endDate: Date;
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

    return (
        <LayoutComponent>
            <DateInputControl
                data-qa="controls-PropertyGrid__editor_date"
                startValue={value.startDate}
                endValue={value.endDate}
                onStartValueChanged={(startDate) => onChange({...value, startDate})}
                onEndValueChanged={(endDate) => onChange({...value, endDate})}
                readOnly={readOnly}
                customEvents={['onStartValueChanged', 'onEndValueChanged']}
                mask={mask}
            />
        </LayoutComponent>
    );
});
