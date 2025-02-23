import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { connectToDB, doc, folder } from '../../../db'

export default (req, res) => {
  return NextAuth(req, res, {
    session: {
      jwt: true,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
    },
    providers: [
      Providers.GitHub({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
      }),
    ],
    database: process.env.DATABASE_URL,
    pages: {
      signIn: '/signin',
    },
    callbacks: {
      session(session, user) {
        if (user) {
          session.user.id = user.id
        }
        return session
      },
      async jwt(tokenPayload, user, account, profile, isNewUser) {
        const { db } = await connectToDB()

        if (isNewUser) {
          const newFolder = await folder.createFolder(db, {
            createdBy: `${user.id}`,
            name: 'Getting started'
          })

          await doc.createDoc(db, {
            createdBy: `${user.id}`,
            folder: newFolder._id,
            name: 'Start here',
            content: {
              time: 1556098174501,
              blocks: [
                {
                  type: 'header',
                  data: {
                    text: 'Some default content',
                    level: 2
                  },
                },
              ],
              version: '2.12.4',
            },
          })
        }

        if (tokenPayload && user) {
          return { ...tokenPayload, id: `${user.id}` }
        }

        return tokenPayload
      },
    },
  })
}
