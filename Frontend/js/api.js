
export async function readScores() {
  try {
    const response = await axios.get(
      "http://localhost/solitare/backend/api/read.php"
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch scores:", error);
    return [];
  }
}

export async function createScore(userName, score, duration) {
  try {
    const response = await axios.post(
      "http://localhost/solitare/backend/api/read.php",
      {
        userName,
        score,
        duration,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to add score:", error);
    return null;
  }
}

export async function deleteScore(id) {
  try {
    await axios.delete(
      `http://localhost/solitare/backend/api/read.php?id=${id}`
    );
    return true;
  } catch (error) {
    console.error("Failed to delete score:", error);
    return false;
  }
}
