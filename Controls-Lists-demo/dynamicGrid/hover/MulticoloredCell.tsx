import { useItemData } from 'Controls/gridReact';
import { Model } from 'Types/entity';
export default function MulticoloredCell() {
    const { renderValues, item } = useItemData<Model>(['subject']);
    return <div>{renderValues?.subject}</div>;
}
