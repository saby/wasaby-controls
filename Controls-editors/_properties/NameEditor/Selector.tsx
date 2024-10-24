import * as rk from 'i18n!Controls-editors';
import { Fragment, useCallback, useContext, useMemo, useState } from 'react';
import { Model, getValueType } from 'Types/entity';
import { SbisService } from 'Types/source';
import { RecordSet } from 'Types/collection';
import {
    FIELD_LIST_ENDPOINT,
    NODE_DELIMITER,
    TYPE_REPOSITORY_SLICE,
    ITypeRepository,
    FieldListSource,
    BaseDataTypes,
    IDataObjectFieldType,
} from 'Frame-DataEnv/dataFactory';
import { useSlice } from 'Controls-DataEnv/context';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { Input as Lookup } from 'Controls/lookup';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { ArgumentsEditor } from './_arguments/ArgumentsEditor';
import { TDataFieldDefinition } from 'Frame/base';
import { ObjectTypeEditorValueContext } from 'Controls-editors/object-type';
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
function DataObjectFieldSelector(props: INameSelectorProps) {
    const {
        onChange,
        value,
        type,
        LayoutComponent = Fragment,
        fieldType,
        labelProperty,
        iconProperty,
        name,
    } = props;
    const typeRepository = useSlice<ITypeRepository>(TYPE_REPOSITORY_SLICE);
    const constructorType = typeRepository?.getConstructorType();

    const pgValueContext = useContext(ObjectTypeEditorValueContext);

    const [functionDesc, setFunctionDesc] = useState();

    const { keyProperty, parentProperty, nodeProperty, displayProperty, contract, method } =
        FIELD_LIST_ENDPOINT;

    const FrameBaseModule = loadSync<typeof import('Frame/base')>('Frame/base');

    const source = useMemo<SbisService>(
        () => createFieldListSource(constructorType),
        [keyProperty, contract, method]
    );

    const objectNames = useMemo(() => {
        return typeRepository?.getDataObjectsName() || [];
    }, [typeRepository]);

    const selectedKeys = useMemo(() => {
        if (FrameBaseModule.isFunctionField(value)) {
            setFunctionDesc(value);
            return [value.factory.name.join(NODE_DELIMITER)];
        }
        if (Array.isArray(value) && value.length) {
            return [value.join(NODE_DELIMITER)];
        }
        return [];
    }, [value]);

    const onItemsChanged = useCallback(
        (items: RecordSet) => {
            const field = items.at(0);

            if (!field) {
                onChange(null);
                return;
            }

            if (field.get('Type') === BaseDataTypes.Function) {
                const fieldDesc = typeRepository.createFieldType(field, true);
                const functionDesc = {
                    name: fieldDesc.bind,
                    type: fieldDesc.type,
                    factory: {
                        name: field.get('ID').split(NODE_DELIMITER),
                        arguments: null,
                        result: null,
                    },
                };
                setFunctionDesc(functionDesc);
                onValueChange(functionDesc, field);
            } else {
                typeRepository.createFieldType(field);
                onValueChange(field.get('ID').split(NODE_DELIMITER), field);
            }
        },
        [onChange]
    );

    /**
     * Выставляет значение зависимых свойств иконки и заголовка
     */
    const onValueChange = useCallback(
        (value: any, field: Model<IDataObjectFieldType>) => {
            const icon = field.get('Icon');
            const label = field.get('DisplayText');
            let multiple: boolean = false;
            const multipleValue = { [name]: value };

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
                onChange(value);
            }
        },
        [pgValueContext, labelProperty, iconProperty]
    );

    const selectorTemplateOptions = useMemo(() => {
        return {
            templateName: 'Controls-editors/properties:SelectorStackTemplate',
            templateOptions: {
                types: fieldType,
                objectNames,
                constructorType,
            },
            popupOptions: {
                width: 500,
            },
        };
    }, [fieldType]);

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
                selectedKeys={selectedKeys}
                onItemsChanged={onItemsChanged}
                source={source}
                keyProperty={keyProperty}
                displayProperty={'TitlePath'}
                nodeProperty={nodeProperty}
                parentProperty={parentProperty}
                suggestKeyProperty={keyProperty}
                searchParam={displayProperty}
                onlyLeaf={true}
                selectorTemplate={selectorTemplateOptions}
                suggestTemplate={suggestTemplateOptions}
                multiSelect={false}
                placeholder={rk('Выберите поле или метод')}
                fontSize="3xl"
                inlineHeight="l"
                className="tw-w-full"
            />
            {functionDesc && (
                <ArgumentsEditor
                    value={functionDesc}
                    onChange={onChange}
                    className={'controls-PropertyGrid-NameEditor__selector_offset'}
                />
            )}
        </LayoutComponent>
    );
}

export function appendFilter(filterModel: Model, filter: Record<string, unknown>): Model {
    for (const [key, value] of Object.entries(filter)) {
        if (!filterModel.has(key)) {
            const fieldType = getValueType(value);
            filterModel.addField(
                typeof fieldType === 'string'
                    ? { name: key, type: fieldType }
                    : { name: key, ...fieldType }
            );
        }

        filterModel.set(key, value);
    }

    return filterModel;
}

export function createFieldListSource(constructorType: unknown): SbisService {
    return new FieldListSource({
        constructorType,
    });
}

export function capitalizeTypeNames(types: string[]): string[] {
    return types
        .filter((typeName) => !!typeName)
        .map((typeName) => typeName.charAt(0).toUpperCase() + typeName.slice(1));
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

export { DataObjectFieldSelector };
