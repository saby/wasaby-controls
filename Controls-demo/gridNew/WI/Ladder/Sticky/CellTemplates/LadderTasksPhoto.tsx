import { useItemData } from 'Controls/grid';
import { Model } from 'Types/entity';
import { useMemo, CSSProperties } from 'react';

export function LadderTasksPhoto() {
    const { renderValues } = useItemData<Model>(['photo']);

    const styleMap = useMemo<CSSProperties>(
        () => ({
            backgroundImage: `url(${renderValues.photo})`,
            backgroundRepeat: 'no-repeat',
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
