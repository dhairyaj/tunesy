import spotifyApi, { LOGIN_URL } from "@/lib/spotify"
import NextAuth from "next-auth"
import ApotifyProvider from "next-auth/providers/spotify"

async function refreshAccessToken(token) {
    try {
        spotifyApi.setAccessToken(token.accessToken);
        spotifyApi.setRefreshToken(token.refreshToken);

        const { body: refreshedToken } = await spotifyApi.refreshAccessToken();

        return {
            ...token,
            accessToken: refreshedToken.access_token,
            accessTokenExpires: Date.now + refreshedToken.expires_in * 1000,
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken // Replace if new token came back else fall back to old refresh token
        };

    } catch {
        console.log(console.error);

        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        ApotifyProvider({
            clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
            clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
            authorization: LOGIN_URL
        }),
        // ...add more providers here
    ],
    secret: process.env.JWT_SECRET,
    pages: {
        signIn: '/login'
    },
    callbacks: {
        async jwt({ token, account, user }) {
            // initial signin
            if (account && user) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    userName: account.providerAccountId,
                    accessTokenExpires: account.expires_at * 1000 // handling in millisecods
                }
            }

            // Return previous token if the access token has not expired
            if (Date.now() < token.accessTokenExpires) {
                console.log("ACCESS TOKEN IS STILL VALID");
                return token;
            }

            // Access token expires, refresh it
            console.log("ACCESS TOKEN EXPIRED, FETCHING REFRESHED ONE...");
            return await refreshAccessToken(token);
        },

        async session({ session, token }) {
            session.user.accessToken = token.accessToken;
            session.user.refreshToken = token.refreshToken;
            session.user.userName = token.userName;

            return session;
        }
    },
}
export default NextAuth(authOptions)