document.addEventListener('DOMContentLoaded', function() {
   //  Check authentication first - DISABLED FOR TESTING
    if (!checkAuthentication()) {
        window.location.href = 'login.html';
        return;
    }

    // Navigation functionality
    const navItems = document.querySelectorAll('.nav-item');
    const pageContents = document.querySelectorAll('.page-content');
    const pageTitle = document.getElementById('page-title');

    // Initialize user profile and dashboard data
    initializeUserProfile();
    initializeDashboardData();
    loadAllTableData();

    // Show dashboard by default
    showPage('dashboard');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const page = this.dataset.page;
            
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked nav item
            this.classList.add('active');
            
            // Show selected page
            showPage(page);
            
            // Update page title
            updatePageTitle(page);
        });
    });

    function showPage(pageName) {
        // Hide all pages
        pageContents.forEach(content => {
            content.classList.add('hidden');
        });
        
        // Show selected page
        const selectedPage = document.getElementById(pageName + '-page');
        if (selectedPage) {
            selectedPage.classList.remove('hidden');
        }
    }

    function updatePageTitle(pageName) {
        const titles = {
            'dashboard': 'Dashboard',
            'kelas-online': 'Manage Kelas Online',
            'kajian': 'Manage Kajian',
            'sedekah': 'Manage Sedekah',
            'mentor': 'Manage Mentor',
            'customer': 'Manage Customer'
        };
        
        pageTitle.textContent = titles[pageName] || 'Dashboard';
    }

    // Logout functionality
    const logoutBtn = document.querySelector('.logout-btn');
    logoutBtn.addEventListener('click', function() {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            // Clear user data and redirect to login
            logout();
        }
    });

    // Initialize form submission
    const crudForm = document.getElementById('crudForm');
    crudForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmit();
    });

    // Initialize profile form submission
    const profileForm = document.getElementById('profileForm');
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleProfileUpdate();
    });
});

// Authentication check - DISABLED FOR TESTING
function checkAuthentication() {
    return false; // Uncomment this line to enable authentication again
    return true; // Comment this line to enable authentication again
    
    // Original authentication code (commented out)
    
    const currentUser = localStorage.getItem('currentUser');
    const authToken = localStorage.getItem('authToken');
    
    if (!currentUser || !authToken) {
        return false;
    }
    
    // Check if token is expired (optional)
    try {
        const user = JSON.parse(currentUser);
        if (user.expiresAt && new Date() > new Date(user.expiresAt)) {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('authToken');
            return false;
        }
    } catch (e) {
        return false;
    }
    
    return true;

}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    // window.location.href = 'login.html'; // Commented out for testing
    alert('Logout berhasil! (Mode testing - tidak redirect ke login)');
}

// Global variables
let currentPage = '';
let selectedRowId = null;
let isEditMode = false;

// Sample data storage (replace with actual database calls)
let dataStorage = {
    'kelas-online': [],
    'kajian': [],
    'sedekah': [],
    'mentor': [],
    'customer': []
};

// Initialize user profile from localStorage or session
function initializeUserProfile() {
    // Get user data from localStorage (set during login)
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {
        name: 'Admin',
        email: 'admin@gmail.com',
        role: 'Super Admin',
        profileImage: null
    };
    
    // Update profile display
    document.getElementById('profile-name').textContent = currentUser.name;
    document.getElementById('profile-email').textContent = currentUser.email;
    
    // Update profile image
    if (currentUser.profileImage) {
        document.getElementById('profile-image').src = currentUser.profileImage;
        document.getElementById('profile-image').style.display = 'block';
        document.getElementById('profile-icon').style.display = 'none';
    } else {
        document.getElementById('profile-image').style.display = 'none';
        document.getElementById('profile-icon').style.display = 'block';
    }
}

// Show profile modal
function showProfileModal() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    
    // Populate form with current data
    document.getElementById('profileName').value = currentUser.name || '';
    document.getElementById('profileEmail').value = currentUser.email || '';
    document.getElementById('profilePassword').value = '';
    
    // Show current profile image
    if (currentUser.profileImage) {
        document.getElementById('profilePreview').src = currentUser.profileImage;
        document.getElementById('profilePreview').style.display = 'block';
        document.getElementById('profilePreviewIcon').style.display = 'none';
    } else {
        document.getElementById('profilePreview').style.display = 'none';
        document.getElementById('profilePreviewIcon').style.display = 'block';
    }
    
    document.getElementById('profileModal').classList.remove('hidden');
}

// Close profile modal
function closeProfileModal() {
    document.getElementById('profileModal').classList.add('hidden');
    document.getElementById('profileForm').reset();
}

// Preview profile image
function previewProfileImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            document.getElementById('profilePreview').src = e.target.result;
            document.getElementById('profilePreview').style.display = 'block';
            document.getElementById('profilePreviewIcon').style.display = 'none';
        };
        
        reader.readAsDataURL(input.files[0]);
    }
}

// Handle profile update
function handleProfileUpdate() {
    const formData = new FormData(document.getElementById('profileForm'));
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Get current user data
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    
    // Update user data
    const updatedUser = {
        ...currentUser,
        name: name,
        email: email
    };
    
    // Handle profile image
    const fileInput = document.getElementById('profileFileInput');
    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            updatedUser.profileImage = e.target.result;
            saveProfileUpdate(updatedUser, password);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        saveProfileUpdate(updatedUser, password);
    }
}

// Save profile update
function saveProfileUpdate(updatedUser, password) {
    // Here you would typically send this to your backend
    // For now, we'll just update localStorage
    
    // Update localStorage
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Update profile display
    initializeUserProfile();
    
    // Show success message
    alert('Profile berhasil diupdate!');
    
    // Close modal
    closeProfileModal();
}

// Initialize dashboard with dynamic data
function initializeDashboardData() {
    // Load data from storage/database
    loadDashboardStats();
    loadRecentActivities();
}

// Load dashboard statistics
function loadDashboardStats() {
    // Count total data from each table
    const totalKelas = dataStorage['kelas-online'].length;
    const totalKajian = dataStorage['kajian'].length;
    const totalMentor = dataStorage['mentor'].length;
    const totalCustomer = dataStorage['customer'].length;
    
    // Calculate total donations
    const totalDonasi = dataStorage['sedekah'].reduce((sum, item) => {
        return sum + (parseInt(item.terkumpul) || 0);
    }, 0);
    
    // Update dashboard stats
    document.getElementById('total-kelas').textContent = totalKelas;
    document.getElementById('total-kajian').textContent = totalKajian;
    document.getElementById('total-donasi').textContent = `Rp ${totalDonasi.toLocaleString()}`;
    document.getElementById('total-pengguna').textContent = totalCustomer;
}

// Load recent activities
function loadRecentActivities() {
    const activityList = document.getElementById('activity-list');
    const activities = [];
    
    // Collect activities from different data sources
    dataStorage['kelas-online'].forEach(kelas => {
        if (kelas.createdAt) {
            activities.push({
                type: 'kelas',
                title: 'Kelas online baru ditambahkan',
                desc: `"${kelas.nama}" oleh ${kelas.mentor}`,
                time: getTimeAgo(kelas.createdAt),
                icon: 'blue'
            });
        }
    });
    
    dataStorage['kajian'].forEach(kajian => {
        if (kajian.createdAt) {
            activities.push({
                type: 'kajian',
                title: 'Pendaftaran kajian baru',
                desc: `"${kajian.judul}" - ${kajian.partisipasi || 0} partisipasi`,
                time: getTimeAgo(kajian.createdAt),
                icon: 'green'
            });
        }
    });
    
    dataStorage['sedekah'].forEach(sedekah => {
        if (sedekah.createdAt) {
            activities.push({
                type: 'sedekah',
                title: 'Donasi baru diterima',
                desc: `Rp ${sedekah.terkumpul} untuk "${sedekah.program}"`,
                time: getTimeAgo(sedekah.createdAt),
                icon: 'yellow'
            });
        }
    });
    
    // Sort activities by time (newest first)
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    
    // Display activities (max 5)
    if (activities.length === 0) {
        activityList.innerHTML = '<div class="no-activity"><p>Belum ada aktivitas terbaru</p></div>';
    } else {
        activityList.innerHTML = activities.slice(0, 5).map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.icon}">
                    <i class="fas fa-${getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <p class="activity-title">${activity.title}</p>
                    <p class="activity-desc">${activity.desc}</p>
                    <p class="activity-time">${activity.time}</p>
                </div>
            </div>
        `).join('');
    }
}

// Get activity icon based on type
function getActivityIcon(type) {
    const icons = {
        'kelas': 'laptop',
        'kajian': 'book-open',
        'sedekah': 'hands-helping'
    };
    return icons[type] || 'info-circle';
}

// Get time ago from date
function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Baru saja';
    if (diffInHours < 24) return `${diffInHours} Jam yang lalu`;
    if (diffInHours < 48) return 'Kemarin';
    return `${Math.floor(diffInHours / 24)} Hari yang lalu`;
}

// Load all table data
function loadAllTableData() {
    // Load data for each table type
    Object.keys(dataStorage).forEach(pageType => {
        loadTableData(pageType);
    });
}

// Load table data for specific page
function loadTableData(pageType) {
    const tbody = document.getElementById(`${pageType}-tbody`);
    const noDataDiv = document.getElementById(`no-${pageType}-data`);
    
    if (!tbody) return;
    
    const data = dataStorage[pageType];
    
    if (data.length === 0) {
        tbody.innerHTML = '';
        if (noDataDiv) {
            noDataDiv.classList.remove('hidden'); // Tampilkan pesan no-data
            console.log(`Showing no-data for ${pageType}`); // Debug
        }
    } else {
        if (noDataDiv) {
            noDataDiv.classList.add('hidden'); // Sembunyikan pesan no-data
            console.log(`Hiding no-data for ${pageType}`); // Debug
        }
        tbody.innerHTML = data.map(item => createTableRow(pageType, item.id, item)).join('');
    }
}

// Form configurations for each page
const formConfigs = {
    'kelas-online': {
        title: 'Kelas Online',
        fields: [
            { name: 'nama', label: 'Nama Kelas', type: 'text', required: true },
            { name: 'mentor', label: 'Mentor', type: 'text', required: true },
            { name: 'schedule', label: 'Jadwal', type: 'date', required: true },
            { name: 'kapasitas', label: 'Kapasitas', type: 'number', required: true },
            { name: 'status', label: 'Status', type: 'select', options: ['Aktif', 'Nonaktif'], required: true }
        ]
    },
    'kajian': {
        title: 'Kajian',
        fields: [
            { name: 'judul', label: 'Judul Kajian', type: 'text', required: true },
            { name: 'pengisi', label: 'Pengisi Acara', type: 'text', required: true },
            { name: 'waktu', label: 'Tenggat Waktu', type: 'datetime-local', required: true },
            { name: 'lokasi', label: 'Lokasi', type: 'text', required: true }
        ]
    },
    'sedekah': {
        title: 'Program Sedekah',
        fields: [
            { name: 'program', label: 'Nama Program', type: 'text', required: true },
            { name: 'target', label: 'Target Dana', type: 'number', required: true },
            { name: 'status', label: 'Status', type: 'select', options: ['Langsung', 'Tertunda'], required: true }
        ]
    },
    'mentor': {
        title: 'Mentor',
        fields: [
            { name: 'nama', label: 'Nama Mentor', type: 'text', required: true },
            { name: 'spesialis', label: 'Spesialisasi', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'telepon', label: 'Nomor Telepon', type: 'tel', required: true }
        ]
    },
    'customer': {
        title: 'Customer',
        fields: [
            { name: 'nama', label: 'Nama Customer', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'telepon', label: 'Nomor Telepon', type: 'tel', required: true },
            { name: 'status', label: 'Status', type: 'select', options: ['Aktif', 'Nonaktif'], required: true }
        ]
    }
};

// Row selection function
function selectRow(row, pageType) {
    // Remove selection from all rows in the current table
    const table = row.closest('table');
    table.querySelectorAll('tr').forEach(r => r.classList.remove('selected'));
    
    // Add selection to clicked row
    row.classList.add('selected');
    
    // Enable action buttons
    selectedRowId = row.dataset.id;
    currentPage = pageType;
    
    // Enable edit and delete buttons
    document.getElementById(`edit-${pageType}-btn`).disabled = false;
    document.getElementById(`delete-${pageType}-btn`).disabled = false;
}

// Show add modal
function showAddModal(pageType) {
    currentPage = pageType;
    isEditMode = false;
    selectedRowId = null;
    
    const config = formConfigs[pageType];
    if (!config) return;
    
    document.getElementById('modalTitle').textContent = `Tambah ${config.title}`;
    generateFormFields(config.fields);
    document.getElementById('crudModal').classList.remove('hidden');
}

// Show edit modal
function showEditModal(pageType) {
    if (!selectedRowId) {
        alert('Silakan pilih data yang akan diedit terlebih dahulu!');
        return;
    }
    
    currentPage = pageType;
    isEditMode = true;
    
    const config = formConfigs[pageType];
    if (!config) return;
    
    document.getElementById('modalTitle').textContent = `Edit ${config.title}`;
    generateFormFields(config.fields);
    
    // Populate form with selected row data
    populateFormWithData(pageType, selectedRowId);
    
    document.getElementById('crudModal').classList.remove('hidden');
}

// Show delete modal
function showDeleteModal(pageType) {
    if (!selectedRowId) {
        alert('Silakan pilih data yang akan dihapus terlebih dahulu!');
        return;
    }
    
    const config = formConfigs[pageType];
    const row = document.querySelector(`#${pageType}-table tr[data-id="${selectedRowId}"]`);
    
    if (row) {
        const firstCell = row.querySelector('td:first-child');
        const itemName = firstCell.textContent.trim();
        document.getElementById('deleteItemInfo').textContent = `Data: ${itemName}`;
        document.getElementById('deleteModal').classList.remove('hidden');
    }
}

// Generate form fields
function generateFormFields(fields) {
    const formFields = document.getElementById('formFields');
    formFields.innerHTML = '';
    
    fields.forEach(field => {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';
        
        const label = document.createElement('label');
        label.textContent = field.label;
        label.setAttribute('for', field.name);
        
        let input;
        if (field.type === 'select') {
            input = document.createElement('select');
            input.id = field.name;
            input.name = field.name;
            input.required = field.required;
            
            field.options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                input.appendChild(optionElement);
            });
        } else {
            input = document.createElement('input');
            input.type = field.type;
            input.id = field.name;
            input.name = field.name;
            input.required = field.required;
        }
        
        formGroup.appendChild(label);
        formGroup.appendChild(input);
        formFields.appendChild(formGroup);
    });
}

// Populate form with existing data
function populateFormWithData(pageType, rowId) {
    const data = dataStorage[pageType].find(item => item.id == rowId);
    if (!data) return;
    
    const config = formConfigs[pageType];
    config.fields.forEach(field => {
        const input = document.getElementById(field.name);
        if (input && data[field.name] !== undefined) {
            input.value = data[field.name];
        }
    });
}

// Handle form submission
function handleFormSubmit() {
    const formData = new FormData(document.getElementById('crudForm'));
    const data = Object.fromEntries(formData.entries());
    
    if (isEditMode) {
        // Update existing data
        updateData(currentPage, selectedRowId, data);
    } else {
        // Add new data
        addData(currentPage, data);
    }
    
    closeModal();
}

// Add new data
function addData(pageType, data) {
    console.log('Adding data:', data); // Debug
    
    const newId = Date.now();
    const newData = {
        ...data,
        id: newId,
        createdAt: new Date().toISOString()
    };
    
    dataStorage[pageType].push(newData);
    console.log('Data storage updated:', dataStorage[pageType]); // Debug
    
    // Update table and dashboard
    loadTableData(pageType);
    loadDashboardStats();
    loadRecentActivities();
    
    alert('Data berhasil ditambahkan!');
}

// Update existing data
function updateData(pageType, rowId, data) {
    const index = dataStorage[pageType].findIndex(item => item.id == rowId);
    if (index === -1) return;
    
    dataStorage[pageType][index] = {
        ...dataStorage[pageType][index],
        ...data,
        updatedAt: new Date().toISOString()
    };
    
    // Update table and dashboard
    loadTableData(pageType);
    loadDashboardStats();
    loadRecentActivities();
    
    alert('Data berhasil diupdate!');
}

// Create table row HTML
function createTableRow(pageType, id, data) {
    console.log('Creating table row for:', pageType, data); // Debug
    
    const config = formConfigs[pageType];
    const cells = config.fields.map(field => {
        if (field.name === 'nama' && (pageType === 'kelas-online' || pageType === 'mentor' || pageType === 'customer')) {
            return `
                <td>
                    <div class="table-cell-content">
                        <div class="avatar-placeholder"></div>
                        <span>${data[field.name]}</span>
                    </div>
                </td>
            `;
        } else if (field.name === 'status') {
            const statusClass = data[field.name] === 'Aktif' ? 'active' : 'warning';
            return `<td><span class="status-badge ${statusClass}">${data[field.name]}</span></td>`;
        } else if (field.name === 'schedule') {
            // Format tanggal untuk jadwal
            const date = new Date(data[field.name]);
            return `<td>${date.toLocaleDateString('id-ID', { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric' 
            })}</td>`;
        } else if (field.name === 'kapasitas') {
            // Tambahkan partisipasi dummy
            const partisipasi = Math.floor(Math.random() * 20) + 10;
            return `<td>${partisipasi}/30</td>`;
        } else {
            return `<td>${data[field.name]}</td>`;
        }
    }).join('');
    
    return `<tr data-id="${id}" onclick="selectRow(this, '${pageType}')">${cells}</tr>`;
}

// Confirm delete
function confirmDelete() {
    if (selectedRowId && currentPage) {
        const index = dataStorage[currentPage].findIndex(item => item.id == selectedRowId);
        if (index !== -1) {
            dataStorage[currentPage].splice(index, 1);
            
            // Update table and dashboard
            loadTableData(currentPage);
            loadDashboardStats();
            loadRecentActivities();
            
            alert('Data berhasil dihapus!');
            
            // Reset selection
            selectedRowId = null;
            document.getElementById(`edit-${currentPage}-btn`).disabled = true;
            document.getElementById(`delete-${currentPage}-btn`).disabled = true;
        }
    }
    
    closeDeleteModal();
}

// Close modal
function closeModal() {
    document.getElementById('crudModal').classList.add('hidden');
    document.getElementById('crudForm').reset();
}

// Close delete modal
function closeDeleteModal() {
    document.getElementById('deleteModal').classList.add('hidden');
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('crudModal');
    const deleteModal = document.getElementById('deleteModal');
    const profileModal = document.getElementById('profileModal');
    
    if (event.target === modal) {
        closeModal();
    }
    if (event.target === deleteModal) {
        closeDeleteModal();
    }
    if (event.target === profileModal) {
        closeProfileModal();
    }
}

// Tambahkan di bagian akhir file untuk debugging
console.log('Data Storage initialized:', dataStorage);

// Tambahkan function untuk test manual
function testAddKelas() {
    const testData = {
        nama: 'Test Kelas Al-Quran',
        mentor: 'Ust. Ahmad',
        schedule: '2025-01-15',
        kapasitas: '30',
        status: 'Aktif'
    };
    
    console.log('Testing add data...');
    addData('kelas-online', testData);
    console.log('Data storage after test:', dataStorage);
    console.log('Table should be updated now');
}