/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */
import { ITileItemProps } from 'Controls/_tile/display/mixins/TileItem';
import DefaultTileItemWrapper from 'Controls/_tile/render/items/DefaultWrapper';

export default function SmallTileItem(props: ITileItemProps): JSX.Element {
    return <DefaultTileItemWrapper {...props} itemType={'small'} />;
}
