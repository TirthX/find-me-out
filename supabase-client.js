/* ============================================================
   AIFinder – supabase-client.js
   Production-Ready Supabase Client Integration
   Strict Authentication, Authorization, Database-Backed Moderation & RLS
   ============================================================ */

const DEFAULT_SUPABASE_URL = 'https://bdpxjwiughmsoomjtppj.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_pm344ZDaSoE5YRQxnST6Yg_6xdq4dzn';

function normalizeToolKey(str) {
  return String(str || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

function deduplicateToolsList(list) {
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  const result = [];
  for (const t of list) {
    if (!t || !t.name) continue;
    const key = normalizeToolKey(t.name);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(t);
    }
  }
  return result;
}

const DB = {
  client: null,
  isSupabaseConfigured: false,
  config: {
    url: DEFAULT_SUPABASE_URL,
    anonKey: DEFAULT_SUPABASE_KEY
  },

  init() {
    try {
      const savedConfig = localStorage.getItem('aifinder_supabase_config');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        if (parsed.url && parsed.anonKey) {
          this.config = parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load saved Supabase config:', e);
    }

    if (window.supabase && this.config.url && this.config.anonKey) {
      try {
        this.client = window.supabase.createClient(this.config.url, this.config.anonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        });
        this.isSupabaseConfigured = true;
      } catch (err) {
        console.error('Supabase client initialization error:', err);
        this.client = null;
        this.isSupabaseConfigured = false;
      }
    }
  },

  requireClient() {
    if (!this.client && window.supabase && this.config.url && this.config.anonKey) {
      this.init();
    }
    return this.client;
  },

  // ── REAL USER AUTHENTICATION & DATABASE-BACKED SESSIONS ─────
  async getCurrentUser() {
    const client = this.requireClient();
    if (!client) return null;

    try {
      const { data: { user }, error: userError } = await client.auth.getUser();
      if (userError || !user) {
        return null;
      }

      let role = 'user';
      let name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Member';

      try {
        const { data: profile, error: profileError } = await client
          .from('profiles')
          .select('full_name, role')
          .eq('id', user.id)
          .maybeSingle();

        if (!profileError && profile) {
          if (profile.role) role = profile.role;
          if (profile.full_name) name = profile.full_name;
        }
      } catch (pe) {
        console.warn('Error fetching user profile:', pe);
      }

      return {
        id: user.id,
        email: user.email || '',
        name,
        role,
        signedInAt: user.last_sign_in_at || new Date().toISOString()
      };
    } catch (err) {
      console.error('Error resolving current user session:', err);
      return null;
    }
  },

  async authSignIn(email, password) {
    const client = this.requireClient();
    if (!client) {
      return { success: false, error: 'Supabase client is not configured. Please check connection.' };
    }

    const trimmedEmail = (email || '').trim();
    if (!trimmedEmail || !password) {
      return { success: false, error: 'Email and password are required.' };
    }

    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: trimmedEmail,
        password
      });

      if (error) {
        return { success: false, error: error.message || 'Invalid login credentials.' };
      }

      if (!data?.user) {
        return { success: false, error: 'Authentication failed. No user returned.' };
      }

      // Retrieve verified role and profile from database
      let role = 'user';
      let name = data.user.user_metadata?.full_name || data.user.user_metadata?.name || trimmedEmail.split('@')[0] || 'Member';

      try {
        const { data: profile } = await client
          .from('profiles')
          .select('full_name, role')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profile) {
          if (profile.role) role = profile.role;
          if (profile.full_name) name = profile.full_name;
        }
      } catch (pe) {
        console.warn('Profile fetch after sign-in error:', pe);
      }

      const verifiedUser = {
        id: data.user.id,
        email: data.user.email || trimmedEmail,
        name,
        role,
        signedInAt: new Date().toISOString()
      };

      // Record sign-in event via secure database procedure or table insert
      await this.recordMySignIn();

      return { success: true, user: verifiedUser };
    } catch (err) {
      console.error('authSignIn exception:', err);
      return { success: false, error: err.message || 'An unexpected authentication error occurred.' };
    }
  },

  async authSignUp(email, password, fullName) {
    const client = this.requireClient();
    if (!client) {
      return { success: false, error: 'Supabase client is not configured.' };
    }

    const trimmedEmail = (email || '').trim();
    const trimmedName = (fullName || '').trim();

    if (!trimmedEmail || !password) {
      return { success: false, error: 'Email and password are required.' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    try {
      const { data, error } = await client.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            full_name: trimmedName || trimmedEmail.split('@')[0]
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data?.user) {
        return { success: false, error: 'Registration failed. Please try again.' };
      }

      const requiresConfirmation = !data.session;
      const userObj = {
        id: data.user.id,
        email: data.user.email || trimmedEmail,
        name: trimmedName || trimmedEmail.split('@')[0],
        role: 'user',
        signedInAt: new Date().toISOString()
      };

      if (!requiresConfirmation) {
        await this.recordMySignIn();
      }

      return {
        success: true,
        user: userObj,
        requiresConfirmation,
        message: requiresConfirmation
          ? 'Account created! Please check your email to confirm your account before signing in.'
          : 'Account created successfully!'
      };
    } catch (err) {
      console.error('authSignUp exception:', err);
      return { success: false, error: err.message || 'An unexpected registration error occurred.' };
    }
  },

  async authSignOut() {
    const client = this.requireClient();
    if (client) {
      try {
        await client.auth.signOut();
      } catch (err) {
        console.warn('Supabase signOut error:', err);
      }
    }
    return { success: true };
  },

  onAuthStateChange(handler) {
    const client = this.requireClient();
    if (client && typeof handler === 'function') {
      try {
        return client.auth.onAuthStateChange(handler);
      } catch (e) {
        console.warn('onAuthStateChange listener error:', e);
      }
    }
    return { data: { subscription: { unsubscribe: () => {} } } };
  },

  // ── AUDIT SIGN-IN LOGS (STRICT SCHEMA CONFORMANCE) ─────────
  async recordMySignIn() {
    const client = this.requireClient();
    if (!client) return;

    try {
      // First try executing the security definer RPC
      const { error: rpcError } = await client.rpc('record_my_sign_in', {
        p_user_agent: navigator.userAgent
      });

      if (!rpcError) return;

      // Fallback: direct insert with verified auth session uid
      const { data: { user } } = await client.auth.getUser();
      if (user) {
        const { data: profile } = await client
          .from('profiles')
          .select('full_name, role')
          .eq('id', user.id)
          .maybeSingle();

        await client.from('sign_in_logs').insert([{
          user_id: user.id,
          email: user.email || '',
          role: profile?.role || 'user',
          user_name: profile?.full_name || user.email?.split('@')[0] || 'Member',
          auth_provider: 'email',
          user_agent: navigator.userAgent
        }]);
      }
    } catch (err) {
      console.warn('Failed to record sign-in log:', err);
    }
  },

  async fetchSignInLogs() {
    const client = this.requireClient();
    if (!client) return [];

    try {
      const { data, error } = await client
        .from('sign_in_logs')
        .select('*')
        .order('signed_in_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching sign-in logs from Supabase:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('fetchSignInLogs exception:', err);
      return [];
    }
  },

  // ── TOOLS DATA ACCESS (WITH DEDUPLICATION & NORMALIZATION) ──
  normalizeTool(t) {
    if (!t) return null;
    return {
      id: Number(t.id),
      name: (t.name || '').trim(),
      emoji: t.emoji || '🤖',
      category: t.category,
      categoryLabel: t.category_label || t.categoryLabel || t.category,
      pricing: t.pricing || 'freemium',
      pricingLabel: t.pricing_label || t.pricingLabel || 'Freemium',
      rating: Number(t.rating) || 0,
      ratingCount: Number(t.rating_count ?? t.ratingCount ?? 0),
      description: t.description || '',
      tags: Array.isArray(t.tags) ? t.tags : (typeof t.tags === 'string' ? t.tags.split(',').map(s => s.trim()).filter(Boolean) : []),
      features: Array.isArray(t.features) ? t.features : (typeof t.features === 'string' ? t.features.split(',').map(s => s.trim()).filter(Boolean) : []),
      website: t.website || '#',
      hasAPI: Boolean(t.has_api ?? t.hasAPI),
      hasFreeplan: Boolean(t.has_freeplan ?? t.hasFreeplan ?? true),
      status: t.status || 'approved',
      createdAt: t.created_at || t.createdAt || new Date().toISOString()
    };
  },

  async fetchTools() {
    const client = this.requireClient();
    let tools = [];

    if (client) {
      try {
        const { data, error } = await client
          .from('tools')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          tools = data.map(t => this.normalizeTool(t)).filter(Boolean);
        } else if (error) {
          console.warn('Error querying tools from Supabase:', error.message);
        }
      } catch (err) {
        console.warn('fetchTools remote query failed:', err);
      }
    }

    // If database is empty or not yet seeded, provide seed catalog
    if (tools.length === 0 && typeof INITIAL_AI_TOOLS !== 'undefined' && Array.isArray(INITIAL_AI_TOOLS)) {
      tools = INITIAL_AI_TOOLS.map(t => this.normalizeTool(t)).filter(Boolean);
    }

    return deduplicateToolsList(tools);
  },

  async addTool(toolData) {
    const client = this.requireClient();
    if (!client) {
      return { success: false, error: 'Database is not connected.' };
    }

    const payload = {
      name: (toolData.name || '').trim(),
      emoji: toolData.emoji || '🤖',
      category: toolData.category,
      category_label: toolData.categoryLabel || toolData.category,
      pricing: toolData.pricing || 'freemium',
      pricing_label: toolData.pricingLabel || 'Freemium',
      rating: Number(toolData.rating) || 4.8,
      rating_count: Number(toolData.ratingCount) || 1,
      description: (toolData.description || '').trim(),
      tags: Array.isArray(toolData.tags) ? toolData.tags : [],
      features: Array.isArray(toolData.features) ? toolData.features : [],
      website: (toolData.website || '').trim(),
      has_api: Boolean(toolData.hasAPI),
      has_freeplan: Boolean(toolData.hasFreeplan),
      status: 'approved'
    };

    try {
      const { data, error } = await client
        .from('tools')
        .insert([payload])
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      await this.resolvePendingSubmissionsForTool(toolData.name);
      return { success: true, tool: this.normalizeTool(data) };
    } catch (err) {
      console.error('addTool exception:', err);
      return { success: false, error: err.message || 'Failed to add tool to database.' };
    }
  },

  async updateTool(id, updates) {
    const client = this.requireClient();
    if (!client) {
      return { success: false, error: 'Database is not connected.' };
    }

    const payload = {
      name: (updates.name || '').trim(),
      emoji: updates.emoji || '🤖',
      category: updates.category,
      category_label: updates.categoryLabel || updates.category,
      pricing: updates.pricing || 'freemium',
      pricing_label: updates.pricingLabel || 'Freemium',
      website: (updates.website || '').trim(),
      description: (updates.description || '').trim()
    };

    try {
      const { error } = await client
        .from('tools')
        .update(payload)
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error('updateTool exception:', err);
      return { success: false, error: err.message || 'Failed to update tool.' };
    }
  },

  async deleteTool(id) {
    const client = this.requireClient();
    if (!client) {
      return { success: false, error: 'Database is not connected.' };
    }

    try {
      const { error } = await client
        .from('tools')
        .delete()
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error('deleteTool exception:', err);
      return { success: false, error: err.message || 'Failed to delete tool.' };
    }
  },

  // ── SUBMISSIONS (AUTHENTICATED COMMUNITY QUEUE) ────────────
  async submitCommunityTool(submission) {
    const client = this.requireClient();
    if (!client) {
      return { success: false, error: 'Database is not connected.' };
    }

    // Require authenticated user
    const { data: { user }, error: userError } = await client.auth.getUser();
    if (userError || !user) {
      return {
        success: false,
        error: 'Authentication required. Please sign in to submit an AI tool.'
      };
    }

    const name = (submission.name || '').trim();
    const key = normalizeToolKey(name);

    // 1. Check if tool is already live in tools catalog
    const existingTools = await this.fetchTools();
    if (existingTools.some(t => normalizeToolKey(t.name) === key)) {
      return {
        success: false,
        error: `"${name}" is already listed in our live AI tools directory!`
      };
    }

    // 2. Check if tool is already in pending submissions queue
    const submissions = await this.fetchSubmissions();
    if (submissions.some(s => s.status === 'pending' && normalizeToolKey(s.name) === key)) {
      return {
        success: false,
        error: `"${name}" has already been submitted and is currently in the review queue!`
      };
    }

    const featuresArray = Array.isArray(submission.features)
      ? submission.features
      : (typeof submission.features === 'string'
        ? submission.features.split(',').map(s => s.trim()).filter(Boolean)
        : []);

    const subObj = {
      user_id: user.id,
      name,
      category: submission.category,
      category_label: submission.categoryLabel || submission.category,
      website: (submission.website || '').trim(),
      pricing: submission.pricing || 'freemium',
      submitter_email: user.email || submission.email || '',
      description: (submission.description || '').trim(),
      features: featuresArray,
      status: 'pending'
    };

    try {
      const { data, error } = await client
        .from('submissions')
        .insert([subObj])
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, submission: data };
    } catch (err) {
      console.error('submitCommunityTool exception:', err);
      return { success: false, error: err.message || 'Failed to submit tool for review.' };
    }
  },

  async fetchSubmissions() {
    const client = this.requireClient();
    if (!client) return [];

    try {
      const { data, error } = await client
        .from('submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching submissions:', error.message);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('fetchSubmissions exception:', err);
      return [];
    }
  },

  async approveSubmission(id) {
    const client = this.requireClient();
    if (!client) {
      return { success: false, error: 'Database is not connected.' };
    }

    try {
      // Execute the security definer database function
      const { data, error } = await client.rpc('approve_submission', {
        p_submission_id: Number(id)
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        tool: data ? this.normalizeTool(data) : { name: 'Approved Tool' }
      };
    } catch (err) {
      console.error('approveSubmission exception:', err);
      return { success: false, error: err.message || 'Failed to approve submission.' };
    }
  },

  async rejectSubmission(id, reason = '') {
    const client = this.requireClient();
    if (!client) {
      return { success: false, error: 'Database is not connected.' };
    }

    try {
      const { error } = await client
        .from('submissions')
        .update({
          status: 'rejected',
          admin_notes: reason,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error('rejectSubmission exception:', err);
      return { success: false, error: err.message || 'Failed to reject submission.' };
    }
  },

  async resolvePendingSubmissionsForTool(toolName) {
    const client = this.requireClient();
    if (!client || !toolName) return;

    try {
      const { data: subs } = await client
        .from('submissions')
        .select('id, name')
        .eq('status', 'pending');

      if (!subs || subs.length === 0) return;

      const targetKey = normalizeToolKey(toolName);
      const matchingIds = subs
        .filter(s => normalizeToolKey(s.name) === targetKey)
        .map(s => s.id);

      if (matchingIds.length > 0) {
        await client
          .from('submissions')
          .update({ status: 'approved', reviewed_at: new Date().toISOString() })
          .in('id', matchingIds);
      }
    } catch (e) {
      console.warn('resolvePendingSubmissionsForTool error:', e);
    }
  },

  // ── REVIEWS (AUTHENTICATED & VALIDATED) ─────────────────────
  async fetchReviews(toolId) {
    const client = this.requireClient();
    if (!client) return [];

    try {
      const { data, error } = await client
        .from('reviews')
        .select('*')
        .eq('tool_id', toolId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error.message);
        return [];
      }

      return (data || []).map(r => ({
        id: r.id,
        user: r.user_name || 'Member',
        rating: r.rating,
        text: r.review_text,
        date: new Date(r.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      }));
    } catch (err) {
      console.error('fetchReviews exception:', err);
      return [];
    }
  },

  async addReview(toolId, reviewData) {
    const client = this.requireClient();
    if (!client) {
      return { success: false, error: 'Database is not connected.' };
    }

    const { data: { user }, error: userError } = await client.auth.getUser();
    if (userError || !user) {
      return {
        success: false,
        error: 'Authentication required. Please sign in to write a review.'
      };
    }

    const text = (reviewData.text || '').trim();
    if (text.length < 20 || text.length > 2000) {
      return {
        success: false,
        error: 'Review text must be between 20 and 2,000 characters.'
      };
    }

    const rating = Math.round(Number(reviewData.rating));
    if (!rating || rating < 1 || rating > 5) {
      return {
        success: false,
        error: 'Please select a valid star rating (1 to 5 stars).'
      };
    }

    // Get user display name from profile
    let reviewerName = 'Community Member';
    try {
      const { data: profile } = await client
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .maybeSingle();

      reviewerName = profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Community Member';
    } catch (e) {}

    try {
      const { data, error } = await client
        .from('reviews')
        .insert([{
          tool_id: toolId,
          user_id: user.id,
          user_name: reviewerName,
          rating,
          review_text: text
        }])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          return { success: false, error: 'You have already reviewed this AI tool.' };
        }
        return { success: false, error: error.message };
      }

      return {
        success: true,
        review: {
          id: data.id,
          user: reviewerName,
          rating,
          text,
          date: 'Just now'
        }
      };
    } catch (err) {
      console.error('addReview exception:', err);
      return { success: false, error: err.message || 'Failed to post review.' };
    }
  },

  // ── SEEDING & CONFIGURATION ────────────────────────────────
  async seedInitialTools(initialTools) {
    const client = this.requireClient();
    if (!client) {
      return { success: false, error: 'Database is not connected.' };
    }

    try {
      const uniqueSeeds = deduplicateToolsList(initialTools);
      const rows = uniqueSeeds.map(t => ({
        name: t.name,
        emoji: t.emoji || '🤖',
        category: t.category,
        category_label: t.categoryLabel,
        pricing: t.pricing,
        pricing_label: t.pricingLabel,
        rating: t.rating,
        rating_count: t.ratingCount,
        description: t.description,
        tags: t.tags || [],
        features: t.features || [],
        website: t.website,
        has_api: t.hasAPI,
        has_freeplan: t.hasFreeplan,
        status: 'approved'
      }));

      const { error } = await client
        .from('tools')
        .upsert(rows, { onConflict: 'name', ignoreDuplicates: true });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async setConfig(url, anonKey) {
    this.config = {
      url: (url || '').trim(),
      anonKey: (anonKey || '').trim()
    };
    localStorage.setItem('aifinder_supabase_config', JSON.stringify(this.config));

    if (this.config.url && this.config.anonKey) {
      this.init();
      return { success: true, message: 'Supabase credentials saved and connected!' };
    } else {
      this.client = null;
      this.isSupabaseConfigured = false;
      return { success: true, message: 'Supabase credentials cleared.' };
    }
  }
};

// Initialize Supabase Client on script load
DB.init();
