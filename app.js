
// ===== DATA =====
const CAT = [
  {id:'f1',name:'Pork Dish',cat:'food',icon:'🥩',price:2500,desc:'Tender slow-cooked pork, serves ~20 pax'},
  {id:'f2',name:'Beef Dish',cat:'food',icon:'🥩',price:3000,desc:'Premium beef dish, serves ~20 pax'},
  {id:'f3',name:'Chicken Dish',cat:'food',icon:'🍗',price:2200,desc:'Classic Filipino chicken recipe, serves ~20 pax'},
  {id:'f4',name:'Fish Dish',cat:'food',icon:'🐟',price:2000,desc:'Fresh fish fillet, serves ~20 pax'},
  {id:'f5',name:'Vegetable Dish',cat:'food',icon:'🥦',price:1200,desc:'Seasonal vegetables, serves ~20 pax'},
  {id:'f6',name:'Pasta',cat:'food',icon:'🍝',price:1800,desc:'Creamy or tomato-based pasta, serves ~20 pax'},
  {id:'f7',name:'Special Pancit Canton',cat:'food',icon:'🍜',price:1500,desc:'Savory stir-fried noodles, serves ~20 pax'},
  {id:'f8',name:'Soup',cat:'food',icon:'🍲',price:1000,desc:'Hearty Filipino soup, serves ~20 pax'},
  {id:'f9',name:'Steamed Rice (Unlimited)',cat:'food',icon:'🍚',price:2000,desc:'Unlimited steamed rice for all guests'},
  {id:'d1',name:'Dessert Selection',cat:'dessert',icon:'🍮',price:1500,desc:'Assorted Filipino desserts, serves ~20 pax'},
  {id:'d2',name:'Spaghetti (Kids)',cat:'dessert',icon:'🍝',price:1200,desc:'Sweet Filipino spaghetti for kids'},
  {id:'d3',name:'Fried Chicken (Kids)',cat:'dessert',icon:'🍗',price:1400,desc:'Crispy fried chicken for kids'},
  {id:'d4',name:'Hotdog & Mallows (Kids)',cat:'dessert',icon:'🌭',price:900,desc:'Kid-favorite hotdog with marshmallows'},
  {id:'d5',name:'Unlimited Drinks',cat:'dessert',icon:'🥤',price:1800,desc:'Assorted soft drinks & juice, unlimited'},
  {id:'dc1',name:'Theme Stage Backdrop',cat:'decoration',icon:'🎭',price:5000,desc:'Custom printed theme backdrop for stage'},
  {id:'dc2',name:'Ceiling Balloon Treatment',cat:'decoration',icon:'🎈',price:3500,desc:'Balloon ceiling arrangement in theme colors'},
  {id:'dc3',name:'Table Centerpiece',cat:'decoration',icon:'💐',price:2500,desc:'Themed centerpiece per table (10 tables)'},
  {id:'dc4',name:'Entrance Theme Setup',cat:'decoration',icon:'🚪',price:3000,desc:'Decorated entrance arch with theme elements'},
  {id:'dc5',name:'Styro Name Cutouts',cat:'decoration',icon:'✂️',price:1500,desc:'Custom name/letters in styrofoam'},
  {id:'eq1',name:'Complete Catering Setup',cat:'equipment',icon:'🍽️',price:5000,desc:'Full catering equipment & centerpiece'},
  {id:'eq2',name:'Tables & Chairs w/ Cover',cat:'equipment',icon:'🪑',price:4500,desc:'Themed tables and chairs with ribbon covers'},
  {id:'eq3',name:'VIP Long Table Setup',cat:'equipment',icon:'🎪',price:2000,desc:'Special long table for VIP guests'},
  {id:'eq4',name:'Utensils & Glassware',cat:'equipment',icon:'🥄',price:1500,desc:'Complete utensil and glassware set'},
  {id:'eq5',name:'Waiter in Uniform',cat:'equipment',icon:'🤵',price:2500,desc:'Professionally uniformed waiter service'},
  {id:'eq6',name:'Full Lights & Sounds Setup',cat:'equipment',icon:'💡',price:8000,desc:'Complete audio-visual setup for events'},
  {id:'en1',name:'2x Clowns / Magician',cat:'entertainment',icon:'🤡',price:6000,desc:'2 professional clowns or magicians'},
  {id:'en2',name:'Game Prizes (20 pcs)',cat:'entertainment',icon:'🎁',price:2000,desc:'20 assorted game prizes for guests'},
  {id:'en3',name:'Face Painting (3hrs)',cat:'entertainment',icon:'🎨',price:3500,desc:'Professional face painting, 3 hours'},
  {id:'en4',name:'2x3 Photo Standee',cat:'entertainment',icon:'🖼️',price:2500,desc:'Custom printed 2x3 ft photo standee'},
  {id:'ph1',name:'Photobooth (2hrs Unlimited)',cat:'photography',icon:'📷',price:7000,desc:'Unlimited photobooth sessions for 2 hours'},
  {id:'ph2',name:'Photographer (Unlimited)',cat:'photography',icon:'📸',price:8000,desc:'Professional photographer, unlimited shots'},
  {id:'ph3',name:'Videographer (MTV Style)',cat:'photography',icon:'🎬',price:10000,desc:'Professional videographer, MTV-style output'},
];

const PKGS = [
  {name:'Kiddie Party Package B',tagline:'100 pax Plus • 30 Kids',price:'₱85,000',pax:'100 pax + 30 kids',icon:'🎉',badge:'Popular',inc:['Complete Catering Setup & Centerpiece','Tables & Chairs with Theme Cover','VIP Long Table Setup','Full Catering Equipment, Utensils & Glassware','Waiter in Uniform','5 Main Dishes (Pork/Beef, Chicken, Veggies, Fish, Pasta)','Special Pancit Canton, Soup & Dessert','Unlimited Drinks & Steamed Rice','Full Lights & Sounds Setup','Theme Backdrop, Balloon Ceiling, Centerpieces','Entrance Setup, Styro Name Cutouts','Photobooth (2hrs) + Photographer + MTV Videographer','2 Clowns/Magician + 2x3 Photo Standee','Face Painting (3hrs) + 20 Game Prizes','FREE Kiddie Meals: Spaghetti, Fried Chicken, Hotdog & Mallows']},
  {name:'Simple Celebration Package',tagline:'Budget-Friendly • 50 pax',price:'Starting ₱25,000',pax:'50 pax',icon:'🌸',badge:'Starter',inc:['Basic Catering Setup','Tables & Chairs','3 Main Dishes (Choice of menu)','Steamed Rice (Unlimited)','Soup & Dessert','Unlimited Drinks','Waiter in Uniform']},
  {name:'Custom Package',tagline:'Fully Personalized • Any size',price:'Quote on request',pax:'Any size',icon:'✦',badge:'Best Value',inc:['Choose any items from our full catalog','AI-powered recommendations based on your budget','Flexible guest count','Mix & match food, decor, entertainment & more','Personalized quotation from our team']},
];

// ===== STATE =====
let cart = [];
let curCat = 'all';
let aiPicks = null;

// ===== PACKAGES =====
function renderPkgs() {
  document.getElementById('pkgs-grid').innerHTML = PKGS.map(p=>`
    <div class="package-card">
      <div class="pkg-img">${p.icon}<span class="pkg-badge">${p.badge}</span></div>
      <div class="pkg-body">
        <div class="pkg-name">${p.name}</div>
        <div class="pkg-tagline">${p.tagline}</div>
        <div class="pkg-price">${p.price} <span>/ ${p.pax}</span></div>
        <ul class="pkg-list">${p.inc.map(i=>`<li>${i}</li>`).join('')}</ul>
        <button class="btn-pkg" onclick="go('#catalog')">Inquire / Book This Package</button>
      </div>
    </div>`).join('');
}

// ===== CATALOG =====
function renderCat() {
  const grid = document.getElementById('cat-grid');
  let items = curCat==='all' ? CAT : CAT.filter(i=>i.cat===curCat);
  if (!items.length) { grid.innerHTML=`<div class="cat-empty"><div>🔍</div><p>No items here.</p></div>`; return; }
  if (aiPicks) items = [...items].sort((a,b)=>aiPicks.includes(b.id)-aiPicks.includes(a.id));
  const pickCount = aiPicks ? items.filter(i=>aiPicks.includes(i.id)).length : items.length;
  document.getElementById('cat-count').innerHTML = aiPicks
    ? `<strong>${pickCount} AI picks</strong> · ${items.length} shown`
    : `<strong>${items.length}</strong> items`;
  grid.innerHTML = items.map(item=>{
    const inCart = cart.find(c=>c.id===item.id);
    const isPick = aiPicks && aiPicks.includes(item.id);
    const isDim  = aiPicks && !isPick;
    return `
      <div class="cat-card ${isPick?'ai-pick':''} ${isDim?'dimmed':''}">
        <div class="cat-thumb">${item.icon}<div class="pick-badge">✦ AI Pick</div></div>
        <div class="cat-info">
          <div class="cat-cat-lbl">${item.cat}</div>
          <div class="cat-n">${item.name}</div>
          <div class="cat-d">${item.desc}</div>
          <div class="cat-p">₱${item.price.toLocaleString()}</div>
          <button class="btn-add ${inCart?'added':''}" onclick="toggleItem('${item.id}')">
            ${inCart?'✓ Added':'+ Add to Package'}
          </button>
        </div>
      </div>`;
  }).join('');
}

function setCat(cat, btn) {
  document.querySelectorAll('.fb').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  curCat=cat; renderCat();
}

function jumpCat(cat) {
  curCat=cat;
  document.querySelectorAll('.fb').forEach(b=>{
    const matches = b.getAttribute('onclick')?.includes(`'${cat}'`) || (cat==='all' && b.textContent.trim()==='All');
    b.classList.toggle('active', !!matches);
  });
  renderCat(); go('#catalog');
}

// ===== CART =====
function toggleItem(id) {
  const item = CAT.find(i=>i.id===id);
  const idx = cart.findIndex(c=>c.id===id);
  if(idx>-1) cart.splice(idx,1);
  else { cart.push(item); document.getElementById('cart-drawer').classList.add('open'); }
  renderCat(); renderCart();
}

function removeItem(id) {
  cart=cart.filter(c=>c.id!==id);
  renderCat(); renderCart();
}

function renderCart() {
  document.getElementById('c-badge').textContent = cart.length;
  const el = document.getElementById('cart-items');
  const tot = document.getElementById('cart-tot');
  if(!cart.length){
    el.innerHTML=`<div class="cart-empty"><div>🛒</div><p>Your package is empty.<br>Add items from the catalog.</p></div>`;
    tot.textContent='₱0'; return;
  }
  tot.textContent='₱'+cart.reduce((s,i)=>s+i.price,0).toLocaleString();
  el.innerHTML=cart.map(item=>`
    <div class="c-item">
      <div class="c-ico">${item.icon}</div>
      <div class="c-inf"><div class="c-cat">${item.cat}</div><div class="c-n">${item.name}</div><div class="c-p">₱${item.price.toLocaleString()}</div></div>
      <button class="c-rm" onclick="removeItem('${item.id}')">✕</button>
    </div>`).join('');
}

function toggleCart(){ document.getElementById('cart-drawer').classList.toggle('open'); }

// ===== MOBILE NAV =====
function toggleMobileNav(){
  const nav = document.getElementById('mobile-nav');
  const ham = document.getElementById('hamburger');
  nav.classList.toggle('open');
  ham.classList.toggle('open');
}
function closeMobileNav(){
  document.getElementById('mobile-nav').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}

// ===== MOBILE AI DRAWER =====
function openMobAI(){
  document.getElementById('mob-ai-drawer').classList.add('open');
  document.getElementById('mob-overlay').classList.add('on');
  document.body.style.overflow='hidden';
}
function closeMobAI(){
  document.getElementById('mob-ai-drawer').classList.remove('open');
  document.getElementById('mob-overlay').classList.remove('on');
  document.body.style.overflow='';
}

// ===== AI =====
const API_URL = 'https://halden-s-catering-service.vercel.app/api/chat';

const SYS = `You are Halden's AI Event Planning Assistant for Halden's Event Management and Catering Service, a premium catering business in the Philippines, Please be limited to only answer in regards to anything about catering matters, if its not a catering matter then reply with I'm sorry I am only able to provide you with assistance in regards to planning your events, anything unrelated is something I can't help you with.

Your job: (1) Have a warm, helpful conversation to understand the client's event, and (2) after EVERY reply where you understand the event needs, output a JSON block of recommended catalog IDs so the website can highlight those items in real time.

CATALOG IDs:
food: f1=Pork Dish(₱2500), f2=Beef Dish(₱3000), f3=Chicken Dish(₱2200), f4=Fish Dish(₱2000), f5=Vegetable Dish(₱1200), f6=Pasta(₱1800), f7=Pancit Canton(₱1500), f8=Soup(₱1000), f9=Steamed Rice(₱2000)
dessert: d1=Dessert Selection(₱1500), d2=Spaghetti Kids(₱1200), d3=Fried Chicken Kids(₱1400), d4=Hotdog&Mallows Kids(₱900), d5=Unlimited Drinks(₱1800)
decoration: dc1=Theme Backdrop(₱5000), dc2=Ceiling Balloons(₱3500), dc3=Table Centerpiece(₱2500), dc4=Entrance Setup(₱3000), dc5=Styro Name(₱1500)
equipment: eq1=Catering Setup(₱5000), eq2=Tables&Chairs(₱4500), eq3=VIP Long Table(₱2000), eq4=Utensils(₱1500), eq5=Waiter(₱2500), eq6=Lights&Sounds(₱8000)
entertainment: en1=Clowns/Magician(₱6000), en2=Game Prizes(₱2000), en3=Face Painting(₱3500), en4=Photo Standee(₱2500)
photography: ph1=Photobooth(₱7000), ph2=Photographer(₱8000), ph3=Videographer(₱10000)

RULES:
- ALWAYS end every response with: {"recommended_ids":["id1","id2",...]}
- Include 5 to 12 IDs most relevant to the event
- do the filter function too if they talk in filipino/tagalog
- Kiddie party → always include: f3,f9,d5,d2,d3,d4,en1,en3,eq2,dc2
- Wedding → always include: f1,f2,f3,f9,d5,eq1,eq2,eq5,eq6,ph2,ph3,dc1
- Corporate → include: f2,f3,f9,d5,eq1,eq2,eq5,eq6
- Budget events (under ₱20k) → focus on food only
- Large events (100+ pax) → always include eq1,eq2,eq5,eq6
- Keep replies concise, warm, professional. Use ₱ for prices. Ask ONE question if needed. JSON always goes on its own line at the end.`;

// Shared message history — both panels share the same conversation
let hist = [{role:'system',content:SYS}];
let initialized = {desk:false, mob:false};

function initAI(panel) {
  if(initialized[panel]) return;
  initialized[panel] = true;
  const msgsId = panel==='desk' ? 'ai-msgs-desk' : 'ai-msgs-mob';
  addBot("Hi there! 👋 I'm Halden's AI Event Planner.\n\nDescribe your event below — the occasion, number of guests, budget, and any theme ideas — and I'll instantly highlight the most suitable items from our catalog for you. ✦", msgsId);
}

function addBot(txt, msgsId) {
  const c = document.getElementById(msgsId);
  if(!c) return;
  const d = document.createElement('div');
  d.className='ai-msg bot';
  d.innerHTML=`<div class="ai-msg-ico">✦</div><div class="ai-bub">${txt.replace(/\n/g,'<br>')}</div>`;
  c.appendChild(d); c.scrollTop=c.scrollHeight;
}

function addUser(txt, msgsId) {
  const c = document.getElementById(msgsId);
  if(!c) return;
  const d = document.createElement('div');
  d.className='ai-msg user';
  d.innerHTML=`<div class="ai-msg-ico">👤</div><div class="ai-bub">${txt.replace(/\n/g,'<br>')}</div>`;
  c.appendChild(d); c.scrollTop=c.scrollHeight;
}

function showTyping(msgsId) {
  const c = document.getElementById(msgsId);
  if(!c) return;
  const d = document.createElement('div');
  d.className='ai-msg bot'; d.id='typin-'+msgsId;
  d.innerHTML=`<div class="ai-msg-ico">✦</div><div class="ai-bub typing-dots"><span></span><span></span><span></span></div>`;
  c.appendChild(d); c.scrollTop=c.scrollHeight;
}
function hideTyping(msgsId) { document.getElementById('typin-'+msgsId)?.remove(); }

async function sendMsg(panel) {
  const inpId = panel==='desk' ? 'ai-inp-desk' : 'ai-inp-mob';
  const btnId = panel==='desk' ? 'ai-send-desk' : 'ai-send-mob';
  const msgsId = panel==='desk' ? 'ai-msgs-desk' : 'ai-msgs-mob';
  const chipsId = panel==='desk' ? 'ai-chips-desk' : 'ai-chips-mob';

  const inp = document.getElementById(inpId);
  const btn = document.getElementById(btnId);
  const txt = inp.value.trim();
  if(!txt) return;

  inp.value=''; inp.style.height='auto';
  document.getElementById(chipsId).style.display='none';
  addUser(txt, msgsId);
  btn.disabled=true; showTyping(msgsId);
  hist.push({role:'user',content:txt});

  try {
    const res = await fetch(API_URL,{
      method:'POST',
      headers:{'Content-Type':'application/json','HTTP-Referer':location.href,'X-Title':"Halden's AI Planner"},
      body:JSON.stringify({model:'arcee-ai/trinity-large-preview:free',messages:hist,max_tokens:900})
    });
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't connect. Please try again.";
    hist.push({role:'assistant',content:reply});
    hideTyping(msgsId);

    // Extract and apply picks
    const m = reply.match(/\{"recommended_ids"\s*:\s*\[.*?\]\}/s);
    let clean = reply;
    if(m) {
      try {
        const p = JSON.parse(m[0]);
        if(p.recommended_ids?.length) applyPicks(p.recommended_ids, txt);
        clean = reply.replace(m[0],'').trim();
      } catch(e){}
    }
    addBot(clean, msgsId);

    // Show AI notif badge on mobile fab when picks are applied
    if(aiPicks && panel==='desk') {
      const notif = document.getElementById('ai-notif');
      notif.textContent = aiPicks.length;
      notif.classList.add('on');
    }
  } catch(e) {
    hideTyping(msgsId);
    addBot("I'm having trouble connecting right now. Please try again in a moment.", msgsId);
  }
  btn.disabled=false;
}

function applyPicks(ids, query) {
  aiPicks=ids;
  const banner = document.getElementById('ai-banner');
  banner.classList.add('on');
  document.getElementById('aib-title').textContent=`✦ ${ids.length} items recommended for you`;
  document.getElementById('aib-desc').textContent=`Based on: "${query.substring(0,55)}${query.length>55?'...':''}"`;
  curCat='all';
  document.querySelectorAll('.fb').forEach(b=>b.classList.remove('active'));
  document.querySelector('.fb').classList.add('active');
  renderCat();
  document.getElementById('cat-panel').scrollTop=0;
  // On mobile, close AI drawer and scroll to catalog
  if(window.innerWidth<=768) {
    closeMobAI();
    setTimeout(()=>go('#catalog'), 350);
    const notif = document.getElementById('ai-notif');
    notif.textContent = ids.length;
    notif.classList.add('on');
  }
}

function clearFilter() {
  aiPicks=null;
  document.getElementById('ai-banner').classList.remove('on');
  document.getElementById('ai-notif').classList.remove('on');
  renderCat();
}

function chipSend(el, panel) {
  const inpId = panel==='desk' ? 'ai-inp-desk' : 'ai-inp-mob';
  document.getElementById(inpId).value = el.textContent;
  sendMsg(panel);
}

function ar(el){ el.style.height='auto'; el.style.height=Math.min(el.scrollHeight,96)+'px'; }
function go(id){ document.querySelector(id)?.scrollIntoView({behavior:'smooth',block:'start'}); }

// ===== INIT =====
renderPkgs();
renderCat();
initAI('desk');
// Init mobile AI lazily when drawer opens
document.getElementById('mob-ai-fab').addEventListener('click', ()=>{ setTimeout(()=>initAI('mob'),50); });

// ===== AUTH =====
function openAuth(){
  document.getElementById('auth-drawer').classList.add('open');
  document.getElementById('auth-overlay').classList.add('on');
  document.body.style.overflow='hidden';
}
function closeAuth(){
  document.getElementById('auth-drawer').classList.remove('open');
  document.getElementById('auth-overlay').classList.remove('on');
  document.body.style.overflow='';
}

function switchAuthTab(tab){
  document.querySelectorAll('.auth-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.auth-panel').forEach(p=>p.classList.remove('active'));
  document.getElementById('tab-'+tab).classList.add('active');
  document.getElementById('panel-'+tab).classList.add('active');
}

function showAuthMsg(id, type, text){
  const el = document.getElementById(id);
  el.className = 'auth-msg ' + type;
  el.textContent = text;
}
function clearAuthMsg(id){ const el=document.getElementById(id); el.className='auth-msg'; el.textContent=''; }

function setLoggedIn(user){
  document.getElementById('auth-logged-in').classList.add('on');
  document.getElementById('panel-login').classList.remove('active');
  document.getElementById('panel-signup').classList.remove('active');
  document.getElementById('auth-display-name').textContent = user.displayName || 'Welcome back!';
  document.getElementById('auth-display-email').textContent = user.email;
  // Update nav button
  document.querySelector('.btn-auth').innerHTML = '👤 <span class="auth-label">' + (user.displayName?.split(' ')[0] || 'Account') + '</span>';
}

function setLoggedOut(){
  document.getElementById('auth-logged-in').classList.remove('on');
  document.getElementById('panel-login').classList.add('active');
  document.querySelector('.btn-auth').innerHTML = '👤 <span class="auth-label">Login / Sign Up</span>';
}

async function doLogin(){
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-password').value;
  if(!email || !pass){ showAuthMsg('login-msg','error','Please fill in all fields.'); return; }
  const btn = document.getElementById('login-btn');
  btn.disabled=true; btn.textContent='Logging in...';
  clearAuthMsg('login-msg');

  // Admin shortcut — replace with Firebase later
  if(email === 'admin@gmail.com' && pass === '12345'){
    sessionStorage.setItem('halden_admin', JSON.stringify({name:'Administrator', email}));
    showAuthMsg('login-msg','success','Welcome, Admin! Redirecting...');
    setTimeout(()=>{ window.location.href = 'admin.html'; }, 800);
    return;
  }
//firebase stuff
  const { signInWithEmailAndPassword } = window.firebaseFns;
signInWithEmailAndPassword(window.firebaseAuth, email, pass)
  .then(userCred => {
    const user = userCred.user;
    if (email === 'admin@gmail.com') {
      sessionStorage.setItem('halden_admin', JSON.stringify({ name: 'Administrator', email }));
      window.location.href = 'admin.html';
    } else {
      setLoggedIn({ displayName: user.displayName, email: user.email });
      closeAuth();
    }
  })
  .catch(() => showAuthMsg('login-msg', 'error', 'Invalid email or password.'));
  
  setTimeout(()=>{
    showAuthMsg('login-msg','error','Invalid email or password. Please try again.');
    btn.disabled=false; btn.textContent='Login to My Account';
  }, 800);
}

async function doSignup(){
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const pass = document.getElementById('signup-password').value;
  if(!name||!email||!pass){ showAuthMsg('signup-msg','error','Please fill in all fields.'); return; }
  if(pass.length < 6){ showAuthMsg('signup-msg','error','Password must be at least 6 characters.'); return; }
  const btn = document.getElementById('signup-btn');
  btn.disabled=true; btn.textContent='Creating account...';
  clearAuthMsg('signup-msg');
  // TODO: Replace with Firebase createUserWithEmailAndPassword
  setTimeout(()=>{
    showAuthMsg('signup-msg','error','Firebase not connected yet. Come back after setup.');
    btn.disabled=false; btn.textContent='Create My Account';
  }, 800);
}

async function signOut(){
  // TODO: Replace with Firebase signOut
  setLoggedOut();
  closeAuth();
}
