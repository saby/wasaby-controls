import { Fragment, memo, useMemo, useState, useCallback } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { Checkbox as CheckboxControl } from 'Controls/checkbox';
import { Selector as SelectorControl } from 'Controls/dropdown';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';
import { Memory } from 'Types/source';
import * as rk from 'i18n!Controls';

interface IConstraintEditorProps extends IPropertyEditorProps<String> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    value: String;
}

export const ConstraintEditor = memo((props: IConstraintEditorProps) => {
    const {value, type, onChange, LayoutComponent = Fragment} = props;
    const [showInput, setShowInput] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState(() => {
        return value !== undefined ? [value] : value;
    });

    const readOnly = type.isDisabled();
    const required = type.isRequired();
    const source = useMemo(() => {
        return new Memory({
            keyProperty: 'value', data: [
                {
                    value: 'onlyLetters',
                    caption: 'Только буквы'
                },
                {
                    value: 'notSpecial',
                    caption: 'Без специальных'
                }
            ]
        });
    }, []);

    const onSelectedKeysChanged = useCallback((value) => {
        if (value[0] === 'notSpecial') {
            onChange('[a-zA-Zа-яА-Я0-9еЁ]');
        } else {
            onChange('[a-zA-Zа-яА-ЯёЁ]');
        }
        setSelectedKeys(value[0]);
    }, []);

    const onValueChanged = (value) => {
        setShowInput(value);
        if (!value) {
            onChange(undefined);
        }
    };

    return (
        <LayoutComponent>
            <CheckboxControl
                value={showInput}
                viewMode="outlined"
                onValueChanged={onValueChanged}
                customEvents={['onValueChanged']}
                caption={rk('Вводимые символы')}
                data-qa="controls-PropertyGrid__editor_limit-checkbox"
            />
            {showInput && (
                <SelectorControl
                    className='controls-margin_left-xs'
                    source={source}
                    closeMenuOnOutsideClick={true}
                    selectedKeys={selectedKeys}
                    readOnly={readOnly}
                    displayProperty="caption"
                    keyProperty="value"
                    emptyKey={!required && ''}
                    emptyText={!required && rk('Не выбрано')}
                    onSelectedKeysChanged={onSelectedKeysChanged}
                    customEvents={['onSelectedKeysChanged']}
                />
            )}
        </LayoutComponent>
    );
});
