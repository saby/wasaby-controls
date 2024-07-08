/**
 * @kaizen_zone 32467cda-e824-424f-9d3b-3faead248ea2
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_editableArea/View';
import { Controller } from 'Controls/validate';
import { IViewOptions } from './interface/IView';
import { Deferred } from 'Types/deferred';
import buttonsTemplate from 'Controls/_editableArea/Templates/Buttons';
import { Record } from 'Types/entity';
import { SyntheticEvent } from 'Vdom/Vdom';
import 'css!Controls/CommonClasses';
import 'css!Controls/editableArea';
import 'css!Controls/list';

/**
 * Контроллер для <a href="/doc/platform/developmentapl/interface-development/controls/input-elements/input/edit/">редактирования по месту в полях ввода</a>.
 *
 * @class Controls/_editableArea/View
 * @extends UI/Base:Control
 * @mixes Controls/editableArea:IView
 * @public
 *
 * @remark
 * Если в качестве шаблона редактирования используются поля ввода, то при переключении в режим чтения может наблюдаться скачок текста.
 * Для того, чтобы избежать этого, рекомендуется навесить CSS-класс **controls-Input_negativeOffset** на редактируемую область.
 *
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_editableArea.less переменные тем оформления}
 *
 * @demo Controls-demo/EditableArea/View/Index
 */

const EDIT_CANCEL: string = 'Cancel';

interface IViewControlOptions extends IViewOptions, IControlOptions {}

export default class View extends Control<IViewControlOptions> {
    protected _template: TemplateFunction = template;
    protected _buttonsTemplate: typeof buttonsTemplate = buttonsTemplate;
    protected _isEditing: boolean = false;
    protected _editingObject: Record;
    protected _children: {
        formController: Controller;
    };
    private _isStartEditing: boolean = false;
    private _isToolbarVisible: boolean;
    private _isCommitEdit: boolean = false;

    protected _beforeMount(newOptions: IViewControlOptions): void {
        this._isEditing = newOptions.autoEdit;
        this._editingObject = newOptions.editingObject || newOptions.editObject;
    }
    protected _afterMount(): void {
        this._registerFormOperation();
    }
    protected _beforeUpdate(newOptions: IViewControlOptions): void {
        /* В режиме редактирования создается клон, ссылка остается на старый объект.
      Поэтому при изменении опций копируем ссылку актуального объекта */
        if (
            newOptions.editingObject !== this._options.editingObject ||
            newOptions.editObject !== this._options.editObject
        ) {
            if (this._isEditing) {
                this._cloneeditingObject(newOptions.editingObject || newOptions.editObject);
            } else {
                this._editingObject = newOptions.editingObject || newOptions.editObject;
            }
        }
    }
    protected _afterUpdate(): void {
        if (this._isStartEditing) {
            if (this._options.shouldActivateInput) {
                this.activate();
            }
            this._isStartEditing = false;
        }
    }

    protected _onClickHandler(event: SyntheticEvent<MouseEvent>): void {
        if (!this._options.readOnly && !this._isEditing) {
            this.beginEdit(event);
        }
    }

    protected _registerFormOperation(): void {
        this._notify(
            'registerFormOperation',
            [
                {
                    save: this.commitEdit.bind(this),
                    cancel: this.cancelEdit.bind(this),
                    isDestroyed: () => {
                        return this._destroyed;
                    },
                },
            ],
            { bubbling: true }
        );
    }

    protected _registerEditableAreaToolbar(event: Event): void {
        // Если есть тулбар, вставленный либо с помощью опции toolbarVisible, либо прикладным разработчиком
        // у себя на шаблоне, по уходу фокуса редактирование закрываться не должно.
        this._isToolbarVisible = true;
        event.stopPropagation();
    }

    protected _onDeactivatedHandler(): void {
        if (!this._options.readOnly && this._isEditing && !this._isToolbarVisible) {
            this.commitEdit();
        }
    }

    protected _onKeyDown(event: SyntheticEvent<KeyboardEvent>): void {
        if (this._isEditing) {
            switch (event.nativeEvent.keyCode) {
                case 13: // Enter
                    this.commitEdit();
                    break;
                case 27: // Esc
                    this.cancelEdit();
                    event.preventDefault();
                    event.stopPropagation();
                    break;
            }
        }
    }

    protected _cloneeditingObject(editingObject: Record<any>): void {
        // При любом изменении данных будет обновляться editingObject,
        // что может приводить к ошибкам. Чтобы этого избежать, клонируем его
        this._editingObject = editingObject.clone();
        // Если опция editingObject изменилась, то она ждет подтверждения изменения, делаем подтверждение у клона.
        this._editingObject.acceptChanges();
    }

    beginEdit(event: SyntheticEvent<MouseEvent>, res: boolean = false): void {
        this._cloneeditingObject(this._options.editingObject || this._options.editObject);
        // TODO: res - это результат события со старым названием. Снести вместе со старым контролом 3.19.110
        const result =
            res ||
            this._notify('beforeBeginEdit', [this._editingObject], {
                bubbling: true,
            });
        if (result !== EDIT_CANCEL) {
            this._isEditing = true;
            this._isStartEditing = true;
        }
    }

    cancelEdit(): Promise<void> {
        /*
        Защита от ситуации, когда зовут отмену редактирования, а оно не начиналось.
       */
        if (!this._isEditing) {
            return;
        }
        return this._endEdit(false);
    }

    commitEdit(): Promise<void> {
        if (!this._isEditing) {
            return;
        }
        if (!this._isCommitEdit) {
            this._isCommitEdit = true;
            return this._validate().addCallback((result) => {
                for (const key in result) {
                    if (result.hasOwnProperty(key) && result[key]) {
                        this._isCommitEdit = false;
                        return Deferred.success();
                    }
                }
                return this._endEdit(true).then(() => {
                    this._isCommitEdit = false;
                });
            });
        }
    }

    private _validate(): Promise<unknown> {
        return this._children.formController.submit({
            activateInput: false,
        });
    }
    private _afterEndEdit(commit: boolean): Promise<void> {
        if (commit) {
            this._acceptChanges();
        } else {
            this._editingObject.rejectChanges();
        }
        this._isEditing = false;
        this._notify('afterEndEdit', [this._editingObject], {
            bubbling: true,
        });
        return Deferred.success();
    }
    private _endEdit(commit: boolean): Promise<void> {
        const result = this._notify('beforeEndEdit', [this._editingObject, commit], {
            bubbling: true,
        });

        if (result === EDIT_CANCEL) {
            return Deferred.success();
        }

        if (result && result.addCallback) {
            return result.addCallback((res) => {
                if (res === EDIT_CANCEL) {
                    return Deferred.success();
                }
                return this._afterEndEdit(commit);
            });
        }

        return this._afterEndEdit(commit);
    }
    private _acceptChanges(): void {
        /*
         * TL;DR: we should never change the state of the record and leave it to the owner.
         *
         * EditableArea should never call neither acceptChanges() nor rejectChanges() because of the following problems:
         *
         * 1) acceptChanges breaks change detection. If we call acceptChanges then the owner of the record has no easy
         * way to know if the record has changed, because isChanged() will return an empty array.
         *
         * 2) rejectChanges() doesn't work if nobody calls acceptChanges() between commits. For example, this scenario
         * wouldn't work: start editing - make changes - commit - start editing again - make changes - cancel. If
         * acceptChanges() is never called then rejectChanges() will revert everything, not just changes made since last commit.
         */
        const changedFields = this._editingObject.getChanged();
        if (changedFields) {
            changedFields.forEach((field) => {
                (this._options.editingObject || this._options.editObject).set(
                    field,
                    this._editingObject.get(field)
                );
            });
        }

        /* При старте редактирования в стейт кладется клон
         * Нужно вернуть оригинальную запись, чтобы при изменении в ней изменения отражались в контроле
         */
        this._editingObject = this._options.editingObject || this._options.editObject;
    }

    static getDefaultOptions(): IViewControlOptions {
        return {
            autoEdit: false,
            toolbarVisible: false,
            shouldActivateInput: true,
        };
    }
}
