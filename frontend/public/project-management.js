/**
 * TaskMaster Pro - Project Management Script
 * Controls project configurations state, table pagination, combined filtering engine,
 * details side drawer milestones tracker, modal form CRUD operations, CSV exports,
 * and bulk team assignment logic.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // MOCK WORKSPACE PERSONNEL DATA
    // ==========================================
    const workspaceUsers = [
        { name: "Alex Mercer", role: "Admin", dept: "IT & Security", initials: "AM" },
        { name: "Jane Doe", role: "Project Manager", dept: "Operations", initials: "JD" },
        { name: "Sarah Jenkins", role: "Project Manager", dept: "Engineering", initials: "SJ" },
        { name: "David Vance", role: "Project Manager", dept: "Product Development", initials: "DV" },
        { name: "Mike Kowalski", role: "Collaborator", dept: "Engineering", initials: "MK" },
        { name: "Elena Rostova", role: "Collaborator", dept: "Design", initials: "ER" },
        { name: "John Smith", role: "Collaborator", dept: "Engineering", initials: "JS" },
        { name: "Sarah Connor", role: "Collaborator", dept: "QA & Testing", initials: "SC" },
        { name: "Bruce Wayne", role: "Collaborator", dept: "Security", initials: "BW" },
        { name: "Clark Kent", role: "Collaborator", dept: "Public Relations", initials: "CK" },
        { name: "Peter Parker", role: "Collaborator", dept: "Operations", initials: "PP" },
        { name: "Tony Stark", role: "Collaborator", dept: "Research & Development", initials: "TS" }
    ];

    // ==========================================
    // DEFAULT SYSTEM PROJECT DATABASE
    // ==========================================
    const defaultProjects = [
        // 10 Active Projects
        {
            id: "PRJ-001",
            name: "Cloud Infrastructure Migration",
            description: "Migrating legacy physical servers and data networks over to secure, high-uptime AWS/Azure multi-region virtual environments.",
            manager: "Jane Doe",
            team: ["Mike Kowalski", "Sarah Connor", "Bruce Wayne", "Tony Stark"],
            startDate: "2026-03-01",
            dueDate: "2026-08-30",
            progress: 65,
            status: "Active",
            priority: "High",
            budget: 85000,
            tasks: { total: 45, completed: 29, pending: 16 },
            milestones: [
                { title: "Network Architecture Approval", date: "2026-03-15", status: "completed" },
                { title: "Stage 1 Server Data Replication", date: "2026-05-10", status: "completed" },
                { title: "Application Cluster Migration", date: "2026-07-20", status: "active" },
                { title: "Multi-Region Failover Live Test", date: "2026-08-15", status: "pending" }
            ]
        },
        {
            id: "PRJ-002",
            name: "Mobile App Redesign v2",
            description: "Redesigning the consumer mobile banking UI/UX layouts to support modern dark theme overlays and simplified quick transfer pipelines.",
            manager: "Alex Mercer",
            team: ["Elena Rostova", "Peter Parker", "Tony Stark"],
            startDate: "2026-04-10",
            dueDate: "2026-09-15",
            progress: 42,
            status: "Active",
            priority: "Medium",
            budget: 62000,
            tasks: { total: 38, completed: 16, pending: 22 },
            milestones: [
                { title: "High-Fidelity Wireframes Signed", date: "2026-05-02", status: "completed" },
                { title: "React Native Core Shell Built", date: "2026-06-25", status: "active" },
                { title: "Payment Gateways API Hook", date: "2026-08-10", status: "pending" },
                { title: "App Store & Google Play Beta Release", date: "2026-09-01", status: "pending" }
            ]
        },
        {
            id: "PRJ-003",
            name: "Enterprise ERP Upgrade",
            description: "Upgrading the core financial ledger and supply chain logistics ERP systems to enhance tracking and resource estimation metrics.",
            manager: "Sarah Jenkins",
            team: ["John Smith", "David Vance", "Mike Kowalski"],
            startDate: "2026-02-15",
            dueDate: "2026-10-30",
            progress: 58,
            status: "Active",
            priority: "Critical",
            budget: 145000,
            tasks: { total: 80, completed: 46, pending: 34 },
            milestones: [
                { title: "Vendor Requirements Alignment", date: "2026-03-01", status: "completed" },
                { title: "Database Schema Expansion", date: "2026-05-18", status: "completed" },
                { title: "Ledger Module Configuration", date: "2026-08-01", status: "active" },
                { title: "Staff Trial Run & Validation", date: "2026-10-10", status: "pending" }
            ]
        },
        {
            id: "PRJ-004",
            name: "Customer Portal Implementation",
            description: "Deploying a client portal containing billing records, project timelines, ticket tracking, and secure chat modules.",
            manager: "David Vance",
            team: ["John Smith", "Elena Rostova", "Sarah Connor"],
            startDate: "2026-05-01",
            dueDate: "2026-09-30",
            progress: 30,
            status: "Active",
            priority: "Medium",
            budget: 45000,
            tasks: { total: 24, completed: 7, pending: 17 },
            milestones: [
                { title: "UI Mockups Approval", date: "2026-05-20", status: "completed" },
                { title: "SSO and Auth Integrations", date: "2026-07-10", status: "active" },
                { title: "Customer Dashboard Assembly", date: "2026-08-25", status: "pending" },
                { title: "Client Account Migration", date: "2026-09-20", status: "pending" }
            ]
        },
        {
            id: "PRJ-005",
            name: "SSO Integration Security Policy",
            description: "Enforcing single sign-on authentication across all local and cloud applications utilizing Okta SAML protocols.",
            manager: "Alex Mercer",
            team: ["Bruce Wayne", "Clark Kent", "Mike Kowalski"],
            startDate: "2026-05-15",
            dueDate: "2026-08-20",
            progress: 50,
            status: "Active",
            priority: "High",
            budget: 35000,
            tasks: { total: 18, completed: 9, pending: 9 },
            milestones: [
                { title: "Application Audit Complete", date: "2026-06-01", status: "completed" },
                { title: "Identity Provider Setup", date: "2026-07-05", status: "completed" },
                { title: "Group Sync Configurations", date: "2026-07-30", status: "active" },
                { title: "Global Enforcement Cutover", date: "2026-08-15", status: "pending" }
            ]
        },
        {
            id: "PRJ-006",
            name: "Data Warehouse Migration",
            description: "Migrating scattered regional databases to a centralized Snowflake warehouse to speed up reporting runs.",
            manager: "Sarah Jenkins",
            team: ["Tony Stark", "Mike Kowalski", "John Smith"],
            startDate: "2026-04-01",
            dueDate: "2026-09-25",
            progress: 40,
            status: "Active",
            priority: "High",
            budget: 95000,
            tasks: { total: 52, completed: 21, pending: 31 },
            milestones: [
                { title: "Snowflake Instance Launch", date: "2026-04-20", status: "completed" },
                { title: "ETL Pipeline Orchestration", date: "2026-06-15", status: "completed" },
                { title: "Historical Data Ingestion", date: "2026-08-01", status: "active" },
                { title: "Production Analytics Redirect", date: "2026-09-10", status: "pending" }
            ]
        },
        {
            id: "PRJ-007",
            name: "CRM Integration Pipeline",
            description: "Hooking up active lead management forms to the Salesforce database systems via standard server webhooks.",
            manager: "David Vance",
            team: ["Clark Kent", "Elena Rostova"],
            startDate: "2026-05-10",
            dueDate: "2026-08-15",
            progress: 20,
            status: "Active",
            priority: "Low",
            budget: 18000,
            tasks: { total: 12, completed: 2, pending: 10 },
            milestones: [
                { title: "API Endpoint Specs Defined", date: "2026-05-28", status: "completed" },
                { title: "Webhook Parser Middleware", date: "2026-07-15", status: "active" },
                { title: "Campaign Mappings Config", date: "2026-08-01", status: "pending" }
            ]
        },
        {
            id: "PRJ-008",
            name: "API Gateway Refactoring",
            description: "Restructuring the microservice API gateways to reduce transit latency and setup automated API caching rules.",
            manager: "Jane Doe",
            team: ["Tony Stark", "Mike Kowalski"],
            startDate: "2026-03-20",
            dueDate: "2026-08-10",
            progress: 72,
            status: "Active",
            priority: "High",
            budget: 40000,
            tasks: { total: 30, completed: 22, pending: 8 },
            milestones: [
                { title: "Gateway Router Refactored", date: "2026-04-18", status: "completed" },
                { title: "Redis Cache Clusters Setup", date: "2026-06-02", status: "completed" },
                { title: "Load Balancing Rules Configuration", date: "2026-07-12", status: "completed" },
                { title: "Benchmark Performance Run", date: "2026-08-01", status: "active" }
            ]
        },
        {
            id: "PRJ-009",
            name: "Automated Testing Suite Setup",
            description: "Setting up automated end-to-end Cypress UI testing suites inside the continuous deployment repository gates.",
            manager: "Sarah Jenkins",
            team: ["Sarah Connor", "John Smith", "Peter Parker"],
            startDate: "2026-04-20",
            dueDate: "2026-09-10",
            progress: 35,
            status: "Active",
            priority: "Medium",
            budget: 28000,
            tasks: { total: 26, completed: 9, pending: 17 },
            milestones: [
                { title: "Testing Architecture Guidelines", date: "2026-05-12", status: "completed" },
                { title: "Core E2E User Flows Built", date: "2026-06-30", status: "completed" },
                { title: "CI Pipeline Integration Tests", date: "2026-08-10", status: "active" },
                { title: "Flaky Test Resolvers", date: "2026-09-01", status: "pending" }
            ]
        },
        {
            id: "PRJ-010",
            name: "E-commerce Payment Gateway Integration",
            description: "Integrating Stripe payment modules inside checkout lanes to process secure global transactions.",
            manager: "Jane Doe",
            team: ["John Smith", "Elena Rostova", "Tony Stark"],
            startDate: "2026-05-01",
            dueDate: "2026-08-25",
            progress: 15,
            status: "Active",
            priority: "Critical",
            budget: 32000,
            tasks: { total: 20, completed: 3, pending: 17 },
            milestones: [
                { title: "Stripe Sandbox Credentials Config", date: "2026-05-20", status: "completed" },
                { title: "Checkout Redirection Interface", date: "2026-07-18", status: "active" },
                { title: "Webhooks Ledger Updates", date: "2026-08-10", status: "pending" }
            ]
        },
        // 5 Completed Projects
        {
            id: "PRJ-011",
            name: "Legacy Core Network Decommission",
            description: "Removing physical rack systems and routers in regional warehouses after migrations to centralized hubs.",
            manager: "Alex Mercer",
            team: ["Bruce Wayne", "John Smith"],
            startDate: "2025-11-01",
            dueDate: "2026-02-28",
            progress: 100,
            status: "Completed",
            priority: "Medium",
            budget: 20000,
            tasks: { total: 15, completed: 15, pending: 0 },
            milestones: [
                { title: "Device Porting Mapping Complete", date: "2025-11-20", status: "completed" },
                { title: "Central Warehouses Migration", date: "2026-01-15", status: "completed" },
                { title: "Physical Equipment Recycling", date: "2026-02-25", status: "completed" }
            ]
        },
        {
            id: "PRJ-012",
            name: "GDPR Compliance Audit 2025",
            description: "Aligning user profile retention schemas with privacy regulations, configuring cookie opt-ins, and auditing databases.",
            manager: "Jane Doe",
            team: ["Clark Kent", "Bruce Wayne"],
            startDate: "2025-09-01",
            dueDate: "2025-12-15",
            progress: 100,
            status: "Completed",
            priority: "High",
            budget: 50000,
            tasks: { total: 25, completed: 25, pending: 0 },
            milestones: [
                { title: "Auditing Existing Datastores", date: "2025-09-30", status: "completed" },
                { title: "User Right-to-Forget API", date: "2025-11-10", status: "completed" },
                { title: "External Data Privacy Shield Review", date: "2025-12-05", status: "completed" }
            ]
        },
        {
            id: "PRJ-013",
            name: "Website Performance Optimization",
            description: "Refactoring layout scripts, optimizing graphics, and settings CDN points to load home pages under 1.2s globally.",
            manager: "David Vance",
            team: ["Elena Rostova", "Peter Parker"],
            startDate: "2026-01-05",
            dueDate: "2026-03-30",
            progress: 100,
            status: "Completed",
            priority: "Medium",
            budget: 15000,
            tasks: { total: 14, completed: 14, pending: 0 },
            milestones: [
                { title: "Web Performance Profiling Complete", date: "2026-01-20", status: "completed" },
                { title: "Asset Optimizations Pipeline", date: "2026-02-18", status: "completed" },
                { title: "CDN Cloudflare Edge Verification", date: "2026-03-25", status: "completed" }
            ]
        },
        {
            id: "PRJ-014",
            name: "Disaster Recovery Simulation",
            description: "Simulating severe outages on staging databases to verify recovery logs and automated backups configurations.",
            manager: "Alex Mercer",
            team: ["Bruce Wayne", "Mike Kowalski"],
            startDate: "2026-01-10",
            dueDate: "2026-02-20",
            progress: 100,
            status: "Completed",
            priority: "High",
            budget: 25000,
            tasks: { total: 10, completed: 10, pending: 0 },
            milestones: [
                { title: "DR Scenario Outline Defined", date: "2026-01-15", status: "completed" },
                { title: "Live Simulation Run", date: "2026-02-05", status: "completed" },
                { title: "RTO / RPO Metrics Audit Report", date: "2026-02-15", status: "completed" }
            ]
        },
        {
            id: "PRJ-015",
            name: "Team Collaboration Slack Setup",
            description: "Configuring channels, mapping workspaces permissions, and creating automated status report reminders.",
            manager: "Jane Doe",
            team: ["Elena Rostova", "Sarah Connor", "Clark Kent"],
            startDate: "2025-10-01",
            dueDate: "2025-11-15",
            progress: 100,
            status: "Completed",
            priority: "Low",
            budget: 8000,
            tasks: { total: 8, completed: 8, pending: 0 },
            milestones: [
                { title: "Channel Framework Layout Approved", date: "2025-10-08", status: "completed" },
                { title: "Jira Integration Setup", date: "2025-10-25", status: "completed" },
                { title: "All Staff Onboarding Run", date: "2025-11-10", status: "completed" }
            ]
        },
        // 3 Delayed Projects
        {
            id: "PRJ-016",
            name: "Analytics Dashboards Module",
            description: "Creating customizable business reports and visual analytics charts utilizing D3.js and responsive tables.",
            manager: "David Vance",
            team: ["Elena Rostova", "Tony Stark"],
            startDate: "2026-02-01",
            dueDate: "2026-06-01", // Due date is in the past!
            progress: 82,
            status: "Active", // Status is Active, but since it is past due, we will mark it delayed in stats
            priority: "High",
            budget: 55000,
            tasks: { total: 40, completed: 33, pending: 7 },
            milestones: [
                { title: "Charting Data Feed Hooked", date: "2026-02-28", status: "completed" },
                { title: "Drag & Drop Dashboard Config", date: "2026-04-10", status: "completed" },
                { title: "PDF Report Builder Setup", date: "2026-05-15", status: "active" },
                { title: "Telemetry Validation Run", date: "2026-05-28", status: "pending" }
            ]
        },
        {
            id: "PRJ-017",
            name: "HR Payroll Automation Integration",
            description: "Integrating payroll platforms with employee databases to automatically adjust benefits and monthly schedules.",
            manager: "Sarah Jenkins",
            team: ["Peter Parker", "Sarah Connor"],
            startDate: "2026-01-15",
            dueDate: "2026-05-15", // Due date in the past!
            progress: 75,
            status: "On Hold", // Stalled and past due
            priority: "High",
            budget: 60000,
            tasks: { total: 32, completed: 24, pending: 8 },
            milestones: [
                { title: "Payroll API Specifications Approved", date: "2026-02-10", status: "completed" },
                { title: "Database Connector Built", date: "2026-03-25", status: "completed" },
                { title: "Mock Ledger Integrations Tests", date: "2026-04-30", status: "active" }
            ]
        },
        {
            id: "PRJ-018",
            name: "Inventory Tracking System RFID",
            description: "Designing RFID catalog reader APIs to synchronize stock inventory across multiple delivery locations.",
            manager: "Jane Doe",
            team: ["Mike Kowalski", "Bruce Wayne"],
            startDate: "2026-01-20",
            dueDate: "2026-05-30", // Due date in the past!
            progress: 60,
            status: "Active",
            priority: "Medium",
            budget: 70000,
            tasks: { total: 28, completed: 17, pending: 11 },
            milestones: [
                { title: "RFID Hardware Test Run Completed", date: "2026-02-18", status: "completed" },
                { title: "Stock Ledger Sync Controller", date: "2026-03-30", status: "completed" },
                { title: "API Gateway Routes Setup", date: "2026-05-15", status: "active" }
            ]
        }
    ];

    // ==========================================
    // STATE STORAGE INITIALIZATION
    // ==========================================
    let projects = [];
    const storedDb = localStorage.getItem('taskmaster_projects_db');
    if (storedDb) {
        try {
            projects = JSON.parse(storedDb);
        } catch (err) {
            console.error("Error parsing projects database, restoring defaults", err);
            projects = [ ...defaultProjects ];
            saveDb();
        }
    } else {
        projects = [ ...defaultProjects ];
        saveDb();
    }

    function saveDb() {
        localStorage.setItem('taskmaster_projects_db', JSON.stringify(projects));
    }

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
    const topUserName = document.getElementById('top-user-name');

    // Stats Selectors
    const statTotalProjects = document.getElementById('stat-total-projects');
    const statActiveProjects = document.getElementById('stat-active-projects');
    const statCompletedProjects = document.getElementById('stat-completed-projects');
    const statDelayedProjects = document.getElementById('stat-delayed-projects');
    const statUpcomingDeadlines = document.getElementById('stat-upcoming-deadlines');
    const statTeamMembers = document.getElementById('stat-team-members');

    // Filter selectors
    const projectSearchInput = document.getElementById('project-search-input');
    const filterStatus = document.getElementById('filter-status');
    const filterManager = document.getElementById('filter-manager');
    const filterPriority = document.getElementById('filter-priority');
    const filterStartDate = document.getElementById('filter-start-date');
    const filterEndDate = document.getElementById('filter-end-date');
    const btnClearFilters = document.getElementById('btn-clear-filters');

    // Toolbar selectors
    const btnExportProjects = document.getElementById('btn-export-projects');
    const btnReportProjects = document.getElementById('btn-report-projects');
    const btnAssignTeamBulk = document.getElementById('btn-assign-team-bulk');
    const btnCreateProject = document.getElementById('btn-create-project');

    // Table elements
    const projectsTableBody = document.getElementById('projects-table-body');
    const emptyState = document.getElementById('empty-state');
    const paginationSummary = document.getElementById('pagination-summary');
    const btnPrevPage = document.getElementById('btn-prev-page');
    const btnNextPage = document.getElementById('btn-next-page');
    const pageNumbersContainer = document.getElementById('page-numbers-container');

    // Details Drawer selectors
    const detailsDrawer = document.getElementById('details-drawer');
    const btnCloseDrawer = document.getElementById('btn-close-drawer');
    const drawerProjectId = document.getElementById('drawer-project-id');
    const drawerProjectTitle = document.getElementById('drawer-project-title');
    const drawerProjectStatus = document.getElementById('drawer-project-status');
    const drawerProjectDesc = document.getElementById('drawer-project-desc');
    const drawerProgressFill = document.getElementById('drawer-progress-fill');
    const drawerProgressPercentage = document.getElementById('drawer-progress-percentage');
    const drawerTasksTotal = document.getElementById('drawer-tasks-total');
    const drawerTasksCompleted = document.getElementById('drawer-tasks-completed');
    const drawerTasksPending = document.getElementById('drawer-tasks-pending');
    const drawerProjectManager = document.getElementById('drawer-project-manager');
    const drawerTeamList = document.getElementById('drawer-team-list');
    const drawerTimelineContainer = document.getElementById('drawer-timeline-container');

    // Modal Create/Edit selectors
    const modalProject = document.getElementById('modal-project');
    const btnCloseModalProject = document.getElementById('btn-close-modal-project');
    const btnCancelModalProject = document.getElementById('btn-cancel-modal-project');
    const formProjectManagement = document.getElementById('form-project-management');
    const modalProjectTitle = document.getElementById('modal-project-title');
    
    // Modal fields
    const formProjectIdHidden = document.getElementById('form-project-id-hidden');
    const formProjectName = document.getElementById('form-project-name');
    const formProjectManagerSelect = document.getElementById('form-project-manager');
    const formProjectDesc = document.getElementById('form-project-desc');
    const formProjectPriority = document.getElementById('form-project-priority');
    const formProjectStatus = document.getElementById('form-project-status');
    const formProjectBudget = document.getElementById('form-project-budget');
    const formProjectStart = document.getElementById('form-project-start');
    const formProjectDue = document.getElementById('form-project-due');
    const modalTeamCheckboxGrid = document.getElementById('modal-team-checkbox-grid');

    // Modal Bulk Team selectors
    const modalAssignTeam = document.getElementById('modal-assign-team');
    const btnCloseModalAssign = document.getElementById('btn-close-modal-assign');
    const btnCancelModalAssign = document.getElementById('btn-cancel-modal-assign');
    const formAssignProjectSelect = document.getElementById('form-assign-project-select');
    const modalBulkTeamCheckboxGrid = document.getElementById('modal-bulk-team-checkbox-grid');
    const formAssignTeam = document.getElementById('form-assign-team');

    // Pagination state
    let currentPage = 1;
    const itemsPerPage = 10;
    let filteredProjectsList = [];
    let selectedProjectId = null;

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
            .custom-toast.success { border-left-color: #10B981; }
            .custom-toast.error { border-left-color: #EF4444; }
            .custom-toast.info { border-left-color: #3B82F6; }
        `;
        document.head.appendChild(toastStyle);
    }

    // ==========================================
    // INITIALIZATION & SESSION CONTROL
    // ==========================================
    function init() {
        loadSessionUser();
        setupCheckboxGrids();
        computeStatsMetrics();
        applyFilters();
        setupEventListeners();
    }

    function loadSessionUser() {
        const loggedInEmail = localStorage.getItem('taskmaster_user_email') || 
                              sessionStorage.getItem('taskmaster_user_email');
        if (loggedInEmail) {
            const prefix = loggedInEmail.split('@')[0];
            const formattedName = prefix.split('.').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            
            // initials extraction
            const initials = getInitials(formattedName);
            if (avatarInitialsDisplay) avatarInitialsDisplay.textContent = initials;
            if (topUserName) topUserName.textContent = formattedName;

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

    function setupCheckboxGrids() {
        // Build checkboxes list for team member selection
        if (modalTeamCheckboxGrid) {
            modalTeamCheckboxGrid.innerHTML = workspaceUsers.map(user => {
                return `
                    <label class="team-checkbox-label">
                        <input type="checkbox" name="project-team" value="${user.name}">
                        <span>${user.name}</span>
                    </label>
                `;
            }).join('');
        }

        if (modalBulkTeamCheckboxGrid) {
            modalBulkTeamCheckboxGrid.innerHTML = workspaceUsers.map(user => {
                return `
                    <label class="team-checkbox-label">
                        <input type="checkbox" name="bulk-team" value="${user.name}">
                        <span>${user.name}</span>
                    </label>
                `;
            }).join('');
        }
    }

    // ==========================================
    // STATISTICS METRICS CALCULATION
    // ==========================================
    function computeStatsMetrics() {
        const total = projects.length;
        let active = 0;
        let completed = 0;
        let delayed = 0;
        let upcoming = 0;
        
        const now = new Date();
        // Today threshold
        const todayStr = now.toISOString().split('T')[0];
        
        // Target upcoming milestones (deadlines in next 14 days)
        const fourteenDaysLater = new Date();
        fourteenDaysLater.setDate(now.getDate() + 14);
        const fourteenDaysStr = fourteenDaysLater.toISOString().split('T')[0];

        // Gather unique team members allocated
        const allocatedMembers = new Set();

        projects.forEach(prj => {
            // Team size allocation
            if (prj.team && Array.isArray(prj.team)) {
                prj.team.forEach(t => allocatedMembers.add(t));
            }

            // Status checks
            if (prj.status === "Completed") {
                completed++;
            } else {
                // If not completed, it could be active, planning, or on hold
                if (prj.status === "Active" || prj.status === "Planning") {
                    active++;
                }

                // Check if delayed: status is not Completed and due date is in the past
                if (prj.dueDate && prj.dueDate < todayStr && prj.status !== "Cancelled") {
                    delayed++;
                }
            }

            // Check if upcoming deadline: due date within today and 14 days
            if (prj.dueDate && prj.dueDate >= todayStr && prj.dueDate <= fourteenDaysStr && prj.status !== "Completed" && prj.status !== "Cancelled") {
                upcoming++;
            }
        });

        // Set values in stats widgets
        if (statTotalProjects) statTotalProjects.textContent = total;
        if (statActiveProjects) statActiveProjects.textContent = active;
        if (statCompletedProjects) statCompletedProjects.textContent = completed;
        if (statDelayedProjects) statDelayedProjects.textContent = delayed;
        if (statUpcomingDeadlines) statUpcomingDeadlines.textContent = upcoming;
        if (statTeamMembers) statTeamMembers.textContent = allocatedMembers.size;
    }

    // ==========================================
    // RENDER PROJECTS TABLE DATA
    // ==========================================
    function renderProjectsTable() {
        if (!projectsTableBody) return;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageItems = filteredProjectsList.slice(startIndex, endIndex);

        if (pageItems.length === 0) {
            projectsTableBody.innerHTML = '';
            emptyState.classList.remove('hidden');
            paginationSummary.textContent = "Showing 0 entries";
            btnPrevPage.disabled = true;
            btnNextPage.disabled = true;
            if (pageNumbersContainer) pageNumbersContainer.innerHTML = '';
            return;
        }

        emptyState.classList.add('hidden');
        
        projectsTableBody.innerHTML = pageItems.map(prj => {
            // Render team avatars (limit to 3, show +N badge for remainder)
            const maxVisible = 3;
            const teamList = prj.team || [];
            let avatarsHtml = '';
            
            teamList.slice(0, maxVisible).forEach(name => {
                const initials = getInitials(name);
                avatarsHtml += `<div class="avatar-circle" title="${name}">${initials}</div>`;
            });
            
            if (teamList.length > maxVisible) {
                avatarsHtml += `<div class="avatar-circle more-badge" title="${teamList.length - maxVisible} more">+${teamList.length - maxVisible}</div>`;
            }

            // Budget format
            const budgetFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(prj.budget || 0);

            // Row active highlight classes if selected
            const activeRowClass = prj.id === selectedProjectId ? "active-row" : "";

            return `
                <tr id="row-${prj.id}" class="${activeRowClass}">
                    <td class="project-id-cell font-semibold text-muted">${prj.id}</td>
                    <td class="project-name-cell" onclick="window.ProjectManager.viewProjectDetails('${prj.id}')">${prj.name}</td>
                    <td class="project-manager-cell font-medium">${prj.manager}</td>
                    <td>
                        <div class="team-avatars-list">${avatarsHtml}</div>
                    </td>
                    <td>${formatDate(prj.startDate)}</td>
                    <td>${formatDate(prj.dueDate)}</td>
                    <td>
                        <div class="table-progress-container">
                            <div class="progress-container">
                                <div class="progress-bar" style="width: ${prj.progress}%;"></div>
                            </div>
                            <span class="progress-label">${prj.progress}%</span>
                        </div>
                    </td>
                    <td>
                        <span class="status-badge ${prj.status.toLowerCase().replace(' ', '-')}">${prj.status}</span>
                    </td>
                    <td class="text-right">
                        <div class="table-actions-cell">
                            <button class="action-icon-btn" onclick="window.ProjectManager.viewProjectDetails('${prj.id}')" title="View Details">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
                            </button>
                            <button class="action-icon-btn" onclick="window.ProjectManager.editProject('${prj.id}')" title="Edit Project">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                            </button>
                            <button class="action-icon-btn delete" onclick="window.ProjectManager.deleteProject('${prj.id}')" title="Delete Project">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // Pagination Labels
        const totalFiltered = filteredProjectsList.length;
        const startNum = startIndex + 1;
        const endNum = Math.min(endIndex, totalFiltered);
        if (paginationSummary) {
            paginationSummary.textContent = `Showing ${startNum}-${endNum} of ${totalFiltered} entries`;
        }

        // Pagination buttons state
        btnPrevPage.disabled = currentPage === 1;
        btnNextPage.disabled = endIndex >= totalFiltered;

        // Render page number indicators
        if (pageNumbersContainer) {
            const totalPages = Math.ceil(totalFiltered / itemsPerPage);
            let pagesHtml = '';
            for (let i = 1; i <= totalPages; i++) {
                const activeClass = i === currentPage ? "active" : "";
                pagesHtml += `<button class="page-num-btn ${activeClass}" onclick="window.ProjectManager.changePage(${i})">${i}</button>`;
            }
            pageNumbersContainer.innerHTML = pagesHtml;
        }
    }

    // ==========================================
    // COMBINED FILTERING SYSTEM
    // ==========================================
    function applyFilters() {
        const searchQuery = (projectSearchInput ? projectSearchInput.value : '').toLowerCase().trim();
        const statusVal = filterStatus ? filterStatus.value : 'All';
        const managerVal = filterManager ? filterManager.value : 'All';
        const priorityVal = filterPriority ? filterPriority.value : 'All';
        const startRange = filterStartDate ? filterStartDate.value : '';
        const endRange = filterEndDate ? filterEndDate.value : '';

        filteredProjectsList = projects.filter(prj => {
            // Search text name
            const matchesSearch = prj.name.toLowerCase().includes(searchQuery);
            
            // Status match
            const matchesStatus = statusVal === 'All' || prj.status === statusVal;

            // Manager match
            const matchesManager = managerVal === 'All' || prj.manager === managerVal;

            // Priority match
            const matchesPriority = priorityVal === 'All' || prj.priority === priorityVal;

            // Date range match (on Due Date)
            let matchesDates = true;
            if (startRange) {
                matchesDates = matchesDates && prj.dueDate >= startRange;
            }
            if (endRange) {
                matchesDates = matchesDates && prj.dueDate <= endRange;
            }

            return matchesSearch && matchesStatus && matchesManager && matchesPriority && matchesDates;
        });

        // Sort by ID descending by default so new projects show at top
        filteredProjectsList.sort((a, b) => b.id.localeCompare(a.id));

        currentPage = 1;
        renderProjectsTable();
    }

    function clearAllFilters() {
        if (projectSearchInput) projectSearchInput.value = '';
        if (filterStatus) filterStatus.value = 'All';
        if (filterManager) filterManager.value = 'All';
        if (filterPriority) filterPriority.value = 'All';
        if (filterStartDate) filterStartDate.value = '';
        if (filterEndDate) filterEndDate.value = '';
        
        applyFilters();
        showToast("All filter parameters reset.", "info");
    }

    // ==========================================
    // DETAILS SIDE DRAWER CONTROLS
    // ==========================================
    function viewProjectDetails(id) {
        const prj = projects.find(p => p.id === id);
        if (!prj) return;

        selectedProjectId = id;

        // Toggle row highlight classes in table
        document.querySelectorAll('#projects-table-body tr').forEach(row => {
            row.classList.remove('active-row');
        });
        const activeRow = document.getElementById(`row-${id}`);
        if (activeRow) activeRow.classList.add('active-row');

        // Populate drawer text tags
        if (drawerProjectId) drawerProjectId.textContent = prj.id;
        if (drawerProjectTitle) drawerProjectTitle.textContent = prj.name;
        if (drawerProjectDesc) drawerProjectDesc.textContent = prj.description || 'No overview description provided.';
        if (drawerProjectManager) drawerProjectManager.textContent = prj.manager;

        // Status badge format
        if (drawerProjectStatus) {
            drawerProjectStatus.className = `status-badge ${prj.status.toLowerCase().replace(' ', '-')}`;
            drawerProjectStatus.textContent = prj.status;
        }

        // Progress bar and labels
        if (drawerProgressFill) drawerProgressFill.style.width = `${prj.progress}%`;
        if (drawerProgressPercentage) drawerProgressPercentage.textContent = `${prj.progress}%`;

        // Tasks values
        const totalTasks = prj.tasks ? prj.tasks.total : 0;
        const compTasks = prj.tasks ? prj.tasks.completed : 0;
        const pendTasks = prj.tasks ? prj.tasks.pending : 0;

        if (drawerTasksTotal) drawerTasksTotal.textContent = totalTasks;
        if (drawerTasksCompleted) drawerTasksCompleted.textContent = compTasks;
        if (drawerTasksPending) drawerTasksPending.textContent = pendTasks;

        // Team list avatars
        if (drawerTeamList) {
            drawerTeamList.innerHTML = (prj.team || []).map(name => {
                const initials = getInitials(name);
                return `<div class="avatar-circle" title="${name}">${initials}</div>`;
            }).join('');
        }

        // Timeline milestone tracking rendering
        if (drawerTimelineContainer) {
            const milestonesList = prj.milestones || [];
            if (milestonesList.length === 0) {
                drawerTimelineContainer.innerHTML = '<span class="text-muted" style="font-size:13px; font-style:italic;">No milestones configured for this project.</span>';
            } else {
                drawerTimelineContainer.innerHTML = milestonesList.map(mil => {
                    const statusClass = mil.status === 'completed' ? 'completed' : (mil.status === 'active' ? 'active' : '');
                    return `
                        <div class="milestone-item ${statusClass}">
                            <div class="milestone-dot"></div>
                            <div class="milestone-body">
                                <div class="milestone-title">${mil.title}</div>
                                <div class="milestone-meta">Due Date: ${formatDate(mil.date)} &bull; ${mil.status}</div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }

        // Open details panel
        if (detailsDrawer) detailsDrawer.classList.add('active');
    }

    function closeDetailsDrawer() {
        selectedProjectId = null;
        document.querySelectorAll('#projects-table-body tr').forEach(row => {
            row.classList.remove('active-row');
        });
        if (detailsDrawer) detailsDrawer.classList.remove('active');
    }

    // ==========================================
    // PROJECT CRUD UTILITIES
    // ==========================================
    function openProjectModal(isEditMode = false, prjId = null) {
        // Clear previous entries
        formProjectManagement.reset();
        formProjectIdHidden.value = '';
        
        // Deselect all team checkboxes
        const checkboxes = modalTeamCheckboxGrid.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);

        if (isEditMode && prjId) {
            const prj = projects.find(p => p.id === prjId);
            if (!prj) return;

            modalProjectTitle.textContent = "Edit Project Portfolio";
            formProjectIdHidden.value = prj.id;
            formProjectName.value = prj.name;
            formProjectManagerSelect.value = prj.manager;
            formProjectDesc.value = prj.description || '';
            formProjectPriority.value = prj.priority;
            formProjectStatus.value = prj.status;
            formProjectBudget.value = prj.budget || 0;
            formProjectStart.value = prj.startDate;
            formProjectDue.value = prj.dueDate;

            // Check assigned team members checkboxes
            (prj.team || []).forEach(name => {
                const checkbox = modalTeamCheckboxGrid.querySelector(`input[value="${name}"]`);
                if (checkbox) checkbox.checked = true;
            });
        } else {
            modalProjectTitle.textContent = "Create Project Portfolio";
            // Set default dates
            const today = new Date().toISOString().split('T')[0];
            formProjectStart.value = today;
            
            const dueOffset = new Date();
            dueOffset.setDate(dueOffset.getDate() + 90); // default 90 days out
            formProjectDue.value = dueOffset.toISOString().split('T')[0];
        }

        modalProject.classList.remove('hidden');
    }

    function closeProjectModal() {
        modalProject.classList.add('hidden');
    }

    function handleProjectSubmit(e) {
        e.preventDefault();

        const prjId = formProjectIdHidden.value;
        const name = formProjectName.value.trim();
        const manager = formProjectManagerSelect.value;
        const desc = formProjectDesc.value.trim();
        const priority = formProjectPriority.value;
        const status = formProjectStatus.value;
        const budget = parseFloat(formProjectBudget.value) || 0;
        const start = formProjectStart.value;
        const due = formProjectDue.value;

        // Validation for dates
        if (due < start) {
            showToast("Due date cannot be before the start date.", "error");
            return;
        }

        // Get selected team members
        const selectedTeam = [];
        const checkedBoxes = modalTeamCheckboxGrid.querySelectorAll('input[name="project-team"]:checked');
        checkedBoxes.forEach(cb => selectedTeam.push(cb.value));

        if (selectedTeam.length === 0) {
            showToast("Please assign at least one team member.", "error");
            return;
        }

        if (prjId) {
            // EDIT MODE
            const idx = projects.findIndex(p => p.id === prjId);
            if (idx === -1) return;

            // Maintain previous tasks and milestone parameters if unchanged
            const oldPrj = projects[idx];
            
            // Recompute progress if status shifts to completed
            let progressVal = oldPrj.progress;
            if (status === "Completed") {
                progressVal = 100;
            } else if (status === "Planning") {
                progressVal = 0;
            } else if (oldPrj.status === "Completed" && status !== "Completed") {
                progressVal = 70; // Set to back to standard high
            }

            projects[idx] = {
                ...oldPrj,
                name: name,
                manager: manager,
                description: desc,
                priority: priority,
                status: status,
                budget: budget,
                startDate: start,
                dueDate: due,
                team: selectedTeam,
                progress: progressVal,
                tasks: {
                    total: oldPrj.tasks.total,
                    completed: status === "Completed" ? oldPrj.tasks.total : Math.floor(oldPrj.tasks.total * (progressVal / 100)),
                    pending: status === "Completed" ? 0 : oldPrj.tasks.total - Math.floor(oldPrj.tasks.total * (progressVal / 100))
                }
            };

            showToast("Project portfolio updated successfully!", "success");
            
            // Sync side drawer details if active
            if (selectedProjectId === prjId) {
                viewProjectDetails(prjId);
            }
        } else {
            // CREATE MODE
            // Generate next ID
            const idsList = projects.map(p => parseInt(p.id.split('-')[1]));
            const nextNumericId = Math.max(...idsList) + 1;
            const nextIdStr = `PRJ-${String(nextNumericId).padStart(3, '0')}`;

            // Create initial mock tasks and milestones
            const initialTasks = { total: 10, completed: status === "Completed" ? 10 : 0, pending: status === "Completed" ? 0 : 10 };
            
            let progressVal = 0;
            if (status === "Completed") progressVal = 100;
            else if (status === "Active") progressVal = 10;

            const newProject = {
                id: nextIdStr,
                name: name,
                description: desc,
                manager: manager,
                team: selectedTeam,
                startDate: start,
                dueDate: due,
                progress: progressVal,
                status: status,
                priority: priority,
                budget: budget,
                tasks: initialTasks,
                milestones: [
                    { title: "Project Inception & Requirements", date: start, status: "completed" },
                    { title: "Mid-Term Milestone Review", date: getMidPointDate(start, due), status: "active" },
                    { title: "Final Product Verification", date: due, status: "pending" }
                ]
            };

            projects.unshift(newProject);
            showToast(`Project portfolio ${nextIdStr} created successfully.`, "success");
        }

        saveDb();
        computeStatsMetrics();
        applyFilters();
        closeProjectModal();
    }

    function deleteProject(id) {
        if (confirm(`Are you sure you want to permanently delete project ${id}?`)) {
            const idx = projects.findIndex(p => p.id === id);
            if (idx === -1) return;

            projects.splice(idx, 1);
            saveDb();
            computeStatsMetrics();
            
            // If deleted project is active in side drawer details, close drawer
            if (selectedProjectId === id) {
                closeDetailsDrawer();
            }

            applyFilters();
            showToast(`Project portfolio ${id} was deleted.`, "error");
        }
    }

    // ==========================================
    // BULK TEAM ASSIGNMENT CONTROLS
    // ==========================================
    function openAssignTeamModal() {
        formAssignProjectSelect.innerHTML = '<option value="">Choose project portfolio...</option>' + 
            projects.map(prj => `<option value="${prj.id}">${prj.id} - ${prj.name}</option>`).join('');

        // Clear checkboxes
        const checkboxes = modalBulkTeamCheckboxGrid.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);

        modalAssignTeam.classList.remove('hidden');
    }

    function closeAssignTeamModal() {
        modalAssignTeam.classList.add('hidden');
    }

    function handleAssignTeamSubmit(e) {
        e.preventDefault();

        const prjId = formAssignProjectSelect.value;
        if (!prjId) return;

        // Get selected checkboxes
        const selectedUsers = [];
        const checkedBoxes = modalBulkTeamCheckboxGrid.querySelectorAll('input[name="bulk-team"]:checked');
        checkedBoxes.forEach(cb => selectedUsers.push(cb.value));

        if (selectedUsers.length === 0) {
            showToast("Please check at least one user to assign.", "error");
            return;
        }

        const prj = projects.find(p => p.id === prjId);
        if (prj) {
            // Merge unique users into team list
            const currentTeam = new Set(prj.team || []);
            selectedUsers.forEach(u => currentTeam.add(u));
            prj.team = Array.from(currentTeam);

            saveDb();
            computeStatsMetrics();
            applyFilters();

            // Refresh drawer if viewing
            if (selectedProjectId === prjId) {
                viewProjectDetails(prjId);
            }

            showToast(`Allocated ${selectedUsers.length} users to project ${prjId}.`, "success");
            closeAssignTeamModal();
        }
    }

    // ==========================================
    // EXPORTS & REPORT GENERATOR
    // ==========================================
    function exportProjectsCsv() {
        // Compile projects state to CSV file
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Project ID,Project Name,Manager,Start Date,Due Date,Progress,Status,Priority,Budget,Team Members\n";

        projects.forEach(prj => {
            const teamEscaped = `"${prj.team.join(', ')}"`;
            const nameEscaped = `"${prj.name.replace(/"/g, '""')}"`;
            const rowStr = [
                prj.id,
                nameEscaped,
                prj.manager,
                prj.startDate,
                prj.dueDate,
                `${prj.progress}%`,
                prj.status,
                prj.priority,
                prj.budget,
                teamEscaped
            ].join(',');
            csvContent += rowStr + "\n";
        });

        const encodedUri = encodeURI(csvContent);
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", encodedUri);
        downloadAnchor.setAttribute("download", "taskmaster_projects_database.csv");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        document.body.removeChild(downloadAnchor);

        showToast("Database exported to CSV successfully.", "success");
    }

    function runReportGenerator() {
        showToast("Compiling project telemetry reports...", "info");
        
        // Disable action buttons during simulation
        if (btnReportProjects) btnReportProjects.disabled = true;

        setTimeout(() => {
            if (btnReportProjects) btnReportProjects.disabled = false;
            
            // Compute simple report variables
            const activeCount = projects.filter(p => p.status === 'Active').length;
            const completedCount = projects.filter(p => p.status === 'Completed').length;
            const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
            
            alert(
                `====== TASKMASTER PRO PROJECT REPORT ======\n\n` +
                `Generated At: ${new Date().toLocaleString()}\n` +
                `Total Portfolios Audited: ${projects.length}\n` +
                `Active Pipelines: ${activeCount}\n` +
                `Completed Projects: ${completedCount}\n` +
                `Cumulative Portfolios Budget: $${totalBudget.toLocaleString()}\n` +
                `System Health Status: Online (No anomalies detected)\n\n` +
                `==========================================`
            );
            
            showToast("Report generated successfully!", "success");
        }, 1200);
    }

    // ==========================================
    // UTILITY TIMELINES & DATE RESOLVERS
    // ==========================================
    function getInitials(name) {
        if (!name) return "JD";
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }

    function getMidPointDate(startStr, dueStr) {
        const start = new Date(startStr);
        const due = new Date(dueStr);
        if (isNaN(start.getTime()) || isNaN(due.getTime())) return startStr;

        const mid = new Date(start.getTime() + (due.getTime() - start.getTime()) / 2);
        return mid.toISOString().split('T')[0];
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
    // EVENT LISTENERS & TRIGGERS
    // ==========================================
    function setupEventListeners() {
        // Mobile Sidebar toggler
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

        // Logout Link session clear
        if (logoutLink) {
            logoutLink.addEventListener('click', () => {
                localStorage.removeItem('taskmaster_logged_in');
                localStorage.removeItem('taskmaster_user_email');
                sessionStorage.removeItem('taskmaster_logged_in');
                sessionStorage.removeItem('taskmaster_user_email');
            });
        }

        // Search & Filter listeners
        if (projectSearchInput) projectSearchInput.addEventListener('input', applyFilters);
        if (filterStatus) filterStatus.addEventListener('change', applyFilters);
        if (filterManager) filterManager.addEventListener('change', applyFilters);
        if (filterPriority) filterPriority.addEventListener('change', applyFilters);
        if (filterStartDate) filterStartDate.addEventListener('change', applyFilters);
        if (filterEndDate) filterEndDate.addEventListener('change', applyFilters);
        if (btnClearFilters) btnClearFilters.addEventListener('click', clearAllFilters);

        // Details drawer close
        if (btnCloseDrawer) btnCloseDrawer.addEventListener('click', closeDetailsDrawer);

        // Creation Modal triggers
        if (btnCreateProject) {
            btnCreateProject.addEventListener('click', () => {
                openProjectModal(false);
            });
        }
        if (btnCloseModalProject) btnCloseModalProject.addEventListener('click', closeProjectModal);
        if (btnCancelModalProject) btnCancelModalProject.addEventListener('click', closeProjectModal);
        if (formProjectManagement) formProjectManagement.addEventListener('submit', handleProjectSubmit);

        // Bulk Team Modal triggers
        if (btnAssignTeamBulk) btnAssignTeamBulk.addEventListener('click', openAssignTeamModal);
        if (btnCloseModalAssign) btnCloseModalAssign.addEventListener('click', closeAssignTeamModal);
        if (btnCancelModalAssign) btnCancelModalAssign.addEventListener('click', closeAssignTeamModal);
        if (formAssignTeam) formAssignTeam.addEventListener('submit', handleAssignTeamSubmit);

        // Export and Report triggers
        if (btnExportProjects) btnExportProjects.addEventListener('click', exportProjectsCsv);
        if (btnReportProjects) btnReportProjects.addEventListener('click', runReportGenerator);
    }

    // ==========================================
    // EXPOSE HELPER GLOBALS FOR INLINE TRIGGER
    // ==========================================
    window.ProjectManager = {
        viewProjectDetails: viewProjectDetails,
        editProject: function(id) {
            openProjectModal(true, id);
        },
        deleteProject: deleteProject,
        changePage: function(pageNum) {
            currentPage = pageNum;
            renderProjectsTable();
        },
        setupCheckboxGrids: setupCheckboxGrids
    };

    // Initialize module
    init();
});
