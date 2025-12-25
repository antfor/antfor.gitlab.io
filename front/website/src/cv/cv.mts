import 'scss/cv.scss';

if(window.AdobeDC){
  openPDF();
}else{
  document.addEventListener("adobe_dc_view_sdk.ready", openPDF);
}

enum Params {
  LANG = "lang",
}

enum Language{
  SV = "sv",
  ENG = "en"
}

function getParamNumber(name: Params, url = window.location.href):Language{
  const defaultLanguage = Language.ENG;
  try {
    const value = new URL(url).searchParams.get(name);
    if(value === null ){
      return defaultLanguage;
    }
    switch(value.trim().toLowerCase()){
      case Language.SV.toString(): return Language.SV;
      case Language.ENG.toString(): return Language.ENG;
      default: return defaultLanguage;
    }
    
  } catch {
    return defaultLanguage;
  }
}

function setParam(name: Params, value:Language, uri = window.location.href) {
  try {
    const url = new URL(uri);
    url.searchParams.set(name, value.toString());
    history.replaceState(history.state, '', url);
  } catch (err) {
    console.error("Invalid URL:", err);
    return uri;
  }
}

function openPDF(){

  if (!window.AdobeDC) {
    document.addEventListener("adobe_dc_view_sdk.ready", openPDF, { once: true });
    return;
  }

  const adobeDCView = new window.AdobeDC.View({clientId: "c28f9f5736c045cd92ddd75062d1ecd6", divId: "adobe-dc-view"});

  const cv_eng = "/Anton_Forsberg_CV_ENG.pdf";
  const cv_sv = "/Anton_Forsberg_CV_SV.pdf";

  const lang = getParamNumber(Params.LANG);
  setParam(Params.LANG,lang);
  let url = cv_eng;
  switch(lang){
    case Language.SV: url = cv_sv; break;
    case Language.ENG: url = cv_eng; break;
  }
  const pdf = url.substring(url.lastIndexOf('/')+1);
  
  adobeDCView.previewFile({
    content:{ location:{ url: url}},
    metaData:{fileName: pdf}
  }, {embedMode: "IN_LINE", showPrintPDF: false});
}