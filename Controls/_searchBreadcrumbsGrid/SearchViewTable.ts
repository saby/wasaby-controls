/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
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
