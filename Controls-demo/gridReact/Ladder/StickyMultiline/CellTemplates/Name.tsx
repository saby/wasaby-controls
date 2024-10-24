import { useItemData } from 'Controls/gridReact';
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
