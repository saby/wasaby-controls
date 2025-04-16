import { ObjectMeta } from 'Meta/types';
import { IGroup, isSingleAttributeEditor, IEditorTypeDescription } from './getGroupsFromMeta';
import { isEqual } from 'Types/object';

export interface IExtendedAttribute {
    name: string;
    icon?: string;
    title: string;
    visible: boolean;
}

export interface IExtendedGroup {
    name: string | undefined;
    attributes: IExtendedAttribute[];
    groups?: IExtendedGroup[];
    visible: boolean;
    extended: boolean;
    id: string | undefined;
}

/**
 * Рекурсивно ищет группу по идентификатору в массиве IExtendedGroup
 * @param groups Массив групп для поиска
 * @param groupId Идентификатор искомой группы
 * @returns Найденная группа или undefined если не найдена
 * @private
 */
export function findGroupById(
    groups: IExtendedGroup[],
    groupId: string | undefined
): IExtendedGroup | undefined {
    // Создаем стек для итеративного обхода (вместо рекурсии)
    const stack: IExtendedGroup[] = [...groups];

    while (stack.length > 0) {
        const currentGroup = stack.pop();

        // Если нашли нужную группу - возвращаем
        if (currentGroup?.id === groupId) {
            return currentGroup;
        }

        // Добавляем дочерние группы в стек для дальнейшего поиска
        if (currentGroup?.groups) {
            stack.push(...currentGroup.groups);
        }
    }

    return undefined;
}

/**
 * Устанавливает свойство visible для атрибута по имени во всей иерархии групп
 * @param groups Иерархия групп
 * @param attributeName Имя атрибута
 * @param visible Значение visible
 * @returns Новая структура групп с обновленным атрибутом (иммутабельный вариант)
 * @private
 */
export function setAttributeVisibility(
    groups: IExtendedGroup[],
    attributeName: string,
    visible: boolean
): IExtendedGroup[] {
    return groups.map((group) => {
        const newValue: IExtendedGroup = {
            ...group,
            attributes: group.attributes.map((attr) =>
                attr.name === attributeName ? { ...attr, visible } : attr
            ),
            groups: group.groups
                ? setAttributeVisibility(group.groups, attributeName, visible)
                : undefined,
        };

        newValue.visible = isGroupVisible(
            newValue.attributes,
            newValue.groups ?? [],
            newValue.extended
        );

        return newValue;
    });
}

/**
 * Собирает иерархическую структуру расширенных атрибутов
 * @param groups Иерархия групп редакторов
 * @param metaType Метатип объекта
 * @param value Значения свойств объекта
 * @returns Иерархическая структура расширенных групп и атрибутов
 * @private
 */
export function getExtendedAttributesHierarchy(
    groups: IGroup[],
    metaType: ObjectMeta,
    value: Record<string, unknown>
): IExtendedGroup[] {
    const propertiesMeta = metaType.getProperties() as Record<string, ObjectMeta>;

    // Обработка отдельного редактора
    const processEditor = (editor: IEditorTypeDescription): IExtendedAttribute | null => {
        if (!isSingleAttributeEditor(editor)) return null;

        const propertyMeta = propertiesMeta[editor.name];
        if (!propertyMeta || propertyMeta.getExtended() === undefined) return null;

        const currentValue = value[editor.name];
        const defaultValue = propertyMeta.getDefaultValue();

        return {
            name: editor.name,
            title: propertyMeta.getTitle() || editor.name,
            visible: !isEqual(currentValue, defaultValue),
            icon: propertyMeta.getIcon(),
        };
    };

    // Обработка группы
    const processGroup = (group: IGroup): IExtendedGroup | null => {
        // Собираем расширенные атрибуты группы
        const attributes: IExtendedAttribute[] = [];
        group.editors.forEach((editor) => {
            const attribute = processEditor(editor);
            if (attribute) {
                attributes.push(attribute);
            }
        });

        // Обрабатываем дочерние группы
        const childGroups: IExtendedGroup[] = [];
        group.groups?.forEach((childGroup) => {
            const processedChild = processGroup(childGroup);
            if (processedChild) {
                childGroups.push(processedChild);
            }
        });

        // Если нет ни атрибутов, ни дочерних групп - пропускаем
        if (attributes.length === 0 && childGroups.length === 0) {
            return null;
        }

        const isGroupExtended =
            attributes.length === group.editors.length &&
            !childGroups.some((childGroup) => !childGroup.extended);
        // Группа видима, если есть хотя бы один видимый атрибут или дочерняя группа
        const visible = isGroupVisible(attributes, childGroups, isGroupExtended);

        return {
            id: group.id,
            name: group.title || group.id,
            attributes,
            groups: childGroups.length > 0 ? childGroups : undefined,
            extended: isGroupExtended,
            visible,
        };
    };

    // Собираем итоговый результат
    return groups.reduce<IExtendedGroup[]>((result, group) => {
        const processedGroup = processGroup(group);
        if (processedGroup) {
            result.push(processedGroup);
        }
        return result;
    }, []);
}

function isGroupVisible(
    attributes: IExtendedAttribute[],
    childGroups: IExtendedGroup[],
    isExtended: boolean
): boolean {
    return (
        !isExtended ||
        attributes.some((attr) => attr.visible) ||
        childGroups.some((group) => group.visible)
    );
}
