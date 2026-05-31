const { supabase } = require('../config/supabase');
const authService = require('../services/auth.service');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.validated.body;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (authError) return res.status(400).json({ error: authError.message });
    if (!authData.user) return res.status(400).json({ error: 'Registration failed' });

    await authService.createProfile(authData.user.id, name);

    res.status(201).json({
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name,
        plan: 'Free',
      },
      token: authData.session?.access_token,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.validated.body;

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) return res.status(401).json({ error: 'Invalid email or password' });

    const profile = await authService.getProfile(authData.user.id);

    res.json({
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: profile.name,
        avatar_url: profile.avatar_url,
        plan: profile.plan,
      },
      token: authData.session.access_token,
    });
  } catch (error) {
    next(error);
  }
};

const googleAuth = async (req, res, next) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${req.protocol}://${req.get('host')}/api/auth/google/callback`,
      },
    });

    if (error) return res.status(400).json({ error: error.message });

    res.json({ url: data.url });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const profile = await authService.getProfile(req.user.id);
    res.json({
      user: {
        ...req.user,
        name: profile.name,
        avatar_url: profile.avatar_url,
        plan: profile.plan,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const updates = req.validated.body;
    const profile = await authService.updateProfile(req.user.id, updates);
    res.json({ user: { ...req.user, ...profile } });
  } catch (error) {
    next(error);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    const result = await authService.deleteAccount(req.user.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, googleAuth, getMe, updateProfile, deleteAccount };
