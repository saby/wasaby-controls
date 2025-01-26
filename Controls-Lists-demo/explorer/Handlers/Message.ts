import type { Model } from 'Types/entity';

export default function messageActionHandler(
    item: Model,
    _itemContainer: HTMLDivElement,
    _event: MouseEvent
) {
    alert(
        `Текущая запись ${item.getKey()},` +
            ' Выполнен обработчик экшна, сформированного по "старому" конфигу'
    );
}
