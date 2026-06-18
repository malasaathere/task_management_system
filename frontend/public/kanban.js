/**
 * TaskMaster Pro - Kanban Board Script
 * Implements HTML5 Drag and Drop task lanes, card searching, project and priority filtering,
 * top summary stats computation, sidebar responsive drawers, and modal handlers (Create, View, Assign, Move).
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // INITIAL DUMMY DATA STATE (18 tasks)
    // ==========================================
    let tasks = [
        // To Do (5)
        { id: 1, title: "Design User Login Wireframes", project: "SaaS Platform", assignee: "Jane Doe", priority: "Medium", status: "To Do", startDate: "2026-06-15", dueDate: "2026-06-18", description: "Create mockups for login routing and session expirations." },
        { id: 2, title: "Configure Webpack Bundlers", project: "SaaS Platform", assignee: "Mike Kowalski", priority: "High", status: "To Do", startDate: "2026-06-14", dueDate: "2026-06-20", description: "Optimize bundle sizes, reduce code splitting chunks, and setup environment configs." },
        { id: 3, title: "Draft Deployment Manuals", project: "SEO Strategy", assignee: "Alex Mercer", priority: "Low", status: "To Do", startDate: "2026-06-15", dueDate: "2026-06-25", description: "Compile production server deployment checklist, rollbacks, and validation testing scripts." },
        { id: 4, title: "Audit Exposed Dev Gateway Policies", project: "SaaS Platform", assignee: "Jane Doe", priority: "Medium", status: "To Do", startDate: "2026-06-15", dueDate: "2026-06-22", description: "Review CORS configurations and exposure points on dev gates." },
        { id: 5, title: "Setup SMTP Mail Server Mock", project: "Mobile App Dev", assignee: "Sarah Connor", priority: "Low", status: "To Do", startDate: "2026-06-15", dueDate: "2026-06-29", description: "Verify mailbox dispatch relays and mock mail testing tools." },

        // In Progress (5)
        { id: 6, title: "Optimize Redis Cache Sync", project: "Mobile App Dev", assignee: "Mike Kowalski", priority: "Critical", status: "In Progress", startDate: "2026-06-08", dueDate: "2026-06-14", description: "Debug cache latency sync during multiple parallel requests." }, // Overdue!
        { id: 7, title: "Compress Image Assets for CDN", project: "SEO Strategy", assignee: "Sarah Connor", priority: "Low", status: "In Progress", startDate: "2026-06-11", dueDate: "2026-06-17", description: "Lossless compression of dashboard banners, site headers, and system icons." },
        { id: 8, title: "Implement JWT Authorization middleware", project: "SaaS Platform", assignee: "Jane Doe", priority: "High", status: "In Progress", startDate: "2026-06-10", dueDate: "2026-06-18", description: "Secure headers and check token integrity routes." },
        { id: 9, title: "Design Mobile Home Grid Layout", project: "Mobile App Dev", assignee: "Sarah Connor", priority: "Medium", status: "In Progress", startDate: "2026-06-12", dueDate: "2026-06-19", description: "Create flexible responsive grids for mobile dashboards." },
        { id: 10, title: "Draft Keyword Ranking Report", project: "SEO Strategy", assignee: "Alex Mercer", priority: "Low", status: "In Progress", startDate: "2026-06-14", dueDate: "2026-06-18", description: "Compare organic SEO ranking stats against competitor sites." },

        // Review (3)
        { id: 11, title: "Setup CORS policies for Dev Gateway", project: "SaaS Platform", assignee: "Jane Doe", priority: "Medium", status: "Review", startDate: "2026-06-10", dueDate: "2026-06-14", description: "Audit access origin headers, token requests, and exposed endpoints." }, // Overdue!
        { id: 12, title: "Design API Response Handler models", project: "SaaS Platform", assignee: "Mike Kowalski", priority: "High", status: "Review", startDate: "2026-06-12", dueDate: "2026-06-16", description: "Create structured wrapper patterns and standard error logs." },
        { id: 13, title: "Verify App Store Deploy assets", project: "Mobile App Dev", assignee: "Sarah Connor", priority: "Low", status: "Review", startDate: "2026-06-14", dueDate: "2026-06-17", description: "Check sizes of screenshots, description labels, and privacy policies." },

        // Completed (5)
        { id: 14, title: "Review Auth Controller Unit Tests", project: "Mobile App Dev", assignee: "Sarah Connor", priority: "Low", status: "Completed", startDate: "2026-06-05", dueDate: "2026-06-12", description: "Verify cookie configurations and JWT token checking." },
        { id: 15, title: "Fix Database Migration Queries", project: "SaaS Platform", assignee: "Mike Kowalski", priority: "High", status: "Completed", startDate: "2026-06-02", dueDate: "2026-06-11", description: "Modify schema configurations to support workspace user roles." },
        { id: 16, title: "Research organic search competitors", project: "SEO Strategy", assignee: "Alex Mercer", priority: "Low", status: "Completed", startDate: "2026-06-01", dueDate: "2026-06-10", description: "Analyze organic keyword profiles." },
        { id: 17, title: "Setup Docker Dev Environment configs", project: "SaaS Platform", assignee: "Mike Kowalski", priority: "High", status: "Completed", startDate: "2026-06-01", dueDate: "2026-06-08", description: "Configure multi-container settings." },
        { id: 18, title: "Draft privacy policy consent banner", project: "SEO Strategy", assignee: "Jane Doe", priority: "Medium", status: "Completed", startDate: "2026-06-10", dueDate: "2026-06-14", description: "Verify terms and cookie consent banners." }
    ];

    const currentMockDate = "2026-06-15"; // Base mock date to calculate overdue/deadline parameters

    // ==========================================
    // DOM SELECTORS
    // ==========================================
    // Responsive Sidebar toggling
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const navDashboard = document.getElementById('nav-dashboard');
    const logoDashboardLink = document.getElementById('logo-dashboard-link');
    const logoutLink = document.getElementById('logout-link');

    // Kanban Board lanes
    const columnDecks = {
        "To Do": document.getElementById('deck-todo'),
        "In Progress": document.getElementById('deck-inprogress'),
        "Review": document.getElementById('deck-review'),
        "Completed": document.getElementById('deck-completed')
    };

    const columnCounts = {
        "To Do": document.getElementById('count-todo'),
        "In Progress": document.getElementById('count-inprogress'),
        "Review": document.getElementById('count-review'),
        "Completed": document.getElementById('count-completed')
    };

    // Filters & Search
    const boardSearchInput = document.getElementById('board-search-input');
    const boardFilterProject = document.getElementById('board-filter-project');
    const boardFilterPriority = document.getElementById('board-filter-priority');
    const globalSearchInput = document.getElementById('global-search-input');

    // Modals
    const modalCreateTask = document.getElementById('modal-create-task');
    const modalViewTask = document.getElementById('modal-view-task');
    const modalAssignUser = document.getElementById('modal-assign-user');
    const modalMoveTask = document.getElementById('modal-move-task');

    // Forms
    const formCreateTask = document.getElementById('form-create-task');
    const formAssignUser = document.getElementById('form-assign-user');
    const formMoveTask = document.getElementById('form-move-task');

    // Trigger buttons
    const btnTriggerCreateTask = document.getElementById('btn-trigger-create-task');
    const btnTriggerAssignUser = document.getElementById('btn-trigger-assign-user');
    const btnTriggerMoveTask = document.getElementById('btn-trigger-move-task');

    // Stats variables
    const statTotalTasks = document.getElementById('stat-total-tasks');
    const statCompletedTasks = document.getElementById('stat-completed-tasks');
    const statInprogressTasks = document.getElementById('stat-inprogress-tasks');
    const statOverdueTasks = document.getElementById('stat-overdue-tasks');

    const avatarInitialsDisplay = document.getElementById('avatar-initials');

    // ==========================================
    // INITIALIZATION & SESSION
    // ==========================================
    function init() {
        loadSessionUser();
        renderBoard();
        setupEventListeners();
        setupDragAndDrop();
    }

    function loadSessionUser() {
        const loggedInEmail = localStorage.getItem('taskmaster_user_email') || 
                              sessionStorage.getItem('taskmaster_user_email');
        if (loggedInEmail) {
            const prefix = loggedInEmail.split('@')[0];
            const formattedName = prefix.split('.').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
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
    function renderBoard() {
        // Clear all columns
        Object.keys(columnDecks).forEach(status => {
            columnDecks[status].innerHTML = '';
        });

        const filterProj = boardFilterProject.value;
        const filterPri = boardFilterPriority.value;
        const searchVal = boardSearchInput.value.toLowerCase().trim();
        const globalSearchVal = globalSearchInput.value.toLowerCase().trim();

        // Filter tasks
        const filteredTasks = tasks.filter(task => {
            const matchesProj = (filterProj === "All" || task.project === filterProj);
            const matchesPri = (filterPri === "All" || task.priority === filterPri);
            const matchesSearch = (searchVal === "" || task.title.toLowerCase().includes(searchVal));
            const matchesGlobalSearch = (globalSearchVal === "" || task.title.toLowerCase().includes(globalSearchVal));

            return matchesProj && matchesPri && matchesSearch && matchesGlobalSearch;
        });

        // Track lane item counts
        const counts = { "To Do": 0, "In Progress": 0, "Review": 0, "Completed": 0 };

        // Append task cards to correct lane
        filteredTasks.forEach(task => {
            if (columnDecks[task.status]) {
                const cardHtml = createTaskCardElement(task);
                columnDecks[task.status].innerHTML += cardHtml;
                counts[task.status]++;
            }
        });

        // Set header counts
        Object.keys(columnCounts).forEach(status => {
            columnCounts[status].textContent = counts[status];
        });

        // Setup drag listeners for newly created elements
        attachCardDragListeners();
        calculateAndSetStats();
        populateModalDropdowns();
    }

    function createTaskCardElement(task) {
        let isOverdue = task.status !== "Completed" && task.dueDate < currentMockDate;
        let dateClass = isOverdue ? "card-date-info overdue" : "card-date-info";
        let dateIconColor = isOverdue ? "var(--priority-high-color)" : "currentColor";
        let formattedDate = formatDateString(task.dueDate);

        return `
            <div class="task-card" draggable="true" data-id="${task.id}" id="card-${task.id}">
                <div class="card-header-meta">
                    <span class="card-id">TMP-${task.id}</span>
                    <span class="badge priority-${task.priority.toLowerCase()}">${task.priority}</span>
                </div>
                <h4 onclick="viewTask(${task.id})">${task.title}</h4>
                <p>${task.description || 'No description provided.'}</p>
                <div class="card-footer">
                    <div class="card-assignee">
                        <span class="user-avatar-small">${task.assignee.substring(0,2)}</span>
                        <span class="assignee-name">${task.assignee}</span>
                    </div>
                    <div class="${dateClass}">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${dateIconColor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                        <span>${formattedDate}</span>
                    </div>
                </div>
            </div>
        `;
    }

    function calculateAndSetStats() {
        if (statTotalTasks) statTotalTasks.textContent = tasks.length;
        
        const completed = tasks.filter(t => t.status === "Completed").length;
        if (statCompletedTasks) statCompletedTasks.textContent = completed;

        const inProgress = tasks.filter(t => t.status === "In Progress").length;
        if (statInprogressTasks) statInprogressTasks.textContent = inProgress;

        const overdue = tasks.filter(t => t.status !== "Completed" && t.dueDate < currentMockDate).length;
        if (statOverdueTasks) statOverdueTasks.textContent = overdue;
    }

    // Populate task dropdown menus in the Quick Assignment and Move modals
    function populateModalDropdowns() {
        const assignSelectTask = document.getElementById('assign-select-task');
        if (assignSelectTask) {
            assignSelectTask.innerHTML = tasks.map(t => `
                <option value="${t.id}">TMP-${t.id}: ${t.title}</option>
            `).join('');
        }

        const moveSelectTask = document.getElementById('move-select-task');
        if (moveSelectTask) {
            moveSelectTask.innerHTML = tasks.map(t => `
                <option value="${t.id}">TMP-${t.id}: ${t.title} (${t.status})</option>
            `).join('');
        }
    }

    // ==========================================
    // HTML5 DRAG AND DROP ENGINE
    // ==========================================
    function setupDragAndDrop() {
        const columns = document.querySelectorAll('.kanban-column');
        
        columns.forEach(col => {
            col.addEventListener('dragover', (e) => {
                e.preventDefault(); // Required to allow drop
                col.classList.add('drag-over');
            });

            col.addEventListener('dragenter', (e) => {
                e.preventDefault();
                col.classList.add('drag-over');
            });

            col.addEventListener('dragleave', () => {
                col.classList.remove('drag-over');
            });

            col.addEventListener('drop', (e) => {
                e.preventDefault();
                col.classList.remove('drag-over');
                
                const taskId = parseInt(e.dataTransfer.getData('text/plain'));
                const newStatus = col.getAttribute('data-status');
                
                if (taskId && newStatus) {
                    moveTaskStatus(taskId, newStatus);
                }
            });
        });
    }

    function attachCardDragListeners() {
        const cards = document.querySelectorAll('.task-card');
        
        cards.forEach(card => {
            card.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', card.getAttribute('data-id'));
                // Delay adding dragging class so element remains visible in user's drag preview
                setTimeout(() => card.classList.add('dragging'), 0);
            });

            card.addEventListener('dragend', () => {
                card.classList.remove('dragging');
            });
        });
    }

    function moveTaskStatus(taskId, newStatus) {
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            tasks[taskIndex].status = newStatus;
            renderBoard(); // Redraw lanes
        }
    }

    // ==========================================
    // EVENT LISTENERS & MODALS
    // ==========================================
    function setupEventListeners() {
        // Mobile sidebar drawer
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

        // Filters listeners
        if (boardSearchInput) boardSearchInput.addEventListener('input', renderBoard);
        if (boardFilterProject) boardFilterProject.addEventListener('change', renderBoard);
        if (boardFilterPriority) boardFilterPriority.addEventListener('change', renderBoard);
        if (globalSearchInput) globalSearchInput.addEventListener('input', renderBoard);

        // Open Dialog triggers
        if (btnTriggerCreateTask) {
            btnTriggerCreateTask.addEventListener('click', () => openModal(modalCreateTask));
        }
        if (btnTriggerAssignUser) {
            btnTriggerAssignUser.addEventListener('click', () => openModal(modalAssignUser));
        }
        if (btnTriggerMoveTask) {
            btnTriggerMoveTask.addEventListener('click', () => openModal(modalMoveTask));
        }

        // Close cancel overlay sheets
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

                const newTask = {
                    id: tasks.length + 1,
                    title: title,
                    project: project,
                    assignee: assignee,
                    priority: priority,
                    status: status,
                    startDate: startDate,
                    dueDate: dueDate,
                    description: desc
                };

                tasks.push(newTask);
                renderBoard();
                closeModal(modalCreateTask);
                formCreateTask.reset();
            });
        }

        // Form Submit: Assign User
        if (formAssignUser) {
            formAssignUser.addEventListener('submit', (e) => {
                e.preventDefault();
                const taskId = parseInt(document.getElementById('assign-select-task').value);
                const member = document.getElementById('assign-select-member').value;

                const taskIndex = tasks.findIndex(t => t.id === taskId);
                if (taskIndex !== -1) {
                    tasks[taskIndex].assignee = member;
                    renderBoard();
                }
                closeModal(modalAssignUser);
                formAssignUser.reset();
            });
        }

        // Form Submit: Move Task / Update Status
        if (formMoveTask) {
            formMoveTask.addEventListener('submit', (e) => {
                e.preventDefault();
                const taskId = parseInt(document.getElementById('move-select-task').value);
                const colStatus = document.getElementById('move-select-column').value;

                moveTaskStatus(taskId, colStatus);
                closeModal(modalMoveTask);
                formMoveTask.reset();
            });
        }
    }

    // Window Level Trigger: View details card details modal
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
        document.getElementById('view-task-detail-timeline').textContent = `${formatDateString(task.startDate || '2026-06-15')} - ${formatDateString(task.dueDate)}`;

        document.getElementById('view-task-detail-status').className = `badge status-${statusClass}`;
        document.getElementById('view-task-detail-status').textContent = statusLabel;

        document.getElementById('view-task-detail-priority').className = `badge priority-${task.priority.toLowerCase()}`;
        document.getElementById('view-task-detail-priority').textContent = task.priority;

        openModal(modalViewTask);
    };

    // Modal Helper functions
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

    // Trigger board script
    init();
});
