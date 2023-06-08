/**
 * @kaizen_zone 7932f75e-2ad3-49ad-b51a-724eb5c140eb
 */
import { Control } from 'UI/Base';
import IControllerBase from 'Controls/_form/interface/IControllerBase';
import { ErrorController } from 'Controls/error';
import { CrudEntityKey, Memory, SbisService } from 'Types/source';
import { INITIALIZING_WAY } from 'Controls/_form/FormController';

/**
 * Интерфейс для контроллера редактирования записи.
 *
 * @extends Controls/_form/interface/IControllerBase
 * @public
 */

export default interface IFormController extends IControllerBase {
    /**
     * @cfg {Memory | SbisService} Источник данных.
     */
    source?: Memory | SbisService;
    /**
     * @cfg {String} Ключ, с помощью которого будет получена запись.
     */
    entityKey?: string;
    /**
     * @cfg {Boolean} Флаг "Новая запись" означает, что запись инициализируется в источнике данных, но не сохраняется.
     * Если запись помечена флагом isNewRecord, то при сохранении записи запрос на БЛ будет выполнен, даже если запись не изменена.
     * Также при уничтожении контрола будет вызвано удаление записи.
     */
    isNewRecord?: boolean;
    /**
     * @cfg {Object} Задает ассоциативный массив, который используется только при создании новой записи для инициализации её начальными значениями. Создание записи выполняется методом, который задан в опции {@link Types/source:ICrud#create}.
     * Также, это значение по умолчанию метода create.
     */
    createMetaData?: object;
    /**
     * @cfg {Object} Устанавливает набор инициализирующих значений, которые будут использованы при чтении записи. Подробнее {@link Types/source:ICrud#read}.
     * Также, это значение по умолчанию для метода read.
     */
    readMetaData?: object;
    /**
     * @cfg {Object} Устанавливает набор инициализирующих значений, которые будут использованы при уничтожении "черновика". Подробнее {@link Types/source:ICrud#destroy}
     * Также, это значение по умолчанию для метода destroy.
     */
    destroyMetaData?: object;
    /**
     * @cfg {Object} Дополнительные данные, которые будут переданы в метод записи. Подробнее {@link Types/source:ICrud#update}.
     */
    updateMetaData?: object;
    /**
     * @cfg {Controls/dataSource:error.Container} Компонент для отображения ошибки, он оборачивает весь контент формы.
     * Способ отображения ошибки (диалог, вместо контента или во всю страницу) настраивается через переопределение {@link errorController}.
     * Данную опцию следует определять, если нужно как-то изменить раскладку контента в случае ошибки, если раскладка контрола {@link Controls/_dataSource/_error/Container}, который используется по умолчанию, не устраивает.
     *
     * Про обработку ошибок, возникающих в процессе работы Controls/form:Controller, читайте {@link /doc/platform/developmentapl/interface-development/application-architecture/error-handling/error-handling-controls/#customize-error-handling-form-controller здесь}
     */
    errorContainer?: typeof Control;
    /**
     * @cfg {Controls/error:ErrorController} Компонент для обработки ошибки.
     * Данную опцию следует определять, если нужно изменить способ отображения ошибки (диалог, вместо контента или во всю страницу) или добавить свои обработчики ошибок.
     *
     * Про обработку ошибок, возникающих в процессе работы Controls/form:Controller, читайте {@link /doc/platform/developmentapl/interface-development/application-architecture/error-handling/error-handling-controls/#customize-error-handling-form-controller здесь}
     */
    errorController?: ErrorController;
    /**
     * @demo Controls-demo/FormController/InitializingWay/Index
     * @cfg {String} Устанавливает способ инициализации данных диалога редактирования.
     * @variant preload В этом режиме FormController строится без данных, ожидая что запись появится на фазе обновления. Используется совместно с режимом предзагрузки данных при построении контрола. Подробнее см опцию {@link Controls/popup:IBaseOpener#dataLoaders}
     * @variant local Верстка контрола строится по записи, переданной в опцию {@link Controls/form:IFormController#record record}, запроса на БЛ нет.
     * @variant read Перед построением верстки выполняется метод "Прочитать" по ключу, переданному в опцию {@link Controls/form:IFormController#key key}. Построение <b>дожидается</b> ответа БЛ.
     * @variant create Перед построением верстки выполняется метод "Создать", построение <b>дожидается</b> ответа БЛ.
     * @variant delayedRead Верстка контрола строится по записи, переданной в опцию {@link Controls/form:IFormController#record record}, параллельно выполняется метод "Прочитать" по ключу,
     * переданному в опции {@link Controls/form:IFormController#key key}.
     * Построение вёрстки контрола <b>не дожидается</b> ответа БЛ.
     * @variant delayedCreate Верстка контрола строится по записи, переданной в опцию
     * {@link Controls/form:IFormController#record record}, параллельно выполняется метод "Создать".
     * Построение вёрстки контрола <b>не дожидается</b> ответа БЛ.
     * @example
     * <pre class="brush: html; highlight: [2]">
     * <!-- WML -->
     * <Controls.form:Controller initializingWay={{_myInitializingWay}}”>
     *    ...
     * </Controls.form:Controller>
     * </pre>
     * <pre class="brush: js;; highlight: [4]">
     * // TypeScript
     * import {INITIALIZING_WAY} from 'Controls/form';
     * _beforeMount() {
     *     this._myInitializingWay = INITIALIZING_WAY.CREATE;
     * }
     * </pre>
     */
    initializingWay?: INITIALIZING_WAY;
}

/**
 * @typedef {Object} Controls/form:IFormController/CrudConfig
 * @description Параметр Crud операций.
 * @property {Boolean} [showLoadingIndicator=true] Отображение индикатора
 */

/**
 * Обновляет запись в источнике данных. Подробнее {@link Types/source:ICrud#update}.
 * @function Controls/form:IFormController#update
 * @param {Controls/form:IControllerBase/UpdateConfig.typedef} config Параметр сохранения.
 * @return {Promise<Deferred<number>>}
 * @example
 * Передаем доп данные в update и выключаем индикатор.
 * <pre class="brush: js;">
 *    // TypeScript
 *    _saveButtonClickHandler(): Promise<Deferred<number>> {
 *        return this._children.formController.update({
 *            showIndicator: false,
 *            additionalData: {
 *                someField: 'someValue'
 *            }
 *        });
 *    }
 * </pre>
 */

/**
 * Создает пустую запись через источник данных. Подробнее {@link Types/source:ICrud#create}.
 * @function Controls/form:IFormController#create
 * @param {Object} createMetaData
 * @param {Controls/form:IFormController/CrudConfig.typedef} config
 */

/**
 * Считывает запись из источника данных. Подробнее {@link Types/source:ICrud#read}.
 * @function Controls/form:IFormController#read
 * @param {String} key
 * @param {Object} readMetaData
 * @param {Controls/form:IFormController/CrudConfig.typedef} config
 */

/**
 * Удаляет запись из источника данных. Подробнее {@link Types/source:ICrud#delete}.
 * @function Controls/form:IFormController#delete
 * @param {Object} destroyMetaData
 * @param {Controls/form:IFormController/CrudConfig.typedef} config
 */

/**
 * Запускает процесс валидации.
 * @function Controls/form:IFormController#validate
 * @returns {Promise<Controls/validate:IValidateResult|Error>}
 */

/**
 * @event createSuccessed Происходит, когда запись создана успешно.
 * @name Controls/form:IFormController#createSuccessed
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} record Редактируемая запись.
 * @see createFailed
 */

/**
 * @event createFailed Происходит, когда запись создать не удалось.
 * @name Controls/form:IFormController#createFailed
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Error} Error
 * @see createSuccessed
 */

/**
 * @event readSuccessed Происходит, когда запись прочитана успешно.
 * @name Controls/form:IFormController#readSuccessed
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} record Редактируемая запись.
 * @see readFailed
 */

/**
 * @event readFailed Происходит, когда запись прочитать не удалось.
 * @name Controls/form:IFormController#readFailed
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Error} Error
 * @see readSuccessed
 */

/**
 * @event updateSuccessed Происходит, когда запись обновлена успешно.
 * @name Controls/form:IFormController#updateSuccessed
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} record Редактируемая запись.
 * @param {String} key Ключ редактируемой записи.
 * @see updateFailed
 */

/**
 * @event updateFailed Происходит, когда обновить запись не удалось.
 * @name Controls/form:IFormController#updateFailed
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Error} Error
 * @see updateSuccessed
 */

/**
 * @event deleteSuccessed Происходит, когда запись удалена успешно.
 * @name Controls/form:IFormController#deleteSuccessed
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} record Редактируемая запись.
 * @see deleteFailed
 */

/**
 * @event deleteFailed Происходит, когда запись удалить не удалось.
 * @name Controls/form:IFormController#deleteFailed
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Error} Error
 * @see deleteSuccessed
 */

/**
 * @event isNewRecordChanged Происходит, когда запись инициализируется в источнике данных.
 * @name Controls/form:IFormController#isNewRecordChanged
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Boolean} isNewRecord
 */

/**
 * @event requestCustomUpdate Происходит перед сохранением записи.
 * @name Controls/form:IFormController#requestCustomUpdate
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} record Редактируемая запись.
 * @param {Controls/form:IControllerBase/UpdateConfig.typedef} updateConfig Конфиг переданный в метод {@link Controls/form:IFormController#update}.
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
