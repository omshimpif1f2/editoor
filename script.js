
const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");
const uploadContent = document.getElementById("uploadContent");
const removeBtn = document.getElementById("removeBtn");
const removeImageBtn = document.getElementById("removeImageBtn");
const previewWrapper = document.querySelector(".preview-wrapper");
const uploadBox = document.querySelector(".upload-box");
const messageBox = document.getElementById("messageBox");

function showMessage(type,message){

    messageBox.className="";

    messageBox.classList.add(type);

    messageBox.innerHTML=message;

    messageBox.classList.add("show");

    setTimeout(()=>{
        messageBox.classList.remove("show");
    },4000);

}

let selectedFile = null;
let resultUrl = null;

function showImage(file) {
  if (!file || !file.type.startsWith("image/")) {
    showMessage(
"error",
"❌ Please upload an image first."
);
  }

  selectedFile = file;
  resultUrl = null;

  previewImage.src = URL.createObjectURL(file);
  uploadContent.style.display = "none";
  previewWrapper.classList.add("active");

  removeImageBtn.style.display = "flex";
  removeBtn.style.display = "inline-block";
  removeBtn.innerText = "🚀 Remove Background";
  removeBtn.disabled = false;
}

imageInput.addEventListener("change", () => {
  showImage(imageInput.files[0]);
});

uploadBox.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadBox.classList.add("dragging");
});

uploadBox.addEventListener("dragleave", () => {
  uploadBox.classList.remove("dragging");
});

uploadBox.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadBox.classList.remove("dragging");

  const file = e.dataTransfer.files[0];
  showImage(file);
});

removeImageBtn.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();

  imageInput.value = "";
  selectedFile = null;
  resultUrl = null;

  previewImage.src = "";
  uploadContent.style.display = "block";
  previewWrapper.classList.remove("active");

  removeImageBtn.style.display = "none";
  removeBtn.style.display = "none";
  removeBtn.innerText = "🚀 Remove Background";
  removeBtn.disabled = false;
});

removeBtn.addEventListener("click", async () => {
  if (resultUrl) {
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "editoor-ai-bg-removed.png";
    a.click();
    return;
  }

  if (!selectedFile) {
    alert("Please upload an image first.");
    return;
  }

  removeBtn.innerText = "⏳ Removing Background...";
  removeBtn.disabled = true;

  const formData = new FormData();
  formData.append("image_file", selectedFile);
  formData.append("size", "auto");

  try {
    const response = await fetch("/api/remove-bg", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const blob = await response.blob();
    resultUrl = URL.createObjectURL(blob);

    previewImage.src = resultUrl;
    removeBtn.innerText = "⬇ Download PNG";
  } catch (error) {
    console.error(error);
    alert("Error: check API key or credits.");
    removeBtn.innerText = "🚀 Remove Background";
  }

  removeBtn.disabled = false;
});
