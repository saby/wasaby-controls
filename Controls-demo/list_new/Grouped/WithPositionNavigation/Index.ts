import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { PositionSourceMock } from 'Controls-demo/list_new/DemoHelpers/PositionSourceMock';

import * as Template from 'wml!Controls-demo/list_new/Grouped/WithPositionNavigation/WithPositionNavigation';

/**
 * Автотест по
 * https://online.sbis.ru/opendoc.html?guid=2c4fac62-f187-4fcb-a014-73b3e4d83e4a
 * https://online.sbis.ru/opendoc.html?guid=9dbcf25b-a102-45cf-aee1-96b701584f8b
 */
export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _viewSource: PositionSourceMock;
    protected _position: number = 90;

    protected _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._viewSource = new PositionSourceMock({ keyProperty: 'key' });
    }
}
