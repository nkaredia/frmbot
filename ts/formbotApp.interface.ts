module formbotApp {
  export interface IData {
    name: string;
    formData: string;
  }

  export interface IMessage {
    type: Types.MessageType;
    data?: IData;
    previewData?: Array<IPreviewContent>;
    success?: boolean;
    formData?: Array<string>;
  }

  export interface IPort extends chrome.runtime.Port {
    postMessage: (message: IMessage) => void;
  }
  export interface IPreviewContent {
    inputName: string;
    inputValue: string;
  }
}