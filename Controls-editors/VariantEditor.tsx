import { VariantMeta, Meta, NullType, UndefinedType, VoidType, ObjectType } from 'Meta/types';
import ComboBox from 'Controls/ComboBox';
import { IPropertyGridPropertyEditorProps, PropertyGrid } from 'Controls-editors/propertyGrid';
import { RecordSet } from 'Types/collection';
import { useMemo, useCallback, Fragment, useContext, useState } from 'react';
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
import * as rk from 'i18n!Controls-editors';

export interface IVariantEditorProps extends IPropertyGridPropertyEditorProps<IVariantTypeValue> {
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
    isParent?: boolean;
    parent: string | null;
    title: string | undefined;
    [prop: string]: unknown;
}

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

    const items = useMemo(() => {
        const groups = new Set<string>();
        const rawData: IType[] = [];

        for (const [typeName, type] of Object.entries(types)) {
            const group = type.getGroup();
            let parent = null;

            if (group) {
                parent = group.uid;

                if (!groups.has(group.uid)) {
                    rawData.push({
                        title: group.name,
                        tooltip: group.name,
                        [invariant]: group.uid,
                        isParent: true,
                        parent: null,
                    });
                }
            }

            rawData.push({
                title: type.getTitle(),
                tooltip: type.getDescription(),
                [invariant]: typeName,
                parent,
                isParent: false,
            });
        }

        return new RecordSet({
            rawData,
            keyProperty: invariant,
        });
    }, [types, invariant]);

    const isEmptyValue = Object.keys(value?.[TYPE_VALUE_FIELD] ?? EMPTY_VALUE).length === 0;

    const selectedKeyChangedCallback = useCallback(
        (selectedKey) => {
            const item = items.getRecordById(selectedKey);

            if (item.get('isParent')) {
                return;
            }

            const newValue = {
                [TYPE_VALUE_FIELD]: EMPTY_VALUE,
                [DISCRIMINATOR_FIELD]: selectedKey,
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
        [onChange, isEmptyValue]
    );

    const comboboxValue = !!curType ? types[curType]?.getTitle() : undefined;

    return (
        <LayoutComponent title={metaType.getTitle()}>
            <ComboBox
                keyProperty={invariant}
                displayProperty={'title'}
                selectedKey={curType}
                value={comboboxValue}
                items={items}
                readOnly={readOnly}
                onSelectedKeyChanged={selectedKeyChangedCallback}
                nodeProperty="isParent"
                parentProperty="parent"
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
