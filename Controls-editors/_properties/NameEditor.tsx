import * as rk from 'i18n!Controls';
import { Fragment, memo, useCallback, useState } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { Checkbox as CheckboxControl } from 'Controls/checkbox';
import { getArgs } from 'UICore/Events';
import { Input } from 'Controls/lookup';
import { Memory } from 'Types/source';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';
import 'css!Controls-editors/_properties/FlagEditor';

export interface IFlag {
    id: number;
    title: string;
    parent: string;
    fieldVisible: boolean;
}

interface INameProps extends IPropertyEditorProps<unknown> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    options?: IFlag[];
}

const DATA = [
    { id: 1, title: rk('1'), parent: null, fieldVisible: true },
    { id: 2, title: rk('2'), parent: null, fieldVisible: true },
    { id: 3, title: rk('3'), parent: null, fieldVisible: true },
];

/**
 * Реакт компонент, редактор для поля ФИО
 * @class Controls-editors/_properties/NameEditor
 * @public
 * @author Шевченко В.О.
 */
export const NameEditor = memo((props: INameProps) => {
    const { type, value, onChange, LayoutComponent = Fragment } = props;
    const [source, setSource] = useState(() => {
        return new Memory({
            data: DATA,
            keyProperty: 'id',
        });
    });

    const selectorTemplate = {
        templateName: 'Controls-editors/_objectEditorPopup/LookupEditorPopup',
        templateOptions: {
            source,
            selectedKeysChangedCallback: (keys: number[]) => {
                setSelectedKeys(keys);
            },
            sendResultCallback: (result: object) => {
                onChange({ ...result, fieldVisible: true });
            },
        },
        popupOptions: {
            width: 500,
            height: 500,
        },
    };

    const selectedKeysChanged = (event) => {
        const [keys] = getArgs(event);
        if (!keys.length) {
            setSelectedKeys([]);
            onChange({ fieldVisible: false });
        }
    };

    const onFlagChanged = useCallback((event) => {
        onChange({ ...value, fieldVisible: getArgs(event)[1] });
        setSelectedKeys([]);
    }, []);

    const [selectedKeys, setSelectedKeys] = useState(value ? [value.id] : []);

    return (
        <LayoutComponent
            title={
                <CheckboxControl
                    value={value.fieldVisible}
                    onValueChanged={onFlagChanged}
                    viewMode="outlined"
                    customEvents={['onValueChanged']}
                    caption={type.getTitle()}
                    className={'controls-NameEditor-checkBox'}
                />
            }
        >
            <Input
                source={source}
                className="tw-w-full"
                placeholder={() => {
                    return (
                        <span className={'controls-fontsize-3xl'}>
                            {rk('Имя поля')}
                        </span>
                    );
                }}
                selectedKeys={selectedKeys}
                keyProperty="id"
                multiSelect={false}
                selectorTemplate={selectorTemplate}
                onSelectedKeysChanged={selectedKeysChanged}
                customEvents={['onSelectedKeysChanged']}
            />
        </LayoutComponent>
    );
});
