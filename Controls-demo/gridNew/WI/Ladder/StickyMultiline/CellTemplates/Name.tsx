import { useItemData } from 'Controls/grid';
import { Model } from 'Types/entity';

export function Name() {
    const { renderValues } = useItemData<Model>(['name']);

    return (
        <div>
            <div>{renderValues.name}</div>
            <div>дополнительный текст</div>
        </div>
    );
}
