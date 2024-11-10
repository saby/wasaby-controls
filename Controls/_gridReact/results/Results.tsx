/*
 * Файл содержит функцию для получения ряда с результатами
 */

import * as React from 'react';
import { CollectionItemContext } from 'Controls/baseList';
import RowComponent from 'Controls/_gridReact/row/RowComponent';
import { IGridViewProps } from 'Controls/_gridReact/view/interface';

/*
 * Метод прокидывает в компонент ряда результатов пропсы, а также оборачивает в контекст
 */
export function getResults(props: IGridViewProps): React.ReactElement {
    const results = props.collection?.getResults();
    if (!results) {
        return null;
    }

    return (
        <CollectionItemContext.Provider value={results}>
            <RowComponent
                {...results.getRowComponentProps()}
                item={null}
                cCount={props.cCount}
                subPixelArtifactFix={props.subPixelArtifactFix}
                pixelRatioBugFix={props.pixelRatioBugFix}
                data-qa={'results'}
            />
        </CollectionItemContext.Provider>
    );
}
