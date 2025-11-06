import { readScores, createScore, deleteScore } from "./api.js";

const PAGE_SIZE = 5;

let currentPage = 0;
let allScores = [];

document.addEventListener("DOMContentLoaded", async () => {
  const scoreform = document.querySelector(".scoreForm");
  const tbody = document.querySelector("tbody");
  const scoreTable = document.querySelector("#scoreTable");
  const tableButtons = document.querySelector("#tableButtons");
  const addScoreButtons = document.querySelectorAll(".addScore");
  const formContainer = document.getElementById("formContainer");

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
      noScoresMessage.style.display = "block";
      document.getElementById("prevPage").style.display = "none";
      document.getElementById("nextPage").style.display = "none";
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
    document.querySelectorAll(".trashButton").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        if (confirm("Delete this score?")) {
          await deleteScore(id);
          loadScores();
        }
      });
    });

    const prevButton = document.getElementById("prevPage");
    const nextButton = document.getElementById("nextPage");

    prevButton.style.display = currentPage === 0 ? "none" : "inline-block";
    nextButton.style.display = endIndex >= allScores.length ? "none" : "inline-block";
  }
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

  scoreform.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userName = e.target.userName.value.trim();

    if (!userName) return;

    const result = await createScore(userName);

    if (result) {
      alert("Score saved!");
      loadScores();
      e.target.reset();
    }
    formContainer.style.display = "none";
  });

  loadScores();
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
});
