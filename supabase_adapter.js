// ============================================================================
// SUPABASE FIRESTORE ADAPTER
// Maps Firebase syntax to Supabase to avoid rewriting 26,000 lines of frontend logic.
// ============================================================================

window.firebaseDB = window.supabaseClient;

window.firebaseAuth = {
  get currentUser() {
    return window.__sbUser || null;
  }
};

// Listen to Supabase Auth State and map it to Firebase format
window.supabaseClient.auth.onAuthStateChange((event, session) => {
  if (session?.user) {
    window.__sbUser = {
      uid: session.user.id,
      email: session.user.email,
      displayName: session.user.user_metadata?.full_name || 'User',
      photoURL: session.user.user_metadata?.avatar_url || ''
    };
  } else {
    window.__sbUser = null;
  }
  
  // Trigger Firebase observers
  if (window.__authObservers) {
    window.__authObservers.forEach(cb => cb(window.__sbUser));
  }
});

// AUTHENTICATION
async function signInWithEmailAndPassword(auth, email, password) {
  const { data, error } = await window.supabaseClient.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return { user: { uid: data.user.id, email: data.user.email, displayName: data.user.user_metadata?.full_name } };
}

async function createUserWithEmailAndPassword(auth, email, password) {
  const { data, error } = await window.supabaseClient.auth.signUp({ email, password });
  if (error) throw new Error(error.message);
  return { user: { uid: data.user.id, email: data.user.email } };
}

async function signOut(auth) {
  const { error } = await window.supabaseClient.auth.signOut();
  if (error) throw new Error(error.message);
}

window.__authObservers = [];
function onAuthStateChanged(auth, callback) {
  window.__authObservers.push(callback);
  // call immediately if ready
  window.supabaseClient.auth.getSession().then(({ data: { session } }) => {
    if (session?.user) {
      callback({ uid: session.user.id, email: session.user.email, displayName: session.user.user_metadata?.full_name });
    } else {
      callback(null);
    }
  });
  return () => {
    window.__authObservers = window.__authObservers.filter(cb => cb !== callback);
  };
}

async function updateProfile(user, { displayName, photoURL }) {
  const { error } = await window.supabaseClient.auth.updateUser({
    data: { full_name: displayName, avatar_url: photoURL }
  });
  if (error) throw new Error(error.message);
}

// Google Auth Dummy (Supabase OAuth needs redirect, so we wrap it)
function GoogleAuthProvider() {}
async function signInWithPopup(auth, provider) {
  const { data, error } = await window.supabaseClient.auth.signInWithOAuth({ provider: 'google' });
  if (error) throw new Error(error.message);
  return data;
}

// DATABASE - FIRESTORE EMULATION
function collection(db, path) { return { path }; }
function doc(db, path, id) { 
  if (arguments.length === 2) {
    // doc(collectionRef, id)
    return { path: db.path, id: path };
  }
  return { path, id }; 
}
function query(col, ...constraints) { return { ...col, constraints: [...(col.constraints || []), ...constraints] }; }
function where(field, op, val) { return { type: 'where', field, op, val }; }
function orderBy(field, dir='asc') { return { type: 'orderBy', field, dir }; }
function limit(n) { return { type: 'limit', val: n }; }

// ===== RESERVATIONS MAPPING LAYER =====
// Maps Firebase camelCase fields to Supabase snake_case fields, and tucks extras into JSONB
function mapColumn(path, field) {
  if (path !== 'reservations') return field;
  const map = {
    client: 'client_name', email: 'client_email', packageName: 'package_name',
    paymentMethod: 'payment_method', pricingMode: 'pricing_mode', selectedTier: 'selected_tier',
    isVIP: 'is_vip', vipCount: 'vip_count', vipService: 'vip_service',
    proposedMeetingTimes: 'meeting_times', time: 'timeframe', coords: 'venue_coords',
    createdAt: 'created_at', updatedAt: 'updated_at'
  };
  return map[field] || field;
}

function mapToDB(path, data) {
  if (path !== 'reservations' || !data) return data;
  const dbData = { ...data };
  
  if (dbData.client !== undefined) { dbData.client_name = dbData.client; delete dbData.client; }
  if (dbData.email !== undefined) { dbData.client_email = dbData.email; delete dbData.email; }
  if (dbData.time !== undefined) { dbData.timeframe = dbData.time; delete dbData.time; }
  if (dbData.coords !== undefined) { dbData.venue_coords = dbData.coords; delete dbData.coords; }
  if (dbData.packageName !== undefined) { dbData.package_name = dbData.packageName; delete dbData.packageName; }
  if (dbData.paymentMethod !== undefined) { dbData.payment_method = dbData.paymentMethod; delete dbData.paymentMethod; }
  if (dbData.pricingMode !== undefined) { dbData.pricing_mode = dbData.pricingMode; delete dbData.pricingMode; }
  if (dbData.selectedTier !== undefined) { dbData.selected_tier = dbData.selectedTier; delete dbData.selectedTier; }
  if (dbData.createdAt !== undefined) { dbData.created_at = dbData.createdAt; delete dbData.createdAt; }
  
  // VIP bundling
  if (dbData.isVIP !== undefined || dbData.vipCount !== undefined || dbData.vipService !== undefined) {
    dbData.vip = {
      enabled: dbData.isVIP || false,
      count: dbData.vipCount || 0,
      service: dbData.vipService || ''
    };
    delete dbData.isVIP;
    delete dbData.vipCount;
    delete dbData.vipService;
  }
  
  if (dbData.proposedMeetingTimes !== undefined) {
    dbData.meeting_times = dbData.proposedMeetingTimes;
    delete dbData.proposedMeetingTimes;
  }
  
  // Any extra fields not in schema go into a catch-all JSONB
  const allowedKeys = ['id','user_id','client_name','client_email','client_phone','date','timeframe','venue','venue_coords','pax','type','theme','description','status','ops_status','amount','payment_method','payment_status','package_name','pricing_mode','selected_tier','vip','meeting_times','staff','seating_layout','execution_plan','food_tasted','rundown_data','design_selections','customer_equipment','execution_agenda','settlement_amount','settled','execution_live_status','delay_reason','downpayment_amount','downpayment_paid','created_at','updated_at'];
  
  let extras = {};
  for (const k of Object.keys(dbData)) {
    if (!allowedKeys.includes(k)) {
      extras[k] = dbData[k];
      delete dbData[k];
    }
  }
  if (Object.keys(extras).length > 0) {
    dbData.execution_plan = dbData.execution_plan || {};
    dbData.execution_plan._firebase_extras = extras;
  }
  return dbData;
}

function mapFromDB(path, data) {
  if (path !== 'reservations' || !data) return data;
  const fbData = { ...data };
  
  if (fbData.client_name !== undefined) { fbData.client = fbData.client_name; delete fbData.client_name; }
  if (fbData.client_email !== undefined) { fbData.email = fbData.client_email; delete fbData.client_email; }
  if (fbData.timeframe !== undefined) { fbData.time = fbData.timeframe; delete fbData.timeframe; }
  if (fbData.venue_coords !== undefined) { fbData.coords = fbData.venue_coords; delete fbData.venue_coords; }
  if (fbData.package_name !== undefined) { fbData.packageName = fbData.package_name; delete fbData.package_name; }
  if (fbData.payment_method !== undefined) { fbData.paymentMethod = fbData.payment_method; delete fbData.payment_method; }
  if (fbData.pricing_mode !== undefined) { fbData.pricingMode = fbData.pricing_mode; delete fbData.pricing_mode; }
  if (fbData.selected_tier !== undefined) { fbData.selectedTier = fbData.selected_tier; delete fbData.selected_tier; }
  if (fbData.created_at !== undefined) { fbData.createdAt = fbData.created_at; delete fbData.created_at; }
  
  if (fbData.vip) {
    fbData.isVIP = fbData.vip.enabled;
    fbData.vipCount = fbData.vip.count;
    fbData.vipService = fbData.vip.service;
    delete fbData.vip;
  }
  
  if (fbData.meeting_times !== undefined) {
    fbData.proposedMeetingTimes = fbData.meeting_times;
    delete fbData.meeting_times;
  }
  
  if (fbData.execution_plan && fbData.execution_plan._firebase_extras) {
    Object.assign(fbData, fbData.execution_plan._firebase_extras);
    delete fbData.execution_plan._firebase_extras;
  }
  
  return fbData;
}

async function addDoc(col, data) {
  const payload = mapToDB(col.path, data);
  const { data: res, error } = await window.supabaseClient.from(col.path).insert([payload]).select().single();
  if (error) { console.error('addDoc Error:', error); throw new Error(error.message); }
  return { id: res.id, path: col.path };
}

async function setDoc(docRef, data, options = {}) {
  const payload = mapToDB(docRef.path, data);
  let req = window.supabaseClient.from(docRef.path).upsert([{ id: docRef.id, ...payload }]);
  const { error } = await req;
  if (error) throw new Error(error.message);
}

async function updateDoc(docRef, data) {
  const payload = mapToDB(docRef.path, data);
  const { error } = await window.supabaseClient.from(docRef.path).update(payload).eq('id', docRef.id);
  if (error) throw new Error(error.message);
}

async function getDoc(docRef) {
  const { data, error } = await window.supabaseClient.from(docRef.path).select('*').eq('id', docRef.id).single();
  if (error && error.code !== 'PGRST116') throw new Error(error.message);
  return {
    id: docRef.id,
    exists: () => !!data,
    data: () => mapFromDB(docRef.path, data)
  };
}

async function getDocs(q) {
  let req = window.supabaseClient.from(q.path).select('*');
  if (q.constraints) {
    q.constraints.forEach(c => {
      if (c.type === 'where') {
        const field = mapColumn(q.path, c.field);
        if (c.op === '==') req = req.eq(field, c.val);
        else if (c.op === '<') req = req.lt(field, c.val);
        else if (c.op === '>') req = req.gt(field, c.val);
        else if (c.op === '<=') req = req.lte(field, c.val);
        else if (c.op === '>=') req = req.gte(field, c.val);
        else if (c.op === 'in') req = req.in(field, c.val);
        else if (c.op === 'array-contains') req = req.contains(field, [c.val]);
      } else if (c.type === 'orderBy') {
        req = req.order(mapColumn(q.path, c.field), { ascending: c.dir === 'asc' });
      } else if (c.type === 'limit') {
        req = req.limit(c.val);
      }
    });
  }
  const { data, error } = await req;
  if (error) throw new Error(error.message);
  
  const snap = {
    empty: !data || data.length === 0,
    docs: (data || []).map(d => ({
      id: d.id,
      data: () => mapFromDB(q.path, d)
    })),
    forEach(cb) {
      this.docs.forEach(cb);
    },
    docChanges() {
      return this.docs.map(doc => ({ type: 'added', doc }));
    }
  };
  return snap;
}

// onSnapshot emulation using Supabase Realtime + Fetch
function onSnapshot(q, callback) {
  let isDoc = !!q.id; // docRef vs query
  
  let cachedDocs = new Map();
  let isFirstLoad = true;

  const fetchAndNotify = async (payload = null) => {
    try {
      if (isDoc) {
        const snap = await getDoc(q);
        callback(snap);
      } else {
        const snap = await getDocs(q);
        let changes = [];

        if (isFirstLoad) {
          snap.docs.forEach(d => {
            cachedDocs.set(d.id, d);
            changes.push({ type: 'added', doc: d });
          });
          isFirstLoad = false;
        } else if (payload) {
          // Compute change based on realtime payload
          const d = { id: payload.new?.id || payload.old?.id, data: () => mapFromDB(q.path, payload.new) };
          let type = 'modified';
          if (payload.eventType === 'INSERT') type = 'added';
          if (payload.eventType === 'DELETE') type = 'removed';
          
          if (type !== 'removed') cachedDocs.set(d.id, d);
          else cachedDocs.delete(d.id);
          
          changes.push({ type, doc: d });
        }

        // Override docChanges to return the computed diff
        snap.docChanges = () => changes;
        
        callback(snap);
      }
    } catch (e) {
      console.error('onSnapshot fetch error:', e);
    }
  };

  fetchAndNotify();

  // Subscribe to changes on the table
  const channel = window.supabaseClient.channel('realtime-' + Math.random())
    .on('postgres_changes', { event: '*', schema: 'public', table: q.path }, payload => {
       fetchAndNotify(payload);
    })
    .subscribe();

  return () => {
    window.supabaseClient.removeChannel(channel);
  };
}

// Server Timestamp dummy
const serverTimestamp = () => new Date().toISOString();

window.firebaseFns = {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  collection,
  doc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  onSnapshot,
  serverTimestamp
};
