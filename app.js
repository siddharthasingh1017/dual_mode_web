/*******************************
 * API ENDPOINTS (EDIT HERE)
 *******************************/
const captionApiURL = "https://lithographic-deeann-unlamed.ngrok-free.dev/caption";  // BLIP API
const t2iApiURL = "https://monosymmetric-rodger-cytologically.ngrok-free.dev/generate"; // CLIP API


/*******************************
 * IMAGE → TEXT  (BLIP Caption)
 *******************************/
document.getElementById("caption-btn").addEventListener("click", async () => {
    const fileInput = document.getElementById("image-upload");
    const output = document.getElementById("cap-text");
    const preview = document.getElementById("cap-preview");
    const spinner = document.getElementById("cap-spinner");

    if (fileInput.files.length === 0) {
        output.innerText = "Please upload an image first!";
        return;
    }

    const file = fileInput.files[0];

    // Show preview
    preview.src = URL.createObjectURL(file);

    const formData = new FormData();
    formData.append("image", file);

    try {
        output.innerText = "Generating caption...";
        spinner.classList.remove("hidden");

        const res = await fetch(captionApiURL, {
            method: "POST",
            body: formData
        });

        spinner.classList.add("hidden");

        if (!res.ok) {
            output.innerText = "Server Error: " + await res.text();
            return;
        }

        const data = await res.json();
        output.innerText = "Caption: " + data.caption;

    } catch (err) {
        spinner.classList.add("hidden");
        output.innerText = "Error: " + err.message;
    }
});



/*******************************
 * TEXT → IMAGE  (CLIP Generate)
 *******************************/
document.getElementById("generate-btn").addEventListener("click", async () => {
    const prompt = document.getElementById("t2i-prompt").value.trim();
    const outputImg = document.getElementById("t2i-img");
    const outputInfo = document.getElementById("t2i-info");
    const spinner = document.getElementById("t2i-spinner");

    if (!prompt) {
        outputInfo.innerText = "Please enter a prompt!";
        return;
    }

    try {
        spinner.classList.remove("hidden");
        outputInfo.innerText = "Generating image...";

        const res = await fetch(t2iApiURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: prompt })
        });

        spinner.classList.add("hidden");

        if (!res.ok) {
            outputInfo.innerText = "Server Error: " + await res.text();
            return;
        }

        const blob = await res.blob();
        const imgURL = URL.createObjectURL(blob);

        outputImg.src = imgURL;
        outputInfo.innerText = "Generated from your prompt.";

        document.getElementById("download-t2i").onclick = () => {
            const a = document.createElement("a");
            a.href = imgURL;
            a.download = "generated.png";
            a.click();
        };

    } catch (err) {
        spinner.classList.add("hidden");
        outputInfo.innerText = "Error: " + err.message;
    }
});
