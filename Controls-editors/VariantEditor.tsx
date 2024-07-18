import { VariantMeta, Meta } from 'Meta/types';
import ComboBox from 'Controls/ComboBox';
import { IPropertyGridPropertyEditorProps, PropertyGrid } from 'Controls-editors/propertyGrid';
import { RecordSet } from 'Types/collection';
import { useMemo, useCallback, Fragment, useContext, useState } from 'react';
import { EditorsHierarchyContext } from 'Controls-editors/object-type';
import { TypeExpander } from 'Controls-editors/ObjectEditor';
import 'css!Controls-editors/ObjectEditor';

export interface IVariantEditorProps extends IPropertyGridPropertyEditorProps<object> {
    metaType: VariantMeta<Record<string, Meta<any>>>;
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
    const curType = value[invariant];

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
                ...types[selectedKey].getDefaultValue(),
                [invariant]: selectedKey,
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
    const onChange = useCallback((value) => props.onChange(value), [props.onChange]);
    const invariant = props.metaType.getInvariant();
    const hierarchyLevel = useContext(EditorsHierarchyContext);

    const type = useMemo(
        () => props.metaType.getTypes()[props.value[invariant]],
        [props.metaType, props.value, invariant]
    );

    const [expanded, setExpanded] = useState(true);
    const expanderClickHandler = useCallback(() => setExpanded(!expanded), [setExpanded, expanded]);

    if (!props.metaType) {
        return null;
    }

    return (
        <>
            <TypeExpander expanded={expanded} onClick={expanderClickHandler} />
            <TypeSelector {...props} />
            {expanded ? (
                <EditorsHierarchyContext.Provider value={hierarchyLevel + 1}>
                    <PropertyGrid
                        value={props.value}
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
