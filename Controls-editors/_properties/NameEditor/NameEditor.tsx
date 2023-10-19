import * as rk from 'i18n!Controls';
import { Fragment, memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { Input } from 'Controls/lookup';
import { DataContext } from 'Controls-DataEnv/context';
import type { Slice } from 'Controls-DataEnv/slice';
import { FieldPath } from './FieldPath';
import { IFieldListState } from './dataFactory/FieldsListFactory';
import {
    IFieldItem,
    IFieldItemDisplayProperty,
    IFieldItemKeyProperty,
} from './dataFactory/FieldsSource';
import { Path } from 'Controls/breadcrumbs';
import { Record } from 'Types/entity';
import { Button } from 'Controls/buttons';

// TODO: подумать откуда эту константу можно импортировать
export const FIELD_DATA_SLICE = 'FieldData';
export const FIELD_LIST_SLICE = 'dataMapPage';
const USER_DATA_BINDING = 'UserData';
const DEFAULT_DELIMITER = '.';

interface INameEditorProps extends IPropertyGridPropertyEditorProps<string[]> {
    options: {
        title?: string;
    };
}

interface IResultSelector {
    id: number;
    title: string;
    parent?: number;
}

const CUSTOM_EVENTS = ['onValueChanged', 'onSelectedKeysChanged', 'onChoose'];

function valueToString(nameValue: string[]): string {
    if (!nameValue) return '';
    return nameValue.join(DEFAULT_DELIMITER);
}

function valueToStringDirty(nameValue: string[]): string {
    if (!nameValue) return '';
    return [...nameValue].pop();
}

function stringToValue(stringValue: string): string[] {
    if (!stringValue) return [];
    const nameValue = stringValue.split(DEFAULT_DELIMITER);
    return valueToString(nameValue).split(DEFAULT_DELIMITER);
}

function findValue(items: IFieldItem[], value: string[]) {
    if (!value) return null;
    const path = valueToString(value);
    return items.find((item) => valueToString(item.Data) === path);
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
    const fieldsSlice = dataContext?.[FIELD_DATA_SLICE] as Slice<IFieldListState>;
    const fieldListSlice = dataContext?.[FIELD_LIST_SLICE] as Slice<IFieldListState>;

    const fieldsData = fieldListSlice?.state.fields;
    const source = fieldListSlice?.state.source;

    const currentValue = useMemo(() => {
        return findValue(fieldsData, value);
    }, [value, fieldsData]);

    const selectedKeys = useMemo(() => {
        return currentValue ? [currentValue[IFieldItemKeyProperty]] : [];
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
            templateName: 'Controls-editors/_properties/NameEditor/NameEditorPopup',
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
        const binding = [USER_DATA_BINDING, dirtyValue];
        fieldsSlice.addFields(fieldsSlice.buildFieldHierarchy(binding));
        onChange(binding);
    }, [dirtyValue, onChange]);

    const footerTemplate = useMemo(() => {
        return {
            templateName: 'Controls-editors/_properties/NameEditor/Footer',
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
            templateName: 'Controls-editors/_properties/NameEditor/FieldsSuggestPopup',
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
        setDirtyValue(valueToStringDirty(newValue.split(DEFAULT_DELIMITER)));
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
                displayProperty={IFieldItemDisplayProperty}
                selectedKeys={selectedKeys}
                keyProperty={IFieldItemKeyProperty}
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
                keyProperty={IFieldItemKeyProperty}
                displayProperty={IFieldItemDisplayProperty}
                items={currentValuePath}
                readOnly={true}
            />
        </LayoutComponent>
    );
});
