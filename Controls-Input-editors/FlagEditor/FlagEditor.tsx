import * as rk from 'i18n!Controls-editors';
import { Fragment, memo, useMemo } from 'react';
import { Selector as SelectorControl } from 'Controls/dropdown';
import { Checkbox as CheckboxControl } from 'Controls/checkbox';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { Memory } from 'Types/source';

export interface IFlagPositionOption {
    value: 'start' | 'end';
    caption: string;
}

export interface IFlag {
    flagPosition: IFlagPositionOption[];
    flagVisible: boolean;
}

interface IFlagEditorProps extends IPropertyGridPropertyEditorProps<unknown> {
    options?: IFlag;
}

/**
 * Реакт компонент, редактор флага номера телефона
 * @class Controls-editors/_properties/FlagEditor
 * @public
 * @author Шевченко В.О.
 */
export const FlagEditor = memo((props: IFlagEditorProps) => {
    const { type, value, onChange, options = [], LayoutComponent = Fragment } = props;
    const readOnly = type.isDisabled();
    const required = type.isRequired();
    const source = useMemo(() => {
        return new Memory({
            keyProperty: 'value',
            data: options.flagPosition || [],
        });
    }, [options]);

    const onSelectedKeysChanged = (res) => {
        return onChange({
            flagVisible: true,
            flagPosition: res[0],
        });
    };

    const selectedKeys = useMemo(() => {
        return value !== undefined ? [value.flagPosition || 'start'] : value.flagPosition;
    }, [value.flagPosition]);

    const onFlagChanged = (flagVisible) => {
        return onChange({
            flagPosition: value.flagPosition,
            flagVisible,
        });
    };

    return (
        <LayoutComponent title={null}>
            <CheckboxControl
                value={value.flagVisible}
                onValueChanged={onFlagChanged}
                viewMode="outlined"
                customEvents={['onValueChanged']}
                className="controls-Input_negativeOffset"
                caption={type.getTitle()}
            />
            {value.flagVisible && <SelectorControl
                className="controls-margin_left-s"
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
                data-qa="controls-PropertyGrid__editor_flag"
            />}
        </LayoutComponent>
    );
});
