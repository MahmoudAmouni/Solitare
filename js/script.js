async function readScores() {
  try {
    const response = await axios.get("/solitare/backend/api/read.php");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch scores:", error);
    return [];
  }
}

async function createScore(userName, score, duration) {
  try {
    const response = await axios.post("/solitare/backend/api/create.php", {
      userName,
      score,
      duration,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to add score:", error);
    return null;
  }
}

async function deleteScore(id) {
  try {
    await axios.delete(`/solitare/backend/api/delete.php?id=${id}`);
    return true;
  } catch (error) {
    console.error("Failed to delete score:", error);
    return false;
  }
}

document.addEventListener("DOMContentLoaded", async () => {

  const scoreform =  document.querySelector(".scoreForm")
  const tbody = document.querySelector("tbody");
  const scoreTable = document.querySelector("#scoreTable")
  const tableButtons = document.querySelector("#tableButtons");
  const addScoreButtons = document.querySelectorAll(".addScore");
  const formContainer = document.getElementById("formContainer");


  async function loadScores() {
    const data = await readScores();
    data.sort((a, b) => {
      return b.score !== a.score ? b.score - a.score : a.duration - b.duration;
    });

    if (data.length === 0) {
      scoreTable.style.display = "none";
      tableButtons.style.display = "none";
      noScoresMessage.style.display = "block"
    } else {
      scoreTable.style.display = "table";
      noScoresMessage.style.display = "none";
      tableButtons.style.display = "flex";

      tbody.innerHTML = "";
      data.forEach((item,index) => {
        let row="";
        if (index === 0) {
          row += `<tr class="first">
          <td>👑</td>`;
        } else if (index === 1) {
          row += `<tr class="second">
          <td>🥈</td>`;
        } else if (index === 2) {
          row += `<tr class="third">
          <td>🥉</td>`;
        }else{
          row += `<tr>
          <td></td>`;
        }
        
        row +=`<td>${item.userName}</td>
          <td>${item.score}</td>
          <td>${item.duration}s</td>
          <td><button class="trashButton" data-id="${item.id}"><i class="fas fa-trash"></i></button></td>
        </tr>
      `;
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
    }
  }
    addScoreButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (formContainer.style.display === "flex") {
          formContainer.style.display = "none";
          button.textContent = "Add Score";
        } else {
          formContainer.style.display = "flex";
          button.textContent = "Close Form";
        }
      });
    });

      scoreform.addEventListener("submit", async (e) => {
        e.preventDefault(); 
        

        const userName = e.target.userName.value.trim();
        const score = Math.floor(Math.random() * 10000); 
        const duration = Math.floor(Math.random() * 300); 

        if (!userName) return;

        const result = await createScore(userName, score, duration);

        if (result) {
          alert("Score saved!");
          loadScores(); 
          e.target.reset(); 
        }
        formContainer.style.display="none"
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
});
