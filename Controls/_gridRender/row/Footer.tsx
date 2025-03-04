/*
 * Файл содержит функцию для получения ряда подвала.
 */

import * as React from 'react';
import { CollectionItemContext } from 'Controls/listsCommonLogic';
import type { GridFooterRow } from 'Controls/grid';

import RowComponent from 'Controls/_gridRender/row/Base';
import { IGridViewProps } from 'Controls/_gridRender/interface/IView';
import FooterCellComponent from 'Controls/_gridRender/cell/Footer';

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
                _$FCC={FooterCellComponent}
                beforeContentRender={props.beforeItemContentRender}
                data-qa={'footer'}
                _$checkTemplateValidator={props._$checkTemplateValidator}
            />
        </CollectionItemContext.Provider>
    );
}
