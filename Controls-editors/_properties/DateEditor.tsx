import { Fragment, memo, useMemo, useCallback } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { Input as DateInputControl } from 'Controls/date';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';

interface IDateEditorProps extends IPropertyEditorProps<number> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    value: number | null;
    mask?: string;
}

/**
 * Реакт компонент, редактор даты
 * @class Controls-editors/_properties/DateEditor
 * @public
 */
export const DateEditor = memo((props: IDateEditorProps) => {
    const {type, value, onChange, LayoutComponent = Fragment, mask = 'DD.MM.YY'} = props;
    const dateValue = useMemo(() => {
        if (value) {
            return new Date(value);
        }
        return undefined;
    }, [value]);

    const readOnly = type.isDisabled();

    const onInput = useCallback((e, dateValue: Date) => {
        return onChange(dateValue?.getTime());
    }, []);

    return (
        <LayoutComponent>
            <DateInputControl
                data-qa="controls-PropertyGrid__editor_date"
                value={dateValue}
                readOnly={readOnly}
                onValueChanged={onInput}
                customEvents={['onValueChanged']}
                mask={mask}
            />
        </LayoutComponent>
    );
});
