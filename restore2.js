const fs = require("fs");
const path = "C:/Users/USER/Desktop/SMARTSERVE/admin.js";
let code = fs.readFileSync(path, "utf8");

// 2. generateAutoLogisticsMilestones
const oldMilestoneStr = `function generateAutoLogisticsMilestones(res) {`;
const newMilestoneStr = `function generateAutoLogisticsMilestones(res, meetings = []) {`;
code = code.replace(oldMilestoneStr, newMilestoneStr);

const oldMilestoneBlock = `    const mDays = Math.max(1, Math.ceil((endCursor - currentCursor) / (1000 * 60 * 60 * 24)) + 1);
    def.activities.forEach((act, actIdx) => {
      const dayOffset = actIdx % mDays;
      const taskDate = new Date(currentCursor);
      taskDate.setDate(taskDate.getDate() + dayOffset);

      // Strict task date clamping: never on or after eventObj
      if (taskDate >= eventObj) {
        taskDate.setTime(deadlineObj.getTime());
      }

      tasks.push({
        id: 'auto-' + def.id + '-' + actIdx + '-' + Math.random().toString(36).substr(2, 5),
        milestoneId: def.id,
        title: act,
        date: normalizeDateKey(taskDate),
        status: 'pending',
        type: 'auto',
        color: def.color // Store color in task for calendar
      });
    });`;

const newMilestoneBlock = `    const mDays = Math.max(1, Math.ceil((endCursor - currentCursor) / (1000 * 60 * 60 * 24)) + 1);
    
    let actsToProcess = def.activities.slice();
    
    if (def.id === 'meeting') {
      actsToProcess = [];
      const standardAgendas = ['Contract finalization', 'Food tasting', 'Additional reservation discussion', 'Design and decorations to be selected', 'Payment Assessment', 'Final program rundown'];
      const scheduledAgendas = new Set();
      
      if (meetings && meetings.length > 0) {
        meetings.forEach((mtg) => {
          const agendas = (mtg.agenda || '').split(',').map(s => s.trim()).filter(Boolean);
          agendas.forEach((ag) => {
            scheduledAgendas.add(ag.toLowerCase());
            actsToProcess.push({
              title: ag,
              date: mtg.date || normalizeDateKey(currentCursor),
              autoCheck: mtg.status === 'completed',
              linkTo: 'meetings'
            });
          });
        });
      }
      
      standardAgendas.forEach(std => {
        if (!scheduledAgendas.has(std.toLowerCase())) {
          actsToProcess.push({
            title: std,
            isPlaceholder: true,
            autoCheck: false,
            linkTo: 'meetings'
          });
        }
      });
    }

    actsToProcess.forEach((act, actIdx) => {
      let taskDateStr = '';
      let title = '';
      let autoCheck = false;
      let linkTo = null;

      if (typeof act === 'string') {
        const dayOffset = actIdx % mDays;
        const taskDate = new Date(currentCursor);
        taskDate.setDate(taskDate.getDate() + dayOffset);
        if (taskDate >= eventObj) taskDate.setTime(deadlineObj.getTime());
        taskDateStr = normalizeDateKey(taskDate);
        title = act;
        if (def.id === 'payment') linkTo = 'billing';
      } else {
        if (act.isPlaceholder) {
          const dayOffset = actIdx % mDays;
          const taskDate = new Date(currentCursor);
          taskDate.setDate(taskDate.getDate() + dayOffset);
          if (taskDate >= eventObj) taskDate.setTime(deadlineObj.getTime());
          taskDateStr = normalizeDateKey(taskDate);
        } else {
          taskDateStr = act.date;
        }
        title = act.title;
        autoCheck = act.autoCheck || false;
        linkTo = act.linkTo || null;
      }

      tasks.push({
        id: 'auto-' + def.id + '-' + actIdx + '-' + Math.random().toString(36).substr(2, 5),
        milestoneId: def.id,
        title: title,
        date: taskDateStr,
        status: 'pending',
        type: 'auto',
        color: def.color,
        autoCheck: autoCheck,
        linkTo: linkTo
      });
    });`;
code = code.replace(oldMilestoneBlock, newMilestoneBlock);

// 3. executeReschedule
const oldExecuteReschedule = `async function executeReschedule() {
  const res = RESERVATIONS.find(function (r) { return r.id === activeResDetailId; });
  if (!res) return;

  const newDateStr = document.getElementById('resd-resched-date').value;
  const newTimeStr = document.getElementById('resd-resched-time').value;
  const newDpStr = document.getElementById('resd-resched-dp').value;
  const reason = document.getElementById('resd-resched-reason').value.trim();

  if (!newDateStr) return alert("Please select a new event date.");
  if (!newTimeStr) return alert("Please provide a new time range.");
  if (!reason) return alert("Please provide a reason for the rescheduling.");

  const oldDateStr = res.date;
  const extra = getActiveReservationExtra();

  // 1. Preserve existing task statuses
  const statusMap = {};
  if (extra && extra.timelineTasks) {
    extra.timelineTasks.forEach(t => {
      if (t.status !== 'pending') {
        statusMap[t.title] = t.status;
      }
    });
  }

  // 2. Temporarily update res properties for the generation
  const oldResPayload = { date: res.date, time: res.time, downpaymentDueDate: res.downpaymentDueDate };
  res.date = newDateStr;
  res.time = newTimeStr;
  res.downpaymentDueDate = newDpStr;

  // 3. Re-run automatic milestone generation
  const genResult = generateAutoLogisticsMilestones(res);
  
  if (extra) {
    extra.logisticsMilestones = genResult.milestones;
    extra.timelineTasks = genResult.tasks;

    // 4. Restore preserved statuses & check for weekends
    let weekendAlertShown = false;
    let weekendCount = 0;
    
    extra.timelineTasks.forEach(t => {
      // Restore status
      if (statusMap[t.title]) {
        t.status = statusMap[t.title];
      }
      
      // Check for weekends
      const d = new Date(t.date);
      const dayOfWeek = d.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekendCount++;
      }
    });

    if (weekendCount > 0) {
      alert(\`Warning: The new even spread placed \${weekendCount} rescheduled tasks on weekends (Saturday/Sunday). Please review the calendar.\`);
    }

    await saveLogisticsData();
  }

  // 5. Build payload and update main document
  const payload = {
    date: newDateStr,
    time: newTimeStr,
    downpaymentDueDate: newDpStr
  };
  
  try {
    const { doc, updateDoc } = window.firebaseFns;
    await updateDoc(doc(window.firebaseDB, 'reservations', res.id), payload);
    Object.assign(res, payload);
    
    // 6. Log the change
    const logs = ensureReservationLifecycleLogs(res);
    logs.push({
      id: 'log-' + Date.now() + '-' + Math.random().toString(16).slice(2, 6),
      category: 'system',
      message: \`Reservation rescheduled from \${oldDateStr} to \${newDateStr}. Reason: \${reason}\`,
      at: new Date().toISOString()
    });
    await updateDoc(doc(window.firebaseDB, 'reservations', res.id), { activityLogs: logs });

    showToast('Reservation successfully rescheduled.');
    renderReservationTimelineView();
  } catch (e) {
    console.error(e);
    alert('Failed to save reschedule changes. Check console.');
    // Revert temporary changes
    Object.assign(res, oldResPayload);
  }
}`;

const newExecuteReschedule = `window._initialRescheduleValues = null;

function renderReschedulePanel(res) {
  const todayStr = normalizeDateKey(new Date());
  const dateEl = document.getElementById('resd-resched-date');
  const timeStartEl = document.getElementById('resd-resched-time-start');
  const timeEndEl = document.getElementById('resd-resched-time-end');
  const dpEl = document.getElementById('resd-resched-dp');
  const reasonEl = document.getElementById('resd-resched-reason');
  
  if(dateEl) { dateEl.value = res.date || ''; dateEl.min = todayStr; }
  
  let tStart = '', tEnd = '';
  if (res.time) {
    const parts = res.time.split('-').map(p => p.trim());
    tStart = parts[0] || '';
    tEnd = parts[1] || '';
  }
  if(timeStartEl) timeStartEl.value = tStart;
  if(timeEndEl) timeEndEl.value = tEnd;
  
  if(dpEl) { dpEl.value = res.downpaymentDueDate || ''; dpEl.min = todayStr; }
  if(reasonEl) reasonEl.value = '';

  window._initialRescheduleValues = {
    date: dateEl ? dateEl.value : '',
    timeStart: tStart,
    timeEnd: tEnd,
    dp: dpEl ? dpEl.value : ''
  };
  
  validateRescheduleForm();
}

function validateRescheduleForm() {
  const dateEl = document.getElementById('resd-resched-date');
  const timeStartEl = document.getElementById('resd-resched-time-start');
  const timeEndEl = document.getElementById('resd-resched-time-end');
  const dpEl = document.getElementById('resd-resched-dp');
  const reasonEl = document.getElementById('resd-resched-reason');
  const confirmBtn = document.getElementById('resd-resched-confirm-btn');
  const discardBtn = document.getElementById('resd-resched-discard-btn');
  
  if (!window._initialRescheduleValues || !confirmBtn || !discardBtn) return;

  const curDate = dateEl ? dateEl.value : '';
  const curStart = timeStartEl ? timeStartEl.value : '';
  const curEnd = timeEndEl ? timeEndEl.value : '';
  const curDp = dpEl ? dpEl.value : '';
  const reason = reasonEl ? reasonEl.value.trim() : '';

  const isChanged = curDate !== window._initialRescheduleValues.date ||
                    curStart !== window._initialRescheduleValues.timeStart ||
                    curEnd !== window._initialRescheduleValues.timeEnd ||
                    curDp !== window._initialRescheduleValues.dp ||
                    reason !== '';

  if (isChanged) {
    discardBtn.disabled = false;
    discardBtn.style.opacity = '1';
    discardBtn.style.cursor = 'pointer';
    
    if (curDate && curStart && curEnd && reason) {
      confirmBtn.disabled = false;
      confirmBtn.style.opacity = '1';
      confirmBtn.style.cursor = 'pointer';
    } else {
      confirmBtn.disabled = true;
      confirmBtn.style.opacity = '0.5';
      confirmBtn.style.cursor = 'not-allowed';
    }
  } else {
    discardBtn.disabled = true;
    discardBtn.style.opacity = '0.5';
    discardBtn.style.cursor = 'not-allowed';
    confirmBtn.disabled = true;
    confirmBtn.style.opacity = '0.5';
    confirmBtn.style.cursor = 'not-allowed';
  }
}
window.validateRescheduleForm = validateRescheduleForm;

function discardRescheduleForm() {
  if (!window._initialRescheduleValues) return;
  const res = RESERVATIONS.find(r => r.id === activeResDetailId);
  if (res) renderReschedulePanel(res);
}
window.discardRescheduleForm = discardRescheduleForm;

async function executeReschedule() {
  const res = RESERVATIONS.find(function (r) { return r.id === activeResDetailId; });
  if (!res) return;

  const newDateStr = document.getElementById('resd-resched-date').value;
  const startStr = document.getElementById('resd-resched-time-start').value;
  const endStr = document.getElementById('resd-resched-time-end').value;
  const newTimeStr = \`\${startStr} - \${endStr}\`;
  const newDpStr = document.getElementById('resd-resched-dp').value;
  const reason = document.getElementById('resd-resched-reason').value.trim();

  if (!newDateStr) return alert("Please select a new event date.");
  if (!startStr || !endStr) return alert("Please provide a valid time range.");
  if (!reason) return alert("Please provide a reason for the rescheduling.");

  const oldDateStr = res.date;
  const extra = getActiveReservationExtra();

  const statusMap = {};
  if (extra && extra.timelineTasks) {
    extra.timelineTasks.forEach(t => {
      if (t.status !== 'pending') {
        statusMap[t.title] = t.status;
      }
    });
  }

  const oldResPayload = { date: res.date, time: res.time, downpaymentDueDate: res.downpaymentDueDate };
  res.date = newDateStr;
  res.time = newTimeStr;
  res.downpaymentDueDate = newDpStr;

  const genResult = generateAutoLogisticsMilestones(res, MEETINGS.filter(m => m.reservationId === res.id));
  
  if (extra) {
    extra.logisticsMilestones = genResult.milestones;
    extra.timelineTasks = genResult.tasks;

    let weekendCount = 0;
    extra.timelineTasks.forEach(t => {
      if (statusMap[t.title]) t.status = statusMap[t.title];
      const dayOfWeek = new Date(t.date).getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) weekendCount++;
    });

    if (weekendCount > 0) alert(\`Warning: The new even spread placed \${weekendCount} rescheduled tasks on weekends (Saturday/Sunday). Please review the calendar.\`);
    await saveLogisticsData();
  }

  const payload = { date: newDateStr, time: newTimeStr, downpaymentDueDate: newDpStr };
  
  try {
    const { doc, updateDoc } = window.firebaseFns;
    await updateDoc(doc(window.firebaseDB, 'reservations', res.id), payload);
    Object.assign(res, payload);
    
    const logs = ensureReservationLifecycleLogs(res);
    logs.push({
      id: 'log-' + Date.now() + '-' + Math.random().toString(16).slice(2, 6),
      category: 'system',
      message: \`Reservation rescheduled from \${oldDateStr} to \${newDateStr}. Reason: \${reason}\`,
      at: new Date().toISOString()
    });
    await updateDoc(doc(window.firebaseDB, 'reservations', res.id), { activityLogs: logs });

    if (window.supabaseClient) {
      try {
        await window.supabaseClient.from('meetings')
          .update({ downpayment_due_date: newDpStr })
          .eq('reservationId', res.id);
      } catch (sbErr) { console.error('Failed to update downpayment date in Supabase', sbErr); }
    }

    showToast('Reservation successfully rescheduled.');
    renderReservationTimelineView();
  } catch (e) {
    console.error(e);
    alert('Failed to save reschedule changes. Check console.');
    Object.assign(res, oldResPayload);
  }
}`;

const renderReschedRegex = /function renderReschedulePanel\(res\) \{[\s\S]*?async function executeReschedule\(\) \{[\s\S]*?Object\.assign\(res, oldResPayload\);\n  \}\n\}/m;
code = code.replace(renderReschedRegex, newExecuteReschedule);

// 4. renderLogisticsActivities and timelineNavigate
const oldLogisticsRender = `function renderLogisticsActivities() {
  const el = document.getElementById('resd-timeline-activities');
  if (!el) return;

  if (!activeLogisticsMilestoneId) {
    el.innerHTML = '<div style="font-size:12px;color:var(--text-dim);padding:20px;text-align:center;background:rgba(255,255,255,0.02);border-radius:12px;border:1px dashed var(--border);">Select a milestone phase above to view its activities.</div>';
    return;
  }`;

const newLogisticsRender = `window._timelineTaskNavigate = function(linkTo) {
  if (linkTo === 'meetings') {
    const navEl = document.getElementById('nav-meetings');
    if (navEl && typeof showSection === 'function') showSection('meetings', navEl);
  } else if (linkTo === 'billing') {
    const navEl = document.getElementById('nav-billing');
    if (navEl && typeof showSection === 'function') showSection('billing', navEl);
  }
};

function renderLogisticsActivities() {
  const el = document.getElementById('resd-timeline-activities');
  if (!el) return;

  const tasks = getTimelineTasks().slice().sort((a, b) => String(a.date).localeCompare(String(b.date)));
  if (!tasks.length) {
    el.innerHTML = '<div style="font-size:12px;color:var(--text-dim);padding:20px;text-align:center;background:rgba(255,255,255,0.02);border-radius:12px;border:1px dashed var(--border);">No activities planned yet.</div>';
    return;
  }

  const dates = [...new Set(tasks.map(t => t.date))].filter(Boolean);
  if (!window._activeTimelineChecklistDate || !dates.includes(window._activeTimelineChecklistDate)) {
    const today = normalizeDateKey(new Date());
    const idx = dates.findIndex(d => d >= today);
    window._activeTimelineChecklistDate = dates[idx !== -1 ? idx : dates.length - 1];
  }

  const activeDate = window._activeTimelineChecklistDate;
  const curIdx = dates.indexOf(activeDate);
  const dayTasks = tasks.filter(t => t.date === activeDate);
  const doneCount = dayTasks.filter(t => t.status === 'done' || t.autoCheck).length;
  
  const dObj = new Date(activeDate + 'T00:00:00');
  const dateLabel = dObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();
  
  const todayKey = normalizeDateKey(new Date());
  let badgeHtml = '';
  if (activeDate === todayKey) badgeHtml = \`<span style="background:var(--gold-bg);color:var(--gold);padding:2px 6px;border-radius:4px;font-size:9px;font-weight:700;margin-left:8px;">TODAY</span>\`;
  else if (activeDate < todayKey && doneCount < dayTasks.length) badgeHtml = \`<span style="background:var(--red-bg);color:var(--red);padding:2px 6px;border-radius:4px;font-size:9px;font-weight:700;margin-left:8px;">OVERDUE</span>\`;

  let html = \`
    <div class="panel" style="margin:0;"><div class="panel-body" style="padding:18px;">
      <div style="margin-bottom:15px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--border); padding-bottom:10px;">
        <button onclick="changeTimelineChecklistDate(-1)" \${curIdx <= 0 ? 'disabled style="opacity:0.3;cursor:default;"' : 'style="cursor:pointer;"'} class="btn-outline">?</button>
        <div style="text-align:center;">
          <div style="font-size:14px; font-weight:800; color:var(--cream);">\${dateLabel} \${badgeHtml}</div>
          <div style="font-size:10px; color:var(--text-dim); margin-top:2px;">\${doneCount}/\${dayTasks.length} done</div>
        </div>
        <button onclick="changeTimelineChecklistDate(1)" \${curIdx >= dates.length - 1 ? 'disabled style="opacity:0.3;cursor:default;"' : 'style="cursor:pointer;"'} class="btn-outline">?</button>
      </div>
      <div style="display:flex; flex-direction:column; gap:8px;">
  \`;

  html += dayTasks.map(t => {
    const isDone = t.status === 'done' || t.autoCheck;
    const bg = isDone ? 'rgba(45, 138, 78, 0.05)' : 'var(--bg2)';
    const bColor = isDone ? '#2d8a4e' : 'var(--border)';
    const textColor = isDone ? 'var(--text-dim)' : 'var(--cream)';
    
    let msLabel = t.milestoneId ? t.milestoneId.toUpperCase() : '';
    let msColor = t.color || 'var(--gold)';
    
    return \`<div style="display:flex; align-items:center; gap:12px; padding:12px 16px; background:\${bg}; border:1px solid \${bColor}; border-radius:8px; transition:all 0.2s;">
      <input type="checkbox" 
        \${isDone ? 'checked' : ''} 
        \${t.autoCheck ? 'disabled' : \`onclick="updateTimelineTaskStatus('\${t.id}', this.checked ? 'done' : 'pending'); setTimeout(renderLogisticsActivities, 50);"\`}
        style="cursor:\${t.autoCheck ? 'default' : 'pointer'}; width:18px; height:18px; accent-color:#2d8a4e; margin:0;">
      
      <div style="flex:1; display:flex; align-items:center; gap:10px;">
        <div 
          \${t.linkTo ? \`onclick="window._timelineTaskNavigate('\${t.linkTo}')"\` : ''}
          style="font-size:13px; font-weight:600; color:\${textColor}; \${isDone ? 'text-decoration:line-through;' : ''} \${t.linkTo ? 'cursor:pointer; text-decoration:underline dashed rgba(255,255,255,0.3); text-underline-offset:4px;' : ''}"
        >
          \${escHtml(t.title || 'Activity')}
        </div>
        \${msLabel ? \`<span style="font-size:9px; font-weight:700; color:\${msColor}; border:1px solid \${msColor}; padding:1px 5px; border-radius:4px; opacity:0.8;">\${msLabel}</span>\` : ''}
      </div>
    </div>\`;
  }).join('');
  
  html += \`</div></div></div>\`;
  el.innerHTML = html;
}

window.changeTimelineChecklistDate = function(dir) {
  const tasks = getTimelineTasks().slice().sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const dates = [...new Set(tasks.map(t => t.date))].filter(Boolean);
  const activeDate = window._activeTimelineChecklistDate;
  let curIdx = dates.indexOf(activeDate);
  if (curIdx === -1) return;
  curIdx += dir;
  if (curIdx >= 0 && curIdx < dates.length) {
    window._activeTimelineChecklistDate = dates[curIdx];
    renderLogisticsActivities();
  }
};

function old_`;
code = code.replace(/function renderLogisticsActivities\(\) \{[\s\S]*?el\.innerHTML = `<div class="panel" style="margin:0;"><div class="panel-body" style="padding:18px;">\$\{content\}<\/div><\/div>`;\n\}/m, newLogisticsRender);

// 5. CF logic
const oldCfLogic = `  // Step 1: Quick check against in-memory reservation cache
  let isCfCompleted = false;
  const concludedRaw = String(res ? (res['mandatory-meeting concluded'] || '') : '').toLowerCase();
  if (concludedRaw.includes('contract finalization')) isCfCompleted = true;

  if (isCfCompleted) {
    if (cfCbEl) {
      cfCbEl.checked = true;
      cfCbEl.disabled = true;
      const cfLabel = cfCbEl.closest('label');
      if (cfLabel) {
        cfLabel.style.opacity = '0.7';
        cfLabel.style.cursor = 'not-allowed';
        cfLabel.title = 'Contract Finalization is already completed';
        if (!cfLabel.querySelector('.cf-done-badge')) {
          const badge = document.createElement('span');
          badge.className = 'cf-done-badge';
          badge.style.cssText = 'margin-left:8px;font-size:10px;background:var(--green);color:#fff;padding:2px 6px;border-radius:4px;font-weight:700;';
          badge.textContent = 'DONE';
          cfLabel.appendChild(badge);
        }
      }
      if (proposedSection) proposedSection.style.display = 'none';
    }
  } else {
    if (cfCbEl) {
      cfCbEl.disabled = false;
      const cfLabel = cfCbEl.closest('label');
      if (cfLabel) {
        cfLabel.style.opacity = '';
        cfLabel.style.cursor = '';
        cfLabel.title = '';
        const oldBadge = cfLabel.querySelector('.cf-done-badge');
        if (oldBadge) oldBadge.remove();
      }
      if (proposedSection) proposedSection.style.display = '';
    }
    if (!mtId && cfCbEl) cfCbEl.checked = true;
  }`;
const newCfLogic = `  // Helper to lock the Contract Finalization checkbox
  function lockCfCheckbox() {
    if (!cfCbEl) return;
    cfCbEl.checked = true;
    cfCbEl.disabled = true;
    const cfLabel = cfCbEl.closest('label');
    if (cfLabel) {
      cfLabel.style.opacity = '0.7';
      cfLabel.style.cursor = 'not-allowed';
      cfLabel.title = 'Contract Finalization is already completed';
      if (!cfLabel.querySelector('.cf-done-badge')) {
        const badge = document.createElement('span');
        badge.className = 'cf-done-badge';
        badge.style.cssText = 'margin-left:8px;font-size:10px;background:var(--green);color:#fff;padding:2px 6px;border-radius:4px;font-weight:700;';
        badge.textContent = 'DONE';
        cfLabel.appendChild(badge);
      }
    }
  }

  // Helper to unlock the Contract Finalization checkbox
  function unlockCfCheckbox() {
    if (!cfCbEl) return;
    cfCbEl.disabled = false;
    const cfLabel = cfCbEl.closest('label');
    if (cfLabel) {
      cfLabel.style.opacity = '';
      cfLabel.style.cursor = '';
      cfLabel.title = '';
      const oldBadge = cfLabel.querySelector('.cf-done-badge');
      if (oldBadge) oldBadge.remove();
    }
    if (proposedSection) proposedSection.style.display = '';
  }

  // Step 1: Verify CF status from Supabase
  let isCfCompleted = false;
  if (window.supabaseClient && resId && resId !== 'demo') {
    try {
      const { data } = await window.supabaseClient.from('meetings')
        .select('id')
        .eq('reservationId', resId)
        .eq('status', 'completed')
        .like('agenda', '%Contract finalization%')
        .limit(1);
      if (data && data.length > 0) isCfCompleted = true;
    } catch (e) { console.warn('CF check err', e); }
  } else {
    const concludedRaw = String(res ? (res['mandatory-meeting concluded'] || '') : '').toLowerCase();
    if (concludedRaw.includes('contract finalization')) isCfCompleted = true;
  }

  if (isCfCompleted) {
    lockCfCheckbox();
  } else {
    unlockCfCheckbox();
    if (!mtId && cfCbEl) cfCbEl.checked = true;
  }`;
code = code.replace(oldCfLogic, newCfLogic);


// 6. Fix the categorized packaging items and operational requirements. The property is `cat`, not `category`.
const oldPackageContent = `    packageContent = \`
      <div style="margin-bottom:40px;">
        <div style="font-size:12px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px;margin-bottom:15px; display:flex; justify-content:space-between; align-items:center;">
           <span>Included Items by Category</span>
           <span style="color:var(--gold); font-weight:700;">Package: \${escHtml(res.packageName || 'Package')}</span>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; align-items:start;">
           <div class="panel" style="margin:0;">
              <div class="panel-hdr" style="background:var(--bg3);"><div class="panel-title" style="font-size:11px;">Current Package Contents</div></div>
              <div id="resd-needs-list" style="padding:15px;">
                 \${(res.packageItems || []).map(item => \`
                   <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border);">
                      <div style="font-size:13px; color:var(--cream);">\${escHtml(item)}</div>
                      <div style="font-size:11px; color:var(--text-dim);">Included</div>
                   </div>
                 \`).join('')}
              </div>
           </div>
           <div class="panel" style="margin:0;">
              <div class="panel-hdr" style="background:var(--bg3);"><div class="panel-title" style="font-size:11px;">Operational Requirements</div></div>
              <div style="padding:15px;">\${getReservationNeedsMarkup(res)}</div>
           </div>
        </div>
      </div>
    \`;`;
const newPackageContent = `    let groupedHtml = '';
    const items = res.packageItems || [];
    if (items.length > 0) {
      const grouped = {};
      items.forEach(itemName => {
        let catStr = 'Other';
        if (typeof adminCatalog !== 'undefined') {
          const cItem = adminCatalog.find(c => c.name === itemName);
          if (cItem && cItem.cat) catStr = cItem.cat;
        }
        if (!grouped[catStr]) grouped[catStr] = [];
        grouped[catStr].push(itemName);
      });

      // We sort the keys so 'Other' is always at the bottom
      const sortedCats = Object.keys(grouped).sort((a, b) => {
        if (a.toLowerCase() === 'other') return 1;
        if (b.toLowerCase() === 'other') return -1;
        return a.localeCompare(b);
      });

      sortedCats.forEach(cat => {
        groupedHtml += \`<div style="font-size:11px; font-weight:800; color:var(--gold); margin:15px 0 5px 0; text-transform:uppercase; letter-spacing:1px;">\${escHtml(cat)}</div>\`;
        groupedHtml += grouped[cat].map(itemName => \`
          <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
             <div style="font-size:13px; color:var(--cream);">\${escHtml(itemName)}</div>
             <div style="font-size:11px; color:var(--text-dim);">Included</div>
          </div>
        \`).join('');
      });
    } else {
      groupedHtml = '<div style="font-size:12px; color:var(--text-dim);">No items found.</div>';
    }

    const opsContent = getReservationNeedsMarkup(res);
    const opsHtml = \`
      <details style="background:var(--bg3); border-radius:8px; border:1px solid var(--border); overflow:hidden;">
        <summary style="padding:15px; font-size:13px; font-weight:700; color:var(--cream); cursor:pointer; user-select:none; outline:none; display:flex; justify-content:space-between; align-items:center;">
          Operational Requirements
          <span style="font-size:10px; color:var(--text-dim);">Click to expand ?</span>
        </summary>
        <div style="padding:15px; border-top:1px solid var(--border); background:var(--bg2);">
          \${opsContent}
        </div>
      </details>
    \`;

    packageContent = \`
      <div style="margin-bottom:40px;">
        <div style="font-size:12px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px;margin-bottom:15px; display:flex; justify-content:space-between; align-items:center;">
           <span>Included Items by Category</span>
           <span style="color:var(--gold); font-weight:700;">Package: \${escHtml(res.packageName || 'Package')}</span>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; align-items:start;">
           <div class="panel" style="margin:0;">
              <div class="panel-hdr" style="background:var(--bg3);"><div class="panel-title" style="font-size:11px;">Current Package Contents</div></div>
              <div id="resd-needs-list" style="padding:0 15px 15px 15px;">
                 \${groupedHtml}
              </div>
           </div>
           <div style="margin:0;">
              \${opsHtml}
           </div>
        </div>
      </div>
    \`;`;
code = code.replace(oldPackageContent, newPackageContent);

fs.writeFileSync(path, code, "utf8");
console.log("Full restore and grouping logic complete.");
