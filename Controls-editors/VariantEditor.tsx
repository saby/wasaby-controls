import { VariantMeta, Meta, NullType, UndefinedType, VoidType, ObjectType } from 'Meta/types';
import ComboBoxSuggest from 'Controls/ComboboxSuggest';
import { IPropertyGridPropertyEditorProps, PropertyGrid } from 'Controls-editors/propertyGrid';
import { RecordSet } from 'Types/collection';
import {
    useMemo,
    useCallback,
    Fragment,
    useContext,
    useState,
    forwardRef,
    ForwardedRef,
} from 'react';
import {
    EditorsHierarchyContext,
    DISCRIMINATOR_FIELD,
    TYPE_VALUE_FIELD,
    IVariantTypeValue,
    PropsValidation,
} from 'Controls-editors/object-type';
import { TypeExpander } from 'Controls-editors/ObjectEditor';
import 'css!Controls-editors/ObjectEditor';
import { Confirmation } from 'Controls/popup';
import { Memory } from 'Types/source';
import { ItemsView as TreeItemsView } from 'Controls/tree';
import { IListViewOptions } from 'Controls/list';
import { Model } from 'Types/entity';
import { ListContainer } from 'Controls/suggestPopup';
import * as rk from 'i18n!Controls-editors';

export interface IVariantEditorProps
    extends Omit<IPropertyGridPropertyEditorProps<IVariantTypeValue>, 'metaType'> {
    metaType: VariantMeta<Record<string, Meta<any>>>;
}

function isEmptyType(type: Meta<unknown>): boolean {
    if (!type) {
        return true;
    }
    const emptyTypes = [NullType, UndefinedType, VoidType];
    return !!emptyTypes.find((emptyType) => type.is(emptyType));
}

const EMPTY_VALUE = {};

interface IType {
    tooltip: string | undefined;
    isParent?: boolean | null;
    parent: string | null;
    title: string | undefined;
    [prop: string]: unknown;
}

interface IVariantTreeProps extends Omit<IListViewOptions, 'onItemClick'> {
    displayProperty: string;
    parentProperty: string;
    nodeProperty: string;
    rawData: IType[];
    onItemClick: (e: Event, item: Model) => void;
}

const VariantTree = forwardRef(function VariantTree1(
    props: IVariantTreeProps,
    ref: ForwardedRef<typeof TreeItemsView>
): JSX.Element {
    const {
        rawData,
        keyProperty,
        displayProperty,
        parentProperty,
        nodeProperty,
        filter,
        searchValue,
        emptyTemplate,
        emptyTemplateOptions,
        markedKey,
        onItemClick,
    } = props;

    const searchParam = Object.keys(filter || {})[0];

    // Во время поиска покажем найденные элементы с их родителями
    const displayItems = useMemo(() => {
        let filtered = rawData;

        if (searchValue && rawData) {
            filtered = [];
            const filteredKeys = new Set<string>();

            for (const item of rawData) {
                const value = item[searchParam];
                const isParent = item[nodeProperty];

                if (!isParent && value) {
                    const includes = (value as string)
                        .toLowerCase()
                        .includes(searchValue.toLowerCase());

                    if (includes) {
                        const parentKey = item[parentProperty] as string;
                        const parent = rawData.find((rawItem) => {
                            return rawItem[keyProperty as string] === parentKey;
                        });

                        if (parent && !filteredKeys.has(parentKey)) {
                            filtered.push(parent);
                            filteredKeys.add(parentKey);
                        }

                        filtered.push(item);
                    }
                }
            }
        }

        return new RecordSet({
            keyProperty,
            rawData: filtered,
        });
    }, [keyProperty, nodeProperty, parentProperty, rawData, searchParam, searchValue]);

    const onItemClickCallback = useCallback(
        (item: Model, event: Event) => {
            if (!item.get(nodeProperty)) {
                onItemClick(event, item);
            }
        },
        [nodeProperty, onItemClick]
    );

    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <TreeItemsView
            ref={ref}
            displayProperty={displayProperty}
            emptyTemplate={emptyTemplate}
            emptyTemplateOptions={emptyTemplateOptions}
            expandByItemClick={true}
            expanderIcon="hiddenNode"
            items={displayItems}
            keyProperty={keyProperty}
            markedKey={markedKey}
            markerVisibility={markedKey ? 'visible' : 'hidden'}
            nodeProperty={nodeProperty}
            onItemClick={onItemClickCallback}
            parentProperty={parentProperty}
            searchValue={searchValue}
        />
    );
});

export const SuggestVariantTreeWrapper = forwardRef(function VariantTree1(
    props: IVariantTreeProps,
    ref: ForwardedRef<typeof TreeItemsView>
): JSX.Element {
    return (
        <ListContainer ref={ref} {...props}>
            <VariantTree {...props} />
        </ListContainer>
    );
});

const PLACEHOLDER = String(rk('Выберите')) + '...';

function TypeSelector({
    metaType,
    onChange,
    value,
    LayoutComponent = Fragment,
}: IVariantEditorProps): JSX.Element {
    const types = metaType.getTypes();
    const readOnly = metaType.isDisabled();
    const invariant = metaType.getInvariant() as string;
    const curType = value?.[DISCRIMINATOR_FIELD];

    const rawData = useMemo(() => {
        const groups = new Set<string>();
        const data: IType[] = [];

        for (const [typeName, type] of Object.entries(types)) {
            const group = type.getGroup();
            let parent = null;

            if (group) {
                parent = group.uid;

                if (!groups.has(group.uid)) {
                    data.push({
                        title: group.name,
                        tooltip: group.name,
                        [invariant]: group.uid,
                        isParent: true,
                        parent: null,
                    });
                }
            }

            data.push({
                title: type.getTitle(),
                tooltip: type.getDescription(),
                [invariant]: typeName,
                parent,
                isParent: null,
            });
        }

        return data;
    }, [types, invariant]);

    const isEmptyValue = Object.keys(value?.[TYPE_VALUE_FIELD] ?? EMPTY_VALUE).length === 0;

    const onChoose = useCallback(
        (item) => {
            if (item.get('isParent')) {
                return;
            }

            const newValue = {
                [TYPE_VALUE_FIELD]: EMPTY_VALUE,
                [DISCRIMINATOR_FIELD]: item.getKey(),
            };

            if (!isEmptyValue) {
                Confirmation.openPopup({
                    markerStyle: 'default',
                    details: rk(
                        'При смене значения, настройки вложенных свойств не сохранятся. Продолжить?'
                    ),
                    buttons: [
                        {
                            caption: rk('Да'),
                            value: true,
                            buttonStyle: 'primary',
                        },
                        {
                            caption: rk('Отмена'),
                            value: undefined,
                        },
                    ],
                }).then((res) => {
                    if (res) {
                        onChange?.(newValue);
                    }
                });
            } else {
                onChange?.(newValue);
            }
        },
        [isEmptyValue, onChange]
    );

    const suggestTemplate = useMemo(() => {
        return {
            templateName: 'Controls-editors/VariantEditor:SuggestVariantTreeWrapper',
            templateOptions: {
                markedKey: curType,
                rawData,
                keyProperty: invariant,
                nodeProperty: 'isParent',
                parentProperty: 'parent',
                displayProperty: 'title',
            },
        };
    }, [invariant, curType, rawData]);

    const source = useMemo(
        () =>
            new Memory({
                keyProperty: invariant,
                data: rawData,
            }),
        [rawData, invariant]
    );

    return (
        <LayoutComponent title={metaType.getTitle()}>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <ComboBoxSuggest
                className={'tw-w-full'}
                keyProperty={invariant}
                selectedKey={curType}
                readOnly={readOnly}
                displayProperty="title"
                searchParam="title"
                source={source}
                suggestTemplate={suggestTemplate}
                placeholder={PLACEHOLDER}
                onChoose={onChoose}
            />
        </LayoutComponent>
    );
}

/**
 * Редактор для вариативного типа данных
 * Для описания вариативного типа используйте {@link Meta/types:VariantMeta}
 * @class Controls-editors/VariantEditor
 * @implements Types/meta:IPropertyEditorProps
 * @see Meta/types:VariantMeta
 * @demo Controls-editors-demo/PropertyGrid/editors/VariantEditor/Index
 * @public
 */
function VariantEditor(props: IVariantEditorProps) {
    const { value, onChange, metaType, validation } = props;

    const changeHandler = useCallback(
        (inputValue) => {
            const newValue = { ...value };
            newValue[TYPE_VALUE_FIELD] = inputValue;
            onChange?.(newValue);
        },
        [onChange, value]
    );
    const hierarchyLevel = useContext(EditorsHierarchyContext);
    const type = metaType.getTypes()[value?.[DISCRIMINATOR_FIELD]];
    const emptyType = useMemo(() => isEmptyType(type), [type]);

    const [expanded, setExpanded] = useState(true);
    const expanderClickHandler = useCallback(() => setExpanded(!expanded), [setExpanded, expanded]);

    return (
        <>
            {!emptyType ? (
                <TypeExpander expanded={expanded} onClick={expanderClickHandler} />
            ) : null}
            <TypeSelector {...props} />
            {expanded && !emptyType ? (
                <EditorsHierarchyContext.Provider value={hierarchyLevel + 1}>
                    <PropertyGrid
                        value={value?.[TYPE_VALUE_FIELD] ?? EMPTY_VALUE}
                        metaType={type ?? ObjectType}
                        validation={validation?.nested as PropsValidation | undefined}
                        onChange={changeHandler}
                        className={'controls-PropertyGrid__editor-innerPg-sameColumns'}
                    />
                </EditorsHierarchyContext.Provider>
            ) : null}
        </>
    );
}

export default VariantEditor;
