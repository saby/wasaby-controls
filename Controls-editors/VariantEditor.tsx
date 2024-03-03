import { VariantMeta, Meta } from 'Meta/types';
import ComboBox from 'Controls/ComboBox';
import {
    IPropertyGridPropertyEditorProps,
    IPropertyGridEditorLayout,
} from 'Controls-editors/propertyGrid';
import { RecordSet } from 'Types/collection';
import { useMemo, useCallback, Fragment } from 'react';
import { PropertyGrid, DefaultEditorLayout } from 'Controls-editors/propertyGrid';
import 'css!Controls-editors/VariantEditor';

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
                onSelectedKeyChanged={selectedKeyChangedCallback}
            />
        </LayoutComponent>
    );
}

function InnerPropertyGridLayout(props: IPropertyGridEditorLayout): JSX.Element {
    const containerPaddings = useMemo(() => {
        return {
            left: 'l',
        };
    }, []);
    return <DefaultEditorLayout {...props} containerPaddings={containerPaddings} />;
}

/**
 * Редактор для вариативного типа данных
 * Для описания вариативного типа используйте {@link Meta/types:VariantMeta}
 * @class Controls-editors/VariantEditor
 * @see Meta/types:VariantMeta
 * @demo Controls-editors-demo/PropertyGrid/editors/VariantEditor
 * @public
 */
function VariantEditor(props: IVariantEditorProps) {
    const onChange = useCallback((value) => props.onChange(value), [props.onChange]);
    const invariant = props.metaType.getInvariant();

    const type = useMemo(
        () => props.metaType.getTypes()[props.value[invariant]],
        [props.metaType, props.value, invariant]
    );

    if (!props.metaType) {
        return null;
    }

    return (
        <>
            <TypeSelector {...props} />
            <PropertyGrid
                value={props.value}
                metaType={type}
                onChange={onChange}
                EditorLayoutComponent={InnerPropertyGridLayout}
                className={'controls-PropertyGrid__editor_variant-innerPg'}
            />
        </>
    );
}

export default VariantEditor;
