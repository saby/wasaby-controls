import * as rk from 'i18n!Controls';
import { Fragment, memo, useMemo } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { Selector as SelectorControl } from 'Controls/dropdown';
import { Checkbox as CheckboxControl } from 'Controls/checkbox';
import { getArgs } from 'UICore/Events';
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

    const onSelectedKeysChanged = (event) => {
        return onChange({
            flagVisible: true,
            flagPosition: getArgs(event)[1][0],
        });
    };

    const selectedKeys = useMemo(() => {
        return value !== undefined ? [value.flagPosition] : value.flagPosition;
    }, [value.flagPosition]);

    const onFlagChanged = (event) => {
        return onChange({
            flagPosition: value.flagPosition,
            flagVisible: getArgs(event)[1],
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
            />
        </LayoutComponent>
    );
});
