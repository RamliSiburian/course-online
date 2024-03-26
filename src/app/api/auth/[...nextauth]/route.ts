import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'

const googleClientId = process.env.GOOGLE_ID as string;
const googleClientSecret = process.env.GOOGLE_SECRET as string;

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: googleClientId,
            clientSecret: googleClientSecret
        })
    ],
    callback: {
      async signIn({user, account, profile} : any) {
        user.id = profile.id;
        user.name = profile.name;
        user.email = profile.email
      return true
    },
    async afterSignIn({session, user}: any) {
      // Store user data in local storage
      localStorage.setItem('userData', JSON.stringify(user));
      return session;
    }
    },
    onError: async ({error, req, res}: any) => {
      console.error('NextAuth Error:', error.message);
      res.status(500).end(error.message);
  }
}

export const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
