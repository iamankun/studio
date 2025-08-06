(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/lib/logger.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// Logger Service - Tôi là An Kun
__turbopack_context__.s({
    "logger": ()=>logger
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
;
class Logger {
    createEntry(level, message, data, meta) {
        return {
            id: "".concat(Date.now(), "-").concat(Math.random().toString(36).substring(2, 11)),
            timestamp: new Date().toISOString(),
            level,
            message,
            data,
            userId: meta === null || meta === void 0 ? void 0 : meta.userId,
            component: meta === null || meta === void 0 ? void 0 : meta.component,
            action: meta === null || meta === void 0 ? void 0 : meta.action
        };
    }
    debug(message, data, meta) {
        const entry = this.createEntry('debug', message, data, meta);
        this.addLog(entry);
        if ("TURBOPACK compile-time truthy", 1) {
            console.debug("[DEBUG] ".concat(message), data);
        }
    }
    info(message, data, meta) {
        const entry = this.createEntry('info', message, data, meta);
        this.addLog(entry);
        console.info("[INFO] ".concat(message), data);
    }
    warn(message, data, meta) {
        const entry = this.createEntry('warn', message, data, meta);
        this.addLog(entry);
        console.warn("[WARN] ".concat(message), data);
    }
    error(message, error, meta) {
        const entry = this.createEntry('error', message, error, meta);
        this.addLog(entry);
        console.error("[ERROR] ".concat(message), error);
    }
    addLog(entry) {
        this.logs.unshift(entry);
        if (this.logs.length > this.maxLogs) {
            this.logs = this.logs.slice(0, this.maxLogs);
        }
        // Store in localStorage for persistence (only in browser)
        if ("TURBOPACK compile-time truthy", 1) {
            try {
                const storedLogs = JSON.parse(localStorage.getItem('aks_logs') || '[]');
                storedLogs.unshift(entry);
                if (storedLogs.length > this.maxLogs) {
                    storedLogs.splice(this.maxLogs);
                }
                localStorage.setItem('aks_logs', JSON.stringify(storedLogs));
            } catch (e) {
                console.error('Failed to store logs:', e);
            }
        }
    }
    getLogs() {
        if ("TURBOPACK compile-time truthy", 1) {
            try {
                const stored = localStorage.getItem('aks_logs');
                if (stored) {
                    return JSON.parse(stored);
                }
            } catch (e) {
                console.error('Failed to load logs:', e);
            }
        }
        return this.logs;
    }
    clearLogs() {
        this.logs = [];
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.removeItem('aks_logs');
        }
    }
    exportLogs() {
        const logs = this.getLogs();
        return JSON.stringify(logs, null, 2);
    }
    filterLogs(level, component, search) {
        const logs = this.getLogs();
        return logs.filter((log)=>{
            if (level && log.level !== level) return false;
            if (component && log.component !== component) return false;
            if (search && !log.message.toLowerCase().includes(search.toLowerCase())) return false;
            return true;
        });
    }
    // Add a console helper method
    debugToConsole() {
        if ("TURBOPACK compile-time truthy", 1) {
            console.log('%c AKs Studio Logs', 'background: #7e57c2; color: white; padding: 2px 6px; border-radius: 2px;');
            this.getLogs().forEach((log)=>{
                const style = this.getConsoleStyle(log.level);
                console.groupCollapsed("%c".concat(log.level.toUpperCase(), "%c ").concat(new Date(log.timestamp).toLocaleString(), " - ").concat(log.message), style, 'color: inherit');
                console.log('Component:', log.component || 'Not specified');
                console.log('Action:', log.action || 'Not specified');
                console.log('User ID:', log.userId || 'Not specified');
                var _log_data;
                console.log('Data:', (_log_data = log.data) !== null && _log_data !== void 0 ? _log_data : 'None');
                console.groupEnd();
            });
            return "Displayed ".concat(this.getLogs().length, " logs in console");
        }
        //TURBOPACK unreachable
        ;
    }
    getConsoleStyle(level) {
        switch(level){
            case 'debug':
                return 'background: #607d8b; color: white; padding: 2px 6px; border-radius: 2px;';
            case 'info':
                return 'background: #2196f3; color: white; padding: 2px 6px; border-radius: 2px;';
            case 'warn':
                return 'background: #ff9800; color: black; padding: 2px 6px; border-radius: 2px;';
            case 'error':
                return 'background: #f44336; color: white; padding: 2px 6px; border-radius: 2px;';
            default:
                return 'color: inherit';
        }
    }
    constructor(){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "logs", []);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "maxLogs", 1000);
    }
}
const logger = new Logger();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/lib/database-api-service.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// File: lib/database-api-service.ts
// An Kun Studio Digital Music Distribution System
// Service thống nhất cho tất cả database operations - SỬ DỤNG API ENDPOINTS
__turbopack_context__.s({
    "DatabaseApiService": ()=>DatabaseApiService,
    "databaseApiService": ()=>databaseApiService,
    "databaseService": ()=>databaseService,
    "multiDB": ()=>multiDB
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/logger.ts [app-client] (ecmascript)");
;
;
class DatabaseApiService {
    // Helper function để chuẩn hóa submissions với file mặc định
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    normalizeSubmissions(submissions) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return submissions.map((submission)=>{
            var _submission_artist_name, _ref;
            // Xử lý tên nghệ sĩ với logic Various Artist
            let processedArtistName = (_ref = (_submission_artist_name = submission.artist_name) !== null && _submission_artist_name !== void 0 ? _submission_artist_name : submission.artists) !== null && _ref !== void 0 ? _ref : '';
            // Nếu không có tên nghệ sĩ hoặc rỗng
            if (!processedArtistName || processedArtistName.trim() === '') {
                processedArtistName = 'Various Artist';
            } else {
                // Kiểm tra nếu có nhiều hơn 3 nghệ sĩ (phân cách bằng dấu phẩy, &, hoặc feat)
                const artistSeparators = /[,&]|feat\.|featuring|ft\./gi;
                const artistCount = processedArtistName.split(artistSeparators).length;
                if (artistCount > 3) {
                    processedArtistName = 'Various Artist';
                }
            }
            var _submission_cover_art_url, _ref1, _submission_artwork_path, _ref2, _submission_imageUrl, _ref3, _ref4, _submission_audio_file_url, _ref5, _submission_file_path, _ref6, _submission_audioUrl, _ref7, _ref8, _submission_track_title, _ref9, _submission_status, _submission_genre, _submission_submission_date, _ref10;
            return {
                ...submission,
                // Nếu không có ảnh cover hoặc artwork, sử dụng ảnh mặc định
                cover_art_url: (_ref1 = (_submission_cover_art_url = submission.cover_art_url) !== null && _submission_cover_art_url !== void 0 ? _submission_cover_art_url : submission.artwork_path) !== null && _ref1 !== void 0 ? _ref1 : '/dianhac.jpg',
                artwork_path: (_ref2 = (_submission_artwork_path = submission.artwork_path) !== null && _submission_artwork_path !== void 0 ? _submission_artwork_path : submission.cover_art_url) !== null && _ref2 !== void 0 ? _ref2 : '/dianhac.jpg',
                imageUrl: (_ref4 = (_ref3 = (_submission_imageUrl = submission.imageUrl) !== null && _submission_imageUrl !== void 0 ? _submission_imageUrl : submission.cover_art_url) !== null && _ref3 !== void 0 ? _ref3 : submission.artwork_path) !== null && _ref4 !== void 0 ? _ref4 : '/dianhac.jpg',
                // Nếu không có file audio, sử dụng file mặc định
                audio_file_url: (_ref5 = (_submission_audio_file_url = submission.audio_file_url) !== null && _submission_audio_file_url !== void 0 ? _submission_audio_file_url : submission.file_path) !== null && _ref5 !== void 0 ? _ref5 : '/VNA2P25XXXXX.wav',
                file_path: (_ref6 = (_submission_file_path = submission.file_path) !== null && _submission_file_path !== void 0 ? _submission_file_path : submission.audio_file_url) !== null && _ref6 !== void 0 ? _ref6 : '/VNA2P25XXXXX.wav',
                audioUrl: (_ref8 = (_ref7 = (_submission_audioUrl = submission.audioUrl) !== null && _submission_audioUrl !== void 0 ? _submission_audioUrl : submission.audio_file_url) !== null && _ref7 !== void 0 ? _ref7 : submission.file_path) !== null && _ref8 !== void 0 ? _ref8 : '/VNA2P25XXXXX.wav',
                // Đảm bảo các trường bắt buộc với logic Various Artist
                track_title: (_ref9 = (_submission_track_title = submission.track_title) !== null && _submission_track_title !== void 0 ? _submission_track_title : submission.title) !== null && _ref9 !== void 0 ? _ref9 : 'Untitled Track',
                artist_name: processedArtistName,
                status: (_submission_status = submission.status) !== null && _submission_status !== void 0 ? _submission_status : 'pending',
                genre: (_submission_genre = submission.genre) !== null && _submission_genre !== void 0 ? _submission_genre : 'Unknown',
                submission_date: (_ref10 = (_submission_submission_date = submission.submission_date) !== null && _submission_submission_date !== void 0 ? _submission_submission_date : submission.created_at) !== null && _ref10 !== void 0 ? _ref10 : new Date().toISOString()
            };
        });
    }
    async initialize() {
        // API-based service không cần initialize database connection
        console.log("✅ Database API Service initialized (API-based)");
    }
    // ==================== AUTHENTICATION METHODS ====================
    async authenticateUser(username, password) {
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info('DatabaseApiService: Authentication attempt', {
            component: 'DatabaseApiService',
            action: 'authenticateUser',
            data: {
                username
            }
        });
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });
            const result = await response.json();
            if (result.success) {
                var _result_user, _result_user1;
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info('DatabaseApiService: Authentication successful', {
                    component: 'DatabaseApiService',
                    action: 'authenticateUser',
                    userId: (_result_user = result.user) === null || _result_user === void 0 ? void 0 : _result_user.id
                });
                console.log("✅ API authentication successful for ".concat((_result_user1 = result.user) === null || _result_user1 === void 0 ? void 0 : _result_user1.role));
                return {
                    success: true,
                    data: result.user,
                    source: "API"
                };
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('DatabaseApiService: Authentication failed', {
                    component: 'DatabaseApiService',
                    action: 'authenticateUser',
                    error: result.message
                });
                var _result_message;
                return {
                    success: false,
                    message: (_result_message = result.message) !== null && _result_message !== void 0 ? _result_message : 'Authentication failed'
                };
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('DatabaseApiService: Authentication error', {
                component: 'DatabaseApiService',
                action: 'authenticateUser',
                error: errorMessage
            });
            console.error("API auth failed:", error);
            return {
                success: false,
                message: "Authentication service unavailable.",
                error: errorMessage
            };
        }
    }
    async createUser(userData) {
        const { username, email, password, fullName } = userData;
        if (!username || !email || !password || !fullName) {
            return {
                success: false,
                message: "Missing required fields for user creation."
            };
        }
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    fullName
                })
            });
            const result = await response.json();
            if (result.success) {
                return {
                    success: true,
                    data: result.user,
                    source: "API"
                };
            } else {
                var _result_message;
                return {
                    success: false,
                    message: (_result_message = result.message) !== null && _result_message !== void 0 ? _result_message : 'User creation failed'
                };
            }
        } catch (error) {
            console.error("API createUser failed:", error);
            return {
                success: false,
                message: "User creation service unavailable."
            };
        }
    }
    // ==================== ARTIST METHODS ====================
    async getArtists() {
        try {
            const response = await fetch('/api/artists');
            const result = await response.json();
            if (result.success) {
                return {
                    success: true,
                    data: result.data,
                    source: 'API'
                };
            } else {
                var _result_error;
                return {
                    success: false,
                    data: [],
                    message: (_result_error = result.error) !== null && _result_error !== void 0 ? _result_error : "Failed to retrieve artists"
                };
            }
        } catch (error) {
            console.error('API: Failed to get artists:', error);
            return {
                success: false,
                data: [],
                message: "Artist service unavailable."
            };
        }
    }
    async updateArtistProfile(id, profileData) {
        try {
            const response = await fetch("/api/profile/update", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id,
                    role: 'Artist',
                    ...profileData
                })
            });
            const result = await response.json();
            if (result.success) {
                return {
                    success: true,
                    data: result.data,
                    source: 'API'
                };
            } else {
                var _result_error;
                return {
                    success: false,
                    message: (_result_error = result.error) !== null && _result_error !== void 0 ? _result_error : 'Artist profile update failed'
                };
            }
        } catch (error) {
            console.error('API: Failed to update artist profile:', error);
            return {
                success: false,
                message: "Artist profile update service unavailable."
            };
        }
    }
    async updateLabelManagerProfile(id, profileData) {
        try {
            const response = await fetch("/api/profile/update", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id,
                    role: 'Label Manager',
                    ...profileData
                })
            });
            const result = await response.json();
            if (result.success) {
                return {
                    success: true,
                    data: result.data,
                    source: 'API'
                };
            } else {
                var _result_error;
                return {
                    success: false,
                    message: (_result_error = result.error) !== null && _result_error !== void 0 ? _result_error : 'Label Manager profile update failed'
                };
            }
        } catch (error) {
            console.error('API: Failed to update label manager profile:', error);
            return {
                success: false,
                message: "Label Manager profile update service unavailable."
            };
        }
    }
    async getUserAvatar(userId, type) {
        try {
            const queryParams = type ? "?type=".concat(type) : '';
            const response = await fetch("/api/images/avatar/".concat(userId).concat(queryParams));
            const result = await response.json();
            if (result.success) {
                return {
                    success: true,
                    data: result.data,
                    source: 'API'
                };
            } else {
                var _result_error;
                return {
                    success: false,
                    message: (_result_error = result.error) !== null && _result_error !== void 0 ? _result_error : 'Failed to get user avatar'
                };
            }
        } catch (error) {
            console.error('API: Failed to get user avatar:', error);
            return {
                success: false,
                message: "Avatar service unavailable."
            };
        }
    }
    async updateUserAvatar(userId, avatarData) {
        try {
            const formData = new FormData();
            formData.append('file', avatarData.file);
            formData.append('artistName', avatarData.artistName);
            formData.append('userId', userId);
            const response = await fetch('/api/upload/avatar', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (result.success) {
                return {
                    success: true,
                    data: {
                        url: result.url,
                        path: result.path
                    },
                    source: 'API'
                };
            } else {
                var _result_error;
                return {
                    success: false,
                    message: (_result_error = result.error) !== null && _result_error !== void 0 ? _result_error : 'Failed to update user avatar'
                };
            }
        } catch (error) {
            console.error('API: Failed to update user avatar:', error);
            return {
                success: false,
                message: "Avatar update service unavailable."
            };
        }
    }
    // ==================== SUBMISSION METHODS ====================
    async getSubmissions(username) {
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info('DatabaseApiService: Getting submissions', {
            component: 'DatabaseApiService',
            action: 'getSubmissions',
            data: {
                username
            }
        });
        try {
            const queryParams = username ? "?username=".concat(username) : '';
            const response = await fetch("/api/submissions".concat(queryParams));
            const result = await response.json();
            if (result.success) {
                const normalized = this.normalizeSubmissions(result.data);
                return {
                    success: true,
                    data: normalized,
                    source: 'API'
                };
            } else {
                var _result_error;
                return {
                    success: false,
                    data: [],
                    message: (_result_error = result.error) !== null && _result_error !== void 0 ? _result_error : "Failed to retrieve submissions"
                };
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('DatabaseApiService: Get submissions error', {
                component: 'DatabaseApiService',
                action: 'getSubmissions',
                error: errorMessage
            });
            console.error('API: Failed to get submissions:', error);
            return {
                success: false,
                data: [],
                message: "Submission service unavailable.",
                error: errorMessage
            };
        }
    }
    async getSubmissionById(id) {
        try {
            const response = await fetch("/api/submissions/".concat(id));
            const result = await response.json();
            if (result.success) {
                return {
                    success: true,
                    data: result.data,
                    source: 'API'
                };
            } else {
                var _result_error;
                return {
                    success: false,
                    message: (_result_error = result.error) !== null && _result_error !== void 0 ? _result_error : 'Failed to get submission'
                };
            }
        } catch (error) {
            console.error('API: Failed to get submission by ID:', error);
            return {
                success: false,
                message: "Submission service unavailable."
            };
        }
    }
    async createSubmission(submission) {
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info('DatabaseApiService: Creating submission', {
            component: 'DatabaseApiService',
            action: 'createSubmission'
        });
        try {
            const response = await fetch('/api/submissions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submission)
            });
            const result = await response.json();
            if (result.success) {
                var _result_data;
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info('DatabaseApiService: Submission created', {
                    component: 'DatabaseApiService',
                    action: 'createSubmission',
                    submissionId: (_result_data = result.data) === null || _result_data === void 0 ? void 0 : _result_data.id
                });
                return {
                    success: true,
                    data: result.data,
                    source: 'API'
                };
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('DatabaseApiService: Create submission failed', {
                    component: 'DatabaseApiService',
                    action: 'createSubmission',
                    error: result.error
                });
                var _result_error;
                return {
                    success: false,
                    message: (_result_error = result.error) !== null && _result_error !== void 0 ? _result_error : 'Create submission failed'
                };
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('DatabaseApiService: Create submission error', {
                component: 'DatabaseApiService',
                action: 'createSubmission',
                error: errorMessage
            });
            return {
                success: false,
                message: "Create submission service unavailable.",
                error: errorMessage
            };
        }
    }
    async saveSubmission(submission) {
        // Alias for createSubmission for backward compatibility
        const result = await this.createSubmission(submission);
        if (result.success && result.data) {
            return {
                success: true,
                data: result.data.id,
                source: result.source
            };
        }
        return {
            success: false,
            error: result.message
        };
    }
    async updateSubmission(id, updateData) {
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info('DatabaseApiService: Updating submission', {
            component: 'DatabaseApiService',
            action: 'updateSubmission',
            data: {
                id
            }
        });
        try {
            const response = await fetch("/api/submissions/".concat(id), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });
            const result = await response.json();
            if (result.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info('DatabaseApiService: Submission updated', {
                    component: 'DatabaseApiService',
                    action: 'updateSubmission',
                    submissionId: id
                });
                return {
                    success: true,
                    data: result.data,
                    source: 'API'
                };
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('DatabaseApiService: Submission update failed', {
                    component: 'DatabaseApiService',
                    action: 'updateSubmission',
                    error: result.error
                });
                var _result_error;
                return {
                    success: false,
                    message: (_result_error = result.error) !== null && _result_error !== void 0 ? _result_error : 'Update failed'
                };
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('DatabaseApiService: Update submission error', {
                component: 'DatabaseApiService',
                action: 'updateSubmission',
                error: errorMessage
            });
            console.error('API: Failed to update submission:', error);
            return {
                success: false,
                message: "Update service unavailable.",
                error: errorMessage
            };
        }
    }
    async updateSubmissionStatus(id, status) {
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info('DatabaseApiService: Updating submission status', {
            component: 'DatabaseApiService',
            action: 'updateSubmissionStatus',
            data: {
                id,
                status
            }
        });
        try {
            const response = await fetch("/api/submissions/".concat(id), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status
                })
            });
            const result = await response.json();
            if (result.success) {
                return {
                    success: true,
                    data: true,
                    source: 'API'
                };
            } else {
                var _result_error;
                return {
                    success: false,
                    message: (_result_error = result.error) !== null && _result_error !== void 0 ? _result_error : 'Update status failed'
                };
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('DatabaseApiService: Update submission status error', {
                component: 'DatabaseApiService',
                action: 'updateSubmissionStatus',
                error: errorMessage
            });
            return {
                success: false,
                message: "Update status service unavailable.",
                error: errorMessage
            };
        }
    }
    async deleteSubmission(id) {
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info('DatabaseApiService: Deleting submission', {
            component: 'DatabaseApiService',
            action: 'deleteSubmission',
            data: {
                id
            }
        });
        try {
            const response = await fetch("/api/submissions/".concat(id), {
                method: 'DELETE'
            });
            const result = await response.json();
            if (result.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info('DatabaseApiService: Submission deleted', {
                    component: 'DatabaseApiService',
                    action: 'deleteSubmission',
                    submissionId: id
                });
                return {
                    success: true,
                    data: true,
                    source: 'API'
                };
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('DatabaseApiService: Submission deletion failed', {
                    component: 'DatabaseApiService',
                    action: 'deleteSubmission',
                    error: result.error
                });
                var _result_error;
                return {
                    success: false,
                    message: (_result_error = result.error) !== null && _result_error !== void 0 ? _result_error : 'Deletion failed'
                };
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('DatabaseApiService: Delete submission error', {
                component: 'DatabaseApiService',
                action: 'deleteSubmission',
                error: errorMessage
            });
            return {
                success: false,
                message: "Delete service unavailable.",
                error: errorMessage
            };
        }
    }
    // ==================== TRACK METHODS (NEW PRISMA-COMPATIBLE) ====================
    /**
   * Create a new track for a submission
   */ async createTrack(trackData) {
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info('DatabaseApiService: Creating track', {
            component: 'DatabaseApiService',
            action: 'createTrack',
            data: {
                submissionId: trackData.submissionId,
                title: trackData.title
            }
        });
        try {
            const response = await fetch('/api/tracks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(trackData)
            });
            const result = await response.json();
            if (result.success) {
                var _result_data;
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info('DatabaseApiService: Track created', {
                    component: 'DatabaseApiService',
                    action: 'createTrack',
                    trackId: (_result_data = result.data) === null || _result_data === void 0 ? void 0 : _result_data.id
                });
                return {
                    success: true,
                    data: result.data,
                    source: 'API'
                };
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('DatabaseApiService: Create track failed', {
                    component: 'DatabaseApiService',
                    action: 'createTrack',
                    error: result.error
                });
                var _result_error;
                return {
                    success: false,
                    message: (_result_error = result.error) !== null && _result_error !== void 0 ? _result_error : 'Create track failed'
                };
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('DatabaseApiService: Create track error', {
                component: 'DatabaseApiService',
                action: 'createTrack',
                error: errorMessage
            });
            return {
                success: false,
                message: "Create track service unavailable.",
                error: errorMessage
            };
        }
    }
    /**
   * Update an existing track
   */ async updateTrack(trackId, updateData) {
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info('DatabaseApiService: Updating track', {
            component: 'DatabaseApiService',
            action: 'updateTrack',
            data: {
                trackId
            }
        });
        try {
            const response = await fetch("/api/tracks/".concat(trackId), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });
            const result = await response.json();
            if (result.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info('DatabaseApiService: Track updated', {
                    component: 'DatabaseApiService',
                    action: 'updateTrack',
                    trackId: trackId
                });
                return {
                    success: true,
                    data: result.data,
                    source: 'API'
                };
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('DatabaseApiService: Track update failed', {
                    component: 'DatabaseApiService',
                    action: 'updateTrack',
                    error: result.error
                });
                var _result_error;
                return {
                    success: false,
                    message: (_result_error = result.error) !== null && _result_error !== void 0 ? _result_error : 'Update track failed'
                };
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('DatabaseApiService: Update track error', {
                component: 'DatabaseApiService',
                action: 'updateTrack',
                error: errorMessage
            });
            return {
                success: false,
                message: "Update track service unavailable.",
                error: errorMessage
            };
        }
    }
    /**
   * Get all tracks for a specific submission
   */ async getTracksBySubmissionId(submissionId) {
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info('DatabaseApiService: Getting tracks by submission ID', {
            component: 'DatabaseApiService',
            action: 'getTracksBySubmissionId',
            data: {
                submissionId
            }
        });
        try {
            const response = await fetch("/api/submissions/".concat(submissionId, "/tracks"));
            const result = await response.json();
            if (result.success) {
                return {
                    success: true,
                    data: result.data,
                    source: 'API'
                };
            } else {
                var _result_error;
                return {
                    success: false,
                    data: [],
                    message: (_result_error = result.error) !== null && _result_error !== void 0 ? _result_error : 'Failed to get tracks'
                };
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('DatabaseApiService: Get tracks by submission ID error', {
                component: 'DatabaseApiService',
                action: 'getTracksBySubmissionId',
                error: errorMessage
            });
            return {
                success: false,
                data: [],
                message: "Get tracks service unavailable.",
                error: errorMessage
            };
        }
    }
    /**
   * Get a specific track by ID
   */ async getTrackById(trackId) {
        try {
            const response = await fetch("/api/tracks/".concat(trackId));
            const result = await response.json();
            if (result.success) {
                return {
                    success: true,
                    data: result.data,
                    source: 'API'
                };
            } else {
                var _result_error;
                return {
                    success: false,
                    message: (_result_error = result.error) !== null && _result_error !== void 0 ? _result_error : 'Failed to get track'
                };
            }
        } catch (error) {
            console.error('API: Failed to get track by ID:', error);
            return {
                success: false,
                message: "Track service unavailable."
            };
        }
    }
    /**
   * Delete a track
   */ async deleteTrack(trackId) {
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info('DatabaseApiService: Deleting track', {
            component: 'DatabaseApiService',
            action: 'deleteTrack',
            data: {
                trackId
            }
        });
        try {
            const response = await fetch("/api/tracks/".concat(trackId), {
                method: 'DELETE'
            });
            const result = await response.json();
            if (result.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info('DatabaseApiService: Track deleted', {
                    component: 'DatabaseApiService',
                    action: 'deleteTrack',
                    trackId: trackId
                });
                return {
                    success: true,
                    data: true,
                    source: 'API'
                };
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('DatabaseApiService: Track deletion failed', {
                    component: 'DatabaseApiService',
                    action: 'deleteTrack',
                    error: result.error
                });
                var _result_error;
                return {
                    success: false,
                    message: (_result_error = result.error) !== null && _result_error !== void 0 ? _result_error : 'Track deletion failed'
                };
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('DatabaseApiService: Delete track error', {
                component: 'DatabaseApiService',
                action: 'deleteTrack',
                error: errorMessage
            });
            return {
                success: false,
                message: "Delete track service unavailable.",
                error: errorMessage
            };
        }
    }
    /**
   * Create submission with tracks in a transaction (Prisma-compatible)
   */ async createSubmissionWithTracks(submissionData, tracksData) {
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info('DatabaseApiService: Creating submission with tracks', {
            component: 'DatabaseApiService',
            action: 'createSubmissionWithTracks',
            data: {
                title: submissionData.title,
                trackCount: tracksData.length
            }
        });
        try {
            const response = await fetch('/api/submissions/with-tracks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    submission: submissionData,
                    tracks: tracksData
                })
            });
            const result = await response.json();
            if (result.success) {
                var _result_data_submission, _result_data;
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info('DatabaseApiService: Submission with tracks created', {
                    component: 'DatabaseApiService',
                    action: 'createSubmissionWithTracks',
                    submissionId: (_result_data = result.data) === null || _result_data === void 0 ? void 0 : (_result_data_submission = _result_data.submission) === null || _result_data_submission === void 0 ? void 0 : _result_data_submission.id
                });
                return {
                    success: true,
                    data: result.data,
                    source: 'API'
                };
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('DatabaseApiService: Create submission with tracks failed', {
                    component: 'DatabaseApiService',
                    action: 'createSubmissionWithTracks',
                    error: result.error
                });
                var _result_error;
                return {
                    success: false,
                    message: (_result_error = result.error) !== null && _result_error !== void 0 ? _result_error : 'Create submission with tracks failed'
                };
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('DatabaseApiService: Create submission with tracks error', {
                component: 'DatabaseApiService',
                action: 'createSubmissionWithTracks',
                error: errorMessage
            });
            return {
                success: false,
                message: "Create submission with tracks service unavailable.",
                error: errorMessage
            };
        }
    }
    /**
   * Helper method to create submission from legacy format (backward compatibility)
   */ async createSubmissionFromLegacy(legacySubmission) {
        try {
            const { submission, tracks } = convertLegacySubmissionToPrisma(legacySubmission);
            return await this.createSubmissionWithTracks(submission, tracks);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('DatabaseApiService: Create submission from legacy error', {
                component: 'DatabaseApiService',
                action: 'createSubmissionFromLegacy',
                error: errorMessage
            });
            return {
                success: false,
                message: "Legacy submission conversion failed.",
                error: errorMessage
            };
        }
    }
    // ==================== VIDEO METHODS ====================
    async getVideos(filter) {
        try {
            const queryParams = filter ? "?".concat(new URLSearchParams(filter).toString()) : '';
            const response = await fetch("/api/videos".concat(queryParams));
            const result = await response.json();
            var _result_error;
            return result.success ? {
                success: true,
                data: result.data,
                source: 'API'
            } : {
                success: false,
                data: [],
                message: (_result_error = result.error) !== null && _result_error !== void 0 ? _result_error : 'Failed to get videos'
            };
        } catch (error) {
            console.error('API: Failed to get videos:', error);
            return {
                success: false,
                data: [],
                message: "Video service unavailable."
            };
        }
    }
    async saveVideo(video) {
        try {
            var _result_data;
            const response = await fetch('/api/videos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(video)
            });
            const result = await response.json();
            var _result_error;
            return result.success ? {
                success: true,
                data: (_result_data = result.data) === null || _result_data === void 0 ? void 0 : _result_data.id,
                source: 'API'
            } : {
                success: false,
                message: (_result_error = result.error) !== null && _result_error !== void 0 ? _result_error : 'Save video failed'
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                success: false,
                message: "Save video service unavailable.",
                error: errorMessage
            };
        }
    }
    // ==================== FILE EXPLORER METHODS ====================
    async getFiles(folderId) {
        try {
            const queryParams = folderId ? "?folderId=".concat(folderId) : '';
            const response = await fetch("/api/files".concat(queryParams));
            const result = await response.json();
            var _result_error;
            return result.success ? {
                success: true,
                data: result.data,
                source: 'API'
            } : {
                success: false,
                data: [],
                message: (_result_error = result.error) !== null && _result_error !== void 0 ? _result_error : 'Failed to get files'
            };
        } catch (error) {
            console.error('API: Failed to get files:', error);
            return {
                success: false,
                data: [],
                message: "File service unavailable."
            };
        }
    }
    async getFolders(parentId) {
        try {
            const queryParams = parentId ? "?parentId=".concat(parentId) : '';
            const response = await fetch("/api/folders".concat(queryParams));
            const result = await response.json();
            var _result_error;
            return result.success ? {
                success: true,
                data: result.data,
                source: 'API'
            } : {
                success: false,
                data: [],
                message: (_result_error = result.error) !== null && _result_error !== void 0 ? _result_error : 'Failed to get folders'
            };
        } catch (error) {
            console.error('API: Failed to get folders:', error);
            return {
                success: false,
                data: [],
                message: "Folder service unavailable."
            };
        }
    }
    // ==================== SYSTEM METHODS ====================
    async getStatus() {
        try {
            const response = await fetch('/api/database-status');
            const result = await response.json();
            return {
                api: this.apiAvailable,
                prisma: result.success,
                database: result.success
            };
        } catch (error) {
            console.error('API: Failed to get status:', error);
            return {
                api: false,
                prisma: false,
                database: false
            };
        }
    }
    async testConnection() {
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info('DatabaseApiService: Testing connection', {
            component: 'DatabaseApiService',
            action: 'testConnection'
        });
        try {
            const response = await fetch('/api/database-status');
            const result = await response.json();
            return {
                success: result.success,
                data: result.success,
                source: 'API'
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('❌ Database connection test failed:', errorMessage);
            return {
                success: false,
                message: "Connection test failed.",
                error: errorMessage
            };
        }
    }
    constructor(){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "apiAvailable", true);
        console.log('DatabaseApiService: Initialized (Production Only - API Based)');
    }
}
const databaseApiService = new DatabaseApiService();
const databaseService = databaseApiService;
const multiDB = databaseApiService;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/lib/authorization-service.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// Active: 1750877192019@@ep-mute - rice - a17ojtca - pooler.ap - southeast - 1.aws.neon.tech@5732@aksstudio
// Tôi là An Kun
// Hỗ trợ dự án, Copilot, Gemini
// Tác giả kiêm xuất bản bởi An Kun Studio Digital Music
__turbopack_context__.s({
    "AuthorizationService": ()=>AuthorizationService,
    "SubmissionStatus": ()=>SubmissionStatus,
    "UserRole": ()=>UserRole
});
var UserRole = /*#__PURE__*/ function(UserRole) {
    UserRole["LABEL_MANAGER"] = "Label Manager";
    UserRole["ARTIST"] = "Artist";
    return UserRole;
}({});
var SubmissionStatus = /*#__PURE__*/ function(SubmissionStatus) {
    SubmissionStatus["PENDING"] = "pending";
    SubmissionStatus["APPROVED"] = "approved";
    SubmissionStatus["REJECTED"] = "rejected";
    SubmissionStatus["PUBLISHED"] = "published";
    SubmissionStatus["CANCELLED"] = "cancelled";
    return SubmissionStatus;
}({});
class AuthorizationService {
    // Kiểm tra quyền truy cập submissions
    static canViewSubmission(user, submission) {
        // Label Manager có quyền xem tất cả submissions
        if (user.role === "Label Manager") {
            return {
                allowed: true
            };
        }
        // Artist chỉ được xem submissions của mình
        if (user.role === "Artist") {
            if (submission.artist_id === user.id || submission.user_id === user.id) {
                return {
                    allowed: true
                };
            }
            return {
                allowed: false,
                reason: "Artists can only view their own submissions"
            };
        }
        return {
            allowed: false,
            reason: "Unauthorized role"
        };
    }
    // Kiểm tra quyền chỉnh sửa submissions
    static canEditSubmission(user, submission) {
        // Label Manager có quyền chỉnh sửa tất cả submissions
        if (user.role === "Label Manager") {
            return {
                allowed: true
            };
        }
        // Artist chỉ được chỉnh sửa submissions của mình khi còn status "pending"
        if (user.role === "Artist") {
            // Kiểm tra xem có phải submission của artist này không
            if (submission.artist_id !== user.id && submission.user_id !== user.id) {
                return {
                    allowed: false,
                    reason: "Artists can only edit their own submissions"
                };
            }
            // Kiểm tra status - chỉ cho phép chỉnh sửa khi còn "pending"
            if (submission.status !== "pending") {
                return {
                    allowed: false,
                    reason: "Artists can only edit submissions that are still pending approval"
                };
            }
            return {
                allowed: true
            };
        }
        return {
            allowed: false,
            reason: "Unauthorized role"
        };
    }
    // Kiểm tra quyền xóa submissions
    static canDeleteSubmission(user) {
        // Chỉ Label Manager mới có quyền xóa
        if (user.role === "Label Manager") {
            return {
                allowed: true
            };
        }
        return {
            allowed: false,
            reason: "Only Label Managers can delete submissions"
        };
    }
    // Kiểm tra quyền truy cập system settings
    static canAccessSystemSettings(user) {
        if (user.role === "Label Manager") {
            return {
                allowed: true
            };
        }
        return {
            allowed: false,
            reason: "Only Label Managers can access system settings"
        };
    }
    // Kiểm tra quyền sử dụng Debug Tools
    static canUseDebugTools(user) {
        if (user.role === "Label Manager") {
            return {
                allowed: true
            };
        }
        return {
            allowed: false,
            reason: "Only Label Managers can use debug tools"
        };
    }
    // Kiểm tra quyền xem thống kê tổng quan
    static canViewFullStatistics(user) {
        if (user.role === "Label Manager") {
            return {
                allowed: true
            };
        }
        return {
            allowed: false,
            reason: "Only Label Managers can view full statistics"
        };
    }
    // Kiểm tra quyền approve/reject submissions
    static canApproveRejectSubmission(user) {
        if (user.role === "Label Manager") {
            return {
                allowed: true
            };
        }
        return {
            allowed: false,
            reason: "Only Label Managers can approve or reject submissions"
        };
    }
    // Kiểm tra quyền resubmit sau khi bị reject
    static canResubmitAfterRejection(user, submission) {
        // Chỉ artist và submission phải ở trạng thái rejected
        if (user.role !== "Artist") {
            return {
                allowed: false,
                reason: "Only artists can resubmit rejected submissions"
            };
        }
        if (submission.artist_id !== user.id && submission.user_id !== user.id) {
            return {
                allowed: false,
                reason: "Artists can only resubmit their own submissions"
            };
        }
        if (submission.status !== "rejected") {
            return {
                allowed: false,
                reason: "Can only resubmit rejected submissions"
            };
        }
        return {
            allowed: true
        };
    }
    // Kiểm tra ngày phát hành hợp lệ
    static validateReleaseDate(user, submission, releaseDate) {
        var _submission_submission_date, _ref;
        const submissionDate = new Date((_ref = (_submission_submission_date = submission.submission_date) !== null && _submission_submission_date !== void 0 ? _submission_submission_date : submission.created_at) !== null && _ref !== void 0 ? _ref : new Date());
        const requestedDate = new Date(releaseDate);
        // Nếu là bản đã phát hành (published), cho phép chọn ngày trong quá khứ
        if (submission.status === "published") {
            return {
                allowed: true
            };
        }
        // Nếu là bản mới, chỉ cho phép từ ngày submit đến +2 ngày
        const minDate = submissionDate;
        const maxDate = new Date(submissionDate.getTime() + 2 * 24 * 60 * 60 * 1000) // +2 ngày
        ;
        if (requestedDate < minDate || requestedDate > maxDate) {
            return {
                allowed: false,
                reason: "Release date must be between ".concat(minDate.toDateString(), " and ").concat(maxDate.toDateString())
            };
        }
        return {
            allowed: true
        };
    }
    // Filter submissions dựa trên quyền của user
    static filterSubmissionsForUser(user, submissions) {
        if (user.role === "Label Manager") {
            // Label Manager xem được tất cả
            return submissions;
        }
        if (user.role === "Artist") {
            // Artist chỉ xem được submissions của mình
            return submissions.filter((submission)=>submission.artist_id === user.id || submission.user_id === user.id);
        }
        return [];
    }
    // Generate statistics cho user dựa trên quyền
    static generateUserStatistics(user, submissions) {
        const userSubmissions = this.filterSubmissionsForUser(user, submissions);
        const stats = {
            total: userSubmissions.length,
            pending: userSubmissions.filter((s)=>s.status === "pending").length,
            approved: userSubmissions.filter((s)=>s.status === "approved").length,
            rejected: userSubmissions.filter((s)=>s.status === "rejected").length,
            published: userSubmissions.filter((s)=>s.status === "published").length,
            cancelled: userSubmissions.filter((s)=>s.status === "cancelled").length
        };
        if (user.role === "Label Manager") {
            // Label Manager có thêm thống kê tổng quan
            return {
                ...stats,
                userRole: "Label Manager",
                canViewAll: true,
                totalArtists: [
                    ...new Set(submissions.map((s)=>{
                        var _s_artist_id;
                        return (_s_artist_id = s.artist_id) !== null && _s_artist_id !== void 0 ? _s_artist_id : s.user_id;
                    }))
                ].length,
                recentSubmissions: submissions.slice(0, 10)
            };
        }
        return {
            ...stats,
            userRole: "Artist",
            canViewAll: false,
            artistName: user.fullName
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/types/submission.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "PrismaApprovalType": ()=>PrismaApprovalType,
    "PrismaContributorRole": ()=>PrismaContributorRole,
    "PrismaFileCategory": ()=>PrismaFileCategory,
    "PrismaReleaseType": ()=>PrismaReleaseType,
    "PrismaSubmissionStatus": ()=>PrismaSubmissionStatus,
    "PrismaUserRole": ()=>PrismaUserRole,
    "convertLegacySubmissionToPrisma": ()=>convertLegacySubmissionToPrisma,
    "convertPrismaSubmissionToLegacy": ()=>convertPrismaSubmissionToLegacy,
    "fromSimpleSubmission": ()=>fromSimpleSubmission,
    "getStatusColor": ()=>getStatusColor,
    "getStatusText": ()=>getStatusText,
    "toSimpleSubmission": ()=>toSimpleSubmission
});
var PrismaUserRole = /*#__PURE__*/ function(PrismaUserRole) {
    PrismaUserRole["ARTIST"] = "ARTIST";
    PrismaUserRole["COMPOSER"] = "COMPOSER";
    PrismaUserRole["PRODUCER"] = "PRODUCER";
    PrismaUserRole["PERFORMER"] = "PERFORMER";
    PrismaUserRole["LABEL_MANAGER"] = "LABEL_MANAGER";
    PrismaUserRole["ADMINISTRATOR"] = "ADMINISTRATOR";
    return PrismaUserRole;
}({});
var PrismaSubmissionStatus = /*#__PURE__*/ function(PrismaSubmissionStatus) {
    PrismaSubmissionStatus["PENDING"] = "PENDING";
    PrismaSubmissionStatus["APPROVED"] = "APPROVED";
    PrismaSubmissionStatus["REJECTED"] = "REJECTED";
    PrismaSubmissionStatus["PROCESSING"] = "PROCESSING";
    PrismaSubmissionStatus["PUBLISHED"] = "PUBLISHED";
    PrismaSubmissionStatus["CANCELLED"] = "CANCELLED";
    PrismaSubmissionStatus["DRAFT"] = "DRAFT";
    return PrismaSubmissionStatus;
}({});
var PrismaReleaseType = /*#__PURE__*/ function(PrismaReleaseType) {
    PrismaReleaseType["SINGLE"] = "SINGLE";
    PrismaReleaseType["EP"] = "EP";
    PrismaReleaseType["ALBUM"] = "ALBUM";
    PrismaReleaseType["COMPILATION"] = "COMPILATION";
    return PrismaReleaseType;
}({});
var PrismaContributorRole = /*#__PURE__*/ function(PrismaContributorRole) {
    PrismaContributorRole["COMPOSER"] = "COMPOSER";
    PrismaContributorRole["LYRICIST"] = "LYRICIST";
    PrismaContributorRole["PRODUCER"] = "PRODUCER";
    PrismaContributorRole["PERFORMER"] = "PERFORMER";
    PrismaContributorRole["VOCALIST"] = "VOCALIST";
    PrismaContributorRole["RAPPER"] = "RAPPER";
    return PrismaContributorRole;
}({});
var PrismaApprovalType = /*#__PURE__*/ function(PrismaApprovalType) {
    PrismaApprovalType["DSP"] = "DSP";
    PrismaApprovalType["CONTENT_ID"] = "CONTENT_ID";
    PrismaApprovalType["ACR_CLOUD"] = "ACR_CLOUD";
    PrismaApprovalType["LABEL_REVIEW"] = "LABEL_REVIEW";
    return PrismaApprovalType;
}({});
var PrismaFileCategory = /*#__PURE__*/ function(PrismaFileCategory) {
    PrismaFileCategory["AUDIO"] = "AUDIO";
    PrismaFileCategory["VIDEO"] = "VIDEO";
    PrismaFileCategory["IMAGE"] = "IMAGE";
    PrismaFileCategory["DOCUMENT"] = "DOCUMENT";
    PrismaFileCategory["OTHER"] = "OTHER";
    return PrismaFileCategory;
}({});
function getStatusColor(status) {
    switch(status){
        case "Đã nhận, đang chờ duyệt":
            return "bg-yellow-600 text-yellow-100";
        case "Đã duyệt, từ chối phát hành":
            return "bg-red-600 text-red-100";
        case "Đã duyệt, đang chờ phát hành!":
            return "bg-blue-600 text-blue-100";
        case "Đã phát hành, đang chờ ra mắt":
            return "bg-purple-600 text-purple-100";
        case "Hoàn thành phát hành!":
            return "bg-green-600 text-green-100";
        case "pending":
            return "bg-yellow-600 text-yellow-100";
        case "approved":
            return "bg-blue-600 text-blue-100";
        case "rejected":
            return "bg-red-600 text-red-100";
        case "processing":
            return "bg-purple-600 text-purple-100";
        case "published":
            return "bg-green-600 text-green-100";
        case "draft":
            return "bg-gray-600 text-gray-100";
        default:
            return "bg-gray-600 text-gray-100";
    }
}
function getStatusText(status) {
    switch(status){
        case "pending":
            return "Đã nhận, đang chờ duyệt";
        case "approved":
            return "Đã duyệt, đang chờ phát hành!";
        case "rejected":
            return "Đã duyệt, từ chối phát hành";
        case "processing":
            return "Đã phát hành, đang chờ ra mắt";
        case "published":
            return "Hoàn thành phát hành!";
        case "cancelled":
            return "Đã hủy";
        case "draft":
            return "Bản nháp";
        default:
            return status;
    }
}
function toSimpleSubmission(submission) {
    return {
        id: submission.id,
        track_title: submission.songTitle,
        artist_name: submission.artistName,
        artist_id: submission.userId,
        user_id: submission.userId,
        status: submission.status,
        genre: submission.mainCategory,
        submission_date: submission.submissionDate,
        created_at: submission.createdAt,
        updated_at: submission.updatedAt,
        cover_art_url: submission.imageUrl,
        artwork_path: submission.imageFile,
        imageUrl: submission.imageUrl,
        audio_file_url: submission.audioUrl,
        file_path: submission.audioUrl,
        audioUrl: submission.audioUrl,
        release_date: submission.releaseDate,
        upc: submission.upc,
        rejection_reason: submission.rejectionReason,
        isrc_code: submission.isrc
    };
}
function fromSimpleSubmission(simple, userId) {
    return {
        id: simple.id,
        songTitle: simple.track_title,
        artistName: simple.artist_name,
        userId: userId,
        status: simple.status,
        mainCategory: simple.genre,
        submissionDate: simple.submission_date,
        createdAt: simple.created_at,
        updatedAt: simple.updated_at,
        imageUrl: simple.imageUrl || simple.cover_art_url || '',
        imageFile: simple.artwork_path || '',
        audioUrl: simple.audioUrl || simple.audio_file_url,
        releaseDate: simple.release_date || '',
        upc: simple.upc,
        rejectionReason: simple.rejection_reason,
        isrc: simple.isrc_code || ''
    };
}
function convertLegacySubmissionToPrisma(legacySubmission) {
    var _legacySubmission_trackInfos;
    // Convert legacy status to Prisma status
    const statusMap = {
        'pending': "PENDING",
        'approved': "APPROVED",
        'rejected': "REJECTED",
        'processing': "PROCESSING",
        'published': "PUBLISHED",
        'cancelled': "CANCELLED",
        'draft': "DRAFT",
        'Đã nhận, đang chờ duyệt': "PENDING",
        'Đã duyệt, từ chối phát hành': "REJECTED",
        'Đã duyệt, đang chờ phát hành!': "APPROVED",
        'Đã phát hành, đang chờ ra mắt': "PROCESSING",
        'Hoàn thành phát hành!': "PUBLISHED",
        'Đã hủy': "CANCELLED",
        'Bản nháp': "DRAFT"
    };
    // Convert legacy release type to Prisma release type
    const releaseTypeMap = {
        'single': "SINGLE",
        'ep': "EP",
        'lp': "ALBUM",
        'album': "ALBUM",
        'compilation': "COMPILATION"
    };
    const prismaSubmission = {
        id: legacySubmission.id,
        title: legacySubmission.songTitle,
        artist: legacySubmission.artistName,
        upc: legacySubmission.upc || null,
        type: releaseTypeMap[legacySubmission.releaseType] || "SINGLE",
        coverImagePath: legacySubmission.imageFile || legacySubmission.imageUrl,
        releaseDate: new Date(legacySubmission.releaseDate),
        status: statusMap[legacySubmission.status] || "PENDING",
        metadataLocked: legacySubmission.metadataLocked || false,
        published: legacySubmission.published || false,
        albumName: legacySubmission.albumName || null,
        mainCategory: legacySubmission.mainCategory || null,
        subCategory: legacySubmission.subCategory || null,
        platforms: legacySubmission.platforms ? {
            platforms: legacySubmission.platforms
        } : null,
        distributionLink: legacySubmission.distributionLink || null,
        distributionPlatforms: legacySubmission.distributionPlatforms ? {
            platforms: legacySubmission.distributionPlatforms
        } : null,
        statusVietnamese: legacySubmission.statusVietnamese || null,
        rejectionReason: legacySubmission.rejectionReason || null,
        notes: legacySubmission.notes || null,
        userId: legacySubmission.userId,
        labelId: legacySubmission.labelId || '' // This should be provided by the caller
    };
    const prismaTracks = ((_legacySubmission_trackInfos = legacySubmission.trackInfos) === null || _legacySubmission_trackInfos === void 0 ? void 0 : _legacySubmission_trackInfos.map((trackInfo)=>({
            title: trackInfo.songTitle,
            artist: trackInfo.artistName,
            filePath: trackInfo.filePath || '',
            duration: trackInfo.duration || 0,
            isrc: trackInfo.isrc || null,
            fileName: trackInfo.fileName || null,
            artistFullName: trackInfo.artistFullName || null,
            fileSize: trackInfo.fileSize || null,
            format: trackInfo.format || null,
            bitrate: trackInfo.bitrate || null,
            sampleRate: trackInfo.sampleRate || null
        }))) || [];
    return {
        submission: prismaSubmission,
        tracks: prismaTracks
    };
}
function convertPrismaSubmissionToLegacy(prismaSubmission, prismaTracks) {
    var _prismaTracks_, _prismaTracks_1;
    // Convert Prisma status back to legacy status
    const statusMap = {
        ["PENDING"]: 'Đã nhận, đang chờ duyệt',
        ["APPROVED"]: 'Đã duyệt, đang chờ phát hành!',
        ["REJECTED"]: 'Đã duyệt, từ chối phát hành',
        ["PROCESSING"]: 'Đã phát hành, đang chờ ra mắt',
        ["PUBLISHED"]: 'Hoàn thành phát hành!',
        ["CANCELLED"]: 'Đã hủy',
        ["DRAFT"]: 'Bản nháp'
    };
    // Convert Prisma release type back to legacy release type
    const releaseTypeMap = {
        ["SINGLE"]: 'single',
        ["EP"]: 'ep',
        ["ALBUM"]: 'album',
        ["COMPILATION"]: 'compilation'
    };
    const trackInfos = prismaTracks.map((track)=>({
            id: track.id,
            fileName: track.fileName || '',
            songTitle: track.title,
            artistName: track.artist,
            artistFullName: track.artistFullName || '',
            additionalArtists: [],
            isrc: track.isrc || '',
            duration: track.duration,
            fileSize: track.fileSize || undefined,
            format: track.format || undefined,
            bitrate: track.bitrate || undefined,
            sampleRate: track.sampleRate || undefined,
            filePath: track.filePath
        }));
    const legacySubmission = {
        id: prismaSubmission.id,
        isrc: ((_prismaTracks_ = prismaTracks[0]) === null || _prismaTracks_ === void 0 ? void 0 : _prismaTracks_.isrc) || '',
        upc: prismaSubmission.upc || undefined,
        uploaderUsername: '',
        artistName: prismaSubmission.artist,
        songTitle: prismaSubmission.title,
        albumName: prismaSubmission.albumName || undefined,
        userEmail: '',
        imageFile: prismaSubmission.coverImagePath,
        imageUrl: prismaSubmission.coverImagePath,
        audioUrl: ((_prismaTracks_1 = prismaTracks[0]) === null || _prismaTracks_1 === void 0 ? void 0 : _prismaTracks_1.filePath) || undefined,
        audioUrls: prismaTracks.map((track)=>track.filePath),
        videoUrl: undefined,
        videoFile: undefined,
        audioFilesCount: prismaTracks.length,
        submissionDate: prismaSubmission.createdAt.toISOString(),
        status: statusMap[prismaSubmission.status],
        mainCategory: prismaSubmission.mainCategory || 'other_main',
        subCategory: prismaSubmission.subCategory || undefined,
        releaseType: releaseTypeMap[prismaSubmission.type],
        isCopyrightOwner: 'yes',
        hasBeenReleased: 'no',
        platforms: [],
        hasLyrics: 'no',
        lyrics: undefined,
        notes: prismaSubmission.notes || undefined,
        fullName: '',
        artistRole: 'singer',
        additionalArtists: [],
        trackInfos: trackInfos,
        releaseDate: prismaSubmission.releaseDate.toISOString(),
        titleStyle: undefined,
        albumStyle: undefined,
        userId: prismaSubmission.userId,
        distributionLink: prismaSubmission.distributionLink || undefined,
        distributionPlatforms: prismaSubmission.distributionPlatforms ? prismaSubmission.distributionPlatforms.platforms : undefined,
        title: prismaSubmission.title,
        artist: prismaSubmission.artist,
        coverImagePath: prismaSubmission.coverImagePath,
        metadataLocked: prismaSubmission.metadataLocked,
        published: prismaSubmission.published,
        statusVietnamese: prismaSubmission.statusVietnamese || undefined,
        rejectionReason: prismaSubmission.rejectionReason || undefined,
        labelId: prismaSubmission.labelId,
        videos: [],
        contributors: [],
        createdAt: prismaSubmission.createdAt.toISOString(),
        updatedAt: prismaSubmission.updatedAt.toISOString()
    };
    return legacySubmission;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/hooks/use-user.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// Active: 1750877192019@@ep-mute - rice - a17ojtca - pooler.ap - southeast - 1.aws.neon.tech@5432@aksstudio
// Tôi là An Kun
// Hỗ trợ dự án, Copilot, Gemini
// Tác giả kiêm xuất bản bởi An Kun Studio Digital Music
__turbopack_context__.s({
    "AuthContext": ()=>AuthContext,
    "useUser": ()=>useUser
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function useUser() {
    _s();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!context) {
        // Fallback nếu không có AuthProvider
        return {
            user: null,
            isAuthenticated: false,
            isLoading: false,
            login: async ()=>false,
            logout: ()=>{}
        };
    }
    return {
        user: context.user,
        isAuthenticated: !!context.user,
        isLoading: context.loading,
        login: context.login,
        logout: context.logout
    };
}
_s(useUser, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// Tôi là An Kun
// Tác giả kiêm xuất bản bởi An Kun Studio Digital Music
__turbopack_context__.s({
    "default": ()=>HomePage
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$main$2d$app$2d$view$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/main-app-view.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$fallback$2d$view$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/fallback-view.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/auth-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function HomePage() {
    _s();
    const [hasFailed, setHasFailed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Debug code - check localStorage and display any errors
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomePage.useEffect": ()=>{
            try {
                // Check if localStorage is corrupted
                const storedUser = localStorage.getItem('currentUser');
                console.log("🔍 DEBUG - Stored user:", storedUser);
                if (storedUser) {
                    try {
                        // Try to parse the JSON
                        const userData = JSON.parse(storedUser);
                        console.log("✅ DEBUG - User data parsed successfully:", userData);
                    } catch (parseError) {
                        console.error("❌ DEBUG - Error parsing stored user:", parseError);
                        // Clear the corrupted data
                        localStorage.removeItem('currentUser');
                        console.log("🧹 DEBUG - Cleared corrupted localStorage");
                        // Set failure state to use fallback
                        setHasFailed(true);
                    }
                } else {
                    console.log("ℹ️ DEBUG - No user data in localStorage");
                }
            } catch (error) {
                console.error("❌ DEBUG - Error accessing localStorage:", error);
                setHasFailed(true);
            }
        }
    }["HomePage.useEffect"], []);
    // Check if the page is running in a minimal mode for debugging
    const urlParams = new URLSearchParams(("TURBOPACK compile-time truthy", 1) ? window.location.search : "TURBOPACK unreachable");
    const fallbackMode = urlParams.get('mode') === 'fallback';
    // Use fallback view if debugging or if an error occurred
    if (fallbackMode || hasFailed) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$fallback$2d$view$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 51,
            columnNumber: 12
        }, this);
    }
    // Otherwise use normal view with error boundary
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ErrorBoundary, {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$fallback$2d$view$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 56,
            columnNumber: 30
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthProvider"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$main$2d$app$2d$view$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 58,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 57,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, this);
}
_s(HomePage, "2BdLVulQqZe4y+hkTdc4FnlBq/k=");
_c = HomePage;
// Simple error boundary component
class ErrorBoundary extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Component {
    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI
        return {
            hasError: true
        };
    }
    componentDidCatch(error, errorInfo) {
        // Log the error to console
        console.error("❌ ERROR BOUNDARY CAUGHT ERROR:", error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return this.props.fallback;
        }
        return this.props.children;
    }
    constructor(props){
        super(props);
        this.state = {
            hasError: false
        };
    }
}
var _c;
__turbopack_context__.k.register(_c, "HomePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=_f296e094._.js.map