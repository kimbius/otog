import { CodeBracketIcon } from '@heroicons/react/24/solid'
import Head from 'next/head'

import { SubmissionWithSourceCodeSchema } from '@otog/contract'
import { Link } from '@otog/ui'

import { querySubmission } from '../../api/query'
import { withSession } from '../../api/with-session'
import { SubmissionDetail } from '../../components/submission-dialog'

interface SubmissionPageProps {
  submission: SubmissionWithSourceCodeSchema
}

export const getServerSideProps = withSession<SubmissionPageProps>(
  async (_session, context) => {
    const submissionId = Number.parseInt(context.query?.submissionId as string)
    if (!Number.isInteger(submissionId)) {
      return { notFound: true }
    }

    const submissionResult =
      await querySubmission.getSubmissionWithSourceCode.query({
        params: { submissionId: submissionId.toString() },
      })
    if (submissionResult.status === 404) {
      return { notFound: true }
    }
    if (submissionResult.status !== 200) {
      throw submissionResult
    }
    return {
      props: {
        submission: submissionResult.body,
      },
    }
  }
)

export default function SubmissionPage(props: SubmissionPageProps) {
  const submission = props.submission

  return (
    <main id="content" className="container max-w-3xl flex-1">
      <Head>
        <title>One Tambon One Grader</title>
      </Head>
      <section className="border rounded-2xl p-6 mt-8">
        <Link
          isExternal
          variant="hidden"
          href={`/api/problem/${submission.problem!.id}`}
          className="text-lg font-heading tracking-tight font-semibold inline-flex gap-2 items-center mb-2"
        >
          <CodeBracketIcon className="size-6" />
          <h1>ข้อ {submission.problem!.name}</h1>
        </Link>
        <SubmissionDetail submission={submission} />
      </section>
    </main>
  )
}
