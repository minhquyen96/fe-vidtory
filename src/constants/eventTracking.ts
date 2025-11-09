export const eventTracking = {
  // PAGE VIEW EVENTS
  PAGE_VIEW: {
    HOME: 'home_page_view',
    TOPICS: 'topics_page_view',
    TOPIC_DETAIL: 'topic_detail_page_view',
    LESSON_DICTATION: 'lesson_dictation_page_view',
    LESSON_SHADOWING: 'lesson_shadowing_page_view',
    REVIEW: 'review_page_view',
    PROFILE: 'profile_page_view',
    MY_NOTES: 'my_notes_page_view',
    LOGIN: 'login_page_view',
    ABOUT_US: 'about_us_page_view',
    CONTACT_US: 'contact_us_page_view',
    PRIVACY_POLICY: 'privacy_policy_page_view',
    TERMS_OF_SERVICE: 'terms_of_service_page_view',
    NOT_FOUND: 'not_found_page_view',
    SHADOWING: 'shadowing_page_view',
    DICTATION: 'dictation_page_view',
    LEADERBOARD: 'leaderboard_page_view',
    SHOP: 'shop_page_view',
  },

  // HOME PAGE EVENTS
  HOME: {
    BANNER_CLICK: 'home_banner_click',
    FEATURE_CLICK: 'home_feature_click',
    HOW_TO_STEP_CLICK: 'home_how_to_step_click',
    USE_CASE_CLICK: 'home_use_case_click',
    REVIEW_CLICK: 'home_review_click',
    FAQ_TOGGLE: 'home_faq_toggle',
    GET_STARTED_CLICK: 'home_get_started_click',
  },

  // TOPICS PAGE EVENTS
  TOPICS: {
    TOPIC_CLICK: 'topics_topic_click',
    LEVEL_FILTER: 'topics_level_filter',
    SEARCH_TOPIC: 'topics_search',
    SORT_TOPICS: 'topics_sort',
    TAB_CHANGE: 'tab_change',
  },

  // TOPIC DETAIL PAGE EVENTS
  TOPIC_DETAIL: {
    LESSON_CLICK: 'topic_detail_lesson_click',
    LESSON_TYPE_SELECT: 'topic_detail_lesson_type_select',
    BACK_TO_TOPICS: 'topic_detail_back_to_topics',
    SEARCH: 'topic_detail_search',
    FILTER: 'topic_detail_filter',
  },

  // LESSON EVENTS (DICTATION & SHADOWING)
  LESSON: {
    START_LESSON: 'lesson_start',
    COMPLETE_LESSON: 'lesson_complete',
    PAUSE_LESSON: 'lesson_pause',
    RESUME_LESSON: 'lesson_resume',
    RESET_LESSON: 'lesson_reset',
    REPLAY_SEGMENT: 'lesson_replay_segment',
    NEXT_SEGMENT: 'lesson_next_segment',
    PREV_SEGMENT: 'lesson_prev_segment',
    SKIP_SEGMENT: 'lesson_skip_segment',
    SEGMENT_CLICK: 'lesson_segment_click',
    CHECK_ANSWER: 'lesson_check_answer',
    SUBMIT_ANSWER: 'lesson_submit_answer',
    USE_HINT: 'lesson_use_hint',
    SPEECH_TO_TEXT: 'lesson_speech_to_text',
    AUDIO_PLAY: 'lesson_audio_play',
    AUDIO_PAUSE: 'lesson_audio_pause',
    AUDIO_CONTROL: 'lesson_audio_control',
    VIDEO_PLAY: 'lesson_video_play',
    VIDEO_PAUSE: 'lesson_video_pause',
    WORD_CLICK: 'lesson_word_click',
    NOTE_ADD: 'lesson_note_add',
    NOTE_EDIT: 'lesson_note_edit',
    NOTE_DELETE: 'lesson_note_delete',
    REPORT_ERROR: 'lesson_report_error',
    KEYBOARD_SHORTCUT: 'lesson_keyboard_shortcut',
    TIME_SPENT: 'lesson_time_spent',
    PROGRESS_SAVE: 'lesson_progress_save',
    PROGRESS_SYNC: 'lesson_progress_sync',
  },

  // SHADOWING SPECIFIC EVENTS
  SHADOWING: {
    START_RECORDING: 'shadowing_start_recording',
    STOP_RECORDING: 'shadowing_stop_recording',
    RECORDING_ERROR: 'shadowing_recording_error',
    SCORE_CALCULATED: 'shadowing_score_calculated',
    PLAY_RECORDED: 'shadowing_play_recorded',
    COMPARE_WORDS: 'shadowing_compare_words',
    SPEECH_TO_TEXT: 'shadowing_speech_to_text',
    VIDEO_PLAY: 'shadowing_video_play',
    VIDEO_PAUSE: 'shadowing_video_pause',
    AUTO_STOP_TOGGLE: 'shadowing_auto_stop_toggle',
    NAVIGATION: 'shadowing_navigation',
    AUDIO_CONTROL: 'shadowing_audio_control',
    VIDEO_TOGGLE: 'shadowing_video_toggle',
    REPORT_ERROR: 'shadowing_report_error',
    SEGMENT_CLICK: 'shadowing_segment_click',
    IPA_TOGGLE: 'shadowing_ipa_toggle',
    TRANSLATIONS_TOGGLE: 'shadowing_translations_toggle',
    FAQ_TOGGLE: 'shadowing_faq_toggle',
    PAGE_VIEW: 'shadowing_page_view',
  },

  // DICTATION SPECIFIC EVENTS
  DICTATION: {
    SHOW_ALL_ANSWERS: 'dictation_show_all_answers',
    HIDE_ANSWERS: 'dictation_hide_answers',
    AUTO_CHECK_TOGGLE: 'dictation_auto_check_toggle',
    SPEECH_TO_TEXT: 'dictation_speech_to_text',
    USE_HINT: 'dictation_use_hint',
    AUDIO_CONTROL: 'dictation_audio_control',
  },

  // REVIEW PAGE EVENTS
  REVIEW: {
    SENTENCE_CLICK: 'review_sentence_click',
    FILTER_SENTENCES: 'review_filter_sentences',
    SORT_SENTENCES: 'review_sort_sentences',
    MARK_REVIEWED: 'review_mark_reviewed',
    DELETE_SENTENCE: 'review_delete_sentence',
    EXPORT_NOTES: 'review_export_notes',
    DICTATION_MODE: 'review_dictation_mode',
    SHADOWING_MODE: 'review_shadowing_mode',
    TRANSCRIPT_MODE: 'review_transcript_mode',
    REPORT_ERROR: 'review_report_error',
    REVISION_REMINDER: 'review_revision_reminder',
  },

  // PROFILE PAGE EVENTS
  PROFILE: {
    EDIT_PROFILE: 'profile_edit',
    UPDATE_PROFILE: 'profile_update',
    CHANGE_AVATAR: 'profile_change_avatar',
    UPDATE_SETTINGS: 'profile_update_settings',
    VIEW_ACHIEVEMENTS: 'profile_view_achievements',
    VIEW_STATS: 'profile_view_stats',
    VIEW_RANKING: 'profile_view_ranking',
    EXPORT_DATA: 'profile_export_data',
  },

  // SHOP PAGE EVENTS
  SHOP: {
    PURCHASE_ATTEMPT: 'shop_purchase_attempt',
    PURCHASE_SUCCESS: 'shop_purchase_success',
    PURCHASE_FAILED: 'shop_purchase_failed',
    ITEM_VIEW: 'shop_item_view',
    FILTER_ITEMS: 'shop_filter_items',
    SORT_ITEMS: 'shop_sort_items',
  },

  // LEADERBOARD PAGE EVENTS
  LEADERBOARD: {
    DATA_FETCHED: 'leaderboard_data_fetched',
    FETCH_ERROR: 'leaderboard_fetch_error',
    MONTH_CHANGE: 'leaderboard_month_change',
    USER_CLICK: 'leaderboard_user_click',
    REWARD_VIEW: 'leaderboard_reward_view',
    COUNTDOWN_VIEW: 'leaderboard_countdown_view',
  },

  // MY NOTES PAGE EVENTS
  MY_NOTES: {
    CREATE_NOTE: 'my_notes_create',
    EDIT_NOTE: 'my_notes_edit',
    DELETE_NOTE: 'my_notes_delete',
    SEARCH_NOTES: 'my_notes_search',
    FILTER_NOTES: 'my_notes_filter',
    SORT_NOTES: 'my_notes_sort',
    EXPORT_NOTES: 'my_notes_export',
    SHARE_NOTE: 'my_notes_share',
    AUDIO_PLAY: 'my_notes_audio_play',
    AUDIO_PAUSE: 'my_notes_audio_pause',
    AUDIO_END: 'my_notes_audio_end',
  },

  // AUTHENTICATION EVENTS
  AUTH: {
    LOGIN_ATTEMPT: 'auth_login_attempt',
    LOGIN_SUCCESS: 'auth_login_success',
    LOGIN_FAILURE: 'auth_login_failure',
    LOGOUT: 'auth_logout',
    SIGNUP_ATTEMPT: 'auth_signup_attempt',
    SIGNUP_SUCCESS: 'auth_signup_success',
    SIGNUP_FAILURE: 'auth_signup_failure',
    PASSWORD_RESET: 'auth_password_reset',
    EMAIL_VERIFICATION: 'auth_email_verification',
  },

  // NAVIGATION EVENTS
  NAVIGATION: {
    MENU_TOGGLE: 'navigation_menu_toggle',
    LANGUAGE_CHANGE: 'navigation_language_change',
    THEME_TOGGLE: 'navigation_theme_toggle',
    BREADCRUMB_CLICK: 'navigation_breadcrumb_click',
    BACK_BUTTON: 'navigation_back_button',
    FORWARD_BUTTON: 'navigation_forward_button',
    SOCIAL_CLICK: 'navigation_social_click',
  },

  // UI INTERACTION EVENTS
  UI: {
    MODAL_OPEN: 'ui_modal_open',
    MODAL_CLOSE: 'ui_modal_close',
    TOOLTIP_SHOW: 'ui_tooltip_show',
    TOOLTIP_HIDE: 'ui_tooltip_hide',
    NOTIFICATION_SHOW: 'ui_notification_show',
    NOTIFICATION_DISMISS: 'ui_notification_dismiss',
    TOAST_SHOW: 'ui_toast_show',
    TOAST_DISMISS: 'ui_toast_dismiss',
    DRAWER_OPEN: 'ui_drawer_open',
    DRAWER_CLOSE: 'ui_drawer_close',
    POPOVER_OPEN: 'ui_popover_open',
    POPOVER_CLOSE: 'ui_popover_close',
  },

  // ERROR EVENTS
  ERROR: {
    API_ERROR: 'error_api',
    NETWORK_ERROR: 'error_network',
    VALIDATION_ERROR: 'error_validation',
    PERMISSION_ERROR: 'error_permission',
    AUDIO_ERROR: 'error_audio',
    VIDEO_ERROR: 'error_video',
    SPEECH_RECOGNITION_ERROR: 'error_speech_recognition',
    INDEXED_DB_ERROR: 'error_indexed_db',
  },

  // PERFORMANCE EVENTS
  PERFORMANCE: {
    PAGE_LOAD_TIME: 'performance_page_load',
    API_RESPONSE_TIME: 'performance_api_response',
    AUDIO_LOAD_TIME: 'performance_audio_load',
    VIDEO_LOAD_TIME: 'performance_video_load',
    MODEL_LOAD_TIME: 'performance_model_load',
  },

  // FEATURE USAGE EVENTS
  FEATURE_USAGE: {
    SPEECH_TO_TEXT_USE: 'feature_speech_to_text',
    SHADOWING_USE: 'feature_shadowing',
    DICTATION_USE: 'feature_dictation',
    NOTES_USE: 'feature_notes',
    REVIEW_USE: 'feature_review',
    PROGRESS_TRACKING: 'feature_progress_tracking',
    KEYBOARD_SHORTCUTS: 'feature_keyboard_shortcuts',
    AUTO_SAVE: 'feature_auto_save',
  },

  // ENGAGEMENT EVENTS
  ENGAGEMENT: {
    SHARE_BUTTON: 'share_click',
    FEEDBACK_BUTTON: 'feedback_click',
    SESSION_START: 'engagement_session_start',
    SESSION_END: 'engagement_session_end',
    TIME_ON_PAGE: 'engagement_time_on_page',
    SCROLL_DEPTH: 'engagement_scroll_depth',
    CLICK_DEPTH: 'engagement_click_depth',
    RETURN_VISIT: 'engagement_return_visit',
    DAILY_ACTIVE: 'engagement_daily_active',
    WEEKLY_ACTIVE: 'engagement_weekly_active',
    CONTACT_METHOD_CLICK: 'engagement_contact_method_click',
  },
}
