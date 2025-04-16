import type { Model } from 'Types/entity';

export default function messageActionHandler(
    meta: { context: { item: Model } },
    _itemContainer: HTMLDivElement,
    _event: MouseEvent
) {
    alert(
        `Текущая запись ${meta.context.item.getKey()},` +
            ' Выполнен обработчик экшна, сформированного без actionName и без commandName'
    );
}
