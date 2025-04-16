import { useItemData } from 'Controls/grid';
import { DISCRIMINATOR_FIELD } from 'Controls-editors/object-type';
import { useMetaType } from 'Controls-editors/_recordset/hooks/useMetaType';
import { VariantMeta } from 'Meta/types';
import { Record } from 'Types/entity';

export function Variant(props: { displayProperty: string }) {
    const { displayProperty } = props;
    const { renderValues } = useItemData([displayProperty]);
    const key = renderValues[displayProperty].get(DISCRIMINATOR_FIELD);
    const metaType = useMetaType();
    const properties = metaType.getProperties();
    const property: VariantMeta<Record<string, object>> = properties[displayProperty];
    const types = property.getTypes();
    const value = types[key].getTitle();

    return <div className={'tw-truncate'}>{value}</div>;
}
