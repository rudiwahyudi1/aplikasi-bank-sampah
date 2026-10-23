
document.addEventListener("DOMContentLoaded", function(){
  const sidebar=document.getElementById("appSidebar");
  const toggle=document.querySelector("[data-sidebar-toggle]");
  const overlay=document.getElementById("sidebarOverlay");
  function close(){sidebar?.classList.remove("show");overlay?.classList.add("d-none")}
  function open(){sidebar?.classList.add("show");overlay?.classList.remove("d-none")}
  toggle?.addEventListener("click",()=>sidebar?.classList.contains("show")?close():open());
  overlay?.addEventListener("click",close);
  document.querySelectorAll(".auto-dismiss").forEach(el=>{
    setTimeout(()=>{if(window.bootstrap) bootstrap.Alert.getOrCreateInstance(el).close()},4500);
  });
  document.querySelectorAll("[data-number]").forEach(el=>{
    const n=Number(el.dataset.number||0);
    el.textContent=n.toLocaleString("id-ID");
  });
});
