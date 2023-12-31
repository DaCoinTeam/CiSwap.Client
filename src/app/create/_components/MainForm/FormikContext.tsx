import { Form, Formik, FormikProps } from "formik"
import React, { ReactNode, createContext, useContext } from "react"
import { Address } from "web3"
import * as Yup from "yup"
import { ERC20Contract, FactoryContract } from "@blockchain"
import { chainInfos } from "@config"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import utils from "@utils"
import { MetamaskContext } from "@app/_hooks"
import { ContextProps } from "@app/_shared"

interface FormikValues {
  tokenA: Address;
  tokenB: Address;
  symbolA: string;
  symbolB: string;
  zeroForOne: boolean;
  amountA: string;
  amountB: string;
  balanceA: number;
  balanceB: number;
  decimalsA: number;
  decimalsB: number;
  priceABase: string;
  priceAMax: string;
  feeKey: number;
  fee: number;
}

const initialValues: FormikValues = {
    tokenA: "",
    tokenB: "",
    symbolA: "",
    symbolB: "",
    zeroForOne: true,
    amountA: "",
    amountB: "",
    balanceA: 0,
    balanceB: 0,
    decimalsA: 0,
    decimalsB: 0,
    priceABase: "",
    priceAMax: "",
    feeKey: 0,
    fee: 0.0025,
}

export const FormikContext =
  createContext<FormikProps<FormikValues> | null>(null)

const renderBody = (
    props: FormikProps<FormikValues> | null,
    chidren: ReactNode
) => (
    <FormikContext.Provider value={props}>
        <Form onSubmit={props?.handleSubmit}>{chidren}</Form>
    </FormikContext.Provider>
)

const FormikProviders = (props: ContextProps) => {
    const metamaskContext = useContext(MetamaskContext)
    if (metamaskContext === null) return
    const { web3State } = metamaskContext
    const { web3 } = web3State

    const chainId = useSelector((state: RootState) => state.blockchain.chainId)
    const account = useSelector((state: RootState) => state.blockchain.account)

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
                tokenA: Yup.string().required(),
                tokenB: Yup.string().required(),
                isToken0Sell: Yup.boolean(),
                amountA: Yup.number().max(
                    Yup.ref("balanceA"),
                    "Input must not exceed your available balance"
                ),
                amountB: Yup.number().max(
                    Yup.ref("balanceB"),
                    "Input must not exceed your available balance"
                ),
                priceABase: Yup.number().max(
                    Yup.ref("priceAMax"),
                    "Base price must be less than or equal to max price"
                ),
            })}
            onSubmit={async (values) => {
                if (web3 === null) return

                const tokenAContract = new ERC20Contract(
                    chainId,
                    values.tokenA,
                    web3,
                    account
                )
                const tokenBContract = new ERC20Contract(
                    chainId,
                    values.tokenB,
                    web3,
                    account
                )
                
                const factory = chainInfos[chainId].factory
                const factoryContract = new FactoryContract(
                    chainId,
                    factory,
                    web3,
                    account
                )

                const amountARaw = utils.math.computeRaw(
                    utils.format.parseStringToNumber(values.amountA),
                    values.decimalsA
                )

                const amountBRaw = utils.math.computeRaw(
                    utils.format.parseStringToNumber(values.amountB),
                    values.decimalsB
                )

                const priceABaseX96 = utils.math.computeMultiplyX96(
                    utils.format.parseStringToNumber(values.priceABase)
                )
                const priceAMaxX96 = utils.math.computeMultiplyX96(utils.format.parseStringToNumber(values.priceAMax))

                const allowanceA = await tokenAContract.allowance(account, factory)

                if (allowanceA === null) return
                if (allowanceA < amountARaw) {
                    const approveAReceipt = await tokenAContract.approve(
                        factory,
                        amountARaw
                    )
                    if (!approveAReceipt) return
                }

                const allowanceB = await tokenBContract.allowance(account, factory)
                if (allowanceB === null) return

                if (allowanceB < amountBRaw) {
                    const approveBReceipt = await tokenBContract.approve(
                        factory,
                        amountBRaw
                    )
                    if (!approveBReceipt) return
                }

                const _tokenA = values.zeroForOne ? values.tokenA : values.tokenB
                const _tokenB = values.zeroForOne ? values.tokenB : values.tokenA

                const _amountA = values.zeroForOne
                    ? amountARaw
                    : amountBRaw
                const _amountB = values.zeroForOne
                    ? amountBRaw
                    : amountARaw

                const createPoolReceipt = await factoryContract.createPool({
                    fee: values.fee *  utils.math.computeExponent(5),
                    config: {
                        tokenA: _tokenA,
                        tokenB: _tokenB,
                        amountA: _amountA,
                        amountB: _amountB,
                        priceABaseX96: priceABaseX96,
                        priceAMaxX96: priceAMaxX96,
                    },
                })
                console.log(createPoolReceipt)
            }}
        >
            {(_props) => renderBody(_props, props.children)}
        </Formik>
    )
}

export default FormikProviders
