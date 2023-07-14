/**
 * @kaizen_zone 7932f75e-2ad3-49ad-b51a-724eb5c140eb
 */
import { IControlOptions } from 'UI/Base';
import { Model } from 'Types/entity';

/**
 * Интерфейс для котрола, реализующего функционал редактирования записи.
 * @public
 */
export interface IControllerBase extends IControlOptions {
    /**
     * @cfg {Types/entity:Model} Запись, по данным которой будет инициализирован диалог редактирования.
     */
    record: Model;
    /**
     * @cfg {Function} Функция, которая определяет должно ли показаться окно с подтверждением сохранения/не сохранения измененных данных при закрытии диалога редактирования записи. Необходимо для случаев, когда есть измененные данные, не связанные с рекордом.
     * @remark
     * Если из функции возвращается true, тогда окно покажется, а если false - нет.
     */
    confirmationShowingCallback?: Function;
    /**
     * @cfg {String} Имя свойства элемента, однозначно идентифицирующего элемент коллекции.
     */
    keyProperty?: string;
    /**
     * @cfg {String} Основной текст диалога подтверждения.
     * @default "Сохранить изменения?"
     */
    confirmationMessage?: string;
}

/**
 * @typedef {Object} Controls/form:IControllerBase/UpdateConfig
 * @description Параметр сохранения.
 * @property {Object} updateMetaData Дополнительные данные, которые будут переданы в метод записи.
 * @property {Object} additionalData Дополнительные данные, которые будут обрабатываться при синхронизации записи с реестром.
 * @property {Boolean} [showLoadingIndicator=true] Отображение индикатора
 * @public
 */
export interface IUpdateConfig {
    additionalData?: Record<string, unknown>;
    updateMetaData?: Record<string, unknown>;
    showLoadingIndicator?: boolean;
}

/**
 * Вызывает сохранение записи (завершение всех редактирований по месту, валидация).
 * @function Controls/_form/interface/IControllerBase#update
 * @param {Controls/form:IControllerBase/UpdateConfig.typedef} config Параметр сохранения.
 * @return {Promise<unknown | Controls/validate:IValidateResult | Error>}
 */

/**
 * Запускает процесс валидации.
 * @function Controls/_form/interface/IControllerBase#validate
 * @return {Promise<Controls/validate:IValidateResult|Error>}
 */

/**
 * @typedef {Boolean|undefined} Controls/form/TConfirmationDialogResult
 * @variant true Нажата кнопка "Да"
 * @variant false Нажата кнопка "Нет"
 * @variant undefined Нажата кнопка "ОК" или "Отмена"
 */
export type TConfirmationDialogResult = boolean | undefined;

/**
 * @event Controls/_form/interface/IControllerBase#confirmationDialogResult Происходит при нажатии на кнопку диалога подтверждения.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события
 * @param {Controls/form:TConfirmationDialogResult.typedef} answer Результат.
 */

/**
 * @event Controls/_form/interface/IControllerBase#updateSuccessed Происходит, когда запись обновлена успешно (валидация прошла успешно, редактирование по месту завершилось).
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} record Редактируемая запись.
 * @see updateFailed
 */

/**
 * @event Controls/_form/interface/IControllerBase#validationFailed Происходит при ошибке валидации.
 * @param {Array} validationFailed Результаты валидации.
 * @see validationSuccessed
 */

/**
 * @event Controls/_form/interface/IControllerBase#validationSuccessed Происходит при отсутствии ошибок валидации.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @see validationFailed
 */

/**
 * @event Controls/_form/interface/IControllerBase#requestCustomUpdate Происходит перед сохранением записи.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} record Редактируемая запись.
 * @remark
 * В обработчике события можно отменить  базовую логику сохранения (вернуть true) или отложить ее для выполнения пользовательских действий перед сохранением (вернуть Promise<boolean>).
 * Используется, например, для асинхронной валидации или пользовательского сохранения записи.
 * @example
 * Проверяет данные на сервере перед сохранением.
 * <pre class="brush: js;">
 * // TypeScript
 * _requestCustomUpdateHandler(): Promise<boolean> {
 *     return this._checkDataOnServer();
 * }
 * </pre>
 */
