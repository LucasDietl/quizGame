export interface DialogState {
  isOpen: boolean;
  title: string;
  content: any; // This can be a component, template, or data to render in the dialog.
}
