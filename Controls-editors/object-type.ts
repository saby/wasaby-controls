/**
 * Библиотека с базовым редактором объекта
 * @library Controls-editors/object-type
 * @includes ObjectTypeEditor Controls-editors/object-type:ObjectTypeEditor
 * @includes IObjectTypeEditorProps Controls-editors/object-type:IObjectTypeEditorProps
 * @public
 */
export * from './_object-type/Contexts';
export {
    IGroupHeaderProps,
    ObjectTypeEditor,
    IObjectTypeEditorProps,
} from './_object-type/ObjectTypeEditor';
export { getAttributeTitle } from './_object-type/utils/getGroups';
export { useParentTypes } from './_object-type/utils/root';
export { createEditorLoader } from './_object-type/utils/createEditorLoader';
export { loadEditorData } from './_object-type/loadEditorData';
export { useEditorData } from './_object-type/utils/useEditorData';
export { extractAttrsWithoutDefaults } from './_object-type/utils/extractAttrsWithoutDefaults';
export { default as TypeHierarchyPadding } from './_object-type/TypeHierarchyPadding';
export { ObjectTypeFactory } from './_object-type/factory/Factory';
export { IEditorLayoutProps } from './_object-type/AttributeEditor';
export {
    IVariantTypeValue,
    DISCRIMINATOR_FIELD,
    TYPE_VALUE_FIELD,
} from './_object-type/IVariantTypeValue';
export {
    ControlSizeContextProvider,
    IControlSizeContextProviderProps,
} from './_object-type/ControlSizeContext/ControlSizeContextProvider';
export {
    IControlSizeContext,
    ISize,
    useControlSize,
} from './_object-type/ControlSizeContext/ControlSizeContext';
