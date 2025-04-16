import { useItemData } from 'Controls/gridRender';
import { useMetaType } from 'Controls-editors/_recordset/hooks/useMetaType';
import { EnumMeta } from 'Meta/types';

export function Enum(props: { displayProperty: string }) {
    const { displayProperty } = props;
    const { renderValues } = useItemData([displayProperty]);
    const key = renderValues[displayProperty];
    const metaType = useMetaType();
    const properties = metaType.getProperties();
    const property: EnumMeta<object> = properties[displayProperty];
    const types = property.getTypes();
    const value = types[key]?.getTitle();

    return <div className={'tw-truncate'}>{value}</div>;
}
