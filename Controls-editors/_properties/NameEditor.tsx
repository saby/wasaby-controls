import * as rk from 'i18n!Controls-editors';
import { Fragment, memo, useCallback, useState } from 'react';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { Checkbox as CheckboxControl } from 'Controls/checkbox';
import { Input } from 'Controls/lookup';
import { Memory } from 'Types/source';
import 'css!Controls-editors/_properties/NameEditor';

export interface IFlag {
    id: number;
    title: string;
    parent: string;
    fieldVisible: boolean;
}

interface INameProps extends IPropertyGridPropertyEditorProps<unknown> {
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
        templateName: 'Controls-editors/properties:LookupEditor',
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

    const selectedKeysChanged = (keys) => {
        if (!keys.length) {
            setSelectedKeys([]);
            onChange({ fieldVisible: false });
        }
    };

    const onFlagChanged = useCallback((agr1) => {
        onChange({ ...value, fieldVisible: agr1 });
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
                data-qa="controls-PropertyGrid__editor_name"
                source={source}
                className="tw-w-full"
                placeholder={() => {
                    return <span className={'controls-fontsize-3xl'}>{rk('Имя поля')}</span>;
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
