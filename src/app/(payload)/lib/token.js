// import * as jose from "jose";

// const ISSUER_URL = `https://oidc.vercel.com/hossamelsahafys-projects`;
// const JWKS_URL = `${ISSUER_URL}/.well-known/jwks`;

// export const verifyToken = async (token) => {
//   const JWKS = jose.createRemoteJWKSet(new URL(JWKS_URL));
//   try {
//     const { payload } = await jose.jwtVerify(token, JWKS, {
//       issuer: ISSUER_URL,
//       audience: `https://vercel.com/hossamelsahafys-projects`,
//       subject:
//         "owner:hossamelsahafys-projects:project:giga-byte:environment:production",
//     });
//     return payload;
//   } catch (error) {
//     throw new Error("Unauthorized");
//   }
// };
