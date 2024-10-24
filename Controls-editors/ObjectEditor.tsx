import { IPropertyGridPropertyEditorProps, PropertyGrid } from 'Controls-editors/propertyGrid';
import {
    Fragment,
    useContext,
    ReactElement,
    MouseEventHandler,
    useState,
    useCallback,
} from 'react';
import { EditorsHierarchyContext, TypeHierarchyPadding } from 'Controls-editors/object-type';
import 'css!Controls-editors/ObjectEditor';
import { Icon } from 'Controls/icon';
import * as rk from 'i18n!Controls-editors';
import { useSlice } from 'Controls-DataEnv/context';

export interface IObjectEditorProps extends IPropertyGridPropertyEditorProps<object> {}

interface IExpanderProps {
    expanded: boolean;
    onClick: MouseEventHandler;
}

function TypeExpanderHierarchyPaddingWrapper(props: { children: ReactElement }): ReactElement {
    return (
        <div className={'controls-PropertyGrid__typeExpander_relative-wrapper'}>
            <div className={'controls-PropertyGrid__typeExpander_absolute-wrapper'}>
                <TypeHierarchyPadding />
                {props.children}
            </div>
        </div>
    );
}

function Expander({ expanded, onClick }: IExpanderProps): ReactElement {
    return (
        <div className={'controls-PropertyGrid__typeExpander-wrapper'}>
            <Icon
                icon={expanded ? 'icon-MarkExpandBold' : 'icon-MarkRightBold'}
                iconStyle={'label'}
                iconSize={'s'}
                onClick={onClick}
                className={'controls-PropertyGrid__typeExpander'}
                tooltip={rk(expanded ? 'Свернуть' : 'Развернуть')}
            />
        </div>
    );
}

export function TypeExpander(props: IExpanderProps): ReactElement {
    const hierarchyLevel = useContext(EditorsHierarchyContext);

    if (hierarchyLevel) {
        return (
            <TypeExpanderHierarchyPaddingWrapper>
                <Expander {...props} />
            </TypeExpanderHierarchyPaddingWrapper>
        );
    } else {
        return <Expander {...props} />;
    }
}

/**
 * Редактор для объектного типа
 * Для описания объектного типа используйте {@link Meta/types:ObjectMeta}
 * @class Controls-editors/ObjectEditor
 * @implements Types/meta:IPropertyEditorProps
 * @see Meta/types:VariantMeta
 * @demo Controls-editors-demo/PropertyGrid/editors/ObjectEditor/Index
 * @public
 */
export default function ObjectEditor({
    onChange,
    metaType,
    value,
    LayoutComponent = Fragment,
}: IObjectEditorProps) {
    const hierarchyLevel = useContext(EditorsHierarchyContext);
    const [expanded, setExpanded] = useState(true);
    const expanderClickHandler = useCallback(() => setExpanded(!expanded), [expanded, setExpanded]);

    const slice = useSlice('MetaTypeEditors');

    if (!metaType) {
        return null;
    }

    return (
        <>
            <TypeExpander expanded={expanded} onClick={expanderClickHandler} />
            <LayoutComponent title={metaType.getTitle()} />
            {expanded ? (
                <EditorsHierarchyContext.Provider value={hierarchyLevel + 1}>
                    <PropertyGrid
                        value={value}
                        metaType={metaType}
                        onChange={onChange}
                        EditorLayoutComponent={LayoutComponent}
                        storeId={!!slice ? 'MetaTypeEditors' : undefined}
                        className={'controls-PropertyGrid__editor-innerPg-sameColumns'}
                    />
                </EditorsHierarchyContext.Provider>
            ) : null}
        </>
    );
}
