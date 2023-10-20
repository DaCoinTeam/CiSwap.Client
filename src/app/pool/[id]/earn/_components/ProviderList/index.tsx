"use client"
import React, { useContext, useEffect, useMemo, useState } from "react"
import {
    Card,
    CardBody,
    Pagination,
    Spacer,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@nextui-org/react"
import { LiquidityPoolContract } from "@blockchain"
import { RootState } from "@redux"
import { useSelector } from "react-redux"
import { PoolAddressContext, TokenStateContext } from "@app/pool/[id]/layout"
import { Address } from "web3"
import { calculateRedenomination } from "@utils"
import { ViewOnExplorer } from "@app/_shared"

interface ProviderListProps {
  className?: string;
}

const ProviderList = (props: ProviderListProps) => {
    const poolAddress = useContext(PoolAddressContext)

    const tokenState = useContext(TokenStateContext)
    if (tokenState == null) return

    const chainName = useSelector(
        (state: RootState) => state.blockchain.chainName
    )

    const [providers, setProviders] = useState<Provider[]>([])

    useEffect(() => {
        if (!tokenState.finishLoadWithoutConnected) return

        const handleEffect = async () => {
            const contract = new LiquidityPoolContract(chainName, poolAddress)
            const addresses = await contract.providerRegisters()
            if (addresses == null) return

            const _providers: Provider[] = []
            for (const address of addresses) {
                const balance = await contract.balanceOf(address)
                if (balance == null) return
                const _provider = {
                    address,
                    balance: calculateRedenomination(
                        balance,
                        tokenState.LPTokenDecimals,
                        3
                    ),
                }
                _providers.push(_provider)
            }
            setProviders(_providers)
        }
        handleEffect()
    }, [tokenState.finishLoadWithoutConnected])

    console.log(providers)

    const [page, setPage] = React.useState(1)
    const rowsPerPage = 6

    const pages = providers.length ? Math.ceil(providers.length / rowsPerPage) : 1

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage
        const end = start + rowsPerPage

        return providers.slice(start, end)
    }, [page, providers])

    return (
        <div className={`${props.className}`}>
            <div className="text-2xl font-bold"> Providers </div>
            <Spacer y={4}/>
            <Card>
                <CardBody className="flex flex-cols justify-between">
                    <Table
                        removeWrapper
                        aria-label="Example table with client side pagination"
                        bottomContent={
                            <div className="flex w-full justify-center">
                                <Pagination
                                    isCompact
                                    showControls
                                    showShadow
                                    color="secondary"
                                    page={page}
                                    total={pages}
                                    onChange={(page) => setPage(page)}
                                />
                            </div>
                        }
                        classNames={{
                            wrapper: "min-h-[222px]",
                        }}
                    >
                        <TableHeader>
                            <TableColumn key="address" width={"60%"}>Address</TableColumn>
                            <TableColumn key="balance" width={"40%"}>
                            Balance
                            </TableColumn>
                        </TableHeader>
                        <TableBody items={items} emptyContent={"No rows to display."}>
                            {(item) => (
                                <TableRow key={item.address}>
                                    <TableCell key="address">
                                        <ViewOnExplorer hexString={item.address} showShorten />
                                    </TableCell>
                                    <TableCell key="balance">{item.balance} {tokenState.LPTokenSymbol}</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>
        </div>
    )
}

export default ProviderList

interface Provider {
  address: Address;
  balance: number;
}