import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/EditInPlace/EndEdit/EndEdit';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { getEditableCatalog as getData } from '../../DemoHelpers/DataCatalog';
import { SyntheticEvent } from 'Vdom/Vdom';
import { editing as constEditing } from 'Controls/list';

const TIMEOUT1000 = 1000;
const TIMEOUT3000 = 3000;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: getData(),
        });
    }

    protected _beforeEndEdit(
        e: SyntheticEvent<null>,
        item: Model,
        willSave: boolean
    ): Promise<void | string> | string {
        if (item.get('key') === 1 && item.get('beforeEndEditTitle') === '') {
            return constEditing.CANCEL;
        }
        // eslint-disable-next-line
        if (item.get('key') === 2) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, TIMEOUT1000);
            });
        }
        // eslint-disable-next-line
        if (item.get('key') === 3) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, TIMEOUT3000);
            });
        }
        // eslint-disable-next-line
        if (item.get('key') === 4) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    if (item.get('beforeEndEditTitle') === '') {
                        resolve(constEditing.CANCEL);
                    } else {
                        resolve();
                    }
                }, TIMEOUT1000);
            }).then((res) => {
                if (res) {
                    return res;
                }

                if (willSave) {
                    return this._viewSource.update(item).then(() => {
                        return this._children.list.reload();
                    });
                }
            });
        }
    }
}
