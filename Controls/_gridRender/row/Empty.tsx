/*
 * Файл содержит функцию для получения ряда пустого представления.
 */

import * as React from 'react';
import { CollectionItemContext } from 'Controls/listsCommonLogic';

import RowComponent from 'Controls/_gridRender/row/Base';
import { IGridViewProps } from 'Controls/_gridRender/interface/IView';
import EmptyCellComponent from 'Controls/_gridRender/cell/Empty';
import { getCheckValidator } from 'Controls/_gridRender/utils/compatibleValidator';

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
                _$checkTemplateValidator={props._$checkTemplateValidator}
                _$FCC={EmptyCellComponent}
            />
        </CollectionItemContext.Provider>
    );
}
