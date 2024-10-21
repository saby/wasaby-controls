import { useItemData } from 'Controls/gridReact';
import { Model } from 'Types/entity';
import { useMemo, CSSProperties } from 'react';

export function LadderTasksPhoto() {
    const { renderValues } = useItemData<Model>(['photo']);

    const styleMap = useMemo<CSSProperties>(
        () => ({
            width: '80px',
            height: '80px',
        }),
        []
    );

    return renderValues.photo ? (
        <img src={renderValues.photo} style={styleMap} />
    ) : (
        <div style={styleMap} />
    );
}
