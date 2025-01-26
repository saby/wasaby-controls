/*
 * Файл содержит функцию для получения ряда с результатами
 */

import * as React from 'react';
import { CollectionItemContext } from 'Controls/listsCommonLogic';
import RowComponent from 'Controls/_gridRender/row/Base';
import { IGridViewProps } from 'Controls/_gridRender/interface/IView';

interface IGetResultsRowComponent extends IGridViewProps {}

/*
 * Метод прокидывает в компонент ряда результатов пропсы, а также оборачивает в контекст
 */
export function getResults(props: IGetResultsRowComponent): React.ReactElement {
    const results = props.collection?.getResults();
    if (!results) {
        return null;
    }

    return (
        <CollectionItemContext.Provider value={results}>
            <RowComponent
                {...results.getRowComponentProps()}
                item={null}
                cCountStart={props.cCountStart}
                cCountEnd={props.cCountEnd}
                subPixelArtifactFix={props.subPixelArtifactFix}
                pixelRatioBugFix={props.pixelRatioBugFix}
                data-qa={'results'}
            />
        </CollectionItemContext.Provider>
    );
}
