const modal = document.getElementById("modal");
const toast = document.getElementById("toast");
const serviceSelect = document.getElementById("serviceSelect");

let currentStep = 1;
let selectedService = "Limpeza";

function openWizard(service = "Limpeza") {
  selectedService = service;
  currentStep = 1;
  document.querySelectorAll(".choice").forEach(b => b.classList.toggle("selected", b.dataset.service === service));
  updateWizard();
  modal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function selectService(service) {
  openWizard(service);
}

function chooseService(service) {
  selectedService = service;
  document.querySelectorAll(".choice").forEach(b => b.classList.toggle("selected", b.dataset.service === service));
  setTimeout(() => nextStep(), 180);
}

function updateWizard() {
  document.querySelectorAll(".wizard-step").forEach(step => {
    step.classList.toggle("active", Number(step.dataset.step) === currentStep);
  });
  document.getElementById("stepCount").textContent = `${currentStep} de 4`;
  document.getElementById("progressBar").style.width = `${currentStep * 25}%`;

  if (currentStep === 1) {
    document.getElementById("modalTitle").textContent = "Solicitar serviço";
  } else if (currentStep === 2) {
    document.getElementById("modalTitle").textContent = "Detalhes do serviço";
  } else if (currentStep === 3) {
    document.getElementById("modalTitle").textContent = "Local e horário";
  } else {
    document.getElementById("modalTitle").textContent = "Seus dados";
    updateSummary();
  }
}

function nextStep() {
  if (currentStep < 4) {
    currentStep++;
    updateWizard();
  }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    updateWizard();
  }
}

function updateSummary() {
  const type = document.getElementById("detailType").value;
  const address = document.getElementById("address").value || "A definir";
  const date = document.getElementById("date").value || "A definir";
  const time = document.getElementById("time").value || "A definir";
  document.getElementById("summary").innerHTML =
    `<strong>Resumo do pedido</strong><br>
     Serviço: ${selectedService}<br>
     Atendimento: ${type}<br>
     Endereço: ${address}<br>
     Data: ${date} · ${time}`;
}

function finishRequest() {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!name || !phone) {
    showToast("Preencha nome e WhatsApp para continuar.");
    return;
  }

  closeModal();
  showToast("Pedido iniciado com sucesso. ✨");
}

function closeModal() {
  modal.classList.remove("show");
  document.body.style.overflow = "";
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

document.getElementById("menuBtn").addEventListener("click", () => {
  document.getElementById("mobileMenu").classList.toggle("open");
});

document.querySelectorAll(".mobile-menu a").forEach(a => {
  a.addEventListener("click", () => document.getElementById("mobileMenu").classList.remove("open"));
});


// Formulário de candidatura
document.getElementById("careerForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const cv = document.getElementById("careerCv").files[0];
  if (!cv) { showToast("Anexe seu currículo em PDF."); return; }
  if (cv.type !== "application/pdf" && !cv.name.toLowerCase().endsWith(".pdf")) { showToast("O currículo deve estar em PDF."); return; }
  if (cv.size > 5 * 1024 * 1024) { showToast("O currículo deve ter no máximo 5 MB."); return; }

  const candidate = {
    id: Date.now(),
    name: document.getElementById("careerName").value.trim(),
    phone: document.getElementById("careerPhone").value.trim(),
    city: document.getElementById("careerCity").value.trim(),
    area: document.getElementById("careerArea").value,
    experience: document.getElementById("careerExperience").value.trim(),
    availability: document.getElementById("careerAvailability").value.trim(),
    notes: document.getElementById("careerNotes").value.trim(),
    cvName: cv.name,
    status: "Em análise",
    createdAt: new Date().toLocaleString("pt-BR")
  };

  const candidates = JSON.parse(localStorage.getItem("larapeCandidates") || "[]");
  candidates.unshift(candidate);
  localStorage.setItem("larapeCandidates", JSON.stringify(candidates));
  document.getElementById("careerForm").reset();
  showToast("Currículo recebido! Nossa equipe poderá entrar em contato. ✨");
});
