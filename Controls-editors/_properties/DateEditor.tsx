import { Fragment, memo, useCallback } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { Input as DateInputControl } from 'Controls/date';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';

interface IDateEditorProps extends IPropertyEditorProps<Date> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    value: Date | null;
    mask?: string;
}

/**
 * Реакт компонент, редактор даты
 * @class Controls-editors/_properties/DateEditor
 * @public
 */
export const DateEditor = memo((props: IDateEditorProps) => {
    const { type, value, onChange, LayoutComponent = Fragment, mask = 'DD.MM.YY' } = props;

    const readOnly = type.isDisabled();

    const onInput = useCallback((e, value) => {
        return onChange(value);
    }, []);

    return (
        <LayoutComponent>
            <DateInputControl
                data-qa="controls-PropertyGrid__editor_date"
                value={value}
                readOnly={readOnly}
                onValueChanged={onInput}
                customEvents={['onValueChanged']}
                mask={mask}
            />
        </LayoutComponent>
    );
});
