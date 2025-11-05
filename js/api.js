export async function readScores() {
  try {
    const response = await axios.get("/solitare/backend/api/read.php");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch scores:", error);
    return [];
  }
}

export async function createScore(userName, score, duration) {
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

export async function deleteScore(id) {
  try {
    await axios.delete(`/solitare/backend/api/delete.php?id=${id}`);
    return true;
  } catch (error) {
    console.error("Failed to delete score:", error);
    return false;
  }
}