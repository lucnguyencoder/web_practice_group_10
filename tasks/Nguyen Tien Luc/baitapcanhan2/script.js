/**
 * Bài tập cá nhân 2: Quản lý điểm sinh viên & Xếp loại học tập
 * Danh sách 5 môn học:
 * 1. Giải tích 1
 * 2. Đại số tuyến tính
 * 3. Xác xuất thống kê
 * 4. Tin học đại cương
 * 5. Xây dựng ứng dụng Web
 */

// Danh sách tên 5 môn học
const SUBJECTS = [
  "Giải tích 1",
  "Đại số tuyến tính",
  "Xác xuất thống kê",
  "Tin học đại cương",
  "Xây dựng ứng dụng Web",
];

// CÁC HÀM XỬ LÝ THEO YÊU CẦU ĐỀ BÀI

/**
 * Hàm tính điểm trung bình của 5 môn học
 * @param {number[]} scores - Mảng điểm 5 môn học
 * @returns {number} - Điểm trung bình
 */
function calculateAverage(scores) {
  if (!scores || scores.length === 0) return 0;
  const sum = scores.reduce((total, score) => total + score, 0);
  return sum / scores.length;
}

/**
 * Hàm xếp loại học tập dựa trên điểm trung bình
 * Quy tắc:
 * - >= 8.0: Giỏi
 * - >= 6.5: Khá
 * - >= 5.0: Trung bình
 * - < 5.0: Yếu
 * @param {number} avg - Điểm trung bình
 * @returns {string} - Xếp loại ('Giỏi', 'Khá', 'Trung bình', 'Yếu')
 */
function classify(avg) {
  if (avg >= 8.0) {
    return "Giỏi";
  } else if (avg >= 6.5) {
    return "Khá";
  } else if (avg >= 5.0) {
    return "Trung bình";
  } else {
    return "Yếu";
  }
}

// QUẢN LÝ GIAO DIỆN & TƯƠNG TÁC NGƯỜI DÙNG (DOM)

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const form = document.getElementById("score-form");
  const studentNameInput = document.getElementById("student-name");
  const btnReset = document.getElementById("btn-reset");
  const btnQuickFill = document.getElementById("btn-quick-fill");

  const generalAlert = document.getElementById("general-alert");
  const generalAlertText = document.getElementById("general-alert-text");

  const resultPlaceholder = document.getElementById("result-placeholder");
  const resultContent = document.getElementById("result-content");
  const resultCard = document.getElementById("result-card");

  const displayStudentName = document.getElementById("display-student-name");
  const displayDate = document.getElementById("display-date");
  const displayAverage = document.getElementById("display-average");
  const displayRank = document.getElementById("display-rank");
  const displayRankDesc = document.getElementById("display-rank-desc");
  const rankStatBox = document.getElementById("rank-stat-box");
  const rankStatIcon = document.getElementById("rank-stat-icon");

  const scoresTableBody = document.getElementById("scores-table-body");
  const tableFooterAverage = document.getElementById("table-footer-average");
  const tableRankBadge = document.getElementById("table-rank-badge");

  // Lấy 5 ô nhập điểm
  const scoreInputs = [
    document.getElementById("score-1"),
    document.getElementById("score-2"),
    document.getElementById("score-3"),
    document.getElementById("score-4"),
    document.getElementById("score-5"),
  ];

  /**
   * Hiển thị lỗi cho một ô nhập liệu
   */
  function showError(inputEl, message) {
    const formGroup = inputEl.closest(".form-group");
    if (formGroup) {
      formGroup.classList.add("has-error");
      const errorMsgEl = formGroup.querySelector(".error-msg");
      if (errorMsgEl) {
        errorMsgEl.textContent = message;
      }
    }
  }

  /**
   * Xóa trạng thái lỗi của một ô nhập liệu
   */
  function clearError(inputEl) {
    const formGroup = inputEl.closest(".form-group");
    if (formGroup) {
      formGroup.classList.remove("has-error");
      const errorMsgEl = formGroup.querySelector(".error-msg");
      if (errorMsgEl) {
        errorMsgEl.textContent = "";
      }
    }
  }

  /**
   * Xóa toàn bộ lỗi hiển thị trên form
   */
  function clearAllErrors() {
    clearError(studentNameInput);
    scoreInputs.forEach((input) => clearError(input));
    hideGeneralAlert();
  }

  /**
   * Hiển thị thông báo chung
   */
  function showGeneralAlert(message) {
    generalAlertText.textContent = message;
    generalAlert.classList.remove("hidden");
  }

  /**
   * Ẩn thông báo chung
   */
  function hideGeneralAlert() {
    generalAlert.classList.add("hidden");
    generalAlertText.textContent = "";
  }

  // Lắng nghe sự kiện input để tự động xóa lỗi khi người dùng gõ
  studentNameInput.addEventListener("input", () => {
    clearError(studentNameInput);
    hideGeneralAlert();
  });

  scoreInputs.forEach((input) => {
    input.addEventListener("input", () => {
      clearError(input);
      hideGeneralAlert();
    });
  });

  /**
   * Kiểm tra tính hợp lệ của dữ liệu form
   * - Tên không được để trống
   * - Điểm từng môn không được để trống
   * - Điểm phải là số và nằm trong khoảng [0, 10]
   */
  function validateForm() {
    clearAllErrors();
    let isValid = true;
    let firstInvalidInput = null;

    // 1. Kiểm tra họ và tên sinh viên
    const studentName = studentNameInput.value.trim();
    if (studentName === "") {
      showError(studentNameInput, "Vui lòng nhập họ và tên sinh viên.");
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = studentNameInput;
    } else if (studentName.length < 2) {
      showError(studentNameInput, "Họ và tên phải có ít nhất 2 ký tự.");
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = studentNameInput;
    }

    // 2. Kiểm tra điểm của từng môn
    const scores = [];
    scoreInputs.forEach((input, index) => {
      const rawVal = input.value.trim();
      const subjectName = SUBJECTS[index];

      if (rawVal === "") {
        showError(input, `Vui lòng nhập điểm môn ${subjectName}.`);
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = input;
      } else {
        const num = parseFloat(rawVal);
        if (isNaN(num)) {
          showError(input, "Điểm phải là một số hợp lệ.");
          isValid = false;
          if (!firstInvalidInput) firstInvalidInput = input;
        } else if (num < 0 || num > 10) {
          showError(input, "Điểm phải nằm trong thang điểm từ 0 đến 10.");
          isValid = false;
          if (!firstInvalidInput) firstInvalidInput = input;
        } else {
          scores.push(num);
        }
      }
    });

    if (!isValid) {
      showGeneralAlert(
        "Vui lòng kiểm tra lại thông tin và điểm số bị lỗi bên dưới.",
      );
      if (firstInvalidInput) {
        firstInvalidInput.focus();
      }
      return null;
    }

    return {
      studentName,
      scores,
    };
  }

  /**
   * Trả về thông tin class và mô tả cho xếp loại
   */
  function getRankMeta(rank) {
    switch (rank) {
      case "Giỏi":
        return {
          classKey: "rank-gioi",
          badgeKey: "badge-gioi",
          iconHtml: '<i class="fa-solid fa-trophy"></i>',
          desc: "Thành tích học tập xuất sắc",
        };
      case "Khá":
        return {
          classKey: "rank-kha",
          badgeKey: "badge-kha",
          iconHtml: '<i class="fa-solid fa-medal"></i>',
          desc: "Thành tích học tập tốt",
        };
      case "Trung bình":
        return {
          classKey: "rank-tb",
          badgeKey: "badge-tb",
          iconHtml: '<i class="fa-solid fa-award"></i>',
          desc: "Cần nỗ lực thêm để tiến bộ",
        };
      case "Yếu":
      default:
        return {
          classKey: "rank-yeu",
          badgeKey: "badge-yeu",
          iconHtml: '<i class="fa-solid fa-triangle-exclamation"></i>',
          desc: "Cần cải thiện kết quả học tập",
        };
    }
  }

  /**
   * Hiển thị kết quả ra giao diện
   */
  function displayResults(data) {
    const { studentName, scores } = data;

    // 1. Tính toán điểm trung bình và xếp loại
    const average = calculateAverage(scores);
    const rank = classify(average);
    const rankMeta = getRankMeta(rank);

    // 2. Cập nhật thông tin sinh viên
    displayStudentName.textContent = studentName;
    const now = new Date();
    displayDate.textContent = `Thời gian tính: ${now.toLocaleTimeString("vi-VN")} - ${now.toLocaleDateString("vi-VN")}`;

    // 3. Cập nhật thống kê điểm trung bình & xếp loại
    displayAverage.textContent = average.toFixed(2);
    displayRank.textContent = rank;
    displayRankDesc.textContent = rankMeta.desc;
    rankStatIcon.innerHTML = rankMeta.iconHtml;

    // Cập nhật kiểu dáng cho hộp xếp loại
    rankStatBox.className = `stat-box rank-box ${rankMeta.classKey}`;

    // 4. Vẽ bảng điểm chi tiết
    scoresTableBody.innerHTML = "";
    scores.forEach((score, index) => {
      const tr = document.createElement("tr");

      // Đạt nếu điểm >= 4.0 (thang điểm 10 đại học)
      const isPassed = score >= 4.0;
      const statusHtml = isPassed
        ? `<span class="status-pass"><i class="fa-solid fa-circle-check"></i> Đạt</span>`
        : `<span class="status-fail"><i class="fa-solid fa-circle-xmark"></i> Chưa đạt</span>`;

      tr.innerHTML = `
                <td class="col-stt">${index + 1}</td>
                <td><strong>${SUBJECTS[index]}</strong></td>
                <td class="col-score">${score.toFixed(1)}</td>
                <td class="col-status">${statusHtml}</td>
            `;
      scoresTableBody.appendChild(tr);
    });

    // 5. Cập nhật Footer của bảng
    tableFooterAverage.textContent = average.toFixed(2);
    tableRankBadge.textContent = rank;
    tableRankBadge.className = `badge ${rankMeta.badgeKey}`;

    // 6. Hiển thị phần kết quả và ẩn placeholder
    resultPlaceholder.classList.add("hidden");
    resultContent.classList.remove("hidden");

    // Cuộn nhẹ xuống kết quả trên mobile
    if (window.innerWidth < 992) {
      resultCard.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // ========================================================================
  // SỰ KIỆN SUBMIT FORM
  // ========================================================================
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Ngăn trang tải lại (reload)

    const validData = validateForm();
    if (validData) {
      displayResults(validData);
    }
  });


  // SỰ KIỆN NÚT NHẬP LẠI (RESET)

  btnReset.addEventListener("click", () => {
    // Xóa form
    form.reset();
    clearAllErrors();

    // Ẩn kết quả, hiện placeholder ban đầu
    resultContent.classList.add("hidden");
    resultPlaceholder.classList.remove("hidden");

    // Focus về ô nhập tên
    studentNameInput.focus();
  });


  // SỰ KIỆN ĐIỀN DỮ LIỆU MẪU (QUICK FILL)
 
  const sampleStudents = [
    { name: "Nguyễn Văn Hưng", scores: [8.5, 9.0, 8.0, 8.5, 9.0] }, // Giỏi
    { name: "Trần Thị Mai", scores: [7.0, 7.5, 6.5, 7.0, 8.0] }, // Khá
    { name: "Lê Hoàng Long", scores: [5.5, 6.0, 5.0, 6.5, 5.5] }, // Trung bình
    { name: "Phạm Minh Đức", scores: [4.0, 3.5, 4.5, 5.0, 4.0] }, // Yếu
  ];
  let sampleIndex = 0;

  btnQuickFill.addEventListener("click", () => {
    clearAllErrors();
    const sample = sampleStudents[sampleIndex % sampleStudents.length];
    sampleIndex++;

    studentNameInput.value = sample.name;
    scoreInputs.forEach((input, idx) => {
      input.value = sample.scores[idx];
    });

    // Tự động tính toán kết quả cho mẫu
    const validData = validateForm();
    if (validData) {
      displayResults(validData);
    }
  });
});

