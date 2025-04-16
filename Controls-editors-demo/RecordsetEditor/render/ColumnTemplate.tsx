import { useMetaType } from 'Controls-editors/recordset';
import { useItemData } from 'Controls/grid';
export function ColumnTemplate() {
    const metaType = useMetaType();
    const {
        renderValues: { type },
    } = useItemData(['type']);
    return (
        <div title={type}>
            <div>{`Текущее: ${type}`}</div>
            <div>{`По умолчанию: ${metaType.getDefaultValue().type}`}</div>
        </div>
    );
}
