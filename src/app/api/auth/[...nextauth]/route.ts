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
      console.log({user});
      
    }
    },
    onError: async ({error, req, res}: any) => {
      console.error('NextAuth Error:', error.message);
      res.status(500).end(error.message);
  }
}

export const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
