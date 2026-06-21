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
        const tabInfo = document.getElementById('tab-info');
        const tabPassword = document.getElementById('tab-password');

        if (hash.includes('tab=password')) {
            if (tabInfo) {
                tabInfo.classList.remove('active');
                tabInfo.style.display = 'none';
            }
            if (tabPassword) {
                tabPassword.classList.add('active');
                tabPassword.style.display = 'block';
            }
        } else {
            if (tabInfo) {
                tabInfo.classList.add('active');
                tabInfo.style.display = 'block';
            }
            if (tabPassword) {
                tabPassword.classList.remove('active');
                tabPassword.style.display = 'none';
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

    async loadProfileData() {
        let userData = null;
        try {
            if (typeof Api !== 'undefined' && Api.getProfile) {
                userData = await Api.getProfile();
            }
        } catch (error) {
            console.warn('API getProfile failed, falling back to session user', error);
        }

        if (!userData) {
            const currentUser = typeof Auth !== 'undefined' ? Auth.getCurrentUser() : null;
            userData = currentUser || {
                username: 'demo_user',
                fullName: 'Nguyễn Văn An',
                hoTen: 'Nguyễn Văn An',
                role: 'admin',
                email: 'nguyenvanan@rehabcare.vn',
                sdt: '0905123456'
            };
        }

        this.currentUserData = userData;

        // Render Avatar
        this.renderAvatar();

        // Render Sidebar Names
        const nameEl = document.getElementById('profileFullName');
        if (nameEl) nameEl.textContent = userData.fullName || userData.hoTen || userData.username;

        const roleEl = document.getElementById('profileRoleBadge');
        if (roleEl) roleEl.textContent = this.getRoleName(userData.role);

        const usernameEl = document.getElementById('profileUsername');
        if (usernameEl) usernameEl.textContent = userData.username;

        // Populate Form Values
        const formFullName = document.getElementById('formFullName');
        if (formFullName) formFullName.value = userData.fullName || userData.hoTen || '';

        const formEmail = document.getElementById('formEmail');
        if (formEmail) formEmail.value = userData.email || '';

        const formPhone = document.getElementById('formPhone');
        if (formPhone) formPhone.value = userData.phoneNumber || userData.sdt || '';

        const formUsername = document.getElementById('formUsername');
        if (formUsername) formUsername.value = userData.username || '';

        const formRole = document.getElementById('formRole');
        if (formRole) formRole.value = this.getRoleName(userData.role);
    },

    renderAvatar() {
        const userData = this.currentUserData;
        if (!userData) return;

        const username = userData.username || 'user';
        const savedAvatar = localStorage.getItem('avatar_' + username);

        const initials = this.getInitials(userData.fullName || userData.hoTen || userData.username);
        const avatarLarge = document.getElementById('profileAvatarLarge');
        const avatarImage = document.getElementById('profileAvatarImage');

        if (savedAvatar) {
            if (avatarImage) {
                avatarImage.src = savedAvatar;
                avatarImage.style.display = 'block';
            }
            if (avatarLarge) {
                avatarLarge.style.display = 'none';
            }
        } else {
            if (avatarLarge) {
                avatarLarge.textContent = initials;
                avatarLarge.style.display = 'flex';
            }
            if (avatarImage) {
                avatarImage.style.display = 'none';
            }
        }
    },

    bindEvents() {
        const self = this;

        // --- Avatar Selection Logic ---
        const avatarWrapper = document.getElementById('profileAvatarWrapper');
        const avatarInput = document.getElementById('avatarInput');

        if (avatarWrapper && avatarInput) {
            avatarWrapper.addEventListener('click', () => {
                avatarInput.click();
            });

            avatarInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                if (!file.type.startsWith('image/')) {
                    if (window.Toast) Toast.show('Vui lòng chọn tệp hình ảnh hợp lệ', 'error');
                    return;
                }

                if (file.size > 2 * 1024 * 1024) {
                    if (window.Toast) Toast.show('Kích thước ảnh không được vượt quá 2MB', 'error');
                    return;
                }

                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64Image = event.target.result;
                    const username = self.currentUserData?.username || sessionStorage.getItem('auth_user') || 'user';
                    
                    localStorage.setItem('avatar_' + username, base64Image);
                    
                    self.renderAvatar();

                    // Update Topbar avatar immediately
                    const topbarAvatarEl = document.querySelector('.topbar-avatar');
                    if (topbarAvatarEl) {
                        topbarAvatarEl.innerHTML = `<img src="${base64Image}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
                    }

                    if (window.Toast) Toast.show('Cập nhật ảnh đại diện thành công', 'success');
                };
                reader.readAsDataURL(file);
            });
        }

        // --- Save Profile Information ---
        const btnSaveProfile = document.getElementById('btnSaveProfile');
        if (btnSaveProfile) {
            btnSaveProfile.addEventListener('click', async (e) => {
                e.preventDefault();
                const fullName = document.getElementById('formFullName').value.trim();
                const email = document.getElementById('formEmail').value.trim();
                const phone = document.getElementById('formPhone').value.trim();

                if (!fullName || !email) {
                    if (window.Toast) Toast.show('Vui lòng điền đầy đủ các thông tin bắt buộc (*)', 'error');
                    return;
                }

                try {
                    btnSaveProfile.disabled = true;
                    btnSaveProfile.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang lưu...';

                    if (typeof Api !== 'undefined' && Api.updateProfile) {
                        await Api.updateProfile({ fullName, email, phoneNumber: phone });
                    } else {
                        throw new Error('API updateProfile not defined');
                    }

                    // Update local user details
                    const currentUser = typeof Auth !== 'undefined' ? Auth.getCurrentUser() : null;
                    if (currentUser) {
                        currentUser.fullName = fullName;
                        currentUser.name = fullName;
                        currentUser.email = email;
                        currentUser.sdt = phone;
                        currentUser.phoneNumber = phone;
                        localStorage.setItem('auth_user_data', JSON.stringify(currentUser));
                        sessionStorage.setItem('auth_name', fullName);
                    }

                    if (self.currentUserData) {
                        self.currentUserData.fullName = fullName;
                        self.currentUserData.email = email;
                        self.currentUserData.phoneNumber = phone;
                    }
                    
                    document.getElementById('profileFullName').textContent = fullName;
                    self.renderAvatar();

                    const topbarNameEl = document.querySelector('.topbar-user-info .user-name');
                    if (topbarNameEl) {
                        topbarNameEl.textContent = fullName;
                    }

                    if (window.Toast) Toast.show('Cập nhật hồ sơ thành công', 'success');
                } catch (error) {
                    console.error('API updateProfile failed:', error);
                    if (window.Toast) Toast.show(error.message || 'Cập nhật hồ sơ thất bại', 'error');
                } finally {
                    btnSaveProfile.disabled = false;
                    btnSaveProfile.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Lưu thay đổi';
                }
            });
        }

        // --- Save Password Change ---
        const btnSavePassword = document.getElementById('btnSavePassword');
        if (btnSavePassword) {
            btnSavePassword.addEventListener('click', async (e) => {
                e.preventDefault();
                const oldPassword = document.getElementById('formOldPassword').value;
                const newPassword = document.getElementById('formNewPassword').value;
                const confirmPassword = document.getElementById('formConfirmPassword').value;

                if (!oldPassword || !newPassword || !confirmPassword) {
                    if (window.Toast) Toast.show('Vui lòng nhập đầy đủ các trường mật khẩu', 'error');
                    return;
                }

                if (newPassword.length < 8) {
                    if (window.Toast) Toast.show('Mật khẩu mới phải dài tối thiểu 8 ký tự', 'error');
                    return;
                }

                if (newPassword !== confirmPassword) {
                    if (window.Toast) Toast.show('Mật khẩu xác nhận không khớp', 'error');
                    return;
                }

                try {
                    btnSavePassword.disabled = true;
                    btnSavePassword.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang cập nhật...';

                    if (typeof Api !== 'undefined' && Api.changePassword) {
                        await Api.changePassword({ oldPassword, newPassword });
                    } else {
                        throw new Error('API changePassword not defined');
                    }

                    document.getElementById('formChangePassword').reset();

                    if (window.Toast) Toast.show('Thay đổi mật khẩu thành công', 'success');
                } catch (error) {
                    console.error('API changePassword failed:', error);
                    if (window.Toast) Toast.show(error.message || 'Mật khẩu cũ không chính xác hoặc lỗi hệ thống', 'error');
                } finally {
                    btnSavePassword.disabled = false;
                    btnSavePassword.innerHTML = '<i class="fa-solid fa-check"></i> Thay đổi mật khẩu';
                }
            });
        }
    }
};

window.ProfilePage = ProfilePage;