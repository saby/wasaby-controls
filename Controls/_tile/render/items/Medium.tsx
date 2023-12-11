/**
 * @kaizen_zone a366fb75-0c89-4edd-9ba7-43558b9859ce
 */
import { ITileItemProps } from 'Controls/_tile/display/mixins/TileItem';
import DefaultTileItemWrapper from 'Controls/_tile/render/items/DefaultWrapper';

const HEIGHT = 160;
export default function MediumTileItem(props: ITileItemProps): JSX.Element {
    return (
        <DefaultTileItemWrapper
            {...props}
            itemType={'medium'}
            height={HEIGHT}
            highlightOnHover={false}
            staticHeight={true}
        />
    );
}
