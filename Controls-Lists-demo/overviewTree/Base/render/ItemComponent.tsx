import { useItemData } from 'Controls/grid';

function ItemComponent() {
    const { renderValues } = useItemData(['sum']);
    return <div>{renderValues.sum}</div>;
}

export default ItemComponent;
