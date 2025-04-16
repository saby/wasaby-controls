import { TileCollection } from 'Controls/tile';
import { IRoundAnglesProps, TSize } from 'Controls/interface';

interface IRoundBorderProps {
    collection: TileCollection;
}
export function getRoundBorder({ collection }: IRoundBorderProps): IRoundAnglesProps {
    return {
        roundAngleBL: collection.getRoundAngleBL().toLowerCase() as TSize,
        roundAngleBR: collection.getRoundAngleBR().toLowerCase() as TSize,
        roundAngleTL: collection.getRoundAngleTL().toLowerCase() as TSize,
        roundAngleTR: collection.getRoundAngleTR().toLowerCase() as TSize,
    };
}
