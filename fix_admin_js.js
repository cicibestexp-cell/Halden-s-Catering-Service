const fs = require('fs');
let content = fs.readFileSync('c:/Users/Admin/Desktop/SMARTSERVE/admin.js', 'utf8');

const insertedStr = `function openEditUserModal() {
  if (!selectedUserId) return;
  const list = currentUserTab === 'staff' ? USERS : CUSTOMERS;
  const user = list.find(u => u.id === selectedUserId);
  if (!user) return;

  document.getElementById('user-modal-title').textContent = '  Edit User Details';
  document.getElementById('user-modal-id').value = user.id;
  
  const nameParts = (user.name || '').split(' ');
  document.getElementById('user-fname').value = nameParts[0] || '';
  document.getElementById('user-lname').value = nameParts.slice(1).join(' ') || '';
  document.getElementById('user-mname').value = user.mname || '';
  document.getElementById('user-phone').value = user.phone || '';
  document.getElementById('user-email').value = user.email || '';
  document.getElementById('user-password').value = '';
  document.getElementById('user-password').type = 'password';
  document.getElementById('user-role').value = user.role || 'Staff';

  document.getElementById('user-modal-overlay').classList.add('on');
  document.getElementById('user-modal').classList.add('open');
}

function toggleUserModalPassword() {
  const input = document.getElementById('user-password');
  input.type = input.type === 'password' ? 'text' : 'password';
}

function autoGeneratePassword() {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const nums = "0123456789";
  const specs = "!@#$%^&*()";
  let pass = "";
  pass += nums[Math.floor(Math.random() * nums.length)];
  pass += specs[Math.floor(Math.random() * specs.length)];
  for (let i = 0; i < 6; i++) pass += chars[Math.floor(Math.random() * chars.length)];
  pass = pass.split('').sort(() => 0.5 - Math.random()).join('');
  document.getElementById('user-password').value = pass;
  document.getElementById('user-password').type = 'text';
}`;

// Remove the incorrect insertion which is followed by "\r\n\r\nasync function fetchCustomers()"
content = content.replace(insertedStr + '\r\n\r\n', '');
content = content.replace(insertedStr + '\n\n', '');
content = content.replace(insertedStr, ''); // just in case

const oldOpenEditStr = `function openEditUserModal() {
  if (!selectedUserId) return;
  const list = currentUserTab === 'staff' ? USERS : CUSTOMERS;
  const user = list.find(u => u.id === selectedUserId);
  if (!user) return;

  document.getElementById('user-modal-title').textContent = '  Edit User Details';
  document.getElementById('user-modal-id').value = user.id;
  document.getElementById('user-name').value = user.name;
  document.getElementById('user-email').value = user.email;
  document.getElementById('user-role').value = user.role;

  document.getElementById('user-modal-overlay').classList.add('on');
  document.getElementById('user-modal').classList.add('open');
}`;

content = content.replace(oldOpenEditStr, insertedStr);

fs.writeFileSync('c:/Users/Admin/Desktop/SMARTSERVE/admin.js', content, 'utf8');
console.log('Fixed admin.js');
