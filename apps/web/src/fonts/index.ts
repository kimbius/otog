import { Anuphan, Inter } from 'next/font/google'
import localFont from 'next/font/local'

export const inter = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-inter',
})

export const anuphan = Anuphan({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-anuphan',
})

export const sukhumvit = localFont({
  src: [
    {
      weight: '500',
      style: 'normal',
      path: './SukhumvitSet-Medium.ttf',
    },
    {
      weight: '600',
      style: 'normal',
      path: './SukhumvitSet-SemiBold.ttf',
    },
    {
      weight: '700',
      style: 'normal',
      path: './SukhumvitSet-Bold.ttf',
    },
  ],
  variable: '--font-sukhumvit',
})
