function runCode() {
    const code = document.getElementById("editor").value;
    const iframe = document.getElementById("resultFrame");
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(code);
    doc.close();
    showFrameSize();
}

function toggleTheme() {
    document.body.classList.toggle("darktheme");
}

function showFrameSize() {
    const iframe = document.getElementById("resultFrame");
    const width = iframe.clientWidth;
    const height = iframe.clientHeight;
    document.getElementById("framesize").textContent = `Size: ${width}px x ${height}px`;
}

function saveCode() {
    const code = document.getElementById("editor").value;
    const blob = new Blob([code], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "code.html";
    a.click();
    URL.revokeObjectURL(a.href);
}

function uploadCode(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById("editor").value = e.target.result;
        };
        reader.readAsText(file);
    }
}

let isDragging = false;
let animationFrameId;

function dragStart(e) {
    isDragging = true;
    document.addEventListener("mousemove", dragMove);
    document.addEventListener("mouseup", dragEnd);
    document.body.style.cursor = 'col-resize';
}

function dragMove(e) {
    if (isDragging) {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        animationFrameId = requestAnimationFrame(() => {
            const container = document.getElementById("container");
            const editor = document.getElementById("editor");
            const result = document.getElementById("result");
            const dragbar = document.getElementById("dragbar");
            const percentage = (e.clientX / window.innerWidth) * 100;
            editor.style.width = `${percentage}%`;
            result.style.width = `calc(100% - ${percentage}%)`;
            dragbar.style.left = `${percentage}%`;
            showFrameSize();
        });
    }
}

function dragEnd() {
    isDragging = false;
    document.removeEventListener("mousemove", dragMove);
    document.removeEventListener("mouseup", dragEnd);
    document.body.style.cursor = 'default';
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}

document.getElementById("dragbar").addEventListener("mousedown", dragStart);
document.getElementById("upload").addEventListener("change", uploadCode);
window.addEventListener("load", showFrameSize);
window.addEventListener("resize", () => {
    const result = document.getElementById("result");
    const dragbar = document.getElementById("dragbar");
    result.style.width = "50%";
    dragbar.style.left = "50%";
    showFrameSize();
});
