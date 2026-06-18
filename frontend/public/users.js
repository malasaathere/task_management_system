/**
 * TaskMaster Pro - User Management Script
 * Controls user listings, stats calculations, pagination, search queries, filtering systems,
 * mobile navigation drawer, and comprehensive modal workflows (Create, View, Edit, Delete, 
 * Assign Role, Password Reset, Status Toggle).
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // INITIAL DUMMY DATA STATE
    // (At least 5 Admins, 10 Managers, 20 Collaborators)
    // ==========================================
    let users = [
        // 6 Admin Users
        { id: "USR-1", name: "Alex Mercer", email: "alex.mercer@taskmaster.com", username: "alexmercer", phone: "+1 555-0101", role: "Admin", department: "Management", status: "Active", lastLogin: "2026-06-15 10:30", projectsCount: 5, tasksCount: 15, joinDate: "2026-01-15" },
        { id: "USR-2", name: "Sarah Connor", email: "sarah.connor@taskmaster.com", username: "sconnor", phone: "+1 555-0102", role: "Admin", department: "Management", status: "Active", lastLogin: "2026-06-15 09:15", projectsCount: 4, tasksCount: 8, joinDate: "2026-02-10" },
        { id: "USR-3", name: "James Smith", email: "james.smith@taskmaster.com", username: "jsmith", phone: "+1 555-0103", role: "Admin", department: "Management", status: "Active", lastLogin: "2026-06-14 17:45", projectsCount: 3, tasksCount: 6, joinDate: "2026-03-05" },
        { id: "USR-4", name: "Patricia Jones", email: "patricia.jones@taskmaster.com", username: "pjones", phone: "+1 555-0104", role: "Admin", department: "Management", status: "Active", lastLogin: "2026-06-12 14:20", projectsCount: 5, tasksCount: 12, joinDate: "2026-03-22" },
        { id: "USR-5", name: "John Miller", email: "john.miller@taskmaster.com", username: "jmiller", phone: "+1 555-0105", role: "Admin", department: "Management", status: "Inactive", lastLogin: "2026-05-20 11:10", projectsCount: 2, tasksCount: 4, joinDate: "2026-04-01" },
        { id: "USR-6", name: "Barbara Garcia", email: "barbara.garcia@taskmaster.com", username: "bgarcia", phone: "+1 555-0106", role: "Admin", department: "Management", status: "Suspended", lastLogin: "2026-04-15 16:30", projectsCount: 1, tasksCount: 2, joinDate: "2026-04-10" },

        // 11 Project Manager Users
        { id: "USR-7", name: "Jane Doe", email: "jane.doe@taskmaster.com", username: "janedoe", phone: "+1 555-0107", role: "Project Manager", department: "Management", status: "Active", lastLogin: "2026-06-15 11:20", projectsCount: 6, tasksCount: 22, joinDate: "2026-01-10" },
        { id: "USR-8", name: "Robert Johnson", email: "robert.johnson@taskmaster.com", username: "rjohnson", phone: "+1 555-0108", role: "Project Manager", department: "Engineering", status: "Active", lastLogin: "2026-06-15 08:45", projectsCount: 4, tasksCount: 18, joinDate: "2026-01-20" },
        { id: "USR-9", name: "Emily Davis", email: "emily.davis@taskmaster.com", username: "edavis", phone: "+1 555-0109", role: "Project Manager", department: "Design", status: "Active", lastLogin: "2026-06-14 15:30", projectsCount: 3, tasksCount: 14, joinDate: "2026-02-15" },
        { id: "USR-10", name: "Michael Brown", email: "michael.brown@taskmaster.com", username: "mbrown", phone: "+1 555-0110", role: "Project Manager", department: "Management", status: "Active", lastLogin: "2026-06-15 07:30", projectsCount: 5, tasksCount: 25, joinDate: "2026-02-28" },
        { id: "USR-11", name: "Linda Williams", email: "linda.williams@taskmaster.com", username: "lwilliams", phone: "+1 555-0111", role: "Project Manager", department: "Marketing", status: "Active", lastLogin: "2026-06-13 10:15", projectsCount: 3, tasksCount: 9, joinDate: "2026-03-10" },
        { id: "USR-12", name: "William Anderson", email: "william.anderson@taskmaster.com", username: "wanderson", phone: "+1 555-0112", role: "Project Manager", department: "Engineering", status: "Active", lastLogin: "2026-06-15 12:10", projectsCount: 4, tasksCount: 20, joinDate: "2026-03-18" },
        { id: "USR-13", name: "Elizabeth Taylor", email: "elizabeth.taylor@taskmaster.com", username: "etaylor", phone: "+1 555-0113", role: "Project Manager", department: "Design", status: "Active", lastLogin: "2026-06-14 16:20", projectsCount: 2, tasksCount: 8, joinDate: "2026-04-05" },
        { id: "USR-14", name: "David Thomas", email: "david.thomas@taskmaster.com", username: "dthomas", phone: "+1 555-0114", role: "Project Manager", department: "Engineering", status: "Inactive", lastLogin: "2026-05-30 14:00", projectsCount: 0, tasksCount: 0, joinDate: "2026-04-12" },
        { id: "USR-15", name: "Jennifer Moore", email: "jennifer.moore@taskmaster.com", username: "jmoore", phone: "+1 555-0115", role: "Project Manager", department: "Marketing", status: "Active", lastLogin: "2026-06-15 10:05", projectsCount: 3, tasksCount: 11, joinDate: "2026-05-01" },
        { id: "USR-16", name: "Richard Martin", email: "richard.martin@taskmaster.com", username: "rmartin", phone: "+1 555-0116", role: "Project Manager", department: "Engineering", status: "Suspended", lastLogin: "2026-05-15 09:30", projectsCount: 1, tasksCount: 3, joinDate: "2026-05-08" },
        { id: "USR-17", name: "Mary Martinez", email: "mary.martinez@taskmaster.com", username: "mmartinez", phone: "+1 555-0117", role: "Project Manager", department: "Marketing", status: "Active", lastLogin: "2026-06-15 08:20", projectsCount: 2, tasksCount: 7, joinDate: "2026-06-01" },

        // 20 Collaborator Users
        { id: "USR-18", name: "Mike Kowalski", email: "mike.kowalski@taskmaster.com", username: "mkowalski", phone: "+1 555-0118", role: "Collaborator", department: "Engineering", status: "Active", lastLogin: "2026-06-15 13:40", projectsCount: 3, tasksCount: 14, joinDate: "2026-01-05" },
        { id: "USR-19", name: "Mary Wilson", email: "mary.wilson@taskmaster.com", username: "mwilson", phone: "+1 555-0119", role: "Collaborator", department: "Engineering", status: "Active", lastLogin: "2026-06-15 10:55", projectsCount: 2, tasksCount: 10, joinDate: "2026-01-12" },
        { id: "USR-20", name: "Charles Thompson", email: "charles.thompson@taskmaster.com", username: "cthompson", phone: "+1 555-0120", role: "Collaborator", department: "Engineering", status: "Active", lastLogin: "2026-06-14 18:05", projectsCount: 3, tasksCount: 11, joinDate: "2026-01-25" },
        { id: "USR-21", name: "Joseph Harris", email: "joseph.harris@taskmaster.com", username: "jharris", phone: "+1 555-0121", role: "Collaborator", department: "Engineering", status: "Active", lastLogin: "2026-06-15 11:50", projectsCount: 2, tasksCount: 8, joinDate: "2026-02-02" },
        { id: "USR-22", name: "Susan Martin", email: "susan.martin@taskmaster.com", username: "smartin", phone: "+1 555-0122", role: "Collaborator", department: "Marketing", status: "Active", lastLogin: "2026-06-15 09:40", projectsCount: 1, tasksCount: 5, joinDate: "2026-02-18" },
        { id: "USR-23", name: "Thomas Thompson", email: "thomas.thompson@taskmaster.com", username: "tthompson", phone: "+1 555-0123", role: "Collaborator", department: "Engineering", status: "Active", lastLogin: "2026-06-13 14:15", projectsCount: 3, tasksCount: 12, joinDate: "2026-03-01" },
        { id: "USR-24", name: "Margaret Garcia", email: "margaret.garcia@taskmaster.com", username: "mgarcia2", phone: "+1 555-0124", role: "Collaborator", department: "Design", status: "Active", lastLogin: "2026-06-15 14:10", projectsCount: 2, tasksCount: 7, joinDate: "2026-03-12" },
        { id: "USR-25", name: "Christopher Martinez", email: "christopher.martinez@taskmaster.com", username: "cmartinez", phone: "+1 555-0125", role: "Collaborator", department: "Engineering", status: "Active", lastLogin: "2026-06-15 08:30", projectsCount: 4, tasksCount: 16, joinDate: "2026-03-29" },
        { id: "USR-26", name: "Dorothy Robinson", email: "dorothy.robinson@taskmaster.com", username: "drobinson", phone: "+1 555-0126", role: "Collaborator", department: "Marketing", status: "Active", lastLogin: "2026-06-14 11:25", projectsCount: 2, tasksCount: 6, joinDate: "2026-04-02" },
        { id: "USR-27", name: "Daniel Clark", email: "daniel.clark@taskmaster.com", username: "dclark", phone: "+1 555-0127", role: "Collaborator", department: "Engineering", status: "Active", lastLogin: "2026-06-15 10:20", projectsCount: 3, tasksCount: 13, joinDate: "2026-04-15" },
        { id: "USR-28", name: "Lisa Rodriguez", email: "lisa.rodriguez@taskmaster.com", username: "lrodriguez", phone: "+1 555-0128", role: "Collaborator", department: "Design", status: "Inactive", lastLogin: "2026-05-25 15:40", projectsCount: 1, tasksCount: 2, joinDate: "2026-04-20" },
        { id: "USR-29", name: "Matthew Lewis", email: "matthew.lewis@taskmaster.com", username: "mlewis", phone: "+1 555-0129", role: "Collaborator", department: "Engineering", status: "Active", lastLogin: "2026-06-15 11:15", projectsCount: 2, tasksCount: 9, joinDate: "2026-05-02" },
        { id: "USR-30", name: "Nancy Lee", email: "nancy.lee@taskmaster.com", username: "nlee", phone: "+1 555-0130", role: "Collaborator", department: "Marketing", status: "Active", lastLogin: "2026-06-14 09:50", projectsCount: 1, tasksCount: 4, joinDate: "2026-05-10" },
        { id: "USR-31", name: "Anthony Walker", email: "anthony.walker@taskmaster.com", username: "awalker", phone: "+1 555-0131", role: "Collaborator", department: "Engineering", status: "Suspended", lastLogin: "2026-05-10 11:20", projectsCount: 0, tasksCount: 0, joinDate: "2026-05-12" },
        { id: "USR-32", name: "Karen Hall", email: "karen.hall@taskmaster.com", username: "khall", phone: "+1 555-0132", role: "Collaborator", department: "Design", status: "Active", lastLogin: "2026-06-15 14:55", projectsCount: 2, tasksCount: 10, joinDate: "2026-06-02" },
        { id: "USR-33", name: "Mark Allen", email: "mark.allen@taskmaster.com", username: "mallen", phone: "+1 555-0133", role: "Collaborator", department: "Engineering", status: "Active", lastLogin: "2026-06-15 09:30", projectsCount: 3, tasksCount: 15, joinDate: "2026-06-03" },
        { id: "USR-34", name: "Betty Young", email: "betty.young@taskmaster.com", username: "byoung", phone: "+1 555-0134", role: "Collaborator", department: "Marketing", status: "Active", lastLogin: "2026-06-14 13:45", projectsCount: 1, tasksCount: 3, joinDate: "2026-06-05" },
        { id: "USR-35", name: "Paul King", email: "paul.king@taskmaster.com", username: "pking", phone: "+1 555-0135", role: "Collaborator", department: "Engineering", status: "Active", lastLogin: "2026-06-15 12:45", projectsCount: 2, tasksCount: 11, joinDate: "2026-06-08" },
        { id: "USR-36", name: "Helen Wright", email: "helen.wright@taskmaster.com", username: "hwright", phone: "+1 555-0136", role: "Collaborator", department: "Design", status: "Active", lastLogin: "2026-06-15 10:10", projectsCount: 3, tasksCount: 8, joinDate: "2026-06-10" },
        { id: "USR-37", name: "Sandra Lopez", email: "sandra.lopez@taskmaster.com", username: "slopez", phone: "+1 555-0137", role: "Collaborator", department: "Engineering", status: "Active", lastLogin: "2026-06-15 15:20", projectsCount: 2, tasksCount: 6, joinDate: "2026-06-12" }
    ];

    // ==========================================
    // STATE VARIABLES
    // ==========================================
    let filteredUsers = [...users];
    let currentPage = 1;
    const itemsPerPage = 10;
    const currentMockDate = "2026-06-15";

    // ==========================================
    // DOM ELEMENTS SELECTORS
    // ==========================================
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const logoutLink = document.getElementById('logout-link');
    const navDashboard = document.getElementById('nav-dashboard');
    const logoDashboardLink = document.getElementById('logo-dashboard-link');
    const avatarInitialsDisplay = document.getElementById('avatar-initials');

    // Stats Elements
    const statTotalUsers = document.getElementById('stat-total-users');
    const statActiveUsers = document.getElementById('stat-active-users');
    const statTotalManagers = document.getElementById('stat-total-managers');
    const statTotalCollaborators = document.getElementById('stat-total-collaborators');
    const statInactiveUsers = document.getElementById('stat-inactive-users');
    const statNewUsers = document.getElementById('stat-new-users');

    // Filters Elements
    const globalSearchInput = document.getElementById('global-search-input');
    const searchNameInput = document.getElementById('search-name-input');
    const searchEmailInput = document.getElementById('search-email-input');
    const filterRole = document.getElementById('filter-role');
    const filterStatus = document.getElementById('filter-status');
    const filterDepartment = document.getElementById('filter-department');

    // Table elements
    const tableBody = document.getElementById('users-table-body');
    const paginationInfo = document.getElementById('pagination-info');
    const paginationPrev = document.getElementById('pagination-prev');
    const paginationNext = document.getElementById('pagination-next');

    // Buttons
    const btnTriggerCreateUser = document.getElementById('btn-trigger-create-user');
    const btnImportUsers = document.getElementById('btn-import-users');
    const btnExportUsers = document.getElementById('btn-export-users');
    const btnTriggerAssignRole = document.getElementById('btn-trigger-assign-role');

    // Inject Toast Notification Style Sheet
    const toastStyle = document.createElement('style');
    toastStyle.innerHTML = `
        .custom-toast {
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: #FFFFFF;
            border-left: 4px solid var(--primary-blue);
            box-shadow: var(--shadow-xl);
            padding: 16px 20px;
            border-radius: var(--border-radius-md);
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 2000;
            transform: translateY(100px);
            opacity: 0;
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
            font-family: var(--font-family);
            font-size: 14px;
            font-weight: 500;
            color: var(--text-primary);
        }
        .custom-toast.show {
            transform: translateY(0);
            opacity: 1;
        }
        .custom-toast.success {
            border-left-color: #10B981;
        }
        .custom-toast.error {
            border-left-color: #EF4444;
        }
        .custom-toast.info {
            border-left-color: #3B82F6;
        }
    `;
    document.head.appendChild(toastStyle);

    // ==========================================
    // INITIALIZATION & SESSION CONTROLS
    // ==========================================
    function init() {
        loadSessionUser();
        applyFilters();
        populateRoleSelect();
        setupEventListeners();
    }

    // Resolves matching dashboard links and user greeting initials based on email
    function loadSessionUser() {
        const loggedInEmail = localStorage.getItem('taskmaster_user_email') || 
                              sessionStorage.getItem('taskmaster_user_email');
        if (loggedInEmail) {
            const prefix = loggedInEmail.split('@')[0];
            const formattedName = prefix.split('.').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            
            // Initials extraction
            const initials = getInitials(formattedName);
            if (avatarInitialsDisplay && initials) {
                avatarInitialsDisplay.textContent = initials;
            }

            // Resolve dashboard routing link
            let dashboardHref = 'collaborator-dashboard.html';
            const emailLower = loggedInEmail.toLowerCase();
            if (emailLower.includes('admin')) {
                dashboardHref = 'admin-dashboard.html';
            } else if (emailLower.includes('manager') || emailLower.includes('alex')) {
                dashboardHref = 'manager-dashboard.html';
            }

            if (navDashboard) navDashboard.setAttribute('href', dashboardHref);
            if (logoDashboardLink) logoDashboardLink.setAttribute('href', dashboardHref);
        }
    }

    // ==========================================
    // HELPER FUNCTIONS
    // ==========================================
    function getInitials(name) {
        if (!name) return "AD";
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    function formatDateString(dateStr) {
        if (!dateStr || dateStr === 'Never') return 'Never';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `custom-toast ${type}`;
        
        let icon = '';
        if (type === 'success') {
            icon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
        } else if (type === 'error') {
            icon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
        } else {
            icon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
        }
        
        toast.innerHTML = `${icon} <span>${message}</span>`;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 50);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ==========================================
    // FILTERING & PAGINATION LOGIC
    // ==========================================
    function applyFilters() {
        const globalSearch = globalSearchInput ? globalSearchInput.value.toLowerCase().trim() : "";
        const nameSearch = searchNameInput ? searchNameInput.value.toLowerCase().trim() : "";
        const emailSearch = searchEmailInput ? searchEmailInput.value.toLowerCase().trim() : "";
        
        const roleVal = filterRole ? filterRole.value : "All";
        const statusVal = filterStatus ? filterStatus.value : "All";
        const deptVal = filterDepartment ? filterDepartment.value : "All";

        filteredUsers = users.filter(user => {
            const matchesGlobal = !globalSearch || user.name.toLowerCase().includes(globalSearch) || user.email.toLowerCase().includes(globalSearch);
            const matchesName = !nameSearch || user.name.toLowerCase().includes(nameSearch);
            const matchesEmail = !emailSearch || user.email.toLowerCase().includes(emailSearch);
            const matchesRole = roleVal === 'All' || user.role === roleVal;
            const matchesStatus = statusVal === 'All' || user.status === statusVal;
            const matchesDept = deptVal === 'All' || user.department === deptVal;

            return matchesGlobal && matchesName && matchesEmail && matchesRole && matchesStatus && matchesDept;
        });

        currentPage = 1; // reset page to 1 on filter
        renderTable();
        calculateAndSetStats();
    }

    function renderTable() {
        if (!tableBody) return;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, filteredUsers.length);
        const paginatedItems = filteredUsers.slice(startIndex, endIndex);

        if (paginatedItems.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 48px; color: var(--text-secondary); font-weight: 500;">
                        No staff profiles match the active search filters.
                    </td>
                </tr>
            `;
            if (paginationInfo) paginationInfo.textContent = "Showing 0 to 0 of 0 entries";
            if (paginationPrev) paginationPrev.disabled = true;
            if (paginationNext) paginationNext.disabled = true;
            return;
        }

        tableBody.innerHTML = paginatedItems.map(user => {
            const initials = getInitials(user.name);
            const roleClass = user.role.replace(/\s+/g, '').toLowerCase();
            const statusClass = user.status.toLowerCase();

            return `
                <tr>
                    <td><span style="font-weight: 600; color: var(--text-secondary); font-size: 13.5px;">${user.id}</span></td>
                    <td>
                        <div class="user-cell-meta">
                            <div class="user-avatar-initials">${initials}</div>
                            <div class="user-name-cell" onclick="viewUserDetails('${user.id}')">${user.name}</div>
                        </div>
                    </td>
                    <td><span class="user-email-text">${user.email}</span></td>
                    <td><span class="badge role-${roleClass}">${user.role}</span></td>
                    <td><span style="font-weight: 500; color: var(--text-secondary);">${user.department}</span></td>
                    <td><span class="badge status-${statusClass}">${user.status}</span></td>
                    <td><span style="color: var(--text-secondary); font-weight: 500; font-size: 13.5px;">${user.lastLogin}</span></td>
                    <td>
                        <div class="action-btns-cell" style="justify-content: flex-end; padding-right: 8px;">
                            <!-- View details -->
                            <button class="table-action-btn" onclick="viewUserDetails('${user.id}')" title="View Profile Sheet">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                            </button>
                            <!-- Edit profile -->
                            <button class="table-action-btn" onclick="editUserDetails('${user.id}')" title="Edit Profile">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                            </button>
                            <!-- Assign role -->
                            <button class="table-action-btn" onclick="assignUserRole('${user.id}')" title="Assign Role">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                            </button>
                            <!-- Reset password -->
                            <button class="table-action-btn" onclick="resetUserPassword('${user.id}')" title="Reset Password">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                            </button>
                            <!-- Quick activate / deactivate toggle -->
                            <button class="table-action-btn" onclick="toggleUserStatus('${user.id}')" title="${user.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}">
                                ${user.status === 'Active' 
                                    ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>`
                                    : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
                                }
                            </button>
                            <!-- Delete user -->
                            <button class="table-action-btn delete" onclick="deleteUserConfirmation('${user.id}')" title="Delete User">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // Update pagination descriptors
        if (paginationInfo) {
            paginationInfo.textContent = `Showing ${startIndex + 1} to ${endIndex} of ${filteredUsers.length} entries`;
        }

        if (paginationPrev) paginationPrev.disabled = currentPage === 1;
        if (paginationNext) paginationNext.disabled = endIndex >= filteredUsers.length;
    }

    function calculateAndSetStats() {
        if (statTotalUsers) statTotalUsers.textContent = users.length;
        if (statActiveUsers) statActiveUsers.textContent = users.filter(u => u.status === 'Active').length;
        if (statTotalManagers) statTotalManagers.textContent = users.filter(u => u.role === 'Project Manager').length;
        if (statTotalCollaborators) statTotalCollaborators.textContent = users.filter(u => u.role === 'Collaborator').length;
        if (statInactiveUsers) statInactiveUsers.textContent = users.filter(u => u.status === 'Inactive' || u.status === 'Suspended').length;
        
        // Added since June 1st, 2026
        const newJuneUsers = users.filter(u => u.joinDate >= '2026-06-01').length;
        if (statNewUsers) statNewUsers.textContent = newJuneUsers;
    }

    function populateRoleSelect() {
        const roleSelectUser = document.getElementById('role-select-user');
        if (!roleSelectUser) return;
        roleSelectUser.innerHTML = users.map(user => 
            `<option value="${user.id}">${user.name} (${user.role})</option>`
        ).join('');
    }

    // ==========================================
    // DYNAMIC TABLE ROW ACTIONS
    // ==========================================
    function viewUserDetails(id) {
        const user = users.find(u => u.id === id);
        if (!user) return;

        const avatar = document.getElementById('view-user-avatar');
        const name = document.getElementById('view-user-name');
        const roleBadge = document.getElementById('view-user-role-badge');
        const userIdVal = document.getElementById('view-user-id');
        const email = document.getElementById('view-user-email');
        const dept = document.getElementById('view-user-department');
        const phone = document.getElementById('view-user-phone');
        const projects = document.getElementById('view-user-projects');
        const tasks = document.getElementById('view-user-tasks');
        const status = document.getElementById('view-user-status');
        const joinDate = document.getElementById('view-user-join-date');

        if (avatar) avatar.textContent = getInitials(user.name);
        if (name) name.textContent = user.name;
        
        if (roleBadge) {
            const roleClass = user.role.replace(/\s+/g, '').toLowerCase();
            roleBadge.className = `badge role-${roleClass}`;
            roleBadge.textContent = user.role;
        }

        if (userIdVal) userIdVal.textContent = user.id;
        if (email) email.textContent = user.email;
        if (dept) dept.textContent = user.department;
        if (phone) phone.textContent = user.phone || "+1 555-0100";
        if (projects) projects.textContent = `${user.projectsCount} Projects`;
        if (tasks) tasks.textContent = `${user.tasksCount} active tasks`;

        if (status) {
            const statusClass = user.status.toLowerCase();
            status.className = `badge status-${statusClass}`;
            status.textContent = user.status;
        }

        if (joinDate) joinDate.textContent = formatDateString(user.joinDate);

        const modal = document.getElementById('modal-view-user');
        if (modal) modal.classList.add('active');
    }

    function editUserDetails(id) {
        const user = users.find(u => u.id === id);
        if (!user) return;

        document.getElementById('edit-user-id-field').value = user.id;
        document.getElementById('edit-name').value = user.name;
        document.getElementById('edit-email').value = user.email;
        document.getElementById('edit-username').value = user.username || "";
        document.getElementById('edit-phone').value = user.phone || "";
        document.getElementById('edit-role').value = user.role;
        document.getElementById('edit-department').value = user.department;
        document.getElementById('edit-status').value = user.status;

        const modal = document.getElementById('modal-edit-user');
        if (modal) modal.classList.add('active');
    }

    function assignUserRole(id) {
        const user = users.find(u => u.id === id);
        if (!user) return;

        const userSelect = document.getElementById('role-select-user');
        const roleSelectVal = document.getElementById('role-select-val');

        if (userSelect) userSelect.value = user.id;
        if (roleSelectVal) roleSelectVal.value = user.role;

        const modal = document.getElementById('modal-assign-role');
        if (modal) modal.classList.add('active');
    }

    function resetUserPassword(id) {
        const user = users.find(u => u.id === id);
        if (!user) return;

        document.getElementById('reset-user-id-field').value = user.id;
        document.getElementById('reset-user-name').textContent = user.name;
        document.getElementById('reset-new-password').value = ""; // clear inputs

        const modal = document.getElementById('modal-reset-password');
        if (modal) modal.classList.add('active');
    }

    function toggleUserStatus(id) {
        const user = users.find(u => u.id === id);
        if (!user) return;

        const oldStatus = user.status;
        const newStatus = oldStatus === 'Active' ? 'Inactive' : 'Active';
        user.status = newStatus;

        applyFilters();
        showToast(`Account status for ${user.name} changed to ${newStatus}.`, "info");
    }

    function deleteUserConfirmation(id) {
        const user = users.find(u => u.id === id);
        if (!user) return;

        document.getElementById('delete-user-id-field').value = user.id;
        document.getElementById('delete-user-name-confirm').textContent = user.name;

        const modal = document.getElementById('modal-delete-user');
        if (modal) modal.classList.add('active');
    }

    // Expose actions to global scope so inline html onclick hooks resolve
    window.viewUserDetails = viewUserDetails;
    window.editUserDetails = editUserDetails;
    window.assignUserRole = assignUserRole;
    window.resetUserPassword = resetUserPassword;
    window.toggleUserStatus = toggleUserStatus;
    window.deleteUserConfirmation = deleteUserConfirmation;

    // ==========================================
    // EVENT LISTENERS & DIALOGS BINDINGS
    // ==========================================
    function setupEventListeners() {
        // Mobile Sidebar Toggle
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                if (sidebar) sidebar.classList.add('active');
                if (sidebarOverlay) sidebarOverlay.classList.add('active');
            });
        }

        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', () => {
                if (sidebar) sidebar.classList.remove('active');
                if (sidebarOverlay) sidebarOverlay.classList.remove('active');
            });
        }

        // Logout listener
        if (logoutLink) {
            logoutLink.addEventListener('click', () => {
                localStorage.removeItem('taskmaster_logged_in');
                localStorage.removeItem('taskmaster_user_email');
                sessionStorage.removeItem('taskmaster_logged_in');
                sessionStorage.removeItem('taskmaster_user_email');
            });
        }

        // Search inputs listeners
        const searchElements = [globalSearchInput, searchNameInput, searchEmailInput];
        searchElements.forEach(el => {
            if (el) el.addEventListener('input', applyFilters);
        });

        // Filter dropdowns listeners
        const filterDropdowns = [filterRole, filterStatus, filterDepartment];
        filterDropdowns.forEach(el => {
            if (el) el.addEventListener('change', applyFilters);
        });

        // Pagination buttons
        if (paginationPrev) {
            paginationPrev.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderTable();
                }
            });
        }

        if (paginationNext) {
            paginationNext.addEventListener('click', () => {
                const maxPage = Math.ceil(filteredUsers.length / itemsPerPage);
                if (currentPage < maxPage) {
                    currentPage++;
                    renderTable();
                }
            });
        }

        // Close modal handlers (universal selector)
        document.querySelectorAll('.modal-close-btn, .modal-cancel-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const overlay = btn.closest('.modal-overlay');
                if (overlay) overlay.classList.remove('active');
            });
        });

        // Close on clicking backdrop overlay
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) overlay.classList.remove('active');
            });
        });

        // Create User Trigger Button
        if (btnTriggerCreateUser) {
            btnTriggerCreateUser.addEventListener('click', () => {
                const form = document.getElementById('form-create-user');
                if (form) form.reset();
                const modal = document.getElementById('modal-create-user');
                if (modal) modal.classList.add('active');
            });
        }

        // Assign Roles Toolbar Trigger Button
        if (btnTriggerAssignRole) {
            btnTriggerAssignRole.addEventListener('click', () => {
                const modal = document.getElementById('modal-assign-role');
                if (modal) modal.classList.add('active');
            });
        }

        // Form Submit: Create User
        const formCreateUser = document.getElementById('form-create-user');
        if (formCreateUser) {
            formCreateUser.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const name = document.getElementById('create-name').value.trim();
                const email = document.getElementById('create-email').value.trim();
                const username = document.getElementById('create-username').value.trim();
                const phone = document.getElementById('create-phone').value.trim();
                const role = document.getElementById('create-role').value;
                const department = document.getElementById('create-department').value;
                const status = document.getElementById('create-status').value;

                // Unique validation checks
                if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
                    showToast("A user with this email address already exists.", "error");
                    return;
                }
                if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
                    showToast("This username is already taken.", "error");
                    return;
                }

                const nextIdNumber = Math.max(...users.map(u => parseInt(u.id.split('-')[1]))) + 1;
                const newId = `USR-${nextIdNumber}`;

                const newUser = {
                    id: newId,
                    name,
                    email,
                    username,
                    phone,
                    role,
                    department,
                    status,
                    lastLogin: "Never",
                    projectsCount: 0,
                    tasksCount: 0,
                    joinDate: currentMockDate
                };

                users.unshift(newUser);
                applyFilters();
                populateRoleSelect();

                // Close and clean
                const modal = document.getElementById('modal-create-user');
                if (modal) modal.classList.remove('active');
                formCreateUser.reset();

                showToast(`Successfully created user profile for ${name}!`, "success");
            });
        }

        // Form Submit: Edit User
        const formEditUser = document.getElementById('form-edit-user');
        if (formEditUser) {
            formEditUser.addEventListener('submit', (e) => {
                e.preventDefault();

                const id = document.getElementById('edit-user-id-field').value;
                const name = document.getElementById('edit-name').value.trim();
                const email = document.getElementById('edit-email').value.trim();
                const username = document.getElementById('edit-username').value.trim();
                const phone = document.getElementById('edit-phone').value.trim();
                const role = document.getElementById('edit-role').value;
                const department = document.getElementById('edit-department').value;
                const status = document.getElementById('edit-status').value;

                // Unique validation check (excluding current user)
                if (users.some(u => u.id !== id && u.email.toLowerCase() === email.toLowerCase())) {
                    showToast("A user with this email address already exists.", "error");
                    return;
                }
                if (users.some(u => u.id !== id && u.username.toLowerCase() === username.toLowerCase())) {
                    showToast("This username is already taken.", "error");
                    return;
                }

                const userIndex = users.findIndex(u => u.id === id);
                if (userIndex !== -1) {
                    users[userIndex] = {
                        ...users[userIndex],
                        name,
                        email,
                        username,
                        phone,
                        role,
                        department,
                        status
                    };

                    applyFilters();
                    populateRoleSelect();

                    const modal = document.getElementById('modal-edit-user');
                    if (modal) modal.classList.remove('active');

                    showToast(`Updated profile for ${name} successfully.`, "success");
                }
            });
        }

        // Confirm Delete Button Clicked
        const btnConfirmDelete = document.getElementById('btn-confirm-delete');
        if (btnConfirmDelete) {
            btnConfirmDelete.addEventListener('click', () => {
                const id = document.getElementById('delete-user-id-field').value;
                const userIndex = users.findIndex(u => u.id === id);

                if (userIndex !== -1) {
                    const userName = users[userIndex].name;
                    users.splice(userIndex, 1);

                    applyFilters();
                    populateRoleSelect();

                    const modal = document.getElementById('modal-delete-user');
                    if (modal) modal.classList.remove('active');

                    showToast(`User ${userName} has been removed.`, "info");
                }
            });
        }

        // Form Submit: Reset Password
        const formResetPassword = document.getElementById('form-reset-password');
        if (formResetPassword) {
            formResetPassword.addEventListener('submit', (e) => {
                e.preventDefault();

                const id = document.getElementById('reset-user-id-field').value;
                const newPass = document.getElementById('reset-new-password').value;
                const user = users.find(u => u.id === id);

                if (user) {
                    console.log(`Password reset for ${user.name} (${user.id}). Temporary password set: ${newPass}`);
                    
                    const modal = document.getElementById('modal-reset-password');
                    if (modal) modal.classList.remove('active');
                    formResetPassword.reset();

                    showToast(`Temporary password assigned for ${user.name}.`, "success");
                }
            });
        }

        // Form Submit: Assign Role
        const formAssignRole = document.getElementById('form-assign-role');
        if (formAssignRole) {
            formAssignRole.addEventListener('submit', (e) => {
                e.preventDefault();

                const id = document.getElementById('role-select-user').value;
                const newRole = document.getElementById('role-select-val').value;
                const userIndex = users.findIndex(u => u.id === id);

                if (userIndex !== -1) {
                    const oldRole = users[userIndex].role;
                    users[userIndex].role = newRole;

                    applyFilters();
                    populateRoleSelect();

                    const modal = document.getElementById('modal-assign-role');
                    if (modal) modal.classList.remove('active');

                    showToast(`Assigned ${newRole} role to ${users[userIndex].name} (previously ${oldRole}).`, "success");
                }
            });
        }

        // Export Users Clicked
        if (btnExportUsers) {
            btnExportUsers.addEventListener('click', () => {
                let csvContent = "data:text/csv;charset=utf-8,";
                csvContent += "User ID,Full Name,Email,Role,Department,Status,Last Login,Join Date\n";
                
                users.forEach(user => {
                    const row = [
                        user.id,
                        `"${user.name}"`,
                        user.email,
                        `"${user.role}"`,
                        user.department,
                        user.status,
                        user.lastLogin,
                        user.joinDate
                    ].join(",");
                    csvContent += row + "\n";
                });
                
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "taskmaster_users_directory.csv");
                document.body.appendChild(link);
                
                link.click();
                document.body.removeChild(link);
                showToast("User directory directory successfully exported as CSV!", "success");
            });
        }

        // Import Users Clicked (Simulated File Dialog picker)
        if (btnImportUsers) {
            // hidden input creation
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.csv, .json';
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);

            fileInput.addEventListener('change', () => {
                showToast("Importing user records...", "info");
                setTimeout(() => {
                    const nextIdIndex = users.length + 1;
                    const newImported = [
                        { id: `USR-${nextIdIndex}`, name: "Arthur Dent", email: "arthur.dent@taskmaster.com", username: "adent", phone: "+1 555-0815", role: "Collaborator", department: "Engineering", status: "Active", lastLogin: "Never", projectsCount: 1, tasksCount: 4, joinDate: currentMockDate },
                        { id: `USR-${nextIdIndex + 1}`, name: "Ford Prefect", email: "ford.prefect@taskmaster.com", username: "fprefect", phone: "+1 555-0816", role: "Project Manager", department: "Design", status: "Active", lastLogin: "Never", projectsCount: 2, tasksCount: 6, joinDate: currentMockDate },
                        { id: `USR-${nextIdIndex + 2}`, name: "Tricia McMillan", email: "tricia.mcmillan@taskmaster.com", username: "tmcmillan", phone: "+1 555-0817", role: "Collaborator", department: "Marketing", status: "Inactive", lastLogin: "Never", projectsCount: 0, tasksCount: 0, joinDate: currentMockDate }
                    ];
                    
                    users.unshift(...newImported);
                    applyFilters();
                    populateRoleSelect();
                    showToast("Successfully imported 3 user records!", "success");
                }, 1200);
            });

            btnImportUsers.addEventListener('click', () => {
                fileInput.click();
            });
        }
    }

    // Launch application initialization
    init();
});
