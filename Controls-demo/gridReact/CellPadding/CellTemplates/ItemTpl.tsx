import { useItemData } from 'Controls/gridReact';
import { Model } from 'Types/entity';

export function ItemTpl() {
    const { renderValues } = useItemData<Model>(['country']);
    return (
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {renderValues.country}
        </div>
    );
}
