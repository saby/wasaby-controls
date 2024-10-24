/*
 * Файл содержит функцию для получения ряда заголовка.
 */

import * as React from 'react';
import { CollectionItemContext, IItemEventHandlers } from 'Controls/baseList';
import RowComponent from 'Controls/_gridReact/row/RowComponent';
import { IGridViewProps } from 'Controls/_gridReact/view/interface';

/*
 * Метод прокидывает в компонент ряда заголовка пропсы, а также оборачивает в контекст
 */
export function getHeaderElements(
    props: IGridViewProps,
    headerHandlers: IItemEventHandlers
): React.ReactElement {
    const header = props.collection?.getHeader();
    if (!header) {
        return null;
    }

    const headerRow = header.getRow();

    return (
        <CollectionItemContext.Provider value={headerRow}>
            <RowComponent
                {...headerRow.getRowComponentProps()}
                handlers={headerHandlers}
                item={null}
                cCount={props.cCount}
                subPixelArtifactFix={props.subPixelArtifactFix}
                pixelRatioBugFix={props.pixelRatioBugFix}
                data-qa={'header'}
                tabIndex={-1}
            />
        </CollectionItemContext.Provider>
    );
}
