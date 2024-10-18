/* eslint-disable no-magic-numbers */
import { Model } from 'Types/entity';
import { Path } from 'Controls/dataSource';
import { HierarchicalMemory } from 'Types/source';
import { Control, TemplateFunction } from 'UI/Base';
import { data } from 'Controls-demo/breadCrumbs_new/PathButton/Data';
import * as template from 'wml!Controls-demo/breadCrumbs_new/PathButton/Index';

/**
 * Демопример демонстрирует работу компонента {@link Controls/breadcrumbs:PathButton}
 */
export default class Index extends Control {
    protected _template: TemplateFunction = template;

    // Текущий выбранный путь
    protected _path: Path;

    // Заголовок текущего корневого каталога
    protected _rootTitle: string;

    // Источник данных для списка, отображаемого в popup кнопки
    protected _source: HierarchicalMemory;

    protected _beforeMount(): void {
        this._source = new HierarchicalMemory({
            data,
            keyProperty: 'id',
            parentProperty: 'parent',
            filter: () => {
                return true;
            },
        });

        this._path = [
            new Model({
                keyProperty: 'id',
                rawData: data.find((item) => {
                    return item.id === 1;
                }),
            }),
            new Model({
                keyProperty: 'id',
                rawData: data.find((item) => {
                    return item.id === 11;
                }),
            }),
            new Model({
                keyProperty: 'id',
                rawData: data.find((item) => {
                    return item.id === 112;
                }),
            }),
        ];
        this._updateRootTitle();
    }

    protected _updateRootTitle(): void {
        if (!this._path.length) {
            this._rootTitle = 'null';
            return;
        }

        const rootItem = this._path[this._path.length - 1];
        this._rootTitle = rootItem.get('title');
    }
}
