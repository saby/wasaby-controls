import * as rk from 'i18n!Controls-editors';
import { Fragment, useCallback, useMemo, useState, useRef } from 'react';
import { RecordSet } from 'Types/collection';
import {
    FIELD_LIST_ENDPOINT,
    NODE_DELIMITER,
    TYPE_REPOSITORY_SLICE,
    ITypeRepository,
    FieldListSource,
    IDataObjectFieldType,
} from 'Frame-DataEnv/dataLoader';
import { useSlice } from 'Controls-DataEnv/context';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { Input as Lookup } from 'Controls/lookup';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { ArgumentsEditor } from './_arguments/ArgumentsEditor';
import 'css!Controls-editors/_properties/NameEditor/Selector';

interface INameSelectorProps extends IPropertyGridPropertyEditorProps<string[]> {
    fieldType: string[];
    labelProperty?: string[];
    iconProperty?: string[];
}

/**
 * Редактор выбора привязки к полю прикладного объекта системы
 * @public
 */
export function DataObjectFieldSelector(props: INameSelectorProps) {
    const {
        onChange,
        value,
        type,
        LayoutComponent = Fragment,
        fieldType,
        labelProperty,
        iconProperty,
        name: nameProperty,
    } = props;
    const typeRepository = useSlice<ITypeRepository>(TYPE_REPOSITORY_SLICE);
    const constructorType = typeRepository?.getConstructorType();

    const [functionDesc, setFunctionDesc] = useState();

    const { keyProperty, parentProperty, nodeProperty, displayProperty } = FIELD_LIST_ENDPOINT;

    const lookupRef = useRef();

    const FrameBaseModule = loadSync<typeof import('Frame/base')>('Frame/base');
    const FieldListModule = loadSync<typeof import('FrameEditor/dataObjectFieldList')>(
        'FrameEditor/dataObjectFieldList'
    );

    const selectedKeys = useMemo(() => {
        if (FrameBaseModule.isFunctionField(value)) {
            setFunctionDesc(value);
            return [value.factory.name.join(NODE_DELIMITER)];
        }
        if (Array.isArray(value) && value.length) {
            return [value.join(NODE_DELIMITER)];
        }

        if (functionDesc) {
            setFunctionDesc(undefined);
        }
        return [];
    }, [FrameBaseModule, functionDesc, value]);

    const source = useMemo<FieldListSource>(() => {
        return new FieldListSource({ constructorType });
    }, [constructorType]);

    const items = useMemo(() => {
        const binding = FrameBaseModule.getSafeFieldType(value)?.name;

        if (!binding) {
            return;
        }

        const fieldType = typeRepository?.getFieldType(binding);
        if (fieldType) {
            const name = value.factory?.name?.join(NODE_DELIMITER) || fieldType.name;
            return new RecordSet({
                keyProperty,
                rawData: [
                    {
                        [keyProperty]: name,
                        TitlePath: fieldType.titlePath,
                        [nodeProperty]: null,
                        [parentProperty]: null,
                    },
                ],
            });
        }
    }, [value]);

    const onItemsChanged = useCallback(
        (items: RecordSet) => {
            const field = items.at(0);
            if (!field) {
                onChange(null);
            }
        },
        [onChange]
    );

    const onSelectionChanged = useCallback(
        (items: RecordSet) => {
            const processField = FieldListModule.processField;

            const field = items.at(0);

            if (!field) {
                onChange(null);
                return;
            }

            const { name, icon, label } = processField(field, {
                typeRepository,
            });

            if (FrameBaseModule.isFunctionField(name)) {
                setFunctionDesc(name);
            }

            let multiple: boolean = false;
            const multipleValue: Record<string, unknown> = { [nameProperty]: name };

            if (!!icon && iconProperty) {
                multiple = true;
                implantValue(multipleValue, iconProperty, icon);
            }

            if (!!label && labelProperty) {
                multiple = true;
                implantValue(multipleValue, labelProperty, label);
            }

            if (multiple) {
                onChange(multipleValue, {
                    multiple: true,
                });
            } else {
                onChange(name);
            }
        },
        [iconProperty, labelProperty, nameProperty, onChange, typeRepository]
    );

    const onShowSelector = useCallback(() => {
        const opener = new FieldListModule.FieldListOpener({
            constructorType,
            typesFilter: fieldType,

            selectHandler: onSelectionChanged,
        });

        opener.open(lookupRef.current);

        return false;
    }, [constructorType, fieldType, onSelectionChanged]);

    const suggestTemplateOptions = useMemo(() => {
        return {
            templateName: 'Controls/suggestPopup:SuggestTemplate',
            templateOptions: {
                displayProperty,
            },
        };
    }, [displayProperty]);

    return (
        <LayoutComponent title={type?.getTitle() || null}>
            <Lookup
                ref={lookupRef}
                selectedKeys={selectedKeys}
                onShowSelector={onShowSelector}
                onItemsChanged={onItemsChanged}
                source={source}
                items={items}
                keyProperty={keyProperty}
                displayProperty={'TitlePath'}
                nodeProperty={nodeProperty}
                parentProperty={parentProperty}
                suggestKeyProperty={keyProperty}
                searchParam={displayProperty}
                onlyLeaf={true}
                suggestTemplate={suggestTemplateOptions}
                multiSelect={false}
                placeholder={rk('Выберите поле')}
                fontSize="3xl"
                inlineHeight="l"
                className="tw-w-full"
            />
            {functionDesc && (
                <ArgumentsEditor
                    value={functionDesc}
                    onChange={onChange}
                    className={'controls-PropertyGrid-NameEditor__selector_offset'}
                    source={source}
                />
            )}
        </LayoutComponent>
    );
}

function implantValue(obj: Record<string, unknown>, path: string[], value: unknown): void {
    const localPath = [...path];
    const lastPathEntry = localPath.pop();

    let current = obj;

    for (const pathEntry of localPath) {
        if (!current[pathEntry]) {
            current[pathEntry] = {};
        }
        current = current[pathEntry] as Record<string, unknown>;
    }

    current[lastPathEntry] = value;
}
