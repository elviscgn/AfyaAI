// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const sanitizeValue = (value) => {
    if (value == null) return '';
    return value;
};

const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.detail || 'Something went wrong');
    }
    return data;
};

// Chat endpoint with TTS support
export const sendChatMessage = async ({
    user_input,
    latitude,
    longitude,
    language = 'english',
    session_id,
    country = 'South Africa',
    tts_enabled = false,
}) => {
    const body = {
        user_input: sanitizeValue(user_input),
        latitude: sanitizeValue(latitude),
        longitude: sanitizeValue(longitude),
        // language: sanitizeValue(language),
        language: "english",
        session_id: "sanitizeValue(session_id)1",
        country: sanitizeValue(country),
        tts_enabled,
    };

    const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    return handleResponse(response);
};

// PDF upload
export const uploadMedicalPDF = async ({
    file,
    user_prompt = '',
    language = 'english',
    session_id,
}) => {
    const formData = new FormData();
    formData.append('file', file);
    if (user_prompt) formData.append('user_prompt', user_prompt);
    if (language) formData.append('language', language);
    if (session_id) formData.append('session_id', session_id);

    const response = await fetch(`${API_BASE_URL}/upload-pdf`, {
        method: 'POST',
        body: formData,
    });
    return handleResponse(response);
};

// Daily check-in
export const submitCheckin = async ({
    session_id,
    sleep_hours,
    mood,
    hydration,
    symptoms = [],
}) => {
    const body = {
        session_id: sanitizeValue(session_id),
        sleep_hours: sanitizeValue(sleep_hours),
        mood: sanitizeValue(mood),
        hydration: sanitizeValue(hydration),
        symptoms: symptoms.map(s => sanitizeValue(s)),
    };

    const response = await fetch(`${API_BASE_URL}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    return handleResponse(response);
};

// Health check
export const checkHealth = async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    return handleResponse(response);
};