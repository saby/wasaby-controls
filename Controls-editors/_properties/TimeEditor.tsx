import { Fragment, memo, useMemo, useCallback } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { BaseInput as TimeInputControl } from 'Controls/date';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';

interface IDateEditorProps extends IPropertyEditorProps<number> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    value: number | null;
    mask?: string;
}

/**
 * Реакт компонент, редактор времени
 * @class Controls-editors/_properties/TimeEditor
 * @public
 */
export const TimeEditor = memo((props: IDateEditorProps) => {
    const {type, value, onChange, LayoutComponent = Fragment, mask = 'HH:mm'} = props;
    const dateValue = useMemo(() => {
        return new Date(value);
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
