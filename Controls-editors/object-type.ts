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
export { default as TypeHierarchyPadding } from './_object-type/TypeHierarchyPadding';
export { ObjectTypeFactory, IObjectTypeFactoryArguments } from './_object-type/factory/Factory';
export { IPipelineResult } from './_object-type/factory/pipeline/pipeline';
export { ObjectTypeSlice } from './_object-type/factory/ObjectTypeSlice';
export {
    IMetaTypeEditors,
    IEditorDescription,
} from './_object-type/factory/pipeline/IEditorDesscription';
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
export { ExtendedFields } from './_object-type/ExtendedFields';
export {
    IEditorValidation,
    IValidation,
    PropsValidation,
    ValidationContainer,
    WarningTemplate,
    useEditorPropsValidation,
    useEditorValidation,
    ValidationDescriptor,
} from './_object-type/validation';
export { PROPERTY_GRID_OBJECT_SLICE_NAME } from './_object-type/Constants';
export { IGroupComponentProps, GroupComponent } from './_object-type/renders/GroupComponent';
