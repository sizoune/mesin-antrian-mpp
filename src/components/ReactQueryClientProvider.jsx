'use client'

import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {useState} from 'react'

const queryClient = new QueryClient();

export const ReactQueryClientProvider = ({children}) => <QueryClientProvider
    client={queryClient}>{children}</QueryClientProvider>
