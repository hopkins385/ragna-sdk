type EditorCommandType =
  | 'replaceText'
  | 'formatText'
  | 'insertContent'
  | 'deleteRange'
  | 'addComment';

export interface EditorCommand {
  type: EditorCommandType;
  params: Record<string, any>;
}
