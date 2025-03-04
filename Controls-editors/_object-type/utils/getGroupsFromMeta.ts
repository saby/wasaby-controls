import { ObjectMeta, Meta } from 'Meta/types';
import { defaultSort } from './defaultSort';
import { IEditorComponent } from '../factory/Factory';
import { logger } from 'Application/Env';

/**
 * Описание группы свойств
 * @private
 */
export interface IGroup {
    /**
     * Идентификатор группы
     */
    id: string | undefined;

    /**
     * Название группы
     */
    title: string | undefined;

    /**
     * Список редакторов, котоыре нужно построить в группе
     */
    editors: IEditorTypeDescription[];
}

export type IEditorTypeDescription = IComplexEditor | ISingleAttributeEditor;

/**
 * Редактор, который нужно отрисовать
 * @private
 */
export interface IEditor {
    /**
     * Реакт компонент редактора, который нужно отрисовать
     */
    Component: string;

    /**
     * Дефолтное значение редактора
     */
    defaultValue?: unknown | Record<string, unknown>;

    /**
     * Опции редактора
     */
    editorProps?: Record<string, unknown>;
}

/**
 * Редактор, который нужно отрисовать
 * @private
 */
export interface IComplexEditor extends IEditor {
    /**
     * Список атрибутов для которых строится редактор
     */
    attributes: Record<string, Meta<unknown>>;
}

/**
 * Описание свойства
 */
export interface IAttribute {
    /**
     * Название свойства
     */
    name: string;

    /**
     * Метатип свойств
     */
    metaType: Meta<unknown>;
}

/**
 * Описание редактора для одного свойства
 */
export interface ISingleAttributeEditor extends IEditor, IAttribute {}

export type IGetEditor = (meta: Meta<unknown>) => IEditorComponent;

/**
 * Получение списка групп по метатипу
 * @private
 */
export function getGroupsFromMeta(meta: ObjectMeta<unknown>, getEditor: IGetEditor): IGroup[] {
    const result: IGroup[] = [];

    const defaultValueFromAllMeta = meta.getDefaultValue();

    let properties: IProperty[] = [];
    for (const [name, metaType] of Object.entries(meta.getProperties())) {
        if (!metaType || metaType.isHidden()) {
            continue;
        }

        properties.push({
            name,
            metaType,
        });
    }
    properties = properties.sort((a, b) => defaultSort(a.metaType, b.metaType));

    const complexEditors = meta.getComplexEditors() ?? [];

    for (const property of properties) {
        const groupInfo = property.metaType.getGroup();
        if (!result.some((x) => x.id === groupInfo?.uid)) {
            const propertiesByGroup = getPropertiesByGroupId(groupInfo?.uid, properties);

            const editors: IEditorTypeDescription[] = [];

            while (propertiesByGroup.length > 0) {
                const propertyInGroup = propertiesByGroup.shift();
                if (!propertyInGroup) {
                    break;
                }

                const complexEditorDescription = complexEditors.find((complexEditor) =>
                    complexEditor.properties.includes(propertyInGroup.name)
                );
                if (!!complexEditorDescription) {
                    const attributes: Record<string, Meta<unknown>> = {};

                    const defaultValue: Record<string, unknown> = {};
                    for (const propertyNameOfEditor of complexEditorDescription.properties) {
                        const property =
                            propertiesByGroup.find((x) => x.name === propertyNameOfEditor) ??
                            (propertyNameOfEditor === propertyInGroup.name
                                ? propertyInGroup
                                : undefined);

                        if (!!property) {
                            defaultValue[propertyNameOfEditor] =
                                property.metaType.getDefaultValue() ??
                                defaultValueFromAllMeta?.[property.name];

                            attributes[propertyNameOfEditor] = property.metaType;

                            const propertyIndex = propertiesByGroup.findIndex(
                                (x) => x === property
                            );
                            if (propertyIndex !== -1) {
                                propertiesByGroup.splice(propertyIndex, 1);
                            }
                        }
                    }

                    editors.push({
                        Component: complexEditorDescription.name,
                        editorProps: undefined,
                        attributes,
                        defaultValue,
                    });
                } else {
                    const possibleOriginMeta = propertyInGroup.metaType.getOrigin()?.meta;
                    const originEditor = !!possibleOriginMeta
                        ? getEditor(possibleOriginMeta)
                        : undefined;
                    if (!!possibleOriginMeta && originEditor) {
                        // У метатипа есть origin мета и редактор.
                        // Возможно есть еще свойства объекта, которые будут редактироваться данным редактором и принадлежать общему типу
                        const propertiesByOrigin = getPropertiesByOriginMeta(
                            possibleOriginMeta,
                            propertiesByGroup
                        );

                        const attributes: Record<string, Meta<unknown>> = {
                            [propertyInGroup.name]: propertyInGroup.metaType,
                        };

                        propertiesByOrigin.forEach((propertyByOrigin) => {
                            const propertyIndex = propertiesByGroup.findIndex(
                                (x) => x.name === propertyByOrigin.name
                            );
                            if (propertyIndex !== -1) {
                                attributes[propertyByOrigin.name] =
                                    propertiesByGroup[propertyIndex].metaType;
                                propertiesByGroup.splice(propertyIndex, 1);
                            }
                        });

                        editors.push({
                            Component: originEditor.Component,
                            editorProps: originEditor.editorProps,
                            attributes,
                            defaultValue: possibleOriginMeta.getDefaultValue(),
                        });
                    } else {
                        const editorForProperty = getEditor(propertyInGroup.metaType);

                        if (!editorForProperty) {
                            logger.error(
                                `Controls-editors/object-type: Отсутствует компонент редактора для атрибута [${propertyInGroup.name}], указанного на мета-типе : `,
                                meta
                            );
                            continue;
                        }

                        editors.push({
                            Component: editorForProperty.Component,
                            editorProps: editorForProperty.editorProps,
                            name: propertyInGroup.name,
                            metaType: propertyInGroup.metaType,
                            defaultValue:
                                propertyInGroup.metaType.getDefaultValue() ??
                                defaultValueFromAllMeta?.[propertyInGroup.name],
                        });
                    }
                }
            }

            result.push({
                id: groupInfo?.uid,
                title: groupInfo?.name,
                editors,
            });
        }
    }

    return result;
}

interface IProperty {
    name: string;
    metaType: Meta<unknown>;
}

/**
 * Получение списка свойств по идентификатору группы
 * @param groupId
 * @param properties
 * @private
 */
function getPropertiesByGroupId(groupId: string | undefined, properties: IProperty[]): IProperty[] {
    return properties.filter((x) => x.metaType.getGroup()?.uid === groupId);
}

function getPropertiesByOriginMeta(
    originMeta: Meta<unknown>,
    properties: IProperty[]
): IProperty[] {
    return properties.filter((x) => x.metaType.getOrigin()?.meta === originMeta);
}
