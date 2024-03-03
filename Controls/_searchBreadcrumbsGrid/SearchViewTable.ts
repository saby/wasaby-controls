/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import SearchView from './SearchView';
import { TemplateFunction } from 'UI/Base';
import { loadSync } from 'WasabyLoader/ModulesLoader';

export default class SearchViewTable extends SearchView {
    protected _template: TemplateFunction =
        loadSync<typeof import('Controls/gridIE')>('Controls/gridIE').GridViewTemplate;

    protected _getGridViewClasses(options: any): string {
        const classes = super._getGridViewClasses(options);
        return classes + ' controls-Grid_table-layout controls-Grid_table-layout_fixed';
    }

    protected _getGridViewStyles(): string {
        return '';
    }
}
