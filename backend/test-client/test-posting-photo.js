// For this test to work, auth middleware must be removed or JWT must be passed in as header

const fileEl = document.getElementById("file");
const button = document.getElementById("button");

button.addEventListener("click", async () => {
  const formData = new FormData();

  formData.append("categories", JSON.stringify(["landscape", "plant"]));
  formData.append("favorite", "false");
  formData.append("front_page", "true");
  formData.append("image", fileEl.files[0]);
  formData.append("title", "This is a test title");
  formData.append("description", "This is a test description");

  const data = await fetch("http://localhost:4000/api/photo", {
    method: "POST",
    body: formData,
  });
  console.log("data sent");
  console.log(await data.json());
});
