const fs = require('fs');

const code = `
// ── TRANSPO TAB & ADD-ON PERSONNEL LOGIC ──
window.editingAddonPersonnel = [];

function renderAddonPersonnelRows() {
  const container = document.getElementById('ac-addon-personnel-list');
  if (!container) return;
  if (window.editingAddonPersonnel.length === 0) {
    container.innerHTML = '<div style="font-size:12px; color:var(--text-dim); text-align:center;">No personnel assigned.</div>';
    return;
  }
  container.innerHTML = window.editingAddonPersonnel.map((p, idx) => \`
    <div style="background:var(--bg3); border:1px solid var(--border); border-radius:8px; padding:12px; display:flex; flex-direction:column; gap:10px; position:relative;">
      <button type="button" onclick="removeAddonPersonnelRow(\${idx})" style="position:absolute; top:8px; right:8px; background:rgba(239,68,68,0.15); color:var(--red); border:none; width:24px; height:24px; border-radius:4px; cursor:pointer;">✕</button>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div><label style="font-size:10px; color:var(--text-dim);">Full Name</label><input type="text" class="input-field" value="\${p.full_name || ''}" onchange="window.editingAddonPersonnel[\${idx}].full_name = this.value" placeholder="e.g. John Doe"></div>
        <div><label style="font-size:10px; color:var(--text-dim);">Email</label><input type="email" class="input-field" value="\${p.email || ''}" onchange="window.editingAddonPersonnel[\${idx}].email = this.value"></div>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div><label style="font-size:10px; color:var(--text-dim);">Phone Number</label><input type="text" class="input-field" value="\${p.contact_number || ''}" onchange="window.editingAddonPersonnel[\${idx}].contact_number = this.value" placeholder="+63..." pattern="\\\\+63\\\\d{10}"></div>
        <div><label style="font-size:10px; color:var(--text-dim);">Rate (₱)</label><input type="number" class="input-field" value="\${p.rate || ''}" onchange="window.editingAddonPersonnel[\${idx}].rate = this.value" min="0"></div>
      </div>
      <div><label style="font-size:10px; color:var(--text-dim);">Description</label><input type="text" class="input-field" value="\${p.description || ''}" onchange="window.editingAddonPersonnel[\${idx}].description = this.value"></div>
    </div>
  \`).join('');
}

function addAddonPersonnelRow() {
  window.editingAddonPersonnel.push({ full_name: '', email: '', contact_number: '+63', rate: '', description: '' });
  renderAddonPersonnelRows();
}

function removeAddonPersonnelRow(idx) {
  window.editingAddonPersonnel.splice(idx, 1);
  renderAddonPersonnelRows();
}

let adminTranspoList = [];
async function renderAdminTranspoTab() {
  const grid = document.getElementById('admin-transpo-grid');
  if (!grid) return;
  const sb = window.supabaseClient;
  if (!sb) return;

  const q = document.getElementById('admin-transpo-search')?.value.toLowerCase().trim() || '';
  
  try {
    const { data, error } = await sb.from('personnel').select('*').eq('service_type', 'transportation');
    if (error) throw error;
    adminTranspoList = data || [];
    
    let filtered = adminTranspoList;
    if (q) {
      filtered = filtered.filter(p => 
        (p.full_name||'').toLowerCase().includes(q) || 
        (p.email||'').toLowerCase().includes(q) || 
        (p.contact_number||'').toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      grid.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-dim);">No transportation personnel found.</div>';
      return;
    }

    grid.innerHTML = filtered.map(p => \`
      <div class="admin-cat-card \${p.availability_status === 'Unavailable' ? 'hidden' : ''}" style="background:var(--bg2); border:1px solid var(--border); border-radius:12px; padding:18px; display:flex; flex-direction:column; justify-content:space-between; \${p.availability_status === 'Unavailable' ? 'opacity:0.6;' : ''}">
        <div>
          <div style="font-size:16px; font-weight:700; color:var(--cream); margin-bottom:4px;">\${p.full_name} \${p.availability_status === 'Unavailable' ? '<span style="color:var(--red); font-size:12px;">(Disabled)</span>' : ''}</div>
          <div style="font-size:12px; color:var(--text-dim); margin-bottom:2px;">📧 \${p.email || 'N/A'}</div>
          <div style="font-size:12px; color:var(--text-dim); margin-bottom:2px;">📞 \${p.contact_number || 'N/A'}</div>
          <div style="font-size:14px; font-weight:600; color:var(--gold); margin-top:8px;">₱\${parseFloat(p.rate||0).toLocaleString()} / event</div>
          \${p.description ? \`<div style="font-size:12px; color:var(--text-dim); margin-top:8px; line-height:1.4;">\${p.description}</div>\` : ''}
        </div>
        <div style="display:flex; gap:8px; margin-top:16px; padding-top:12px; border-top:1px solid rgba(255,255,255,0.05);">
          <button class="btn-outline" style="flex:1; font-size:11px; padding:6px;" onclick="openEditTranspoModal('\${p.id}')">Edit Details</button>
          <button class="btn-outline" style="flex:1; font-size:11px; padding:6px; color:var(--red); border-color:var(--red);" onclick="disableTranspo('\${p.id}', \${p.availability_status === 'Unavailable'})">
            \${p.availability_status === 'Unavailable' ? 'Enable' : 'Disable'}
          </button>
        </div>
      </div>
    \`).join('');
  } catch (e) {
    console.error(e);
    grid.innerHTML = '<div style="color:var(--red); padding:20px;">Failed to load.</div>';
  }
}

window.renderAdminTranspoTab = renderAdminTranspoTab;

function openAddTranspoModal() {
  document.getElementById('transpo-item-id').value = '';
  document.getElementById('transpo-name').value = '';
  document.getElementById('transpo-email').value = '';
  document.getElementById('transpo-phone').value = '';
  document.getElementById('transpo-rate').value = '';
  document.getElementById('transpo-desc').value = '';
  document.getElementById('admin-transpo-modal-title').textContent = 'Add Transportation';
  document.getElementById('admin-transpo-modal-overlay').classList.add('on');
  document.getElementById('admin-transpo-modal').classList.add('open');
}
window.openAddTranspoModal = openAddTranspoModal;

function openEditTranspoModal(id) {
  const p = adminTranspoList.find(x => x.id === id);
  if (!p) return;
  document.getElementById('transpo-item-id').value = p.id;
  document.getElementById('transpo-name').value = p.full_name || '';
  document.getElementById('transpo-email').value = p.email || '';
  document.getElementById('transpo-phone').value = (p.contact_number || '').replace('+63', '');
  document.getElementById('transpo-rate').value = p.rate || '';
  document.getElementById('transpo-desc').value = p.description || '';
  document.getElementById('admin-transpo-modal-title').textContent = 'Edit Transportation';
  document.getElementById('admin-transpo-modal-overlay').classList.add('on');
  document.getElementById('admin-transpo-modal').classList.add('open');
}
window.openEditTranspoModal = openEditTranspoModal;

function closeAdminTranspoModal() {
  document.getElementById('admin-transpo-modal-overlay').classList.remove('on');
  document.getElementById('admin-transpo-modal').classList.remove('open');
}
window.closeAdminTranspoModal = closeAdminTranspoModal;

async function saveAdminTranspo() {
  const id = document.getElementById('transpo-item-id').value;
  const name = document.getElementById('transpo-name').value.trim();
  const email = document.getElementById('transpo-email').value.trim();
  const phoneStr = document.getElementById('transpo-phone').value.trim();
  const rate = parseFloat(document.getElementById('transpo-rate').value) || 0;
  const desc = document.getElementById('transpo-desc').value.trim();

  if (!name) return alert('Full Name is required');
  if (!email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) return alert('Valid email address is required');
  if (!phoneStr || phoneStr.length !== 10 || isNaN(phoneStr)) return alert('Phone number must be exactly 10 digits after +63');

  const contact_number = '+63' + phoneStr;
  const payload = {
    full_name: name,
    email: email,
    contact_number: contact_number,
    rate: rate,
    description: desc,
    service_type: 'transportation',
    pricing_type: 'per_event',
    availability_status: 'Available'
  };

  const sb = window.supabaseClient;
  try {
    if (id) {
      // Don't overwrite availability_status if editing an existing record.
      delete payload.availability_status;
      const { error } = await sb.from('personnel').update(payload).eq('id', id);
      if (error) throw error;
    } else {
      const { error } = await sb.from('personnel').insert([payload]);
      if (error) throw error;
    }
    closeAdminTranspoModal();
    renderAdminTranspoTab();
  } catch (e) {
    alert('Save failed: ' + e.message);
  }
}
window.saveAdminTranspo = saveAdminTranspo;

async function disableTranspo(id, isCurrentlyDisabled) {
  const sb = window.supabaseClient;
  if (!sb) return;
  
  if (!isCurrentlyDisabled) {
    // Check if assigned to any active reservations
    try {
      const { data, error } = await sb.from('reservations').select('id, package').eq('transportation_driver_id', id);
      if (error) throw error;
      if (data && data.length > 0) {
        alert("This person is currently assigned to \"" + (data[0].package || 'an active event') + "\" and thus cant be disabled at the moment.");
        return;
      }
    } catch (e) {
      console.error(e);
      alert("Failed to verify reservation assignments.");
      return;
    }
  }

  try {
    const newStatus = isCurrentlyDisabled ? 'Available' : 'Unavailable';
    const { error } = await sb.from('personnel').update({ availability_status: newStatus }).eq('id', id);
    if (error) throw error;
    renderAdminTranspoTab();
  } catch (e) {
    alert('Failed to update status: ' + e.message);
  }
}
window.disableTranspo = disableTranspo;
`;

fs.appendFileSync('admin.js', '\n' + code + '\n');
console.log('Appended successfully');
