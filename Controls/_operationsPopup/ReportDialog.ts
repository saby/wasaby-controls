/**
 * @kaizen_zone ddbc0bdc-0710-4e01-9472-8d1982a63a4e
 */
import rk = require('i18n!Controls');
import { Control } from 'UI/Base';
// @ts-ignore
import format = require('Core/helpers/String/format');
import template = require('wml!Controls/_operationsPopup/ReportDialog/ReportDialog');
import 'css!Controls/operationsPopup';

/**
 * Шаблон диалога с результатами массовых операций.
 *
 * @class Controls/_operationsPopup/ReportDialog
 * @extends UI/Base:Control
 *
 * @public
 *
 */
/*
 * The template of the dialog with the results of mass operations.
 *
 * @class Controls/_operationsPopup/ReportDialog
 * @extends UI/Base:Control
 *
 * @author Герасимов А.М.
 * @public
 *
 */
const ReportDialog = Control.extend({
    _template: template,
    _message: null,
    _beforeMount(cfg) {
        if (cfg.operationsCount === cfg.operationsSuccess) {
            this._message = format(
                {
                    count: cfg.operationsCount,
                    record: rk('запись(-и,-ей)', cfg.operationsCount),
                    process: rk('обработана(-ы)', 'ReportDialog', cfg.operationsCount),
                },
                rk('$count$s$ $record$s$ успешно $process$s$')
            );
        } else if (!cfg.errors || !cfg.errors.length) {
            this._message = rk('Выполнение операции завершилось ошибкой');
        } else {
            this._message = format(
                {
                    count: cfg.operationsCount,
                    errors: cfg.operationsCount - cfg.operationsSuccess,
                },
                rk('$errors$s$ из $count$s$ операций были обработаны с ошибкой')
            );
        }
    },
    _onCloseClick() {
        this._notify('close', [], { bubbling: true });
    },
});

/**
 * The title of the operation.
 * @name Controls/_operationsPopup/ReportDialog#title
 * @cfg {String}
 */

/**
 * The number of elements on which the operation was performed.
 * @name Controls/_operationsPopup/ReportDialog#operationsCount
 * @cfg {Number}
 */

/**
 * Number of items for which the operation completed successfully.
 * @name Controls/_operationsPopup/ReportDialog#operationsSuccess
 * @cfg {Number}
 */

/**
 * Error list.
 * @name Controls/_operationsPopup/ReportDialog#errors
 * @cfg {Array.<String>}
 * @remark
 * If the error list is not passed, the default text will be shown.
 */

/**
 * Template displayed at the bottom of the dialog.
 * @name Controls/_operationsPopup/ReportDialog#footerContentTemplate
 * @cfg {Function}
 */
export = ReportDialog;
