import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/FormController/FormControllerDemo');
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { ISource } from 'Types/source';
import Env = require('Env/Env');

interface IOptions extends IControlOptions {
    dataSource: Memory;
}

class FormController extends Control<IOptions> {
    protected _template: TemplateFunction = template;
    protected _dataSource: ISource = null;
    protected idCount: number = 1;
    protected _key: number = 0;
    protected _record: Model = null;
    protected _recordAsText: string = '';
    protected _operation: string = '';

    protected _beforeMount(cfg: IOptions): void {
        this._dataSource =
            cfg.dataSource ||
            new Memory({
                keyProperty: 'id',
                data: [{ id: 0 }],
            });
    }
    protected _afterMount(): void {
        this._create({
            initValues: {
                title: 'Title',
                description: 'New note',
            },
        });
    }

    private _create(config: {
        initValues: object & {
            id?: number;
            title: string;
            description: string;
        };
    }): void {
        const initValues = config.initValues;
        const finishDef = this._children.registrator.finishPendingOperations();
        initValues.id = this.idCount;
        const result = new Promise((resolve, reject) => {
            finishDef.then(
                (finishResult) => {
                    const createDef =
                        this._children.formControllerInst.create(initValues);
                    createDef.then(
                        (cbResult) => {
                            this.idCount++;
                            resolve(true);
                            return cbResult;
                        },
                        (error) => {
                            Env.IoC.resolve('ILogger').error(
                                'FormController example',
                                '',
                                error
                            );
                            reject(error);
                            return error;
                        }
                    );
                    return finishResult;
                },
                (e) => {
                    reject(e);
                    Env.IoC.resolve('ILogger').error(
                        'FormController example',
                        '',
                        e
                    );
                    return e;
                }
            );
        });

        result.then(
            (promiseResult) => {
                return promiseResult;
            },
            (error) => {
                return error;
            }
        );
    }

    private _finishPending(): void {
        const finishDef = this._children.registrator.finishPendingOperations();
        finishDef.then(
            (finishResult) => {
                this._operation = 'Finish Pending';
            },
            (error) => {
                // отмена
            }
        );
    }

    private _read(config: { key: number }): void {
        const finishDef = this._children.registrator.finishPendingOperations();
        const result = new Promise((resolve, reject) => {
            finishDef.then(
                (finishResult) => {
                    this._key = config.key;
                    this._record = null;
                    this._forceUpdate();
                    resolve(true);
                    return finishResult;
                },
                (e) => {
                    reject(e);
                    Env.IoC.resolve('ILogger').error(
                        'FormController example',
                        '',
                        e
                    );
                    return e;
                }
            );
        });
        result.then(
            (promiseResult) => {
                return promiseResult;
            },
            (error) => {
                return error;
            }
        );
    }
    private _update(): Promise<void> {
        return this._children.formControllerInst.update();
    }
    private _delete(): Promise<void> {
        return this._children.formControllerInst.delete();
    }

    private _clickCreateHandler(): void {
        this._create({
            initValues: {
                title: 'Title',
                description: 'New note',
            },
        });
    }
    private _clickReadHandler(e: Event, id: number): void {
        this._read({ key: id });
    }
    private _clickUpdateHandler(): void {
        this._update();
    }
    private _clickDeleteHandler(): void {
        this._delete();
    }
    getRecordString() {
        if (!this._record) {
            return '';
        }
        if (!this._record.getRawData()) {
            return '';
        }
        return this._record.getRawData();
    }
    private _createSuccessedHandler(e: Event, record: Model) {
        this._operation = 'created successfully';
        this._updateValuesByRecord(record);
    }
    private _updateSuccessedHandler(
        e: Event,
        record: Model,
        key: number
    ): void {
        this._operation = 'saved successfully';
        this._updateValuesByRecord(record);
    }
    private _updateFailedHandler(): void {
        this._updateValuesByRecord(this._record);
    }
    private _validationFailedHandler(): void {
        this._updateValuesByRecord(this._record);
    }
    private _readSuccessedHandler(e: Event, record: Model): void {
        this._updateValuesByRecord(record);
    }
    private _readFailedHandler(): void {
        this._updateValuesByRecord(new Model());
    }
    private _deleteSuccessedHandler(): void {
        this._operation = 'deleted successfully';
        this._updateValuesByRecord(new Model());
    }
    private _deleteFailedHandler(): void {
        this._updateValuesByRecord(new Model());
    }
    private _updateValuesByRecord(record: Model): void {
        this._record = record;

        this._key = this._record.get('id');
        this._recordAsText = this.getRecordString();

        // запросим еще данные прямо из dataSource и обновим dataSourceRecordString
        const def = this._dataSource.read(this._key);
        def.then(
            (loadedRecord) => {
                if (!loadedRecord) {
                    return '';
                }
                if (!loadedRecord.getRawData()) {
                    return '';
                }
                this.dataSourceRecordString = loadedRecord.getRawData();
                this._forceUpdate();
            },
            (e) => {
                this.dataSourceRecordString = '';
                this._forceUpdate();
                return e;
            }
        );
        this._forceUpdate();
    }
    private _requestCustomUpdate(): boolean {
        return false;
    }

    static _styles: string[] = [
        'Controls-demo/FormController/FormControllerDemo',
    ];
}
export default FormController;
