import * as rk from 'i18n!Controls';
import { Fragment, memo, useMemo } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { Selector as SelectorControl } from 'Controls/dropdown';
import { Checkbox as CheckboxControl } from 'Controls/checkbox';
import { Memory } from 'Types/source';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';

export interface IFlagPositionOption {
    value: 'start' | 'end';
    caption: string;
}

export interface IFlag {
    flagPosition: IFlagPositionOption[];
    flagVisible: boolean;
}

interface IFlagEditorProps extends IPropertyEditorProps<unknown> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    options?: IFlag;
}

/**
 * Реакт компонент, редактор флага номера телефона
 * @class Controls-editors/_properties/FlagEditor
 * @public
 * @author Шевченко В.О.
 */
export const FlagEditor = memo((props: IFlagEditorProps) => {
    const {
        type,
        value,
        onChange,
        options = [],
        LayoutComponent = Fragment,
    } = props;
    const readOnly = type.isDisabled();
    const required = type.isRequired();
    const source = useMemo(() => {
        return new Memory({
            keyProperty: 'value',
            data: options.flagPosition || [],
        });
    }, [options]);

    const onSelectedKeysChanged = (value) => {
        return onChange({
            flagVisible: true,
            flagPosition: value[0],
        });
    };

    const selectedKeys = useMemo(() => {
        return value !== undefined ? [value.flagPosition] : value.flagPosition;
    }, [value.flagPosition]);

    const onFlagChanged = (value) => {
        return onChange({
            flagPosition: value.flagPosition,
            flagVisible: value,
        });
    };

    return (
        <LayoutComponent title={null}>
            <CheckboxControl
                value={value.flagVisible}
                onValueChanged={onFlagChanged}
                viewMode="outlined"
                customEvents={['onValueChanged']}
                caption={type.getTitle()}
            />
            <SelectorControl
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
            />
        </LayoutComponent>
    );
});
