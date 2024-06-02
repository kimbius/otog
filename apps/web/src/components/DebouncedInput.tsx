import { useEffect, useState } from 'react'

import { useDebounce } from '@uidotdev/usehooks'

import { Input, InputProps } from '@otog/ui'

import { useEffectEvent } from '../hooks/useEffectEvent'

export interface DebouncedInputProps extends InputProps {
  onDebounce: (value: string) => void
}
export const DebouncedInput = ({
  onDebounce,
  ...props
}: DebouncedInputProps) => {
  const [input, setInput] = useState('')
  const onValueChange = useEffectEvent(onDebounce)
  const debouncedInput = useDebounce(input, 300)
  useEffect(() => {
    onValueChange(debouncedInput)
  }, [debouncedInput])
  return <Input {...props} onChange={(e) => setInput(e.target.value)} />
}
