// App Configuration
let supabase = null;

let currentUser = null;
let currentPage = 1;
const itemsPerPage = 10;

// Écouter l'événement Supabase prêt
window.addEventListener('supabaseReady', () => {
    supabase = getSupabaseClient();
    console.log('✅ App: Supabase client available');
});

window.addEventListener('supabaseFailed', () => {
    console.error('❌ App: Supabase client failed to load');
});

// Initialize App
function initApp() {
    // Vérifier si Supabase est déjà chargé
    if (typeof getSupabaseClient === 'function' && getSupabaseClient()) {
        supabase = getSupabaseClient();
        console.log('✅ Supabase already loaded');
    } else {
        console.log('⏳ Waiting for Supabase...');
        // Attendre le chargement
        setTimeout(initApp, 500);
        return;
    }
    
    renderHomePage();
}

function showError(message) {
    alert('⚠️ ' + message);
}

// Login Check
async function checkLogin() {
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

    if (!supabase) {
        console.warn('Supabase not ready yet, waiting...');
        errorMsg.textContent = 'Connexion en cours...';
        errorMsg.classList.add('show');
        setTimeout(() => checkLogin(), 1000);
        return;
    }

    try {
        console.log(`Vérification: ${program} / ${code}`);
        
        // Requête Supabase
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('program', program)
            .eq('code', code)
            .maybeSingle(); // Retourner null au lieu d'erreur si pas trouvé

        if (error) {
            console.error('Erreur requête:', error);
            throw error;
        }

        if (!data) {
            // Utilisateur non trouvé → Créer un compte
            console.log('Utilisateur non trouvé, création de compte');
            document.getElementById('programSelect').value = program;
            document.getElementById('codeInput').value = code;
            closeLoginPopup();
            openInfoPopup(program, code);
            return;
        }

        // Utilisateur trouvé
        console.log('Utilisateur trouvé:', data);
        currentUser = data;

        // Vérifier si Admin (P35 / 0099)
        if (program === 'P35' && code === '0099') {
            showAdminDashboard();
        } else {
            showUserHome();
        }
    } catch (error) {
        console.error('Erreur login:', error);
        errorMsg.textContent = 'Erreur de connexion: ' + (error.message || 'Réessayez');
        errorMsg.classList.add('show');
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

    createUserAsync(nom, prenom, niveau, email, program, code, errorMsg);
}

async function createUserAsync(nom, prenom, niveau, email, program, code, errorMsg) {
    if (!supabase) {
        errorMsg.textContent = 'Erreur de connexion à la base de données';
        errorMsg.classList.add('show');
        return;
    }

    try {
        const { data, error } = await supabase
            .from('users')
            .insert([
                {
                    program,
                    code,
                    nom,
                    prenom,
                    niveau,
                    email
                }
            ])
            .select()
            .single();

        if (error) {
            if (error.message.includes('duplicate')) {
                errorMsg.textContent = 'Email ou code déjà utilisé';
            } else {
                errorMsg.textContent = 'Erreur lors de la création du compte';
            }
            errorMsg.classList.add('show');
            return;
        }

        currentUser = data;
        closeInfoPopup();
        showUserHome();
    } catch (error) {
        console.error('Erreur création utilisateur:', error);
        errorMsg.textContent = 'Erreur lors de la création du compte';
        errorMsg.classList.add('show');
    }
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
async function showUserHome() {
    const app = document.getElementById('app');
    
    if (!supabase || !currentUser) {
        app.innerHTML = '<p style="color: red; padding: 20px;">Erreur: Veuillez vous reconnecter</p>';
        return;
    }

    try {
        const { data: userReclamations, error } = await supabase
            .from('reclamations')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erreur chargement réclamations:', error);
            app.innerHTML = '<p style="color: red; padding: 20px;">Erreur lors du chargement des réclamations</p>';
            return;
        }

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
            ${userReclamations && userReclamations.length > 0 ? `
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
    } catch (error) {
        console.error('Erreur chargement:', error);
        app.innerHTML = '<p style="color: red; padding: 20px;">Erreur lors du chargement</p>';
    }
}

function renderReclamationItem(rec, isUserPage = false) {
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
                    ${new Date(rec.created_at).toLocaleDateString('fr-FR')}
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

    addReclamationAsync(matiere, semestre, note, commentaire, errorMsg);
}

async function addReclamationAsync(matiere, semestre, note, commentaire, errorMsg) {
    if (!supabase) {
        errorMsg.textContent = 'Erreur de connexion à la base de données';
        errorMsg.classList.add('show');
        return;
    }

    if (!currentUser) {
        errorMsg.textContent = 'Erreur: utilisateur non connecté';
        errorMsg.classList.add('show');
        return;
    }

    try {
        const { error } = await supabase
            .from('reclamations')
            .insert([
                {
                    user_id: currentUser.id,
                    matiere,
                    semestre: parseInt(semestre),
                    note,
                    commentaire
                }
            ]);

        if (error) {
            errorMsg.textContent = 'Erreur lors de l\'ajout de la réclamation';
            errorMsg.classList.add('show');
            return;
        }

        closeReclamationPopup();
        showUserHome();
    } catch (error) {
        console.error('Erreur ajout réclamation:', error);
        errorMsg.textContent = 'Erreur lors de l\'ajout';
        errorMsg.classList.add('show');
    }
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
        deleteReclamationAsync(id);
    }
}

async function deleteReclamationAsync(id) {
    if (!supabase) {
        alert('Erreur: Base de données indisponible');
        return;
    }

    try {
        const { error } = await supabase
            .from('reclamations')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Erreur suppression:', error);
            alert('Erreur lors de la suppression');
            return;
        }

        showUserHome();
    } catch (error) {
        console.error('Erreur suppression:', error);
        alert('Erreur lors de la suppression');
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

        updateUserAsync(nom, prenom, niveau, email, errorMsg, oldCreateUser);
    };

    document.getElementById('infoPopup').classList.add('active');
}

async function updateUserAsync(nom, prenom, niveau, email, errorMsg, oldCreateUser) {
    if (!supabase) {
        errorMsg.textContent = 'Erreur: Base de données indisponible';
        errorMsg.classList.add('show');
        return;
    }

    try {
        const { error } = await supabase
            .from('users')
            .update({
                nom,
                prenom,
                niveau,
                email,
                updated_at: new Date()
            })
            .eq('id', currentUser.id);

        if (error) {
            errorMsg.textContent = 'Erreur lors de la mise à jour';
            errorMsg.classList.add('show');
            return;
        }

        currentUser.nom = nom;
        currentUser.prenom = prenom;
        currentUser.niveau = niveau;
        currentUser.email = email;

        window.createUser = oldCreateUser;
        document.getElementById('infoPopup').classList.remove('active');
        showUserHome();
    } catch (error) {
        console.error('Erreur mise à jour:', error);
        errorMsg.textContent = 'Erreur lors de la mise à jour';
        errorMsg.classList.add('show');
    }
}

// Admin Dashboard
async function showAdminDashboard() {
    const app = document.getElementById('app');
    
    if (!supabase) {
        app.innerHTML = '<p style="color: red; padding: 20px;">Erreur: Base de données indisponible</p>';
        return;
    }

    try {
        const { data: reclamations, error } = await supabase
            .from('reclamations')
            .select(`
                *,
                users(*)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erreur admin dashboard:', error);
            app.innerHTML = '<p style="color: red; padding: 20px;">Erreur lors du chargement des données</p>';
            return;
        }

        const totalReclamations = reclamations ? reclamations.length : 0;
        const totalPages = Math.ceil(totalReclamations / itemsPerPage);
        const startIdx = (currentPage - 1) * itemsPerPage;
        const paginatedReclamations = reclamations ? reclamations.slice(startIdx, startIdx + itemsPerPage) : [];

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
                        ${paginatedReclamations.map(rec => `
                            <tr>
                                <td>${rec.users?.prenom} ${rec.users?.nom}</td>
                                <td><span class="badge">${rec.users?.program}</span></td>
                                <td>${rec.matiere}</td>
                                <td>${rec.semestre}</td>
                                <td>${rec.note === 'NÉANT' ? '<span class="badge neant">NÉANT</span>' : rec.note}/20</td>
                                <td>
                                    <button class="btn btn-primary btn-small" onclick="showReclamationDetail(${rec.id})">Voir</button>
                                </td>
                            </tr>
                        `).join('')}
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
    } catch (error) {
        console.error('Erreur admin dashboard:', error);
        app.innerHTML = '<p style="color: red; padding: 20px;">Erreur lors du chargement</p>';
    }
}

function goToPage(page) {
    currentPage = page;
    showAdminDashboard();
}

async function showReclamationDetail(id) {
    if (!supabase) {
        alert('Erreur: Base de données indisponible');
        return;
    }

    try {
        const { data: rec, error } = await supabase
            .from('reclamations')
            .select('*, users(*)')
            .eq('id', id)
            .single();

        if (error || !rec) {
            console.error('Erreur chargement détail:', error);
            alert('Erreur lors du chargement du détail');
            return;
        }

        const detailContent = document.getElementById('detailContent');
        detailContent.innerHTML = `
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin-bottom: 15px;">Informations de l'Étudiant</h3>
                <div class="user-info-grid">
                    <div class="info-item">
                        <label>Nom</label>
                        <value>${rec.users?.nom || 'N/A'}</value>
                    </div>
                    <div class="info-item">
                        <label>Prénom</label>
                        <value>${rec.users?.prenom || 'N/A'}</value>
                    </div>
                    <div class="info-item">
                        <label>Niveau</label>
                        <value>${rec.users?.niveau || 'N/A'}</value>
                    </div>
                    <div class="info-item">
                        <label>Programme</label>
                        <value>${rec.users?.program || 'N/A'}</value>
                    </div>
                    <div class="info-item">
                        <label>Email</label>
                        <value>${rec.users?.email || 'N/A'}</value>
                    </div>
                    <div class="info-item">
                        <label>Date d'inscription</label>
                        <value>${rec.users?.created_at ? new Date(rec.users.created_at).toLocaleDateString('fr-FR') : 'N/A'}</value>
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
                        <value>${new Date(rec.created_at).toLocaleDateString('fr-FR')}</value>
                    </div>
                </div>
                <div style="margin-top: 15px;">
                    <label style="font-weight: 500; color: #666; display: block; margin-bottom: 8px;">Commentaire</label>
                    <div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #ddd;">${rec.commentaire}</div>
                </div>
            </div>
        `;

        document.getElementById('detailPopup').classList.add('active');
    } catch (error) {
        console.error('Erreur chargement détail:', error);
        alert('Erreur lors du chargement');
    }
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

async function downloadReclamations() {
    const matiere = document.getElementById('filterMatiere').value;
    const program = document.getElementById('filterProgram').value;
    const note = document.getElementById('filterNote').value;
    const format = document.getElementById('formatSelect').value;

    if (!supabase) {
        alert('Erreur: Base de données indisponible');
        return;
    }

    try {
        let query = supabase
            .from('reclamations')
            .select('*, users(*)');

        if (matiere) {
            query = query.eq('matiere', matiere);
        }

        if (note === 'NÉANT') {
            query = query.eq('note', 'NÉANT');
        } else if (note === 'NON_NEANT') {
            query = query.neq('note', 'NÉANT');
        }

        const { data: filtered, error } = await query;

        if (error) {
            console.error('Erreur filtrage:', error);
            alert('Erreur lors du téléchargement');
            return;
        }

        let finalData = filtered || [];
        if (program) {
            finalData = finalData.filter(r => r.users && r.users.program === program);
        }

        if (format === 'pdf') {
            downloadPDF(finalData);
        } else if (format === 'csv') {
            downloadCSV(finalData);
        } else if (format === 'json') {
            downloadJSON(finalData);
        }

        closeDownloadPopup();
    } catch (error) {
        console.error('Erreur téléchargement:', error);
        alert('Erreur lors du téléchargement');
    }
}

function downloadPDF(data) {
    let content = 'Réclamations - Rapport\n\n';
    content += `Date: ${new Date().toLocaleDateString('fr-FR')}\n\n`;

    data.forEach((rec, idx) => {
        content += `${idx + 1}. ${rec.users.prenom} ${rec.users.nom} (${rec.users.program})\n`;
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
        csv += `"${rec.users.prenom} ${rec.users.nom}","${rec.users.program}","${rec.matiere}",${rec.semestre},"${rec.note}","${rec.commentaire}","${new Date(rec.created_at).toLocaleDateString('fr-FR')}"\n`;
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
        return {
            etudiant: `${rec.users.prenom} ${rec.users.nom}`,
            programme: rec.users.program,
            matiere: rec.matiere,
            semestre: rec.semestre,
            note: rec.note,
            commentaire: rec.commentaire,
            date: new Date(rec.created_at).toLocaleDateString('fr-FR')
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
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
