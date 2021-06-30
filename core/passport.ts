import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User, { UserInstance } from '../db/models/user';

import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  API_URL,
  SECRET_KEY_JWT,
} from '../utils/constants';
import { createJwtToken } from '../utils/createJwtToken';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET_KEY_JWT,
};

passport.use(
  'jwt',
  new JwtStrategy(opts, (jwt_payload, done) => {
    done(null, jwt_payload.data);
  }),
);

passport.use(
  'github',
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID as string,
      clientSecret: GITHUB_CLIENT_SECRET as string,
      callbackURL: `${API_URL}/auth/github/callback`,
    },
    async (_, __, profile, done) => {
      try {
        let userData: User | null;
        const newUser: Omit<UserInstance, 'id' | 'createdAt' | 'updatedAt'> = {
          fullname: profile.displayName,
          avatarUrl: profile.photos?.[0].value ?? '',
          isActive: 0,
          phone: '',
          username: profile.username ?? '',
        };

        userData = await User.findOne({
          where: {
            username: newUser.username,
          },
        });

        if (!userData) {
          const user = await User.create(newUser);

          userData = user;
        }

        done(null, {
          ...userData.toJSON(),
          token: createJwtToken(userData),
        });
      } catch (error) {
        done(error);
      }
    },
  ),
);

passport.serializeUser<number>((user, done) => {
  const userData = user as UserInstance;

  done(null, userData.id);
});

passport.deserializeUser<number>(async (id, done) => {
  try {
    const user = await User.findByPk(id);

    done(null, user);
  } catch (error) {
    done(error);
  }
});

export { passport };
