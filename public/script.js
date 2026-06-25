const API = "http://localhost:3000/api";

// DOM Elements
const reportTab = document.getElementById("report-tab");
const statusTab = document.getElementById("status-tab");
const tabReport = document.getElementById("tab-report");
const tabStatus = document.getElementById("tab-status");
const navReport = document.getElementById("nav-report");
const navStatus = document.getElementById("nav-status");
const confirmationSection = document.getElementById("confirmation-section");

// Tab Navigation
function switchTab(tab) {
  reportTab.classList.remove("active");
  statusTab.classList.remove("active");
  tabReport.classList.remove("active");
  tabStatus.classList.remove("active");
  confirmationSection.classList.add("hidden");

  if (tab === "report") {
    reportTab.classList.add("active");
    tabReport.classList.add("active");
  } else {
    statusTab.classList.add("active");
    tabStatus.classList.add("active");
  }
}

navReport.addEventListener("click", (e) => {
  e.preventDefault();
  switchTab("report");
});
navStatus.addEventListener("click", (e) => {
  e.preventDefault();
  switchTab("status");
});
tabReport.addEventListener("click", () => switchTab("report"));
tabStatus.addEventListener("click", () => switchTab("status"));

//submit laporan
document
  .getElementById("complaint-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append(
      "reporter_name",
      document.getElementById("reporter-name").value,
    );
    formData.append(
      "reporter_id",
      document.getElementById("reporter-id").value,
    );
    formData.append(
      "reporter_role",
      document.getElementById("reporter-role").value,
    );
    formData.append(
      "reporter_email",
      document.getElementById("reporter-email").value,
    );
    formData.append(
      "violation_type",
      document.getElementById("violation-type").value,
    );
    formData.append(
      "violation_date",
      document.getElementById("violation-date").value,
    );
    formData.append(
      "violation_time",
      document.getElementById("violation-time").value,
    );
    formData.append(
      "violation_location",
      document.getElementById("violation-location").value,
    );
    formData.append(
      "violation_description",
      document.getElementById("violation-description").value,
    );

    const fileInput = document.getElementById("evidence-file");
    if (fileInput.files.length > 0) {
      formData.append("file", fileInput.files[0]);
    }

    const required = [
      "reporter-name",
      "reporter-id",
      "reporter-role",
      "reporter-email",
      "violation-type",
      "violation-date",
      "violation-location",
      "violation-description",
    ];
    let valid = true;
    for (let id of required) {
      if (!document.getElementById(id).value) {
        alert("Semua field wajib diisi!");
        valid = false;
        break;
      }
    }
    if (!valid) return;

    try {
      const res = await fetch(`${API}/pengaduan`, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();

      if (result.success) {
        const reporterId = document.getElementById("reporter-id").value;
        const detailRes = await fetch(
          `${API}/pengaduan/${result.data.report_id}?reporter_id=${reporterId}`,
        );
        const detail = await detailRes.json();

        if (detail.success) {
          const p = detail.data;
          document.getElementById("confirmation-id").textContent = p.report_id;
          document.getElementById("confirmation-name").textContent =
            p.reporter_name;
          document.getElementById("confirmation-nim").textContent =
            p.reporter_id;
          document.getElementById("confirmation-violation").textContent =
            p.violation_type;
          document.getElementById("confirmation-date").textContent = new Date(
            p.violation_date,
          ).toLocaleDateString("id-ID");
          document.getElementById("confirmation-location").textContent =
            p.violation_location;

          document.getElementById("report-tab").classList.remove("active");
          document.getElementById("status-tab").classList.remove("active");
          document
            .getElementById("confirmation-section")
            .classList.remove("hidden");
        }

        document.getElementById("complaint-form").reset();
        document.getElementById("file-name").textContent = "";
      } else {
        alert("Gagal: " + result.message);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  });

//cek status
document
  .getElementById("check-status-btn")
  .addEventListener("click", async () => {
    const reportId = document.getElementById("report-id-check").value;
    const reporterId = document.getElementById("reporter-id-check").value;

    if (!reportId || !reporterId) {
      alert("Masukkan ID Laporan dan NIM/NIS");
      return;
    }

    try {
      const res = await fetch(
        `${API}/pengaduan/${reportId}?reporter_id=${reporterId}`,
      );
      const result = await res.json();

      if (result.success) {
        const p = result.data;
        document.getElementById("status-report-id").textContent = p.report_id;
        document.getElementById("status-reporter-name").textContent = "-";
        document.getElementById("status-violation-type").textContent =
          p.violation_type;
        document.getElementById("status-violation-date").textContent = new Date(
          p.violation_date,
        ).toLocaleDateString("id-ID");
        document.getElementById("status-submission-date").textContent =
          new Date(p.submission_date).toLocaleDateString("id-ID");
        document.getElementById("status-notes").textContent =
          p.status_notes || "-";

        const badge = document.getElementById("status-badge");
        let statusText = "",
          statusClass = "";
        switch (p.status) {
          case "submitted":
            statusText = "Diajukan";
            statusClass = "status-submitted";
            break;
          case "process":
            statusText = "Diproses";
            statusClass = "status-process";
            break;
          case "completed":
            statusText = "Selesai";
            statusClass = "status-completed";
            break;
          case "rejected":
            statusText = "Ditolak";
            statusClass = "status-rejected";
            break;
        }
        badge.textContent = statusText;
        badge.className = `status-badge ${statusClass}`;

        document.getElementById("status-results").classList.remove("hidden");
      } else {
        alert("Laporan tidak ditemukan");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  });

//load riwayat
document
  .getElementById("reporter-id-check")
  .addEventListener("input", async (e) => {
    const nim = e.target.value;
    if (nim.length > 3) {
      try {
        const res = await fetch(`${API}/pengaduan?reporter_id=${nim}`);
        const result = await res.json();
        const container = document.getElementById("reports-list");

        if (result.success && result.data.length > 0) {
          container.innerHTML = result.data
            .slice(0, 5)
            .map((p) => {
              let statusText = "";
              let statusClass = "";
              switch (p.status) {
                case "submitted":
                  statusText = "Diajukan";
                  statusClass = "status-submitted";
                  break;
                case "process":
                  statusText = " Diproses";
                  statusClass = "status-process";
                  break;
                case "completed":
                  statusText = " Selesai";
                  statusClass = "status-completed";
                  break;
                case "rejected":
                  statusText = "Ditolak";
                  statusClass = "status-rejected";
                  break;
                default:
                  statusText = p.status;
                  statusClass = "";
              }
              return `
                        <div class="report-card">
                            <div class="report-header">
                                <div class="report-title">${p.violation_type}</div>
                                <div class="report-date">${new Date(p.submission_date).toLocaleDateString("id-ID")}</div>
                            </div>
                            <div>ID: ${p.report_id}</div>
                            <div>Status: <span class="${statusClass}">${statusText}</span></div>
                        </div>
                    `;
            })
            .join("");
        } else {
          container.innerHTML = "<p>Belum ada laporan</p>";
        }
      } catch (e) {}
    }
  });

// Tombol navigasi confirmation
document.getElementById("new-report-btn").addEventListener("click", () => {
  confirmationSection.classList.add("hidden");
  switchTab("report");
});
document.getElementById("check-report-btn").addEventListener("click", () => {
  confirmationSection.classList.add("hidden");
  switchTab("status");
});

// Set max date
document.getElementById("violation-date").max = new Date()
  .toISOString()
  .split("T")[0];

// UPLOAD FILE HANDLER
const fileUploadArea = document.getElementById("file-upload-area");
const fileInput = document.getElementById("evidence-file");
const fileNameDisplay = document.getElementById("file-name");

if (fileUploadArea && fileInput) {
  fileUploadArea.addEventListener("click", function () {
    fileInput.click();
  });

  fileInput.addEventListener("change", function () {
    if (fileInput.files.length > 0) {
      const fileName = fileInput.files[0].name;
      fileNameDisplay.textContent = `📎 ${fileName}`;
      fileUploadArea.style.borderColor = "#3498db";
    } else {
      fileNameDisplay.textContent = "";
      fileUploadArea.style.borderColor = "#ddd";
    }
  });

  // Drag and drop
  fileUploadArea.addEventListener("dragover", function (e) {
    e.preventDefault();
    fileUploadArea.style.borderColor = "#3498db";
    fileUploadArea.style.backgroundColor = "rgba(52, 152, 219, 0.1)";
  });

  fileUploadArea.addEventListener("dragleave", function (e) {
    e.preventDefault();
    fileUploadArea.style.borderColor = "#ddd";
    fileUploadArea.style.backgroundColor = "transparent";
  });

  fileUploadArea.addEventListener("drop", function (e) {
    e.preventDefault();
    fileUploadArea.style.borderColor = "#3498db";
    fileUploadArea.style.backgroundColor = "transparent";

    if (e.dataTransfer.files.length > 0) {
      fileInput.files = e.dataTransfer.files;
      const fileName = e.dataTransfer.files[0].name;
      fileNameDisplay.textContent = `📎 ${fileName}`;
    }
  });

  console.log(" Upload handler siap!");
} else {
  console.log(" Upload elements not found:", {
    fileUploadArea: fileUploadArea,
    fileInput: fileInput,
    fileNameDisplay: fileNameDisplay,
  });
}

//dark mode
function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    const toggleBtn = document.getElementById("themeToggle");
    if (toggleBtn) {
      toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
  }
}

function toggleTheme() {
  const body = document.body;
  const toggleBtn = document.getElementById("themeToggle");

  if (body.classList.contains("dark-mode")) {
    body.classList.remove("dark-mode");
    localStorage.setItem("theme", "light");
    if (toggleBtn) {
      toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }
  } else {
    body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
    if (toggleBtn) {
      toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
  }
}

//inisiasi tema
document.addEventListener("DOMContentLoaded", () => {
  initTheme();

  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }
});

//buat laporan
function switchToReportAndScroll() {
  document.getElementById("report-tab").classList.add("active");
  document.getElementById("status-tab").classList.remove("active");
  document.getElementById("tab-report").classList.add("active");
  document.getElementById("tab-status").classList.remove("active");

  setTimeout(() => {
    document.getElementById("complaint-form").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);
}

//cek status laporan
function switchToStatusAndScroll() {
  document.getElementById("report-tab").classList.remove("active");
  document.getElementById("status-tab").classList.add("active");
  document.getElementById("tab-report").classList.remove("active");
  document.getElementById("tab-status").classList.add("active");

  setTimeout(() => {
    document.getElementById("report-id-check").scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    document.getElementById("report-id-check").focus();
  }, 100);
}
