import { CrudEntityKey } from 'Types/source';
import { Model, relation } from 'Types/entity';
import { RecordSet } from 'Types/collection';

interface IProps {
    items: RecordSet;
    root: CrudEntityKey;
    level?: number;
    activeItemKey?: CrudEntityKey;
}

function getPathToItem(
    items: RecordSet,
    root: CrudEntityKey,
    startItemKey: CrudEntityKey,
    hierarchyRelation: relation.Hierarchy
): CrudEntityKey[] {
    const path = [];

    if (startItemKey !== undefined && startItemKey !== null) {
        let parent = items.getRecordById(startItemKey);
        if (parent !== undefined) {
            do {
                path.unshift(parent.getKey());
                parent = hierarchyRelation.getParent(
                    parent,
                    items
                ) as Model | null;
            } while (parent !== null);
        }
    }
    path.unshift(root);

    return path;
}

/*
 * Строит путь в глубину иерархии до конца. Всегда берется первый ребенок узла.
 * @param items
 * @param root Корень
 * @param startItemKey Используется для построения начала пути. Чтобы взять не первых детей узлов, а необходимых.
 * @param hierarchyRelation
 * @private
 */
function getPathToDepth(
    items: RecordSet,
    root: CrudEntityKey,
    startItemKey: CrudEntityKey,
    hierarchyRelation: relation.Hierarchy
): CrudEntityKey[] {
    let path: CrudEntityKey[];

    if (startItemKey !== undefined && startItemKey !== null) {
        path = getPathToItem(items, root, startItemKey, hierarchyRelation);
    } else {
        path = [root];
    }

    const lastPathItemKey = path[path.length - 1];
    let child = hierarchyRelation.getChildren(
        lastPathItemKey,
        items
    )[0] as Model;
    while (child) {
        path.push(child.getKey());
        child = hierarchyRelation.getChildren(child, items)[0] as Model;
    }

    return path;
}

/**
 * Разрешает текущий активный элемент по иерархии
 * @param props {IProps} Объект со свойствами, по которым будет произведено вычисление
 * @param hierarchyRelation {relation.Hierarchy} Экземпляр класса для работы с иерархией
 */
export function getParentActiveElement(
    props: IProps,
    hierarchyRelation: relation.Hierarchy
): CrudEntityKey {
    const path = getPathToDepth(
        props.items,
        props.root,
        props.activeItemKey,
        hierarchyRelation
    );
    const resolvedLevel = props.level ?? path.indexOf(props.root) + 1;
    return path[resolvedLevel];
}
