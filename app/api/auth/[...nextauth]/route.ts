import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "ehr-provider",
      name: "EHR System",
      type: "oauth",
      clientId: "dummy-client-id",
      clientSecret: "dummy-client-secret",
      authorization: {
        url: "http://localhost:3000/api/auth/mock-authorize",
        params: {
          scope: "patient/*.read fhirUser",  // Removed 'openid'
          response_type: "code",
        },
      },
      token: {
        url: "http://localhost:3000/api/auth/mock-token",
      },
      userinfo: {
        url: "http://localhost:3000/api/auth/mock-userinfo",
      },
      checks: ['state'],
      profile(profile) {
        return {
          id: profile.sub || 'practitioner-123',
          name: profile.name || 'Dr. Sarah Johnson',
          email: profile.email || 'sarah.johnson@hospital.com',
        }
      },
    },
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, account, profile, user }) {
      if (account) {
        token.accessToken = account.access_token
      }
      if (profile) {
        token.name = profile.name
        token.email = profile.email
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
