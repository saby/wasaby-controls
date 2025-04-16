import { ObjectMeta, Meta } from 'Meta/types';
import { defaultSort } from './defaultSort';
import { IEditorComponent } from '../factory/IEditorComponent';
import { logger } from 'Application/Env';
import { INavigationItem } from '../factory/pipeline/INavigationItem';

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

    /**
     * Дочерние группы
     */
    groups?: IGroup[];
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

function getEditorsByProperties(
    propertiesByGroup: IProperty[],
    complexEditors: IComplexEditor[],
    defaultValueFromAllMeta: never,
    getEditor: (meta: Meta<unknown>) => IEditorComponent,
    meta: ObjectMeta<unknown>
) {
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
                    (propertyNameOfEditor === propertyInGroup.name ? propertyInGroup : undefined);

                if (!!property) {
                    defaultValue[propertyNameOfEditor] =
                        property.metaType.getDefaultValue() ??
                        defaultValueFromAllMeta?.[property.name];

                    attributes[propertyNameOfEditor] = property.metaType;

                    const propertyIndex = propertiesByGroup.findIndex((x) => x === property);
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
            const originEditor = !!possibleOriginMeta ? getEditor(possibleOriginMeta) : undefined;
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

    return editors;
}

/**
 * Получение списка групп по метатипу
 * @private
 */
export function getGroupsFromMeta(
    meta: ObjectMeta<unknown>,
    getEditor: IGetEditor,
    navigation: INavigationItem[] | undefined,
    useCategories: boolean
): IGroup[] {
    const groups: IGroup[] = [];

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

    if (!navigation || navigation.length === 0) {
        return [
            {
                editors: getEditorsByProperties(
                    properties,
                    complexEditors,
                    defaultValueFromAllMeta,
                    getEditor,
                    meta
                ),
                title: undefined,
                id: undefined,
            },
        ];
    }

    navigation.forEach((navigationItem) => {
        const groupInfo = {
            uid: navigationItem.id,
            name: navigationItem.name,
        };

        if (!groups.some((x) => x.id === groupInfo?.uid)) {
            const propertiesByGroup = useCategories
                ? getPropertiesByCategory(groupInfo?.uid, properties)
                : getPropertiesByGroupId(groupInfo?.uid, properties);

            const editors = getEditorsByProperties(
                propertiesByGroup,
                complexEditors,
                defaultValueFromAllMeta,
                getEditor,
                meta
            );

            groups.push({
                id: groupInfo?.uid,
                title: groupInfo?.name,
                editors,
            });
        }
    });

    const itemMap = new Map<string | undefined, IGroup>();
    groups.forEach((item) => {
        itemMap.set(item.id, item);
    });

    const hieararchicalGroups: IGroup[] = [];
    groups.forEach((groupItem) => {
        const hierarchicalItem = itemMap.get(groupItem.id);
        if (!hierarchicalItem) {
            throw new Error('Group items not found');
        }
        const navigationItem = navigation.find((x) => x.id === groupItem.id);
        if (!navigationItem?.parent) {
            // This is a root item
            hieararchicalGroups.push(groupItem);
        } else {
            // Find the parent and add this item to its children
            const parent = itemMap.get(navigationItem.parent);
            if (parent) {
                if (!parent.groups) {
                    parent.groups = [];
                }
                parent.groups.push(hierarchicalItem);
            }
        }
    });

    return hieararchicalGroups;
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

function getPropertiesByCategory(
    category: string | undefined,
    properties: IProperty[]
): IProperty[] {
    return properties.filter((x) => x.metaType.getCategory() === category);
}

function getPropertiesByOriginMeta(
    originMeta: Meta<unknown>,
    properties: IProperty[]
): IProperty[] {
    return properties.filter((x) => x.metaType.getOrigin()?.meta === originMeta);
}
