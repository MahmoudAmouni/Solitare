import { readScores, createScore, deleteScore } from "./api.js";

const PAGE_SIZE = 5;

let pendingDeleteId = null;
let currentPage = 0;
let allScores = [];

document.addEventListener("DOMContentLoaded", async () => {
  const tbody = document.querySelector("tbody");
  const scoreTable = document.querySelector("#scoreTable");
  const tableButtons = document.querySelector("#tableButtons");
  const addScoreButtons = document.querySelectorAll(".addScore");
  const formContainer = document.getElementById("formContainer");
  const scoreform = document.querySelector(".scoreForm");
  const confirmDltButton = document.getElementById("confirmDelete");
  const cancelDltButton = document.getElementById("cancelDelete");
  const prevButton = document.getElementById("prevPage");
  const nextButton = document.getElementById("nextPage");

  //Loading all the data
  async function loadScores() {
    const data = await readScores();
    data.sort((a, b) => {
      return b.score !== a.score ? b.score - a.score : a.duration - b.duration;
    });

    allScores = data;
    currentPage = 0;
    renderScoresPage();
  }

  function renderScoresPage() {
    const startIndex = currentPage * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const pageData = allScores.slice(startIndex, endIndex);

    if (allScores.length === 0) {
      scoreTable.style.display = "none";
      tableButtons.style.display = "none";
      prevButton.style.display = "none";
      nextButton.style.display = "none";
      noScoresMessage.style.display = "block";
      return;
    }

    scoreTable.style.display = "table";
    noScoresMessage.style.display = "none";
    tableButtons.style.display = "flex";

    tbody.innerHTML = "";
    pageData.forEach((item, index) => {
      const globalIndex = startIndex + index;
      const minutes = Math.floor(item.duration / 60);
      const seconds = item.duration % 60;

      let row = "";
      if (globalIndex === 0) {
        row += `<tr class="first"><td>👑</td>`;
      } else if (globalIndex === 1) {
        row += `<tr class="second"><td>🥈</td>`;
      } else if (globalIndex === 2) {
        row += `<tr class="third"><td>🥉</td>`;
      } else {
        row += `<tr><td>${globalIndex + 1}</td>`;
      }

      row += `
      <td>${item.userName}</td>
      <td>${item.score}</td>
      <td>${minutes} min ${seconds} sec</td>
      <td><button class="trashButton" data-id="${item.id}"><i class="fas fa-trash"></i></button></td>
    </tr>`;
      tbody.innerHTML += row;
    });

    //handling click for trash buttons
    document.querySelectorAll(".trashButton").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        showDeleteConfirm(id);
      });
    });

    prevButton.style.display = currentPage === 0 ? "none" : "inline-block";
    nextButton.style.display =
      endIndex >= allScores.length ? "none" : "inline-block";
  }

  //showing the delete modal overly
  function showDeleteConfirm(id) {
    pendingDeleteId = id;
    document.body.classList.add("no-scroll");
    document.getElementById("deleteOverlay").classList.add("show");
  }

  //hiding the delete modal overly
  function hideDeleteModal() {
    document.getElementById("deleteOverlay").classList.remove("show");
    document.body.classList.remove("no-scroll");
    pendingDeleteId = null;
  }

  //Showing the toast 
  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerHTML = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }

  //Handling confirm or cancel delete score
  confirmDltButton.addEventListener("click", async () => {
    if (pendingDeleteId) {
      await deleteScore(pendingDeleteId);
      loadScores();
      hideDeleteModal();
      showToast("Score Deleted Successfully");
    }
  });
  cancelDltButton.addEventListener("click", () => {
    hideDeleteModal();
  });


  //showing the form to add score
  addScoreButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (formContainer.style.display === "flex") {
        formContainer.style.display = "none";
        button.textContent = "Add Score";
      } else {
        formContainer.style.display = "flex";
      }
    });
  });


  //handle submiting a form
  scoreform.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userName = e.target.userName.value.trim();
    if (!userName) return;
    const result = await createScore(userName);
    if (result) {
      showToast("New record loaded successfully🃏");
      loadScores();
      e.target.reset();
    }
    formContainer.style.display = "none";
  });
  document.body.addEventListener("click", function (event) {
    if (
      formContainer.style.display === "flex" &&
      !event.target.closest(".insideForm") &&
      !event.target.closest(".addScore")
    ) {
      formContainer.style.display = "none";
      addScoreButtons.forEach((btn) => {
        btn.textContent = "Add Score";
      });
    }
  });


  //pagination for the table
  document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 0) {
      currentPage--;
      renderScoresPage();
    }
  });

  document.getElementById("nextPage").addEventListener("click", () => {
    const maxPage = Math.ceil(allScores.length / PAGE_SIZE) - 1;
    if (currentPage < maxPage) {
      currentPage++;
      renderScoresPage();
    }
  });
  //Initial load for all scores
  loadScores();
});
