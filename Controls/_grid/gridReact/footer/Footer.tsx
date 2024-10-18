/*
 * Файл содержит функцию для получения ряда подвала.
 */

import * as React from 'react';
import { CollectionItemContext } from 'Controls/baseList';
import type { GridFooterRow } from 'Controls/grid';

import RowComponent from 'Controls/_grid/gridReact/row/RowComponent';
import { IGridViewProps } from 'Controls/_grid/gridReact/view/interface';
import FooterCellComponent from 'Controls/_grid/cleanRender/cell/FooterCellComponent';

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
                cCountStart={props.cCountStart}
                cCountEnd={props.cCountEnd}
                subPixelArtifactFix={props.subPixelArtifactFix}
                pixelRatioBugFix={props.pixelRatioBugFix}
                _$FunctionalCellComponent={FooterCellComponent}
                beforeContentRender={props.beforeItemContentRender}
                data-qa={'footer'}
            />
        </CollectionItemContext.Provider>
    );
}
