import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Button/AdditionalProperty/Index');
import { Memory } from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _source: Memory;
    protected _sourceHierarchy: Memory;

    protected _beforeMount(): void {
        this._source = new Memory({
            keyProperty: 'key',
            data: [
                { key: 1, title: 'Add', icon: 'icon-Bell' },
                { key: 2, title: 'Vacation', icon: 'icon-Vacation' },
                { key: 3, title: 'Time off', icon: 'icon-SelfVacation' },
                { key: 4, title: 'Hospital', icon: 'icon-Sick' },
                { key: 5, title: 'Business trip', icon: 'icon-statusDeparted' },
                {
                    key: 6,
                    title: 'Task',
                    icon: 'icon-TFTask',
                    additional: true,
                },
                {
                    key: 7,
                    title: 'Incident',
                    icon: 'icon-Alert',
                    additional: true,
                },
                {
                    key: 8,
                    title: 'Outfit',
                    icon: 'icon-PermittedBuyers',
                    additional: true,
                },
                {
                    key: 9,
                    title: 'Project',
                    icon: 'icon-Document',
                    additional: true,
                },
                {
                    key: 10,
                    title: 'Check',
                    icon: 'icon-Statistics',
                    additional: true,
                },
                {
                    key: 11,
                    title: 'Meeting',
                    icon: 'icon-Groups',
                    additional: true,
                },
                {
                    key: 12,
                    title: 'Treaties',
                    icon: 'icon-Report',
                    additional: true,
                },
            ],
        });
        this._sourceHierarchy = new Memory({
            keyProperty: 'id',
            data: [
                {
                    id: 1,
                    title: 'Task',
                    '@parent': true,
                    parent: null,
                },
                {
                    id: 2,
                    title: 'Error in the development',
                    '@parent': false,
                    parent: null,
                },
                { id: 3, title: 'Commission', parent: 1 },
                {
                    id: 4,
                    title: 'Coordination',
                    parent: 1,
                    '@parent': true,
                },
                { id: 5, title: 'Application', parent: 1 },
                { id: 6, title: 'Development', parent: 1, additional: true },
                { id: 7, title: 'Exploitation', parent: 1, additional: true },
                { id: 8, title: 'Coordination', parent: 4 },
                { id: 9, title: 'Negotiate the discount', parent: 4 },
                { id: 10, title: 'Coordination of change prices', parent: 4, additional: true },
                { id: 11, title: 'Matching new dish', parent: 4, additional: true },
            ],
        });
    }
}
