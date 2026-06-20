const Api = {
    async request(endpoint, options = {}) {
        const token = Auth.getToken();
        const isDemoToken = token && token.startsWith('demo-token-');
        const headers = {
            'Content-Type': 'application/json',
            ...(token && !isDemoToken && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        };

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(`${CONFIG.BASE_API_URL}${endpoint}`, config);
            const payload = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(payload?.message || response.statusText || 'API request failed');
            }

            return payload?.data ?? payload;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    },

    post(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
    },

    put(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });
    },

    delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    },

    getMedicalRecords() {
        return this.get('/medical-records');
    },

    getMedicalRecordById(id) {
        return this.get(`/medical-records/${id}`);
    },

    updateMedicalRecord(id, data) {
        return this.put(`/medical-records/${id}`, data);
    },

    getTreatmentPlans() {
        return this.get('/treatment-plans');
    },

    getTreatmentPlanById(id) {
        return this.get(`/treatment-plans/${id}`);
    },

    approveTreatmentPlan(id, data) {
        return this.put(`/treatment-plans/${id}/approve`, data);
    },

    rejectTreatmentPlan(id, data) {
        return this.put(`/treatment-plans/${id}/reject`, data);
    },

    // ==========================================
    // LEADER APIS
    // ==========================================
    getLeaderDashboard() {
        return this.get('/leader/dashboard');
    },

    getIntakeApprovals() {
        return this.get('/leader/intake-approvals');
    },

    getCompletionApprovals() {
        return this.get('/leader/completion-approvals');
    },

    getLeaderReport() {
        return this.get('/leader/report');
    },

    // ==========================================
    // ADMIN APIS
    // ==========================================
    getAdminDashboard() {
        return this.get('/admin/dashboard');
    },

    // ==========================================
    // COMMON APIS (Profile & Notification)
    // ==========================================
    updateProfile(userId, profileData) {
        return this.put(`/users/${userId}`, profileData);
    },
    
    changePassword(userId, passwordData) {
        return this.put(`/users/${userId}/change-password`, passwordData);
    },

    getNotifications() {
        return this.get('/notifications');
    },
    
    markNotificationAsRead(id) {
        return this.put(`/notifications/${id}/read`);
    },
    
    markAllNotificationsAsRead() {
        return this.put('/notifications/mark-all-read');
    },

    // ==========================================
    // STAFF APIS
    // ==========================================
    getStaffDashboard() {
        return this.get('/staff/dashboard');
    },

    getPendingIntakes() {
        return this.get('/staff/intake-confirmations');
    },

    confirmIntake(id, data) {
        return this.put(`/staff/intake-confirmations/${id}/confirm`, data);
    },

    requestIntakeSupplement(id, data) {
        return this.put(`/staff/intake-confirmations/${id}/supplement`, data);
    },

    getStaffPatients() {
        return this.get('/staff/patients');
    },

    updatePatientStatus(id, data) {
        return this.put(`/staff/patients/${id}/status`, data);
    },

    getVisitRequests() {
        return this.get('/staff/visits');
    },

    approveVisit(id, data) {
        return this.put(`/staff/visits/${id}/approve`, data);
    },

    rejectVisit(id, data) {
        return this.put(`/staff/visits/${id}/reject`, data);
    },

    getActivities() {
        return this.get('/staff/activities');
    },

    createActivity(data) {
        return this.post('/staff/activities', data);
    },

    updateActivity(id, data) {
        return this.put(`/staff/activities/${id}`, data);
    },

    cancelActivity(id) {
        return this.put(`/staff/activities/${id}/cancel`);
    },

    getAttendanceList(activityId) {
        return this.get(`/staff/activities/${activityId}/attendance`);
    },

    getAttendances() {
        return this.get('/staff/attendance');
    },

    updateAttendance(id, data) {
        return this.put(`/staff/attendance/${id}`, data);
    },

    markAttendance(activityId, data) {
        return this.put(`/staff/activities/${activityId}/attendance`, data);
    }
};
