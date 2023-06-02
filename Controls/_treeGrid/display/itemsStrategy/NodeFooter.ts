/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import { Model } from 'Types/entity';
import { TreeItem } from 'Controls/baseTree';
import { NodeFooterStrategy } from 'Controls/baseTree';

export default class TreeGridNodeFooter extends NodeFooterStrategy {
    protected _shouldAddExtraItem(item: TreeItem<Model>, options): boolean {
        return (
            super._shouldAddExtraItem(item, options) ||
            options.display.hasNodeFooterColumns()
        );
    }
}
