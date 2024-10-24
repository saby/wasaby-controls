import { useItemData } from 'Controls/gridReact';
import { Model } from 'Types/entity';
import { useMemo, CSSProperties } from 'react';
export function LadderTasksPhoto() {
    const { renderValues } = useItemData<Model>(['photo']);

    const styleMap = useMemo<CSSProperties>(
        () => ({
            backgroundColor: renderValues.photo ?? 'transparent',
            width: '80px',
            height: '100px',
        }),
        [renderValues]
    );

    return <div style={styleMap} />;
}
