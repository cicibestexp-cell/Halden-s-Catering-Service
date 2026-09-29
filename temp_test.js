function test() {
  var container = document.getElementById('exec-planner-phases');
  if (!container) return;

  var res = RESERVATIONS.find(function (r) { return r.id === activeResDetailId; });
  if (!res || !res.executionPlan || !res.executionPlan.phases) return;

  var staffList = (res._execStaffList) ||
                  ((res.staffing && res.staffing.assignments) || []).map(function (a) {
                    return { staffId: a.staffId, staffName: a.staffName || a.staffId, roles: [] };
                  });

  var phases = res.executionPlan.phases;

  var phaseColors = {
    'departure':  '#c49a3c',
    'deployment': '#3b82f6',
    'execution':  '#22c55e',
    'bashout':    '#ef4444',
    'restorage':  '#a855f7'
  };

  // Phase selector row
  var html = '<div style="display:flex;gap:15px;overflow-x:auto;padding-bottom:15px;margin-bottom:20px;border-bottom:1px solid var(--border);">';
  phases.forEach(function (p, idx) {
    var isAct    = idx === activeExecPhaseIdx;
    var tasksList = p.tasks || [];
    var tot      = tasksList.length;
    var filled   = tasksList.filter(function (t) { return t.staffIds && t.staffIds.length > 0; }).length;
    var pct      = tot > 0 ? Math.round((filled / tot) * 100) : 0;
    var accent   = phaseColors[p.id] || '#c49a3c';
    var lbadge   = p.locked
      ? '<div style="font-size:9px;background:rgba(34,197,94,0.15);color:#22c55e;padding:2px 6px;border-radius:10px;">LOCKED</div>'
      : '<div style="font-size:9px;background:rgba(255,255,255,0.05);padding:2px 6px;border-radius:10px;color:var(--text-dim);">UPCOMING</div>';
    html +=
      '<div onclick="selectExecPhase(' + idx + ')"' +
      ' style="min-width:180px;flex-shrink:0;background:' + (isAct?'rgba(255,255,255,0.05)':'var(--bg2)') + ';' +
      'border:1px solid ' + (isAct?accent:'var(--border)') + ';border-radius:12px;padding:15px;cursor:pointer;transition:all 0.3s;position:relative;overflow:hidden;">' +
      '<div style="position:absolute;left:0;top:0;bottom:0;width:4px;background:' + accent + ';"></div>' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">' +
        '<div style="font-size:12px;font-weight:800;color:' + (isAct?accent:'var(--cream)') + ';text-transform:uppercase;line-height:1.2;">' + p.name + '</div>' +
        lbadge +
      '</div>' +
      '<div style="font-size:10px;color:var(--text-dim);margin-bottom:10px;">' + p.start + ' - ' + p.end + '</div>' +
      '<div style="font-size:10px;color:var(--text-mid);">' + filled + '/' + tot + ' Activities (' + pct + '%)</div>' +
      '</div>';
  });
  html += '</div>';

  // Active phase detail
  var p = phases[activeExecPhaseIdx];
  if (p) {
    var locked = !!p.locked;
    var mkTime = function(field, val) {
      if (locked) return '<input type="time" value="' + val + '" readonly disabled class="input-field" style="padding:6px 10px;font-size:13px;width:110px;opacity:0.5;cursor:not-allowed;">';
      return '<input type="time" value="' + val + '" oninput="updateExecPhaseField(' + activeExecPhaseIdx + ',\'' + field + '\',this.value)" class="input-field" style="padding:6px 10px;font-size:13px;width:110px;">';
    };

    var tasksHtml = (p.tasks || []).map(function (t, tIdx) {
      var chips = staffList.length > 0
        ? staffList.map(function (a) {
            var asgn = (t.staffIds || []).indexOf(a.staffId) !== -1;
            return '<div onclick="toggleStaffInTask(' + activeExecPhaseIdx + ',' + tIdx + ',\'' + a.staffId + '\')"' +
              ' style="cursor:pointer;padding:6px 14px;border-radius:20px;font-size:11px;' +
              'background:' + (asgn?'var(--gold)':'rgba(255,255,255,0.04)') + ';' +
              'color:' + (asgn?'#000':'var(--text-dim)') + ';' +
              'border:1px solid ' + (asgn?'var(--gold)':'var(--border)') + ';' +
              'font-weight:' + (asgn?'700':'500') + ';transition:all 0.2s;">' +
              (asgn?'[assigned]':'+') + ' ' + a.staffName + '</div>';
          }).join('')
        : '<div style="font-size:11px;color:var(--text-dim);font-style:italic;">No staff assigned to this event yet.</div>';
      return '<div style="background:rgba(255,255,255,0.02);border-radius:10px;padding:15px;border:1px solid rgba(255,255,255,0.05);">' +
        '<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">' +
          '<div style="width:10px;height:10px;border-radius:50%;background:var(--gold);flex-shrink:0;"></div>' +
          '<input type="text" value="' + escHtml(t.text || '') + '" oninput="updateExecTaskField(' + activeExecPhaseIdx + ',' + tIdx + ',this.value)" class="input-field"' +
          ' style="padding:6px;font-size:13px;flex:1;font-weight:700;background:transparent;border:none;border-bottom:1px solid var(--border);border-radius:0;" placeholder="Activity name...">' +
          '<button onclick="removeTaskFromPhase(' + activeExecPhaseIdx + ',' + tIdx + ')" style="background:none;border:none;color:var(--red);cursor:pointer;font-size:14px;opacity:0.6;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.6">X</button>' +
        '</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:8px;padding-left:22px;">' + chips + '</div></div>';
    }).join('');

    var agendaHtml = '';
    if (p.id === 'execution') {
      var agItems = (p.agenda || []).map(function (a, aIdx) {
        return '<div style="background:rgba(255,255,255,0.02);border-radius:10px;padding:15px;border:1px solid rgba(255,255,255,0.05);">' +
          '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">' +
            '<input type="time" value="' + (a.time||p.start) + '" min="' + p.start + '" max="' + p.end + '"' +
            ' onchange="updateExecAgendaTime(' + activeExecPhaseIdx + ',' + aIdx + ',this.value)"' +
            ' style="background:rgba(0,0,0,0.2);border:1px solid var(--border);color:var(--gold);padding:6px 10px;border-radius:6px;font-size:12px;font-weight:700;">' +
            '<select onchange="updateExecAgendaType(' + activeExecPhaseIdx + ',' + aIdx + ',this.value)"' +
            ' style="background:rgba(0,0,0,0.2);border:1px solid var(--border);color:var(--cream);padding:6px 10px;border-radius:6px;font-size:12px;width:110px;">' +
              '<option value="Arrival"' + (a.type==='Arrival'?' selected':'') + '>Arrival</option>' +
              '<option value="Program"' + (a.type==='Program'?' selected':'') + '>Program</option>' +
              '<option value="Catering"' + (a.type==='Catering'?' selected':'') + '>Catering</option>' +
              '<option value="Buffer"' + (a.type==='Buffer'?' selected':'') + '>Buffer</option>' +
              '<option value="Custom"' + (a.type==='Custom'||!a.type?' selected':'') + '>Custom</option>' +
            '</select>' +
            '<input type="text" value="' + escHtml(a.text||'') + '" oninput="updateExecAgendaField(' + activeExecPhaseIdx + ',' + aIdx + ',this.value)" class="input-field"' +
            ' style="padding:6px;font-size:13px;flex:1;min-width:200px;font-weight:700;background:transparent;border:none;border-bottom:1px solid var(--border);border-radius:0;" placeholder="Agenda Item Name...">' +
            '<button onclick="removeAgendaFromPhase(' + activeExecPhaseIdx + ',' + aIdx + ')" style="background:none;border:none;color:var(--red);cursor:pointer;font-size:14px;opacity:0.6;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.6">X</button>' +
          '</div></div>';
      }).join('');
      agendaHtml =
        '<div style="margin-top:40px;border-top:1px solid rgba(255,255,255,0.1);padding-top:30px;">' +
          '<div style="font-size:11px;color:var(--text-dim);margin-bottom:15px;text-transform:uppercase;font-weight:700;letter-spacing:0.5px;">Execution Agenda (Event Flow)</div>' +
          '<div style="display:flex;flex-direction:column;gap:15px;">' +
            agItems +
            '<button onclick="addAgendaToPhase(' + activeExecPhaseIdx + ')"' +
            ' style="background:rgba(255,255,255,0.02);border:1px dashed var(--border);color:var(--gold);border-radius:10px;padding:15px;font-size:12px;cursor:pointer;margin-top:5px;font-weight:600;"' +
            ' onmouseover=\"this.style.background=\'rgba(196,154,60,0.05)\';this.style.borderColor=\'var(--gold)\';\"' +
            ' onmouseout=\"this.style.background=\'rgba(255,255,255,0.02)\';this.style.borderColor=\'var(--border)\';\">+ Add Agenda Item</button>' +
          '</div></div>';
    }

    html +=
      '<div style="background:var(--bg3);border:1px solid var(--border);border-radius:12px;padding:25px;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;border-bottom:1px solid var(--border);padding-bottom:15px;">' +
          '<div>' +
            '<div style="font-size:11px;color:var(--gold);text-transform:uppercase;font-weight:800;letter-spacing:1px;margin-bottom:4px;">Current Phase Details</div>' +
            '<div style="font-size:18px;font-weight:800;color:var(--cream);text-transform:uppercase;">' + p.name + '</div>' +
          '</div>' +
          '<div style="display:flex;gap:10px;align-items:center;">' +
            '<div class="form-group" style="margin:0;"><label style="font-size:10px;margin-bottom:2px;">Start</label>' + mkTime('start', p.start) + '</div>' +
            '<div class="form-group" style="margin:0;"><label style="font-size:10px;margin-bottom:2px;">End</label>' + mkTime('end', p.end) + '</div>' +
            (locked ? '<div style="font-size:10px;color:var(--text-dim);background:rgba(255,255,255,0.05);padding:4px 8px;border-radius:4px;white-space:nowrap;">Locked &mdash; update via reservation time range</div>' : '') +
          '</div>' +
        '</div>' +
        '<div>' +
          '<div style="font-size:11px;color:var(--text-dim);margin-bottom:15px;text-transform:uppercase;font-weight:700;letter-spacing:0.5px;">Activities &amp; Dedicated Staffing</div>' +
          '<div style="display:flex;flex-direction:column;gap:15px;">' +
            tasksHtml +
            '<button onclick="addTaskToPhase(' + activeExecPhaseIdx + ')"' +
            ' style="background:rgba(255,255,255,0.02);border:1px dashed var(--border);color:var(--gold);border-radius:10px;padding:15px;font-size:12px;cursor:pointer;margin-top:5px;font-weight:600;"' +
            ' onmouseover=\"this.style.background=\'rgba(196,154,60,0.05)\';this.style.borderColor=\'var(--gold)\';\"' +
            ' onmouseout=\"this.style.background=\'rgba(255,255,255,0.02)\';this.style.borderColor=\'var(--border)\';\">+ Add New Activity to ' + p.name + '</button>' +
          '</div>' +
        '</div>' +
        agendaHtml +
      '</div>';
  }

  container.innerHTML = html;
}