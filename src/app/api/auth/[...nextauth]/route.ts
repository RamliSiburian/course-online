import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'
import logger from '../../../../../logger';

const googleClientId = process.env.GOOGLE_ID as string;
const googleClientSecret = process.env.GOOGLE_SECRET as string;

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
            authorization: {
              params: {
                prompt: 'consent',
                access_type: 'offline',
                response_type: 'code'
              }
            }
        })
    ],
    callbacks: {
      async signIn({ user, account, profile, email, credentials }: any) {       
        logger.info('User Info:', user);
        logger.info('Account Info:', account);
        logger.info('Profile Info:', profile);
        logger.info('Email:', email);
        logger.info('Credentials:', credentials);
        return true
      }
    }
}

export const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
