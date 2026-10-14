$content = Get-Content -Path "c:\Users\USER\Desktop\SMARTSERVE\app.js" -Encoding UTF8 -Raw

$injectLogic = @"
      const mapId = 'c-mt-rd-map-' + Date.now();

      const totalContract = parseFloat(res.totalPrice || res.amount || 0);
      const isMalabon = [res.venue, res.venueName, res.venueAddress, res.venueAddr, res.city].map(s => String(s||'').toLowerCase()).join(' ').includes('malabon');
      let otc = isMalabon ? 0 : parseFloat(res.outOfTownCharge || res.out_of_town_charge || 0);
      if (!isMalabon && otc <= 0 && totalContract > 0) otc = Math.round(totalContract * 0.05);
      if (sb) {
        try {
          const { data: pList } = await sb.from('reservation_payments').select('*').eq('reservation_id', res.id);
          if (pList) {
            const otcFromPayments = pList.filter(p=>p.type==='Out of Town Charge').reduce((sum,p)=>sum+Number(p.amount||0),0);
            if (otcFromPayments > 0) otc = otcFromPayments;
          }
        } catch(e){}
      }
      const baseTotal = (otc > 0 && totalContract >= otc) ? totalContract - otc : totalContract;
      const dpAmt = Math.round(baseTotal * 0.5);
      const finalAmt = (baseTotal - dpAmt) + otc;
      const finalFmt = finalAmt.toLocaleString(undefined, {minimumFractionDigits:2,maximumFractionDigits:2});
"@

$content = $content.Replace("      const mapId = 'c-mt-rd-map-' + Date.now();", $injectLogic)


$oldHtml = @"
        + '<div style="padding:12px 20px;grid-column:1/-1;border-top:1px solid #e8dcc8;"><div style="font-size:10px;color:#888;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:3px;">Venue</div><div style="font-size:13px;font-weight:600;color:#333;">' + (venueAddr||':') + '</div></div>'
        + '</div></div>'
"@

$newHtml = @"
        + '<div style="padding:12px 20px;grid-column:1/-1;border-top:1px solid #e8dcc8;"><div style="font-size:10px;color:#888;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:3px;">Venue</div><div style="font-size:13px;font-weight:600;color:#333;">' + (venueAddr||':') + '</div></div>'
        + '<div style="padding:16px 20px;grid-column:1/-1;border-top:1px solid #e8dcc8;background:#fff;text-align:center;"><div style="font-size:10px;color:#888;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:3px;">Final Balance Remaining</div><div style="font-size:24px;font-weight:800;color:#c49a3c;">₱' + finalFmt + '</div></div>'
        + '</div></div>'
"@

$content = $content.Replace($oldHtml, $newHtml)

Set-Content -Path "c:\Users\USER\Desktop\SMARTSERVE\app.js" -Value $content -Encoding UTF8
