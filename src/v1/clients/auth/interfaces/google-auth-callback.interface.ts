export interface GoogleAuthCallbackQuery {
  code: string;
  scope?: string;
  authuser?: string;
  prompt?: string;
  error?: string;
}
