import sys

with open(r'c:\Users\Admin\Desktop\SMARTSERVE\app.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the start line for replacement
start_idx = -1
for i, line in enumerate(lines):
    if 'Venue Surcharge' in line and 'surcharge.toLocaleString' in line:
        start_idx = i + 1
        break

end_idx = -1
for i in range(start_idx, len(lines)):
    if '// ===== SIGN OUT =====' in lines[i]:
        end_idx = i - 3
        break

if start_idx != -1 and end_idx != -1:
    new_content = r'''              <div style="height:1px; background:#eee; grid-column:1/-1; margin:4px 0;"></div>
              <div style="color:#c49a3c; font-weight:700;">Subtotal</div><div style="color:#c49a3c; font-weight:700;">₱${subtotal.toLocaleString()}</div>
            </div>
          </div>
          
          <div style="background:#fff; border:1px solid #eee; border-radius:12px; padding:18px;">
            <div style="font-size:11px; color:#c49a3c; font-weight:700; text-transform:uppercase; margin-bottom:12px; letter-spacing:1px;">Payment Fulfillment Status</div>
            <div style="display:flex; flex-direction:column; gap:12px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="font-size:12px; color:#333;">Initial Reservation Fee</div>
                <div style="font-size:11px; font-weight:700; color:${initialPaid ? '#27ae60' : '#888'};">${initialPaid ? ' Paid' : 'Pending'}</div>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="font-size:12px; color:#333;">Downpayment (50%)</div>
                <div style="font-size:11px; font-weight:700; color:${dpPaid ? '#27ae60' : '#888'};">${dpPaid ? ' Paid' : 'Pending'}</div>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="font-size:12px; color:#333;">Final Payment (50%)</div>
                <div style="font-size:11px; font-weight:700; color:#888;">Pending</div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT: Adjustments & Total -->
        <div style="display:flex; flex-direction:column; gap:20px;">
          <div style="background:#fff; border:1px solid #eee; border-radius:12px; padding:18px;">
            <div style="font-size:11px; color:#c49a3c; font-weight:700; text-transform:uppercase; margin-bottom:12px; letter-spacing:1px;">Additional Adjustments</div>
            <div style="display:grid; grid-template-columns:1fr auto; gap:8px 16px; font-size:13px;">
              <div style="color:#888;">Overtime (${overtimeHrs} hrs)</div><div style="color:#333; font-weight:600;">₱${overtimeTotal.toLocaleString()}</div>
              <div style="color:#888;">Extra Guests (${extraPax} pax)</div><div style="color:#333; font-weight:600;">₱${extraPaxTotal.toLocaleString()}</div>
              ${assess.notes ? `<div style="grid-column:1/-1; margin-top:10px; padding-top:10px; border-top:1px solid #eee; font-size:12px; color:#666; line-height:1.4;"><strong>Notes:</strong> ${assess.notes}</div>` : ''}
            </div>
          </div>

          <div style="background:#fdfaf5; border:1px solid #c49a3c; border-radius:12px; padding:20px;">
            <div style="font-size:11px; color:#c49a3c; font-weight:700; text-transform:uppercase; margin-bottom:14px; letter-spacing:1px;">Grand Total Summary</div>
            <div style="display:grid; grid-template-columns:1fr auto; gap:8px 16px; font-size:14px;">
              <div style="color:#333; font-weight:700;">Grand Total</div><div style="color:#333; font-weight:700;">₱${grandTotal.toLocaleString()}</div>
              <div style="color:#27ae60;">Amount Paid</div><div style="color:#27ae60; font-weight:600;">- ₱${paidSoFar.toLocaleString()}</div>
              <div style="height:1px; background:#c49a3c; grid-column:1/-1; margin:6px 0;"></div>
              <div style="color:#c49a3c; font-weight:800; font-size:16px;">Balance Due</div><div style="color:#c49a3c; font-weight:800; font-size:16px;">₱${balanceDue.toLocaleString()}</div>
            </div>
          </div>
          <div style="font-size:10px; color:#888; line-height:1.5; padding:0 5px;">
            * Balance due is the remaining amount to be settled on or before the event day. Overtime is charged at ₱1,000/hr and extra pax at ₱450/head.
          </div>
        </div>
      </div>
    `;
  } else if (panel === 'logistics') {
    const log = mt.live_draft_logistics || { eventFlow: [], guests: [], seatingElements: [] };
    const ef = log.eventFlow || [];
    const gl = log.guests || [];
    const se = log.seatingElements || [];
    const pax = parseInt(mt.live_draft ? mt.live_draft.pax : (res.pax || 0)) || 0;
    
    const totalChairs = se.filter(el => el.type === 'chair').length;
    const totalTables = se.filter(el => el.type && el.type.includes('table')).length;
    const vipChairs = se.filter(el => el.type === 'chair' && el.vip).length;
    
    const renderSVG = () => {
      let svg = '<svg width="100%" height="320" style="background:#fdfaf5; border:1px solid #e8dcc8; border-radius:12px;" viewBox="0 0 1600 1200">';
      se.forEach(el => {
         if (el.type === 'table-round') {
            svg += `<circle cx="${el.x}" cy="${el.y}" r="${el.size || 80}" fill="rgba(196,154,60,0.8)" stroke="#9a6d08" stroke-width="3"/>
                    <text x="${el.x}" y="${el.y}" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-weight="bold" font-size="28">${el.label || ''}</text>`;
         } else if (el.type === 'table-rect') {
            const w = el.size || 120;
            const h = (el.size || 120) * 0.6;
            svg += `<rect x="${el.x - w/2}" y="${el.y - h/2}" width="${w}" height="${h}" fill="rgba(196,154,60,0.8)" stroke="#9a6d08" stroke-width="3" rx="8"/>
                    <text x="${el.x}" y="${el.y}" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-weight="bold" font-size="28">${el.label || ''}</text>`;
         } else if (el.type === 'chair') {
            svg += `<circle cx="${el.x}" cy="${el.y}" r="${el.size || 25}" fill="${el.vip ? '#c49a3c' : '#fdfaf5'}" stroke="#c49a3c" stroke-width="2"/>
                    <text x="${el.x}" y="${el.y}" text-anchor="middle" dominant-baseline="middle" fill="${el.vip ? '#fff' : '#333'}" font-size="16">${el.label || ''}</text>`;
         }
      });
      svg += '</svg>';
      return svg;
    };

    content.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:20px; font-family:\\'Inter\\', sans-serif;">
        <!-- TOP: Agenda -->
        <div style="background:#fdfaf5; border:1px solid #e8dcc8; border-radius:12px; padding:20px;">
          <div style="font-size:11px; color:#c49a3c; font-weight:800; text-transform:uppercase; margin-bottom:4px; letter-spacing:1px;">EXECUTION AGENDA</div>
          <div style="font-size:14px; font-weight:700; color:#333; margin-bottom:16px;">Event Program Flow</div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${ef.length ? ef.map(p => `
              <div style="display:flex; gap:16px; padding:12px 16px; background:#fff; border:1px solid #e8dcc8; border-radius:8px; align-items:center;">
                <div style="font-size:12px; font-weight:800; color:#c49a3c; width:100px;">${p.time || '—'}</div>
                <div style="font-size:13px; color:#333; font-weight:600;">${p.text || '—'}</div>
              </div>
            `).join('') : '<div style="font-size:12px; color:#888;">No agenda items added yet.</div>'}
          </div>
        </div>

        <!-- MIDDLE: Capacity Bar -->
        <div style="display:flex; justify-content:space-between; align-items:center; background:#fdfaf5; border:1px solid #e8dcc8; border-radius:12px; padding:16px 24px;">
          <div style="display:flex; flex-direction:column; align-items:flex-start;">
            <div style="font-size:10px; font-weight:800; color:#c49a3c; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">TOTAL CAPACITY</div>
            <div style="font-size:15px; font-weight:800; color:#b12f2f;">${totalChairs} <span style="font-size:12px; font-weight:600; color:#333;">/ ${pax} Chairs</span></div>
          </div>
          <div style="display:flex; flex-direction:column; align-items:flex-start;">
            <div style="font-size:10px; font-weight:800; color:#c49a3c; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">VIP CAPACITY</div>
            <div style="font-size:15px; font-weight:800; color:#c49a3c;">${vipChairs} <span style="font-size:12px; font-weight:600; color:#333;">Chairs</span></div>
          </div>
          <div style="display:flex; flex-direction:column; align-items:flex-start;">
            <div style="font-size:10px; font-weight:800; color:#c49a3c; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">TABLES PLACED</div>
            <div style="font-size:15px; font-weight:800; color:#b12f2f;">${totalTables} <span style="font-size:12px; font-weight:600; color:#333;">Tables</span></div>
          </div>
          <div style="display:flex; flex-direction:column; align-items:flex-end;">
            <div style="font-size:10px; font-weight:800; color:#c49a3c; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">GUEST LIST PROGRESS</div>
            <div style="font-size:15px; font-weight:800; color:#333;">${gl.length} <span style="font-size:12px; font-weight:600; color:#333;">/ ${pax} Names Listed</span></div>
          </div>
        </div>

        <!-- BOTTOM: Guests & Venue -->
        <div style="display:grid; grid-template-columns:1fr 1.2fr; gap:20px;">
          <!-- GUEST LIST -->
          <div style="border:1px solid #e8dcc8; border-radius:12px; overflow:hidden; display:flex; flex-direction:column; background:#fff;">
            <div style="background:#4a3b2c; padding:16px; color:#fff;">
              <div style="font-size:15px; font-weight:700;">List of Guests</div>
              <div style="font-size:11px; opacity:0.8; margin-top:2px;">Provided by customer</div>
            </div>
            <div style="padding:16px; display:flex; flex-direction:column; gap:10px; max-height:355px; overflow-y:auto; background:#fff;">
              ${gl.length ? gl.map(g => `
                <div style="display:grid; grid-template-columns:1.5fr 1fr 1fr; gap:12px; padding:12px; border-radius:8px; background:#fdfaf5; border:1px solid #e8dcc8; align-items:center;">
                  <div style="font-size:13px; font-weight:700; color:#333;">${g.name || 'Unnamed'}</div>
                  <div style="font-size:12px; font-weight:600; color:#555;">${g.status || 'Ordinary'}</div>
                  <div style="font-size:12px; font-weight:700; color:#c49a3c;">${g.table || 'Unassigned'}</div>
                </div>
              `).join('') : '<div style="font-size:12px; color:#888; text-align:center; padding:20px;">No guests listed yet.</div>'}
            </div>
          </div>
          
          <!-- VENUE LAYOUT -->
          <div style="border:1px solid #e8dcc8; border-radius:12px; overflow:hidden; display:flex; flex-direction:column; background:#fff;">
            <div style="background:#4a3b2c; padding:16px; color:#fff;">
              <div style="font-size:15px; font-weight:700;">Venue Layout</div>
              <div style="font-size:11px; opacity:0.8; margin-top:2px;">Live view of the layout being designed by the admin</div>
            </div>
            <div style="padding:16px; background:#fff;">
              ${renderSVG()}
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    content.innerHTML = `<div style="padding:60px; text-align:center; color:#aaa;">Loading ${panel} details...</div>`;
  }
  
  if (activeCustomerMeeting) {
    syncCustomerSharedDocs(activeCustomerMeeting);
  }
}
'''
    # Combine everything
    lines = lines[:start_idx] + [new_content + '\n'] + lines[end_idx:]
    with open(r'c:\Users\Admin\Desktop\SMARTSERVE\app.js', 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print(f"Successfully patched app.js from index {start_idx} to {end_idx}")
else:
    print(f"Could not find start or end index. start={start_idx}, end={end_idx}")
