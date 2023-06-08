import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IData } from 'Controls-demo/tileNew/DataHelpers/DataCatalog';
import * as explorerImages from 'Controls-demo/Explorer/ExplorerImagesLayout';

import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/Description/Description';

/**
 * https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/tile/item/rich/#description
 */
const data: IData[] = [
    {
        key: 0,
        title: 'Пейзаж',
        image: explorerImages[9],
        descriptionLines: 2,
        description:
            'На небе только и разговоров, что о море и о закате. Там говорят о том, как чертовски здорово' +
            ' наблюдать за огромным огненным шаром, как он тает в волнах. И еле видимый свет, словно от свечи,' +
            ' горит где-то в глубине',
    },
    {
        key: 1,
        title: 'Песец',
        image: explorerImages[8],
        descriptionLines: 3,
        description:
            'Обыкновенный песе́ц, или полярная лисица, реже арктическая лиса — вид хищных млекопитающих' +
            ' семейства псовых, обычно относимый к роду лисиц. Небольшое хищное животное,',
    },
];

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data,
        });
    }
}
