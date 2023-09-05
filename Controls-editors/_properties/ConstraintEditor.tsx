import { Fragment, memo, useMemo, useState, useCallback, useEffect } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { Checkbox as CheckboxControl } from 'Controls/checkbox';
import { Selector as SelectorControl } from 'Controls/dropdown';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';
import { Memory } from 'Types/source';
import * as rk from 'i18n!Controls-editors';

interface IConstraintEditorProps extends IPropertyEditorProps<String> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    value: String;
    emptyField?: string;
}

export const ConstraintEditor = memo((props: IConstraintEditorProps) => {
    const { value, type, onChange, LayoutComponent = Fragment, emptyField } = props;
    const [showInput, setShowInput] = useState<boolean>(() => {
        return !!value;
    });
    const [selectedKeys, setSelectedKeys] = useState(() => {
        return value !== undefined ? [value] : value;
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
                    value: 'onlyLetters',
                    caption: 'Только буквы',
                },
                {
                    value: 'notSpecial',
                    caption: 'Без специальных',
                },
            ],
        });
    }, []);

    const onSelectedKeysChanged = useCallback((res) => {
        onChange(res[0]);
        setSelectedKeys([res[0]]);
    }, []);

    const onValueChanged = (res) => {
        setShowInput(res);
        onChange(res ? 'onlyLetters' : undefined);
        setSelectedKeys(['onlyLetters']);
    };

    return (
        <LayoutComponent>
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
                    className="controls-margin_left-xs"
                    source={source}
                    closeMenuOnOutsideClick={true}
                    selectedKeys={selectedKeys}
                    readOnly={readOnly}
                    displayProperty="caption"
                    keyProperty="value"
                    emptyKey={emptyField ? null : undefined}
                    emptyText={emptyField}
                    onSelectedKeysChanged={onSelectedKeysChanged}
                    customEvents={['onSelectedKeysChanged']}
                />
            )}
        </LayoutComponent>
    );
});
