"use client"
import { Card, CardBody, Spacer } from "@nextui-org/react"
import React, { useContext } from "react"
import { TitleDisplay } from "@app/_shared"
import { FormikPropsContext } from "../FormikPropsContext"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import { FinishSelectedPairContext } from "../index"

interface PickFeeProps {
  className?: string;
}

interface Fee {
  key: number;
  label: string;
  value: number;
}

const protocolFees: Fee[] = [
    {
        key: 0,
        label: "0.25%",
        value: 0.0025,
    },
    {
        key: 1,
        label: "0.5%",
        value: 0.005,
    },
    {
        key: 2,
        label: "1%",
        value: 0.01,
    },
    {
        key: 3,
        label: "2.5%",
        value: 0.025,
    },
]

const PickFee = (props: PickFeeProps) => {
    const formik = useContext(FormikPropsContext)
    if (formik === null) return

    const darkMode = useSelector((state: RootState) => state.configuration.darkMode)

    const account = useSelector((state: RootState) => state.blockchain.account)

    const finishSelectedPairContext = useContext(FinishSelectedPairContext)
    if (finishSelectedPairContext === null) return

    const { finishSelectedPair } = finishSelectedPairContext

    const _click = (fee: Fee) => {
        formik.setFieldValue("_feeId", fee.key)
        formik.setFieldValue("fee", fee.value)
    }

    const _renderIfSelected = (key: number) => {
        if (formik.values._feeId === key){
            return `bg-teal-500 ${darkMode ? "text-black" : "text-white"}`
        } else {
            return ""
        }
    }

    const _finishSelectedPair = account != null && finishSelectedPair

    return (
        <div className={props.className}>
            <TitleDisplay title="Pick Fee" />
            <Spacer y={4} />
            <div className="grid grid-cols-4 gap-4">
                {protocolFees.map((fee) => (
                    <Card
                        key={fee.key}
                        onPress={() => _click(fee)}
                        isPressable = {_finishSelectedPair}
                        className={`${_renderIfSelected(fee.key)} glow`}
                    >
                        <CardBody className="p-5">
                            <span className="font-bold text-center">{fee.label}</span>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default PickFee
