/**
 * Configuration de l'authentification - CryptoBoost
 * Gestion de l'authentification et des sessions utilisateur
 */

import { db, User } from './db';

// Types pour l'authentification
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: Date;
}

// Classe d'authentification
export class AuthService {
  private static instance: AuthService;
  private sessions: Map<string, AuthSession> = new Map();

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Génération de token
  private generateToken(): string {
    return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Validation des credentials (simulation)
  private async validateCredentials(email: string, password: string): Promise<User | null> {
    // Simulation de validation - en production, cela vérifierait le hash du mot de passe
    const user = await db.getUserByEmail(email);
    if (!user) return null;

    // Pour la démo, on accepte n'importe quel mot de passe pour les utilisateurs existants
    if (email === 'admin@cryptoboost.world' || email === 'client@cryptoboost.world') {
      return user;
    }

    return null;
  }

  // Connexion
  async login(credentials: LoginCredentials): Promise<AuthSession | null> {
    try {
      const user = await this.validateCredentials(credentials.email, credentials.password);
      if (!user) {
        throw new Error('Email ou mot de passe incorrect');
      }

      const token = this.generateToken();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures

      const session: AuthSession = {
        user,
        token,
        expiresAt
      };

      this.sessions.set(token, session);
      return session;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return null;
    }
  }

  // Inscription
  async register(data: RegisterData): Promise<AuthSession | null> {
    try {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await db.getUserByEmail(data.email);
      if (existingUser) {
        throw new Error('Un utilisateur avec cet email existe déjà');
      }

      // Créer le nouvel utilisateur
      const user = await db.createUser({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'client' // Par défaut, les nouveaux utilisateurs sont des clients
      });

      // Créer une session
      const token = this.generateToken();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const session: AuthSession = {
        user,
        token,
        expiresAt
      };

      this.sessions.set(token, session);
      return session;
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      return null;
    }
  }

  // Déconnexion
  async logout(token: string): Promise<boolean> {
    try {
      this.sessions.delete(token);
      return true;
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      return false;
    }
  }

  // Vérification de session
  async verifySession(token: string): Promise<User | null> {
    try {
      const session = this.sessions.get(token);
      if (!session) return null;

      // Vérifier si la session a expiré
      if (new Date() > session.expiresAt) {
        this.sessions.delete(token);
        return null;
      }

      return session.user;
    } catch (error) {
      console.error('Erreur de vérification de session:', error);
      return null;
    }
  }

  // Récupération de l'utilisateur actuel
  async getCurrentUser(token: string): Promise<User | null> {
    return this.verifySession(token);
  }

  // Mise à jour du profil utilisateur
  async updateProfile(token: string, updates: Partial<User>): Promise<User | null> {
    try {
      const user = await this.verifySession(token);
      if (!user) return null;

      const updatedUser = await db.updateUser(user.id, updates);
      if (!updatedUser) return null;

      // Mettre à jour la session
      const session = this.sessions.get(token);
      if (session) {
        session.user = updatedUser;
        this.sessions.set(token, session);
      }

      return updatedUser;
    } catch (error) {
      console.error('Erreur de mise à jour du profil:', error);
      return null;
    }
  }

  // Changement de mot de passe (simulation)
  async changePassword(token: string, oldPassword: string, newPassword: string): Promise<boolean> {
    try {
      const user = await this.verifySession(token);
      if (!user) return false;

      // En production, on vérifierait l'ancien mot de passe
      // Pour la démo, on accepte toujours
      console.log('Mot de passe changé avec succès');
      return true;
    } catch (error) {
      console.error('Erreur de changement de mot de passe:', error);
      return false;
    }
  }

  // Récupération de mot de passe (simulation)
  async resetPassword(email: string): Promise<boolean> {
    try {
      const user = await db.getUserByEmail(email);
      if (!user) return false;

      // En production, on enverrait un email de récupération
      console.log(`Email de récupération envoyé à ${email}`);
      return true;
    } catch (error) {
      console.error('Erreur de récupération de mot de passe:', error);
      return false;
    }
  }

  // Nettoyage des sessions expirées
  async cleanupExpiredSessions(): Promise<void> {
    const now = new Date();
    for (const [token, session] of this.sessions.entries()) {
      if (now > session.expiresAt) {
        this.sessions.delete(token);
      }
    }
  }

  // Statistiques des sessions
  getSessionStats(): { totalSessions: number; activeSessions: number } {
    const now = new Date();
    let activeSessions = 0;

    for (const session of this.sessions.values()) {
      if (now <= session.expiresAt) {
        activeSessions++;
      }
    }

    return {
      totalSessions: this.sessions.size,
      activeSessions
    };
  }
}

// Export de l'instance singleton
export const authService = AuthService.getInstance();