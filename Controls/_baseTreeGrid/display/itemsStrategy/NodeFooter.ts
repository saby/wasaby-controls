/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { Model } from 'Types/entity';
import { TreeItem } from 'Controls/baseTree';
import { NodeFooterStrategy } from 'Controls/baseTree';

export default class TreeGridNodeFooter extends NodeFooterStrategy {
    protected _shouldAddExtraItem(item: TreeItem<Model>, options): boolean {
        return super._shouldAddExtraItem(item, options) || options.display.hasNodeFooterColumns();
    }
}
