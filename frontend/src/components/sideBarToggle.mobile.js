export function toggleSidebar() {
  const sb = document.getElementById("sidebar");
  const bd = document.getElementById("sidebarBackdrop");
  const open = sb.classList.toggle("open");
  bd.classList.toggle("open", open);
}

// Close sidebar when navigating on mobile
export const _origNavigate = navigate;

export function navigate(page, el) {
  _origNavigate(page, el);
  const sb = document.getElementById("sidebar");
  if (sb && sb.classList.contains("open")) toggleSidebar();
}

export const pageTitles = {
  os: "Ordens de Serviço",
  "nova-os": "Nova Ordem de Serviço",
  clientes: "Clientes",
  "editar-os": "Editar Ordem de Serviço",
  "servicos-cad": "Serviços",
  "materiais-cad": "Materiais & Peças",
};

export function navigate(page, el) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document.getElementById("page-" + page).classList.add("active");
  document
    .querySelectorAll(".nav-item")
    .forEach((n) => n.classList.remove("active"));
  const match = el || document.querySelector(`.nav-item[data-page="${page}"]`);
  if (match) match.classList.add("active");
  document.getElementById("pageTitle").textContent = pageTitles[page] || "";

  // Show/hide editar-os nav item — only visible when on that page
  document.getElementById("navEditarOS").style.display =
    page === "editar-os" ? "flex" : "none";

  // Topbar button
  const tr = document.getElementById("topbarRight");
  if (page === "os") {
    tr.innerHTML = `<button class="btn btn-primary" onclick="navigate('nova-os',null)">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>Nova OS</button>`;
  } else if (page === "clientes") {
    tr.innerHTML = `
      <button class="btn btn-secondary" onclick="openModal('modalCarro')">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>Novo Veículo</button>
      <button class="btn btn-primary" onclick="openModal('modalCliente')">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>Novo Cliente</button>`;
  } else if (page === "editar-os") {
    const os = osList.find((o) => o.id === currentEditId);
    tr.innerHTML = os ? `<div class="os-num-badge">#${os.id}</div>` : "";
  } else if (page === "servicos-cad") {
    tr.innerHTML = `<button class="btn btn-primary" onclick="promptNewCadGroup('svc')">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>Novo Grupo</button>`;
  } else if (page === "materiais-cad") {
    tr.innerHTML = `<button class="btn btn-primary" onclick="promptNewCadGroup('mat')">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>Novo Grupo</button>`;
  } else {
    tr.innerHTML = "";
  }

  if (page === "nova-os") {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const local = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    document.getElementById("dataEntrada").value = local;
    document.getElementById("carEntradaDt").value = local;
  }
}
