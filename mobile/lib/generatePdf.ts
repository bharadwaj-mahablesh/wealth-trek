import { NetWorthSnapshot, UserProfile } from '@/types';

function formatCurrency(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Crore`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} Lakh`;
  return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function generateNetWorthHtml(snapshot: NetWorthSnapshot, profile: UserProfile): string {
  const assets = snapshot.entries.filter((e) => e.category === 'asset');
  const liabilities = snapshot.entries.filter((e) => e.category === 'liability');

  const assetRows = assets.map((e) => `
    <tr>
      <td>${e.statementType}</td>
      <td>${e.description || '-'}</td>
      <td style="text-align:right">${e.ownershipPercentage}%</td>
      <td style="text-align:right; color:#16a34a; font-weight:600">${formatCurrency(e.closingBalance * (e.ownershipPercentage / 100))}</td>
    </tr>
  `).join('');

  const liabilityRows = liabilities.map((e) => `
    <tr>
      <td>${e.statementType}</td>
      <td>${e.description || '-'}</td>
      <td style="text-align:right">${e.ownershipPercentage}%</td>
      <td style="text-align:right; color:#dc2626; font-weight:600">${formatCurrency(e.closingBalance * (e.ownershipPercentage / 100))}</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Net Worth Statement</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, 'Helvetica Neue', sans-serif; background: #f7f8fa; color: #1a1e24; padding: 40px; }
    .header { text-align: center; margin-bottom: 40px; }
    .header h1 { font-size: 28px; color: #1a6b8a; font-weight: 800; letter-spacing: -0.5px; }
    .header p { color: #64748b; margin-top: 4px; }
    .profile-card { background: #ffffff; border-radius: 12px; border: 1px solid #d8dde5; padding: 20px; margin-bottom: 24px; }
    .profile-card h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 12px; }
    .profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .profile-item label { font-size: 11px; color: #64748b; display: block; margin-bottom: 2px; }
    .profile-item span { font-size: 14px; font-weight: 600; color: #1a1e24; }
    .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
    .summary-card { background: #ffffff; border-radius: 12px; border: 1px solid #d8dde5; padding: 16px; text-align: center; }
    .summary-card .label { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
    .summary-card .value { font-size: 20px; font-weight: 800; }
    .assets .value { color: #16a34a; }
    .liabilities .value { color: #dc2626; }
    .net-worth .value { color: #1a6b8a; }
    table { width: 100%; border-collapse: collapse; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #d8dde5; margin-bottom: 24px; }
    th { background: #f7f8fa; padding: 12px 16px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; border-bottom: 1px solid #d8dde5; }
    td { padding: 12px 16px; font-size: 13px; border-bottom: 1px solid #eef0f4; }
    tr:last-child td { border-bottom: none; }
    .section-title { font-size: 16px; font-weight: 700; color: #1a1e24; margin-bottom: 10px; margin-top: 24px; }
    .footer { text-align: center; margin-top: 40px; color: #64748b; font-size: 11px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Wealth Trek</h1>
    <p>Personal Net Worth Statement</p>
  </div>

  <div class="profile-card">
    <h2>Profile</h2>
    <div class="profile-grid">
      <div class="profile-item">
        <label>Name</label>
        <span>${profile.fullName || 'Not provided'}</span>
      </div>
      <div class="profile-item">
        <label>As On Date</label>
        <span>${formatDate(snapshot.date)}</span>
      </div>
      ${profile.address ? `
      <div class="profile-item">
        <label>Address</label>
        <span>${profile.address}</span>
      </div>` : ''}
    </div>
  </div>

  <div class="summary">
    <div class="summary-card assets">
      <div class="label">Total Assets</div>
      <div class="value">${formatCurrency(snapshot.totalAssets)}</div>
    </div>
    <div class="summary-card liabilities">
      <div class="label">Total Liabilities</div>
      <div class="value">${formatCurrency(snapshot.totalLiabilities)}</div>
    </div>
    <div class="summary-card net-worth">
      <div class="label">Net Worth</div>
      <div class="value">${formatCurrency(snapshot.netWorth)}</div>
    </div>
  </div>

  ${assets.length > 0 ? `
  <div class="section-title">Assets</div>
  <table>
    <thead>
      <tr>
        <th>Type</th>
        <th>Description</th>
        <th style="text-align:right">Ownership</th>
        <th style="text-align:right">Value</th>
      </tr>
    </thead>
    <tbody>${assetRows}</tbody>
  </table>` : ''}

  ${liabilities.length > 0 ? `
  <div class="section-title">Liabilities</div>
  <table>
    <thead>
      <tr>
        <th>Type</th>
        <th>Description</th>
        <th style="text-align:right">Ownership</th>
        <th style="text-align:right">Amount</th>
      </tr>
    </thead>
    <tbody>${liabilityRows}</tbody>
  </table>` : ''}

  <div class="footer">
    <p>Generated by Wealth Trek on ${formatDate(new Date().toISOString())}</p>
    <p>This statement is for personal reference only.</p>
  </div>
</body>
</html>
  `;
}
