// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDAZekCEenSVQuYPB2jGqdXc3sllfDqg-M",
    authDomain: "agendawebccb.firebaseapp.com",
    databaseURL: "https://agendawebccb-default-rtdb.firebaseio.com",
    projectId: "agendawebccb",
    storageBucket: "agendawebccb.appspot.com",
    messagingSenderId: "1002090805726",
    appId: "1:1002090805726:web:d9aab35124d174e85d454f"
};

// Firebase initialization
let app;
let database;
let agendamentos = [];

// Initialize Firebase with error handling
async function inicializarFirebase() {
    try {
        console.log("Iniciando conexão com Firebase...");
        
        // Check if Firebase instance already exists
        if (!app) {
            app = initializeApp(firebaseConfig);
            database = getDatabase(app);
        }

        // Listen for data changes
        const agendamentosRef = ref(database, 'agendamentos');
        onValue(agendamentosRef, (snapshot) => {
            agendamentos = snapshot.val() || [];
            console.log("Agendamentos atualizados:", agendamentos);
        });

        console.log("Firebase inicializado com sucesso!");
    } catch (error) {
        console.error("Erro ao inicializar Firebase:", error);
        throw error;
    }
}

// Global functions
function verificarAutenticacao() {
    // Implement authentication check
    return true; // Replace with actual authentication logic
}

function mostrarAlerta(mensagem, tipo) {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${mensagem}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Add to body
    document.body.appendChild(alertDiv);

    // Remove after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Event listeners for exports
export function setupExportListeners() {
    document.getElementById("btnExportPDF").addEventListener("click", async () => {
        if (!verificarAutenticacao()) return;
        try {
            await inicializarFirebase();
            await exportarPDF();
            mostrarAlerta("PDF gerado com sucesso!", "success");
        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
            mostrarAlerta("Erro ao gerar PDF: " + error.message, "danger");
        }
    });

    document.getElementById("btnExportXLS").addEventListener("click", () => {
        if (!verificarAutenticacao()) return;
        try {
            inicializarFirebase();
            exportarXLS();
            mostrarAlerta("XLS gerado com sucesso!", "success");
        } catch (error) {
            console.error("Erro ao gerar XLS:", error);
            mostrarAlerta("Erro ao gerar XLS: " + error.message, "danger");
        }
    });

    document.getElementById("btnExportPNG").addEventListener("click", async () => {
        if (!verificarAutenticacao()) return;
        try {
            inicializarFirebase();
            await exportarPNG();
            mostrarAlerta("PNG gerado com sucesso!", "success");
        } catch (error) {
            console.error("Erro ao gerar PNG:", error);
            mostrarAlerta("Erro ao gerar PNG: " + error.message, "danger");
        }
    });
}

// Login event listeners
export function setupLoginListeners() {
    document.getElementById("btnConfirmarLogin").addEventListener("click", () => {
        const senha = document.getElementById("senha").value;
        if (autenticar(senha)) {
            document.getElementById("senha").value = "";
        }
    });

    document.getElementById("formLogin").addEventListener("submit", (e) => {
        e.preventDefault();
        const senha = document.getElementById("senha").value;
        if (autenticar(senha)) {
            document.getElementById("senha").value = "";
        }
    });

    document.getElementById("modalLogin").addEventListener("hidden.bs.modal", () => {
        document.getElementById("senha").value = "";
    });
}
