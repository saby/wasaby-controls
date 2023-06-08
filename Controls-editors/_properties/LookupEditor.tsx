import * as rk from 'i18n!Controls';
import { memo, Fragment, useState } from 'react';
import { getArgs } from 'UICore/Events';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { Memory } from 'Types/source';
import { Input } from 'Controls/lookup';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';

const DATA = [
    { id: 1, title: rk('Совещание'), parent: null, 'parent@': true },
    { id: 2, title: rk('Название'), parent: 1 },
    { id: 3, title: rk('Ссылка'), parent: null },
    { id: 4, title: rk('Группа'), parent: null },
    { id: 5, title: rk('Помещение'), parent: null },
    { id: 6, title: rk('Тип'), parent: null },
    { id: 7, title: rk('Состояние'), parent: null },
];

interface INameEditorProps extends IPropertyEditorProps<string> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    options: {
        title?: string;
    };
}

interface IResultSelector {
    id: number;
    title: string;
}

/**
 * Реакт компонент, редактор название поле
 * @class Controls-editors/_properties/LookupEditor
 * @public
 */
export const LookupEditor = memo((props: INameEditorProps) => {
    const {
        options,
        onChange,
        value,
        type,
        LayoutComponent = Fragment,
    } = props;
    // eslint-disable-next-line react/hook-use-state
    const [source] = useState(() => {
        return new Memory({
            data: DATA,
            keyProperty: 'id',
        });
    });
    const [selectedKeys, setSelectedKeys] = useState(value ? [value.id] : []);
    const selectorTemplate = {
        templateName: 'Controls-editors/_objectEditorPopup/LookupEditorPopup',
        templateOptions: {
            source,
            selectedKeysChangedCallback: (keys: number[]) => {
                setSelectedKeys(keys);
            },
            sendResultCallback: (result: IResultSelector) => {
                onChange(result);
            },
        },
        popupOptions: {
            width: 500,
            height: 500,
        },
    };

    const selectedKeysChanged = (event) => {
        const [e, keys] = getArgs(event);
        if (!keys.length) {
            setSelectedKeys([]);
            onChange(undefined);
        }
    };

    return (
        <LayoutComponent title={type.getTitle() || null}>
            <Input
                source={source}
                className="tw-w-full"
                placeholder={() => {
                    return (
                        <span
                            className={
                                !type.getTitle() ? 'controls-fontsize-3xl' : ''
                            }
                        >
                            {rk('Имя поля')}
                        </span>
                    );
                }}
                selectedKeys={selectedKeys}
                keyProperty="id"
                searchParam={'Search'}
                multiSelect={false}
                selectorTemplate={selectorTemplate}
                onSelectedKeysChanged={selectedKeysChanged}
                customEvents={['onSelectedKeysChanged']}
            />
        </LayoutComponent>
    );
});
