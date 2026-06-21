const ProfilePage = {
    async render(containerId) {
        const success = await ViewLoader.load('views/common/profile.html', containerId);
        if (success) {
            this.init();
        }
    },

    init() {
        if (typeof Topbar !== 'undefined') {
            Topbar.setTitle('Thông tin cá nhân', 'Quản lý tài khoản và cài đặt bảo mật');
        }

        this.loadProfileData();
        this.bindEvents();
        this.checkUrlParams();
    },

    checkUrlParams() {
        const hash = window.location.hash;
        if (hash.includes('tab=password')) {
            const modalPassword = document.getElementById('modalChangePassword');
            if (modalPassword) {
                setTimeout(() => modalPassword.classList.add('active'), 100);
            }
        }
    },

    getRoleName(roleCode) {
        const map = {
            'admin': 'Quản trị hệ thống',
            'director': 'Lãnh đạo trung tâm',
            'doctor': 'Bác sĩ điều trị',
            'manager': 'Cán bộ quản lý',
            'staff': 'Cán bộ trung tâm',
            'family': 'Người thân',
            'police': 'Công an'
        };
        return map[roleCode?.toLowerCase()] || roleCode || 'Nhân viên';
    },

    getInitials(name) {
        if (!name) return '??';
        return name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase();
    },

    loadProfileData() {
        const currentUser = typeof Auth !== 'undefined' ? Auth.getCurrentUser() : null;

        const userData = currentUser || {
            username: 'demo_user',
            fullName: 'Nguyễn Văn An',
            hoTen: 'Nguyễn Văn An',
            role: 'admin',
            email: 'nguyenvanan@rehabcare.vn',
            sdt: '0905123456'
        };

        // Avatar & Name
        const initials = this.getInitials(userData.fullName || userData.hoTen);
        const avatarEl = document.getElementById('profileAvatarLarge');
        if (avatarEl) avatarEl.textContent = initials;

        const nameEl = document.getElementById('profileFullName');
        if (nameEl) nameEl.textContent = userData.fullName || userData.hoTen || userData.username;

        const roleEl = document.getElementById('profileRoleBadge');
        if (roleEl) roleEl.textContent = this.getRoleName(userData.role);

        const usernameEl = document.getElementById('profileUsername');
        if (usernameEl) usernameEl.textContent = userData.username;

        // Display info
        document.getElementById('displayFullName').textContent = userData.fullName || userData.hoTen || '--';
        document.getElementById('displayEmail').textContent = userData.email || '--';
        document.getElementById('displayPhone').textContent = userData.sdt || '--';
        document.getElementById('displayRole').textContent = this.getRoleName(userData.role);
        document.getElementById('displayPasswordChanged').textContent = userData.lastPasswordChange || 'Chưa thay đổi';

        // Form values
        document.getElementById('formFullName').value = userData.fullName || userData.hoTen || '';
        document.getElementById('formEmail').value = userData.email || '';
        document.getElementById('formPhone').value = userData.sdt || '';
    },



    bindEvents() {
        // Edit Profile Modal
        const btnEdit = document.getElementById('btnEditProfile');
        const modalEdit = document.getElementById('modalEditProfile');
        const btnCloseEdit = document.getElementById('btnCloseEditModal');
        const btnCancelEdit = document.getElementById('btnCancelEdit');
        const btnSave = document.getElementById('btnSaveProfile');

        if (btnEdit && modalEdit) {
            btnEdit.addEventListener('click', () => {
                modalEdit.classList.add('active');
            });
        }

        if (btnCloseEdit) {
            btnCloseEdit.addEventListener('click', () => {
                modalEdit.classList.remove('active');
            });
        }

        if (btnCancelEdit) {
            btnCancelEdit.addEventListener('click', () => {
                modalEdit.classList.remove('active');
            });
        }

        if (modalEdit) {
            modalEdit.addEventListener('click', (e) => {
                if (e.target === modalEdit) {
                    modalEdit.classList.remove('active');
                }
            });
        }

        if (btnSave) {
            btnSave.addEventListener('click', async () => {
                const fullName = document.getElementById('formFullName').value.trim();
                const email = document.getElementById('formEmail').value.trim();
                const phone = document.getElementById('formPhone').value.trim();

                if (!fullName || !email) {
                    if (window.Toast) Toast.show('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
                    return;
                }

                const currentUser = typeof Auth !== 'undefined' ? Auth.getCurrentUser() : null;
                const userId = currentUser ? (currentUser.id || currentUser.username) : '1';
                
                try {
                    btnSave.disabled = true;
                    btnSave.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang lưu...';
                    
                    if (typeof Api !== 'undefined' && Api.updateProfile) {
                        await Api.updateProfile(userId, { fullName, email, sdt: phone });
                    } else {
                        throw new Error('API updateProfile not defined');
                    }

                    if (window.Toast) Toast.show('Cập nhật hồ sơ thành công', 'success');
                } catch (error) {
                    console.warn('API updateProfile failed, using mock', error);
                    // Mock success
                    if (window.Toast) Toast.show('Cập nhật hồ sơ thành công (Mock Data)', 'success');
                } finally {
                    btnSave.disabled = false;
                    btnSave.innerHTML = '<i class="fa-solid fa-save"></i> Lưu thay đổi';
                    
                    // Update display
                    document.getElementById('displayFullName').textContent = fullName;
                    document.getElementById('profileFullName').textContent = fullName;
                    document.getElementById('displayEmail').textContent = email;
                    document.getElementById('displayPhone').textContent = phone || '--';

                    const initials = this.getInitials(fullName);
                    document.getElementById('profileAvatarLarge').textContent = initials;
                    
                    if (currentUser && typeof Auth !== 'undefined') {
                        currentUser.fullName = fullName;
                        currentUser.hoTen = fullName;
                        currentUser.email = email;
                        currentUser.sdt = phone;
                        sessionStorage.setItem('auth_user', JSON.stringify(currentUser));
                    }

                    modalEdit.classList.remove('active');
                }
            });
        }

        // Change Password Modal
        const btnChangePass = document.getElementById('btnChangePassword');
        const modalPassword = document.getElementById('modalChangePassword');
        const btnClosePassword = document.getElementById('btnClosePasswordModal');
        const btnCancelPassword = document.getElementById('btnCancelPassword');
        const btnSavePassword = document.getElementById('btnSavePassword');

        if (btnChangePass && modalPassword) {
            btnChangePass.addEventListener('click', () => {
                document.getElementById('formChangePassword').reset();
                modalPassword.classList.add('active');
            });
        }

        if (btnClosePassword) {
            btnClosePassword.addEventListener('click', () => {
                modalPassword.classList.remove('active');
            });
        }

        if (btnCancelPassword) {
            btnCancelPassword.addEventListener('click', () => {
                modalPassword.classList.remove('active');
            });
        }

        if (modalPassword) {
            modalPassword.addEventListener('click', (e) => {
                if (e.target === modalPassword) {
                    modalPassword.classList.remove('active');
                }
            });
        }

        if (btnSavePassword) {
            btnSavePassword.addEventListener('click', async () => {
                const oldPass = document.getElementById('formOldPassword').value;
                const newPass = document.getElementById('formNewPassword').value;
                const confirmPass = document.getElementById('formConfirmPassword').value;

                if (!oldPass || !newPass || !confirmPass) {
                    if (window.Toast) Toast.show('Vui lòng điền đầy đủ thông tin', 'error');
                    return;
                }

                if (newPass.length < 8) {
                    if (window.Toast) Toast.show('Mật khẩu mới phải có ít nhất 8 ký tự', 'error');
                    return;
                }

                if (newPass !== confirmPass) {
                    if (window.Toast) Toast.show('Mật khẩu xác nhận không khớp', 'error');
                    return;
                }

                const currentUser = typeof Auth !== 'undefined' ? Auth.getCurrentUser() : null;
                const userId = currentUser ? (currentUser.id || currentUser.username) : '1';

                try {
                    btnSavePassword.disabled = true;
                    btnSavePassword.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang lưu...';
                    
                    if (typeof Api !== 'undefined' && Api.changePassword) {
                        await Api.changePassword(userId, { oldPassword: oldPass, newPassword: newPass });
                    } else {
                        throw new Error('API changePassword not defined');
                    }
                    if (window.Toast) Toast.show('Đã thay đổi mật khẩu thành công', 'success');
                } catch (error) {
                    console.warn('API changePassword failed, using mock', error);
                    if (window.Toast) Toast.show('Đổi mật khẩu thành công (Mock Data)', 'success');
                } finally {
                    btnSavePassword.disabled = false;
                    btnSavePassword.innerHTML = '<i class="fa-solid fa-save"></i> Đổi mật khẩu';
                    
                    // Update display
                    const now = new Date().toLocaleDateString('vi-VN');
                    document.getElementById('displayPasswordChanged').textContent = now;

                    modalPassword.classList.remove('active');
                    document.getElementById('formChangePassword').reset();
                }
            });
        }
    }
};

window.ProfilePage = ProfilePage;