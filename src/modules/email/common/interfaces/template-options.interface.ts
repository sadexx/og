export interface IEmailTemplateOptions {
  subject: string;
  text: string;
  userName: string;
  customMessage: string;
  actionMessage: string;
  detailedMessage: string;
  codeOrDate?: number | string | null;
}
