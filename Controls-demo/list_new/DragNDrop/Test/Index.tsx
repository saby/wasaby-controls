import * as React from 'react';
import {ItemsView as ListView} from 'Controls/list';
import {RecordSet} from 'Types/collection';
import {getFewCategories} from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import {SyntheticEvent} from 'UICommon/Events';
import {ItemsEntity} from 'Controls/dragnDrop';
import {Model} from 'Types/entity';
import {Move} from 'Controls/viewCommands';

/*
 * Тест-кейсы:
 * 1. Проверяем что если перетащили запись на запись, с которой нельзя менять позицию,
 *  то перетаскиваемая запись не отпрыгивает на изначальное место
 * 2. После кейса 1 отпускаем мышь и убеждаемся, что запись возвращается на изначальную позицию
 */

const ITEMS = new RecordSet({
    rawData: getFewCategories(),
    keyProperty: 'key',
});

export default React.forwardRef((props, ref) => {
    const onDragEnd = React.useCallback(
        (
            _: SyntheticEvent,
            entity: ItemsEntity,
            target: Model,
            position: 'after' | 'before' | 'on'
        ) => {
            const moveAction = new Move({
                items: ITEMS,
                keyProperty: ITEMS.getKeyProperty(),
                selection: {
                    selected: entity.getItems(),
                    excluded: [],
                },
                target,
                position,
            });
            moveAction.execute();
        },
        []
    );

    const onChangeDragTarget = React.useCallback(
        (
            _: SyntheticEvent,
            entity: ItemsEntity,
            target: Model,
            position: 'after' | 'before' | 'on'
        ) => {
            // Запрещаем перемещение записи на место записи Android gadgets
            if (target.get('title') === 'Android gadgets') {
                return false;
            }
        },
        []
    );

    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <ListView
                items={ITEMS}
                itemsDragNDrop
                onChangeDragTarget={onChangeDragTarget}
                onCustomdragEnd={onDragEnd}
                customEvents={['onCustomdragEnd', 'onChangeDragTarget']}
            />
        </div>
    );
});
