import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export default NextAuth({

  session: {
    jwt: true
    
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_KEY,
    }),
  ],

  secret: process.env.SECRET,
})