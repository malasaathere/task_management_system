/**
 * TaskMaster Pro - Profile Management Script
 * Controls dynamic profile loading (Admin, PM, Collaborator) based on active user session,
 * tab switching system, details edits, security password resets, preferences saves,
 * activity history rendering, custom image uploads, and JSON metadata exports.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // MOCK USER PROFILES DATASETS
    // ==========================================
    const profiles = {
        admin: {
            username: "alexmercer",
            firstName: "Alex",
            lastName: "Mercer",
            email: "alex.mercer@taskmaster.com",
            phone: "+1 555-0101",
            role: "Admin",
            department: "Management",
            designation: "Chief Administrator",
            address: "Building 400, Suite 101, Tech District, San Francisco, CA",
            joinDate: "2026-01-15",
            status: "Active",
            assignedTasks: 15,
            completedTasks: 12,
            activeProjects: 5,
            productivityScore: "94%",
            preferences: {
                theme: "Light",
                language: "English",
                timezone: "GMT-8",
                emailNotif: true,
                pushNotif: true,
                smsNotif: false
            },
            activityHistory: [
                { type: "Login", time: "2026-06-15 10:30", title: "Session Authorization", description: "Successfully logged in via Chrome browser on macOS (IP 192.168.1.100)." },
                { type: "Account", time: "2026-06-15 08:15", title: "CORS gate updated", description: "Configured API gateway origin keys to support cross-origin sharing." },
                { type: "Task", time: "2026-06-14 14:20", title: "Task Allocated", description: "Assigned Mike Kowalski to optimize Redis Cache Sync (TMP-4)." },
                { type: "Project", time: "2026-06-12 11:10", title: "New Project Initiated", description: "Launched flagship SaaS Platform development workspace repository." }
            ]
        },
        manager: {
            username: "janedoe",
            firstName: "Jane",
            lastName: "Doe",
            email: "jane.doe@taskmaster.com",
            phone: "+1 555-0107",
            role: "Project Manager",
            department: "Management",
            designation: "Senior Project Manager",
            address: "Block A, Suite 305, Tech Hub, Seattle, WA",
            joinDate: "2026-01-10",
            status: "Active",
            assignedTasks: 22,
            completedTasks: 18,
            activeProjects: 6,
            productivityScore: "90%",
            preferences: {
                theme: "System",
                language: "English",
                timezone: "GMT-8",
                emailNotif: true,
                pushNotif: true,
                smsNotif: true
            },
            activityHistory: [
                { type: "Login", time: "2026-06-15 11:20", title: "Session Authorization", description: "Successfully logged in via Firefox browser on Linux Ubuntu (IP 10.0.0.4)." },
                { type: "Task", time: "2026-06-15 09:30", title: "Status Updated", description: "Moved task 'Configure Webpack Bundlers' (TMP-2) to 'In Progress'." },
                { type: "Project", time: "2026-06-14 15:40", title: "Milestone Milestone Achieved", description: "Completed Phase 1 Wireframes review gate for SaaS Platform." },
                { type: "Task", time: "2026-06-13 13:00", title: "Comment Logged", description: "Left notes on Setup CORS policies for Dev Gateway (TMP-7)." }
            ]
        },
        collaborator: {
            username: "mkowalski",
            firstName: "Mike",
            lastName: "Kowalski",
            email: "mike.kowalski@taskmaster.com",
            phone: "+1 555-0118",
            role: "Collaborator",
            department: "Engineering",
            designation: "Senior Software Engineer",
            address: "Station 4, Dev Floor 2, HQ Annex, Austin, TX",
            joinDate: "2026-01-05",
            status: "Active",
            assignedTasks: 14,
            completedTasks: 10,
            activeProjects: 3,
            productivityScore: "85%",
            preferences: {
                theme: "Dark",
                language: "English",
                timezone: "GMT+5:30",
                emailNotif: true,
                pushNotif: false,
                smsNotif: false
            },
            activityHistory: [
                { type: "Login", time: "2026-06-15 13:40", title: "Session Authorization", description: "Successfully logged in via Chrome on Linux (IP 192.168.1.45)." },
                { type: "Task", time: "2026-06-15 11:15", title: "Task Completed", description: "Marked Fix Database Migration Queries (TMP-6) as Completed." },
                { type: "Task", time: "2026-06-14 16:30", title: "Code Committed", description: "Pushed schema changes to migration_v3.sql." },
                { type: "Account", time: "2026-06-10 14:00", title: "Profile preferences saved", description: "Changed default language selection and timezone coordinates." }
            ]
        }
    };

    // ==========================================
    // ACTIVE PROFILE RESOLUTION
    // ==========================================
    let activeProfile = profiles.collaborator; // default fallback

    function resolveActiveProfile() {
        const loggedInEmail = localStorage.getItem('taskmaster_user_email') || 
                              sessionStorage.getItem('taskmaster_user_email');
        if (loggedInEmail) {
            const emailLower = loggedInEmail.toLowerCase();
            if (emailLower.includes('admin') || emailLower.includes('alex')) {
                activeProfile = profiles.admin;
            } else if (emailLower.includes('manager') || emailLower.includes('jane')) {
                activeProfile = profiles.manager;
            } else {
                activeProfile = profiles.collaborator;
            }
        }
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

    // Top navigation profile display
    const topUserName = document.getElementById('top-user-name');
    const avatarInitialsDisplay = document.getElementById('avatar-initials');

    // Header overview card elements
    const headerProfileAvatar = document.getElementById('header-profile-avatar');
    const headerFullName = document.getElementById('header-full-name');
    const headerStatus = document.getElementById('header-status');
    const headerRole = document.getElementById('header-role');
    const headerDepartment = document.getElementById('header-department');
    const headerEmail = document.getElementById('header-email');
    const headerPhone = document.getElementById('header-phone');
    const headerJoinDate = document.getElementById('header-join-date');

    // Stats cards
    const statAssigned = document.getElementById('stat-assigned-tasks');
    const statCompleted = document.getElementById('stat-completed-tasks');
    const statProjects = document.getElementById('stat-active-projects');
    const statProductivity = document.getElementById('stat-productivity-score');

    // Forms and fields
    const formProfileInfo = document.getElementById('form-profile-info');
    const formProfileSecurity = document.getElementById('form-profile-security');
    const formProfilePreferences = document.getElementById('form-profile-preferences');

    // Tab buttons and panel selections
    const tabBtns = document.querySelectorAll('.tab-select-btn');
    const tabPanels = document.querySelectorAll('.tab-panel-item');

    // Upload & download triggers
    const btnUploadAvatar = document.getElementById('btn-upload-avatar');
    const fileAvatarInput = document.getElementById('file-avatar-input');
    const btnDownloadProfile = document.getElementById('btn-download-profile');

    // Activity timeline list container
    const timelineLog = document.getElementById('activity-history-log');

    // ==========================================
    // DATA RENDERING CONTROLLERS
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
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    function renderProfileData() {
        const initials = getInitials(`${activeProfile.firstName} ${activeProfile.lastName}`);
        
        // Header card overview
        if (headerProfileAvatar) headerProfileAvatar.textContent = initials;
        if (headerFullName) headerFullName.textContent = `${activeProfile.firstName} ${activeProfile.lastName}`;
        if (headerStatus) {
            headerStatus.className = `badge status-${activeProfile.status.toLowerCase()}`;
            headerStatus.textContent = activeProfile.status;
        }
        if (headerRole) headerRole.textContent = activeProfile.role;
        if (headerDepartment) headerDepartment.textContent = activeProfile.department;
        if (headerEmail) headerEmail.textContent = activeProfile.email;
        if (headerPhone) headerPhone.textContent = activeProfile.phone;
        if (headerJoinDate) headerJoinDate.textContent = formatDateString(activeProfile.joinDate);

        // Top Navigation display
        if (topUserName) topUserName.textContent = `${activeProfile.firstName} ${activeProfile.lastName}`;
        if (avatarInitialsDisplay) avatarInitialsDisplay.textContent = initials;

        // Statistics widgets cards
        if (statAssigned) statAssigned.textContent = activeProfile.assignedTasks;
        if (statCompleted) statCompleted.textContent = activeProfile.completedTasks;
        if (statProjects) statProjects.textContent = activeProfile.activeProjects;
        if (statProductivity) statProductivity.textContent = activeProfile.productivityScore;

        // TAB 1 Form: Profile details fields
        document.getElementById('profile-first-name').value = activeProfile.firstName;
        document.getElementById('profile-last-name').value = activeProfile.lastName;
        document.getElementById('profile-email').value = activeProfile.email;
        document.getElementById('profile-phone').value = activeProfile.phone;
        document.getElementById('profile-department').value = activeProfile.department;
        document.getElementById('profile-designation').value = activeProfile.designation;
        document.getElementById('profile-address').value = activeProfile.address;

        // TAB 3 Form: Preferences
        document.getElementById('pref-theme').value = activeProfile.preferences.theme;
        document.getElementById('pref-language').value = activeProfile.preferences.language;
        document.getElementById('pref-timezone').value = activeProfile.preferences.timezone;
        document.getElementById('pref-notif-email').checked = activeProfile.preferences.emailNotif;
        document.getElementById('pref-notif-push').checked = activeProfile.preferences.pushNotif;
        document.getElementById('pref-notif-sms').checked = activeProfile.preferences.smsNotif;

        // TAB 4: Activity Log timeline
        renderTimeline();
    }

    function renderTimeline() {
        if (!timelineLog) return;
        timelineLog.innerHTML = activeProfile.activityHistory.map(log => {
            const typeClass = log.type.toLowerCase();
            return `
                <div class="timeline-item ${typeClass}-bullet">
                    <div class="timeline-bullet"></div>
                    <div class="timeline-meta">
                        <span class="timeline-badge ${typeClass}-type">${log.type}</span>
                        <span>${log.time}</span>
                    </div>
                    <h4 class="timeline-title">${log.title}</h4>
                    <p class="timeline-desc">${log.description}</p>
                </div>
            `;
        }).join('');
    }

    function showToast(message, type = 'success') {
        // reuse standard Toast logic
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
    // ROUTING BINDINGS
    // ==========================================
    function loadSidebarGreeting() {
        const loggedInEmail = localStorage.getItem('taskmaster_user_email') || 
                              sessionStorage.getItem('taskmaster_user_email');
        if (loggedInEmail) {
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
    // EVENT LISTENERS & FORM SUBMISSIONS
    // ==========================================
    function setupEventListeners() {
        // Mobile Navigation Sidebar Drawers
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

        // Logout Link
        if (logoutLink) {
            logoutLink.addEventListener('click', () => {
                localStorage.removeItem('taskmaster_logged_in');
                localStorage.removeItem('taskmaster_user_email');
                sessionStorage.removeItem('taskmaster_logged_in');
                sessionStorage.removeItem('taskmaster_user_email');
            });
        }

        // Tab selection controls toggling
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                tabPanels.forEach(p => p.classList.remove('active'));

                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');
                const panelId = btn.getAttribute('aria-controls');
                const targetPanel = document.getElementById(panelId);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });

        // TAB 1 FORM SUBMIT: Save Profile changes
        if (formProfileInfo) {
            formProfileInfo.addEventListener('submit', (e) => {
                e.preventDefault();

                const firstName = document.getElementById('profile-first-name').value.trim();
                const lastName = document.getElementById('profile-last-name').value.trim();
                const email = document.getElementById('profile-email').value.trim();
                const phone = document.getElementById('profile-phone').value.trim();
                const designation = document.getElementById('profile-designation').value.trim();
                const address = document.getElementById('profile-address').value.trim();

                // Save to state
                activeProfile.firstName = firstName;
                activeProfile.lastName = lastName;
                activeProfile.email = email;
                activeProfile.phone = phone;
                activeProfile.designation = designation;
                activeProfile.address = address;

                // Log activity history
                const timeString = new Date().toISOString().replace('T', ' ').substring(0, 16);
                activeProfile.activityHistory.unshift({
                    type: "Account",
                    time: timeString,
                    title: "Profile Metadata Edited",
                    description: "User details (First Name, Last Name, email, phone coordinates) were modified."
                });

                // Update visual headers
                renderProfileData();
                showToast("Profile information saved successfully!", "success");
            });
        }

        // TAB 2 FORM SUBMIT: Change Passwords
        if (formProfileSecurity) {
            formProfileSecurity.addEventListener('submit', (e) => {
                e.preventDefault();

                const currentPass = document.getElementById('security-current-password').value;
                const newPass = document.getElementById('security-new-password').value;
                const confirmPass = document.getElementById('security-confirm-password').value;

                // Simple check
                if (newPass !== confirmPass) {
                    showToast("Password confirmation mismatch.", "error");
                    return;
                }

                // Log activity
                const timeString = new Date().toISOString().replace('T', ' ').substring(0, 16);
                activeProfile.activityHistory.unshift({
                    type: "Account",
                    time: timeString,
                    title: "Account Password Updated",
                    description: "User security credentials changed successfully from preferences dashboard."
                });

                formProfileSecurity.reset();
                renderTimeline();
                showToast("Account password updated successfully!", "success");
            });
        }

        // TAB 3 FORM SUBMIT: Preferences
        if (formProfilePreferences) {
            formProfilePreferences.addEventListener('submit', (e) => {
                e.preventDefault();

                const theme = document.getElementById('pref-theme').value;
                const language = document.getElementById('pref-language').value;
                const timezone = document.getElementById('pref-timezone').value;
                const emailNotif = document.getElementById('pref-notif-email').checked;
                const pushNotif = document.getElementById('pref-notif-push').checked;
                const smsNotif = document.getElementById('pref-notif-sms').checked;

                // Save
                activeProfile.preferences = {
                    theme,
                    language,
                    timezone,
                    emailNotif,
                    pushNotif,
                    smsNotif
                };

                // Log activity
                const timeString = new Date().toISOString().replace('T', ' ').substring(0, 16);
                activeProfile.activityHistory.unshift({
                    type: "Account",
                    time: timeString,
                    title: "Account Preferences Modified",
                    description: `Theme updated to ${theme}, notifications states updated.`
                });

                renderTimeline();
                showToast("Account preferences saved successfully!", "success");
            });
        }

        // Action Click: Simulated File Input picture uploader
        if (btnUploadAvatar && fileAvatarInput) {
            btnUploadAvatar.addEventListener('click', () => {
                fileAvatarInput.click();
            });

            fileAvatarInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const imgTag = `<img src="${event.target.result}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;" alt="Avatar picture">`;
                        if (headerProfileAvatar) headerProfileAvatar.innerHTML = imgTag;
                        if (avatarInitialsDisplay) avatarInitialsDisplay.innerHTML = imgTag;
                        
                        // Log activity
                        const timeString = new Date().toISOString().replace('T', ' ').substring(0, 16);
                        activeProfile.activityHistory.unshift({
                            type: "Account",
                            time: timeString,
                            title: "Profile Avatar Uploaded",
                            description: "User uploaded a custom image background asset for dashboard displays."
                        });
                        renderTimeline();
                        showToast("Profile picture uploaded successfully!", "success");
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // Action Click: Download profile information JSON
        if (btnDownloadProfile) {
            btnDownloadProfile.addEventListener('click', () => {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeProfile, null, 4));
                const downloadAnchor = document.createElement('a');
                downloadAnchor.setAttribute("href", dataStr);
                downloadAnchor.setAttribute("download", `taskmaster_profile_${activeProfile.username}.json`);
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                document.body.removeChild(downloadAnchor);
                
                showToast("Profile data download initiated.", "success");
            });
        }
    }

    // ==========================================
    // INITIALIZATION RUNNER
    // ==========================================
    resolveActiveProfile();
    loadSidebarGreeting();
    renderProfileData();
    setupEventListeners();
});
