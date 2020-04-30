(function($){
  let form = document.querySelector("form#loginForm");
  form.addEventListener("submit", function(evt){
    evt.preventDefault();
    let un = document.querySelector("input#username").value;
    if(un !== null && un.length > 2) {
      location.replace("/public/home/sequencer?id=" + un);
    }
    else {
      console.log("loginForm submit fail");
    }
  });
})(jQuery);