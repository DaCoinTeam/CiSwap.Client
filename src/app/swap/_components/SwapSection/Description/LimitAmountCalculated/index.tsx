import { LabelWithTooltip } from "@app/_shared"
import React, { useContext, useEffect, useRef, useState } from "react"
import { SwapContext, FormikContext, SLIPPAGE_DEFAULT } from "../../../../_hooks"
import { format, math } from "@utils"

const LimitAmountCalculated = () => {
    const { swapState } = useContext(SwapContext)!
    const formik = useContext(FormikContext)!

    const [amountInRawTemp, setAmountInRawTemp] = useState(BigInt(0))
    const [amountOutRawTemp, setAmountOutRawTemp] = useState(BigInt(0))

    useEffect(() => {
        setAmountInRawTemp(formik.values.amountInRaw)
        setAmountOutRawTemp(formik.values.amountOutRaw)
    }, [])

    const [limitAmountCalculated, setLimitAmountCalculated] = useState(0)

    const limitAmountCalculatedHasMountedRef = useRef(false)
    useEffect(() => {
        if (!limitAmountCalculatedHasMountedRef.current) {
            limitAmountCalculatedHasMountedRef.current = true
        }

        if (!swapState.status.finishLoadBeforeConnectWallet) return

        if (
            formik.values.amountInRaw === amountInRawTemp ||
      formik.values.amountOutRaw === amountOutRawTemp
        )
            return
        
        const amount = formik.values.exactInput ?  formik.values.amountOutRaw : formik.values.amountInRaw

        const limitAmountCalculated = math.blockchain.computeSlippaged(
            amount,
            format.parseStringToNumber(formik.values.slippage, SLIPPAGE_DEFAULT),
            formik.values.exactInput
        )


        setLimitAmountCalculated(
            math.blockchain.computeRedenomination(
                limitAmountCalculated,
                swapState.infoOut.decimals
            )
        )

        setAmountInRawTemp(formik.values.amountInRaw)
        setAmountOutRawTemp(formik.values.amountOutRaw)
    }, [
        formik.values.amountInRaw,
        formik.values.amountOutRaw,
        swapState.status.finishLoadBeforeConnectWallet
    ])

    return (
        <div className="flex justify-between items-center">
            { formik.values.exactInput 
                ?
                <LabelWithTooltip text="Minimun received" tooltipContent="AAA" />
                :    <LabelWithTooltip text="Maximun spend" tooltipContent="AAA" />
            }
         
            <div className="text-sm"> {limitAmountCalculated} </div>
        </div>
    )
}

export default LimitAmountCalculated
