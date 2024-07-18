import { Fragment, useCallback, useEffect, useMemo, useLayoutEffect } from 'react';
import { Model, getValueType, adapter } from 'Types/entity';
import { SbisService } from 'Types/source';
import { FIELD_LIST_ENDPOINT, NODE_DELIMITER } from 'Frame-DataEnv/dataFactory';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { Input as Lookup, ItemTemplate } from 'Controls/lookup';

interface INameSelectorProps extends IPropertyGridPropertyEditorProps<string[]> {
    fieldType: string[];
}

// тип объекта должен получаться из типа констурктора в репозитории типов
const OBJECT_TYPE = 'Candidate';

/**
 * Редактор выбора привязки к полю прикладного объекта системы
 * @public
 */
function DataObjectFieldSelector(props: INameSelectorProps) {
    const { onChange, value, type, LayoutComponent = Fragment, fieldType } = props;

    const { keyProperty, parentProperty, nodeProperty, displayProperty, contract, method } =
        FIELD_LIST_ENDPOINT;

    const source = useMemo<SbisService>(
        () => createFieldListSource(keyProperty, contract, method),
        [keyProperty, contract, method]
    );

    const suggestSource = useMemo<SbisService>(
        () => createFieldListSource(keyProperty, contract, method),
        [keyProperty, contract, method]
    );

    useLayoutEffect(() => {
        const handler = (eventObject: Event, name: string, args: Record<string, unknown>) => {
            if (name === method) {
                const filter = args.Фильтр as Model;
                appendFilter(filter, {
                    ObjectName: OBJECT_TYPE,
                    Fields: filter.get('ID'),
                });
            }
            eventObject.setResult(args);
        };
        source.subscribe('onBeforeProviderCall', handler);
        return () => {
            source.unsubscribe('onBeforeProviderCall', handler);
        };
    }, [source, method]);

    useLayoutEffect(() => {
        const handler = (eventObject: Event, name: string, args: Record<string, unknown>) => {
            if (name === method) {
                const filter = args.Фильтр as Model;
                appendFilter(filter, {
                    ObjectName: OBJECT_TYPE,
                    MetaAttributes: {
                        title: filter.get('Title'),
                    },
                    Types: capitalizeTypeNames(fieldType),
                    Разворот: 'C разворотом',
                });
            }
            eventObject.setResult(args);
        };
        suggestSource.subscribe('onBeforeProviderCall', handler);
        return () => {
            suggestSource.unsubscribe('onBeforeProviderCall', handler);
        };
    }, [suggestSource, method]);

    const selectedKeys = useMemo(() => {
        if (Array.isArray(value)) {
            return [value.join(NODE_DELIMITER)];
        }
        return [];
    }, [value]);

    const onSelectedKeysChanged = useCallback(
        (keys: string[]) => {
            if (!keys.length) {
                return onChange(null);
            }
            const [id] = keys;
            const path = id.split(NODE_DELIMITER);
            onChange(path);
        },
        [onChange]
    );

    const selectorTemplateOptions = useMemo(() => {
        return {
            templateName: 'Controls-editors/properties:SelectorStackTemplate',
            templateOptions: {
                types: fieldType,
                objectName: OBJECT_TYPE,
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
                onSelectedKeysChanged={onSelectedKeysChanged}
                source={source}
                suggestSource={suggestSource}
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
                fontSize="3xl"
                inlineHeight="l"
                className="tw-w-full"
            />
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

export function createFieldListSource(
    keyProperty: string,
    contract: string,
    method: string
): SbisService {
    return new SbisService({
        keyProperty,
        endpoint: {
            contract,
            address: '/service/',
        },
        binding: {
            query: method,
        },
    });
}

export function capitalizeTypeNames(types: string[]): string[] {
    return types.map((typeName) => typeName.charAt(0).toUpperCase() + typeName.slice(1));
}

export { DataObjectFieldSelector };
