import { ChainId } from "@config"
import Web3, { Address } from "web3"
import abi from "./abi"
import { getHttpWeb3 } from "../../providers"

const getPoolContract = (web3: Web3, address: Address) =>
    new web3.eth.Contract(abi, address, web3)

export default class PoolContract {
    private chainId: ChainId
    private address: Address
    private sender?: Address
    private web3?: Web3

    constructor(
        chainId: ChainId,
        address: Address,
        web3?: Web3,
        sender?: Address
    ) {
        this.chainId = chainId
        this.address = address
        this.web3 = web3
        this.sender = sender
    }

    getInstance() {
        const web3 = getHttpWeb3(this.chainId)
        return getPoolContract(web3, this.address)
    }

    async token0() {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getPoolContract(web3, this.address)
            return await contract.methods.token0().call<Address>()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async token1() {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getPoolContract(web3, this.address)
            return await contract.methods.token1().call<Address>()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async indexPool() {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getPoolContract(web3, this.address)
            return Number(await contract.methods.indexPool().call())
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async protocolFees() {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getPoolContract(web3, this.address)
            return await contract.methods.protocolFees().call<[bigint, bigint]>()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async liquidity() {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getPoolContract(web3, this.address)
            return await contract.methods.liquidity().call<bigint>()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async price0X96() {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getPoolContract(web3, this.address)
            return await contract.methods.price0X96().call<bigint>()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async price1X96() {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getPoolContract(web3, this.address)
            return await contract.methods.price1X96().call<bigint>()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }
}
