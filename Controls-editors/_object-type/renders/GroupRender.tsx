import { IComplexEditor, IGroup, ISingleAttributeEditor } from '../utils/getGroupsFromMeta';
import { FC, useMemo } from 'react';
import { IEditorLayoutProps } from '../AttributeEditor';
import {
    IExtendedFieldOption,
    ExtendedFieldsContext,
    IExtendedFieldsContext,
} from '../ExtendedFields';
import { Meta, IComponent } from 'Meta/types';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { SingleAttributeEditor } from './SingleAttributeEditor';
import { ComplexAttributeRender } from './ComplexAttributeRender';
import { PropsValidation } from '../validation';

interface IGroupRenderProps extends IGroup {
    /**
     * Визуальный компонент для декорирования группы
     */
    GroupComponent?: FC<any>;

    /**
     * Свойства объекта
     */
    fullValue: Record<string, unknown>;

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

    extendedItems: IExtendedFieldOption[];

    metaType: Meta<unknown>;

    validation?: PropsValidation;

    storeId: string;
}

/**
 * Компонент отрисовки группы свойств
 * @private
 */
export function GroupRender(props: IGroupRenderProps) {
    const {
        GroupComponent,
        title,
        fullValue,
        GroupHeaderProps,
        editors,
        EditorLayoutComponent,
        GroupHeaderComponent,
        onChange,
        extendedItems,
        metaType,
        id,
        validation,
        storeId,
    } = props;

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
                            fullValue={fullValue}
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
                            fullValue={fullValue}
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
        </>
    );

    const extendedFieldsContextValue = useMemo<IExtendedFieldsContext>(() => {
        return {
            fields: extendedItems?.filter((x) => x.groupId === id),
        };
    }, [extendedItems, id]);

    if (GroupComponent) {
        return (
            <ExtendedFieldsContext.Provider value={extendedFieldsContextValue}>
                <GroupComponent title={title} id={id}>
                    {attributeRender}
                </GroupComponent>
            </ExtendedFieldsContext.Provider>
        );
    }

    const headerVisible = !!title;

    return (
        <>
            {headerVisible ? <GroupHeaderComponent title={title} {...GroupHeaderProps} /> : null}
            {attributeRender}
        </>
    );
}

GroupRender.displayName = 'Controls-editors/object-type:GroupRender';
