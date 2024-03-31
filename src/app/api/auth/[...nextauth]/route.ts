import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'

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
      async signIn( {user}: any) {  
        return true
      },
      async session ({session,token}:any) {
        session.id = token.sub
        return session;
        
      }
    }
}

export const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
