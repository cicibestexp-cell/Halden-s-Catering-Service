// ===== AUTH GUARD =====
function checkAuth() {
  const logged = sessionStorage.getItem('halden_admin');
  if (!logged) { window.location.href = 'index.html'; return; }
  try {
    const u = JSON.parse(logged);
    document.getElementById('admin-name').textContent = u.name || 'Administrator';
  } catch (e) { }
}
function adminLogout() {
  sessionStorage.removeItem('halden_admin');
  window.location.href = 'index.html';
}
checkAuth();

// Set dashboard greeting and date
(function () {
  const h = new Date().getHours();
  const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const el = document.getElementById('dash-greeting');
  if (el) el.textContent = greeting + ', Admin ';
  document.getElementById('dash-date').textContent =
    "Here's what's happening with Halden's today — " +
    new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
})();

// ===== NAVIGATION =====
const SG_GROUPS = ['reservations', 'event-handling', 'equipment-inv', 'users', 'analytics', 'support'];
const SG_MAP = {
  dashboard: 'reservations', reservations: 'reservations', 'res-details': 'reservations',
  'activity-logs': 'reservations',
  events: 'event-handling', 'event-details': 'event-handling', seating: 'event-handling',
  equipment: 'equipment-inv', rentals: 'equipment-inv',
  availability: 'equipment-inv', 'routine-check': 'equipment-inv',
  allocation: 'equipment-inv', scheduling: 'equipment-inv',
  maintenance: 'equipment-inv', resupply: 'equipment-inv',
  disposed: 'equipment-inv',
  users: 'users',
  insights: 'analytics', chat: 'support', meetings: 'reservations'
};

function toggleSidebarGroup(group) {
  const content = document.getElementById('sg-' + group);
  const toggle = document.getElementById('sgt-' + group);
  if (!content) return;
  const isOpen = content.classList.contains('open');
  SG_GROUPS.forEach(g => {
    document.getElementById('sg-' + g)?.classList.remove('open');
    document.getElementById('sgt-' + g)?.classList.remove('open');
  });
  if (!isOpen) {
    content.classList.add('open');
    toggle?.classList.add('open');
  }
}

function openGroupFor(name) {
  const group = SG_MAP[name];
  if (!group) return;
  SG_GROUPS.forEach(g => {
    document.getElementById('sg-' + g)?.classList.remove('open');
    document.getElementById('sgt-' + g)?.classList.remove('open');
  });
  document.getElementById('sg-' + group)?.classList.add('open');
  document.getElementById('sgt-' + group)?.classList.add('open');
}

function showSection(name, el) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.sidebar-item').forEach(s => s.classList.remove('active'));
  const sec = document.getElementById('section-' + name);
  if (sec) sec.classList.add('active');
  if (el) el.classList.add('active');
  openGroupFor(name);

  if (name === 'dashboard') {
    setTimeout(() => { if (window.dashCalendar) window.dashCalendar.render(); }, 10);
  }
  if (name === 'events' && window.calendar) {
    setTimeout(() => window.calendar.render(), 10);
  }
  if (name === 'chat') initAdminChat();
  if (name === 'reservations') {
    renderReservations(currentFilter);
    renderReservationDetailsHandling();
  }
  if (name === 'res-details') renderReservationDetailsHandling();
  if (name === 'activity-logs') renderActivityLogsSection();
  if (name === 'seating') renderSeating();
  if (name === 'equipment') renderEIMTable();
  if (name === 'rentals') renderRentalCards();
  if (name === 'allocation') renderAllocationSection();
  if (name === 'scheduling') renderSchedulingSection();
  if (name === 'availability') renderAvailabilitySection();
  if (name === 'routine-check') renderRoutineCheckSection();
  if (name === 'lifecycle') renderLifecycleSection();
  if (name === 'equip-issues') renderEquipIssuesSection();
  if (name === 'resupply') renderResupplySection();
  if (name === 'maintenance') renderMaintenanceSection();
  if (name === 'disposed') renderDisposedSection();
  if (name === 'meetings') renderMeetingsSection();
  if (name === 'insights') renderInsights();
  if (name === 'users') renderUsersSection();
}
window.toggleSidebarGroup = toggleSidebarGroup;

// ===== LIVE DATA =====
let RESERVATIONS = [];
let activeResDetailId = null;
let resDetailMode = 'view';
let reservationExtraDetails = {};
let resDetailsActiveTab = 'details';
let resTimelineCalendar = null;
let resExecMap = null;
let resExecAdminMarker = null;
let resExecVenueMarker = null;
let resExecRouteLayer = null;
let resExecWatchId = null;
let resExecLastFix = null;
let resExecLastRouteAt = 0;
window.executionDayOverrides = window.executionDayOverrides || {};
window.reservationLifecycleLogs = window.reservationLifecycleLogs || {};
let activeActivityLogResId = null;

// ===== USER MANAGEMENT DATA =====
let USERS = [
  { id: 'u1', name: 'Admin Halden', email: 'admin@halden.com', role: 'Admin', status: 'Active', lastLogin: '2026-04-20 07:45' },
  { id: 'u2', name: 'Julianne Staff', email: 'julianne@gmail.com', role: 'Staff', status: 'Active', lastLogin: '2026-04-19 18:22' },
  { id: 'u3', name: 'Mark Waiter', email: 'mark.waiter@gmail.com', role: 'Staff', status: 'Inactive', lastLogin: '2026-04-15 10:05' }
];
let selectedUserId = null;

const ACTIVITY = [
  { dot: 'green', title: 'Santos reservation confirmed', sub: 'Payment received — ₱85,000', time: '2h ago' },
  { dot: 'amber', title: 'Rental equipment arrived', sub: '3× Crystal Chandeliers from Lumina', time: '5h ago' },
  { dot: 'gold', title: 'New reservation submitted', sub: 'Cruz Corporate — awaiting approval', time: 'Yesterday' },
  { dot: 'green', title: 'Equipment returned on time', sub: 'Photo booth set — fully intact', time: '2 days ago' },
];

// ===== LOAD FROM FIRESTORE =====
async function loadData() {
  document.getElementById('res-tbody').innerHTML = `
    <tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-dim);">Loading reservations...</td></tr>`;
  try {
    const { collection, getDocs } = window.firebaseFns;
    const db = window.firebaseDB;
    const resSnap = await getDocs(collection(db, 'reservations'));
    RESERVATIONS = resSnap.docs.map(d => {
      return { id: d.id, ...d.data() };
    });
    // Format amount for display if needed elsewhere, but keep raw for logic
    RESERVATIONS.forEach(r => {
      if(typeof r.amount === 'number' || !isNaN(r.amount)) {
        r.displayAmount = '₱' + Number(r.amount).toLocaleString();
      } else if(typeof r.amount === 'string' && !r.amount.includes('₱')) {
        r.displayAmount = '₱' + Number(r.amount).toLocaleString();
      } else {
        r.displayAmount = r.amount;
      }
    });
    RESERVATIONS.sort((a, b) => {
      const order = { pending: 0, confirmed: 1, cancelled: 2 };
      return (order[a.status] ?? 3) - (order[b.status] ?? 3);
    });
    renderDashboard();
    renderReservations();
    renderEvents();
    renderInsights();
    renderMeetingsSection();
    renderReservationDetailsHandling();
    renderActivityLogsSection();
  } catch (err) {
    console.error('Firestore load error:', err);
    document.getElementById('res-tbody').innerHTML = `
      <tr><td colspan="7" style="text-align:center;padding:24px;color:var(--red);">⚠ Failed to load. Check Firebase connection.</td></tr>`;
  }
}

// Helper to count reservations on a date (confirmed/pending)
function getOverbookingCount(dateStr) {
  if(!dateStr) return 0;
  return RESERVATIONS.filter(r => r.date === dateStr && (r.status === 'confirmed' || r.status === 'pending')).length;
}

// ===== UPDATE RESERVATION STATUS =====
async function updateReservationStatus(id, newStatus, reason = null) {
  try {
    const { doc, updateDoc } = window.firebaseFns;
    const upd = { status: newStatus };
    if(reason) upd.rejectionReason = reason;

    await updateDoc(doc(window.firebaseDB, 'reservations', id), upd);
    const res = RESERVATIONS.find(r => r.id === id);
    if (res) {
      res.status = newStatus;
      if(reason) res.rejectionReason = reason;
    }
    renderReservations(currentFilter);
    renderReservationDetailsHandling();
    renderDashboard();
    renderEvents();
  } catch (err) {
    alert('Failed to update reservation. Please try again.');
    console.error(err);
  }
}

// Rejection Flow
let activeRejectId = null;
function initiateRejection(id, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  const modal = document.getElementById('reject-modal');
  const overlay = document.getElementById('reject-overlay');
  const textarea = document.getElementById('reject-reason-text');
  
  if (!modal || !overlay) {
    console.error('Rejection modal elements missing from DOM');
    return;
  }
  
  activeRejectId = id;
  if (textarea) textarea.value = '';
  overlay.classList.add('on');
  modal.classList.add('open');
}
function closeRejectModal() {
  const modal = document.getElementById('reject-modal');
  const overlay = document.getElementById('reject-overlay');
  if (overlay) overlay.classList.remove('on');
  if (modal) modal.classList.remove('open');
  activeRejectId = null;
}
function confirmRejection() {
  const textarea = document.getElementById('reject-reason-text');
  if (!textarea) return;
  const reason = textarea.value.trim();
  if(!reason) { alert('Please enter a reason for rejection.'); return; }
  updateReservationStatus(activeRejectId, 'cancelled', reason);
  closeRejectModal();
}

// Approval Flow
let activeApproveId = null;
function initiateApproval(id, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  const res = RESERVATIONS.find(r => r.id === id);
  if(!res) return;
  
  activeApproveId = id;
  const obCount = getOverbookingCount(res.date);
  
  if(obCount >= 3) {
    document.getElementById('approve-warn-msg').textContent = `Warning: There are already ${obCount} reservations for ${res.date}. Approving this will exceed the recommended daily limit of 3.`;
    document.getElementById('approve-warn-overlay').classList.add('on');
    document.getElementById('approve-warn-modal').classList.add('open');
  } else {
    updateReservationStatus(id, 'confirmed');
  }
}
function closeApproveModal() {
  document.getElementById('approve-warn-overlay').classList.remove('on');
  document.getElementById('approve-warn-modal').classList.remove('open');
  activeApproveId = null;
}
function confirmApproval() {
  if(!activeApproveId) return;
  updateReservationStatus(activeApproveId, 'confirmed');
  closeApproveModal();
}

window.initiateRejection = initiateRejection;
window.closeRejectModal = closeRejectModal;
window.initiateApproval = initiateApproval;
window.closeApproveModal = closeApproveModal;
window.confirmApproval = confirmApproval;
// ===== MEETINGS SYSTEM =====
let MEETINGS = [];
let mtCalendar = null;
let activeMtId = null;
let activeMtResId = null;
let mtFileToUpload = null;

async function renderMeetingsSection() {
  if (document.getElementById('section-meetings')?.classList.contains('active')) {
    renderPendingMeetings();
    initMtCalendar();
  }
}

function renderPendingMeetings() {
  const container = document.getElementById('mt-pending-list');
  if(!container) return;
  
  // Need reservations that are "confirmed" or "preparing" but have no "completed" meeting yet
  // For simplicity, any confirmed res without a linked contractUrl can be scheduled
  const eligible = RESERVATIONS.filter(r => (r.status === 'confirmed' || r.status === 'preparing'));
  
  if(eligible.length === 0) {
    container.innerHTML = '<div style="padding:40px; text-align:center; color:var(--text-dim); font-size:13px;">No approved reservations ready for scheduling.</div>';
    return;
  }
  
  container.innerHTML = eligible.map(r => `
    <div class="mt-pending-item" onclick="openMtModal('${r.id}')">
      <div class="mt-res-info-mini">
        <div class="mt-cl-name">${r.client}</div>
        <div class="mt-ev-type">${r.type} — ${r.date}</div>
      </div>
      <button class="btn-primary" style="padding:6px 14px; font-size:11px;">Schedule</button>
    </div>
  `).join('');
}

function initMtCalendar() {
  const el = document.getElementById('mt-calendar');
  if(!el || mtCalendar) {
    if(mtCalendar) mtCalendar.render();
    return;
  }
  
  mtCalendar = new FullCalendar.Calendar(el, {
    initialView: 'dayGridMonth',
    headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek' },
    themeSystem: 'standard',
    events: async function(info, successCallback, failureCallback) {
      try {
        const { collection, getDocs, query, where } = window.firebaseFns;
        const snap = await getDocs(collection(window.firebaseDB, 'meetings'));
        const events = snap.docs.map(doc => {
          const data = doc.data();
          const isToday = data.date === new Date().toISOString().split('T')[0];
          return {
            id: doc.id,
            title: `${data.agenda} - ${data.clientName}`,
            start: `${data.date}T${data.time || '10:00:00'}`,
            extendedProps: data,
            color: isToday ? 'var(--gold)' : 'rgba(196,154,60,0.3)',
            textColor: '#fff'
          };
        });
        successCallback(events);
      } catch(e) { failureCallback(e); }
    },
    eventClick: function(info) {
      const data = info.event.extendedProps;
      const eventDate = data.date;
      const today = new Date().toISOString().split('T')[0];
      
      if(eventDate === today) {
        initiateMeetingMode(info.event.id);
      } else {
        openMtModal(data.reservationId, info.event.id);
      }
    }
  });
  mtCalendar.render();
}

function openMtModal(resId, mtId = null) {
  activeMtResId = resId;
  activeMtId = mtId;
  const res = RESERVATIONS.find(r => r.id === resId);
  if(!res && !mtId) return;
  
  document.getElementById('mt-chat-title').textContent = `Chat with ${(res && res.client) ? res.client : 'Client'}`;
  document.getElementById('mt-overlay').classList.add('on');
  document.getElementById('mt-modal').classList.add('open');
  
  // Reset form
  document.getElementById('mt-input-date').value = '';
  document.getElementById('mt-input-time').value = '';
  document.getElementById('mt-input-agenda').value = 'Initial Consultation';
  clearMtFile();
  
  if(mtId) {
    // Load existing meeting data
    loadMeetingToForm(mtId);
  }
  
  if (res) initMtChat(res.id, res.client);
}

function closeMtModal() {
  document.getElementById('mt-overlay').classList.remove('on');
  document.getElementById('mt-modal').classList.remove('open');
  activeMtResId = null;
  activeMtId = null;
}

// Simulated Cloudinary Upload
async function handleMtFileUpload(e) {
  const file = e.target.files[0];
  if(!file) return;
  
  mtFileToUpload = file;
  const isMode = document.getElementById('mt-mode-overlay').classList.contains('open');
  const prefix = isMode ? 'mt-mode-' : 'mt-';
  
  document.getElementById(prefix + 'file-name').textContent = file.name;
  document.getElementById(prefix + 'file-size').textContent = (file.size / 1024).toFixed(1) + ' KB';
  document.getElementById(prefix + 'file-status').style.display = 'flex';
}

function clearMtFile(e) {
  if(e) e.stopPropagation();
  mtFileToUpload = null;
  const isMode = document.getElementById('mt-mode-overlay')?.classList.contains('open');
  const fileInput = isMode ? 'mt-mode-file-input' : 'mt-file-input';
  const statusDiv = isMode ? 'mt-mode-file-status' : 'mt-file-status';
  
  const inputEl = document.getElementById(fileInput);
  const statusEl = document.getElementById(statusDiv);
  
  if (inputEl) inputEl.value = '';
  if (statusEl) statusEl.style.display = 'none';
}

async function saveMeeting() {
  const date = document.getElementById('mt-input-date').value;
  const time = document.getElementById('mt-input-time').value;
  const agenda = document.getElementById('mt-input-agenda').value;
  
  if(!date || !time) { alert('Please select date and time.'); return; }
  
  const res = RESERVATIONS.find(r => r.id === activeMtResId);
  
  try {
    const { collection, addDoc, updateDoc, doc } = window.firebaseFns;
    const db = window.firebaseDB;
    
    // contractUrl removal from here as per revision: "doesn't happen until its meeting mode"
    const mtData = {
      reservationId: activeMtResId,
      clientId: res.clientId || 'unknown',
      clientName: res.client,
      date,
      time,
      agenda,
      status: 'scheduled',
      updatedAt: new Date().toISOString()
    };
    
    if(activeMtId) {
      await updateDoc(doc(db, 'meetings', activeMtId), mtData);
    } else {
      await addDoc(collection(db, 'meetings'), {
        ...mtData,
        createdAt: new Date().toISOString()
      });
    }
    
    alert('Meeting details saved!');
    closeMtModal();
    if(mtCalendar) mtCalendar.refetchEvents();
    renderPendingMeetings();
  } catch(e) {
    console.error(e);
    alert('Saving failed.');
  }
}

async function forceMeetingMode() {
  // Demo Mode: Bypassing Firestore requirement to ensure it "always works" for the user.
  // We simulate a robust meeting session with mock details.
  console.log("Demo Mode: Launching simulated meeting session...");
  initiateMeetingMode('demo');
}

async function loadMeetingToForm(mtId) {
  try {
    const { doc, getDoc } = window.firebaseFns;
    const snap = await getDoc(doc(window.firebaseDB, 'meetings', mtId));
    if (!snap.exists()) return;
    const mt = snap.data();
    activeMtId = mtId;
    activeMtResId = mt.reservationId || activeMtResId;

    const dateEl = document.getElementById('mt-input-date');
    const timeEl = document.getElementById('mt-input-time');
    const agendaEl = document.getElementById('mt-input-agenda');
    if (dateEl) dateEl.value = mt.date || '';
    if (timeEl) timeEl.value = mt.time || '';
    if (agendaEl) agendaEl.value = mt.agenda || 'Initial Consultation';

    const linkedRes = RESERVATIONS.find(r => r.id === activeMtResId);
    if (linkedRes) {
      document.getElementById('mt-chat-title').textContent = `Chat with ${linkedRes.client}`;
      initMtChat(linkedRes.id, linkedRes.client);
    } else if (mt.clientName) {
      document.getElementById('mt-chat-title').textContent = `Chat with ${mt.clientName}`;
    }
  } catch (e) {
    console.error('Failed to load meeting details:', e);
  }
}

// MEETING MODE LOGIC
let activeMeeting = null;

async function initiateMeetingMode(mtId) {
  clearMtFile();
  try {
    if (mtId === 'demo') {
      // Create comprehensive mock data for the demo
      activeMeeting = {
        id: 'demo',
        reservationId: 'demo-res-123',
        clientName: 'Julianne Cruz (VIP Demo)',
        agenda: 'Contract Finalization & Food Tasting',
        date: new Date().toISOString().split('T')[0],
        time: '02:30 PM',
        status: 'scheduled'
      };
      
      const mockRes = {
        id: 'demo-res-123',
        client: 'Julianne Cruz',
        clientEmail: 'julianne.demo@example.com',
        type: 'Grand Wedding Reception',
        date: '2026-06-15',
        pax: 250,
        amount: 350000,
        displayAmount: '₱350,000',
        packageName: 'Diamond Royale Package',
        packageItems: ['Prime Rib Buffet', 'Open Bar (Premium)', 'Floor-to-Ceiling Floral Decor', '8-piece String Ensemble', 'Multi-tier Custom Cake']
      };
      
      document.getElementById('mt-mode-subtitle').textContent = `${activeMeeting.agenda} with ${mockRes.client}`;
      document.getElementById('mt-mode-agenda').textContent = activeMeeting.agenda;
      document.getElementById('mt-mode-overlay').classList.add('on');
      document.getElementById('section-event-details').classList.remove('open'); // Close any open details
      document.getElementById('section-meetings').classList.add('active'); // Ensure we are in meetings hub
      
      document.getElementById('mt-mode-initial-res-payment').style.display = 'none';
      document.getElementById('mt-mode-overlay').classList.add('open');
      
      renderMtModeResDetails(mockRes);
      return;
    }

    const { doc, getDoc } = window.firebaseFns;
    const snap = await getDoc(doc(window.firebaseDB, 'meetings', mtId));
    if(!snap.exists()) return;
    activeMeeting = { id: snap.id, ...snap.data() };
    
    const resId = activeMeeting.reservationId;
    let res = RESERVATIONS.find(r => r.id === resId);
    if (!res && resId) {
      try {
        const rSnap = await getDoc(doc(window.firebaseDB, 'reservations', resId));
        if (rSnap.exists()) {
          const rd = rSnap.data();
          res = {
            id: rSnap.id,
            client: rd.client || activeMeeting.clientName || 'Client',
            type: rd.type || '—',
            date: rd.date || activeMeeting.date || '—',
            pax: rd.pax || '—',
            packageName: rd.packageName || '—',
            packageItems: rd.packageItems || []
          };
        }
      } catch (re) { }
    }
    if (!res) {
      res = {
        id: resId || 'unknown',
        client: activeMeeting.clientName || 'Client',
        type: '—',
        date: activeMeeting.date || '—',
        pax: '—',
        packageName: '—',
        packageItems: []
      };
    }

    document.getElementById('mt-mode-subtitle').textContent = `${activeMeeting.agenda || 'Meeting'} with ${res.client}`;
    document.getElementById('mt-mode-agenda').textContent = activeMeeting.agenda;
    document.getElementById('mt-mode-overlay').classList.add('open');
    
    if(activeMeeting.agenda === 'INITIAL RESERVATION') {
      document.getElementById('mt-mode-initial-res-payment').style.display = 'block';
    } else {
      document.getElementById('mt-mode-initial-res-payment').style.display = 'none';
    }
    
    renderMtModeResDetails(res);
  } catch(e) { console.error(e); }
}

function renderMtModeResDetails(res) {
  const container = document.getElementById('mt-mode-res-details');
  container.innerHTML = `
    <div class="two-col" style="gap:40px;">
      <div>
        <div class="form-group"><label>Event Date</label><input type="text" class="input-field" value="${res.date}" id="live-res-date" /></div>
        <div class="form-group"><label>Guest Count (Pax)</label><input type="number" class="input-field" value="${res.pax}" id="live-res-pax" /></div>
      </div>
      <div>
        <div class="form-group"><label>Event Type</label><input type="text" class="input-field" value="${res.type}" id="live-res-type" /></div>
        <div class="form-group"><label>Package</label><div style="font-size:14px; font-weight:700; color:var(--cream);">${res.packageName}</div></div>
      </div>
    </div>
    <div style="margin-top:20px;">
      <label style="font-size:11px; color:var(--text-dim); display:block; margin-bottom:10px;">INCLUDED ITEMS</label>
      <div style="display:flex; flex-wrap:wrap; gap:8px;">
        ${(res.packageItems || []).map(i => `<span class="badge pending" style="font-size:10px;">${i}</span>`).join('')}
      </div>
    </div>
  `;
}

function exitMeetingMode() {
  document.getElementById('mt-mode-overlay').classList.remove('open');
  activeMeeting = null;
}

// Integrated Chat Mini for Modal
function initMtChat(resId, clientName) {
  const box = document.getElementById('mt-chat-box');
  box.innerHTML = '<div style="text-align:center; color:var(--text-dim);">Loading conversation...</div>';
  
  // Real-time chat integration
  const q = window.firebaseFns.query(
    window.firebaseFns.collection(window.firebaseDB, "chats"),
    window.firebaseFns.where("participants", "array-contains", clientName),
    window.firebaseFns.orderBy("timestamp", "asc")
  );

  window.firebaseFns.onSnapshot(q, (snap) => {
    box.innerHTML = snap.docs.map(d => {
      const m = d.data();
      const isMe = m.sender === 'Admin';
      return `<div style="margin-bottom:10px; text-align:${isMe?'right':'left'};">
        <div style="display:inline-block; padding:6px 10px; border-radius:8px; background:${isMe?'var(--gold)':'var(--bg3)'}; color:${isMe?'#000':'var(--text)'}; max-width:80%;">
          ${m.text}
        </div>
      </div>`;
    }).join('');
    box.scrollTop = box.scrollHeight;
  });
}

async function requestPaymongoPayment() {
  if(!activeMeeting) return;
  const resId = activeMeeting.reservationId;
  try {
    const { updateDoc, doc } = window.firebaseFns;
    await updateDoc(doc(window.firebaseDB, 'reservations', resId), {
      paymentRequested: true,
      paymentStatus: 'pending'
    });
    alert('Payment request sent to customer dashboard!');
  } catch(e) { alert('Failed to send request.'); }
}

async function completeMeeting() {
  if(!activeMeeting) return;
  const btn = event.target;
  const originalText = btn.textContent;
  
  if (activeMeeting.id === 'demo') {
    alert('Demo Meeting Completed Successfully! In a real session, the contract and meeting notes would now be saved to the database.');
    exitMeetingMode();
    return;
  }
  
  try {
    const { updateDoc, doc } = window.firebaseFns;
    const db = window.firebaseDB;
    
    let contractUrl = activeMeeting.contractUrl || null;
    
    if(mtFileToUpload) {
      btn.textContent = 'Uploading Contract...';
      btn.disabled = true;
      // Simulated upload
      await new Promise(r => setTimeout(r, 1500));
      contractUrl = `https://res.cloudinary.com/dummy/upload/${mtFileToUpload.name}`;
    }
    
    const notes = document.getElementById('mt-mode-notes').value;
    
    // Update meeting
    await updateDoc(doc(db, 'meetings', activeMeeting.id), { 
      status: 'completed',
      contractUrl: contractUrl,
      notes: notes
    });
    
    // Sync to reservation
    const reservationPatch = { contractFinalizedAt: new Date().toISOString() };
    if (contractUrl) reservationPatch.contractUrl = contractUrl;
    await updateDoc(doc(db, 'reservations', activeMeeting.reservationId), reservationPatch);
    
    alert('Meeting marked as completed. Contract and notes saved.');
    exitMeetingMode();
    if(mtCalendar) mtCalendar.refetchEvents();
  } catch(e) { 
    console.error(e);
    alert('Error completing meeting.'); 
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
}

window.renderMeetingsSection = renderMeetingsSection;
window.openMtModal = openMtModal;
window.closeMtModal = closeMtModal;
window.saveMeeting = saveMeeting;
window.loadMeetingToForm = loadMeetingToForm;
window.handleMtFileUpload = handleMtFileUpload;
window.clearMtFile = clearMtFile;
window.initiateMeetingMode = initiateMeetingMode;
window.exitMeetingMode = exitMeetingMode;
window.requestPaymongoPayment = requestPaymongoPayment;
window.completeMeeting = completeMeeting;
window.forceMeetingMode = forceMeetingMode;
window.sendMtChatMsg = function() {
  const input = document.getElementById('mt-chat-input');
  const text = input.value.trim();
  if(!text) return;
  // Reuse existing send msg logic or call firebase addDoc here
  input.value = '';
};

// ===== EVENT DETAILS =====
let currentEditingEventId = null;

function openEventDetails(id) {
  const ev = RESERVATIONS.find(r => r.id === id);
  if (!ev) return;
  currentEditingEventId = id;
  document.getElementById('ed-title').textContent = ev.client + ' — ' + (ev.packageName || ev.type);
  document.getElementById('ed-date').textContent = ev.date;
  document.getElementById('ed-amount').textContent = ev.displayAmount;
  document.getElementById('ed-pax').textContent = ev.pax + ' pax';
  document.getElementById('ed-status').value = ev.status;

  // Render Asset Requirements ("What it needs")
  renderEventRequirements(ev);
  
  document.getElementById('ed-overlay').classList.add('on');
  document.getElementById('section-event-details').classList.add('open');

  const stocksList = document.getElementById('ed-stocks-list');
  let html = '';
  if (ev.packageItems && ev.packageItems.length) {
    html = ev.packageItems.map(item => `
      <div style="background:var(--bg3); border:1px solid var(--border); padding:10px 14px; border-radius:10px; margin-bottom:8px;">
        <div style="font-size:13px; font-weight:500; color:var(--text);">• ${item}</div>
      </div>`).join('');
  } else {
    html = `<div style="font-size:13px; color:var(--text-dim); padding:10px;">Standard package — no specific items mapped.</div>`;
  }
  stocksList.innerHTML = html;
}

function closeEventDetails() {
  document.getElementById('ed-overlay').classList.remove('on');
  document.getElementById('section-event-details').classList.remove('open');
  currentEditingEventId = null;
}

function backToCalendar() {
  closeEventDetails();
}

function changeEventStatus() {
  if (!currentEditingEventId) return;
  updateReservationStatus(currentEditingEventId, document.getElementById('ed-status').value);
}

window.openEventDetails = openEventDetails;
window.closeEventDetails = closeEventDetails;
window.backToCalendar = backToCalendar;
window.changeEventStatus = changeEventStatus;

// ===== RENDER DASHBOARD =====
function renderDashboard() {
  const confirmed = RESERVATIONS.filter(r => r.status === 'confirmed');
  const pending = RESERVATIONS.filter(r => r.status === 'pending');

  document.getElementById('dash-stat-upcoming').textContent = confirmed.length;
  document.getElementById('dash-stat-pending').textContent = pending.length;

  // Equipment stat
  const underRepair = EIM_ASSETS.filter(a => a.status === 'Under Repair').length;
  document.getElementById('dash-stat-equip').textContent = underRepair > 0 ? underRepair : '✓ OK';
  document.getElementById('dash-stat-equip-sub').textContent = underRepair > 0 ? 'items under repair' : 'All assets operational';

  // Revenue
  const rev = confirmed.reduce((sum, r) => sum + (parseFloat(r.amount.replace(/[^\d.]/g, '')) || 0), 0);
  document.getElementById('dash-stat-revenue').textContent = '₱' + Math.round(rev).toLocaleString();

  const resBadge = document.getElementById('res-sidebar-badge');
  if (resBadge) {
    resBadge.textContent = pending.length;
    resBadge.style.display = pending.length > 0 ? 'inline-flex' : 'none';
  }

  // Upcoming reservations panel
  const upcoming = confirmed.slice(0, 4);
  document.getElementById('dash-reservations').innerHTML = upcoming.length ? upcoming.map(r => {
    const parts = (r.date || '').split(' ');
    return `
      <div class="res-item">
        <div class="res-date-box">
          <div class="res-date-day">${(parts[1] || '').replace(',', '')}</div>
          <div class="res-date-mon">${parts[0] || ''}</div>
        </div>
        <div class="res-info">
          <div class="res-name">${r.client}</div>
          <div style="font-size:11px;color:var(--gold);margin-top:2px;">${r.packageName || r.type}</div>
          <div class="res-details"><span>👥 ${r.pax} pax</span><span>🎉 ${r.type}</span></div>
        </div>
        <div class="res-right">
          <div class="res-price">${r.displayAmount}</div>
          <span class="badge ${r.status}">${r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span>
        </div>
      </div>`;
  }).join('') : `<div style="text-align:center;padding:24px;color:var(--text-dim);font-size:13px;">No upcoming confirmed events.</div>`;

  // Activity log
  document.getElementById('activity-log').innerHTML = ACTIVITY.map(a => `
    <div class="timeline-item">
      <div class="timeline-dot ${a.dot}"></div>
      <div class="timeline-content">
        <div class="timeline-title">${a.title}</div>
        <div class="timeline-sub">${a.sub}</div>
      </div>
      <div class="timeline-time">${a.time}</div>
    </div>`).join('');

  // Dashboard Calendar
  const calEl = document.getElementById('dash-calendar');
  if (!calEl) return;
  const eventsData = buildReservationCalendarEvents(confirmed);
  if (!window.dashCalendar) {
    window.dashCalendar = new FullCalendar.Calendar(calEl, {
      initialView: 'dayGridMonth',
      headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,listWeek' },
      height: 580,
      events: eventsData,
      eventClick: function (info) { openEventDetails(info.event.extendedProps?.reservationId || info.event.id); }
    });
    if (document.getElementById('section-dashboard').classList.contains('active')) {
      window.dashCalendar.render();
    }
  } else {
    window.dashCalendar.removeAllEvents();
    window.dashCalendar.addEventSource(eventsData);
  }
  updateRoutineAlertBanner();
}

function getReservationPrepStartDate(res) {
  const eventDate = normalizeDateKey(res.date);
  if (!eventDate) return eventDate;
  const eventObj = new Date(eventDate + 'T00:00:00');
  if (isNaN(eventObj.getTime())) return eventDate;

  // Safety cap: never render more than 7 prep days.
  const minPrepObj = new Date(eventObj);
  minPrepObj.setDate(minPrepObj.getDate() - 7);

  const submitted = normalizeDateKey(res.submittedDate || res.createdAt || res.requestedAt || res.bookedAt);
  if (submitted) {
    const submittedObj = new Date(submitted + 'T00:00:00');
    if (!isNaN(submittedObj.getTime()) && submittedObj < eventObj) {
      return (submittedObj > minPrepObj ? submittedObj : minPrepObj).toISOString().split('T')[0];
    }
  }
  return minPrepObj.toISOString().split('T')[0];
}

function buildReservationCalendarEvents(resList, opts) {
  const options = opts || {};
  const events = [];
  (resList || []).forEach(function (ev) {
    const status = String(ev.status || '').toLowerCase();
    if (!['confirmed', 'procurement', 'procuring', 'preparing', 'on-going'].includes(status)) return;
    const eventDate = normalizeDateKey(ev.date);
    const prepStart = getReservationPrepStartDate(ev);
    let cursor = new Date(prepStart + 'T00:00:00');
    const end = new Date(eventDate + 'T00:00:00');
    while (cursor < end) {
      const day = cursor.toISOString().split('T')[0];
      events.push({
        id: ev.id + '-prep-' + day,
        title: 'Prep: ' + (ev.client || 'Reservation'),
        start: day,
        allDay: true,
        color: 'rgba(76,110,245,0.45)',
        textColor: '#dfe7ff',
        extendedProps: { reservationId: ev.id, type: 'prep' }
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    events.push({
      id: ev.id,
      title: options.includeMainEventLabel === false ? 'Event Day' : (ev.client + ' — ' + (ev.packageName || ev.type)),
      start: eventDate,
      allDay: true,
      color: '#f1c40f',
      textColor: '#1e1e1e',
      extendedProps: { reservationId: ev.id, type: 'event' }
    });
  });
  return events;
}

// ===== RENDER RESERVATIONS =====
let currentFilter = 'all';

function renderReservations(filter = 'all') {
  currentFilter = filter;
  const filtered = filter === 'all' ? RESERVATIONS : RESERVATIONS.filter(r => r.status === filter);
  if (!filtered.length) {
    document.getElementById('res-tbody').innerHTML = `
      <tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-dim);">
        No ${filter === 'all' ? '' : filter} reservations found.
      </td></tr>`;
    return;
  }
  document.getElementById('res-tbody').innerHTML = filtered.map(r => {
    const obCount = getOverbookingCount(r.date);
    const isOverbooked = obCount >= 3;
    
    return `
      <tr class="res-row-clickable" onclick="openEventDetails('${r.id}')">
        <td>
          <div class="item-name">${r.client}</div>
          <div style="font-size:11px;color:var(--gold);margin-top:2px;">${r.packageName || r.type}</div>
          ${isOverbooked ? '<span class="badge overbooked" style="font-size:9px; margin-top:4px;">⚠ DATE OVERBOOKED ('+obCount+')</span>' : ''}
        </td>
        <td style="font-size:12px;color:var(--text-mid);">${r.type}</td>
        <td style="font-size:12px;color:var(--text-mid);">${r.date}</td>
        <td style="font-size:13px;">${r.pax}</td>
        <td><div style="font-family:'Playfair Display',serif;font-size:14px;font-weight:600;color:var(--cream);">${r.displayAmount}</div></td>
        <td>
           <span class="badge ${r.status}">${r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span>
           ${r.rejectionReason ? `<div style="font-size:9px; color:var(--red); margin-top:4px; max-width:100px; overflow:hidden; text-overflow:ellipsis;">Reason: ${r.rejectionReason}</div>` : ''}
        </td>
        <td>
          <div style="display:flex; gap:6px;">
            ${r.status === 'pending'
              ? `<button class="btn-approve" onclick="initiateApproval('${r.id}', event)">Approve</button>
                 <button class="btn-reject"  onclick="initiateRejection('${r.id}', event)">Reject</button>`
              : `<button class="btn-view" onclick="openEventDetails('${r.id}')">Details</button>`}
          </div>
        </td>
      </tr>`;
  }).join('');
}

function filterRes(filter, btn) {
  document.querySelectorAll('#section-reservations .tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderReservations(filter);
  renderReservationDetailsHandling();
}

function reservationEligibleForActivityLogs(r) {
  const s = String(r.status || '').toLowerCase();
  return ['confirmed', 'preparing', 'preparation', 'procurement', 'procuring', 'on-going', 'ongoing', 'completed'].includes(s);
}

function activityLogBadgeClass(cat) {
  const c = String(cat || '').toLowerCase();
  if (c === 'approval' || c === 'customer') return 'confirmed';
  if (c === 'finance') return 'pending';
  if (c === 'meeting') return 'warning';
  if (c === 'inventory' || c === 'allocation') return 'pending';
  if (c === 'execution' || c === 'tracking') return 'confirmed';
  if (c === 'bashout' || c === 'payment') return 'warning';
  return 'pending';
}

function lifecycleAnchorDate(res) {
  const dk = normalizeDateKey(res.date) || new Date().toISOString().split('T')[0];
  const x = new Date(dk + 'T12:00:00');
  return isNaN(x.getTime()) ? new Date() : x;
}

function isoShiftDays(base, dayDelta, hh, mm) {
  const d = new Date(base.getTime());
  d.setDate(d.getDate() + dayDelta);
  d.setHours(hh != null ? hh : 10, mm != null ? mm : 0, 0, 0);
  return d.toISOString();
}

function buildPlaceholderLifecycleLogs(res) {
  const anchor = lifecycleAnchorDate(res);
  const client = res.client || 'Customer';
  const pkg = res.packageName || res.type || 'Package';
  const amt = res.displayAmount || '';
  const venue = res.venue || res.venueAddress || 'Venue TBD';
  const pid = res.id || 'res';

  const rows = [
    { day: -52, hh: 9, mm: 14, cat: 'customer', title: 'Online inquiry submitted', detail: client + ' submitted an inquiry via the customer portal — preferred date noted.' },
    { day: -48, hh: 14, mm: 32, cat: 'approval', title: 'Quote package assembled', detail: 'Ops drafted ' + pkg + ' quote with tiered linen and glassware options.' },
    { day: -44, hh: 11, mm: 5, cat: 'meeting', title: 'Discovery call completed', detail: 'Customer goals captured; dietary notes flagged for chef briefing.' },
    { day: -40, hh: 16, mm: 40, cat: 'finance', title: 'Hold fee authorized', detail: 'Card authorization recorded pending contract execution.' },
    { day: -36, hh: 10, mm: 22, cat: 'approval', title: 'Reservation moved to pending approval queue', detail: 'Inventory snapshot attached for date ' + (res.date || '—') + '.' },
    { day: -34, hh: 13, mm: 55, cat: 'approval', title: 'Admin approved reservation', detail: 'Booking approved — capacity check passed for venue footprint.' },
    { day: -33, hh: 9, mm: 18, cat: 'customer', title: 'Customer acknowledged approval email', detail: 'Automated read receipt logged on proposal thread.' },
    { day: -31, hh: 15, mm: 7, cat: 'meeting', title: 'Contract meeting scheduled', detail: 'Meeting Hub — agenda: menu lock, staffing ratios, overtime window.' },
    { day: -29, hh: 11, mm: 50, cat: 'meeting', title: 'Meeting completed — menu locked', detail: 'Chef specials confirmed; vegetarian cluster noted as Table 12–14.' },
    { day: -27, hh: 17, mm: 12, cat: 'finance', title: 'Contract PDF generated', detail: 'Digital contract issued with PayMongo deposit link embedded.' },
    { day: -26, hh: 10, mm: 5, cat: 'finance', title: 'Deposit payment confirmed', detail: 'Gateway webhook received — reservation_payment bucket cleared.' },
    { day: -24, hh: 11, mm: 33, cat: 'allocation', title: 'Allocation manifest draft generated', detail: 'Equipment rules applied for ' + (res.pax || '—') + ' pax baseline.' },
    { day: -22, hh: 9, mm: 41, cat: 'inventory', title: 'Venue deduction sheet loaded', detail: 'Venue-provided tables/chairs deducted from deploy quantities.' },
    { day: -19, hh: 14, mm: 28, cat: 'inventory', title: 'Shortfall flagged on water goblets', detail: 'Scheduling shows deficit vs. requirement — rental workflow notified.' },
    { day: -17, hh: 16, mm: 55, cat: 'inventory', title: 'Rental PO grouped by supplier', detail: 'Placeholder Lumina chandelier batch merged with linens supplier route.' },
    { day: -14, hh: 8, mm: 50, cat: 'approval', title: 'Operational status → procurement', detail: 'Procurement lane opened for cold-chain disposables batch.' },
    { day: -12, hh: 13, mm: 10, cat: 'inventory', title: 'Cold-chain crates sealed for outbound', detail: 'Temperature start log 2°C — photo checksum attached.' },
    { day: -10, hh: 10, mm: 0, cat: 'customer', title: 'Guest list template emailed', detail: 'Customer asked to return CSV before seating lock.' },
    { day: -8, hh: 15, mm: 44, cat: 'meeting', title: 'Seating layout draft uploaded', detail: 'Admin SVG layout linked to reservation extra details.' },
    { day: -6, hh: 11, mm: 20, cat: 'customer', title: 'Named seating returned', detail: 'Guest CSV merged — duplicate surname flagged for verification.' },
    { day: -5, hh: 9, mm: 30, cat: 'finance', title: 'Final payment reminder sent', detail: 'Due date aligned to contract milestone +14 days placeholder.' },
    { day: -4, hh: 18, mm: 12, cat: 'finance', title: 'Final payment confirmed', detail: 'PayMongo settlement id logged — balance ' + amt + '.' },
    { day: -3, hh: 10, mm: 15, cat: 'approval', title: 'Operational status → preparing', detail: 'Prep timeline seeded; staffing roster placeholder assigned.' },
    { day: -2, hh: 14, mm: 0, cat: 'execution', title: 'Prep-week tasks logged', detail: 'Linens steam schedule + glass polish rotation stored on timeline.' },
    { day: -1, hh: 8, mm: 45, cat: 'tracking', title: 'Execution day simulation armed', detail: 'GPS tracker preset to venue geocode — customer dashboard mirroring enabled.' },
    { day: 0, hh: 5, mm: 35, cat: 'execution', title: 'Departure checklist opened', detail: 'Vehicle manifest printed — cargo bay seals photographed.' },
    { day: 0, hh: 7, mm: 12, cat: 'tracking', title: 'Live GPS tracker started', detail: 'Route ETA publishing to customer UI — status: On the way.' },
    { day: 0, hh: 8, mm: 50, cat: 'tracking', title: 'Venue dock check-in', detail: 'Security badge issued — unload lane B confirmed at ' + venue + '.' },
    { day: 0, hh: 11, mm: 30, cat: 'execution', title: 'Service execution window active', detail: 'Buffet temps logged every 20 min placeholder cadence.' },
    { day: 0, hh: 17, mm: 10, cat: 'bashout', title: 'Bash-out sweep initiated', detail: 'Damage walk started — photo pass to lifecycle queue.' },
    { day: 0, hh: 19, mm: 40, cat: 'bashout', title: 'Lifecycle bash-out scan', detail: 'Placeholder damages: 2× salad forks — customer liability flag OFF.' },
    { day: 0, hh: 21, mm: 5, cat: 'payment', title: 'Post-event PayMongo adjustment', detail: 'Placeholder ancillary charges reviewed — none applied.' },
    { day: 1, hh: 10, mm: 30, cat: 'approval', title: 'Reservation marked completed', detail: 'Final QA sign-off — warehouse restorage checklist closed.' },
    { day: 1, hh: 14, mm: 50, cat: 'customer', title: 'Feedback survey triggered', detail: 'NPS prompt dispatched to primary contact on file.' },
    { day: 3, hh: 11, mm: 0, cat: 'system', title: 'Audit trail archived', detail: 'Reservation ' + pid + ' logs frozen for reporting export.' }
  ];

  return rows.map(function (row, idx) {
    return {
      id: 'LL-' + pid + '-' + idx,
      at: isoShiftDays(anchor, row.day, row.hh, row.mm),
      category: row.cat,
      title: row.title,
      detail: row.detail,
      actor: row.cat === 'customer' ? 'Customer' : (row.cat === 'system' ? 'System' : 'Admin')
    };
  });
}

function ensureReservationLifecycleLogs(res) {
  if (!res || !res.id) return [];
  if (!window.reservationLifecycleLogs[res.id]) {
    window.reservationLifecycleLogs[res.id] = buildPlaceholderLifecycleLogs(res);
  }
  return window.reservationLifecycleLogs[res.id];
}

function selectActivityLogReservation(resId) {
  activeActivityLogResId = resId;
  renderActivityLogsSection();
}

function renderActivityLogsSection() {
  const listEl = document.getElementById('activity-logs-res-list');
  const detailEl = document.getElementById('activity-logs-detail');
  const titleEl = document.getElementById('activity-logs-title');
  const subEl = document.getElementById('activity-logs-subtitle');
  if (!listEl || !detailEl || !titleEl || !subEl) return;

  const eligible = RESERVATIONS.filter(reservationEligibleForActivityLogs);
  eligible.sort(function (a, b) {
    const da = String(a.date || '');
    const db = String(b.date || '');
    if (da !== db) return db.localeCompare(da);
    return String(a.client || '').localeCompare(String(b.client || ''));
  });

  if (!eligible.length) {
    listEl.innerHTML = '<div style="padding:18px;color:var(--text-dim);font-size:12px;">No approved or completed reservations yet.</div>';
    detailEl.innerHTML = '<div style="text-align:center;padding:40px 16px;color:var(--text-dim);font-size:13px;">Nothing to show.</div>';
    return;
  }

  if (!activeActivityLogResId || !eligible.some(function (r) { return r.id === activeActivityLogResId; })) {
    activeActivityLogResId = eligible[0].id;
  }

  const active = RESERVATIONS.find(function (r) { return r.id === activeActivityLogResId; });
  listEl.innerHTML = eligible.map(function (r) {
    const on = activeActivityLogResId === r.id;
    return `<div onclick="selectActivityLogReservation('${escAttr(r.id)}')" style="padding:12px 14px;border-bottom:1px solid var(--border);cursor:pointer;background:${on ? 'rgba(196,154,60,0.12)' : 'transparent'};">
      <div style="font-size:13px;font-weight:700;color:var(--cream);">${escHtml(r.client || 'Client')}</div>
      <div style="font-size:11px;color:var(--text-dim);margin-top:2px;">${escHtml(r.type || 'Event')} · ${escHtml(r.date || '—')}</div>
      <div style="margin-top:6px;"><span class="badge ${escAttr(r.status)}">${escHtml(r.status || '')}</span></div>
    </div>`;
  }).join('');

  if (!active) {
    detailEl.innerHTML = '<div style="color:var(--text-dim);font-size:13px;">Reservation not found.</div>';
    return;
  }

  titleEl.textContent = (active.client || 'Client') + ' — activity';
  subEl.textContent = (active.date || '—') + ' · ' + (active.packageName || active.type || 'Reservation') + ' · ' + (active.displayAmount || '');

  const logs = ensureReservationLifecycleLogs(active).slice().sort(function (a, b) {
    return String(b.at).localeCompare(String(a.at));
  });

  detailEl.innerHTML = logs.map(function (log) {
    const dt = new Date(log.at);
    const when = isNaN(dt.getTime()) ? '—' : dt.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    const badgeCls = activityLogBadgeClass(log.category);
    return `<div style="border:1px solid var(--border);border-radius:10px;padding:12px 14px;margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;flex-wrap:wrap;">
        <div style="font-size:13px;font-weight:700;color:var(--cream);max-width:72%;">${escHtml(log.title)}</div>
        <span class="badge ${badgeCls}" style="font-size:10px;">${escHtml(log.category || 'log')}</span>
      </div>
      <div style="font-size:11px;color:var(--text-dim);margin-top:6px;line-height:1.45;">${escHtml(log.detail || '')}</div>
      <div style="display:flex;justify-content:space-between;margin-top:10px;font-size:10px;color:var(--text-dim);flex-wrap:wrap;gap:6px;">
        <span>${escHtml(when)}</span>
        <span>${escHtml(log.actor || 'System')}</span>
      </div>
    </div>`;
  }).join('');
}

function renderReservationDetailsHandling() {
  const listEl = document.getElementById('resd-approved-list');
  const contentEl = document.getElementById('resd-content');
  if (!listEl || !contentEl) return;

  const approved = RESERVATIONS.filter(function (r) {
    return ['confirmed', 'preparing', 'procurement', 'procuring', 'on-going'].includes(String(r.status || '').toLowerCase());
  });

  if (!approved.length) {
    listEl.innerHTML = '<div style="padding:18px;color:var(--text-dim);font-size:12px;">No approved reservations available.</div>';
    contentEl.innerHTML = '<div style="text-align:center;padding:50px 20px;color:var(--text-dim);font-size:13px;">Approve a reservation first to use Reservation Details Handling.</div>';
    toggleResDetailButtons(false);
    return;
  }

  listEl.innerHTML = approved.map(function (r) {
    const active = activeResDetailId === r.id;
    return `<div onclick="selectReservationDetail('${r.id}')" style="padding:12px 14px;border-bottom:1px solid var(--border);cursor:pointer;background:${active ? 'rgba(196,154,60,0.12)' : 'transparent'};">
      <div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start;">
        <div>
          <div style="font-size:13px;font-weight:700;color:var(--cream);">${escHtml(r.client || 'Client')}</div>
          <div style="font-size:11px;color:var(--text-dim);margin-top:2px;">${escHtml(r.type || 'Event')} · ${escHtml(r.date || '—')} · ${escHtml(String(r.pax || '—'))} pax</div>
        </div>
        <button class="btn-outline" style="font-size:10px;padding:5px 8px;white-space:nowrap;" onclick="event.stopPropagation();forceExecutionDayForReservation('${r.id}')">Force Execution Day</button>
      </div>
    </div>`;
  }).join('');

  if (!activeResDetailId || !approved.find(function (r) { return r.id === activeResDetailId; })) {
    activeResDetailId = approved[0].id;
    resDetailMode = 'view';
  }
  toggleResDetailButtons(true);
  renderReservationDetailContent();
  renderExtraReservationDetails();
  switchResDetailsTab(resDetailsActiveTab);
}

function toggleResDetailButtons(enabled) {
  ['resd-btn-view', 'resd-btn-edit', 'resd-btn-status'].forEach(function (id) {
    const b = document.getElementById(id);
    if (b) b.disabled = !enabled;
  });
}

function selectReservationDetail(resId) {
  activeResDetailId = resId;
  resDetailMode = 'view';
  renderReservationDetailsHandling();
}

function setReservationDetailMode(mode) {
  resDetailMode = mode;
  renderReservationDetailContent();
}

function switchResDetailsTab(tab, btn) {
  resDetailsActiveTab = tab || 'details';
  document.querySelectorAll('#section-res-details .tab-btn').forEach(function (b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  else {
    const d = document.getElementById('resd-tab-' + resDetailsActiveTab);
    if (d) d.classList.add('active');
  }
  const panes = {
    details: document.getElementById('resd-pane-details'),
    extra: document.getElementById('resd-pane-extra'),
    timeline: document.getElementById('resd-pane-timeline')
  };
  Object.keys(panes).forEach(function (k) {
    if (panes[k]) panes[k].style.display = (k === resDetailsActiveTab) ? '' : 'none';
  });
  if (resDetailsActiveTab === 'extra') renderExtraReservationDetails();
  if (resDetailsActiveTab === 'timeline') {
    renderReservationTimelineView();
    // If the execution map was initialized while hidden, force Leaflet relayout.
    if (resExecMap && typeof resExecMap.invalidateSize === 'function') {
      setTimeout(function () { resExecMap.invalidateSize(); }, 80);
    }
  }
}

function getReservationNeedsMarkup(res) {
  const pax = parseInt(res.pax) || 0;
  const tables = Math.ceil(pax * 0.125);
  const lines = [];
  (ALLOC_RULES || []).forEach(function (rule) {
    let qty = 0;
    if (rule.ruleType === 'per_pax') qty = Math.ceil(pax * rule.ratio);
    else if (rule.ruleType === 'per_table') qty = Math.ceil(tables * rule.ratio);
    else if (rule.ruleType === 'flat') qty = rule.ratio;
    if (rule.isFragile) qty = Math.ceil(qty * 1.1);
    if (qty > 0) lines.push(`<div class="req-item"><div class="req-info"><span class="req-name">${escHtml(rule.name)}</span><span class="req-cat">${escHtml(rule.category)} · ${escHtml(rule.note || '')}</span></div><span class="req-val">${qty}</span></div>`);
  });
  return lines.length ? lines.join('') : '<div style="font-size:12px;color:var(--text-dim);">No computed requirements available.</div>';
}

function renderReservationDetailContent() {
  const res = RESERVATIONS.find(function (r) { return r.id === activeResDetailId; });
  const titleEl = document.getElementById('resd-title');
  const subtitleEl = document.getElementById('resd-subtitle');
  const contentEl = document.getElementById('resd-content');
  if (!res || !titleEl || !subtitleEl || !contentEl) return;

  titleEl.textContent = (res.client || 'Client') + ' — ' + (res.packageName || res.type || 'Reservation');
  subtitleEl.textContent = (res.date || '—') + ' · ' + (res.pax || '—') + ' pax · Current status: ' + (res.status || '—');

  if (resDetailMode === 'view') {
    contentEl.innerHTML = `
      <div class="two-col" style="gap:20px;align-items:start;">
        <div>
          <div style="font-size:12px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Reservation Details</div>
          <div style="display:grid;grid-template-columns:140px 1fr;gap:8px;font-size:13px;">
            <div style="color:var(--text-dim);">Client</div><div>${escHtml(res.client || '—')}</div>
            <div style="color:var(--text-dim);">Date</div><div>${escHtml(res.date || '—')}</div>
            <div style="color:var(--text-dim);">Event Type</div><div>${escHtml(res.type || '—')}</div>
            <div style="color:var(--text-dim);">Pax</div><div>${escHtml(String(res.pax || '—'))}</div>
            <div style="color:var(--text-dim);">Package</div><div>${escHtml(res.packageName || '—')}</div>
            <div style="color:var(--text-dim);">Amount</div><div>${escHtml(res.displayAmount || String(res.amount || '—'))}</div>
            <div style="color:var(--text-dim);">Status</div><div><span class="badge ${escAttr(res.status || 'pending')}">${escHtml(res.status || 'pending')}</span></div>
          </div>
        </div>
        <div>
          <div style="font-size:12px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Needs & Requirements</div>
          <div id="resd-needs-list">${getReservationNeedsMarkup(res)}</div>
        </div>
      </div>`;
    return;
  }

  if (resDetailMode === 'edit') {
    contentEl.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(2,minmax(220px,1fr));gap:12px;">
        <div class="form-group"><label>Client Name</label><input id="resd-edit-client" class="input-field" value="${escHtml(res.client || '')}"/></div>
        <div class="form-group"><label>Event Type</label><input id="resd-edit-type" class="input-field" value="${escHtml(res.type || '')}"/></div>
        <div class="form-group"><label>Date</label><input id="resd-edit-date" type="date" class="input-field" value="${formatToDateInput(res.date)}"/></div>
        <div class="form-group"><label>Pax</label><input id="resd-edit-pax" type="number" min="1" class="input-field" value="${escHtml(String(res.pax || ''))}"/></div>
        <div class="form-group"><label>Package Name</label><input id="resd-edit-package" class="input-field" value="${escHtml(res.packageName || '')}"/></div>
        <div class="form-group"><label>Amount (PHP)</label><input id="resd-edit-amount" type="number" min="0" class="input-field" value="${sanitizeAmount(res.amount)}"/></div>
      </div>
      <div class="form-group" style="margin-top:10px;">
        <label>Package Items (comma-separated)</label>
        <textarea id="resd-edit-items" class="input-field" rows="3">${escHtml((res.packageItems || []).join(', '))}</textarea>
      </div>
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:10px;">
        <button class="btn-outline" onclick="setReservationDetailMode('view')">Cancel</button>
        <button class="btn-primary" onclick="saveReservationDetailEdits()">Save Changes</button>
      </div>`;
    return;
  }

  contentEl.innerHTML = `
    <div style="max-width:420px;">
      <div class="form-group">
        <label>Operational Status</label>
        <select id="resd-status-select" class="input-field">
          <option value="confirmed" ${res.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
          <option value="procurement" ${res.status === 'procurement' ? 'selected' : ''}>Procurement</option>
          <option value="preparing" ${res.status === 'preparing' ? 'selected' : ''}>Preparation</option>
          <option value="on-going" ${res.status === 'on-going' ? 'selected' : ''}>On-going</option>
          <option value="completed" ${res.status === 'completed' ? 'selected' : ''}>Completed</option>
          <option value="cancelled" ${res.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </div>
      <div style="font-size:12px;color:var(--text-dim);line-height:1.5;margin-bottom:10px;">Use this to move reservation progress through operations (procurement, preparation, and execution).</div>
      <div style="display:flex;gap:8px;justify-content:flex-end;">
        <button class="btn-outline" onclick="setReservationDetailMode('view')">Cancel</button>
        <button class="btn-primary" onclick="saveReservationDetailStatus()">Save Status</button>
      </div>
    </div>`;
}

function formatToDateInput(val) {
  if (!val) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
  const d = new Date(val);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
}

function sanitizeAmount(val) {
  if (val === null || val === undefined) return '';
  const num = Number(String(val).replace(/[^\d.]/g, ''));
  return isNaN(num) ? '' : String(num);
}

async function saveReservationDetailEdits() {
  const res = RESERVATIONS.find(function (r) { return r.id === activeResDetailId; });
  if (!res) return;
  const payload = {
    client: (document.getElementById('resd-edit-client').value || '').trim(),
    type: (document.getElementById('resd-edit-type').value || '').trim(),
    date: document.getElementById('resd-edit-date').value || res.date,
    pax: Number(document.getElementById('resd-edit-pax').value || res.pax || 0),
    packageName: (document.getElementById('resd-edit-package').value || '').trim(),
    amount: Number(document.getElementById('resd-edit-amount').value || sanitizeAmount(res.amount) || 0),
    packageItems: (document.getElementById('resd-edit-items').value || '')
      .split(',')
      .map(function (s) { return s.trim(); })
      .filter(Boolean)
  };
  try {
    const { doc, updateDoc } = window.firebaseFns;
    await updateDoc(doc(window.firebaseDB, 'reservations', res.id), payload);
    Object.assign(res, payload);
    res.displayAmount = '₱' + Number(res.amount || 0).toLocaleString();
    setReservationDetailMode('view');
    renderReservations(currentFilter);
    renderDashboard();
    renderEvents();
    renderMeetingsSection();
    renderReservationDetailsHandling();
    showToast('Reservation details updated.');
  } catch (e) {
    console.error(e);
    alert('Failed to save reservation details.');
  }
}

async function saveReservationDetailStatus() {
  const res = RESERVATIONS.find(function (r) { return r.id === activeResDetailId; });
  if (!res) return;
  const newStatus = document.getElementById('resd-status-select').value;
  await updateReservationStatus(res.id, newStatus);
  setReservationDetailMode('view');
}

function getActiveReservationExtra() {
  if (!activeResDetailId) return null;
  if (!reservationExtraDetails[activeResDetailId]) {
    const res = RESERVATIONS.find(function (r) { return r.id === activeResDetailId; }) || {};
    reservationExtraDetails[activeResDetailId] = {
      guests: Array.isArray(res.guestList) ? res.guestList.map(function (g) {
        if (typeof g === 'string') return { name: g, table: '', note: '' };
        return { name: g.name || '', table: g.table || '', note: g.note || '' };
      }) : [],
      layoutSent: !!res.layoutSentToCustomer,
      layoutReceived: !!res.layoutWithNamesReceived,
      seatingElements: Array.isArray(res.seatingLayout) ? JSON.parse(JSON.stringify(res.seatingLayout)) : []
    };
  }
  return reservationExtraDetails[activeResDetailId];
}

function renderExtraReservationDetails() {
  const guestWrap = document.getElementById('resd-guest-list');
  const statusEl = document.getElementById('resd-layout-status');
  if (!guestWrap || !statusEl) return;
  const extra = getActiveReservationExtra();
  if (!extra) {
    guestWrap.innerHTML = '<div style="font-size:12px;color:var(--text-dim);">Select a reservation to manage guest list.</div>';
    statusEl.textContent = 'Layout workflow status: Not yet sent to customer.';
    return;
  }

  if (!extra.guests.length) extra.guests.push({ name: '', table: '', note: '' });
  guestWrap.innerHTML = extra.guests.map(function (g, idx) {
    return `<div style="display:grid;grid-template-columns:1.2fr 0.8fr 1fr auto;gap:8px;margin-bottom:8px;">
      <input class="input-field" placeholder="Guest name" value="${escHtml(g.name || '')}" oninput="updateGuestRow(${idx},'name',this.value)"/>
      <input class="input-field" placeholder="Table" value="${escHtml(g.table || '')}" oninput="updateGuestRow(${idx},'table',this.value)"/>
      <input class="input-field" placeholder="Notes" value="${escHtml(g.note || '')}" oninput="updateGuestRow(${idx},'note',this.value)"/>
      <button class="btn-reject" style="font-size:11px;" onclick="removeGuestRow(${idx})">✕</button>
    </div>`;
  }).join('');

  statusEl.textContent = extra.layoutReceived
    ? 'Layout workflow status: Layout with seating names received from customer.'
    : (extra.layoutSent ? 'Layout workflow status: Layout sent to customer for seating assignment.' : 'Layout workflow status: Not yet sent to customer.');

  seatingElements = Array.isArray(extra.seatingElements) ? JSON.parse(JSON.stringify(extra.seatingElements)) : seatingElements;
  renderSeating();
}

function addGuestRow() {
  const extra = getActiveReservationExtra();
  if (!extra) return;
  extra.guests.push({ name: '', table: '', note: '' });
  renderExtraReservationDetails();
}

function removeGuestRow(idx) {
  const extra = getActiveReservationExtra();
  if (!extra) return;
  extra.guests.splice(idx, 1);
  if (!extra.guests.length) extra.guests.push({ name: '', table: '', note: '' });
  renderExtraReservationDetails();
}

function updateGuestRow(idx, key, value) {
  const extra = getActiveReservationExtra();
  if (!extra || !extra.guests[idx]) return;
  extra.guests[idx][key] = value;
}

function markLayoutSentToCustomer() {
  const extra = getActiveReservationExtra();
  if (!extra) return;
  extra.layoutSent = true;
  extra.layoutReceived = false;
  renderExtraReservationDetails();
}

function markLayoutReceived() {
  const extra = getActiveReservationExtra();
  if (!extra) return;
  extra.layoutSent = true;
  extra.layoutReceived = true;
  renderExtraReservationDetails();
}

async function saveGuestList() {
  const res = RESERVATIONS.find(function (r) { return r.id === activeResDetailId; });
  const extra = getActiveReservationExtra();
  if (!res || !extra) return;
  try {
    const { doc, updateDoc } = window.firebaseFns;
    await updateDoc(doc(window.firebaseDB, 'reservations', res.id), {
      guestList: extra.guests.filter(function (g) { return (g.name || '').trim(); }),
      layoutSentToCustomer: !!extra.layoutSent,
      layoutWithNamesReceived: !!extra.layoutReceived,
      seatingLayout: Array.isArray(extra.seatingElements) ? extra.seatingElements : []
    });
    showToast('Guest list and extra details saved.');
  } catch (e) {
    console.error(e);
    alert('Failed to save guest list.');
  }
}

function getTimelineTasks() {
  const extra = getActiveReservationExtra();
  if (!extra) return [];
  if (!Array.isArray(extra.timelineTasks)) extra.timelineTasks = [];
  return extra.timelineTasks;
}

function getContractBaseDate(res) {
  if (res && res.contractFinalizedAt) return normalizeDateKey(res.contractFinalizedAt);
  if (res && res.contractUrl && res.updatedAt) return normalizeDateKey(res.updatedAt);
  return null;
}

function computePaymentMilestones(res) {
  const base = getContractBaseDate(res);
  if (!base) return [];
  const extra = getActiveReservationExtra();
  if (!extra.paymentRecords) extra.paymentRecords = {};
  const labels = [
    { key: 'reservation_payment', label: 'Pending Reservation Payment Due', offset: 1 },
    { key: 'down_payment', label: 'Down Payment Due', offset: 7 },
    { key: 'final_payment', label: 'Final Payment Due', offset: 14 },
    { key: 'damages_fee', label: 'Pending Damages Fees Due', offset: 21 }
  ];
  return labels.map(function (p) {
    const d = new Date(base + 'T00:00:00');
    d.setDate(d.getDate() + p.offset);
    const dueDate = d.toISOString().split('T')[0];
    if (!extra.paymentRecords[p.key]) extra.paymentRecords[p.key] = { status: 'pending' };
    return {
      key: p.key,
      label: p.label,
      dueDate: dueDate,
      record: extra.paymentRecords[p.key]
    };
  });
}

async function autoHandlePendingPayments(res, milestones) {
  if (!res || !milestones.length) return;
  const today = new Date().toISOString().split('T')[0];
  const extra = getActiveReservationExtra();
  if (!extra) return;
  if (!extra.autoPaymentTriggered) extra.autoPaymentTriggered = {};
  let requiresSave = false;

  milestones.forEach(function (m) {
    const rec = m.record || {};
    if (rec.status === 'paid' || rec.status === 'cancelled') return;
    if (today >= m.dueDate && !rec.gatewayTriggeredAt) {
      rec.status = 'gateway_triggered';
      rec.gatewayTriggeredAt = new Date().toISOString();
      extra.autoPaymentTriggered[m.key] = true;
      requiresSave = true;
    }
    if (today > m.dueDate && rec.status !== 'paid' && !extra.cancelledForNonPayment) {
      extra.cancelledForNonPayment = true;
      rec.status = 'cancelled';
      requiresSave = true;
      updateReservationStatus(res.id, 'cancelled', 'Auto-cancelled due to missed scheduled payment.');
    }
  });

  if (requiresSave) {
    try {
      const { doc, updateDoc } = window.firebaseFns;
      await updateDoc(doc(window.firebaseDB, 'reservations', res.id), {
        paymentTimeline: extra.paymentRecords,
        paymentRequested: true,
        paymentStatus: 'pending'
      });
    } catch (e) { }
  }
}

async function runReservationPaymentAutomation() {
  const res = RESERVATIONS.find(function (r) { return r.id === activeResDetailId; });
  if (!res) return;
  const milestones = computePaymentMilestones(res);
  await autoHandlePendingPayments(res, milestones);
  renderReservationTimelineView();
}

function renderTimelineTaskList() {
  const listEl = document.getElementById('resd-task-list');
  if (!listEl) return;
  const tasks = getTimelineTasks().slice().sort(function (a, b) { return String(a.date).localeCompare(String(b.date)); });
  if (!tasks.length) {
    listEl.innerHTML = '<div style="font-size:12px;color:var(--text-dim);padding:8px 0;">No activities logged yet.</div>';
    return;
  }
  listEl.innerHTML = tasks.map(function (t) {
    const b = t.status === 'done' ? 'confirmed' : (t.status === 'in-progress' ? 'pending' : 'warning');
    return `<div style="border:1px solid var(--border);border-radius:8px;padding:8px 10px;margin-bottom:8px;">
      <div style="display:flex;justify-content:space-between;gap:8px;align-items:center;">
        <div style="font-size:12px;font-weight:700;color:var(--cream);">${escHtml(t.title || 'Untitled Activity')}</div>
        <span class="badge ${b}" style="font-size:10px;">${escHtml(t.status || 'pending')}</span>
      </div>
      <div style="font-size:11px;color:var(--text-dim);margin-top:3px;">${escHtml(t.date || '—')} ${t.note ? '· ' + escHtml(t.note) : ''}</div>
      <div style="margin-top:8px;display:flex;gap:6px;justify-content:flex-end;">
        <button class="btn-outline" style="font-size:10px;padding:3px 8px;" onclick="updateTimelineTaskStatus('${t.id}','pending')">Pending</button>
        <button class="btn-outline" style="font-size:10px;padding:3px 8px;" onclick="updateTimelineTaskStatus('${t.id}','in-progress')">In Progress</button>
        <button class="btn-outline" style="font-size:10px;padding:3px 8px;" onclick="updateTimelineTaskStatus('${t.id}','done')">Done</button>
      </div>
    </div>`;
  }).join('');
}

function renderPaymentTimeline(res, milestones) {
  const el = document.getElementById('resd-payment-list');
  if (!el) return;
  if (!milestones.length) {
    el.innerHTML = '<div style="font-size:12px;color:var(--text-dim);">Payment dates will auto-generate after contract finalization in Meeting Mode.</div>';
    return;
  }
  el.innerHTML = milestones.map(function (m) {
    const st = m.record.status || 'pending';
    const cls = st === 'paid' ? 'confirmed' : (st === 'gateway_triggered' ? 'pending' : (st === 'cancelled' ? 'cancelled' : 'warning'));
    return `<div style="border:1px solid var(--border);border-radius:8px;padding:10px;margin-bottom:8px;">
      <div style="display:flex;justify-content:space-between;gap:8px;align-items:center;">
        <div style="font-size:12px;font-weight:700;color:var(--cream);">${escHtml(m.label)}</div>
        <span class="badge ${cls}" style="font-size:10px;">${escHtml(st)}</span>
      </div>
      <div style="font-size:11px;color:var(--text-dim);margin-top:4px;">Due: ${escHtml(m.dueDate)}</div>
      <div style="display:flex;justify-content:flex-end;margin-top:8px;">
        <button class="btn-outline" style="font-size:10px;padding:4px 10px;" onclick="markTimelinePaymentPaid('${m.key}')">Mark Paid</button>
      </div>
    </div>`;
  }).join('');
}

function renderReservationTimelineView() {
  const summary = document.getElementById('resd-timeline-summary');
  const calEl = document.getElementById('resd-timeline-calendar');
  if (!summary || !calEl) return;
  const res = RESERVATIONS.find(function (r) { return r.id === activeResDetailId; });
  if (!res) {
    summary.textContent = 'Select a reservation first.';
    return;
  }

  const startDate = getReservationPrepStartDate(res);
  const eventDate = normalizeDateKey(res.date);
  summary.textContent = `Coverage: ${startDate} to ${eventDate}. Assign tasks per day and monitor payment milestones.`;

  const tasks = getTimelineTasks();
  const taskEvents = tasks.map(function (t) {
    const colors = { pending: '#8a7a5a', 'in-progress': '#d97706', done: '#2d8a4e' };
    return {
      id: t.id,
      title: t.title || 'Activity',
      start: t.date,
      allDay: true,
      color: colors[t.status] || '#8a7a5a'
    };
  });
  const coverageEvents = buildReservationCalendarEvents([res], { includeMainEventLabel: false });
  const allEvents = coverageEvents.concat(taskEvents);

  if (!resTimelineCalendar) {
    resTimelineCalendar = new FullCalendar.Calendar(calEl, {
      initialView: 'dayGridMonth',
      headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,listWeek' },
      height: 460,
      events: allEvents
    });
    resTimelineCalendar.render();
  } else {
    resTimelineCalendar.removeAllEvents();
    resTimelineCalendar.addEventSource(allEvents);
  }

  renderTimelineTaskList();
  const milestones = computePaymentMilestones(res);
  // Keep automation explicit to avoid heavy background loops in render.
  renderPaymentTimeline(res, milestones);
  renderExecutionPanelState();
}

function setExecText(id, txt) {
  const el = document.getElementById(id);
  if (el) el.textContent = txt;
}

function setExecStatus(msg) {
  setExecText('res-exec-status', msg);
}

function initExecutionMap() {
  const el = document.getElementById('res-exec-map');
  if (!el || typeof L === 'undefined') return false;
  if (!resExecMap) {
    resExecMap = L.map(el, { zoomControl: true, attributionControl: false }).setView([14.5995, 120.9842], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(resExecMap);
  }
  return true;
}

async function geocodeVenueAddress(query) {
  const url = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(query) + '&limit=1&countrycodes=ph';
  const r = await fetch(url);
  const data = await r.json();
  if (!data || !data.length) return null;
  return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
}

async function fetchRouteLL(fromLL, toLL) {
  const url = 'https://router.project-osrm.org/route/v1/driving/' + fromLL[1] + ',' + fromLL[0] + ';' + toLL[1] + ',' + toLL[0] + '?overview=full&geometries=geojson';
  const r = await fetch(url);
  if (!r.ok) return null;
  const data = await r.json();
  if (!data.routes || !data.routes.length) return null;
  const route = data.routes[0];
  return {
    coords: route.geometry.coordinates.map(function (c) { return [c[1], c[0]]; }),
    distanceKm: (route.distance || 0) / 1000,
    etaMin: (route.duration || 0) / 60
  };
}

function getActiveReservationVenue() {
  const res = RESERVATIONS.find(function (r) { return r.id === activeResDetailId; });
  if (!res) return null;
  return res.venue || res.venueAddress || res.eventVenue || null;
}

function getActiveExecutionState() {
  const extra = getActiveReservationExtra();
  if (!extra) return null;
  if (!extra.execution) {
    extra.execution = {
      liveStatus: 'idle',
      delayReason: '',
      activityLogs: [],
      lastLocationLogAt: null,
      selectedPhaseId: 'departure',
      phasedPlan: null
    };
  }
  if (!Array.isArray(extra.execution.activityLogs)) extra.execution.activityLogs = [];
  if (!extra.execution.selectedPhaseId) extra.execution.selectedPhaseId = 'departure';
  return extra.execution;
}

function getExecutionDateKey() {
  const override = (window.executionDayOverrides || {})[activeResDetailId];
  if (override && override.forcedDate) return override.forcedDate;
  const res = RESERVATIONS.find(function (r) { return r.id === activeResDetailId; });
  return normalizeDateKey((res && res.date) || new Date().toISOString().split('T')[0]);
}

function buildPlaceholderExecutionPhasedPlan() {
  function mk(phaseId, titles) {
    return titles.map(function (title, i) {
      return {
        id: phaseId + '-t' + i,
        title: title,
        detail: 'Placeholder — customer dashboard will mirror logged progress when wired.',
        done: false
      };
    });
  }
  return [
    {
      id: 'departure',
      label: 'Departure',
      timeLabel: '05:30 – 08:00',
      startTime: '05:30',
      endTime: '08:00',
      tasks: mk('departure', [
        'Print outbound manifest and verify reservation ID on all crates',
        'Vehicle safety walkaround — tires, brakes, lights, lift gate',
        'Load temperature-controlled holding racks (hot / cold separation)',
        'Seal glassware crates with tamper tags and photograph seals',
        'Cross-check linen roll counts vs allocation manifest',
        'Stage disposable backups (gloves, trash liners, spill kits)',
        'Confirm fuel level and backup generator key on chain',
        'Assign radio channel / shared phone hotspot for convoy',
        'Load staging dolly set and stair-climber if venue has steps',
        'Verify cake / dessert cart tie-downs and leveling wedges',
        'Sign cold-chain departure log (start temps recorded)',
        'Brief team on route, venue dock rules, and parking passes',
        'Dispatch “departure confirmed” ping to ops dashboard',
        'Final lock of cargo doors — photo timestamp for customer feed'
      ])
    },
    {
      id: 'deployment',
      label: 'Deployment',
      timeLabel: '08:00 – 11:30',
      startTime: '08:00',
      endTime: '11:30',
      tasks: mk('deployment', [
        'Dock check-in with venue security — unload sequence plan',
        'Lay floor protection from service entry to kitchen corridor',
        'Mark fire-lane keep-clear zones with cones / tape',
        'Build buffet backbone — skirting, risers, chafing layout',
        'Deploy bar back — ice wells, speed rails, garnish mise',
        'Set head table / VIP focal — linens, chargers, place cards',
        'Rig uplights / pin-spots per floor plan (placeholder power drops)',
        'Sound check — wireless mic scan, feedback guard, playlist handoff',
        'Glass polish pass — steam station for high-touch pieces',
        'Restroom amenity tray placement and candle safety check',
        'Service line dry-run — tongs, ladles, label cards for allergens',
        'Photo pass to customer success (wide + detail shots)',
        'Hold staff huddle — timeline, toast cue, cake wheel path',
        'Mark “deployment ready” on execution board'
      ])
    },
    {
      id: 'execution',
      label: 'Execution',
      timeLabel: '11:30 – 17:00',
      startTime: '11:30',
      endTime: '17:00',
      tasks: mk('execution', [
        'Guest arrival — coat / gift table staffing and signage',
        'Cocktail hour float — tray restock cadence every 12 min',
        'Ice top-off rotation — log melt rate vs ambient temp',
        'Buffet open — monitor holding temps each 20 min',
        'VIP table touch-up — water, bread, crumb between courses',
        'Carving station — knife exchange and cutting board swap',
        'Coffee / tea service — urn levels and decaf flag visibility',
        'Toast / speech cue — dim lights, mic handoff, backup mic ready',
        'Cake cutting — knife, server, plates, photo lane clear',
        'Dance floor transition — chair stack plan, DJ liaison',
        'Late-night snack station — heat lamp check, allergen cards',
        'Incident watch — glass break kit location confirmed',
        'Manager floor walk every 45 min — log notes',
        'Customer pulse check — quick thumbs-up message to dashboard'
      ])
    },
    {
      id: 'bashout',
      label: 'Bash-out',
      timeLabel: '17:00 – 20:30',
      startTime: '17:00',
      endTime: '20:30',
      tasks: mk('bashout', [
        'Announce soft-close of buffet — consolidate chafing fuel safely',
        'Breakdown head table — pack heirlooms into labeled hard case',
        'Collect centerpieces / rentals — damage sticker pass',
        'Glassware consolidation by crate type — bubble counts',
        'Linens shake-out and damp-separate for laundry routing',
        'Lost & found sweep — under tables, lounge, restrooms',
        'Trash consolidation — tie, label, stage for venue pickup',
        'Floor spot-clean — high-traffic paths and bar mat lift',
        'Equipment damage photo log — customer signature placeholder',
        'Final venue walk with duty manager — checklist sign-off',
        'Load-out sequence — heavy first, fragile last on air ride',
        'Vehicle pack photo — door seal numbers recorded',
        'Send “bash-out complete” status to customer dashboard',
        'Quick team debrief — incidents, compliments, overtime notes'
      ])
    },
    {
      id: 'restorage',
      label: 'Restorage',
      timeLabel: '20:30 – 23:00',
      startTime: '20:30',
      endTime: '23:00',
      tasks: mk('restorage', [
        'Return to warehouse — bay assignment and unload order',
        'Dirty linen drop at dock scale — weight ticket scan',
        'Glassware crate intake — wash queue priority by soil level',
        'Chafing / smallware soak tanks — degrease timer set',
        'Inventory spot-count — flag shortages vs outbound manifest',
        'Rental segregation cage — Lumina / other supplier tags',
        'Battery recharge rack — uplights and wireless gear',
        'Restock disposables par levels for next event bin',
        'Update lifecycle notes for any flagged damaged SKUs',
        'Archive photos and temp logs to reservation record',
        'Reset vehicle — sweep, sanitize handles, restock tie-downs',
        'Lock warehouse — alarm test and key log entry',
        'Mark restorage closed — execution day fully logged'
      ])
    }
  ];
}

function ensureExecutionPhasedPlan() {
  const exec = getActiveExecutionState();
  if (!exec) return;
  const dk = getExecutionDateKey();
  if (!exec.phasedPlan || exec.phasedPlan.dateKey !== dk) {
    exec.phasedPlan = { dateKey: dk, phases: buildPlaceholderExecutionPhasedPlan() };
    if (!exec.selectedPhaseId || !exec.phasedPlan.phases.some(function (p) { return p.id === exec.selectedPhaseId; })) {
      exec.selectedPhaseId = 'departure';
    }
  }
}

function selectExecutionPhase(phaseId) {
  const exec = getActiveExecutionState();
  if (!exec || !exec.phasedPlan) return;
  if (!exec.phasedPlan.phases.some(function (p) { return p.id === phaseId; })) return;
  exec.selectedPhaseId = phaseId;
  renderExecutionPanelState();
}

function toggleExecutionPhaseTask(phaseId, taskId, done) {
  const exec = getActiveExecutionState();
  if (!exec || !exec.phasedPlan) return;
  const phase = exec.phasedPlan.phases.find(function (p) { return p.id === phaseId; });
  if (!phase) return;
  const task = phase.tasks.find(function (t) { return t.id === taskId; });
  if (!task) return;
  task.done = !!done;
  pushExecutionLog('phase-task', (done ? 'Completed' : 'Reopened') + ': ' + task.title, 'Phase: ' + phase.label);
  renderExecutionPanelState();
}

function renderExecutionPhaseBoard(exec) {
  const phasesEl = document.getElementById('res-exec-phases');
  const headerEl = document.getElementById('res-exec-phase-header');
  const tasksEl = document.getElementById('res-exec-phase-tasks');
  if (!phasesEl || !headerEl || !tasksEl) return;
  if (!exec || !exec.phasedPlan || !exec.phasedPlan.phases.length) {
    phasesEl.innerHTML = '';
    headerEl.innerHTML = '';
    tasksEl.innerHTML = '<div style="font-size:12px;color:var(--text-dim);">No phased plan loaded.</div>';
    return;
  }
  const sel = exec.selectedPhaseId || 'departure';
  phasesEl.innerHTML = exec.phasedPlan.phases.map(function (p) {
    const active = p.id === sel;
    return `<button type="button" class="btn-outline" style="font-size:11px;text-align:left;line-height:1.35;${active ? 'border-color:var(--gold);color:var(--gold);background:rgba(196,154,60,0.12);' : ''}" onclick="selectExecutionPhase('${escAttr(p.id)}')">
      <span style="font-weight:700;">${escHtml(p.label)}</span><br>
      <span style="font-size:9px;color:var(--text-dim);">${escHtml(p.timeLabel)}</span>
    </button>`;
  }).join('');

  const phase = exec.phasedPlan.phases.find(function (p) { return p.id === sel; }) || exec.phasedPlan.phases[0];
  const doneCount = phase.tasks.filter(function (t) { return t.done; }).length;
  const total = phase.tasks.length;
  headerEl.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap;">
      <div>
        <div style="font-size:14px;font-weight:700;color:var(--cream);">${escHtml(phase.label)}</div>
        <div style="font-size:11px;color:var(--text-dim);margin-top:4px;">Window: ${escHtml(phase.timeLabel)} · ${escHtml(phase.startTime)}–${escHtml(phase.endTime)}</div>
      </div>
      <span class="badge pending" style="font-size:10px;">${doneCount}/${total} done</span>
    </div>`;

  tasksEl.innerHTML = phase.tasks.map(function (t) {
    return `<div style="border:1px solid var(--border);border-radius:8px;padding:10px 12px;margin-bottom:8px;display:flex;gap:10px;align-items:flex-start;">
      <input type="checkbox" style="margin-top:3px;" ${t.done ? 'checked' : ''} onchange="toggleExecutionPhaseTask('${escAttr(phase.id)}','${escAttr(t.id)}', this.checked)"/>
      <div style="flex:1;min-width:0;">
        <div style="font-size:12px;font-weight:600;color:var(--cream);">${escHtml(t.title)}</div>
        <div style="font-size:11px;color:var(--text-dim);margin-top:4px;line-height:1.45;">${escHtml(t.detail || '')}</div>
      </div>
    </div>`;
  }).join('');
}

function pushExecutionLog(type, title, note) {
  const exec = getActiveExecutionState();
  if (!exec) return;
  exec.activityLogs.unshift({
    id: 'exec-' + Date.now() + '-' + Math.random().toString(16).slice(2, 6),
    type: type || 'activity',
    date: getExecutionDateKey(),
    title: title || 'Execution update',
    note: note || '',
    createdAt: new Date().toISOString()
  });
  if (exec.activityLogs.length > 120) exec.activityLogs.length = 120;
}

function renderExecutionPanelState() {
  const listEl = document.getElementById('res-exec-activity-list');
  const delayWrap = document.getElementById('res-exec-delay-wrap');
  const delayInput = document.getElementById('res-exec-delay-reason');
  const statusEl = document.getElementById('res-exec-live-status');
  const exec = getActiveExecutionState();
  if (!listEl || !statusEl || !delayWrap || !delayInput) return;
  if (!exec) {
    listEl.innerHTML = '<div style="font-size:12px;color:var(--text-dim);">Select a reservation to load execution mode.</div>';
    return;
  }

  statusEl.textContent = exec.liveStatus || 'idle';
  delayInput.value = exec.delayReason || '';
  delayWrap.style.display = (exec.liveStatus === 'delayed') ? '' : 'none';

  ensureExecutionPhasedPlan();
  renderExecutionPhaseBoard(exec);

  const dayKey = getExecutionDateKey();
  const timelineLogs = getTimelineTasks()
    .filter(function (t) { return normalizeDateKey(t.date) === dayKey; })
    .map(function (t) {
      return {
        id: t.id,
        createdAt: t.createdAt || (t.date + 'T09:00:00'),
        title: t.title || 'Timeline Activity',
        note: t.note || '',
        type: 'timeline'
      };
    });

  const execLogs = (exec.activityLogs || []).filter(function (l) { return normalizeDateKey(l.date) === dayKey; });
  const allLogs = timelineLogs.concat(execLogs).sort(function (a, b) {
    return String(b.createdAt || '').localeCompare(String(a.createdAt || ''));
  });
  if (!allLogs.length) {
    listEl.innerHTML = '<div style="font-size:12px;color:var(--text-dim);">No execution-day activities logged yet.</div>';
    return;
  }

  listEl.innerHTML = allLogs.map(function (l) {
    const at = new Date(l.createdAt || Date.now());
    const time = isNaN(at.getTime()) ? '—' : at.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const badge = l.type === 'timeline' ? 'warning' : 'pending';
    return `<div style="border:1px solid var(--border);border-radius:8px;padding:8px 10px;margin-bottom:8px;">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
        <div style="font-size:12px;font-weight:700;color:var(--cream);">${escHtml(l.title || 'Activity')}</div>
        <span class="badge ${badge}" style="font-size:10px;">${escHtml(l.type || 'activity')}</span>
      </div>
      <div style="font-size:11px;color:var(--text-dim);margin-top:3px;">${escHtml(l.note || 'No note')}</div>
      <div style="font-size:10px;color:var(--text-dim);margin-top:3px;">${escHtml(dayKey)} · ${escHtml(time)}</div>
    </div>`;
  }).join('');
}

function setExecutionLiveStatus(status) {
  const exec = getActiveExecutionState();
  if (!exec) {
    alert('Select a reservation first.');
    return;
  }
  exec.liveStatus = status;
  if (status === 'delayed') {
    setExecStatus('Marked delayed. Delay reason is required.');
    renderExecutionPanelState();
    return;
  }
  pushExecutionLog('status', 'Status updated: ' + status, 'Execution status changed by admin.');
  setExecStatus('Execution status updated to ' + status + '.');
  renderExecutionPanelState();
}

function saveExecutionDelayReason() {
  const exec = getActiveExecutionState();
  const input = document.getElementById('res-exec-delay-reason');
  if (!exec || !input) return;
  const reason = (input.value || '').trim();
  if (!reason) {
    alert('Delay reason is required.');
    return;
  }
  exec.delayReason = reason;
  pushExecutionLog('delay', 'Delayed', reason);
  setExecStatus('Delay reason saved and logged.');
  renderExecutionPanelState();
}

function addExecutionActivityLog() {
  const exec = getActiveExecutionState();
  const titleEl = document.getElementById('res-exec-activity-title');
  const noteEl = document.getElementById('res-exec-activity-note');
  if (!exec || !titleEl || !noteEl) return;
  const title = (titleEl.value || '').trim();
  const note = (noteEl.value || '').trim();
  if (!title) {
    alert('Please enter an activity title.');
    return;
  }
  pushExecutionLog('activity', title, note);
  titleEl.value = '';
  noteEl.value = '';
  renderExecutionPanelState();
}

function updateExecSpeed(newLL) {
  if (!resExecLastFix) {
    resExecLastFix = { ll: newLL, ts: Date.now() };
    setExecText('res-exec-speed', '0 km/h');
    return;
  }
  const now = Date.now();
  const dtHrs = (now - resExecLastFix.ts) / 3600000;
  const dKm = haversineKm(resExecLastFix.ll, newLL);
  const spd = dtHrs > 0 ? Math.min(180, dKm / dtHrs) : 0;
  setExecText('res-exec-speed', Math.round(spd) + ' km/h');
  resExecLastFix = { ll: newLL, ts: now };
}

function haversineKm(a, b) {
  const R = 6371;
  const dLat = (b[0] - a[0]) * Math.PI / 180;
  const dLon = (b[1] - a[1]) * Math.PI / 180;
  const x = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(a[0] * Math.PI / 180) * Math.cos(b[0] * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

async function updateExecutionRoute(adminLL, venueLL) {
  const now = Date.now();
  if (now - resExecLastRouteAt < 6000) return;
  resExecLastRouteAt = now;

  let route = null;
  try {
    route = await fetchRouteLL(adminLL, venueLL);
  } catch (e) {
    route = null;
  }

  if (resExecRouteLayer) resExecMap.removeLayer(resExecRouteLayer);
  if (route && route.coords && route.coords.length > 1) {
    resExecRouteLayer = L.polyline(route.coords, { color: '#c9a96e', weight: 5, opacity: 0.9 }).addTo(resExecMap);
    setExecText('res-exec-eta', (route.etaMin < 1 ? '<1' : Math.round(route.etaMin)) + ' min');
    setExecText('res-exec-distance', route.distanceKm.toFixed(2) + ' km');
  } else {
    // Fallback: always render a visible direct line when routing API is unavailable.
    const directKm = haversineKm(adminLL, venueLL);
    const etaMin = (directKm / 30) * 60;
    resExecRouteLayer = L.polyline([adminLL, venueLL], { color: '#5b9bd5', weight: 4, opacity: 0.85, dashArray: '8,8' }).addTo(resExecMap);
    setExecText('res-exec-eta', (etaMin < 1 ? '<1' : Math.round(etaMin)) + ' min');
    setExecText('res-exec-distance', directKm.toFixed(2) + ' km');
    setExecStatus('Routing API unavailable, showing direct path.');
  }
}

async function startExecutionTrackerAuto() {
  if (!initExecutionMap()) {
    alert('Map library unavailable.');
    return;
  }
  const venue = getActiveReservationVenue();
  if (!venue) {
    alert('Selected reservation has no venue address yet.');
    return;
  }
  setExecStatus('Resolving venue and requesting device location...');
  let venueLL;
  try {
    venueLL = await geocodeVenueAddress(venue);
  } catch (e) {
    venueLL = null;
  }
  if (!venueLL) {
    alert('Unable to geocode venue address for this reservation.');
    setExecStatus('Unable to locate venue coordinates.');
    return;
  }

  if (resExecVenueMarker) resExecMap.removeLayer(resExecVenueMarker);
  resExecVenueMarker = L.marker(venueLL).addTo(resExecMap).bindPopup('Venue').openPopup();
  if (typeof resExecMap.invalidateSize === 'function') {
    setTimeout(function () { resExecMap.invalidateSize(); }, 100);
  }

  if (!navigator.geolocation) {
    alert('Geolocation is not supported on this device/browser.');
    return;
  }

  if (resExecWatchId !== null) navigator.geolocation.clearWatch(resExecWatchId);
  resExecLastRouteAt = 0;
  resExecLastFix = null;
  pushExecutionLog('tracker', 'Tracker started', 'Live GPS tracking started for execution day.');
  const exec = getActiveExecutionState();
  if (exec && (!exec.liveStatus || exec.liveStatus === 'idle')) exec.liveStatus = 'on-the-way';
  renderExecutionPanelState();
  resExecWatchId = navigator.geolocation.watchPosition(async function (pos) {
    const adminLL = [pos.coords.latitude, pos.coords.longitude];
    updateExecSpeed(adminLL);
    if (resExecAdminMarker) resExecAdminMarker.setLatLng(adminLL);
    else resExecAdminMarker = L.marker(adminLL).addTo(resExecMap).bindPopup('Admin');
    await updateExecutionRoute(adminLL, venueLL);
    const bounds = L.latLngBounds([adminLL, venueLL]).pad(0.2);
    resExecMap.fitBounds(bounds);
    setExecStatus('Live tracking active for reservation execution.');

    const now = Date.now();
    const e = getActiveExecutionState();
    if (e && (!e.lastLocationLogAt || (now - e.lastLocationLogAt) > 60000)) {
      e.lastLocationLogAt = now;
      pushExecutionLog('location', 'GPS check-in', 'Admin at ' + adminLL[0].toFixed(5) + ', ' + adminLL[1].toFixed(5));
      renderExecutionPanelState();
    }
  }, function (err) {
    setExecStatus('Location error: ' + err.message);
  }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 2000 });
}

function stopExecutionTracker() {
  if (resExecWatchId !== null) {
    navigator.geolocation.clearWatch(resExecWatchId);
    resExecWatchId = null;
  }
  pushExecutionLog('tracker', 'Tracker stopped', 'Live GPS tracking stopped.');
  const exec = getActiveExecutionState();
  if (exec && exec.liveStatus !== 'arrived') exec.liveStatus = 'stopped';
  renderExecutionPanelState();
  setExecStatus('Tracker stopped.');
}

function getTodayDateKey() {
  return new Date().toISOString().split('T')[0];
}

function forceExecutionDayForReservation(resId) {
  const res = RESERVATIONS.find(function (r) { return r.id === resId; });
  if (!res) {
    alert('Reservation not found.');
    return;
  }
  window.executionDayOverrides[resId] = {
    forcedDate: getTodayDateKey(),
    forcedAt: new Date().toISOString()
  };
  activeResDetailId = resId;
  resDetailMode = 'view';
  showSection('res-details', document.getElementById('nav-res-details'));
  switchResDetailsTab('timeline', document.getElementById('resd-tab-timeline'));
  renderReservationDetailsHandling();
  const panel = document.getElementById('res-exec-panel');
  if (panel && typeof panel.scrollIntoView === 'function') {
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  setExecStatus('Execution day forced for ' + (res.client || 'reservation') + '. Starting tracker...');
  pushExecutionLog('execution-day', 'Execution day forced', 'Simulation was started by admin.');
  renderExecutionPanelState();
  setTimeout(function () { startExecutionTrackerAuto(); }, 220);
}

function addTimelineTask() {
  const res = RESERVATIONS.find(function (r) { return r.id === activeResDetailId; });
  if (!res) return;
  const date = document.getElementById('resd-task-date').value || normalizeDateKey(res.date);
  const title = (document.getElementById('resd-task-title').value || '').trim() || 'Preparation Activity';
  const status = document.getElementById('resd-task-status').value || 'pending';
  const note = (document.getElementById('resd-task-note').value || '').trim();
  const tasks = getTimelineTasks();
  tasks.push({ id: 'RT-' + Date.now(), date: date, title: title, status: status, note: note, logAt: new Date().toISOString() });
  document.getElementById('resd-task-title').value = '';
  document.getElementById('resd-task-note').value = '';
  renderReservationTimelineView();
}

function updateTimelineTaskStatus(taskId, status) {
  const tasks = getTimelineTasks();
  const t = tasks.find(function (x) { return x.id === taskId; });
  if (!t) return;
  t.status = status;
  t.logAt = new Date().toISOString();
  renderReservationTimelineView();
}

async function markTimelinePaymentPaid(key) {
  const extra = getActiveReservationExtra();
  if (!extra || !extra.paymentRecords || !extra.paymentRecords[key]) return;
  extra.paymentRecords[key].status = 'paid';
  extra.paymentRecords[key].paidAt = new Date().toISOString();
  const res = RESERVATIONS.find(function (r) { return r.id === activeResDetailId; });
  if (res) {
    try {
      const { doc, updateDoc } = window.firebaseFns;
      await updateDoc(doc(window.firebaseDB, 'reservations', res.id), {
        paymentTimeline: extra.paymentRecords,
        paymentStatus: 'paid'
      });
    } catch (e) { }
  }
  renderReservationTimelineView();
}

window.renderReservationDetailsHandling = renderReservationDetailsHandling;
window.selectReservationDetail = selectReservationDetail;
window.setReservationDetailMode = setReservationDetailMode;
window.saveReservationDetailEdits = saveReservationDetailEdits;
window.saveReservationDetailStatus = saveReservationDetailStatus;
window.renderExtraReservationDetails = renderExtraReservationDetails;
window.addGuestRow = addGuestRow;
window.removeGuestRow = removeGuestRow;
window.updateGuestRow = updateGuestRow;
window.saveGuestList = saveGuestList;
window.markLayoutSentToCustomer = markLayoutSentToCustomer;
window.markLayoutReceived = markLayoutReceived;
window.switchResDetailsTab = switchResDetailsTab;
window.renderReservationTimelineView = renderReservationTimelineView;
window.addTimelineTask = addTimelineTask;
window.updateTimelineTaskStatus = updateTimelineTaskStatus;
window.markTimelinePaymentPaid = markTimelinePaymentPaid;
window.runReservationPaymentAutomation = runReservationPaymentAutomation;
window.startExecutionTrackerAuto = startExecutionTrackerAuto;
window.stopExecutionTracker = stopExecutionTracker;
window.forceExecutionDayForReservation = forceExecutionDayForReservation;
window.setExecutionLiveStatus = setExecutionLiveStatus;
window.saveExecutionDelayReason = saveExecutionDelayReason;
window.addExecutionActivityLog = addExecutionActivityLog;
window.selectExecutionPhase = selectExecutionPhase;
window.toggleExecutionPhaseTask = toggleExecutionPhaseTask;
window.renderActivityLogsSection = renderActivityLogsSection;
window.selectActivityLogReservation = selectActivityLogReservation;
window.switchInsightsPane = switchInsightsPane;

// ===== RENDER EVENTS CALENDAR =====
window.calendar = null;
function renderEvents() {
  const approved = RESERVATIONS.filter(r => ['confirmed', 'procurement', 'procuring', 'preparing', 'on-going'].includes(String(r.status || '').toLowerCase()));
  const eventsData = buildReservationCalendarEvents(approved);
  const calEl = document.getElementById('calendar');
  if (!calEl) return;
  if (!window.calendar) {
    window.calendar = new FullCalendar.Calendar(calEl, {
      initialView: 'dayGridMonth',
      headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,listWeek' },
      height: 650,
      events: eventsData,
      eventClick: function (info) { openEventDetails(info.event.extendedProps?.reservationId || info.event.id); }
    });
    if (document.getElementById('section-events').classList.contains('active')) {
      window.calendar.render();
    }
  } else {
    window.calendar.removeAllEvents();
    window.calendar.addEventSource(eventsData);
  }
}

// ===== RENDER INSIGHTS =====
let insightsActivePane = 'core';

function switchInsightsPane(mode, btn) {
  insightsActivePane = mode === 'forecast' ? 'forecast' : 'core';
  document.querySelectorAll('#insights-tab-bar .tab-btn').forEach(function (b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  else {
    const id = insightsActivePane === 'forecast' ? 'insights-tab-forecast' : 'insights-tab-core';
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
  }
  const core = document.getElementById('insights-pane-core');
  const fc = document.getElementById('insights-pane-forecast');
  if (core) core.style.display = insightsActivePane === 'core' ? '' : 'none';
  if (fc) fc.style.display = insightsActivePane === 'forecast' ? '' : 'none';
  if (insightsActivePane === 'forecast') renderForecastingDashboard();
}

function getForecastSeasonProfile() {
  const now = new Date();
  const m = now.getMonth();
  const inPeak = m >= 7 && m <= 11;
  const leadIn = m >= 5 && m <= 6;
  const calm = m >= 0 && m <= 4;
  const showAnticipationFlags = leadIn || inPeak;
  let title = '';
  let copy = '';
  let badge = '';
  let badgeClass = 'pending';
  if (inPeak) {
    title = 'Peak busy season active (August–December)';
    copy = 'Halden\'s historically concentrates demand from August through December (year-end parties, weddings, corporate galas). Model assumes this window carries ~68% of annual booking intent. Maintain elevated monitoring until year-end close-out.';
    badge = 'Peak season';
    badgeClass = 'confirmed';
  } else if (leadIn) {
    title = 'Approaching peak season';
    copy = 'June–July are bridge months: inquiry volume climbs before the August surge. The system is flagged for anticipation — align equipment readiness and staffing templates now to avoid August bottlenecks.';
    badge = 'Anticipation mode';
    badgeClass = 'pending';
  } else {
    title = 'Calm season window (January–May)';
    copy = 'Relative quiet period for this catering vertical. Use the runway for maintenance, training, and supplier negotiations. Forecasted demand accelerates again starting August — early deposits for Q4 events often appear from late June onward.';
    badge = 'Calm season';
    badgeClass = 'low';
  }
  return { inPeak, leadIn, calm, showAnticipationFlags, title, copy, badge, badgeClass };
}

function renderForecastingDashboard() {
  const prof = getForecastSeasonProfile();
  const titleEl = document.getElementById('forecast-season-title');
  const copyEl = document.getElementById('forecast-season-copy');
  const badgeEl = document.getElementById('forecast-season-badge');
  const flagsWrap = document.getElementById('forecast-anticipation-flags');
  if (titleEl) titleEl.textContent = prof.title;
  if (copyEl) copyEl.textContent = prof.copy;
  if (badgeEl) {
    badgeEl.textContent = prof.badge;
    badgeEl.className = 'badge ' + prof.badgeClass;
    badgeEl.style.fontSize = '11px';
    badgeEl.style.alignSelf = 'center';
  }
  if (flagsWrap) flagsWrap.style.display = prof.showAnticipationFlags ? '' : 'none';

  const confEl = document.getElementById('fc-stat-confidence');
  const confSub = document.getElementById('fc-stat-confidence-sub');
  const peakEl = document.getElementById('fc-stat-peak-share');
  const peakSub = document.getElementById('fc-stat-peak-sub');
  const n90El = document.getElementById('fc-stat-n90');
  const n90Sub = document.getElementById('fc-stat-n90-sub');
  const upEl = document.getElementById('fc-stat-uplift');
  const upSub = document.getElementById('fc-stat-uplift-sub');
  if (confEl) confEl.textContent = '84%';
  if (confSub) confSub.textContent = 'Blended model · last 36 mo. baseline';
  if (peakEl) peakEl.textContent = '68%';
  if (peakSub) peakSub.textContent = 'Share of annual demand · Aug–Dec';
  if (n90El) n90El.textContent = '127';
  if (n90Sub) n90Sub.textContent = '±14 vs prior 90d · placeholder';
  if (upEl) upEl.textContent = '+2.4×';
  if (upSub) upSub.textContent = 'Peak vs calm-season median';

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const demandIndex = [42, 45, 48, 52, 58, 72, 88, 112, 118, 125, 122, 115];
  const weeklyPace = [18, 22, 24, 31, 36, 42, 48, 52];
  const leadBuckets = [12, 28, 44, 58, 36, 22];

  const ctxLine = document.getElementById('forecast-demand-chart');
  if (ctxLine) {
    if (window.forecastDemandChartInst) window.forecastDemandChartInst.destroy();
    window.forecastDemandChartInst = new Chart(ctxLine, {
      type: 'line',
      data: {
        labels: monthLabels,
        datasets: [{
          label: 'Demand index',
          data: demandIndex,
          borderColor: '#c49a3c',
          backgroundColor: 'rgba(196,154,60,0.15)',
          fill: true,
          tension: 0.35,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return ' Index: ' + c.raw; } } }
        },
        scales: {
          x: { ticks: { color: '#a89070' }, grid: { color: 'rgba(255,255,255,0.06)' } },
          y: { ticks: { color: '#a89070' }, grid: { color: 'rgba(255,255,255,0.06)' } }
        }
      }
    });
  }

  const ctxDon = document.getElementById('forecast-season-split-chart');
  if (ctxDon) {
    if (window.forecastSeasonSplitChartInst) window.forecastSeasonSplitChartInst.destroy();
    window.forecastSeasonSplitChartInst = new Chart(ctxDon, {
      type: 'doughnut',
      data: {
        labels: ['Jan–Jul (calm)', 'Aug–Dec (peak)'],
        datasets: [{ data: [32, 68], backgroundColor: ['#4b5563', '#c49a3c'], borderWidth: 0 }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { color: '#e8dcc8', font: { size: 11 } } },
          tooltip: { callbacks: { label: function (c) { return ' ' + c.label + ': ' + c.raw + '%'; } } }
        },
        cutout: '62%'
      }
    });
  }

  const ctxW = document.getElementById('forecast-weekly-pace-chart');
  if (ctxW) {
    if (window.forecastWeeklyPaceChartInst) window.forecastWeeklyPaceChartInst.destroy();
    window.forecastWeeklyPaceChartInst = new Chart(ctxW, {
      type: 'bar',
      data: {
        labels: weeklyPace.map(function (_, i) { return 'Wk ' + (i + 1); }),
        datasets: [{ data: weeklyPace, backgroundColor: '#7c6fcd', borderRadius: 4 }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { ticks: { color: '#a89070' }, grid: { display: false } }, y: { ticks: { color: '#a89070' }, grid: { color: 'rgba(255,255,255,0.06)' } } }
      }
    });
  }

  const ctxL = document.getElementById('forecast-leadtime-chart');
  if (ctxL) {
    if (window.forecastLeadtimeChartInst) window.forecastLeadtimeChartInst.destroy();
    window.forecastLeadtimeChartInst = new Chart(ctxL, {
      type: 'bar',
      data: {
        labels: ['0–30d', '31–60d', '61–90d', '91–120d', '121–180d', '180d+'],
        datasets: [{ data: leadBuckets, backgroundColor: '#2d8a4e', borderRadius: 4 }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return ' ' + c.raw + ' bookings'; } } } },
        scales: { x: { ticks: { color: '#a89070' }, grid: { display: false } }, y: { ticks: { color: '#a89070' }, grid: { color: 'rgba(255,255,255,0.06)' } } }
      }
    });
  }

  const tbody = document.getElementById('forecast-monthly-table-body');
  if (tbody) {
    const rev = ['₱420k', '₱455k', '₱490k', '₱540k', '₱610k', '₱780k', '₱920k', '₱1.25M', '₱1.38M', '₱1.52M', '₱1.41M', '₱1.28M'];
    const ev = [28, 30, 32, 35, 38, 46, 54, 72, 78, 84, 80, 74];
    const risk = ['Low', 'Low', 'Low', 'Low', 'Med', 'Med', 'High', 'High', 'High', 'High', 'High', 'Med'];
    tbody.innerHTML = monthLabels.map(function (lab, i) {
      const peak = i >= 7;
      return `<tr style="${peak ? 'background:rgba(196,154,60,0.08);' : ''}">
        <td><strong>${lab}</strong>${peak ? ' <span class="badge confirmed" style="font-size:9px;">Peak</span>' : ''}</td>
        <td>${demandIndex[i]}</td>
        <td>${ev[i]}</td>
        <td>${rev[i]}</td>
        <td>${risk[i]}</td>
        <td style="font-size:11px;color:var(--text-dim);">${peak ? 'Included in Aug–Dec surge band' : 'Calm-season pacing · placeholder'}</td>
      </tr>`;
    }).join('');
  }

  const narr = document.getElementById('forecast-narrative-block');
  if (narr) {
    narr.innerHTML = `
      <p style="margin-bottom:10px;"><strong>Model assumptions (placeholder):</strong> recurring annual seasonality, weekend-heavy mix, metro venue concentration, average lead time 74 days for weddings / 38 days for corporate.</p>
      <ul style="margin:0;padding-left:18px;">
        <li style="margin-bottom:6px;">August kickoff correlates with +31% inquiry velocity vs July — historically driven by holiday planning and ber-month corporate budgets.</li>
        <li style="margin-bottom:6px;">September–October show the highest confirmed conversion rates (placeholder 41% inquiry-to-deposit).</li>
        <li style="margin-bottom:6px;">December skews toward shorter lead times; expect last-minute uplifts — buffer labor and disposable par levels.</li>
        <li style="margin-bottom:6px;">Capacity risk escalates when weekly pace exceeds ~48 events (placeholder threshold) — trigger cross-hire protocol.</li>
        <li>Equipment flag ties to lifecycle overdue items & rental pending orders; staff flag ties to roster fill-rate under 92% (placeholder).</li>
      </ul>`;
  }
}

function renderInsights() {
  const topItems = [
    { name: 'Chicken Dish', count: 38 },
    { name: 'Steamed Rice', count: 36 },
    { name: 'Unlimited Drinks', count: 34 },
    { name: 'Pork Dish', count: 28 },
    { name: 'Pasta', count: 22 },
  ];
  const ctxTop = document.getElementById('top-items-chart');
  if (ctxTop) {
    if (window.topItemsChartInst) window.topItemsChartInst.destroy();
    window.topItemsChartInst = new Chart(ctxTop, {
      type: 'bar',
      data: {
        labels: topItems.map(i => i.name),
        datasets: [{ data: topItems.map(i => i.count), backgroundColor: '#c49a3c', borderRadius: 4 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, indexAxis: 'y',
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ctx.raw + ' orders' } } },
        scales: { x: { display: false }, y: { grid: { display: false }, ticks: { color: '#a89070', font: { family: "'DM Sans',sans-serif" } } } }
      }
    });
  }
  const types = [
    { name: 'Birthday Party', pct: 38, color: '#c49a3c' },
    { name: 'Wedding', pct: 28, color: '#7c6fcd' },
    { name: 'Corporate', pct: 20, color: '#2d8a4e' },
    { name: 'Family Gathering', pct: 14, color: '#d97706' },
  ];
  const ctxTypes = document.getElementById('event-types-chart');
  if (ctxTypes) {
    if (window.eventTypesChartInst) window.eventTypesChartInst.destroy();
    window.eventTypesChartInst = new Chart(ctxTypes, {
      type: 'doughnut',
      data: {
        labels: types.map(t => t.name),
        datasets: [{ data: types.map(t => t.pct), backgroundColor: types.map(t => t.color), borderWidth: 0 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { color: '#e8dcc8', font: { family: "'DM Sans',sans-serif", size: 12 } } },
          tooltip: { callbacks: { label: (ctx) => ' ' + ctx.raw + '%' } }
        },
        cutout: '70%'
      }
    });
  }
  if (insightsActivePane === 'forecast') renderForecastingDashboard();
}

// ===== INIT =====
function waitForFirebase(attempts = 0) {
  if (window.firebaseFns && window.firebaseDB) {
    loadData();
    initAdminChat();
  } else if (attempts < 20) {
    setTimeout(() => waitForFirebase(attempts + 1), 150);
  } else {
    console.error('Firebase did not initialize in time.');
    renderInsights();
    renderEIMStats();
    renderEIMTable();
    renderRentalCards();
  }
}
waitForFirebase();

// ====================================================================
// ==================== EQUIPMENT INVENTORY MANAGEMENT ================
// ====================================================================

// ----- MASTER ASSET DATA -----
// Structure is Firebase-ready: each object maps directly to a Firestore document.
// Fields: id (doc ID), name, category, type, quantity, unitType,
//         condition, status, unitCost, supplier, sourceLocation,
//         trackingMode ('individual'|'batch'), batchTrackingId, notes, addedDate

const EIM_ASSETS = [
  // ── FURNITURE ──────────────────────────────────────────────────────
  {
    id: 'EQ-F001', name: 'Round Banquet Table 5ft', category: 'Furniture', type: 'Table',
    quantity: 20, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 3500, supplier: 'Manila Event Supply Co.', sourceLocation: null,
    trackingMode: 'individual', batchTrackingId: null,
    notes: '5ft diameter; seats 8–10 guests. Powder-coated foldable steel legs. Water-resistant plywood top.',
    addedDate: '2024-01-15'
  },
  {
    id: 'EQ-F002', name: 'Rectangular Banquet Table 6ft', category: 'Furniture', type: 'Table',
    quantity: 10, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 2800, supplier: 'Manila Event Supply Co.', sourceLocation: null,
    trackingMode: 'individual', batchTrackingId: null,
    notes: '6ft × 2.5ft; seats 6–8. Primarily used for buffet lines and serving stations.',
    addedDate: '2024-01-15'
  },
  {
    id: 'EQ-F003', name: 'Tiffany Crossback Chair (White)', category: 'Furniture', type: 'Chair',
    quantity: 150, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 450, supplier: 'PhilChair Manufacturing', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-CHR-001',
    notes: 'White resin event chairs. UV-resistant. Events typically use 100–150 pcs. Clean with damp cloth.',
    addedDate: '2024-02-01'
  },
  {
    id: 'EQ-F004', name: 'Monoblock Chair (White)', category: 'Furniture', type: 'Chair',
    quantity: 80, unitType: 'pcs', condition: 'Fair', status: 'Active',
    unitCost: 180, supplier: null, sourceLocation: 'Divisoria Market, Manila',
    trackingMode: 'batch', batchTrackingId: 'BATCH-CHR-002',
    notes: 'Standard white plastic monoblock. Used for staff, overflow, and outdoor setups.',
    addedDate: '2023-06-10'
  },
  {
    id: 'EQ-F005', name: 'Cocktail High Table (Bar Height)', category: 'Furniture', type: 'Table',
    quantity: 8, unitType: 'pcs', condition: 'Excellent', status: 'Active',
    unitCost: 2200, supplier: 'Manila Event Supply Co.', sourceLocation: null,
    trackingMode: 'individual', batchTrackingId: null,
    notes: 'Bar-height cocktail tables; 36" diameter top. Ideal for cocktail hour reception areas.',
    addedDate: '2024-03-20'
  },
  {
    id: 'EQ-F006', name: 'Banquet Server Trolley 3-Tier', category: 'Furniture', type: 'Trolley',
    quantity: 4, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 4800, supplier: 'CateringPro PH', sourceLocation: null,
    trackingMode: 'individual', batchTrackingId: null,
    notes: 'Stainless steel 3-tier service trolley with rubber wheels. For transporting food and tableware.',
    addedDate: '2024-04-05'
  },
  {
    id: 'EQ-F007', name: 'Folding Service Table 4ft', category: 'Furniture', type: 'Service Table',
    quantity: 6, unitType: 'pcs', condition: 'Fair', status: 'Active',
    unitCost: 1200, supplier: null, sourceLocation: 'Divisoria Market, Manila',
    trackingMode: 'individual', batchTrackingId: null,
    notes: 'Lightweight folding tables for bar stations, carving stations, and cake tables.',
    addedDate: '2023-08-20'
  },

  // ── TABLEWARE ──────────────────────────────────────────────────────
  {
    id: 'EQ-T001', name: 'Dinner Plate 10.5" (White Porcelain)', category: 'Tableware', type: 'Plate',
    quantity: 350, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 180, supplier: 'Royal Porcelain PH', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-PLT-001',
    notes: 'White porcelain dinner plates; dishwasher-safe. Standard for all events. Replace broken units quarterly.',
    addedDate: '2024-01-20'
  },
  {
    id: 'EQ-T002', name: 'Salad / Dessert Plate 7"', category: 'Tableware', type: 'Plate',
    quantity: 300, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 120, supplier: 'Royal Porcelain PH', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-PLT-002',
    notes: 'White porcelain side plates for salad course and dessert service.',
    addedDate: '2024-01-20'
  },
  {
    id: 'EQ-T003', name: 'Soup Bowl 16oz with Underplate', category: 'Tableware', type: 'Bowl',
    quantity: 200, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 95, supplier: 'Royal Porcelain PH', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-BWL-001',
    notes: 'Porcelain soup bowls sold with matching underplate. Handle with care — chips easily.',
    addedDate: '2024-01-20'
  },
  {
    id: 'EQ-T004', name: 'Dinner Fork 18/10 Stainless', category: 'Tableware', type: 'Cutlery',
    quantity: 400, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 45, supplier: 'KitchenAid Supply PH', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-CTL-001',
    notes: '18/10 stainless steel heavyweight dinner forks. Polished mirror finish.',
    addedDate: '2024-02-10'
  },
  {
    id: 'EQ-T005', name: 'Dinner Knife 18/10 Stainless', category: 'Tableware', type: 'Cutlery',
    quantity: 400, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 55, supplier: 'KitchenAid Supply PH', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-CTL-002',
    notes: '18/10 stainless steel dinner knives with serrated edge.',
    addedDate: '2024-02-10'
  },
  {
    id: 'EQ-T006', name: 'Dinner Spoon / Tablespoon 18/10', category: 'Tableware', type: 'Cutlery',
    quantity: 400, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 40, supplier: 'KitchenAid Supply PH', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-CTL-003',
    notes: '18/10 stainless steel. Used for main course and dessert.',
    addedDate: '2024-02-10'
  },
  {
    id: 'EQ-T007', name: 'Soup Spoon (Round Bowl) 18/10', category: 'Tableware', type: 'Cutlery',
    quantity: 250, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 38, supplier: 'KitchenAid Supply PH', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-CTL-004',
    notes: 'Round-bowl stainless steel soup spoon for soup course plating.',
    addedDate: '2024-02-10'
  },
  {
    id: 'EQ-T008', name: 'Teaspoon 18/10 Stainless', category: 'Tableware', type: 'Cutlery',
    quantity: 300, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 32, supplier: 'KitchenAid Supply PH', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-CTL-005',
    notes: 'For coffee/tea service and dessert accompaniments.',
    addedDate: '2024-02-10'
  },
  {
    id: 'EQ-T009', name: 'Serving Platter Oval 18" Stainless', category: 'Tableware', type: 'Serving Ware',
    quantity: 30, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 280, supplier: 'CateringPro PH', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-SRV-001',
    notes: 'Oval stainless steel serving platters for buffet and family-style service.',
    addedDate: '2024-02-15'
  },
  {
    id: 'EQ-T010', name: 'Serving Tong 12" Stainless', category: 'Tableware', type: 'Serving Ware',
    quantity: 40, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 85, supplier: 'CateringPro PH', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-SRV-002',
    notes: 'Stainless steel serving tongs with silicone-coated tips for non-stick use.',
    addedDate: '2024-02-15'
  },
  {
    id: 'EQ-T011', name: 'Bread Basket (Natural Wicker)', category: 'Tableware', type: 'Basket',
    quantity: 30, unitType: 'pcs', condition: 'Fair', status: 'Active',
    unitCost: 120, supplier: null, sourceLocation: 'Quiapo Market, Manila',
    trackingMode: 'batch', batchTrackingId: 'BATCH-BSK-001',
    notes: 'Natural rattan wicker baskets with white linen liner. For bread rolls at table.',
    addedDate: '2023-09-01'
  },
  {
    id: 'EQ-T012', name: 'Sauce / Gravy Ladle Stainless', category: 'Tableware', type: 'Serving Ware',
    quantity: 25, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 65, supplier: 'CateringPro PH', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-SRV-003',
    notes: '4oz stainless ladles for sauces, gravies, and soups at buffet line.',
    addedDate: '2024-02-15'
  },

  // ── GLASSWARE ──────────────────────────────────────────────────────
  {
    id: 'EQ-G001', name: 'Water Goblet 14oz (Crystal-Clear)', category: 'Glassware', type: 'Glass',
    quantity: 350, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 75, supplier: 'GlassCraft PH', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-GLS-001',
    notes: 'Crystal-clear stemmed water goblet. Standard for all seated events.',
    addedDate: '2024-01-25'
  },
  {
    id: 'EQ-G002', name: 'Red Wine Glass 15oz (Tulip)', category: 'Glassware', type: 'Glass',
    quantity: 200, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 95, supplier: 'GlassCraft PH', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-GLS-002',
    notes: 'Large-bowl tulip wine glasses for red wine service.',
    addedDate: '2024-01-25'
  },
  {
    id: 'EQ-G003', name: 'Champagne Flute 7oz', category: 'Glassware', type: 'Glass',
    quantity: 150, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 90, supplier: 'GlassCraft PH', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-GLS-003',
    notes: 'Classic tall champagne flutes. Used for toasting ceremonies and welcome drinks.',
    addedDate: '2024-01-25'
  },
  {
    id: 'EQ-G004', name: 'Juice / Rocks Glass 10oz', category: 'Glassware', type: 'Glass',
    quantity: 200, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 60, supplier: 'GlassCraft PH', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-GLS-004',
    notes: 'Multipurpose rocks glass for juice, iced tea, and mocktails.',
    addedDate: '2024-01-25'
  },
  {
    id: 'EQ-G005', name: 'Shot / Cordial Glass 2oz', category: 'Glassware', type: 'Glass',
    quantity: 100, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 45, supplier: 'GlassCraft PH', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-GLS-005',
    notes: 'Small cordial glasses for liqueur service and amuse-bouche presentations.',
    addedDate: '2024-01-25'
  },

  // ── LINENS ─────────────────────────────────────────────────────────
  {
    id: 'EQ-L001', name: 'Round Tablecloth 120" — White', category: 'Linens', type: 'Tablecloth',
    quantity: 40, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 480, supplier: 'LiXia Textile Supply', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-LNN-001',
    notes: 'Full drop round tablecloth for 5ft tables. Dry-clean only. Pressed before each event.',
    addedDate: '2024-02-20'
  },
  {
    id: 'EQ-L002', name: 'Round Tablecloth 120" — Ivory/Cream', category: 'Linens', type: 'Tablecloth',
    quantity: 40, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 480, supplier: 'LiXia Textile Supply', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-LNN-002',
    notes: 'Ivory cream tablecloth. Popular for weddings and corporate events.',
    addedDate: '2024-02-20'
  },
  {
    id: 'EQ-L003', name: 'Rectangular Tablecloth 90"×132" — White', category: 'Linens', type: 'Tablecloth',
    quantity: 30, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 380, supplier: 'LiXia Textile Supply', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-LNN-003',
    notes: 'For 6ft rectangular banquet tables. Overlaps 18" on each side.',
    addedDate: '2024-02-20'
  },
  {
    id: 'EQ-L004', name: 'Cloth Napkin 20"×20" — White Linen', category: 'Linens', type: 'Napkin',
    quantity: 500, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 45, supplier: 'LiXia Textile Supply', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-LNN-004',
    notes: 'White linen napkins. Laundered and pressed after every event. Check for stains before each use.',
    addedDate: '2024-02-20'
  },
  {
    id: 'EQ-L005', name: 'Chair Sash / Ribbon — Satin Gold', category: 'Linens', type: 'Chair Sash',
    quantity: 200, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 35, supplier: 'LiXia Textile Supply', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-LNN-005',
    notes: 'Satin gold chair sashes for Tiffany crossback chairs. Tied in bow or knot.',
    addedDate: '2024-03-01'
  },
  {
    id: 'EQ-L006', name: 'Chair Sash / Ribbon — Ivory White', category: 'Linens', type: 'Chair Sash',
    quantity: 150, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 35, supplier: 'LiXia Textile Supply', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-LNN-006',
    notes: 'White organza chair sashes for classic and minimalist wedding themes.',
    addedDate: '2024-03-01'
  },
  {
    id: 'EQ-L007', name: 'Table Runner 12"×108" — Satin Gold', category: 'Linens', type: 'Table Runner',
    quantity: 50, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 180, supplier: 'LiXia Textile Supply', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-LNN-007',
    notes: 'Satin gold runners for 5ft round and 6ft rect tables.',
    addedDate: '2024-03-01'
  },
  {
    id: 'EQ-L008', name: 'Buffet Skirt 17ft — Royal Blue Polyester', category: 'Linens', type: 'Buffet Skirt',
    quantity: 10, unitType: 'pcs', condition: 'Fair', status: 'Active',
    unitCost: 650, supplier: null, sourceLocation: 'SM Fabric Center, Manila',
    trackingMode: 'batch', batchTrackingId: 'BATCH-LNN-008',
    notes: 'Clip-on fitted table skirts for buffet tables. Covers full-drop on 6ft rect tables.',
    addedDate: '2023-07-15'
  },

  // ── CATERING EQUIPMENT ─────────────────────────────────────────────
  {
    id: 'EQ-C001', name: 'Chafing Dish Full-Size 8qt (Stainless)', category: 'Catering Equipment', type: 'Chafing Dish',
    quantity: 15, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 1800, supplier: 'CateringPro PH', sourceLocation: null,
    trackingMode: 'individual', batchTrackingId: null,
    notes: 'Full-size roll-top stainless chafing dish. Comes with water pan, food pan, lid, and fuel holder. Uses 2 Sterno cans per event.',
    addedDate: '2024-01-10'
  },
  {
    id: 'EQ-C002', name: 'Beverage Dispenser 3-Gallon (Glass)', category: 'Catering Equipment', type: 'Dispenser',
    quantity: 8, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 2500, supplier: 'CateringPro PH', sourceLocation: null,
    trackingMode: 'individual', batchTrackingId: null,
    notes: 'Glass beverage dispenser on wooden frame stand with ice chamber. For juice, iced tea, and infused water.',
    addedDate: '2024-01-10'
  },
  {
    id: 'EQ-C003', name: 'Portable Buffet Line 6-Station Set', category: 'Catering Equipment', type: 'Buffet Setup',
    quantity: 2, unitType: 'sets', condition: 'Good', status: 'Active',
    unitCost: 15000, supplier: 'CateringPro PH', sourceLocation: null,
    trackingMode: 'individual', batchTrackingId: null,
    notes: 'Complete modular buffet line: 6 chafing dish stations, sneeze guards, sign holders, and LED-lit base frame.',
    addedDate: '2024-01-10'
  },
  {
    id: 'EQ-C004', name: 'Ice Bucket 4L Stainless with Tong', category: 'Catering Equipment', type: 'Ice Bucket',
    quantity: 20, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 280, supplier: 'CateringPro PH', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-ICE-001',
    notes: '4-liter double-walled stainless ice buckets with matching stainless tong.',
    addedDate: '2024-02-05'
  },
  {
    id: 'EQ-C005', name: 'Coffee Urn 30-Cup Electric', category: 'Catering Equipment', type: 'Beverage Equipment',
    quantity: 4, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 3200, supplier: 'Kingsmart Appliances', sourceLocation: null,
    trackingMode: 'individual', batchTrackingId: null,
    notes: 'Stainless 30-cup electric percolator urn. Used for AM receptions, corporate breakfasts. 120V.',
    addedDate: '2024-03-10'
  },
  {
    id: 'EQ-C006', name: 'Sterno / Fuel Can (Case of 24)', category: 'Catering Equipment', type: 'Consumable',
    quantity: 12, unitType: 'pcs', condition: 'Excellent', status: 'Active',
    unitCost: 380, supplier: 'CateringPro PH', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-FUEL-001',
    notes: '2-hour methanol gel fuel cans. Each chafing dish uses 2 per event. Replenish after each event.',
    addedDate: '2024-04-01'
  },
  {
    id: 'EQ-C007', name: 'Carving Station Board (Maple 24"×16")', category: 'Catering Equipment', type: 'Serving Ware',
    quantity: 3, unitType: 'pcs', condition: 'Excellent', status: 'Active',
    unitCost: 1500, supplier: 'Restaurant Depot PH', sourceLocation: null,
    trackingMode: 'individual', batchTrackingId: null,
    notes: 'Thick maple wood carving boards with juice groove. For roast and lechon carving stations.',
    addedDate: '2024-03-25'
  },

  // ── AV & LIGHTING ──────────────────────────────────────────────────
  {
    id: 'EQ-A001', name: 'LED Uplight RGB (Battery)', category: 'AV & Lighting', type: 'Lighting',
    quantity: 20, unitType: 'pcs', condition: 'Excellent', status: 'Active',
    unitCost: 3200, supplier: 'EventTech Philippines', sourceLocation: null,
    trackingMode: 'individual', batchTrackingId: null,
    notes: 'Battery-powered RGB LED uplights. 8-hour battery life. App-controlled via Bluetooth. Typically deployed in groups of 8–12.',
    addedDate: '2024-04-01'
  },
  {
    id: 'EQ-A002', name: 'Powered Speaker 10" (JBL EON710)', category: 'AV & Lighting', type: 'Audio',
    quantity: 4, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 8500, supplier: 'EventTech Philippines', sourceLocation: null,
    trackingMode: 'individual', batchTrackingId: null,
    notes: 'JBL EON710 10" active loudspeakers. 650W peak. Bluetooth + XLR input. Used for ceremonies and cocktail receptions.',
    addedDate: '2024-02-28'
  },
  {
    id: 'EQ-A003', name: 'Wireless Microphone Set (2-Channel)', category: 'AV & Lighting', type: 'Audio',
    quantity: 2, unitType: 'sets', condition: 'Good', status: 'Active',
    unitCost: 6500, supplier: 'EventTech Philippines', sourceLocation: null,
    trackingMode: 'individual', batchTrackingId: null,
    notes: '2-channel wireless system: 1 handheld + 1 lapel transmitter. 100m range. UHF band.',
    addedDate: '2024-02-28'
  },
  {
    id: 'EQ-A004', name: 'Photo Booth Setup (Complete)', category: 'AV & Lighting', type: 'Event Prop',
    quantity: 1, unitType: 'set', condition: 'Good', status: 'Active',
    unitCost: 25000, supplier: 'EventTech Philippines', sourceLocation: null,
    trackingMode: 'individual', batchTrackingId: null,
    notes: 'Complete photo booth: adjustable ring light (18"), 8ft backdrop stand, printed prop basket. Add-on service.',
    addedDate: '2024-03-15'
  },
  {
    id: 'EQ-A005', name: 'Table Number Holder Set (1–30)', category: 'AV & Lighting', type: 'Table Decor',
    quantity: 3, unitType: 'sets', condition: 'Good', status: 'Active',
    unitCost: 1800, supplier: 'Manila Event Supply Co.', sourceLocation: null,
    trackingMode: 'individual', batchTrackingId: null,
    notes: 'Acrylic gold-framed table number holders, numbers 1–30 per set. Matching gold base.',
    addedDate: '2024-03-18'
  },
  // ── DESIGN ─────────────────────────────────────────────────────────
  {
    id: 'EQ-D001', name: 'White Table Cloth (Round 5ft)', category: 'Design', type: 'Cloth',
    quantity: 20, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 150, supplier: 'Manila Event Supply Co.', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-DSG-001',
    notes: 'Standard white round cloths.',
    addedDate: '2024-05-01'
  },
  {
    id: 'EQ-D002', name: 'Princess Cutout Prop (Large)', category: 'Design', type: 'Prop',
    quantity: 3, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 500, supplier: 'Custom Props', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-DSG-002',
    notes: 'Kiddie party props.',
    addedDate: '2024-05-01'
  }
];

// Initialize Batches dynamically for existing objects
EIM_ASSETS.forEach(a => {
  if (a.name.toLowerCase().includes('photo booth')) {
    a.trackingMode = 'individual';
  } else {
    a.trackingMode = 'batch';
    if (!a.batchTrackingId) {
      const pfx = a.category.substring(0,3).toUpperCase().replace(/[^A-Z]/g,'');
      a.batchTrackingId = `BAT-${pfx || 'EQ'}-${a.id.substring(3)}`;
    }
  }
  
  // Cap quantity at 100 maximum
  if (a.quantity > 100) a.quantity = 100;
  
  if (a.trackingMode === 'batch' && (!a.items || a.items.length === 0)) {
    a.items = [];
    for (let i = 0; i < a.quantity; i++) {
        const itemCond = Array.isArray(a.condition) ? a.condition[i] : a.condition;
        a.items.push({
            subId: `${a.id}-${String(i+1).padStart(2, '0')}`,
            condition: itemCond || 'Good',
            status: a.status || 'Active'
        });
    }
  }
});

// ----- RENTAL DATA -----
// Fields: id, name, type, quantity, unitType, condition, status,
//         initialPrice, supplier, arrivalDate, deploymentDate, returnDate,
//         linkedEvent, notes

const RENTED_EQUIPMENT = [
  {
    id: 'RNT-001',
    name: 'Crystal Chandelier Drop Pendant',
    type: 'Lighting / Decor',
    quantity: 3, unitType: 'pcs',
    condition: 'Excellent', status: 'Deployed',
    initialPrice: 8500, supplier: 'Lumina Events Rental',
    arrivalDate: '2026-04-10', deploymentDate: '2026-04-12', returnDate: '2026-04-14',
    linkedEvent: 'Reyes Wedding — April 12',
    notes: 'Crystal chandeliers for ceiling installation. Requires professional rigging. Handle with extreme care. Return in original foam cases.'
  },
  {
    id: 'RNT-002',
    name: 'Gold Chiavari Chairs',
    type: 'Furniture',
    quantity: 80, unitType: 'pcs',
    condition: 'Good', status: 'Returned',
    initialPrice: 12000, supplier: 'PremiChair Rentals PH',
    arrivalDate: '2026-04-02', deploymentDate: '2026-04-05', returnDate: '2026-04-06',
    linkedEvent: 'Santos Birthday Gala — April 5',
    notes: 'Premium gold resin Chiavari chairs with cushioned seat pads. All 80 pcs returned in good condition.'
  },
  {
    id: 'RNT-003',
    name: 'Floral Arch Frame (8ft×8ft)',
    type: 'Decor Structure',
    quantity: 1, unitType: 'pcs',
    condition: 'Good', status: 'Deployed',
    initialPrice: 3500, supplier: 'Bloom & Event Co.',
    arrivalDate: '2026-04-11', deploymentDate: '2026-04-12', returnDate: '2026-04-13',
    linkedEvent: 'Reyes Wedding — April 12',
    notes: 'Geometric gold metal arch frame for ceremony backdrop. 8ft × 8ft. Dismantles into 4 sections. Return with all bolts and caps.'
  },
  {
    id: 'RNT-004',
    name: 'Neon Sign "Mr & Mrs" (LED)',
    type: 'Decor / Lighting',
    quantity: 1, unitType: 'pcs',
    condition: 'Excellent', status: 'Awaiting',
    initialPrice: 2800, supplier: 'GlowSign PH Rentals',
    arrivalDate: '2026-04-18', deploymentDate: '2026-04-19', returnDate: '2026-04-20',
    linkedEvent: 'Dela Cruz Wedding — April 19',
    notes: 'Custom warm-white LED neon "Mr & Mrs" sign on acrylic backing. Comes with wall-mount and tabletop stand.'
  },
  {
    id: 'RNT-005',
    name: 'Chocolate Fountain Machine (4-Tier)',
    type: 'Dessert Equipment',
    quantity: 1, unitType: 'pcs',
    condition: 'Good', status: 'In Transit',
    initialPrice: 4500, supplier: 'SweetFlow Rentals',
    arrivalDate: '2026-04-14', deploymentDate: '2026-04-15', returnDate: '2026-04-16',
    linkedEvent: 'Villanueva Kiddie Party — April 15',
    notes: '4-tier stainless chocolate fountain (requires 5kg dark compound chocolate — not included). Clean before return.'
  },
  {
    id: 'RNT-006',
    name: 'Stage Platform 4ft×8ft Sections',
    type: 'Stage / Riser',
    quantity: 6, unitType: 'pcs',
    condition: 'Good', status: 'Returned',
    initialPrice: 9000, supplier: 'ProStage Equipment PH',
    arrivalDate: '2026-03-28', deploymentDate: '2026-03-30', returnDate: '2026-03-31',
    linkedEvent: 'Cruz Corporate Event — March 30',
    notes: 'Modular stage platforms 4ft×8ft each. 6 sections assemble into 8ft×12ft raised platform. All sections returned on time.'
  },
  {
    id: 'RNT-007',
    name: 'Overhead Canopy / Stretch Tent 10m×15m',
    type: 'Tent / Marquee',
    quantity: 1, unitType: 'pcs',
    condition: 'Excellent', status: 'Awaiting',
    initialPrice: 18000, supplier: 'AlphaTents PH',
    arrivalDate: '2026-04-20', deploymentDate: '2026-04-21', returnDate: '2026-04-23',
    linkedEvent: 'Mendoza Garden Wedding — April 21',
    notes: 'White stretch canopy tent, 10m × 15m. Covers up to 150 pax outdoor. Requires 6 anchor points on the ground. Permit may be required from venue.'
  },
];
window.RENTED_EQUIPMENT = RENTED_EQUIPMENT;
window.rentalOrders = window.rentalOrders || [];

function ensureRentalSuppliers() {
  EIM_ASSETS.forEach(function (a) {
    if (!a.rentalSupplier || !String(a.rentalSupplier).trim()) {
      a.rentalSupplier = a.supplier || 'General Rental Partner';
    }
  });
}
ensureRentalSuppliers();

// ===== EIM Active Category Filter =====
let eimCurrentCat = 'All';

// ===== RENDER EIM STATS =====
function renderEIMStats() {
  const total = EIM_ASSETS.length;
  const active = EIM_ASSETS.filter(a => a.status === 'Active').length;
  const repair = EIM_ASSETS.filter(a => a.status === 'Under Repair').length;
  const value = EIM_ASSETS.reduce((sum, a) => sum + (a.unitCost * a.quantity), 0);

  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('eim-stat-total', total);
  set('eim-stat-active', active);
  set('eim-stat-repair', repair);
  set('eim-stat-value', '₱' + value.toLocaleString());
}

// ===== RENDER EIM TABLE =====
function renderEIMTable() {
  renderEIMStats();
  const search = (document.getElementById('eim-search') || {}).value || '';
  const filtered = EIM_ASSETS.filter(a => {
    const matchCat = eimCurrentCat === 'All' || a.category === eimCurrentCat;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      a.name.toLowerCase().includes(q) ||
      a.id.toLowerCase().includes(q) ||
      a.type.toLowerCase().includes(q) ||
      (a.supplier || '').toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const condColors = { Excellent: 'var(--green)', Good: 'var(--gold)', Fair: 'var(--amber)', Poor: 'var(--red)', Damaged: 'var(--red)' };
  const statColors = { Active: 'confirmed', 'Available': 'confirmed', 'In Use': 'pending', 'Under Repair': 'critical', 'Maintenance': 'critical', 'Retired': 'cancelled', 'Review': 'warning' };

  const tbody = document.getElementById('eim-tbody');
  if (!tbody) return;

  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:32px;color:var(--text-dim);">No equipment found.</td></tr>`;
    return;
  }

  let html = '';
  filtered.forEach((a) => {
    const origIdx = EIM_ASSETS.indexOf(a);

    let displayCond = a.condition;
    let displayStat = a.status;
    let activeQty = a.quantity;
    
    if (a.trackingMode === 'batch' && a.items) {
      const poorCount = a.items.filter(i => i.condition === 'Damaged' || i.condition === 'Poor').length;
      if (poorCount > 0) displayCond = 'Damaged';
      else if (a.items.some(i => i.condition === 'Fair')) displayCond = 'Fair';
      else if (a.items.every(i => i.condition === 'Excellent')) displayCond = 'Excellent';
      else displayCond = 'Good';

      if (a.items.some(i => i.status === 'Retired')) displayStat = 'Review';
      else if (a.items.some(i => i.status === 'Under Repair')) displayStat = 'Maintenance';
      else displayStat = 'Available';
      
      activeQty = a.items.length;
    } else {
      displayCond = a.condition;
      displayStat = a.status === 'Active' ? 'Available' : a.status;
    }

    const totalVal = (a.unitCost * activeQty).toLocaleString();
    const trackBadge = a.trackingMode === 'individual'
      ? `<span class="eim-track-badge individual">🏷️ Individual</span>`
      : `<span class="eim-track-badge batch" style="cursor:pointer;" onclick="toggleEimSubRow('${a.id}')">📦 Batch ▽<br><small style="opacity:0.7;">${a.batchTrackingId}</small></span>`;
    
    const supplierTxt = a.supplier
        ? `<div style="font-size:12px;color:var(--text);">${a.supplier}</div>`
        : `<div style="font-size:11px;color:var(--text-dim);">📍 ${a.sourceLocation || '—'}</div>`;

    let mainRowIdDisplay = a.id;
    if (a.trackingMode === 'batch' && a.batchTrackingId) {
       mainRowIdDisplay = a.batchTrackingId;
    }

    html += `
      <tr class="eim-main-row" id="eim-row-${a.id}">
        <td><code style="font-size:11px; color:var(--gold); background:rgba(196,154,60,0.08); padding:2px 6px; border-radius:4px;">${mainRowIdDisplay}</code></td>
        <td>
          <div class="item-name">${a.name}</div>
          <div class="item-cat">${a.type}</div>
        </td>
        <td><span class="badge pending" style="font-size:10px;">${a.category}</span></td>
        <td style="font-size:13px; font-weight:600;">${activeQty} <span style="color:var(--text-dim);font-size:11px;">${a.unitType}</span></td>
        <td><span style="font-size:12px; font-weight:600; color:${condColors[displayCond] || 'var(--text)'};">● ${displayCond}</span></td>
        <td><span class="badge ${statColors[displayStat] || 'warning'}">${displayStat}</span></td>
        <td>
          <div style="font-size:13px;font-weight:600;font-family:'Playfair Display',serif;">₱${a.unitCost.toLocaleString()}</div>
          <div style="font-size:10px;color:var(--text-dim);">Total ₱${totalVal}</div>
        </td>
        <td>${supplierTxt}</td>
        <td>${trackBadge}</td>
        <td style="text-align:right; white-space:nowrap;">
          <button class="btn-view" style="margin-right:4px;" onclick="openEditEquipmentModal(${origIdx})">✏️ Edit Batch</button>
          <button class="btn-reject" onclick="confirmDeleteEquipment(${origIdx})">🗑</button>
        </td>
      </tr>`;

    // Render Sub-rows if batch natively embedded
    if (a.trackingMode === 'batch' && a.items) {
      a.items.forEach((sub, sIdx) => {
        const iStat = sub.status === 'Active' ? 'Available' : sub.status;
        html += `
          <tr class="eim-sub-row eim-sub-${a.id}" style="display:none; background:var(--bg2);">
            <td style="padding-left:16px;"><code style="font-size:10px;">${sub.subId}</code></td>
            <td style="color:var(--text-dim); font-size:12px;">↳ ${a.name} (Unit)</td>
            <td></td>
            <td style="font-size:12px;color:var(--text-dim);">1 ${a.unitType}</td>
            <td><span style="font-size:11px; color:${condColors[sub.condition]}">● ${sub.condition}</span></td>
            <td><span class="badge ${statColors[iStat] || 'pending'}" style="font-size:10px;">${iStat}</span></td>
            <td style="font-size:12px;">₱${a.unitCost.toLocaleString()}</td>
            <td>${supplierTxt}</td>
            <td><span style="font-size:10px; color:var(--text-dim);">Unit Level</span></td>
            <td style="text-align:right;">
              <button class="btn-outline" style="font-size:10px; padding:2px 8px;" onclick="openEditIndividualModal(${origIdx}, ${sIdx})">Edit Unit</button>
            </td>
          </tr>`;
      });
    }
  });

  tbody.innerHTML = html;
}

function toggleEimSubRow(id) {
  const rows = document.querySelectorAll('.eim-sub-' + id);
  let isHidden = false;
  if(rows.length > 0 && rows[0].style.display === 'none') isHidden = true;
  rows.forEach(tr => { tr.style.display = isHidden ? 'table-row' : 'none'; });
}

function openEditIndividualModal(bIdx, sIdx) {
  const asset = EIM_ASSETS[bIdx];
  const item = asset.items[sIdx];
  document.getElementById('eim-edit-indiv-batch-idx').value = bIdx;
  document.getElementById('eim-edit-indiv-item-idx').value = sIdx;
  document.getElementById('eim-edit-indiv-id').value = item.subId;
  document.getElementById('eim-edit-indiv-condition').value = item.condition;
  document.getElementById('eim-edit-indiv-status').value = item.status;
  document.getElementById('eim-edit-indiv-modal').classList.add('open');
  document.getElementById('eim-edit-indiv-overlay').classList.add('on');
}

function closeEditIndividualModal() {
  document.getElementById('eim-edit-indiv-modal').classList.remove('open');
  document.getElementById('eim-edit-indiv-overlay').classList.remove('on');
}

const EIM_LOGS = [];
function recordEIMLog(action, details) {
  const userStr = sessionStorage.getItem('halden_admin');
  let user = 'Staff';
  if (userStr) {
      const u = JSON.parse(userStr);
      if (u.role === 'admin') user = 'Admin';
      else if (u.name) user = u.name;
  }
  
  EIM_LOGS.unshift({ time: new Date().toLocaleString(), user: user, action: action, details: details });
  renderEIMLogs();
}

function renderEIMLogs() {
  const tbody = document.getElementById('eim-logs-tbody');
  if(!tbody) return;
  if(EIM_LOGS.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;padding:24px;color:var(--text-dim);">No activity logs available.</td></tr>';
    return;
  }
  tbody.innerHTML = EIM_LOGS.map(l => `
    <tr>
      <td style="font-size:12px;color:var(--text-dim);">${l.time}</td>
      <td><span class="badge pending" style="font-size:11px;">${l.user}</span></td>
      <td>
        <div style="font-weight:600;font-size:13px;">${l.action}</div>
        <div style="font-size:11px;color:var(--text-dim);margin-top:2px;">${l.details}</div>
      </td>
    </tr>
  `).join('');
}

function submitEditIndividual() {
  const bIdx = document.getElementById('eim-edit-indiv-batch-idx').value;
  const sIdx = document.getElementById('eim-edit-indiv-item-idx').value;
  const asset = EIM_ASSETS[bIdx];
  const item = asset.items[sIdx];
  
  const oldCond = item.condition;
  const oldStat = item.status;
  const newCond = document.getElementById('eim-edit-indiv-condition').value;
  const newStat = document.getElementById('eim-edit-indiv-status').value;
  
  if (oldCond !== newCond || oldStat !== newStat) {
     item.condition = newCond;
     item.status = newStat;
     recordEIMLog('Item Status Updated', `${item.subId} updated: Cond (${oldCond} -> ${newCond}), Status (${oldStat} -> ${newStat})`);
     renderEIMTable();
  }
  
  closeEditIndividualModal();
}

// Bind to window for HTML onclick handlers
window.toggleEimSubRow = toggleEimSubRow;
window.openEditIndividualModal = openEditIndividualModal;
window.closeEditIndividualModal = closeEditIndividualModal;
window.submitEditIndividual = submitEditIndividual;

function filterEIMCat(cat, btn) {
  eimCurrentCat = cat;
  document.querySelectorAll('.eim-cat-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderEIMTable();
}
window.filterEIMCat = filterEIMCat;

function switchEIMPnl(val) {
  const pnlList = document.getElementById('eim-pnl-list');
  const pnlLogs = document.getElementById('eim-pnl-logs');
  if(pnlList) pnlList.style.display = (val === 'list') ? 'block' : 'none';
  if(pnlLogs) pnlLogs.style.display = (val === 'logs') ? 'block' : 'none';
  
  const tList = document.getElementById('tab-eim-list');
  const tLogs = document.getElementById('tab-eim-logs');
  if(tList) tList.classList.toggle('active', val === 'list');
  if(tLogs) tLogs.classList.toggle('active', val === 'logs');
}
window.switchEIMPnl = switchEIMPnl;

// ===== ADD EQUIPMENT MODAL =====
let eimAddIdCounter = { F: 0, T: 0, G: 0, L: 0, C: 0, A: 0 };

function updateEIMAddId() {
  const cat = document.getElementById('eim-add-category').value;
  const prefixMap = { Furniture: 'F', Tableware: 'T', Glassware: 'G', Linens: 'L', 'Catering Equipment': 'C', 'AV & Lighting': 'A' };
  const p = prefixMap[cat] || 'X';
  const count = EIM_ASSETS.filter(a => a.id.startsWith('EQ-' + p)).length + 1;
  document.getElementById('eim-add-id').value = `EQ-${p}${String(count).padStart(3, '0')}`;
}

function toggleBatchField() {
  const mode = document.querySelector('input[name="eim-tracking"]:checked').value;
  document.getElementById('batch-id-field').style.display = mode === 'batch' ? 'block' : 'none';
}

function openAddEquipmentModal() {
  document.getElementById('eim-add-id').value = '';
  document.getElementById('eim-add-name').value = '';
  document.getElementById('eim-add-category').value = '';
  document.getElementById('eim-add-type').value = '';
  document.getElementById('eim-add-qty').value = '';
  document.getElementById('eim-add-unit').value = 'pcs';
  document.getElementById('eim-add-condition').value = 'Good';
  document.getElementById('eim-add-status').value = 'Active';
  document.getElementById('eim-add-cost').value = '';
  document.getElementById('eim-add-supplier').value = '';
  document.getElementById('eim-add-source').value = '';
  document.getElementById('eim-add-notes').value = '';
  document.getElementById('eim-add-batch-id').value = '';
  document.querySelector('input[name="eim-tracking"][value="individual"]').checked = true;
  toggleBatchField();
  document.getElementById('eim-add-overlay').classList.add('on');
  document.getElementById('eim-add-modal').classList.add('open');
}

function closeAddEquipmentModal() {
  document.getElementById('eim-add-overlay').classList.remove('on');
  document.getElementById('eim-add-modal').classList.remove('open');
}

function submitAddEquipment() {
  const name = document.getElementById('eim-add-name').value.trim();
  const cat = document.getElementById('eim-add-category').value;
  const type = document.getElementById('eim-add-type').value.trim();
  let qty = parseInt(document.getElementById('eim-add-qty').value) || 0;
  
  if (!name || !cat || !type || qty <= 0) {
    alert('Please fill in Name, Category, Type, and Quantity.');
    return;
  }
  
  const idInput = document.getElementById('eim-add-id').value.trim() || updateEIMAddId();
  const mode = document.querySelector('input[name="eim-tracking"]:checked').value;
  
  let itemsArray = null;
  let batchTrackId = null;

  if (mode === 'batch') {
    const match = idInput.match(/^(.*?)(\d+)$/);
    if (!match) {
      alert('For Batch items, the Asset ID must end with a number (e.g. ZA-F001) to act as the base counter prefix.');
      return;
    }
    
    if (qty > 100) qty = 100; // Cap quantity at 100

    const prefix = match[1];
    const startNum = parseInt(match[2], 10);
    const padding = match[2].length;
    
    const uBatchId = document.getElementById('eim-add-batch-id').value.trim();
    if (uBatchId) {
      batchTrackId = uBatchId;
    } else {
      const pfx = cat.substring(0,3).toUpperCase().replace(/[^A-Z]/g,'');
      batchTrackId = `BAT-${pfx || 'EQ'}-${idInput.replace(/[^0-9]/g, '').slice(-3)}`;
    }
    
    itemsArray = [];
    const conditionVal = document.getElementById('eim-add-condition').value;
    const statusVal = document.getElementById('eim-add-status').value;
    
    for (let i = 0; i < qty; i++) {
        const currentNumStr = String(startNum + i).padStart(padding, '0');
        itemsArray.push({
            subId: `${prefix}${currentNumStr}`,
            condition: conditionVal || 'Good',
            status: statusVal || 'Active'
        });
    }
  }

  const newAsset = {
    id: idInput || `EQ-X${Date.now()}`,
    name, category: cat, type,
    quantity: qty,
    unitType: document.getElementById('eim-add-unit').value,
    condition: document.getElementById('eim-add-condition').value,
    status: document.getElementById('eim-add-status').value,
    unitCost: parseFloat(document.getElementById('eim-add-cost').value) || 0,
    supplier: document.getElementById('eim-add-supplier').value.trim() || null,
    rentalSupplier: document.getElementById('eim-add-supplier').value.trim() || 'General Rental Partner',
    sourceLocation: document.getElementById('eim-add-source').value.trim() || null,
    trackingMode: mode,
    batchTrackingId: batchTrackId,
    items: itemsArray,
    notes: document.getElementById('eim-add-notes').value.trim(),
    addedDate: new Date().toISOString().split('T')[0]
  };
  EIM_ASSETS.push(newAsset);
  
  if (typeof recordEIMLog === 'function') {
    recordEIMLog('New Equipment Added', `Added ${qty} of ${newAsset.id} (${newAsset.name}) into inventory.`);
  }

  closeAddEquipmentModal();
  renderEIMTable();
  // TODO: persist to Firestore: addDoc(collection(db, 'equipment_assets'), newAsset)
}

window.openAddEquipmentModal = openAddEquipmentModal;
window.closeAddEquipmentModal = closeAddEquipmentModal;
window.submitAddEquipment = submitAddEquipment;
window.updateEIMAddId = updateEIMAddId;
window.toggleBatchField = toggleBatchField;

// ===== EDIT EQUIPMENT =====
function openEditEquipmentModal(idx) {
  const a = EIM_ASSETS[idx];
  if (!a) return;
  document.getElementById('eim-edit-idx').value = idx;
  document.getElementById('eim-edit-id').value = a.id;
  document.getElementById('eim-edit-name').value = a.name;
  document.getElementById('eim-edit-category').value = a.category;
  document.getElementById('eim-edit-type').value = a.type;
  document.getElementById('eim-edit-qty').value = a.quantity;
  document.getElementById('eim-edit-unit').value = a.unitType;
  document.getElementById('eim-edit-condition').value = a.condition;
  document.getElementById('eim-edit-status').value = a.status;
  document.getElementById('eim-edit-cost').value = a.unitCost;
  document.getElementById('eim-edit-supplier').value = a.supplier || '';
  document.getElementById('eim-edit-source').value = a.sourceLocation || '';
  document.getElementById('eim-edit-notes').value = a.notes || '';
  
  const isBatch = a.trackingMode === 'batch';
  document.getElementById('eim-edit-condition').disabled = isBatch;
  document.getElementById('eim-edit-status').disabled = isBatch;
  document.getElementById('eim-edit-condition').style.opacity = isBatch ? '0.5' : '1';
  document.getElementById('eim-edit-status').style.opacity = isBatch ? '0.5' : '1';
  
  if (isBatch) {
    document.getElementById('eim-edit-condition').title = 'Condition is locked for batches. Edit individual units.';
    document.getElementById('eim-edit-status').title = 'Status is locked for batches. Edit individual units.';
  } else {
    document.getElementById('eim-edit-condition').title = '';
    document.getElementById('eim-edit-status').title = '';
  }

  document.getElementById('eim-edit-overlay').classList.add('on');
  document.getElementById('eim-edit-modal').classList.add('open');
}

function closeEditEquipmentModal() {
  document.getElementById('eim-edit-overlay').classList.remove('on');
  document.getElementById('eim-edit-modal').classList.remove('open');
}

function submitEditEquipment() {
  const idx = parseInt(document.getElementById('eim-edit-idx').value);
  if (isNaN(idx) || !EIM_ASSETS[idx]) return;
  const a = EIM_ASSETS[idx];
  a.name = document.getElementById('eim-edit-name').value.trim();
  a.category = document.getElementById('eim-edit-category').value;
  a.type = document.getElementById('eim-edit-type').value.trim();
  a.quantity = parseInt(document.getElementById('eim-edit-qty').value) || a.quantity;
  a.unitType = document.getElementById('eim-edit-unit').value;
  a.condition = document.getElementById('eim-edit-condition').value;
  a.status = document.getElementById('eim-edit-status').value;
  a.unitCost = parseFloat(document.getElementById('eim-edit-cost').value) || 0;
  a.supplier = document.getElementById('eim-edit-supplier').value.trim() || null;
  a.rentalSupplier = a.supplier || a.rentalSupplier || 'General Rental Partner';
  a.sourceLocation = document.getElementById('eim-edit-source').value.trim() || null;
  a.notes = document.getElementById('eim-edit-notes').value.trim();
  a.notes = document.getElementById('eim-edit-notes').value.trim();
  
  if (typeof recordEIMLog === 'function') {
    recordEIMLog('Equipment Altered', `Global details updated for ${a.id} (${a.name}).`);
  }
  closeEditEquipmentModal();
  renderEIMTable();
  renderDashboard(); // refresh equipment stat
  // TODO: persist to Firestore: updateDoc(doc(db, 'equipment_assets', a.firestoreId), {...})
}

window.openEditEquipmentModal = openEditEquipmentModal;
window.closeEditEquipmentModal = closeEditEquipmentModal;
window.submitEditEquipment = submitEditEquipment;

// ===== DELETE EQUIPMENT =====
let _pendingDelete = null;

function confirmDeleteEquipment(idx) {
  const a = EIM_ASSETS[idx];
  if (!a) return;
  _pendingDelete = { type: 'equipment', idx };
  document.getElementById('del-message').textContent =
    `Are you sure you want to remove "${a.name}" (${a.id}) from the inventory? This action cannot be undone.`;
  document.getElementById('del-confirm-btn').onclick = () => {
    EIM_ASSETS.splice(idx, 1);
    closeDeleteModal();
    renderEIMTable();
  };
  document.getElementById('del-overlay').classList.add('on');
  document.getElementById('del-modal').classList.add('open');
}

function closeDeleteModal() {
  document.getElementById('del-overlay').classList.remove('on');
  document.getElementById('del-modal').classList.remove('open');
  _pendingDelete = null;
}

window.confirmDeleteEquipment = confirmDeleteEquipment;
window.closeDeleteModal = closeDeleteModal;

// ===== RENDER RENTAL CARDS =====
function renderRentalCards() {
  ensureRentalSuppliers();
  seedDemoRentalFlagIfNeeded();
  renderRentalNeedsPanel();
  renderRentalOrders();
  renderTrackedRentalAssets();
  updateRentalStats();
}

function seedDemoRentalFlagIfNeeded() {
  var hasNeeds = collectRentalNeeds().length > 0;
  var hasOrders = (window.rentalOrders || []).length > 0;
  if (hasNeeds || hasOrders) return;

  var asset = EIM_ASSETS.find(function (a) {
    return a.status !== 'Retired' && a.status !== 'Under Repair' && (a.quantity || 0) >= 1;
  }) || EIM_ASSETS[0];
  if (!asset) return;

  var demoEventId = 'DEMO-RENTAL-FLAG';
  if (!RESERVATIONS.find(function (r) { return r.id === demoEventId; })) {
    RESERVATIONS.push({
      id: demoEventId,
      client: 'Demo Rental Flag Event',
      type: 'Corporate',
      date: new Date().toISOString().split('T')[0],
      pax: 120,
      amount: '₱0',
      status: 'confirmed',
      venue: 'Demo Function Hall'
    });
  }

  if (!EIM_SCHEDULES.find(function (s) { return s.eventId === demoEventId; })) {
    EIM_SCHEDULES.push({
      id: 'SCH-DEMO-RENT',
      eventId: demoEventId,
      eventName: 'Demo Rental Flag Event',
      eventDate: new Date().toISOString().split('T')[0],
      eventPax: 120,
      eventType: 'Corporate',
      timePeriod: { id: 'custom', label: 'Custom (10:00–18:00)', start: '10:00', end: '18:00' },
      items: [{
        assetId: asset.id,
        name: asset.name,
        category: asset.category,
        requiredQty: Math.max(3, (asset.quantity || 1) + 2),
        assignedQty: Math.max(1, asset.quantity || 1),
        sufficient: false
      }],
      status: 'Insufficient',
      assignedBy: 'System Demo',
      assignedAt: new Date().toISOString(),
      notes: 'Auto-seeded demo rental flag.'
    });
  }
}

function collectRentalNeeds() {
  const needs = [];
  EIM_SCHEDULES.forEach(function (sch) {
    const missing = (sch.items || []).filter(function (it) { return (it.requiredQty || 0) > (it.assignedQty || 0); });
    missing.forEach(function (it) {
      const asset = EIM_ASSETS.find(function (a) { return a.id === it.assetId; }) || {};
      needs.push({
        key: sch.eventId + '__' + it.assetId,
        eventId: sch.eventId,
        eventName: sch.eventName,
        eventDate: sch.eventDate,
        eventPax: sch.eventPax,
        eventType: sch.eventType,
        venue: (RESERVATIONS.find(function (r) { return r.id === sch.eventId; }) || {}).venue || 'Venue TBD',
        timePeriod: sch.timePeriod,
        assetId: it.assetId,
        name: it.name,
        category: it.category,
        requiredQty: it.requiredQty || 0,
        assignedQty: it.assignedQty || 0,
        shortQty: Math.max(0, (it.requiredQty || 0) - (it.assignedQty || 0)),
        unitType: asset.unitType || 'pcs',
        rentalSupplier: asset.rentalSupplier || asset.supplier || 'General Rental Partner',
        estPrice: parseFloat(asset.unitCost || 0) || 0
      });
    });
  });
  return needs.filter(function (n) { return n.shortQty > 0; });
}

function reviewRentalNeeds(eventId) {
  const needs = collectRentalNeeds().filter(function (n) { return n.eventId === eventId; });
  const review = document.getElementById('rnt-review-container');
  if (!review) return;
  if (!needs.length) {
    review.style.display = 'none';
    return;
  }
  const event = needs[0];
  review.style.display = 'block';
  review.innerHTML = `<div class="panel" style="border:1px solid var(--gold);">
    <div class="panel-hdr">
      <div><div class="panel-title">🔎 Rental Needs Review — ${escHtml(event.eventName)}</div>
      <div class="panel-sub">${escHtml(event.eventDate)} · ${escHtml(event.timePeriod?.label || 'Time TBD')} · ${escHtml(event.venue)}</div></div>
      <button class="btn-primary" onclick="generateRentalOrdersForEvent('${eventId}')">Generate Rental Order(s)</button>
    </div>
    <div class="panel-body" style="padding:0;overflow-x:auto;">
      <table class="inv-table">
        <thead><tr><th>Equipment</th><th>Supplier</th><th>Required</th><th>Assigned</th><th>To Rent</th></tr></thead>
        <tbody>${needs.map(function (n) { return `<tr>
          <td><div class="item-name">${escHtml(n.name)}</div><div class="item-cat">${escHtml(n.category)} · ${escHtml(n.assetId)}</div></td>
          <td>${escHtml(n.rentalSupplier)}</td>
          <td>${n.requiredQty}</td><td>${n.assignedQty}</td>
          <td style="color:var(--red);font-weight:700;">${n.shortQty} ${escHtml(n.unitType)}</td>
        </tr>`; }).join('')}</tbody>
      </table>
    </div>
  </div>`;
}

function generateRentalOrdersForEvent(eventId) {
  const needs = collectRentalNeeds().filter(function (n) { return n.eventId === eventId; });
  if (!needs.length) { alert('No active shortages found for this event.'); return; }
  const grouped = {};
  needs.forEach(function (n) {
    const key = n.eventId + '__' + n.rentalSupplier;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(n);
  });

  Object.keys(grouped).forEach(function (key) {
    const items = grouped[key];
    const first = items[0];
    const existing = window.rentalOrders.find(function (o) {
      return o.eventId === first.eventId && o.supplier === first.rentalSupplier && o.status !== 'cancelled' && o.status !== 'arrived';
    });
    if (existing) {
      existing.items = items;
      existing.updatedAt = new Date().toISOString();
      return;
    }
    window.rentalOrders.push({
      id: 'RNO-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      eventId: first.eventId,
      eventName: first.eventName,
      eventDate: first.eventDate,
      venue: first.venue,
      timePeriod: first.timePeriod,
      supplier: first.rentalSupplier,
      items: items,
      status: 'draft',
      createdAt: new Date().toISOString(),
      sentAt: null,
      arrivedAt: null,
      cancelledAt: null
    });
  });
  showToast('Rental order drafts generated by supplier.');
  renderRentalCards();
}

function renderRentalOrders() {
  const container = document.getElementById('rnt-orders-container');
  if (!container) return;
  if (!window.rentalOrders.length) {
    container.innerHTML = `<div class="panel"><div class="panel-body" style="text-align:center;padding:28px;color:var(--text-dim);">No rental orders generated yet. Review shortage cards above and generate orders.</div></div>`;
    return;
  }
  container.innerHTML = window.rentalOrders.map(function (o, idx) {
    const totalQty = o.items.reduce(function (s, i) { return s + (i.shortQty || 0); }, 0);
    const totalEst = o.items.reduce(function (s, i) { return s + ((i.shortQty || 0) * (i.estPrice || 0)); }, 0);
    const badge = o.status === 'arrived' ? 'confirmed' : (o.status === 'cancelled' ? 'cancelled' : (o.status === 'pending' ? 'pending' : 'warning'));
    return `<div class="panel" style="margin-bottom:14px;">
      <div class="panel-hdr">
        <div>
          <div class="panel-title">🧾 ${escHtml(o.id)} · ${escHtml(o.supplier)}</div>
          <div class="panel-sub">${escHtml(o.eventName)} · ${escHtml(o.eventDate)} · ${escHtml(o.venue)} · ${escHtml(o.timePeriod?.label || 'Time TBD')}</div>
        </div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
          <span class="badge ${badge}" style="font-size:11px;text-transform:capitalize;">${escHtml(o.status)}</span>
          <button class="btn-view" onclick="toggleRentalOrderDetails(${idx})">Expand</button>
        </div>
      </div>
      <div id="rnt-order-detail-${idx}" style="display:none;border-top:1px solid var(--border);">
        <div class="panel-body" style="padding:12px 18px;">
          <div style="font-size:12px;color:var(--text-dim);margin-bottom:10px;">${o.items.length} line item(s) · ${totalQty} unit(s) total · Est. ₱${totalEst.toLocaleString()}</div>
          <div style="overflow-x:auto;">
            <table class="inv-table" style="font-size:12px;">
              <thead><tr><th>Equipment</th><th>Asset ID</th><th>Needed Qty</th><th>Est. Unit</th><th>Est. Total</th></tr></thead>
              <tbody>${o.items.map(function (it) { return `<tr>
                <td>${escHtml(it.name)}</td><td>${escHtml(it.assetId)}</td><td>${it.shortQty} ${escHtml(it.unitType)}</td>
                <td>₱${(it.estPrice || 0).toLocaleString()}</td><td>₱${((it.shortQty || 0) * (it.estPrice || 0)).toLocaleString()}</td>
              </tr>`; }).join('')}</tbody>
            </table>
          </div>
          <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
            <button class="btn-outline" onclick="exportRentalOrderPdf('${o.id}')">🖨️ Export PDF</button>
            ${o.status === 'draft' ? `<button class="btn-primary" onclick="markRentalOrderSent('${o.id}')">📨 Order Sent</button>` : ''}
            ${o.status === 'pending' ? `<button class="btn-approve" onclick="markRentalOrderArrived('${o.id}')">✅ Arrived</button><button class="btn-reject" onclick="cancelRentalOrder('${o.id}')">✕ Cancelled</button>` : ''}
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
}

function toggleRentalOrderDetails(idx) {
  var el = document.getElementById('rnt-order-detail-' + idx);
  if (!el) return;
  el.style.display = el.style.display === 'none' ? '' : 'none';
}

function exportRentalOrderPdf(orderId) {
  const o = window.rentalOrders.find(function (x) { return x.id === orderId; });
  if (!o) return;
  const w = window.open('', '_blank');
  const rows = o.items.map(function (it) {
    return '<tr><td>' + escHtml(it.name) + '</td><td>' + escHtml(it.assetId) + '</td><td>' + it.shortQty + ' ' + escHtml(it.unitType) + '</td><td>₱' + (it.estPrice || 0).toLocaleString() + '</td></tr>';
  }).join('');
  w.document.write('<html><head><title>Rental Order ' + escHtml(o.id) + '</title><style>body{font-family:sans-serif;padding:28px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:8px;text-align:left}th{background:#f4f4f4}</style></head><body>');
  w.document.write('<h2>Rental Order ' + escHtml(o.id) + '</h2>');
  w.document.write('<p><strong>Supplier:</strong> ' + escHtml(o.supplier) + '</p>');
  w.document.write('<p><strong>Event:</strong> ' + escHtml(o.eventName) + ' · ' + escHtml(o.eventDate) + '</p>');
  w.document.write('<p><strong>Venue / Required Time:</strong> ' + escHtml(o.venue) + ' · ' + escHtml(o.timePeriod?.label || 'Time TBD') + '</p>');
  w.document.write('<table><thead><tr><th>Equipment</th><th>Asset ID</th><th>Needed Qty</th><th>Est. Unit Price</th></tr></thead><tbody>' + rows + '</tbody></table>');
  w.document.write('</body></html>');
  w.document.close();
  w.print();
}

function markRentalOrderSent(orderId) {
  const o = window.rentalOrders.find(function (x) { return x.id === orderId; });
  if (!o) return;
  o.status = 'pending';
  o.sentAt = new Date().toISOString();
  showToast('Purchase order email queued for ' + o.supplier + '.');
  renderRentalCards();
}

function markRentalOrderArrived(orderId) {
  const o = window.rentalOrders.find(function (x) { return x.id === orderId; });
  if (!o) return;
  o.status = 'arrived';
  o.arrivedAt = new Date().toISOString();
  o.items.forEach(function (it) {
    const rid = 'RNT-' + String(RENTED_EQUIPMENT.length + 1).padStart(3, '0');
    RENTED_EQUIPMENT.push({
      id: rid,
      name: it.name,
      type: it.category,
      category: it.category,
      quantity: it.shortQty,
      unitType: it.unitType || 'pcs',
      condition: 'Good',
      status: 'Awaiting',
      initialPrice: it.estPrice || 0,
      supplier: o.supplier,
      arrivalDate: o.eventDate,
      deploymentDate: o.eventDate,
      returnDate: o.eventDate,
      reservationId: o.eventId,
      forEvent: o.eventId,
      forEventName: o.eventName,
      linkedEvent: o.eventName + ' — ' + o.eventDate,
      notes: 'Auto-added from rental order ' + o.id + '.',
      trackingType: 'rental'
    });
  });
  showToast('Order marked arrived. Rental assets are now tracked.');
  renderRentalCards();
}

function cancelRentalOrder(orderId) {
  const o = window.rentalOrders.find(function (x) { return x.id === orderId; });
  if (!o) return;
  o.status = 'cancelled';
  o.cancelledAt = new Date().toISOString();
  showToast('Rental order cancelled. Needs remain in shortage review.');
  renderRentalCards();
}

function updateRentalStats() {
  const needsCount = collectRentalNeeds().length;
  const pendingCount = window.rentalOrders.filter(function (o) { return o.status === 'pending'; }).length;
  const arrivedCount = window.rentalOrders.filter(function (o) { return o.status === 'arrived'; }).length;
  var s = function (id, v) { var el = document.getElementById(id); if (el) el.textContent = v; };
  s('rnt-stat-total', window.rentalOrders.length);
  s('rnt-stat-deployed', pendingCount);
  s('rnt-stat-due', needsCount);
  s('rnt-stat-returned', arrivedCount);
}

function renderTrackedRentalAssets() {
  const container = document.getElementById('rnt-cards-container');
  if (!container) return;
  const active = RENTED_EQUIPMENT.filter(function (r) { return r.trackingType === 'rental' || r.reservationId || r.forEvent; });
  if (!active.length) {
    container.innerHTML = '<div class="panel"><div class="panel-body" style="text-align:center;padding:22px;color:var(--text-dim);">No arrived rental assets yet.</div></div>';
    return;
  }
  container.innerHTML = '<div class="panel"><div class="panel-hdr"><div><div class="panel-title">📦 Arrived Rental Assets (Tracked)</div><div class="panel-sub">These are now visible to lifecycle and routine check flows.</div></div></div><div class="panel-body" style="padding:0;overflow-x:auto;"><table class="inv-table"><thead><tr><th>ID</th><th>Equipment</th><th>Supplier</th><th>Qty</th><th>Event</th><th>Status</th></tr></thead><tbody>' +
    active.map(function (r) { return '<tr><td>' + escHtml(r.id) + '</td><td>' + escHtml(r.name) + '</td><td>' + escHtml(r.supplier || '—') + '</td><td>' + (r.quantity || 0) + ' ' + escHtml(r.unitType || 'pcs') + '</td><td>' + escHtml(r.linkedEvent || r.forEventName || '—') + '</td><td><span class="badge pending">Tracked Rental</span></td></tr>'; }).join('') +
    '</tbody></table></div></div>';
}

// compatibility stubs for old entry points
function openAddRentalModal() {
  showSection('rentals', document.getElementById('nav-rentals'));
  showToast('Rental orders are now auto-generated from scheduling shortages.');
}
function closeAddRentalModal() {}
function submitAddRental() {}
function openEditRentalModal() { showToast('Manual rental editing is disabled in the new flow.'); }
function closeEditRentalModal() {}
function submitEditRental() {}
function confirmDeleteRental() { showToast('Remove via order cancellation if needed.'); }

window.openAddRentalModal = openAddRentalModal;
window.closeAddRentalModal = closeAddRentalModal;
window.submitAddRental = submitAddRental;
window.openEditRentalModal = openEditRentalModal;
window.closeEditRentalModal = closeEditRentalModal;
window.submitEditRental = submitEditRental;
window.confirmDeleteRental = confirmDeleteRental;
window.reviewRentalNeeds = reviewRentalNeeds;
window.generateRentalOrdersForEvent = generateRentalOrdersForEvent;
window.toggleRentalOrderDetails = toggleRentalOrderDetails;
window.exportRentalOrderPdf = exportRentalOrderPdf;
window.markRentalOrderSent = markRentalOrderSent;
window.markRentalOrderArrived = markRentalOrderArrived;
window.cancelRentalOrder = cancelRentalOrder;

// ===== Initial EIM render =====
renderEIMStats();

// ====================================================================
// ==================== AI INTELLIGENCE ENGINE ========================
// ====================================================================
const AI_API_URL = 'https://halden-s-catering-service.vercel.app/api/chat';
const AI_SYS_INSIGHTS = `You are the Senior Business Intelligence Consultant for Halden's Event Management and Catering Service.
Your goal is to analyze the provided business data and provide 4 high-value strategic insights.
Format: Use HTML tags for structure. Each insight should start with a gold bullet <span style='color:var(--gold);'>●</span> and a strong title.
Tone: Premium, data-driven, and encouraging. Focus on maximizing profit and operational efficiency.`;

async function generateAIReport() {
  const btn = document.getElementById('btn-ai-report');
  const container = document.getElementById('ai-insights-container');
  const body = document.getElementById('ai-insights-body');
  if (!btn || !container || !body) return;
  btn.disabled = true;
  btn.textContent = ' Analyzing Live Data...';
  const confirmed = RESERVATIONS.filter(r => r.status === 'confirmed');
  const pending = RESERVATIONS.filter(r => r.status === 'pending');
  const revTotal = confirmed.reduce((sum, r) => sum + (parseFloat(r.amount.replace(/[^\d.]/g, '')) || 0), 0);
  const context = `
    CURRENT BUSINESS SNAPSHOT:
    - Confirmed Reservations: ${confirmed.length}
    - Pending Inquiries: ${pending.length}
    - Total Confirmed Revenue: ₱${revTotal.toLocaleString()}
    - Total Equipment Assets: ${EIM_ASSETS.length} types (${EIM_ASSETS.reduce((s, a) => s + a.quantity, 0)} total units)
    - Active Rentals: ${RENTED_EQUIPMENT.filter(r => r.status !== 'Returned').length}
    - Top Event Types: ${[...new Set(confirmed.map(r => r.type))].join(', ')}
  `;
  try {
    const response = await fetch(AI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b:free',
        messages: [
          { role: 'system', content: AI_SYS_INSIGHTS },
          { role: 'user', content: `Generate a business intelligence report: ${context}` }
        ]
      })
    });
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Unable to synthesize data. Please try again.";
    container.style.display = 'block';
    body.innerHTML = reply.replace(/\n/g, '<br>');
    container.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch (err) {
    console.error('AI Error:', err);
    body.innerHTML = `<p style="color:var(--red);">🚨 Error connecting to Intelligence Engine.</p>`;
    container.style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.textContent = ' Re-Generate Intelligence';
  }
}
window.generateAIReport = generateAIReport;

// ====================================================================
// ==================== ADMIN CHAT ====================================
// ====================================================================
let activeCustomerId = null;
let activeChatUnsub = null;
let conversationsUnsub = null;

function initAdminChat() {
  if (conversationsUnsub) return;
  const { collection, onSnapshot, query, orderBy } = window.firebaseFns;
  const q = query(collection(window.firebaseDB, 'messages'), orderBy('timestamp', 'desc'));
  conversationsUnsub = onSnapshot(q, (snap) => {
    const convoMap = new Map();
    snap.forEach(doc => {
      const msg = doc.data();
      if (!convoMap.has(msg.uid)) {
        convoMap.set(msg.uid, {
          uid: msg.uid, name: msg.userName, email: msg.userEmail,
          lastMsg: msg.text, time: msg.timestamp, hasNew: msg.sender === 'customer'
        });
      }
    });
    renderChatInbox(Array.from(convoMap.values()));
    const anyNew = Array.from(convoMap.values()).some(c => c.hasNew);
    const notif = document.getElementById('chat-notif');
    if (notif) notif.style.display = anyNew ? 'inline-block' : 'none';
  });
}

function renderChatInbox(convos) {
  const list = document.getElementById('chat-inbox-list');
  if (!list) return;
  if (convos.length === 0) {
    list.innerHTML = `<div style="padding:20px; text-align:center; color:var(--text-dim); font-size:12px;">No active chats yet.</div>`;
    return;
  }
  list.innerHTML = convos.map(c => {
    const timeStr = new Date(c.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `
      <div class="inbox-item ${activeCustomerId === c.uid ? 'active' : ''} ${c.hasNew ? 'unread' : ''}" onclick="openConversation('${c.uid}', '${c.name.replace(/'/g, "\\'")}')">
        <div class="ii-name">${c.name} ${c.hasNew ? '<span class="ii-dot"></span>' : ''}</div>
        <div class="ii-msg">${c.lastMsg}</div>
        <div class="ii-time">${timeStr}</div>
      </div>`;
  }).join('');
}

async function openConversation(uid, name) {
  activeCustomerId = uid;
  document.querySelector('.ach-name').textContent = name;
  document.querySelector('.ach-status').textContent = 'Direct Support Channel';
  document.getElementById('admin-chat-input-row').style.display = 'flex';
  renderChatInbox([]);
  if (activeChatUnsub) activeChatUnsub();
  const { collection, query, where, orderBy, onSnapshot } = window.firebaseFns;
  const q = query(collection(window.firebaseDB, 'messages'), where('uid', '==', uid), orderBy('timestamp', 'asc'));
  activeChatUnsub = onSnapshot(q, (snap) => {
    const box = document.getElementById('admin-chat-box');
    box.innerHTML = '';
    snap.forEach(doc => {
      const msg = doc.data();
      const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const bubble = document.createElement('div');
      bubble.className = `chat-bubble ${msg.sender}`;
      bubble.innerHTML = `<div class="chat-text">${msg.text}</div><div class="chat-time">${time}</div>`;
      box.appendChild(bubble);
    });
    box.scrollTop = box.scrollHeight;
  });
}
window.openConversation = openConversation;

async function sendAdminMsg() {
  const input = document.getElementById('admin-chat-input');
  const text = input.value.trim();
  if (!text || !activeCustomerId) return;
  try {
    const { collection, addDoc } = window.firebaseFns;
    await addDoc(collection(window.firebaseDB, 'messages'), {
      uid: activeCustomerId,
      userName: document.querySelector('.ach-name').textContent,
      text, sender: 'staff', timestamp: Date.now()
    });
    input.value = '';
  } catch (err) { console.error('Send error:', err); }
}
window.sendAdminMsg = sendAdminMsg;

// ====================================================================
// ==================== SEATING LAYOUT ================================
// ====================================================================
let seatingMode = 'admin';
let seatingElements = [];
let selectedSeatingId = null;
let draggingSeatingEl = null;
let seatingOffset = { x: 0, y: 0 };
const SEATING_SNAP_DIST = 90;

function getSeatingDomRefs() {
  const useResDetails = !!document.getElementById('resd-seating-canvas');
  if (useResDetails) {
    return {
      canvas: document.getElementById('resd-seating-canvas'),
      modeTag: document.getElementById('resdSeatingModeTag'),
      modeBtn: document.getElementById('resdSeatingModeBtn'),
      sumTables: 'resd-seat-sum-tables',
      sumChairs: 'resd-seat-sum-chairs',
      sumPax: 'resd-seat-sum-pax',
      selectionInfo: document.getElementById('resd-seating-selection-info'),
      unlockBtn: null
    };
  }
  return {
    canvas: document.getElementById('seating-canvas'),
    modeTag: document.getElementById('seatingModeTag'),
    modeBtn: document.getElementById('seatingModeBtn'),
    sumTables: 'seat-sum-tables',
    sumChairs: 'seat-sum-chairs',
    sumPax: 'seat-sum-pax',
    selectionInfo: document.getElementById('seating-selection-info'),
    unlockBtn: document.getElementById('seatUnlockBtn')
  };
}

function addSeatingElement(type) {
  seatingElements.push({ id: Date.now(), type, x: 450, y: 350, parentId: null, guest: type === 'chair' ? "" : null });
  renderSeating();
}

function toggleSeatingMode() {
  seatingMode = seatingMode === 'admin' ? 'customer' : 'admin';
  selectedSeatingId = null;
  const refs = getSeatingDomRefs();
  const tag = refs.modeTag;
  const btn = refs.modeBtn;
  if (tag) {
    tag.innerText = seatingMode.toUpperCase() + " MODE";
    tag.className = `badge ${seatingMode === 'admin' ? 'pending' : 'confirmed'}`;
  }
  if (btn) btn.innerText = seatingMode === 'admin' ? "Switch to Customer View" : "Switch to Admin View";
  renderSeating();
}

function unlockAttachedChairs() {
  seatingElements.forEach(el => { if (el.parentId === selectedSeatingId) el.parentId = null; });
  renderSeating();
}

function deleteSeatingEl(id) {
  seatingElements.forEach(e => { if (e.parentId === id) e.parentId = null; });
  seatingElements = seatingElements.filter(e => e.id !== id);
  if (selectedSeatingId === id) selectedSeatingId = null;
  renderSeating();
}

function renderSeating() {
  const refs = getSeatingDomRefs();
  const canvas = refs.canvas;
  if (!canvas) return;
  canvas.innerHTML = '';
  let tCount = 0, cCount = 0;
  const sorted = [...seatingElements].sort((a, b) => {
    if (a.type.includes('table') && b.type === 'chair') return -1;
    if (a.type === 'chair' && b.type.includes('table')) return 1;
    return 0;
  });
  sorted.forEach(el => {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("transform", `translate(${el.x}, ${el.y})`);
    if (el.type.includes('table')) {
      tCount++;
      const shape = (el.type === 'table-round')
        ? document.createElementNS("http://www.w3.org/2000/svg", "circle")
        : document.createElementNS("http://www.w3.org/2000/svg", "rect");
      if (el.type === 'table-round') { shape.setAttribute("r", "45"); }
      else { shape.setAttribute("width", "130"); shape.setAttribute("height", "80"); shape.setAttribute("x", "-65"); shape.setAttribute("y", "-40"); }
      shape.setAttribute("class", `table ${selectedSeatingId === el.id ? 'selected' : ''}`);
      if (seatingMode === 'admin') {
        shape.onmousedown = (e) => { e.stopPropagation(); startSeatingDrag(e, el); };
        shape.onclick = (e) => { e.stopPropagation(); selectedSeatingId = el.id; renderSeating(); };
        shape.oncontextmenu = (e) => { e.preventDefault(); deleteSeatingEl(el.id); };
      }
      group.appendChild(shape);
    } else {
      cCount++;
      const chair = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      chair.setAttribute("r", "16");
      const isLocked = el.parentId !== null;
      chair.setAttribute("class", `chair ${isLocked ? 'chair-locked' : ''} ${el.guest ? 'chair-taken' : ''}`);
      if (seatingMode === 'customer') {
        group.style.cursor = 'pointer';
        group.addEventListener('click', function (e) {
          e.preventDefault(); e.stopPropagation();
          const name = prompt("Assign guest name to this chair:", el.guest || "");
          if (name !== null) { el.guest = name.trim(); renderSeating(); }
        });
      } else {
        chair.onmousedown = (e) => { e.stopPropagation(); startSeatingDrag(e, el); };
        chair.oncontextmenu = (e) => { e.preventDefault(); deleteSeatingEl(el.id); };
      }
      group.appendChild(chair);
      if (el.guest) {
        const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
        txt.setAttribute("y", "5"); txt.setAttribute("class", "label");
        txt.textContent = el.guest.charAt(0).toUpperCase();
        group.appendChild(txt);
        const fullTxt = document.createElementNS("http://www.w3.org/2000/svg", "text");
        fullTxt.setAttribute("y", "32"); fullTxt.setAttribute("class", "label");
        fullTxt.style.fill = "var(--gold)";
        fullTxt.textContent = el.guest;
        group.appendChild(fullTxt);
      }
    }
    canvas.appendChild(group);
  });
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.innerText = v; };
  set(refs.sumTables, tCount);
  set(refs.sumChairs, cCount);
  set(refs.sumPax, cCount);
  const hasChildren = seatingElements.some(e => e.parentId === selectedSeatingId);
  const unlockBtn = refs.unlockBtn;
  const infoTxt = refs.selectionInfo;
  if (unlockBtn) unlockBtn.style.display = (selectedSeatingId && hasChildren) ? 'block' : 'none';
  if (infoTxt) infoTxt.innerText = selectedSeatingId ? 'Table selected.' : 'Select a table to unlock chairs.';
}

function startSeatingDrag(e, el) {
  if (seatingMode !== 'admin') return;
  draggingSeatingEl = el;
  const canvas = getSeatingDomRefs().canvas;
  const CTM = canvas.getScreenCTM();
  seatingOffset.x = (e.clientX - CTM.e) / CTM.a - el.x;
  seatingOffset.y = (e.clientY - CTM.f) / CTM.d - el.y;
}

window.addEventListener('mousemove', (e) => {
  if (!draggingSeatingEl || seatingMode !== 'admin') return;
  const canvas = getSeatingDomRefs().canvas;
  if (!canvas) return;
  const CTM = canvas.getScreenCTM();
  const mx = (e.clientX - CTM.e) / CTM.a;
  const my = (e.clientY - CTM.f) / CTM.d;
  const dx = (mx - seatingOffset.x) - draggingSeatingEl.x;
  const dy = (my - seatingOffset.y) - draggingSeatingEl.y;
  draggingSeatingEl.x += dx;
  draggingSeatingEl.y += dy;
  if (draggingSeatingEl.type.includes('table')) {
    seatingElements.forEach(el => { if (el.parentId === draggingSeatingEl.id) { el.x += dx; el.y += dy; } });
  }
  renderSeating();
});

window.addEventListener('mouseup', () => {
  if (!draggingSeatingEl) return;
  if (draggingSeatingEl.type === 'chair') {
    let closest = null, minDist = SEATING_SNAP_DIST;
    seatingElements.forEach(target => {
      if (target.type.includes('table')) {
        const d = Math.sqrt((draggingSeatingEl.x - target.x) ** 2 + (draggingSeatingEl.y - target.y) ** 2);
        if (d < minDist) { minDist = d; closest = target.id; }
      }
    });
    draggingSeatingEl.parentId = closest;
  }
  draggingSeatingEl = null;
  renderSeating();
});

function saveSeatingLayout() {
  if (!activeResDetailId) {
    alert('Select a reservation first before saving seating layout.');
    return;
  }
  const extra = getActiveReservationExtra();
  if (extra) extra.seatingElements = JSON.parse(JSON.stringify(seatingElements));
  showToast('Venue seating layout saved for this reservation.');
}

// Global exposure
window.addSeatingElement = addSeatingElement;
window.toggleSeatingMode = toggleSeatingMode;
window.unlockAttachedChairs = unlockAttachedChairs;
window.saveSeatingLayout = saveSeatingLayout;
window.filterRes = filterRes;
window.renderEIMTable = renderEIMTable;
window.renderRentalCards = renderRentalCards;

// ====================================================================
// ==================== EIM 3: AVAILABILITY & STATUS ==================
// ====================================================================

// ----- EQUIPMENT FLAGS DATA -----
const EQUIPMENT_FLAGS = [
  {
    id: 'FLAG-001', assetId: 'EQ-C001',
    assetName: 'Chafing Dish Full-Size 8qt (Stainless)',
    issue: 'Bent lid on unit #7 — does not seal properly, steam escapes.',
    flagType: 'damage', severity: 'Medium',
    reportedDate: '2026-04-11', reportedBy: 'Staff — Maria Santos',
    status: 'Flagged' // Flagged | Under Repair | Resolved
  },
  {
    id: 'FLAG-002', assetId: 'EQ-G001',
    assetName: 'Water Goblet 14oz (Crystal-Clear)',
    issue: '12 units found chipped after post-event dishwasher cycle. Unsafe for service.',
    flagType: 'damage', severity: 'High',
    reportedDate: '2026-04-10', reportedBy: 'Admin',
    status: 'Flagged'
  },
  {
    id: 'FLAG-003', assetId: 'EQ-C006',
    assetName: 'Sterno / Fuel Can (Case of 24)',
    issue: 'Only 3 cases left. Needs immediate resupply before the April 19 event.',
    flagType: 'resupply', severity: 'High',
    reportedDate: '2026-04-12', reportedBy: 'Admin',
    status: 'Flagged'
  }
];

// ----- ROUTINE CHECK DATA -----
const ROUTINE_CHECK_LOGS = [
  {
    id: 'CHK-001',
    date: '2026-04-06',
    checkedBy: 'Admin',
    totalItems: 44,
    issuesFound: 2,
    flagsCreated: 2,
    notes: '2 chipped wine glasses found. Chafing dish #3 has a loose handle — flagged for repair.',
    status: 'Completed'
  }
];

let lastRoutineCheckDate = '2026-04-06';
let activeRoutineCheck = null; // stores current in-progress check

// ----- HELPERS -----
function daysSinceLastCheck() {
  if (!lastRoutineCheckDate) return 9999;
  const diff = Date.now() - new Date(lastRoutineCheckDate).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}
function isRoutineCheckOverdue() { return daysSinceLastCheck() >= 7; }

function getAssetAvailStatus(asset) {
  const hasFlag = EQUIPMENT_FLAGS.find(f => f.assetId === asset.id && f.status !== 'Resolved');
  if (hasFlag) return { label: 'Flagged', cls: 'critical', icon: '🚩' };
  switch (asset.status) {
    case 'Active': return { label: 'Available', cls: 'confirmed', icon: '✅' };
    case 'In Use': return { label: 'Deployed', cls: 'pending', icon: '🚀' };
    case 'Under Repair': return { label: 'Under Repair', cls: 'critical', icon: '🔧' };
    case 'Retired': return { label: 'Retired', cls: 'cancelled', icon: '💤' };
    default: return { label: asset.status, cls: 'pending', icon: '❓' };
  }
}

// ----- DASHBOARD ALERT BANNER -----
function updateRoutineAlertBanner() {
  const alertEl = document.getElementById('dash-routine-alert');
  const badge = document.getElementById('routine-sidebar-badge');
  if (!alertEl) return;
  const overdue = isRoutineCheckOverdue();
  alertEl.style.display = overdue ? 'block' : 'none';
  if (badge) badge.style.display = overdue ? 'inline-flex' : 'none';
  if (overdue) {
    const days = daysSinceLastCheck();
    const sub = document.getElementById('routine-alert-sub');
    if (sub) sub.textContent =
      `Last inspection was ${days} day${days !== 1 ? 's' : ''} ago — weekly check required. Click here to begin. →`;
  }
}

// ----- RENDER AVAILABILITY SECTION -----
function renderAvailabilitySection() {
  // Stats
  const avail = EIM_ASSETS.filter(a => {
    const fl = EQUIPMENT_FLAGS.find(f => f.assetId === a.id && f.status !== 'Resolved');
    return !fl && a.status === 'Active';
  }).length;
  const inUse = EIM_ASSETS.filter(a => a.status === 'In Use').length;
  const repair = EIM_ASSETS.filter(a => a.status === 'Under Repair').length;
  const flags = EQUIPMENT_FLAGS.filter(f => f.status !== 'Resolved').length;

  const s = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  s('avail-stat-avail', avail);
  s('avail-stat-inuse', inUse);
  s('avail-stat-repair', repair);
  s('avail-stat-flags', flags);

  // Flags panel
  const flagsEl = document.getElementById('avail-flags-container');
  if (flagsEl) {
    const active = EQUIPMENT_FLAGS.filter(f => f.status !== 'Resolved');
    if (!active.length) {
      flagsEl.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-dim); font-size:13px;">No active flags. All equipment accounted for. ✓</div>`;
    } else {
      const sevColors = { High: 'var(--red)', Medium: 'var(--amber)', Low: 'var(--gold)' };
      flagsEl.innerHTML = active.map((f, i) => `
        <div style="display:flex; align-items:flex-start; gap:14px; padding:14px 20px; border-bottom:1px solid var(--border);">
          <div style="width:8px; height:8px; border-radius:50%; background:${sevColors[f.severity] || 'var(--gold)'}; margin-top:5px; flex-shrink:0;"></div>
          <div style="flex:1; min-width:0;">
            <div style="font-size:13px; font-weight:700; color:var(--cream); margin-bottom:2px;">${f.assetName}</div>
            <div style="font-size:12px; color:var(--text); margin-bottom:4px;">${f.issue}</div>
            <div style="font-size:11px; color:var(--text-dim);">
              Reported ${f.reportedDate} by ${f.reportedBy} ·
              <span style="color:${sevColors[f.severity]}">${f.severity} severity</span> ·
              <code style="font-size:10px; background:rgba(255,255,255,0.05); padding:1px 5px; border-radius:4px;">${f.id}</code>
            </div>
          </div>
          <div style="display:flex; gap:6px; flex-shrink:0;">
            <button class="btn-view" style="font-size:11px;" onclick="updateFlagStatus(${EQUIPMENT_FLAGS.indexOf(f)}, 'Under Repair')">Mark Repairing</button>
            <button class="btn-approve" style="font-size:11px;" onclick="updateFlagStatus(${EQUIPMENT_FLAGS.indexOf(f)}, 'Resolved')">✓ Resolve</button>
          </div>
        </div>`).join('');
    }
  }

  // Availability table
  const q = (document.getElementById('avail-search') || {}).value || '';
  const filtered = EIM_ASSETS.filter(a => {
    if (!q) return true;
    const ql = q.toLowerCase();
    return a.name.toLowerCase().includes(ql) || a.id.toLowerCase().includes(ql) || a.category.toLowerCase().includes(ql);
  });

  const tbody = document.getElementById('avail-tbody');
  if (!tbody) return;
  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-dim);">No items found.</td></tr>`;
    return;
  }

  const condColors = { Excellent: 'var(--green)', Good: 'var(--gold)', Fair: 'var(--amber)', Poor: 'var(--red)' };

  tbody.innerHTML = filtered.map(a => {
    const idx = EIM_ASSETS.indexOf(a);
    const avs = getAssetAvailStatus(a);
    return `
      <tr>
        <td><code style="font-size:11px; color:var(--gold); background:rgba(196,154,60,0.08); padding:2px 6px; border-radius:4px;">${a.id}</code></td>
        <td>
          <div class="item-name">${a.name}</div>
          <div class="item-cat">${a.type}</div>
        </td>
        <td><span class="badge pending" style="font-size:10px;">${a.category}</span></td>
        <td style="font-size:13px;font-weight:600;">${a.quantity} <span style="color:var(--text-dim);font-size:11px;">${a.unitType}</span></td>
        <td>
          <select class="avail-status-select" onchange="quickUpdateAssetStatus(${idx}, this.value)"
            style="background:transparent; border:1px solid var(--border); border-radius:6px; color:var(--text); padding:4px 8px; font-size:12px; font-family:'DM Sans',sans-serif; cursor:pointer;">
            <option value="Active"      ${a.status === 'Active' ? 'selected' : ''}>✅ Available</option>
            <option value="In Use"      ${a.status === 'In Use' ? 'selected' : ''}>🚀 In Use</option>
            <option value="Under Repair"${a.status === 'Under Repair' ? 'selected' : ''}>🔧 Under Repair</option>
            <option value="Retired"     ${a.status === 'Retired' ? 'selected' : ''}>💤 Retired</option>
          </select>
          ${avs.label === 'Flagged' ? `<div style="font-size:10px;color:var(--red);margin-top:3px;">🚩 Flagged</div>` : ''}
        </td>
        <td><span style="font-size:12px;font-weight:600;color:${condColors[a.condition] || 'var(--text)'};">● ${a.condition}</span></td>
        <td style="text-align:right;">
          <button class="btn-view" style="font-size:11px;" onclick="openFlagModalFor('${a.id}')">🚩 Flag</button>
        </td>
      </tr>`;
  }).join('');
}

function quickUpdateAssetStatus(idx, newStatus) {
  if (!EIM_ASSETS[idx]) return;
  EIM_ASSETS[idx].status = newStatus;
  renderAvailabilitySection();
  renderEIMStats();
  updateRoutineAlertBanner();
}
window.quickUpdateAssetStatus = quickUpdateAssetStatus;

function updateFlagStatus(idx, newStatus) {
  if (!EQUIPMENT_FLAGS[idx]) return;
  EQUIPMENT_FLAGS[idx].status = newStatus;
  renderAvailabilitySection();
  updateRoutineAlertBanner();
}
window.updateFlagStatus = updateFlagStatus;
window.renderAvailabilitySection = renderAvailabilitySection;

// ----- FLAG MODAL -----
function populateFlagSelect(preselect) {
  const sel = document.getElementById('flag-asset-select');
  if (!sel) return;
  sel.innerHTML = `<option value="">Select equipment...</option>` +
    EIM_ASSETS.map(a => `<option value="${a.id}" ${a.id === preselect ? 'selected' : ''}>${a.id} — ${a.name}</option>`).join('');
}

function openFlagModal() {
  populateFlagSelect(null);
  document.getElementById('flag-description').value = '';
  document.getElementById('flag-reporter').value = '';
  document.getElementById('flag-type').value = 'damage';
  document.getElementById('flag-severity').value = 'Medium';
  document.getElementById('flag-overlay').classList.add('on');
  document.getElementById('flag-modal').classList.add('open');
}

function openFlagModalFor(assetId) {
  openFlagModal();
  populateFlagSelect(assetId);
}

function closeFlagModal() {
  document.getElementById('flag-overlay').classList.remove('on');
  document.getElementById('flag-modal').classList.remove('open');
}

function submitFlag() {
  const assetId = document.getElementById('flag-asset-select').value;
  const desc = document.getElementById('flag-description').value.trim();
  const reporter = document.getElementById('flag-reporter').value.trim();
  if (!assetId || !desc) { alert('Please select an asset and describe the issue.'); return; }
  const asset = EIM_ASSETS.find(a => a.id === assetId);
  const newFlag = {
    id: 'FLAG-' + String(EQUIPMENT_FLAGS.length + 1).padStart(3, '0'),
    assetId,
    assetName: asset ? asset.name : assetId,
    issue: desc,
    flagType: document.getElementById('flag-type').value,
    severity: document.getElementById('flag-severity').value,
    reportedDate: new Date().toISOString().split('T')[0],
    reportedBy: reporter || 'Admin',
    status: 'Flagged'
  };
  EQUIPMENT_FLAGS.push(newFlag);
  closeFlagModal();
  renderAvailabilitySection();
  updateRoutineAlertBanner();
  // TODO: persist to Firestore: addDoc(collection(db, 'equipment_flags'), newFlag)
}

window.openFlagModal = openFlagModal;
window.openFlagModalFor = openFlagModalFor;
window.closeFlagModal = closeFlagModal;
window.submitFlag = submitFlag;

// ====================================================================
// ==================== EIM 3.5: ROUTINE CHECKS =======================
// ====================================================================

function renderRoutineCheckSection() {
  const days = lastRoutineCheckDate ? daysSinceLastCheck() : null;
  const overdue = isRoutineCheckOverdue();

  const lastDateEl = document.getElementById('routine-last-date');
  const daysSinceEl = document.getElementById('routine-days-since');
  const badgeEl = document.getElementById('routine-due-badge');
  const itemCountEl = document.getElementById('routine-item-count');

  if (lastDateEl) lastDateEl.textContent = lastRoutineCheckDate
    ? new Date(lastRoutineCheckDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })
    : 'Never';

  if (daysSinceEl) {
    daysSinceEl.textContent = days !== null ? days : '—';
    daysSinceEl.style.color = overdue ? 'var(--red)' : 'var(--green)';
  }

  if (badgeEl) {
    badgeEl.innerHTML = overdue
      ? `<span class="badge critical" style="font-size:12px; padding:5px 14px;">⚠ OVERDUE</span>`
      : `<span class="badge confirmed" style="font-size:12px; padding:5px 14px;">✓ On Schedule</span>`;
  }

  if (itemCountEl) {
    const trackedRentals = RENTED_EQUIPMENT.filter(function (r) { return r.trackingType === 'rental' || r.reservationId || r.forEvent; }).length;
    itemCountEl.textContent = EIM_ASSETS.length + trackedRentals;
  }

  // Show/hide active checklist container
  const container = document.getElementById('routine-checklist-container');
  if (container) container.style.display = activeRoutineCheck ? 'block' : 'none';

  // Start button label
  const startBtn = document.getElementById('btn-start-check');
  if (startBtn) startBtn.textContent = activeRoutineCheck ? '↻ Reset Check' : '+ Start New Check';

  renderRoutineHistory();
  if (activeRoutineCheck) renderActiveChecklist();
}

function renderRoutineHistory() {
  const container = document.getElementById('routine-history-container');
  if (!container) return;
  if (!ROUTINE_CHECK_LOGS.length) {
    container.innerHTML = `<div style="text-align:center; padding:24px; color:var(--text-dim); font-size:13px;">No inspection history yet.</div>`;
    return;
  }
  const sorted = [...ROUTINE_CHECK_LOGS].reverse();
  container.innerHTML = sorted.map(log => {
    const dateStr = new Date(log.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return `
      <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px; padding:16px 22px; border-bottom:1px solid var(--border);">
        <div>
          <div style="font-size:13px; font-weight:700; color:var(--cream);">${log.id} <span style="color:var(--text-dim); font-weight:400; font-size:12px;">— ${dateStr}</span></div>
          <div style="font-size:12px; color:var(--text-mid); margin-top:3px;">Checked by: ${log.checkedBy} · ${log.totalItems} items · ${log.issuesFound} issue${log.issuesFound !== 1 ? 's' : ''} found · ${log.flagsCreated} flag${log.flagsCreated !== 1 ? 's' : ''} created</div>
          ${log.notes ? `<div style="font-size:11px; color:var(--text-dim); margin-top:4px; font-style:italic;">"${log.notes}"</div>` : ''}
        </div>
        <span class="badge confirmed">✓ Completed</span>
      </div>`;
  }).join('');
}

function startNewRoutineCheck() {
  var rentalChecklistItems = RENTED_EQUIPMENT
    .filter(function (r) { return r.trackingType === 'rental' || r.reservationId || r.forEvent; })
    .map(function (r, i) {
      return {
        idx: EIM_ASSETS.length + i,
        assetId: r.id,
        assetName: r.name,
        category: (r.category || r.type || 'Rented') + ' (Rental)',
        quantity: r.quantity || 1,
        unitType: r.unitType || 'pcs',
        expectedCondition: r.condition || 'Good',
        foundCondition: 'OK',
        checked: false,
        notes: ''
      };
    });
  activeRoutineCheck = {
    id: 'CHK-' + String(ROUTINE_CHECK_LOGS.length + 1).padStart(3, '0'),
    date: new Date().toISOString().split('T')[0],
    checkedBy: 'Admin',
    items: EIM_ASSETS.map((a, i) => ({
      idx: i,
      assetId: a.id,
      assetName: a.name,
      category: a.category,
      quantity: a.quantity,
      unitType: a.unitType,
      expectedCondition: a.condition,
      foundCondition: 'OK',
      checked: false,
      notes: ''
    })).concat(rentalChecklistItems)
  };
  renderRoutineCheckSection();
  document.getElementById('routine-checklist-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderActiveChecklist() {
  const container = document.getElementById('routine-checklist-items');
  if (!container || !activeRoutineCheck) return;

  const checked = activeRoutineCheck.items.filter(i => i.checked).length;
  const total = activeRoutineCheck.items.length;
  const progEl = document.getElementById('routine-check-progress');
  if (progEl) progEl.textContent = `${checked} / ${total} items marked`;

  const condColors = { OK: 'var(--green)', 'Minor Issue': 'var(--amber)', Damaged: 'var(--red)', Missing: 'var(--red)' };

  container.innerHTML = activeRoutineCheck.items.map((item, i) => `
    <div class="ri-row ${item.checked ? 'ri-checked' : ''}" id="ri-row-${i}">
      <label class="ri-chk-wrap">
        <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="toggleRICheck(${i})" />
        <span class="ri-chk-box"></span>
      </label>
      <div class="ri-info">
        <code style="font-size:10px; color:var(--gold); background:rgba(196,154,60,0.08); padding:1px 6px; border-radius:4px;">${item.assetId}</code>
        <div style="font-size:13px; font-weight:600; color:var(--cream); margin-top:2px;">${item.assetName}</div>
        <div style="font-size:11px; color:var(--text-dim);">${item.category} · ${item.quantity} ${item.unitType} · Expected: ${item.expectedCondition}</div>
      </div>
      <div class="ri-controls">
        <select class="input-field ri-cond" id="ri-cond-${i}" onchange="updateRICondition(${i}, this.value)"
          style="width:140px; font-size:12px; padding:6px 10px; ${item.foundCondition !== 'OK' ? 'border-color:var(--amber);' : ''}">
          <option value="OK"           ${item.foundCondition === 'OK' ? 'selected' : ''}>✅ OK</option>
          <option value="Minor Issue"  ${item.foundCondition === 'Minor Issue' ? 'selected' : ''}>⚠️ Minor Issue</option>
          <option value="Damaged"      ${item.foundCondition === 'Damaged' ? 'selected' : ''}>🚨 Damaged</option>
          <option value="Missing"      ${item.foundCondition === 'Missing' ? 'selected' : ''}>❌ Missing Units</option>
        </select>
        <input type="text" class="input-field ri-note" id="ri-note-${i}" onchange="updateRINotes(${i}, this.value)"
          placeholder="Notes..." style="flex:1; font-size:12px; padding:6px 10px;" value="${item.notes}" />
      </div>
    </div>`).join('');
}

function toggleRICheck(i) {
  if (!activeRoutineCheck) return;
  activeRoutineCheck.items[i].checked = !activeRoutineCheck.items[i].checked;
  if (activeRoutineCheck.items[i].checked) {
    document.getElementById('ri-row-' + i)?.classList.add('ri-checked');
  } else {
    document.getElementById('ri-row-' + i)?.classList.remove('ri-checked');
  }
  const checked = activeRoutineCheck.items.filter(x => x.checked).length;
  const progEl = document.getElementById('routine-check-progress');
  if (progEl) progEl.textContent = `${checked} / ${activeRoutineCheck.items.length} items marked`;
}

function updateRICondition(i, val) {
  if (!activeRoutineCheck) return;
  activeRoutineCheck.items[i].foundCondition = val;
  activeRoutineCheck.items[i].checked = true;
  document.getElementById('ri-row-' + i)?.classList.add('ri-checked');
  const checked = activeRoutineCheck.items.filter(x => x.checked).length;
  const progEl = document.getElementById('routine-check-progress');
  if (progEl) progEl.textContent = `${checked} / ${activeRoutineCheck.items.length} items marked`;
}

function updateRINotes(i, val) {
  if (!activeRoutineCheck) return;
  activeRoutineCheck.items[i].notes = val;
}

function cancelRoutineCheck() {
  if (!confirm('Cancel this inspection? All progress will be lost.')) return;
  activeRoutineCheck = null;
  renderRoutineCheckSection();
}

function submitRoutineCheck() {
  if (!activeRoutineCheck) return;
  const unchecked = activeRoutineCheck.items.filter(i => !i.checked).length;
  if (unchecked > 0) {
    if (!confirm(`${unchecked} item${unchecked > 1 ? 's' : ''} not yet marked. Submit anyway?`)) return;
  }

  // Auto-create flags for damaged/missing items
  let flagsCreated = 0;
  let issuesFound = 0;
  activeRoutineCheck.items.forEach(item => {
    if (item.foundCondition === 'Damaged' || item.foundCondition === 'Missing') {
      issuesFound++;
      // Check not already flagged
      const alreadyFlagged = EQUIPMENT_FLAGS.find(f => f.assetId === item.assetId && f.status === 'Flagged');
      if (!alreadyFlagged) {
        EQUIPMENT_FLAGS.push({
          id: 'FLAG-' + String(EQUIPMENT_FLAGS.length + 1).padStart(3, '0'),
          assetId: item.assetId,
          assetName: item.assetName,
          issue: `Routine check (${activeRoutineCheck.id}): ${item.foundCondition}${item.notes ? ' — ' + item.notes : ''}`,
          flagType: item.foundCondition === 'Missing' ? 'missing' : 'damage',
          severity: 'High',
          reportedDate: activeRoutineCheck.date,
          reportedBy: activeRoutineCheck.checkedBy + ' (Routine Check)',
          status: 'Flagged'
        });
        flagsCreated++;
      }
      // Update asset condition if Damaged
      if (item.foundCondition === 'Damaged' && EIM_ASSETS[item.idx]) {
        EIM_ASSETS[item.idx].condition = 'Poor';
        EIM_ASSETS[item.idx].status = 'Under Repair';
      }
    } else if (item.foundCondition === 'Minor Issue' && EIM_ASSETS[item.idx]) {
      if (EIM_ASSETS[item.idx].condition === 'Excellent') EIM_ASSETS[item.idx].condition = 'Good';
      issuesFound++;
    }
  });

  // Log the check
  const notes = document.getElementById('routine-overall-notes')?.value?.trim() || '';
  const logEntry = {
    id: activeRoutineCheck.id,
    date: activeRoutineCheck.date,
    checkedBy: activeRoutineCheck.checkedBy,
    totalItems: activeRoutineCheck.items.length,
    issuesFound,
    flagsCreated,
    notes: notes || (flagsCreated > 0 ? `${flagsCreated} flag${flagsCreated > 1 ? 's' : ''} auto-created.` : 'No issues found.'),
    status: 'Completed'
  };
  ROUTINE_CHECK_LOGS.push(logEntry);
  lastRoutineCheckDate = activeRoutineCheck.date;
  activeRoutineCheck = null;

  updateRoutineAlertBanner();
  renderEIMStats();
  renderRoutineCheckSection();

  if (flagsCreated > 0) {
    alert(`✅ Routine check submitted!\n\n${flagsCreated} new issue flag${flagsCreated > 1 ? 's' : ''} were created. Check "Availability & Status" for details.`);
  } else {
    alert(`✅ Routine check completed — no critical issues found.`);
  }
  // TODO: persist to Firestore: addDoc(collection(db, 'routine_checks'), logEntry)
}

function forceRoutineCheck() {
  showSection('routine-check', document.getElementById('nav-routine-check'));
  setTimeout(() => {
    if (!activeRoutineCheck) startNewRoutineCheck();
    document.getElementById('routine-checklist-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 50);
}

window.startNewRoutineCheck = startNewRoutineCheck;
window.cancelRoutineCheck = cancelRoutineCheck;
window.submitRoutineCheck = submitRoutineCheck;
window.forceRoutineCheck = forceRoutineCheck;
window.toggleRICheck = toggleRICheck;
window.updateRICondition = updateRICondition;
window.updateRINotes = updateRINotes;
window.renderRoutineCheckSection = renderRoutineCheckSection;
window.updateRoutineAlertBanner = updateRoutineAlertBanner;

// ====================================================================
// ==================== EIM 4: EVENT-BASED ALLOCATION =================
// ====================================================================

// Each rule defines how much of an asset is needed for one event.
// ruleType: 'per_pax' | 'per_table' | 'flat'
// ratio: multiplier. isFragile: true = higher buffer (plates/glasses)
// venueDeductField: DOM id whose integer value is deducted from requirement

const ALLOC_RULES = [
  // Furniture
  { assetId: 'EQ-F001', name: 'Round Banquet Table 5ft', category: 'Furniture', isFragile: false, ruleType: 'per_pax', ratio: 0.125, venueDeductField: 'venue-tables', note: '1 per 8 pax' },
  { assetId: 'EQ-F002', name: 'Rectangular Banquet Table 6ft', category: 'Furniture', isFragile: false, ruleType: 'flat', ratio: 4, venueDeductField: null, note: '4 for buffet/serving lines' },
  { assetId: 'EQ-F003', name: 'Tiffany Crossback Chair (White)', category: 'Furniture', isFragile: false, ruleType: 'per_pax', ratio: 1.0, venueDeductField: 'venue-chairs', note: '1 per pax' },
  { assetId: 'EQ-F004', name: 'Monoblock Chair (White)', category: 'Furniture', isFragile: false, ruleType: 'flat', ratio: 10, venueDeductField: null, note: '10 spare/staff chairs' },
  { assetId: 'EQ-F005', name: 'Cocktail High Table', category: 'Furniture', isFragile: false, ruleType: 'flat', ratio: 4, venueDeductField: null, note: '4 cocktail-hour tables' },
  { assetId: 'EQ-F006', name: 'Banquet Server Trolley 3-Tier', category: 'Furniture', isFragile: false, ruleType: 'flat', ratio: 2, venueDeductField: null, note: '2 for service logistics' },
  { assetId: 'EQ-F007', name: 'Folding Service Table 4ft', category: 'Furniture', isFragile: false, ruleType: 'flat', ratio: 3, venueDeductField: null, note: '3 for bar/cake/carving' },
  // Tableware
  { assetId: 'EQ-T001', name: 'Dinner Plate 10.5"', category: 'Tableware', isFragile: true, ruleType: 'per_pax', ratio: 1.0, venueDeductField: 'venue-plates', note: '1 per pax' },
  { assetId: 'EQ-T002', name: 'Salad / Dessert Plate 7"', category: 'Tableware', isFragile: true, ruleType: 'per_pax', ratio: 1.0, venueDeductField: null, note: '1 per pax' },
  { assetId: 'EQ-T003', name: 'Soup Bowl 16oz', category: 'Tableware', isFragile: true, ruleType: 'per_pax', ratio: 1.0, venueDeductField: null, note: '1 per pax' },
  { assetId: 'EQ-T004', name: 'Dinner Fork', category: 'Tableware', isFragile: false, ruleType: 'per_pax', ratio: 1.0, venueDeductField: 'venue-forks', note: '1 per pax' },
  { assetId: 'EQ-T005', name: 'Dinner Knife', category: 'Tableware', isFragile: false, ruleType: 'per_pax', ratio: 1.0, venueDeductField: 'venue-knives', note: '1 per pax' },
  { assetId: 'EQ-T006', name: 'Dinner Spoon', category: 'Tableware', isFragile: false, ruleType: 'per_pax', ratio: 1.0, venueDeductField: 'venue-spoons', note: '1 per pax' },
  { assetId: 'EQ-T007', name: 'Soup Spoon', category: 'Tableware', isFragile: false, ruleType: 'per_pax', ratio: 1.0, venueDeductField: 'venue-spoons', note: '1 per pax' },
  { assetId: 'EQ-T008', name: 'Teaspoon', category: 'Tableware', isFragile: false, ruleType: 'per_pax', ratio: 1.0, venueDeductField: null, note: '1 per pax' },
  { assetId: 'EQ-T009', name: 'Serving Platter Oval 18"', category: 'Tableware', isFragile: false, ruleType: 'per_table', ratio: 1.5, venueDeductField: null, note: '~1.5 per table' },
  { assetId: 'EQ-T010', name: 'Serving Tong 12"', category: 'Tableware', isFragile: false, ruleType: 'flat', ratio: 8, venueDeductField: null, note: '8 for buffet line' },
  { assetId: 'EQ-T011', name: 'Bread Basket (Wicker)', category: 'Tableware', isFragile: false, ruleType: 'per_table', ratio: 1.0, venueDeductField: null, note: '1 per table' },
  { assetId: 'EQ-T012', name: 'Sauce / Gravy Ladle', category: 'Tableware', isFragile: false, ruleType: 'flat', ratio: 6, venueDeductField: null, note: '6 for sauces/gravies' },
  // Glassware
  { assetId: 'EQ-G001', name: 'Water Goblet 14oz', category: 'Glassware', isFragile: true, ruleType: 'per_pax', ratio: 1.0, venueDeductField: 'venue-glasses', note: '1 per pax' },
  { assetId: 'EQ-G002', name: 'Red Wine Glass 15oz', category: 'Glassware', isFragile: true, ruleType: 'per_pax', ratio: 0.5, venueDeductField: null, note: '1 per 2 pax' },
  { assetId: 'EQ-G003', name: 'Champagne Flute 7oz', category: 'Glassware', isFragile: true, ruleType: 'per_pax', ratio: 1.0, venueDeductField: null, note: '1 per pax (toasting)' },
  { assetId: 'EQ-G004', name: 'Juice / Rocks Glass 10oz', category: 'Glassware', isFragile: true, ruleType: 'per_pax', ratio: 1.0, venueDeductField: null, note: '1 per pax' },
  { assetId: 'EQ-G005', name: 'Shot / Cordial Glass 2oz', category: 'Glassware', isFragile: true, ruleType: 'per_pax', ratio: 0.5, venueDeductField: null, note: '1 per 2 pax' },
  // Linens
  { assetId: 'EQ-L001', name: 'Round Tablecloth 120" (White)', category: 'Linens', isFragile: false, ruleType: 'per_table', ratio: 1.0, venueDeductField: null, note: '1 per round table' },
  { assetId: 'EQ-L003', name: 'Rect Tablecloth 90"x132"', category: 'Linens', isFragile: false, ruleType: 'flat', ratio: 4, venueDeductField: null, note: '4 for buffet/serving tables' },
  { assetId: 'EQ-L004', name: 'Cloth Napkin 20"x20"', category: 'Linens', isFragile: false, ruleType: 'per_pax', ratio: 1.0, venueDeductField: null, note: '1 per pax' },
  { assetId: 'EQ-L005', name: 'Chair Sash - Satin Gold', category: 'Linens', isFragile: false, ruleType: 'per_pax', ratio: 1.0, venueDeductField: null, note: '1 per chair' },
  { assetId: 'EQ-L007', name: 'Table Runner - Satin Gold', category: 'Linens', isFragile: false, ruleType: 'per_table', ratio: 1.0, venueDeductField: null, note: '1 per round table' },
  { assetId: 'EQ-L008', name: 'Buffet Skirt 17ft', category: 'Linens', isFragile: false, ruleType: 'flat', ratio: 2, venueDeductField: null, note: '2 for buffet tables' },
  // Catering Equipment
  { assetId: 'EQ-C001', name: 'Chafing Dish Full-Size 8qt', category: 'Catering Equipment', isFragile: false, ruleType: 'flat', ratio: 8, venueDeductField: 'venue-chafing', note: '8 stations per buffet' },
  { assetId: 'EQ-C002', name: 'Beverage Dispenser 3-Gallon', category: 'Catering Equipment', isFragile: false, ruleType: 'per_pax', ratio: 0.04, venueDeductField: 'venue-dispensers', note: '1 per 25 pax' },
  { assetId: 'EQ-C003', name: 'Portable Buffet Line 6-Station', category: 'Catering Equipment', isFragile: false, ruleType: 'flat', ratio: 1, venueDeductField: null, note: '1 set per event' },
  { assetId: 'EQ-C004', name: 'Ice Bucket 4L Stainless', category: 'Catering Equipment', isFragile: false, ruleType: 'per_pax', ratio: 0.1, venueDeductField: null, note: '1 per 10 pax' },
  { assetId: 'EQ-C005', name: 'Coffee Urn 30-Cup Electric', category: 'Catering Equipment', isFragile: false, ruleType: 'flat', ratio: 2, venueDeductField: null, note: '2 urns per event' },
  { assetId: 'EQ-C006', name: 'Sterno / Fuel Can', category: 'Catering Equipment', isFragile: false, ruleType: 'flat', ratio: 6, venueDeductField: null, note: '2 per chafing x 3 backup packs' },
  { assetId: 'EQ-C007', name: 'Carving Station Board', category: 'Catering Equipment', isFragile: false, ruleType: 'flat', ratio: 1, venueDeductField: null, note: '1 carving station' },
  // AV & Lighting
  { assetId: 'EQ-A001', name: 'LED Uplight RGB (Battery)', category: 'AV & Lighting', isFragile: false, ruleType: 'flat', ratio: 8, venueDeductField: null, note: '8 uplights per event' },
  { assetId: 'EQ-A002', name: 'Powered Speaker 10"', category: 'AV & Lighting', isFragile: false, ruleType: 'flat', ratio: 2, venueDeductField: null, note: '2 speakers per event' },
  { assetId: 'EQ-A003', name: 'Wireless Microphone Set', category: 'AV & Lighting', isFragile: false, ruleType: 'flat', ratio: 1, venueDeductField: null, note: '1 mic set per event' },
  { assetId: 'EQ-A005', name: 'Table Number Holder Set (1-30)', category: 'AV & Lighting', isFragile: false, ruleType: 'per_table', ratio: 0.033, venueDeductField: null, note: '1 set covers 30 tables' },
];

// State
let currentAllocEvent = null;

// Populate dropdown & restore state
function renderAllocationSection() {
  const sel = document.getElementById('alloc-event-select');
  if (!sel) return;
  const confirmed = RESERVATIONS.filter(r => r.status === 'confirmed');
  sel.innerHTML = '<option value="">Choose an approved event...</option>' +
    confirmed.map(r =>
      `<option value="${r.id}">${r.client} \u2014 ${r.date} (${r.pax} pax)</option>`
    ).join('');
  if (currentAllocEvent) {
    const still = confirmed.find(r => r.id === currentAllocEvent.id);
    if (still) { sel.value = still.id; currentAllocEvent = still; _showAllocEventSummary(still); }
    else { currentAllocEvent = null; _hideAllocResults(); }
  } else { _hideAllocResults(); }
}

function onAllocEventChange() {
  const sel = document.getElementById('alloc-event-select');
  const id = sel ? sel.value : '';
  if (!id) {
    currentAllocEvent = null;
    const s = document.getElementById('alloc-event-summary'); if (s) s.style.display = 'none';
    _hideAllocResults(); return;
  }
  const ev = RESERVATIONS.find(r => r.id === id);
  if (!ev) return;
  currentAllocEvent = ev;
  _showAllocEventSummary(ev);
  _hideAllocResults();
  // Reset venue fields to 0 first, then auto-fill from Firestore if a saved EN record exists
  ['venue-tables', 'venue-chairs', 'venue-chafing', 'venue-dispensers',
    'venue-plates', 'venue-forks', 'venue-spoons', 'venue-knives', 'venue-glasses'].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = 0;
    });
  const otherEl = document.getElementById('venue-other'); if (otherEl) otherEl.value = '';
  const si = document.getElementById('venue-save-status'); if (si) si.style.display = 'none';
  const ai = document.getElementById('venue-autofill-status'); if (ai) { ai.textContent = ''; ai.style.display = 'none'; }
  loadENRecord(ev.id);
}

function _showAllocEventSummary(ev) {
  const s = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  s('alloc-ev-client', ev.client);
  s('alloc-ev-type', ev.type);
  s('alloc-ev-date', ev.date);
  s('alloc-ev-pax', ev.pax + ' pax');
  s('alloc-ev-pkg', ev.packageName || ev.type);
  const el = document.getElementById('alloc-event-summary'); if (el) el.style.display = 'block';
}

function _hideAllocResults() {
  ['alloc-manifest-panel', 'alloc-shortage-panel', 'alloc-status-banner'].forEach(id => {
    const el = document.getElementById(id); if (el) el.style.display = 'none';
  });
  const empty = document.getElementById('alloc-empty-state');
  if (empty) empty.style.display = currentAllocEvent ? 'none' : 'block';
}

// Main engine — compute and render manifest
function generateAllocationManifest() {
  if (!currentAllocEvent) { alert('Please select an event first.'); return; }
  const ev = currentAllocEvent;
  const pax = parseInt(ev.pax) || 0;

  // Read venue deduction inputs (9 categories)
  const gv = id => Math.max(0, parseInt((document.getElementById(id) || {}).value || '0') || 0);
  const vdMap = {
    'venue-tables': gv('venue-tables'),
    'venue-chairs': gv('venue-chairs'),
    'venue-chafing': gv('venue-chafing'),
    'venue-dispensers': gv('venue-dispensers'),
    'venue-plates': gv('venue-plates'),
    'venue-forks': gv('venue-forks'),
    'venue-spoons': gv('venue-spoons'),
    'venue-knives': gv('venue-knives'),
    'venue-glasses': gv('venue-glasses'),
  };

  // Buffer rates
  const bufF = (parseFloat((document.getElementById('alloc-buffer-fragile') || {}).value || '15') || 15) / 100;
  const bufS = (parseFloat((document.getElementById('alloc-buffer-sturdy') || {}).value || '10') || 10) / 100;

  // Tables needed
  const tablesNeeded = Math.ceil(pax / 8);

  const manifest = [];
  const shortages = [];

  ALLOC_RULES.forEach(rule => {
    const asset = EIM_ASSETS.find(a => a.id === rule.assetId);
    const stockQty = asset ? asset.quantity : 0;
    const unavail = asset && (asset.status === 'Under Repair' || asset.status === 'Retired');

    // Base requirement
    let exact = 0;
    if (rule.ruleType === 'per_pax') exact = pax * rule.ratio;
    else if (rule.ruleType === 'per_table') exact = tablesNeeded * rule.ratio;
    else if (rule.ruleType === 'flat') exact = rule.ratio;
    exact = Math.ceil(exact);

    // Venue deduction
    const venueProv = rule.venueDeductField ? Math.min(vdMap[rule.venueDeductField] || 0, exact) : 0;
    const afterVenue = Math.max(0, exact - venueProv);

    // Apply buffer
    const bufRate = rule.isFragile ? bufF : bufS;
    const bufAmt = Math.ceil(afterVenue * bufRate);
    const deployQty = afterVenue + bufAmt;

    // Stock check
    const inStock = unavail ? 0 : stockQty;
    const shortfall = Math.max(0, deployQty - inStock);
    const sufficient = shortfall === 0 && !unavail;

    const line = {
      assetId: rule.assetId, name: rule.name, category: rule.category,
      isFragile: rule.isFragile, note: rule.note,
      exact, venueProv, bufAmt, deployQty, inStock, sufficient, shortfall, unavail
    };
    manifest.push(line);
    if (!sufficient) shortages.push(line);
  });

  // Manifest table
  const tbody = document.getElementById('alloc-manifest-tbody');
  if (tbody) {
    tbody.innerHTML = manifest.map(line => {
      const okCls = line.unavail ? 'critical' : (line.sufficient ? 'confirmed' : 'critical');
      const okLbl = line.unavail ? '\u26d4 Unavailable' : (line.sufficient ? '\u2705 Covered' : `\u26a0 Short ${line.shortfall}`);
      const dqClr = line.sufficient ? 'var(--cream)' : 'var(--red)';
      return `<tr>
        <td><code style="font-size:11px;color:var(--gold);background:rgba(196,154,60,0.08);padding:2px 6px;border-radius:4px;">${line.assetId}</code></td>
        <td><div class="item-name">${line.name}</div><div class="item-cat">${line.isFragile ? '\ud83d\udd2e Fragile' : '\ud83e\udea8 Sturdy'} \u00b7 ${line.note}</div></td>
        <td><span class="badge pending" style="font-size:10px;">${line.category}</span></td>
        <td style="font-size:13px;font-weight:600;">${line.exact}</td>
        <td style="font-size:12px;color:var(--amber);">+${line.bufAmt}</td>
        <td style="font-size:14px;font-weight:700;color:${dqClr};">${line.deployQty}</td>
        <td style="font-size:13px;color:${line.inStock < line.deployQty ? 'var(--red)' : 'var(--text)'};">${line.inStock}</td>
        <td style="font-size:13px;color:var(--amber);">${line.venueProv > 0 ? line.venueProv : '\u2014'}</td>
        <td style="font-size:14px;font-weight:700;color:${dqClr};">${line.deployQty}</td>
        <td><span class="badge ${okCls}" style="font-size:10px;white-space:nowrap;">${okLbl}</span></td>
      </tr>`;
    }).join('');
  }

  // Summary stats
  const okCount = manifest.filter(l => l.sufficient).length;
  const shortCount = shortages.length;
  const venueCount = manifest.filter(l => l.venueProv > 0).length;
  const st = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  st('alloc-sum-items', manifest.length);
  st('alloc-sum-ok', okCount);
  st('alloc-sum-short', shortCount);
  st('alloc-sum-venue', venueCount);

  // Badge
  const badge = document.getElementById('alloc-manifest-badge');
  if (badge) {
    badge.textContent = shortCount > 0
      ? `\u26a0 ${shortCount} Shortage${shortCount > 1 ? 's' : ''}`
      : '\u2705 Fully Covered';
    badge.className = shortCount > 0 ? 'badge critical' : 'badge confirmed';
  }
  const sub = document.getElementById('alloc-manifest-sub');
  if (sub) sub.textContent = `${ev.client} \u2014 ${ev.date} \u00b7 ${pax} pax \u00b7 ${manifest.length} equipment lines`;

  // Shortage table
  const stbody = document.getElementById('alloc-shortage-tbody');
  if (stbody) {
    stbody.innerHTML = shortages.map(line => `<tr>
      <td><div class="item-name">${line.name}</div><div class="item-cat">${line.note}</div></td>
      <td><span class="badge pending" style="font-size:10px;">${line.category}</span></td>
      <td style="font-size:13px;font-weight:700;">${line.deployQty}${line.unavail ? ' <span style="color:var(--red);font-size:10px;">(unavailable)</span>' : ''}</td>
      <td style="font-size:13px;color:var(--red);">${line.inStock}</td>
      <td style="font-size:14px;font-weight:700;color:var(--red);">${line.unavail ? 'All' : line.shortfall}</td>
      <td><button class="btn-reject" style="font-size:11px;" onclick="showSection('rentals',document.getElementById('nav-rentals'));setTimeout(openAddRentalModal,60);">+ Rent Now</button></td>
    </tr>`).join('');
  }

  // Status banner
  const banner = document.getElementById('alloc-status-banner');
  if (banner) {
    if (shortCount === 0) {
      banner.innerHTML = `<div style="padding:14px 20px;background:rgba(45,138,78,0.12);border:1px solid var(--green);border-radius:12px;display:flex;align-items:center;gap:14px;margin-bottom:4px;">
        <div style="font-size:28px;">\u2705</div>
        <div><div style="font-size:14px;font-weight:700;color:var(--green);">All Equipment Fully Covered</div>
        <div style="font-size:12px;color:var(--text-dim);">Inventory satisfies all requirements including the safety buffer. Ready to deploy.</div></div></div>`;
    } else {
      banner.innerHTML = `<div style="padding:14px 20px;background:rgba(220,38,38,0.10);border:1px solid var(--red);border-radius:12px;display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:4px;">
        <div style="display:flex;align-items:center;gap:14px;">
          <div style="font-size:28px;">\u26a0\ufe0f</div>
          <div><div style="font-size:14px;font-weight:700;color:var(--red);">${shortCount} Equipment Line${shortCount > 1 ? 's' : ''} Cannot Be Fully Covered</div>
          <div style="font-size:12px;color:var(--text-dim);">Rent the missing items to ensure full deployment for ${pax} guests.</div></div>
        </div>
        <button class="btn-reject" style="white-space:nowrap;flex-shrink:0;" onclick="showSection('rentals',document.getElementById('nav-rentals'));setTimeout(openAddRentalModal,60);">Rent Missing Items \u2192</button>
      </div>`;
    }
    banner.style.display = 'block';
  }

  // Show/hide panels
  const show = (id, v) => { const el = document.getElementById(id); if (el) el.style.display = v ? 'block' : 'none'; };
  show('alloc-empty-state', false);
  show('alloc-manifest-panel', true);
  show('alloc-shortage-panel', shortCount > 0);

  // Persist to Firestore EN collection (async — non-blocking)
  saveENRecord(ev, manifest, vdMap, bufF, bufS);
}

// Print / export manifest
function printAllocationManifest() {
  if (!currentAllocEvent) return;
  const ev = currentAllocEvent;
  const tbl = document.getElementById('alloc-manifest-table');
  if (!tbl) return;
  const html = `<!DOCTYPE html><html><head><title>Deployment Manifest \u2014 ${ev.client}</title>
  <style>body{font-family:Arial,sans-serif;font-size:12px;color:#111;padding:20px;}h1{font-size:18px;margin-bottom:4px;}p{color:#555;margin-bottom:16px;}
  table{border-collapse:collapse;width:100%;}th{background:#1a1007;color:#c49a3c;padding:8px 10px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.5px;}
  td{padding:7px 10px;border-bottom:1px solid #ddd;font-size:12px;}</style></head><body>
  <h1>Deployment Manifest \u2014 ${ev.client}</h1>
  <p>${ev.date} \u00b7 ${ev.pax} pax \u00b7 ${ev.type} \u00b7 Generated: ${new Date().toLocaleString()}</p>
  ${tbl.outerHTML}
  <script>window.print();<\/script></body></html>`;
  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
}

// Global exposure
window.renderAllocationSection = renderAllocationSection;
window.onAllocEventChange = onAllocEventChange;
window.generateAllocationManifest = generateAllocationManifest;
window.printAllocationManifest = printAllocationManifest;

// ====================================================================
// EN COLLECTION — Equipment Needs per Reservation
// Firestore path: EN/{reservationId}
// Schema: { eventId, eventName, eventDate, eventPax, savedAt,
//           venueEquipment: {tables,chairs,chafing,dispensers,
//                            plates,forks,spoons,knives,glasses,other},
//           buffersUsed: {fragile, sturdy},
//           manifest: [{ assetId, name, category, source, requiredExact,
//                         venueQty, bufferAdded, deployQty, inStock,
//                         shortfall, sufficient }] }
// ====================================================================

async function saveENRecord(ev, manifest, vdMap, bufF, bufS) {
  if (!window.firebaseFns || !window.firebaseDB) return;
  const si = document.getElementById('venue-save-status');
  try {
    const { doc, setDoc } = window.firebaseFns;
    const db = window.firebaseDB;
    const gvStr = id => parseInt((document.getElementById(id) || {}).value || '0') || 0;
    const record = {
      eventId: ev.id,
      eventName: ev.client,
      eventDate: ev.date,
      eventPax: ev.pax,
      savedAt: new Date().toISOString(),
      venueEquipment: {
        tables: gvStr('venue-tables'),
        chairs: gvStr('venue-chairs'),
        chafing: gvStr('venue-chafing'),
        dispensers: gvStr('venue-dispensers'),
        plates: gvStr('venue-plates'),
        forks: gvStr('venue-forks'),
        spoons: gvStr('venue-spoons'),
        knives: gvStr('venue-knives'),
        glasses: gvStr('venue-glasses'),
        other: (document.getElementById('venue-other') || {}).value || ''
      },
      buffersUsed: { fragile: Math.round((bufF || 0.15) * 100), sturdy: Math.round((bufS || 0.10) * 100) },
      manifest: manifest.map(l => ({
        assetId: l.assetId,
        name: l.name,
        category: l.category,
        // source tells downstream (scheduling/EN) which pool covers this item
        source: l.venueProv > 0 ? 'venue'
          : l.sufficient ? 'inventory'
            : 'rented',
        requiredExact: l.exact,
        venueQty: l.venueProv,
        bufferAdded: l.bufAmt,
        deployQty: l.deployQty,
        inStock: l.inStock,
        shortfall: l.shortfall,
        sufficient: l.sufficient
      }))
    };
    await setDoc(doc(db, 'EN', ev.id), record);
    if (si) { si.textContent = '\u2705 Saved to Firebase'; si.style.color = 'var(--green)'; si.style.display = 'inline'; }
  } catch (err) {
    console.error('[EN] Save failed:', err);
    if (si) { si.textContent = '\u26a0 Save failed: ' + err.message; si.style.color = 'var(--red)'; si.style.display = 'inline'; }
  }
}

async function loadENRecord(eventId) {
  if (!window.firebaseFns || !window.firebaseDB) return;
  const ai = document.getElementById('venue-autofill-status');
  if (ai) { ai.textContent = '\u23f3 Loading saved venue data...'; ai.style.color = 'var(--text-dim)'; ai.style.display = 'inline'; }
  try {
    const { doc, getDoc } = window.firebaseFns;
    const db = window.firebaseDB;
    const snap = await getDoc(doc(db, 'EN', eventId));
    if (!snap.exists()) {
      if (ai) { ai.textContent = 'No saved venue data yet — fill in and generate to save.'; ai.style.color = 'var(--text-dim)'; ai.style.display = 'inline'; }
      return;
    }
    const data = snap.data();
    const ve = data.venueEquipment || {};
    const fields = {
      'venue-tables': ve.tables || 0,
      'venue-chairs': ve.chairs || 0,
      'venue-chafing': ve.chafing || 0,
      'venue-dispensers': ve.dispensers || 0,
      'venue-plates': ve.plates || 0,
      'venue-forks': ve.forks || 0,
      'venue-spoons': ve.spoons || 0,
      'venue-knives': ve.knives || 0,
      'venue-glasses': ve.glasses || 0,
    };
    Object.entries(fields).forEach(([id, val]) => { const el = document.getElementById(id); if (el) el.value = val; });
    const otherEl = document.getElementById('venue-other'); if (otherEl) otherEl.value = ve.other || '';
    if (data.buffersUsed) {
      const bf = document.getElementById('alloc-buffer-fragile'); if (bf) bf.value = data.buffersUsed.fragile || 15;
      const bs = document.getElementById('alloc-buffer-sturdy'); if (bs) bs.value = data.buffersUsed.sturdy || 10;
    }
    if (ai) {
      const d = new Date(data.savedAt);
      ai.textContent = '\u2705 Auto-filled from ' + d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      ai.style.color = 'var(--green)';
    }
  } catch (err) {
    console.error('[EN] Load failed:', err);
    if (ai) { ai.textContent = '\u26a0 Could not load saved data.'; ai.style.color = 'var(--red)'; }
  }
}

// Standalone save without needing to generate manifest
async function saveVenueEquipmentOnly() {
  if (!currentAllocEvent) { alert('Please select an event first.'); return; }
  await saveENRecord(currentAllocEvent, [], {}, 0.15, 0.10);
}

window.saveENRecord = saveENRecord;
window.loadENRecord = loadENRecord;
window.saveVenueEquipmentOnly = saveVenueEquipmentOnly;

// ====================================================================
// ==================== EIM 5: SCHEDULING & CONFLICT HANDLING ==========
// ====================================================================
// Data model is Firebase-scalable — each entry maps directly to a
// Firestore 'schedules' collection document.
// TODO (Firebase): replace EIM_SCHEDULES array with Firestore CRUD:
//   addDoc, getDoc, updateDoc, deleteDoc on collection 'schedules'
// ====================================================================

const EIM_SCHEDULES = [];
// Schema per entry:
// {
//   id: 'SCH-001',
//   eventId, eventName, eventDate (YYYY-MM-DD), eventPax, eventType,
//   timePeriod: { id, label, start, end },
//   items: [{ assetId, name, category, requiredQty, assignedQty, sufficient }],
//   status: 'Fully Assigned' | 'Partially Assigned' | 'Insufficient' | 'Unassigned',
//   assignedBy, assignedAt (ISO), notes
// }

const SCHED_TIME_PERIODS = [
  { id: 'early-setup', label: 'Early Setup (5AM\u20137AM)', start: '05:00', end: '07:00' },
  { id: 'morning', label: 'Morning (7AM\u201311AM)', start: '07:00', end: '11:00' },
  { id: 'lunch', label: 'Lunch / Midday (11AM\u20132PM)', start: '11:00', end: '14:00' },
  { id: 'afternoon', label: 'Afternoon (2PM\u20136PM)', start: '14:00', end: '18:00' },
  { id: 'evening', label: 'Evening (6PM\u201310PM)', start: '18:00', end: '22:00' },
  { id: 'fullday', label: 'Full Day (7AM\u201310PM)', start: '07:00', end: '22:00' },
];

const STAFF_GROUPS_DEF = [
  { id: 'setup', label: 'Group A \u2014 Setup & Heavy Items', icon: '\ud83c\udfd7\ufe0f', categories: ['Furniture'], color: '#c49a3c' },
  { id: 'tableware', label: 'Group B \u2014 Tableware & Linens', icon: '\ud83c\udf7d\ufe0f', categories: ['Tableware', 'Glassware', 'Linens'], color: '#7c6fcd' },
  { id: 'catering', label: 'Group C \u2014 Catering Equipment', icon: '\ud83c�', categories: ['Catering Equipment'], color: '#2d8a4e' },
  { id: 'av', label: 'Group D \u2014 AV & Lighting', icon: '\ud83d\udca1', categories: ['AV & Lighting'], color: '#d97706' },
];

// State
let currentSchEvent = null;
let currentSchTimePeriod = null;
let schedCalendar = null;
let schAssignMode = null;        // null | 'manual'
let schManualAssignments = {};          // { assetId: qty }
window._schSufficiencyLines = null;     // cached lines from last sufficiency check

// ---- Helpers ----
function normalizeDateKey(dateStr) {
  if (!dateStr) return dateStr;
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  return dateStr;
}

function getSchStatusClass(status) {
  return {
    'Fully Assigned': 'confirmed', 'Partially Assigned': 'pending',
    'Insufficient': 'critical', 'Unassigned': 'cancelled'
  }[status] || 'pending';
}

// ====================================================================
// MAIN RENDER
// ====================================================================
function renderSchedulingSection() {
  populateSchEventSelect();
  renderScheduleList();
  detectAndRenderConflicts();
  renderStaffGroups();
  renderRentalNeedsPanel();
  updateSchStats();
  // Calendar is the default tab — init it right away
  setTimeout(() => initSchedCalendar(), 80);
}

// ---- Stats ----
function updateSchStats() {
  const total = EIM_SCHEDULES.length;
  const full = EIM_SCHEDULES.filter(s => s.status === 'Fully Assigned').length;
  const partial = EIM_SCHEDULES.filter(s => s.status !== 'Fully Assigned').length;
  const conflicts = detectConflicts().length;

  const s = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  s('sch-stat-total', total);
  s('sch-stat-full', full);
  s('sch-stat-partial', partial);
  s('sch-stat-conflicts', conflicts);

  const countEl = document.getElementById('sched-conflict-count');
  const badgeEl = document.getElementById('sch-sidebar-badge');
  if (countEl) { countEl.textContent = conflicts; countEl.style.display = conflicts > 0 ? 'inline-flex' : 'none'; }
  if (badgeEl) badgeEl.style.display = conflicts > 0 ? 'inline-flex' : 'none';

  const alertEl = document.getElementById('sched-conflict-alert');
  if (alertEl) {
    if (conflicts > 0) {
      alertEl.style.display = 'block';
      alertEl.innerHTML = `
        <div style="padding:14px 20px; background:rgba(220,38,38,0.1); border:1px solid var(--red); border-radius:12px; display:flex; align-items:center; justify-content:space-between; gap:14px; flex-wrap:wrap;">
          <div style="display:flex; align-items:center; gap:14px;">
            <div style="font-size:28px;">\u26a0\ufe0f</div>
            <div>
              <div style="font-size:14px; font-weight:700; color:var(--red);">${conflicts} Equipment Conflict${conflicts > 1 ? 's' : ''} Require Admin Review</div>
              <div style="font-size:12px; color:var(--text-dim); margin-top:2px;">Multiple events on the same day are competing for insufficient equipment. Rental action may be needed.</div>
            </div>
          </div>
          <button class="btn-reject" onclick="switchSchedTab('conflicts', document.getElementById('sched-tab-conflicts'))">View Conflicts \u2192</button>
        </div>`;
    } else {
      alertEl.style.display = 'none';
    }
  }
}

// ---- Tab switcher ----
function switchSchedTab(tab, btn) {
  document.querySelectorAll('.sched-pane').forEach(p => p.style.display = 'none');
  document.querySelectorAll('.sched-tab').forEach(b => b.classList.remove('active'));
  const pane = document.getElementById('sched-pane-' + tab);
  if (pane) pane.style.display = 'block';
  if (btn) btn.classList.add('active');
  if (tab === 'calendar') setTimeout(() => initSchedCalendar(), 60);
  if (tab === 'daily') {
    const di = document.getElementById('sch-daily-date');
    if (di && !di.value) { di.value = new Date().toISOString().split('T')[0]; renderDailyOverview(); }
  }
  if (tab === 'conflicts') renderConflictsPane();
  if (tab === 'staff') renderStaffGroups();
}

// ====================================================================
// EVENT + TIME PERIOD SELECTION
// ====================================================================
function populateSchEventSelect() {
  const sel = document.getElementById('sch-event-select');
  if (!sel) return;
  const confirmed = RESERVATIONS.filter(r => ['confirmed', 'preparing', 'on-going'].includes(r.status));
  sel.innerHTML = '<option value="">Choose an approved event...</option>' +
    confirmed.map(r => `<option value="${r.id}">${r.client} \u2014 ${r.date} (${r.pax} pax)</option>`).join('');
  if (currentSchEvent) {
    const still = confirmed.find(r => r.id === currentSchEvent.id);
    if (still) sel.value = still.id;
  }
}

function onSchEventChange() {
  const sel = document.getElementById('sch-event-select');
  const id = sel ? sel.value : '';
  const sumEl = document.getElementById('sch-event-summary');
  const ctrlEl = document.getElementById('sch-assign-controls');
  const suffEl = document.getElementById('sch-sufficiency-panel');

  if (!id) {
    currentSchEvent = null;
    window._schSufficiencyLines = null;
    if (sumEl) sumEl.style.display = 'none';
    if (ctrlEl) ctrlEl.style.display = 'none';
    if (suffEl) suffEl.style.display = 'none';
    return;
  }

  const ev = RESERVATIONS.find(r => r.id === id);
  if (!ev) return;
  currentSchEvent = ev;

  const s = (eid, v) => { const el = document.getElementById(eid); if (el) el.textContent = v; };
  s('sch-ev-client', ev.client);
  s('sch-ev-date', ev.date);
  s('sch-ev-pax', ev.pax + ' pax');
  s('sch-ev-type', ev.packageName || ev.type);
  if (sumEl) sumEl.style.display = 'block';

  const existing = EIM_SCHEDULES.find(sc => sc.eventId === id);
  const existEl = document.getElementById('sch-existing-schedule');
  if (existEl) {
    existEl.innerHTML = existing
      ? `<div style="font-size:11px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Current Assignment Status</div>
         <div style="display:flex;align-items:center;gap:10px;">
           <span class="badge ${getSchStatusClass(existing.status)}" style="font-size:10px;">${existing.status}</span>
           <span style="font-size:12px;color:var(--text-mid);">${existing.timePeriod?.label || '\u2014'}</span>
           <span style="font-size:11px;color:var(--text-dim);">${existing.items?.length || 0} items assigned</span>
         </div>`
      : `<div style="font-size:12px;color:var(--text-dim);">No assignment yet \u2014 select a time period below to begin.</div>`;
  }

  if (currentSchTimePeriod) checkSufficiency();
  else { if (ctrlEl) ctrlEl.style.display = 'none'; if (suffEl) suffEl.style.display = 'none'; }
}

function onSchTimePeriodChange() {
  const sel = document.getElementById('sch-time-period');
  const customEl = document.getElementById('sch-custom-time');
  if (!sel) return;
  const val = sel.value;

  if (!val) { currentSchTimePeriod = null; return; }

  if (val === 'custom|custom|custom') {
    if (customEl) customEl.style.display = 'grid';
    currentSchTimePeriod = null; return;
  }

  if (customEl) customEl.style.display = 'none';
  const [id, start, end] = val.split('|');
  currentSchTimePeriod = SCHED_TIME_PERIODS.find(p => p.id === id) || { id, start, end, label: `${start}\u2013${end}` };
  if (currentSchEvent) checkSufficiency();
}

function applyCustomTime() {
  const start = document.getElementById('sch-custom-start')?.value;
  const end = document.getElementById('sch-custom-end')?.value;
  if (!start || !end) return;
  currentSchTimePeriod = { id: 'custom', label: `Custom (${start}\u2013${end})`, start, end };
  if (currentSchEvent) checkSufficiency();
}

// ====================================================================
// SUFFICIENCY CHECK
// "Effective available" = total in stock minus already-assigned on same date
// ====================================================================
function getEffectiveAvailability(dateKey, excludeEventId) {
  const sameDayScheds = EIM_SCHEDULES.filter(s => s.eventDate === dateKey && s.eventId !== excludeEventId);
  const assignedMap = {};
  sameDayScheds.forEach(sch => {
    (sch.items || []).forEach(item => {
      assignedMap[item.assetId] = (assignedMap[item.assetId] || 0) + (item.assignedQty || 0);
    });
  });
  return EIM_ASSETS.map(a => ({
    assetId: a.id,
    name: a.name,
    category: a.category,
    totalQty: a.quantity,
    assignedElsewhere: assignedMap[a.id] || 0,
    effectiveAvail: Math.max(0, a.quantity - (assignedMap[a.id] || 0)),
    status: a.status
  }));
}

function checkSufficiency() {
  if (!currentSchEvent || !currentSchTimePeriod) return;
  const ev = currentSchEvent;
  const pax = parseInt(ev.pax) || 0;
  const dateKey = normalizeDateKey(ev.date);
  const availMap = getEffectiveAvailability(dateKey, ev.id);
  const tablesNeeded = Math.ceil(pax / 8);

  const lines = [];
  ALLOC_RULES.forEach(rule => {
    let exact = 0;
    if (rule.ruleType === 'per_pax') exact = pax * rule.ratio;
    else if (rule.ruleType === 'per_table') exact = tablesNeeded * rule.ratio;
    else if (rule.ruleType === 'flat') exact = rule.ratio;
    exact = Math.ceil(exact);

    const buf = Math.ceil(exact * (rule.isFragile ? 0.15 : 0.10));
    const required = exact + buf;
    const avRec = availMap.find(a => a.assetId === rule.assetId);
    const avail = avRec ? avRec.effectiveAvail : 0;
    const unavail = avRec && (avRec.status === 'Under Repair' || avRec.status === 'Retired');
    const sufficient = !unavail && avail >= required;
    const shortfall = Math.max(0, required - avail);
    lines.push({
      assetId: rule.assetId, name: rule.name, category: rule.category,
      required, avail, sufficient, shortfall, unavail, isFragile: rule.isFragile
    });
  });

  window._schSufficiencyLines = lines;
  const shortCount = lines.filter(l => !l.sufficient).length;
  const allOk = shortCount === 0;

  const panel = document.getElementById('sch-sufficiency-panel');
  const titleEl = document.getElementById('sch-suff-title');
  const subEl = document.getElementById('sch-suff-sub');
  const badgeEl = document.getElementById('sch-suff-badge');
  const bodyEl = document.getElementById('sch-suff-body');
  const ctrlEl = document.getElementById('sch-assign-controls');
  if (!panel) return;
  panel.style.display = 'block';

  if (allOk) {
    if (titleEl) titleEl.textContent = '\u2705 Inventory Sufficient';
    if (subEl) subEl.textContent = `All ${pax} pax fully covered \u2014 ready to assign`;
    if (badgeEl) { badgeEl.className = 'badge confirmed'; badgeEl.textContent = '\u25cf Sufficient'; }
    if (bodyEl) bodyEl.innerHTML = `<div style="color:var(--green);font-size:13px;font-weight:600;">All ${lines.length} equipment lines are covered including safety buffers. You may now auto-assign or manually assign below.</div>`;
  } else {
    if (titleEl) titleEl.textContent = `\u26a0\ufe0f ${shortCount} Shortage${shortCount > 1 ? 's' : ''} Detected`;
    if (subEl) subEl.textContent = `${lines.filter(l => l.sufficient).length}/${lines.length} lines fully covered`;
    if (badgeEl) { badgeEl.className = 'badge critical'; badgeEl.textContent = `\u26a0 ${shortCount} Short`; }
    const shortLines = lines.filter(l => !l.sufficient);
    if (bodyEl) {
      bodyEl.innerHTML =
        `<div style="font-size:12px;color:var(--text-dim);margin-bottom:10px;">These items fall short of the required quantity (including safety buffer). You can rent missing items or proceed with a partial assignment.</div>
         <div style="overflow-x:auto;">
           <table class="inv-table" style="font-size:12px;">
             <thead><tr><th>Equipment</th><th>Required</th><th>Available</th><th>Short</th></tr></thead>
             <tbody>${shortLines.map(l => `
               <tr>
                 <td><div class="item-name" style="font-size:12px;">${l.name}</div><div class="item-cat">${l.category}</div></td>
                 <td style="font-weight:700;">${l.required}</td>
                 <td style="color:var(--red);font-weight:700;">${l.avail}${l.unavail ? ' <span style="font-size:10px;">(unavail)</span>' : ''}</td>
                 <td><span style="color:var(--red);font-weight:800;">\u2212${l.shortfall}</span></td>
               </tr>`).join('')}</tbody>
           </table>
         </div>
         <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
           <button class="btn-reject" onclick="showSection('rentals',document.getElementById('nav-rentals'));setTimeout(openAddRentalModal,80);">+ Rent Missing Items \u2192</button>
           <button class="btn-outline" style="font-size:12px;padding:6px 14px;" onclick="document.getElementById('sch-assign-controls').style.display='block'">Proceed with Partial Assignment</button>
         </div>`;
    }
  }
  if (ctrlEl) ctrlEl.style.display = 'block';
}

// ====================================================================
// AUTO ASSIGN
// ====================================================================
function autoAssignEquipment() {
  if (!currentSchEvent || !currentSchTimePeriod) { alert('Please select an event and a time period first.'); return; }
  if (!window._schSufficiencyLines) { checkSufficiency(); setTimeout(autoAssignEquipment, 120); return; }

  const ev = currentSchEvent;
  const lines = window._schSufficiencyLines;
  const items = lines.map(l => ({
    assetId: l.assetId,
    name: l.name,
    category: l.category,
    requiredQty: l.required,
    assignedQty: Math.min(l.required, l.avail),
    sufficient: l.sufficient
  }));
  const allOk = items.every(i => i.assignedQty >= i.requiredQty);

  _saveScheduleEntry(ev, items, allOk);
  const msg = allOk
    ? `\u2705 Auto-assigned ${items.length} equipment lines for ${ev.client} \u2014 ${currentSchTimePeriod.label}.`
    : `\u26a1 Partial assignment saved. ${items.filter(i => i.assignedQty < i.requiredQty).length} item(s) still short. Consider adding a rental order.`;
  alert(msg);
  // TODO Firestore: setDoc(doc(db,'schedules',schEntry.id), schEntry)
}

// ====================================================================
// MANUAL ASSIGN
// ====================================================================
function switchAssignMode(mode) {
  schAssignMode = mode;
  const manualEl = document.getElementById('sch-manual-assign-section');
  if (!manualEl) return;
  if (mode === 'manual') { manualEl.style.display = 'block'; renderManualAssignTable(); }
  else manualEl.style.display = 'none';
}

function cancelManualAssign() {
  schAssignMode = null;
  const el = document.getElementById('sch-manual-assign-section');
  if (el) el.style.display = 'none';
}

function renderManualAssignTable() {
  const tbody = document.getElementById('sch-manual-tbody');
  if (!tbody || !window._schSufficiencyLines) return;

  // Pre-fill from existing schedule if any
  if (!schManualAssignments || Object.keys(schManualAssignments).length === 0) {
    schManualAssignments = {};
    const existing = currentSchEvent ? EIM_SCHEDULES.find(s => s.eventId === currentSchEvent.id) : null;
    if (existing) (existing.items || []).forEach(it => { schManualAssignments[it.assetId] = it.assignedQty; });
  }

  tbody.innerHTML = window._schSufficiencyLines.map(l => {
    const cur = schManualAssignments[l.assetId] !== undefined ? schManualAssignments[l.assetId] : Math.min(l.required, l.avail);
    const okCls = cur >= l.required ? 'confirmed' : (cur > 0 ? 'pending' : 'critical');
    const okLbl = cur >= l.required ? '\u2705 OK' : (cur > 0 ? '\u26a1 Partial' : '\u2715 None');
    return `
      <tr>
        <td><div class="item-name" style="font-size:12px;">${l.name}</div><div class="item-cat">${l.category}</div></td>
        <td><span class="badge pending" style="font-size:10px;">${l.category}</span></td>
        <td style="font-size:13px;font-weight:700;color:var(--cream);">${l.required}</td>
        <td style="font-size:13px;font-weight:600;color:${l.avail >= l.required ? 'var(--green)' : 'var(--red)'}">${l.avail}</td>
        <td>
          <input type="number" value="${cur}" min="0" max="${l.avail}"
            class="input-field" style="width:80px;padding:5px 8px;font-size:13px;text-align:center;"
            oninput="schManualAssignments['${l.assetId}']=Math.min(Math.max(parseInt(this.value)||0,0),${l.avail}); this.value=schManualAssignments['${l.assetId}'];" />
        </td>
        <td><span class="badge ${okCls}" style="font-size:10px;">${okLbl}</span></td>
      </tr>`;
  }).join('');
}

function submitManualAssign() {
  if (!currentSchEvent || !currentSchTimePeriod || !window._schSufficiencyLines) { alert('Please select an event and time period first.'); return; }
  const ev = currentSchEvent;
  const lines = window._schSufficiencyLines;
  const items = lines.map(l => {
    const qty = schManualAssignments[l.assetId] !== undefined ? schManualAssignments[l.assetId] : Math.min(l.required, l.avail);
    return {
      assetId: l.assetId, name: l.name, category: l.category,
      requiredQty: l.required, assignedQty: qty, sufficient: qty >= l.required
    };
  });
  const allOk = items.every(i => i.sufficient);
  _saveScheduleEntry(ev, items, allOk);
  cancelManualAssign();
  schManualAssignments = {};
  alert(`\u2705 Manual assignment saved for ${ev.client}.`);
  // TODO Firestore
}

function _saveScheduleEntry(ev, items, allOk) {
  const status = allOk
    ? 'Fully Assigned'
    : (items.some(i => i.assignedQty > 0) ? 'Partially Assigned' : 'Insufficient');
  const existIdx = EIM_SCHEDULES.findIndex(s => s.eventId === ev.id);
  const entry = {
    id: existIdx >= 0 ? EIM_SCHEDULES[existIdx].id : 'SCH-' + String(EIM_SCHEDULES.length + 1).padStart(3, '0'),
    eventId: ev.id,
    eventName: ev.client,
    eventDate: normalizeDateKey(ev.date),
    eventPax: ev.pax,
    eventType: ev.type,
    timePeriod: currentSchTimePeriod,
    items,
    status,
    assignedBy: 'Admin',
    assignedAt: new Date().toISOString(),
    notes: ''
  };
  if (existIdx >= 0) EIM_SCHEDULES[existIdx] = entry;
  else EIM_SCHEDULES.push(entry);
  renderScheduleList();
  updateSchStats();
  detectAndRenderConflicts();
  renderRentalNeedsPanel();
  // Refresh calendar so assignment colors update immediately
  if (schedCalendar) {
    schedCalendar.removeAllEvents();
    schedCalendar.addEventSource(_buildCalendarEvents());
    schedCalendar.render();
  }
}

// ====================================================================
// SCHEDULE LIST
// ====================================================================
function renderScheduleList() {
  const container = document.getElementById('sch-list-container');
  if (!container) return;
  const q = (document.getElementById('sch-search') || {}).value || '';
  const filtered = EIM_SCHEDULES.filter(s => {
    if (!q) return true;
    const ql = q.toLowerCase();
    return s.eventName.toLowerCase().includes(ql) || s.eventDate.includes(ql) || (s.eventType || '').toLowerCase().includes(ql);
  });

  if (!filtered.length) {
    container.innerHTML = `
      <div style="text-align:center;padding:60px 20px;color:var(--text-dim);">
        <div style="font-size:48px;margin-bottom:16px;">\ud83d\udccb</div>
        <div style="font-size:16px;font-family:'Playfair Display',serif;font-weight:700;color:var(--cream);margin-bottom:8px;">No Assignments Yet</div>
        <div style="font-size:13px;max-width:400px;margin:0 auto;line-height:1.6;">Select an approved event above, choose a deployment time period, then click <strong>\u26a1 Auto Assign All</strong> or <strong>\u270f\ufe0f Manual Assign</strong>.</div>
      </div>`;
    return;
  }

  const fmt = d => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : d;

  container.innerHTML = filtered.map(sch => {
    const idx = EIM_SCHEDULES.indexOf(sch);
    const fullCount = (sch.items || []).filter(i => i.sufficient).length;
    const totalCount = (sch.items || []).length;
    const shortCount = (sch.items || []).filter(i => !i.sufficient).length;
    const partCount = (sch.items || []).filter(i => !i.sufficient && i.assignedQty > 0).length;
    return `
      <div class="sch-card">
        <div class="sch-card-head">
          <div>
            <div style="font-size:15px;font-weight:700;color:var(--cream);">${sch.eventName}</div>
            <div style="font-size:12px;color:var(--text-dim);margin-top:3px;">${fmt(sch.eventDate)} \u00b7 ${sch.eventPax} pax \u00b7 ${sch.eventType || '\u2014'}</div>
            <div style="font-size:11px;color:var(--gold);margin-top:3px;">\u23f0 ${sch.timePeriod?.label || '\u2014'}</div>
          </div>
          <div style="text-align:right;flex-shrink:0;">
            <span class="badge ${getSchStatusClass(sch.status)}" style="font-size:11px;">${sch.status}</span>
            <div style="font-size:10px;color:var(--text-dim);margin-top:6px;">Saved ${new Date(sch.assignedAt).toLocaleDateString()}</div>
          </div>
        </div>
        <div class="sch-card-stats">
          <div class="sch-stat-chip confirmed"><span>\u2705</span><span>${fullCount} fully covered</span></div>
          ${partCount > 0 ? `<div class="sch-stat-chip pending"><span>\u26a1</span><span>${partCount} partial</span></div>` : ''}
          ${shortCount > 0 ? `<div class="sch-stat-chip critical"><span>\u26a0\ufe0f</span><span>${shortCount} short</span></div>` : ''}
          <div class="sch-stat-chip" style="background:rgba(196,154,60,0.08);color:var(--gold-l);"><span>\ud83d\udce6</span><span>${totalCount} items total</span></div>
        </div>
        <div class="sch-card-actions">
          <button class="btn-view" onclick="viewScheduleDetail(${idx})">\ud83d\udccb View Items</button>
          <button class="btn-view" onclick="reAssignSchedule(${idx})">\u270f\ufe0f Re-assign</button>
          <button class="btn-reject" onclick="deleteSchedule(${idx})">\ud83d\uddd1 Remove</button>
          ${sch.status !== 'Fully Assigned' ? `<button class="btn-reject" onclick="showSection('rentals',document.getElementById('nav-rentals'))">+ Rent Missing \u2192</button>` : ''}
        </div>
      </div>`;
  }).join('');
}

function viewScheduleDetail(idx) {
  const sch = EIM_SCHEDULES[idx];
  if (!sch) return;
  const fmt = d => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : d;
  const rows = (sch.items || []).map(it => {
    const ok = it.assignedQty >= it.requiredQty;
    return `<tr>
      <td><div class="item-name" style="font-size:12px;">${it.name}</div><div class="item-cat">${it.category}</div></td>
      <td style="font-size:13px;font-weight:700;">${it.requiredQty}</td>
      <td style="font-size:13px;font-weight:700;color:${ok ? 'var(--green)' : 'var(--red)'}">${it.assignedQty}</td>
      <td><span class="badge ${ok ? 'confirmed' : 'critical'}" style="font-size:10px;">${ok ? '\u2705 OK' : '\u26a0 Short ' + (it.requiredQty - it.assignedQty)}</span></td>
    </tr>`;
  }).join('');

  const detEl = document.getElementById('sch-schedule-detail');
  if (detEl) {
    detEl.innerHTML = `
      <div class="panel" style="margin-top:16px;border:1px solid var(--gold);">
        <div class="panel-hdr">
          <div><div class="panel-title">\ud83d\udce6 Assignment Details \u2014 ${sch.eventName}</div><div class="panel-sub">${sch.timePeriod?.label} \u00b7 ${fmt(sch.eventDate)} \u00b7 ${sch.eventPax} pax</div></div>
          <button class="btn-outline" style="padding:5px 12px;font-size:12px;" onclick="document.getElementById('sch-schedule-detail').innerHTML=''">\u2715 Close</button>
        </div>
        <div class="panel-body" style="padding:0;overflow-x:auto;">
          <table class="inv-table"><thead><tr><th>Equipment</th><th>Required</th><th>Assigned</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table>
        </div>
      </div>`;
    detEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function reAssignSchedule(idx) {
  const sch = EIM_SCHEDULES[idx];
  if (!sch) return;
  const ev = RESERVATIONS.find(r => r.id === sch.eventId);
  if (!ev) { alert('Event not found in reservations.'); return; }
  currentSchEvent = ev;
  currentSchTimePeriod = sch.timePeriod;
  schManualAssignments = {};
  (sch.items || []).forEach(it => { schManualAssignments[it.assetId] = it.assignedQty; });

  const sel = document.getElementById('sch-event-select');
  if (sel) { sel.value = ev.id; onSchEventChange(); }

  const tpSel = document.getElementById('sch-time-period');
  if (tpSel && sch.timePeriod) {
    for (let i = 0; i < tpSel.options.length; i++) {
      if (tpSel.options[i].value.startsWith(sch.timePeriod.id + '|')) { tpSel.selectedIndex = i; break; }
    }
  }
  checkSufficiency();
  document.getElementById('sched-pane-assign')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function deleteSchedule(idx) {
  const sch = EIM_SCHEDULES[idx];
  if (!sch || !confirm(`Remove assignment for "${sch.eventName}"? This cannot be undone.`)) return;
  EIM_SCHEDULES.splice(idx, 1);
  renderScheduleList();
  updateSchStats();
  detectAndRenderConflicts();
  renderRentalNeedsPanel();
  if (schedCalendar) { schedCalendar.removeAllEvents(); schedCalendar.addEventSource(_buildCalendarEvents()); }
  // TODO Firestore: deleteDoc(doc(db,'schedules',sch.id))
}

// ====================================================================
// DAILY OVERVIEW
// ====================================================================
function renderDailyOverview() {
  const dateInput = document.getElementById('sch-daily-date');
  const container = document.getElementById('sch-daily-container');
  if (!dateInput || !container) return;
  const dateVal = dateInput.value;
  if (!dateVal) { container.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-dim);">Select a date above.</div>'; return; }

  const dayScheds = EIM_SCHEDULES.filter(s => s.eventDate === dateVal);
  const dayEvents = RESERVATIONS.filter(r => normalizeDateKey(r.date) === dateVal && ['confirmed', 'preparing', 'on-going'].includes(r.status));
  const dateLabel = new Date(dateVal + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  if (dayEvents.length === 0) {
    container.innerHTML = `<div class="panel"><div class="panel-body" style="text-align:center;padding:40px;color:var(--text-dim);"><div style="font-size:40px;margin-bottom:12px;">\ud83d\udcc5</div><div style="font-size:15px;font-weight:700;color:var(--cream);margin-bottom:6px;">${dateLabel}</div><div>No confirmed events on this date.</div></div></div>`;
    return;
  }

  // Aggregate equipment across all schedules for this day
  const aggMap = {};
  dayScheds.forEach(sch => {
    (sch.items || []).forEach(item => {
      if (!aggMap[item.assetId]) aggMap[item.assetId] = { name: item.name, category: item.category, required: 0, assigned: 0 };
      aggMap[item.assetId].required += item.requiredQty;
      aggMap[item.assetId].assigned += item.assignedQty;
    });
  });
  const aggLines = Object.values(aggMap);
  const hasConflict = aggLines.some(l => l.assigned < l.required);

  let html = `<div class="panel" style="margin-bottom:20px;${hasConflict ? 'border-color:var(--red);' : ''}">
    <div class="panel-hdr" style="${hasConflict ? 'background:rgba(220,38,38,0.05);' : ''}">
      <div>
        <div class="panel-title">${hasConflict ? '\u26a0\ufe0f' : '\u2705'} ${dateLabel}</div>
        <div class="panel-sub">${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''} \u00b7 ${dayScheds.length} assigned \u00b7 ${hasConflict ? '\u26a0 Equipment conflicts detected' : '\u2713 No conflicts'}</div>
      </div>
      ${hasConflict
      ? `<button class="btn-reject" onclick="showSection('rentals',document.getElementById('nav-rentals'))">\ud83d\udccb Rent Missing Items \u2192</button>`
      : `<span class="badge confirmed">\u25cf All Clear</span>`}
    </div>
  </div>`;

  // Events summary cards
  html += `<div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--gold);margin-bottom:12px;">Events \u2014 ${dateLabel}</div>
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;margin-bottom:24px;">`;
  dayEvents.forEach(r => {
    const sch = dayScheds.find(s => s.eventId === r.id);
    const stCls = sch ? getSchStatusClass(sch.status) : 'cancelled';
    html += `<div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:16px 18px;">
      <div style="font-size:14px;font-weight:700;color:var(--cream);margin-bottom:4px;">${r.client}</div>
      <div style="font-size:12px;color:var(--text-dim);margin-bottom:8px;">${r.pax} pax \u00b7 ${r.packageName || r.type}</div>
      <div style="display:flex;align-items:center;gap:8px;">
        ${sch ? `<span class="badge ${stCls}" style="font-size:10px;">${sch.status}</span><span style="font-size:11px;color:var(--text-dim);">\u23f0 ${sch.timePeriod?.label || '\u2014'}</span>` : `<span class="badge cancelled" style="font-size:10px;">Not Scheduled</span>`}
      </div>
    </div>`;
  });
  html += `</div>`;

  // Time-period blocks
  if (dayScheds.length > 0) {
    html += `<div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--gold);margin-bottom:12px;">Equipment by Time Period</div>`;
    const sorted = [...dayScheds].sort((a, b) => (a.timePeriod?.start || '').localeCompare(b.timePeriod?.start || ''));
    sorted.forEach(sch => {
      const timeLabel = sch.timePeriod?.start && sch.timePeriod?.end
        ? `${sch.timePeriod.start} \u2013 ${sch.timePeriod.end}` : '\u2014';
      html += `<div class="sch-daily-block" style="margin-bottom:14px;">
        <div class="sch-daily-time">
          <div class="sch-daily-time-label">${timeLabel}</div>
          <div class="sch-daily-event-name">${sch.eventName}</div>
          <div style="margin-top:4px;"><span class="badge ${getSchStatusClass(sch.status)}" style="font-size:9px;">${sch.status}</span></div>
        </div>
        <div class="sch-daily-items">
          ${(sch.items || []).slice(0, 10).map(it => {
        const clr = it.assignedQty >= it.requiredQty ? 'var(--green)' : 'var(--red)';
        return `<div class="sch-item-pill" style="border-color:${clr};">
              <span style="font-size:10px;color:${clr};font-weight:700;">${it.assignedQty}/${it.requiredQty}</span>
              <span style="font-size:11px;color:var(--text-mid);">${it.name}</span>
            </div>`;
      }).join('')}
          ${(sch.items || []).length > 10 ? `<div class="sch-item-pill">+${(sch.items || []).length - 10} more</div>` : ''}
        </div>
      </div>`;
    });
  }

  // Aggregated table
  if (aggLines.length > 0) {
    html += `<div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--gold);margin:20px 0 12px;">Total Equipment Needed \u2014 ${dateLabel}</div>
    <div class="panel"><div class="panel-body" style="padding:0;overflow-x:auto;">
      <table class="inv-table">
        <thead><tr><th>Equipment</th><th>Category</th><th>Day Total Required</th><th>Day Total Assigned</th><th>Day Status</th></tr></thead>
        <tbody>${aggLines.map(l => {
      const ok = l.assigned >= l.required;
      return `<tr>
            <td><div class="item-name" style="font-size:12px;">${l.name}</div></td>
            <td><span class="badge pending" style="font-size:10px;">${l.category}</span></td>
            <td style="font-size:13px;font-weight:700;">${l.required}</td>
            <td style="font-size:13px;font-weight:700;color:${ok ? 'var(--green)' : 'var(--red)'}">${l.assigned}</td>
            <td><span class="badge ${ok ? 'confirmed' : 'critical'}" style="font-size:10px;">${ok ? '\u2705 OK' : '\u26a0 Short ' + (l.required - l.assigned)}</span></td>
          </tr>`;
    }).join('')}</tbody>
      </table>
    </div></div>`;
  }

  container.innerHTML = html;
}

// ====================================================================
// USAGE CALENDAR
// ====================================================================
function _buildCalendarEvents() {
  const events = [];
  // Show EVERY approved reservation — color reflects current assignment status
  RESERVATIONS
    .filter(r => ['confirmed', 'preparing', 'on-going'].includes(r.status))
    .forEach(r => {
      const sch = EIM_SCHEDULES.find(s => s.eventId === r.id);
      const dateKey = normalizeDateKey(r.date);
      const status = sch ? sch.status : 'Unassigned';
      const bg =
        status === 'Fully Assigned' ? '#2d8a4e' :
          status === 'Partially Assigned' ? '#d97706' :
            status === 'Insufficient' ? '#c0392b' :
              'rgba(196,154,60,0.65)';  // Unscheduled = muted gold
      events.push({
        id: 'res-' + r.id,
        title: r.client + ' \u00b7 ' + (r.packageName || r.type) + ' (' + r.pax + ' pax)',
        start: dateKey,
        allDay: true,
        backgroundColor: bg,
        borderColor: status === 'Unassigned' ? '#c49a3c' : 'transparent',
        textColor: '#fff',
        extendedProps: {
          type: 'reservation',
          reservationId: r.id,
          assignStatus: status,
          schedIdx: sch ? EIM_SCHEDULES.indexOf(sch) : -1
        }
      });
    });
  return events;
}

function initSchedCalendar() {
  const calEl = document.getElementById('sched-calendar');
  if (!calEl || typeof FullCalendar === 'undefined') return;
  if (!schedCalendar) {
    schedCalendar = new FullCalendar.Calendar(calEl, {
      initialView: 'dayGridMonth',
      headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,listMonth' },
      height: 660,
      eventDidMount: function (info) {
        // Tooltip showing assignment status
        info.el.title = info.event.extendedProps.assignStatus || '';
      },
      events: _buildCalendarEvents(),
      eventClick: info => {
        const p = info.event.extendedProps;
        if (p.type !== 'reservation') { if (p.schedIdx >= 0) showSchedCalDetail(p.schedIdx); return; }
        // Find the reservation and pre-load it into the Assign tab
        const ev = RESERVATIONS.find(r => r.id === p.reservationId);
        if (!ev) return;
        currentSchEvent = ev;
        // Switch to Assign tab
        switchSchedTab('assign', document.getElementById('sched-tab-assign'));
        // After pane is visible, populate the selector and run sufficiency check
        setTimeout(() => {
          const sel = document.getElementById('sch-event-select');
          if (sel) { sel.value = ev.id; onSchEventChange(); }
          document.getElementById('sched-pane-assign')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 80);
      }
    });
    schedCalendar.render();
  } else {
    // Refresh events (e.g. after a new assignment was saved)
    schedCalendar.removeAllEvents();
    schedCalendar.addEventSource(_buildCalendarEvents());
    schedCalendar.render();
  }
}

function showSchedCalDetail(idx) {
  const sch = EIM_SCHEDULES[idx];
  if (!sch) return;
  const titleEl = document.getElementById('sched-cal-detail-title');
  const subEl = document.getElementById('sched-cal-detail-sub');
  const bodyEl = document.getElementById('sched-cal-detail-body');
  const detEl = document.getElementById('sched-cal-detail');
  if (!detEl) return;
  if (titleEl) titleEl.textContent = `\ud83d\udce6 ${sch.eventName} \u2014 Equipment List`;
  if (subEl) subEl.textContent = `${sch.timePeriod?.label || '\u2014'} \u00b7 ${sch.eventDate} \u00b7 ${sch.eventPax} pax \u00b7 ${sch.status}`;
  if (bodyEl) bodyEl.innerHTML = (sch.items || []).map(it => {
    const ok = it.assignedQty >= it.requiredQty;
    return `<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);gap:12px;">
      <div><div style="font-size:13px;font-weight:600;color:var(--cream);">${it.name}</div><div style="font-size:11px;color:var(--text-dim);">${it.category}</div></div>
      <div style="display:flex;align-items:center;gap:12px;flex-shrink:0;">
        <div style="text-align:right;"><div style="font-size:10px;color:var(--text-dim);">Assigned / Required</div><div style="font-size:14px;font-weight:700;color:${ok ? 'var(--green)' : 'var(--red)'}">${it.assignedQty} / ${it.requiredQty}</div></div>
        <span class="badge ${ok ? 'confirmed' : 'critical'}" style="font-size:10px;">${ok ? '\u2705' : '\u26a0'}</span>
      </div>
    </div>`;
  }).join('') || '<div style="color:var(--text-dim);">No items assigned.</div>';
  detEl.style.display = 'block';
  detEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ====================================================================
// CONFLICT DETECTION
// ====================================================================
function detectConflicts() {
  const byDate = {};
  EIM_SCHEDULES.forEach(sch => { if (!byDate[sch.eventDate]) byDate[sch.eventDate] = []; byDate[sch.eventDate].push(sch); });

  const conflicts = [];
  Object.entries(byDate).forEach(([date, scheds]) => {
    if (scheds.length < 2) return; // only flag when there are 2+ events
    const needed = {};
    scheds.forEach(sch => {
      (sch.items || []).forEach(it => { needed[it.assetId] = (needed[it.assetId] || 0) + it.requiredQty; });
    });
    const conflictItems = [];
    Object.entries(needed).forEach(([assetId, required]) => {
      const asset = EIM_ASSETS.find(a => a.id === assetId);
      if (asset && required > asset.quantity) {
        conflictItems.push({ assetId, name: asset.name, category: asset.category, required, available: asset.quantity, shortfall: required - asset.quantity });
      }
    });
    if (conflictItems.length > 0) conflicts.push({ date, schedules: scheds, conflictItems });
  });
  return conflicts;
}

function detectAndRenderConflicts() {
  const conflicts = detectConflicts();
  const countEl = document.getElementById('sched-conflict-count');
  const badgeEl = document.getElementById('sch-sidebar-badge');
  if (countEl) { countEl.textContent = conflicts.length; countEl.style.display = conflicts.length > 0 ? 'inline-flex' : 'none'; }
  if (badgeEl) badgeEl.style.display = conflicts.length > 0 ? 'inline-flex' : 'none';
  updateSchStats();
}

function renderConflictsPane() {
  const container = document.getElementById('sch-conflicts-container');
  if (!container) return;
  const conflicts = detectConflicts();
  if (conflicts.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-dim);"><div style="font-size:40px;margin-bottom:12px;">\u2705</div><div style="font-size:15px;font-weight:700;color:var(--green);margin-bottom:6px;">No Conflicts Detected</div><div style="font-size:13px;">All scheduled events have sufficient equipment or are single events per day.</div></div>`;
    return;
  }
  const fmt = d => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  container.innerHTML = conflicts.map(c => `
    <div style="padding:20px 22px;border-bottom:1px solid var(--border);">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:14px;flex-wrap:wrap;margin-bottom:14px;">
        <div>
          <div style="font-size:15px;font-weight:700;color:var(--red);margin-bottom:4px;">\u26a0\ufe0f ${fmt(c.date)}</div>
          <div style="font-size:12px;color:var(--text-dim);margin-bottom:8px;">${c.schedules.length} events competing for ${c.conflictItems.length} insufficient item type${c.conflictItems.length > 1 ? 's' : ''}. Admin rental action required.</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;">${c.schedules.map(s => `<span class="badge pending" style="font-size:10px;">${s.eventName} \u2014 ${s.timePeriod?.label || '\u2014'}</span>`).join('')}</div>
        </div>
        <button class="btn-reject" onclick="showSection('rentals',document.getElementById('nav-rentals'))">\ud83d\udccb Rent Missing Items \u2192</button>
      </div>
      <div style="overflow-x:auto;">
        <table class="inv-table" style="font-size:12px;">
          <thead><tr><th>Equipment</th><th>Category</th><th>Day Total Required</th><th>In Inventory</th><th>Shortfall</th></tr></thead>
          <tbody>${c.conflictItems.map(ci => `
            <tr>
              <td><div class="item-name" style="font-size:12px;">${ci.name}</div></td>
              <td><span class="badge pending" style="font-size:10px;">${ci.category}</span></td>
              <td style="font-size:13px;font-weight:700;">${ci.required}</td>
              <td style="font-size:13px;color:var(--red);font-weight:700;">${ci.available}</td>
              <td><span style="color:var(--red);font-size:14px;font-weight:800;">\u2212${ci.shortfall}</span></td>
            </tr>`).join('')}</tbody>
        </table>
      </div>
    </div>`).join('');
}

// ====================================================================
// STAFF GROUPS
// ====================================================================
function computeStaffGroups(pax, eventType) {
  let base;
  if (pax <= 50) base = { scale: 'Light', setup: 3, tableware: 3, catering: 2, av: 2 };
  else if (pax <= 100) base = { scale: 'Medium', setup: 5, tableware: 5, catering: 3, av: 2 };
  else if (pax <= 200) base = { scale: 'Heavy', setup: 8, tableware: 7, catering: 5, av: 3 };
  else base = { scale: 'Massive', setup: 12, tableware: 10, catering: 7, av: 4 };

  const laborMult = { 'Wedding': 1.2, 'Corporate': 1.0, 'Birthday Party': 0.9, 'Family Gathering': 0.85 }[eventType] || 1.0;
  const groups = STAFF_GROUPS_DEF.map(g => ({ ...g, staffCount: Math.max(2, Math.round((base[g.id] || 3) * laborMult)) }));
  return { scale: base.scale, totalStaff: groups.reduce((a, g) => a + g.staffCount, 0), groups };
}

function renderStaffGroups() {
  const container = document.getElementById('sch-staff-container');
  if (!container) return;
  const confirmed = RESERVATIONS.filter(r => ['confirmed', 'preparing'].includes(r.status));
  if (!confirmed.length) {
    container.innerHTML = '<div class="panel"><div class="panel-body" style="text-align:center;padding:40px;color:var(--text-dim);">No confirmed events to plan staffing for.</div></div>';
    return;
  }

  const byDate = {};
  confirmed.forEach(r => { const d = normalizeDateKey(r.date); if (!byDate[d]) byDate[d] = []; byDate[d].push(r); });
  const fmt = d => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  container.innerHTML = Object.entries(byDate).sort((a, b) => a[0].localeCompare(b[0])).map(([date, events]) => {
    const evHtml = events.map(ev => {
      const sg = computeStaffGroups(parseInt(ev.pax) || 50, ev.type);
      return `<div class="sch-staff-event">
        <div class="sch-staff-event-hdr">
          <div>
            <div style="font-size:14px;font-weight:700;color:var(--cream);">${ev.client}</div>
            <div style="font-size:12px;color:var(--text-dim);margin-top:2px;">${ev.pax} pax \u00b7 ${ev.packageName || ev.type} \u00b7 Scale: <strong style="color:var(--gold);">${sg.scale}</strong></div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px;">Total Staff Needed</div>
            <div style="font-size:26px;font-family:'Playfair Display',serif;font-weight:700;color:var(--cream);">${sg.totalStaff}</div>
          </div>
        </div>
        <div class="sch-staff-groups">
          ${sg.groups.map(grp => `
            <div class="sch-staff-group-card">
              <div class="sch-staff-group-icon">${grp.icon}</div>
              <div style="font-size:11px;font-weight:700;color:var(--text);margin-bottom:2px;">${grp.label}</div>
              <div style="font-size:10px;color:var(--text-dim);margin-bottom:8px;">${grp.categories.join(', ')}</div>
              <div style="font-size:24px;font-family:'Playfair Display',serif;font-weight:700;color:${grp.color};">${grp.staffCount}</div>
              <div style="font-size:10px;color:var(--text-dim);">staff members</div>
            </div>`).join('')}
        </div>
      </div>`;
    }).join('');
    const total = events.reduce((sum, ev) => sum + computeStaffGroups(parseInt(ev.pax) || 50, ev.type).totalStaff, 0);
    return `<div class="panel" style="margin-bottom:20px;">
      <div class="panel-hdr">
        <div><div class="panel-title">\ud83d\udcc5 ${fmt(date)}</div><div class="panel-sub">${events.length} event${events.length > 1 ? 's' : ''} \u00b7 ${total} total staff across all groups</div></div>
        <span class="badge ${events.length > 1 ? 'pending' : 'confirmed'}" style="font-size:11px;">${events.length > 1 ? '\u26a1 Multi-Event Day' : '\u25cf Single Event'}</span>
      </div>
      <div class="panel-body" style="padding:16px 22px;">${evHtml}</div>
    </div>`;
  }).join('');
}

// ====================================================================
// RENTAL NEEDS PANEL  (renders inside #rnt-needs-container in rentals)
// Shows all equipment that is still insufficient across all approved events
// ====================================================================
function renderRentalNeedsPanel() {
  const container = document.getElementById('rnt-needs-container');
  if (!container) return;
  const needs = collectRentalNeeds();
  if (!needs.length) { container.style.display = 'none'; return; }
  const grouped = {};
  needs.forEach(function (n) {
    if (!grouped[n.eventId]) grouped[n.eventId] = [];
    grouped[n.eventId].push(n);
  });
  const eventIds = Object.keys(grouped);
  container.style.display = 'block';
  container.innerHTML = `<div class="panel" style="border:1px solid var(--red); margin-bottom:20px;">
    <div class="panel-hdr" style="background:rgba(220,38,38,0.06);">
      <div><div class="panel-title" style="color:var(--red);">\u26a0\ufe0f Equipment Still Needed \u2014 Based on Scheduling Shortages</div>
      <div class="panel-sub">${eventIds.length} event${eventIds.length > 1 ? 's' : ''} currently require rental action.</div></div>
    </div>
    ${eventIds.map(function (eid) {
      const rows = grouped[eid];
      const first = rows[0];
      return `<div style="padding:16px 22px;border-top:1px solid var(--border);">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:10px;">
          <div>
            <div style="font-size:14px;font-weight:700;color:var(--cream);">${escHtml(first.eventName)}</div>
            <div style="font-size:11px;color:var(--text-dim);">${escHtml(first.eventDate)} \u00b7 ${first.eventPax} pax \u00b7 ${escHtml(first.timePeriod?.label || 'Time TBD')}</div>
          </div>
          <button class="btn-primary" style="font-size:12px;" onclick="reviewRentalNeeds('${eid}')">Review Rental Needs</button>
        </div>
        <div style="font-size:11px;color:var(--text-dim);">${rows.length} shortage line item(s) awaiting review.</div>
      </div>`;
    }).join('')}
  </div>`;
}

// Global exposure
window.renderSchedulingSection = renderSchedulingSection;
window.switchSchedTab = switchSchedTab;
window.populateSchEventSelect = populateSchEventSelect;
window.onSchEventChange = onSchEventChange;
window.onSchTimePeriodChange = onSchTimePeriodChange;
window.applyCustomTime = applyCustomTime;
window.checkSufficiency = checkSufficiency;
window.autoAssignEquipment = autoAssignEquipment;
window.switchAssignMode = switchAssignMode;
window.cancelManualAssign = cancelManualAssign;
window.submitManualAssign = submitManualAssign;
window.renderScheduleList = renderScheduleList;
window.viewScheduleDetail = viewScheduleDetail;
window.reAssignSchedule = reAssignSchedule;
window.deleteSchedule = deleteSchedule;
window.renderDailyOverview = renderDailyOverview;
window.renderConflictsPane = renderConflictsPane;
window.renderRentalNeedsPanel = renderRentalNeedsPanel;
window.showSchedCalDetail = showSchedCalDetail;
window.updateSchStats = updateSchStats;
window.detectConflicts = detectConflicts;
window.renderStaffGroups = renderStaffGroups;



// ====================================================================
// EIM 6: EQUIPMENT LIFECYCLE
// Departure - Deployment - Execution - Bash-Out - Restorage
// ====================================================================

var lifecycleSelectedEvent = null;
var lifecycleCurrentStage = null;
var lifecycleEquipmentItems = [];
var lifecycleStageLogs = {};
var lifecycleModalTimestamp = null;

var LIFECYCLE_STAGES = [
  { id: 'departure', label: 'Departure', icon: String.fromCodePoint(0x1F69B), desc: 'Equipment leaving storage' },
  { id: 'deployment', label: 'Deployment', icon: String.fromCodePoint(0x1F4E6), desc: 'Equipment set up at venue' },
  { id: 'execution', label: 'Execution', icon: String.fromCodePoint(0x1F3AF), desc: 'Event in progress (damage check)' },
  { id: 'bashout', label: 'Bash-Out', icon: String.fromCodePoint(0x1F4E4), desc: 'Equipment gathered after event' },
  { id: 'restorage', label: 'Restorage', icon: String.fromCodePoint(0x1F3ED), desc: 'Equipment returned to storage' }
];

function renderLifecycleSection() {
  var today = new Date();
  var todayFmt = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  var subEl = document.getElementById('lifecycle-date-sub');
  var badgeEl = document.getElementById('lifecycle-today-badge');
  if (subEl) subEl.textContent = todayFmt;
  if (badgeEl) badgeEl.textContent = 'Execution Day: ' + todayFmt;
  renderTodayEvents();
}
window.renderLifecycleSection = renderLifecycleSection;

function renderTodayEvents() {
  var container = document.getElementById('lifecycle-today-events');
  if (!container) return;
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var validStatuses = ['confirmed', 'approved', 'preparing', 'on-going'];
  var todayEvents = RESERVATIONS.filter(function (r) {
    if (validStatuses.indexOf((r.status || '').toLowerCase()) === -1) return false;
    var key = normalizeDateKey(r.date);
    if (!key) return false;
    var d = new Date(key + 'T00:00:00'); d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });
  if (!todayEvents.length) {
    container.innerHTML = '<div style="text-align:center;padding:36px 16px;color:var(--text-dim)"><div style="font-size:32px;margin-bottom:10px">&#128197;</div><div style="font-size:13px;font-weight:600;color:var(--text-mid)">No events today</div><div style="font-size:11px;margin-top:4px">Lifecycle tracking only appears on execution days.</div></div>';
    return;
  }
  var html = '';
  todayEvents.forEach(function (ev) {
    var sch = EIM_SCHEDULES.find(function (s) { return s.eventId === ev.id; });
    var tp = sch && sch.timePeriod;
    var timeLabel = tp ? (tp.start + ' – ' + tp.end) : 'Time TBD';
    var isActive = lifecycleSelectedEvent && lifecycleSelectedEvent.id === ev.id;
    html += '<div class="lifecycle-event-card' + (isActive ? ' lec-active' : '') + '" id="lec-' + ev.id + '" data-evid="' + ev.id + '" onclick="selectLifecycleEventByEl(this)">';
    html += '<div class="lec-time">' + timeLabel + '</div>';
    html += '<div class="lec-name">' + ev.client + '</div>';
    html += '<div class="lec-meta">' + ev.type + ' · ' + ev.pax + ' pax · ' + (ev.venue || 'TBD') + '</div>';
    html += '<div style="margin-top:6px"><span class="badge preparing" style="font-size:10px">' + ev.status + '</span></div>';
    html += '</div>';
  });
  container.innerHTML = html;
}

function selectLifecycleEventByEl(el) {
  selectLifecycleEvent(el.dataset.evid);
}
window.selectLifecycleEventByEl = selectLifecycleEventByEl;

async function selectLifecycleEvent(eventId) {
  var ev = RESERVATIONS.find(function (r) { return r.id === eventId; });
  if (!ev) return;
  lifecycleSelectedEvent = ev;
  document.querySelectorAll('.lifecycle-event-card').forEach(function (c) { c.classList.remove('lec-active'); });
  var card = document.getElementById('lec-' + eventId);
  if (card) card.classList.add('lec-active');
  var detail = document.getElementById('lifecycle-detail-panel');
  var noEv = document.getElementById('lifecycle-no-event');
  if (detail) detail.style.display = 'block';
  if (noEv) noEv.style.display = 'none';
  await loadLifecycleStageLogs(eventId);
  buildLifecycleEquipmentList(ev);
  renderLifecycleStageButtons(eventId);
  renderLifecycleLogs(eventId);
}
window.selectLifecycleEvent = selectLifecycleEvent;

function buildLifecycleEquipmentList(ev) {
  var items = [];
  var sch = EIM_SCHEDULES.find(function (s) { return s.eventId === ev.id; });
  if (sch && sch.items && sch.items.length) {
    sch.items.forEach(function (it) {
      items.push({ assetId: it.assetId || 'EQ-???', name: it.name, category: it.category || 'Equipment', source: 'inventory', qty: parseInt(it.assignedQty || it.requiredQty) || 1 });
    });
  }
  (window.RENTED_EQUIPMENT || []).filter(function (r) {
    return r.reservationId === ev.id || r.forEvent === ev.id || r.forEventName === ev.client;
  }).forEach(function (r) {
    items.push({ assetId: 'RENT-' + (r.id || r.name), name: r.name, category: r.category || 'Rented', source: 'rented', qty: parseInt(r.quantity) || 1 });
  });
  lifecycleEquipmentItems = items;

  var infoEl = document.getElementById('lifecycle-event-info');
  if (infoEl) {
    var tp = sch && sch.timePeriod;
    var infoHtml = '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">';
    infoHtml += '<div><div style="font-size:19px;font-weight:800;color:var(--cream)">' + ev.client + '</div>';
    infoHtml += '<div style="font-size:12px;color:var(--text-dim);margin-top:3px">' + ev.type + ' &middot; ' + ev.date + ' &middot; ' + ev.pax + ' pax';
    if (tp) infoHtml += ' &middot; <strong style="color:var(--gold)">' + tp.start + ' &ndash; ' + tp.end + '</strong>';
    if (ev.venue) infoHtml += ' &middot; ' + ev.venue;
    infoHtml += '</div></div><span class="badge preparing" style="font-size:11px">' + ev.status + '</span></div>';
    infoEl.innerHTML = infoHtml;
  }

  var listEl = document.getElementById('lifecycle-equip-list');
  if (!listEl) return;
  if (!items.length) {
    listEl.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text-dim);font-size:12px">No equipment assigned. Use Scheduling to assign equipment first.</div>';
    return;
  }
  var totalPieces = items.reduce(function (s, i) { return s + i.qty; }, 0);
  var invCount = items.filter(function (i) { return i.source === 'inventory'; }).length;
  var rentCount = items.filter(function (i) { return i.source === 'rented'; }).length;
  var listHtml = '<div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:14px;padding:10px 14px;background:var(--bg3);border-radius:8px;border:1px solid var(--border)">';
  listHtml += '<span style="font-size:12px;color:var(--text-mid)">&#128230; <strong>' + invCount + '</strong> inventory line' + (invCount !== 1 ? 's' : '') + '</span>';
  if (rentCount) listHtml += '<span style="font-size:12px;color:var(--amber)">&#128260; <strong>' + rentCount + '</strong> rented</span>';
  listHtml += '<span style="font-size:12px;color:var(--cream);margin-left:auto"><strong>' + totalPieces + '</strong> total pieces</span></div>';
  items.forEach(function (it) {
    listHtml += '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);gap:10px">';
    listHtml += '<div><div style="font-size:13px;font-weight:600;color:var(--cream)">' + it.name + '</div>';
    listHtml += '<div style="font-size:11px;color:var(--text-dim)">' + it.category + ' &middot; <span style="color:' + (it.source === 'rented' ? 'var(--amber)' : 'var(--gold)') + '">' + it.source + '</span></div></div>';
    listHtml += '<div style="font-size:15px;font-weight:700;color:var(--cream);flex-shrink:0">&times;' + it.qty + '</div></div>';
  });
  listEl.innerHTML = listHtml;
}

async function loadLifecycleStageLogs(eventId) {
  if (!lifecycleStageLogs[eventId]) lifecycleStageLogs[eventId] = {};
  if (!window.firebaseFns || !window.firebaseDB) return;
  try {
    var fns = window.firebaseFns;
    var snap = await fns.getDocs(fns.query(fns.collection(window.firebaseDB, 'deploymentLogs'), fns.where('reservationId', '==', eventId)));
    snap.forEach(function (doc) { var d = doc.data(); lifecycleStageLogs[eventId][d.stage] = { ...d, _docId: doc.id }; });
  } catch (e) { console.warn('[Lifecycle] Load:', e.message); }
}

function renderLifecycleStageButtons(eventId) {
  var container = document.getElementById('lifecycle-stage-btns');
  if (!container) return;
  var logs = lifecycleStageLogs[eventId] || {};
  var html = '';
  LIFECYCLE_STAGES.forEach(function (stage, idx) {
    var done = !!logs[stage.id];
    var prevDone = idx === 0 || !!(logs[LIFECYCLE_STAGES[idx - 1].id]);
    var canStart = prevDone && !done;
    var timeStr = done ? new Date(logs[stage.id].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    var cls = done ? 'lsb-done' : (canStart ? 'lsb-ready' : 'lsb-locked');
    var title = done ? ('Completed at ' + timeStr) : (canStart ? 'Click to begin' : 'Complete previous stage first');
    html += '<button class="lifecycle-stage-btn ' + cls + '" data-stage="' + stage.id + '" onclick="' + (canStart ? 'openLifecycleModalByEl(this)' : '') + '" title="' + title + '">';
    html += '<div style="font-size:22px">' + stage.icon + '</div>';
    html += '<div style="font-size:11px;font-weight:800">' + stage.label + '</div>';
    if (done) html += '<div style="font-size:10px;color:#6ee7b7">&check; ' + timeStr + '</div>';
    if (!done && !canStart) html += '<div style="font-size:9px;opacity:.5">Locked</div>';
    html += '</button>';
  });
  container.innerHTML = html;
}
window.renderLifecycleStageButtons = renderLifecycleStageButtons;

function openLifecycleModalByEl(el) {
  openLifecycleModal(el.dataset.stage);
}
window.openLifecycleModalByEl = openLifecycleModalByEl;

function openLifecycleModal(stage) {
  lifecycleCurrentStage = stage;
  lifecycleModalTimestamp = new Date().toISOString();
  var stageObj = LIFECYCLE_STAGES.find(function (s) { return s.id === stage; });
  var modal = document.getElementById('lifecycle-modal');
  var overlay = document.getElementById('lifecycle-modal-overlay');
  if (!modal) return;
  modal.classList.add('open');
  overlay.classList.add('on');
  var el = function (id) { return document.getElementById(id); };
  if (el('lifecycle-modal-title')) el('lifecycle-modal-title').textContent = stageObj.icon + ' ' + stageObj.label + ' Checklist';
  if (el('lifecycle-modal-sub')) el('lifecycle-modal-sub').textContent = (lifecycleSelectedEvent ? lifecycleSelectedEvent.client : '') + ' · ' + new Date().toLocaleString();
  if (el('lifecycle-modal-timestamp')) el('lifecycle-modal-timestamp').textContent = new Date().toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  var liabSec = el('lifecycle-liability-section');
  var liabSel = el('lifecycle-liable-party');
  if (liabSec) liabSec.style.display = stage === 'execution' ? 'block' : 'none';
  if (liabSel) liabSel.value = 'none';
  renderLifecycleChecklistItems();
}
window.openLifecycleModal = openLifecycleModal;

function renderLifecycleChecklistItems() {
  var listEl = document.getElementById('lifecycle-modal-list');
  if (!listEl) return;
  if (!lifecycleEquipmentItems.length) {
    listEl.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-dim)">No equipment assigned.</div>';
    return;
  }
  var isExecution = lifecycleCurrentStage === 'execution';
  var html = '<table style="width:100%;border-collapse:collapse;font-size:12px">';
  html += '<thead><tr style="border-bottom:2px solid var(--border)">';
  html += '<th style="text-align:left;padding:8px 6px;color:var(--text-dim);font-size:10px;text-transform:uppercase;letter-spacing:.8px">Equipment</th>';
  html += '<th style="padding:8px 6px;color:var(--text-dim);font-size:10px;text-transform:uppercase;text-align:center">Total</th>';
  html += '<th style="padding:8px 6px;color:var(--text-dim);font-size:10px;text-transform:uppercase;text-align:center">Present</th>';
  html += '<th style="padding:8px 6px;color:var(--text-dim);font-size:10px;text-transform:uppercase;text-align:center">Missing</th>';
  html += '<th style="padding:8px 6px;color:var(--text-dim);font-size:10px;text-transform:uppercase;text-align:center">Condition</th>';
  if (isExecution) html += '<th style="padding:8px 6px;color:var(--red);font-size:10px;text-transform:uppercase;text-align:center">Liable Party</th>';
  html += '</tr></thead><tbody>';
  lifecycleEquipmentItems.forEach(function (it, idx) {
    html += '<tr style="border-bottom:1px solid var(--border)">';
    html += '<td style="padding:10px 6px"><div style="font-weight:600;color:var(--cream)">' + it.name + '</div>';
    html += '<div style="font-size:10px;color:var(--text-dim)">' + it.category + ' &middot; <span style="color:' + (it.source === 'rented' ? 'var(--amber)' : 'var(--gold)') + '">' + it.source + '</span></div></td>';
    html += '<td style="padding:10px 6px;text-align:center;font-weight:700;color:var(--cream)">' + it.qty + '</td>';
    html += '<td style="padding:10px 6px;text-align:center"><input type="number" class="lcl-present" data-idx="' + idx + '" data-total="' + it.qty + '" value="' + it.qty + '" min="0" max="' + it.qty + '" style="width:58px;background:var(--bg3);border:1px solid var(--border);color:var(--cream);border-radius:6px;padding:4px 6px;text-align:center;font-size:13px;font-weight:700" oninput="updateLifecycleMissingCell(' + idx + ')"></td>';
    html += '<td style="padding:10px 6px;text-align:center;font-weight:700" id="lcl-missing-' + idx + '"><span style="color:var(--green)">0</span></td>';
    html += '<td style="padding:10px 6px;text-align:center"><select class="lcl-condition" data-idx="' + idx + '" style="background:var(--bg3);border:1px solid var(--border);color:var(--cream);border-radius:6px;padding:4px 8px;font-size:11px"><option value="excellent">Excellent</option><option value="good">Good</option><option value="damaged">Damaged</option><option value="broken">Broken</option></select></td>';
    if (isExecution) {
      html += '<td style="padding:10px 6px;text-align:center"><select class="lcl-liable" data-idx="' + idx + '" style="background:var(--bg3);border:1px solid rgba(220,38,38,0.4);color:var(--cream);border-radius:6px;padding:4px 8px;font-size:11px"><option value="none">None</option><option value="staff">Staff</option><option value="customer">Customer</option></select></td>';
    }
    html += '</tr>';
  });
  html += '</tbody></table>';
  listEl.innerHTML = html;
  updateLifecycleSummary();
}

function updateLifecycleMissingCell(idx) {
  var inp = document.querySelector('.lcl-present[data-idx="' + idx + '"]');
  var el = document.getElementById('lcl-missing-' + idx);
  if (!inp || !el) return;
  var total = parseInt(inp.dataset.total) || 0;
  var present = Math.min(Math.max(parseInt(inp.value) || 0, 0), total);
  inp.value = present;
  var missing = total - present;
  el.innerHTML = missing > 0 ? '<span style="color:var(--red);font-weight:700">' + missing + '</span>' : '<span style="color:var(--green);font-weight:700">0</span>';
  updateLifecycleSummary();
}
window.updateLifecycleMissingCell = updateLifecycleMissingCell;

function updateLifecycleSummary() {
  var sumEl = document.getElementById('lifecycle-modal-summary');
  if (!sumEl) return;
  var totalPcs = 0, presentPcs = 0, missingPcs = 0, damaged = 0, broken = 0;
  document.querySelectorAll('.lcl-present').forEach(function (inp) {
    var t = parseInt(inp.dataset.total) || 0, p = parseInt(inp.value) || 0;
    totalPcs += t; presentPcs += Math.min(p, t); missingPcs += Math.max(0, t - p);
  });
  document.querySelectorAll('.lcl-condition').forEach(function (sel) {
    if (sel.value === 'damaged') damaged++;
    if (sel.value === 'broken') broken++;
  });
  sumEl.style.display = 'flex';
  var sh = '<div style="text-align:center"><div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px">Total Pcs</div><div style="font-size:18px;font-weight:800;color:var(--cream)">' + totalPcs + '</div></div>';
  sh += '<div style="text-align:center"><div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px">Present</div><div style="font-size:18px;font-weight:800;color:var(--green)">' + presentPcs + '</div></div>';
  sh += '<div style="text-align:center"><div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px">Missing</div><div style="font-size:18px;font-weight:800;color:' + (missingPcs > 0 ? 'var(--red)' : 'var(--green)') + '">' + missingPcs + '</div></div>';
  if (damaged) sh += '<div style="text-align:center"><div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px">Damaged</div><div style="font-size:18px;font-weight:800;color:var(--amber)">' + damaged + '</div></div>';
  if (broken) sh += '<div style="text-align:center"><div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px">Broken</div><div style="font-size:18px;font-weight:800;color:var(--red)">' + broken + '</div></div>';
  sumEl.innerHTML = sh;
}

async function finalizeLifecycleChecklist() {
  if (!lifecycleSelectedEvent || !lifecycleCurrentStage) return;
  var btn = document.getElementById('lifecycle-finalize-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Saving...'; }
  try {
    var presents = Array.from(document.querySelectorAll('.lcl-present'));
    var conditions = Array.from(document.querySelectorAll('.lcl-condition'));
    var totalPcs = 0, presentPcs = 0, missingPcs = 0, damaged = 0, broken = 0;
    var checklistData = lifecycleEquipmentItems.map(function (it, idx) {
      var present = Math.min(parseInt(presents[idx] ? presents[idx].value : 0) || 0, it.qty);
      var condition = conditions[idx] ? conditions[idx].value : 'excellent';
      var missing = it.qty - present;
      totalPcs += it.qty; presentPcs += present; missingPcs += missing;
      if (condition === 'damaged') damaged++;
      if (condition === 'broken') broken++;
      var liables = Array.from(document.querySelectorAll('.lcl-liable'));
      var liablePartyItem = (lifecycleCurrentStage === 'execution' && liables[idx]) ? liables[idx].value : 'none';
      return { assetId: it.assetId, name: it.name, category: it.category, source: it.source, totalQty: it.qty, presentQty: present, missingQty: missing, condition: condition, liableParty: liablePartyItem };
    });
    var liableParty = 'see-per-item';
    var record = {
      reservationId: lifecycleSelectedEvent.id,
      eventName: lifecycleSelectedEvent.client,
      eventDate: lifecycleSelectedEvent.date,
      stage: lifecycleCurrentStage,
      timestamp: lifecycleModalTimestamp,
      loggedAt: new Date().toISOString(),
      loggedBy: 'Admin',
      liableParty: liableParty,
      checklist: checklistData,
      summary: { totalPcs: totalPcs, presentPcs: presentPcs, missingPcs: missingPcs, damaged: damaged, broken: broken }
    };
    if (window.firebaseFns && window.firebaseDB) {
      var fns = window.firebaseFns;
      await fns.addDoc(fns.collection(window.firebaseDB, 'deploymentLogs'), record);
    }
    if (!lifecycleStageLogs[lifecycleSelectedEvent.id]) lifecycleStageLogs[lifecycleSelectedEvent.id] = {};
    lifecycleStageLogs[lifecycleSelectedEvent.id][lifecycleCurrentStage] = record;
    closeLifecycleModal();
    renderLifecycleStageButtons(lifecycleSelectedEvent.id);
    renderLifecycleLogs(lifecycleSelectedEvent.id);
    var stageObj = LIFECYCLE_STAGES.find(function (s) { return s.id === lifecycleCurrentStage; });
    var toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;background:var(--bg2);border:1px solid var(--green);color:var(--cream);padding:12px 20px;border-radius:12px;font-size:13px;font-weight:600;box-shadow:0 8px 32px rgba(0,0,0,.4)';
    toast.textContent = (stageObj ? stageObj.icon + ' ' + stageObj.label : 'Stage') + ' checklist saved — ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.body.appendChild(toast);
    setTimeout(function () { toast.remove(); }, 4000);
  } catch (e) {
    console.error('[Lifecycle] Save error:', e);
    alert('Failed to save checklist: ' + e.message);
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Finalize & Log'; }
  }
}
window.finalizeLifecycleChecklist = finalizeLifecycleChecklist;

function closeLifecycleModal() {
  var modal = document.getElementById('lifecycle-modal');
  var overlay = document.getElementById('lifecycle-modal-overlay');
  if (modal) modal.classList.remove('open');
  if (overlay) overlay.classList.remove('on');
}
window.closeLifecycleModal = closeLifecycleModal;

function renderLifecycleLogs(eventId) {
  var panel = document.getElementById('lifecycle-logs-panel');
  if (!panel) return;
  var logs = lifecycleStageLogs[eventId] || {};
  var completed = LIFECYCLE_STAGES.filter(function (s) { return !!logs[s.id]; });
  if (!completed.length) {
    panel.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-dim);font-size:12px">No stages completed yet.</div>';
    return;
  }
  var html = '';
  completed.forEach(function (stage) {
    var log = logs[stage.id];
    var ts = log.timestamp ? new Date(log.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '';
    var sum = log.summary || {};
    html += '<div style="margin-bottom:16px;border:1px solid var(--border);border-radius:12px;overflow:hidden">';
    // Stage header
    html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:var(--bg3);cursor:pointer" onclick="toggleLifecycleLog(this)">';
    html += '<div style="display:flex;align-items:center;gap:10px">';
    html += '<span style="font-size:18px">' + stage.icon + '</span>';
    html += '<div><div style="font-size:13px;font-weight:700;color:var(--cream)">' + stage.label + '</div>';
    html += '<div style="font-size:11px;color:var(--text-dim)">' + ts + ' &middot; Logged by ' + (log.loggedBy || 'Admin') + '</div></div></div>';
    // Summary chips
    html += '<div style="display:flex;gap:10px;align-items:center">';
    html += '<span style="font-size:11px;color:var(--green);font-weight:700">' + (sum.presentPcs || 0) + ' present</span>';
    if (sum.missingPcs) html += '<span style="font-size:11px;color:var(--red);font-weight:700">' + sum.missingPcs + ' missing</span>';
    if (sum.damaged) html += '<span style="font-size:11px;color:var(--amber);font-weight:700">' + sum.damaged + ' damaged</span>';
    if (sum.broken) html += '<span style="font-size:11px;color:var(--red);font-weight:700">' + sum.broken + ' broken</span>';
    html += '<span style="font-size:11px;color:var(--text-dim)">&#9660;</span>';
    html += '</div></div>';
    // Checklist detail (collapsed by default)
    html += '<div class="lifecycle-log-detail" style="display:none;padding:12px 16px">';
    if (log.checklist && log.checklist.length) {
      html += '<table style="width:100%;border-collapse:collapse;font-size:11px">';
      html += '<thead><tr style="border-bottom:1px solid var(--border)">';
      html += '<th style="text-align:left;padding:6px 4px;color:var(--text-dim)">Equipment</th>';
      html += '<th style="text-align:center;padding:6px 4px;color:var(--text-dim)">Total</th>';
      html += '<th style="text-align:center;padding:6px 4px;color:var(--text-dim)">Present</th>';
      html += '<th style="text-align:center;padding:6px 4px;color:var(--text-dim)">Missing</th>';
      html += '<th style="text-align:center;padding:6px 4px;color:var(--text-dim)">Condition</th>';
      var hasLiable = log.checklist.some(function (it) { return it.liableParty && it.liableParty !== 'none'; });
      if (hasLiable) html += '<th style="text-align:center;padding:6px 4px;color:var(--red)">Liable</th>';
      html += '</tr></thead><tbody>';
      log.checklist.forEach(function (it) {
        var condColor = it.condition === 'excellent' ? 'var(--green)' : it.condition === 'good' ? 'var(--text-mid)' : it.condition === 'damaged' ? 'var(--amber)' : 'var(--red)';
        html += '<tr style="border-bottom:1px solid var(--border)">';
        html += '<td style="padding:6px 4px"><div style="font-weight:600;color:var(--cream)">' + it.name + '</div><div style="font-size:10px;color:var(--text-dim)">' + (it.source || '') + '</div></td>';
        html += '<td style="text-align:center;padding:6px 4px;color:var(--cream)">' + (it.totalQty || 0) + '</td>';
        html += '<td style="text-align:center;padding:6px 4px;color:var(--green);font-weight:700">' + (it.presentQty || 0) + '</td>';
        html += '<td style="text-align:center;padding:6px 4px;color:' + (it.missingQty ? 'var(--red)' : 'var(--green)') + ';font-weight:700">' + (it.missingQty || 0) + '</td>';
        html += '<td style="text-align:center;padding:6px 4px;color:' + condColor + ';font-weight:600;text-transform:capitalize">' + (it.condition || '') + '</td>';
        if (hasLiable) {
          var liableLabel = (!it.liableParty || it.liableParty === 'none') ? '<span style="color:var(--text-dim)">—</span>' : '<span style="color:var(--red);font-weight:700;text-transform:capitalize">' + it.liableParty + '</span>';
          html += '<td style="text-align:center;padding:6px 4px">' + liableLabel + '</td>';
        }
        html += '</tr>';
      });
      html += '</tbody></table>';
    } else {
      html += '<div style="color:var(--text-dim);font-size:12px">No checklist data.</div>';
    }
    html += '</div></div>';
  });
  panel.innerHTML = html;
}
window.renderLifecycleLogs = renderLifecycleLogs;

function toggleLifecycleLog(headerEl) {
  var detail = headerEl.nextElementSibling;
  var arrow = headerEl.querySelector('span:last-child');
  if (!detail) return;
  var isOpen = detail.style.display !== 'none';
  detail.style.display = isOpen ? 'none' : 'block';
  if (arrow) arrow.textContent = isOpen ? '\u25BC' : '\u25B2';
}
window.toggleLifecycleLog = toggleLifecycleLog;


// ====================================================================
// EIM 7: EQUIPMENT ISSUES HANDLING
// Source: deploymentLogs collection (lifecycle checklists)
// Resolution: issueResolutions collection
// ====================================================================

var issueSelectedEvent = null;
var allDeploymentLogs = {};    // { [reservationId]: { [stage]: logDoc } }
var issueResolutionLogs = {};    // { [reservationId]: [resolutionDocs] }

var ISSUE_STAGE_ORDER = ['departure', 'deployment', 'execution', 'bashout', 'restorage'];
var ISSUE_STAGE_LABELS = { departure: 'Departure', deployment: 'Deployment', execution: 'Execution', bashout: 'Bash-Out', restorage: 'Restorage' };
var ISSUE_STAGE_ICONS = { departure: '&#128667;', deployment: '&#128230;', execution: '&#127919;', bashout: '&#128228;', restorage: '&#127981;' };
var ISSUE_STAGE_WHEN = {
  departure: 'during travel to venue',
  deployment: 'during venue setup',
  execution: 'during the event',
  bashout: 'during equipment gathering (bash-out)',
  restorage: 'during return to storage'
};

// ── Entry point ───────────────────────────────────────────────────────
function renderEquipIssuesSection() {
  var listEl = document.getElementById('issues-event-list');
  var cntEl = document.getElementById('issues-event-count');
  if (listEl) listEl.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-dim);font-size:12px;">Loading logs...</div>';
  if (cntEl) cntEl.textContent = 'Loading...';
  loadAllDeploymentLogs().then(function () { renderIssueEventList(); });
}
window.renderEquipIssuesSection = renderEquipIssuesSection;

// ── Load all logs from Firestore ───────────────────────────────────────
async function loadAllDeploymentLogs() {
  allDeploymentLogs = {};
  issueResolutionLogs = {};

  // Also pull from local lifecycle cache (for offline/just-logged items)
  Object.keys(lifecycleStageLogs).forEach(function (rid) {
    if (!allDeploymentLogs[rid]) allDeploymentLogs[rid] = {};
    Object.assign(allDeploymentLogs[rid], lifecycleStageLogs[rid]);
  });

  if (!window.firebaseFns || !window.firebaseDB) return;
  try {
    var fns = window.firebaseFns;
    var snap = await fns.getDocs(fns.collection(window.firebaseDB, 'deploymentLogs'));
    snap.forEach(function (docSnap) {
      var d = docSnap.data();
      if (!allDeploymentLogs[d.reservationId]) allDeploymentLogs[d.reservationId] = {};
      allDeploymentLogs[d.reservationId][d.stage] = Object.assign({}, d, { _docId: docSnap.id });
    });
    var rSnap = await fns.getDocs(fns.collection(window.firebaseDB, 'issueResolutions'));
    rSnap.forEach(function (docSnap) {
      var d = docSnap.data();
      if (!issueResolutionLogs[d.reservationId]) issueResolutionLogs[d.reservationId] = [];
      issueResolutionLogs[d.reservationId].push(Object.assign({}, d, { _docId: docSnap.id }));
    });
  } catch (e) { console.warn('[Issues] Load:', e.message); }
}

// ── Get all flagged items for an event ────────────────────────────────
function getEventFlags(reservationId) {
  var logs = allDeploymentLogs[reservationId] || {};
  var flags = [];
  ISSUE_STAGE_ORDER.forEach(function (stage) {
    var log = logs[stage];
    if (!log || !log.checklist) return;
    log.checklist.forEach(function (item) {
      var hasMissing = item.missingQty > 0;
      var hasDamage = item.condition === 'damaged' || item.condition === 'broken';
      if (!hasMissing && !hasDamage) return;
      var flagType = hasMissing ? 'missing' : item.condition;
      var flagObj = {};
      Object.assign(flagObj, item, {
        stage: stage,
        stageLabel: ISSUE_STAGE_LABELS[stage],
        stageIcon: ISSUE_STAGE_ICONS[stage],
        stageWhen: ISSUE_STAGE_WHEN[stage],
        timestamp: log.timestamp,
        loggedAt: log.loggedAt,
        reservationId: reservationId,
        eventName: log.eventName,
        eventDate: log.eventDate,
        flagType: flagType,
        flagKey: stage + '_' + (item.assetId || item.name)
      });
      flags.push(flagObj);
    });
  });
  return flags;
}

// ── Render event list ─────────────────────────────────────────────────
function renderIssueEventList() {
  var listEl = document.getElementById('issues-event-list');
  var cntEl = document.getElementById('issues-event-count');
  if (!listEl) return;

  var reservationIds = Object.keys(allDeploymentLogs);
  if (!reservationIds.length) {
    listEl.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text-dim);font-size:12px;">No lifecycle logs found. Complete stages in Equipment Lifecycle first.</div>';
    if (cntEl) cntEl.textContent = '0 events tracked';
    return;
  }

  var eventData = reservationIds.map(function (rid) {
    var logs = allDeploymentLogs[rid];
    var firstLog = Object.values(logs)[0] || {};
    var flags = getEventFlags(rid);
    var resolutions = issueResolutionLogs[rid] || [];
    var resolvedKeys = resolutions.map(function (r) { return r.flagKey; });
    var openFlags = flags.filter(function (f) { return resolvedKeys.indexOf(f.flagKey) === -1; });
    return { rid: rid, eventName: firstLog.eventName || rid, eventDate: firstLog.eventDate || '', flags: flags, openFlags: openFlags, resolutions: resolutions };
  }).sort(function (a, b) { return b.openFlags.length - a.openFlags.length; });

  var flaggedCount = eventData.filter(function (e) { return e.openFlags.length > 0; }).length;
  if (cntEl) cntEl.textContent = flaggedCount + ' event' + (flaggedCount !== 1 ? 's' : '') + ' with open flags &middot; ' + reservationIds.length + ' total logged';

  var html = '';
  eventData.forEach(function (ev) {
    var hasFlagged = ev.openFlags.length > 0;
    var isSelected = issueSelectedEvent === ev.rid;
    var missingCnt = ev.openFlags.filter(function (f) { return f.flagType === 'missing'; }).length;
    var damagedCnt = ev.openFlags.filter(function (f) { return f.flagType === 'damaged'; }).length;
    var brokenCnt = ev.openFlags.filter(function (f) { return f.flagType === 'broken'; }).length;
    var resCnt = ev.resolutions.length;
    html += '<div class="issue-event-card' + (hasFlagged ? ' iec-flagged' : '') + (isSelected ? ' iec-active' : '') + '" data-rid="' + ev.rid + '" onclick="selectIssueEventByEl(this)">';
    html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:5px">';
    html += '<div style="font-size:14px;font-weight:700;color:var(--cream)">' + ev.eventName + '</div>';
    if (hasFlagged) html += '<span class="issue-flag-badge">' + ev.openFlags.length + ' open</span>';
    html += '</div>';
    html += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px">' + (ev.eventDate || 'Date TBD') + '</div>';
    html += '<div style="display:flex;gap:8px;flex-wrap:wrap">';
    if (missingCnt) html += '<span style="font-size:10px;color:var(--red);font-weight:700">&#10007; ' + missingCnt + ' missing</span>';
    if (damagedCnt) html += '<span style="font-size:10px;color:var(--amber);font-weight:700">&#9888; ' + damagedCnt + ' damaged</span>';
    if (brokenCnt) html += '<span style="font-size:10px;color:var(--red);font-weight:700">&#9746; ' + brokenCnt + ' broken</span>';
    if (resCnt) html += '<span style="font-size:10px;color:var(--green);font-weight:700">&#10003; ' + resCnt + ' resolved</span>';
    if (!hasFlagged && !resCnt) html += '<span style="font-size:10px;color:var(--green)">&#10003; No issues</span>';
    html += '</div></div>';
  });
  listEl.innerHTML = html;
}

function selectIssueEventByEl(el) { selectIssueEvent(el.dataset.rid); }
window.selectIssueEventByEl = selectIssueEventByEl;

function selectIssueEvent(reservationId) {
  issueSelectedEvent = reservationId;
  document.querySelectorAll('.issue-event-card').forEach(function (c) { c.classList.remove('iec-active'); });
  var card = document.querySelector('.issue-event-card[data-rid="' + reservationId + '"]');
  if (card) card.classList.add('iec-active');
  var detail = document.getElementById('issues-detail-panel');
  var noEv = document.getElementById('issues-no-event');
  if (detail) detail.style.display = 'block';
  if (noEv) noEv.style.display = 'none';
  renderIssueDetail(reservationId);
}
window.selectIssueEvent = selectIssueEvent;

// ── Render the full issue detail view ─────────────────────────────────
function renderIssueDetail(reservationId) {
  var logs = allDeploymentLogs[reservationId] || {};
  var firstLog = Object.values(logs)[0] || {};
  var flags = getEventFlags(reservationId);
  var resolutions = issueResolutionLogs[reservationId] || [];
  var resolvedKeys = resolutions.map(function (r) { return r.flagKey; });
  var openFlags = flags.filter(function (f) { return resolvedKeys.indexOf(f.flagKey) === -1; });
  var stagesDone = Object.keys(logs).length;

  // Event header
  var hdrEl = document.getElementById('issues-event-header');
  if (hdrEl) {
    var statusColor = openFlags.length ? 'var(--red)' : 'var(--green)';
    var statusBg = openFlags.length ? 'rgba(220,38,38,0.1)' : 'rgba(45,138,78,0.1)';
    var statusBorder = openFlags.length ? 'rgba(220,38,38,0.3)' : 'rgba(45,138,78,0.3)';
    var statusLabel = openFlags.length ? openFlags.length + ' OPEN ISSUE' + (openFlags.length > 1 ? 'S' : '') : 'ALL CLEAR';
    hdrEl.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">' +
      '<div><div style="font-size:19px;font-weight:800;color:var(--cream)">' + (firstLog.eventName || reservationId) + '</div>' +
      '<div style="font-size:12px;color:var(--text-dim);margin-top:3px">' + (firstLog.eventDate || '') +
      ' &middot; ' + stagesDone + ' stage' + (stagesDone !== 1 ? 's' : '') + ' logged' +
      ' &middot; ' + flags.length + ' total flag' + (flags.length !== 1 ? 's' : '') +
      ' &middot; ' + resolutions.length + ' resolved</div></div>' +
      '<span style="font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;background:' + statusBg + ';color:' + statusColor + ';border:1px solid ' + statusBorder + '">' + statusLabel + '</span></div>';
  }

  renderDamageAssessment(reservationId, flags, logs);
  renderLiabilityPanel(reservationId, flags);
  renderResolutionLog(reservationId, resolutions, flags);
}

// ── Damage Assessment by stage ────────────────────────────────────────
function renderDamageAssessment(reservationId, flags, logs) {
  var el = document.getElementById('issues-assessment');
  if (!el) return;
  if (!flags.length) {
    el.innerHTML = '<div style="text-align:center;padding:24px;color:var(--green);font-size:13px;font-weight:600">&#10003; No equipment issues found across all logged stages</div>';
    return;
  }
  var html = '';
  ISSUE_STAGE_ORDER.forEach(function (stage) {
    var log = logs[stage];
    if (!log) return;
    var stageFlags = flags.filter(function (f) { return f.stage === stage; });
    var ts = log.timestamp ? new Date(log.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
    html += '<div style="margin-bottom:18px">';
    html += '<div style="display:flex;align-items:center;gap:8px;padding:10px 12px;background:var(--bg3);border-radius:10px 10px 0 0;border:1px solid var(--border);border-bottom:none">';
    html += '<span style="font-size:16px">' + ISSUE_STAGE_ICONS[stage] + '</span>';
    html += '<div style="flex:1"><div style="font-size:13px;font-weight:700;color:var(--cream)">' + ISSUE_STAGE_LABELS[stage] + '</div>';
    html += '<div style="font-size:11px;color:var(--text-dim)">' + ts + (ts ? ' &middot; ' : '') + ISSUE_STAGE_WHEN[stage] + '</div></div>';
    if (!stageFlags.length) {
      html += '<span style="font-size:11px;color:var(--green);font-weight:600">&#10003; Clear</span>';
    } else {
      html += '<span style="font-size:11px;color:var(--red);font-weight:700">' + stageFlags.length + ' flag' + (stageFlags.length !== 1 ? 's' : '') + '</span>';
    }
    html += '</div>';
    html += '<div style="border:1px solid var(--border);border-top:none;border-radius:0 0 10px 10px;overflow:hidden">';
    if (!stageFlags.length) {
      html += '<div style="padding:12px 16px;font-size:12px;color:var(--text-dim)">No issues during this stage.</div>';
    } else {
      stageFlags.forEach(function (flag) {
        var flagColor = flag.flagType === 'missing' ? '#dc2626' : flag.flagType === 'broken' ? '#dc2626' : '#d97706';
        var flagBg = flag.flagType === 'damaged' ? 'rgba(217,119,6,0.05)' : 'rgba(220,38,38,0.05)';
        var flagIcon = flag.flagType === 'missing' ? '&#10007;' : flag.flagType === 'broken' ? '&#9746;' : '&#9888;';
        var flagLabel = flag.flagType === 'missing' ? 'MISSING' : flag.flagType.toUpperCase();
        var liableColor = flag.liableParty === 'staff' ? 'var(--amber)' : flag.liableParty === 'customer' ? 'var(--red)' : 'var(--text-dim)';
        var liableLabel = (flag.liableParty && flag.liableParty !== 'none') ? flag.liableParty.toUpperCase() : 'UNASSIGNED';
        var ackTime = flag.loggedAt ? new Date(flag.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—';
        var condColor = flag.condition === 'broken' ? 'var(--red)' : flag.condition === 'damaged' ? 'var(--amber)' : 'var(--text-mid)';
        html += '<div style="display:grid;grid-template-columns:1fr 90px 90px 100px;gap:8px;align-items:center;padding:12px 16px;border-bottom:1px solid var(--border);background:' + flagBg + ';border-left:3px solid ' + flagColor + '">';
        html += '<div>';
        html += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">';
        html += '<span style="font-size:13px">' + flagIcon + '</span>';
        html += '<span style="font-size:13px;font-weight:700;color:var(--cream)">' + flag.name + '</span>';
        html += '<span style="font-size:10px;font-weight:800;color:' + flagColor + ';background:rgba(0,0,0,0.15);padding:2px 7px;border-radius:4px">' + flagLabel + '</span>';
        html += '</div>';
        html += '<div style="font-size:11px;color:var(--text-dim)">';
        html += flag.category + ' &middot; ' + flag.source;
        if (flag.flagType === 'missing') html += ' &middot; <strong style="color:var(--red)">' + flag.missingQty + ' of ' + flag.totalQty + ' pcs missing</strong>';
        html += ' &middot; Acknowledged: <strong style="color:var(--cream)">' + ackTime + '</strong>';
        html += '</div></div>';
        html += '<div style="text-align:center"><div style="font-size:9px;color:var(--text-dim);text-transform:uppercase;letter-spacing:.8px;margin-bottom:3px">Condition</div>';
        html += '<div style="font-size:12px;font-weight:700;text-transform:capitalize;color:' + condColor + '">' + (flag.condition || '—') + '</div></div>';
        html += '<div style="text-align:center"><div style="font-size:9px;color:var(--text-dim);text-transform:uppercase;letter-spacing:.8px;margin-bottom:3px">Liable</div>';
        html += '<div style="font-size:12px;font-weight:800;color:' + liableColor + '">' + liableLabel + '</div></div>';
        html += '<div style="text-align:center"><div style="font-size:9px;color:var(--text-dim);text-transform:uppercase;letter-spacing:.8px;margin-bottom:3px">Impact</div>';
        html += '<div style="font-size:11px;font-weight:600;color:' + (flag.liableParty === 'staff' ? 'var(--amber)' : flag.liableParty === 'customer' ? 'var(--red)' : 'var(--text-dim)') + '">' +
          (flag.liableParty === 'staff' ? 'Salary Deduct' : flag.liableParty === 'customer' ? 'Add to Bill' : 'TBD') + '</div></div>';
        html += '</div>';
      });
    }
    html += '</div></div>';
  });
  el.innerHTML = html;
}

// ── Liability & Financial Impact ──────────────────────────────────────
function renderLiabilityPanel(reservationId, flags) {
  var el = document.getElementById('issues-liability');
  if (!el) return;
  if (!flags.length) {
    el.innerHTML = '<div style="color:var(--text-dim);font-size:12px;text-align:center;padding:16px">No flagged items &mdash; no liability to assess.</div>';
    return;
  }
  var staffFlags = flags.filter(function (f) { return f.liableParty === 'staff'; });
  var customerFlags = flags.filter(function (f) { return f.liableParty === 'customer'; });
  var unknownFlags = flags.filter(function (f) { return !f.liableParty || f.liableParty === 'none'; });
  var html = '';

  function flagRows(list, borderColor) {
    var s = '';
    list.forEach(function (f) {
      s += '<div style="display:flex;align-items:center;justify-content:space-between;padding:9px 0;border-bottom:1px solid ' + borderColor + '30">';
      s += '<div>';
      s += '<div style="font-size:13px;font-weight:600;color:var(--cream)">' + f.name + '</div>';
      s += '<div style="font-size:11px;color:var(--text-dim)">' + f.stageIcon + ' ' + f.stageLabel + ' &middot; ';
      if (f.flagType === 'missing') s += f.missingQty + ' of ' + f.totalQty + ' pcs missing';
      else s += f.flagType + ' (' + f.condition + ')';
      s += '</div></div>';
      s += '<div style="text-align:right">';
      s += '<div style="font-size:11px;font-weight:700;color:' + borderColor + '">';
      if (f.liableParty === 'staff') s += 'Salary Deduction';
      if (f.liableParty === 'customer') s += 'Added to Final Bill';
      s += '</div><div style="font-size:10px;color:var(--text-dim);margin-top:2px">Amount: <em>Formula TBD</em></div></div>';
      s += '</div>';
    });
    return s;
  }

  if (staffFlags.length) {
    html += '<div style="margin-bottom:16px;padding:16px;background:rgba(217,119,6,0.06);border:1px solid rgba(217,119,6,0.2);border-radius:12px">';
    html += '<div style="font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:var(--amber);margin-bottom:10px">&#128100; Staff Liability &mdash; ' + staffFlags.length + ' item' + (staffFlags.length !== 1 ? 's' : '') + '</div>';
    html += flagRows(staffFlags, '#d97706');
    html += '<div style="margin-top:12px;padding:10px 12px;background:rgba(0,0,0,0.15);border-radius:8px;font-size:11px;color:var(--text-dim)">';
    html += '&#9432; Deductions will be calculated against the staff salary for the day of deployment per their agreed contract. Admin can review and adjust before processing.';
    html += '</div></div>';
  }

  if (customerFlags.length) {
    html += '<div style="margin-bottom:16px;padding:16px;background:rgba(220,38,38,0.06);border:1px solid rgba(220,38,38,0.2);border-radius:12px">';
    html += '<div style="font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:var(--red);margin-bottom:10px">&#128101; Customer Liability &mdash; ' + customerFlags.length + ' item' + (customerFlags.length !== 1 ? 's' : '') + '</div>';
    html += flagRows(customerFlags, '#dc2626');
    html += '<div style="margin-top:12px;padding:10px 12px;background:rgba(0,0,0,0.15);border-radius:8px;font-size:11px;color:var(--text-dim)">';
    html += '&#9432; Additional costs will be calculated per the customer contract. The admin can adjust the amount on the final receipt directly.';
    html += '</div></div>';
  }

  if (unknownFlags.length) {
    html += '<div style="padding:14px 16px;background:var(--bg3);border:1px solid var(--border);border-radius:12px">';
    html += '<div style="font-size:11px;font-weight:700;color:var(--text-mid);margin-bottom:8px">Unassigned Liability &mdash; ' + unknownFlags.length + ' item' + (unknownFlags.length !== 1 ? 's' : '') + '</div>';
    unknownFlags.forEach(function (f) {
      html += '<div style="padding:4px 0;font-size:12px;color:var(--text-dim)">' + f.stageIcon + ' <strong style="color:var(--cream)">' + f.name + '</strong> &mdash; ';
      html += (f.flagType === 'missing' ? f.missingQty + ' pcs missing' : f.flagType) + '</div>';
    });
    html += '<div style="margin-top:10px;font-size:11px;color:var(--text-dim);font-style:italic">No liable party was recorded in the execution checklist for these items.</div>';
    html += '</div>';
  }
  el.innerHTML = html;
}

// ── Resolution tracking ───────────────────────────────────────────────
function renderResolutionLog(reservationId, resolutions, flags) {
  var el = document.getElementById('issues-resolution-log');
  if (!el) return;
  var resolvedKeys = resolutions.map(function (r) { return r.flagKey; });
  var openFlags = flags.filter(function (f) { return resolvedKeys.indexOf(f.flagKey) === -1; });
  var html = '';

  if (openFlags.length) {
    html += '<div style="margin-bottom:20px">';
    html += '<div style="font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:var(--text-dim);margin-bottom:10px">Open Issues (' + openFlags.length + ')</div>';
    openFlags.forEach(function (flag) {
      var flagLabel = flag.flagType === 'missing' ? flag.missingQty + ' pcs missing' : flag.flagType + ' (' + flag.condition + ')';
      html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px;margin-bottom:8px;background:var(--bg3);border:1px solid var(--border);border-radius:10px;gap:12px;flex-wrap:wrap">';
      html += '<div style="flex:1;min-width:180px">';
      html += '<div style="font-size:13px;font-weight:600;color:var(--cream)">' + flag.name + '</div>';
      html += '<div style="font-size:11px;color:var(--text-dim);margin-top:2px">' + flag.stageIcon + ' ' + flag.stageLabel + ' &middot; ' + flagLabel + '</div>';
      html += '</div>';
      html += '<div style="display:flex;gap:6px;flex-wrap:wrap">';
      html += '<button class="btn-outline" style="padding:5px 10px;font-size:11px" data-rid="' + reservationId + '" data-fk="' + flag.flagKey + '" data-nt="staff_negligence" data-fn="' + flag.name + '" onclick="resolveIssueByEl(this)">Staff Negligence</button>';
      html += '<button class="btn-reject" style="padding:5px 10px;font-size:11px" data-rid="' + reservationId + '" data-fk="' + flag.flagKey + '" data-nt="customer_negligence" data-fn="' + flag.name + '" onclick="resolveIssueByEl(this)">Customer Negligence</button>';
      html += '<button class="btn-primary" style="padding:5px 12px;font-size:11px" data-rid="' + reservationId + '" data-fk="' + flag.flagKey + '" data-nt="resolved" data-fn="' + flag.name + '" onclick="resolveIssueByEl(this)">Mark Resolved</button>';
      html += '</div></div>';
    });
    html += '</div>';
  }

  if (resolutions.length) {
    html += '<div>';
    html += '<div style="font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:var(--text-dim);margin-bottom:10px">Resolution History (' + resolutions.length + ')</div>';
    resolutions.slice().reverse().forEach(function (r) {
      var typeColor = r.negligenceType === 'staff_negligence' ? 'var(--amber)' : r.negligenceType === 'customer_negligence' ? 'var(--red)' : 'var(--green)';
      var typeLabel = r.negligenceType === 'staff_negligence' ? 'Staff Negligence' : r.negligenceType === 'customer_negligence' ? 'Customer Negligence' : 'Resolved';
      var ts = r.resolvedAt ? new Date(r.resolvedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
      html += '<div style="padding:10px 14px;margin-bottom:8px;background:var(--bg3);border:1px solid var(--border);border-radius:10px;display:flex;align-items:center;justify-content:space-between;gap:10px">';
      html += '<div><div style="font-size:13px;font-weight:600;color:var(--cream)">' + (r.flagName || r.flagKey || 'Issue') + '</div>';
      html += '<div style="font-size:11px;color:var(--text-dim)">' + ts + ' &middot; ' + (r.resolvedBy || 'Admin') + (r.note ? ' &middot; ' + r.note : '') + '</div></div>';
      html += '<div style="text-align:right">';
      html += '<span style="font-size:11px;font-weight:700;color:' + typeColor + ';background:rgba(0,0,0,0.2);padding:3px 10px;border-radius:20px">' + typeLabel + '</span>';
      if (r.negligenceType === 'staff_negligence') html += '<div style="font-size:10px;color:var(--text-dim);margin-top:4px">Salary deduction per staff contract</div>';
      if (r.negligenceType === 'customer_negligence') html += '<div style="font-size:10px;color:var(--text-dim);margin-top:4px">Added to customer final payment</div>';
      html += '</div></div>';
    });
    html += '</div>';
  }

  if (!openFlags.length && !resolutions.length) {
    html = '<div style="text-align:center;padding:20px;color:var(--text-dim);font-size:12px">No open issues to resolve.</div>';
  }
  el.innerHTML = html;
}

function resolveIssueByEl(btn) {
  var rid = btn.dataset.rid;
  var fk = btn.dataset.fk;
  var nt = btn.dataset.nt;
  var fn = btn.dataset.fn;
  resolveIssue(rid, fk, nt, fn);
}
window.resolveIssueByEl = resolveIssueByEl;

async function resolveIssue(reservationId, flagKey, negligenceType, flagName) {
  var record = {
    reservationId: reservationId,
    flagKey: flagKey,
    flagName: flagName || flagKey,
    negligenceType: negligenceType,
    resolved: true,
    resolvedAt: new Date().toISOString(),
    resolvedBy: 'Admin',
    note: ''
  };
  try {
    if (window.firebaseFns && window.firebaseDB) {
      var fns = window.firebaseFns;
      await fns.addDoc(fns.collection(window.firebaseDB, 'issueResolutions'), record);
    }
    if (!issueResolutionLogs[reservationId]) issueResolutionLogs[reservationId] = [];
    issueResolutionLogs[reservationId].push(record);
    var flags2 = getEventFlags(reservationId);
    var res2 = issueResolutionLogs[reservationId];
    renderResolutionLog(reservationId, res2, flags2);
    renderIssueEventList();
    var typeLabel = negligenceType === 'staff_negligence' ? 'Staff Negligence' : negligenceType === 'customer_negligence' ? 'Customer Negligence' : 'Resolved';
    var toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;background:var(--bg2);border:1px solid var(--green);color:var(--cream);padding:12px 20px;border-radius:12px;font-size:13px;font-weight:600;box-shadow:0 8px 32px rgba(0,0,0,.4)';
    toast.textContent = String.fromCodePoint(0x2713) + ' Issue logged as ' + typeLabel;
    document.body.appendChild(toast);
    setTimeout(function () { toast.remove(); }, 3500);
  } catch (e) {
    alert('Failed to log resolution: ' + e.message);
  }
}
window.resolveIssue = resolveIssue;

/* ============================================================
   EQUIPMENT RESUPPLY MODULE (EIM 8)
   Functions: renderResupplySection, switchResupplyTab,
   refreshResupplyNeeds, renderPurchaseOrders, renderShoppingLists,
   renderRentalDamageTab, generatePurchaseOrder, generateShoppingList,
   markSlItemBought, logSlArrival, logPoStep, confirmAllArrived,
   redirectToAddEquipment
   Data stored in window.resupplyData = { purchaseOrders, shoppingLists }
============================================================ */

/* ── In-memory store ──────────────────────────────────────── */
window.resupplyData = window.resupplyData || {
  purchaseOrders: [],   // { id, supplierName, supplierEmail, items:[{name,qty,unit,ip,assetId,issueStatus,sourceLogId}], status:'draft'|'sent'|'paid'|'received', timeSent, timePaid, timeReceived, sourceEvent, createdAt }
  shoppingLists: [],    // { id, items:[{name,qty,unit,ip,assetId,issueStatus,sourceLogId,bought,boughtAt,location,arrived,arrivedAt}], createdAt, timeShoppingStarted, allArrived, allArrivedAt, sourceEvent }
  rentalPayments: {}    // { [rentalDamageKey]: { paid, paidAt, amount, sortedOut, sortedAt } }
};

// Placeholder data for Flowchart verification (Branch I & II)
window.lifecycleLogs = window.lifecycleLogs || {
  "res_mock_1": [
    {
      stage: 'bashout',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      eventName: "Sample Wedding Bash",
      items: [
        { name: "White Tablecloth", assetId: "EQ-L001", qty: 2, status: "broken", isRented: false, supplier: "LiXia Textile Supply", initialPrice: 320 },
        { name: "Water Goblet", assetId: "EQ-G001", qty: 5, status: "missing", isRented: false, supplier: "", initialPrice: 95 }, // No supplier -> Shopping List
        { name: "Crystal Chandelier", assetId: "RNT-CHAND-1", qty: 1, status: "broken", isRented: true, rentalSupplier: "Lumina", initialPrice: 1500 }
      ]
    }
  ]
};

function seedResupplyPlaceholderData() {
  var d = window.resupplyData;
  if (!d.purchaseOrders.length) {
    d.purchaseOrders = [
      {
        id: 'PO-SAMPLE-001',
        supplierName: 'LiXia Textile Supply',
        supplierEmail: 'orders@lixia-demo.com',
        items: [
          { name: 'White Tablecloth', qty: 8, unit: 'pcs', ip: 320, assetId: 'EQ-L001', issueStatus: 'broken', sourceLogId: 'res_mock_1_0_0' },
          { name: 'Chair Cover', qty: 20, unit: 'pcs', ip: 65, assetId: 'EQ-C004', issueStatus: 'missing', sourceLogId: 'mock_po_1' }
        ],
        status: 'sent',
        timeSent: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        timePaid: null,
        timeReceived: null,
        sourceEvent: 'Sample Wedding Bash',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
      },
      {
        id: 'PO-SAMPLE-002',
        supplierName: 'Grand Banquet Fixtures',
        supplierEmail: 'ap@grandfixtures-demo.com',
        items: [
          { name: 'Foldable Cocktail Table', qty: 2, unit: 'pcs', ip: 2450, assetId: 'EQ-T011', issueStatus: 'broken', sourceLogId: 'mock_po_2' }
        ],
        status: 'received',
        timeSent: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
        timePaid: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        timeReceived: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        sourceEvent: 'Corporate Dinner Mock Event',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString()
      }
    ];
  }

  if (!d.shoppingLists.length) {
    d.shoppingLists = [
      {
        id: 'SL-SAMPLE-001',
        items: [
          { name: 'Water Goblet', qty: 12, unit: 'pcs', ip: 95, assetId: 'EQ-G001', issueStatus: 'missing', sourceLogId: 'res_mock_1_0_1', bought: true, boughtAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), location: 'Dapitan Arcade', arrived: false, arrivedAt: null },
          { name: 'Tealight Candle Holder', qty: 18, unit: 'pcs', ip: 40, assetId: 'EQ-D014', issueStatus: 'broken', sourceLogId: 'mock_sl_1', bought: false, boughtAt: null, location: '', arrived: false, arrivedAt: null }
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
        timeShoppingStarted: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        allArrived: false,
        allArrivedAt: null,
        sourceEvent: 'Sample Wedding Bash'
      }
    ];
  }

  if (!Object.keys(d.rentalPayments || {}).length) {
    d.rentalPayments = {
      'res_mock_1_0_2': {
        paid: true,
        paidAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        amount: 1500,
        sortedOut: false,
        sortedAt: null
      }
    };
  }
}
seedResupplyPlaceholderData();


/* ── Entry point ──────────────────────────────────────────── */
function renderResupplySection() {
  refreshResupplyStats();
  refreshResupplyNeeds();
  renderPurchaseOrders();
  renderShoppingLists();
  renderRentalDamageTab();
}
window.renderResupplySection = renderResupplySection;

/* ── Tab switcher ─────────────────────────────────────────── */
function switchResupplyTab(tab, btn) {
  document.querySelectorAll('.resupply-tab').forEach(function (t) { t.classList.remove('active'); });
  btn.classList.add('active');
  document.getElementById('resupply-pane-owned').style.display = (tab === 'owned') ? '' : 'none';
  document.getElementById('resupply-pane-rental').style.display = (tab === 'rental') ? '' : 'none';
}
window.switchResupplyTab = switchResupplyTab;

/* ── Stats row ────────────────────────────────────────────── */
function refreshResupplyStats() {
  var d = window.resupplyData;
  var pendingPO = d.purchaseOrders.filter(function (p) { return p.status !== 'received'; }).length;
  var activeSL = d.shoppingLists.filter(function (s) { return !s.allArrived; }).length;
  var awaitArr = d.purchaseOrders.filter(function (p) { return p.status === 'paid'; }).length
    + d.shoppingLists.filter(function (s) { return !s.allArrived && s.items.every(function (i) { return i.bought; }) }).length;
  var done = d.purchaseOrders.filter(function (p) { return p.status === 'received'; }).length
    + d.shoppingLists.filter(function (s) { return s.allArrived; }).length;

  var el;
  el = document.getElementById('rs-stat-po'); if (el) el.textContent = pendingPO;
  el = document.getElementById('rs-stat-sl'); if (el) el.textContent = activeSL;
  el = document.getElementById('rs-stat-arrive'); if (el) el.textContent = awaitArr;
  el = document.getElementById('rs-stat-done'); if (el) el.textContent = done;

  el = document.getElementById('rs-po-count-badge'); if (el) el.textContent = pendingPO + ' Active';
  el = document.getElementById('rs-sl-count-badge'); if (el) el.textContent = activeSL + ' Active';

  // rental stats
  var allFlags = [];
  Object.values(window.lifecycleLogs || {}).forEach(function (logs) {
    logs.forEach(function (log) {
      (log.items || []).forEach(function (item) {
        if (item.isRented && (item.status === 'broken' || item.status === 'missing')) allFlags.push(item);
      });
    });
  });
  var rPaid = Object.values(d.rentalPayments).filter(function (p) { return p.paid; }).length;
  var rPending = allFlags.length - rPaid;
  el = document.getElementById('rs-rent-broken'); if (el) el.textContent = allFlags.length;
  el = document.getElementById('rs-rent-pending'); if (el) el.textContent = Math.max(0, rPending);
  el = document.getElementById('rs-rent-paid'); if (el) el.textContent = rPaid;

  var badge = document.getElementById('resupply-sidebar-badge');
  if (badge) { badge.style.display = (pendingPO + activeSL + rPending > 0) ? '' : 'none'; }
}

/* ── Needs panel: scan resolved issues for broken/missing owned items ─ */
function refreshResupplyNeeds() {
  var el = document.getElementById('rs-needs-container');
  if (!el) return;

  var allItems = [];
  // Walk every lifecycle log for broken/missing owned equipment
  Object.entries(window.lifecycleLogs || {}).forEach(function (entry) {
    var resId = entry[0];
    var logs = entry[1];
    var resLabel = resId;
    var allRes = window.reservations || [];
    var found = allRes.find(function (r) { return r.id === resId; });
    if (found) resLabel = (found.clientName || found.name || resId) + ' — ' + (found.eventDate || found.date || '');

    logs.forEach(function (log, lIdx) {
      if (!log.items) return;
      log.items.forEach(function (item, iIdx) {
        // FLOWCHART: Only show items that are NOT yet resolved/resupplied (Flagged)
        if (!item.isRented && (item.status === 'broken' || item.status === 'missing') && !item.resupplyResolved) {
          allItems.push({
            resId: resId,
            logIdx: lIdx,
            itemIdx: iIdx,
            sourceLogId: resId + '_' + lIdx + '_' + iIdx,
            resLabel: resLabel,
            stage: log.stage || '—',
            stageTime: log.timestamp || '',
            name: item.name || item.assetName || '—',
            assetId: item.assetId || '',
            qty: item.qty || item.quantity || 1,
            unit: item.unit || 'pcs',
            status: item.status,
            ip: item.ip || item.initialPrice || 0,
            supplier: item.supplier || '',
            hasSupplier: !!(item.supplier && item.supplier.trim())
          });
        }
      });
    });
  });


  // Also pull from manual flags
  Object.values(window.issueFlags || {}).forEach(function (flags) {
    flags.forEach(function (f) {
      if (f.flagType === 'damage' || f.flagType === 'missing') {
        // find asset
        var assets = window.equipmentAssets || [];
        var asset = assets.find(function (a) { return a.id === f.assetId || a.name === f.assetName; });
        allItems.push({
          resId: f.reservationId || '',
          resLabel: f.reservationLabel || f.reservationId || 'Manual Flag',
          stage: 'Manual Report',
          stageTime: f.timestamp || f.flaggedAt || '',
          name: f.assetName || f.flagName || '—',
          assetId: f.assetId || '',
          qty: f.qty || 1,
          unit: 'pcs',
          status: f.flagType === 'missing' ? 'missing' : 'broken',
          ip: asset ? (asset.ip || asset.initialPrice || 0) : 0,
          supplier: asset ? (asset.supplier || '') : '',
          hasSupplier: !!(asset && asset.supplier && asset.supplier.trim())
        });
      }
    });
  });

  if (!allItems.length) {
    el.innerHTML = '<div style="text-align:center;padding:36px;color:var(--text-dim);font-size:13px;">✅ No items currently require resupply. Broken or missing equipment from lifecycle logs will appear here once issues are recorded.</div>';
    return;
  }

  var html = '';
  allItems.forEach(function (item, idx) {
    var statusColor = item.status === 'missing' ? 'var(--red)' : 'var(--amber)';
    var statusLabel = item.status === 'missing' ? '❌ Missing' : '🔨 Broken';
    var stageTs = item.stageTime ? new Date(item.stageTime).toLocaleString() : '—';
    html += '<div class="rs-need-row">';
    html += '<div style="flex:1;min-width:0;">';
    html += '<div style="font-size:13px;font-weight:600;color:var(--cream);">' + escHtml(item.name) + ' <span style="font-size:11px;color:var(--text-dim);">(' + escHtml(item.assetId) + ')</span></div>';
    html += '<div style="font-size:11px;color:var(--text-dim);margin-top:2px;">Qty: <strong style="color:var(--text-mid);">' + item.qty + ' ' + item.unit + '</strong> &middot; Event: ' + escHtml(item.resLabel) + ' &middot; Stage: ' + escHtml(item.stage) + '</div>';
    html += '<div style="font-size:11px;color:var(--text-dim);">Acknowledged: ' + stageTs + (item.supplier ? ' &middot; Supplier: <strong style="color:var(--text-mid);">' + escHtml(item.supplier) + '</strong>' : ' &middot; <span style="color:var(--amber);">No supplier — will go to shopping list</span>') + '</div>';
    html += '</div>';
    html += '<div style="display:flex;gap:8px;align-items:center;flex-shrink:0;">';
    html += '<span style="font-size:11px;font-weight:700;color:' + statusColor + ';background:rgba(0,0,0,0.18);padding:3px 10px;border-radius:20px;">' + statusLabel + '</span>';
    if (item.hasSupplier) {
      html += '<button class="btn-outline" style="padding:5px 12px;font-size:11px;white-space:nowrap;" onclick="generatePurchaseOrderFromItem(' + idx + ')">📋 Generate PO</button>';
    } else {
      html += '<button class="btn-outline" style="padding:5px 12px;font-size:11px;white-space:nowrap;" onclick="generateShoppingListFromItem(' + idx + ')">🛒 Add to Shopping List</button>';
    }
    html += '</div></div>';
  });

  // Batch buttons
  var withSupplier = allItems.filter(function (i) { return i.hasSupplier; });
  var withoutSupplier = allItems.filter(function (i) { return !i.hasSupplier; });
  var batchHtml = '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px;padding-top:14px;border-top:1px solid var(--border);">';
  if (withSupplier.length) batchHtml += '<button class="btn-primary" style="font-size:12px;" onclick="generateAllPurchaseOrders()">📋 Generate All POs (' + withSupplier.length + ' items)</button>';
  if (withoutSupplier.length) batchHtml += '<button class="btn-outline" style="font-size:12px;" onclick="generateAllShoppingLists()">🛒 Generate Shopping Lists (' + withoutSupplier.length + ' items)</button>';
  batchHtml += '</div>';

  el.innerHTML = html + batchHtml;
  // store for batch use
  window._resupplyNeedItems = allItems;
}
window.refreshResupplyNeeds = refreshResupplyNeeds;

/* ── Generate PO for a single item ─────────────────────────── */
function generatePurchaseOrderFromItem(idx) {
  var item = (window._resupplyNeedItems || [])[idx];
  if (!item) return;
  _createOrAppendPO([item]);
}
window.generatePurchaseOrderFromItem = generatePurchaseOrderFromItem;

function generateShoppingListFromItem(idx) {
  var item = (window._resupplyNeedItems || [])[idx];
  if (!item) return;
  _createOrAppendSL([item]);
}
window.generateShoppingListFromItem = generateShoppingListFromItem;

function generateAllPurchaseOrders() {
  var items = (window._resupplyNeedItems || []).filter(function (i) { return i.hasSupplier; });
  if (!items.length) return;
  // group by supplier
  var bySupplier = {};
  items.forEach(function (item) {
    var key = item.supplier;
    if (!bySupplier[key]) bySupplier[key] = [];
    bySupplier[key].push(item);
  });
  Object.keys(bySupplier).forEach(function (sup) { _createOrAppendPO(bySupplier[sup]); });
}
window.generateAllPurchaseOrders = generateAllPurchaseOrders;

function generateAllShoppingLists() {
  var items = (window._resupplyNeedItems || []).filter(function (i) { return !i.hasSupplier; });
  if (!items.length) return;
  _createOrAppendSL(items);
}
window.generateAllShoppingLists = generateAllShoppingLists;

function _createOrAppendPO(items) {
  var d = window.resupplyData;
  var supplier = items[0].supplier;
  // check if an open draft PO for this supplier already exists
  var existing = d.purchaseOrders.find(function (p) { return p.supplierName === supplier && p.status === 'draft'; });
  if (existing) {
    items.forEach(function (item) {
      existing.items.push({ name: item.name, qty: item.qty, unit: item.unit, ip: item.ip, assetId: item.assetId, issueStatus: item.status });
    });
  } else {
    var poId = 'PO-' + Date.now();
    d.purchaseOrders.push({
      id: poId,
      supplierName: supplier,
      supplierEmail: '',
      items: items.map(function (i) { return { name: i.name, qty: i.qty, unit: i.unit, ip: i.ip, assetId: i.assetId, issueStatus: i.status, sourceLogId: i.sourceLogId }; }),
      status: 'draft',
      timeSent: null,
      timePaid: null,
      timeReceived: null,
      sourceEvent: items.map(function (i) { return i.resLabel; }).join(', '),
      createdAt: new Date().toISOString()
    });
  }
  refreshResupplyStats();
  renderPurchaseOrders();
  showToast('📋 Purchase Order created for ' + supplier);
}

function _createOrAppendSL(items) {
  var d = window.resupplyData;
  var existing = d.shoppingLists.find(function (s) { return !s.allArrived; });
  var slItems = items.map(function (i) { return { name: i.name, qty: i.qty, unit: i.unit, ip: i.ip, assetId: i.assetId, issueStatus: i.status, sourceLogId: i.sourceLogId, bought: false, boughtAt: null, location: '', arrived: false, arrivedAt: null }; });
  if (existing) {
    slItems.forEach(function (si) { existing.items.push(si); });
  } else {
    var slId = 'SL-' + Date.now();
    d.shoppingLists.push({
      id: slId,
      items: slItems,
      createdAt: new Date().toISOString(),
      allArrived: false,
      allArrivedAt: null,
      sourceEvent: items.map(function (i) { return i.resLabel; }).join(', ')
    });
  }
  refreshResupplyStats();
  renderShoppingLists();
  showToast('🛒 Shopping list updated');
}

/* ── Purchase Orders renderer ────────────────────────────────── */
function renderPurchaseOrders() {
  var el = document.getElementById('rs-po-container');
  if (!el) return;
  var orders = window.resupplyData.purchaseOrders;
  if (!orders.length) {
    el.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-dim);font-size:13px;">No purchase orders yet. Generate one from the items above.</div>';
    return;
  }
  var html = '';
  orders.forEach(function (po) {
    var statusClass = 'rs-status-' + po.status;
    var statusLabel = { draft: 'Draft', sent: 'Sent to Supplier', paid: 'Payment Sent', received: 'Items Received' }[po.status] || po.status;
    var itemsText = po.items.map(function (i) { return i.qty + ' ' + i.unit + ' ' + i.name; }).join(' | ');
    // timeline steps
    var steps = [
      { label: 'PO Created', time: po.createdAt, done: !!po.createdAt },
      { label: 'Sent to Supplier', time: po.timeSent, done: !!po.timeSent },
      { label: 'Payment Sent', time: po.timePaid, done: !!po.timePaid },
      { label: 'Items Received', time: po.timeReceived, done: !!po.timeReceived }
    ];
    html += '<div class="rs-po-card rs-status-' + po.status + '">';
    // head
    html += '<div class="rs-po-head"><div>';
    html += '<div class="rs-po-number">' + escHtml(po.id) + '</div>';
    html += '<div class="rs-po-supplier">Supplier: <strong>' + escHtml(po.supplierName) + '</strong>' + (po.supplierEmail ? ' &lt;' + escHtml(po.supplierEmail) + '&gt;' : '') + '</div>';
    html += '</div><span class="rs-status-badge ' + po.status + '">' + statusLabel + '</span></div>';
    // items
    html += '<div class="rs-po-items-list">' + escHtml(itemsText) + '</div>';
    html += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:10px;">Source: ' + escHtml(po.sourceEvent || '—') + '</div>';
    // timeline
    html += '<div class="rs-po-timeline">';
    steps.forEach(function (step, i) {
      var dotClass = step.done ? 'rs-step-done' : (i > 0 && steps[i - 1].done ? 'rs-step-active' : '');
      html += '<div class="rs-po-step">';
      html += '<div class="rs-po-step-dot ' + dotClass + '">' + (step.done ? '✓' : '') + '</div>';
      html += '<div class="rs-po-step-label">' + step.label + '</div>';
      html += '<div class="rs-po-step-time">' + (step.time ? new Date(step.time).toLocaleString() : '—') + '</div>';
      html += '</div>';
      if (i < steps.length - 1) {
        html += '<div class="rs-po-step-line ' + (step.done ? 'rs-line-done' : '') + '"></div>';
      }
    });
    html += '</div>';
    // email field (if draft)
    if (po.status === 'draft') {
      html += '<div style="margin:10px 0 6px;display:flex;gap:8px;align-items:center;">';
      html += '<input type="email" id="po-email-' + po.id + '" class="input-field" style="flex:1;font-size:12px;" placeholder="Supplier email address..." value="' + escHtml(po.supplierEmail || '') + '"/>';
      html += '<button class="btn-primary" style="font-size:12px;white-space:nowrap;" onclick="sendPurchaseOrder(\'' + po.id + '\')">📤 Send PO</button>';
      html += '</div>';
    }
    // actions
    html += '<div class="rs-po-actions">';
    if (po.status === 'sent') {
      html += '<button class="btn-outline" style="font-size:12px;" onclick="logPoStep(\'' + po.id + '\',\'paid\')">💳 Log Payment Sent</button>';
    }
    if (po.status === 'paid') {
      html += '<button class="btn-outline" style="font-size:12px;" onclick="logPoStep(\'' + po.id + '\',\'received\')">📦 Log Items Received</button>';
    }
    if (po.status === 'received') {
      var sourceIds = po.items.map(function(i){return i.sourceLogId;});
      html += '<div style="display:flex;flex-direction:column;gap:8px;">';
      html += '<button class="btn-primary" style="font-size:12px;" onclick="redirectToAddEquipmentFromPO(\'' + po.id + '\')">➕ Add to Equipment Assets →</button>';
      html += '<button class="btn-outline" style="font-size:12px;border-color:var(--green);color:var(--green);" onclick="clearResupplyFlags([' + sourceIds.map(function(id){return '\''+id+'\'';}).join(',') + '])">System Clear the Flags (Owned)</button>';
      html += '</div>';
    }
    html += '<button class="btn-outline" style="font-size:12px;" onclick="printPO(\'' + po.id + '\')">🖨️ Print / Export</button>';
    html += '</div>';
    html += '</div>';
  });
  el.innerHTML = html;
}
window.renderPurchaseOrders = renderPurchaseOrders;

/* Send PO (logs timeSent, updates status) */
function sendPurchaseOrder(poId) {
  var d = window.resupplyData;
  var po = d.purchaseOrders.find(function (p) { return p.id === poId; });
  if (!po) return;
  var emailEl = document.getElementById('po-email-' + poId);
  var email = emailEl ? emailEl.value.trim() : '';
  if (!email) { alert('Please enter the supplier\'s email address before sending.'); return; }
  po.supplierEmail = email;
  po.status = 'sent';
  po.timeSent = new Date().toISOString();
  // Simulate email send
  showToast('📤 Purchase Order ' + poId + ' sent to ' + email);
  _savePOToFirebase(po);
  refreshResupplyStats();
  renderPurchaseOrders();
}
window.sendPurchaseOrder = sendPurchaseOrder;

/* Log a PO step (paid / received) */
function logPoStep(poId, step) {
  var d = window.resupplyData;
  var po = d.purchaseOrders.find(function (p) { return p.id === poId; });
  if (!po) return;
  var now = new Date().toISOString();
  if (step === 'paid') { po.timePaid = now; po.status = 'paid'; }
  if (step === 'received') { po.timeReceived = now; po.status = 'received'; }
  _savePOToFirebase(po);
  refreshResupplyStats();
  renderPurchaseOrders();
  showToast(step === 'paid' ? '💳 Payment logged' : '📦 Items received — ready to add to inventory');
}
window.logPoStep = logPoStep;

/* FLOWCHART: Log Time of Shopping */
function logStartShopping(slId) {
  var sl = window.resupplyData.shoppingLists.find(function (s) { return s.id === slId; });
  if (!sl) return;
  sl.timeShoppingStarted = new Date().toISOString();
  showToast('🛒 Shopping trip started — Logged time.');
  renderShoppingLists();
  refreshResupplyStats();
}
window.logStartShopping = logStartShopping;

/* FLOWCHART: System Clears the Flags */
function clearResupplyFlags(sourceIds) {
  if (!sourceIds || !sourceIds.length) return;
  sourceIds.forEach(function (sid) {
    if (!sid) return;
    var parts = sid.split('_'); // [resId, logIdx, itemIdx]
    var rid = parts[0], lIdx = parseInt(parts[1]), iIdx = parseInt(parts[2]);
    if (window.lifecycleLogs[rid] && window.lifecycleLogs[rid][lIdx]) {
      var log = window.lifecycleLogs[rid][lIdx];
      if (log.items && log.items[iIdx]) {
        // Flag cleared!
        log.items[iIdx].resupplyResolved = true;
        log.items[iIdx].resupplyResolvedAt = new Date().toISOString();
      }
    }
  });
  showToast('✅ Resupply complete — System cleared the flags.');
  refreshResupplyNeeds();
  refreshResupplyStats();
}
window.clearResupplyFlags = clearResupplyFlags;

function printPO(poId) {
  var d = window.resupplyData;
  var po = d.purchaseOrders.find(function (p) { return p.id === poId; });
  if (!po) return;
  var win = window.open('', '_blank');
  var rows = po.items.map(function (i) { return '<tr><td>' + escHtml(i.name) + '</td><td>' + i.qty + ' ' + i.unit + '</td><td>₱' + (i.ip || 0) + '</td><td>₱' + (i.qty * (i.ip || 0)) + '</td></tr>'; }).join('');
  var total = po.items.reduce(function (s, i) { return s + i.qty * (i.ip || 0); }, 0);
  win.document.write('<html><head><title>Purchase Order ' + po.id + '</title><style>body{font-family:sans-serif;padding:32px;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid #ccc;padding:8px;text-align:left;}th{background:#f5f5f5;}</style></head><body>');
  win.document.write('<h2>PURCHASE ORDER — ' + po.id + '</h2>');
  win.document.write('<p><strong>Supplier:</strong> ' + escHtml(po.supplierName) + (po.supplierEmail ? ' &lt;' + escHtml(po.supplierEmail) + '&gt;' : '') + '</p>');
  win.document.write('<p><strong>Date Sent:</strong> ' + (po.timeSent ? new Date(po.timeSent).toLocaleString() : 'Not yet sent') + '</p>');
  win.document.write('<p><strong>Source:</strong> ' + escHtml(po.sourceEvent || '—') + '</p>');
  win.document.write('<table><thead><tr><th>Item</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead><tbody>' + rows + '</tbody></table>');
  win.document.write('<p style="margin-top:16px;"><strong>Total: ₱' + total + '</strong></p>');
  win.document.write('</body></html>');
  win.document.close();
  win.print();
}
window.printPO = printPO;

async function _savePOToFirebase(po) {
  try {
    if (!window.firebaseDB || !window.firebaseFns) return;
    var fns = window.firebaseFns;
    var ref = fns.doc(window.firebaseDB, 'purchaseOrders', po.id);
    await fns.setDoc(ref, po);
  } catch (e) { }
}

/* ── Shopping Lists renderer ─────────────────────────────────── */
function renderShoppingLists() {
  var el = document.getElementById('rs-sl-container');
  if (!el) return;
  var lists = window.resupplyData.shoppingLists;
  if (!lists.length) {
    el.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-dim);font-size:13px;">No shopping lists yet. Items without a supplier will be added here automatically.</div>';
    return;
  }
  var html = '';
  lists.forEach(function (sl) {
    var boughtCount = sl.items.filter(function (i) { return i.bought; }).length;
    var arrivedCount = sl.items.filter(function (i) { return i.arrived; }).length;
    var allBought = boughtCount === sl.items.length;
    var cardClass = sl.allArrived ? 'rs-sl-card rs-sl-arrived' : 'rs-sl-card';
    // FLOWCHART: Log the time of shopping
    if (!sl.timeShoppingStarted && !sl.allArrived) {
      html += '<div style="margin-bottom:12px;padding:12px;background:rgba(196,154,60,0.1);border-radius:10px;text-align:center;">';
      html += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:8px;">Ready to go shopping? Log the start time below.</div>';
      html += '<button class="btn-primary" style="font-size:12px;padding:6px 16px;" onclick="logStartShopping(\'' + sl.id + '\')">🛒 Start Shopping Trip</button>';
      html += '</div>';
    } else if (sl.timeShoppingStarted) {
      html += '<div style="font-size:11px;color:var(--gold);margin-bottom:10px;font-style:italic;">Shopping started at: ' + new Date(sl.timeShoppingStarted).toLocaleString() + '</div>';
    }

    // items
    sl.items.forEach(function (item, iIdx) {
      var itemClass = item.arrived ? 'rs-sl-item rs-item-arrived' : (item.bought ? 'rs-sl-item rs-item-bought' : 'rs-sl-item');
      html += '<div class="' + itemClass + '" id="sl-item-' + sl.id + '-' + iIdx + '">';
      html += '<div>';
      html += '<div class="rs-sl-item-name">' + escHtml(item.name) + '</div>';
      html += '<div class="rs-sl-item-sub">Qty: ' + item.qty + ' ' + item.unit + (item.ip ? ' &middot; Est. ₱' + item.ip + ' each' : '') + ' &middot; Issue: <span style="color:var(--red);">' + item.issueStatus + '</span>';
      if (item.bought) html += ' &middot; <span style="color:var(--green);">✓ Bought</span> at ' + escHtml(item.location || '—') + ' on ' + new Date(item.boughtAt).toLocaleString();
      if (item.arrived) html += ' &middot; <span style="color:var(--green);">✓ Arrived ' + new Date(item.arrivedAt).toLocaleString() + '</span>';
      html += '</div>';
      // location input row (only if not yet bought)
      if (!item.bought) {
        html += '<div class="rs-sl-location-row">';
        html += '<input type="text" class="rs-sl-location-input" id="sl-loc-' + sl.id + '-' + iIdx + '" placeholder="Where is this being bought? (required before marking bought)" value="' + escHtml(item.location || '') + '" oninput="cacheSlLocation(\'' + sl.id + '\',' + iIdx + ',this.value)"/>';
        html += '</div>';
      }
      html += '</div>';
      // action buttons
      html += '<div class="rs-sl-actions">';
      if (!item.bought) {
        // Only allow marking bought if shopping has started
        var disabled = !sl.timeShoppingStarted ? 'disabled title="Click Start Shopping first"' : '';
        html += '<button class="btn-primary" style="font-size:11px;padding:5px 12px;white-space:nowrap;" ' + disabled + ' onclick="markSlItemBought(\'' + sl.id + '\',' + iIdx + ')">✓ Mark Bought</button>';
      } else if (!item.arrived) {
        html += '<button class="btn-outline" style="font-size:11px;padding:5px 12px;white-space:nowrap;color:var(--green);border-color:rgba(45,138,78,0.4);" onclick="markSlItemArrived(\'' + sl.id + '\',' + iIdx + ')">📦 Log Arrived</button>';
      } else {
        html += '<span style="font-size:11px;color:var(--green);font-weight:600;">✓ Arrived</span>';
      }
      html += '</div>';
      html += '</div>';
    });

    // Arrival banner: shown when all items bought but not all arrived
    if (allBought && !sl.allArrived) {
      var allArrivedNow = sl.items.every(function (i) { return i.arrived; });
      if (!allArrivedNow) {
        html += '<div class="rs-arrival-banner">';
        html += '<div><div style="font-size:13px;font-weight:700;color:var(--cream);">All items purchased — log arrivals above</div><div style="font-size:11px;color:var(--text-dim);margin-top:3px;">Mark each item as arrived once it is received. Once all items arrive, you\'ll be redirected to add them to inventory.</div></div>';
        html += '</div>';
      } else {
        html += '<div class="rs-arrival-banner">';
        html += '<div><div style="font-size:13px;font-weight:700;color:var(--cream);">🎉 All items purchased and arrived</div><div style="font-size:11px;color:var(--text-dim);margin-top:3px;">Ready to add to equipment inventory.</div></div>';
        html += '<button class="rs-btn-arrive" onclick="confirmAllArrivedSL(\'' + sl.id + '\')">➕ Add to Equipment Assets →</button>';
        html += '</div>';
      }
    }
    if (sl.allArrived) {
      var sourceIds = sl.items.map(function(i){return i.sourceLogId;});
      html += '<div style="margin-top:10px;padding:12px 14px;background:rgba(45,138,78,0.1);border:1px solid rgba(45,138,78,0.3);border-radius:9px;">';
      html += '<div style="font-size:12px;color:var(--green);margin-bottom:8px;">✅ All items arrived ' + new Date(sl.allArrivedAt).toLocaleString() + ' — Added to inventory.</div>';
      html += '<button class="btn-primary" style="font-size:12px;width:100%;" onclick="clearResupplyFlags([' + sourceIds.map(function(id){return '\''+id+'\'';}).join(',') + '])">System Clear the Flags (Owned)</button>';
      html += '</div>';
    }
    html += '</div>';
  });
  el.innerHTML = html;
}
window.renderShoppingLists = renderShoppingLists;

/* Cache location input while user types */
function cacheSlLocation(slId, iIdx, val) {
  var sl = window.resupplyData.shoppingLists.find(function (s) { return s.id === slId; });
  if (!sl) return;
  sl.items[iIdx].location = val;
}
window.cacheSlLocation = cacheSlLocation;

/* Mark item as bought — requires location */
function markSlItemBought(slId, iIdx) {
  var sl = window.resupplyData.shoppingLists.find(function (s) { return s.id === slId; });
  if (!sl) return;
  var item = sl.items[iIdx];
  var locEl = document.getElementById('sl-loc-' + slId + '-' + iIdx);
  var location = (locEl ? locEl.value.trim() : item.location || '').trim();
  if (!location) {
    alert('Please enter where this item is being purchased before marking it as bought.');
    if (locEl) { locEl.focus(); locEl.style.borderColor = 'var(--red)'; setTimeout(function () { locEl.style.borderColor = ''; }, 2000); }
    return;
  }
  item.bought = true;
  item.boughtAt = new Date().toISOString();
  item.location = location;
  _saveSLToFirebase(sl);
  renderShoppingLists();
  showToast('✓ ' + item.name + ' marked as bought at ' + location);
}
window.markSlItemBought = markSlItemBought;

/* Mark item as arrived */
function markSlItemArrived(slId, iIdx) {
  var sl = window.resupplyData.shoppingLists.find(function (s) { return s.id === slId; });
  if (!sl) return;
  var item = sl.items[iIdx];
  item.arrived = true;
  item.arrivedAt = new Date().toISOString();
  // check if all arrived
  if (sl.items.every(function (i) { return i.arrived; })) {
    sl.allArrived = true;
    sl.allArrivedAt = new Date().toISOString();
    showToast('📦 All items arrived! Redirecting to add to equipment assets...');
    _saveSLToFirebase(sl);
    renderShoppingLists();
    refreshResupplyStats();
    setTimeout(function () { redirectToAddEquipmentFromSL(slId); }, 1800);
    return;
  }
  _saveSLToFirebase(sl);
  renderShoppingLists();
  refreshResupplyStats();
  showToast('📦 ' + item.name + ' arrival logged');
}
window.markSlItemArrived = markSlItemArrived;

/* Confirm all arrived (batch button) */
function confirmAllArrivedSL(slId) {
  var sl = window.resupplyData.shoppingLists.find(function (s) { return s.id === slId; });
  if (!sl) return;
  var now = new Date().toISOString();
  sl.items.forEach(function (i) { if (!i.arrived) { i.arrived = true; i.arrivedAt = now; } });
  sl.allArrived = true;
  sl.allArrivedAt = now;
  _saveSLToFirebase(sl);
  renderShoppingLists();
  refreshResupplyStats();
  setTimeout(function () { redirectToAddEquipmentFromSL(slId); }, 800);
}
window.confirmAllArrivedSL = confirmAllArrivedSL;

/* Redirect to Equipment Assets with pre-filled items */
function redirectToAddEquipmentFromSL(slId) {
  var sl = window.resupplyData.shoppingLists.find(function (s) { return s.id === slId; });
  if (!sl) return;
  _openBulkAddEquipmentModal(sl.items, 'shopping list ' + slId);
}
window.redirectToAddEquipmentFromSL = redirectToAddEquipmentFromSL;

function redirectToAddEquipmentFromPO(poId) {
  var d = window.resupplyData;
  var po = d.purchaseOrders.find(function (p) { return p.id === poId; });
  if (!po) return;
  _openBulkAddEquipmentModal(po.items, 'purchase order ' + poId + ' from ' + po.supplierName);
}
window.redirectToAddEquipmentFromPO = redirectToAddEquipmentFromPO;

/* Bulk add modal — generated list of newly arrived items */
function _openBulkAddEquipmentModal(items, source) {
  var existing = document.getElementById('bulk-add-overlay');
  if (existing) existing.remove();
  var existingM = document.getElementById('bulk-add-modal');
  if (existingM) existingM.remove();

  var overlay = document.createElement('div');
  overlay.id = 'bulk-add-overlay';
  overlay.className = 'modal-overlay';
  overlay.style.display = 'flex';
  document.body.appendChild(overlay);

  var modal = document.createElement('div');
  modal.id = 'bulk-add-modal';
  modal.className = 'modal eim-modal';
  modal.style.maxWidth = '720px';

  var rows = items.map(function (item, idx) {
    return '<tr id="bulk-row-' + idx + '">' +
      '<td><input type="text" class="input-field" style="font-size:12px;" id="bulk-name-' + idx + '" value="' + escHtml(item.name || '') + '"/></td>' +
      '<td><input type="number" class="input-field" style="font-size:12px;width:70px;" id="bulk-qty-' + idx + '" value="' + (item.qty || 1) + '"/></td>' +
      '<td><select class="input-field" style="font-size:12px;" id="bulk-unit-' + idx + '"><option value="pcs" ' + (item.unit === 'pcs' ? 'selected' : '') + '>pcs</option><option value="sets" ' + (item.unit === 'sets' ? 'selected' : '') + '>sets</option><option value="units">units</option></select></td>' +
      '<td><input type="number" class="input-field" style="font-size:12px;width:80px;" id="bulk-ip-' + idx + '" value="' + (item.ip || 0) + '" placeholder="₱"/></td>' +
      '<td><input type="text" class="input-field" style="font-size:12px;" id="bulk-sup-' + idx + '" value="' + escHtml(item.supplier || item.supplierName || source || '') + '"/></td>' +
      '<td><input type="datetime-local" class="input-field" style="font-size:11px;" id="bulk-date-' + idx + '" value="' + new Date().toISOString().slice(0, 16) + '"/></td>' +
      '</tr>';
  }).join('');

  modal.innerHTML = '<div class="modal-hdr"><div><div class="modal-title">➕ Add Resupplied Equipment to Inventory</div><div style="font-size:12px;color:var(--text-dim);margin-top:3px;">From: ' + escHtml(source) + ' — verify details and confirm addition</div></div><button class="modal-close" onclick="document.getElementById(\'bulk-add-modal\').remove();document.getElementById(\'bulk-add-overlay\').remove();">✕</button></div>' +
    '<div class="modal-body" style="max-height:65vh;overflow-y:auto;">' +
    '<div style="font-size:12px;color:var(--text-dim);margin-bottom:12px;padding:10px 14px;background:rgba(196,154,60,0.06);border-radius:8px;border:1px solid var(--border);">📋 Review each item below. Edit any details as needed, then click <strong style="color:var(--cream);">Confirm &amp; Add All to Inventory</strong>. Each item will be registered as a new asset with the time of resupply logged.</div>' +
    '<div style="overflow-x:auto;"><table class="inv-table"><thead><tr><th>Item Name</th><th>Qty</th><th>Unit</th><th>Price (₱)</th><th>Supplier / Source</th><th>Resupplied At</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
    '</div>' +
    '<div style="display:flex;justify-content:flex-end;gap:10px;padding:16px 20px;border-top:1px solid var(--border);">' +
    '<button class="btn-outline" onclick="document.getElementById(\'bulk-add-modal\').remove();document.getElementById(\'bulk-add-overlay\').remove();">Cancel</button>' +
    '<button class="btn-primary" onclick="submitBulkAddEquipment(' + items.length + ',\'' + escHtml(source) + '\')">✅ Confirm &amp; Add All to Inventory</button>' +
    '</div>';

  document.body.appendChild(modal);
}
window._openBulkAddEquipmentModal = _openBulkAddEquipmentModal;

function submitBulkAddEquipment(count, source) {
  var added = [];
  for (var i = 0; i < count; i++) {
    var name = (document.getElementById('bulk-name-' + i) || {}).value || '—';
    var qty = parseInt((document.getElementById('bulk-qty-' + i) || {}).value || 1);
    var unit = (document.getElementById('bulk-unit-' + i) || {}).value || 'pcs';
    var ip = parseFloat((document.getElementById('bulk-ip-' + i) || {}).value || 0);
    var sup = (document.getElementById('bulk-sup-' + i) || {}).value || '';
    var dateVal = (document.getElementById('bulk-date-' + i) || {}).value || new Date().toISOString();
    var newAsset = {
      id: 'EQ-RS-' + Date.now() + '-' + i,
      name: name,
      quantity: qty,
      unit: unit,
      ip: ip,
      initialPrice: ip,
      supplier: sup,
      category: 'Resupplied',
      condition: 'Good',
      status: 'Available',
      resuppliedAt: dateVal,
      resupplySource: source,
      addedAt: new Date().toISOString()
    };
    if (!window.equipmentAssets) window.equipmentAssets = [];
    window.equipmentAssets.push(newAsset);
    added.push(newAsset);
    _saveAssetToFirebase(newAsset);
  }
  document.getElementById('bulk-add-modal').remove();
  document.getElementById('bulk-add-overlay').remove();
  showToast('✅ ' + added.length + ' item(s) added to Equipment Assets');
  // redirect to equipment section
  showSection('equipment', document.getElementById('nav-equipment'));
  if (typeof renderEIMTable === 'function') renderEIMTable();
}
window.submitBulkAddEquipment = submitBulkAddEquipment;

async function _saveAssetToFirebase(asset) {
  try {
    if (!window.firebaseDB || !window.firebaseFns) return;
    var fns = window.firebaseFns;
    var ref = fns.doc(window.firebaseDB, 'equipmentAssets', asset.id);
    await fns.setDoc(ref, asset);
  } catch (e) { }
}

async function _saveSLToFirebase(sl) {
  try {
    if (!window.firebaseDB || !window.firebaseFns) return;
    var fns = window.firebaseFns;
    var ref = fns.doc(window.firebaseDB, 'shoppingLists', sl.id);
    await fns.setDoc(ref, sl);
  } catch (e) { }
}

/* ── Rental Damage Tab (Branch II) ────────────────────────── */
function renderRentalDamageTab() {
  var el = document.getElementById('rs-rental-container');
  if (!el) return;

  var damagedRentals = [];
  Object.entries(window.lifecycleLogs || {}).forEach(function (entry) {
    var resId = entry[0];
    var logs = entry[1];
    var allRes = window.reservations || [];
    var found = allRes.find(function (r) { return r.id === resId; });
    var resLabel = found ? ((found.clientName || found.name || resId) + ' — ' + (found.eventDate || found.date || '')) : resId;

    logs.forEach(function (log, lIdx) {
      if (!log.items) return;
      log.items.forEach(function (item, iIdx) {
        if (item.isRented && (item.status === 'broken' || item.status === 'missing')) {
          var key = resId + '_' + lIdx + '_' + iIdx;
          var payRec = window.resupplyData.rentalPayments[key] || { paid: false, sortedOut: false };
          
          // FLOWCHART: Only show if NOT yet sorted out
          if (!payRec.sortedOut) {
            damagedRentals.push({
              key: key,
              resId: resId,
              resLabel: resLabel,
              stage: log.stage || '—',
              stageTime: log.timestamp || '',
              name: item.name || item.assetName || '—',
              assetId: item.assetId || '',
              qty: item.qty || item.quantity || 1,
              unit: item.unit || 'pcs',
              status: item.status,
              ip: item.ip || item.initialPrice || 0,
              supplier: item.supplier || item.rentalSupplier || '—',
              paid: payRec.paid || false,
              paidAt: payRec.paidAt || null,
              amount: payRec.amount || item.ip || 0,
              sortedOut: payRec.sortedOut
            });
          }
        }
      });
    });
  });

  if (!damagedRentals.length) {
    el.innerHTML = '<div style="text-align:center;padding:36px;color:var(--text-dim);font-size:13px;">✅ No rental damage records found. Broken or missing rental items from lifecycle logs will appear here.</div>';
    return;
  }

  // FLOWCHART: Export list of all items that broke + cost
  var totalCost = damagedRentals.reduce(function (s, f) { return s + (f.amount * f.qty); }, 0);
  var html = '<div style="margin-bottom:20px;padding:18px;background:var(--bg3);border-radius:12px;border:1px solid var(--border);">';
  html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:15px;">';
  html += '<div><div style="font-size:15px;font-weight:800;color:var(--cream);">Post-Event Rental Damage Report</div><div style="font-size:12px;color:var(--text-dim);margin-top:2px;">' + damagedRentals.length + ' issues flagged &middot; Estimated Liability: <strong style="color:var(--red);">₱' + totalCost.toLocaleString() + '</strong></div></div>';
  html += '<button class="btn-outline" style="font-size:12px;padding:8px 16px;" onclick="exportRentalDamageList()">📋 Export List + Cost</button>';
  html += '</div>';
  html += '<div style="font-size:11px;color:var(--amber);background:rgba(217,119,6,0.08);padding:10px 14px;border-radius:8px;border-left:4px solid var(--amber);line-height:1.5;">🚩 FLAG SYSTEM: The items below are currently flagged as needing repayment. This flag persists until the issue is "Sorted Out" (Case Closed).</div>';
  html += '</div>';

  html += '<div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(340px, 1fr));gap:16px;">';
  damagedRentals.forEach(function (dm) {
    var border = dm.status === 'missing' ? 'var(--red)' : 'var(--amber)';
    html += '<div class="rs-rental-card" style="background:var(--bg3);border:1px solid var(--border);border-left:4px solid ' + border + ';border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:12px;">';
    html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;">';
    html += '<div><div style="font-size:14px;font-weight:700;color:var(--cream);">' + escHtml(dm.name) + '</div><div style="font-size:11px;color:var(--text-dim);">' + escHtml(dm.resLabel) + '</div></div>';
    html += '<span style="font-size:10px;font-weight:800;background:rgba(0,0,0,0.25);padding:3px 8px;border-radius:4px;color:' + border + ';">' + dm.status.toUpperCase() + '</span>';
    html += '</div>';
    html += '<div style="font-size:11px;color:var(--text-dim);">Supplier: <strong style="color:var(--text-mid);">' + escHtml(dm.supplier) + '</strong> &middot; Stage: ' + dm.stage + '</div>';
    html += '<div style="font-size:12px;color:var(--cream);font-weight:600;">Liable Amount: ₱' + (dm.amount * dm.qty).toLocaleString() + ' <span style="font-size:11px;color:var(--text-dim);font-weight:400;">(' + dm.qty + ' × ₱' + dm.amount.toLocaleString() + ')</span></div>';
    
    // FLOWCHART: Decision "Sort Out?"
    html += '<div style="margin-top:auto;padding-top:12px;border-top:1px solid var(--border);display:flex;gap:8px;">';
    if (!dm.paid) {
      html += '<button class="btn-reject" style="font-size:11px;flex:1;padding:7px;" onclick="markRentalPaid(\'' + dm.key + '\')">Log Damage Repayment</button>';
    } else {
      html += '<div style="flex:1;display:flex;align-items:center;color:var(--green);font-size:11px;font-weight:700;">✓ Repayment Logged (' + new Date(dm.paidAt).toLocaleDateString() + ')</div>';
    }
    html += '<button class="btn-primary" style="font-size:11px;padding:7px 12px;" onclick="sortOutRentalIssue(\'' + dm.key + '\')">Sort Out? (C1)</button>';
    html += '</div>';
    html += '</div>';
  });
  html += '</div>';
  el.innerHTML = html;
}
window.renderRentalDamageTab = renderRentalDamageTab;

function markRentalPaid(key) {
  if (!window.resupplyData.rentalPayments[key]) window.resupplyData.rentalPayments[key] = { paid: false, sortedOut: false };
  var pay = window.resupplyData.rentalPayments[key];
  pay.paid = true;
  pay.paidAt = new Date().toISOString();
  _saveRentalPaymentToFirebase(key, pay);
  showToast('✓ Rental damage repayment logged.');
  renderRentalDamageTab();
  refreshResupplyStats();
}
window.markRentalPaid = markRentalPaid;

/* FLOWCHART: Decision "Sort Out?" -> C1 (Resolved) */
function sortOutRentalIssue(key) {
  if (!window.resupplyData.rentalPayments[key]) window.resupplyData.rentalPayments[key] = { paid: false, sortedOut: false };
  var pay = window.resupplyData.rentalPayments[key];
  pay.sortedOut = true;
  pay.sortedAt = new Date().toISOString();
  
  // Also clear the flag in the original log if possible
  var parts = key.split('_');
  var rid = parts[0], lIdx = parseInt(parts[1]), iIdx = parseInt(parts[2]);
  if (window.lifecycleLogs[rid] && window.lifecycleLogs[rid][lIdx]) {
    var item = window.lifecycleLogs[rid][lIdx].items[iIdx];
    item.resupplyResolved = true; // reusing same flag logic for clearing
    item.resupplyResolvedAt = pay.sortedAt;
  }

  _saveRentalPaymentToFirebase(key, pay);
  showToast('✅ Rental issue sorted out — Case Closed (C1).');
  renderRentalDamageTab();
  refreshResupplyStats();
}
window.sortOutRentalIssue = sortOutRentalIssue;

function exportRentalDamageList() {
  window.print(); // Simplest way to "Export" for now
}
window.exportRentalDamageList = exportRentalDamageList;

async function _saveRentalPaymentToFirebase(key, data) {
  try {
    if (!window.firebaseDB || !window.firebaseFns) return;
    var fns = window.firebaseFns;
    var ref = fns.doc(window.firebaseDB, 'rentalDamagePayments', key.replace(/[^a-zA-Z0-9_-]/g, '_'));
    await fns.setDoc(ref, data);
  } catch (e) { }
}


/* ── Utility: HTML escape ─────────────────────────────────── */
function escHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function escAttr(str) {
  if (!str) return '';
  return String(str).replace(/[^a-zA-Z0-9_\-]/g, '_');
}
if (!window.escHtml) window.escHtml = escHtml;

/* ── Toast helper (if not already defined) ────────────────── */
if (!window.showToast) {
  window.showToast = function (msg) {
    var t = document.createElement('div');
    t.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;background:var(--bg2);border:1px solid var(--gold);color:var(--cream);padding:12px 20px;border-radius:12px;font-size:13px;font-weight:600;box-shadow:0 8px 32px rgba(0,0,0,.4);max-width:380px;';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 3500);
  };
}

/* ── Load persisted data from Firebase on init ────────────── */
async function loadResupplyDataFromFirebase() {
  try {
    if (!window.firebaseDB || !window.firebaseFns) return;
    var fns = window.firebaseFns;
    var poSnap = await fns.getDocs(fns.collection(window.firebaseDB, 'purchaseOrders'));
    poSnap.forEach(function (d) {
      var data = d.data();
      if (!window.resupplyData.purchaseOrders.find(function (p) { return p.id === data.id; }))
        window.resupplyData.purchaseOrders.push(data);
    });
    var slSnap = await fns.getDocs(fns.collection(window.firebaseDB, 'shoppingLists'));
    slSnap.forEach(function (d) {
      var data = d.data();
      if (!window.resupplyData.shoppingLists.find(function (s) { return s.id === data.id; }))
        window.resupplyData.shoppingLists.push(data);
    });
    var rpSnap = await fns.getDocs(fns.collection(window.firebaseDB, 'rentalDamagePayments'));
    rpSnap.forEach(function (d) { window.resupplyData.rentalPayments[d.id] = d.data(); });
  } catch (e) { }
}

/* Call load on page ready */
document.addEventListener('DOMContentLoaded', function () {
  setTimeout(loadResupplyDataFromFirebase, 2000);
});
/* ====================================================================
   EQUIPMENT MAINTENANCE PIPELINE (EIM 9)
   Functions: renderMaintenanceSection, switchMaintenanceTab,
   refreshMaintenancePipeline, openMaintenanceModal, decideMaintenance,
   submitMaintenanceLog, autoFlagForResupply
   Data stored in window.maintenanceTasks = []
   ==================================================================== */

window.maintenanceTasks = window.maintenanceTasks || [];

function renderMaintenanceSection() {
  refreshMaintenancePipeline();
  updateMaintenanceStats();
  renderMaintenanceGrid();
  renderMaintenanceHistory();
}
window.renderMaintenanceSection = renderMaintenanceSection;

function updateMaintenanceStats() {
  var t = window.maintenanceTasks;
  var counts = {
    review: t.filter(function(x){ return x.status === 'review_pending'; }).length,
    repair: t.filter(function(x){ return x.status === 'under_maintenance'; }).length,
    fixed: t.filter(function(x){ return x.status === 'fixed' && isCurrentMonth(x.resolvedAt); }).length,
    retired: t.filter(function(x){ return x.status === 'retired'; }).length
  };
  
  var el;
  el = document.getElementById('mnt-stat-review'); if(el) el.textContent = counts.review;
  el = document.getElementById('mnt-stat-repair'); if(el) el.textContent = counts.repair;
  el = document.getElementById('mnt-stat-fixed');  if(el) el.textContent = counts.fixed;
  el = document.getElementById('mnt-stat-retired');if(el) el.textContent = counts.retired;

  var badge = document.getElementById('mnt-sidebar-badge');
  if(badge) {
    var totalActive = counts.review + counts.repair;
    badge.style.display = totalActive > 0 ? '' : 'none';
    badge.textContent = totalActive;
  }
}

function isCurrentMonth(dateStr) {
  if(!dateStr) return false;
  var d = new Date(dateStr);
  var now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

function refreshMaintenancePipeline() {
  var tasks = window.maintenanceTasks;
  
  // 1. Scan EIM_ASSETS for "Under Repair" or "Poor" condition
  (EIM_ASSETS || []).forEach(function(asset) {
    if(asset.status === 'Under Repair' || asset.condition === 'Fair' || asset.condition === 'Poor') {
      var existing = tasks.find(function(t){ return t.assetId === asset.id && t.status !== 'fixed' && t.status !== 'retired'; });
      if(!existing) {
        tasks.push({
          id: 'MT-' + Date.now() + '-' + asset.id,
          assetId: asset.id,
          name: asset.name,
          category: asset.category || 'General',
          reportedAt: new Date().toISOString(),
          status: 'review_pending',
          priority: 'medium',
          issue: 'Damaged',
          logs: [{ date: new Date().toISOString(), action: 'Detected by Scanner', note: 'Asset flagged in inventory as ' + (asset.status === 'Under Repair' ? 'In Repair' : asset.condition) + '.' }]
        });
      }
    }
  });

  // 2. Scan lifecycle logs for "broken" or "damaged" items
  Object.entries(window.allDeploymentLogs || {}).forEach(function(entry) {
    var rid = entry[0];
    var stages = entry[1];
    Object.values(stages).forEach(function(log) {
      (log.checklist || []).forEach(function(item) {
        if(item.condition === 'broken' || item.condition === 'damaged') {
          var existing = tasks.find(function(t){ return t.sourceRef === (rid + '_' + log.stage + '_' + item.assetId) && t.status !== 'fixed' && t.status !== 'retired'; });
          if(!existing) {
            tasks.push({
              id: 'MT-' + Date.now() + '-' + (item.assetId || 'UNK'),
              assetId: item.assetId || '',
              name: item.name,
              category: item.category || '',
              reportedAt: log.timestamp || new Date().toISOString(),
              status: 'review_pending',
              priority: 'high',
              issue: 'Damaged',
              sourceRef: rid + '_' + log.stage + '_' + item.assetId,
              logs: [{ date: new Date().toISOString(), action: 'Pipeline Entry', note: 'Flagged from lifecycle log: item reported as ' + item.condition + ' during ' + log.stage + '.' }]
            });
          }
        }
      });
    });
  });
}

function renderMaintenanceGrid() {
  var grid = document.getElementById('mnt-pipeline-grid');
  if(!grid) return;
  
  var activeTasks = window.maintenanceTasks.filter(function(t){ return t.status !== 'fixed' && t.status !== 'retired'; });
  if(!activeTasks.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-dim);"><div style="font-size:48px;margin-bottom:12px;">🛠️</div><div style="font-size:15px;font-weight:600;">Pipeline is clear.</div><div style="font-size:12px;margin-top:4px;">No equipment currently requires maintenance review.</div></div>';
    return;
  }

  var html = '';
  activeTasks.forEach(function(t) {
    var statusClass = 'mnt-status-' + (t.status === 'review_pending' ? 'review' : 'repair');
    var statusLabel = t.status === 'review_pending' ? '🔍 Review Pending' : '🔧 Under Maintenance';
    var pClass = 'mnt-p-' + t.priority;
    
    html += '<div class="mnt-task-card">';
    html += '<div class="mnt-card-hdr">';
    html += '<span class="mnt-status-badge ' + statusClass + '">' + statusLabel + '</span>';
    html += '<span class="mnt-priority ' + pClass + '">' + t.priority.toUpperCase() + '</span>';
    html += '</div>';
    html += '<div class="mnt-card-body">';
    html += '<div class="mnt-asset-info">';
    html += '<div class="mnt-asset-icon">' + getCategoryIcon(t.category) + '</div>';
    html += '<div>';
    html += '<div style="font-size:14px;font-weight:700;color:var(--cream);">' + escHtml(t.name) + '</div>';
    html += '<div style="font-size:11px;color:var(--text-dim);">' + escHtml(t.assetId) + ' &middot; ' + t.category + '</div>';
    html += '</div></div>';
    html += '<div style="font-size:12px;color:var(--text-mid);background:rgba(0,0,0,0.1);padding:10px;border-radius:8px;margin-bottom:14px;"><strong>Issue:</strong> ' + escHtml(t.issue) + '</div>';
    
    html += '<div class="mnt-log-container">';
    var lastLog = t.logs[t.logs.length - 1];
    if(lastLog) {
      html += '<div style="font-size:10px;color:var(--text-dim);margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;">Latest Activity</div>';
      html += '<div class="mnt-log-item">';
      html += '<div class="mnt-log-dot"></div>';
      html += '<div class="mnt-log-content">';
      html += '<div class="mnt-log-action">' + escHtml(lastLog.action) + '</div>';
      html += '<div class="mnt-log-meta">' + new Date(lastLog.date).toLocaleString() + (lastLog.note ? ' &middot; ' + escHtml(lastLog.note) : '') + '</div>';
      html += '</div></div>';
    }
    html += '</div>';
    
    html += '<button class="btn-primary" style="width:100%;margin-top:12px;justify-content:center;" onclick="openMaintenanceModal(\'' + t.id + '\')">' + (t.status === 'review_pending' ? 'Review Task' : 'Manage Repair') + ' </button>';
    html += '</div></div>';
  });
  grid.innerHTML = html;
}

function getCategoryIcon(cat) {
  if(cat.indexOf('Furniture') > -1) return '🪑';
  if(cat.indexOf('Tableware') > -1) return '🍽️';
  if(cat.indexOf('Catering') > -1) return '🍲';
  if(cat.indexOf('AV') > -1) return '💡';
  return '📦';
}

function switchMaintenanceTab(tab, btn) {
  document.querySelectorAll('#section-maintenance .tab-btn').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
  document.getElementById('mnt-pane-active').style.display = (tab === 'active' ? '' : 'none');
  document.getElementById('mnt-pane-history').style.display = (tab === 'history' ? '' : 'none');
}
window.switchMaintenanceTab = switchMaintenanceTab;

function openMaintenanceModal(id) {
  var t = window.maintenanceTasks.find(function(x){ return x.id === id; });
  if(!t) return;
  
  document.getElementById('mnt-modal-task-id').value = id;
  document.getElementById('mnt-modal-asset').textContent = t.name + ' (' + t.assetId + ')';
  
  var reviewSec = document.getElementById('mnt-review-actions');
  var logForm = document.getElementById('mnt-log-form');
  
  if(t.status === 'review_pending') {
    reviewSec.style.display = 'block';
    logForm.style.display = 'none';
  } else {
    reviewSec.style.display = 'none';
    logForm.style.display = 'block';
    document.getElementById('mnt-priority').value = t.priority;
    document.getElementById('mnt-action-note').value = '';
  }
  
  document.getElementById('mnt-action-overlay').classList.add('on');
  document.getElementById('mnt-action-modal').classList.add('open');
}
window.openMaintenanceModal = openMaintenanceModal;

function closeMaintenanceModal() {
  document.getElementById('mnt-action-overlay').classList.remove('on');
  document.getElementById('mnt-action-modal').classList.remove('open');
}
window.closeMaintenanceModal = closeMaintenanceModal;

function decideMaintenance(decision) {
  var id = document.getElementById('mnt-modal-task-id').value;
  var t = window.maintenanceTasks.find(function(x){ return x.id === id; });
  if(!t) return;
  
  var now = new Date().toISOString();
  if(decision === 'repair') {
    t.status = 'under_maintenance';
    t.logs.push({ date: now, action: 'Move to Maintenance', note: 'Admin determined item is fixable.' });
    openMaintenanceModal(id); // Refresh modal view
  } else if(decision === 'retire') {
    t.status = 'retired';
    t.resolvedAt = now;
    t.logs.push({ date: now, action: 'Item Retired', note: 'Admin determined item not fixable. Moving to resupply.' });
    autoFlagForResupply(t);
    closeMaintenanceModal();
    showToast('♻️ Item retired. Flagged for resupply.');
  }
  
  _saveMaintenanceTaskToFirebase(t);
  renderMaintenanceSection();
}
window.decideMaintenance = decideMaintenance;

function submitMaintenanceLog(mode) {
  var id = document.getElementById('mnt-modal-task-id').value;
  var t = window.maintenanceTasks.find(function(x){ return x.id === id; });
  if(!t) return;
  
  var priority = document.getElementById('mnt-priority').value;
  var note = document.getElementById('mnt-action-note').value.trim();
  var now = new Date().toISOString();

  t.priority = priority;
  
  if(mode === 'fixed') {
    t.status = 'fixed';
    t.resolvedAt = now;
    t.logs.push({ date: now, action: 'Fixed & Returned', note: note || 'Item repaired and returned to inventory in Good condition.' });
    
    // Update main asset condition
    var asset = (EIM_ASSETS || []).find(function(a){ return a.id === t.assetId; });
    if(asset) {
      asset.condition = 'Good';
      asset.status = 'Active';
    }
    
    closeMaintenanceModal();
    showToast('✅ Maintenance complete. Asset restored to Good condition.');
  } else {
    t.logs.push({ date: now, action: 'Update Log', note: note });
    closeMaintenanceModal();
    showToast('📝 Maintenance log updated.');
  }
  
  _saveMaintenanceTaskToFirebase(t);
  renderMaintenanceSection();
}
window.submitMaintenanceLog = submitMaintenanceLog;

function autoFlagForResupply(t) {
  // Integrate with Resupply module by adding a virtual "missing" flag
  window.issueFlags = window.issueFlags || {};
  var rid = 'RETIRED_MNT';
  if(!window.issueFlags[rid]) window.issueFlags[rid] = [];
  
  window.issueFlags[rid].push({
    assetId: t.assetId,
    assetName: t.name,
    flagType: 'missing',
    qty: 1,
    priority: 'High',
    description: 'Retired from Maintenance Pipeline: ' + t.issue,
    flaggedAt: new Date().toISOString(),
    reservationId: rid,
    reservationLabel: 'Retirement Replacement'
  });
  
  // Update main asset status to Retired
  var asset = (EIM_ASSETS || []).find(function(a){ return a.id === t.assetId; });
  if(asset) {
    asset.status = 'Retired';
    asset.condition = 'Poor';
  }
}

function renderMaintenanceHistory() {
  var tbody = document.getElementById('mnt-history-tbody');
  if(!tbody) return;
  
  var historyTasks = window.maintenanceTasks.filter(function(t){ return t.status === 'fixed' || t.status === 'retired'; });
  if(!historyTasks.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:24px;color:var(--text-dim);">No closed maintenance tasks.</td></tr>';
    return;
  }

  var html = '';
  historyTasks.sort(function(a,b){ return new Date(b.resolvedAt) - new Date(a.resolvedAt); }).forEach(function(t) {
    var resColor = t.status === 'fixed' ? 'var(--green)' : 'var(--text-dim)';
    var resLabel = t.status === 'fixed' ? 'FIXED' : 'RETIRED';
    var date = new Date(t.resolvedAt).toLocaleDateString();
    
    html += '<tr>';
    html += '<td style="color:var(--text-dim);">' + date + '</td>';
    html += '<td><div style="font-weight:600;">' + escHtml(t.name) + '</div><div style="font-size:10px;opacity:0.6;">' + t.assetId + '</div></td>';
    html += '<td style="font-weight:700;color:' + resColor + ';">' + resLabel + '</td>';
    html += '<td style="font-size:11px;color:var(--text-mid);">' + escHtml(t.issue) + '</td>';
    html += '<td style="font-size:11px;color:var(--text-mid);">Internal Repair</td>';
    html += '</tr>';
  });
  tbody.innerHTML = html;
}

async function _saveMaintenanceTaskToFirebase(task) {
  try {
    if(!window.firebaseDB || !window.firebaseFns) return;
    var fns = window.firebaseFns;
    var ref = fns.doc(window.firebaseDB, 'maintenanceTasks', task.id.replace(/[^a-zA-Z0-9_-]/g, '_'));
    await fns.setDoc(ref, task);
  } catch(e) {}
}

async function loadMaintenanceDataFromFirebase() {
  try {
    if(!window.firebaseDB || !window.firebaseFns) return;
    var fns = window.firebaseFns;
    var snap = await fns.getDocs(fns.collection(window.firebaseDB, 'maintenanceTasks'));
    snap.forEach(function(d) {
      var data = d.data();
      if(!window.maintenanceTasks.find(function(x){ return x.id === data.id; })) {
        window.maintenanceTasks.push(data);
      }
    });
    if(document.getElementById('section-maintenance')?.classList.contains('active')) {
      renderMaintenanceSection();
    }
  } catch(e) {}
}

// Add to init
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(loadMaintenanceDataFromFirebase, 2500);
  
  // Inject placeholders if empty for demo purposes
  setTimeout(function() {
    if(window.maintenanceTasks.length === 0) {
      window.maintenanceTasks.push({
        id: 'MT-DEMO-1',
        assetId: 'EQ-CH-001',
        name: 'Tiffany Chair (Gold)',
        category: 'Furniture',
        reportedAt: new Date(Date.now() - 86400000).toISOString(),
        status: 'review_pending',
        priority: 'medium',
        issue: 'Damaged',
        logs: [{ date: new Date(Date.now() - 86400000).toISOString(), action: 'Logged', note: 'Flagged for internal review.' }]
      });
      window.maintenanceTasks.push({
        id: 'MT-DEMO-2',
        assetId: 'EQ-AV-012',
        name: 'Sound System Speaker',
        category: 'AV & Lighting',
        reportedAt: new Date(Date.now() - 172800000).toISOString(),
        status: 'under_maintenance',
        priority: 'high',
        issue: 'Damaged',
        logs: [
          { date: new Date(Date.now() - 172800000).toISOString(), action: 'Logged', note: 'Detected by routine check.' },
          { date: new Date(Date.now() - 86400000).toISOString(), action: 'Review Complete', note: 'Owner initiating internal repair.' }
        ]
      });
    }

    // Seed dummy disposal data for analytics if maintenanceTasks is lonely
    if (window.maintenanceTasks.length <= 2) {
      const demoFailures = [
        { id: 'MT-OLD-1', assetId: 'EQ-T-005', name: 'Tiffany Chair (Gold)', category: 'Furniture', reportedAt: '2026-01-10T10:00:00Z', resolvedAt: '2026-01-12T10:00:00Z', status: 'retired', priority: 'high', issue: 'Leg snapped during transport', logs: [] },
        { id: 'MT-OLD-2', assetId: 'EQ-T-006', name: 'Tiffany Chair (Gold)', category: 'Furniture', reportedAt: '2026-02-05T10:00:00Z', resolvedAt: '2026-02-06T10:00:00Z', status: 'retired', priority: 'medium', issue: 'Backrest cracked', logs: [] },
        { id: 'MT-OLD-3', assetId: 'EQ-V-022', name: 'Crystal Vase (Large)', category: 'Tableware', reportedAt: '2026-03-15T10:00:00Z', resolvedAt: '2026-03-16T10:00:00Z', status: 'retired', priority: 'high', issue: 'Shattered', logs: [] },
        { id: 'MT-OLD-4', assetId: 'EQ-L-001', name: 'Stage Spotlight', category: 'AV & Lighting', reportedAt: '2026-03-20T10:00:00Z', resolvedAt: '2026-03-22T10:00:00Z', status: 'retired', priority: 'low', issue: 'Circuit burnout', logs: [] },
        // These are just "maintenance incidents" to show who breaks the most
        { id: 'MT-OLD-5', assetId: 'EQ-T-007', name: 'Tiffany Chair (Gold)', category: 'Furniture', reportedAt: '2026-04-01T10:00:00Z', resolvedAt: '2026-04-02T10:00:00Z', status: 'fixed', priority: 'low', issue: 'Loose screw', logs: [] }
      ];
      demoFailures.forEach(f => window.maintenanceTasks.push(f));
      
      // Ensure specific assets exist for cost lookup
      const dummyAssets = [
        { id: 'EQ-T-005', name: 'Tiffany Chair (Gold)', unitCost: 1200, category: 'Furniture', status: 'Retired' },
        { id: 'EQ-V-022', name: 'Crystal Vase (Large)', unitCost: 850, category: 'Tableware', status: 'Retired' },
        { id: 'EQ-L-001', name: 'Stage Spotlight', unitCost: 4500, category: 'AV & Lighting', status: 'Retired' }
      ];
      dummyAssets.forEach(da => {
        if (!EIM_ASSETS.find(a => a.id === da.id)) EIM_ASSETS.push(da);
      });
      
      // Force refresh if the user is already looking at these sections
      if(document.getElementById('section-disposed')?.classList.contains('active')) {
        renderDisposedSection();
      }
      if(document.getElementById('section-maintenance')?.classList.contains('active')) {
        renderMaintenanceSection();
      }
    }
  }, 3000);
});
/* ====================================================================
   EQUIPMENT DISPOSED RECORDS (EIM 10)
   Functions: renderDisposedSection, getDisposedRecords, 
   calculateDisposalAnalytics
   ==================================================================== */

window.disposedRecords = window.disposedRecords || [];

function renderDisposedSection() {
  const records = getDisposedRecords();
  const analytics = calculateDisposalAnalytics(records);
  
  updateDisposedStats(analytics);
  renderFailureAnalytics(analytics.failureFrequencies);
  renderMonthlyLossTrends(analytics.monthlyTrends);
  renderDisposalHistory(records);
}
window.renderDisposedSection = renderDisposedSection;

function switchDisposedTab(tab, btn) {
  document.querySelectorAll('#section-disposed .tab-btn').forEach(function (b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  var analyticsPane = document.getElementById('dsp-pane-analytics');
  var historyPane = document.getElementById('dsp-pane-history');
  if (analyticsPane) analyticsPane.style.display = (tab === 'analytics') ? '' : 'none';
  if (historyPane) historyPane.style.display = (tab === 'history') ? '' : 'none';
}
window.switchDisposedTab = switchDisposedTab;

function getDisposedRecords() {
  // 1. Items from Maintenance Pipeline marked "Retired"
  let records = (window.maintenanceTasks || [])
    .filter(t => t.status === 'retired')
    .map(t => {
      const asset = (EIM_ASSETS || []).find(a => a.id === t.assetId);
      const val = asset ? (parseFloat(asset.unitCost || asset.cost || asset.ip) || 0) : 0;
      return {
        date: t.resolvedAt || t.reportedAt,
        name: t.name,
        assetId: t.assetId,
        reason: 'Beyond Repair (Maintenance)',
        valueLoss: val,
        category: t.category
      };
    });

  // 2. Items manually marked "Retired" in EIM that aren't in maintenance records
  (EIM_ASSETS || []).forEach(asset => {
    if (asset.status === 'Retired') {
      const alreadyInMnt = records.find(r => r.assetId === asset.id);
      if (!alreadyInMnt) {
        records.push({
          date: asset.retiredAt || new Date().toISOString(), // Fallback
          name: asset.name,
          assetId: asset.id,
          reason: asset.notes || 'End of Lifecycle',
          valueLoss: parseFloat(asset.unitCost || asset.cost || asset.ip) || 0,
          category: asset.category
        });
      }
    }
  });

  return records.sort((a,b) => new Date(b.date) - new Date(a.date));
}

function calculateDisposalAnalytics(records) {
  let totalLoss = 0;
  let monthlyLossMap = {};
  let failureMap = {};
  
  const now = new Date();
  const currentMonthKey = now.toLocaleString('default', { month: 'short', year: 'numeric' });

  records.forEach(r => {
    const val = r.valueLoss || 0;
    totalLoss += val;

    // Monthly Trends
    const d = new Date(r.date);
    const mKey = d.toLocaleString('default', { month: 'short', year: 'numeric' });
    monthlyLossMap[mKey] = (monthlyLossMap[mKey] || 0) + val;
  });

  // Failure Frequency (Count ALL incidents in maintenanceTasks even if fixed)
  (window.maintenanceTasks || []).forEach(t => {
    failureMap[t.name] = (failureMap[t.name] || 0) + 1;
  });

  const frequencies = Object.entries(failureMap)
    .sort((a,b) => b[1] - a[1])
    .slice(0, 5);

  const activeCount = (EIM_ASSETS || []).filter(a => a.status === 'Active' || a.status === 'In Use').length;
  const disposalRate = records.length > 0 ? ((records.length / (records.length + activeCount)) * 100).toFixed(1) : 0;

  return {
    totalValueLoss: totalLoss,
    currentMonthLoss: monthlyLossMap[currentMonthKey] || 0,
    currentMonthName: currentMonthKey,
    failureFrequencies: frequencies,
    monthlyTrends: monthlyLossMap,
    disposalRate: disposalRate
  };
}

function updateDisposedStats(analytics) {
  setElText('dsp-stat-total', '₱' + analytics.totalValueLoss.toLocaleString());
  setElText('dsp-stat-month', '₱' + analytics.currentMonthLoss.toLocaleString());
  setElText('dsp-stat-month-lbl', 'Loss in ' + analytics.currentMonthName);
  setElText('dsp-stat-rate', analytics.disposalRate + '%');
  
  const topFailure = analytics.failureFrequencies[0];
  setElText('dsp-stat-bad-asset', topFailure ? topFailure[0] : 'None');
}

function renderFailureAnalytics(frequencies) {
  const canvas = document.getElementById('dsp-chart-broken');
  const empty = document.getElementById('dsp-chart-broken-empty');
  if (!canvas) return;

  if (window.disposedBrokenChartInst) {
    window.disposedBrokenChartInst.destroy();
    window.disposedBrokenChartInst = null;
  }

  if (!frequencies.length) {
    canvas.style.display = 'none';
    if (empty) empty.style.display = '';
    return;
  }
  canvas.style.display = '';
  if (empty) empty.style.display = 'none';

  const labels = frequencies.map(function (f) { return f[0]; });
  const data = frequencies.map(function (f) { return f[1]; });

  window.disposedBrokenChartInst = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Incidents',
        data: data,
        backgroundColor: 'rgba(196, 154, 60, 0.65)',
        borderColor: '#c49a3c',
        borderWidth: 1.5,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0, color: '#b7b2a7' },
          grid: { color: 'rgba(255,255,255,0.08)' }
        },
        x: {
          ticks: { color: '#e7e0d0', maxRotation: 25, minRotation: 0 },
          grid: { display: false }
        }
      }
    }
  });
}

function renderMonthlyLossTrends(trends) {
  const canvas = document.getElementById('dsp-chart-monthly');
  const empty = document.getElementById('dsp-chart-monthly-empty');
  if (!canvas) return;

  if (window.disposedMonthlyLossChartInst) {
    window.disposedMonthlyLossChartInst.destroy();
    window.disposedMonthlyLossChartInst = null;
  }
  
  const entries = Object.entries(trends)
    .sort((a,b) => new Date(a[0]) - new Date(b[0]))
    .slice(0, 6);
    
  if (!entries.length) {
    canvas.style.display = 'none';
    if (empty) empty.style.display = '';
    return;
  }
  canvas.style.display = '';
  if (empty) empty.style.display = 'none';

  const labels = entries.map(function (e) { return e[0]; });
  const data = entries.map(function (e) { return e[1]; });

  window.disposedMonthlyLossChartInst = new Chart(canvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Value Loss (PHP)',
        data: data,
        borderColor: '#2d8a4e',
        backgroundColor: 'rgba(45, 138, 78, 0.22)',
        borderWidth: 2,
        tension: 0.35,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              return ' Loss: ₱' + (ctx.parsed.y || 0).toLocaleString();
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#b7b2a7',
            callback: function (value) { return '₱' + Number(value).toLocaleString(); }
          },
          grid: { color: 'rgba(255,255,255,0.08)' }
        },
        x: {
          ticks: { color: '#e7e0d0' },
          grid: { display: false }
        }
      }
    }
  });
}

function renderDisposalHistory(records) {
  const tbody = document.getElementById('dsp-history-tbody');
  if (!tbody) return;
  
  if (!records.length) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:24px;color:var(--text-dim);">No disposal history recorded.</td></tr>';
    return;
  }

  let html = '';
  records.forEach(r => {
    html += `<tr>
      <td style="color:var(--text-dim);">${new Date(r.date).toLocaleDateString()}</td>
      <td>
        <div style="font-weight:600;color:var(--cream);">${escHtml(r.name)}</div>
        <div style="font-size:10px;opacity:0.6;">${r.assetId} &middot; ${r.category}</div>
      </td>
      <td style="font-size:12px;color:var(--text-mid);">${escHtml(r.reason)}</td>
      <td style="text-align:right; font-weight:700; color:var(--red);">₱${(r.valueLoss || 0).toLocaleString()}</td>
    </tr>`;
  });
  tbody.innerHTML = html;
}

function setElText(id, txt) {
  const el = document.getElementById(id);
  if (el) el.textContent = txt;
}

/* ====================================================================
   RESERVATION OVERHAUL LOGIC
   ==================================================================== */

function renderEventRequirements(ev) {
  const container = document.getElementById('ed-requirements-list');
  if (!container) return;

  const pax = ev.pax || 0;
  const tables = Math.ceil(pax * 0.125); // Rule of 1 per 8 pax

  let html = '';
  // Use ALLOC_RULES to calculate
  (ALLOC_RULES || []).forEach(rule => {
    let qty = 0;
    if (rule.ruleType === 'per_pax') {
      qty = Math.ceil(pax * rule.ratio);
    } else if (rule.ruleType === 'per_table') {
      qty = Math.ceil(tables * rule.ratio);
    } else if (rule.ruleType === 'flat') {
      qty = rule.ratio;
    }

    // Add Fragile Buffer (e.g., 10%)
    if (rule.isFragile) qty = Math.ceil(qty * 1.1);

    if (qty > 0) {
      html += `
        <div class="req-item">
          <div class="req-info">
            <span class="req-name">${escHtml(rule.name)}</span>
            <span class="req-cat">${rule.category} &middot; ${rule.note || ''}</span>
          </div>
          <span class="req-val">${qty}</span>
        </div>`;
    }
  });

  if (!html) {
    container.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-dim); font-size:12px;">No automated requirements defined for this event type.</div>';
  } else {
    container.innerHTML = html;
  }
}
window.renderEventRequirements = renderEventRequirements;

/* ====================================================================
   USER MANAGEMENT LOGIC
   ==================================================================== */

function renderUsersSection() {
  const tbody = document.getElementById('users-tbody');
  if (!tbody) return;

  const activeCount = USERS.filter(u => u.status === 'Active').length;
  const inactiveCount = USERS.length - activeCount;

  setElText('user-stat-total', USERS.length);
  setElText('user-stat-active', activeCount);
  setElText('user-stat-inactive', inactiveCount);

  tbody.innerHTML = USERS.map(u => `
    <tr onclick="selectUserRow(this, '${u.id}')" class="${selectedUserId === u.id ? 'selected' : ''}">
      <td class="item-name">${escHtml(u.name)}</td>
      <td>${escHtml(u.email)}</td>
      <td>${u.role}</td>
      <td><span class="badge ${u.status.toLowerCase()}">${u.status}</span></td>
      <td style="color:var(--text-dim); font-size:12px;">${u.lastLogin || 'Never'}</td>
    </tr>
  `).join('');

  updateUserActionButtons();
}

function selectUserRow(el, userId) {
  selectedUserId = userId;
  document.querySelectorAll('#users-tbody tr').forEach(tr => tr.classList.remove('selected'));
  el.classList.add('selected');
  updateUserActionButtons();
}

function updateUserActionButtons() {
  const editBtn = document.getElementById('user-edit-btn');
  const statusBtn = document.getElementById('user-status-btn');
  if (!editBtn || !statusBtn) return;

  if (selectedUserId) {
    editBtn.disabled = false;
    statusBtn.disabled = false;
    const user = USERS.find(u => u.id === selectedUserId);
    statusBtn.innerHTML = user && user.status === 'Inactive' ? '✅ Activate User' : '🚫 Deactivate User';
  } else {
    editBtn.disabled = true;
    statusBtn.disabled = true;
  }
}

function openAddUserModal() {
  selectedUserId = null;
  document.querySelectorAll('#users-tbody tr').forEach(tr => tr.classList.remove('selected'));
  updateUserActionButtons();

  document.getElementById('user-modal-title').textContent = '👤 Add New User';
  document.getElementById('user-modal-id').value = '';
  document.getElementById('user-name').value = '';
  document.getElementById('user-email').value = '';
  document.getElementById('user-role').value = 'Staff';

  document.getElementById('user-modal-overlay').classList.add('on');
  document.getElementById('user-modal').classList.add('open');
}

function openEditUserModal() {
  if (!selectedUserId) return;
  const user = USERS.find(u => u.id === selectedUserId);
  if (!user) return;

  document.getElementById('user-modal-title').textContent = '✏️ Edit User Details';
  document.getElementById('user-modal-id').value = user.id;
  document.getElementById('user-name').value = user.name;
  document.getElementById('user-email').value = user.email;
  document.getElementById('user-role').value = user.role;

  document.getElementById('user-modal-overlay').classList.add('on');
  document.getElementById('user-modal').classList.add('open');
}

function closeUserModal() {
  document.getElementById('user-modal-overlay').classList.remove('on');
  document.getElementById('user-modal').classList.remove('open');
}

function saveUser() {
  const id = document.getElementById('user-modal-id').value;
  const name = document.getElementById('user-name').value.trim();
  const email = document.getElementById('user-email').value.trim();
  const role = document.getElementById('user-role').value;

  if (!name || !email) {
    alert('Please fill in all required fields.');
    return;
  }

  if (id) {
    // Edit existing
    const user = USERS.find(u => u.id === id);
    if (user) {
      user.name = name;
      user.email = email;
      user.role = role;
    }
  } else {
    // Add new
    const newUser = {
      id: 'u' + Date.now(),
      name,
      email,
      role,
      status: 'Active',
      lastLogin: 'Never'
    };
    USERS.push(newUser);
  }

  closeUserModal();
  renderUsersSection();
}

function toggleUserStatus() {
  if (!selectedUserId) return;
  const user = USERS.find(u => u.id === selectedUserId);
  if (!user) return;

  user.status = user.status === 'Active' ? 'Inactive' : 'Active';
  renderUsersSection();
}

window.renderUsersSection = renderUsersSection;
window.selectUserRow = selectUserRow;
window.openAddUserModal = openAddUserModal;
window.openEditUserModal = openEditUserModal;
window.closeUserModal = closeUserModal;
window.saveUser = saveUser;
window.toggleUserStatus = toggleUserStatus;
