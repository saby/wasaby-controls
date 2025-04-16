/*
 * Файл содержит функцию для получения ряда заголовка.
 */

import * as React from 'react';
import {
    CollectionItemContext,
    helpers,
    ICollectionItemContextValue,
} from 'Controls/listsCommonLogic';
import RowComponent from 'Controls/_gridRender/row/Base';
import { IGridViewProps } from 'Controls/_gridRender/interface/IView';
import { getCheckValidator } from 'Controls/_gridRender/utils/compatibleValidator';

/*
 * Метод прокидывает в компонент ряда заголовка пропсы, а также оборачивает в контекст
 */
export function getHeaderElements(
    props: IGridViewProps,
    headerHandlers: helpers.IItemEventHandlers
): React.ReactElement {
    const header = props.collection?.getHeader();

    if (!header) {
        return null;
    }

    const headerRows = header.getRows();
    return (
        <>
            {headerRows.map((row) => {
                const collectionItemContextValue: ICollectionItemContextValue = {
                    item: row,
                    itemContents: row?.contents,
                };
                return (
                    <CollectionItemContext.Provider
                        value={collectionItemContextValue}
                        key={row.key}
                    >
                        <RowComponent
                            {...row.getRowComponentProps()}
                            hasResults={props.collection?.hasResults()}
                            handlers={headerHandlers}
                            item={null}
                            cCountStart={props.cCountStart}
                            cCountEnd={props.cCountEnd}
                            subPixelArtifactFix={props.subPixelArtifactFix}
                            pixelRatioBugFix={props.pixelRatioBugFix}
                            className="controls-GridReact__header controls-GridReact__header-cell_fontSize"
                            data-qa={'header'}
                            tabIndex={-1}
                            beforeContentRender={props.beforeItemContentRender}
                            _$checkTemplateValidator={props._$checkTemplateValidator}
                        />
                    </CollectionItemContext.Provider>
                );
            })}
        </>
    );
}
