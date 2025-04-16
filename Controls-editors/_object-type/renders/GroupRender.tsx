import { IComplexEditor, IGroup, ISingleAttributeEditor } from '../utils/getGroupsFromMeta';
import { FC, useContext, useMemo } from 'react';
import { IEditorLayoutProps } from '../AttributeEditor';
import { ExtendedFieldsContext, IExtendedFieldsContext } from '../ExtendedFields';
import { Meta, IComponent } from 'Meta/types';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { SingleAttributeEditor } from './SingleAttributeEditor';
import { ComplexAttributeRender } from './ComplexAttributeRender';
import { PropsValidation } from '../validation';
import { GroupComponent as InternalGroupComponent, IGroupComponentProps } from './GroupComponent';

export interface IGroupRenderProps extends IGroup {
    /**
     * Визуальный компонент для декорирования группы
     */
    GroupComponent?: FC<IGroupComponentProps>;

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
    EditorLayoutComponent?: IComponent<IEditorLayoutProps>;

    GroupHeaderComponent: IComponent<unknown>;

    onChange(value: any): void;

    metaType: Meta<unknown>;

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
        GroupHeaderProps,
        editors,
        EditorLayoutComponent,
        GroupHeaderComponent,
        onChange,
        metaType,
        id,
        validation,
        storeId,
        groups,
        nestedGroup,
    } = props;

    const { fields: extendedItems } = useContext(ExtendedFieldsContext);

    const attributeRender = (
        <>
            {editors.map((x, index) => {
                const LoadedComponent = loadSync(x.Component);
                const name = (x as ISingleAttributeEditor).name;

                if (typeof name === 'string') {
                    const singleAttributeEditorDescription = x as ISingleAttributeEditor;

                    if (extendedItems.some((extItem) => extItem.id === name)) {
                        return null;
                    }

                    return (
                        <SingleAttributeEditor
                            key={name}
                            Component={LoadedComponent}
                            fullValue={value}
                            metaType={singleAttributeEditorDescription.metaType}
                            name={name}
                            EditorLayoutComponent={EditorLayoutComponent}
                            defaultValue={singleAttributeEditorDescription.defaultValue}
                            editorProps={singleAttributeEditorDescription.editorProps}
                            validation={validation?.[name]}
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
                        fullValue={value}
                        metaType={metaType}
                        GroupHeaderProps={undefined}
                        EditorLayoutComponent={EditorLayoutComponent}
                        EditorLayoutProps={undefined}
                        onChange={onChange}
                        GroupComponent={InternalGroupComponent}
                        GroupHeaderComponent={undefined}
                        validation={validation}
                        storeId={storeId}
                        nestedGroup={true}
                    />
                );
            })}
        </>
    );

    const extendedFieldsContextValue = useMemo<IExtendedFieldsContext>(() => {
        return {
            fields: extendedItems?.filter((x) => x.groupId === id),
        };
    }, [extendedItems, id]);

    if (editors.length === 0 && (!groups || groups.length === 0)) {
        return null;
    }

    if (GroupComponent) {
        return (
            <ExtendedFieldsContext.Provider value={extendedFieldsContextValue}>
                <GroupComponent
                    title={title}
                    id={id}
                    expandable={!nestedGroup}
                    nestedGroup={nestedGroup}
                >
                    {attributeRender}
                </GroupComponent>
            </ExtendedFieldsContext.Provider>
        );
    }

    const headerVisible = !!title && GroupHeaderComponent;

    return (
        <>
            {headerVisible ? (
                <GroupHeaderComponent title={title} {...(GroupHeaderProps ?? {})} />
            ) : null}
            {attributeRender}
        </>
    );
}

GroupRender.displayName = 'Controls-editors/object-type:GroupRender';
