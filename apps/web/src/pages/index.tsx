import Head from 'next/head'
import Image from 'next/image'
import NextLink from 'next/link'

import { Button } from '@otog/ui'

import ComputerImage from '../../public/computer.svg'
import { withSession } from '../api/withSession'
import { AnnouncementComponent } from '../components/announcement'
import { useUserContext } from '../context/user-context'
import { environment } from '../env'

export default function HomePage() {
  const { isAuthenticated } = useUserContext()
  if (isAuthenticated) {
    return (
      <main className="container flex flex-1 lg:max-w-screen-md">
        <Head>
          <title>Problem | OTOG</title>
        </Head>
        <AnnouncementComponent defaultShow={true} />
      </main>
    )
  }
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
        </div>
        <div className="flex items-center justify-center pt-10">
          <Image src={ComputerImage} alt="computer image" />
        </div>
      </section>
    </main>
  )
}

export const getServerSideProps = withSession(async () => {
  if (environment.OFFLINE_MODE) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    }
  }
  return { props: {} }
})
