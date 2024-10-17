import { useItemData } from 'Controls/gridReact';
import { Model } from 'Types/entity';

export function ItemCounter() {
    const { renderValues } = useItemData<Model>(['number']);
    return (
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {renderValues.number}
        </div>
    );
}
