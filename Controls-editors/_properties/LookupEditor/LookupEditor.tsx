import * as rk from 'i18n!Controls';
import { memo, Fragment, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { Memory } from 'Types/source';
import { Input } from 'Controls/lookup';
import { IEditorLayoutProps } from 'Controls-editors/object-type';
import { FieldsContext, emptyFieldsContextValue } from './FieldsContext';
import { createFieldsSource, PathGetter } from './FieldsSource';
import { Path } from 'Controls/breadcrumbs';
import { Record } from 'Types/entity';

interface INameEditorProps extends IPropertyEditorProps<string[]> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    options: {
        title?: string;
    };
}

interface IResultSelector {
    Id: number;
    Title: string;
    Parent: number;
}
const USER_DATA_BINDING = 'UserData';
const CUSTOM_EVENTS = ['onValueChanged', 'onSelectedKeysChanged', 'onChoose']; // , 'onInputCompleted'];

function valueToString(nameValue: string[]): string {
    if (!nameValue) return '';
    return nameValue.join('.');
}

function valueToStringDirty(nameValue: string[]): string {
    if (!nameValue) return '';
    return [...nameValue].pop();
}

function stringToValue(stringValue: string): string[] {
    if (!stringValue) return [];
    const nameValue = stringValue.split('.');
    return valueToString(nameValue).split('.');
}

function findValue(items: IResultSelector[], value: string[]) {
    if (!value) return null;
    const path = valueToString(value);
    return items.find((item) => item.Title === path);
}

/**
 * Реакт компонент, редактор название поле
 * @class Controls-editors/_properties/LookupEditor
 * @public
 */
export const LookupEditor = memo((props: INameEditorProps) => {
    const { onChange, value, type, LayoutComponent = Fragment } = props;
    const fieldsContext = useContext(FieldsContext) || emptyFieldsContextValue;
    const [source, setSource] = useState<Memory>(null);
    const [dirtyValue, setDirtyValue] = useState<string>(valueToStringDirty(value));

    useEffect(() => {
        if (fieldsContext.fieldsDataRef.current?.length) {
            setSource(createFieldsSource(fieldsContext.fieldsDataRef.current));
        } else {
            fieldsContext.getDataAsync().then((items) => {
                setSource(createFieldsSource(items));
            });
        }
    }, [fieldsContext]);

    const currentValue = useMemo(() => {
        return findValue(fieldsContext.fieldsDataRef.current as IResultSelector[], value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, fieldsContext, source]);

    const [selectedKeys, setSelectedKeys] = useState(currentValue ? [currentValue.Id] : []);
    const pathGetter = useMemo(() => {
        return new PathGetter(fieldsContext.fieldsDataRef.current);
    }, [fieldsContext, source]);

    const currentValuePath = useMemo(() => {
        if (!selectedKeys.length) return [];
        return pathGetter.getPath(selectedKeys[0], false);
    }, [pathGetter, selectedKeys]);

    const selectorTemplate = useMemo(() => {
        return {
            templateName: 'Controls-editors/_properties/LookupEditor/LookupEditorPopup',
            templateOptions: {
                source,
                selectedKeysChangedCallback: (keys: number[]) => {
                    setSelectedKeys(keys);
                },
                sendResultCallback: (result: IResultSelector) => {
                    onChange(stringToValue(result.Title));
                },
            },
            popupOptions: {
                width: 500,
                height: 500,
            },
        };
    }, [source, onChange]);

    const suggestTemplate = useMemo(() => {
        return {
            templateName: 'Controls-editors/_properties/LookupEditor/FieldsSuggestPopup',
            templateOptions: {
                source,
                pathGetter,
            },
        };
    }, [source, pathGetter]);

    const selectedKeysChanged = useCallback(
        (keys) => {
            if (!keys.length) {
                setSelectedKeys([]);
                onChange(undefined);
            }
        },
        [onChange]
    );

    const onValueChanged = useCallback((newValue) => {
        if (newValue === undefined) return;
        setDirtyValue(valueToStringDirty(newValue.split('.')));
    }, []);

    // const onInputCompleted = useCallback(
    //     (newValue) => {
    //         if (newValue === undefined) return;
    //         const dirty = valueToStringDirty(newValue.split('.'));
    //         setDirtyValue(dirty);
    //     },
    //     []
    // );

    const onChoose = useCallback((item: Record) => {
        const field = item.getRawData();
        setSelectedKeys([field.Id]);
    }, []);

    const addButtonClickCallback = useCallback(() => {
        onChange([USER_DATA_BINDING, dirtyValue]);
        fieldsContext.getDataAsync().then((items) => {
            setSource(createFieldsSource(items));
        });
    }, [dirtyValue, fieldsContext, onChange]);

    useEffect(() => {
        if (currentValue) {
            setSelectedKeys([currentValue.Id]);
        }
    }, [currentValue]);

    return (
        <LayoutComponent title={type.getTitle() || null}>
            <Input
                value={currentValue || !source ? undefined : dirtyValue}
                data-qa="controls-PropertyGrid__editor_lookup"
                source={source}
                className="tw-w-full"
                placeholder={() => {
                    return (
                        <span className={!type.getTitle() ? 'controls-fontsize-3xl' : ''}>
                            {rk('Выберите имя')}
                        </span>
                    );
                }}
                displayProperty="DisplayName"
                selectedKeys={selectedKeys}
                keyProperty="Id"
                searchParam={'title'}
                multiSelect={false}
                fontSize="3xl"
                inlineHeight="l"
                filter={{ Parent_: false }}
                selectorTemplate={selectorTemplate}
                suggestTemplate={suggestTemplate}
                addButtonClickCallback={addButtonClickCallback}
                onSelectedKeysChanged={selectedKeysChanged}
                onValueChanged={onValueChanged}
                // onInputCompleted={onInputCompleted}
                onChoose={onChoose}
                customEvents={CUSTOM_EVENTS}
            />
            <Path
                keyProperty="Id"
                displayProperty="DisplayName"
                items={currentValuePath}
                readOnly={true}
            />
        </LayoutComponent>
    );
});
