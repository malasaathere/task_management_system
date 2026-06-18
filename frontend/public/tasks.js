/**
 * TaskMaster Pro - Task Management Script
 * Controls task listings, search queries, filtering systems, stats calculations, mobile drawer,
 * and comprehensive modal actions (Create, View, Edit, Delete, Assign User, Change Status).
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // INITIAL DUMMY DATA STATE
    // ==========================================
    let tasks = [
        { id: 1, title: "Design User Login Wireframes", project: "SaaS Platform", assignee: "Jane Doe", priority: "Medium", status: "In Progress", startDate: "2026-06-10", dueDate: "2026-06-16", description: "Create mocks for login, forgot password, and reset screens.", attachment: "login_mocks_v1.png" },
        { id: 2, title: "Configure Webpack Bundlers", project: "SaaS Platform", assignee: "Mike Kowalski", priority: "High", status: "To Do", startDate: "2026-06-14", dueDate: "2026-06-20", description: "Optimize bundle sizes, reduce code splitting chunks, and setup environment configs.", attachment: null },
        { id: 3, title: "Review Auth Controller Unit Tests", project: "Mobile App Dev", assignee: "Sarah Connor", priority: "Low", status: "Completed", startDate: "2026-06-05", dueDate: "2026-06-12", description: "Verify cookie settings, JWT token validation, and OAuth provider mocks.", attachment: "test_report_pass.txt" },
        { id: 4, title: "Optimize Redis Cache Sync", project: "Mobile App Dev", assignee: "Mike Kowalski", priority: "Critical", status: "In Progress", startDate: "2026-06-08", dueDate: "2026-06-15", description: "Debug cache latency sync during multiple parallel requests.", attachment: null },
        { id: 5, title: "Draft Deployment Manuals", project: "SEO Strategy", assignee: "Alex Mercer", priority: "Low", status: "To Do", startDate: "2026-06-15", dueDate: "2026-06-25", description: "Compile production server deployment checklist, rollbacks, and validation testing scripts.", attachment: null },
        { id: 6, title: "Fix Database Migration Queries", project: "SaaS Platform", assignee: "Mike Kowalski", priority: "High", status: "Completed", startDate: "2026-06-02", dueDate: "2026-06-11", description: "Modify schema configurations to support workspace user roles.", attachment: "migration_v3.sql" },
        { id: 7, title: "Setup CORS policies for Dev Gateway", project: "SaaS Platform", assignee: "Jane Doe", priority: "Medium", status: "Review", startDate: "2026-06-10", dueDate: "2026-06-14", description: "Audit access origin headers, token requests, and exposed endpoints.", attachment: null },
        { id: 8, title: "Compress Image Assets for CDN", project: "SEO Strategy", assignee: "Sarah Connor", priority: "Low", status: "In Progress", startDate: "2026-06-11", dueDate: "2026-06-17", description: "Lossless compression of dashboard banners, site headers, and system icons.", attachment: "compressed_assets.zip" }
    ];

    let activities = [
        { text: "Task <strong>TMP-4</strong> was moved to <em>In Progress</em>", time: "2 hours ago" },
        { text: "User <strong>Jane Doe</strong> commented on <strong>TMP-7</strong>", time: "4 hours ago" },
        { text: "Task <strong>TMP-3</strong> was marked <em>Completed</em>", time: "1 day ago" },
        { text: "Task <strong>TMP-6</strong> attachment uploaded", time: "3 days ago" }
    ];

    const currentMockDate = "2026-06-15"; // Base mock date to calculate overdue/deadline parameters

    // ==========================================
    // DOM SELECTORS
    // ==========================================
    // Sidebar responsive & link selectors
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const navDashboard = document.getElementById('nav-dashboard');
    const logoDashboardLink = document.getElementById('logo-dashboard-link');
    const logoutLink = document.getElementById('logout-link');

    // Rendering lists targets
    const tasksTableBody = document.getElementById('main-tasks-table-body');
    const overdueTasksContainer = document.getElementById('overdue-tasks-list');
    const upcomingDeadlinesContainer = document.getElementById('upcoming-deadlines-list');
    const recentActivityContainer = document.getElementById('recent-tasks-list');

    // Filter selectors
    const filterProject = document.getElementById('filter-project');
    const filterStatus = document.getElementById('filter-status');
    const filterPriority = document.getElementById('filter-priority');
    const globalSearchInput = document.getElementById('global-search-input');

    // Modals
    const modalCreateTask = document.getElementById('modal-create-task');
    const modalViewTask = document.getElementById('modal-view-task');
    const modalEditTask = document.getElementById('modal-edit-task');
    const modalDeleteTask = document.getElementById('modal-delete-task');
    const modalChangeStatus = document.getElementById('modal-change-status');
    const modalAssignUser = document.getElementById('modal-assign-user');

    // Forms
    const formCreateTask = document.getElementById('form-create-task');
    const formEditTask = document.getElementById('form-edit-task');
    const formChangeStatus = document.getElementById('form-change-status');
    const formAssignUser = document.getElementById('form-assign-user');

    // Trigger buttons
    const btnTriggerCreateTask = document.getElementById('btn-trigger-create-task');
    const btnConfirmDelete = document.getElementById('btn-confirm-delete');

    // Statistics card labels
    const statTotalTasks = document.getElementById('stat-total-tasks');
    const statCompletedTasks = document.getElementById('stat-completed-tasks');
    const statInprogressTasks = document.getElementById('stat-inprogress-tasks');
    const statPendingTasks = document.getElementById('stat-pending-tasks');
    const statOverdueTasks = document.getElementById('stat-overdue-tasks');
    const statHighPriority = document.getElementById('stat-high-priority');

    // Initials & Session selectors
    const avatarInitialsDisplay = document.getElementById('avatar-initials');

    // ==========================================
    // INITIALIZATION & SESSION BINDINGS
    // ==========================================
    function init() {
        loadSessionUser();
        applyFilters();
        renderSidebarDeadlines();
        setupEventListeners();
    }

    // Resolves matching dashboard links based on email credential prefix
    function loadSessionUser() {
        const loggedInEmail = localStorage.getItem('taskmaster_user_email') || 
                              sessionStorage.getItem('taskmaster_user_email');
        if (loggedInEmail) {
            const prefix = loggedInEmail.split('@')[0];
            const formattedName = prefix.split('.').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            
            // Initials extraction
            const initialsMatches = formattedName.match(/\b\w/g) || [];
            const initials = ((initialsMatches.shift() || '') + (initialsMatches.pop() || '')).toUpperCase();
            if (avatarInitialsDisplay && initials) avatarInitialsDisplay.textContent = initials;

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
    // RENDERING & STATISTICS COMPUTATION
    // ==========================================
    function applyFilters() {
        const selectedProj = filterProject.value;
        const selectedStatus = filterStatus.value;
        const selectedPriority = filterPriority.value;
        const searchVal = globalSearchInput.value.toLowerCase().trim();

        const filtered = tasks.filter(task => {
            const matchesProj = (selectedProj === "All" || task.project === selectedProj);
            const matchesStatus = (selectedStatus === "All" || task.status === selectedStatus);
            const matchesPriority = (selectedPriority === "All" || task.priority === selectedPriority);
            const matchesSearch = (searchVal === "" || task.title.toLowerCase().includes(searchVal));

            return matchesProj && matchesStatus && matchesPriority && matchesSearch;
        });

        renderTasksTable(filtered);
        calculateAndSetStats();
    }

    function renderTasksTable(items) {
        if (!tasksTableBody) return;
        
        if (items.length === 0) {
            tasksTableBody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 32px; color: var(--text-secondary);">No tasks match selected filter criteria.</td>
                </tr>
            `;
            return;
        }

        tasksTableBody.innerHTML = items.map(task => {
            // Check if task is overdue
            let isOverdue = task.status !== "Completed" && task.dueDate < currentMockDate;
            let statusLabel = isOverdue ? "Overdue" : task.status;
            let statusClass = statusLabel.replace(/\s+/g, '').toLowerCase();

            return `
                <tr>
                    <td class="task-id-cell">TMP-${task.id}</td>
                    <td class="task-title-cell" onclick="viewTask(${task.id})">${task.title}</td>
                    <td>${task.project}</td>
                    <td>
                        <div class="user-cell">
                            <span class="user-avatar-small">${task.assignee.substring(0,2)}</span>
                            <span>${task.assignee}</span>
                        </div>
                    </td>
                    <td><span class="badge priority-${task.priority.toLowerCase()}">${task.priority}</span></td>
                    <td><span class="badge status-${statusClass}">${statusLabel}</span></td>
                    <td style="color: var(--text-secondary); font-weight: 500;">${formatDateString(task.dueDate)}</td>
                    <td>
                        <div class="action-btns-cell" style="justify-content: flex-end; padding-right: 8px;">
                            <!-- View Detail -->
                            <button class="table-action-btn" onclick="viewTask(${task.id})" title="View Details">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                            </button>
                            <!-- Edit Details -->
                            <button class="table-action-btn" onclick="editTask(${task.id})" title="Edit Task">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                            </button>
                            <!-- Quick Assign User -->
                            <button class="table-action-btn" onclick="quickAssignUser(${task.id})" title="Assign User">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="16" x2="22" y1="11" y2="11"/></svg>
                            </button>
                            <!-- Quick Status Update -->
                            <button class="table-action-btn" onclick="quickChangeStatus(${task.id})" title="Change Status">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
                            </button>
                            <!-- Delete Task -->
                            <button class="table-action-btn delete" onclick="confirmDeleteTask(${task.id})" title="Delete Task">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    function renderSidebarDeadlines() {
        // 1. Overdue Tasks sidebar list
        if (overdueTasksContainer) {
            const overdueItems = tasks.filter(t => t.status !== "Completed" && t.dueDate < currentMockDate);
            if (overdueItems.length === 0) {
                overdueTasksContainer.innerHTML = '<p style="font-size: 13px; color: var(--text-muted);">No overdue tasks.</p>';
            } else {
                overdueTasksContainer.innerHTML = overdueItems.slice(0, 3).map(t => {
                    const diffDays = getDaysDifference(t.dueDate, currentMockDate);
                    return `
                        <div class="list-item">
                            <div class="list-info">
                                <span class="list-title" style="cursor: pointer" onclick="viewTask(${t.id})">${t.title}</span>
                                <span class="list-subtitle">${t.project} &bull; Due ${formatDateString(t.dueDate)}</span>
                            </div>
                            <span class="list-badge" style="color: var(--priority-high-color);">${diffDays}d overdue</span>
                        </div>
                    `;
                }).join('');
            }
        }

        // 2. Upcoming Deadlines sidebar list (Due within next 7 days, excluding completed)
        if (upcomingDeadlinesContainer) {
            const upcomingItems = tasks.filter(t => {
                if (t.status === "Completed") return false;
                const days = getDaysDifference(currentMockDate, t.dueDate);
                return days >= 0 && days <= 7;
            }).sort((a,b) => (a.dueDate > b.dueDate ? 1 : -1));

            if (upcomingItems.length === 0) {
                upcomingDeadlinesContainer.innerHTML = '<p style="font-size: 13px; color: var(--text-muted);">No deadlines in the next 7 days.</p>';
            } else {
                upcomingDeadlinesContainer.innerHTML = upcomingItems.slice(0, 3).map(t => {
                    const days = getDaysDifference(currentMockDate, t.dueDate);
                    const daysText = days === 0 ? "Due Today" : (days === 1 ? "1 day left" : `${days} days left`);
                    const criticality = days <= 1 ? "critical" : (days <= 4 ? "warn" : "normal");

                    return `
                        <div class="list-item">
                            <div class="list-info">
                                <span class="list-title" style="cursor: pointer" onclick="viewTask(${t.id})">${t.title}</span>
                                <span class="list-subtitle">${t.project} &bull; Due ${formatDateString(t.dueDate)}</span>
                            </div>
                            <span class="deadline-days-left ${criticality}" style="font-size: 11px; font-weight: 600; padding: 2px 6px;">${daysText}</span>
                        </div>
                    `;
                }).join('');
            }
        }

        // 3. Recent Tasks Activity timeline
        if (recentActivityContainer) {
            recentActivityContainer.innerHTML = activities.slice(0, 4).map(act => `
                <div class="list-item" style="align-items: center;">
                    <div class="list-info" style="gap: 4px;">
                        <span class="list-title" style="font-weight: 500; font-size: 13px; line-height: 1.4;">${act.text}</span>
                        <span class="list-subtitle" style="font-size: 11.5px;">${act.time}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    function calculateAndSetStats() {
        // Total Tasks
        if (statTotalTasks) statTotalTasks.textContent = tasks.length;
        
        // Completed Tasks
        const completed = tasks.filter(t => t.status === "Completed").length;
        if (statCompletedTasks) statCompletedTasks.textContent = completed;

        // In Progress
        const inProgress = tasks.filter(t => t.status === "In Progress").length;
        if (statInprogressTasks) statInprogressTasks.textContent = inProgress;

        // Pending (To Do + Review)
        const pending = tasks.filter(t => t.status === "To Do" || t.status === "Review").length;
        if (statPendingTasks) statPendingTasks.textContent = pending;

        // Overdue Tasks
        const overdue = tasks.filter(t => t.status !== "Completed" && t.dueDate < currentMockDate).length;
        if (statOverdueTasks) statOverdueTasks.textContent = overdue;

        // High Priority (High + Critical)
        const highPriority = tasks.filter(t => t.priority === "High" || t.priority === "Critical").length;
        if (statHighPriority) statHighPriority.textContent = highPriority;
    }

    // ==========================================
    // ACTION LISTENERS & ROUTINGS
    // ==========================================
    function setupEventListeners() {
        // Mobile sidebar toggle
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.add('active');
                sidebarOverlay.classList.add('active');
            });
        }
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', () => {
                sidebar.classList.remove('active');
                sidebarOverlay.classList.remove('active');
            });
        }

        // Logout
        if (logoutLink) {
            logoutLink.addEventListener('click', () => {
                localStorage.clear();
                sessionStorage.clear();
            });
        }

        // Change filters listeners
        if (filterProject) filterProject.addEventListener('change', applyFilters);
        if (filterStatus) filterStatus.addEventListener('change', applyFilters);
        if (filterPriority) filterPriority.addEventListener('change', applyFilters);
        if (globalSearchInput) globalSearchInput.addEventListener('input', applyFilters);

        // Open Dialog triggers
        if (btnTriggerCreateTask) {
            btnTriggerCreateTask.addEventListener('click', () => openModal(modalCreateTask));
        }

        // Close cancel selectors
        const modalOverlays = document.querySelectorAll('.modal-overlay');
        modalOverlays.forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) closeModal(overlay);
            });
            const closeBtn = overlay.querySelector('.modal-close-btn');
            if (closeBtn) closeBtn.addEventListener('click', () => closeModal(overlay));
            const cancelBtn = overlay.querySelector('.modal-cancel-btn');
            if (cancelBtn) cancelBtn.addEventListener('click', () => closeModal(overlay));
        });

        // Form Submit: Create Task
        if (formCreateTask) {
            formCreateTask.addEventListener('submit', (e) => {
                e.preventDefault();
                const title = document.getElementById('create-title').value.trim();
                const desc = document.getElementById('create-desc').value.trim();
                const project = document.getElementById('create-project').value;
                const assignee = document.getElementById('create-assignee').value;
                const priority = document.getElementById('create-priority').value;
                const status = document.getElementById('create-status').value;
                const startDate = document.getElementById('create-start-date').value;
                const dueDate = document.getElementById('create-due-date').value;
                const files = document.getElementById('create-attachments');
                let filename = files.files.length ? files.files[0].name : null;

                const newTask = {
                    id: tasks.length + 1,
                    title: title,
                    project: project,
                    assignee: assignee,
                    priority: priority,
                    status: status,
                    startDate: startDate,
                    dueDate: dueDate,
                    description: desc,
                    attachment: filename
                };

                tasks.push(newTask);
                
                // Add activity log
                activities.unshift({
                    text: `Task <strong>TMP-${newTask.id}</strong> was created by you`,
                    time: "Just now"
                });

                applyFilters();
                renderSidebarDeadlines();
                closeModal(modalCreateTask);
                formCreateTask.reset();
            });
        }

        // Form Submit: Edit Task
        if (formEditTask) {
            formEditTask.addEventListener('submit', (e) => {
                e.preventDefault();
                const id = parseInt(document.getElementById('edit-task-id').value);
                const title = document.getElementById('edit-title').value.trim();
                const desc = document.getElementById('edit-desc').value.trim();
                const project = document.getElementById('edit-project').value;
                const assignee = document.getElementById('edit-assignee').value;
                const priority = document.getElementById('edit-priority').value;
                const status = document.getElementById('edit-status').value;
                const startDate = document.getElementById('edit-start-date').value;
                const dueDate = document.getElementById('edit-due-date').value;
                const files = document.getElementById('edit-attachments');

                const taskIndex = tasks.findIndex(t => t.id === id);
                if (taskIndex !== -1) {
                    tasks[taskIndex].title = title;
                    tasks[taskIndex].description = desc;
                    tasks[taskIndex].project = project;
                    tasks[taskIndex].assignee = assignee;
                    tasks[taskIndex].priority = priority;
                    tasks[taskIndex].status = status;
                    tasks[taskIndex].startDate = startDate;
                    tasks[taskIndex].dueDate = dueDate;
                    if (files.files.length) {
                        tasks[taskIndex].attachment = files.files[0].name;
                    }

                    activities.unshift({
                        text: `Task <strong>TMP-${id}</strong> details were modified`,
                        time: "Just now"
                    });
                }

                applyFilters();
                renderSidebarDeadlines();
                closeModal(modalEditTask);
                formEditTask.reset();
            });
        }

        // Form Submit: Quick Change Status
        if (formChangeStatus) {
            formChangeStatus.addEventListener('submit', (e) => {
                e.preventDefault();
                const id = parseInt(document.getElementById('status-task-id').value);
                const newStatus = document.getElementById('quick-status-select').value;

                const taskIndex = tasks.findIndex(t => t.id === id);
                if (taskIndex !== -1) {
                    tasks[taskIndex].status = newStatus;
                    activities.unshift({
                        text: `Task <strong>TMP-${id}</strong> status changed to <em>${newStatus}</em>`,
                        time: "Just now"
                    });
                }

                applyFilters();
                renderSidebarDeadlines();
                closeModal(modalChangeStatus);
            });
        }

        // Form Submit: Quick Assign User
        if (formAssignUser) {
            formAssignUser.addEventListener('submit', (e) => {
                e.preventDefault();
                const id = parseInt(document.getElementById('assign-task-id').value);
                const newAssignee = document.getElementById('quick-assignee-select').value;

                const taskIndex = tasks.findIndex(t => t.id === id);
                if (taskIndex !== -1) {
                    tasks[taskIndex].assignee = newAssignee;
                    activities.unshift({
                        text: `Task <strong>TMP-${id}</strong> assigned to <strong>${newAssignee}</strong>`,
                        time: "Just now"
                    });
                }

                applyFilters();
                renderSidebarDeadlines();
                closeModal(modalAssignUser);
            });
        }

        // Confirm Delete Button listener
        if (btnConfirmDelete) {
            btnConfirmDelete.addEventListener('click', () => {
                const id = parseInt(document.getElementById('delete-task-id').value);
                const task = tasks.find(t => t.id === id);
                if (task) {
                    tasks = tasks.filter(t => t.id !== id);
                    activities.unshift({
                        text: `Task <strong>TMP-${id}</strong> ("${task.title}") was deleted`,
                        time: "Just now"
                    });
                }

                applyFilters();
                renderSidebarDeadlines();
                closeModal(modalDeleteTask);
            });
        }
    }

    // ==========================================
    // WINDOW LEVEL ROUTINGS (Used by Inline HTML Buttons)
    // ==========================================
    window.viewTask = function(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        let isOverdue = task.status !== "Completed" && task.dueDate < currentMockDate;
        let statusLabel = isOverdue ? "Overdue" : task.status;
        let statusClass = statusLabel.replace(/\s+/g, '').toLowerCase();

        document.getElementById('view-task-detail-title').textContent = task.title;
        document.getElementById('view-task-detail-desc').textContent = task.description || "No description provided.";
        document.getElementById('view-task-detail-id').textContent = `TMP-${task.id}`;
        document.getElementById('view-task-detail-project').textContent = task.project;
        document.getElementById('view-task-detail-assignee').textContent = task.assignee;
        document.getElementById('view-task-detail-timeline').textContent = `${formatDateString(task.startDate)} - ${formatDateString(task.dueDate)}`;
        document.getElementById('view-task-detail-attachment').textContent = task.attachment || "None";

        document.getElementById('view-task-detail-status').className = `badge status-${statusClass}`;
        document.getElementById('view-task-detail-status').textContent = statusLabel;

        document.getElementById('view-task-detail-priority').className = `badge priority-${task.priority.toLowerCase()}`;
        document.getElementById('view-task-detail-priority').textContent = task.priority;

        openModal(modalViewTask);
    };

    window.editTask = function(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        document.getElementById('edit-task-id').value = task.id;
        document.getElementById('edit-title').value = task.title;
        document.getElementById('edit-desc').value = task.description || '';
        document.getElementById('edit-project').value = task.project;
        document.getElementById('edit-assignee').value = task.assignee;
        document.getElementById('edit-priority').value = task.priority;
        document.getElementById('edit-status').value = task.status;
        document.getElementById('edit-start-date').value = task.startDate;
        document.getElementById('edit-due-date').value = task.dueDate;

        openModal(modalEditTask);
    };

    window.quickChangeStatus = function(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        document.getElementById('status-task-id').value = task.id;
        document.getElementById('quick-status-select').value = task.status;

        openModal(modalChangeStatus);
    };

    window.quickAssignUser = function(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        document.getElementById('assign-task-id').value = task.id;
        document.getElementById('quick-assignee-select').value = task.assignee;

        openModal(modalAssignUser);
    };

    window.confirmDeleteTask = function(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        document.getElementById('delete-task-id').value = task.id;
        document.getElementById('delete-task-title-confirm').textContent = `TMP-${task.id}: ${task.title}`;

        openModal(modalDeleteTask);
    };

    // ==========================================
    // UTILITY HELPERS
    // ==========================================
    function openModal(modalElement) {
        if (modalElement) modalElement.classList.add('active');
    }

    function closeModal(modalElement) {
        if (modalElement) modalElement.classList.remove('active');
    }

    function formatDateString(dateStr) {
        if (!dateStr) return '';
        const dateObj = new Date(dateStr);
        if (isNaN(dateObj.getTime())) return dateStr;
        return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    function getDaysDifference(startStr, endStr) {
        const s = new Date(startStr);
        const e = new Date(endStr);
        const diffTime = e - s;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // Trigger initial execution
    init();
});
