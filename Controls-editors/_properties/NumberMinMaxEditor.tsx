import { Fragment, memo, useCallback } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { Number as NumberInputControl } from 'Controls/input';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';

interface INumberMinMaxEditorProps extends IPropertyEditorProps<number> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    value: number | undefined;
    options: {
        afterInputText: string;
        minValue: number;
        maxValue: number;
    };
}

/**
 * Реакт компонент, редактор для ввода числа для минимального и максимального значения
 * @class Controls-editors/_properties/NumberMinMaxEditor
 * @public
 */
export const NumberMinMaxEditor = memo((props: INumberMinMaxEditorProps) => {
    const { options, type, value, onChange, LayoutComponent = Fragment } = props;
    const readOnly = type.isDisabled();
    const onInput = useCallback((e) => {
        const newValue = Number(e.target.value);
        if (newValue) {
            if (options.maxValue && options.maxValue < newValue) {
                return onChange(options.maxValue);
            }
            return onChange(newValue);
        }
        return onChange(options.minValue || 0);
    }, []);

    return (
        <LayoutComponent>
            <NumberInputControl
                textAlign={'right'}
                className="controls-Input__width-5ch"
                value={value}
                readOnly={readOnly}
                onInput={onInput}
                data-qa="controls-PropertyGrid__editor_number-min-max"
            />
        </LayoutComponent>
    );
});
