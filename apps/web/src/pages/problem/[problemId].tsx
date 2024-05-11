import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

import { PencilSquareIcon } from '@heroicons/react/24/solid'
import { zodResolver } from '@hookform/resolvers/zod'
import Editor from '@monaco-editor/react'
import { editor } from 'monaco-editor'
import { useTheme } from 'next-themes'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { z } from 'zod'

import { SubmissionWithSourceCodeSchema } from '@otog/contract'
import { Problem } from '@otog/database'
import {
  Button,
  Form,
  FormField,
  Link,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@otog/ui'

import { queryProblem, querySubmission } from '../../api/query'
import { withSession } from '../../api/withSession'
import { Language, LanguageName } from '../../enums'

interface WriteSolutionPageProps {
  submission: SubmissionWithSourceCodeSchema | null
  problem: Problem
}

export const getServerSideProps = withSession<WriteSolutionPageProps>(
  async (_session, context) => {
    const problemId = Number.parseInt(context.query.problemId as string)
    const submissionId = Number.parseInt(context.params?.submissionId as string)
    if (!Number.isInteger(problemId)) {
      return { notFound: true }
    }
    const problemResult = await queryProblem.getProblem.query({
      params: { problemId: problemId.toString() },
    })
    if (problemResult.status === 404) {
      return { notFound: true }
    }
    if (problemResult.status !== 200) {
      throw problemResult
    }
    if (Number.isInteger(submissionId)) {
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
          problem: problemResult.body,
        },
      }
    }
    const submissionResult =
      await querySubmission.getLatestSubmissionByProblemId.query({
        params: { problemId: problemId.toString() },
      })
    if (submissionResult.status === 404) {
      return { notFound: true }
    }
    if (submissionResult.status !== 200) {
      throw submissionResult
    }
    return {
      props: {
        submission: submissionResult.body.submission,
        problem: problemResult.body,
      },
    }
  }
)

const DEFAULT_SOURCE_CODE = `#include <iostream>

using namespace std;

int main() {
    return 0;
}`

export default function WriteSolutionPage(props: WriteSolutionPageProps) {
  const problem = props.problem
  return (
    <main className="container max-w-4xl ">
      <Head>
        <title>One Tambon One Grader</title>
      </Head>
      <section className="flex flex-col flex-1 gap-4 mt-8 py-6 px-6 border rounded-2xl">
        <div>
          <h1 className="text-2xl font-semibold inline-flex gap-2 items-center mb-2">
            <PencilSquareIcon className="size-6" />
            {problem.name}
          </h1>
          <div className="flex justify-between gap-1">
            <p className="text-sm text-muted-foreground">
              {/* TODO: fix nullish */}(
              {problem.timeLimit ? problem.timeLimit / 1000 : '-'} วินาที{' '}
              {problem.memoryLimit} MB)
            </p>
            <Link
              className="text-sm"
              isExternal
              href={`/api/problem/${problem.id}`}
            >
              [ดาวน์โหลด]
            </Link>
          </div>
        </div>
        <CodeEditorForm {...props} />
      </section>
    </main>
  )
}

const CodeEditorFormSchema = z.object({
  // sourceCode: z.string(),
  language: z.nativeEnum(Language),
})
type CodeEditorFormSchema = z.infer<typeof CodeEditorFormSchema>

function CodeEditorForm(props: WriteSolutionPageProps) {
  const { resolvedTheme } = useTheme()

  const formRef = useRef<HTMLFormElement>(null)
  const form = useForm<CodeEditorFormSchema>({
    defaultValues: { language: 'cpp' },
    resolver: zodResolver(CodeEditorFormSchema),
  })

  const editorRef = useRef<editor.IStandaloneCodeEditor>()
  const router = useRouter()
  const uploadFile = querySubmission.uploadFile.useMutation({})
  const onSubmit = form.handleSubmit(async (values) => {
    if (!editorRef.current) {
      toast.error(`ไม่พบ VS Code ใน Browser`)
      return
    }
    const toastId = toast.loading(`กำลังส่งข้อ ${props.problem.name}...`)
    const value = editorRef.current.getValue()
    const blob = new Blob([value])
    const file = new File([blob], `${props.problem.id}.${values.language}`)
    await uploadFile.mutateAsync(
      {
        params: { problemId: props.problem.id.toString() },
        body: {
          sourceCode: file,
          language: values.language,
        },
      },
      {
        onError: (result) => {
          console.error(result)
          toast.error('ส่งไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', { id: toastId })
        },
        onSuccess: () => {
          toast.success('ส่งสำเร็จแล้ว', { id: toastId })
          router.push('/submission')
        },
      }
    )
  }, console.error)

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={onSubmit}>
        <Editor
          height="90vh"
          className="overflow-hidden rounded-md border"
          theme={resolvedTheme === 'light' ? 'vs-light' : 'vs-dark'}
          defaultValue={props.submission?.sourceCode ?? DEFAULT_SOURCE_CODE}
          language={form.watch('language')}
          onMount={(editor) => (editorRef.current = editor)}
        />

        <div className="grid grid-cols-3 mt-4">
          <FormField
            control={form.control}
            name="language"
            defaultValue={Language.cpp}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(LanguageName).map(([value, label]) => (
                    <SelectItem value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <Button type="submit" className="col-start-3">
            ส่ง
          </Button>
        </div>
      </form>
    </Form>
  )
}
