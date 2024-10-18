/*
 * Файл содержит функцию для получения ряда пустого представления.
 */

import * as React from 'react';
import { CollectionItemContext } from 'Controls/baseList';

import RowComponent from 'Controls/_grid/gridReact/row/RowComponent';
import { IGridViewProps } from 'Controls/_grid/gridReact/view/interface';
import EmptyCellComponent from 'Controls/_grid/dirtyRender/emptyView/EmptyCellComponent';

/*
 * Метод прокидывает в компонент ряда пустого представления пропсы, а также оборачивает в контекст
 */
export function getEmptyView(props: IGridViewProps): React.ReactElement {
    const { needShowEmptyTemplate, collection } = props;
    if (!needShowEmptyTemplate) {
        return null;
    }

    const item = collection.getEmptyGridRow();

    // todo: С этим нужно подробно разобраться. По идее needShowEmptyTemplate должен был вернуть false.
    // Мы вообще сюда не должны были попасть.
    // Ошибка: https://online.sbis.ru/opendoc.html?guid=bff38ce4-f990-487f-a194-14f73be58cc9
    // Подошибка на разбор: https://online.sbis.ru/opendoc.html?guid=20e4de70-b3ed-4c3b-b663-172f77bf84e3
    if (!item) {
        return null;
    }

    return (
        <CollectionItemContext.Provider value={item}>
            <RowComponent
                {...item.getRowComponentProps()}
                item={null}
                data-qa={'empty'}
                _$FunctionalCellComponent={EmptyCellComponent}
            />
        </CollectionItemContext.Provider>
    );
}
