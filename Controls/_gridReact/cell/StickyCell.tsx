/*
 * Файл содержит компонент sticky-ячейки
 */
import * as React from 'react';
import { StickyLadderColumnTemplate } from 'Controls/baseGrid';
import StickyLadderCell from 'Controls/_baseGrid/display/StickyLadderCell';
import { StickyPropertyContext } from 'Controls/_gridReact/ladder/StickyPropertyContext';
import { getStyleObjectFromString } from 'Controls/_gridReact/utils/cssStringToObject';

interface IStickyCell {
    cell: StickyLadderCell;
    render?: React.ReactNode;
}

/*
 * Компонент sticky-ячейки
 */
function StickyCell(props: IStickyCell): React.ReactElement {
    const { cell } = props;
    const style = getStyleObjectFromString(cell.getWrapperStyles() || '');

    return (
        <StickyPropertyContext.Provider value={cell.getStickyProperty()}>
            <div className={cell.getWrapperClasses()} style={style} data-qa="cell">
                <StickyLadderColumnTemplate itemData={cell} render={props.render} />
            </div>
        </StickyPropertyContext.Provider>
    );
}

export default React.memo(StickyCell);
