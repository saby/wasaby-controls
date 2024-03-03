import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Record } from 'Types/entity';
import { SbisService } from 'Types/source';
import { Logger } from 'UI/Utils';

import * as template from 'wml!Controls-Actions/_commands/CreateEvent/EventTypeEditor';

interface IEventTypeEditorOptions extends IControlOptions {
    propertyValue: number;
}

export default class EventTypeEditor extends Control<IEventTypeEditorOptions> {
    protected _template: TemplateFunction = template;
    protected _source: SbisService;
    protected _filter: Record;
    protected _selectedKey: number;

    protected _beforeMount({ propertyValue }: IEventTypeEditorOptions): void {
        try {
            const filter = new Record({
                format: {
                    TypeStatus: 'boolean',
                },
                adapter: 'adapter.sbis',
            });
            filter.set({
                TypeStatus: true,
            });

            this._filter = filter;
        } catch (e) {
            Logger.error(e.message, this, e);
        }

        this._source = new SbisService({
            endpoint: {
                contract: 'CRMEvent',
                address: '/service/',
            },
            binding: {
                query: 'GetTypeList',
            },
        });

        this._selectedKey = propertyValue;
    }

    protected _beforeUpdate({ propertyValue }: IEventTypeEditorOptions): void {
        if (propertyValue !== this._options.propertyValue) {
            this._selectedKey = propertyValue;
        }
    }

    protected _selectedKeyChangedHandler(_: Event, selectedKey: number): void {
        this._notify('propertyValueChanged', [selectedKey], { bubbling: true });
    }
}
