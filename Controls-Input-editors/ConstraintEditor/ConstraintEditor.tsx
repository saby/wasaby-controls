import { Fragment, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { Checkbox as CheckboxControl } from 'Controls/checkbox';
import { default as SelectorControl } from 'Controls/ComboBox';
import { Memory } from 'Types/source';
import * as rk from 'i18n!Controls-editors';

interface IConstraintEditorProps extends IPropertyGridPropertyEditorProps<String> {
    emptyField?: string;
    titlePosition?: string;
}

const ONLY_LETTERS = '[a-zA-Zа-яА-Я0-9еЁ \\n\\t\\r]';
const NOT_SPECIAL = '[a-zA-Zа-яА-ЯёЁ \\n\\t\\r]';

export const ConstraintEditor = memo((props: IConstraintEditorProps) => {
    const { value, type, onChange, LayoutComponent = Fragment, emptyField } = props;
    const [showInput, setShowInput] = useState<boolean>(() => {
        return !!value;
    });
    const [selectedKey, setSelectedKey] = useState(() => {
        return value;
    });

    useEffect(() => {
        setShowInput(!!value);
    }, [value]);

    const readOnly = type.isDisabled();
    const source = useMemo(() => {
        return new Memory({
            keyProperty: 'value',
            data: [
                {
                    value: ONLY_LETTERS,
                    caption: 'Только буквы',
                },
                {
                    value: NOT_SPECIAL,
                    caption: 'Без специальных',
                },
            ],
        });
    }, []);

    const onSelectedKeyChanged = useCallback((res) => {
        onChange(res);
        setSelectedKey(res);
    }, []);

    const onValueChanged = (res) => {
        setShowInput(res);
        onChange(res ? ONLY_LETTERS : '');
        setSelectedKey(ONLY_LETTERS);
    };

    return (
        <LayoutComponent titlePosition={props.titlePosition}>
            <div className="tw-flex tw-items-baseline">
                <CheckboxControl
                    value={showInput}
                    viewMode="outlined"
                    onValueChanged={onValueChanged}
                    customEvents={['onValueChanged']}
                    caption={rk('Вводимые символы')}
                    className="controls-Input_negativeOffset"
                    data-qa="controls-PropertyGrid__editor_limit-checkbox"
                />
                {showInput && (
                    <SelectorControl
                        className="controls-margin_left-xs tw-flex-grow"
                        source={source}
                        closeMenuOnOutsideClick={true}
                        selectedKey={selectedKey}
                        readOnly={readOnly}
                        displayProperty="caption"
                        keyProperty="value"
                        emptyKey={emptyField ? null : undefined}
                        emptyText={emptyField}
                        onSelectedKeyChanged={onSelectedKeyChanged}
                        customEvents={['onSelectedKeyChanged']}
                    />
                )}
            </div>
        </LayoutComponent>
    );
});
