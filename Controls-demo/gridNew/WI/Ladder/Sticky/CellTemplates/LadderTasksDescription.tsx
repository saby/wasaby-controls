import { useItemData } from 'Controls/grid';
import { Model } from 'Types/entity';

export function LadderTasksDescription() {
    const { renderValues } = useItemData<Model>(['fullName', 'message']);

    return (
        <div>
            <div>{renderValues.fullName}</div>
            <div>{renderValues.message}</div>
        </div>
    );
}
