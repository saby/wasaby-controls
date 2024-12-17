import * as React from 'react';
import type { Colgroup } from 'Controls/grid';

function getBodyClasses(cell): string {
    let bodyClasses = 'controls-GridReact-IE-column';

    if (cell.isMultiSelectColumn()) {
        bodyClasses += ' controls-GridReact-IE-multiselect-column';
    }
    return bodyClasses;
}

//Используется для рассчета colgroup
function getColgroup(colgroup: Colgroup) {
    const cells = colgroup.getCells();
    return (
        <colgroup className="controls-GridReact-IE-colgroup">
            {cells.map((cell) => {
                return (
                    <col
                        key={cell.getKey()}
                        className={getBodyClasses(cell)}
                        style={cell.getBodyStyles()}
                    />
                );
            })}
        </colgroup>
    );
}

export default getColgroup;
