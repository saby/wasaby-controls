/**
 * Библиотека платформенных команд
 * @library Controls-Actions/commands
 * @public
 */

export { default as OutflowRuleChooserEditor } from './_commands/CreateOutflow/OutflowRuleChooserEditor';
export { default as OutBillRuleChooserEditor } from './_commands/CreateBill/OutBillRuleChooserEditor';
export { default as OrderRuleChooserEditor } from './_commands/CreateOrder/OrderRuleChooserEditor';

export { default as OpenLink } from './_commands/OpenLink';
export { default as OpenRoute } from './_commands/OpenRoute';
export { default as GetSignature } from './_commands/GetSignature';
export { default as OpenEDODialog } from './_commands/OpenEDODialog';
export { default as CopyCertificate } from './_commands/CopyCertificate';
export { default as CreateNote } from './_commands/CreateNote';
export { default as CreateNews } from './_commands/CreateNews';
export { default as CreateMeeting } from './_commands/CreateMeeting';
export { default as CreateReport } from './_commands/CreateReport';
export { default as CreateBuhReport } from './_commands/CreateBuhReport';
export { default as CreateClient } from './_commands/CreateClient';
export { default as CreateTask } from './_commands/CreateTask';
export { default as CreatePowerOfAttorney } from './_commands/CreatePowerOfAttorney';
export { default as CreatePowerOfAttorneyInv } from './_commands/CreatePowerOfAttorneyInv';
export { default as CreateEvent } from './_commands/CreateEvent';
export { default as CreateBill } from './_commands/CreateBill';
export { default as CreateOutflow } from './_commands/CreateOutflow';
export { default as CreateOrder } from './_commands/CreateOrder';
export { default as CreateCRMReport } from './_commands/CreateCRMReport';
export { default as CreateContactCenterReport } from './_commands/CreateContactCenterReport';
export { default as CreateMessage } from './_commands/CreateMessage';
export { default as VideoCall } from './_commands/VideoCall';
export { default as CreateLead } from './_commands/CreateLead';
export { default as CreateList } from './_commands/CreateList';
export { default as OpenEDOInvitations } from './_commands/OpenEDOInvitations';
export { default as CreateTelephonyReport } from './_commands/CreateTelephonyReport';
export { default as CreateCEDWDoc } from './_commands/CreateCEDWDoc';
export { default as CreateMotivationDoc } from './_commands/CreateMotivationDoc';
export { default as CreateMotivationReport } from './_commands/CreateMotivationReport';
export { default as RecruitmentCommand } from './_commands/RecruitmentCommand';
export { default as CreateOFDReport } from './_commands/CreateOFDReport';
export { default as Upload } from './_commands/Upload';
export { default as UploadFile } from './_commands/UploadFile';
export { default as CreateEmployeeAppointment } from './_commands/CreateEmployeeAppointment';
export { default as CreateEmployeeMiniCard } from './_commands/CreateEmployeeMiniCard';
export { default as OpenSupportChat } from './_commands/OpenSupportChat';
export { default as OpenFeedback } from './_commands/OpenFeedback';
export { default as OpenReport } from './_commands/OpenReport';
export { default as OpenUniSendMenu } from './_commands/OpenUniSendMenu';
export { default as CreateSalaryReference } from './_commands/CreateSalaryReference';
export { default as OpenMonitoringDialog } from './_commands/OpenMonitoringDialog';

// PG editors
export { default as OpenLinkEditor } from './_commands/OpenLinkEditor/OpenLinkEditor';
export { default as RuleChooserEditor } from './_commands/CreateTask/RuleChooserEditor';
export { default as ClientTypeEditor } from './_commands/CreateClient/ClientTypeEditor';
export { default as EventTypeEditor } from './_commands/CreateEvent/EventTypeEditor';
export { default as ReportTypeEditor } from './_commands/CreateCRMReport/ReportTypeEditor';
export { default as BuhReportTypeEditor } from './_commands/CreateBuhReport/ReportTypeEditor';
export { default as ContactCenterReportTypeEditor } from './_commands/CreateContactCenterReport/ReportTypeEditor';
export { default as LeadThemeEditor } from './_commands/CreateLead/LeadThemeEditor';
export { default as TelephonyReportTypeEditor } from './_commands/CreateTelephonyReport/ReportTypeEditor';
export { default as CEDWRuleDropdown } from './_commands/CreateCEDWDoc/RuleDropdown';
export { default as MotivationKindEditor } from './_commands/CreateMotivation/MotivationKindEditor';
export { default as MotivationReportTypeEditor } from './_commands/CreateMotivation/MotivationReportTypeEditor';
export { default as VacancyRuleEditor } from './_commands/CreateVacancy/RuleEditor';
export { default as RecruitmentEventTypeEditor } from './_commands/CreateRecruitmentEvent/TypeEditor';
export { default as RecruitmentReportTypeEditor } from './_commands/CreateRecruitmentReport/ReportTypeEditor';
export { default as OFDReportTypeEditor } from './_commands/CreateOFDReport/ReportTypeEditor';
export { default as EmployeeAppointmentEditor } from './_commands/CreateEmployeeAppointment/EmployeeAppointmentEditor';
export { default as OpenReportEditor } from './_commands/OpenReport/ReportTypeEditor';
export { default as WidgetEditor } from './_commands/OpenFeedback/WidgetEditor';
export { default as UploadChooserEditor } from './_commands/Upload/UploadChooserEditor';

// Factory configs
export { FactoryConfig as CreateTaskFactoryConfig } from './_commands/CreateTask/FactoryConfig';
export { FactoryConfig as CreateClientFactoryConfig } from './_commands/CreateClient/FactoryConfig';
export { FactoryConfig as CreateOutflowFactoryConfig } from './_commands/CreateOutflow/FactoryConfig';
export { FactoryConfig as CreateExpenseReportFactoryConfig } from './_commands/CreateExpenseReport/FactoryConfig';
export { FactoryConfig as CreateEventFactoryConfig } from './_commands/CreateEvent/FactoryConfig';
export { FactoryConfig as UploadDataFactoryConfig } from './_commands/Upload/FactoryConfig';
export { FactoryConfig as CreateBillFactoryConfig } from './_commands/CreateBill/FactoryConfig';
export { FactoryConfig as CreateOrderFactoryConfig } from './_commands/CreateOrder/FactoryConfig';
export { FactoryConfig as CreateLeadFactoryConfig } from './_commands/CreateLead/FactoryConfig';

// Factories
export { default as CreateTaskFactory } from './_commands/CreateTask/Factory';
export { default as CreateClientFactory } from './_commands/CreateClient/Factory';
export { default as CreateOutflowFactory } from './_commands/CreateOutflow/Factory';
export { default as CreateExpenseReportFactory } from './_commands/CreateExpenseReport/Factory';
export { default as CreateEventFactory } from './_commands/CreateEvent/Factory';
export { default as UploadFactory } from './_commands/Upload/Factory';
export { default as CreateBillFactory } from './_commands/CreateBill/Factory';
export { default as CreateOrderFactory } from './_commands/CreateOrder/Factory';
export { default as CreateLeadFactory } from './_commands/CreateLead/Factory';

export { getRegulationItems } from './_commands/Utils';
export { getOutflowItems } from './_commands/CreateOutflow/Factory';
export { getClientsItems } from './_commands/CreateClient/Factory';
export { getReportItems } from './_commands/CreateExpenseReport/Factory';
export { getEventItems } from './_commands/CreateEvent/Factory';
