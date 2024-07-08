/*
 * Файл содержит функцию для получения ряда подвала.
 */

import * as React from 'react';
import { CollectionItemContext } from 'Controls/baseList';
import type { GridFooterRow } from 'Controls/grid';

import RowComponent from 'Controls/_gridReact/row/RowComponent';
import { IGridViewProps } from 'Controls/_gridReact/view/interface';

/*
 * Метод прокидывает в компонент ряда подвала пропсы, а также оборачивает в контекст
 */
export function getFooter(props: IGridViewProps): React.ReactElement {
    const footer = props.collection?.getFooter() as unknown as GridFooterRow;
    if (!footer) {
        return null;
    }

    return (
        <CollectionItemContext.Provider value={footer}>
            <RowComponent
                {...footer.getRowComponentProps()}
                item={null}
                cCount={props.cCount}
                subPixelArtifactFix={props.subPixelArtifactFix}
                pixelRatioBugFix={props.pixelRatioBugFix}
                data-qa={'footer'}
            />
        </CollectionItemContext.Provider>
    );
}
