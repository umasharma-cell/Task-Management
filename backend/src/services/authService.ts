import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/environment';
import { UserRepository } from '../repositories/userRepository';
import { ApiError } from '../utils/apiError';
import { AuthPayload } from '../types';

const SALT_ROUNDS = 12;

export class AuthService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async register(email: string, name: string, password: string) {
    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) {
      throw ApiError.conflict('An account with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await this.userRepo.create({ email, name, password: hashedPassword });

    const tokens = this.generateTokenPair({ userId: user.id, email: user.email });
    await this.userRepo.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: { id: user.id, email: user.email, name: user.name },
      ...tokens,
    };
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const tokens = this.generateTokenPair({ userId: user.id, email: user.email });
    await this.userRepo.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: { id: user.id, email: user.email, name: user.name },
      ...tokens,
    };
  }

  async refresh(refreshToken: string) {
    let payload: AuthPayload;
    try {
      payload = jwt.verify(refreshToken, env.jwt.refreshSecret) as AuthPayload;
    } catch {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    const user = await this.userRepo.findById(payload.userId);
    if (!user || user.refreshToken !== refreshToken) {
      // Refresh token reuse detected — revoke all sessions for this user
      if (user) {
        await this.userRepo.updateRefreshToken(user.id, null);
      }
      throw ApiError.unauthorized('Refresh token has been revoked');
    }

    const tokens = this.generateTokenPair({ userId: user.id, email: user.email });
    await this.userRepo.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: { id: user.id, email: user.email, name: user.name },
      ...tokens,
    };
  }

  async logout(userId: string) {
    await this.userRepo.updateRefreshToken(userId, null);
  }

  private generateTokenPair(payload: AuthPayload) {
    const accessToken = jwt.sign(payload, env.jwt.accessSecret, {
      expiresIn: env.jwt.accessTokenExpiry,
    } as jwt.SignOptions);

    const refreshToken = jwt.sign(payload, env.jwt.refreshSecret, {
      expiresIn: env.jwt.refreshTokenExpiry,
    } as jwt.SignOptions);

    return { accessToken, refreshToken };
  }
}
