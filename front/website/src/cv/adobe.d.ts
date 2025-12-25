declare namespace AdobeDC {
  class View {
    constructor(options: { clientId: string; divId: string });
    previewFile(
      file: {
        content: { location: { url: string } };
        metaData: { fileName: string };
      },
      viewerConfig?: object
    ): void;
  }
}

declare global {
  interface Window {
    AdobeDC?: {
      View: new (options: { clientId: string; divId: string }) => AdobeDC.View;
    };
  }
}

export {};
