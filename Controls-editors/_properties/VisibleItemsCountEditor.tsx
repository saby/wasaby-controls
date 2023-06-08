import { Fragment, memo, useCallback, useRef } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { Checkbox as CheckboxControl } from 'Controls/checkbox';
import { Number as Input } from 'Controls/input';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';
import * as rk from 'i18n!Controls';
import 'css!Controls-editors/_properties/VisibleItemsCountEditor';

interface IVisibleItemsCountEditorProps extends IPropertyEditorProps<Date> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
}

/**
 * Реакт компонент, редактор количества видимых элементов
 * @class Controls-editors/_properties/VisibleItemsCountEditor
 * @public
 */
export const VisibleItemsCountEditor = memo((props: IVisibleItemsCountEditorProps) => {
    const { value = null, onChange, LayoutComponent = Fragment } = props;
    const checkboxValue = useRef(!!value);

    const onCheckboxValueChanged = useCallback((value) => {
        checkboxValue.current = value;
        if (!value) {
            onChange(null);
        }
    }, []);

    const onInputValueChanged = useCallback(
        (value) => {
            if (value) {
                checkboxValue.current = true;
            }
            onChange(value);
        },
        [onChange]
    );

    return (
        <LayoutComponent>
            <div className="ws-flexbox ws-flex-column">
                <div className="ws-flexbox ws-align-items-baseline">
                    <CheckboxControl
                        value={checkboxValue.current}
                        viewMode="outlined"
                        onValueChanged={onCheckboxValueChanged}
                        customEvents={['onValueChanged']}
                    />
                    <div className="ws-flexbox ws-align-items-baseline">
                        <div className="ws-flex-shrink-0">{rk('Видимые сразу варианты')}</div>
                        <Input
                            className="controls-VisibleItemsCountEditor-InputNumber"
                            value={value}
                            onValueChanged={onInputValueChanged}
                            customEvents={['onValueChanged']}
                        />
                    </div>
                </div>
                <div className="controls-margin_left-xl controls-margin_top-xs">
                    {rk('Остальные будут доступны по клику на КАТ')}
                </div>
            </div>
        </LayoutComponent>
    );
});
