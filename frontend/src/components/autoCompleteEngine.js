const acState = {
  client: { value: null, focusIdx: -1 },
  carModal: { value: null, focusIdx: -1 },
};

function acSearch(inst, q) {
  const dropdown = document.getElementById(`ac${cap(inst)}Dropdown`);
  const clearBtn = document.getElementById(`ac${cap(inst)}Clear`);
  clearBtn.style.display = q ? "block" : "none";

  if (acState[inst].value) {
    acClear(inst);
    return;
  }

  const results = clients
    .filter((c) => c.name.toLowerCase().includes(q.toLowerCase()))
    .slice(0, 8);
  acState[inst].focusIdx = -1;

  let html = "";
  if (!q) {
    dropdown.classList.remove("open");
    return;
  }

  if (results.length) {
    html += results
      .map(
        (c, i) =>
          `<div class="ac-option" data-id="${c.id}" onmousedown="acSelect('${inst}',${c.id})" onmouseover="acHover('${inst}',${i})">
        <div class="ac-option-name">${highlight(c.name, q)}</div>
        <div class="ac-option-sub">${c.cel} · ${c.cars.length} veículo(s)</div>
      </div>`,
      )
      .join("");
  } else {
    html += `<div class="ac-empty">Nenhum cliente encontrado</div>`;
  }
  html += `<div class="ac-option-create" onmousedown="acCreateClient('${inst}','${q.replace(/'/g, "\\'")}')">
    <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
    Cadastrar "${q}" como novo cliente
  </div>`;

  dropdown.innerHTML = html;
  dropdown.classList.add("open");
}

function acOpen(inst) {
  const input = document.getElementById(`ac${cap(inst)}Input`);
  if (input.value && !acState[inst].value) acSearch(inst, input.value);
}

function acSelect(inst, id) {
  const c = clients.find((x) => x.id === id);
  if (!c) return;
  acState[inst].value = c;
  const input = document.getElementById(`ac${cap(inst)}Input`);
  const clearBtn = document.getElementById(`ac${cap(inst)}Clear`);
  const row = document.getElementById(`ac${cap(inst)}Row`);

  // Replace input with pill
  input.style.display = "none";
  clearBtn.style.display = "none";
  const pill = document.createElement("div");
  pill.className = "ac-selected-pill";
  pill.id = `ac${cap(inst)}Pill`;
  pill.innerHTML = `${c.name}<button onclick="acClear('${inst}')">×</button>`;
  row.insertBefore(pill, input.nextSibling);

  document.getElementById(`ac${cap(inst)}Dropdown`).classList.remove("open");

  if (inst === "client") loadClientCarsForOS(id);
}

function acClear(inst) {
  acState[inst].value = null;
  acState[inst].focusIdx = -1;
  const input = document.getElementById(`ac${cap(inst)}Input`);
  const clearBtn = document.getElementById(`ac${cap(inst)}Clear`);
  input.value = "";
  input.style.display = "";
  clearBtn.style.display = "none";
  const pill = document.getElementById(`ac${cap(inst)}Pill`);
  if (pill) pill.remove();
  document.getElementById(`ac${cap(inst)}Dropdown`).classList.remove("open");

  if (inst === "client") {
    document.getElementById("carBadgeRow").innerHTML =
      '<span style="font-size:12px;color:var(--ink3);">Selecione o cliente primeiro</span>';
  }
  setTimeout(() => input.focus(), 50);
}

function acKey(e, inst) {
  const dropdown = document.getElementById(`ac${cap(inst)}Dropdown`);
  if (!dropdown.classList.contains("open")) return;
  const opts = dropdown.querySelectorAll(".ac-option");
  if (e.key === "ArrowDown") {
    e.preventDefault();
    acState[inst].focusIdx = Math.min(
      acState[inst].focusIdx + 1,
      opts.length - 1,
    );
    acHighlight(inst, opts);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    acState[inst].focusIdx = Math.max(acState[inst].focusIdx - 1, 0);
    acHighlight(inst, opts);
  } else if (e.key === "Enter") {
    e.preventDefault();
    if (acState[inst].focusIdx >= 0 && opts[acState[inst].focusIdx]) {
      const id = parseInt(opts[acState[inst].focusIdx].dataset.id);
      acSelect(inst, id);
    }
  } else if (e.key === "Escape") {
    dropdown.classList.remove("open");
  }
}

function acHover(inst, i) {
  acState[inst].focusIdx = i;
}
function acHighlight(inst, opts) {
  opts.forEach((o, i) =>
    o.classList.toggle("focused", i === acState[inst].focusIdx),
  );
}

function acCreateClient(inst, name) {
  showToast(`Cadastrando "${name}"`, "Abrindo formulário de novo cliente...");
  acClear(inst);
  setTimeout(() => openModal("modalCliente"), 400);
}

function highlight(text, q) {
  if (!q) return text;
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return text.replace(re, "<strong>$1</strong>");
}

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Close dropdowns on outside click
document.addEventListener("click", (e) => {
  ["client", "carModal"].forEach((inst) => {
    const wrap =
      document.getElementById(`ac${cap(inst)}Wrap`) ||
      document.getElementById(`ac${cap(inst)}Wrap`);
    if (wrap && !wrap.contains(e.target)) {
      const dd = document.getElementById(`ac${cap(inst)}Dropdown`);
      if (dd) dd.classList.remove("open");
    }
  });
});
