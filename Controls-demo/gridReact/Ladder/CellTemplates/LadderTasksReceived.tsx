import { useItemData } from 'Controls/gridReact';
import { Model } from 'Types/entity';

export function LadderTasksReceived() {
    const { renderValues } = useItemData<Model>(['date', 'state']);

    if (renderValues.date === null) {
        return null;
    }

    return (
        <div>
            <div>{renderValues.date}</div>
            <div>{renderValues.state}</div>
        </div>
    );
}
