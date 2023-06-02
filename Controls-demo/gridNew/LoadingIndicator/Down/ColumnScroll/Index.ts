import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/LoadingIndicator/Down/ColumnScroll/ColumnScroll';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { PositionSourceMemory } from 'Controls-demo/gridNew/LoadingIndicator/Down/ColumnScroll/PortionedSearchMemory';
import { SyntheticEvent } from 'UI/Vdom';

/**
 * Демка для автотеста https://online.sbis.ru/doc/a2862d8a-46fd-4949-990d-c4340f09aba8
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: PositionSourceMemory;
    protected _header: IHeaderCell[] = [
        {
            caption: '#',
            startColumn: 1,
            endColumn: 2,
        },
        {
            caption: 'Страна',
            startColumn: 2,
            endColumn: 3,
        },
        {
            caption: 'Столица',
            startColumn: 3,
            endColumn: 4,
        },
        {
            caption: 'Колонка с выключенным перемещением мышью',
            startColumn: 4,
            endColumn: 5,
        },
        {
            caption: 'Население',
            startColumn: 5,
            endColumn: 6,
        },
        {
            caption: 'Площадь км2',
            startColumn: 6,
            endColumn: 7,
        },
        {
            caption: 'Плотность населения чел/км2',
            startColumn: 7,
            endColumn: 8,
        },
    ];
    protected _columns: IColumn[] = [
        {
            displayProperty: 'key',
            width: '40px',
        },
        {
            displayProperty: 'country',
            width: '300px',
        },
        {
            displayProperty: 'capital',
            width: '300px',
        },
        {
            width: '200px',
        },
        {
            displayProperty: 'key',
            width: '200px',
        },
        {
            displayProperty: 'key',
            width: '200px',
            compatibleWidth: '83px',
        },
        {
            displayProperty: 'key',
            width: '200px',
        },
    ];
    protected _position: number = 0;
    protected _filter: Object = null;

    protected _beforeMount(
        options?: {},
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._viewSource = new PositionSourceMemory({
            deferResponse: true,
            keyProperty: 'key',
        });
    }

    protected _continueScenario(event: SyntheticEvent): void {
        this._viewSource.callDeferredResponse();
    }
}
