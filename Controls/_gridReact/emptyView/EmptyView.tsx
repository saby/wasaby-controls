/*
 * Файл содержит функцию для получения ряда пустого представления.
 */

import * as React from 'react';
import { CollectionItemContext } from 'Controls/baseList';

import RowComponent from 'Controls/_gridReact/row/RowComponent';
import { IGridViewProps } from 'Controls/_gridReact/view/interface';

/*
 * Метод прокидывает в компонент ряда пустого представления пропсы, а также оборачивает в контекст
 */
export function getEmptyView(props: IGridViewProps): React.ReactElement {
    const { needShowEmptyTemplate, collection } = props;
    if (!needShowEmptyTemplate) {
        return null;
    }

    const item = collection.getEmptyGridRow();
    return (
        <CollectionItemContext.Provider value={item}>
            <RowComponent {...item.getRowComponentProps()} item={null} data-qa={'empty-view'} />
        </CollectionItemContext.Provider>
    );
}
