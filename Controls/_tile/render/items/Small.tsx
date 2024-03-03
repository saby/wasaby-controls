/**
 * @kaizen_zone a366fb75-0c89-4edd-9ba7-43558b9859ce
 */
import { ITileItemProps } from 'Controls/_tile/display/mixins/TileItem';
import DefaultTileItemWrapper from 'Controls/_tile/render/items/DefaultWrapper';

export default function SmallTileItem(props: ITileItemProps): JSX.Element {
    return <DefaultTileItemWrapper {...props} itemType={'small'} />;
}
