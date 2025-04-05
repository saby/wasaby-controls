import {
    BooleanType,
    NumberType,
    ObjectMeta,
    StringType,
    VariantType,
    VariantMeta,
    ObjectType,
    ArrayType,
    EnumType,
} from 'Meta/types';
import { IEditorDescription } from './IEditorDesscription';

const BASE_DEFAULT_EDITORS = {
    [VariantType.getId()]: 'Controls-editors/VariantEditor',
    [StringType.getId()]: 'Controls-editors/input:TextEditor',
    [NumberType.getId()]: 'Controls-editors/input:NumberEditor',
    [BooleanType.getId()]: 'Controls-editors/CheckboxEditor:CheckboxEditor',
    [ObjectType.getId()]: 'Controls-editors/ObjectEditor',
    [ArrayType.getId()]: 'Controls-editors/recordset:Editor',
    [EnumType.getId()]: 'Controls-editors/dropdown:CollectionEnumEditor',
};

export function getAllEditors(
    metaType: ObjectMeta<object>,
    defaultEditors?: Record<string, string>
): string[] {
    const editor = getEditorModuleName(metaType);

    const result: Set<string> = new Set<string>();

    if (!!editor) {
        result.add(editor);
    } else {
        const origin = metaType.getOrigin();
        const originModuleName = getEditorModuleName(origin?.meta);
        if (!!originModuleName) {
            result.add(originModuleName);
        }
        const baseEditor = getBaseEditor(metaType, defaultEditors);
        if (!!baseEditor) {
            result.add(baseEditor);
        }
    }

    if (metaType.is(VariantType)) {
        Object.values((metaType as VariantMeta).getTypes()).forEach((variantType) => {
            getAllEditors(variantType, defaultEditors).forEach((propertyEditor) => {
                result.add(propertyEditor);
            });
        });
    }

    if (!!metaType.getProperties) {
        Object.values(metaType.getProperties()).forEach((propertyMetaType) => {
            const propertyEditors = getAllEditors(propertyMetaType, defaultEditors);
            propertyEditors.forEach((propertyEditor) => {
                result.add(propertyEditor);
            });
        });
    }

    return Array.from(result);
}

export function getEditorModuleName(metaType: ObjectMeta<object> | undefined): string | undefined {
    const editor = metaType?.getEditor();

    return editor?._moduleName ?? editor?.loader?._moduleName;
}

export function getBaseEditor(
    type: ObjectMeta<object>,
    defaultEditors?: Record<string, string>
): string | undefined {
    if (!!defaultEditors) {
        const possibleDefaultEditor = defaultEditors[type.getId()];
        if (!!possibleDefaultEditor) {
            const componentName = getComponentName(possibleDefaultEditor);
            if (!!componentName) {
                return componentName;
            }
        }

        for (const key of Object.keys(defaultEditors)) {
            if (type.is({ id: key })) {
                return defaultEditors[key];
            }
        }
    }

    for (const key of Object.keys(BASE_DEFAULT_EDITORS)) {
        if (type.is({ id: key })) {
            return BASE_DEFAULT_EDITORS[key];
        }
    }

    return undefined;
}

function getComponentName(editorDescription: string | IEditorDescription): string | undefined {
    if (typeof editorDescription === 'string') {
        return editorDescription;
    }
    if (!!editorDescription.editor) {
        return editorDescription.editor;
    }
}
