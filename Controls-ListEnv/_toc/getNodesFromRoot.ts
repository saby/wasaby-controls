import { CrudEntityKey } from 'Types/source';
import { RecordSet } from 'Types/collection';

interface IProps {
    items: RecordSet;
    root: CrudEntityKey;
    keyProperty: string;
    parentProperty: string;
    nodeProperty: string;
}

/**
 * Возвращает записи плоского списка по указанным параметрам
 * @param props {IProps} Объект со свойствами, по которым будет произведено вычисление
 */
export function getNodesFromRoot({
    items,
    keyProperty,
    root,
    parentProperty,
    nodeProperty,
}: IProps): RecordSet {
    const flatItems = new RecordSet({
        adapter: items?.getAdapter(),
        keyProperty,
        format: items?.getFormat(),
        model: items?.getModel(),
    });
    if (items) {
        items.forEach((item, index) => {
            if (
                item.get(parentProperty) === root &&
                item.get(nodeProperty) === true
            ) {
                flatItems.add(item);
            }
        });
    }
    return flatItems;
}
