import * as rk from 'i18n!Controls';
import { Fragment, memo, useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { Input } from 'Controls/lookup';
import type { Slice } from 'Controls-DataEnv/slice';
import { useSlice } from 'Controls-DataEnv/context';
import { FieldPath } from './FieldPath';
import { IFieldListState, FieldListSlice } from './dataFactory/FieldsListFactory';
import { createFieldsSource } from './dataFactory/FieldsSource';
import {
    IFieldItem,
    IFieldItemDisplayProperty,
    IFieldItemKeyProperty,
} from './dataFactory/FieldsSource';
import { Path } from 'Controls/breadcrumbs';
import { Record } from 'Types/entity';
import { Button } from 'Controls/buttons';
import {
    FIELD_LIST_SLICE,
    POPUP_FIELD_LIST_SLICE,
    FIELD_DATA_SLICE,
    DEFAULT_DELIMITER,
    USER_DATA_BINDING,
} from './dataFactory/constants';
import { RecordSet } from 'Types/collection';

interface INameEditorProps extends IPropertyGridPropertyEditorProps<string[]> {
    options: {
        title?: string;
    };
    fieldType: unknown;
}

interface IResultSelector {
    id: number;
    data: string[];
    parent?: number;
}

const CUSTOM_EVENTS = ['onValueChanged', 'onSelectedKeysChanged', 'onChoose'];

function valueToString(nameValue: string[]): string {
    if (!nameValue) return '';
    return nameValue.join(DEFAULT_DELIMITER);
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
    const { onChange, value, type, LayoutComponent = Fragment, fieldType } = props;

    const [dirtyValue, setDirtyValue] = useState<string>('');
    const fieldsSlice = useSlice<Slice<IFieldListState>>(FIELD_DATA_SLICE);
    const fieldListSlice = useSlice<Slice<IFieldListState>>(FIELD_LIST_SLICE);

    const fieldsData = fieldsSlice?.state?.fields;

    /*
     * Создаём слайс самостоятельно, пока не появится возможность добавлять в существующий контекст новые слайсы
     */
    const lookupRef = useRef();
    const storeChangedCallback = useCallback(() => {
        if (lookupRef.current) {
            lookupRef.current.showSelector({
                dataContext: fieldListPopupContext,
                sendResultCallback: (result: IResultSelector) => {
                    onChange(result.data);
                },
            });
        }
    }, [lookupRef]);

    const localFieldsSlice = useMemo(() => {
        if (!fieldsData) {
            return;
        }
        const config = {
            fields: fieldsData,
            fieldType,
            filter: { isTreeFilter: true },
            markerVisibility: 'hidden',
            searchNavigationMode: 'expand',
            expanderVisibility: 'hasChildren',
            searchParam: 'title',
            loadDataTimeout: 0,
            keyProperty: 'Id',
            parentProperty: 'Parent',
            nodeProperty: 'Parent_',
            hasChildrenProperty: 'Parent_',
            titleProperty: 'FullDisplayName',
            displayProperty: 'DisplayName',
            descriptionField: '',
            columns: fieldListSlice?.state?.columns,
        };

        return new FieldListSlice({
            config,
            loadResult: {
                fields: fieldsData,
            },
            onChange: storeChangedCallback,
        });
    }, [fieldsData]);

    const fieldListPopupContext = useMemo(() => {
        const dataContext = {
            [FIELD_DATA_SLICE]: fieldsSlice,
            [FIELD_LIST_SLICE]: fieldListSlice,
        };

        if (!localFieldsSlice) {
            return dataContext;
        }

        return {
            ...dataContext,
            [POPUP_FIELD_LIST_SLICE]: localFieldsSlice,
        };
    }, [fieldsSlice, fieldListSlice, localFieldsSlice]);

    const source = useMemo(() => {
        if (!fieldListPopupContext) {
            return;
        }
        const filteredFieldsData = fieldListPopupContext[POPUP_FIELD_LIST_SLICE]?.state?.fields;
        return createFieldsSource(filteredFieldsData);
    }, [fieldsData, fieldListSlice, fieldListPopupContext]);

    const currentValue = useMemo(() => {
        return findValue(fieldsData, value);
    }, [value, fieldsData]);

    const items = useMemo(() => {
        if (!!currentValue) {
            return new RecordSet({
                rawData: [currentValue],
                keyProperty: 'Id',
            });
        }
        return;
    }, [currentValue]);

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
                dataContext: fieldListPopupContext,
                sendResultCallback: (result: IResultSelector) => {
                    onChange(result.data);
                },
            },
            popupOptions: {
                width: 500,
                height: 500,
            },
        };
    }, [onChange, fieldListPopupContext]);

    const addButtonClickCallback = useCallback(() => {
        const binding = [USER_DATA_BINDING, dirtyValue];
        const fields = fieldsSlice.buildFieldHierarchy(binding);
        const typedField = fields.find((field) => field.DisplayName === dirtyValue);
        if (typedField && fieldType) {
            const type = fieldType[0];
            typedField.Type = type.charAt(0).toUpperCase() + type.slice(1);
        }
        fieldsSlice.addFields(fields);
        setDirtyValue('');
        onChange(binding);
    }, [dirtyValue, onChange, fieldType]);

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
                onChange(null);
            }
        },
        [onChange]
    );

    const onValueChanged = useCallback((newValue) => {
        if (newValue === undefined) return;
        setDirtyValue(newValue);
    }, []);

    const onChoose = useCallback(
        (item: Record) => {
            const field = item.getRawData();
            onChange(field.Data);
        },
        [onChange]
    );

    useEffect(() => {
        if (currentValue) {
            setDirtyValue('');
        }
    }, [currentValue]);

    if (!fieldsData && !fieldListSlice) {
        return null;
    }

    return (
        <LayoutComponent title={type.getTitle() || null}>
            <Input
                value={dirtyValue || undefined}
                data-qa="controls-PropertyGrid__editor_lookup"
                suggestSource={source}
                items={items}
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
                ref={lookupRef}
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
