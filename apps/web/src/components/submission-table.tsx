import { useEffect } from 'react'

import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useIntersectionObserver } from '@uidotdev/usehooks'
import dayjs from 'dayjs'
import NextLink from 'next/link'

import { SubmissionSchema } from '@otog/contract'
import { SubmissionStatus } from '@otog/database'
import { Link, Spinner, TableCell, TableFooter, TableRow } from '@otog/ui'

import { SubmissionStatusButton } from './submission-status'
import { TableComponent } from './table-component'
import { UserAvatar } from './user-avatar'

export const SubmissionTable = ({
  data,
  isLoading,
  isError,
  loadMore,
}: {
  data: Array<SubmissionSchema>
  isLoading: boolean
  isError: boolean
  loadMore: () => void
}) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: '0px',
  })
  const isIntersecting = entry?.isIntersecting
  useEffect(() => {
    if (isIntersecting) {
      loadMore()
    }
  }, [isIntersecting])
  return (
    <TableComponent
      table={table}
      isLoading={isLoading}
      isError={isError}
      footer={
        !isLoading && (
          <TableFooter className="bg-inherit" ref={ref}>
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="align-middle text-center"
              >
                <Spinner />
              </TableCell>
            </TableRow>
          </TableFooter>
        )
      }
    />
  )
}

const columnHelper = createColumnHelper<SubmissionSchema>()
const columns = [
  columnHelper.accessor('creationDate', {
    header: 'ส่งเมื่อ',
    cell: ({ getValue }) => dayjs(getValue()).format('DD/MM/BB HH:mm'),
    enableSorting: false,
    meta: {
      headClassName: '',
      cellClassName: 'text-muted-foreground tabular-nums',
    },
  }),
  columnHelper.accessor('user.showName', {
    header: 'ชื่อ',
    cell: ({ getValue, row }) => (
      <Link asChild variant="hidden" className="inline-flex gap-2 items-center">
        <NextLink href={`/user/${row.original.user!.id}`}>
          <UserAvatar user={row.original.user!} />
          {getValue()}
        </NextLink>
      </Link>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor('problem.name', {
    header: 'โจทย์',
    cell: ({ getValue, row }) => (
      <Link href={`/api/problem/${row.original.problem!.id}`} isExternal>
        {getValue()}
      </Link>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor('result', {
    header: 'ผลลัพธ์',
    cell: ({ getValue, row }) => {
      if (
        row.original.status === SubmissionStatus.waiting ||
        row.original.status === SubmissionStatus.grading
      ) {
        return (
          <div className="inline-flex gap-2 items-center">
            <Spinner size="sm" />
            {getValue()}
          </div>
        )
      }
      return (
        <code className="font-mono line-clamp-3 text-pretty">{getValue()}</code>
      )
    },
    enableSorting: false,
    meta: {
      cellClassName: 'max-w-[200px] whitespace-pre-wrap',
    },
  }),
  columnHelper.accessor('timeUsed', {
    header: 'เวลารวม (วินาที)',
    cell: ({ getValue }) => {
      return ((getValue() ?? 0) / 1000).toFixed(3)
    },
    enableSorting: false,
    meta: {
      headClassName: 'text-end',
      cellClassName: 'text-end tabular-nums',
    },
  }),

  columnHelper.accessor('status', {
    header: 'สถานะ',
    cell: ({ row }) => {
      return <SubmissionStatusButton submission={row.original} />
    },
    enableSorting: false,
    meta: {
      headClassName: 'text-center',
      cellClassName: 'text-center',
    },
  }),
]
