import { VariantMeta, Meta, NullType, UndefinedType, VoidType } from 'Meta/types';
import ComboBox from 'Controls/ComboBox';
import { IPropertyGridPropertyEditorProps, PropertyGrid } from 'Controls-editors/propertyGrid';
import { RecordSet } from 'Types/collection';
import { useMemo, useCallback, Fragment, useContext, useState } from 'react';
import { EditorsHierarchyContext } from 'Controls-editors/object-type';
import { TypeExpander } from 'Controls-editors/ObjectEditor';
import 'css!Controls-editors/ObjectEditor';

const DISCRIMINATOR_FIELD = 'element_id';
const TYPE_VALUE_FIELD = 'data';

export interface IVariantTypeValue {
    [DISCRIMINATOR_FIELD]: string;
    [TYPE_VALUE_FIELD]: unknown;
}

export interface IVariantEditorProps extends IPropertyGridPropertyEditorProps<IVariantTypeValue> {
    metaType: VariantMeta<Record<string, Meta<any>>>;
}

function isEmptyType(type: Meta<unknown>): boolean {
    const emptyTypes = [NullType, UndefinedType, VoidType];
    return !!emptyTypes.find((emptyType) => type.is(emptyType));
}

function TypeSelector({
    metaType,
    onChange,
    value,
    LayoutComponent = Fragment,
}: IVariantEditorProps): JSX.Element {
    const types = metaType.getTypes();
    const readOnly = metaType.isDisabled();
    const invariant = metaType.getInvariant();
    const curType = value[DISCRIMINATOR_FIELD];

    const items = useMemo(() => {
        const items = Object.keys(types).map((type) => {
            return {
                title: types[type].getTitle(),
                tooltip: types[type].getDescription(),
                [invariant]: type,
            };
        });
        return new RecordSet({
            rawData: items,
            keyProperty: invariant,
        });
    }, [types, invariant]);

    const selectedKeyChangedCallback = useCallback(
        (selectedKey) => {
            onChange({
                [TYPE_VALUE_FIELD]: types[selectedKey].getDefaultValue(),
                [DISCRIMINATOR_FIELD]: selectedKey,
            });
        },
        [onChange, value, types]
    );

    const comboboxValue = useMemo(() => types[curType].getTitle(), [types, curType, invariant]);

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
    const onChange = useCallback(
        (value) => {
            const newValue = { ...props.value };
            newValue[TYPE_VALUE_FIELD] = value;
            props.onChange(newValue);
        },
        [props.onChange, props.value]
    );
    const hierarchyLevel = useContext(EditorsHierarchyContext);
    const type = props.metaType.getTypes()[props.value[DISCRIMINATOR_FIELD]];
    const emptyType = useMemo(() => isEmptyType(type), [type]);

    const [expanded, setExpanded] = useState(true);
    const expanderClickHandler = useCallback(() => setExpanded(!expanded), [setExpanded, expanded]);

    if (!props.metaType) {
        return null;
    }

    return (
        <>
            {!emptyType ? (
                <TypeExpander expanded={expanded} onClick={expanderClickHandler} />
            ) : null}
            <TypeSelector {...props} />
            {expanded && !emptyType ? (
                <EditorsHierarchyContext.Provider value={hierarchyLevel + 1}>
                    <PropertyGrid
                        value={props.value[TYPE_VALUE_FIELD]}
                        metaType={type}
                        onChange={onChange}
                        className={'controls-PropertyGrid__editor-innerPg-sameColumns'}
                    />
                </EditorsHierarchyContext.Provider>
            ) : null}
        </>
    );
}

export default VariantEditor;
