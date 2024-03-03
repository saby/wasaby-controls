import {
    IActionConfig,
    IActionRightsWithRestriction,
    TActionRights,
} from 'Controls-Actions/interface/IActionConfig';
import * as translate from 'i18n!Controls-Actions';

const actions: IActionConfig[] = [
    {
        type: 'openLinkAction',
        info: {
            title: translate('Открыть ссылку'),
            category: translate('Аккаунт и расширения', 'Виджет'),
            icon: 'icon-GoTo',
        },
        commandName: 'Controls-Actions/commands:OpenLink',
        commandOptions: {
            blankTarget: true,
        },
        propTypes: [
            {
                name: 'link',
                type: 'string',
                editorOptions: {
                    placeholder: translate('Вставьте ссылку'),
                },
                validators: ['Controls/validate:isRequired'],
            },
            {
                name: 'blankTarget',
                type: 'boolean',
                caption: translate('В новой вкладке'),
            },
        ],
    },
    {
        type: 'createNote',
        info: {
            title: translate('Создать заметку'),
            category: translate('Аккаунт и расширения', 'Виджет'),
            icon: 'icon-AddNote',
        },
        commandName: 'Controls-Actions/commands:CreateNote',
    },
    {
        type: 'createTask',
        info: {
            title: translate('Создать задачу'),
            category: translate('Аккаунт и расширения', 'Виджет'),
            icon: 'icon-Addition',
        },
        commandName: 'Controls-Actions/commands:CreateTask',
        commandOptions: { docType: 'СлужЗап' },
        propTypes: [
            {
                name: 'regulations',
                type: 'string',
                editorTemplateName: 'Controls-Actions/commands:RuleChooserEditor',
                editorOptions: { docType: 'СлужЗап' },
                validators: ['Controls/validate:isRequired'],
            },
        ],
        rights: ['Служебные записки'],
    },
    {
        type: 'getSignature',
        info: {
            title: translate('Получить электронную подпись'),
            category: translate('Аккаунт и расширения', 'Виджет'),
            icon: 'icon-Signature',
        },
        commandName: 'Controls-Actions/commands:GetSignature',
        rights: ['Электронные подписи'],
    },
    {
        type: 'copyCertificate',
        info: {
            title: translate('Скопировать сертификат'),
            category: translate('Аккаунт и расширения', 'Виджет'),
            icon: 'icon-Paste',
        },
        commandName: 'Controls-Actions/commands:CopyCertificate',
        rights: ['Электронные подписи'],
    },
    {
        type: 'askQuestion',
        info: {
            title: translate('Задать вопрос онлайн'),
            category: translate('Аккаунт и расширения', 'Виджет'),
            icon: 'icon-Question2',
        },
        commandName: 'Controls-Actions/commands:AskQuestion',
        rights: [
            {
                zone: 'claims_client',
                restriction: 'SupportChatsSaby',
            },
        ],
    },
    {
        type: 'expenseReport',
        info: {
            title: translate('Создать авансовый отчет'),
            category: translate('Отчетность и бухгалтерия', 'Виджет'),
            icon: 'icon-MoneyPrice',
        },
        commandName: 'Controls-Actions/commands:CreateTask',
        commandOptions: { docType: 'АвансОтчет' },
        propTypes: [
            {
                name: 'regulations',
                type: 'string',
                editorTemplateName: 'Controls-Actions/commands:RuleChooserEditor',
                editorOptions: { docType: 'АвансОтчет' },
                validators: ['Controls/validate:isRequired'],
            },
        ],
        rights: ['Авансовые отчеты'],
    },
    {
        type: 'createReport',
        info: {
            title: translate('Создать отчет'),
            category: translate('Отчетность и бухгалтерия', 'Виджет'),
            icon: 'icon-FillintheInformation',
        },
        commandName: 'Controls-Actions/commands:CreateReport',
        rights: ['Only real outcoming report'],
    },
    {
        type: 'sendInvoice',
        info: {
            title: translate('Отправить счет-фактуру, накладную, акт'),
            category: translate('Отчетность и бухгалтерия', 'Виджет'),
            icon: 'icon-Agreed',
        },
        commandName: 'Controls-Actions/commands:CreateOutflow',
        rights: ['Реализация товаров и услуг'],
    },
    {
        type: 'registerIncomingCorrespondence',
        info: {
            title: translate('Зарегистрировать входящее письмо'),
            category: translate('Документооборот и EDI', 'Виджет'),
            icon: 'icon-IncomingMail',
        },
        commandName: 'Controls-Actions/commands:OpenEDODialog',
        commandOptions: {
            ИдРегламента: 'fd8005d0-4dc5-11e2-9d67-2338fa397d2e',
            'ТипДокумента.ТипДокумента': 'КоррВх',
        },
        rights: ['Входящая корреспонденция'],
    },
    {
        type: 'registerOutgoingCorrespondence',
        info: {
            title: translate('Зарегистрировать исходящее письмо'),
            category: translate('Документооборот и EDI', 'Виджет'),
            icon: 'icon-OutgoingMail',
        },
        commandName: 'Controls-Actions/commands:OpenEDODialog',
        commandOptions: {
            ИдРегламента: 'ad2d4160-6303-475d-bf4b-6a7b25459286',
            'ТипДокумента.ТипДокумента': 'КоррИсх',
        },
        rights: ['Исходящая корреспонденция'],
    },
    {
        type: 'sendEmailToCorrespondent',
        info: {
            title: translate('Отправить письмо контрагенту в online.sbis.ru'),
            category: translate('Документооборот и EDI', 'Виджет'),
            icon: 'icon-Mail',
        },
        commandName: 'Controls-Actions/commands:OpenEDODialog',
        commandOptions: {
            ИдРегламента: 'ad2d4160-6303-475d-bf4b-6a7b25459286',
            'ТипДокумента.ТипДокумента': 'КоррИсх',
        },
        rights: ['Исходящая корреспонденция'],
    },
    {
        type: 'sendEDOInvitations',
        info: {
            title: translate('Роуминг с контрагентом'),
            category: translate('Документооборот и EDI', 'Виджет'),
            icon: 'icon-Send',
        },
        commandName: 'Controls-Actions/commands:OpenEDOInvitations',
        commandOptions: { notSelectedOperator: true },
    },
    {
        type: 'uploadFile',
        info: {
            title: translate('Загрузить файл'),
            category: translate('Документооборот и EDI', 'Виджет'),
            icon: 'icon-Attach',
        },
        commandName: 'Controls-Actions/commands:UploadFile',
    },
    {
        type: 'selling',
        info: {
            title: translate('Продажа'),
            category: translate('Торговля и производство', 'Виджет'),
            icon: 'icon-currentCurrency',
        },
        commandName: 'Controls-Actions/commands:CreateOutflow',
        propTypes: [
            {
                name: 'regulations',
                type: 'string',
                editorTemplateName: 'Controls-Actions/commands:OutflowRuleChooserEditor',
                validators: ['Controls/validate:isRequired'],
            },
        ],
        rights: ['РеализацияТоваровИУслуг - service'],
    },
    {
        type: 'createBill',
        info: {
            title: translate('Создать счет'),
            category: translate('CRM и облачная АТС', 'Виджет'),
            icon: 'icon-Purchases',
        },
        commandName: 'Controls-Actions/commands:CreateBill',
        propTypes: [
            {
                name: 'regulations',
                type: 'string',
                editorTemplateName: 'Controls-Actions/commands:OutBillRuleChooserEditor',
                validators: ['Controls/validate:isRequired'],
            },
        ],
        rights: ['Исходящие счета'],
    },
    {
        type: 'createOrder',
        info: {
            title: translate('Наряд'),
            category: translate('Торговля и производство', 'Виджет'),
            icon: 'icon-Trade',
        },
        commandName: 'Controls-Actions/commands:CreateOrder',
        propTypes: [
            {
                name: 'regulations',
                type: 'string',
                editorTemplateName: 'Controls-Actions/commands:OrderRuleChooserEditor',
                validators: ['Controls/validate:isRequired'],
            },
        ],
        rights: ['Наряды'],
    },
    {
        type: 'createClient',
        info: {
            title: translate('Создать клиента'),
            category: translate('CRM и облачная АТС', 'Виджет'),
            icon: 'icon-Client2',
        },
        commandName: 'Controls-Actions/commands:CreateClient',
        propTypes: [
            {
                name: 'clientType',
                type: 'string',
                editorTemplateName: 'Controls-Actions/commands:ClientTypeEditor',
                validators: ['Controls/validate:isRequired'],
            },
        ],
        rights: ['Контрагенты'],
    },
    {
        type: 'openReport',
        info: {
            title: translate('Создать отчет'),
            category: translate('Аккаунт и расширения', 'Виджет'),
            icon: 'icon-STAT',
        },
        commandName: 'Controls-Actions/commands:OpenReport',
        propTypes: [
            {
                name: 'reportType',
                type: 'object',
                editorTemplateName: 'Controls-Actions/commands:OpenReportEditor',
                validators: ['Controls/validate:isRequired'],
            },
        ],
    },
    {
        type: 'createMessage',
        info: {
            title: translate('Создать сообщение'),
            category: translate('Вебинары и коммуникации', 'Виджет'),
            icon: 'icon-EmptyMessage',
        },
        commandName: 'Controls-Actions/commands:CreateMessage',
    },
    {
        type: 'videoCall',
        info: {
            title: translate('Позвонить'),
            category: translate('Вебинары и коммуникации', 'Виджет'),
            icon: 'icon-VideoCall2',
        },
        commandName: 'Controls-Actions/commands:VideoCall',
    },
    {
        type: 'createNews',
        info: {
            title: translate('Создать новость'),
            category: translate('Вебинары и коммуникации', 'Виджет'),
            icon: 'icon-News',
        },
        commandName: 'Controls-Actions/commands:CreateNews',
    },
    {
        type: 'createEvent',
        info: {
            title: translate('Создать событие'),
            category: translate('CRM и облачная АТС', 'Виджет'),
            icon: 'icon-Offline',
        },
        commandName: 'Controls-Actions/commands:CreateEvent',
        propTypes: [
            {
                name: 'eventType',
                type: 'string',
                editorTemplateName: 'Controls-Actions/commands:EventTypeEditor',
                validators: ['Controls/validate:isRequired'],
            },
            {
                name: 'planedEvent',
                type: 'boolean',
                defaultValue: false,
                caption: 'Плановое',
            },
        ],
        rights: ['leads'],
    },
    {
        type: 'createMeeting',
        info: {
            title: translate('Создать совещание'),
            category: translate('Вебинары и коммуникации', 'Виджет'),
            icon: 'icon-Groups',
        },
        commandName: 'Controls-Actions/commands:CreateMeeting',
        propTypes: [
            {
                name: 'regulation',
                type: 'string',
                editorTemplateName: 'Controls-Actions/commands:MeetingRegulationEditor',
                validators: ['Controls/validate:isRequired'],
            },
        ],
        rights: ['Совещания'],
    },
    {
        type: 'createLead',
        info: {
            title: translate('Создать сделку'),
            category: translate('CRM и облачная АТС', 'Виджет'),
            icon: 'icon-Lead',
        },
        commandName: 'Controls-Actions/commands:CreateLead',
        propTypes: [
            {
                name: 'themeData',
                type: 'string',
                editorTemplateName: 'Controls-Actions/commands:LeadThemeEditor',
                validators: ['Controls/validate:isRequired'],
            },
        ],
        rights: ['leads'],
    },
    {
        type: 'createList',
        info: {
            title: translate('Создать список клиентов'),
            category: translate('CRM и облачная АТС', 'Виджет'),
            icon: 'icon-ListView',
        },
        commandName: 'Controls-Actions/commands:CreateList',
        rights: ['Продажи'],
    },
    {
        type: 'openSupportChat',
        info: {
            title: `${translate('Открыть чат')} "${translate('Поддержка СБИС')}"`,
            category: translate('Контакт-центр'),
            icon: 'icon-Chat',
        },
        commandName: 'Controls-Actions/commands:OpenSupportChat',
    },
    {
        type: 'createTelephonyReport',
        info: {
            title: translate('Создать отчет'),
            category: translate('Телефония'),
            icon: 'icon-STAT',
        },
        commandName: 'Controls-Actions/commands:CreateTelephonyReport',
        propTypes: [
            {
                name: 'reportType',
                type: 'string',
                editorTemplateName: 'Controls-Actions/commands:TelephonyReportTypeEditor',
            },
        ],
    },
    {
        type: 'createVacation',
        info: {
            title: translate('Создать отпуск'),
            category: translate('Кадровый ЭДО'),
            icon: 'icon-VacationNull',
        },
        commandName: 'Controls-Actions/commands:CreateCEDWDoc',
        commandOptions: { docType: 'Отпуск' },
        propTypes: [
            {
                name: 'regulation',
                type: 'string',
                editorTemplateName: 'Controls-Actions/commands:CEDWRuleDropdown',
                editorOptions: {
                    docType: 'Отпуск',
                    keyProperty: 'Id',
                    displayProperty: 'Title',
                    parentProperty: 'ParentId',
                    nodeProperty: 'Node',
                },
                validators: ['Controls/validate:isRequired'],
            },
        ],
        rights: [],
    },
    {
        type: 'writeStatement',
        info: {
            title: translate('Написать заявление'),
            category: translate('Кадровый ЭДО'),
            icon: 'icon-TFDocument',
        },
        commandName: 'Controls-Actions/commands:CreateCEDWDoc',
        commandOptions: { docType: 'StaffStatements' },
        propTypes: [
            {
                name: 'regulation',
                type: 'string',
                editorTemplateName: 'Controls-Actions/commands:CEDWRuleDropdown',
                editorOptions: {
                    docType: 'StaffStatements',
                    keyProperty: 'ComplexKey',
                },
                validators: ['Controls/validate:isRequired'],
            },
        ],
        rights: [],
    },
    {
        type: 'createTimeOff',
        info: {
            title: translate('Создать отгул'),
            category: translate('Кадровый ЭДО'),
            icon: 'icon-SelfVacation',
        },
        commandName: 'Controls-Actions/commands:CreateCEDWDoc',
        commandOptions: { docType: 'Отгул' },
        rights: [],
    },
    {
        type: 'createBusinessTrip',
        info: {
            title: translate('Создать командировку'),
            category: translate('Кадровый ЭДО'),
            icon: 'icon-statusDeparted',
        },
        commandName: 'Controls-Actions/commands:CreateCEDWDoc',
        commandOptions: { docType: 'BusinessTrip' },
        propTypes: [
            {
                name: 'regulation',
                type: 'string',
                editorTemplateName: 'Controls-Actions/commands:CEDWRuleDropdown',
                editorOptions: { docType: 'BusinessTrip' },
                validators: ['Controls/validate:isRequired'],
            },
        ],
        rights: [],
    },
    {
        type: 'createIncentive',
        info: {
            title: translate('Создать поощрение'),
            category: translate('Мотивация'),
            icon: 'icon-ThumbUpBig',
        },
        commandName: 'Controls-Actions/commands:CreateMotivationDoc',
        commandOptions: { type: 0 },
        propTypes: [
            {
                name: 'regulation',
                type: 'string',
                editorTemplateName: 'Controls-Actions/commands:MotivationKindEditor',
                editorOptions: { type: 0 },
                validators: ['Controls/validate:isRequired'],
            },
        ],
        rights: ['Поощрения и взыскания'],
    },
    {
        type: 'createPenalty',
        info: {
            title: translate('Создать взыскание'),
            category: translate('Мотивация'),
            icon: 'icon-ThumbDownBig',
        },
        commandName: 'Controls-Actions/commands:CreateMotivationDoc',
        commandOptions: { type: 1 },
        propTypes: [
            {
                name: 'regulation',
                type: 'string',
                editorTemplateName: 'Controls-Actions/commands:MotivationKindEditor',
                editorOptions: { type: 1 },
                validators: ['Controls/validate:isRequired'],
            },
        ],
        rights: ['Поощрения и взыскания'],
    },
    {
        type: 'createMotivationReport',
        info: {
            title: translate('Создать отчет'),
            category: translate('Мотивация'),
            icon: 'icon-STAT',
        },
        commandName: 'Controls-Actions/commands:CreateMotivationReport',
        propTypes: [
            {
                name: 'reportType',
                type: 'string',
                editorTemplateName: 'Controls-Actions/commands:MotivationReportTypeEditor',
                validators: ['Controls/validate:isRequired'],
            },
        ],
        rights: ['Поощрения и взыскания'],
    },
    {
        type: 'createCandidate',
        info: {
            title: translate('Создать кандидата'),
            category: translate('Подбор персонала'),
            icon: 'icon-Profile',
        },
        commandName: 'Controls-Actions/commands:RecruitmentCommand',
        commandOptions: {
            commandName: 'createCandidate',
        },
        rights: ['Кандидаты на работу'],
    },
    {
        type: 'uploadResume',
        info: {
            title: translate('Загрузить резюме'),
            category: translate('Подбор персонала'),
            icon: 'icon-DownloadNew',
        },
        commandName: 'Controls-Actions/commands:RecruitmentCommand',
        commandOptions: {
            commandName: 'uploadResume',
        },
        rights: ['Кандидаты на работу'],
    },
    {
        type: 'createVacancy',
        info: {
            title: translate('Создать вакансию'),
            category: translate('Подбор персонала'),
            icon: 'icon-TFDocument',
        },
        propTypes: [
            {
                name: 'ruleId',
                type: 'string',
                editorTemplateName: 'Controls-Actions/commands:VacancyRuleEditor',
                validators: ['Controls/validate:isRequired'],
            },
        ],
        commandName: 'Controls-Actions/commands:RecruitmentCommand',
        commandOptions: {
            commandName: 'createVacancy',
        },
        rights: ['Подбор персонала'],
    },
    {
        type: 'createRecruitmentEvent',
        info: {
            title: translate('Создать событие'),
            category: translate('Подбор персонала'),
            icon: 'icon-Calendar2',
        },
        propTypes: [
            {
                name: 'eventInfo',
                type: 'object',
                editorTemplateName: 'Controls-Actions/commands:RecruitmentEventTypeEditor',
                validators: ['Controls/validate:isRequired'],
            },
        ],
        commandName: 'Controls-Actions/commands:RecruitmentCommand',
        commandOptions: {
            commandName: 'createEvent',
        },
        rights: ['События по кандидатам', 'Кандидаты на работу'],
        rightmode: 10,
    },
    {
        type: 'createRecruitmentReport',
        info: {
            title: translate('Создать отчет'),
            category: translate('Подбор персонала'),
            icon: 'icon-STAT',
        },
        propTypes: [
            {
                name: 'reportType',
                type: 'string',
                editorTemplateName: 'Controls-Actions/commands:RecruitmentReportTypeEditor',
                validators: ['Controls/validate:isRequired'],
            },
        ],
        commandName: 'Controls-Actions/commands:RecruitmentCommand',
        commandOptions: {
            commandName: 'openReport',
        },
        rights: [
            {
                zone: 'Подбор персонала',
                requiredLevel: 'read',
            },
        ],
    },
    {
        type: 'createOFDReport',
        info: {
            title: translate('Создать отчет'),
            category: translate('Кассы/ОФД'),
            icon: 'icon-STAT',
        },
        commandName: 'Controls-Actions/commands:CreateOFDReport',
        propTypes: [
            {
                name: 'reportType',
                type: 'string',
                editorTemplateName: 'Controls-Actions/commands:OFDReportTypeEditor',
                validators: ['Controls/validate:isRequired'],
            },
        ],
    },
    {
        type: 'createEmployeeAppointment',
        info: {
            title: translate('Запись к сотруднику'),
            category: translate('Вебинары и коммуникации', 'Виджет'),
            icon: 'icon-TimeSkinny',
        },
        commandName: 'Controls-Actions/commands:CreateEmployeeAppointment',
        propTypes: [
            {
                name: 'queueInfo',
                type: 'object',
                editorTemplateName: 'Controls-Actions/commands:EmployeeAppointmentEditor',
                validators: ['Controls/validate:isRequired'],
            },
        ],
        rights: [],
    },
    {
        type: 'universalSendAction',
        info: {
            title: translate('Отправить'),
            category: translate('Отправка документа', 'Виджет'),
            icon: 'icon-SabyBird',
        },
        commandName: 'Controls-Actions/commands:OpenUniSendMenu',
        propTypes: [
            {
                type: 'string',
                name: 'docId',
                caption: translate('Идентификатор документа'),
                captionPosition: 'top'
            },
            {
                type: 'string',
                name: 'docSource',
                caption: translate('Идентификатор регламента'),
                captionPosition: 'top'
            },
            {
                type: 'string',
                name: 'docType',
                caption: translate('Тип документа'),
                captionPosition: 'top'
            },
            {
                type: 'number',
                name: 'orgId',
                caption: translate('Идентификатор нашей организации'),
                captionPosition: 'top'
            }
        ],
        rights: [
            {
                zone: 'Отправка писем',
                requiredLevel: 'modify',
            }
        ]
    }
];

export default actions.map((action, index) => {
    return {
        ...action,
        info: {
            ...action.info,
            order: index,
        },
    };
}) as IActionConfig[];

export { IActionConfig, IActionRightsWithRestriction, TActionRights };