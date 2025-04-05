/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { Model } from 'Types/entity';
import { TreeItem, NodeFooterStrategy } from 'Controls/baseTreeDisplay';

/**
 * Стратегия-декоратор для отображения подвала развёрнутого узла в дереве с колонками.
 * @private
 */
export default class TreeGridNodeFooter extends NodeFooterStrategy {
    protected _shouldAddExtraItem(item: TreeItem<Model>, options): boolean {
        return super._shouldAddExtraItem(item, options) || options.display.hasNodeFooterColumns();
    }
}
