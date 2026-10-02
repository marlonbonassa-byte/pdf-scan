// ======================================================
// 1. ELEMENTOS DA TELA
// Liga o JavaScript aos elementos existentes no HTML.
// ======================================================

const cameraInput = document.querySelector("#camera-input");
const photoInput = document.querySelector("#photo-input");
const scanButton = document.querySelector("#scan-button");
const photoButton = document.querySelector("#photo-button");
const retakeButton = document.querySelector("#retake-button");
const saveButton = document.querySelector("#save-button");
const previewImage = document.querySelector("#preview-image");
const emptyState = document.querySelector("#empty-state");
const previewTag = document.querySelector("#preview-tag");
const filenameInput = document.querySelector("#filename");
const fileExtension = document.querySelector("#file-extension");
const statusMessage = document.querySelector("#status-message");


// ======================================================
// 2. ESTADO DO APP
// Guarda temporariamente a imagem escolhida e sua prévia.
// Nada aqui é salvo permanentemente.
// ======================================================

let selectedFile = null;
let previewUrl = null;
let statusTimer = null;


// ======================================================
// 3. ABRIR CÂMERA / GALERIA
// Limpa a seleção anterior e "clica" no input escondido.
// ======================================================

function openFilePicker(input) {
    input.value = "";
    input.click();
}


// ======================================================
// 4. MENSAGENS PARA O USUÁRIO
// Mostra um aviso e apaga automaticamente após 3,5 segundos.
// ======================================================

function showStatus(message) {
    statusMessage.textContent = message;

    window.clearTimeout(statusTimer);

    statusTimer = window.setTimeout(() => {
        statusMessage.textContent = "";
    }, 3500);
}


// ======================================================
// 5. RECEBER A IMAGEM
// Confere se é imagem, cria a prévia e libera os controles.
// ======================================================

function setSelectedFile(file) {
    if (!file || !file.type.startsWith("image/")) {
        showStatus("Escolha um arquivo de imagem para continuar.");
        return;
    }

    // Apaga da memória a URL temporária da imagem anterior.
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    selectedFile = file;

    // Cria uma URL temporária para mostrar a imagem na tela.
    // Não é um endereço real da internet.
    previewUrl = URL.createObjectURL(file);

    previewImage.src = previewUrl;
    previewImage.hidden = false;
    emptyState.hidden = true;
    previewTag.hidden = false;
    filenameInput.disabled = false;

    // Separa "foto.jpg" em:
    // nome = "foto"
    // extensão = ".jpg"
    const lastDot = file.name.lastIndexOf(".");
    const baseName = lastDot > 0 ? file.name.slice(0, lastDot) : file.name;
    const extension = lastDot > 0
        ? file.name.slice(lastDot).toLowerCase()
        : ".jpg";

    filenameInput.value = baseName || "documento";
    fileExtension.textContent = extension;

    retakeButton.disabled = false;
    saveButton.disabled = false;

    showStatus("Imagem pronta para salvar.");
}


// ======================================================
// 6. LIMPAR / RECOMEÇAR
// Volta o scanner ao estado inicial.
// ======================================================

function clearSelection() {
    selectedFile = null;

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    previewUrl = null;

    previewImage.removeAttribute("src");
    previewImage.hidden = true;

    emptyState.hidden = false;
    previewTag.hidden = true;

    filenameInput.value = "documento";
    filenameInput.disabled = true;

    fileExtension.textContent = "—";

    retakeButton.disabled = true;
    saveButton.disabled = true;

    statusMessage.textContent = "";
}


// ======================================================
// 7. SALVAR IMAGEM
// Cria temporariamente um link de download e simula o clique.
// IMPORTANTE: nesta versão o navegador decide onde salvar.
// Futuro: salvar/organizar na pasta própria do aplicativo.
// ======================================================

function saveImage() {
    if (!selectedFile) return;

    // Remove caracteres proibidos em nomes de arquivos.
    const safeName = filenameInput.value
        .trim()
        .replace(/[\\/:*?"<>|]/g, "-")
        .replace(/\s+/g, " ") || "documento";

    const downloadLink = document.createElement("a");

    downloadLink.href = previewUrl;
    downloadLink.download = `${safeName}${fileExtension.textContent}`;

    document.body.append(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    showStatus("Download iniciado.");
}


// ======================================================
// 8. EVENTOS DOS BOTÕES
// Define o que acontece quando o usuário interage com a tela.
// ======================================================

scanButton.addEventListener("click", () => openFilePicker(cameraInput));

photoButton.addEventListener("click", () => openFilePicker(photoInput));

retakeButton.addEventListener("click", () => openFilePicker(cameraInput));

saveButton.addEventListener("click", saveImage);


// ======================================================
// 9. QUANDO UMA IMAGEM É ESCOLHIDA
// Envia o arquivo escolhido para setSelectedFile().
// ======================================================

cameraInput.addEventListener("change", () => {
    setSelectedFile(cameraInput.files[0]);
});

photoInput.addEventListener("change", () => {
    setSelectedFile(photoInput.files[0]);
});


// ======================================================
// 10. LIMPEZA DE MEMÓRIA
// Quando sair da página, libera a URL temporária da imagem.
// ======================================================

window.addEventListener("pagehide", () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
});