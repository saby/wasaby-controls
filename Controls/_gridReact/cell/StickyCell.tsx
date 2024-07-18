import * as React from 'react';
import { StickyLadderColumnTemplate } from 'Controls/baseGrid';
import StickyLadderCell from 'Controls/_baseGrid/display/StickyLadderCell';
import { StickyPropertyContext } from 'Controls/_gridReact/ladder/StickyPropertyContext';

interface IStickyCell {
    cell: StickyLadderCell;
    render?: React.ReactNode;
}

function StickyCell(props: IStickyCell): React.ReactElement {
    const ref = React.useRef(null);
    const { cell } = props;

    React.useEffect(() => {
        ref.current.setAttribute('style', `${cell.getWrapperStyles()}`);
    }, [ref.current]);

    return (
        <StickyPropertyContext.Provider value={cell.getStickyProperty()}>
            <div className={cell.getWrapperClasses()} ref={ref} data-qa="cell">
                <StickyLadderColumnTemplate itemData={cell} render={props.render} />
            </div>
        </StickyPropertyContext.Provider>
    );
}

export default React.memo(StickyCell);
