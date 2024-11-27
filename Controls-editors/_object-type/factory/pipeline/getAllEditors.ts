import {
    BooleanType,
    NumberType,
    ObjectMeta,
    StringType,
    VariantType,
    VariantMeta,
    ObjectType,
} from 'Meta/types';

const BASE_DEFAULT_EDITORS = {
    [VariantType.getId()]: 'Controls-editors/VariantEditor',
    [StringType.getId()]: 'Controls-editors/input:TextEditor',
    [NumberType.getId()]: 'Controls-editors/input:NumberEditor',
    [BooleanType.getId()]: 'Controls-editors/CheckboxEditor:CheckboxEditor',
    [ObjectType.getId()]: 'Controls-editors/ObjectEditor',
};

export function getAllEditors(
    metaType: ObjectMeta<object>,
    defaultEditors?: Record<string, string>
): string[] {
    const editor = metaType.getEditor();

    const result: Set<string> = new Set<string>();

    if (!!editor._moduleName) {
        result.add(editor._moduleName);
    } else {
        const origin = metaType.getOrigin();
        const originModuleName = origin?.meta.getEditor()._moduleName;
        if (!!originModuleName) {
            result.add(originModuleName);
        } else {
            const baseEditor = getBaseEditor(metaType, defaultEditors);
            if (!!baseEditor) {
                result.add(baseEditor);
            }
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

export function getBaseEditor(
    type: ObjectMeta<object>,
    defaultEditors?: Record<string, string>
): string | undefined {
    if (!!defaultEditors) {
        if (!!defaultEditors[type.getId()]) {
            return defaultEditors[type.getId()];
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
