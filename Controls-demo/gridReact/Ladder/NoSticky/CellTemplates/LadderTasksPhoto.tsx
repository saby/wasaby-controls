import { useItemData } from 'Controls/gridReact';
import { Model } from 'Types/entity';
import { useMemo, CSSProperties } from 'react';
export function LadderTasksPhoto() {
    const { renderValues } = useItemData<Model>(['photo']);

    const styleMap = useMemo<CSSProperties>(
        () => ({
            backgroundColor: renderValues.photo,
            width: '100px',
            height: '100px',
        }),
        [renderValues]
    );

    if (renderValues.photo === null) {
        return null;
    }

    return <div style={styleMap} />;
}
