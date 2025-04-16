import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-Actions/_commands/CreateEmployeeAppointment/EmployeeAppointmentEditor';
import { ISelectorTemplate } from 'Controls/interface';
import { SbisService } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { Record } from 'Types/entity';
import { Object } from 'Env/Event';

interface IPropertyValue {
    '@Queue': number;
    Owner: string;
}

interface IOptions extends IControlOptions {
    propertyValue?: IPropertyValue;
}

function modifyFilter(eventObject: Object, name: string, args: { Фильтр: Record }): void {
    const queuesFilterValue = args.Фильтр?.get('@Queue');
    if (queuesFilterValue) {
        const filterRec = args.Фильтр.clone();
        filterRec.addField(
            {
                name: 'Queues',
                type: 'array',
                kind: 'integer',
            },
            0,
            queuesFilterValue
        );
        filterRec.removeField('@Queue');

        eventObject.setResult({
            ...args,
            Фильтр: filterRec,
        });
    }
}

export default class EmployeeAppointmentEditor extends Control<IOptions> {
    protected _template: TemplateFunction = template;
    protected _selectedKeys: number[];
    protected _selectorTemplate: ISelectorTemplate;
    protected _filter: object;
    protected _source: SbisService;

    protected _beforeMount({ propertyValue }: IOptions): void {
        this._init();
        this._updateSelectedKeys(propertyValue);
    }

    protected _beforeUnmount(): void {
        this._source.unsubscribe('onBeforeProviderCall', modifyFilter);
    }

    protected _beforeUpdate({ propertyValue }: IOptions): void {
        if (propertyValue !== this._options.propertyValue) {
            this._updateSelectedKeys(propertyValue);
        }
    }

    protected _onItemsChanged(_: Event, items: RecordSet): void {
        let propertyValue: IPropertyValue = null;
        const item = items?.getCount() ? items.at(0) : null;
        if (item) {
            propertyValue = {
                '@Queue': item.get('@Queue'),
                Owner: item.get('Owner'),
            };
        }

        this._notify('propertyValueChanged', [propertyValue], { bubbling: true });
    }

    private _init(): void {
        const source = new SbisService({
            endpoint: 'EmployeeQueue',
            keyProperty: '@Queue',
            binding: {
                query: 'List',
            },
        });

        source.subscribe('onBeforeProviderCall', modifyFilter);

        const filter = { OnlyQueues: true };

        this._source = source;
        this._filter = filter;
        this._selectorTemplate = {
            templateName: 'BookingPublic/employeeQueueCalendar:StackSelector',
            templateOptions: {
                filter,
                source,
                keyProperty: '@Queue',
                displayProperty: 'Name',
            },
            popupOptions: {
                opener: this,
                modal: true,
                width: 'b',
            },
        };
    }

    private _updateSelectedKeys(propertyValue: IPropertyValue): void {
        if (!propertyValue) {
            this._selectedKeys = [];
        } else {
            this._selectedKeys = [propertyValue['@Queue']];
        }
    }
}
