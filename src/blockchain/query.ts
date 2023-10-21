import web3, {
    HexString,
    Address,
    Transaction,
    TransactionReceipt,
} from "web3"
import { calculateRedenomination } from "@utils"
import { ChainName } from "./config"
import { LiquidityPoolContract, getHttpWeb3 } from "./contracts"
import { decode } from "punycode"

export enum TransactionMethod {
  None = "None",
  Deploy = "Deploy",
  RegisterProvider = "Register Provider",
  Swap = "Swap",
  Deposit = "Deposit",
  Withdraw = "Withdraw",
}

export interface RenderTransaction {
  transactionHash: HexString;
  tokenIn: string;
  tokenOut: string;
  method: TransactionMethod;
  account: Address;
}

export const parseTransaction = async (
    transactionHash: HexString,
    chainName: ChainName,

    token0Symbol: string,
    token1Symbol: string,
    LPTokenSymbol: string,

    token0Decimals: number,
    token1Decimals: number,
    LPTokenDecimals: number

): Promise<RenderTransaction> => {
    const web3 = getHttpWeb3(chainName)

    const transaction = await web3.eth.getTransaction(transactionHash)
    const receipt = await web3.eth.getTransactionReceipt(transactionHash)

    const logs = receipt.logs

    const account = transaction.from as Address

    const input = transaction.input?.toString() as string

    const methodSig = input.slice(0, 10)

    const method = signatures[methodSig] ?? TransactionMethod.None

    let tokenIn: string = ""
    let tokenOut: string = ""

    let _isBuyAction: boolean
    switch (method) {

    case TransactionMethod.Swap:
        for (const log of logs) {
            const topics = log.topics
            if (topics == undefined) continue
            const topic = topics[0].toString()

            if (topic != SWAP_METHOD_TOPIC) continue

            const data = log.data?.toString() as string

            const params = web3.eth.abi.decodeParameters(
                ["uint256", "uint256", "uint256", "uint256"],
                data
            )

            _isBuyAction = (params[0] as bigint) == BigInt(0)

            const _tokenInAmount = calculateRedenomination(
                _isBuyAction ? (params[2] as bigint) : (params[0] as bigint),
                _isBuyAction ? token1Decimals : token0Decimals,
                3
            )
            const _tokenOutAmount = calculateRedenomination(
                _isBuyAction ? (params[1] as bigint) : (params[3] as bigint),
                _isBuyAction ? token0Decimals : token0Decimals,
                3
            )

            tokenIn = `${_tokenInAmount} ${_isBuyAction ? token1Symbol : token0Symbol }`
            tokenOut = `${_tokenOutAmount} ${_isBuyAction ? token0Symbol : token1Symbol }`

            console.log(params)
            break
        }
        break

    case TransactionMethod.Deploy:
    case TransactionMethod.RegisterProvider:
    default:
        tokenIn = "-"
        tokenOut = "-"
        break
    }

    return {
        transactionHash,
        method,
        tokenIn,
        tokenOut,
        account,
    }
}

export const getMethodSignature = (
    funcName: string,
    paramTypes: string[]
): string => {
    try {
        const signature = `${funcName}(${paramTypes.join(",")})`
        const hash = web3.utils.sha3(signature)?.substring(0, 10) ?? ""
        return hash
    } catch (ex) {
        console.log(ex)
        return ""
    }
}

export const getMethodTopic = (
    eventName: string,
    eventParamTypes: string[]
): string => {
    try {
        const signature = `${eventName}(${eventParamTypes.join(",")})`
        const topic0 = web3.utils.keccak256(signature)
        return topic0
    } catch (ex) {
        console.error(ex)
        return ""
    }
}

export const DEPLOY_METHOD_SIG = "0x6c9e1d22"

export const REGISTER_PROVIDER_METHOD_SIG = getMethodSignature(
    "registerProvider",
    []
)

export const SWAP_METHOD_SIG = getMethodSignature("swap", [
    "uint256",
    "uint256",
    "bool",
])

export const DEPOSIT_METHOD_SIG = getMethodSignature("deposit", [
    "uint256",
    "uint256",
])
export const WITHDRAW_METHOD_SIG = getMethodSignature("withdraw", ["uint256"])

export const signatures: Record<string, TransactionMethod> = {
    [DEPLOY_METHOD_SIG]: TransactionMethod.Deploy,
    [REGISTER_PROVIDER_METHOD_SIG]: TransactionMethod.RegisterProvider,
    [SWAP_METHOD_SIG]: TransactionMethod.Swap,
    [DEPOSIT_METHOD_SIG]: TransactionMethod.Deposit,
    [WITHDRAW_METHOD_SIG]: TransactionMethod.Withdraw,
}

export const SWAP_METHOD_TOPIC = getMethodTopic("Swap", [
    "address",
    "uint256",
    "uint256",
    "uint256",
    "uint256",
    "address",
])
