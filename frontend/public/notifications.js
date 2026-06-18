/**
 * TaskMaster Pro - Notification Center Script
 * Controls notifications list rendering, stats calculations, pagination, search queries,
 * source filtering, drawer toggles, and detail view modals (Mark Read/Unread, Delete, Clear, Export).
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // INITIAL DUMMY DATA STATE
    // (At least 10 Unread and 10 Read notifications)
    // ==========================================
    let notifications = [
        // 11 Unread Notifications
        { id: 1, category: "Task Assigned", title: "New Task: Optimize Redis Cache Sync", description: "Alex Mercer assigned you to optimization task TMP-4.", sender: "Alex Mercer", time: "2026-06-15 14:15", status: "Unread", priority: "Critical", sourceType: "Task", context: "Task #TMP-4", isMention: false },
        { id: 2, category: "Comment Added", title: "Jane commented on TMP-7", description: "Jane Doe commented: 'We should expose port 8080 inside CORS gateway configurations.'", sender: "Jane Doe", time: "2026-06-15 13:00", status: "Unread", priority: "Medium", sourceType: "Task", context: "Task #TMP-7", isMention: false },
        { id: 3, category: "Deadline Reminder", title: "Task Overdue: Complete Wireframes", description: "Design User Login Wireframes (TMP-1) was due 1 day ago. Please update the status.", sender: "System", time: "2026-06-15 09:00", status: "Unread", priority: "High", sourceType: "Task", context: "Task #TMP-1", isMention: false },
        { id: 4, category: "Project Created", title: "New Project: Mobile App Dev", description: "Robert Johnson created mobile application workspace for Android & iOS releases.", sender: "Robert Johnson", time: "2026-06-14 11:20", status: "Unread", priority: "Medium", sourceType: "Project", context: "Project #MAD", isMention: false },
        { id: 5, category: "System Alert", title: "Database migration backup failed", description: "Database schema migration backup (v3) timed out after 30 seconds of inactivity.", sender: "System", time: "2026-06-14 01:00", status: "Unread", priority: "Critical", sourceType: "System", context: "Backup Gateway", isMention: false },
        { id: 6, category: "Task Completed", title: "Task Completed: Compression check", description: "Sarah Connor marked 'Compress Image Assets for CDN' (TMP-8) as completed.", sender: "Sarah Connor", time: "2026-06-13 17:30", status: "Unread", priority: "Low", sourceType: "Task", context: "Task #TMP-8", isMention: false },
        { id: 7, category: "Task Updated", title: "Task Updated: Configure Webpack", description: "Mike Kowalski changed priority level of Webpack configurations (TMP-2) to High.", sender: "Mike Kowalski", time: "2026-06-13 15:45", status: "Unread", priority: "High", sourceType: "Task", context: "Task #TMP-2", isMention: false },
        { id: 8, category: "Project Updated", title: "Milestone Reached: SaaS Platform", description: "Emily Davis marked Phase 1 Wireframes milestone as completed.", sender: "Emily Davis", time: "2026-06-13 10:10", status: "Unread", priority: "Medium", sourceType: "Project", context: "Project #SP", isMention: false },
        { id: 9, category: "Comment Added", title: "Alex mentioned you on TMP-5", description: "Alex Mercer commented: '@adent please check draft manuals and verify deploy rollback steps.'", sender: "Alex Mercer", time: "2026-06-12 16:20", status: "Unread", priority: "High", sourceType: "Task", context: "Task #TMP-5", isMention: true },
        { id: 10, category: "Deadline Reminder", title: "Upcoming Deadline: Webpack Sync", description: "Webpack configurations (TMP-2) is due in 5 days.", sender: "System", time: "2026-06-12 09:00", status: "Unread", priority: "Medium", sourceType: "Task", context: "Task #TMP-2", isMention: false },
        { id: 11, category: "System Alert", title: "New device login detected", description: "A login request from Chrome on Linux (IP 192.168.1.45) was successfully authorized.", sender: "System", time: "2026-06-11 18:30", status: "Unread", priority: "High", sourceType: "System", context: "Auth Gateway", isMention: false },

        // 11 Read Notifications
        { id: 12, category: "Task Assigned", title: "New Task: Setup CORS Gateway", description: "Jane Doe assigned you to Setup CORS policies for Dev Gateway (TMP-7).", sender: "Jane Doe", time: "2026-06-10 14:00", status: "Read", priority: "Medium", sourceType: "Task", context: "Task #TMP-7", isMention: false },
        { id: 13, category: "Comment Added", title: "Sarah commented on TMP-3", description: "Sarah Connor commented: 'Unit tests pass. Setup credentials in session storage.'", sender: "Sarah Connor", time: "2026-06-09 11:15", status: "Read", priority: "Low", sourceType: "Task", context: "Task #TMP-3", isMention: false },
        { id: 14, category: "Task Completed", title: "Task Completed: DB Migration Queries", description: "Mike Kowalski marked 'Fix Database Migration Queries' (TMP-6) as completed.", sender: "Mike Kowalski", time: "2026-06-08 16:40", status: "Read", priority: "High", sourceType: "Task", context: "Task #TMP-6", isMention: false },
        { id: 15, category: "Project Created", title: "New Project: SaaS Platform", description: "Jane Doe created the flagship SaaS Platform development workspace.", sender: "Jane Doe", time: "2026-06-05 09:30", status: "Read", priority: "High", sourceType: "Project", context: "Project #SP", isMention: false },
        { id: 16, category: "System Alert", title: "Redis Cache cluster rebooted", description: "Maintenance logs: Redis server cluster cache restarted cleanly after index refresh.", sender: "System", time: "2026-06-04 04:00", status: "Read", priority: "Medium", sourceType: "System", context: "Redis Cache", isMention: false },
        { id: 17, category: "Task Assigned", title: "New Task: Image CDN assets check", description: "Robert Johnson assigned you to CDN image compression checks (TMP-8).", sender: "Robert Johnson", time: "2026-06-03 13:10", status: "Read", priority: "Low", sourceType: "Task", context: "Task #TMP-8", isMention: false },
        { id: 18, category: "Comment Added", title: "Mike mentioned you on TMP-4", description: "Mike Kowalski commented: '@adent Redis latency fixed by introducing master-replica shards.'", sender: "Mike Kowalski", time: "2026-06-02 15:25", status: "Read", priority: "Critical", sourceType: "Task", context: "Task #TMP-4", isMention: true },
        { id: 19, category: "Project Updated", title: "Milestone Achieved: Mobile App Dev", description: "Emily Davis completed iOS certificates setup and App Store configurations.", sender: "Emily Davis", time: "2026-06-01 11:40", status: "Read", priority: "Medium", sourceType: "Project", context: "Project #MAD", isMention: false },
        { id: 20, category: "Task Updated", title: "Task Updated: Deployment Manuals", description: "Sarah Connor updated priority of 'Draft Deployment Manuals' (TMP-5) to Medium.", sender: "Sarah Connor", time: "2026-05-28 10:50", status: "Read", priority: "Medium", sourceType: "Task", context: "Task #TMP-5", isMention: false },
        { id: 21, category: "Deadline Reminder", title: "Upcoming Deadline: Webpack Bundler", description: "Configure Webpack Bundlers (TMP-2) due date is set in 10 days.", sender: "System", time: "2026-05-25 09:00", status: "Read", priority: "Medium", sourceType: "Task", context: "Task #TMP-2", isMention: false },
        { id: 22, category: "System Alert", title: "API Gateway configs updated", description: "System logs: Gateway config re-compiled to support dev gateway CORS updates.", sender: "System", time: "2026-05-20 08:30", status: "Read", priority: "Low", sourceType: "System", context: "Gateway config", isMention: false }
    ];

    // ==========================================
    // STATE VARIABLES
    // ==========================================
    let filteredNotifications = [...notifications];
    let currentPage = 1;
    const itemsPerPage = 10;

    // ==========================================
    // DOM SELECTORS
    // ==========================================
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const logoutLink = document.getElementById('logout-link');
    const navDashboard = document.getElementById('nav-dashboard');
    const logoDashboardLink = document.getElementById('logo-dashboard-link');
    const avatarInitialsDisplay = document.getElementById('avatar-initials');
    const topNotificationCount = document.getElementById('top-notification-count');

    // Stats Cards Elements
    const statTotal = document.getElementById('stat-total-notifications');
    const statUnread = document.getElementById('stat-unread-notifications');
    const statTask = document.getElementById('stat-task-notifications');
    const statProject = document.getElementById('stat-project-notifications');
    const statSystem = document.getElementById('stat-system-notifications');
    const statMention = document.getElementById('stat-mention-notifications');

    // Filter Controls
    const globalSearchInput = document.getElementById('global-search-input');
    const searchTitleInput = document.getElementById('search-title-input');
    const searchUserInput = document.getElementById('search-user-input');
    const filterState = document.getElementById('filter-state');
    const filterCategory = document.getElementById('filter-category');
    const filterSourceType = document.getElementById('filter-source-type');

    // List & Pagination
    const feedList = document.getElementById('notifications-feed-list');
    const paginationInfo = document.getElementById('pagination-info');
    const paginationPrev = document.getElementById('pagination-prev');
    const paginationNext = document.getElementById('pagination-next');

    // Quick Actions buttons
    const btnMarkAllRead = document.getElementById('btn-mark-all-read');
    const btnClearAll = document.getElementById('btn-clear-all');
    const btnExportNotifications = document.getElementById('btn-export-notifications');

    // Detail Modal Buttons
    const btnToggleNotifState = document.getElementById('btn-toggle-notif-state');
    const btnDeleteNotif = document.getElementById('btn-delete-notif');

    // Inject Toast Notification Style Sheet (if not already injected)
    if (!document.querySelector('.custom-toast-style')) {
        const toastStyle = document.createElement('style');
        toastStyle.className = 'custom-toast-style';
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
    }

    // ==========================================
    // INITIALIZATION & SESSION CONTROLS
    // ==========================================
    function init() {
        loadSessionUser();
        applyFilters();
        setupEventListeners();
    }

    // Load active session user email and name initials greeting
    function loadSessionUser() {
        const loggedInEmail = localStorage.getItem('taskmaster_user_email') || 
                              sessionStorage.getItem('taskmaster_user_email');
        if (loggedInEmail) {
            const prefix = loggedInEmail.split('@')[0];
            const formattedName = prefix.split('.').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            
            // initials extraction
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

    function getCategoryIconSvg(category) {
        switch (category) {
            case "Task Assigned":
                return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="16" x2="22" y1="11" y2="11"/></svg>`;
            case "Task Updated":
                return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>`;
            case "Task Completed":
                return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
            case "Project Created":
                return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><line x1="12" x2="12" y1="11" y2="17"/><line x1="9" x2="15" y1="14" y2="14"/></svg>`;
            case "Project Updated":
                return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`;
            case "Comment Added":
                return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
            case "Deadline Reminder":
                return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
            case "System Alert":
            default:
                return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`;
        }
    }

    // ==========================================
    // FILTERING & PAGINATION ENGINE
    // ==========================================
    function applyFilters() {
        const globalSearch = globalSearchInput ? globalSearchInput.value.toLowerCase().trim() : "";
        const titleSearch = searchTitleInput ? searchTitleInput.value.toLowerCase().trim() : "";
        const userSearch = searchUserInput ? searchUserInput.value.toLowerCase().trim() : "";
        
        const stateVal = filterState ? filterState.value : "All";
        const catVal = filterCategory ? filterCategory.value : "All";
        const sourceVal = filterSourceType ? filterSourceType.value : "All";

        filteredNotifications = notifications.filter(notif => {
            const matchesGlobal = !globalSearch || notif.title.toLowerCase().includes(globalSearch) || notif.description.toLowerCase().includes(globalSearch);
            const matchesTitle = !titleSearch || notif.title.toLowerCase().includes(titleSearch);
            const matchesUser = !userSearch || notif.sender.toLowerCase().includes(userSearch);
            
            const matchesState = stateVal === "All" || notif.status === stateVal;
            const matchesCat = catVal === "All" || notif.category === catVal;
            const matchesSource = sourceVal === "All" || notif.sourceType === sourceVal;

            return matchesGlobal && matchesTitle && matchesUser && matchesState && matchesCat && matchesSource;
        });

        currentPage = 1; // reset page to 1
        renderFeed();
        calculateAndSetStats();
    }

    function renderFeed() {
        if (!feedList) return;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, filteredNotifications.length);
        const paginatedItems = filteredNotifications.slice(startIndex, endIndex);

        if (paginatedItems.length === 0) {
            feedList.innerHTML = `
                <div class="empty-feed-state">
                    <div class="empty-icon-wrapper">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                    </div>
                    <h3 class="empty-title">Inbox Clean</h3>
                    <p class="empty-desc">No notifications match your search query filters. Try adjusting your parameters.</p>
                </div>
            `;
            if (paginationInfo) paginationInfo.textContent = "Showing 0 to 0 of 0 entries";
            if (paginationPrev) paginationPrev.disabled = true;
            if (paginationNext) paginationNext.disabled = true;
            return;
        }

        feedList.innerHTML = paginatedItems.map(notif => {
            const unreadClass = notif.status === "Unread" ? "unread-state" : "";
            const priorityClass = notif.priority.toLowerCase();
            const sourceClass = notif.sourceType.toLowerCase();
            
            // Initials of sender
            const senderInitials = notif.sender === "System" ? "SYS" : getInitials(notif.sender);
            const iconSvg = getCategoryIconSvg(notif.category);

            return `
                <div class="notification-card ${unreadClass}" id="notif-card-${notif.id}">
                    <!-- Unread dot -->
                    <div class="unread-dot-indicator"></div>

                    <!-- Category Icon wrapper -->
                    <div class="notif-category-icon-wrapper ${sourceClass}-category">
                        ${iconSvg}
                    </div>

                    <!-- Details block -->
                    <div class="notif-details-block">
                        <div class="notif-title-row">
                            <span class="notif-title-text" onclick="viewNotificationDetails(${notif.id})">${notif.title}</span>
                            <span class="badge cat-badge ${sourceClass}">${notif.category}</span>
                            <span class="badge priority-${priorityClass}">${notif.priority}</span>
                        </div>
                        <p class="notif-description-text">${notif.description}</p>
                        <div class="notif-meta-row">
                            <div class="notif-sender-avatar" title="${notif.sender}">${senderInitials}</div>
                            <span>${notif.sender}</span>
                            <span>&bull;</span>
                            <span>${notif.time}</span>
                            <span>&bull;</span>
                            <span>Context: <strong style="color: var(--text-secondary);">${notif.context}</strong></span>
                        </div>
                    </div>

                    <!-- Action buttons -->
                    <div class="notif-row-actions">
                        <!-- View Details -->
                        <button class="table-action-btn" onclick="viewNotificationDetails(${notif.id})" title="View Details">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        <!-- Toggle state -->
                        <button class="table-action-btn" onclick="toggleNotificationStatus(${notif.id})" title="${notif.status === 'Unread' ? 'Mark as Read' : 'Mark as Unread'}">
                            ${notif.status === 'Unread'
                                ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`
                                : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="4 6 12 12 20 6"/><line x1="12" x2="12" y1="12" y2="22"/></svg>`
                            }
                        </button>
                        <!-- Delete notif -->
                        <button class="table-action-btn delete" onclick="deleteNotification(${notif.id})" title="Delete Notification">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        if (paginationInfo) {
            paginationInfo.textContent = `Showing ${startIndex + 1} to ${endIndex} of ${filteredNotifications.length} entries`;
        }

        if (paginationPrev) paginationPrev.disabled = currentPage === 1;
        if (paginationNext) paginationNext.disabled = endIndex >= filteredNotifications.length;
    }

    function calculateAndSetStats() {
        const unreadCount = notifications.filter(n => n.status === "Unread").length;

        // Top notification badge
        if (topNotificationCount) {
            topNotificationCount.textContent = unreadCount;
            if (unreadCount === 0) {
                topNotificationCount.classList.add('hidden');
            } else {
                topNotificationCount.classList.remove('hidden');
            }
        }

        if (statTotal) statTotal.textContent = notifications.length;
        if (statUnread) statUnread.textContent = unreadCount;
        if (statTask) statTask.textContent = notifications.filter(n => n.sourceType === "Task").length;
        if (statProject) statProject.textContent = notifications.filter(n => n.sourceType === "Project").length;
        if (statSystem) statSystem.textContent = notifications.filter(n => n.sourceType === "System").length;
        if (statMention) statMention.textContent = notifications.filter(n => n.isMention === true).length;
    }

    // ==========================================
    // NOTIFICATION OPERATIONS
    // ==========================================
    function toggleNotificationStatus(id) {
        const notif = notifications.find(n => n.id === id);
        if (!notif) return;

        const oldStatus = notif.status;
        const newStatus = oldStatus === "Unread" ? "Read" : "Unread";
        notif.status = newStatus;

        applyFilters();
        showToast(`Marked notification as ${newStatus.toLowerCase()}.`, "info");
    }

    function deleteNotification(id) {
        const index = notifications.findIndex(n => n.id === id);
        if (index === -1) return;

        notifications.splice(index, 1);
        applyFilters();
        showToast("Notification deleted.", "info");
    }

    function viewNotificationDetails(id) {
        const notif = notifications.find(n => n.id === id);
        if (!notif) return;

        // Populate fields in detail modal
        const modal = document.getElementById('modal-view-notification');
        const iconContainer = document.getElementById('view-notif-icon-container');
        const titleVal = document.getElementById('view-notif-title');
        const catBadge = document.getElementById('view-notif-category-badge');
        const priorityBadge = document.getElementById('view-notif-priority-badge');
        const descVal = document.getElementById('view-notif-description');
        const senderVal = document.getElementById('view-notif-sender');
        const timeVal = document.getElementById('view-notif-time');
        const statusVal = document.getElementById('view-notif-status');
        const contextVal = document.getElementById('view-notif-context');
        const idField = document.getElementById('view-notif-id-field');

        if (idField) idField.value = notif.id;
        if (titleVal) titleVal.textContent = notif.title;
        if (descVal) descVal.textContent = notif.description;
        if (senderVal) senderVal.textContent = notif.sender;
        if (timeVal) timeVal.textContent = notif.time;
        if (contextVal) contextVal.textContent = notif.context;

        // Category icon SVG
        if (iconContainer) {
            iconContainer.className = `detail-category-icon ${notif.sourceType.toLowerCase()}`;
            iconContainer.innerHTML = getCategoryIconSvg(notif.category);
        }

        // Badges
        if (catBadge) {
            catBadge.className = `badge cat-badge ${notif.sourceType.toLowerCase()}`;
            catBadge.textContent = notif.category;
        }

        if (priorityBadge) {
            priorityBadge.className = `badge priority-${notif.priority.toLowerCase()}`;
            priorityBadge.textContent = notif.priority;
        }

        if (statusVal) {
            statusVal.className = `badge status-${notif.status.toLowerCase()}`;
            statusVal.textContent = notif.status;
        }

        // Auto mark as read when viewed
        if (notif.status === "Unread") {
            notif.status = "Read";
            applyFilters();
        }

        if (modal) modal.classList.add('active');
    }

    // Expose actions to global scope so inline html onclick resolves
    window.toggleNotificationStatus = toggleNotificationStatus;
    window.deleteNotification = deleteNotification;
    window.viewNotificationDetails = viewNotificationDetails;

    // ==========================================
    // EVENTS BINDINGS & ACTIONS
    // ==========================================
    function setupEventListeners() {
        // Mobile Sidebar Toggles
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
        const textSearchElements = [globalSearchInput, searchTitleInput, searchUserInput];
        textSearchElements.forEach(el => {
            if (el) el.addEventListener('input', applyFilters);
        });

        // Filter Dropdowns
        const selectDropdowns = [filterState, filterCategory, filterSourceType];
        selectDropdowns.forEach(el => {
            if (el) el.addEventListener('change', applyFilters);
        });

        // Pagination Prev/Next
        if (paginationPrev) {
            paginationPrev.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderFeed();
                }
            });
        }

        if (paginationNext) {
            paginationNext.addEventListener('click', () => {
                const maxPage = Math.ceil(filteredNotifications.length / itemsPerPage);
                if (currentPage < maxPage) {
                    currentPage++;
                    renderFeed();
                }
            });
        }

        // Universal modal cancel & close buttons
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

        // Action Toolbar: Mark All as Read
        if (btnMarkAllRead) {
            btnMarkAllRead.addEventListener('click', () => {
                let count = 0;
                notifications.forEach(n => {
                    if (n.status === "Unread") {
                        n.status = "Read";
                        count++;
                    }
                });
                
                if (count > 0) {
                    applyFilters();
                    showToast(`Successfully marked ${count} notifications as read.`, "success");
                } else {
                    showToast("All notifications are already read.", "info");
                }
            });
        }

        // Action Toolbar: Clear All
        if (btnClearAll) {
            btnClearAll.addEventListener('click', () => {
                if (notifications.length === 0) {
                    showToast("No notifications to clear.", "info");
                    return;
                }
                notifications = [];
                applyFilters();
                showToast("Cleared all notification history.", "info");
            });
        }

        // Action Toolbar: Export
        if (btnExportNotifications) {
            btnExportNotifications.addEventListener('click', () => {
                if (notifications.length === 0) {
                    showToast("Nothing to export.", "error");
                    return;
                }
                
                let csvContent = "data:text/csv;charset=utf-8,";
                csvContent += "ID,Category,Title,Description,Sender,Time,Status,Priority,SourceType,Context\n";
                
                notifications.forEach(notif => {
                    const row = [
                        notif.id,
                        `"${notif.category}"`,
                        `"${notif.title}"`,
                        `"${notif.description}"`,
                        `"${notif.sender}"`,
                        notif.time,
                        notif.status,
                        notif.priority,
                        notif.sourceType,
                        `"${notif.context}"`
                    ].join(",");
                    csvContent += row + "\n";
                });
                
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "taskmaster_notifications_export.csv");
                document.body.appendChild(link);
                
                link.click();
                document.body.removeChild(link);
                showToast("Notification feed exported successfully as CSV!", "success");
            });
        }

        // Modal Action: Toggle status inside modal
        if (btnToggleNotifState) {
            btnToggleNotifState.addEventListener('click', () => {
                const idVal = document.getElementById('view-notif-id-field').value;
                const notif = notifications.find(n => n.id === parseInt(idVal));
                if (!notif) return;

                const oldStatus = notif.status;
                const newStatus = oldStatus === "Unread" ? "Read" : "Unread";
                notif.status = newStatus;

                // Update detail modal UI
                const statusBadge = document.getElementById('view-notif-status');
                if (statusBadge) {
                    statusBadge.className = `badge status-${newStatus.toLowerCase()}`;
                    statusBadge.textContent = newStatus;
                }

                applyFilters();
                showToast(`Notification marked as ${newStatus.toLowerCase()}.`, "info");
            });
        }

        // Modal Action: Delete notification inside modal
        if (btnDeleteNotif) {
            btnDeleteNotif.addEventListener('click', () => {
                const idVal = document.getElementById('view-notif-id-field').value;
                const index = notifications.findIndex(n => n.id === parseInt(idVal));
                
                if (index !== -1) {
                    notifications.splice(index, 1);
                    
                    const modal = document.getElementById('modal-view-notification');
                    if (modal) modal.classList.remove('active');
                    
                    applyFilters();
                    showToast("Notification deleted.", "info");
                }
            });
        }
    }

    // Launch application initialization
    init();
});
