// Firebase/Supabase Mock - Remplacez par votre configuration réelle
const DB = {
    users: [
        { id: 1, program: 'P35', code: '0099', nom: 'Admin', prenom: 'Système', niveau: 'L1', email: 'admin@uni.com', createdAt: new Date() }
    ],
    reclamations: [
        {
            id: 1,
            userId: 1,
            matiere: 'Informatique',
            semestre: 1,
            note: 'NÉANT',
            commentaire: 'Exemple de réclamation',
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ]
};

let currentUser = null;
let currentPage = 1;
const itemsPerPage = 10;

// Initialize App
function initApp() {
    renderHomePage();
}

// Login Check
function checkLogin() {
    const program = document.getElementById('programSelect').value;
    const code = document.getElementById('codeInput').value;
    const errorMsg = document.getElementById('errorMsg');

    errorMsg.classList.remove('show');

    if (!program || !code) {
        errorMsg.textContent = 'Veuillez remplir tous les champs';
        errorMsg.classList.add('show');
        return;
    }

    if (code.length !== 4 || isNaN(code)) {
        errorMsg.textContent = 'Le code doit contenir 4 chiffres';
        errorMsg.classList.add('show');
        return;
    }

    // Check Admin
    if (program === 'P35' && code === '0099') {
        currentUser = DB.users[0];
        showAdminDashboard();
        return;
    }

    // Check Regular User
    const user = DB.users.find(u => u.program === program && u.code === code);
    if (user) {
        currentUser = user;
        showUserHome();
    } else {
        // Show Info Popup
        document.getElementById('programSelect').value = program;
        document.getElementById('codeInput').value = code;
        closeLoginPopup();
        openInfoPopup(program, code);
    }
}

function openInfoPopup(program, code) {
    document.getElementById('loginPopup').classList.remove('active');
    document.getElementById('infoPopup').classList.add('active');
    document.getElementById('nomInput').focus();
}

function createUser() {
    const nom = document.getElementById('nomInput').value;
    const prenom = document.getElementById('prenomInput').value;
    const niveau = document.getElementById('niveauSelect').value;
    const email = document.getElementById('emailInput').value;
    const program = document.getElementById('programSelect').value;
    const code = document.getElementById('codeInput').value;
    const errorMsg = document.getElementById('infoErrorMsg');

    errorMsg.classList.remove('show');

    if (!nom || !prenom || !niveau || !email) {
        errorMsg.textContent = 'Veuillez remplir tous les champs';
        errorMsg.classList.add('show');
        return;
    }

    if (!email.includes('@')) {
        errorMsg.textContent = 'Email invalide';
        errorMsg.classList.add('show');
        return;
    }

    // Create User
    const newUser = {
        id: DB.users.length + 1,
        program,
        code,
        nom,
        prenom,
        niveau,
        email,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    DB.users.push(newUser);
    currentUser = newUser;

    closeInfoPopup();
    showUserHome();
}

function backToLogin() {
    closeInfoPopup();
    document.getElementById('loginPopup').classList.add('active');
    document.getElementById('nomInput').value = '';
    document.getElementById('prenomInput').value = '';
    document.getElementById('niveauSelect').value = '';
    document.getElementById('emailInput').value = '';
    document.getElementById('programSelect').value = '';
    document.getElementById('codeInput').value = '';
}

function closeLoginPopup() {
    document.getElementById('loginPopup').classList.remove('active');
}

function closeInfoPopup() {
    document.getElementById('infoPopup').classList.remove('active');
}

// User Home Page
function showUserHome() {
    const app = document.getElementById('app');
    
    const userReclamations = DB.reclamations.filter(r => r.userId === currentUser.id);

    app.innerHTML = `
        <div class="header">
            <h1>Accueil</h1>
            <div class="header-actions">
                <button class="btn btn-secondary" onclick="editUserInfo()">Modifier mes infos</button>
                <button class="btn btn-secondary" onclick="logout()">Déconnexion</button>
            </div>
        </div>

        <div class="welcome-message">
            <h2>Bienvenue à la page de réclamation pour les P35 et P34 de la Communication</h2>
            <p>Vous pouvez consulter vos réclamations ci-dessous ou en ajouter de nouvelles.</p>
        </div>

        <div class="user-info">
            <h2>Vos Informations Personnelles</h2>
            <div class="user-info-grid">
                <div class="info-item">
                    <label>Nom</label>
                    <value>${currentUser.nom}</value>
                </div>
                <div class="info-item">
                    <label>Prénom</label>
                    <value>${currentUser.prenom}</value>
                </div>
                <div class="info-item">
                    <label>Niveau</label>
                    <value>${currentUser.niveau}</value>
                </div>
                <div class="info-item">
                    <label>Email</label>
                    <value>${currentUser.email}</value>
                </div>
                <div class="info-item">
                    <label>Programme</label>
                    <value>${currentUser.program}</value>
                </div>
            </div>
            <button class="btn btn-primary" onclick="openReclamationPopup()">Ajouter une Réclamation</button>
        </div>

        <h2 style="margin-bottom: 20px;">Mes Réclamations</h2>
        ${userReclamations.length > 0 ? `
            <div class="reclamation-list">
                ${userReclamations.map(rec => renderReclamationItem(rec, true)).join('')}
            </div>
        ` : `
            <div class="empty-state">
                <h3>Aucune réclamation</h3>
                <p>Vous n'avez pas encore ajouté de réclamation.</p>
            </div>
        `}
    `;
}

function renderReclamationItem(rec, isUserPage = false) {
    const user = DB.users.find(u => u.id === rec.userId);
    return `
        <div class="reclamation-item">
            <h3>${rec.matiere}</h3>
            <div class="reclamation-item-info">
                <span>
                    <label>Semestre</label>
                    ${rec.semestre}
                </span>
                <span>
                    <label>Note</label>
                    ${rec.note === 'NÉANT' ? '<span class="badge neant">NÉANT</span>' : rec.note}
                </span>
                <span>
                    <label>Date</label>
                    ${new Date(rec.createdAt).toLocaleDateString('fr-FR')}
                </span>
            </div>
            <div class="reclamation-item-comment">
                <strong>Commentaire :</strong> ${rec.commentaire}
            </div>
            <div class="reclamation-item-actions">
                ${isUserPage ? `
                    <button class="btn btn-secondary btn-small" onclick="editReclamation(${rec.id})">Modifier</button>
                    <button class="btn btn-danger btn-small" onclick="deleteReclamation(${rec.id})">Supprimer</button>
                ` : `
                    <button class="btn btn-primary btn-small" onclick="showReclamationDetail(${rec.id})">Voir Détails</button>
                `}
            </div>
        </div>
    `;
}

function openReclamationPopup() {
    document.getElementById('reclamationPopup').classList.add('active');
    document.getElementById('matiereSelect').focus();
}

function closeReclamationPopup() {
    document.getElementById('reclamationPopup').classList.remove('active');
    document.getElementById('matiereSelect').value = '';
    document.getElementById('semestreSelect').value = '';
    document.getElementById('noteSelect').value = '';
    document.getElementById('commentaireInput').value = '';
    document.getElementById('reclamationErrorMsg').classList.remove('show');
}

function addReclamation() {
    const matiere = document.getElementById('matiereSelect').value;
    const semestre = document.getElementById('semestreSelect').value;
    const note = document.getElementById('noteSelect').value;
    const commentaire = document.getElementById('commentaireInput').value;
    const errorMsg = document.getElementById('reclamationErrorMsg');

    errorMsg.classList.remove('show');

    if (!matiere || !semestre || !note || !commentaire) {
        errorMsg.textContent = 'Veuillez remplir tous les champs';
        errorMsg.classList.add('show');
        return;
    }

    const newReclamation = {
        id: DB.reclamations.length + 1,
        userId: currentUser.id,
        matiere,
        semestre,
        note,
        commentaire,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    DB.reclamations.push(newReclamation);
    closeReclamationPopup();
    showUserHome();
}

function editReclamation(id) {
    const rec = DB.reclamations.find(r => r.id === id);
    if (!rec) return;

    document.getElementById('matiereSelect').value = rec.matiere;
    document.getElementById('semestreSelect').value = rec.semestre;
    document.getElementById('noteSelect').value = rec.note;
    document.getElementById('commentaireInput').value = rec.commentaire;

    const oldAddReclamation = addReclamation;
    window.addReclamation = function() {
        const matiere = document.getElementById('matiereSelect').value;
        const semestre = document.getElementById('semestreSelect').value;
        const note = document.getElementById('noteSelect').value;
        const commentaire = document.getElementById('commentaireInput').value;

        rec.matiere = matiere;
        rec.semestre = semestre;
        rec.note = note;
        rec.commentaire = commentaire;
        rec.updatedAt = new Date();

        window.addReclamation = oldAddReclamation;
        closeReclamationPopup();
        showUserHome();
    };

    openReclamationPopup();
}

function deleteReclamation(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réclamation ?')) {
        DB.reclamations = DB.reclamations.filter(r => r.id !== id);
        showUserHome();
    }
}

function editUserInfo() {
    document.getElementById('nomInput').value = currentUser.nom;
    document.getElementById('prenomInput').value = currentUser.prenom;
    document.getElementById('niveauSelect').value = currentUser.niveau;
    document.getElementById('emailInput').value = currentUser.email;
    document.getElementById('programSelect').value = currentUser.program;
    document.getElementById('codeInput').value = currentUser.code;

    const oldCreateUser = createUser;
    window.createUser = function() {
        const nom = document.getElementById('nomInput').value;
        const prenom = document.getElementById('prenomInput').value;
        const niveau = document.getElementById('niveauSelect').value;
        const email = document.getElementById('emailInput').value;
        const errorMsg = document.getElementById('infoErrorMsg');

        errorMsg.classList.remove('show');

        if (!nom || !prenom || !niveau || !email) {
            errorMsg.textContent = 'Veuillez remplir tous les champs';
            errorMsg.classList.add('show');
            return;
        }

        if (!email.includes('@')) {
            errorMsg.textContent = 'Email invalide';
            errorMsg.classList.add('show');
            return;
        }

        currentUser.nom = nom;
        currentUser.prenom = prenom;
        currentUser.niveau = niveau;
        currentUser.email = email;
        currentUser.updatedAt = new Date();

        window.createUser = oldCreateUser;
        closeInfoPopup();
        showUserHome();
    };

    document.getElementById('infoPopup').classList.add('active');
}

// Admin Dashboard
function showAdminDashboard() {
    const app = document.getElementById('app');
    
    const totalReclamations = DB.reclamations.length;
    const totalPages = Math.ceil(DB.reclamations.length / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    const paginatedReclamations = DB.reclamations.slice(startIdx, startIdx + itemsPerPage);

    app.innerHTML = `
        <div class="admin-header">
            <div>
                <h1>Dashboard Admin</h1>
                <p style="color: #666; margin-top: 5px;">Total Réclamations: ${totalReclamations}</p>
            </div>
            <div class="header-actions">
                <button class="btn btn-primary" onclick="openDownloadPopup()">Télécharger</button>
                <button class="btn btn-secondary" onclick="logout()">Déconnexion</button>
            </div>
        </div>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Étudiant</th>
                        <th>Programme</th>
                        <th>Matière</th>
                        <th>Semestre</th>
                        <th>Note</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${paginatedReclamations.map(rec => {
                        const user = DB.users.find(u => u.id === rec.userId);
                        return `
                            <tr>
                                <td>${user.prenom} ${user.nom}</td>
                                <td><span class="badge">${user.program}</span></td>
                                <td>${rec.matiere}</td>
                                <td>${rec.semestre}</td>
                                <td>${rec.note === 'NÉANT' ? '<span class="badge neant">NÉANT</span>' : rec.note}/20</td>
                                <td>
                                    <button class="btn btn-primary btn-small" onclick="showReclamationDetail(${rec.id})">Voir</button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>

        ${totalPages > 1 ? `
            <div class="pagination">
                ${Array.from({ length: totalPages }, (_, i) => i + 1).map(page => `
                    <button ${page === currentPage ? 'class="active"' : ''} onclick="goToPage(${page})">${page}</button>
                `).join('')}
            </div>
        ` : ''}
    `;
}

function goToPage(page) {
    currentPage = page;
    showAdminDashboard();
}

function showReclamationDetail(id) {
    const rec = DB.reclamations.find(r => r.id === id);
    const user = DB.users.find(u => u.id === rec.userId);

    if (!rec || !user) return;

    const detailContent = document.getElementById('detailContent');
    detailContent.innerHTML = `
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-bottom: 15px;">Informations de l'Étudiant</h3>
            <div class="user-info-grid">
                <div class="info-item">
                    <label>Nom</label>
                    <value>${user.nom}</value>
                </div>
                <div class="info-item">
                    <label>Prénom</label>
                    <value>${user.prenom}</value>
                </div>
                <div class="info-item">
                    <label>Niveau</label>
                    <value>${user.niveau}</value>
                </div>
                <div class="info-item">
                    <label>Programme</label>
                    <value>${user.program}</value>
                </div>
                <div class="info-item">
                    <label>Email</label>
                    <value>${user.email}</value>
                </div>
                <div class="info-item">
                    <label>Date d'inscription</label>
                    <value>${new Date(user.createdAt).toLocaleDateString('fr-FR')}</value>
                </div>
            </div>
        </div>

        <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
            <h3 style="margin-bottom: 15px;">Détail de la Réclamation</h3>
            <div class="user-info-grid">
                <div class="info-item">
                    <label>Matière</label>
                    <value>${rec.matiere}</value>
                </div>
                <div class="info-item">
                    <label>Semestre</label>
                    <value>${rec.semestre}</value>
                </div>
                <div class="info-item">
                    <label>Note</label>
                    <value>${rec.note === 'NÉANT' ? '<span class="badge neant">NÉANT</span>' : rec.note + '/20'}</value>
                </div>
                <div class="info-item">
                    <label>Date</label>
                    <value>${new Date(rec.createdAt).toLocaleDateString('fr-FR')}</value>
                </div>
            </div>
            <div style="margin-top: 15px;">
                <label style="font-weight: 500; color: #666; display: block; margin-bottom: 8px;">Commentaire</label>
                <div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #ddd;">${rec.commentaire}</div>
            </div>
        </div>
    `;

    document.getElementById('detailPopup').classList.add('active');
}

function closeDetailPopup() {
    document.getElementById('detailPopup').classList.remove('active');
}

// Download Popup
function openDownloadPopup() {
    document.getElementById('downloadPopup').classList.add('active');
}

function closeDownloadPopup() {
    document.getElementById('downloadPopup').classList.remove('active');
}

function downloadReclamations() {
    const matiere = document.getElementById('filterMatiere').value;
    const program = document.getElementById('filterProgram').value;
    const note = document.getElementById('filterNote').value;
    const format = document.getElementById('formatSelect').value;

    let filtered = DB.reclamations;

    if (matiere) {
        filtered = filtered.filter(r => r.matiere === matiere);
    }

    if (program) {
        const user = DB.users.find(u => u.program === program);
        filtered = filtered.filter(r => r.userId === user?.id);
    }

    if (note === 'NÉANT') {
        filtered = filtered.filter(r => r.note === 'NÉANT');
    } else if (note === 'NON_NEANT') {
        filtered = filtered.filter(r => r.note !== 'NÉANT');
    }

    if (format === 'pdf') {
        downloadPDF(filtered);
    } else if (format === 'csv') {
        downloadCSV(filtered);
    } else if (format === 'json') {
        downloadJSON(filtered);
    }

    closeDownloadPopup();
}

function downloadPDF(data) {
    let content = 'Réclamations - Rapport\n\n';
    content += `Date: ${new Date().toLocaleDateString('fr-FR')}\n\n`;

    data.forEach((rec, idx) => {
        const user = DB.users.find(u => u.id === rec.userId);
        content += `${idx + 1}. ${user.prenom} ${user.nom} (${user.program})\n`;
        content += `   Matière: ${rec.matiere}\n`;
        content += `   Semestre: ${rec.semestre}\n`;
        content += `   Note: ${rec.note}\n`;
        content += `   Commentaire: ${rec.commentaire}\n\n`;
    });

    const blob = new Blob([content], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reclamations_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function downloadCSV(data) {
    let csv = 'Étudiant,Programme,Matière,Semestre,Note,Commentaire,Date\n';

    data.forEach(rec => {
        const user = DB.users.find(u => u.id === rec.userId);
        csv += `"${user.prenom} ${user.nom}","${user.program}","${rec.matiere}",${rec.semestre},"${rec.note}","${rec.commentaire}","${new Date(rec.createdAt).toLocaleDateString('fr-FR')}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reclamations_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function downloadJSON(data) {
    const jsonData = data.map(rec => {
        const user = DB.users.find(u => u.id === rec.userId);
        return {
            etudiant: `${user.prenom} ${user.nom}`,
            programme: user.program,
            matiere: rec.matiere,
            semestre: rec.semestre,
            note: rec.note,
            commentaire: rec.commentaire,
            date: new Date(rec.createdAt).toLocaleDateString('fr-FR')
        };
    });

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reclamations_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function renderHomePage() {
    const app = document.getElementById('app');
    app.innerHTML = '';
    document.getElementById('loginPopup').classList.add('active');
}

function logout() {
    currentUser = null;
    currentPage = 1;
    renderHomePage();
}

// Initialize
document.addEventListener('DOMContentLoaded', initApp);
