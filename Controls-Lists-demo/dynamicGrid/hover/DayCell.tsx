import { useItemData } from 'Controls/gridReact';
import { Model } from 'Types/entity';
export default function DayCell() {
    const { renderValues, item } = useItemData<Model>(['time']);
    return <div>{renderValues?.time}</div>;
}
