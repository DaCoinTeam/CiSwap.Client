"use client"
import { ProvidersProps } from "@app/_shared"
import { RootState } from "@redux"
import React, {
    createContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react"
import useSwapReducer, { SwapAction, SwapState } from "./useSwapReducer.hook"
import { useSelector } from "react-redux"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { chainInfos } from "@config"
import { ERC20Contract } from "@blockchain"
import { math } from "@utils"
import { getTokenApi } from "@services"

interface SwapContext {
  swapState: SwapState;
  swapDispatch: React.Dispatch<SwapAction>;
  actions: {
    handleReverse: () => Promise<void>;
  };
  updaters: {
    initialize: () => void;
    loadBeforeConnectWallet: () => Promise<void>;
    loadAfterConnectWallet: () => Promise<void>;
  };
}

export const SwapContext = createContext<SwapContext | null>(null)

const SwapProviders = (props: ProvidersProps) => {
    const chainId = useSelector((state: RootState) => state.blockchain.chainId)
    const account = useSelector((state: RootState) => state.blockchain.account)

    const [swapState, swapDispatch] = useSwapReducer()
    const router = useRouter()
    const path = usePathname()
    const searchParams = useSearchParams()

    const getTokenPair = () => {
        const tokenIn =
      searchParams.get("tokenIn") ?? chainInfos[chainId].stableTokens[0]

        const tokenOut =
      searchParams.get("tokenOut") ?? chainInfos[chainId].exchangeToken

        return {
            tokenIn,
            tokenOut,
        }
    }

    const [preventBefore, setPreventBefore] = useState(false)

    const handleReverse = async () => {
        const { tokenIn, tokenOut } = getTokenPair()
        const params = new URLSearchParams(searchParams)
        params.set("tokenIn", tokenOut)
        params.set("tokenOut", tokenIn)
        router.push(`${path}?${params.toString()}`)

        const { infoIn, infoOut } = swapState

        swapDispatch({
            type: "SET_INFO_OUT",
            payload: infoIn,
        })

        swapDispatch({
            type: "SET_INFO_IN",
            payload: infoOut,
        })

        setPreventBefore(true)
    }

    const actions = useMemo(() => (
        { handleReverse }
    ), [handleReverse])

    const initialize = () => {
        const tokenIn =
      searchParams.get("tokenIn") ?? chainInfos[chainId].stableTokens[0]

        swapDispatch({
            type: "SET_TOKEN_IN",
            payload: tokenIn,
        })
        const tokenOut =
      searchParams.get("tokenOut") ?? chainInfos[chainId].exchangeToken

        swapDispatch({
            type: "SET_TOKEN_OUT",
            payload: tokenOut,
        })

        swapDispatch({
            type: "SET_FINISH_INITIALIZE",
            payload: true,
        })
        console.log("hentai")
    }

    useEffect(() => {
        initialize()
    }, [])

    const loadBeforeConnectWallet = async () => {
        const updateInfoIn = async () => {
            const tokenInContract = new ERC20Contract(
                chainId,
                swapState.infoIn.address
            )

            const decimalsIn = await tokenInContract.decimals()
            if (decimalsIn === null) return
            swapDispatch({ type: "SET_DECIMALS_IN", payload: decimalsIn })

            const promises: Promise<void>[] = []

            const additionalInPromise = async () => {
                const additionalIn = await getTokenApi(
                    swapState.infoIn.address,
                    chainId
                )
                if (additionalIn === null) return
            }
            promises.push(additionalInPromise())

            const symbolInPromise = async () => {
                const symbolIn = await tokenInContract.symbol()
                if (!symbolIn) return
                swapDispatch({ type: "SET_SYMBOL_IN", payload: symbolIn })
            }
            promises.push(symbolInPromise())

            await Promise.all(promises)
        }

        const updateInfoOut = async () => {
            const tokenOutContract = new ERC20Contract(
                chainId,
                swapState.infoOut.address
            )

            const decimalsOut = await tokenOutContract.decimals()
            if (decimalsOut === null) return
            swapDispatch({
                type: "SET_DECIMALS_OUT",
                payload: decimalsOut,
            })

            const promises: Promise<void>[] = []

            const additionalOutPromise = async () => {
                const additionalOut = await getTokenApi(
                    swapState.infoIn.address,
                    chainId
                )
                if (additionalOut === null) return
            }
            promises.push(additionalOutPromise())

            const symbolOutPromise = async () => {
                const symbolOut = await tokenOutContract.symbol()
                if (symbolOut === null) return
                swapDispatch({ type: "SET_SYMBOL_OUT", payload: symbolOut })
            }
            promises.push(symbolOutPromise())

            await Promise.all(promises)
        }

        const promises: Promise<void>[] = []
        promises.push(updateInfoIn())
        promises.push(updateInfoOut())
        await Promise.all(promises)

        swapDispatch({
            type: "SET_FINISH_LOAD_BEFORE_CONNECT_WALLET",
            payload: true,
        })
    }

    const beforeHasMountedRef = useRef(true)
    useEffect(() => {
        if (beforeHasMountedRef.current) {
            beforeHasMountedRef.current = false
            return
        }
        if (!swapState.status.finishInitialize) return
        if (preventBefore) {
            setPreventBefore(false)
            return
        }

        loadBeforeConnectWallet()
    }, [swapState.status.finishInitialize])

    const loadAfterConnectWallet = async () => {
        if (!account) {
            swapDispatch({
                type: "SET_FINISH_LOAD_AFTER_CONNECT_WALLET",
                payload: false,
            })
            return
        }

        const tokenInContract = new ERC20Contract(
            chainId,
            swapState.infoIn.address
        )
        const tokenOutContract = new ERC20Contract(
            chainId,
            swapState.infoOut.address
        )

        const promises: Promise<void>[] = []

        const balanceInPromise = async () => {
            const balanceIn = await tokenInContract.balanceOf(account)
            console.log(balanceIn)
            if (balanceIn === null) return
            swapDispatch({
                type: "SET_BALANCE_IN",
                payload: math.blockchain.computeRedenomination(
                    balanceIn,
                    swapState.infoIn.decimals,
                    3
                ),
            })
        }
        promises.push(balanceInPromise())

        const balanceOutPromise = async () => {
            const balanceOut = await tokenOutContract.balanceOf(account)
            if (balanceOut === null) return
            swapDispatch({
                type: "SET_BALANCE_OUT",
                payload: math.blockchain.computeRedenomination(
                    balanceOut,
                    swapState.infoOut.decimals,
                    3
                ),
            })
        }
        promises.push(balanceOutPromise())
        await Promise.all(promises)

        swapDispatch({
            type: "SET_FINISH_LOAD_AFTER_CONNECT_WALLET",
            payload: true,
        })
    }

    const afterHasMountedRef = useRef(true)
    useEffect(() => {
        if (!afterHasMountedRef.current) {
            afterHasMountedRef.current = false
            return
        }
        loadAfterConnectWallet()
    }, [account, swapState.status.finishLoadAfterConnectWallet])

    const updaters = useMemo(() => {
        return {
            initialize,
            loadBeforeConnectWallet,
            loadAfterConnectWallet,
        }
    }, [initialize, loadBeforeConnectWallet, loadAfterConnectWallet])

    const swapContext = useMemo(() => {
        return {
            swapState,
            swapDispatch,
            actions,
            updaters,
        }
    }, [swapState, swapDispatch, actions, updaters])
    return (
        <SwapContext.Provider value={swapContext}>
            {props.children}
        </SwapContext.Provider>
    )
}
export default SwapProviders
