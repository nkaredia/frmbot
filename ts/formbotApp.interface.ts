module formbotApp {
  export interface IData {
    name: string;
    formData: string;
  }

  export class MessageType {
    static READ = 'read';
    static FILL = 'fill';
    static SAVE = 'save';
  }

  export interface IMessage {
    type: MessageType;
    data?: IData;
    previewData?: Array<IPreviewContent>;
  }

  export interface IPort extends chrome.runtime.Port {
    postMessage: (message: IMessage) => void;
  }
  export interface IPreviewContent {
    inputName: string;
    inputValue: string;
  }
}