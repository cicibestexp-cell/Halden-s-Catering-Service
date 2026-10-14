import sys

with open('C:/Users/USER/Desktop/SMARTSERVE/admin.js', 'r', encoding='utf-8') as f:
    content = f.read()

target1 = """            <td style="font-size:12px;color:var(--text-dim);">1 ${a.unitType}</td>
            <td><span style="font-size:11px; color:${condColors[sub.condition]}">: ${sub.condition}</span> <span class="badge ${statColors[iStat] || 'pending'}" style="font-size:10px; margin-left:4px;">${iStat}</span></td>
            <td style="font-size:12px;">?${a.unitCost.toLocaleString()}</td>
            <td style="font-size:12px; color:var(--gold);">?${(a.shoppingCost||0).toLocaleString()}</td>
            <td>${supplierTxt}</td>
            <td></td>
            <td><span style="font-size:10px; color:var(--text-dim);">Unit Level</span></td>"""

replace1 = """            <td style="font-size:12px;color:var(--text-dim);">1</td>
            <td style="font-size:12px;color:var(--text-dim);">1</td>
            <td style="font-size:12px;color:var(--text-dim); text-transform:capitalize;">${a.fragility || 'non-fragile'}</td>
            <td><span style="font-size:11px; color:${condColors[sub.condition]}">? ${sub.condition}</span> <span class="badge ${statColors[iStat] || 'pending'}" style="font-size:10px; margin-left:4px;">${iStat}</span></td>
            <td style="font-size:12px;color:var(--text-dim);">${a.unitType || 'pcs'}</td>
            <td style="font-size:12px;">?${a.unitCost.toLocaleString()}</td>
            <td style="font-size:12px; color:var(--gold);">?${(a.shoppingCost||0).toLocaleString()}</td>
            <td>${supplierTxt}</td>
            <td><span style="font-size:12px; color:var(--text-dim);">${a.addedDate || '—'}</span></td>
            <td><span style="font-size:10px; color:var(--text-dim);">Unit Level</span></td>"""

target1_alt = """            <td style="font-size:12px;color:var(--text-dim);">1 ${a.unitType}</td>
            <td><span style="font-size:11px; color:${condColors[sub.condition]}">: ${sub.condition}</span> <span class="badge ${statColors[iStat] || 'pending'}" style="font-size:10px; margin-left:4px;">${iStat}</span></td>
            <td style="font-size:12px;">?${a.unitCost.toLocaleString()}</td>
            <td style="font-size:12px; color:var(--gold);">?${(a.shoppingCost||0).toLocaleString()}</td>
            <td>${supplierTxt}</td>
            <td></td>
            <td><span style="font-size:10px; color:var(--text-dim);">Unit Level</span></td>"""

target1_alt2 = """            <td style="font-size:12px;color:var(--text-dim);">1 ${a.unitType}</td>
            <td><span style="font-size:11px; color:${condColors[sub.condition]}">? ${sub.condition}</span> <span class="badge ${statColors[iStat] || 'pending'}" style="font-size:10px; margin-left:4px;">${iStat}</span></td>
            <td style="font-size:12px;">?${a.unitCost.toLocaleString()}</td>
            <td style="font-size:12px; color:var(--gold);">?${(a.shoppingCost||0).toLocaleString()}</td>
            <td>${supplierTxt}</td>
            <td></td>
            <td><span style="font-size:10px; color:var(--text-dim);">Unit Level</span></td>"""


target2 = """            <td style="font-size:12px;color:var(--text-dim);">${sub.quantity}</td>
            <td>
              <span style="font-size:11px; color:${condColors[sub.condition]}">? ${sub.condition}</span> 
              <span class="badge ${statColors[iStat] || 'pending'}" style="font-size:10px; margin-left:4px;">${iStat}</span>
            </td>
            <td style="font-size:12px;color:var(--text-dim);">${sub.unitType || 'pcs'}</td>"""

replace2 = """            <td style="font-size:12px;color:var(--text-dim);">${sub.quantity}</td>
            <td style="font-size:12px;color:var(--text-dim);">${(sub.good_qty || sub.quantity || 0) - (sub.maintenance_qty || 0)}</td>
            <td style="font-size:12px;color:var(--text-dim); text-transform:capitalize;">${sub.fragility || 'non-fragile'}</td>
            <td>
              <span style="font-size:11px; color:${condColors[sub.condition]}">? ${sub.condition}</span> 
              <span class="badge ${statColors[iStat] || 'pending'}" style="font-size:10px; margin-left:4px;">${iStat}</span>
            </td>
            <td style="font-size:12px;color:var(--text-dim);">${sub.unitType || 'pcs'}</td>"""


if target1 in content:
    content = content.replace(target1, replace1)
elif target1_alt in content:
    content = content.replace(target1_alt, replace1)
elif target1_alt2 in content:
    content = content.replace(target1_alt2, replace1)
else:
    print("Could not find target1")

if target2 in content:
    content = content.replace(target2, replace2)
else:
    print("Could not find target2")

with open('C:/Users/USER/Desktop/SMARTSERVE/admin.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done python script")
