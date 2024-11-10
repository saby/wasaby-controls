import * as rk from 'i18n!Controls';
import { Fragment, memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { Input } from 'Controls/lookup';
import { DataContext } from 'Controls-DataEnv/context';
import type { Slice } from 'Controls-DataEnv/slice';
import { FieldPath } from './FieldPath';
import { IFieldItem } from 'Controls/dataFactory';
import { Path } from 'Controls/breadcrumbs';
import type { RecordSet } from 'Types/collection';
import type { Record } from 'Types/entity';
import type { Memory } from 'Types/source';
import { Button } from 'Controls/buttons';

export const STORE_ID = 'dataMapPageEditor';

interface INameEditorProps extends IPropertyGridPropertyEditorProps<string[]> {
    options: {
        title?: string;
    };
}

interface ISliceState {
    items: RecordSet<IFieldItem>;
    source: Memory;
}

interface IResultSelector {
    id: number;
    title: string;
    parent?: number;
}

const USER_DATA_BINDING = 'UserData';
const CUSTOM_EVENTS = ['onValueChanged', 'onSelectedKeysChanged', 'onChoose'];

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

function findValue(items: IFieldItem[], value: string[]) {
    if (!value) return null;
    const path = valueToString(value);
    return items.find((item) => item.Title === path);
}

/**
 * Реакт компонент, редактор название поле
 * @class Controls-Input-editors/NameEditor
 * @public
 */
export const NameEditor = memo((props: INameEditorProps) => {
    const { onChange, value, type, LayoutComponent = Fragment } = props;
    const dataContext = useContext(DataContext);
    const [dirtyValue, setDirtyValue] = useState<string>('');
    const slice = dataContext?.[STORE_ID] as Slice<ISliceState>;

    const fieldsData = useMemo(() => {
        return (slice?.state.items.getRawData() as IFieldItem[]) || [];
    }, [slice]);

    const source = useMemo(() => {
        return slice?.state.source;
    }, [slice]);

    const currentValue = useMemo(() => {
        return findValue(fieldsData, value);
    }, [value, fieldsData]);

    const selectedKeys = useMemo(() => {
        return currentValue ? [currentValue.Id] : [];
    }, [currentValue]);
    const pathGetter = useMemo(() => {
        return new FieldPath(fieldsData);
    }, [fieldsData]);

    const currentValuePath = useMemo(() => {
        if (!selectedKeys.length) return [];
        return pathGetter.getPath(selectedKeys[0], false);
    }, [pathGetter, selectedKeys]);

    const selectorTemplate = useMemo(() => {
        return {
            templateName: 'Controls-Input-editors/LookupEditor/LookupEditorPopup',
            templateOptions: {
                dataContext,
                sendResultCallback: (result: IResultSelector) => {
                    onChange(stringToValue(result.title));
                },
            },
            popupOptions: {
                width: 500,
                height: 500,
            },
        };
    }, [onChange, dataContext]);

    const addButtonClickCallback = useCallback(() => {
        onChange([USER_DATA_BINDING, dirtyValue]);
    }, [dirtyValue, onChange]);

    const footerTemplate = useMemo(() => {
        return {
            templateName: 'Controls-Input-editors/LookupEditor/Footer',
            templateOptions: {
                addButtonClickCallback,
                showSelectorButtonTemplate: (
                    <Button caption={rk('Показать все')} fontColorStyle="label" viewMode="link" />
                ),
            },
        };
    }, [addButtonClickCallback]);

    const suggestTemplate = useMemo(() => {
        return {
            templateName: 'Controls-Input-editors/LookupEditor/FieldsSuggestPopup',
            templateOptions: {
                source,
                pathGetter,
            },
        };
    }, [source, pathGetter]);

    const placeholderTemplate = useMemo(() => {
        return function () {
            return selectedKeys.length ? null : (
                <span
                    className={
                        !type.getTitle() ? 'controls-fontsize-3xl controls-fontweight-normal' : ''
                    }
                >
                    {rk('Выберите имя')}
                </span>
            );
        };
    }, [type, selectedKeys]);

    const selectedKeysChanged = useCallback(
        (keys) => {
            if (!keys.length) {
                onChange(undefined);
            }
        },
        [onChange]
    );

    const onValueChanged = useCallback((newValue) => {
        if (newValue === undefined) return;
        setDirtyValue(valueToStringDirty(newValue.split('.')));
    }, []);

    const onChoose = useCallback(
        (item: Record) => {
            const field = item.getRawData();
            onChange(stringToValue(field.Title));
        },
        [onChange]
    );

    useEffect(() => {
        if (currentValue) {
            setDirtyValue('');
        }
    }, [currentValue]);

    return (
        <LayoutComponent title={type.getTitle() || null}>
            <Input
                value={dirtyValue || undefined}
                data-qa="controls-PropertyGrid__editor_lookup"
                source={source}
                className="tw-w-full"
                placeholder={placeholderTemplate}
                displayProperty="DisplayName"
                selectedKeys={selectedKeys}
                keyProperty="Id"
                footerTemplate={footerTemplate}
                searchParam={'title'}
                multiSelect={false}
                fontSize="3xl"
                inlineHeight="l"
                filter={{ View: true }}
                selectorTemplate={selectorTemplate}
                suggestTemplate={suggestTemplate}
                onSelectedKeysChanged={selectedKeysChanged}
                onValueChanged={onValueChanged}
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
