/**
 * @kaizen_zone 7932f75e-2ad3-49ad-b51a-724eb5c140eb
 */
import { IControlOptions } from 'UI/Base';
import { Model } from 'Types/entity';

/**
 * Интерфейс для котрола, реализующего функционал редактирования записи.
 * @interface Controls/form:IControllerBase
 * @public
 */
export default interface IControllerBase extends IControlOptions {
    /**
     * @name Controls/form:IControllerBase#record
     * @cfg {Types/entity:Model} Запись, по данным которой будет инициализирован диалог редактирования.
     */
    record: Model;
    /**
     * @name Controls/form:IControllerBase#confirmationShowingCallback
     * @cfg {Function} Функция, которая определяет должно ли показаться окно с подтверждением сохранения/не сохранения измененных данных при закрытии диалога редактирования записи. Необходимо для случаев, когда есть измененные данные, не связанные с рекордом.
     * @remark
     * Если из функции возвращается true, тогда окно покажется, а если false - нет.
     */
    confirmationShowingCallback?: Function;
    /**
     * @name Controls/form:IControllerBase#keyProperty
     * @cfg {String} Имя свойства элемента, однозначно идентифицирующего элемент коллекции.
     */
    keyProperty?: string;
    /**
     * @name Controls/form:IControllerBase#confirmationMessage
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
 * @function Controls/form:IControllerBase#update
 * @param {Controls/form:IControllerBase/UpdateConfig.typedef} config Параметр сохранения.
 * @return {Promise<void>}
 */

/**
 * Запускает процесс валидации.
 * @function Controls/form:IControllerBase#validate
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
 * @event confirmationDialogResult Происходит при нажатии на кнопку диалога подтверждения.
 * @name Controls/form:IControllerBase#confirmationDialogResult
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события
 * @param {Controls/form:TConfirmationDialogResult.typedef} answer Результат.
 */

/**
 * @event updateSuccessed Происходит, когда запись обновлена успешно (валидация прошла успешно, редактирование по месту завершилось).
 * @name Controls/form:IControllerBase#updateSuccessed
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} record Редактируемая запись.
 * @see updatefailed
 */

/**
 * @event validationFailed Происходит при ошибке валидации.
 * @name Controls/form:IControllerBase#validationFailed
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Array} validationFailed Результаты валидации.
 * @see validationSuccessed
 */

/**
 * @event validationSuccessed Происходит при отсутствии ошибок валидации.
 * @name Controls/form:IControllerBase#validationSuccessed
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @see validationFailed
 */

/**
 * @event requestCustomUpdate Происходит перед сохранением записи.
 * @name Controls/form:IControllerBase#requestCustomUpdate
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
