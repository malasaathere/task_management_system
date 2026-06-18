/**
 * TaskMaster Pro - System Settings Script
 * Controls system configurations state, tab panels routing, inputs bindings, local storage settings,
 * company logo uploads, accent color color dot selectors, backup simulations, configuration imports/exports,
 * and security status statistics mappings.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // DEFAULT SYSTEM CONFIGURATION STATE
    // ==========================================
    const factoryDefaults = {
        sysName: "TaskMaster Pro",
        companyName: "Acme Corporation",
        timezone: "GMT-8",
        language: "English",
        defaultRole: "Collaborator",
        sessionTimeout: 60,
        lockoutAttempts: 5,
        lockoutDuration: 15,
        pwdMinLength: 8,
        pwdRequireNum: true,
        pwdRequireSym: true,
        notifEmail: true,
        notifPush: true,
        notifReminders: true,
        notifAlerts: true,
        notifAnnouncements: false,
        securityPwdExpiry: "Never",
        security2fa: true,
        securityIpWhitelisting: false,
        appTheme: "Light",
        appDarkMode: false,
        appAccentColor: "Blue",
        appDashLayout: "Grid",
        backupSchedule: "Weekly",
        logoImage: null // Base64 data URL
    };

    let activeSettings = { ...factoryDefaults };

    const mockLoginLogs = [
        { user: "Alex Mercer (Admin)", device: "Chrome / macOS", ip: "192.168.1.100", time: "2026-06-15 10:30", status: "success" },
        { user: "Jane Doe (PM)", device: "Firefox / Ubuntu", ip: "10.0.0.4", time: "2026-06-15 09:15", status: "success" },
        { user: "Unknown User", device: "Safari / iPhone", ip: "203.0.113.195", time: "2026-06-14 22:45", status: "failed" },
        { user: "Mike Kowalski (Dev)", device: "Chrome / Linux", ip: "192.168.1.45", time: "2026-06-14 13:40", status: "success" }
    ];

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

    // Stats Elements
    const statActiveUsers = document.getElementById('stat-active-users');
    const statTotalProjects = document.getElementById('stat-total-projects');
    const statSystemHealth = document.getElementById('stat-system-health');
    const statSecurityStatus = document.getElementById('stat-security-status');
    const securityHealthIcon = document.getElementById('security-health-icon');
    const securityHealthDesc = document.getElementById('security-health-desc');

    // Tabs & Panels
    const tabBtns = document.querySelectorAll('.tab-select-btn');
    const tabPanels = document.querySelectorAll('.tab-panel-item');

    // Toolbar Buttons
    const btnSaveSettings = document.getElementById('btn-save-settings');
    const btnResetSettings = document.getElementById('btn-reset-settings');
    const btnExportConfig = document.getElementById('btn-export-config');
    const btnBackupSystem = document.getElementById('btn-backup-system');

    // Image Upload Inputs
    const btnUploadLogo = document.getElementById('btn-upload-logo');
    const logoFileInput = document.getElementById('logo-file-input');
    const logoPreviewBox = document.getElementById('logo-preview-box');

    // Panel backup Actions buttons
    const btnRunBackupPanel = document.getElementById('btn-run-backup-panel');
    const btnExportPanel = document.getElementById('btn-export-panel');
    const btnImportPanel = document.getElementById('btn-import-panel');
    const configFileInput = document.getElementById('config-file-input');
    const btnRestorePanel = document.getElementById('btn-restore-panel');

    // Audit logs target
    const loginHistoryLogs = document.getElementById('security-login-logs');

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
    // INITIALIZATION & SESSION CONTROL
    // ==========================================
    function init() {
        loadSessionUser();
        loadSettingsFromStorage();
        renderSettingsData();
        renderAuditLogs();
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

    // ==========================================
    // DATA BINDINGS & LOCAL STORAGE
    // ==========================================
    function loadSettingsFromStorage() {
        const stored = localStorage.getItem('taskmaster_system_settings');
        if (stored) {
            try {
                activeSettings = { ...factoryDefaults, ...JSON.parse(stored) };
            } catch (err) {
                console.error("Error parsing settings from storage", err);
                activeSettings = { ...factoryDefaults };
            }
        } else {
            activeSettings = { ...factoryDefaults };
        }
    }

    function saveSettingsToStorage() {
        localStorage.setItem('taskmaster_system_settings', JSON.stringify(activeSettings));
    }

    function renderSettingsData() {
        // TAB 1: General
        document.getElementById('sys-name').value = activeSettings.sysName;
        document.getElementById('company-name').value = activeSettings.companyName;
        document.getElementById('sys-timezone').value = activeSettings.timezone;
        document.getElementById('sys-language').value = activeSettings.language;

        // Logo preview box rendering
        if (logoPreviewBox) {
            if (activeSettings.logoImage) {
                logoPreviewBox.innerHTML = `<img src="${activeSettings.logoImage}" alt="Acme Company Logo">`;
            } else {
                logoPreviewBox.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="40" height="40" rx="12" fill="url(#logo-gradient)"/>
                        <path d="M12 20L17 25L28 14" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                `;
            }
        }

        // TAB 2: User management
        document.getElementById('default-role').value = activeSettings.defaultRole;
        document.getElementById('session-timeout').value = activeSettings.sessionTimeout;
        document.getElementById('lockout-attempts').value = activeSettings.lockoutAttempts;
        document.getElementById('lockout-duration').value = activeSettings.lockoutDuration;
        document.getElementById('pwd-min-length').value = activeSettings.pwdMinLength;
        document.getElementById('pwd-require-num').checked = activeSettings.pwdRequireNum;
        document.getElementById('pwd-require-sym').checked = activeSettings.pwdRequireSym;

        // TAB 3: Notifications
        document.getElementById('notif-email').checked = activeSettings.notifEmail;
        document.getElementById('notif-push').checked = activeSettings.notifPush;
        document.getElementById('notif-reminders').checked = activeSettings.notifReminders;
        document.getElementById('notif-alerts').checked = activeSettings.notifAlerts;
        document.getElementById('notif-announcements').checked = activeSettings.notifAnnouncements;

        // TAB 4: Security
        document.getElementById('security-2fa').checked = activeSettings.security2fa;
        document.getElementById('security-pwd-expiry').value = activeSettings.securityPwdExpiry;
        document.getElementById('security-ip-whitelisting').checked = activeSettings.securityIpWhitelisting;

        // TAB 5: Appearance
        document.getElementById('app-theme').value = activeSettings.appTheme;
        document.getElementById('app-dark-mode').checked = activeSettings.appDarkMode;
        document.getElementById('app-accent-color').value = activeSettings.appAccentColor;
        document.getElementById('app-dash-layout').value = activeSettings.appDashLayout;
        
        // Active accent dot sync
        document.querySelectorAll('.color-dot').forEach(dot => {
            if (dot.getAttribute('data-color') === activeSettings.appAccentColor) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        // TAB 6: Backup
        document.getElementById('backup-schedule').value = activeSettings.backupSchedule;

        // Update Security Status based on 2FA checkbox state
        updateSecurityStatusWidget(activeSettings.security2fa);
    }

    function collectFormSettings() {
        // TAB 1: General
        activeSettings.sysName = document.getElementById('sys-name').value.trim();
        activeSettings.companyName = document.getElementById('company-name').value.trim();
        activeSettings.timezone = document.getElementById('sys-timezone').value;
        activeSettings.language = document.getElementById('sys-language').value;

        // TAB 2: User admin
        activeSettings.defaultRole = document.getElementById('default-role').value;
        activeSettings.sessionTimeout = parseInt(document.getElementById('session-timeout').value) || 60;
        activeSettings.lockoutAttempts = parseInt(document.getElementById('lockout-attempts').value) || 5;
        activeSettings.lockoutDuration = parseInt(document.getElementById('lockout-duration').value) || 15;
        activeSettings.pwdMinLength = parseInt(document.getElementById('pwd-min-length').value) || 8;
        activeSettings.pwdRequireNum = document.getElementById('pwd-require-num').checked;
        activeSettings.pwdRequireSym = document.getElementById('pwd-require-sym').checked;

        // TAB 3: Notifications
        activeSettings.notifEmail = document.getElementById('notif-email').checked;
        activeSettings.notifPush = document.getElementById('notif-push').checked;
        activeSettings.notifReminders = document.getElementById('notif-reminders').checked;
        activeSettings.notifAlerts = document.getElementById('notif-alerts').checked;
        activeSettings.notifAnnouncements = document.getElementById('notif-announcements').checked;

        // TAB 4: Security
        activeSettings.security2fa = document.getElementById('security-2fa').checked;
        activeSettings.securityPwdExpiry = document.getElementById('security-pwd-expiry').value;
        activeSettings.securityIpWhitelisting = document.getElementById('security-ip-whitelisting').checked;

        // TAB 5: Appearance
        activeSettings.appTheme = document.getElementById('app-theme').value;
        activeSettings.appDarkMode = document.getElementById('app-dark-mode').checked;
        activeSettings.appAccentColor = document.getElementById('app-accent-color').value;
        activeSettings.appDashLayout = document.getElementById('app-dash-layout').value;

        // TAB 6: Backup
        activeSettings.backupSchedule = document.getElementById('backup-schedule').value;
    }

    function updateSecurityStatusWidget(is2faChecked) {
        if (!statSecurityStatus || !securityHealthIcon || !securityHealthDesc) return;
        if (is2faChecked) {
            statSecurityStatus.textContent = "Secured";
            securityHealthDesc.textContent = "2FA Policy Active";
            statSecurityStatus.style.color = "var(--cat-green-color)";
            securityHealthIcon.className = "stat-card-icon green";
            securityHealthIcon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
        } else {
            statSecurityStatus.textContent = "Action Needed";
            securityHealthDesc.textContent = "Enable 2FA Policy";
            statSecurityStatus.style.color = "var(--cat-yellow-color)";
            securityHealthIcon.className = "stat-card-icon yellow";
            securityHealthIcon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`;
        }
    }

    function renderAuditLogs() {
        if (!loginHistoryLogs) return;
        loginHistoryLogs.innerHTML = mockLoginLogs.map(log => {
            const successClass = log.status === "success" ? "" : "failed";
            const statusLabel = log.status === "success" ? "Authorized" : "Denied";
            return `
                <div class="audit-log-item">
                    <div class="audit-log-left">
                        <div class="audit-log-dot ${successClass}"></div>
                        <span class="audit-log-user">${log.user}</span>
                        <span class="audit-log-device">&bull; ${log.device}</span>
                    </div>
                    <div class="audit-log-left">
                        <span class="audit-log-ip">${log.ip}</span>
                        <span class="audit-log-time">${log.time}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    // ==========================================
    // MOCK TELEMETRY HELPER
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

    // ==========================================
    // BACKEND SIMULATION ACTIONS
    // ==========================================
    function saveConfigurations() {
        collectFormSettings();
        saveSettingsToStorage();
        renderSettingsData(); // refresh widget count
        showToast("System configurations saved successfully!", "success");
    }

    function resetToFactoryDefaults() {
        if (confirm("Are you sure you want to revert all system settings to factory defaults?")) {
            activeSettings = { ...factoryDefaults };
            saveSettingsToStorage();
            renderSettingsData();
            showToast("System reverted to default configurations.", "info");
        }
    }

    function exportSettingsConfig() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeSettings, null, 4));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "taskmaster_system_settings.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        document.body.removeChild(downloadAnchor);
        showToast("Configurations profile downloaded.", "success");
    }

    function runDatabaseBackup() {
        showToast("Initializing database backup snapshot...", "info");
        
        // Disable backup buttons during backup simulation
        if (btnBackupSystem) btnBackupSystem.disabled = true;
        if (btnRunBackupPanel) btnRunBackupPanel.disabled = true;
        
        setTimeout(() => {
            if (btnBackupSystem) btnBackupSystem.disabled = false;
            if (btnRunBackupPanel) btnRunBackupPanel.disabled = false;
            
            showToast("System database backup completed successfully!", "success");
        }, 1500);
    }

    // ==========================================
    // EVENT LISTENERS & TRIGGERS
    // ==========================================
    function setupEventListeners() {
        // Mobile Sidebar drawers
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

        // Tabs Selector switching
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

        // Global Toolbar Buttons Actions
        if (btnSaveSettings) btnSaveSettings.addEventListener('click', saveConfigurations);
        if (btnResetSettings) btnResetSettings.addEventListener('click', resetToFactoryDefaults);
        if (btnExportConfig) btnExportConfig.addEventListener('click', exportSettingsConfig);
        if (btnBackupSystem) btnBackupSystem.addEventListener('click', runDatabaseBackup);

        // Panel Actions buttons
        if (btnRunBackupPanel) btnRunBackupPanel.addEventListener('click', runDatabaseBackup);
        if (btnExportPanel) btnExportPanel.addEventListener('click', exportSettingsConfig);
        if (btnRestorePanel) btnRestorePanel.addEventListener('click', resetToFactoryDefaults);

        // TAB 1 logo picture uploader trigger
        if (btnUploadLogo && logoFileInput) {
            btnUploadLogo.addEventListener('click', () => {
                logoFileInput.click();
            });

            logoFileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        activeSettings.logoImage = event.target.result;
                        if (logoPreviewBox) {
                            logoPreviewBox.innerHTML = `<img src="${event.target.result}" alt="Company Logo">`;
                        }
                        showToast("Company logo updated locally.", "success");
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // Accent Colors dots selector
        document.querySelectorAll('.color-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                
                const colorValue = dot.getAttribute('data-color');
                document.getElementById('app-accent-color').value = colorValue;
                showToast(`Accent color shifted to ${colorValue}.`, "info");
            });
        });

        // TAB 6 settings import uploader
        if (btnImportPanel && configFileInput) {
            btnImportPanel.addEventListener('click', () => {
                configFileInput.click();
            });

            configFileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        try {
                            const parsed = JSON.parse(event.target.result);
                            activeSettings = { ...factoryDefaults, ...parsed };
                            saveSettingsToStorage();
                            renderSettingsData();
                            showToast("Configurations imported successfully!", "success");
                        } catch (err) {
                            showToast("Error importing configurations. File must be valid JSON.", "error");
                        }
                    };
                    reader.readAsText(file);
                }
            });
        }

        // Sync individual forms submits to saveConfigurations
        const formsList = ['form-general', 'form-user-mgmt', 'form-notifications', 'form-security', 'form-appearance'];
        formsList.forEach(id => {
            const form = document.getElementById(id);
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    saveConfigurations();
                });
            }
        });
    }

    // Launch settings center
    init();
});
