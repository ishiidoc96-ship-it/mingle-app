const API_BASE = '/api/admin';
const POLL_INTERVAL = 5000; // 5 seconds
let currentToken = null;
let pollTimer = null;
let updateQueue = [];

/**
 * Initialize the admin panel
 */
function init() {
  setupNavigation();
  setupDashboard();
  setupPhotoManager();
  setupUsers();
}

/**
 * Tab Navigation
 */
function setupNavigation() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.getElementById(`tab-${tab}`).classList.add('active');
    });
  });
}

/**
 * Get API headers with auth token
 */
function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  if (currentToken) {
    headers['Authorization'] = `Bearer ${currentToken}`;
  }
  return headers;
}

/**
 * Set connection status
 */
function setStatus(connected) {
  const dot = document.getElementById('statusDot');
  const text = document.getElementById('statusText');
  if (connected) {
    dot.classList.add('connected');
    text.textContent = 'Connected';
  } else {
    dot.classList.remove('connected');
    text.textContent = 'Not connected';
  }
}

/**
 * Connect with token
 */
function connect(token) {
  currentToken = token;
  setStatus(true);
  
  // Connect all inputs
  document.querySelectorAll('input[id^="tokenInput"]').forEach(input => {
    input.value = token;
  });

  // Load initial data
  loadDashboard();
  loadPhotoSamples();

  // Start polling
  startPolling();
}

/**
 * Disconnect
 */
function disconnect() {
  currentToken = null;
  updateQueue = [];
  setStatus(false);
  
  document.querySelectorAll('input[id^="tokenInput"]').forEach(input => {
    input.value = '';
  });

  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}

/**
 * Polling for real-time updates
 */
function startPolling() {
  if (pollTimer) clearInterval(pollTimer);
  
  pollTimer = setInterval(async () => {
    if (!currentToken) return;
    
    try {
      const res = await fetch(`${API_BASE}/status`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        queueUpdate(() => updateDashboardStats(data));
      }
    } catch (err) {
      console.error('Poll error:', err);
    }
  }, POLL_INTERVAL);
}

/**
 * Queue update for batch processing
 */
function queueUpdate(callback) {
  updateQueue.push(callback);
  if (updateQueue.length === 1) {
    processQueue();
  }
}

/**
 * Process queued updates with batching
 */
function processQueue() {
  if (updateQueue.length === 0) return;
  
  const updates = [...updateQueue];
  updateQueue = [];
  
  // Use requestAnimationFrame for smooth UI updates
  requestAnimationFrame(() => {
    updates.forEach(update => update());
  });
}

/**
 * Load dashboard stats
 */
async function loadDashboard() {
  if (!currentToken) return;
  
  try {
    const res = await fetch(`${API_BASE}/status`, { headers: getHeaders() });
    if (res.status === 401 || res.status === 403) {
      alert('Invalid token - admin access required');
      disconnect();
      return;
    }
    if (!res.ok) throw new Error('Failed to load stats');
    
    const data = await res.json();
    updateDashboardStats(data);
  } catch (err) {
    console.error('Dashboard error:', err);
  }
}

/**
 * Update dashboard stats display
 */
function updateDashboardStats(data) {
  document.getElementById('statUsers').textContent = data.totalUsers || 0;
  document.getElementById('statWithPhotos').textContent = data.withPhotos || 0;
  document.getElementById('statWithoutPhotos').textContent = data.withoutPhotos || 0;
  document.getElementById('statLocalFiles').textContent = data.localFiles || 0;
  document.getElementById('statMapped').textContent = data.mappedUrls || 0;
}

function setupDashboard() {
  const connectBtn = document.getElementById('connectBtn');
  const tokenInput = document.getElementById('tokenInput');

  connectBtn.addEventListener('click', () => {
    const token = tokenInput.value.trim();
    if (token) {
      connect(token);
      connectBtn.textContent = currentToken ? '✓ Connected' : 'Connect';
      connectBtn.disabled = true;
      setTimeout(() => {
        connectBtn.textContent = 'Connect';
        connectBtn.disabled = false;
      }, 2000);
    }
  });

  tokenInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') connectBtn.click();
  });

  document.getElementById('clearPhotosBtn').addEventListener('click', clearAllPhotos);
  document.getElementById('seedPhotosBtn').addEventListener('click', seedAllPhotos);
}

/**
 * Clear all photos
 */
async function clearAllPhotos() {
  if (!currentToken) {
    alert('Please connect first');
    return;
  }
  
  if (!confirm('⚠️ This will DELETE all profile photos from the database. Users will have no photos until you seed again. Continue?')) {
    return;
  }

  const btn = document.getElementById('clearPhotosBtn');
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Clearing...';

  try {
    const res = await fetch(`${API_BASE}/photos`, {
      method: 'DELETE',
      headers: getHeaders()
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to clear photos');
    }

    const data = await res.json();
    alert(`✅ ${data.message}`);
    loadDashboard();
    loadPhotoSamples();
  } catch (err) {
    alert(`❌ Error: ${err.message}`);
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
}

/**
 * Seed / assign photos to all users
 */
async function seedAllPhotos() {
  if (!currentToken) {
    alert('Please connect first');
    return;
  }

  const btn = document.getElementById('seedPhotosBtn');
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Seeding...';

  updateProgress(0, 'Starting...');

  try {
    const res = await fetch(`${API_BASE}/seed-photos`, {
      method: 'POST',
      headers: getHeaders()
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to seed photos');
    }

    const data = await res.json();
    updateProgress(100, 'Complete!');
    
    alert(`✅ Seeding complete!\n\nNew uploads: ${data.newUploads}\nUsers updated: ${data.usersUpdated}\nAvailable URLs: ${data.availableUrls}`);
    
    loadDashboard();
    loadPhotoSamples();
  } catch (err) {
    updateProgress(0, 'Error');
    alert(`❌ Error: ${err.message}`);
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
}

/**
 * Upload photos from browser directly to Cloudinary, then assign to users
 */
let selectedFiles = [];
let isUploading = false;

async function uploadPhotosFromPC() {
  if (!currentToken) { alert('Please connect first'); return; }
  if (selectedFiles.length === 0) { alert('Please select photos first'); return; }
  if (isUploading) return;

  isUploading = true;
  const btn = document.getElementById('uploadBtn');
  btn.disabled = true;
  btn.textContent = 'Uploading...';
  const status = document.getElementById('uploadStatus');
  status.textContent = `Uploading ${selectedFiles.length} photos to Cloudinary...`;

  const CLOUD_NAME = 'dilrcexxe';
  const UPLOAD_PRESET = 'MingleKe';
  const FOLDER = 'mingle/profiles';

  try {
    const uploadPromises = selectedFiles.map(async (file, idx) => {
      const form = new FormData();
      form.append('file', file);
      form.append('upload_preset', UPLOAD_PRESET);
      form.append('folder', FOLDER);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: form });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return { ok: true, url: data.secure_url, name: file.name };
    });

    const results = await Promise.all(uploadPromises);
    const urls = results.filter(r => r.ok).map(r => r.url);
    const errors = results.filter(r => !r.ok);

    status.textContent = `Uploaded ${urls.length}/${results.length} photos. Assigning to users...`;

    if (urls.length === 0) {
      throw new Error('All uploads failed');
    }

    const res = await fetch(`${API_BASE}/upload-photos`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ urls })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to assign photos');
    }

    const data = await res.json();
    status.textContent = `✅ Done! ${urls.length} photos uploaded, ${data.usersUpdated} users updated`;
    status.style.color = 'var(--success)';

    displayUploadResults(results);
    loadDashboard();
    loadPhotoSamples();

    selectedFiles = [];
    document.getElementById('uploadBtn').disabled = true;
    document.getElementById('fileInput').value = '';

  } catch (err) {
    status.textContent = `❌ Error: ${err.message}`;
    status.style.color = 'var(--danger)';
  } finally {
    isUploading = false;
    btn.disabled = false;
    btn.textContent = '☁ Upload to Cloudinary';
  }
}

function displayUploadResults(results) {
  const container = document.getElementById('uploadResults');
  container.innerHTML = results.map(r => {
    if (r.ok) {
      return `<img class="upload-thumb" src="${r.url}" alt="${r.name}" title="${r.name}" />`;
    } else {
      return `<span class="upload-error" title="${r.name}">✗ ${r.name}</span>`;
    }
  }).join('');

  setTimeout(() => { container.innerHTML = ''; }, 10000);
}

function setupPhotoManager() {
  const container = document.getElementById('progressContainer');
  const bar = document.getElementById('progressBar');
  
  container.style.display = 'block';
  bar.style.width = `${percent}%`;
  bar.textContent = `${percent}%`;
  
  if (percent >= 100) {
    setTimeout(() => {
      container.style.display = 'none';
    }, 2000);
  }
}

/**
 * Load photo samples
 */
async function loadPhotoSamples() {
  if (!currentToken) return;

  try {
    const res = await fetch(`${API_BASE}/photos-samples`, { headers: getHeaders() });
    if (!res.ok) return;
    
    const photos = await res.json();
    displayPhotoSamples(photos);
  } catch (err) {
    console.error('Failed to load samples:', err);
  }
}

/**
 * Display photo samples in grid
 */
function displayPhotoSamples(photos) {
  const grid = document.getElementById('photoGrid');
  
  if (!photos || photos.length === 0) {
    grid.innerHTML = '<div class="empty-state">No photos found. Seed photos first.</div>';
    return;
  }

  grid.innerHTML = photos.map(p => `
    <img class="photo-thumb" src="${p.avatar_url}" alt="${p.name}" loading="lazy" />
  `).join('');
}

function setupPhotoManager() {
  // Connect button for photo tab
  document.querySelector('.connect-btn-tab').addEventListener('click', () => {
    const input = document.getElementById('tokenInputPhotos');
    const token = input.value.trim();
    if (token) connect(token);
  });

  document.getElementById('tokenInputPhotos').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') document.querySelector('.connect-btn-tab').click();
  });

  // Tab buttons
  document.getElementById('clearPhotosBtnTab').addEventListener('click', clearAllPhotos);
  document.getElementById('seedPhotosBtnTab').addEventListener('click', seedAllPhotos);
  document.getElementById('samplesBtn').addEventListener('click', () => {
    loadPhotoSamples();
  });

  // Direct photo upload from PC
  const fileInput = document.getElementById('fileInput');
  const uploadArea = document.getElementById('uploadArea');
  const uploadBtn = document.getElementById('uploadBtn');
  const browseBtn = document.getElementById('browseBtn');

  uploadBtn.addEventListener('click', async () => {
    if (!currentToken) { alert('Please connect first'); return; }
    await uploadPhotosFromPC();
  });

  browseBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    selectedFiles = files;
    uploadBtn.disabled = files.length === 0;
    document.getElementById('uploadStatus').textContent = `${files.length} file(s) selected: ${files.map(f => f.name).join(', ')}`;
  });

  uploadArea.addEventListener('click', (e) => {
    if (e.target === browseBtn || e.target === uploadBtn) return;
    fileInput.click();
  });

  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = Array.from(e.dataTransfer.files).filter(f => f.type === 'image/jpeg' || f.type === 'image/jpg');
    selectedFiles = files;
    uploadBtn.disabled = files.length === 0;
    document.getElementById('uploadStatus').textContent = `${files.length} image(s) selected`;
  });
}

/**
 * Users management
 */
let allUsers = [];

function setupUsers() {
  document.getElementById('loadUsersBtn').addEventListener('click', loadUsers);
  document.getElementById('userSearch').addEventListener('input', (e) => {
    filterUsers(e.target.value);
  });
}

async function loadUsers() {
  if (!currentToken) {
    alert('Please connect with an admin token first.');
    return;
  }

  const btn = document.getElementById('loadUsersBtn');
  btn.disabled = true;
  btn.textContent = 'Loading...';

  try {
    const res = await fetch(`${API_BASE}/users`, { headers: getHeaders() });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to load users');
    }

    allUsers = await res.json();
    renderUsers(allUsers);
  } catch (err) {
    alert(`❌ Error: ${err.message}`);
    document.getElementById('usersTbody').innerHTML = `<tr><td colspan="5" class="empty-row">Failed to load: ${err.message}</td></tr>`;
  } finally {
    btn.disabled = false;
    btn.textContent = 'Load Users';
  }
}

function renderUsers(users) {
  const tbody = document.getElementById('usersTbody');
  
  if (users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-row">No users found</td></tr>';
    return;
  }

  tbody.innerHTML = users.map(u => {
    const adminBadge = u.is_admin 
      ? '<span class="admin-badge">ADMIN</span>'
      : '<span class="no-admin-badge">—</span>';
    
    const avatar = u.avatar_url
      ? `<img class="user-avatar" src="${u.avatar_url}" alt="${u.name}" loading="lazy" />`
      : `<div class="user-avatar" style="display:flex;align-items:center;justify-content:center;background:var(--border);color:var(--text-muted);font-size:12px;">∅</div>`;

    return `
      <tr>
        <td class="user-id-cell" title="${u.id}">${u.id.substring(0, 8)}...</td>
        <td>${u.name || '—'}</td>
        <td>${u.email || '—'}</td>
        <td>${avatar}</td>
        <td>${adminBadge}</td>
      </tr>
    `;
  }).join('');
}

function filterUsers(query) {
  if (!allUsers.length) return;
  
  const q = query.toLowerCase().trim();
  if (!q) {
    renderUsers(allUsers);
    return;
  }

  const filtered = allUsers.filter(u => 
    (u.name && u.name.toLowerCase().includes(q)) ||
    (u.email && u.email.toLowerCase().includes(q))
  );
  renderUsers(filtered);
}

// Initialize
document.addEventListener('DOMContentLoaded', init);
