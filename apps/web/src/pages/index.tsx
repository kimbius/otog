import Head from 'next/head'
import Image from 'next/image'
import NextLink from 'next/link'

import { Button } from '@otog/ui'

import ComputerImage from '../../public/computer.svg'
import { ModeToggle } from '../components/theme-provider'

export default function HomePage() {
  return (
    <main className="container flex justify-center items-center flex-1">
      <Head>
        <title>One Tambon One Grader</title>
      </Head>
      <section className="flex flex-col gap-6">
        <h1 className="font-heading text-5xl lg:text-7xl font-bold tracking-tight text-balance lg:text-center">
          Become a god of Competitive Programming
        </h1>
        <p className="text-md lg:text-xl text-left lg:text-center text-muted-foreground">
          Code and create algorithms efficiently.
        </p>
        <div className="flex gap-4 lg:justify-center">
          <Button className="w-[100px]" asChild>
            <NextLink href="/register">Sign Up</NextLink>
          </Button>
          <Button className="w-[100px]" variant="outline" asChild>
            <NextLink href="/login">Sign in</NextLink>
          </Button>
          <ModeToggle />
        </div>
        <div className="flex items-center justify-center pt-10">
          <Image src={ComputerImage} alt="computer image" />
        </div>
      </section>
    </main>
  )
}

// export const getServerSideProps = withSession(async (session) => {
//   if (OFFLINE_MODE) {
//     return {
//       redirect: {
//         permanent: false,
//         destination: '/login',
//       },
//     }
//   }
//   if (session) {
//     return {
//       redirect: {
//         permanent: false,
//         destination: '/problem',
//       },
//     }
//   }
//   return { props: {} }
// })
