import { useDispatch, useSelector, useStore } from 'react-redux'
import type { AppDispatch, AppStore, RootState } from './store'

// eslint-disable-next-line @typescript-eslint/no-restricted-imports
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()

// eslint-disable-next-line @typescript-eslint/no-restricted-imports
export const useAppSelector = useSelector.withTypes<RootState>()

export const useAppStore = useStore.withTypes<AppStore>()
