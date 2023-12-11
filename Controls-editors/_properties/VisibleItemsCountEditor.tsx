import { Fragment, memo, useCallback, useEffect, useState } from 'react';
import { Checkbox as CheckboxControl } from 'Controls/checkbox';
import { Number as Input } from 'Controls/input';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import * as rk from 'i18n!Controls-editors';
import 'css!Controls-editors/_properties/VisibleItemsCountEditor';

interface IVisibleItemsCountEditorProps extends IPropertyGridPropertyEditorProps<number> {}

const VISIBLE_ITEMS_COUNT = 6;

/**
 * Реакт компонент, редактор количества видимых элементов
 * @class Controls-editors/_properties/VisibleItemsCountEditor
 * @public
 */
export const VisibleItemsCountEditor = memo((props: IVisibleItemsCountEditorProps) => {
    const { value = null, onChange, LayoutComponent = Fragment } = props;
    const [checkboxValue, setCheckboxValue] = useState(!!value);
    const onCheckboxValueChanged = useCallback((newCheckboxValue) => {
        setCheckboxValue(newCheckboxValue);
        if (!newCheckboxValue) {
            onChange(null);
        } else {
            onChange(value ?? VISIBLE_ITEMS_COUNT);
        }
    }, []);

    useEffect(() => {
        setCheckboxValue(!!value);
    }, [value]);

    const onInputValueChanged = useCallback(
        (newValue) => {
            if (newValue) {
                setCheckboxValue(true);
            }
            onChange(newValue);
        },
        [onChange]
    );

    return (
        <LayoutComponent>
            <div className="ws-flexbox ws-flex-column">
                <div className="ws-flexbox ws-align-items-baseline">
                    <CheckboxControl
                        value={checkboxValue}
                        viewMode="outlined"
                        onValueChanged={onCheckboxValueChanged}
                        customEvents={['onValueChanged']}
                        className={'controls-Input_negativeOffset'}
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
                <div className="controls-margin_left-l controls-margin_top-xs">
                    {rk('Остальные будут доступны по клику на КАТ')}
                </div>
            </div>
        </LayoutComponent>
    );
});
