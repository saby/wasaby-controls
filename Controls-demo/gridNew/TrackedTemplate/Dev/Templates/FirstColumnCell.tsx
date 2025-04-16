import * as React from 'react';
import { useItemData } from 'Controls/grid';
import { CSSProperties, useMemo } from 'react';

export function FirstColumnCell(): React.ReactElement {
    const { renderValues } = useItemData(['photo']);
    const styleMap = useMemo<CSSProperties>(
        () => ({
            width: '60px',
            height: '60px',
            borderRadius: '13px',
        }),
        []
    );

    return renderValues.photo ? (
        <img src={renderValues.photo} style={styleMap} />
    ) : (
        <div style={styleMap} />
    );
}
