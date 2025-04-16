import { IComplexEditor, IGroup, isSingleAttributeEditor } from '../utils/getGroupsFromMeta';
import { FC, useContext, useMemo } from 'react';
import { IEditorLayoutProps } from '../AttributeEditor';
import { ExtendedFieldsContext } from '../ExtendedFieldsNew';
import { ObjectMeta } from 'Meta/types';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { SingleAttributeEditor } from './SingleAttributeEditor';
import { ComplexAttributeRender } from './ComplexAttributeRender';
import { PropsValidation } from '../validation';
import { GroupComponent as InternalGroupComponent, IGroupComponentProps } from './GroupComponent';
import { findGroupById } from 'Controls-editors/_object-type/utils/getExtendedItems';

export interface IGroupRenderProps extends IGroup {
    /**
     * Визуальный компонент для декорирования группы
     */
    GroupComponent: FC<IGroupComponentProps>;

    /**
     * Свойства объекта
     */
    value: Record<string, unknown>;

    /**
     * Дополнительные свойства заголовка группы.
     */
    GroupHeaderProps?: unknown;

    /**
     * Компонент, оборачивающий редакторы, рисующий icon, title, description.
     */
    EditorLayoutComponent?: FC<IEditorLayoutProps>;

    onChange(value: any): void;

    metaType: ObjectMeta;

    validation?: PropsValidation;

    storeId: string;

    nestedGroup: boolean;
}

/**
 * Компонент отрисовки группы свойств
 * @private
 */
export function GroupRender(props: IGroupRenderProps) {
    const {
        GroupComponent,
        title,
        value,
        editors,
        EditorLayoutComponent,
        onChange,
        metaType,
        id,
        validation,
        storeId,
        groups,
        nestedGroup,
    } = props;

    const { fields: extendedItems } = useContext(ExtendedFieldsContext);

    const extendedGroup = useMemo(() => {
        return findGroupById(extendedItems, id);
    }, [extendedItems, id]);

    const filteredEditors = editors.filter((editor) => {
        if (isSingleAttributeEditor(editor)) {
            return !extendedGroup?.attributes.some(
                (extItem) => extItem.name === editor.name && !extItem.visible
            );
        } else {
            return true;
        }
    });

    const attributeRender = (
        <>
            {filteredEditors.map((x, index) => {
                const LoadedComponent = loadSync<FC>(x.Component);

                if (isSingleAttributeEditor(x)) {
                    return (
                        <SingleAttributeEditor
                            key={x.name}
                            Component={LoadedComponent}
                            fullValue={value}
                            metaType={x.metaType}
                            name={x.name}
                            EditorLayoutComponent={EditorLayoutComponent}
                            defaultValue={x.defaultValue}
                            editorProps={x.editorProps}
                            validation={validation?.[x.name]}
                            onChange={onChange}
                            storeId={storeId}
                        />
                    );
                } else {
                    const complexAttributeEditorDescription = x as IComplexEditor;
                    const key = `editor-index-${index}`;
                    return (
                        <ComplexAttributeRender
                            key={key}
                            attributes={complexAttributeEditorDescription.attributes}
                            fullValue={value}
                            onChange={onChange}
                            EditorLayoutComponent={EditorLayoutComponent}
                            Component={LoadedComponent}
                            editorProps={complexAttributeEditorDescription.editorProps}
                            defaultValue={complexAttributeEditorDescription.defaultValue}
                            fullMetaType={metaType}
                            validation={validation}
                            storeId={storeId}
                        />
                    );
                }
            })}
            {groups?.map((group) => {
                return (
                    <GroupRender
                        key={`key_${group.id}`}
                        {...group}
                        value={value}
                        metaType={metaType}
                        GroupHeaderProps={undefined}
                        EditorLayoutComponent={EditorLayoutComponent}
                        onChange={onChange}
                        GroupComponent={InternalGroupComponent}
                        validation={validation}
                        storeId={storeId}
                        nestedGroup={true}
                    />
                );
            })}
        </>
    );

    if (extendedGroup !== undefined && !extendedGroup.visible) {
        return null;
    }

    if (filteredEditors.length === 0 && (!groups || groups.length === 0)) {
        return null;
    }

    return (
        <GroupComponent
            title={title}
            id={id}
            expandable={!nestedGroup}
            nestedGroup={nestedGroup}
            extended={extendedGroup?.extended ?? false}
        >
            {attributeRender}
        </GroupComponent>
    );
}

GroupRender.displayName = 'Controls-editors/object-type:GroupRender';
