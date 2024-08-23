
document.addEventListener("DOMContentLoaded", function(){
    // add padding top to show content behind navbar
    const navbar_height = document.querySelector('.navbar').offsetHeight;
    document.body.style.paddingTop = navbar_height + 'px';
  }); 

  window.onresize = function(event) {
    const navbar_height = document.querySelector('.navbar').offsetHeight;
    document.body.style.paddingTop = navbar_height + 'px';
};