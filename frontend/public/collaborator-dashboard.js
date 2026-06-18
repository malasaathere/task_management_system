/**
 * TaskMaster Pro - Collaborator Dashboard Script
 * Implements rendering of collaborator task list, activity timeline, deadlines, project participations,
 * mobile drawer toggle, and fully interactive modals for Status Updates, Comments, and File Uploads.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // INITIAL DUMMY DATA STATE
    // ==========================================
    let tasks = [
        { id: 1, title: "Design User Login Wireframes", priority: "Medium", status: "In Progress", dueDate: "2026-06-16" },
        { id: 2, title: "Configure Webpack Bundlers", priority: "High", status: "To Do", dueDate: "2026-06-20" },
        { id: 3, title: "Review Auth Controller Unit Tests", priority: "Low", status: "Completed", dueDate: "2026-06-12" },
        { id: 4, title: "Optimize Redis Cache Sync", priority: "High", status: "Overdue", dueDate: "2026-06-10" },
        { id: 5, title: "Draft Deployment Manuals", priority: "Low", status: "To Do", dueDate: "2026-06-25" }
    ];

    let activities = [
        { text: "You commented on <strong>Optimize Redis Cache Sync</strong>: <em>'Investigating Redis key expiration issues...'</em>", time: "2 hours ago", dotColor: "blue" },
        { text: "<strong>Alex Mercer</strong> changed status of <strong>Design User Login Wireframes</strong> to <em>In Progress</em>", time: "5 hours ago", dotColor: "purple" },
        { text: "You uploaded attachment <code>mockups-v1.fig</code> to <strong>SaaS Platform Migration</strong> project", time: "1 day ago", dotColor: "green" },
        { text: "System marked task <strong>Review Auth Controller Unit Tests</strong> as <em>Completed</em>", time: "3 days ago", dotColor: "green" }
    ];

    let deadlines = [
        { title: "Design User Login Wireframes", dueDate: "2026-06-16", daysLeft: 1, criticality: "critical" },
        { title: "Configure Webpack Bundlers", dueDate: "2026-06-20", daysLeft: 5, criticality: "warn" },
        { title: "Draft Deployment Manuals", dueDate: "2026-06-25", daysLeft: 10, criticality: "normal" }
    ];

    let projects = [
        { name: "SaaS Platform Migration", percentage: 88, desc: "Full scale cloud migration of server components, API gateways, database indexes, and user auth directories to AWS servers.", lead: "Alex Mercer" },
        { name: "Mobile App Development", percentage: 45, desc: "Native iOS and Android client development utilizing modern cross-platform mobile frameworks.", lead: "Sarah Connor" },
        { name: "SEO Strategy & Audit", percentage: 15, desc: "Search Engine Optimization audit, keyword research, meta restructuring, and load speed optimization.", lead: "Mike Kowalski" }
    ];

    // ==========================================
    // DOM ELEMENT SELECTORS
    // ==========================================
    // Sidebar drawer responsive tags
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const logoutLink = document.getElementById('logout-link');

    // Rendering containers
    const assignedTasksContainer = document.getElementById('assigned-tasks-list');
    const recentActivityContainer = document.getElementById('recent-activity-timeline');
    const upcomingDeadlinesContainer = document.getElementById('upcoming-deadlines-list');
    const projectParticipationContainer = document.getElementById('project-participation-list');

    // Modal elements
    const modalUpdateStatus = document.getElementById('modal-update-status');
    const modalAddComment = document.getElementById('modal-add-comment');
    const modalUploadFile = document.getElementById('modal-upload-file');
    const modalViewProject = document.getElementById('modal-view-project');

    // Forms
    const formUpdateStatus = document.getElementById('form-update-status');
    const formAddComment = document.getElementById('form-add-comment');

    // Action button triggers
    const btnTriggerUpdateStatus = document.getElementById('action-btn-update-status');
    const btnTriggerAddComment = document.getElementById('action-btn-add-comment');
    const btnTriggerUploadFile = document.getElementById('action-btn-upload-file');
    const btnTriggerViewProject = document.getElementById('action-btn-view-project');

    // File upload elements
    const btnStartUpload = document.getElementById('btn-start-upload');
    const uploadFormContent = document.getElementById('upload-form-content');
    const uploadGeneratingContent = document.getElementById('upload-generating-content');
    const uploadFill = document.getElementById('upload-fill');
    const uploadFooterActions = document.getElementById('upload-footer-actions');

    // Project view elements
    const viewSelectProject = document.getElementById('view-select-project');
    const projectDetailName = document.getElementById('project-detail-name');
    const projectDetailDesc = document.getElementById('project-detail-desc');

    // Statistics card selectors
    const statAssignedTasks = document.getElementById('stat-assigned-tasks');
    const statCompletedTasks = document.getElementById('stat-completed-tasks');
    const statInprogressTasks = document.getElementById('stat-inprogress-tasks');
    const statDueToday = document.getElementById('stat-due-today');
    const statUpcomingDeadlines = document.getElementById('stat-upcoming-deadlines');
    const statNotifications = document.getElementById('stat-notifications');

    // User details tags
    const collaboratorNameDisplay = document.getElementById('collaborator-name');
    const avatarInitialsDisplay = document.getElementById('avatar-initials');

    // ==========================================
    // INITIALIZATION & SESSION
    // ==========================================
    function init() {
        loadSessionUser();
        renderDashboard();
        setupEventListeners();
    }

    function loadSessionUser() {
        const loggedInEmail = localStorage.getItem('taskmaster_user_email') || 
                              sessionStorage.getItem('taskmaster_user_email');
        if (loggedInEmail) {
            const prefix = loggedInEmail.split('@')[0];
            const formattedName = prefix.split('.').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            
            const initialsMatches = formattedName.match(/\b\w/g) || [];
            const initials = ((initialsMatches.shift() || '') + (initialsMatches.pop() || '')).toUpperCase();
            
            if (collaboratorNameDisplay) collaboratorNameDisplay.textContent = formattedName;
            if (avatarInitialsDisplay && initials) avatarInitialsDisplay.textContent = initials;
        }
    }

    // ==========================================
    // RENDERING PIPELINES
    // ==========================================
    function renderDashboard() {
        renderTasks();
        renderActivity();
        renderDeadlines();
        renderProjects();
        calculateAndSetStats();
    }

    function renderTasks() {
        if (!assignedTasksContainer) return;
        assignedTasksContainer.innerHTML = tasks.map(task => `
            <tr>
                <td class="task-title-cell" onclick="triggerTaskStatusChange(${task.id})">${task.title}</td>
                <td><span class="badge priority-${task.priority.toLowerCase()}">${task.priority}</span></td>
                <td><span class="badge status-${task.status.replace(/\s+/g, '').toLowerCase()}">${task.status}</span></td>
                <td style="color: var(--text-secondary); font-weight: 500;">${formatDateString(task.dueDate)}</td>
            </tr>
        `).join('');

        // Populate selects inside update status and comment modals
        const statusSelectTask = document.getElementById('status-select-task');
        if (statusSelectTask) {
            statusSelectTask.innerHTML = tasks.map(t => `
                <option value="${t.id}">${t.title}</option>
            `).join('');
        }

        const commentSelectTask = document.getElementById('comment-select-task');
        if (commentSelectTask) {
            commentSelectTask.innerHTML = tasks.map(t => `
                <option value="${t.id}">${t.title}</option>
            `).join('');
        }
    }

    function renderActivity() {
        if (!recentActivityContainer) return;
        recentActivityContainer.innerHTML = activities.map(act => `
            <div class="timeline-item">
                <div class="timeline-dot ${act.dotColor}"></div>
                <div class="timeline-content">
                    <span class="timeline-text">${act.text}</span>
                    <span class="timeline-time">${act.time}</span>
                </div>
            </div>
        `).join('');
    }

    function renderDeadlines() {
        if (!upcomingDeadlinesContainer) return;
        upcomingDeadlinesContainer.innerHTML = deadlines.map(dl => `
            <div class="deadline-item">
                <div class="deadline-info">
                    <div class="deadline-title">${dl.title}</div>
                    <div class="deadline-date">Due: ${formatDateString(dl.dueDate)}</div>
                </div>
                <span class="deadline-days-left ${dl.criticality}">
                    ${dl.daysLeft} ${dl.daysLeft === 1 ? 'day' : 'days'} left
                </span>
            </div>
        `).join('');
    }

    function renderProjects() {
        if (!projectParticipationContainer) return;
        projectParticipationContainer.innerHTML = projects.map(proj => `
            <div class="project-item">
                <div class="project-info">
                    <span class="project-name">${proj.name}</span>
                    <span class="project-percentage">${proj.percentage}%</span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar purple" style="width: ${proj.percentage}%"></div>
                </div>
            </div>
        `).join('');

        // Populate Project select options in Upload and View modals
        const uploadSelectProject = document.getElementById('upload-select-project');
        if (uploadSelectProject) {
            uploadSelectProject.innerHTML = projects.map(proj => `
                <option value="${proj.name}">${proj.name}</option>
            `).join('');
        }

        const viewSelectProj = document.getElementById('view-select-project');
        if (viewSelectProj) {
            viewSelectProj.innerHTML = projects.map(proj => `
                <option value="${proj.name}">${proj.name}</option>
            `).join('');
        }
    }

    function calculateAndSetStats() {
        // Assigned Tasks count
        if (statAssignedTasks) statAssignedTasks.textContent = tasks.length;
        
        // Completed Tasks count
        const completed = tasks.filter(t => t.status === 'Completed').length;
        if (statCompletedTasks) statCompletedTasks.textContent = completed;

        // Tasks In Progress
        const inProgress = tasks.filter(t => t.status === 'In Progress').length;
        if (statInprogressTasks) statInprogressTasks.textContent = inProgress;

        // Due Today
        const dueToday = deadlines.filter(dl => dl.daysLeft <= 1).length;
        if (statDueToday) statDueToday.textContent = dueToday;

        // Upcoming Deadlines
        if (statUpcomingDeadlines) statUpcomingDeadlines.textContent = deadlines.length;

        // Notifications
        if (statNotifications) statNotifications.textContent = 4 + deadlines.filter(dl => dl.daysLeft <= 1).length;
    }

    // ==========================================
    // EVENTS LISTENERS & DIALOGS
    // ==========================================
    function setupEventListeners() {
        // Collapsible Responsive Side drawer
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

        // Logout clearing states
        if (logoutLink) {
            logoutLink.addEventListener('click', () => {
                localStorage.clear();
                sessionStorage.clear();
            });
        }

        // Open Dialog handlers
        if (btnTriggerUpdateStatus) {
            btnTriggerUpdateStatus.addEventListener('click', () => openModal(modalUpdateStatus));
        }
        if (btnTriggerAddComment) {
            btnTriggerAddComment.addEventListener('click', () => openModal(modalAddComment));
        }
        if (btnTriggerUploadFile) {
            btnTriggerUploadFile.addEventListener('click', () => openModal(modalUploadFile));
        }
        if (btnTriggerViewProject) {
            btnTriggerViewProject.addEventListener('click', () => {
                openModal(modalViewProject);
                // Trigger detail rendering for initially selected project in option list
                triggerProjectDetailChange();
            });
        }

        // Setup closing click overrides
        const modalOverlays = document.querySelectorAll('.modal-overlay');
        modalOverlays.forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) closeModal(overlay);
            });

            const closeBtn = overlay.querySelector('.modal-close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => closeModal(overlay));
            }

            const cancelBtn = overlay.querySelector('.modal-cancel-btn');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => closeModal(overlay));
            }
        });

        // Form Submit: Update Status
        if (formUpdateStatus) {
            formUpdateStatus.addEventListener('submit', (e) => {
                e.preventDefault();
                const taskId = parseInt(document.getElementById('status-select-task').value);
                const newStatus = document.getElementById('status-select-val').value;

                // Find and update task
                const taskIndex = tasks.findIndex(t => t.id === taskId);
                if (taskIndex !== -1) {
                    const oldStatus = tasks[taskIndex].status;
                    tasks[taskIndex].status = newStatus;

                    // Prepend activity log entry
                    activities.unshift({
                        text: `You updated task status of <strong>${tasks[taskIndex].title}</strong> from <em>${oldStatus}</em> to <em>${newStatus}</em>`,
                        time: "Just now",
                        dotColor: newStatus === "Completed" ? "green" : (newStatus === "In Progress" ? "purple" : "blue")
                    });

                    // If completed, check if it was in deadlines and remove/complete it
                    if (newStatus === "Completed") {
                        deadlines = deadlines.filter(dl => dl.title !== tasks[taskIndex].title);
                    }
                }

                renderTasks();
                renderActivity();
                renderDeadlines();
                calculateAndSetStats();
                closeModal(modalUpdateStatus);
                formUpdateStatus.reset();
            });
        }

        // Form Submit: Add Comment
        if (formAddComment) {
            formAddComment.addEventListener('submit', (e) => {
                e.preventDefault();
                const taskId = parseInt(document.getElementById('comment-select-task').value);
                const commentText = document.getElementById('comment-text').value.trim();

                const task = tasks.find(t => t.id === taskId);
                if (task) {
                    activities.unshift({
                        text: `You commented on <strong>${task.title}</strong>: <em>"${commentText}"</em>`,
                        time: "Just now",
                        dotColor: "blue"
                    });
                }

                renderActivity();
                closeModal(modalAddComment);
                formAddComment.reset();
            });
        }

        // Project detail change listener
        if (viewSelectProject) {
            viewSelectProject.addEventListener('change', triggerProjectDetailChange);
        }

        // Upload attachment progress animation trigger
        if (btnStartUpload) {
            btnStartUpload.addEventListener('click', () => {
                const projectScope = document.getElementById('upload-select-project').value;
                const fileInput = document.getElementById('upload-file-input');

                if (!fileInput.files.length) {
                    alert('Please select a file to upload.');
                    return;
                }

                const filename = fileInput.files[0].name;

                // Toggle views inside upload modal
                uploadFormContent.classList.add('hidden');
                uploadFooterActions.classList.add('hidden');
                uploadGeneratingContent.classList.remove('hidden');

                let pct = 0;
                uploadFill.style.width = '0%';

                const interval = setInterval(() => {
                    pct += 20;
                    uploadFill.style.width = `${pct}%`;

                    if (pct >= 100) {
                        clearInterval(interval);
                        setTimeout(() => {
                            // Finish upload and log activity
                            activities.unshift({
                                text: `You uploaded file <code>${filename}</code> to project <strong>${projectScope}</strong>`,
                                time: "Just now",
                                dotColor: "green"
                            });

                            renderActivity();
                            closeModal(modalUploadFile);
                            
                            // Reset state for future uploads
                            setTimeout(resetUploadModal, 300);
                        }, 400);
                    }
                }, 300);
            });
        }
    }

    // Interactive helper: allow clicking task title in the table list to trigger update modal immediately!
    window.triggerTaskStatusChange = function(taskId) {
        const select = document.getElementById('status-select-task');
        if (select) {
            select.value = taskId;
        }
        openModal(modalUpdateStatus);
    };

    // Project view detail updates dynamically
    function triggerProjectDetailChange() {
        const name = viewSelectProject.value;
        const selectedProj = projects.find(p => p.name === name);
        if (selectedProj) {
            projectDetailName.textContent = selectedProj.name;
            projectDetailDesc.innerHTML = `
                ${selectedProj.desc}
                <div style="display: flex; justify-content: space-between; font-size: 13px; margin-top: 16px;">
                    <span><strong>Your Role:</strong> Contributor</span>
                    <span><strong>Lead Manager:</strong> ${selectedProj.lead}</span>
                </div>
            `;
        }
    }

    function openModal(modal) {
        if (modal) modal.classList.add('active');
    }

    function closeModal(modal) {
        if (modal) modal.classList.remove('active');
    }

    function resetUploadModal() {
        uploadGeneratingContent.classList.add('hidden');
        uploadFormContent.classList.remove('hidden');
        uploadFooterActions.classList.remove('hidden');
        uploadFill.style.width = '0%';
        const fileInput = document.getElementById('upload-file-input');
        if (fileInput) fileInput.value = '';
    }

    function formatDateString(dateStr) {
        if (!dateStr) return '';
        const dateObj = new Date(dateStr);
        if (isNaN(dateObj.getTime())) return dateStr;
        return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    init();
});
