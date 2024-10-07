
document.addEventListener("adobe_dc_view_sdk.ready", function(){ 
    let adobeDCView = new AdobeDC.View({clientId: "c28f9f5736c045cd92ddd75062d1ecd6", divId: "adobe-dc-view"});
    adobeDCView.previewFile({
      content:{ location:{ url: "/Anton_Forsberg_CV.pdf"}},
      metaData:{fileName: "Anton_Forsberg_CV.pdf"}
    }, {embedMode: "IN_LINE", showPrintPDF: false});
  });